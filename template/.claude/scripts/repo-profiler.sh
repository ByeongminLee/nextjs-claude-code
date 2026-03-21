#!/usr/bin/env bash
# NCC — SessionStart hook: repo profiler
# Scans project config/deps and outputs a structured summary for context priming.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/hook-profile.sh"
ncc_profile_allows "repo-profiler" || exit 0

node -e '
const fs = require("fs");
const path = require("path");
const dir = process.cwd();

const profile = {};

// ── package.json ──────────────────────────────────────────────────────────────
try {
  const pkg = JSON.parse(fs.readFileSync(path.join(dir, "package.json"), "utf-8"));
  const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };

  // Framework detection
  if (allDeps["next"]) {
    profile.framework = "nextjs";
    profile.frameworkVersion = allDeps["next"].replace(/[\^~]/, "");
  } else if (allDeps["react"]) {
    profile.framework = "react";
    profile.frameworkVersion = allDeps["react"].replace(/[\^~]/, "");
  }

  // Router type
  if (fs.existsSync(path.join(dir, "app")) || fs.existsSync(path.join(dir, "src", "app"))) {
    profile.router = "app";
  } else if (fs.existsSync(path.join(dir, "pages")) || fs.existsSync(path.join(dir, "src", "pages"))) {
    profile.router = "pages";
  }

  // Key libraries
  const libs = [];
  const libMap = {
    "prisma": "prisma", "@prisma/client": "prisma",
    "drizzle-orm": "drizzle", "drizzle-kit": "drizzle",
    "@supabase/supabase-js": "supabase",
    "tailwindcss": "tailwind", "@tailwindcss/postcss": "tailwind",
    "next-auth": "next-auth", "@auth/core": "auth",
    "zod": "zod", "react-hook-form": "react-hook-form",
    "@tanstack/react-query": "tanstack-query",
    "zustand": "zustand", "jotai": "jotai", "recoil": "recoil",
    "@testing-library/react": "testing-library",
    "vitest": "vitest", "jest": "jest",
    "@playwright/test": "playwright",
    "ai": "ai-sdk", "@ai-sdk/openai": "ai-sdk",
    "stripe": "stripe",
    "next-intl": "next-intl", "next-i18next": "i18next",
    "framer-motion": "framer-motion", "motion": "framer-motion",
    "storybook": "storybook", "@storybook/react": "storybook",
  };
  for (const [dep, label] of Object.entries(libMap)) {
    if (allDeps[dep] && !libs.includes(label)) libs.push(label);
  }
  profile.libraries = libs;

  // UI framework
  if (allDeps["@radix-ui/react-slot"] || fs.existsSync(path.join(dir, "components.json"))) {
    profile.uiFramework = "shadcn";
  } else if (allDeps["@mui/material"]) {
    profile.uiFramework = "mui";
  } else if (allDeps["@chakra-ui/react"]) {
    profile.uiFramework = "chakra";
  }
} catch (_) {}

// ── tsconfig.json ─────────────────────────────────────────────────────────────
try {
  const tsconfig = JSON.parse(fs.readFileSync(path.join(dir, "tsconfig.json"), "utf-8"));
  profile.typescript = true;
  if (tsconfig.compilerOptions) {
    profile.strictMode = !!tsconfig.compilerOptions.strict;
    if (tsconfig.compilerOptions.paths) {
      profile.pathAliases = Object.keys(tsconfig.compilerOptions.paths);
    }
  }
} catch (_) {
  profile.typescript = false;
}

// ── Config files ──────────────────────────────────────────────────────────────
const configChecks = [
  ["tailwind.config.ts", "tailwind.config.js", "tailwind.config.mjs"],
  ["next.config.ts", "next.config.js", "next.config.mjs"],
  ["drizzle.config.ts", "drizzle.config.js"],
  ["prisma/schema.prisma"],
  [".env.local", ".env"],
];

const detectedConfigs = [];
for (const variants of configChecks) {
  for (const f of variants) {
    if (fs.existsSync(path.join(dir, f))) {
      detectedConfigs.push(f);
      break;
    }
  }
}
profile.configFiles = detectedConfigs;

// ── Architecture pattern ──────────────────────────────────────────────────────
if (fs.existsSync(path.join(dir, "turbo.json")) || fs.existsSync(path.join(dir, "apps"))) {
  profile.architecture = "monorepo";
} else if (fs.existsSync(path.join(dir, "src", "features"))) {
  profile.architecture = "feature-based";
} else if (fs.existsSync(path.join(dir, "src", "entities"))) {
  profile.architecture = "fsd";
} else {
  profile.architecture = "flat";
}

// ── Output ────────────────────────────────────────────────────────────────────
const lines = ["[NCC Repo Profile]"];
if (profile.framework) lines.push("Framework: " + profile.framework + " " + (profile.frameworkVersion || ""));
if (profile.router) lines.push("Router: " + profile.router);
if (profile.typescript !== undefined) lines.push("TypeScript: " + (profile.typescript ? "yes" + (profile.strictMode ? " (strict)" : "") : "no"));
if (profile.uiFramework) lines.push("UI: " + profile.uiFramework);
if (profile.architecture) lines.push("Architecture: " + profile.architecture);
if (profile.libraries && profile.libraries.length) lines.push("Libraries: " + profile.libraries.join(", "));
if (profile.pathAliases && profile.pathAliases.length) lines.push("Path aliases: " + profile.pathAliases.join(", "));
if (profile.configFiles && profile.configFiles.length) lines.push("Config: " + profile.configFiles.join(", "));

console.log(lines.join("\n"));
'
