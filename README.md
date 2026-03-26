# NCC — nextjs-claude-code

> Spec-Driven AI Development — define and build in just two commands.

Define your feature. Claude builds exactly what the spec says — every change traced back to a requirement.

```
/spec auth "email login"  →  spec.md + design.md
/dev auth                 →  plan → implement → verify → done
```

[한국어 →](docs/ko/README.md)

---

## Two Commands. That's It.

### Specify & Build — `/spec` + `/dev`

The core workflow. Define what to build, then build it — with every change traced to a REQ.

```bash
/spec auth "user login with email and OAuth"   # spec-writer → spec.md + design.md
/dev auth                                       # planner → lead-engineer → verifier → done
/dev auth --team                                # parallel team (db/ui/worker engineers)
/loop auth                                      # review → fix → re-verify until all REQs pass
```

### Don't have a plan yet? → `/create`

Turn a raw idea into a validated product concept. Seven forcing questions sharpen your thinking into a real product — then a virtual C-suite (CEO, CTO, CPO, CMO, CDO) **debates your idea as a team**, catching blind spots before you write a single spec. [Details →](docs/en/create-workflow.md)

```bash
/create "AI recipe app that suggests meals from fridge photos"
# → 7 forcing questions → 3 approaches → C-suite team debate
# → VISION.md + C-REVIEW.md + DECISION.md → convert to /spec
```

### Have a legacy project? → `/reforge`

Transform an existing codebase into spec-driven development. Analyzes legacy code, accepts change specifications, generates feature specs — blending existing logic with requested modifications.

```bash
/reforge ./_legacy/old-project "Switch to App Router, add Tailwind"
# → analysis → change spec → delta → spec generation → validation
# → spec.md + design.md per feature → /dev [feature]
```

### Ops — Review, Test, Ship

Independent commands for quality, security, and deployment. [Full command list →](docs/en/commands.md)

```bash
/review auth      # spec compliance + code quality
/security --audit # OWASP Top 10 project-wide scan
/commit auth      # auto-generate commit with REQ links
/pr auth          # create PR with spec-based body
```

---

## Quick Start

```bash
npx nextjs-claude-code@latest     # install SDD workflow
/init                              # analyze codebase, populate spec docs
/spec auth "user login with email" # define a feature spec
/dev auth                          # implement the feature
```

**Prerequisites**: Node.js >= 18, [Claude Code](https://claude.ai/claude-code)

**Installation guide**: [For Humans](docs/en/installation.md) | For Claude Code: `curl -s https://raw.githubusercontent.com/ByeongminLee/nextjs-claude-code/main/docs/en/installation.md`

---

## Why Spec-Driven?

Features are never completed in a single iteration. You ship a basic checkout, add coupons a month later, then subscriptions, then promotions. At every step you need to know what was built before and what changed.

- **Feature-unit, not change-unit.** Each feature has a fixed location (`spec/feature/[name]/`) that persists throughout the project. Changes accumulate as history entries.
- **Built for progressive development.** Spec, design, and implementation history live together so each iteration builds on the last.
- **Spec accuracy over speed.** spec-writer clarifies before writing, lead-engineer follows a confirmed plan, verifier checks "it works" not just "files exist."

---

## Features

- **Spec-Driven**: REQ-NNN traceability, compliance reporting
- **TDD by default**: MSW API mocking, tests first
- **Curated skills** from [skills.sh](https://skills.sh) — core bundled, on-demand per library
- **Architecture guides** — Flat, Feature-Based, FSD, Monorepo (auto-detected)
- **C-level ideation** — CEO/CTO/CPO/CMO/CDO review pipeline via `/create`
- **Legacy reforge** — `/reforge` transforms existing projects into spec-driven development
- **Next.js + React** — App Router, Server Components, Pages Router, Vite
- **Wave execution** — dependency-grouped parallel dispatch
- **Multi-agent team** — db/ui/worker engineers in `--team` mode
- **Hook profiles** — `minimal` / `standard` / `strict` intensity control
- **Context optimization** — repo profiler, compact recovery, artifact size limits

---

## Workflow

```
User                    Claude Agents              Files
────                    ─────────────              ─────
/create "idea"     ──→  create-orchestrator ──→    spec/create/[name]/VISION.md
                         c-ceo/cto/cpo/cmo/cdo     spec/create/[name]/C-REVIEW.md
                                                   spec/create/[name]/DECISION.md

/reforge [path]    ──→  reforge-orchestrator──→    spec/reforge/[name]/ANALYSIS.md
  "changes"              codebase-analyzer          spec/reforge/[name]/DELTA.md
                         reforge-spec-gen    ──→    spec/feature/[name]/spec.md + design.md

/spec [name] "..." ──→  spec-writer        ──→    spec/feature/[name]/spec.md
                                                   spec/feature/[name]/design.md

/dev [name]        ──→  planner            ──→    spec/feature/[name]/PLAN.md
                            ↓ (user confirms)
                         lead-engineer      ──→    source code
                            ↓ (--team: db/ui/worker)
                         verifier           ──→    verification report
                            ↓
                         completion          ──→    spec/STATE.md + history/
```

---

## Safety

| Feature | Description |
|---------|-------------|
| Checkpoints | `decision` (direction choice), `human-verify` (UI check), `auth-gate` (payment/auth) |
| Auto-fix budget | 3 retries per mode, then escalation |
| Verification | 4 levels: files exist → no stubs → wired correctly → actually works |
| Resume protocol | `/dev` resumes from where it left off (phase-aware) |
| Hook profiles | `minimal` (security only) → `standard` → `strict` (all guards) |
| Token isolation | `/create` docs in `spec/create/`, `/reforge` docs in `spec/reforge/` — never loaded by `/spec` or `/dev` |

---

## Detailed Documentation

- [Commands Reference](docs/en/commands.md) — full command list with options
- [Agent Roles](docs/en/agents.md) — all agents with permissions matrix
- [/create Workflow](docs/en/create-workflow.md) — ideation pipeline details
- [Installation Guide](docs/en/installation.md) — setup instructions

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Plan approval stuck | Re-run `/dev [name]` to restart |
| Auto-fix budget exhausted | Edit `Used: 0` in PLAN.md after manual fixes |
| Team mode not working | Check `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` in settings |
| Hook errors on writes | Set `NCC_HOOK_PROFILE=minimal` in settings |

---

## References

NCC incorporates proven patterns from [GSD](https://github.com/gsd-build/get-shit-done), [gstack](https://github.com/garrytan/gstack), [Everything Claude Code](https://github.com/affaan-m/everything-claude-code), [Oh My OpenAgent](https://github.com/code-yeongyu/oh-my-openagent), [Superpowers](https://github.com/obra/superpowers), [Vercel Plugin](https://github.com/vercel/vercel-plugin), [Spec Kit](https://github.com/github/spec-kit), and [OpenSpec](https://github.com/Fission-AI/OpenSpec).

---

## Contributing

Issues and PRs welcome at [github.com/ByeongminLee/nextjs-claude-code](https://github.com/ByeongminLee/nextjs-claude-code).

---

## License

MIT
