---
name: mock
description: Generate or update MSW mock handlers and fixtures from feature spec API contracts. Use to set up mock infrastructure, generate feature-specific mocks, or check mock status.
argument-hint: "[feature-name] | --setup | --status"
context: fork
---

## Routing

Parse `$ARGUMENTS` to determine mode:

- **`--setup`**: Set up MSW mock infrastructure from scratch.
  Spawn `task-executor` agent (haiku) with:
  ```
  [HANDOFF]
  TO: task-executor (haiku)
  TASK: Set up MSW mock infrastructure
  DONE-WHEN:
    - mocks/server.ts, mocks/browser.ts, mocks/index.ts, mocks/handlers/index.ts created
    - msw installed as devDependency
    - Mock initialization added to app entry point
  MUST-NOT:
    - Overwrite existing mocks/ directory
  READS:
    - .claude/agents/lead-engineer-msw-mock.md (mock patterns)
  [/HANDOFF]
  ```

- **`--status`**: Report current mock status (read-only, no agent spawn).
  Read and report:
  1. Does `mocks/` directory exist?
  2. List all handler files in `mocks/handlers/`
  3. List all fixture files in `mocks/fixtures/`
  4. Check `NEXT_PUBLIC_API_MOCKING` in `.env*` files
  5. For each feature with `mock: true` in spec.md, check if a handler exists

- **Feature mode** (default — when `$ARGUMENTS` is a feature name):
  Spawn `task-executor` agent (sonnet) with:
  ```
  [HANDOFF]
  TO: task-executor (sonnet)
  TASK: Generate MSW mock handlers and fixtures for feature "[feature-name]"
  DONE-WHEN:
    - mocks/fixtures/[feature-name].ts created with typed mock data
    - mocks/handlers/[feature-name].ts created with MSW handlers
    - mocks/handlers/index.ts updated to include new handlers
    - npx tsc --noEmit passes
  MUST-NOT:
    - Modify source code outside mocks/
  READS:
    - spec/feature/[feature-name]/spec.md (API Contracts section)
    - .claude/agents/lead-engineer-msw-mock.md (mock patterns)
  [/HANDOFF]
  ```
  Pre-checks (before spawning):
  1. Read spec.md — if `mock` is not true, ask user to enable it
  2. If `## API Contracts` is empty/missing → STOP: "Add API contracts first (run /spec)"
  3. If `mocks/` doesn't exist → run --setup first, then proceed
