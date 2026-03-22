---
name: claude-plugin-reference
description: Reference guide for major Claude Code plugins and spec-driven development tools. Covers GSD, gstack, Everything Claude Code, Oh My OpenAgent, Superpowers, Vercel Plugin, Spec Kit, and OpenSpec. Use this skill when the user asks about Claude Code plugins, plugin comparisons, spec-driven development (SDD), workflow tools, or wants to learn features from other plugins. Also trigger on keywords like "plugin reference", "GSD", "gstack", "ECC", "superpowers", "spec-kit", "openspec", "SDD", "spec-driven", "plugin comparison".
---

# Claude Plugin Reference

A curated analysis of major Claude Code plugins and spec-driven development tools. Each reference file covers architecture, key features, pros/cons, and unique approaches.

## Plugin Reference Table

| Plugin | Focus | Reference File | When to Read |
| --- | --- | --- | --- |
| **Get Shit Done (GSD)** | Spec-driven workflow with multi-agent orchestration | `references/get-shit-done.md` | Full project lifecycle, wave execution, context engineering, XML prompts |
| **gstack** | Virtual engineering team with sprint workflow | `references/gstack.md` | Role-based skills, browser testing, deployment pipelines, parallel sprints |
| **Everything Claude Code (ECC)** | Performance optimization system | `references/everything-claude-code.md` | Token optimization, 116 skills, continuous learning, AgentShield security |
| **Oh My OpenAgent (OmO)** | Multi-model orchestration | `references/oh-my-openagent.md` | Multi-provider agents, hash-anchored edits, LSP/AST integration |
| **Superpowers** | TDD-focused development workflow | `references/superpowers.md` | Test-driven development, systematic debugging, subagent-driven dev |
| **Vercel Plugin** | Vercel ecosystem expertise | `references/vercel-plugin.md` | Vercel deployment, Next.js, AI SDK, 47 specialized skills |
| **Spec Kit** | Spec-driven development framework | `references/spec-kit.md` | SDD methodology, constitution, specification, 30+ AI agent support |
| **OpenSpec** | Lightweight spec framework | `references/openspec.md` | Proposal-driven workflow, artifact management, lightweight SDD |

Read only the relevant reference file(s). Do NOT load all at once.

## Quick Comparison by Category

### Spec-Driven Development (SDD)
When the user asks about SDD, specifications, or structured development planning, read **Spec Kit** and **OpenSpec** first. GSD also has strong spec-driven elements.

### Full Lifecycle Workflow
For end-to-end project management (plan → build → test → ship): **GSD**, **gstack**, **Superpowers**

### Multi-Agent Orchestration
For parallel agent execution and orchestration patterns: **GSD** (wave execution), **OmO** (Sisyphus orchestrator), **ECC** (28 subagents)

### Token/Performance Optimization
For context management and cost reduction: **ECC** (primary focus), **OmO** (hash-anchored edits)

### Testing & Quality
For TDD, QA, verification: **Superpowers** (TDD core), **gstack** (/qa with real browser), **GSD** (verification loops)

### Platform-Specific
For Vercel/Next.js ecosystem: **Vercel Plugin**
