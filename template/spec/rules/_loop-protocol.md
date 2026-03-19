# Loop Protocol

> **Immutable.** Read when running `/loop` or understanding loop behavior.

`/loop` enforces REQ-level compliance through iterative review -> fix cycles:

```
/loop "feature name"
  -> reviewer checks each REQ (PASS/FAIL)
  -> lead-engineer fixes only failing REQs (with context from previous attempts)
  -> cleanup included in fix step (console.log, commented-out code, unused imports)
  -> update LOOP_NOTES.md with results and next strategy
  -> re-review
  -> repeat until 100% or max iterations
```

- Default max iterations: **5** (configurable via `max-iterations` in spec.md frontmatter)
- Each iteration has its own auto-fix budget of 3 (resets per iteration)
- Only failing REQs are targeted — passing code is never modified
- If max iterations reached with failing REQs: stop and report to user
- Resumable: if interrupted, re-running reads LOOP_NOTES.md to continue

## Cross-iteration context

`spec/feature/[name]/LOOP_NOTES.md`:
- Updated after each iteration with REQ status, failure analysis, and next strategy
- Prevents repeating the same failed approach across iterations
- Deleted on loop completion; kept on exhaustion (useful for manual debugging)

## Cleanup rules (integrated into fix step)

The fix step's DONE-WHEN includes cleanup. After fixing failing REQs, also ensure:
- No `console.log` in changed files
- No commented-out code in changed files
- No unused imports in changed files
- Cleanup does NOT count toward auto-fix budget

| Phase in STATE.md | Meaning |
|---|---|
| `looping` | Loop agent is running review -> fix cycles |
