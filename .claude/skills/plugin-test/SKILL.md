---
name: plugin-test
description: Run NCC plugin E2E tests. Supports quick (4 projects), full (4+monorepo+modifications), install-test (npx vs marketplace with non-spec-dev focus), or custom test modes. Validates spec→dev flow, skills, hooks, code quality, security, a11y, and token efficiency.
argument-hint: "--quick | --full | --install-test | --phase1 | --phase2 | --security | --a11y | --codequality | [project-name,...] | (no args = suggest mode)"
context: fork
agent: plugin-test-orchestrator
---

# /plugin-test — NCC Plugin E2E Test Suite

## Usage

```
/plugin-test                    # Interactive — suggest a test mode based on recent changes
/plugin-test --quick            # Phase 1 only: 4 diverse projects × 4 features each
/plugin-test --full             # Phase 1 + Phase 2: full suite including monorepo + cross-feature mods
/plugin-test --install-test     # Install test: 2 projects (npx + marketplace), 5 features each, non-spec-dev focus
/plugin-test --phase1           # Phase 1 only (same as --quick)
/plugin-test --phase2           # Phase 2 only: 10-feature monorepo (solo + team)
/plugin-test --security         # Security-focused: run security-reviewer on all generated code
/plugin-test --a11y             # Accessibility-focused: run browser-tester a11y checks on UI projects
/plugin-test --codequality      # Code quality audit: deep analysis of all generated source files
/plugin-test --token             # Token optimization audit: run token-optimizer on plugin source
/plugin-test healthcare,marketplace   # Run specific projects only
/plugin-test --create              # /create pipeline test: new + existing project ideation
```

## Test Modes

### Phase 1: Quick Validation (--quick, --phase1)

4 diverse projects, each with 4 features + extra agent verification.

| Project | Stack | Extra Agents |
|---------|-------|-------------|
| `healthcare` | Prisma + next-auth + zod + vitest | `/security`, `/review` |
| `design-system` | framer-motion + playwright + storybook | `browser-tester`, `/qa --a11y` |
| `realtime-collab` | drizzle + tanstack-query + zustand + msw | `performance-optimizer`, `/loop` |
| `marketplace` | Prisma + stripe + ai-sdk + @vercel/blob | `/security --diff`, `/review`, `/status` |

Per-project: NCC install → /init → 4× spec→dev (3 tasks each) → extra agent runs → TEST_LOG.md

Reviewer scores 15 categories:
1-10: Installation, Hooks, Skills, Spec, Design, PLAN, TDD, Token, Code, Flow
11: Rules size (<200 lines each)
12: Skill selection accuracy (manifest vs package.json)
13: Extra agent execution results
14: Document sync (CONTEXT.md/design.md consistency)
15: Code quality detail (error handling, Zod, composition, Server/Client)

### Install Test (--install-test)

Tests the **published version** of NCC using two real installation methods. Primary focus: **non-spec-dev features**.

| Project | Install Method | Stack | Features | Non-Spec-Dev Focus |
|---------|---------------|-------|----------|-------------------|
| `npx-healthcare` | `npx nextjs-claude-code@latest` | Prisma + next-auth + zod + vitest | 5 features | /init, /security, /log, /commit, /rule, /test, hooks, skills |
| `mkt-marketplace` | `/plugin marketplace add` + `/plugin install` | Prisma + stripe + ai-sdk + @vercel/blob | 5 features | /init, /review, /status, /debug, /qa, /loop, /commit, hooks, skills |

Per-project: Install → /init → 5× spec→dev (2-3 tasks each) → non-spec-dev tests → TEST_LOG.md

Reviewer scores 20 categories (base 15 + 5 install-test categories):
16: Init Completeness (PROJECT.md, ARCHITECTURE.md, STATE.md quality)
17: Security & Log Setup (SECURITY_STRATEGY.md, LOG_STRATEGY.md, audit results)
18: Git Workflow (/commit conventional format + REQ linking)
19: Debug & Loop (DEBUG.md hypothesis-driven, LOOP_NOTES.md tracking, /status read-only)
20: Installation Method Fidelity (npx: local files + manifest; marketplace: namespace + CLAUDE_PLUGIN_ROOT)

### Phase 2: Large-scale Monorepo (--phase2)

2 identical CRM projects (solo vs team mode), each with:
- 10 features in dependency chain
- 5 cross-feature modifications (api-layer error format, RBAC expansion, tagging, cursor pagination, custom stages)
- Document Sync verification (CONTEXT.md, design.md, history entries)
- Solo vs Team comparison

Features: api-layer → auth-system → contact-management → deal-pipeline → email-integration → activity-feed → reporting → team-workspace → notification-center → admin-settings

### /create Pipeline Test (--create)

Tests the `/create` ideation pipeline on both new and existing projects.

| Project | Scenario | Validation |
|---------|----------|-----------|
| `create-new` | Empty project → /init → /create "AI recipe app" | VISION.md, C-REVIEW.md, DECISION.md exist in spec/create/ |
| `create-existing` | Healthcare project → /create "notification system" | Reads spec/PROJECT.md context, outputs to spec/create/ |

Per-project: NCC install → /init → /create → verify output docs → token isolation check → spec conversion test

Reviewer checks 5 categories:
1. Document Quality: VISION.md has Problem/Demand/Target/Value sections
2. C-Level Coverage: C-REVIEW.md has all 5 assessments (CEO/CTO/CPO/CMO/CDO) with verdicts
3. Decision Clarity: DECISION.md has chosen approach + key decisions
4. Token Isolation: After /create, run /spec and verify spec-writer does NOT read spec/create/
5. Spec Conversion: If converted, output is valid /spec command format

### Full Suite (--full)

Runs Phase 1, analyzes issues, then runs Phase 2. Generates consolidated REPORT with cross-phase comparison.

### Security Audit (--security)

For each generated project:
- Read installed `security-reviewer` agent
- Scan all API routes for OWASP Top 10: injection, auth bypass, sensitive data exposure, CSRF
- Check MSW handlers for auth mock bypass patterns
- Check Zod validation coverage
- Output: `SECURITY_REVIEW.md` per project

### Accessibility Audit (--a11y)

For UI-heavy projects (design-system or any with UI components):
- Read installed `browser-tester` agent
- WCAG 2.1 AA checklist per component
- Check: ARIA attributes, keyboard nav, focus management, color contrast
- Check: prefers-reduced-motion respect, semantic HTML, role attributes
- Output: `ACCESSIBILITY_REVIEW.md` per project

### Code Quality Audit (--codequality)

Deep source code analysis across all projects:
- Error handling grade (try/catch, error classification, no silent swallowing)
- Zod validation grade (boundary validation, schema completeness)
- TypeScript strictness (no any, no as unknown, proper inference)
- Composition patterns (Context vs prop drilling, compound components)
- Server/Client discipline ('use client' minimization)
- DRY compliance (no duplicate logic across routes)
- Named constants (no magic numbers/strings)
- Output: code quality table in REPORT

## Review Checklist

### Standard (15 categories, /15 scoring)

| # | Category | What to check |
|---|----------|--------------|
| 1 | Installation | agents 25+, scripts 6+, skills 5+, rules 3, spec/rules 8+, CLAUDE.md |
| 2 | Settings & Hooks | env keys, SessionStart(2), PreToolUse(2), PostToolUse(3), Stop(1) |
| 3 | Skill Selection | core skills vs package.json library matching |
| 4 | Spec Quality | frontmatter (mock, testing, deps), REQ-NNN:, all required sections |
| 5 | Design Quality | Components, State, Data Flow, Technical Decisions |
| 6 | PLAN.md Quality | domain tags, model, wave, MSW tasks, Approved-at, Budget, Team Composition (team mode) |
| 7 | TDD/Mock | MSW handlers for all endpoints, mock:true enforcement, test files |
| 8 | Token Efficiency | file sizes <200 lines, artifact limits, skill budget rules |
| 9 | Code Quality | try/catch, Zod, strict TS, no stubs, Server/Client |
| 10 | Flow Completeness | STATE.md, CONTEXT.md, [x] tasks, TEST_LOG.md |
| 11 | Rules Size | all spec/rules/ <200 lines, no redundancy |
| 12 | Skill Accuracy | manifest vs detected libs, on-demand coverage |
| 13 | Extra Agents | security/a11y/performance/review/loop results |
| 14 | Document Sync | CONTEXT.md consistent after modifications, no stale decisions |
| 15 | Code Quality Detail | error handling grade, composition, naming, DRY |

### Install Test Extended (20 categories, /20 scoring)

All 15 standard categories plus:

| # | Category | What to check |
|---|----------|--------------|
| 16 | Init Completeness | PROJECT.md framework detection, ARCHITECTURE.md structure, STATE.md features |
| 17 | Security & Log Setup | SECURITY_STRATEGY.md, LOG_STRATEGY.md, audit findings quality |
| 18 | Git Workflow | /commit conventional format, REQ linking, no git add -A |
| 19 | Debug & Loop | DEBUG.md hypotheses, LOOP_NOTES.md tracking, /status read-only |
| 20 | Install Method Fidelity | npx: local files + manifest + doctor; marketplace: namespace + plugin paths |

## Report Output

Test artifacts are written to `__plugin-tests__/` during execution:
- Per-project: `TEST_LOG.md`, `REVIEW.md`
- Extra agents: `SECURITY_REVIEW.md`, `ACCESSIBILITY_REVIEW.md`, `PERFORMANCE_REVIEW.md`, `REVIEW_RESULT.md`

After each test run, generate a **key-summary English report** and save it to `reports/REPORT_YYYYMMDD_HHMM.md` (inside this skill directory). The report should contain:
- Date, branch, version, scope
- Score summary table
- Key findings (bullet points, not full prose)
- Critical issues with severity
- Recommendations
- For `--install-test`: installation method comparison table + non-spec-dev feature results

Keep each report under 80 lines. This is the **archival summary** — the raw artifacts in `__plugin-tests__/` have full details.

## Past Reports

Reports are stored in `reports/` directory. **By default, read only the latest report** (highest datetime in filename) to understand current plugin quality baseline. Read older reports only when the user explicitly asks for trend analysis or historical comparison.

| Report | Scope | Score |
| --- | --- | --- |
| `REPORT_20260321_1900.md` | Main branch validation (2 projects) | 9.5/10 avg |
| `REPORT_20260321_1700.md` | R5: Incremental fix-and-retest (3 projects) | 8.7/10 avg |
| `REPORT_20260321_1500.md` | R4: Full suite Phase 1+2 (4+2 projects, 15 categories) | 12.0/15 avg |
| `REPORT_20260321_1300.md` | R3: Monorepo solo vs team (10 features × 2 modes) | Solo 6/10, Team 5/10 |
| `REPORT_20260321_1100.md` | R2: 4 projects × 4 features (post-fix) | 9.0/10 avg |
| `REPORT_20260321_0900.md` | R1: 4 projects × 1 feature (baseline) | 7.5/10 avg |

## NCC Source Path

For dev/Phase 1/Phase 2 modes: `node {NCC_SOURCE}/dist/index.js` (tests current branch build).
For install-test mode: uses published npm version (`npx nextjs-claude-code@latest`) and marketplace.
