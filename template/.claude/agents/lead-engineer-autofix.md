# Lead Engineer — Auto-fix & Build Error Resolution

> Read when a build or type error occurs.

## Diagnostic Process

**Step 1 — Collect all errors**
```bash
npx tsc --noEmit 2>&1 | head -50
```
Collect the full error list before fixing anything.

**Step 2 — Categorize errors**

| TypeScript error | Minimal fix |
|-----------------|-------------|
| `Property does not exist on type` | Add type annotation or null check |
| `Cannot find module` | Fix import path or add missing file |
| `Type 'X' is not assignable to 'Y'` | Fix type annotation or assertion |
| `Object is possibly 'undefined'` | Add optional chaining (`?.`) or null check |
| `Argument of type mismatch` | Fix call site or update type signature |
| `Circular dependency detected` | Reorder imports (minimum change only) |

**Step 3 — Apply minimal fixes in order of impact**

Budget tracking:
```
Attempt 1/3: Analyze all errors -> targeted fix for root cause
Attempt 2/3: Different approach for remaining errors
Attempt 3/3: Last minimal change
Exceeded:   STOP. Report to user:
            [Escalation] Cannot resolve error after 3 attempts.
            Error: [exact error message]
            Please advise on how to proceed.
```

**Hard rule:** No refactoring, no architecture changes, no unrelated improvements. Fix only what prevents the build from passing.

Update PLAN.md after each attempt: `Auto-fix Budget: Max retries: 3 / Used: N`
Update STATE.md with blocker info (e.g., `Auto-fix: 2/3 used`).
