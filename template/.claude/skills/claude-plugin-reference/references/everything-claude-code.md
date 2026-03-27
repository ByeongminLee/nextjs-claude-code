# Everything Claude Code (ECC)

- **Repository**: [affaan-m/everything-claude-code](https://github.com/affaan-m/everything-claude-code)
- **Focus**: Agent harness performance optimization system
- **Install**: Plugin marketplace or manual clone
- **License**: MIT
- **Platforms**: Claude Code, Cursor, Codex, OpenCode, Antigravity

---

## What It Does

A comprehensive performance optimization system with 28 agents, 116 skills, 59 commands, and 34 rules — evolved through 10+ months of daily use. Emphasis on token optimization, continuous learning, security scanning, and research-first development.

---

## Key Components

| Component | Count | Examples |
| --- | --- | --- |
| Agents | 28 | planner, architect, code-reviewer, security-reviewer, build-error-resolver, language-specific reviewers |
| Skills | 116 | TDD, security, Django, Spring Boot, Laravel, frontend/backend patterns |
| Commands | 59 | /tdd, /plan, /code-review, /build-fix, /e2e, /verify, /learn, /security-scan |
| Rules | 34 | Common + language-specific (TypeScript, Python, Go, PHP, Java, Kotlin, Perl, C++) |
| Hook events | 8+ | Session lifecycle, compaction, pre-compilation |
| MCP configs | 14 | GitHub, Supabase, Vercel, Railway |

---

## Key Features

### Token Optimization
- Default to Sonnet (~60% cost reduction) with Opus for complex reasoning
- Limit thinking tokens to 10k (vs 32k default)
- Strategic compaction at logical breakpoints
- Replace MCPs with CLI-based skills for further savings

### Continuous Learning v2
Instinct-based system that auto-extracts patterns from sessions:
- Confidence scoring for learned patterns
- `/instinct-import`, `/instinct-export`, `/evolve` commands
- Stop hook (not UserPromptSubmit) for lightweight persistence

### AgentShield Security
- 102 static analysis rules across 1,280 tests
- Scans for secrets (14 patterns), permission issues, hook injection risks
- MCP server vulnerability detection
- 5 security categories

### Cross-Platform Architecture
- DRY adapter pattern: Cursor hook scripts delegate to shared `scripts/hooks/`
- Universal `AGENTS.md` at repo root read by all platforms
- SKILL.md format with YAML frontmatter for universal compatibility

### Research-First Development
Typical workflow: `/plan` → `/tdd` → `/code-review`
Debugging: `/tdd` (failing test) → implement → verify
Production: `/security-scan` → `/e2e` → `/test-coverage`

---

## Guides Included

- [The Shortform Guide](https://github.com/affaan-m/everything-claude-code/blob/main/the-shortform-guide.md) — Setup and base infrastructure
- [The Longform Guide](https://github.com/affaan-m/everything-claude-code/blob/main/the-longform-guide.md) — Advanced patterns (token economics, memory, verification, parallelization)
- [The Security Guide](https://github.com/affaan-m/everything-claude-code/blob/main/the-security-guide.md) — Agentic security (attack vectors, sandboxing, CVEs)

---

## Pros
- Largest skill/agent library (116 skills, 28 agents, 59 commands)
- Multi-language support (12+ ecosystems)
- Strong security posture with AgentShield
- Comprehensive documentation (3 guides)
- Cross-platform (5 tools supported)
- Active community (50k+ stars, 30+ contributors)

## Cons
- Rules must be manually installed (plugin system limitation)
- Sheer volume can be overwhelming — 116 skills is a lot to learn
- No opinionated workflow (provides tools, not a workflow)
- Configuration complexity across multiple platforms
- Some features overlap with built-in Claude Code capabilities
