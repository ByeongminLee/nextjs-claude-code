import fs from 'fs';
import path from 'path';
import { InstallOptions, TemplateVars, FrameworkType } from './types';
import { render, buildTemplateVars } from './renderer';
import { installSkills, SKILLS } from './skills-installer';
import { progress } from './logger';

const TEMPLATE_DIR = path.resolve(__dirname, '../template');

const FS_MARKER_START = '<!-- fs:start -->';
const FS_MARKER_END = '<!-- fs:end -->';

// ─── CLAUDE.md injection ────────────────────────────────────────────────────

const FS_CLAUDE_MD_BLOCK = `
${FS_MARKER_START}
## NCC — Session Start

Before any work, always read:
1. \`spec/STATE.md\` — understand current progress and active feature
2. \`spec/RULE.md\` — follow all coding rules and checkpoint conditions

Before modifying code:
- Read the relevant \`spec/feature/[name]/spec.md\` (what to build)
- Read the relevant \`spec/feature/[name]/design.md\` (how to build it)
- If \`spec/feature/[name]/CONTEXT.md\` exists, its decisions are non-negotiable

Use the available skills:
- \`/init\` — first-time setup: analyze codebase and populate spec docs
- \`/spec\` — define or update a feature spec
- \`/dev\` — implement a feature
- \`/review\` — check spec compliance
- \`/status\` — show project status
- \`/debug\` — fix a bug systematically
- \`/rule\` — add or update a project coding rule
- \`/loop\` — force-complete: loop until all REQs in spec.md are satisfied
${FS_MARKER_END}
`;

// ─── package.json 자동 감지 ──────────────────────────────────────────────────

function detectFromPackageJson(targetDir: string): { framework: FrameworkType; libraries: string[] } {
  const pkgPath = path.join(targetDir, 'package.json');
  if (!fs.existsSync(pkgPath)) {
    return { framework: 'nextjs-app', libraries: [] };
  }

  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8')) as {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
  };
  const deps = { ...pkg.dependencies, ...pkg.devDependencies };

  let framework: FrameworkType = 'react';
  if ('next' in deps) {
    const hasAppDir =
      fs.existsSync(path.join(targetDir, 'app')) ||
      fs.existsSync(path.join(targetDir, 'src', 'app'));
    framework = hasAppDir ? 'nextjs-app' : 'nextjs-pages';
  }

  const libraryMap: Record<string, string> = {
    'react-hook-form':        'react-hook-form',
    'zod':                    'zod',
    'axios':                  'axios',
    'zustand':                'zustand',
    'jotai':                  'jotai',
    '@tanstack/react-query':  'tanstack-query',
    'swr':                    'swr',
    'tailwindcss':            'tailwind',
    'framer-motion':          'framer-motion',
    'better-auth':            'better-auth',
    'next-auth':              'next-auth',
    'prisma':                 'prisma',
    'drizzle-orm':            'drizzle',
    'turbo':                  'monorepo',
  };

  const libraries: string[] = [];
  if (fs.existsSync(path.join(targetDir, 'components.json'))) {
    libraries.push('shadcn');
  }
  for (const [pkgName, slug] of Object.entries(libraryMap)) {
    if (pkgName in deps) libraries.push(slug);
  }

  return { framework, libraries };
}

// ─── Main install ────────────────────────────────────────────────────────────

export async function install(options: InstallOptions): Promise<void> {
  const { answers, force = false, dryRun = false } = options;
  const rootDir = options.targetDir;
  const vars = buildTemplateVars(answers);

  // ── spec/ ────────────────────────────────────────────────────────────────
  progress.update('Installing workflow files...');
  const specCount = await copyDir(
    path.join(TEMPLATE_DIR, 'spec'),
    path.join(rootDir, 'spec'),
    vars, force, dryRun,
  );

  // ── Claude Code agent files ─────────────────────────────────────────────
  const claudeCount = await installClaude(rootDir, vars, force, dryRun);

  const totalFiles = specCount + claudeCount;
  progress.succeed(`Workflow files installed ${pc_dim(`(${totalFiles} files)`)}`);

  // ── skills ───────────────────────────────────────────────────────────────
  const { framework, libraries } = detectFromPackageJson(rootDir);
  await installSkills(rootDir, framework, libraries, dryRun);
}

function pc_dim(s: string): string {
  // picocolors dim — inline to avoid import cycle
  return `\x1b[2m${s}\x1b[22m`;
}

// ─── Claude Code installer ───────────────────────────────────────────────────

async function installClaude(
  targetDir: string,
  vars: TemplateVars,
  force: boolean,
  dryRun: boolean,
): Promise<number> {
  const claudeTemplateDir = path.join(TEMPLATE_DIR, '.claude');
  const remoteSkillNames = SKILLS.map((s) => s.name);

  const agentCount = await copyDir(
    claudeTemplateDir,
    path.join(targetDir, '.claude'),
    vars, force, dryRun,
    ['settings.json', 'skills'],
  );
  const skillCount = await copyDir(
    path.join(claudeTemplateDir, 'skills'),
    path.join(targetDir, '.claude', 'skills'),
    vars, force, dryRun,
    remoteSkillNames,
  );
  await mergeSettingsJson(
    path.join(TEMPLATE_DIR, '.claude', 'settings.json'),
    path.join(targetDir, '.claude', 'settings.json'),
    dryRun,
  );
  await injectBlock(
    path.join(targetDir, 'CLAUDE.md'),
    FS_CLAUDE_MD_BLOCK,
    dryRun,
  );
  return agentCount + skillCount;
}

// ─── Shared helpers ──────────────────────────────────────────────────────────

async function copyDir(
  srcDir: string,
  destDir: string,
  vars: TemplateVars,
  force: boolean,
  dryRun: boolean,
  skip: string[] = [],
): Promise<number> {
  if (!fs.existsSync(srcDir)) return 0;
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  let count = 0;

  for (const entry of entries) {
    if (skip.includes(entry.name)) continue;
    const srcPath = path.join(srcDir, entry.name);

    if (entry.isDirectory()) {
      count += await copyDir(srcPath, path.join(destDir, entry.name), vars, force, dryRun);
      continue;
    }

    const isTemplate = entry.name.endsWith('.template');
    const destName = isTemplate ? entry.name.slice(0, -'.template'.length) : entry.name;
    const destPath = path.join(destDir, destName);

    if (!force && fs.existsSync(destPath)) continue;

    if (!dryRun) {
      fs.mkdirSync(path.dirname(destPath), { recursive: true });
      if (isTemplate) {
        const content = fs.readFileSync(srcPath, 'utf-8');
        fs.writeFileSync(destPath, render(content, vars), 'utf-8');
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
    count++;
  }
  return count;
}

async function mergeSettingsJson(
  templatePath: string,
  destPath: string,
  dryRun: boolean,
): Promise<void> {
  const templateContent = JSON.parse(fs.readFileSync(templatePath, 'utf-8'));
  const fsHooks = templateContent.hooks?.PostToolUse ?? [];

  if (!fs.existsSync(destPath)) {
    if (!dryRun) {
      fs.mkdirSync(path.dirname(destPath), { recursive: true });
      fs.writeFileSync(destPath, JSON.stringify(templateContent, null, 2) + '\n', 'utf-8');
    }
    return;
  }

  const existing = JSON.parse(fs.readFileSync(destPath, 'utf-8'));
  const existingPostToolUse: Array<{ matcher?: string }> = existing.hooks?.PostToolUse ?? [];
  const hasFsHook = existingPostToolUse.some(
    (h) => h.matcher === 'Write|Edit' && JSON.stringify(h).includes('validate-spec'),
  );
  if (hasFsHook) return;

  if (!dryRun) {
    if (!existing.hooks) existing.hooks = {};
    if (!existing.hooks.PostToolUse) existing.hooks.PostToolUse = [];
    existing.hooks.PostToolUse.push(...fsHooks);
    fs.writeFileSync(destPath, JSON.stringify(existing, null, 2) + '\n', 'utf-8');
  }
}

async function injectBlock(
  filePath: string,
  block: string,
  dryRun: boolean,
): Promise<void> {
  if (fs.existsSync(filePath)) {
    const existing = fs.readFileSync(filePath, 'utf-8');
    if (existing.includes(FS_MARKER_START)) return;
    if (!dryRun) fs.appendFileSync(filePath, block, 'utf-8');
  } else {
    if (!dryRun) {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, block.trim() + '\n', 'utf-8');
    }
  }
}

