import fs from 'fs';
import path from 'path';
import pc from 'picocolors';

interface DiagnosticResult {
  label: string;
  status: 'ok' | 'warn' | 'error';
  message?: string;
}

const REQUIRED_AGENTS = [
  'planner',
  'lead-engineer',
  'lead-engineer-team-mode',
  'lead-engineer-completion',
  'lead-engineer-autofix',
  'spec-writer',
  'verifier',
  'committer',
  'reviewer',
  'code-quality-reviewer',
  'debugger',
  'tester',
  'loop',
  'loop-completion',
  'status',
  'product-reviewer',
  'learning-extractor',
];

const REQUIRED_SCRIPTS = [
  'validate-post-write.sh',
  'advisory-post-write.sh',
  'security-guard.sh',
];

const REQUIRED_RULES = [
  '_workflow.md',
  '_document-format.md',
  '_model-routing.md',
  '_delegation.md',
  '_verification.md',
  '_loop-protocol.md',
  '_agent-roles.md',
  '_nextjs-ordering.md',
];

export async function runDoctor(cwd: string = process.cwd()): Promise<void> {
  console.log(pc.bold('\n  nextjs-claude-code doctor\n'));

  const results: DiagnosticResult[] = [];

  // ── 1. .claude/ directory ──────────────────────────────────────────────────
  const claudeDir = path.join(cwd, '.claude');
  const claudeExists = fs.existsSync(claudeDir);
  results.push({
    label: '.claude/ directory',
    status: claudeExists ? 'ok' : 'error',
    message: claudeExists ? undefined : 'Run: npx nextjs-claude-code',
  });

  // ── 2. Required agents ─────────────────────────────────────────────────────
  if (claudeExists) {
    const agentsDir = path.join(claudeDir, 'agents');
    const missing = REQUIRED_AGENTS.filter(
      (a) => !fs.existsSync(path.join(agentsDir, `${a}.md`))
    );
    results.push({
      label: 'Required agents',
      status: missing.length === 0 ? 'ok' : 'warn',
      message: missing.length > 0 ? `Missing: ${missing.join(', ')}` : undefined,
    });
  }

  // ── 3. Hook scripts ────────────────────────────────────────────────────────
  if (claudeExists) {
    const scriptsDir = path.join(claudeDir, 'scripts');
    const missing = REQUIRED_SCRIPTS.filter(
      (s) => !fs.existsSync(path.join(scriptsDir, s))
    );
    results.push({
      label: 'Hook scripts',
      status: missing.length === 0 ? 'ok' : 'warn',
      message: missing.length > 0 ? `Missing: ${missing.join(', ')}` : undefined,
    });
  }

  // ── 4. settings.json hooks ─────────────────────────────────────────────────
  const settingsPath = path.join(cwd, '.claude', 'settings.json');
  if (fs.existsSync(settingsPath)) {
    try {
      const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf-8')) as {
        hooks?: {
          PostToolUse?: unknown[];
          PreToolUse?: unknown[];
        };
      };
      const hasPost = (settings?.hooks?.PostToolUse?.length ?? 0) > 0;
      const hasPre = (settings?.hooks?.PreToolUse?.length ?? 0) > 0;
      results.push({
        label: 'settings.json hooks',
        status: hasPost && hasPre ? 'ok' : 'warn',
        message: !hasPre
          ? 'PreToolUse hook missing — security-guard not active'
          : !hasPost
          ? 'PostToolUse hook missing'
          : undefined,
      });
    } catch {
      results.push({
        label: 'settings.json hooks',
        status: 'error',
        message: 'JSON parse error',
      });
    }
  } else {
    results.push({
      label: 'settings.json',
      status: 'error',
      message: 'File missing',
    });
  }

  // ── 5. spec/ structure ─────────────────────────────────────────────────────
  const specDir = path.join(cwd, 'spec');
  const specParts = ['rules', 'feature', 'learnings'];
  const missingSpec = specParts.filter((p) => !fs.existsSync(path.join(specDir, p)));
  results.push({
    label: 'spec/ structure',
    status: missingSpec.length === 0 ? 'ok' : 'warn',
    message: missingSpec.length > 0 ? `Missing folders: ${missingSpec.join(', ')}` : undefined,
  });

  // ── 6. Immutable rule files ────────────────────────────────────────────────
  const rulesDir = path.join(specDir, 'rules');
  if (fs.existsSync(rulesDir)) {
    const missingRules = REQUIRED_RULES.filter(
      (r) => !fs.existsSync(path.join(rulesDir, r))
    );
    results.push({
      label: 'spec/rules/ files',
      status: missingRules.length === 0 ? 'ok' : 'warn',
      message: missingRules.length > 0 ? `Missing: ${missingRules.join(', ')}` : undefined,
    });
  }

  // ── 7. CLAUDE.md NCC block ─────────────────────────────────────────────────
  const claudeMdPath = path.join(cwd, 'CLAUDE.md');
  if (fs.existsSync(claudeMdPath)) {
    const content = fs.readFileSync(claudeMdPath, 'utf-8');
    results.push({
      label: 'CLAUDE.md NCC block',
      status: content.includes('<!-- fs:start -->') ? 'ok' : 'warn',
      message: !content.includes('<!-- fs:start -->') ? 'NCC block not found' : undefined,
    });
  } else {
    results.push({
      label: 'CLAUDE.md',
      status: 'warn',
      message: 'File not found (optional)',
    });
  }

  // ── 8. skills-lock.json ────────────────────────────────────────────────────
  const lockPath = path.join(cwd, 'skills-lock.json');
  if (fs.existsSync(lockPath)) {
    try {
      const lock = JSON.parse(fs.readFileSync(lockPath, 'utf-8')) as { skills?: unknown[] };
      const count = lock.skills?.length ?? 0;
      results.push({
        label: 'skills-lock.json',
        status: count > 0 ? 'ok' : 'warn',
        message: count === 0 ? 'No skills recorded' : `${count} skills tracked`,
      });
    } catch {
      results.push({
        label: 'skills-lock.json',
        status: 'warn',
        message: 'JSON parse error',
      });
    }
  } else {
    results.push({
      label: 'skills-lock.json',
      status: 'warn',
      message: 'Not found — run: npx nextjs-claude-code skill-suggest',
    });
  }

  // ── 9. Node.js version ─────────────────────────────────────────────────────
  const nodeVersion = parseInt(process.version.slice(1).split('.')[0]);
  results.push({
    label: 'Node.js version',
    status: nodeVersion >= 18 ? 'ok' : 'error',
    message:
      nodeVersion < 18
        ? `Current: ${process.version} — requires >= 18`
        : process.version,
  });

  // ── Print results ──────────────────────────────────────────────────────────
  let hasError = false;
  let hasWarn = false;

  for (const r of results) {
    const icon =
      r.status === 'ok'
        ? pc.green('✓')
        : r.status === 'warn'
        ? pc.yellow('⚠')
        : pc.red('✗');
    const label = r.status === 'error' ? pc.red(r.label) : r.label;
    const msg = r.message ? pc.dim(` — ${r.message}`) : '';
    console.log(`  ${icon}  ${label}${msg}`);
    if (r.status === 'error') hasError = true;
    if (r.status === 'warn') hasWarn = true;
  }

  console.log('');

  if (hasError) {
    console.log(pc.red('  ✗ Issues found. Run: npx nextjs-claude-code to reinstall.'));
  } else if (hasWarn) {
    console.log(pc.yellow('  ⚠ Some warnings. Run: npx nextjs-claude-code --force to repair.'));
  } else {
    console.log(pc.green('  ✓ All checks passed.'));
  }

  console.log('');
}
