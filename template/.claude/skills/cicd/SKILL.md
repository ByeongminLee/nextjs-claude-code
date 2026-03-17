---
name: cicd
description: Set up or update CI/CD pipeline. Analyzes project stack, git strategy, and test strategy to generate deployment configurations. Uses find-skills for platform-specific guidance.
argument-hint: "[--update]"
context: fork
---

## Task

Parse `$ARGUMENTS`:

- **`--update`**: Spawn `cicd-builder` agent (sonnet) with:
  ```
  Update existing CI/CD pipeline configuration.
  Read spec/CICD.md for current setup and update based on project changes.
  ```

- **Default (no args)**: Spawn `cicd-builder` agent (sonnet) with:
  ```
  Set up a CI/CD pipeline for this project.
  Analyze the project stack, branch strategy, and test configuration.
  Use find-skills to discover platform-specific deployment skills.
  Generate CI/CD configuration files and spec/CICD.md documentation.
  ```
