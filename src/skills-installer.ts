import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { SkillDef, SkillManifestEntry, FrameworkType } from './types';
import { progress } from './logger';

const TEMPLATE_DIR = path.resolve(__dirname, '../template');

export const SKILLS: SkillDef[] = [
  // ── 항상 설치 (React 공통) ───────────────────────────────────────────────
  {
    name: 'vercel-react-best-practices',
    url: 'https://skills.sh/vercel-labs/agent-skills/vercel-react-best-practices',
    cli: 'npx skills add vercel-labs/agent-skills --skill vercel-react-best-practices --agent claude-code --yes --copy',
    description: 'Vercel React best practices for modern React apps',
  },
  {
    name: 'vercel-composition-patterns',
    url: 'https://skills.sh/vercel-labs/agent-skills/vercel-composition-patterns',
    cli: 'npx skills add vercel-labs/agent-skills --skill vercel-composition-patterns --agent claude-code --yes --copy',
    description: 'React component composition patterns',
  },
  {
    name: 'frontend-design',
    url: 'https://skills.sh/anthropics/skills/frontend-design',
    cli: 'npx skills add anthropics/skills --skill frontend-design --agent claude-code --yes --copy',
    description: 'Frontend design principles and patterns',
  },
  {
    name: 'web-design-guidelines',
    url: 'https://skills.sh/vercel-labs/agent-skills/web-design-guidelines',
    cli: 'npx skills add vercel-labs/agent-skills --skill web-design-guidelines --agent claude-code --yes --copy',
    description: 'Web design guidelines and best practices',
  },
  {
    name: 'ui-ux-pro-max',
    url: 'https://skills.sh/nextlevelbuilder/ui-ux-pro-max-skill/ui-ux-pro-max',
    cli: 'npx skills add nextlevelbuilder/ui-ux-pro-max-skill --skill ui-ux-pro-max --agent claude-code --yes --copy',
    description: 'Advanced UI/UX patterns and principles',
  },
  {
    name: 'agent-browser',
    url: 'https://skills.sh/vercel-labs/agent-browser/agent-browser',
    cli: 'npx skills add vercel-labs/agent-browser --skill agent-browser --agent claude-code --yes --copy',
    description: 'Browser-based agent interactions for testing and verification',
  },
  {
    name: 'emilkowal-animations',
    url: 'https://skills.sh/pproenca/dot-skills/emilkowal-animations',
    cli: 'npx skills add pproenca/dot-skills --skill emilkowal-animations --agent claude-code --yes --copy',
    description: 'Animation patterns inspired by Emil Kowalski',
    condition: ['framer-motion'],
  },
  {
    name: 'seo-audit',
    url: 'https://skills.sh/coreyhaines31/marketingskills/seo-audit',
    cli: 'npx skills add coreyhaines31/marketingskills --skill seo-audit --agent claude-code --yes --copy',
    description: 'SEO audit and optimization guidelines',
  },
  {
    name: 'analytics-tracking',
    url: 'https://skills.sh/coreyhaines31/marketingskills/analytics-tracking',
    cli: 'npx skills add coreyhaines31/marketingskills --skill analytics-tracking --agent claude-code --yes --copy',
    description: 'Analytics tracking implementation patterns',
    framework: ['nextjs-app', 'nextjs-pages'],
  },
  // ── Code Quality (toss/frontend-fundamentals) ──────────────────────────────
  {
    name: 'readability',
    url: 'https://frontend-fundamentals.com/code-quality/',
    cli: 'npx skills add toss/frontend-fundamentals --skill readability --agent claude-code --yes --copy',
    description: 'Code readability — context reduction, naming, top-to-bottom flow',
  },
  {
    name: 'predictability',
    url: 'https://frontend-fundamentals.com/code-quality/',
    cli: 'npx skills add toss/frontend-fundamentals --skill predictability --agent claude-code --yes --copy',
    description: 'Code predictability — no hidden side effects, consistent return types',
  },
  {
    name: 'cohesion',
    url: 'https://frontend-fundamentals.com/code-quality/',
    cli: 'npx skills add toss/frontend-fundamentals --skill cohesion --agent claude-code --yes --copy',
    description: 'Code cohesion — colocate related code, eliminate magic numbers',
  },
  {
    name: 'coupling',
    url: 'https://frontend-fundamentals.com/code-quality/',
    cli: 'npx skills add toss/frontend-fundamentals --skill coupling --agent claude-code --yes --copy',
    description: 'Loose coupling — composition over props drilling, single-responsibility hooks',
  },
  // ── Next.js 전용 ─────────────────────────────────────────────────────────
  {
    name: 'next-best-practices',
    url: 'https://skills.sh/vercel-labs/next-skills/next-best-practices',
    cli: 'npx skills add vercel-labs/next-skills --skill next-best-practices --agent claude-code --yes --copy',
    description: 'Next.js App Router best practices',
    framework: ['nextjs-app', 'nextjs-pages'],
  },
  // ── 라이브러리 조건부 ────────────────────────────────────────────────────
  {
    name: 'shadcn',
    url: 'https://skills.sh/shadcn/ui/shadcn',
    cli: 'npx skills add shadcn/ui --skill shadcn --agent claude-code --yes --copy',
    description: 'shadcn/ui component usage patterns',
    condition: ['shadcn'],
  },
  {
    name: 'tailwind-design-system',
    url: 'https://skills.sh/wshobson/agents/tailwind-design-system',
    cli: 'npx skills add wshobson/agents --skill tailwind-design-system --agent claude-code --yes --copy',
    description: 'Tailwind CSS design system patterns',
    condition: ['tailwind'],
  },
  {
    name: 'better-auth-best-practices',
    url: 'https://skills.sh/better-auth/skills/better-auth-best-practices',
    cli: 'npx skills add better-auth/skills --skill better-auth-best-practices --agent claude-code --yes --copy',
    description: 'Better Auth implementation best practices',
    condition: ['better-auth'],
  },
  {
    name: 'tanstack-query',
    url: 'https://skills.sh/deckardger/tanstack-agent-skills/tanstack-query-best-practices',
    cli: 'npx skills add deckardger/tanstack-agent-skills --skill tanstack-query-best-practices --agent claude-code --yes --copy',
    description: 'TanStack Query (React Query) patterns',
    condition: ['tanstack-query'],
  },
  {
    name: 'turborepo',
    url: 'https://skills.sh/vercel/turborepo/turborepo',
    cli: 'npx skills add vercel/turborepo --skill turborepo --agent claude-code --yes --copy',
    description: 'Turborepo monorepo setup and patterns',
    condition: ['monorepo'],
  },
  {
    name: 'react-hook-form-zod',
    url: 'https://skills.sh/ovachiever/droid-tings/react-hook-form-zod',
    cli: 'npx skills add ovachiever/droid-tings --skill react-hook-form-zod --agent claude-code --yes --copy',
    description: 'React Hook Form + Zod validation patterns',
    condition: ['react-hook-form'],
  },
  {
    name: 'zustand-state-management',
    url: 'https://skills.sh/lobehub/lobehub/zustand',
    cli: 'npx skills add lobehub/lobehub --skill zustand --agent claude-code --yes --copy',
    description: 'Zustand state management patterns',
    condition: ['zustand'],
  },
  {
    name: 'error-handling-patterns',
    url: 'https://skills.sh/wshobson/agents/error-handling-patterns',
    cli: 'npx skills add wshobson/agents --skill error-handling-patterns --agent claude-code --yes --copy',
    description: 'Error handling patterns and best practices',
  },
  {
    name: 'clean-code',
    url: 'https://skills.sh/sickn33/antigravity-awesome-skills/clean-code',
    cli: 'npx skills add sickn33/antigravity-awesome-skills --skill clean-code --agent claude-code --yes --copy',
    description: 'Clean code principles and refactoring patterns',
  },
  // ── Testing ────────────────────────────────────────────────────────────────
  {
    name: 'playwright',
    url: 'https://skills.sh/currents-dev/playwright-best-practices-skill/playwright-best-practices',
    cli: 'npx skills add currents-dev/playwright-best-practices-skill --skill playwright-best-practices --agent claude-code --yes --copy',
    description: 'Playwright E2E testing patterns and best practices',
  },
  {
    name: 'javascript-testing-patterns',
    url: 'https://skills.sh/wshobson/agents/javascript-testing-patterns',
    cli: 'npx skills add wshobson/agents --skill javascript-testing-patterns --agent claude-code --yes --copy',
    description: 'JavaScript/TypeScript testing patterns and best practices',
  },
  {
    name: 'javascript-typescript-jest',
    url: 'https://skills.sh/github/awesome-copilot/javascript-typescript-jest',
    cli: 'npx skills add github/awesome-copilot --skill javascript-typescript-jest --agent claude-code --yes --copy',
    description: 'Jest testing patterns for JavaScript and TypeScript',
  },
  // ── Next.js 추가 ──────────────────────────────────────────────────────────
  {
    name: 'nextjs-app-router-fundamentals',
    url: 'https://skills.sh/wsimmonds/claude-nextjs-skills/nextjs-app-router-fundamentals',
    cli: 'npx skills add wsimmonds/claude-nextjs-skills --skill nextjs-app-router-fundamentals --agent claude-code --yes --copy',
    description: 'Next.js App Router fundamentals and patterns',
    framework: ['nextjs-app'],
  },
  {
    name: 'apollo-client',
    url: 'https://skills.sh/apollographql/skills/apollo-client',
    cli: 'npx skills add apollographql/skills --skill apollo-client --agent claude-code --yes --copy',
    description: 'Apollo Client GraphQL patterns and best practices',
    condition: ['apollo'],
  },
  {
    name: 'marketing-psychology',
    url: 'https://skills.sh/coreyhaines31/marketingskills/marketing-psychology',
    cli: 'npx skills add coreyhaines31/marketingskills --skill marketing-psychology --agent claude-code --yes --copy',
    description: 'Marketing psychology and mental models for UX conversion optimization',
  },
  // ── DevOps / CI ───────────────────────────────────────────────────────────
  {
    name: 'log-analysis',
    url: 'https://skills.sh/supercent-io/skills-template/log-analysis',
    cli: 'npx skills add supercent-io/skills-template --skill log-analysis --agent claude-code --yes --copy',
    description: 'Log analysis patterns for debugging and monitoring',
  },
  {
    name: 'create-github-action-workflow-specification',
    url: 'https://skills.sh/github/awesome-copilot/create-github-action-workflow-specification',
    cli: 'npx skills add github/awesome-copilot --skill create-github-action-workflow-specification --agent claude-code --yes --copy',
    description: 'GitHub Actions workflow specification and creation',
  },
  {
    name: 'github-actions-templates',
    url: 'https://skills.sh/wshobson/agents/github-actions-templates',
    cli: 'npx skills add wshobson/agents --skill github-actions-templates --agent claude-code --yes --copy',
    description: 'GitHub Actions reusable workflow templates',
  },
];

export function shouldInstall(skill: SkillDef, framework: FrameworkType, libraries: string[]): boolean {
  if (skill.framework && !skill.framework.includes(framework)) return false;
  if (skill.condition && !skill.condition.some((c) => libraries.includes(c))) return false;
  return true;
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

/**
 * 설치: 번들된 스킬을 바로 복사 (빠름)
 */
export async function installSkills(
  targetDir: string,
  framework: FrameworkType,
  libraries: string[],
  dryRun: boolean,
): Promise<void> {
  const skillsDir = path.join(targetDir, '.claude', 'skills');
  const toInstall = SKILLS.filter((s) => shouldInstall(s, framework, libraries));

  const manifest: SkillManifestEntry[] = [];
  let installed = 0;

  for (const skill of toInstall) {
    progress.update(`Installing skills... (${installed}/${toInstall.length}) ${skill.name}`);

    const destDir = path.join(skillsDir, skill.name);
    const bundledDir = getBundledSkillDir(skill.name);

    if (!dryRun) {
      if (fs.existsSync(path.join(bundledDir, 'SKILL.md'))) {
        copyDirRecursive(bundledDir, destDir);
      } else {
        // 번들 없으면 skip
        installed++;
        continue;
      }
    }

    manifest.push({
      name: skill.name,
      url: skill.url,
      cli: skill.cli,
      installedAt: new Date().toISOString(),
      source: 'bundled',
    });
    installed++;
  }

  if (!dryRun && manifest.length > 0) {
    fs.writeFileSync(
      path.join(skillsDir, 'skills-manifest.json'),
      JSON.stringify(manifest, null, 2) + '\n',
      'utf-8',
    );
  }

  progress.succeed(`Skills installed (${installed}/${toInstall.length})`);
}

/**
 * skill-update: 모든 스킬을 npx skills add 로 최신화
 */
export async function updateSkills(targetDir: string): Promise<void> {
  const manifestPath = path.join(targetDir, '.claude', 'skills', 'skills-manifest.json');

  // manifest가 있으면 설치된 스킬만, 없으면 전체
  let toUpdate: SkillDef[];
  if (fs.existsSync(manifestPath)) {
    const manifest: SkillManifestEntry[] = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    const installedNames = new Set(manifest.map((m) => m.name));
    toUpdate = SKILLS.filter((s) => installedNames.has(s.name));
  } else {
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

  // manifest 갱신
  if (fs.existsSync(manifestPath)) {
    const manifest: SkillManifestEntry[] = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    const now = new Date().toISOString();
    for (const entry of manifest) {
      entry.installedAt = now;
      entry.source = 'cli';
    }
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n', 'utf-8');
  }

  if (failed > 0) {
    progress.succeed(`Skills updated (${updated} ok, ${failed} failed)`);
  } else {
    progress.succeed(`Skills updated (${updated}/${toUpdate.length})`);
  }
}
