# Performance Rules

## Context Management

- Keep context focused: read only files directly relevant to the current task
- Use `spec/feature/[name]/spec.md` and `design.md` as the source of truth — not raw source scans
- Never load entire `src/` or `app/` directories upfront
- Exclude from context: `node_modules/`, `.next/`, `dist/`, `.turbo/`, `coverage/`

## Build Resolution

- Fix TypeScript type errors before investigating runtime errors
- Auto-fix budget: max 3 retries per build/type-check attempt
- On 3rd consecutive failure: stop, report the exact error, ask the user for guidance
- Never silently suppress errors with `@ts-ignore` or `any` casts to pass the budget

## Next.js Specific

- Prefer Server Components by default — reduces client JS bundle size
- Use `next/dynamic` with `{ ssr: false }` for heavy client-only components (e.g., rich text editors, charts)
- Always use `next/image` for images — enables automatic optimization and lazy loading
- Use `next/font/google` for web fonts — eliminates layout shift (CLS)
- Avoid `useEffect` for data fetching in App Router — use Server Components or TanStack Query
- Co-locate Server Actions in `actions.ts` per feature — avoids unnecessary round trips
