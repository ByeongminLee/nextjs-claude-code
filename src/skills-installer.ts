import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import pc from 'picocolors';
import prompts from 'prompts';
import { SkillDef, SkillManifestEntry, SkillCatalogEntry, FrameworkType } from './types';
import { detectFromPackageJson } from './detect';
import { progress, log } from './logger';

const TEMPLATE_DIR = path.resolve(__dirname, '../template');
const SKILLS_ARCHIVE_DIR = path.join(TEMPLATE_DIR, 'skills-archive');

// ─── Skill Definitions ─────────────────────────────────────────────────────────

export const SKILLS: SkillDef[] = [
  // ── Core: 항상 설치 (React 공통, 작은 용량) ──────────────────────────────────
  {
    name: 'vercel-react-best-practices',
    url: 'https://skills.sh/vercel-labs/agent-skills/vercel-react-best-practices',
    cli: 'npx skills add vercel-labs/agent-skills --skill vercel-react-best-practices --agent claude-code --yes --copy',
    description: 'Vercel React best practices for modern React apps',
    tier: 'core',
  },
  {
    name: 'vercel-composition-patterns',
    url: 'https://skills.sh/vercel-labs/agent-skills/vercel-composition-patterns',
    cli: 'npx skills add vercel-labs/agent-skills --skill vercel-composition-patterns --agent claude-code --yes --copy',
    description: 'React component composition patterns',
    tier: 'core',
  },
  {
    name: 'frontend-design',
    url: 'https://skills.sh/anthropics/skills/frontend-design',
    cli: 'npx skills add anthropics/skills --skill frontend-design --agent claude-code --yes --copy',
    description: 'Frontend design principles and patterns',
    tier: 'core',
  },
  {
    name: 'web-design-guidelines',
    url: 'https://skills.sh/vercel-labs/agent-skills/web-design-guidelines',
    cli: 'npx skills add vercel-labs/agent-skills --skill web-design-guidelines --agent claude-code --yes --copy',
    description: 'Web design guidelines and best practices',
    tier: 'core',
  },
  // ── Core: Code Quality (toss/frontend-fundamentals) ──────────────────────────
  {
    name: 'readability',
    url: 'https://frontend-fundamentals.com/code-quality/',
    cli: 'npx skills add toss/frontend-fundamentals --skill readability --agent claude-code --yes --copy',
    description: 'Code readability — context reduction, naming, top-to-bottom flow',
    tier: 'core',
  },
  {
    name: 'predictability',
    url: 'https://frontend-fundamentals.com/code-quality/',
    cli: 'npx skills add toss/frontend-fundamentals --skill predictability --agent claude-code --yes --copy',
    description: 'Code predictability — no hidden side effects, consistent return types',
    tier: 'core',
  },
  {
    name: 'cohesion',
    url: 'https://frontend-fundamentals.com/code-quality/',
    cli: 'npx skills add toss/frontend-fundamentals --skill cohesion --agent claude-code --yes --copy',
    description: 'Code cohesion — colocate related code, eliminate magic numbers',
    tier: 'core',
  },
  {
    name: 'coupling',
    url: 'https://frontend-fundamentals.com/code-quality/',
    cli: 'npx skills add toss/frontend-fundamentals --skill coupling --agent claude-code --yes --copy',
    description: 'Loose coupling — composition over props drilling, single-responsibility hooks',
    tier: 'core',
  },
  // ── Core: General ────────────────────────────────────────────────────────────
  {
    name: 'error-handling-patterns',
    url: 'https://skills.sh/wshobson/agents/error-handling-patterns',
    cli: 'npx skills add wshobson/agents --skill error-handling-patterns --agent claude-code --yes --copy',
    description: 'Error handling patterns and best practices',
    tier: 'core',
  },
  {
    name: 'clean-code',
    url: 'https://skills.sh/sickn33/antigravity-awesome-skills/clean-code',
    cli: 'npx skills add sickn33/antigravity-awesome-skills --skill clean-code --agent claude-code --yes --copy',
    description: 'Clean code principles and refactoring patterns',
    tier: 'core',
  },
  {
    name: 'seo-audit',
    url: 'https://skills.sh/coreyhaines31/marketingskills/seo-audit',
    cli: 'npx skills add coreyhaines31/marketingskills --skill seo-audit --agent claude-code --yes --copy',
    description: 'SEO audit and optimization guidelines',
    tier: 'on-demand',
  },
  {
    name: 'marketing-psychology',
    url: 'https://skills.sh/coreyhaines31/marketingskills/marketing-psychology',
    cli: 'npx skills add coreyhaines31/marketingskills --skill marketing-psychology --agent claude-code --yes --copy',
    description: 'Marketing psychology and mental models for UX conversion optimization',
    tier: 'on-demand',
  },
  // ── On-demand: Skill Discovery ──────────────────────────────────────────────
  {
    name: 'find-skills',
    url: 'https://skills.sh/vercel-labs/skills/find-skills',
    cli: 'npx skills add vercel-labs/skills --skill find-skills --agent claude-code --yes --copy',
    description: 'Skill finder — search and install skills dynamically',
    tier: 'on-demand',
  },
  // ── On-demand: Changelog ──────────────────────────────────────────────────
  {
    name: 'changelog-maintenance',
    url: 'https://skills.sh/supercent-io/skills-template/changelog-maintenance',
    cli: 'npx skills add supercent-io/skills-template --skill changelog-maintenance --agent claude-code --yes --copy',
    description: 'Keep a Changelog + Semantic Versioning maintenance',
    tier: 'on-demand',
  },
  // ── Core: DevOps / CI ───────────────────────────────────────────────────────
  {
    name: 'log-analysis',
    url: 'https://skills.sh/supercent-io/skills-template/log-analysis',
    cli: 'npx skills add supercent-io/skills-template --skill log-analysis --agent claude-code --yes --copy',
    description: 'Log analysis patterns for debugging and monitoring',
    tier: 'on-demand',
  },
  {
    name: 'create-github-action-workflow-specification',
    url: 'https://skills.sh/github/awesome-copilot/create-github-action-workflow-specification',
    cli: 'npx skills add github/awesome-copilot --skill create-github-action-workflow-specification --agent claude-code --yes --copy',
    description: 'GitHub Actions workflow specification and creation',
    tier: 'on-demand',
  },
  {
    name: 'github-actions-templates',
    url: 'https://skills.sh/wshobson/agents/github-actions-templates',
    cli: 'npx skills add wshobson/agents --skill github-actions-templates --agent claude-code --yes --copy',
    description: 'GitHub Actions reusable workflow templates',
    tier: 'on-demand',
  },

  // ── On-demand: 조건부, 큰 용량 ──────────────────────────────────────────────
  {
    name: 'ui-ux-pro-max',
    url: 'https://skills.sh/nextlevelbuilder/ui-ux-pro-max-skill/ui-ux-pro-max',
    cli: 'npx skills add nextlevelbuilder/ui-ux-pro-max-skill --skill ui-ux-pro-max --agent claude-code --yes --copy',
    description: 'Advanced UI/UX patterns and principles (1.5MB)',
    tier: 'on-demand',
  },
  {
    name: 'playwright-best-practices',
    url: 'https://skills.sh/currents-dev/playwright-best-practices-skill/playwright-best-practices',
    cli: 'npx skills add currents-dev/playwright-best-practices-skill --skill playwright-best-practices --agent claude-code --yes --copy',
    description: 'Playwright E2E testing patterns and best practices',
    tier: 'on-demand',
    condition: ['playwright'],
  },
  {
    name: 'agent-browser',
    url: 'https://skills.sh/vercel-labs/agent-browser/agent-browser',
    cli: 'npx skills add vercel-labs/agent-browser --skill agent-browser --agent claude-code --yes --copy',
    description: 'Browser-based agent interactions for testing and verification',
    tier: 'on-demand',
    condition: ['playwright'],
  },
  {
    name: 'react-hook-form-zod',
    url: 'https://skills.sh/ovachiever/droid-tings/react-hook-form-zod',
    cli: 'npx skills add ovachiever/droid-tings --skill react-hook-form-zod --agent claude-code --yes --copy',
    description: 'React Hook Form + Zod validation patterns',
    tier: 'on-demand',
    condition: ['react-hook-form'],
  },
  {
    name: 'emil-design-eng',
    url: 'https://skills.sh/emilkowalski/skill',
    cli: 'npx skills add emilkowalski/skill --agent claude-code --yes --copy',
    description: 'Emil Kowalski — UI polish, animation decisions, component design',
    tier: 'on-demand',
    condition: ['framer-motion'],
  },
  {
    name: 'apollo-client',
    url: 'https://skills.sh/apollographql/skills/apollo-client',
    cli: 'npx skills add apollographql/skills --skill apollo-client --agent claude-code --yes --copy',
    description: 'Apollo Client GraphQL patterns and best practices',
    tier: 'on-demand',
    condition: ['apollo'],
  },
  {
    name: 'turborepo',
    url: 'https://skills.sh/vercel/turborepo/turborepo',
    cli: 'npx skills add vercel/turborepo --skill turborepo --agent claude-code --yes --copy',
    description: 'Turborepo monorepo setup and patterns',
    tier: 'on-demand',
    condition: ['monorepo'],
  },
  {
    name: 'next-best-practices',
    url: 'https://skills.sh/vercel-labs/next-skills/next-best-practices',
    cli: 'npx skills add vercel-labs/next-skills --skill next-best-practices --agent claude-code --yes --copy',
    description: 'Next.js best practices',
    tier: 'on-demand',
    framework: ['nextjs-app', 'nextjs-pages'],
  },
  {
    name: 'next-cache-components',
    url: 'https://skills.sh/vercel-labs/next-skills/next-cache-components',
    cli: 'npx skills add vercel-labs/next-skills --skill next-cache-components --agent claude-code --yes --copy',
    description: 'Next.js caching and component patterns',
    tier: 'on-demand',
    framework: ['nextjs-app', 'nextjs-pages'],
  },
  {
    name: 'nextjs-app-router-fundamentals',
    url: 'https://skills.sh/wsimmonds/claude-nextjs-skills/nextjs-app-router-fundamentals',
    cli: 'npx skills add wsimmonds/claude-nextjs-skills --skill nextjs-app-router-fundamentals --agent claude-code --yes --copy',
    description: 'Next.js App Router fundamentals and patterns',
    tier: 'on-demand',
    framework: ['nextjs-app'],
  },
  {
    name: 'tanstack-query-best-practices',
    url: 'https://skills.sh/deckardger/tanstack-agent-skills/tanstack-query-best-practices',
    cli: 'npx skills add deckardger/tanstack-agent-skills --skill tanstack-query-best-practices --agent claude-code --yes --copy',
    description: 'TanStack Query (React Query) patterns',
    tier: 'on-demand',
    condition: ['tanstack-query'],
  },
  {
    name: 'shadcn',
    url: 'https://skills.sh/shadcn/ui/shadcn',
    cli: 'npx skills add shadcn/ui --skill shadcn --agent claude-code --yes --copy',
    description: 'shadcn/ui component usage patterns',
    tier: 'on-demand',
    condition: ['shadcn'],
  },
  {
    name: 'tailwind-design-system',
    url: 'https://skills.sh/wshobson/agents/tailwind-design-system',
    cli: 'npx skills add wshobson/agents --skill tailwind-design-system --agent claude-code --yes --copy',
    description: 'Tailwind CSS design system patterns',
    tier: 'on-demand',
    condition: ['tailwind'],
  },
  {
    name: 'analytics-tracking',
    url: 'https://skills.sh/coreyhaines31/marketingskills/analytics-tracking',
    cli: 'npx skills add coreyhaines31/marketingskills --skill analytics-tracking --agent claude-code --yes --copy',
    description: 'Analytics tracking implementation patterns',
    tier: 'on-demand',
    framework: ['nextjs-app', 'nextjs-pages'],
  },
  {
    name: 'better-auth-best-practices',
    url: 'https://skills.sh/better-auth/skills/better-auth-best-practices',
    cli: 'npx skills add better-auth/skills --skill better-auth-best-practices --agent claude-code --yes --copy',
    description: 'Better Auth implementation best practices',
    tier: 'on-demand',
    condition: ['better-auth'],
  },
  {
    name: 'zustand',
    url: 'https://skills.sh/lobehub/lobehub/zustand',
    cli: 'npx skills add lobehub/lobehub --skill zustand --agent claude-code --yes --copy',
    description: 'Zustand state management patterns',
    tier: 'on-demand',
    condition: ['zustand'],
  },
  {
    name: 'javascript-testing-patterns',
    url: 'https://skills.sh/wshobson/agents/javascript-testing-patterns',
    cli: 'npx skills add wshobson/agents --skill javascript-testing-patterns --agent claude-code --yes --copy',
    description: 'JavaScript/TypeScript testing patterns and best practices',
    tier: 'on-demand',
    condition: ['vitest', 'jest'],
  },
  {
    name: 'javascript-typescript-jest',
    url: 'https://skills.sh/github/awesome-copilot/javascript-typescript-jest',
    cli: 'npx skills add github/awesome-copilot --skill javascript-typescript-jest --agent claude-code --yes --copy',
    description: 'Jest testing patterns for JavaScript and TypeScript',
    tier: 'on-demand',
    condition: ['jest'],
  },

  // ── On-demand: Accessibility & Performance ──────────────────────────────────
  {
    name: 'accessibility',
    url: 'https://www.w3.org/WAI/WCAG21/quickref/',
    cli: 'npx skills add vercel-labs/agent-skills --skill accessibility --agent claude-code --yes --copy',
    description: 'WCAG 2.1 accessibility standards and React ARIA patterns',
    tier: 'on-demand',
    framework: ['nextjs-app', 'nextjs-pages', 'react'],
  },
  {
    name: 'web-vitals',
    url: 'https://web.dev/vitals/',
    cli: 'npx skills add vercel-labs/agent-skills --skill web-vitals --agent claude-code --yes --copy',
    description: 'Core Web Vitals optimization — LCP, FID, CLS',
    tier: 'on-demand',
    framework: ['nextjs-app', 'nextjs-pages'],
  },

  // ── On-demand: i18n ─────────────────────────────────────────────────────────
  {
    name: 'i18n-best-practices',
    url: 'https://next-intl-docs.vercel.app/',
    cli: 'npx skills add vercel-labs/agent-skills --skill i18n-best-practices --agent claude-code --yes --copy',
    description: 'Internationalization patterns — next-intl, react-intl, i18next',
    tier: 'on-demand',
    condition: ['i18n'],
  },

  // ── On-demand: Storybook ─────────────────────────────────────────────────────
  {
    name: 'storybook',
    url: 'https://storybook.js.org/docs/react/get-started/introduction',
    cli: 'npx skills add vercel-labs/agent-skills --skill storybook --agent claude-code --yes --copy',
    description: 'Component documentation and Storybook story patterns',
    tier: 'on-demand',
    condition: ['storybook'],
  },

  // ── On-demand: PWA ──────────────────────────────────────────────────────────
  {
    name: 'pwa-patterns',
    url: 'https://web.dev/progressive-web-apps/',
    cli: 'npx skills add vercel-labs/agent-skills --skill pwa-patterns --agent claude-code --yes --copy',
    description: 'PWA service workers, offline support, and caching strategies',
    tier: 'on-demand',
    condition: ['pwa'],
  },

  // ── On-demand: OpenAPI ───────────────────────────────────────────────────────
  {
    name: 'openapi-spec',
    url: 'https://swagger.io/specification/',
    cli: 'npx skills add vercel-labs/agent-skills --skill openapi-spec --agent claude-code --yes --copy',
    description: 'OpenAPI 3.x specification writing and API documentation patterns',
    tier: 'on-demand',
    condition: ['openapi'],
  },
];

// ─── Helpers ────────────────────────────────────────────────────────────────────

export function shouldInstall(skill: SkillDef, framework: FrameworkType, libraries: string[]): boolean {
  if (skill.framework && !skill.framework.includes(framework)) return false;
  if (skill.condition && !skill.condition.some((c) => libraries.includes(c))) return false;
  return true;
}

function getCoreSkills(): SkillDef[] {
  return SKILLS.filter((s) => s.tier === 'core');
}

function getOnDemandSkills(): SkillDef[] {
  return SKILLS.filter((s) => s.tier === 'on-demand');
}

function copyDirRecursive(src: string, dest: string): void {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

export function getBundledSkillDir(skillName: string): string {
  return path.join(TEMPLATE_DIR, '.claude', 'skills', skillName);
}

function getArchiveSkillDir(skillName: string): string {
  return path.join(SKILLS_ARCHIVE_DIR, skillName);
}

function readManifest(targetDir: string): SkillManifestEntry[] {
  const manifestPath = path.join(targetDir, '.claude', 'skills', 'skills-manifest.json');
  if (fs.existsSync(manifestPath)) {
    return JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  }
  return [];
}

function writeManifest(targetDir: string, manifest: SkillManifestEntry[]): void {
  const manifestPath = path.join(targetDir, '.claude', 'skills', 'skills-manifest.json');
  fs.mkdirSync(path.dirname(manifestPath), { recursive: true });
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n', 'utf-8');
}

function writeCatalog(targetDir: string): void {
  const catalog: SkillCatalogEntry[] = getOnDemandSkills().map((s) => ({
    name: s.name,
    description: s.description,
    ...(s.condition ? { condition: s.condition } : {}),
    ...(s.framework ? { framework: s.framework } : {}),
  }));
  const catalogPath = path.join(targetDir, '.claude', 'skills', 'skill-catalog.json');
  fs.mkdirSync(path.dirname(catalogPath), { recursive: true });
  fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2) + '\n', 'utf-8');
}

// ─── Install: Core 스킬만 번들에서 복사 (빠름) ─────────────────────────────────

export async function installSkills(
  targetDir: string,
  framework: FrameworkType,
  libraries: string[],
  dryRun: boolean,
): Promise<void> {
  const skillsDir = path.join(targetDir, '.claude', 'skills');
  const coreSkills = getCoreSkills().filter((s) => shouldInstall(s, framework, libraries));

  const manifest: SkillManifestEntry[] = [];
  let installed = 0;

  for (const skill of coreSkills) {
    progress.update(`Installing core skills... (${installed}/${coreSkills.length}) ${skill.name}`);

    const destDir = path.join(skillsDir, skill.name);
    const bundledDir = getBundledSkillDir(skill.name);

    if (!dryRun) {
      if (fs.existsSync(path.join(bundledDir, 'SKILL.md'))) {
        copyDirRecursive(bundledDir, destDir);
      } else {
        continue;
      }
    }

    manifest.push({
      name: skill.name,
      url: skill.url,
      cli: skill.cli,
      tier: 'core',
      installedAt: new Date().toISOString(),
      source: 'bundled',
    });
    installed++;
  }

  if (!dryRun && manifest.length > 0) {
    writeManifest(targetDir, manifest);
  }

  // on-demand 스킬 카탈로그 생성
  if (!dryRun) {
    writeCatalog(targetDir);
  }

  progress.succeed(`Core skills installed (${installed}/${coreSkills.length})`);
}

// ─── On-demand 스킬 1개 설치 (npx → archive fallback) ──────────────────────────

export async function installSingleSkill(targetDir: string, skillName: string): Promise<boolean> {
  const skill = SKILLS.find((s) => s.name === skillName);
  if (!skill) {
    log.error(`Unknown skill: ${skillName}`);
    log.info('Run "npx nextjs-claude-code skill-list" to see available skills.');
    return false;
  }

  const destDir = path.join(targetDir, '.claude', 'skills', skillName);

  // 1차: npx skills add (원본 skills.sh)
  progress.update(`Downloading ${skillName} from skills.sh...`);
  try {
    execSync(skill.cli, { cwd: targetDir, timeout: 30000, stdio: 'pipe' });
    updateManifestEntry(targetDir, skill, 'cli');
    progress.succeed(`Installed: ${skillName} (from skills.sh)`);
    return true;
  } catch {
    // 2차: archive fallback
    progress.update(`skills.sh failed, trying archive fallback for ${skillName}...`);
    const archiveDir = getArchiveSkillDir(skillName);
    if (fs.existsSync(path.join(archiveDir, 'SKILL.md'))) {
      copyDirRecursive(archiveDir, destDir);
      updateManifestEntry(targetDir, skill, 'archive');
      progress.succeed(`Installed: ${skillName} (from archive fallback)`);
      return true;
    }

    progress.fail(`Failed to install ${skillName} — neither skills.sh nor archive available`);
    return false;
  }
}

function updateManifestEntry(
  targetDir: string,
  skill: SkillDef,
  source: 'cli' | 'bundled' | 'archive',
): void {
  const manifest = readManifest(targetDir);
  const existing = manifest.findIndex((m) => m.name === skill.name);
  const entry: SkillManifestEntry = {
    name: skill.name,
    url: skill.url,
    cli: skill.cli,
    tier: skill.tier,
    installedAt: new Date().toISOString(),
    source,
  };

  if (existing >= 0) {
    manifest[existing] = entry;
  } else {
    manifest.push(entry);
  }

  writeManifest(targetDir, manifest);
}

// ─── skill-list: 전체 스킬 목록 + 설치 상태 ────────────────────────────────────

export function listAvailableSkills(targetDir: string): void {
  const manifest = readManifest(targetDir);
  const installed = new Set(manifest.map((m) => m.name));

  console.log();
  console.log(pc.bold('Core skills (always bundled):'));
  for (const s of getCoreSkills()) {
    const status = installed.has(s.name) ? pc.green('✓ installed') : pc.dim('available');
    console.log(`  ${pc.cyan(s.name)} — ${s.description} [${status}]`);
  }

  console.log();
  console.log(pc.bold('On-demand skills (downloaded when needed):'));
  for (const s of getOnDemandSkills()) {
    const status = installed.has(s.name) ? pc.green('✓ installed') : pc.dim('available');
    const cond = s.condition ? pc.dim(` (needs: ${s.condition.join(', ')})`) : '';
    const fw = s.framework ? pc.dim(` (framework: ${s.framework.join(', ')})`) : '';
    console.log(`  ${pc.cyan(s.name)} — ${s.description}${cond}${fw} [${status}]`);
  }
  console.log();
}

// ─── skill-suggest: package.json 감지 → 매칭 스킬 추천 → 설치 ──────────────────

export async function suggestAndInstallSkills(targetDir: string): Promise<void> {
  const { framework, libraries } = detectFromPackageJson(targetDir);
  const manifest = readManifest(targetDir);
  const installed = new Set(manifest.map((m) => m.name));

  const suggestions = getOnDemandSkills().filter((s) => {
    if (installed.has(s.name)) return false;
    return shouldInstall(s, framework, libraries);
  });

  if (suggestions.length === 0) {
    log.info('No additional skills to suggest based on your project dependencies.');
    return;
  }

  log.info(`Found ${suggestions.length} matching skill(s) for your project:\n`);

  const { selected } = await prompts({
    type: 'multiselect',
    name: 'selected',
    message: 'Select skills to install',
    choices: suggestions.map((s) => ({
      title: `${s.name} — ${s.description}`,
      value: s.name,
      selected: true,
    })),
  });

  if (!selected || selected.length === 0) {
    log.info('No skills selected.');
    return;
  }

  log.blank();
  let ok = 0;
  let fail = 0;
  for (const name of selected) {
    const success = await installSingleSkill(targetDir, name);
    if (success) ok++;
    else fail++;
  }

  log.blank();
  if (fail > 0) {
    log.info(`Done: ${ok} installed, ${fail} failed`);
  } else {
    log.success(`All ${ok} skill(s) installed successfully!`);
  }
}

// ─── skill-update: 설치된 스킬을 최신화 ────────────────────────────────────────

export async function updateSkills(targetDir: string): Promise<void> {
  const manifestPath = path.join(targetDir, '.claude', 'skills', 'skills-manifest.json');

  let toUpdate: SkillDef[];
  if (fs.existsSync(manifestPath)) {
    const manifest: SkillManifestEntry[] = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    const installedNames = new Set(manifest.map((m) => m.name));
    toUpdate = SKILLS.filter((s) => installedNames.has(s.name));
  } else {
    log.warn('No skills-manifest.json found. Attempting to update all known skills.');
    log.info('Run "npx nextjs-claude-code" first to install skills.');
    toUpdate = SKILLS;
  }

  let updated = 0;
  let failed = 0;

  for (const skill of toUpdate) {
    progress.update(`Updating skills... (${updated + failed}/${toUpdate.length}) ${skill.name}`);
    try {
      execSync(skill.cli, { cwd: targetDir, timeout: 30000, stdio: 'pipe' });
      updated++;
    } catch {
      failed++;
    }
  }

  // manifest 갱신 — Dedup key: hook.command field. All NCC hooks must have a unique command string.
  if (fs.existsSync(manifestPath)) {
    const updatedManifest: SkillManifestEntry[] = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    const now = new Date().toISOString();
    for (const entry of updatedManifest) {
      entry.installedAt = now;
      entry.source = 'cli';
    }
    fs.writeFileSync(manifestPath, JSON.stringify(updatedManifest, null, 2) + '\n', 'utf-8');
  }

  if (failed > 0) {
    progress.succeed(`Skills updated (${updated} ok, ${failed} failed)`);
  } else {
    progress.succeed(`Skills updated (${updated}/${toUpdate.length})`);
  }
}
