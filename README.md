# NCC — nextjs-claude-code

> Spec-Driven AI Development workflow for Next.js & React — from spec to shipped with Claude Code.

Define your feature. Claude builds exactly what the spec says — with every change traced back to a requirement.

[한국어 →](docs/README.ko.md)

---

## Features

- **Spec-Driven**: Feature specs with REQ-NNN traceability, compliance reporting
- **Curated skills** from skills.sh — includes React, Next.js, UI/UX, testing, and library-specific best practices
- **Architecture guides** — Flat, Feature-Based, FSD, Monorepo (chosen by team size)
- **Library-aware agents** — agents read your selected stack and follow its patterns
- **Next.js native** — App Router, Server Components, Server Actions, Pages Router
- **React support** — Vite and other React setups
- **Monorepo ready** — Turborepo workspace-aware installation
- **Claude Code native** — slash commands, agent orchestration, PostToolUse hooks

---

## Installation

**For Humans** — [Installation Guide](docs/installation.md)

**For Claude Code** — fetch the guide and follow it:

```bash
curl -s https://raw.githubusercontent.com/ByeongminLee/nextjs-claude-code/main/docs/installation.md
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
- **Spec accuracy over speed.** spec-writer clarifies before writing, executor follows a confirmed plan, verifier checks "it works" not just "files exist."

### Who is this for?

NCC is optimized for teams that **iteratively implement confirmed specs on a feature-by-feature basis**. It is for teams whose features keep evolving after launch — where a single payment feature grows from basic checkout to coupons to subscriptions to promotions over months.

---

## Workflow

```
/spec [name] "describe the feature"   →  spec-writer clarifies → writes spec.md + design.md
/dev  [name]                           →  planner → executor → verifier → done
/loop [name]                           →  reviewer → targeted fix → re-review → repeat until 100%
```

### How It Works

```
User                    Claude Agents              Files
────                    ─────────────              ─────
/spec [name] "..."  ──→  spec-writer       ──→    spec/feature/[name]/spec.md
                                                   spec/feature/[name]/design.md

/dev [name]         ──→  planner           ──→    spec/feature/[name]/CONTEXT.md (WHY)
                            │                      spec/feature/[name]/PLAN.md (WHAT)
                            ↓ (after user confirms)
                         executor           ──→    source code
                            │
                            ↓
                         verifier           ──→    (read-only verification)
                            │
                            ↓ (after verification)
                         executor           ──→    spec/feature/[name]/history/
                                                   spec/STATE.md

/review [name]      ──→  reviewer           ──→    (spec compliance report)
                         code-quality-       ──→    (code quality report)
                         reviewer

/loop [name]        ──→  loop              ──→    reviewer (REQ check)
                            │                      ↓ (failing REQs)
                            ↓                     executor (targeted fix)
                         (repeat, max 5)           ↓ (re-review)
                            ↓                     verifier (Level 1-4)
                         done or escalation        spec/feature/[name]/history/

/status             ──→  status             ──→    (read-only report)

/debug "..."        ──→  debugger           ──→    spec/DEBUG.md
                                                   spec/STATE.md

/rule "..."         ──→  rule-writer        ──→    spec/rules/[topic].md
```

## Agent Roles

| Agent                  | Role                                  | Modifies code |    Modifies spec docs    |
| ---------------------- | ------------------------------------- | :-----------: | :----------------------: |
| `init`                 | Codebase analysis, draft spec docs    |      No       |           Yes            |
| `spec-writer`          | Write spec.md + design.md             |      No       |           Yes            |
| `planner`              | Create CONTEXT.md + PLAN.md           |      No       |           Yes            |
| `executor`             | Implement features                    |      Yes      | Partial (STATE, history) |
| `verifier`             | 4-level verification                  |      No       |      No (read-only)      |
| `reviewer`             | Spec compliance report                |      No       |      No (read-only)      |
| `code-quality-reviewer`| Code quality review                   |      No       |      No (read-only)      |
| `status`               | Project status summary                |      No       |      No (read-only)      |
| `debugger`             | Bug fixing                            |      Yes      |      Yes (DEBUG.md)      |
| `rule-writer`          | Manage coding rules                   |      No       |    Yes (spec/rules/)     |
| `loop`                 | Force-complete REQ compliance         |  Yes (via executor)  | Partial (STATE, history) |

---

## Safety Features

- **Auto-fix budget**: Maximum 3 retries per mode. `/dev`: shared across the session. `/loop`: resets per iteration. `/debug`: per bug.
- **Checkpoint protocol**: pauses at decision points, UI verification, auth gates
- **Multi-feature state**: `spec/STATE.md` tracks multiple features independently — switch between features without losing progress
- **Resume protocol**: interrupted `/dev` and `/loop` sessions resume from where they left off — each feature's phase (`planning`, `executing`, `verifying`, `looping`) is tracked independently in STATE.md
- **4-level verification**: file existence → no stubs → tests (conditional) → wired correctly → human check
- **Spec validation**: PostToolUse hooks block malformed spec.md and design.md writes
- **Spec reflection**: advisory hook reminds you to update the spec when code changes add new exports or routes
- **Plan staleness check**: `/dev` warns if spec.md has been modified since the feature's PLAN.md was created
- **Model routing**: agents use sonnet by default, haiku for small/mechanical tasks (verifier, cleanup, simple fixes). Opus is never used. See `.claude/RULE.md` Model Routing for criteria.

---

## Contributing

Issues and PRs welcome.

---

## License

MIT
