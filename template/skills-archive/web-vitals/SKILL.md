# Core Web Vitals Optimization

## Metrics
- **LCP** (Largest Contentful Paint): < 2.5s — largest visible element render time
- **INP** (Interaction to Next Paint): < 200ms — responsiveness to user input
- **CLS** (Cumulative Layout Shift): < 0.1 — visual stability

## LCP Optimization
- Preload hero images: `<link rel="preload" as="image">`
- Use `next/image` with `priority` for above-the-fold images
- Minimize render-blocking CSS: inline critical CSS, defer non-critical
- Server-side render critical content (avoid client-only data fetching for LCP elements)
- Avoid lazy loading above-the-fold content

## INP Optimization
- Keep event handlers < 50ms; offload heavy work to `requestIdleCallback` or Web Workers
- Use `React.startTransition` for non-urgent state updates
- Debounce/throttle input handlers (search, scroll, resize)
- Avoid long tasks: split > 50ms tasks using `scheduler.yield()` or chunking
- Use `useDeferredValue` for expensive re-renders triggered by user input

## CLS Optimization
- Set explicit `width`/`height` or `aspect-ratio` on images, videos, iframes
- Reserve space for dynamic content (skeleton placeholders)
- Avoid inserting content above existing content (banners, ads)
- Use `transform` animations instead of layout-triggering properties (top, left, width, height)
- Font loading: `font-display: swap` + preload critical fonts

## Next.js Specifics
- `@vercel/speed-insights` for real-user monitoring
- `next/image` handles sizing, lazy loading, format optimization
- `next/font` eliminates font CLS with automatic `size-adjust`
- Route prefetching: `<Link>` auto-prefetches in viewport
- Streaming SSR with `loading.tsx` reduces perceived LCP
