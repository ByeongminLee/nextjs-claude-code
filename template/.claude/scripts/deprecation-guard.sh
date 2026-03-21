#!/usr/bin/env bash
# NCC — PreToolUse hook: blocks deprecated patterns before Write/Edit
# Profile: strict only. Exit 2 blocks the tool call.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/hook-profile.sh"
ncc_profile_allows "deprecation-guard" || exit 0

INPUT_JSON=$(cat)

node -e '
const input = JSON.parse(process.argv[1]);
const toolName = input.tool_name || "";
if (toolName !== "Write" && toolName !== "Edit") process.exit(0);

const fs = require("fs");
const path = require("path");

const filePath = (input.tool_input && input.tool_input.file_path) || "";
if (!filePath) process.exit(0);

// Only check source/config files — skip binary files
const sourceExts = [".ts", ".tsx", ".js", ".jsx", ".mts", ".cts", ".json", ".md", ".mjs", ".cjs"];
if (!sourceExts.some(ext => filePath.endsWith(ext))) process.exit(0);

// Content to check: for Write it is content, for Edit it is new_string
const content = (input.tool_input && (input.tool_input.content || input.tool_input.new_string)) || "";
if (!content) process.exit(0);

// Load deprecation rules
const scriptDir = path.dirname(process.argv[0] || ".");
const rulesLocations = [
  path.join(process.cwd(), ".claude", "scripts", "deprecation-rules.json"),
  path.join(scriptDir, "deprecation-rules.json"),
];

let rules = [];
for (const loc of rulesLocations) {
  try {
    rules = JSON.parse(fs.readFileSync(loc, "utf-8"));
    break;
  } catch (_) {}
}

if (rules.length === 0) process.exit(0);

// Check each rule
for (const rule of rules) {
  // Skip if rule has context requirement and file path does not match
  if (rule.context && !filePath.includes(rule.context)) continue;

  if (content.includes(rule.pattern)) {
    const msg = [
      "\u274c [NCC Deprecation Guard] Blocked deprecated pattern",
      "   File: " + filePath,
      "   Pattern: " + rule.pattern,
      "   " + rule.message,
      "   Replacement: " + (rule.replacement || "See documentation"),
      "",
      "   To override, set NCC_HOOK_PROFILE=standard (disables strict hooks).",
    ].join("\n");
    process.stderr.write(msg + "\n");
    console.log(JSON.stringify({ decision: "block", reason: msg }));
    process.exit(0);
  }
}
' "$INPUT_JSON"
