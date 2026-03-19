# Lead Engineer — MSW Mock Generation

> Read when a task targets `mocks/` files (mock setup or mock handler in PLAN.md).

## Mock Setup (one-time, Layer 0)

Only create if `mocks/` directory does not exist. Generate these files:

**`mocks/server.ts`**:
```typescript
import { setupServer } from "msw/node";
import { handlers } from "./handlers";
export const server = setupServer(...handlers);
```

**`mocks/browser.ts`**:
```typescript
import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";
export const worker = setupWorker(...handlers);
```

**`mocks/index.ts`**:
```typescript
export async function initMocks() {
  if (process.env.NEXT_PUBLIC_API_MOCKING !== "enabled") return;
  if (typeof window === "undefined") {
    const { server } = await import("./server");
    server.listen({ onUnhandledRequest: "bypass" });
  } else {
    const { worker } = await import("./browser");
    await worker.start({ onUnhandledRequest: "bypass" });
  }
}
```

**`mocks/handlers/index.ts`**:
```typescript
export const handlers = [
  // Feature handlers will be spread here
];
```

After creating, check if `msw` is in `package.json`. If not: `npm install msw --save-dev`

## Mock Handlers (per feature, Layer 2.5)

Read `## API Contracts` from `spec/feature/[name]/spec.md`. For each endpoint:

**`mocks/fixtures/[feature].ts`** — Type-safe mock data:
- Success, error, and edge-case fixtures from API Contract response shapes
- Realistic but deterministic values (no Math.random)

**`mocks/handlers/[feature].ts`** — MSW request handlers:
- Import `http` and `HttpResponse` from `msw`
- One handler per endpoint
- Default to success; include commented error variants

Update `mocks/handlers/index.ts` to import and spread new handlers.

## Mock toggle in Next.js

**App Router** — add to `app/layout.tsx` or `app/providers.tsx`:
```typescript
import { initMocks } from "@/mocks";
```

**Pages Router** — add to `pages/_app.tsx`:
```typescript
import { initMocks } from "@/mocks";
```

Prefer conditional dynamic import for production:
```typescript
if (process.env.NEXT_PUBLIC_API_MOCKING === "enabled") {
  require("@/mocks").initMocks();
}
```
