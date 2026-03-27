# Subagent Best Practices

## Why Use Subagents

Subagents run in their own context window and report back summaries. This is one of the most powerful tools for managing context — the fundamental constraint of Claude Code.

When Claude researches a codebase, it reads lots of files that consume your context. Subagents keep your main conversation clean:

```text
Use subagents to investigate how our authentication system handles token
refresh, and whether we have any existing OAuth utilities I should reuse.
```

## Skill vs Subagent

| Aspect | Skill | Subagent |
| --- | --- | --- |
| **What it is** | Reusable instructions, knowledge, or workflows | Isolated worker with its own context |
| **Key benefit** | Share content across contexts | Context isolation — only summary returns |
| **Best for** | Reference material, invocable workflows | Tasks that read many files, parallel work |

Skills and subagents combine: a subagent can preload specific skills (`skills:` field), and a skill can run in isolated context using `context: fork`.

## Subagent vs Agent Team

| Aspect | Subagent | Agent team |
| --- | --- | --- |
| **Context** | Own context; results return to caller | Fully independent context |
| **Communication** | Reports back to main agent only | Teammates message each other directly |
| **Coordination** | Main agent manages all work | Shared task list with self-coordination |
| **Best for** | Focused tasks where only result matters | Complex work requiring discussion |
| **Token cost** | Lower: results summarized back | Higher: each teammate is separate instance |

**Transition point:** If parallel subagents hit context limits or need to communicate with each other, agent teams are the next step.

---

## The Context Problem

Sub-agents only know the literal query, not the PURPOSE behind the request. The orchestrator has semantic context the sub-agent lacks.

**Key:** Pass objective context, not just the query.

---

## Iterative Retrieval Pattern

1. Orchestrator evaluates every sub-agent return
2. Ask follow-up questions before accepting
3. Sub-agent goes back to source, gets answers, returns
4. Loop until sufficient (max 3 cycles)

---

## Orchestrator Sequential Phases

```
Phase 1: RESEARCH (Explore agent)          → research-summary.md
Phase 2: PLAN (planner agent)              → plan.md
Phase 3: IMPLEMENT (tdd-guide agent)       → code changes
Phase 4: REVIEW (code-reviewer agent)      → review-comments.md
Phase 5: VERIFY (build-error-resolver)     → done or loop back
```

**Key rules:**
1. Each agent gets ONE clear input and produces ONE clear output
2. Outputs become inputs for the next phase
3. Never skip phases
4. Use `/clear` between agents
5. Store intermediate outputs in files

---

## Creating Custom Subagents

Define specialized assistants in `.claude/agents/`:

```markdown
---
name: security-reviewer
description: Reviews code for security vulnerabilities
tools: Read, Grep, Glob, Bash
model: opus
---
You are a senior security engineer. Review code for:
- Injection vulnerabilities (SQL, XSS, command injection)
- Authentication and authorization flaws
- Secrets or credentials in code
- Insecure data handling

Provide specific line references and suggested fixes.
```

Tell Claude to use subagents explicitly: *"Use a subagent to review this code for security issues."*

---

## Subagents for Verification

Use subagents after implementation for independent review:

```text
use a subagent to review this code for edge cases
```

The subagent has fresh context without the bias of having written the code.
