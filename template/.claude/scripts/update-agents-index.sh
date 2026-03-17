#!/usr/bin/env bash
# NCC — PostToolUse hook: reminds to update AGENTS.md when source files change
# Advisory only — outputs a reminder, never blocks.

node -e '
const fs = require("fs");
const path = require("path");
const chunks = [];
process.stdin.on("data", (c) => chunks.push(c));
process.stdin.on("end", () => {
  try {
    const input = JSON.parse(Buffer.concat(chunks).toString());
    const filePath = (input.tool_input && input.tool_input.file_path) || "";

    // Skip if no file path
    if (!filePath) return;

    // Skip non-source files
    const sourceExts = [".ts", ".tsx", ".js", ".jsx", ".mts", ".cts"];
    if (!sourceExts.some((ext) => filePath.endsWith(ext))) return;

    // Skip excluded directories
    const skipDirs = ["node_modules/", ".next/", "dist/", ".turbo/", "spec/", ".claude/"];
    if (skipDirs.some((d) => filePath.includes(d))) return;

    // Skip AGENTS.md itself
    if (filePath.endsWith("AGENTS.md")) return;

    const dir = path.dirname(filePath);
    const agentsPath = path.join(dir, "AGENTS.md");
    const fileName = path.basename(filePath);

    // Check if AGENTS.md exists in the same directory
    if (fs.existsSync(agentsPath)) {
      // Check if the file is mentioned in AGENTS.md
      const content = fs.readFileSync(agentsPath, "utf-8");
      if (!content.includes(fileName)) {
        console.log("[AGENTS.md] " + fileName + " is not listed in " + agentsPath + " — consider updating it.");
      }
    } else {
      // Check if directory has 3+ source files (worth creating AGENTS.md)
      try {
        const files = fs.readdirSync(dir).filter((f) =>
          sourceExts.some((ext) => f.endsWith(ext))
        );
        if (files.length >= 3) {
          console.log("[AGENTS.md] " + dir + " has " + files.length + " source files but no AGENTS.md — consider creating one.");
        }
      } catch (e) {
        // Directory read failed, skip silently
      }
    }
  } catch (e) {
    // Parse failed, skip silently
  }
});
'
