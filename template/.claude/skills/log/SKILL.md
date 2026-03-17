---
name: log
description: Audit and improve logging practices. Review logging for a specific feature, audit the entire project, or set up logging infrastructure.
argument-hint: "[feature-name] | --audit | --setup"
context: fork
---

## Routing

Parse `$ARGUMENTS` to determine mode:

- **`--setup`**: Spawn `log-auditor` agent (haiku) with:
  ```
  Set up logging infrastructure for this project.
  Ask the user about their logging preferences (library, structured logging, correlation IDs, PII redaction, console.log blocking).
  Write the result to spec/LOG_STRATEGY.md.
  Provide setup guidance for the chosen library.
  If log-analysis skill is not installed, suggest: "npx nextjs-claude-code skill-add log-analysis"
  ```

- **`--audit`**: Spawn `log-auditor` agent (haiku) with:
  ```
  Audit logging practices across the entire project.
  Generate a project-wide logging health report.
  Do not modify any code.
  ```

- **Feature mode** (default): Spawn `log-auditor` agent (haiku) with:
  ```
  Audit and fix logging for feature: [feature-name from $ARGUMENTS]
  Read spec/LOG_STRATEGY.md for rules.
  Propose fixes and apply after user confirmation.
  ```
