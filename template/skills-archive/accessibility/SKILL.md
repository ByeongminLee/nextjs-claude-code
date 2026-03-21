# Accessibility (WCAG 2.1)

## Core Principles
- **Perceivable**: Alt text for images, captions for video, sufficient color contrast (4.5:1 min)
- **Operable**: Full keyboard navigation, no keyboard traps, skip-to-content links
- **Understandable**: Clear labels, error messages with suggestions, consistent navigation
- **Robust**: Valid HTML, ARIA roles/states only when native HTML is insufficient

## React Patterns
- Use semantic HTML (`<button>`, `<nav>`, `<main>`) over `<div>` with roles
- `aria-label` for icon-only buttons, `aria-describedby` for form hints
- Manage focus: `useRef` + `focus()` after route changes or modal open
- Live regions: `aria-live="polite"` for async status, `"assertive"` for errors
- `visually-hidden` class for screen-reader-only text (not `display:none`)

## Component Checklist
- **Forms**: `<label htmlFor>`, `aria-invalid`, `aria-errormessage`, required indicator
- **Modals**: Focus trap, Escape to close, `role="dialog"`, `aria-modal="true"`, return focus on close
- **Tabs**: `role="tablist/tab/tabpanel"`, arrow key navigation, `aria-selected`
- **Dropdowns**: `aria-expanded`, `aria-haspopup`, arrow key + Home/End support
- **Images**: Meaningful `alt`, empty `alt=""` for decorative, `role="img"` for SVG with `<title>`

## Testing
- axe-core: `npm i -D @axe-core/react` or inject via Playwright
- Keyboard-only navigation test: Tab through all interactive elements
- Screen reader: VoiceOver (macOS), NVDA (Windows)
- Color contrast: Chrome DevTools > Rendering > Emulate vision deficiencies
