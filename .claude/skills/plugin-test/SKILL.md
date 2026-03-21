---
name: plugin-test
description: Run NCC plugin E2E tests. Supports quick (4 projects), full (4+monorepo+modifications), or custom test modes. Installs from current dev branch, validates spec→dev flow, skills, hooks, code quality, security, a11y, and token efficiency.
argument-hint: "--quick | --full | --phase1 | --phase2 | --security | --a11y | --codequality | [project-name,...] | (no args = suggest mode)"
context: fork
agent: plugin-test-orchestrator
---

# /plugin-test — NCC Plugin E2E Test Suite

## Usage

```
/plugin-test                    # Interactive — suggest a test mode based on recent changes
/plugin-test --quick            # Phase 1 only: 4 diverse projects × 4 features each
/plugin-test --full             # Phase 1 + Phase 2: full suite including monorepo + cross-feature mods
/plugin-test --phase1           # Phase 1 only (same as --quick)
/plugin-test --phase2           # Phase 2 only: 10-feature monorepo (solo + team)
/plugin-test --security         # Security-focused: run security-reviewer on all generated code
/plugin-test --a11y             # Accessibility-focused: run browser-tester a11y checks on UI projects
/plugin-test --codequality      # Code quality audit: deep analysis of all generated source files
/plugin-test healthcare,marketplace   # Run specific projects only
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

### Phase 2: Large-scale Monorepo (--phase2)

2 identical CRM projects (solo vs team mode), each with:
- 10 features in dependency chain
- 5 cross-feature modifications (api-layer error format, RBAC expansion, tagging, cursor pagination, custom stages)
- Document Sync verification (CONTEXT.md, design.md, history entries)
- Solo vs Team comparison

Features: api-layer → auth-system → contact-management → deal-pipeline → email-integration → activity-feed → reporting → team-workspace → notification-center → admin-settings

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

## Review Checklist (15 categories, /15 scoring)

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

## Report Output

Reports are written to `__plugin-tests__/`:
- `REPORT_N.md` — consolidated report with scoring tables, cross-project analysis, code quality grades, token analysis, and recommendations
- Per-project: `TEST_LOG.md`, `REVIEW.md`
- Extra agents: `SECURITY_REVIEW.md`, `ACCESSIBILITY_REVIEW.md`, `PERFORMANCE_REVIEW.md`, `REVIEW_RESULT.md`

## NCC Source Path

The installer is invoked from the dev build: `node {NCC_SOURCE}/dist/index.js`
This tests the current branch, not the published npm version.
