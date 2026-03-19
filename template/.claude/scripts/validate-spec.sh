#!/usr/bin/env bash
# nextjs-claude-code — PostToolUse hook: validates spec/feature/*/spec.md format
# Called after every Write or Edit tool use.
# Uses node internally for reliable JSON parsing.

node -e '
const chunks = [];
process.stdin.on("data", (c) => chunks.push(c));
process.stdin.on("end", () => {
  try {
    const input = JSON.parse(Buffer.concat(chunks).toString());
    const filePath = (input.tool_input && input.tool_input.file_path) || "";

    // --- Validate spec.md format ---
    if (filePath.includes("/spec/feature/") && filePath.endsWith("/spec.md")) {
      const fs = require("fs");
      if (!fs.existsSync(filePath)) return;

      const content = fs.readFileSync(filePath, "utf-8");

      const required = [
        ["## Purpose",      "## 목적"],
        ["## Requirements", "## 요구사항"],
        ["## Behaviors",    "## 핵심 동작"],
        ["## Out of Scope", "## 범위 외"],
      ];

      const missing = required
        .filter((alts) => !alts.some((s) => content.includes(s)))
        .map((alts) => alts.join(" / "));

      if (missing.length > 0) {
        const fixHint = [
          "Required sections:",
          "  ## Purpose",
          "  ## Requirements  (REQ-001: ... format)",
          "  ## Behaviors     (When [trigger], [result] format)",
          "  ## Out of Scope",
        ].join("\n");
        const reasons = missing.map((s) => "  - Missing section: " + s).join("\n");
        console.log(JSON.stringify({
          decision: "block",
          reason: "spec.md validation failed:\n" + reasons + "\n\n" + fixHint,
        }));
        return;
      }

      // Advisory: check REQ-NNN format in Requirements section
      const reqMatch = content.split(/^## (?:Requirements|요구사항)/m);
      if (reqMatch.length > 1) {
        const reqSection = reqMatch[1].split(/^## /m)[0] || "";
        const lines = reqSection.split("\n").filter((l) => l.trim() && !l.startsWith("#"));
        const nonReqLines = lines.filter((l) => !l.trim().match(/^REQ-\d{3}:/));
        if (nonReqLines.length > 0) {
          console.log(JSON.stringify({
            decision: "approve",
            reason: "[Advisory] Some lines in ## Requirements do not follow REQ-NNN format. Expected: REQ-001: statement",
          }));
        }
      }
      return;
    }

    // --- Validate design.md format ---
    if (filePath.includes("/spec/feature/") && filePath.endsWith("/design.md")) {
      const fs = require("fs");
      if (!fs.existsSync(filePath)) return;

      const content = fs.readFileSync(filePath, "utf-8");

      const required = [
        ["## Components",          "## 컴포넌트"],
        ["## State",               "## 상태"],
        ["## Data Flow",           "## 데이터 흐름"],
        ["## Technical Decisions", "## 기술 결정"],
      ];

      const missing = required
        .filter((alts) => !alts.some((s) => content.includes(s)))
        .map((alts) => alts.join(" / "));

      if (missing.length > 0) {
        const fixHint = [
          "Required sections:",
          "  ## Components",
          "  ## State",
          "  ## Data Flow",
          "  ## Technical Decisions",
        ].join("\n");
        const reasons = missing.map((s) => "  - Missing section: " + s).join("\n");
        console.log(JSON.stringify({
          decision: "block",
          reason: "design.md validation failed:\n" + reasons + "\n\n" + fixHint,
        }));
      }
      return;
    }

    // --- Validate history entry format ---
    if (filePath.includes("/history/") && filePath.endsWith(".md")) {
      const fs = require("fs");
      if (!fs.existsSync(filePath)) return;

      const content = fs.readFileSync(filePath, "utf-8");

      const filenamePattern = /\/\d{4}-\d{2}-\d{2}-.+\.md$/;
      const basename = filePath.split("/").pop();
      const errors = [];

      if (!filenamePattern.test(filePath)) {
        errors.push("Filename must match YYYY-MM-DD-[description].md (got: " + basename + ")");
      }

      const requiredSections = [
        ["## Reason",        "## 사유"],
        ["## Changes",       "## 변경사항"],
        ["## Files Modified","## 수정된 파일"],
      ];

      const missingSections = requiredSections
        .filter((alts) => !alts.some((s) => content.includes(s)))
        .map((alts) => alts.join(" / "));

      if (missingSections.length > 0) {
        missingSections.forEach((s) => errors.push("Missing section: " + s));
      }

      if (!content.match(/^# .+/m)) {
        errors.push("Missing top-level heading (# [Change description])");
      }

      if (!content.match(/Date:\s*\d{4}-\d{2}-\d{2}/)) {
        errors.push("Missing or malformed Date field (expected Date: YYYY-MM-DD)");
      }

      if (errors.length > 0) {
        const fixHint = [
          "Required history entry format:",
          "  # [Change description]",
          "  Date: YYYY-MM-DD",
          "  ## Reason",
          "  ## Changes",
          "  ## Files Modified",
        ].join("\n");
        const reasons = errors.map((e) => "  - " + e).join("\n");
        console.log(JSON.stringify({
          decision: "block",
          reason: "History entry validation failed:\n" + reasons + "\n\n" + fixHint,
        }));
      }
    }
  } catch (_) {}
});
'
