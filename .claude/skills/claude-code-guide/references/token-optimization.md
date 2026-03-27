# Token Optimization

## Replace MCPs with CLI-Based Skills

MCPs for platforms like GitHub, Supabase, and Vercel are convenient but consume context window and tokens. Most platforms already have robust CLIs that the MCP is essentially wrapping.

**Pattern:** Extract the tools the MCP exposes and convert them into commands/skills that call the CLI directly.

**Examples:**
- Instead of GitHub MCP loaded at all times, create a `/gh-pr` command wrapping `gh pr create`
- Instead of Supabase MCP eating context, create skills that use the Supabase CLI directly

With lazy loading, the context window issue is mostly solved. But token **cost** is not — the CLI + skills approach is still a token optimization method.

**Check MCP token costs:** Run `/mcp` to see token costs per server. Disconnect servers you're not actively using.

---

## Subagent Model Selection Guide

Optimize by delegating to the cheapest model sufficient for the task.

| Task Type                 | Model  | Why                                        |
| ------------------------- | ------ | ------------------------------------------ |
| Exploration/search        | Haiku  | Fast, cheap, good enough for finding files |
| Simple edits              | Haiku  | Single-file changes, clear instructions    |
| Multi-file implementation | Sonnet | Best balance for coding                    |
| Complex architecture      | Opus   | Deep reasoning needed                      |
| PR reviews                | Sonnet | Understands context, catches nuance        |
| Security analysis         | Opus   | Can't afford to miss vulnerabilities       |
| Writing docs              | Haiku  | Structure is simple                        |
| Debugging complex bugs    | Opus   | Needs to hold entire system in mind        |

**Default rule:** Use Sonnet for 90% of coding tasks. Upgrade to Opus when the first attempt failed, the task spans 5+ files, involves architectural decisions, or is security-critical code.

---

## Modular Codebase Benefits

Keeping main files in hundreds of lines instead of thousands helps both with token cost reduction and getting tasks right on the first try.

---

## Context Cost by Feature

Each feature has a different loading strategy and context cost:

| Feature         | When it loads             | What loads                                    | Context cost                                 |
| --------------- | ------------------------- | --------------------------------------------- | -------------------------------------------- |
| **CLAUDE.md**   | Session start             | Full content                                  | Every request                                |
| **Skills**      | Session start + when used | Descriptions at start, full content when used | Low (descriptions every request)             |
| **MCP servers** | Session start             | All tool definitions and schemas              | Every request                                |
| **Subagents**   | When spawned              | Fresh context with specified skills           | Isolated from main session                   |
| **Hooks**       | On trigger                | Nothing (runs externally)                     | Zero, unless hook returns additional context |

Use `disable-model-invocation: true` in a skill's frontmatter to hide it from Claude until manually invoked — zero context cost until you trigger it.

---

## Reduce Token Usage Strategies

- Track context usage continuously with a custom status line
- Use `/clear` between unrelated tasks
- Scope investigations narrowly or use subagents so exploration doesn't consume main context
- Use `/btw` for quick questions — the answer appears in a dismissible overlay and never enters conversation history
- Use `/compact <instructions>` for targeted compaction (e.g., `/compact Focus on the API changes`)
