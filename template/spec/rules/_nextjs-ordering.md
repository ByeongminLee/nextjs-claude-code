# Next.js Task Ordering

> **Immutable.** Read when the project uses Next.js (App Router or Pages Router).

## Dependency Layers

Order tasks following these dependency layers:

| Layer | Files | Notes |
|-------|-------|-------|
| 0. Mock Setup | `mocks/server.ts`, `mocks/browser.ts`, `mocks/index.ts` | Only when `mock: true` AND `mocks/` does not exist |
| 1. Types | `types/`, `[feature]/types/` | Define interfaces first |
| 2. Utilities | `lib/`, `[feature]/utils/` | Pure functions, no side effects |
| 2.5 Mock Handlers | `mocks/handlers/[feature].ts`, `mocks/fixtures/` | Only when `mock: true` |
| 3. API / Server Actions | `api/`, `actions.ts` | Server-side data access |
| 4. Hooks | `hooks/`, `[feature]/hooks/` | Client-side data access |
| 5. Base Components | `components/`, Server Components | Non-interactive UI |
| 6. Client Components | Interactive UI with `'use client'` | Forms, event handlers |
| 7. Page / Layout | `app/.../page.tsx`, `layout.tsx` | Wire everything together |

## App Router considerations
- Mark tasks requiring `'use client'` (hooks, event handlers, browser APIs)
- Mark tasks that are Server Actions (`'use server'`)

## Server vs Client Components
- Default to Server Components — only add `'use client'` when required
- Add `'use client'` for: `useState`, `useEffect`, event handlers, browser APIs
- Keep `'use client'` boundary as deep (leaf) as possible
- Never add `'use client'` to layout files unless necessary

## Server Actions
- Add `'use server'` directive at top of action file or inline
- Use `revalidatePath()` or `revalidateTag()` after mutations
- Validate with zod before database operations

## API Routes
- App Router: `app/api/[route]/route.ts` with named exports (GET, POST, etc.)
- Pages Router: `pages/api/[route].ts` with default handler

## Import paths
- Use `@/` alias (verify `tsconfig.json` paths)
- Never use relative imports going up more than 2 levels

## Checkpoint guidance for planners

**When to insert `checkpoint:decision`:**
- Server vs Client Component choice is unclear
- Modifying `layout.tsx` (affects all child routes)
- Modifying shared code (`components/`, `lib/`)
- Breaking changes to existing type structure

**When to insert `checkpoint:human-verify`:**
- Only for intermediate UI milestones
- Do NOT insert after the final UI task (verifier's Level 4 already does this)

## Analysis patterns (for /init)

App Router patterns to detect:
- `'use client'` directives, `async function Page()`, `'use server'`
- `export const dynamic = 'force-dynamic'`
- `loading.tsx`, `error.tsx`, `not-found.tsx`

Data fetching patterns:
- `fetch()` in Server Components, `useQuery`/`useSuspenseQuery`, `useSWR`
- Server Actions with `revalidatePath`
