# Verification Loops and Evals

## The Single Highest-Leverage Practice

> Include tests, screenshots, or expected outputs so Claude can check itself. This is the single highest-leverage thing you can do.

Claude performs dramatically better when it can verify its own work — run tests, compare screenshots, and validate outputs.

| Strategy | Before | After |
| --- | --- | --- |
| **Provide verification criteria** | "implement a function that validates email addresses" | "write a validateEmail function. test cases: user@example.com is true, invalid is false. run the tests after implementing" |
| **Verify UI changes visually** | "make the dashboard look better" | "[paste screenshot] implement this design. take a screenshot and compare. list differences and fix them" |
| **Address root causes** | "the build is failing" | "the build fails with this error: [paste error]. fix it and verify the build succeeds. address the root cause, don't suppress the error" |

---

## Key Metrics: pass@k vs pass^k

```
pass@k: At least ONE of k attempts succeeds
        k=1: 70%  k=3: 91%  k=5: 97%

pass^k: ALL k attempts must succeed
        k=1: 70%  k=3: 34%  k=5: 17%
```

- Use **pass@k** when you just need it to work
- Use **pass^k** when consistency is essential (security, data integrity)

---

## Benchmarking Skills

To compare with-skill vs without-skill: fork the conversation, run one with the skill and one without, then pull up a diff at the end to see the output difference.

---

## Eval Pattern Types

- **Checkpoint-Based Evals**: Set explicit checkpoints, verify against defined criteria, fix before proceeding
- **Continuous Evals**: Run every N minutes or after major changes, full test suite + lint

---

## Course-Correct Early and Often

- **`Esc`**: Stop Claude mid-action. Context is preserved, so you can redirect.
- **`Esc + Esc` or `/rewind`**: Open the rewind menu and restore previous conversation and code state, or summarize from a selected message.
- **`"Undo that"`**: Have Claude revert its changes.
- **`/clear`**: Reset context between unrelated tasks.

If you've corrected Claude more than twice on the same issue, the context is cluttered. Run `/clear` and start fresh with a more specific prompt.

---

## Checkpoints

Every action Claude makes creates a checkpoint. Double-tap `Escape` or run `/rewind` to:
- Restore conversation only
- Restore code only
- Restore both
- Summarize from a selected message

Checkpoints persist across sessions. You can tell Claude to try something risky — if it doesn't work, rewind and try a different approach.
