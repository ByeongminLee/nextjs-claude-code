#!/usr/bin/env bash
# NCC — PostToolUse hook: checks if code changes may require spec updates
# Advisory only — outputs a reminder, never blocks.

node -e '
const chunks = [];
process.stdin.on("data", (c) => chunks.push(c));
process.stdin.on("end", () => {
  try {
    const input = JSON.parse(Buffer.concat(chunks).toString());
    const filePath = (input.tool_input && input.tool_input.file_path) || "";

    // Skip if no file path
    if (!filePath) return;

    // Skip spec/ files (they are the spec themselves)
    if (filePath.startsWith("spec/") || filePath.includes("/spec/")) return;

    // Skip non-source files
    const skipPatterns = [
      "node_modules/", ".next/", "dist/", ".turbo/", "coverage/",
      ".md", ".json", ".lock", ".sh", ".env",
    ];
    if (skipPatterns.some((p) => filePath.includes(p))) return;

    // Only check source-like files
    const sourceExts = [".ts", ".tsx", ".js", ".jsx", ".mts", ".cts"];
    if (!sourceExts.some((ext) => filePath.endsWith(ext))) return;

    // Read STATE.md and find all non-idle features
    const fs = require("fs");
    let features = [];
    try {
      const state = fs.readFileSync("spec/STATE.md", "utf-8");
      // Parse features section: ### feature-name [phase]
      const featurePattern = /^### (\S+) \[(\w+)\]/gm;
      let match;
      while ((match = featurePattern.exec(state)) !== null) {
        const name = match[1];
        const phase = match[2];
        if (phase !== "idle") {
          features.push(name);
        }
      }
    } catch (_) {}

    if (features.length === 0) return;

    // Heuristic: detect new exported symbols or server directives
    let content = "";
    try { content = fs.readFileSync(filePath, "utf-8"); } catch (_) { return; }

    const signalPatterns = [
      /export\s+(default\s+)?(async\s+)?function\s+\w+/,
      /export\s+const\s+\w+\s*=/,
      /export\s+class\s+\w+/,
      /'\''use server'\''/,
      /export\s+async\s+function\s+(GET|POST|PUT|PATCH|DELETE|HEAD)\s*\(/,
    ];

    const hasSignal = signalPatterns.some((p) => p.test(content));
    if (!hasSignal) return;

    // Output advisory for each active feature
    const featureList = features.map((f) => "   - spec/feature/" + f + "/spec.md").join("\n");
    process.stderr.write(
      "\n\u26a0\ufe0f  [NCC] Spec reflection check\n" +
      "   Modified: " + filePath + "\n" +
      "   Active features:\n" + featureList + "\n" +
      "   \u2192 Do any of these specs need updating?\n" +
      "   \u2192 Run /spec to update if new exports or behaviors were added.\n\n"
    );
  } catch (_) {}
});
'
