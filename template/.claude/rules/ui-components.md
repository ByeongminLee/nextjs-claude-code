---
paths: ["components/**", "src/components/**", "app/**/components/**"]
---

# UI Component Patterns

## Server vs Client Components
- Default to Server Components — only add `'use client'` when required
- Composition pattern: Server Component parent wraps Client Component children
- Keep Client Components small and focused (interaction logic only)

## Styling
- Use the project's established styling approach (Tailwind, CSS Modules, etc.)
- Do NOT hardcode color values — use design tokens or CSS variables
- Use `cn()` utility (from `lib/utils`) for conditional class merging with Tailwind

## Accessibility
- Use semantic HTML elements (`<button>`, `<nav>`, `<main>`, `<article>`, etc.)
- Add `aria-label` for icon-only buttons and non-obvious interactive elements
- Ensure keyboard navigation works (focus management, tab order)
- Provide `alt` text for images, use `role` attributes where semantic HTML is insufficient

## Responsive Design
- Mobile-first approach: base styles for mobile, then `md:` and `lg:` breakpoints
- Breakpoints: 375px (mobile), 768px (tablet), 1024px (desktop)
- Use relative units (`rem`, `%`) over fixed pixels for spacing
- Test all layouts at minimum 320px width

## Component Structure
- One component per file (co-locate related subcomponents if small)
- Props interface defined at the top of the file
- Export named components (avoid default exports in component libraries)
- Place shared components in `components/ui/` (primitives) or `components/` (composed)

## Animation
- Prefer CSS transitions and animations over JavaScript-driven animation
- Respect `prefers-reduced-motion` media query
- Use `framer-motion` or `motion` only for complex orchestrated animations
