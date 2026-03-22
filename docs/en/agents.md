# Agent Roles

[← Back to README](../../README.md) | [한국어 →](../ko/agents.md)

---

## Core Agents (Workflow)

| Agent | Role | Modifies code | Modifies spec |
|-------|------|:---:|:---:|
| `init` | Codebase analysis, draft spec docs | No | Yes |
| `spec-writer` | Write spec.md + design.md (+ TEST.md if TDD) | No | Yes |
| `planner` | Create CONTEXT.md + PLAN.md, domain analysis + task tagging | No | Yes |
| `lead-engineer` | Orchestrate implementation via fresh-context subagents. Wave-based parallel dispatch. | No (orchestrator) | Partial |
| `verifier` | 4-level verification | No | No |

## Ideation Agents (/create)

| Agent | Role | Skills | Modifies spec |
|-------|------|--------|:---:|
| `create-orchestrator` | 5-phase ideation pipeline, C-suite team orchestration | — | Yes (spec/create/) |
| `c-ceo` | Vision, scope, demand validation, 10-star thinking | investor-materials, investor-outreach | No |
| `c-cto` | Architecture fit, feasibility, tech debt, security | architectures, vercel-react-best-practices | No |
| `c-cpo` | User value, stories, success metrics, UX | pm-product-strategy, brainstorming | No |
| `c-cmo` | Market positioning, messaging, growth potential | marketing-psychology, copywriting | No |
| `c-cdo` | Design, information architecture, AI slop detection | frontend-design, brainstorming | No |
| `brainstormer` | Socratic design exploration, 2-3 approaches | — | No |
| `product-reviewer` | Product gate review (5 dimensions) | — | Yes (PRODUCT_REVIEW.md) |

## Fresh-Context Subagents (/dev)

| Agent | Role | Model | Modifies code |
|-------|------|:---:|:---:|
| `task-executor` | Implements [lead] tasks (types, utils, hooks, API) | sonnet | Yes |
| `task-spec-reviewer` | Per-task spec compliance + code quality review | haiku | No |
| `performance-optimizer` | Core Web Vitals diagnostics | sonnet | No |

## Team Engineers (/dev --team)

| Agent | Role | Model | Modifies code |
|-------|------|:---:|:---:|
| `db-engineer` | Schema, migrations, ORM, queries, RLS | sonnet | Yes (DB only) |
| `ui-engineer` | Components, styling, animations, responsive | sonnet | Yes (UI only) |
| `worker-engineer` | Simple utils, types, config (max 200 lines) | haiku | Yes (assigned file) |

> **Note:** Team mode requires `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` in `.claude/settings.json`.

## Ops Agents

| Agent | Role | Modifies code | Modifies spec |
|-------|------|:---:|:---:|
| `reviewer` | Spec compliance report | No | No |
| `code-quality-reviewer` | Code quality review | No | No |
| `tester` | Test execution + TEST.md | Test files only | Yes |
| `browser-tester` | (experimental) Browser tests + Figma comparison | No | No |
| `committer` | Auto-generate commit messages | No | No |
| `pr-creator` | PR creation + changelog + version bump | CHANGELOG only | Yes |
| `git-strategy-detector` | Branch strategy + templates | No | Yes |
| `log-auditor` | Logging audit and fixes | Fix mode only | No |
| `security-reviewer` | Security audit (OWASP Top 10) | No | No |
| `loop` | Force-complete REQ compliance | Via lead-engineer | Partial |
| `status` | Project status summary | No | No |
| `debugger` | Bug fixing | Yes | Yes |
| `rule-writer` | Manage coding rules | No | Yes |
| `issue-reporter` | Report NCC bugs to GitHub (sanitizes data) | No | No |
