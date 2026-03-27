# Parallelization Strategies

## Core Principle

> **Goal: How much can you get done with the minimum viable amount of parallelization.**

Parallelism should only be used for tasks where it provides clear value (multi-module work, parallel reviews). For simple sequential tasks, subagents are more token-efficient.

Don't set arbitrary terminal counts. The addition of a terminal should be out of true necessity.

---

## Running Multiple Sessions

Three main ways to run parallel sessions:

1. **Claude Code desktop app**: Manage multiple local sessions visually. Each gets its own isolated worktree.
2. **Claude Code on the web**: Run on Anthropic's cloud infrastructure in isolated VMs.
3. **Agent teams**: Automated coordination of multiple sessions with shared tasks and peer-to-peer messaging.

---

## Git Worktrees for Parallel Instances

```bash
# Create worktrees for parallel work
git worktree add ../project-feature-a feature-a
git worktree add ../project-feature-b feature-b
git worktree add ../project-refactor refactor-branch

# Each worktree gets its own Claude instance
cd ../project-feature-a && claude
```

If multiple instances work on overlapping code, you **must** use git worktrees and have a well-defined plan for each. Use `/rename <name>` to name all your chats.

---

## The Cascade Method

When running multiple Claude Code instances:
- Open new tasks in new tabs to the right
- Sweep left to right, oldest to newest
- Focus on at most 3-4 tasks at a time

---

## Writer/Reviewer Pattern

Use fresh context for code review — Claude won't be biased toward code it just wrote:

| Session A (Writer) | Session B (Reviewer) |
| --- | --- |
| `Implement a rate limiter for our API endpoints` | |
| | `Review the rate limiter implementation in @src/middleware/rateLimiter.ts. Look for edge cases, race conditions, and consistency with our existing middleware patterns.` |
| `Here's the review feedback: [Session B output]. Address these issues.` | |

---

## Fan-Out Pattern

For large migrations or analyses, distribute work across many parallel Claude invocations:

1. **Generate a task list**: Have Claude list all files that need migrating
2. **Loop through the list**:
   ```bash
   for file in $(cat files.txt); do
     claude -p "Migrate $file from React to Vue. Return OK or FAIL." \
       --allowedTools "Edit,Bash(git commit *)"
   done
   ```
3. **Test on a few files first**, then run at scale

You can also integrate into data/processing pipelines:
```bash
claude -p "<your prompt>" --output-format json | your_command
```

---

## Non-Interactive Mode

Use `claude -p "prompt"` in CI, pre-commit hooks, or scripts:

```bash
# One-off queries
claude -p "Explain what this project does"

# Structured output for scripts
claude -p "List all API endpoints" --output-format json

# Streaming for real-time processing
claude -p "Analyze this log file" --output-format stream-json
```
