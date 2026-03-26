# Commands Reference

[← Back to README](../../README.md) | [한국어 →](../ko/commands.md)

---

## Ideation & Design

| Command | Description |
|---------|-------------|
| `/create "description"` | Ideation-to-validation pipeline. Forcing questions → alternative approaches → C-level review (CEO/CTO/CPO/CMO/CDO) → validated concept. Optionally converts to `/spec` input. [Details →](create-workflow.md) |
| `/brainstorm "description"` | Quick design exploration. Socratic questioning → 2-3 approaches with trade-offs → spec-ready summary. |
| `/reforge "[path]" "changes"` | Legacy-to-spec transformation. 5-phase pipeline: analysis → change spec → delta → spec generation → validation. |

## Core Workflow

| Command | Description |
|---------|-------------|
| `/spec [name] "desc"` | Define a feature spec. Clarifies requirements, writes `spec/feature/[name]/spec.md` + `design.md`. |
| `/dev [name]` | Implement a feature (solo mode). Planner → lead-engineer → verifier. |
| `/dev [name] --team` | Implement with parallel team. Lead-engineer orchestrates db/ui/worker engineers. |
| `/loop [name]` | Review → fix → re-verify until all REQs pass (max 5 iterations). |

## Review & Quality

| Command | Description |
|---------|-------------|
| `/review [name]` | Spec compliance + code quality review. Conditionally runs tester, log-auditor, security-reviewer if strategy files exist. |
| `/qa` | Playwright E2E tests, visual regression, accessibility audits. `--visual` for screenshots. `--a11y` for axe-core. |
| `/test [name]` | Run tests per TEST_STRATEGY.md. `--browser` for visual tests. `--setup` to configure. |
| `/log [name]` | Audit logging practices. `--audit` for project-wide. `--setup` to configure. |
| `/security [name]` | Security audit (OWASP Top 10). `--audit` project-wide. `--diff` changed files. `--setup` to configure. |

## Git & Release

| Command | Description |
|---------|-------------|
| `/commit [name]` | Auto-generate commit message from diff. Links to REQ numbers. Follows commit convention. |
| `/pr [name] [target]` | Create PR with spec-based body. Auto-detects target branch. Updates changelog + version. |

## Dev Utilities

| Command | Description |
|---------|-------------|
| `/init` | First-time codebase analysis. Detects framework, libraries, generates PROJECT.md, ARCHITECTURE.md, STATE.md. |
| `/debug "description"` | Hypothesis-driven bug analysis. Records process in `spec/DEBUG.md`. |
| `/status` | Project status summary from `spec/STATE.md`. Read-only. |
| `/rule "description"` | Add or update coding rules in `spec/rules/`. |

## Infrastructure

| Command | Description |
|---------|-------------|
| `/cicd` | (experimental) CI/CD pipeline setup. Uses find-skills for platform discovery. |

## Issue Reporting

| Command | Description |
|---------|-------------|
| `/issue-reporter "desc"` | Report NCC bug or feature request to GitHub. Sanitizes all project data before submission. |

## Skill Management (CLI)

| Command | Description |
|---------|-------------|
| `npx nextjs-claude-code skill-list` | Show available and installed skills |
| `npx nextjs-claude-code skill-add [name]` | Install a specific skill |
| `npx nextjs-claude-code skill-update` | Update all installed skills |
| `npx nextjs-claude-code skill-suggest` | Suggest skills based on package.json dependencies |

## Upgrade

| Command | Description |
|---------|-------------|
| `/ncc-upgrade` | Upgrade NCC from within Claude Code. Auto-detects plugin vs npx. |
| `npx nextjs-claude-code upgrade` | Upgrade NCC from terminal (npx installations only). |
| `/ncc-help` | NCC usage help and version info. |
| `npx nextjs-claude-code doctor` | Health check for installation integrity. |

**Updated on upgrade:** agents, hooks, scripts, rules, skills, CLAUDE.md block, settings.json (merged).
**Preserved:** `spec/feature/`, `spec/STATE.md`, CLAUDE.md user content, `skills-lock.json`.
