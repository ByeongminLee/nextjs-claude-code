# Code Style Rules

For detailed code quality principles with examples, see these skills:
- `.claude/skills/readability/` — context reduction, naming, top-to-bottom flow
- `.claude/skills/predictability/` — no hidden side effects, consistent return types
- `.claude/skills/cohesion/` — colocate related code, eliminate magic numbers
- `.claude/skills/coupling/` — composition over props drilling, single-responsibility hooks
- Reference: https://frontend-fundamentals.com/code-quality/

## Code Quality

- **Single responsibility**: each function does one thing — separate read (query) from write (command)
- **Consistent abstraction level**: don't mix high-level and low-level logic in the same function
- **No magic numbers**: extract meaningful constants (`const MAX_RETRY_COUNT = 3`)
- **Early return (guard clause)**: return early for invalid conditions instead of deep nesting
- **Avoid boolean parameters**: use named options objects or separate functions instead

```typescript
// Bad
function process(data: Data, isAdmin: boolean) { ... }

// Good
function processAsAdmin(data: Data) { ... }
function processAsUser(data: Data) { ... }
```

## Component Architecture (must check in review)

These 3 principles are mandatory for all React components. Reviewer must verify compliance.

### 1. UI and business logic must be separated

- Components render UI only — no API calls, no data transformation, no complex state logic inside JSX
- Extract business logic to custom hooks (`useAuth`, `useCheckout`) or utility functions
- A component should be replaceable with a different UI without touching the logic

```tsx
// Bad — logic mixed with UI
function UserProfile() {
  const [user, setUser] = useState(null);
  useEffect(() => { fetch('/api/user').then(r => r.json()).then(setUser); }, []);
  if (!user) return <Spinner />;
  return <div>{user.name}</div>;
}

// Good — logic in hook, UI in component
function useUser() {
  const [user, setUser] = useState(null);
  useEffect(() => { fetch('/api/user').then(r => r.json()).then(setUser); }, []);
  return { user, isLoading: !user };
}

function UserProfile() {
  const { user, isLoading } = useUser();
  if (isLoading) return <Spinner />;
  return <div>{user.name}</div>;
}
```

### 2. Each function/component must do exactly one thing

- One function = one responsibility. If a function name needs "and" to describe it, split it.
- Components: render one logical UI unit. If it handles multiple concerns, extract sub-components.
- Hooks: manage one piece of state or one side effect. `useAuthAndAnalytics` → `useAuth` + `useAnalytics`

### 3. Components must be headless-capable and customizable

- Build UI components so style and state can be customized from outside
- Use Compound Pattern for complex UI (tabs, accordion, dropdown): sub-components share state via Context, consumer controls structure
- Separate logic from presentation: expose hooks for logic, accept `className`/`style`/`asChild` for styling
- Never hardcode styles that the consumer can't override

```tsx
// Bad — rigid, not customizable
function Tabs({ items }) {
  const [active, setActive] = useState(0);
  return <div className="tabs">{items.map(...)}</div>;
}

// Good — compound, headless, customizable
<Tabs defaultValue="profile">
  <Tabs.List className="custom-list">
    <Tabs.Trigger value="profile">Profile</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="profile"><ProfileForm /></Tabs.Content>
</Tabs>
```

Reference: `.claude/skills/vercel-composition-patterns/` for detailed compound component and composition examples

## Naming

| Case | Convention | Example |
|------|-----------|---------|
| Components | PascalCase, same as filename | `LoginForm.tsx` → `LoginForm` |
| Functions / hooks | camelCase, verb+noun | `fetchUserProfile`, `useAuthState` |
| Boolean variables | is/has/can prefix | `isLoading`, `hasError`, `canSubmit` |
| Event handlers | handle prefix | `handleSubmit`, `handleClick` |
| Constants | SCREAMING_SNAKE_CASE | `MAX_FILE_SIZE`, `API_BASE_URL` |
| Types / interfaces | PascalCase | `UserProfile`, `ApiResponse` |

## Accessibility (A11y)

- Every interactive element needs an accessible name: visible text, `aria-label`, or `aria-labelledby`
- Never use color alone to convey information (contrast ratio ≥ 4.5:1 for normal text)
- Support keyboard navigation: ensure `focus-visible` styles are present
- Every `<input>` and `<select>` must have an associated `<label>` (via `for`/`id` or wrapping)
- Use semantic HTML: `<button>` for actions, `<a>` for navigation, `<nav>`, `<main>`, `<section>`
- Images: always provide `alt` text; decorative images use `alt=""`

```tsx
// Bad
<div onClick={handleSubmit}>Submit</div>

// Good
<button type="submit" onClick={handleSubmit}>Submit</button>
```

## Bundling

- Use `next/dynamic` or `React.lazy` for route-level and heavy component code splitting
- Keep shared utilities in `shared/lib` or `lib/` — no circular dependencies
- Avoid re-exporting everything from barrel `index.ts` files — breaks tree shaking
- Import only what you need from large libraries:
  ```typescript
  // Bad
  import _ from 'lodash';
  // Good
  import { debounce } from 'lodash-es';
  ```

## Debug Guidelines

- **No `console.log` in commits** — remove before committing (consider `no-console` lint rule)
- Wrap unstable UI sections in `<ErrorBoundary>` to prevent full-page crashes
- Include context in error messages:
  ```typescript
  // Bad
  throw new Error('Failed to fetch user');
  // Good
  throw new Error(`fetchUser failed: userId=${userId}, status=${response.status}`);
  ```
- Use `debugger` only in local dev — never commit it

## TypeScript

- Prefer `interface` over `type` for object shapes (better error messages, extendable)
- Use `type` for unions, intersections, and mapped types
- Avoid `any` — use `unknown` when type is genuinely unknown, then narrow with guards
- No `@ts-ignore` — fix the underlying type issue instead
