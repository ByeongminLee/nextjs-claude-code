# Verification Protocol

> **Immutable.** Read when running or understanding verification levels.

After every `/dev` completion, the verifier runs automatically:

| Level | Check | Pass Criteria |
|---|---|---|
| 1 — Existence | All planned files exist | Every file in PLAN.md is present |
| 2 — Substantive | No stubs or placeholders | No TODO, empty bodies, dummy values |
| 2b — Tests | Test files exist (default: blocking) | Blocking when `testing: required` or omitted; advisory when `optional`/`none` |
| 2c — Mocks | Mock infrastructure exists | Blocking when `mock` not `false` AND `api` non-empty; skipped otherwise |
| 3 — Wired | Components/hooks/APIs connected | Imports exist, endpoints called, state propagates |
| 3b — Browser | Snapshot-verified UI test via browser-tester | Failure-classified results, no console errors, 2+ signals per assertion |
| 4 — Human | Feature actually works | User confirms in browser |

- Levels 1-3b run automatically; Level 4 triggers `checkpoint:human-verify`
- Level 3b requires dev server; skipped for backend-only features (`figma: "N/A"` + no UI REQs)
- Level 3b delegates to `browser-tester` agent (sonnet) via HANDOFF with `SCOPE: working-tree`
- Level 3b auto-detects MCP capability tier: Tier A (batched playwright) or Tier B (individual browser_* calls)
- Level 3b classifies failures: `APP_BUG` → failed, `AUTH_BLOCKED` → skipped, `AGENT_ERROR` → inconclusive
- Level 2b depends on spec.md `testing` frontmatter: `required` or omitted (default) = blocking, `optional`/`none` = advisory
- Level 2c depends on spec.md `mock` frontmatter: blocking when `mock` is not `false` AND `api` is non-empty (default); skipped when `mock: false` or `api` is empty
- When `testing: required` (default), lead-engineer writes tests before spawning verifier
- Verifier failures count toward the shared auto-fix budget (3 retries)
- Verifier never modifies code — it only reports

## spec.md Frontmatter Fields (verification-relevant)

| Field | Valid values | Default | Effect |
|-------|-------------|---------|--------|
| `testing` | `required`, `optional`, `none` | `required` | Level 2b: blocking when `required`/omitted, advisory when `optional`/`none` |
| `mock` | `true`, `false` | `true` | Level 2c: blocking when not `false` AND `api` non-empty; skipped when `false` |
| `api` | endpoint list or empty | — | Level 2c: if empty, mock check skipped regardless of `mock` value |
| `figma` | Figma URL or `"N/A"` | — | Level 3b/4: skipped when `"N/A"` + no UI REQs (backend-only) |
