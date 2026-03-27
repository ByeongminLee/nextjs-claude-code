# Conventions

Lean reference for code quality and performance. Detailed examples in `.claude/skills/`:
- Quality: `readability/`, `cohesion/`, `coupling/`, `predictability/`, `clean-code/`
- Performance: `nextjs-vercel/`, `vercel-react-best-practices/`, `web-vitals/`
- Component: `vercel-composition-patterns/`, `shadcn/`

## Code Quality

- **Single responsibility**: each function does one thing — separate read (query) from write (command)
- **Consistent abstraction level**: don't mix high-level and low-level logic in the same function
- **No magic numbers**: extract meaningful constants (`const MAX_RETRY_COUNT = 3`)
- **Early return (guard clause)**: return early for invalid conditions instead of deep nesting
- **Avoid boolean parameters**: use named options objects or separate functions instead

## Component Architecture

- Separate UI from business logic (hooks for logic, components for rendering)
- Each component does one thing — if a name needs "and", split it
- Components should be headless-capable and customizable (Compound Pattern)
- Reference: `.claude/skills/vercel-composition-patterns/`

## Naming

| Case | Convention | Example |
|------|-----------|---------|
| Components | PascalCase, same as filename | `LoginForm.tsx` → `LoginForm` |
| Functions / hooks | camelCase, verb+noun | `fetchUserProfile`, `useAuthState` |
| Boolean variables | is/has/can prefix | `isLoading`, `hasError`, `canSubmit` |
| Event handlers | handle prefix | `handleSubmit`, `handleClick` |
| Constants | SCREAMING_SNAKE_CASE | `MAX_FILE_SIZE`, `API_BASE_URL` |
| Types / interfaces | PascalCase | `UserProfile`, `ApiResponse` |

## TypeScript

- Prefer `interface` for object shapes, `type` for unions/intersections
- No `any` — use `unknown` + type guards
- No `@ts-ignore` — fix the underlying type issue

## Accessibility

- Every interactive element needs an accessible name
- Support keyboard navigation with `focus-visible` styles
- Semantic HTML: `<button>` for actions, `<a>` for navigation
- Every `<input>` and `<select>` must have an associated `<label>`
- Images: always provide `alt` text; decorative images use `alt=""`

## Performance (Next.js)

- Server Components by default — reduces client JS bundle
- `next/dynamic` with `{ ssr: false }` for heavy client-only components
- Always use `next/image` for images, `next/font/google` for fonts
- Avoid `useEffect` for data fetching in App Router — use Server Components or TanStack Query
- Co-locate Server Actions in `actions.ts` per feature

## Build Resolution

- Fix TypeScript errors before runtime errors
- Auto-fix budget: max 3 retries
- Never suppress with `@ts-ignore` or `any`

## Bundling

- `next/dynamic` or `React.lazy` for route-level code splitting
- No barrel re-exports that break tree shaking
- Import only what you need from large libraries
