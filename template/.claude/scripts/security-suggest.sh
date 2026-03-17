#!/usr/bin/env bash
# PostToolUse hook: 보안 민감 파일 수정 시 /security 실행 제안
# decision: "report" → 정보성 메시지 (블로킹 아님)

node -e '
const chunks = [];
process.stdin.on("data", (c) => chunks.push(c));
process.stdin.on("end", () => {
  try {
    const input = JSON.parse(Buffer.concat(chunks).toString());
    const filePath = (input.tool_input && input.tool_input.file_path) || "";

    if (!filePath || filePath.includes("node_modules")) return;

    const fs = require("fs");
    const path = require("path");

    // SECURITY_STRATEGY.md가 없으면 제안하지 않음 (setup 전)
    const dir = process.cwd();
    const strategyPath = path.join(dir, "spec", "SECURITY_STRATEGY.md");
    if (!fs.existsSync(strategyPath)) return;

    // 보안 민감 패턴 매칭
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

    // 세션 내 중복 제안 방지 (프로젝트 로컬 경로 사용)
    const markerDir = path.join(dir, ".claude", ".cache", "security-suggested");
    const markerFile = path.join(markerDir, Buffer.from(filePath).toString("base64").slice(0, 64));

    if (!fs.existsSync(markerDir)) {
      fs.mkdirSync(markerDir, { recursive: true });
    }
    if (fs.existsSync(markerFile)) return;
    fs.writeFileSync(markerFile, Date.now().toString());

    console.log(JSON.stringify({
      decision: "report",
      reason: "Security-sensitive file modified: " + path.basename(filePath) +
        "\\nConsider running: /security --diff"
    }));
  } catch (_) {
    // silent — hook should not block on errors
  }
});
'
