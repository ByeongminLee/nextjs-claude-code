# Feature-Slice Design (FSD)

> Best for: Medium to large teams (5-15), complex domain logic, strict layer discipline

## Core Principles

- Code is organized in layers with strict unidirectional dependencies
- Upper layers depend on lower layers — never the other way
- Each layer has slices (features, entities, widgets) — cross-slice imports at the same layer are forbidden
- `shared/` has no business domain knowledge — pure utilities, UI primitives only
- When in doubt: if it has domain knowledge → entity or feature. If generic → shared.

## Layer Hierarchy

```
app/       ← routing only (Next.js pages)
  ↓
widgets/   ← composite UI blocks (assembles features + entities)
  ↓
features/  ← user interactions, use cases
  ↓
entities/  ← domain models (User, Order, Product)
  ↓
shared/    ← no domain, pure utils, UI primitives
```

Each slice exports through its own `index.ts` — never import from a slice's internal files.

## File Placement Guide

| Code type | Layer / Location |
|-----------|-----------------|
| Route pages | `app/(routes)/[route]/page.tsx` |
| Complex page sections | `widgets/[name]/` |
| User-facing interactions (forms, modals) | `features/[name]/` |
| Domain objects (types, stores, API) | `entities/[name]/` |
| Base UI components | `shared/ui/` |
| API client setup | `shared/api/` |
| Generic utilities | `shared/lib/` |

## Import Boundaries

- `app` → can import from: `widgets`, `features`, `entities`, `shared`
- `widgets` → can import from: `features`, `entities`, `shared`
- `features` → can import from: `entities`, `shared`
- `entities` → can import from: `shared` only
- `shared` → no imports from other layers
- Same-layer cross-slice: `features/auth` must NOT import from `features/dashboard`

## When to Migrate Away

- Team exceeds 15 people or manages multiple deployable apps → Monorepo
- Layer discipline becomes overhead for simple CRUD features
