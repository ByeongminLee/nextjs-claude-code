#!/bin/bash
# PostToolUse hook: validates the result of Write/Edit tool operations
# Advisory only — never blocks (always exit 0)

INPUT_JSON=$(cat)
TOOL_NAME=$(echo "$INPUT_JSON" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('tool_name',''))" 2>/dev/null || echo "")
FILE_PATH=$(echo "$INPUT_JSON" | python3 -c "import sys,json; d=json.load(sys.stdin); inp=d.get('tool_input',{}); print(inp.get('file_path', inp.get('path','')))" 2>/dev/null || echo "")

[[ "$TOOL_NAME" != "Write" && "$TOOL_NAME" != "Edit" ]] && exit 0
[[ -z "$FILE_PATH" ]] && exit 0

# Resolve relative path
if [[ ! "$FILE_PATH" = /* ]]; then
  FILE_PATH="$(pwd)/$FILE_PATH"
fi

# ── 1. File existence check ──────────────────────────────────────────────────
if [[ ! -f "$FILE_PATH" ]]; then
  echo "⚠️  [validate-edit] File not found after edit: $FILE_PATH"
  exit 0
fi

# ── 2. Empty file warning ────────────────────────────────────────────────────
if [[ ! -s "$FILE_PATH" ]]; then
  echo "⚠️  [validate-edit] File is empty after edit: $FILE_PATH"
  echo "   Check if the write operation completed correctly."
  exit 0
fi

# ── 3. JS/TS syntax check ────────────────────────────────────────────────────
if [[ "$FILE_PATH" =~ \.(js|ts|mjs|cjs)$ ]]; then
  if command -v node &>/dev/null; then
    # Use node to check for obvious syntax errors (works for CJS/basic JS)
    SYNTAX_ERROR=$(node --check "$FILE_PATH" 2>&1)
    if [[ $? -ne 0 ]]; then
      echo "⚠️  [validate-edit] Syntax issue detected: $FILE_PATH"
      echo "   $(echo "$SYNTAX_ERROR" | head -3)"
      echo "   Review the file and fix any errors before proceeding."
    fi
  fi
fi

# ── 4. JSON syntax check ─────────────────────────────────────────────────────
if [[ "$FILE_PATH" =~ \.json$ ]]; then
  if command -v python3 &>/dev/null; then
    PARSE_ERROR=$(python3 -m json.tool "$FILE_PATH" > /dev/null 2>&1; echo $?)
    if [[ "$PARSE_ERROR" != "0" ]]; then
      echo "⚠️  [validate-edit] Invalid JSON after edit: $FILE_PATH"
      echo "   Check the JSON syntax before proceeding."
    fi
  fi
fi

exit 0
