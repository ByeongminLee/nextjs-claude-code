# Feature-Based Architecture

> Best for: Small to medium teams (2-5), apps with clear feature boundaries

## Core Principles

- Each feature is a self-contained module — components, hooks, API calls, types all live inside `features/[name]/`
- Features communicate through a public API only: export from `features/[name]/index.ts`, import from there
- Cross-feature direct imports are discouraged — if two features share logic, extract it to `lib/` or `components/`
- Pages are thin: `app/` pages just import and render from `features/`
- "Shared" means truly shared — avoid putting feature-specific code in `components/` or `lib/`

## File Placement Guide

| Code type | Suggested location |
|-----------|-------------------|
| Feature-local components | `features/[name]/components/` |
| Feature-local hooks | `features/[name]/hooks/` |
| Feature API calls / Server Actions | `features/[name]/api/` |
| Feature-local types | `features/[name]/types/` |
| Feature public exports | `features/[name]/index.ts` |
| Truly shared components | `components/` |
| Truly shared utilities | `lib/` |
| Pages (thin shell) | `app/(routes)/[route]/page.tsx` |

## Import Boundaries

- `app/` pages → can import from `features/[name]/index.ts`, `components/`, `lib/`
- `features/[name]` → can import from `components/`, `lib/`, but NOT directly from other features
- `lib/` and `components/` → no imports from `features/`

## When to Migrate Away

- Team exceeds 5 people with overlapping feature ownership
- Need strict layer discipline to enforce domain boundaries
- Features become deeply interdependent despite boundary rules
