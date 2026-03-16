# Testing Rules

## What to test

| Category | Test type |
|----------|-----------|
| Pure utility functions (calculations, validation, transforms) | Unit |
| API handlers / Server Actions (input validation, error paths) | Unit / Integration |
| Critical user flows (auth, checkout, form submission) | E2E (Playwright) |
| Shared hooks with side effects | Unit |

## What NOT to test

- UI snapshot tests — fragile, high maintenance cost
- Third-party library internals (trust them)
- Simple getters/setters with no logic
- Implementation details (internal state, private methods)

## Test anti-patterns to avoid

- **Testing implementation, not behavior** — test what the function does, not how
- **Shared state between tests** — each test must be fully independent
- **No mocks for external deps** — always mock: API calls, database, external services
- **Asserting too little** — a test that always passes catches nothing
- **Hardcoded test data** — use meaningful, realistic values

## Test file placement

```
# Unit — colocated with source
features/auth/utils/validatePassword.test.ts

# Integration — grouped by feature
__tests__/auth/signIn.test.ts

# E2E — top-level e2e/ folder
e2e/auth.spec.ts
e2e/checkout.spec.ts
```

## TDD Workflow (optional — use when it helps)

When applying TDD, follow the Red → Green → Refactor cycle:

1. **RED** — Write a failing test that describes expected behavior
   ```bash
   npm test  # Must FAIL before writing implementation
   ```
2. **GREEN** — Write the minimal implementation to make the test pass
   ```bash
   npm test  # Must PASS now
   ```
3. **REFACTOR** — Clean up duplication and improve names; tests must stay green

When to use TDD:
- **Write test first**: pure functions, complex business logic, bug fixes
- **Implement first, test after**: UI features, layout, visual components
- **E2E tests**: write after the feature passes browser verification (Level 4)

## Edge cases to always test

When writing tests for any function with logic, cover:

- **Null / Undefined** inputs
- **Empty** arrays or strings
- **Invalid types** passed at boundaries
- **Boundary values** (min/max of allowed range)
- **Error paths** (network failures, validation errors)
- **Special characters** (Unicode, emojis, SQL-like chars in string inputs)

## Coverage targets

| Layer | Target |
|-------|--------|
| Business logic (utils, services) | ≥ 80% |
| API handlers / Server Actions | 100% error paths |
| UI components | Test behavior, not implementation |
| E2E | Cover each REQ in spec.md with at least one flow |

## Playwright E2E conventions

- Test file: `e2e/[feature].spec.ts`
- Use `page.getByRole()` and `page.getByLabel()` — avoid CSS selectors
- Each test should be independent (no shared state between tests)
- Use `test.describe` to group flows by feature
- Run: `npx playwright test`

## Test naming

```typescript
// Unit
describe('validatePassword', () => {
  it('returns error when password is shorter than 8 chars', () => { ... });
  it('returns null when password meets all requirements', () => { ... });
});

// E2E
test('user can sign in with valid credentials', async ({ page }) => { ... });
test('user sees error message with invalid credentials', async ({ page }) => { ... });
```
