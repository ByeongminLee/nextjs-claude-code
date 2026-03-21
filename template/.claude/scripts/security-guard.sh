#!/bin/bash
# PreToolUse hook: blocks dangerous commands before Bash tool execution
# exit 2 → blocks the tool call and shows the message

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/hook-profile.sh"
ncc_profile_allows "security-guard" || exit 0

INPUT_JSON=$(cat)
if command -v jq &>/dev/null; then
  TOOL_NAME=$(echo "$INPUT_JSON" | jq -r '.tool_name // ""' 2>/dev/null)
  COMMAND=$(echo "$INPUT_JSON" | jq -r '.tool_input.command // ""' 2>/dev/null)
elif command -v python3 &>/dev/null; then
  TOOL_NAME=$(echo "$INPUT_JSON" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('tool_name',''))" 2>/dev/null)
  COMMAND=$(echo "$INPUT_JSON" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('tool_input',{}).get('command',''))" 2>/dev/null)
else
  echo "⚠️  [security-guard] Neither jq nor python3 found — cannot parse input"
  exit 2
fi

# Only check Bash tool
[[ "$TOOL_NAME" != "Bash" ]] && exit 0
[[ -z "$COMMAND" ]] && exit 0

# ── Dangerous command patterns ───────────────────────────────────────────────
DANGEROUS_PATTERNS=(
  "rm[[:space:]]+-rf[[:space:]]+/"
  "rm[[:space:]]+-rf[[:space:]]+\*"
  "rm[[:space:]]+-fr[[:space:]]+/"
  "rm[[:space:]]+-fr[[:space:]]+\*"
  ">[[:space:]]*/dev/sda"
  ">[[:space:]]*/dev/disk"
  "DROP[[:space:]]+DATABASE"
  "DROP[[:space:]]+SCHEMA"
  "mkfs\."
  "dd[[:space:]]+if=.*of=/dev/"
)

for pattern in "${DANGEROUS_PATTERNS[@]}"; do
  if echo "$COMMAND" | grep -qiE "$pattern"; then
    echo "🚫 [security-guard] Dangerous command blocked"
    echo "   Pattern matched: $pattern"
    echo "   Command: $(echo "$COMMAND" | head -c 100)"
    echo ""
    echo "   If this is intentional, explain why and ask for explicit confirmation."
    exit 2
  fi
done

# ── Hardcoded secret patterns ────────────────────────────────────────────────
SECRET_PATTERNS=(
  "(API_KEY|SECRET_KEY|PRIVATE_KEY|ACCESS_TOKEN)[[:space:]]*=[[:space:]]*['\"][^'\"]{8,}"
  "-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----"
)

for pattern in "${SECRET_PATTERNS[@]}"; do
  if echo "$COMMAND" | grep -qiE "$pattern"; then
    echo "🚫 [security-guard] Hardcoded secret detected in command"
    echo "   Use environment variables (.env) or a secrets manager instead."
    exit 2
  fi
done

exit 0
