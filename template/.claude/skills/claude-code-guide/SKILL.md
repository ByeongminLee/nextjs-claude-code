---
name: claude-code-guide
description: Advanced Claude Code usage guide covering token optimization, memory/context management, subagent architecture, parallelization strategies, verification loops, continuous learning, environment setup, workflow patterns, and agentic security. Use this skill whenever the user asks about Claude Code tips, best practices, workflows, optimization, context management, subagents, parallel work, efficient development setup, CLAUDE.md, hooks, skills creation, session management, or agent security. Also trigger on keywords like "Claude Code tips", "save tokens", "context management", "subagent", "parallel work", "workflow optimization", "CLAUDE.md", "memory persistence", "agent security", "prompt injection", "sandboxing".
---

# Claude Code Advanced Guide

A comprehensive guide to maximizing Claude Code productivity, combining community-proven patterns from [The Longform Guide to Everything Claude Code](https://github.com/affaan-m/everything-claude-code) by @affaanmustafa with official Anthropic documentation.

## How to Use This Skill

This skill is organized into topic-specific reference files. Read only the file relevant to the user's question:

| Topic | Reference File | When to Read |
| --- | --- | --- |
| Token optimization & model selection | `references/token-optimization.md` | Questions about reducing costs, choosing models for subagents, replacing MCPs with CLI |
| Context & memory management | `references/context-memory.md` | Questions about CLAUDE.md, auto memory, session persistence, context clearing, compaction |
| Subagent best practices | `references/subagents.md` | Questions about orchestrating subagents, context isolation, iterative retrieval, sequential phases |
| Parallelization strategies | `references/parallelization.md` | Questions about running multiple Claude instances, git worktrees, cascade method, fan-out |
| Verification & evals | `references/verification-evals.md` | Questions about testing, verification loops, pass@k vs pass^k, benchmarking skills |
| Environment setup | `references/environment-setup.md` | Questions about configuring permissions, hooks, skills, MCP, CLI tools, plugins |
| Workflow patterns & tips | `references/workflow-patterns.md` | Questions about planning workflows, continuous learning, project kickoff, practical tips |
| Agentic security | `references/agentic-security.md` | Questions about agent security, prompt injection, sandboxing, attack vectors, CVEs, kill switches, sanitization |

Read the relevant reference file(s) before answering. Do NOT load all files at once — only load what the user's question requires.
