# Spec Kit

- **Repository**: [github/spec-kit](https://github.com/github/spec-kit)
- **Author**: GitHub (official)
- **Focus**: Spec-Driven Development (SDD) framework
- **Install**: `uv tool install specify-cli --from git+https://github.com/github/spec-kit.git@vX.Y.Z`
- **License**: MIT
- **Platforms**: 30+ AI coding agents (Claude Code, GitHub Copilot, Cursor, Windsurf, Gemini CLI, Qwen, Mistral, etc.)

---

## What It Does

An open-source SDD toolkit that "flips the script" on traditional development. Specifications become executable — define what to build as specs, then systematically transform them into working implementations through a structured 6-phase process.

---

## SDD Workflow (6 Phases)

1. **`/speckit.constitution`** — Establish governing principles (code quality, testing standards, UX, performance)
2. **`/speckit.specify`** — Define functional requirements and user stories (deliberately avoiding tech stack)
3. **`/speckit.clarify`** *(optional)* — Resolve ambiguities through structured questioning
4. **`/speckit.plan`** — Create technical implementation strategy (now choose tech stack)
5. **`/speckit.tasks`** — Generate ordered task lists respecting dependencies, identify parallelizable work
6. **`/speckit.implement`** — Execute tasks systematically with incremental testing

### Additional Commands
- **`/speckit.analyze`** — Validate cross-artifact consistency
- **`/speckit.checklist`** — Create quality validation checklists

---

## Key Features

### Constitution-Based Governance
Project principles established upfront guide all subsequent decisions. Covers code quality, testing, UX consistency, and performance requirements.

### Separation of What vs How
Specification phase (what to build) is deliberately separate from planning phase (how to build it). This prevents premature technology decisions from constraining requirements.

### Directory Structure
```
.specify/
├── memory/constitution.md
├── scripts/
│   ├── check-prerequisites.sh
│   └── create-new-feature.sh
├── specs/{feature-number}/
│   ├── spec.md
│   ├── plan.md
│   ├── tasks.md
│   └── contracts/
└── templates/
    ├── spec-template.md
    └── plan-template.md
```

### Three Customization Layers (priority order)
1. **Project-Local Overrides** (highest) — `.specify/templates/overrides/`
2. **Presets** — Customize workflows, terminology, localization
3. **Extensions** — Add new capabilities and commands

Multiple presets can be stacked with priority ordering for compliance + methodology + localization.

### Development Scenarios
- **Greenfield** — Build from scratch with high-level requirements
- **Creative Exploration** — Test multiple approaches in parallel
- **Brownfield** — Add features to existing systems, modernize legacy apps

### Broadest AI Agent Support
Works with 30+ agents including Claude Code, GitHub Copilot, Cursor, Windsurf, Gemini CLI, Qwen Code, Mistral Vibe, with generic fallback support.

---

## Pros
- Official GitHub project — strong credibility and maintenance
- Broadest AI agent support (30+ tools)
- Clean separation of concerns (constitution → spec → plan → tasks → implement)
- Preset/extension system enables organizational standardization
- Supports greenfield, brownfield, and creative exploration
- Templates ensure consistent artifact quality
- Community walkthroughs for multiple stacks (.NET, Spring Boot, Go/React, etc.)

## Cons
- Requires Python 3.11+ and `uv` package manager
- More ceremony than OpenSpec (6 phases vs lightweight proposal)
- Constitution concept may feel heavy for small projects
- No built-in agent orchestration (relies on the AI agent's native capabilities)
- No deployment or monitoring features
- Newer project — smaller community than ECC or GSD
