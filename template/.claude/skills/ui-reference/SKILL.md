---
name: ui-reference
description: UI component library reference guide. Use when building UI without a design, choosing a component library, or looking for animation/effect inspiration. Covers headless, styled, animation, and chart libraries with llms.txt links for AI-readable documentation.
---

# UI Reference

When you need to build UI without a Figma design, or need inspiration for components, animations, or effects — reference these libraries. Each entry includes an AI-readable documentation link (llms.txt) when available.

## When to Use This Reference

- Feature has no Figma design and you need UI component patterns
- Need animation or visual effect ideas for an existing component
- Choosing between component libraries for a new project
- Looking for a specific component type (chart, drag-and-drop, date picker, etc.)
- Need to understand a library's API before implementing

## Quick Selection Guide

| Need | Recommended | Why |
|------|-------------|-----|
| Headless + full custom styling | [Base UI](#base-ui), [Ark UI](#ark-ui) | Zero style opinions, bring your own CSS |
| shadcn/ui ecosystem extension | [ReUI](#reui), [coss ui](#coss-ui), [Bklit UI](#bklit-ui) | Built for shadcn, same patterns |
| Tailwind + ready-to-use | [HeroUI](#heroui), [DaisyUI](#daisyui) | Pre-styled with Tailwind |
| Enterprise/admin dashboard | [Ant Design](#ant-design), [Mantine](#mantine) | Rich component set, tables, forms |
| Animation effects | [Animata](#animata), [ReactBits](#reactbits) | Copy-paste animated components |
| AI-assisted component generation | [21st.dev](#21stdev) | AI generates custom components |
| Charts / data visualization | [Bklit UI](#bklit-ui) | shadcn-compatible chart components |

---

## Headless (Unstyled) Libraries

### Base UI
- **Type**: Headless component library (40+ components)
- **Styling**: Bring your own — works with Tailwind, styled-components, CSS Modules, anything
- **Best for**: Custom design systems where you need full control. Ideal with shadcn/ui for building custom component libraries
- **llms.txt**: https://base-ui.com/llms.txt
- **Pros**: Zero style opinions, excellent accessibility, composable API
- **Cons**: Must write all styles yourself, React only

### Ark UI
- **Type**: Headless component library (50+ components)
- **Styling**: Framework-agnostic, bring your own
- **Best for**: Multi-framework projects (React, Vue, Svelte, Solid)
- **llms.txt**: https://ark-ui.com/llms.txt
- **Pros**: Same API across 4 frameworks, MCP server support, extensive primitives
- **Cons**: Smaller community than Radix

---

## Styled (Tailwind-based) Libraries

### HeroUI
- **Type**: Styled component library (210+ components)
- **Styling**: Tailwind CSS + tailwind-variants, build-time CSS
- **Best for**: Next.js projects that want beautiful defaults with Tailwind customization
- **Docs**: https://www.heroui.com/docs/guide/introduction
- **Pros**: Large component count, Framer Motion animations built-in, dark mode, successor to NextUI
- **Cons**: React only, heavy dependency on Tailwind + React Aria

### DaisyUI
- **Type**: CSS component classes for Tailwind (50+ components)
- **Styling**: Tailwind class-based, semantic color system
- **Best for**: Quick prototyping, framework-agnostic (works with any HTML)
- **llms.txt**: https://daisyui.com/llms.txt
- **Pros**: Framework-agnostic (HTML classes), built-in themes, zero JS dependency
- **Cons**: Less interactive behavior (CSS-only), limited complex components

---

## shadcn/ui Ecosystem

### ReUI
- **Type**: Enterprise-grade shadcn registry (18+ advanced components)
- **Styling**: shadcn + CSS variable design tokens
- **Best for**: Data tables, forms, drag-and-drop, date pickers in shadcn projects
- **llms.txt**: https://reui.io/llms.txt
- **Pros**: Dual primitive support (Base UI + Radix), MCP server, enterprise quality
- **Cons**: Smaller component set, shadcn dependency

### coss ui
- **Type**: Hybrid — Base UI + Tailwind styled (50+ components)
- **Styling**: Tailwind CSS on Base UI headless foundation
- **Best for**: Migration from shadcn/Radix, wanting headless flexibility with pre-styled defaults
- **llms.txt**: https://coss.com/ui/llms.txt
- **Pros**: Migration guides from shadcn/Radix, own-your-code model, accessibility-first
- **Cons**: Relatively new, smaller ecosystem

### Bklit UI
- **Type**: Chart/data visualization components for shadcn (11+ chart types)
- **Styling**: CSS custom properties, shadcn theming
- **Best for**: Adding charts (line, bar, pie, candlestick, sankey, etc.) to shadcn projects
- **Docs**: https://ui.bklit.com/docs/installation
- **Pros**: Auto-registry config, animated transitions, real-time data support
- **Cons**: Charts only, not a general component library

---

## Full-featured Libraries

### Chakra UI
- **Type**: Styled component library (v3)
- **Styling**: CSS-in-JS with theming system
- **Best for**: Rapid development with good defaults and strong accessibility
- **llms.txt**: https://chakra-ui.com/llms.txt
- **Pros**: Excellent DX, comprehensive theming, active community
- **Cons**: CSS-in-JS runtime cost, less Tailwind-friendly

### Ant Design
- **Type**: Enterprise styled library (60+ components)
- **Styling**: CSS-in-JS with token system, dark mode
- **Best for**: Admin dashboards, enterprise backend systems, data-heavy UIs
- **llms.txt**: https://ant.design/llms.txt
- **Pros**: Most comprehensive component set, battle-tested at scale, i18n
- **Cons**: Opinionated design, large bundle, enterprise aesthetic

### Mantine
- **Type**: Full-featured React library (100+ components + hooks + extensions)
- **Styling**: CSS Modules, Emotion, Sass, vanilla-extract supported
- **Best for**: Projects needing components + hooks + charts + rich text editor in one ecosystem
- **llms.txt**: https://mantine.dev/llms.txt
- **Pros**: Hooks ecosystem, date/chart/notification/carousel extensions, CSS variable theming
- **Cons**: Large dependency surface, React only

---

## Animation & Effects

### Animata
- **Type**: Copy-paste animated React components (150+ elements)
- **Styling**: Tailwind CSS + Framer Motion
- **Best for**: Adding micro-interactions, animated cards, hero sections, text effects
- **Docs**: https://animata.design/docs/setup
- **Pros**: No npm install needed (copy-paste), 20+ categories, Tailwind native
- **Cons**: Must copy each component manually, quality varies

### ReactBits
- **Type**: Visual effects library (100+ components in 4 variants)
- **Styling**: JS+CSS, JS+Tailwind, TS+CSS, TS+Tailwind variants
- **Best for**: Advanced visual effects — particle systems, 3D interactions, WebGL backgrounds, text animations
- **llms.txt**: https://reactbits.dev/llms.txt
- **Pros**: GSAP + Three.js + Framer Motion powered, 4 variant options, CLI installable
- **Cons**: Heavy effects may impact performance, advanced usage requires WebGL knowledge

---

## AI-Assisted

### 21st.dev
- **Type**: AI component generation platform
- **Styling**: React + Tailwind output
- **Best for**: Generating custom components when no design exists, browsing community component library
- **llms.txt**: https://21st.dev/llms.txt
- **Pros**: IDE integration (Cursor/Windsurf), component marketplace, craft-focused output
- **Cons**: Credit-based pricing, generated code needs review

---

## Usage with NCC Agents

When an agent needs UI reference:
1. Check if the project already uses a component library (spec/PROJECT.md `## Libraries`)
2. If yes — use that library's llms.txt for component API reference
3. If no design exists — use this guide to pick appropriate components
4. For animations/effects — check Animata and ReactBits before writing custom animations
5. Pass the llms.txt URL to WebFetch for detailed API documentation
