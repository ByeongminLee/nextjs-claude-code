#!/usr/bin/env bash
# PostToolUse hook: package.json 변경 시 매칭되는 on-demand 스킬 제안
# decision: "report" → 정보성 메시지 (블로킹 아님)

node -e '
const chunks = [];
process.stdin.on("data", (c) => chunks.push(c));
process.stdin.on("end", () => {
  try {
    const input = JSON.parse(Buffer.concat(chunks).toString());
    const filePath = (input.tool_input && input.tool_input.file_path) || "";

    if (!filePath.endsWith("package.json") || filePath.includes("node_modules")) return;

    const fs = require("fs");
    const path = require("path");

    // package.json의 상위 디렉토리에서 .claude/skills 찾기
    let dir = path.dirname(filePath);
    const catalogPath = path.join(dir, ".claude", "skills", "skill-catalog.json");
    const manifestPath = path.join(dir, ".claude", "skills", "skills-manifest.json");

    if (!fs.existsSync(catalogPath)) return;
    if (!fs.existsSync(filePath)) return;

    const pkg = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const deps = Object.keys({ ...pkg.dependencies, ...pkg.devDependencies });

    const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf-8"));
    const manifest = fs.existsSync(manifestPath)
      ? JSON.parse(fs.readFileSync(manifestPath, "utf-8"))
      : [];
    const installed = new Set(manifest.map((m) => m.name));

    // Build condition-to-skill mapping dynamically from catalog
    const conditionMap = {};
    catalog.forEach((s) => {
      if (s.condition) s.condition.forEach((c) => {
        if (!conditionMap[c]) conditionMap[c] = [];
        conditionMap[c].push(s.name);
      });
    });

    // Match deps against catalog conditions
    const matchedSkills = new Set();
    deps.forEach((d) => {
      const variants = [d, d.replace(/^@/, "").replace(/\//g, "-"), (d.split("/").pop() || "")];
      variants.forEach((v) => {
        if (conditionMap[v]) conditionMap[v].forEach((name) => matchedSkills.add(name));
      });
    });
    if (fs.existsSync(path.join(dir, "components.json"))) {
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
  } catch (_) {
    // silent — hook should not block on errors
  }
});
'
