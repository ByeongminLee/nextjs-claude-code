---
name: review
description: Check how well the current implementation matches the feature spec and evaluate code quality. Runs spec compliance review followed by code quality review. Optionally runs unit/integration test audit, logging audit, and security audit when strategy files exist. Does not modify code.
argument-hint: "[feature name]"
context: fork
---

## Scope boundary

- `/review` is an audit command, not a browser QA command.
- Browser E2E, visual regression, and accessibility checks are handled by `/qa`.

## Model selection

Before spawning agents, assess task size per `spec/rules/_model-routing.md`:
- **reviewer**: Read spec.md REQ count and count implementation files. If ≤5 REQs AND <5 files → haiku. Otherwise → sonnet.
- **code-quality-reviewer**: always haiku (static analysis, pattern detection).
- **tester**: sonnet (test analysis requires reasoning). Only if `spec/TEST_STRATEGY.md` exists.
- **log-auditor**: haiku (pattern matching). Only if `spec/LOG_STRATEGY.md` exists.
- **security-reviewer**: sonnet (semantic vulnerability analysis). Only if `spec/SECURITY_STRATEGY.md` exists.

## Step 1 — Parallel Review Agents

Spawn **all applicable agents in parallel**:

### Always run:

1. **reviewer** agent (with assessed model):
   ```
   [HANDOFF]
   TO: reviewer ({assessed model})
   TASK: Check spec compliance for feature "$ARGUMENTS"
   DONE-WHEN:
     - Every REQ-NNN has PASS/PARTIAL/MISSING status with evidence
   MUST-NOT:
     - Modify any file
     - Suggest features beyond the spec
   READS:
     - spec/feature/[$ARGUMENTS]/spec.md
     - spec/feature/[$ARGUMENTS]/design.md
   [/HANDOFF]
   ```

2. **code-quality-reviewer** agent (haiku):
   ```
   [HANDOFF]
   TO: code-quality-reviewer (haiku)
   TASK: Review code quality for feature "$ARGUMENTS"
   DONE-WHEN:
     - Quality report with severity-rated issues (CRITICAL/HIGH/MEDIUM/LOW)
   MUST-NOT:
     - Modify any file
   READS:
     - spec/rules/
   [/HANDOFF]
   ```

### Conditional — only if strategy files exist:

3. **tester** agent (sonnet) — only if `spec/TEST_STRATEGY.md` exists:
   ```
   [HANDOFF]
   TO: tester (sonnet)
   TASK: Run unit/integration tests and report results for feature "$ARGUMENTS" (audit mode)
   DONE-WHEN:
     - Test execution report with pass/fail counts
   MUST-NOT:
     - Modify source code (review mode only)
     - Run browser visual or accessibility QA flows
   READS:
     - spec/TEST_STRATEGY.md
     - spec/feature/[$ARGUMENTS]/spec.md
   [/HANDOFF]
   ```

4. **log-auditor** agent (haiku) — only if `spec/LOG_STRATEGY.md` exists:
   ```
   [HANDOFF]
   TO: log-auditor (haiku)
   TASK: Audit logging practices for feature "$ARGUMENTS"
   DONE-WHEN:
     - Logging audit report with findings
   MUST-NOT:
     - Modify any code (review mode only)
   READS:
     - spec/LOG_STRATEGY.md
   [/HANDOFF]
   ```

5. **security-reviewer** agent (sonnet) — only if `spec/SECURITY_STRATEGY.md` exists:
   ```
   [HANDOFF]
   TO: security-reviewer (sonnet)
   TASK: Run security audit for feature "$ARGUMENTS"
   DONE-WHEN:
     - Security audit report (secrets, XSS, injection, auth)
   MUST-NOT:
     - Modify any code (review mode only)
   READS:
     - spec/SECURITY_STRATEGY.md
     - spec/feature/[$ARGUMENTS]/spec.md
   [/HANDOFF]
   ```

Wait for all spawned agents to complete.

## Step 2 — Combined Report

Present all reports to the user in order:
1. Spec compliance report (from reviewer)
2. Code quality report (from code-quality-reviewer)
3. Test results report (from tester) — if applicable
4. Logging audit report (from log-auditor) — if applicable
5. Security audit report (from security-reviewer) — if applicable

If tester, log-auditor, or security-reviewer was skipped, note at the end:
```
Skipped: [Test audit / Log audit / Security audit] — strategy file not configured.
Run [/test --setup / /log --setup / /security --setup] to enable.
For browser, visual, or accessibility validation, run `/qa`.
```
