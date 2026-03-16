# Monorepo (Turborepo)

> Best for: Large teams (15+), multiple apps sharing code, independent deployments

## Core Principles

- `apps/` = deployable units (each app is independently buildable and deployable)
- `packages/` = shared libraries (no business domain — UI primitives, utilities, config only)
- Apps can depend on packages. Packages must NOT depend on apps.
- Package dependencies are declared explicitly in each `package.json` — no implicit cross-workspace imports
- Keep packages domain-agnostic: `packages/ui` knows nothing about your product's business logic

## File Placement Guide

| Code type | Suggested location |
|-----------|-------------------|
| Next.js app code | `apps/web/` (or your app's workspace path) |
| Feature modules | `apps/web/features/[name]/` (inside the app) |
| Shared UI components | `packages/ui/src/` |
| Shared utilities | `packages/utils/src/` |
| Shared TypeScript config | `packages/config/typescript/` |
| Shared ESLint config | `packages/config/eslint/` |
| Build pipeline config | `turbo.json` at root |

## Import Conventions

```typescript
// In apps/web — import from packages using workspace name
import { Button } from "@project/ui";
import { formatDate } from "@project/utils";

// In packages — never import from apps/
// In packages — avoid cross-package imports when possible
```

## Import Boundaries

- `apps/*` → can import from `packages/*`
- `packages/*` → must NOT import from `apps/*`
- Cross-app imports (e.g., `apps/web` → `apps/api`) → use a shared `packages/` instead
- Circular dependencies between packages → not allowed

## Turborepo Specifics

- Root `turbo.json` defines task pipeline (build, dev, lint, type-check)
- Use `--filter` for targeted builds: `turbo build --filter=web`
- Remote caching: `npx turbo login && npx turbo link`
- Add `.turbo/` to `.gitignore`
