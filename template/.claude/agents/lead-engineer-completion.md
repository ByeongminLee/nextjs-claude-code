# Lead Engineer — Completion & Checkpoint Reference

> Read when a checkpoint is triggered OR when all tasks in PLAN.md are marked [x].

## Checkpoint Protocol

**`checkpoint:decision`** — implementation direction unclear
```
[checkpoint:decision]
Situation: [describe the ambiguity]
Options:
  A) [option] — [tradeoffs]
  B) [option] — [tradeoffs]
Which approach should I take?
```

**`checkpoint:human-verify`** — UI implementation complete
```
[checkpoint:human-verify]
UI implementation complete for: [feature/component name]
Please verify in browser:
  - [ ] [specific thing to check]
Reply "done" when verified, or describe any issues.
```

**`checkpoint:auth-gate`** — manual action required
```
[checkpoint:auth-gate]
Manual action required: [describe what needs to be done manually]
This cannot be automated. Please complete the action and reply "done".
```

### Checkpoint behavior
- Checkpoints are **blocking** — waits for user input.
- `checkpoint:auth-gate` is **never skippable**.
- Others can be skipped with "skip" — record in CONTEXT.md.

## TDD mode integration (default)

TDD is the default development approach. If `spec/TEST_STRATEGY.md` exists with `approach: tdd` AND `spec/feature/[name]/TEST.md` exists:
- Read TEST.md before starting tasks
- Write test code FIRST (failing tests per Red-Green-Refactor), then implement to pass
- When `mock: true` (default), use MSW handlers in tests to mock API calls

## On completion

1. Verify all tasks in PLAN.md are checked `[x]`
2. **Post-dev test generation** — if `spec/TEST_STRATEGY.md` has `approach: post-dev`:
   - Spawn `tester` agent:
     ```
     [HANDOFF]
     TO: tester (sonnet)
     TASK: Generate tests for feature "[feature-name]" (post-dev mode)
     DONE-WHEN:
       - TEST.md created in spec/feature/[feature-name]/
       - Test files created and passing
     MUST-NOT:
       - Modify implementation code
     READS:
       - spec/feature/[feature-name]/spec.md
       - spec/feature/[feature-name]/PLAN.md
     [/HANDOFF]
     ```
3. **Check testing requirement** from spec.md frontmatter `testing` field:
   - `required` or missing (default) → run tests (unit + E2E per spec/rules/testing.md)
   - `optional` → advisory, skip to verification
   - `none` → skip to verification
4. Update STATE.md phase to `verifying`
5. Spawn `verifier` agent (read model from PLAN.md `## Model Assignment`):
   ```
   [HANDOFF]
   TO: verifier ({model from PLAN.md})
   TASK: Verify feature "[feature-name]" implementation
   DONE-WHEN:
     - Level 1-3 all pass
     - Level 4 checkpoint:human-verify presented
   MUST-NOT:
     - Modify any file
   READS:
     - spec/feature/[feature-name]/PLAN.md
     - spec/feature/[feature-name]/spec.md
   [/HANDOFF]
   ```
6. If verifier fails: apply fix (counts toward auto-fix budget), re-spawn verifier
7. After verification passes: move feature to `## Completed` in STATE.md with date
8. Write history entry `spec/feature/[name]/history/YYYY-MM-DD-[description].md`
9. Reset CONTEXT.md to: `# Context\n\nNo active context.`
