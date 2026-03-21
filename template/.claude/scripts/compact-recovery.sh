#!/usr/bin/env bash
# NCC — SessionStart hook (compact matcher): re-injects critical context after compaction

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/hook-profile.sh"
ncc_profile_allows "compact-recovery" || exit 0

node -e '
const fs = require("fs");
const path = require("path");
const dir = process.cwd();

const lines = ["[NCC Context Recovery — Post Compaction]"];

// ── STATE.md — active features ────────────────────────────────────────────────
try {
  const state = fs.readFileSync(path.join(dir, "spec", "STATE.md"), "utf-8");
  const featurePattern = /^### (\S+) \[(\w+)\]/gm;
  let match;
  const active = [];
  while ((match = featurePattern.exec(state)) !== null) {
    active.push({ name: match[1], phase: match[2] });
  }

  if (active.length > 0) {
    lines.push("");
    lines.push("## Active Features");
    for (const f of active) {
      lines.push("- " + f.name + " [" + f.phase + "]");

      // PLAN.md progress
      const planPath = path.join(dir, "spec", "feature", f.name, "PLAN.md");
      if (fs.existsSync(planPath)) {
        const plan = fs.readFileSync(planPath, "utf-8");
        const done = (plan.match(/- \[x\]/gi) || []).length;
        const todo = (plan.match(/- \[ \]/g) || []).length;
        const total = done + todo;
        if (total > 0) {
          lines.push("  Progress: " + done + "/" + total + " tasks done");
        }

        // Auto-fix budget
        const budgetMatch = plan.match(/Used:\s*(\d+)/);
        if (budgetMatch) {
          lines.push("  Auto-fix budget used: " + budgetMatch[1] + "/3");
        }
      }

      // CONTEXT.md decisions
      const ctxPath = path.join(dir, "spec", "feature", f.name, "CONTEXT.md");
      if (fs.existsSync(ctxPath)) {
        const ctx = fs.readFileSync(ctxPath, "utf-8");
        const decisions = ctx.split("\n")
          .filter(l => l.startsWith("- ") || l.startsWith("* "))
          .slice(0, 5)
          .map(l => "  " + l);
        if (decisions.length > 0) {
          lines.push("  Key decisions:");
          lines.push(...decisions);
        }
      }
    }
  }
} catch (_) {}

// ── Blockers ──────────────────────────────────────────────────────────────────
try {
  const state = fs.readFileSync(path.join(dir, "spec", "STATE.md"), "utf-8");
  const blockerSection = state.split(/^## Blockers/m)[1];
  if (blockerSection) {
    const blockers = blockerSection.split(/^## /m)[0].trim();
    if (blockers && blockers !== "- (none)" && blockers !== "(none)") {
      lines.push("");
      lines.push("## Blockers");
      lines.push(blockers);
    }
  }
} catch (_) {}

// ── Reminder ──────────────────────────────────────────────────────────────────
lines.push("");
lines.push("Re-read spec/rules/_workflow.md and active feature spec.md before continuing.");

if (lines.length > 2) {
  console.log(lines.join("\n"));
}
'
