#!/usr/bin/env bash
# NCC — PostToolUse advisory hook (non-blocking)
# Checks: spec reflection, skill suggestions, security suggestions

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/hook-profile.sh"
ncc_profile_allows "advisory-post-write" || exit 0

INPUT_JSON=$(cat)

node -e '
const input = JSON.parse(process.argv[1]);
const filePath = (input.tool_input && input.tool_input.file_path) || "";
if (!filePath || filePath.includes("node_modules")) process.exit(0);
const fs = require("fs"), path = require("path"), dir = process.cwd();

// ── Part 1: Spec reflection — source files only ─────────────────────────────
(function() {
  if (filePath.startsWith("spec/") || filePath.includes("/spec/")) return;
  const skip = ["node_modules/",".next/","dist/",".turbo/","coverage/",".md",".json",".lock",".sh",".env"];
  if (skip.some(p => filePath.includes(p))) return;
  if (![".ts",".tsx",".js",".jsx",".mts",".cts"].some(e => filePath.endsWith(e))) return;

  let features = [];
  try {
    const state = fs.readFileSync(path.join(dir,"spec","STATE.md"),"utf-8");
    let m; const re = /^### (\S+) \[(\w+)\]/gm;
    while ((m = re.exec(state))) { if (m[2]==="executing"||m[2]==="looping") features.push(m[1]); }
  } catch(_){}
  if (!features.length) return;

  let c = ""; try { c = fs.readFileSync(filePath,"utf-8"); } catch(_){ return; }
  const sigs = [/export\s+(default\s+)?(async\s+)?function\s+\w+/,/export\s+const\s+\w+\s*=/,/export\s+class\s+\w+/];
  if (!sigs.some(p => p.test(c))) return;

  process.stderr.write("\n⚠️  [NCC] Source modified: " + filePath + "\n   Active: " +
    features.map(f => "spec/feature/" + f).join(", ") + "\n   → Update spec if new exports added.\n\n");
})();

// ── Part 2: Skill suggestion — package.json only ────────────────────────────
(function() {
  if (!filePath.endsWith("package.json") || filePath.includes("node_modules")) return;
  const pkgDir = path.dirname(filePath);
  const catPath = path.join(pkgDir,".claude","skills","skill-catalog.json");
  const manPath = path.join(pkgDir,".claude","skills","skills-manifest.json");
  if (!fs.existsSync(catPath) || !fs.existsSync(filePath)) return;

  const deps = Object.keys({...JSON.parse(fs.readFileSync(filePath,"utf-8")).dependencies,...JSON.parse(fs.readFileSync(filePath,"utf-8")).devDependencies});
  const catalog = JSON.parse(fs.readFileSync(catPath,"utf-8"));
  const installed = new Set((fs.existsSync(manPath)?JSON.parse(fs.readFileSync(manPath,"utf-8")):[]).map(m=>m.name));

  const cmap = {}; catalog.forEach(s => { if(s.condition) s.condition.forEach(c => { (cmap[c]=cmap[c]||[]).push(s.name); }); });
  const matched = new Set();
  deps.forEach(d => { [d,d.replace(/^@/,"").replace(/\//g,"-"),(d.split("/").pop()||"")].forEach(v => { if(cmap[v]) cmap[v].forEach(n=>matched.add(n)); }); });
  if (fs.existsSync(path.join(pkgDir,"components.json")) && cmap["shadcn"]) cmap["shadcn"].forEach(n=>matched.add(n));

  let suggestions = catalog.filter(s => matched.has(s.name) && !installed.has(s.name));
  if (!suggestions.length) return;

  // Dedup cache
  const cache = path.join(dir,".claude",".cache","skill-suggestions");
  let seen = new Set();
  try { if(fs.existsSync(cache)) seen = new Set(fs.readFileSync(cache,"utf-8").trim().split("\n").filter(Boolean)); } catch(_){}
  suggestions = suggestions.filter(s => !seen.has(s.name));
  if (!suggestions.length) return;
  try { fs.mkdirSync(path.dirname(cache),{recursive:true}); fs.appendFileSync(cache, suggestions.map(s=>s.name).join("\n")+"\n"); } catch(_){}

  console.log(JSON.stringify({ decision:"report", reason:"Skills available: "+suggestions.map(s=>s.name).join(", ")+"\\nRun: npx nextjs-claude-code skill-suggest" }));
})();

// ── Part 3: Security suggestion — sensitive files only ──────────────────────
(function() {
  if (!fs.existsSync(path.join(dir,"spec","SECURITY_STRATEGY.md"))) return;
  const lp = filePath.toLowerCase();
  const kw = ["auth","session","token","middleware","login","signup","password","payment","crypto","secret","oauth","jwt"];
  const pt = [/\/api\//,/\.env/,/middleware\.[tjm]/,/next\.config\./,/security/];
  if (!kw.some(k=>lp.includes(k)) && !pt.some(p=>p.test(lp))) return;

  const mDir = path.join(dir,".claude",".cache","security-suggested");
  const mFile = path.join(mDir, Buffer.from(filePath).toString("base64").slice(0,64));
  if (!fs.existsSync(mDir)) fs.mkdirSync(mDir,{recursive:true});
  try { const ms=fs.readdirSync(mDir); if(ms.length>100) ms.slice(0,ms.length-50).forEach(f=>{try{fs.unlinkSync(path.join(mDir,f))}catch(_){}}); } catch(_){}
  if (fs.existsSync(mFile)) return;
  fs.writeFileSync(mFile, Date.now().toString());

  console.log(JSON.stringify({ decision:"report", reason:"Security-sensitive: "+path.basename(filePath)+"\\nRun: /security --diff" }));
})();
' "$INPUT_JSON"
