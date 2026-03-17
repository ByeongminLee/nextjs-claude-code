---
name: test
description: Run tests for a feature based on TEST_STRATEGY.md and feature-level TEST.md. Supports unit/integration tests, browser tests, and Figma design comparison. Use --setup to configure test strategy.
argument-hint: "[feature-name] [--browser | --unit | --setup]"
context: fork
---

## Routing

Parse `$ARGUMENTS` to determine mode:

- **`--setup`**: Spawn `tester` agent (sonnet) with:
  ```
  Set up the test strategy for this project.
  Ask the user about their test approach (TDD vs post-dev), test types, browser testing, test runner, and coverage threshold.
  Write the result to spec/TEST_STRATEGY.md.
  If browser_test is enabled, check if agent-browser skill is installed and install from archive if needed.
  ```

- **`--browser`**: Spawn `browser-tester` agent (sonnet) with:
  ```
  Run browser tests for feature: [feature-name from $ARGUMENTS]
  ```

- **`--unit`**: Spawn `tester` agent (sonnet) with:
  ```
  Run unit and integration tests only for feature: [feature-name from $ARGUMENTS]
  ```

- **No flag** (default): Spawn `tester` agent (sonnet) with:
  ```
  Run all tests for feature: [feature-name from $ARGUMENTS]
  Check TEST_STRATEGY.md for test types to execute.
  ```
