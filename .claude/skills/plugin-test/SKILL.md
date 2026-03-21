---
name: plugin-test
description: Run NCC plugin against multiple test projects in parallel. Installs from current dev branch, executes spec→dev flow, and generates quality reports with token/skill/flow analysis.
argument-hint: "[e-commerce,blog,dashboard,saas] or (no args = all 4)"
context: fork
agent: plugin-test-orchestrator
---

# /plugin-test — NCC Plugin E2E Test Suite

Run a comprehensive end-to-end test of the NCC plugin across multiple project types.

## Setup

1. Detect NCC source root — current working directory must contain `package.json` with `"name": "nextjs-claude-code"`
2. Build the latest version: `npm run build`
3. Create test workspace: `__plugin-tests__/` in the NCC source root

## Test Projects

$ARGUMENTS determines which projects to test. Default: all 4.

| Project | Libraries | Focus |
|---------|-----------|-------|
| `e-commerce` | next, prisma, next-auth, stripe, zod, react-hook-form | DB + Auth + Payment flow |
| `blog` | next, next-intl, tailwindcss, @vercel/og | i18n + MDX + SSG |
| `dashboard` | next, drizzle-orm, @tanstack/react-query, zustand, shadcn | State mgmt + Data tables |
| `saas` | next, ai, @ai-sdk/openai, @vercel/blob, stripe | AI SDK + Storage + Billing |

## Execution

For each project, the orchestrator:
1. Scaffolds a minimal Next.js project with the appropriate package.json
2. Spawns `plugin-test-executor` to install NCC and run spec→dev
3. After executor completes, spawns `plugin-test-reviewer` to analyze results
4. Collects all reviews into `__plugin-tests__/REPORT.md`

## NCC Source Path

The NCC installer is invoked directly from the dev build:
```bash
node {NCC_SOURCE}/dist/index.js
```
This tests the current branch code, not the published npm version.
