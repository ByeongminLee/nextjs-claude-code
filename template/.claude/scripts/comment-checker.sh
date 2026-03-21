#!/usr/bin/env bash
# NCC — PostToolUse hook: warns about excessive AI-generated comments
# Profile: strict only. Advisory (non-blocking).

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/hook-profile.sh"
ncc_profile_allows "comment-checker" || exit 0

INPUT_JSON=$(cat)

node -e '
const input = JSON.parse(process.argv[1]);
const filePath = (input.tool_input && input.tool_input.file_path) || "";
if (!filePath) process.exit(0);

// Only check JS/TS files
const codeExts = [".ts", ".tsx", ".js", ".jsx", ".mts", ".cts"];
if (!codeExts.some(ext => filePath.endsWith(ext))) process.exit(0);

const fs = require("fs");
const path = require("path");

const absPath = path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);
if (!fs.existsSync(absPath)) process.exit(0);

const content = fs.readFileSync(absPath, "utf-8");
const lines = content.split("\n").filter(l => l.trim().length > 0);
if (lines.length < 10) process.exit(0);  // Skip tiny files

// Count comment lines
const commentLines = lines.filter(l => {
  const trimmed = l.trim();
  return trimmed.startsWith("//") || trimmed.startsWith("/*") || trimmed.startsWith("*");
});

const ratio = commentLines.length / lines.length;
if (ratio <= 0.3) process.exit(0);

// Detect AI-style comment patterns
const aiPatterns = [
  /^\/\/\s*(This|These|The)\s+(function|component|hook|module|class|method|variable|constant|type|interface)/i,
  /^\/\/\s*(Import|Define|Initialize|Create|Set up|Handle|Return|Export|Render|Update|Check|Validate|Process|Calculate|Format|Convert|Parse|Fetch|Load|Save|Store|Get|Set)\s/i,
  /^\/\/\s*-{3,}/,  // Separator comments like // ----------
  /^\/\/\s*={3,}/,  // Separator comments like // ==========
];

const aiStyleCount = commentLines.filter(l => {
  const trimmed = l.trim();
  return aiPatterns.some(p => p.test(trimmed));
}).length;

if (aiStyleCount >= 3 || ratio > 0.4) {
  const pct = Math.round(ratio * 100);
  process.stderr.write(
    "\n\u26a0\ufe0f  [NCC Comment Checker] High comment density detected: " + pct + "% (" + commentLines.length + "/" + lines.length + " lines)\n" +
    "   File: " + filePath + "\n" +
    (aiStyleCount > 0 ? "   AI-style comments detected: " + aiStyleCount + " lines\n" : "") +
    "   \u2192 Consider removing obvious comments. Code should be self-documenting.\n" +
    "   \u2192 Only keep comments that explain *why*, not *what*.\n\n"
  );
}
' "$INPUT_JSON"
