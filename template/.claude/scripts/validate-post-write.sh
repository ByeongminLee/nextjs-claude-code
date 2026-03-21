#!/usr/bin/env bash
# NCC — Consolidated PostToolUse hook: validation (blocking)
# Merges: validate-spec.sh + validate-edit.sh
# Runs after every Write/Edit. Blocks on spec format errors; advisory for code issues.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/hook-profile.sh"
ncc_profile_allows "validate-post-write" || exit 0

INPUT_JSON=$(cat)

node -e '
const input = JSON.parse(process.argv[1]);
const filePath = (input.tool_input && input.tool_input.file_path) || "";
if (!filePath) process.exit(0);

const fs = require("fs");
const path = require("path");

// ═══════════════════════════════════════════════════════════════════════════════
// Part 1: Spec document validation (from validate-spec.sh) — BLOCKING
// ═══════════════════════════════════════════════════════════════════════════════

// --- Validate spec.md format ---
if ((filePath.includes("/spec/feature/") || filePath.startsWith("spec/feature/")) && filePath.endsWith("/spec.md")) {
  if (!fs.existsSync(filePath)) process.exit(0);
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
    process.exit(0);
  }

  // Advisory: check REQ-NNN format
  const reqMatch = content.split(/^## (?:Requirements|요구사항)/m);
  if (reqMatch.length > 1) {
    const reqSection = reqMatch[1].split(/^## /m)[0] || "";
    const lines = reqSection.split("\n").filter((l) => l.trim() && !l.startsWith("#"));
    const nonReqLines = lines.filter((l) => !l.trim().match(/^REQ-\d{3}:/));
    if (nonReqLines.length > 0) {
      console.log(JSON.stringify({
        decision: "approve",
        reason: "[Advisory] Some lines in ## Requirements do not follow REQ-NNN format.",
      }));
    }
  }
  process.exit(0);
}

// --- Validate design.md format ---
if ((filePath.includes("/spec/feature/") || filePath.startsWith("spec/feature/")) && filePath.endsWith("/design.md")) {
  if (!fs.existsSync(filePath)) process.exit(0);
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
  process.exit(0);
}

// --- Validate history entry format ---
if ((filePath.includes("/history/") || filePath.startsWith("spec/") && filePath.includes("history/")) && filePath.endsWith(".md")) {
  if (!fs.existsSync(filePath)) process.exit(0);
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
  process.exit(0);
}

// ═══════════════════════════════════════════════════════════════════════════════
// Part 2: Edit result validation (from validate-edit.sh) — ADVISORY
// ═══════════════════════════════════════════════════════════════════════════════

const absPath = path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);

if (!fs.existsSync(absPath)) {
  process.stderr.write("⚠️  [validate] File not found after edit: " + absPath + "\n");
  process.exit(0);
}

const stat = fs.statSync(absPath);
if (stat.size === 0) {
  process.stderr.write("⚠️  [validate] File is empty after edit: " + absPath + "\n");
  process.exit(0);
}

// JS/TS syntax check
if (/\.(js|ts|mjs|cjs)$/.test(absPath)) {
  const { execSync } = require("child_process");
  try {
    execSync("node --check " + JSON.stringify(absPath), { stdio: "pipe" });
  } catch (e) {
    const msg = (e.stderr || e.stdout || "").toString().split("\n").slice(0, 3).join("\n");
    process.stderr.write("⚠️  [validate] Syntax issue: " + absPath + "\n   " + msg + "\n");
  }
}

// JSON syntax check
if (/\.json$/.test(absPath)) {
  try {
    JSON.parse(fs.readFileSync(absPath, "utf-8"));
  } catch (e) {
    process.stderr.write("⚠️  [validate] Invalid JSON: " + absPath + "\n");
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// Part 3: Artifact size limit check — ADVISORY (from _artifact-limits.md)
// ═══════════════════════════════════════════════════════════════════════════════

(function checkArtifactSize() {
  if (!filePath.includes("spec/")) return;
  if (!filePath.endsWith(".md")) return;

  const limits = {
    "PROJECT.md": 80,
    "ARCHITECTURE.md": 120,
    "STATE.md": 100,
    "spec.md": 150,
    "design.md": 200,
    "PLAN.md": 100,
    "CONTEXT.md": 50,
    "LOOP_NOTES.md": 50,
  };

  const basename = filePath.split("/").pop() || "";
  const limit = limits[basename];
  if (!limit) return;

  const checkPath = path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);
  if (!fs.existsSync(checkPath)) return;

  const content = fs.readFileSync(checkPath, "utf-8");
  const lineCount = content.split("\n").length;

  if (lineCount > limit) {
    process.stderr.write(
      "\n\u26a0\ufe0f  [NCC Artifact Limit] " + basename + " exceeds recommended size: " +
      lineCount + "/" + limit + " lines\n" +
      "   \u2192 Consider splitting content. See spec/rules/_artifact-limits.md for overflow strategies.\n\n"
    );
  }
})();
' "$INPUT_JSON"
