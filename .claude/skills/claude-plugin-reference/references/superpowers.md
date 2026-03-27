# Superpowers

- **Repository**: [obra/superpowers](https://github.com/obra/superpowers)
- **Author**: Jesse Vincent (Prime Radiant)
- **Focus**: TDD-focused systematic development workflow
- **Install**: `/plugin install superpowers@claude-plugins-official`
- **License**: MIT
- **Platforms**: Claude Code, Cursor, Codex, OpenCode, Gemini CLI

---

## What It Does

A structured development workflow system that enforces professional practices: test-driven development, systematic debugging, and subagent-driven execution. Skills activate automatically based on context — they function as mandatory workflows, not optional suggestions.

---

## Core Workflow

1. **Brainstorming** — Agent asks clarifying questions (doesn't jump to code), presents designs in digestible sections for approval
2. **Planning** — Creates bite-sized tasks (2-5 min each) with exact file paths and complete code specs
3. **Development** — Subagent-driven execution with two-stage reviews (spec compliance + code quality)
4. **Completion** — Verifies all tests pass, presents merge/PR options

---

## 13+ Skills

### Testing
- **test-driven-development** — Strict RED-GREEN-REFACTOR cycles

### Debugging
- **systematic-debugging** — Four-phase root cause analysis
- **verification-before-completion** — Verify before declaring success

### Collaboration
- **brainstorming** — Structured ideation with approval gates
- **writing-plans** — Bite-sized task creation
- **executing-plans** — Subagent dispatch with reviews
- **subagent-driven-development** — Parallel worker management
- **code-review** — Severity-based blocking

### Infrastructure
- **git-worktrees** — Safe parallel branching
- **branch-finishing** — Clean merge workflows

### Meta
- **writing-skills** — Create new Superpowers skills
- **using-superpowers** — Self-documentation

---

## Key Features

### Automatic Skill Triggering
Skills activate based on context without manual invocation:
- "help me plan this feature" → triggers brainstorming
- "fix this bug" → triggers systematic-debugging
- Writing code → triggers TDD workflow

### Subagent-Driven Development
Fresh subagents handle individual tasks with built-in review mechanisms. Two-stage review checks both spec compliance and code quality.

### Worktree Isolation
Each development session uses git worktrees for safe parallel work — prevents conflicts between concurrent tasks.

### Core Principles
- Write tests first, always (RED-GREEN-REFACTOR)
- Verify before declaring success
- YAGNI (You Aren't Gonna Need It)
- DRY (Don't Repeat Yourself)
- Systematic over ad-hoc

### Autonomous Operation
Claude agents can work independently for hours following the established plan without deviation.

---

## Pros
- TDD enforcement is strongest among all plugins
- Automatic skill triggering reduces cognitive load
- Systematic debugging with structured root cause analysis
- Multi-platform marketplace installation (easiest install)
- Lightweight — 13 focused skills vs 100+ in other plugins
- Strong emphasis on verification before completion

## Cons
- Opinionated about TDD — not ideal if you don't want test-first
- Fewer skills than GSD/ECC — less coverage for non-core workflows
- No deployment pipeline (stops at merge/PR)
- No browser testing (unlike gstack)
- No spec/requirements management phase
- Less customizable — skills are mandatory, not configurable
