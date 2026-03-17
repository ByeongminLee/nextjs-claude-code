---
name: mock
description: Generate or update MSW mock handlers and fixtures from feature spec API contracts. Use to set up mock infrastructure, generate feature-specific mocks, or check mock status.
argument-hint: "[feature-name] | --setup | --status"
context: fork
---

## Routing

Parse `$ARGUMENTS` to determine mode:

- **`--setup`**: Set up MSW mock infrastructure from scratch.
  Spawn `lead-engineer` agent (haiku) with:
  ```
  Set up MSW mock infrastructure for this project.
  1. Check if mocks/ directory already exists — if yes, report "Mock infrastructure already set up" and stop.
  2. Install msw as devDependency: npm install msw --save-dev
  3. Create mocks/server.ts, mocks/browser.ts, mocks/index.ts, mocks/handlers/index.ts
     following the MSW Mock generation patterns in your instructions.
  4. Add NEXT_PUBLIC_API_MOCKING=enabled to .env.development (create if not exists).
  5. Add mock initialization to the app entry point (layout.tsx or _app.tsx).
  6. Report what was created and how to toggle mocks on/off.
  ```

- **`--status`**: Report current mock status (read-only).
  Read and report:
  1. Does `mocks/` directory exist?
  2. List all handler files in `mocks/handlers/`
  3. List all fixture files in `mocks/fixtures/`
  4. Check `NEXT_PUBLIC_API_MOCKING` in `.env*` files
  5. For each feature with `mock: true` in spec.md, check if a handler exists

- **Feature mode** (default — when `$ARGUMENTS` is a feature name):
  Spawn `lead-engineer` agent (sonnet) with:
  ```
  Generate or update MSW mock handlers and fixtures for feature: [feature-name from $ARGUMENTS]

  Steps:
  1. Read spec/feature/[feature-name]/spec.md — check mock: true and ## API Contracts section
  2. If mock is not true, ask the user if they want to enable it (update spec.md frontmatter)
  3. If ## API Contracts section is empty or missing, stop and ask: "Please add API contracts to spec.md first (run /spec [feature-name] to update)"
  4. If mocks/ infrastructure does not exist, set it up first (same as --setup)
  5. Generate mocks/fixtures/[feature-name].ts from API contract response shapes
  6. Generate mocks/handlers/[feature-name].ts with MSW handlers for each endpoint
  7. Update mocks/handlers/index.ts to include the new handlers
  8. Run npx tsc --noEmit to verify types
  ```
