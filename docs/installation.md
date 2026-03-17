# NCC Installation Guide

## npx

```bash
npx nextjs-claude-code@latest
```

**What you'll be asked:**

1. Project name
2. Framework (Next.js App Router / Pages Router / React)
3. Team size (Solo / Small / Medium / Large)
4. Architecture pattern (suggested based on team size)
5. Libraries (react-hook-form, zod, TanStack Query, shadcn/ui, Tailwind, etc.)
6. Feature list
7. Confirm install

---

## Claude Code Plugin

Install NCC as a Claude Code plugin. Agents and skills are loaded automatically — no file copying needed.

```bash
# Add the marketplace
/plugin marketplace add ByeongminLee/nextjs-claude-code

# Install the plugin
/plugin install nextjs-claude-code@nextjs-claude-code
```

Skills are namespaced as `/nextjs-claude-code:spec`, `/nextjs-claude-code:dev`, etc.

> **Note**: Plugin install provides agents, skills, and hooks but does NOT install `spec/` template files (PROJECT.md, ARCHITECTURE.md, RULE.md, etc.). Run `/init` after plugin install to set up spec docs, or use npx for full scaffolding.

---

## What Gets Installed

```
.claude/
  agents/          Specialized agents (init, spec-writer, planner, lead-engineer,
                   db-engineer, ui-engineer, worker-engineer, verifier,
                   reviewer, code-quality-reviewer, loop, status, debugger,
                   rule-writer)
  skills/          Reference skills from skills.sh + skills-manifest.json
  scripts/         validate-spec.sh, reflect-spec.sh (PostToolUse hooks)
  settings.json    Hook configuration (merged, preserves existing hooks)

spec/
  PROJECT.md       Project context (framework, arch, libraries, testing setup)
  ARCHITECTURE.md  Feature map + directory structure (arch-specific)
  RULE.md          Workflow rules (immutable)
  STATE.md         All features and their phases (multi-feature)
  rules/           Project coding rules (managed by /rule)
  feature/[name]/
    spec.md        What to build (REQ-NNN format)
    design.md      How to build it (components, state, data flow)
    PLAN.md        WHAT — task list, checkpoints, auto-fix budget
    CONTEXT.md     WHY — locked decisions, constraints, non-negotiables
    LOOP_NOTES.md  Cross-iteration context for /loop (created/deleted by loop agent)
    history/       Change history archive

CLAUDE.md          Session start instructions (appended, not overwritten)
```

---

## CLI Options

```bash
npx nextjs-claude-code@latest                       # Interactive install
npx nextjs-claude-code@latest --force               # Overwrite existing files
npx nextjs-claude-code@latest --dry-run             # Preview without writing
```

**Re-fetch latest skills after plugin update:**

```bash
npx nextjs-claude-code@latest --force
```
