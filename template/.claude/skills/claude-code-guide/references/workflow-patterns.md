# Workflow Patterns and Tips

## Explore First, Then Plan, Then Code

Separate research and planning from implementation to avoid solving the wrong problem.

### Four-Phase Workflow

1. **Explore** (Plan Mode): Read files and answer questions without making changes.
   ```text
   read /src/auth and understand how we handle sessions and login.
   ```

2. **Plan** (Plan Mode): Create a detailed implementation plan.
   ```text
   I want to add Google OAuth. What files need to change? Create a plan.
   ```
   Press `Ctrl+G` to open the plan in your editor for direct editing.

3. **Implement** (Normal Mode): Code against the plan, verifying as you go.
   ```text
   implement the OAuth flow from your plan. write tests, run and fix failures.
   ```

4. **Commit**: Ask Claude to commit and create a PR.

Skip planning when the scope is clear and the fix is small. Planning is most useful when uncertain about the approach, when modifying multiple files, or when unfamiliar with the code.

---

## The Two-Instance Kickoff (New Projects)

Start a new repo with 2 open Claude instances:

### Instance 1: Scaffolding Agent
- Lay down project structure
- Create config files (CLAUDE.md, rules, agents)

### Instance 2: Deep Research Agent
- Connect to services, run web searches
- Create the detailed PRD
- Generate architecture mermaid diagrams
- Compile references with actual documentation clips

---

## llms.txt Pattern

Many documentation sites expose an LLM-optimized version of their docs at `/llms.txt`. Use it when building skills that reference external documentation or when you need to feed docs to Claude efficiently.

---

## Continuous Learning / Auto-Skill Generation

When Claude discovers non-trivial knowledge — a debugging technique, a workaround, a project-specific pattern — it should save that as a new skill for automatic future loading.

**Design decision:** Use a **Stop hook** (not UserPromptSubmit). UserPromptSubmit runs on every message adding latency. Stop runs once at session end — lightweight, no slowdown during the session.

---

## Let Claude Interview You

For larger features, have Claude interview you first:

```text
I want to build [brief description]. Interview me in detail using the
AskUserQuestion tool.

Ask about technical implementation, UI/UX, edge cases, concerns, and
tradeoffs. Don't ask obvious questions, dig into the hard parts.

Keep interviewing until we've covered everything, then write a complete
spec to SPEC.md.
```

Once the spec is complete, start a fresh session to execute it.

---

## Resume Conversations

```bash
claude --continue    # Resume the most recent conversation
claude --resume      # Select from recent conversations
```

Use `/rename` to give sessions descriptive names like `"oauth-migration"` so you can find them later.

---

## Build Reusable Patterns

> "Early on, I spent time building reusable workflows/patterns. Tedious to build, but this had a wild compounding effect as models and agent harnesses improved." — @omarsar0

**What to invest in:** Subagents, Skills, Commands, Planning patterns, MCP tools, Context engineering patterns.

---

## Practical Tips

### Voice Transcription
Talking to Claude Code with your voice is often faster than typing.
- Mac: superwhisper, MacWhisper
- Even with transcription mistakes, Claude understands intent

### Terminal Aliases
```bash
alias c='claude'
alias gb='github'
alias co='code'
alias q='cd ~/Desktop/projects'
```

### Dynamic System Prompt Aliases
```bash
alias claude-dev='claude --system-prompt "$(cat ~/.claude/contexts/dev.md)"'
alias claude-review='claude --system-prompt "$(cat ~/.claude/contexts/review.md)"'
alias claude-research='claude --system-prompt "$(cat ~/.claude/contexts/research.md)"'
```

---

## Common Failure Patterns to Avoid

- **The kitchen sink session**: Mixing unrelated tasks in one session. Fix: `/clear` between tasks.
- **Correcting over and over**: After two failed corrections, `/clear` and write a better prompt.
- **The over-specified CLAUDE.md**: Too long, Claude ignores half. Fix: Ruthlessly prune.
- **The trust-then-verify gap**: No tests or verification. Fix: Always provide verification.
- **The infinite exploration**: Unscoped investigation fills context. Fix: Use subagents.

---

## Ask Codebase Questions

Use Claude Code for learning and exploration — same questions you'd ask a senior engineer:

- How does logging work?
- How do I make a new API endpoint?
- What does `async move { ... }` do on line 134 of `foo.rs`?
- What edge cases does `CustomerOnboardingFlowImpl` handle?
- Why does this code call `foo()` instead of `bar()` on line 333?
