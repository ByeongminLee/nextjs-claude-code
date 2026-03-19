# Loop — Completion Reference

> Read when all REQs pass (step 7) or max iterations reached (step 8).

## On success (all REQs pass)

After all REQs pass, run verification (Level 1-3) before declaring completion:
- Spawn `verifier` agent:
  ```
  [HANDOFF]
  TO: verifier (haiku)
  TASK: Verify feature "[name]" post-loop implementation
  DONE-WHEN:
    - Level 1-3 all pass
  MUST-NOT:
    - Modify any file
  READS:
    - spec/feature/[name]/PLAN.md
    - spec/feature/[name]/spec.md
  [/HANDOFF]
  ```
- If verifier fails and auto-fix budget is still available for this iteration: apply fix and re-verify
- If verifier fails and auto-fix budget is exhausted: exit with partial success — report: `All REQs passed review but verification failed with budget exhausted. Failing verification: [details]. Manual fix needed.` Update STATE.md to `idle` with failing verification info.
- Level 4 (human-verify) is optional in `/loop` — ask user: "All REQs pass and Level 1-3 verified. Would you like to do a browser check (Level 4)?" (Level 4 is mandatory in `/dev` flow but optional in `/loop` since the user has already seen the feature iterating.)

```
[Loop Complete — All REQs Satisfied]

Feature: [name]
Iterations: N/5
Verification: Level 1-3 passed
Final status:
  REQ-001: PASS
  REQ-002: PASS
  REQ-003: PASS

All requirements in spec.md are implemented and verified.
```

- Update `spec/STATE.md`:
  - Move feature from `## Features` to `## Completed` with date
- Write history entry to `spec/feature/[name]/history/YYYY-MM-DD-loop-complete.md`
- Delete `spec/feature/[name]/LOOP_NOTES.md` (no longer needed)

## On max iterations reached (some REQs still failing)

```
[Loop Exhausted — Max Iterations Reached]

Feature: [name]
Iterations: 5/5
Passing: X/Y REQs
Still failing:
  REQ-002: [reason from last review]
  REQ-005: [reason from last review]

Previous attempts summary:
  [condensed history from LOOP_NOTES.md]

These requirements could not be automatically resolved.
Manual intervention required.
```

- Update `spec/STATE.md`:
  - Change the feature's phase: `### [feature-name] [idle]`
  - Add failing REQs info under the feature entry
- Keep `spec/feature/[name]/LOOP_NOTES.md` intact — it contains valuable failure context for manual debugging
- Do NOT write a completion history entry (feature is not complete)
