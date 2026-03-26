---
name: test
description: Run tests for a feature based on TEST_STRATEGY.md and feature-level TEST.md. Handles unit/integration test workflows. Use --setup to configure test strategy. Use /qa for browser, visual, and accessibility testing.
argument-hint: "[feature-name] [--unit | --setup]"
context: fork
---

## Strategy check

Before routing, check if `spec/TEST_STRATEGY.md` exists:
- If NOT exists AND mode is NOT `--setup`:
  → Output: "No TEST_STRATEGY.md found. Run `/init` (auto-creates) or `/test --setup` to configure your test strategy." → **STOP**
- `--setup` mode proceeds without strategy file.

## Routing

Parse `$ARGUMENTS` to determine mode:

- **`--setup`**: Spawn `tester` agent (sonnet) with:
  ```
  Set up the test strategy for this project.
  Ask the user about their test approach (TDD vs post-dev), unit/integration scope, test runner, and coverage threshold.
  Write the result to spec/TEST_STRATEGY.md.
  Do not configure browser QA here. Route browser QA to /qa.
  ```

- **`--unit`**: Spawn `tester` agent (sonnet) with:
  ```
  Run unit and integration tests only for feature: [feature-name from $ARGUMENTS]
  ```

- **No flag** (default): Spawn `tester` agent (sonnet) with:
  ```
  Run unit and integration tests for feature: [feature-name from $ARGUMENTS]
  Check TEST_STRATEGY.md for the exact scope.
  If browser testing is requested, stop and instruct the user to run /qa.
  ```
