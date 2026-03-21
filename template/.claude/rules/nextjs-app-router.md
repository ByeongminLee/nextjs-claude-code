---
paths: ["app/**", "src/app/**"]
---

# Next.js App Router Patterns

## Server Components (Default)
- All components in `app/` are Server Components by default
- Only add `'use client'` when the component needs: useState, useEffect, event handlers, browser APIs
- Keep `'use client'` boundary as deep (leaf-level) as possible — never on layouts unless necessary
- Server Components can be `async` and fetch data directly

## Data Fetching
- Fetch data in Server Components, not in client components
- Use `generateStaticParams` for static generation (replaces `getStaticPaths`)
- Use `revalidatePath()` or `revalidateTag()` after server actions
- Do NOT use `getStaticProps`, `getServerSideProps`, or `getInitialProps` — these are Pages Router only

## Metadata
- Use `export const metadata` or `export function generateMetadata` in page/layout files
- Do NOT use `next/head` or `next/document` — these are Pages Router only

## Route Handlers
- Place in `app/api/[route]/route.ts`
- Export named functions: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`
- Use `NextRequest` and `NextResponse` from `next/server`

## Server Actions
- Add `'use server'` at file-level or function-level
- Validate inputs with Zod before database operations
- Call `revalidatePath()` after mutations
- Return structured results, not thrown errors

## Layouts & Loading
- `layout.tsx` wraps child routes — shared UI across pages
- `loading.tsx` shows during route transitions (Suspense boundary)
- `error.tsx` catches errors in child routes (must be `'use client'`)
- `not-found.tsx` for 404 pages

## API Route Quality
- Every route handler MUST have try/catch with structured error responses
- Validate all input (query params, body, path params) with Zod at the route boundary
- If a database schema exists for the data, query it — never return hardcoded stub values
- Return consistent error format: `{ code: string, message: string }`
- Use appropriate status codes: 400 (validation), 401 (auth), 404 (not found), 500 (internal)
