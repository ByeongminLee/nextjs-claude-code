---
name: security
description: Audit project security posture. Review for OWASP Top 10 vulnerabilities, secrets, injection flaws, and auth gaps. Use --setup to configure security strategy.
argument-hint: "[feature-name] | --setup | --audit | --diff | --fix"
context: fork
---

## Routing

Parse `$ARGUMENTS` to determine mode:

- **`--setup`**: Spawn `security-reviewer` agent (sonnet) with:
  ```
  Set up the security strategy for this project.
  Ask the user about their security preferences:
  1. Compliance requirements (GDPR, HIPAA, PCI DSS, SOC2, or none)
  2. Sensitive file patterns (auth, payment, encryption paths — offer sensible defaults)
  3. Dependency policy (block critical vulns, auto-update, manual review)
  4. Secret management approach (env vars, vault, cloud secrets manager)
  5. Custom security rules (project-specific patterns to flag)
  6. Severity threshold for reporting (critical, high, medium, low)
  Write the result to spec/SECURITY_STRATEGY.md.
  ```

- **`--audit`**: Spawn `security-reviewer` agent (sonnet) with:
  ```
  Run a project-wide security audit.
  Scan all source files and dependencies.
  Write report to spec/SECURITY_REPORT.md.
  Do not modify any code.
  ```

- **`--diff`**: Spawn `security-reviewer` agent (sonnet) with:
  ```
  Run a security audit on changed files only (git diff).
  Report findings for modified files.
  Do not modify any code.
  ```

- **`--fix`**: Spawn `security-reviewer` agent (sonnet) with:
  ```
  Run a full security audit, then propose fixes for each finding.
  Present all findings and proposed remediation to the user.
  Apply fixes only after user confirmation for each change.
  ```

- **Feature mode** (default — when `$ARGUMENTS` is a feature name): Spawn `security-reviewer` agent (sonnet) with:
  ```
  Run security audit for feature: [feature-name from $ARGUMENTS]
  Read spec/SECURITY_STRATEGY.md for rules.
  Check all files related to this feature.
  Write report to spec/SECURITY_REPORT.md.
  Do not modify any code.
  ```
