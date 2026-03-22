# OpenSpec

- **Repository**: [Fission-AI/OpenSpec](https://github.com/Fission-AI/OpenSpec)
- **Author**: Fission AI
- **Focus**: Lightweight spec framework for AI-assisted development
- **Install**: `npm install -g @fission-ai/openspec@latest && cd your-project && openspec init`
- **License**: MIT
- **Platforms**: 20+ AI tools via slash commands

---

## What It Does

A lightweight specification framework that bridges human requirements and AI code generation. Establishes a shared agreement on what should be built before implementation begins. Core philosophy: fluidity over rigidity, iteration over waterfall, simplicity first.

---

## Core Workflow

1. **`/opsx:propose`** — Initiate a structured change process
2. System generates organized artifacts:
   - Proposal document
   - Specification
   - Design document
   - Task checklist
3. Each change gets its own folder with full traceability

### Extended Commands
- **`/opsx:new`** — Start new feature
- **`/opsx:continue`** — Resume work
- **`/opsx:ff`** — Fast-forward (skip phases)
- **`/opsx:verify`** — Validate implementation against spec
- **`/opsx:sync`** — Synchronize artifacts
- **`/opsx:bulk-archive`** — Archive completed work
- **`/opsx:onboard`** — Onboard to existing project

---

## Key Features

### Proposal-Driven Workflow
Everything starts with `/opsx:propose`. User proposes an idea, system generates structured artifacts. No rigid phase gates — artifacts can be updated at any time.

### Artifact System
Each change gets its own folder:
```
changes/
└── feature-name/
    ├── proposal.md
    ├── spec.md
    ├── design.md
    └── tasks.md
```

Prevents requirements from existing solely in chat history.

### Five Principles
1. **Fluidity over rigidity** — No rigid phase gates
2. **Iteration over waterfall** — Update artifacts anytime
3. **Simplicity** — Minimal ceremony
4. **Brownfield support** — Works with existing projects
5. **Scales** — Personal to enterprise

### Dashboard
Visual interface for monitoring changes and specifications.

### CLI Tool
- `openspec init` — Initialize project
- Manages configuration and updates
- Supports npm, pnpm, yarn, bun, nix

### Multi-Tool Support
Works with 20+ AI tools through slash commands. No platform lock-in.

### Recommended Models
High-reasoning models like Opus 4.5 and GPT 5.2 for both planning and implementation.

### Telemetry
Anonymous command-name and version only. Disable with `OPENSPEC_TELEMETRY=0` or `DO_NOT_TRACK=1`.

---

## Comparison with Spec Kit

| Aspect | OpenSpec | Spec Kit |
| --- | --- | --- |
| **Philosophy** | Lightweight, fluid | Structured, rigorous |
| **Phases** | Flexible (no gates) | 6 sequential phases |
| **Install** | npm | uv (Python) |
| **Artifacts** | Per-change folders | Per-feature with contracts |
| **Governance** | Minimal | Constitution-based |
| **Customization** | Config-based | Presets + Extensions |
| **AI support** | 20+ tools | 30+ tools |
| **Best for** | Quick iteration, small-medium scope | Large projects, team standards |

---

## Pros
- Lightest ceremony among SDD tools
- Proposal-driven: easy entry point for any change
- No rigid phase gates — fluid iteration
- Per-change artifact folders prevent lost requirements
- npm install (no Python dependency)
- Dashboard for visual monitoring
- Works with 20+ AI tools

## Cons
- Less rigorous than Spec Kit (no constitution, no formal analysis)
- Fewer customization layers (no preset/extension system)
- No built-in agent orchestration
- No deployment or testing features
- Requires Node.js 20.19.0+
- Smaller community and ecosystem
- No detailed task dependency analysis
