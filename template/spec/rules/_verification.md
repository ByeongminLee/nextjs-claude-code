# Verification Protocol

> **Immutable.** Read when running or understanding verification levels.

After every `/dev` completion, the verifier runs automatically with 4 levels:

| Level | Check | Pass Criteria |
|---|---|---|
| 1 — Existence | All planned files exist | Every file in PLAN.md is present |
| 2 — Substantive | No stubs or placeholders | No TODO, empty bodies, dummy values |
| 2b — Tests | Test files exist (if `testing: required`) | Blocking when required; advisory otherwise |
| 3 — Wired | Components/hooks/APIs connected | Imports exist, endpoints called, state propagates |
| 4 — Human | Feature actually works | User confirms in browser |

- Levels 1-3 run automatically; Level 4 triggers `checkpoint:human-verify`
- Level 2b depends on spec.md `testing` frontmatter: `required` = blocking, `optional`/`none` = advisory
- When `testing: required`, lead-engineer writes tests before spawning verifier
- Verifier failures count toward the shared auto-fix budget (3 retries)
- Verifier never modifies code — it only reports
