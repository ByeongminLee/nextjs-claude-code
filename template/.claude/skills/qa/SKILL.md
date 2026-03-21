---
name: qa
description: Run Playwright E2E tests, visual regression, and accessibility audits against the dev server. Use when you need to verify UI behavior, check for regressions, or audit accessibility.
allowed-tools: Bash, Read, Glob, Grep, Agent
model: sonnet
---

# /qa — Browser Quality Assurance

Run browser-based tests using Playwright. Supports E2E testing, visual regression, and accessibility audits.

## Usage

```
/qa                    # Run all Playwright tests
/qa --e2e              # E2E tests only (default)
/qa --visual           # Visual regression (screenshot comparison)
/qa --a11y             # Accessibility audit (axe-core)
/qa --all              # Run all three modes
/qa [test-path]        # Run specific test file
```

## Prerequisites

Check that Playwright is installed before running:

```bash
npx playwright --version 2>/dev/null || echo "NOT_INSTALLED"
```

If not installed, inform the user:
```
Playwright is not installed. To set up:
  npm install -D @playwright/test
  npx playwright install
```

## Work Sequence

### 1. Verify environment

```bash
# Check Playwright
npx playwright --version

# Check dev server (try common ports)
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 || \
curl -s -o /dev/null -w "%{http_code}" http://localhost:3001 || \
echo "DEV_SERVER_NOT_RUNNING"
```

If dev server is not running:
```bash
# Start in background
npm run dev &
sleep 5
```

### 2. Determine test scope

- Read `spec/feature/[name]/TEST.md` if exists — use E2E test cases from there
- Read `spec/feature/[name]/design.md` — identify pages/routes to test
- Check `e2e/` or `tests/` directory for existing Playwright test files
- If `$ARGUMENTS` specifies a test path, use that directly

### 3. Run tests by mode

#### E2E Mode (default)
```bash
npx playwright test --reporter=list $ARGUMENTS
```

If no existing tests and TEST.md has E2E cases, spawn `browser-tester` agent to execute manual browser tests.

#### Visual Regression Mode (`--visual`)
```bash
npx playwright test --reporter=list --update-snapshots  # first run: generate baselines
npx playwright test --reporter=list                      # subsequent: compare
```

Report any visual differences found.

#### Accessibility Mode (`--a11y`)

If `@axe-core/playwright` is installed:
```bash
npx playwright test --grep "a11y\|accessibility" --reporter=list
```

If not, spawn `browser-tester` agent with instructions to:
1. Navigate to each page
2. Run `axe.run()` via browser console injection
3. Report violations grouped by severity (critical, serious, moderate, minor)

### 4. Report results

Output a structured report:

```markdown
# QA Report
Date: YYYY-MM-DD
Mode: e2e | visual | a11y | all

## Results
- Tests run: N
- Passed: N
- Failed: N
- Skipped: N

## Failures (if any)
| Test | Error | File |
|------|-------|------|
| ... | ... | ... |

## Accessibility Issues (if --a11y)
| Severity | Count | Rule | Elements |
|----------|-------|------|----------|
| critical | ... | ... | ... |

## Screenshots
[List captured screenshots with paths]
```

### 5. Integration with checkpoint flow

If the active feature spec has `checkpoint:human-verify`:
- After tests pass, trigger the checkpoint: present results and ask user for browser verification
- After tests fail, do NOT trigger checkpoint — fix issues first

## Hard constraints
- Never modify source code — only test and report
- If Playwright is not installed, do not attempt to install it without user confirmation
- Always report actual test output, not assumptions
- Kill the dev server if you started it (cleanup)
