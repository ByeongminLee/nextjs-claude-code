# Skill Injection Budget

> **Immutable.** Controls how many skills each agent reads per task to prevent context bloat.

## Why budget matters

Each skill directory can be 5-50KB. Reading all available skills wastes context tokens and degrades output quality — the model focuses less on the actual task. Fresh Context subagents are especially impacted because they start with a clean window and must load everything from scratch.

## Budget Rules

### Per-task skill read limit

| Agent | Max skills per task | Priority order |
|-------|-------------------|----------------|
| `task-executor` | **3** | 1. Task-specific (from UPSTREAM hints) → 2. Domain match → 3. General (clean-code, error-handling) |
| `db-engineer` | **2** | 1. ORM-specific docs (external fetch) → 2. error-handling-patterns |
| `ui-engineer` | **3** | 1. Component library (shadcn, ui-reference) → 2. Design (frontend-design, web-design-guidelines) → 3. Composition patterns |
| `worker-engineer` | **0** | Worker tasks are simple enough to not need skills |
| `code-quality-reviewer` | **3** | 1. readability → 2. cohesion → 3. coupling + predictability (count as 1 pair) |
| `verifier` | **0** | Verification uses spec.md criteria, not skills |
| `lead-engineer` | **1** | Only architectures/ if needed for coordination |
| `performance-optimizer` | **2** | 1. nextjs-vercel or vercel-react-best-practices → 2. web-vitals |

### How to apply

1. **Before reading any skill**, check if you've already read the max allowed
2. **Prioritize by task relevance** — a task creating a Zod schema doesn't need frontend-design skills
3. **Skip general skills** if you already have a task-specific one loaded
4. **Never pre-load all skills** in your scope section — only read what this specific task needs

### Priority ordering

When deciding which skills to read within the budget:

```
Priority 1: Skills directly referenced in the task description or UPSTREAM hints
            e.g., "Create MSW mock handler" → error-handling-patterns
Priority 2: Skills matching the file type being created/modified
            e.g., .tsx component → vercel-react-best-practices
Priority 3: General quality skills (clean-code, readability)
            Only if Priority 1 and 2 didn't fill the budget
```

### Exceptions

- **First task of a feature**: May read +1 additional skill to understand overall patterns
- **Review agents** (task-spec-reviewer, reviewer): Budget does not apply — reviewers need comprehensive coverage
- **`/loop` iterations**: Budget applies normally per iteration
- **External doc fetch** (e.g., Drizzle llms.txt, Prisma llms.txt): Does NOT count toward skill budget — these are reference lookups, not skill reads
