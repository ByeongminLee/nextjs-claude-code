# gstack

- **Repository**: [garrytan/gstack](https://github.com/garrytan/gstack)
- **Author**: Garry Tan (Y Combinator President & CEO)
- **Focus**: Virtual engineering team with sprint-based workflow
- **Install**: `git clone https://github.com/garrytan/gstack.git ~/.claude/skills/gstack && cd ~/.claude/skills/gstack && ./setup`
- **License**: MIT
- **Platforms**: Claude Code, Codex, Gemini CLI, Cursor

---

## What It Does

Transforms Claude Code into a virtual engineering team with specialized personas (CEO, engineering manager, designer, QA lead). Enforces a sprint workflow: Think → Plan → Build → Review → Test → Ship → Reflect. Built by someone who shipped 600k+ lines in 60 days.

---

## 25 Skills by Category

### Planning & Strategy
- **`/office-hours`** — Forcing questions before coding; reframes problems
- **`/plan-ceo-review`** — Scope review with 4 modes (expansion, selective, hold, reduction)
- **`/plan-eng-review`** — Locks architecture with data flow diagrams and edge cases
- **`/plan-design-review`** — Rates design dimensions 0-10, identifies AI slop

### Building & Design
- **`/design-consultation`** — Complete design systems with creative risk analysis
- **`/design-review`** — Audits and fixes design issues with atomic commits

### Quality & Testing
- **`/review`** — Staff engineer review catching production bugs
- **`/qa`** — Real browser testing (Chromium) with automated bug fixes + regression tests
- **`/qa-only`** — Pure bug reporting without code changes
- **`/investigate`** — Root-cause debugging with hypothesis testing
- **`/benchmark`** — Performance baselines and bundle size tracking

### Deployment & Monitoring
- **`/ship`** — Syncs main, runs tests, audits coverage, opens PR
- **`/land-and-deploy`** — Merges PR, waits for CI/deploy, verifies production health
- **`/canary`** — Post-deploy error and performance regression monitoring
- **`/document-release`** — Auto-updates all project documentation

### Utilities
- **`/browse`** — Real Chromium browser with ~100ms latency
- **`/setup-browser-cookies`** — Import cookies from host browsers
- **`/retro`** — Weekly retrospectives with per-person shipping metrics
- **`/codex`** — Independent OpenAI Codex review (second opinion)
- **`/careful`** / **`/freeze`** / **`/guard`** — Safety layers (warnings, scope limits, combined)

---

## Key Features

### Real Browser Testing
`/qa` launches real Chromium, navigates pages, finds bugs, fixes them, and auto-generates regression tests. `$B handoff`/`$B resume` for CAPTCHA/MFA.

### Parallel Sprint Support
Integrates with Conductor for 10-15 isolated workspaces simultaneously, each with independent sprints on different features/branches.

### Cross-Model Analysis
`/codex` provides independent OpenAI review — overlapping findings across Claude and OpenAI strengthen confidence.

### Three-Tier Safety
- `/careful` — Warnings before destructive commands
- `/freeze` / `/unfreeze` — Restrict edits to specific directories
- `/guard` — Combined activation

### Auto-Detect Platform
Supports Fly.io, Render, Vercel, Netlify, Heroku, GitHub Actions for deployment.

---

## Pros
- Role-based skills mirror real engineering team dynamics
- Real browser testing (not simulated) catches visual/interaction bugs
- Production deployment pipeline (ship → land → canary → document)
- Cross-model verification with `/codex`
- Battle-tested: 600k+ lines, 362 commits in 7 days
- Privacy-first: opt-in telemetry, never captures code

## Cons
- Requires Bun v1.0+ (additional dependency)
- Browser testing requires Chromium installation
- Skill interdependency means skipping steps may cause issues
- No explicit spec/requirements management (assumes you know what to build)
- Git clone installation (not npm/plugin marketplace)
- Opinionated about sprint structure
