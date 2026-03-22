# Changelog

All notable changes to NCC (nextjs-claude-code) are documented here.

Format based on [Keep a Changelog](https://keepachangelog.com/).

## [1.1.0] - 2026-03-21

### Added
- 6 new on-demand archive skills with condition-based auto-install
- `/plugin-test` skill for E2E plugin testing
- Cross-feature document sync and PLAN approval validation
- API route error handling and code quality rules
- Auto-install on-demand skills based on package.json dependencies
- `/ncc-upgrade` command for upgrading NCC from within Claude Code
- `npx nextjs-claude-code upgrade` CLI command for terminal upgrades

### Changed
- Strengthen DRY rules and prevent dead code
- Compress 5 agent files exceeding 200-line limit
- Consolidate rules and improve team composition enforcement
- Update skills from skills.sh (40/50 fetched)
- Sync README.ko.md and web content with latest features

### Fixed
- Resolve 3 issues from plugin E2E test (TDD mode, spec validation)
- Resolve 3 bugs found in simulation testing
- Fix on-demand condition matching logic

## [1.0.0] - 2026-03-20

### Added
- Spec-Driven Development (SDD) workflow: `/spec`, `/dev`, `/loop`, `/review`
- Core agents: spec-writer, planner, lead-engineer, verifier, init
- Fresh-context subagents: task-executor, task-spec-reviewer
- Team engineers: db-engineer, ui-engineer, worker-engineer (`/dev --team`)
- Ops agents: committer, pr-creator, debugger, tester, reviewer, code-quality-reviewer, status, loop, rule-writer, log-auditor, security-reviewer, browser-tester, cicd-builder, learning-extractor, product-reviewer, git-strategy-detector, performance-optimizer
- Wave-based parallel execution for task dispatch
- Path-specific rules (`.claude/rules/` with `paths` frontmatter)
- Hook profile system: minimal, standard, strict (`NCC_HOOK_PROFILE`)
- SessionStart hooks: repo-profiler, compact-recovery
- PreToolUse hooks: security-guard, deprecation-guard
- PostToolUse hooks: validate-post-write, advisory-post-write, comment-checker
- Stop hooks: todo-enforcer
- Fresh Context execution model for subagents
- Skill budget system and model routing rules
- CLI skill management: skill-list, skill-add, skill-update, skill-suggest
- `npx nextjs-claude-code doctor` health check command
- 11 bundled core skills from skills.sh
- 50+ on-demand skills (condition-based and framework-matched)
- skills-lock.json for integrity tracking
- Resume protocol for interrupted `/dev` sessions
- Auto-fix budget (max 3 retries per mode)
- 4-level verification system
- Checkpoint system (decision, human-verify, auth-gate)
- Astro landing page with EN/KO bilingual support
- GitHub Pages deployment workflow
- Claude Code plugin support (`.claude-plugin/`)

## [0.1.0] - 2026-03-16

### Added
- Initial project scaffold
- Basic CLI installer (`npx nextjs-claude-code`)
- Template-based file copy system
- TanStack Query and Zustand best practices skills
- MIT license
