---
name: qa
description: AI-driven browser testing against feature specs. Default mode reads spec REQs and autonomously tests in a real browser via Playwright MCP. Also supports running existing Playwright test files, visual regression, and accessibility audits.
allowed-tools: Bash, Read, Glob, Grep, Agent
model: sonnet
---

# /qa — Browser Quality Assurance

AI-driven browser testing. The default mode reads your feature spec and autonomously drives a real browser to verify every REQ — clicking, typing, navigating like an actual user.

## Usage

```
/qa [feature]            # Spec-driven AI browser testing (default, thorough)
/qa --quick [feature]    # Spec-driven fast smoke test (primary flow only)
/qa --spec [feature]     # Explicit spec-driven testing
/qa --e2e [feature]      # Run existing Playwright test files
/qa --visual [feature]   # Visual regression (screenshot comparison)
/qa --a11y [feature]     # Accessibility audit (axe-core)
/qa --all [feature]      # Run all modes
/qa [test-path]          # Run specific test file (treated as --e2e)
```

## Routing

Parse `$ARGUMENTS` to determine mode:

- **`--quick`**: Spec-driven Mode with `SCOPE: commit` (fast smoke test — primary flow only)
- **`--e2e`**: Jump to E2E Mode
- **`--visual`**: Jump to Visual/A11y Mode with `MODE: visual`
- **`--a11y`**: Jump to Visual/A11y Mode with `MODE: a11y`
- **`--all`**: Run Spec-driven → E2E → Visual → A11y sequentially
- **`--spec` or no flag** (default): Jump to Spec-driven Mode with `SCOPE: branch` (thorough)
- **If argument looks like a file path** (contains `.spec.` or `.test.` or `/`): Treat as `--e2e` with that path

---

## Spec-driven Mode (default)

### 1. Resolve feature name

- Parse feature name from `$ARGUMENTS` (e.g., `/qa checkout-coupon`)
- If no feature name: read `spec/STATE.md` for the active feature
- If still no feature: list available features from `spec/feature/` and ask user

### 2. Verify spec exists

```
spec/feature/[name]/spec.md must exist
```

If not found:
```
No spec found for feature "[name]".
Run /spec [name] first to create a feature spec, or use /qa --e2e to run existing test files.
```
→ STOP

### 3. Verify dev server

Check if a dev server is already running on common ports:

```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 2>/dev/null | grep -q 200 && echo "http://localhost:3000" && exit 0
curl -s -o /dev/null -w "%{http_code}" http://localhost:3001 2>/dev/null | grep -q 200 && echo "http://localhost:3001" && exit 0
curl -s -o /dev/null -w "%{http_code}" http://localhost:5173 2>/dev/null | grep -q 200 && echo "http://localhost:5173" && exit 0
echo "NOT_RUNNING"
```

If not running → ask the user:
```
Dev server is not running. Please start it in a separate terminal:
  npm run dev
Then re-run /qa.
```
→ **STOP** — do not start the dev server automatically. Background processes are unreliable and leave orphan servers.

Record the BASE_URL that responded (e.g., `http://localhost:3000`).

### 4. Spawn browser-tester agent

```
[HANDOFF]
TO: browser-tester (sonnet)
TASK: Autonomous spec-based browser testing for feature "[feature-name]"
MODE: spec-driven
SCOPE: [branch (default) | commit (--quick)]
BASE_URL: [detected dev server URL]
DONE-WHEN:
  - Every REQ from spec.md has PASS/FAIL/SKIP with failure classification
  - Console errors checked after each navigation
  - Structured report with per-REQ results, evidence, and failure taxonomy
  - Adversarial edge cases tested (depth depends on SCOPE)
MUST-NOT:
  - Modify any file
  - Spend more than 4 attempts on any single REQ
  - Retry without new evidence (fresh snapshot, different approach)
READS:
  - spec/feature/[feature-name]/spec.md
  - spec/feature/[feature-name]/design.md
[/HANDOFF]
```

### 5. Collect and output final report

Receive the browser-tester report and output:

```markdown
# QA Report: [feature-name]
Date: YYYY-MM-DD | Mode: spec-driven

## Spec Compliance
| REQ | Description | Status | Classification | Signals | Evidence |
|-----|------------|--------|---------------|---------|----------|
| REQ-001 | ... | PASS | — | 2/2 | ... |
| REQ-002 | ... | FAIL | APP_BUG | 0/2 | ... |

## Adversarial Findings
| ID | Test | Result | Detail |
|----|------|--------|--------|
| ADV-001 | ... | ... | ... |

## Console Errors
[Any errors captured]

## Summary
- REQs: N tested, N passed, N failed, N skipped
- Adversarial: N tested, N issues found
```

### 6. Integration with checkpoint flow

If the active feature spec has `checkpoint:human-verify`:
- After all REQs pass → trigger checkpoint for human browser verification
- After any REQ fails → do NOT trigger checkpoint — report failures first

---

## E2E Mode (--e2e)

Run existing Playwright test files.

### 1. Verify Playwright installed

```bash
npx playwright --version 2>/dev/null || echo "NOT_INSTALLED"
```

If not installed:
```
Playwright is not installed. To set up:
  npm install -D @playwright/test
  npx playwright install
```
→ STOP

### 2. Verify dev server (same as spec-driven mode)

### 3. Run tests

```bash
npx playwright test --reporter=list $ARGUMENTS
```

If `$ARGUMENTS` is a specific test path:
```bash
npx playwright test [test-path] --reporter=list
```

### 4. Report results

```markdown
# QA Report: E2E
Date: YYYY-MM-DD | Mode: e2e

## Results
- Tests run: N
- Passed: N
- Failed: N
- Skipped: N

## Failures (if any)
| Test | Error | File |
|------|-------|------|
| ... | ... | ... |
```

---

## Visual/A11y Mode

### Visual Regression (--visual)

Spawn `browser-tester` agent:
```
[HANDOFF]
TO: browser-tester (sonnet)
TASK: Visual regression testing for feature "[feature-name]"
MODE: visual
READS:
  - spec/feature/[feature-name]/design.md
[/HANDOFF]
```

### Accessibility Audit (--a11y)

Option A — If `@axe-core/playwright` is installed and tests exist:
```bash
npx playwright test --grep "a11y\|accessibility" --reporter=list
```

Option B — Spawn `browser-tester` agent:
```
[HANDOFF]
TO: browser-tester (sonnet)
TASK: Accessibility audit for feature "[feature-name]"
MODE: a11y
READS:
  - spec/feature/[feature-name]/design.md
[/HANDOFF]
```

---

## Hard constraints

- Never modify source code — only test and report
- If Playwright is not installed, do not attempt to install without user confirmation
- Always report actual test output, not assumptions
- Do not start dev servers automatically — ask the user to start one if not running
