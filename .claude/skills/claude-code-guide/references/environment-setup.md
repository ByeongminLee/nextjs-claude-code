# Environment Setup

## Extension Features Overview

Extensions plug into different parts of the agentic loop:

| Feature | What it does | When to use it |
| --- | --- | --- |
| **CLAUDE.md** | Persistent context loaded every conversation | Project conventions, "always do X" rules |
| **Skill** | Instructions, knowledge, and workflows | Reusable content, reference docs, repeatable tasks |
| **Subagent** | Isolated execution context returning summaries | Context isolation, parallel tasks, specialized workers |
| **Agent teams** | Coordinate multiple independent sessions | Parallel research, debugging with competing hypotheses |
| **MCP** | Connect to external services | External data or actions (database, Slack, browser) |
| **Hook** | Deterministic script on events | Predictable automation, no LLM involved |
| **Plugin** | Bundle skills, hooks, subagents, MCP | Reuse same setup across repos, distribute to others |

---

## Configure Permissions

Use `/permissions` to allowlist safe commands or `/sandbox` for OS-level isolation. This reduces interruptions while keeping you in control.

Use `--dangerously-skip-permissions` only in sandboxes without internet access for contained workflows like fixing lint errors or generating boilerplate.

---

## Use CLI Tools

CLI tools are the most context-efficient way to interact with external services. If you use GitHub, install the `gh` CLI. Claude knows how to use it for creating issues, opening PRs, and reading comments.

Claude is also effective at learning CLI tools it doesn't already know:
```text
Use 'foo-cli-tool --help' to learn about foo tool, then use it to solve A, B, C.
```

---

## Set Up Hooks

Hooks run scripts automatically at specific points in Claude's workflow. Unlike CLAUDE.md instructions which are advisory, hooks are deterministic.

Claude can write hooks for you:
- "Write a hook that runs eslint after every file edit"
- "Write a hook that blocks writes to the migrations folder"

Edit `.claude/settings.json` directly to configure hooks, and run `/hooks` to browse what's configured.

---

## Create Skills

Skills extend Claude's knowledge with project/team/domain-specific information.

```markdown
# .claude/skills/api-conventions/SKILL.md
---
name: api-conventions
description: REST API design conventions for our services
---
# API Conventions
- Use kebab-case for URL paths
- Use camelCase for JSON properties
- Always include pagination for list endpoints
```

Skills can also define invocable workflows:

```markdown
# .claude/skills/fix-issue/SKILL.md
---
name: fix-issue
description: Fix a GitHub issue
disable-model-invocation: true
---
Analyze and fix the GitHub issue: $ARGUMENTS.
1. Use `gh issue view` to get the issue details
2. Understand the problem
3. Search codebase for relevant files
4. Implement changes
5. Write and run tests
6. Create a descriptive commit and PR
```

Use `disable-model-invocation: true` for workflows with side effects that you want to trigger manually only.

---

## Connect MCP Servers

Run `claude mcp add` to connect external tools like Notion, Figma, or your database.

---

## Install Plugins

Run `/plugin` to browse the marketplace. Plugins add skills, tools, and integrations without configuration.

For typed languages, install a code intelligence plugin for precise symbol navigation and automatic error detection after edits.

---

## CLAUDE.md vs Rules vs Skills

| Aspect | CLAUDE.md | `.claude/rules/` | Skill |
| --- | --- | --- | --- |
| **Loads** | Every session | Every session, or when matching files opened | On demand |
| **Scope** | Whole project | Can be scoped to file paths | Task-specific |
| **Best for** | Core conventions and build commands | Language/directory-specific guidelines | Reference material, repeatable workflows |
