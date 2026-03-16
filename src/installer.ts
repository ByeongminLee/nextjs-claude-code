import fs from 'fs';
import path from 'path';
import { InstallOptions, TemplateVars, FrameworkType } from './types';
import { render, buildTemplateVars } from './renderer';
import { installSkills, SKILLS } from './skills-installer';
import { log } from './logger';

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

  // Framework 감지
  let framework: FrameworkType = 'react';
  if ('next' in deps) {
    // App Router vs Pages Router: app/ 디렉토리 존재 여부로 판단
    const hasAppDir =
      fs.existsSync(path.join(targetDir, 'app')) ||
      fs.existsSync(path.join(targetDir, 'src', 'app'));
    framework = hasAppDir ? 'nextjs-app' : 'nextjs-pages';
  }

  // Library 감지 (package name → skill slug)
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

  // shadcn: components.json 존재 여부로 감지
  const libraries: string[] = [];
  if (fs.existsSync(path.join(targetDir, 'components.json'))) {
    libraries.push('shadcn');
  }

  for (const [pkgName, slug] of Object.entries(libraryMap)) {
    if (pkgName in deps) {
      libraries.push(slug);
    }
  }

  return { framework, libraries };
}

// ─── Main install ────────────────────────────────────────────────────────────

export async function install(options: InstallOptions): Promise<void> {
  const { answers, force = false, dryRun = false } = options;
  const rootDir = options.targetDir;

  const vars = buildTemplateVars(answers);

  log.info('Installing nextjs-claude-code workflow files...');
  log.blank();

  // ── spec/ ────────────────────────────────────────────────────────────────
  const specTemplateDir = path.join(TEMPLATE_DIR, 'spec');
  await copyDir(specTemplateDir, path.join(rootDir, 'spec'), vars, force, dryRun);

  // ── Claude Code agent files ─────────────────────────────────────────────
  await installClaude(rootDir, vars, force, dryRun);

  // ── skills: package.json 자동 감지 후 설치 ──────────────────────────────
  log.blank();
  const { framework, libraries } = detectFromPackageJson(rootDir);
  await installSkills(rootDir, framework, libraries, dryRun);
}

// ─── Claude Code installer ───────────────────────────────────────────────────

async function installClaude(
  targetDir: string,
  vars: TemplateVars,
  force: boolean,
  dryRun: boolean,
): Promise<void> {
  const claudeTemplateDir = path.join(TEMPLATE_DIR, '.claude');
  // Copy agents, scripts — skip settings.json (merged below) and skills/ (handled separately)
  await copyDir(claudeTemplateDir, path.join(targetDir, '.claude'), vars, force, dryRun, [
    'settings.json',
    'skills',
  ]);
  // Copy custom (bundled-only) skills — skip remote skills handled by installSkills()
  const remoteSkillNames = SKILLS.map((s) => s.name);
  await copyDir(
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
    'CLAUDE.md',
  );
}

// ─── Shared helpers ──────────────────────────────────────────────────────────

async function copyDir(
  srcDir: string,
  destDir: string,
  vars: TemplateVars,
  force: boolean,
  dryRun: boolean,
  skip: string[] = [],
): Promise<void> {
  if (!fs.existsSync(srcDir)) return;
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });

  for (const entry of entries) {
    if (skip.includes(entry.name)) continue;
    const srcPath = path.join(srcDir, entry.name);

    if (entry.isDirectory()) {
      await copyDir(srcPath, path.join(destDir, entry.name), vars, force, dryRun);
      continue;
    }

    const isTemplate = entry.name.endsWith('.template');
    const destName = isTemplate ? entry.name.slice(0, -'.template'.length) : entry.name;
    const destPath = path.join(destDir, destName);
    const relDest = path.relative(process.cwd(), destPath);

    if (!force && fs.existsSync(destPath)) {
      log.step(`skipped  ${relDest}`);
      continue;
    }

    if (!dryRun) {
      fs.mkdirSync(path.dirname(destPath), { recursive: true });
      if (isTemplate) {
        const content = fs.readFileSync(srcPath, 'utf-8');
        fs.writeFileSync(destPath, render(content, vars), 'utf-8');
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }

    log.success(relDest);
  }
}

async function mergeSettingsJson(
  templatePath: string,
  destPath: string,
  dryRun: boolean,
): Promise<void> {
  const label = path.relative(process.cwd(), destPath);
  const templateContent = JSON.parse(fs.readFileSync(templatePath, 'utf-8'));
  const fsHooks = templateContent.hooks?.PostToolUse ?? [];

  if (!fs.existsSync(destPath)) {
    if (!dryRun) {
      fs.mkdirSync(path.dirname(destPath), { recursive: true });
      fs.writeFileSync(destPath, JSON.stringify(templateContent, null, 2) + '\n', 'utf-8');
    }
    log.success(`${label} (created)`);
    return;
  }

  const existing = JSON.parse(fs.readFileSync(destPath, 'utf-8'));

  const existingPostToolUse: Array<{ matcher?: string }> =
    existing.hooks?.PostToolUse ?? [];
  const hasFsHook = existingPostToolUse.some(
    (h) => h.matcher === 'Write|Edit' && JSON.stringify(h).includes('validate-spec'),
  );

  if (hasFsHook) {
    log.step(`skipped  ${label} (hook already present)`);
    return;
  }

  if (!dryRun) {
    if (!existing.hooks) existing.hooks = {};
    if (!existing.hooks.PostToolUse) existing.hooks.PostToolUse = [];
    existing.hooks.PostToolUse.push(...fsHooks);
    fs.writeFileSync(destPath, JSON.stringify(existing, null, 2) + '\n', 'utf-8');
  }
  log.success(`${label} (hook merged)`);
}

async function injectBlock(
  filePath: string,
  block: string,
  dryRun: boolean,
  label: string,
): Promise<void> {
  if (fs.existsSync(filePath)) {
    const existing = fs.readFileSync(filePath, 'utf-8');
    if (existing.includes(FS_MARKER_START)) {
      log.step(`skipped  ${label} (block already present)`);
      return;
    }
    if (!dryRun) {
      fs.appendFileSync(filePath, block, 'utf-8');
    }
    log.success(`${label} (block appended)`);
  } else {
    if (!dryRun) {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, block.trim() + '\n', 'utf-8');
    }
    log.success(`${label} (created)`);
  }
}
