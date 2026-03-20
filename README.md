# NCC — nextjs-claude-code

> Spec-Driven AI Development workflow for Next.js & React — from spec to shipped with Claude Code.

Define your feature. Claude builds exactly what the spec says — with every change traced back to a requirement.

[한국어 →](docs/README.ko.md)

---

## Features

- **Spec-Driven**: Feature specs with REQ-NNN traceability, compliance reporting
- **TDD by default**: Test-Driven Development with MSW API mocking out of the box — tests first, then implementation
- **Curated skills** from [skills.sh](https://skills.sh) (community skill registry for Claude Code) — bundled core skills installed automatically, on-demand skills for library-specific best practices. Includes React, Next.js, UI/UX, testing patterns
- **Architecture guides** — Flat, Feature-Based, FSD, Monorepo (auto-detected from project structure; refined via `/init`)
- **Library-aware agents** — agents read your selected stack and follow its patterns
- **Next.js native** — App Router, Server Components, Server Actions, Pages Router
- **React support** — Vite and other React setups
- **Monorepo ready** — detects monorepo patterns (Turborepo, apps/packages) and adapts skills/rules during `/init`
- **Claude Code native** — slash commands, multi-agent coordination, PostToolUse hooks (validation scripts that run after Claude writes or edits files)

---

## Prerequisites

- Node.js >= 18
- [Claude Code](https://claude.ai/claude-code) installed and configured

---

## Installation

**For Humans** — [Installation Guide](docs/installation.md)

**For Claude Code** — fetch the guide and follow it:

```bash
curl -s https://raw.githubusercontent.com/ByeongminLee/nextjs-claude-code/main/docs/installation.md
```

---

## Quick Start

```bash
npx nextjs-claude-code@latest     # install SDD workflow
/init                              # analyze codebase, populate spec docs
/spec auth "user login with email" # define a feature spec
/dev auth                          # implement the feature
```

---

## Why SDD?

Features are never completed in a single iteration. You ship a basic checkout, add coupons a month later, then subscriptions, then promotions. At every step you need to know what was built before, what the current spec looks like, and what changed.

Existing spec-driven tools like Spec-kit and OpenSpec work well for independent changes, but their change-based folder structure makes it hard to see how a single feature evolves over time.

```bash
/spec payment-coupon "add coupon support to payment, Figma: https://..."   # define the spec
/dev payment-coupon                                                         # implement
```

- **Feature-unit, not change-unit.** Each feature has a fixed location (`spec/feature/[name]/`) that persists throughout the project lifetime. Changes accumulate as history entries.
- **Built for progressive development.** Spec, design, and implementation history live together so each iteration builds on the last — not from scratch.
- **Spec accuracy over speed.** spec-writer clarifies before writing, lead-engineer follows a confirmed plan, verifier checks "it works" not just "files exist."

### Who is this for?

NCC is optimized for teams that **iteratively implement confirmed specs on a feature-by-feature basis**. It is for teams whose features keep evolving after launch — where a single payment feature grows from basic checkout to coupons to subscriptions to promotions over months.

---

## Workflow

The core SDD loop — define what to build, then build it.

```
/spec [name] "describe the feature"   →  spec-writer clarifies → writes spec.md + design.md
/dev  [name]                           →  planner → lead-engineer → verifier → done
/dev  [name] --team                    →  planner → lead-engineer (+ db/ui/worker team) → verifier → done
/loop [name]                           →  review → fix → re-verify → repeat until all REQs pass
```

```
User                    Claude Agents              Files
────                    ─────────────              ─────
/spec [name] "..."  ──→  spec-writer       ──→    spec/feature/[name]/spec.md
                                                   spec/feature/[name]/design.md

/dev [name]         ──→  planner           ──→    spec/feature/[name]/CONTEXT.md (WHY)
                            │                      spec/feature/[name]/PLAN.md (WHAT)
                            ↓ (after user confirms)
                         lead-engineer     ──→    source code
                            │  (--team: spawns db/ui/worker engineers)
                            ↓
                         verifier           ──→    (read-only verification)
                            │
                            ↓ (after verification)
                         lead-engineer     ──→    spec/feature/[name]/history/
                                                   spec/STATE.md

/review [name]      ──→  reviewer          ──→    (spec compliance report)
                         code-quality-     ──→    (code quality report)
                         reviewer

/loop [name]        ──→  loop              ──→    reviewer (REQ check)
                            │                      ↓ (if failing REQs)
                            ↓                     lead-engineer (targeted fix)
                         (repeat, max 5)           ↓ (re-verify)
                            ↓                     verifier (Level 1-3)
                         done or escalation        spec/feature/[name]/history/

/status             ──→  status            ──→    (read-only report)

/debug "..."        ──→  debugger          ──→    spec/DEBUG.md
                                                   spec/STATE.md

/rule "..."         ──→  rule-writer       ──→    spec/rules/[topic].md
```

---

## Ops

Independent commands — use any of them whenever you need.

### Review & Quality

| Command | Description |
|---------|-------------|
| `/review [name]` | Spec compliance + code quality review across the entire feature (cross-task integration). Conditionally runs tester, log-auditor, and security-reviewer if their strategy files exist (TEST_STRATEGY.md / LOG_STRATEGY.md / SECURITY_STRATEGY.md). |
| `/loop [name]` | Repeat review → fix → re-review until all REQs pass (max 5 iterations). |
| `/test [name]` | Run tests based on TEST_STRATEGY.md. `--browser` for visual tests + Figma comparison. `--setup` to configure. |
| `/log [name]` | Audit logging practices. `--audit` for project-wide scan. `--setup` to configure LOG_STRATEGY.md. |
| `/security [name]` | Security audit (OWASP Top 10). `--audit` for project-wide scan. `--diff` for changed files only. `--setup` to configure SECURITY_STRATEGY.md. |

### Git & Release

| Command | Description |
|---------|-------------|
| `/commit [name]` | Auto-generate commit message from diff, following commit convention. Links to REQ numbers. |
| `/pr [name] [target]` | Create PR with spec-based body. Auto-detects target branch. Updates changelog + version if enabled. |

### Infrastructure

| Command | Description |
|---------|-------------|
| `/cicd` | (experimental) Set up CI/CD pipeline. Uses find-skills for platform-specific skill discovery. Generates spec/CICD.md. |

### Dev Utilities

| Command | Description |
|---------|-------------|
| `/init` | Analyze codebase structure, detect framework and libraries, generate PROJECT.md (tech stack), ARCHITECTURE.md (architecture pattern), and STATE.md. Run once after install. |
| `/debug "..."` | Hypothesis-driven bug analysis. Records process in spec/DEBUG.md. |
| `/status` | Project status summary from spec/STATE.md. |
| `/rule "..."` | Add or update coding rules in spec/rules/. |

### Skill Management

| Command | Description |
|---------|-------------|
| `npx nextjs-claude-code skill-list` | Show available and installed skills |
| `npx nextjs-claude-code skill-add [name]` | Install a specific skill |
| `npx nextjs-claude-code skill-update` | Update all installed skills to latest |
| `npx nextjs-claude-code skill-suggest` | Suggest skills based on package.json dependencies |

---

## Agent Roles

### Core Agents (Workflow)

| Agent | Role | Modifies code | Modifies spec docs |
|-------|------|:---:|:---:|
| `init` | Codebase analysis, draft spec docs | No | Yes |
| `spec-writer` | Write spec.md + design.md (+ TEST.md if TDD) | No | Yes |
| `planner` | Create CONTEXT.md + PLAN.md, domain analysis + task tagging | No | Yes |
| `lead-engineer` | Implement features (solo or team leader) | Yes | Partial (STATE, history) |
| `verifier` | 4-level verification | No | No (read-only) |

### Team Engineers (`/dev --team`)

| Agent | Role | Model | Modifies code |
|-------|------|:---:|:---:|
| `db-engineer` | Schema, migrations, ORM, queries, RLS | sonnet | Yes (DB files only) |
| `ui-engineer` | Components, styling, animations, responsive | sonnet | Yes (UI files only) |
| `worker-engineer` | Simple utils, types, config (≤200 lines) | haiku | Yes (assigned file only) |

> **Note:** Team mode requires `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` environment variable. npx install sets this in `.claude/settings.json`; plugin install provides it via `plugin.json` env.

### Ops Agents

| Agent | Role | Modifies code | Modifies spec docs |
|-------|------|:---:|:---:|
| `reviewer` | Spec compliance report | No | No (read-only) |
| `code-quality-reviewer` | Code quality review | No | No (read-only) |
| `tester` | Test execution + TEST.md management | Creates test files only | Yes (TEST.md) |
| `browser-tester` | (experimental) Browser tests + Figma comparison | No | No (read-only) |
| `committer` | Auto-generate commit messages | No | No |
| `pr-creator` | PR creation + changelog + version bump | No (CHANGELOG.md + version only) | Yes (CHANGELOG.md) |
| `git-strategy-detector` | Detect branch strategy + generate templates | No | Yes (GIT_STRATEGY.md) |
| `log-auditor` | Logging audit and fixes | Fix mode only (`/log [name]`) | No (read-only) |
| `security-reviewer` | Security audit (OWASP Top 10) | No | No (read-only) |
| `cicd-builder` | (experimental) CI/CD pipeline generation | Yes | Yes (CICD.md) |
| `loop` | Force-complete REQ compliance | Yes (via lead-engineer) | Partial (STATE, history) |
| `status` | Project status summary | No | No (read-only) |
| `debugger` | Bug fixing | Yes | Yes (DEBUG.md) |
| `rule-writer` | Manage coding rules | No | Yes (spec/rules/) |

---

## Safety Features

### Checkpoints

lead-engineer pauses at these conditions and waits for user confirmation:

| Type | Condition | Action |
|------|-----------|--------|
| `checkpoint:decision` | Implementation direction choice needed, type structure changes | Present options, wait for user |
| `checkpoint:human-verify` | UI implementation complete, verification Level 1-3 passed | Request browser verification, wait |
| `checkpoint:auth-gate` | Payment/auth manual action required | Always stop, never simulate |

### Auto-fix Budget

Maximum 3 retries per mode:
- **`/dev`**: shared across the entire session (persists between sessions)
- **`/loop`**: resets per iteration (independent budget per iteration)
- **`/debug`**: per bug

```
Attempt 1: Error analysis → targeted fix
Attempt 2: Alternative approach
Attempt 3: Minimal change
Exceeded: [Escalation] Implementation halted, report to user
```

### Verification Levels

All `/dev` completions auto-trigger the verifier:

| Level | Check | Method |
|-------|-------|--------|
| 1 | All planned files exist | File existence check |
| 2 | No stubs or placeholders | grep for TODO, empty functions, dummy values |
| 2b | Test files exist (default: blocking) | Blocking if `testing: required` or omitted (default), warning if `optional`/`none` |
| 3 | Components/hooks/APIs wired correctly | Import and call tracing |
| 4 | Actually works | Browser direct verification |

### Resume Protocol

If `/dev` is interrupted (session crash, timeout, context limit), running `/dev` again resumes from where it left off:

- `spec/STATE.md` tracks each feature's phase independently: `idle` → `planning` → `executing` → `verifying` → `idle` (or `looping` during `/loop`)
- `/dev` reads the feature's phase and routes to the appropriate agent instead of restarting from scratch
- Completed tasks (`- [x]`) in `spec/feature/[name]/PLAN.md` are skipped on resume
- Auto-fix budget (`Used: N`) persists across sessions
- If spec.md was modified after PLAN.md was created, a warning is shown with a re-planning suggestion
- **Model routing**: sonnet by default, haiku for small/mechanical tasks (verifier, cleanup, simple fixes). Opus is never used. See `spec/rules/_model-routing.md` for criteria.

| Phase | Resume behavior |
|-------|----------------|
| `idle` | Fresh start → planner |
| `planning` | Check PLAN.md status → continue or advance to lead-engineer |
| `executing` | Skip completed tasks (`- [x]`) → continue from first `- [ ]` |
| `verifying` | Re-run verifier via lead-engineer |
| `looping` | Read LOOP_NOTES.md and resume from current iteration |

### Additional safeguards

- **Spec validation**: PostToolUse hooks block malformed spec.md and design.md writes
- **Spec reflection**: advisory hook reminds you to update the spec when code changes add new exports or routes
- **Plan staleness check**: `/dev` warns if spec.md has been modified since the feature's PLAN.md was created
- **Branch strategy awareness**: `/commit` and `/pr` auto-detect branch strategy and enforce commit conventions
- **Conditional review agents**: tester, log-auditor, and security-reviewer only join `/review` when their strategy files exist (TEST_STRATEGY.md, LOG_STRATEGY.md, SECURITY_STRATEGY.md)
- **Changelog automation**: `/pr` auto-updates CHANGELOG.md and bumps package.json version based on commit types (Semantic Versioning)

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Plan approval stuck at "pending" | Re-run `/dev [name]` to restart the planning flow |
| Auto-fix budget exhausted | Lead-engineer stops after 3 attempts. Review the error manually and provide guidance. To reset budget after manual fixes, edit `Used:` to `0` in PLAN.md |
| Team mode not working | Verify `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` is set in `.claude/settings.json` |
| Spec validation blocking writes | Check that section headers match the expected format (English or Korean) |
| Hook errors on every file write | Edit `.claude/settings.json` to remove or disable specific hooks |
| Spec changed after planning | Re-run `/dev [name]` — it detects spec staleness and suggests re-planning |

---

## Contributing

Issues and PRs welcome at [github.com/ByeongminLee/nextjs-claude-code](https://github.com/ByeongminLee/nextjs-claude-code).

Found a bug or have a feature request? [Open an issue](https://github.com/ByeongminLee/nextjs-claude-code/issues).

---

## License

MIT
