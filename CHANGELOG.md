# Changelog

All notable changes to NCC (nextjs-claude-code) are documented here.

Format based on [Keep a Changelog](https://keepachangelog.com/).

## [1.2.0] - 2026-03-26

### Added
- `/reforge` command: legacy-to-spec transformation pipeline (5 phases)
- Reforge agents: `reforge-orchestrator`, `codebase-analyzer`, `reforge-spec-generator`
- `> REFORGED` tag support in `/dev` flow (warns before developing auto-generated specs)
- `/create` design direction question (Phase 2, question 6)
- Auto-trigger `learning-extractor` after `/dev` completion (fire-and-forget)
- Level 3b (Browser Verification): snapshot-verified UI check via `browser-tester` agent before human verify
- MCP Capability Tier system: auto-detects Tier A (batched playwright) vs Tier B (individual browser_*) for browser testing
- SCOPE parameter for browser testing depth: `commit` (quick), `working-tree` (verifier), `branch` (thorough /qa)
- `/qa --quick` flag for fast smoke testing (primary flow only)
- Failure classification taxonomy for browser tests: APP_BUG, ENV_ISSUE, AUTH_BLOCKED, TEST_DATA, SELECTOR_DRIFT, AGENT_ERROR
- Playwright MCP auto-configured via `.mcp.json` during install (`npx @playwright/mcp@latest --headless`)
- `doctor.ts` checks for Playwright MCP configuration in `.mcp.json`
- Level 2c (Mock Verification): mock infrastructure check when `mock` not `false` AND `api` non-empty

### Changed
- Token optimization: reforge-orchestrator compressed (redundant constraints removed)
- Remove unused `Edit` tool from reforge-spec-generator
- Remove `worker-engineer` agent — simple tasks now handled by `task-executor` (sonnet)
- Remove `task-spec-reviewer` agent — per-task review eliminated to reduce context pollution in lead-engineer
- Remove per-task review step from `lead-engineer` and `lead-engineer-team-mode` workflows
- Consolidate `code-style.md` + `performance.md` → `conventions.md` (lean single-file reference)
- Remove `[worker]` task tag from planner domain tagging (now `[lead]`, `[db]`, `[ui]` only)
- Verification upgraded from 4-level to 5-level (1, 2, 2b, 2c, 3, 3b, 4)
- Token optimization: extract `_subagent-rules.md` (30-line compact rules for subagents, replaces full `_workflow.md` reads)
- Token optimization: inline skill budget into each agent body (eliminates 10× `_skill-budget.md` reads per /dev)
- Token optimization: planner reads targeted rule files instead of all `spec/rules/`
- Unify checkpoint format: ui-engineer `[UI Verify Items]` → completion report `Human-Verify` field
- Add `browser-tester` to `_agent-roles.md` permission and responsibility matrices
- Add skill directory listing to `conventions.md` for discoverability
- Fix verifier description: "4-level" → "5-level"
- Clarify `_subagent-rules.md` prohibited actions: separate spec files vs orchestrator-only files
- Add `spec.md` frontmatter field reference (`testing`/`mock`/`api`/`figma`) to `_verification.md`
- Expand verifier stub patterns: add `Promise.resolve()`, `as any`, `@ts-ignore`
- Rewrite `browser-tester.md`: snapshot-driven ref-based interaction, batched playwright execution, recovery protocol with escalating evidence, anti-rabbit-hole rules (inspired by millionco/expect)
- `/qa` HANDOFF now includes SCOPE and failure classification in DONE-WHEN criteria
- Verifier Level 3b: SCOPE=working-tree, failure classification handling (APP_BUG→failed, AUTH_BLOCKED→skipped, AGENT_ERROR→inconclusive)

### Fixed
- `/dev` now recognizes both `> DRAFT` and `> REFORGED` auto-generated spec tags
- codebase-analyzer permission scope corrected to include overflow directory
- README: "Six forcing questions" → "Seven", missing CDO in C-level list, non-existent `c-level-reviewer` agent reference, "React native" → "React"
- web/ko: English text in Korean interface translated
- `doctor.ts`: add `_subagent-rules.md` to required rules check
- README/web: verification levels "4 levels" → "5 levels" to match actual 5-level system
- README: remove deleted `worker` engineer reference from `--team` example
- Verifier Level 3b: fix duplicate step numbering (two step "3"s → sequential 1-5)
- Verifier Level 3b: add multi-port detection (3000, 3001, 5173) matching `/qa` skill

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
