#!/usr/bin/env bash
# NCC — Consolidated PostToolUse hook: advisory checks (non-blocking)
# Merges: reflect-spec.sh + suggest-skills.sh + security-suggest.sh
# All checks are advisory — never blocks.

INPUT_JSON=$(cat)

node -e '
const input = JSON.parse(process.argv[1]);
const filePath = (input.tool_input && input.tool_input.file_path) || "";
if (!filePath || filePath.includes("node_modules")) process.exit(0);

const fs = require("fs");
const path = require("path");
const dir = process.cwd();

// ═══════════════════════════════════════════════════════════════════════════════
// Part 1: Spec reflection check (from reflect-spec.sh) — source files only
// ═══════════════════════════════════════════════════════════════════════════════

(function reflectSpec() {
  if (filePath.startsWith("spec/") || filePath.includes("/spec/")) return;

  const skipPatterns = [
    "node_modules/", ".next/", "dist/", ".turbo/", "coverage/",
    ".md", ".json", ".lock", ".sh", ".env",
  ];
  if (skipPatterns.some((p) => filePath.includes(p))) return;

  const sourceExts = [".ts", ".tsx", ".js", ".jsx", ".mts", ".cts"];
  if (!sourceExts.some((ext) => filePath.endsWith(ext))) return;

  let features = [];
  try {
    const state = fs.readFileSync(path.join(dir, "spec", "STATE.md"), "utf-8");
    const featurePattern = /^### (\S+) \[(\w+)\]/gm;
    let match;
    while ((match = featurePattern.exec(state)) !== null) {
      if (match[2] === "executing" || match[2] === "looping") {
        features.push(match[1]);
      }
    }
  } catch (_) {}

  if (features.length === 0) return;

  let content = "";
  try { content = fs.readFileSync(filePath, "utf-8"); } catch (_) { return; }

  const signalPatterns = [
    /export\s+(default\s+)?(async\s+)?function\s+\w+/,
    /export\s+const\s+\w+\s*=/,
    /export\s+class\s+\w+/,
    /'\''use server'\''/,
    /export\s+async\s+function\s+(GET|POST|PUT|PATCH|DELETE|HEAD)\s*\(/,
  ];

  if (!signalPatterns.some((p) => p.test(content))) return;

  const featureList = features.map((f) => "   - spec/feature/" + f + "/spec.md").join("\n");
  process.stderr.write(
    "\n\u26a0\ufe0f  [NCC] Spec reflection check\n" +
    "   Modified: " + filePath + "\n" +
    "   Active features:\n" + featureList + "\n" +
    "   \u2192 Run /spec to update if new exports or behaviors were added.\n\n"
  );
})();

// ═══════════════════════════════════════════════════════════════════════════════
// Part 2: Skill suggestion (from suggest-skills.sh) — package.json only
// ═══════════════════════════════════════════════════════════════════════════════

(function suggestSkills() {
  if (!filePath.endsWith("package.json") || filePath.includes("node_modules")) return;

  const pkgDir = path.dirname(filePath);
  const catalogPath = path.join(pkgDir, ".claude", "skills", "skill-catalog.json");
  const manifestPath = path.join(pkgDir, ".claude", "skills", "skills-manifest.json");

  if (!fs.existsSync(catalogPath) || !fs.existsSync(filePath)) return;

  const pkg = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  const deps = Object.keys({ ...pkg.dependencies, ...pkg.devDependencies });

  const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf-8"));
  const manifest = fs.existsSync(manifestPath)
    ? JSON.parse(fs.readFileSync(manifestPath, "utf-8"))
    : [];
  const installed = new Set(manifest.map((m) => m.name));

  const conditionMap = {};
  catalog.forEach((s) => {
    if (s.condition) s.condition.forEach((c) => {
      if (!conditionMap[c]) conditionMap[c] = [];
      conditionMap[c].push(s.name);
    });
  });

  const matchedSkills = new Set();
  deps.forEach((d) => {
    const variants = [d, d.replace(/^@/, "").replace(/\//g, "-"), (d.split("/").pop() || "")];
    variants.forEach((v) => {
      if (conditionMap[v]) conditionMap[v].forEach((name) => matchedSkills.add(name));
    });
  });
  if (fs.existsSync(path.join(pkgDir, "components.json"))) {
    if (conditionMap["shadcn"]) conditionMap["shadcn"].forEach((name) => matchedSkills.add(name));
  }

  const suggestions = catalog.filter((s) => matchedSkills.has(s.name) && !installed.has(s.name));
  if (suggestions.length > 0) {
    const names = suggestions.map((s) => s.name).join(", ");
    console.log(JSON.stringify({
      decision: "report",
      reason: "New dependencies detected! Matching skills available: " + names +
        "\\nInstall with: npx nextjs-claude-code skill-suggest"
    }));
  }
})();

// ═══════════════════════════════════════════════════════════════════════════════
// Part 3: Security suggestion (from security-suggest.sh) — sensitive files only
// ═══════════════════════════════════════════════════════════════════════════════

(function securitySuggest() {
  const strategyPath = path.join(dir, "spec", "SECURITY_STRATEGY.md");
  if (!fs.existsSync(strategyPath)) return;

  const lowerPath = filePath.toLowerCase();
  const sensitiveKeywords = [
    "auth", "session", "token", "middleware",
    "login", "signup", "signin", "register",
    "password", "credential", "payment", "checkout",
    "crypto", "encrypt", "decrypt", "secret",
    "permission", "rbac", "acl", "oauth", "jwt"
  ];
  const sensitivePatterns = [
    /\/api\//,
    /\.env/,
    /middleware\.[tjm]/,
    /next\.config\./,
    /security/
  ];

  const keywordMatch = sensitiveKeywords.some((kw) => lowerPath.includes(kw));
  const patternMatch = sensitivePatterns.some((p) => p.test(lowerPath));
  if (!keywordMatch && !patternMatch) return;

  // Dedup: skip if already suggested for this file (session-scoped)
  const markerDir = path.join(dir, ".claude", ".cache", "security-suggested");
  const markerFile = path.join(markerDir, Buffer.from(filePath).toString("base64").slice(0, 64));

  if (!fs.existsSync(markerDir)) {
    fs.mkdirSync(markerDir, { recursive: true });
  }

  // Cleanup: limit markers to 100 files
  try {
    const markers = fs.readdirSync(markerDir);
    if (markers.length > 100) {
      const sorted = markers
        .map((f) => ({ name: f, mtime: fs.statSync(path.join(markerDir, f)).mtimeMs }))
        .sort((a, b) => a.mtime - b.mtime);
      sorted.slice(0, sorted.length - 50).forEach((f) => {
        try { fs.unlinkSync(path.join(markerDir, f.name)); } catch (_) {}
      });
    }
  } catch (_) {}

  if (fs.existsSync(markerFile)) return;
  fs.writeFileSync(markerFile, Date.now().toString());

  console.log(JSON.stringify({
    decision: "report",
    reason: "Security-sensitive file modified: " + path.basename(filePath) +
      "\\nConsider running: /security --diff"
  }));
})();
' "$INPUT_JSON"
