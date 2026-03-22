# Context and Memory Management

## Two Memory Systems

Claude Code has two complementary memory systems, both loaded at the start of every conversation:

| | CLAUDE.md files | Auto memory |
| --- | --- | --- |
| **Who writes it** | You | Claude |
| **What it contains** | Instructions and rules | Learnings and patterns |
| **Scope** | Project, user, or org | Per working tree |
| **Loaded into** | Every session | Every session (first 200 lines) |
| **Use for** | Coding standards, workflows, project architecture | Build commands, debugging insights, preferences Claude discovers |

---

## CLAUDE.md Files

CLAUDE.md files are markdown files that give Claude persistent instructions. They can live in several locations:

| Scope | Location | Purpose |
| --- | --- | --- |
| **Managed policy** | `/Library/Application Support/ClaudeCode/CLAUDE.md` (macOS) | Organization-wide instructions |
| **Project** | `./CLAUDE.md` or `./.claude/CLAUDE.md` | Team-shared project instructions |
| **User** | `~/.claude/CLAUDE.md` | Personal preferences for all projects |

### Writing Effective CLAUDE.md

- **Size**: Target under 200 lines per file. Longer files reduce adherence.
- **Structure**: Use markdown headers and bullets to group related instructions.
- **Specificity**: "Use 2-space indentation" beats "Format code properly".
- **Consistency**: Conflicting rules cause arbitrary behavior. Review periodically.

### What to Include vs Exclude

| Include | Exclude |
| --- | --- |
| Bash commands Claude can't guess | Anything Claude can figure out from code |
| Code style rules that differ from defaults | Standard conventions Claude already knows |
| Testing instructions and preferred runners | Detailed API documentation (link instead) |
| Repo etiquette (branch naming, PR conventions) | Information that changes frequently |
| Architectural decisions specific to your project | Long explanations or tutorials |
| Developer environment quirks | Self-evident practices like "write clean code" |

### Imports

CLAUDE.md files can import additional files using `@path/to/import` syntax:

```markdown
See @README.md for project overview and @package.json for available npm commands.
# Additional Instructions
- Git workflow: @docs/git-instructions.md
- Personal overrides: @~/.claude/my-project-instructions.md
```

### Path-Specific Rules

Use `.claude/rules/` for scoped instructions with YAML frontmatter:

```markdown
---
paths:
  - "src/api/**/*.ts"
---
# API Development Rules
- All API endpoints must include input validation
- Use the standard error response format
```

Rules without a `paths` field load unconditionally. Path-scoped rules trigger only when Claude reads matching files.

---

## Auto Memory

Auto memory lets Claude accumulate knowledge across sessions without manual effort. Claude saves build commands, debugging insights, architecture notes, and workflow habits.

- Storage: `~/.claude/projects/<project>/memory/`
- `MEMORY.md` acts as an index (first 200 lines loaded every session)
- Topic files loaded on demand
- All plain markdown — you can edit or delete at any time
- Run `/memory` to browse and manage

---

## Session Persistence (Community Pattern)

For sharing memory across sessions, a skill that summarizes progress and saves to a `.tmp` file in `.claude/` folder works well. Create a new file for each session so old context doesn't pollute new work.

Session files should contain:
- What approaches worked (with evidence)
- Which approaches were attempted but failed
- What's left to do

---

## Dynamic System Prompt Injection

Instead of putting everything in CLAUDE.md, use CLI flags to load context surgically:

```bash
claude --system-prompt "$(cat memory.md)"
```

Priority hierarchy: System prompt > User messages > Tool results.

**Practical aliases:**
```bash
alias claude-dev='claude --system-prompt "$(cat ~/.claude/contexts/dev.md)"'
alias claude-review='claude --system-prompt "$(cat ~/.claude/contexts/review.md)"'
alias claude-research='claude --system-prompt "$(cat ~/.claude/contexts/research.md)"'
```

---

## Memory Persistence Hooks

- **PreCompact Hook**: Save important state before context compaction
- **Stop Hook (Session End)**: Persist learnings to a file
- **SessionStart Hook**: Load previous context automatically

---

## Managing Context During Sessions

- `/clear` between unrelated tasks to reset context entirely
- `/compact <instructions>` for targeted compaction
- `Esc + Esc` or `/rewind` to summarize from a selected message
- `/btw` for side questions that don't enter conversation history
- CLAUDE.md fully survives compaction — re-read from disk after `/compact`
- Add to CLAUDE.md: `"When compacting, always preserve the full list of modified files and any test commands"` to ensure critical context survives
