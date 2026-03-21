#!/usr/bin/env bash
# NCC — PostToolUse validation hook (blocking + advisory)
# Runs after Write/Edit. Blocks spec format errors; advisory for code and plan issues.

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
const isFeature = filePath.includes("/spec/feature/") || filePath.startsWith("spec/feature/");
const resolve = (p) => path.isAbsolute(p) ? p : path.join(process.cwd(), p);
const warn = (msg) => process.stderr.write(msg);
const block = (reason) => console.log(JSON.stringify({ decision: "block", reason }));

// ── Helper: check required sections ─────────────────────────────────────────
function checkSections(content, required) {
  return required
    .filter(alts => !alts.some(s => content.includes(s)))
    .map(alts => alts.join(" / "));
}

// ═══ Part 1: Spec document validation — BLOCKING ════════════════════════════

if (isFeature && filePath.endsWith("/spec.md")) {
  if (!fs.existsSync(filePath)) process.exit(0);
  const c = fs.readFileSync(filePath, "utf-8");
  const missing = checkSections(c, [
    ["## Purpose", "## 목적"], ["## Requirements", "## 요구사항"],
    ["## Behaviors", "## 핵심 동작"], ["## Out of Scope", "## 범위 외"],
  ]);
  if (missing.length > 0) {
    block("spec.md validation failed:\n" + missing.map(s => "  - Missing: " + s).join("\n") +
      "\n\nRequired: ## Purpose, ## Requirements (REQ-001:), ## Behaviors, ## Out of Scope");
    process.exit(0);
  }
  // Advisory: REQ format
  const reqPart = c.split(/^## (?:Requirements|요구사항)/m)[1];
  if (reqPart) {
    const lines = reqPart.split(/^## /m)[0].split("\n").filter(l => l.trim() && !l.startsWith("#"));
    if (lines.some(l => !l.trim().match(/^REQ-\d{3}:/))) {
      console.log(JSON.stringify({ decision: "approve", reason: "[Advisory] Some Requirements lines do not follow REQ-NNN: format." }));
    }
  }
  process.exit(0);
}

if (isFeature && filePath.endsWith("/design.md")) {
  if (!fs.existsSync(filePath)) process.exit(0);
  const missing = checkSections(fs.readFileSync(filePath, "utf-8"), [
    ["## Components", "## 컴포넌트"], ["## State", "## 상태"],
    ["## Data Flow", "## 데이터 흐름"], ["## Technical Decisions", "## 기술 결정"],
  ]);
  if (missing.length > 0) {
    block("design.md validation failed:\n" + missing.map(s => "  - Missing: " + s).join("\n") +
      "\n\nRequired: ## Components, ## State, ## Data Flow, ## Technical Decisions");
  }
  process.exit(0);
}

if (filePath.includes("history/") && filePath.endsWith(".md")) {
  if (!fs.existsSync(filePath)) process.exit(0);
  const c = fs.readFileSync(filePath, "utf-8");
  const errs = [];
  if (!/\/\d{4}-\d{2}-\d{2}-.+\.md$/.test(filePath)) errs.push("Filename must be YYYY-MM-DD-desc.md");
  const ms = checkSections(c, [["## Reason","## 사유"],["## Changes","## 변경사항"],["## Files Modified","## 수정된 파일"]]);
  ms.forEach(s => errs.push("Missing: " + s));
  if (!c.match(/^# .+/m)) errs.push("Missing # heading");
  if (!c.match(/Date:\s*\d{4}-\d{2}-\d{2}/)) errs.push("Missing Date: YYYY-MM-DD");
  if (errs.length > 0) block("History entry failed:\n" + errs.map(e => "  - " + e).join("\n"));
  process.exit(0);
}

// ═══ Part 2: Code validation — ADVISORY ═════════════════════════════════════

const absPath = resolve(filePath);
if (!fs.existsSync(absPath)) { warn("⚠️  File not found: " + absPath + "\n"); process.exit(0); }
if (fs.statSync(absPath).size === 0) { warn("⚠️  Empty file: " + absPath + "\n"); process.exit(0); }

if (/\.(js|ts|mjs|cjs)$/.test(absPath)) {
  try { require("child_process").execSync("node --check " + JSON.stringify(absPath), { stdio: "pipe" }); }
  catch (e) { warn("⚠️  Syntax: " + absPath.split("/").slice(-3).join("/") + "\n"); }
}
if (/\.(ts|tsx)$/.test(absPath) && (absPath.includes("/api/") || absPath.includes("/actions/"))) {
  const rc = fs.readFileSync(absPath, "utf-8");
  if (/export\s+(async\s+)?function\s+(GET|POST|PUT|PATCH|DELETE|HEAD)\s*\(/m.test(rc) && !rc.includes("catch")) {
    warn("⚠️  API route missing try/catch: " + absPath.split("/").slice(-3).join("/") + "\n");
  }
}
if (/\.json$/.test(absPath)) {
  try { JSON.parse(fs.readFileSync(absPath, "utf-8")); } catch { warn("⚠️  Invalid JSON: " + absPath + "\n"); }
}

// ═══ Part 3: Spec artifact advisory checks ══════════════════════════════════

// Artifact size limits
if (filePath.includes("spec/") && filePath.endsWith(".md")) {
  const limits = { "PROJECT.md":80,"ARCHITECTURE.md":120,"STATE.md":100,"spec.md":150,"design.md":200,"PLAN.md":100,"CONTEXT.md":50,"LOOP_NOTES.md":50 };
  const bn = filePath.split("/").pop() || "";
  const lim = limits[bn];
  if (lim) {
    const cp = resolve(filePath);
    if (fs.existsSync(cp)) {
      const lc = fs.readFileSync(cp, "utf-8").split("\n").length;
      if (lc > lim) warn("\n⚠️  " + bn + " exceeds " + lim + " lines (" + lc + "). Split per _artifact-limits.md.\n\n");
    }
  }
}

// PLAN.md checks (mock tasks + approval format)
if (filePath.endsWith("PLAN.md") && isFeature) {
  const pp = resolve(filePath);
  if (fs.existsSync(pp)) {
    const plan = fs.readFileSync(pp, "utf-8");
    // Mock task check
    const sp = path.join(path.dirname(pp), "spec.md");
    if (fs.existsSync(sp)) {
      const spec = fs.readFileSync(sp, "utf-8");
      if (!/^mock:\s*false/m.test(spec) && (/^api:\s*\[.+\]/m.test(spec) || /^api:\s*\n\s*-/m.test(spec))) {
        if (!/msw|mock.*handler|mocks\//i.test(plan)) {
          warn("\n⚠️  PLAN.md missing MSW tasks (mock:true + api). Add Layer 0/2.5.\n\n");
        }
      }
    }
    // Approval format
    const aw = [];
    if (!plan.includes("Status:")) aw.push("Missing Status:");
    if (plan.includes("Status: approved") && !plan.includes("Approved-at:")) aw.push("Missing Approved-at:");
    if (!/Max retries:\s*\d+\s*\/\s*Used:\s*\d+/.test(plan)) aw.push("Missing Max retries: N / Used: N");
    // Team Composition check (team mode requires this section)
    if (plan.includes("--team") && !plan.includes("## Team Composition")) aw.push("Team mode but missing ## Team Composition");
    if (aw.length > 0) warn("\n⚠️  PLAN.md: " + aw.join("; ") + "\n\n");
  }
}
' "$INPUT_JSON"
