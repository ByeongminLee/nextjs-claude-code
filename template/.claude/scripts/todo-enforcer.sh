#!/usr/bin/env bash
# NCC — Stop hook: warns about incomplete tasks and TODO comments
# Profile: strict only. Advisory (non-blocking).

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/hook-profile.sh"
ncc_profile_allows "todo-enforcer" || exit 0

node -e '
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const dir = process.cwd();

const warnings = [];

// ── Check PLAN.md for incomplete tasks ────────────────────────────────────────
try {
  const featureDir = path.join(dir, "spec", "feature");
  if (fs.existsSync(featureDir)) {
    const features = fs.readdirSync(featureDir, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => d.name);

    for (const feature of features) {
      const planPath = path.join(featureDir, feature, "PLAN.md");
      if (!fs.existsSync(planPath)) continue;

      const plan = fs.readFileSync(planPath, "utf-8");

      // Check if feature is actively being worked on (has approved status)
      if (!plan.includes("Status: approved")) continue;

      const incomplete = (plan.match(/^- \[ \].*/gm) || []);
      if (incomplete.length > 0) {
        warnings.push({
          type: "plan",
          feature,
          count: incomplete.length,
          tasks: incomplete.slice(0, 3).map(t => t.trim()),
        });
      }
    }
  }
} catch (_) {}

// ── Check for TODO/FIXME/HACK in recently modified files ─────────────────────
try {
  // Get files modified in the current session (unstaged + staged changes)
  const diffOutput = execSync("git diff --name-only HEAD 2>/dev/null || git diff --name-only 2>/dev/null || true", {
    encoding: "utf-8",
    cwd: dir,
    timeout: 5000,
  }).trim();

  const stagedOutput = execSync("git diff --cached --name-only 2>/dev/null || true", {
    encoding: "utf-8",
    cwd: dir,
    timeout: 5000,
  }).trim();

  const modifiedFiles = [...new Set([
    ...diffOutput.split("\n"),
    ...stagedOutput.split("\n"),
  ])].filter(f => f && !f.includes("node_modules") && /\.(ts|tsx|js|jsx|mts|cts)$/.test(f));

  const todoPattern = /\/\/\s*(TODO|FIXME|HACK|XXX)\b/i;
  const todoFiles = [];

  for (const file of modifiedFiles) {
    const absFile = path.join(dir, file);
    if (!fs.existsSync(absFile)) continue;
    const content = fs.readFileSync(absFile, "utf-8");
    const matches = content.split("\n")
      .map((l, i) => ({ line: i + 1, text: l.trim() }))
      .filter(({ text }) => todoPattern.test(text));

    if (matches.length > 0) {
      todoFiles.push({ file, todos: matches.slice(0, 3) });
    }
  }

  if (todoFiles.length > 0) {
    warnings.push({ type: "todos", files: todoFiles });
  }
} catch (_) {}

// ── Output warnings ──────────────────────────────────────────────────────────
if (warnings.length === 0) process.exit(0);

const lines = ["\n\u26a0\ufe0f  [NCC Todo Enforcer] Incomplete items detected:"];

for (const w of warnings) {
  if (w.type === "plan") {
    lines.push("   \ud83d\udcdd PLAN.md [" + w.feature + "]: " + w.count + " tasks remaining");
    for (const t of w.tasks) {
      lines.push("      " + t);
    }
    if (w.count > 3) lines.push("      ... and " + (w.count - 3) + " more");
  }

  if (w.type === "todos") {
    lines.push("   \ud83d\udea7 TODO/FIXME comments in modified files:");
    for (const f of w.files) {
      for (const t of f.todos) {
        lines.push("      " + f.file + ":" + t.line + " — " + t.text.slice(0, 80));
      }
    }
  }
}

lines.push("");
lines.push("   \u2192 Consider continuing to address these items before stopping.");
lines.push("");

process.stderr.write(lines.join("\n") + "\n");
'
