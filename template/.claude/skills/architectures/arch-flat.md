# Flat Structure

> Best for: Solo developers, small prototypes, simple apps

## Core Principles

- All shared code lives at the root level — no feature grouping
- Keep it simple: if a file is used in two places, put it in `components/` or `lib/`
- As the project grows, migrate to Feature-Based — flat does not scale past ~10 features
- Prefer co-location: types and hooks close to the component that uses them

## File Placement Guide

| Code type | Suggested location |
|-----------|-------------------|
| Pages / routes | `app/(routes)/[route]/page.tsx` |
| UI components | `components/` (or `components/ui/` for base elements) |
| Custom hooks | `hooks/use-[name].ts` |
| Utilities, helpers | `lib/[domain].ts` |
| TypeScript types | Co-located with component, or `types/index.ts` if widely shared |
| Server Actions | `app/actions.ts` or `lib/actions/[domain].ts` |
| API route handlers | `app/api/[route]/route.ts` |

## Import Boundaries

- No enforced layer restrictions in flat structure
- Guideline: avoid deep import chains (`../../..`) — use path aliases (`@/`)
- If two components import each other, extract shared logic to `lib/`

## When to Migrate Away

- More than ~10 distinct features
- Multiple developers working on separate areas
- Frequent merge conflicts in shared directories
- Hard to find where code for a specific feature lives
