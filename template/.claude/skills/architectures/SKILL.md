---
name: architectures
description: Architecture pattern reference for Next.js & React projects. Covers Flat, Feature-Based, FSD, and Monorepo patterns with core principles, file placement, and import boundaries.
---

# Architecture Patterns

Reference guide for choosing and applying architecture patterns. Used by the `/init` agent when generating `spec/ARCHITECTURE.md`.

## Pattern Summary

| Pattern | Team size | Core idea | When to use |
|---------|-----------|-----------|-------------|
| [Flat](arch-flat.md) | Solo | Root-level sharing, no feature grouping | Prototypes, simple apps, < 10 features |
| [Feature-Based](arch-feature-based.md) | Small (2-5) | Self-contained feature modules with public API | Clear feature boundaries, medium complexity |
| [FSD](arch-fsd.md) | Medium (5-15) | Strict unidirectional layer hierarchy | Complex domain logic, strict discipline needed |
| [Monorepo](arch-monorepo.md) | Large (15+) | apps/ + packages/ with Turborepo | Multiple apps, shared code, independent deploys |

## How to Choose

```
Is this a solo prototype or simple app?
├─ Yes → Flat
└─ No → Does the team need strict layer rules?
         ├─ Yes → Is the team 15+?
         │        ├─ Yes → Monorepo
         │        └─ No → FSD
         └─ No → Feature-Based
```

## Migration Path

```
Flat → Feature-Based → FSD → Monorepo
```

Each pattern is a superset of the previous. Migration is incremental — you don't need to rewrite everything at once.

## Agent Usage

- `/init` reads the detected pattern and applies the corresponding guide when writing `spec/ARCHITECTURE.md`
- Agents reference this skill for file placement and import boundary decisions
- The pattern guide is a reference — agents adapt to the actual project structure, not the other way around
