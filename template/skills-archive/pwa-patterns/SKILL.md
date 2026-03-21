# PWA Patterns

## Core Requirements
- **Web App Manifest** (`manifest.json`): name, icons (192+512px), start_url, display: standalone
- **Service Worker**: Caching strategy, offline fallback, background sync
- **HTTPS**: Required for service worker registration

## Next.js Setup (next-pwa)
```js
// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
});
module.exports = withPWA({ /* next config */ });
```

## Caching Strategies
- **Cache First**: Static assets (images, fonts, CSS) — fast, stale until update
- **Network First**: API responses, dynamic pages — fresh, fallback to cache offline
- **Stale While Revalidate**: Semi-dynamic content — fast from cache, update in background
- **Cache Only**: App shell, critical assets bundled at build time
- **Network Only**: Real-time data (chat, stock prices) — no caching

## Offline Support
- Offline fallback page: `/offline.html` served when network unavailable
- IndexedDB for complex offline data (use `idb` wrapper)
- Background sync: Queue failed requests, retry when online (`workbox-background-sync`)
- Cache API responses for read-heavy features

## Best Practices
- Precache app shell + critical routes at install time
- Runtime cache API responses with TTL
- Show offline indicator UI when `navigator.onLine === false`
- Handle service worker updates: prompt user to refresh
- Audit with Lighthouse PWA checklist
