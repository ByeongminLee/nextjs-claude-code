import path from 'path';
import prompts from 'prompts';
import pc from 'picocolors';
import { log, banner } from './logger';
import { install } from './installer';
import { UserAnswers, FrameworkType, TeamSize, ArchPattern } from './types';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require('../package.json') as { version: string };

// 팀 규모별 기본 아키텍처 패턴 제안
const DEFAULT_ARCH: Record<TeamSize, ArchPattern> = {
  solo:   'flat',
  small:  'feature-based',
  medium: 'fsd',
  large:  'monorepo',
};

export async function run(): Promise<void> {
  const args = process.argv.slice(2);
  const force = args.includes('--force');
  const dryRun = args.includes('--dry-run');

  banner(pkg.version);

  if (dryRun) {
    log.warn('Dry run mode — no files will be written.');
    log.blank();
  }

  if (force) {
    log.warn('Force mode — existing files will be overwritten.');
    const { proceed } = await prompts({
      type: 'confirm',
      name: 'proceed',
      message: 'This may overwrite your customized files. Continue?',
      initial: false,
    });
    if (!proceed) {
      log.blank();
      log.info('Cancelled.');
      process.exit(0);
    }
    log.blank();
  }

  // ── Step 1: 프로젝트 이름 ───────────────────────────────────────────────
  const { projectName } = await prompts(
    {
      type: 'text',
      name: 'projectName',
      message: 'Project name',
      initial: path.basename(process.cwd()),
    },
    { onCancel },
  );

  // ── Step 2: 프레임워크 선택 ─────────────────────────────────────────────
  const { framework } = await prompts(
    {
      type: 'select',
      name: 'framework',
      message: 'Framework',
      choices: [
        { title: 'Next.js App Router  (recommended)', value: 'nextjs-app' },
        { title: 'Next.js Pages Router',               value: 'nextjs-pages' },
        { title: 'React (Vite / other)',                value: 'react' },
      ],
      initial: 0,
    },
    { onCancel },
  ) as { framework: FrameworkType };

  // ── Step 3: 팀 규모 ─────────────────────────────────────────────────────
  const { teamSize } = await prompts(
    {
      type: 'select',
      name: 'teamSize',
      message: 'Team size',
      choices: [
        { title: 'Solo  (just me)',     value: 'solo' },
        { title: 'Small (2–5)',         value: 'small' },
        { title: 'Medium (5–15)',       value: 'medium' },
        { title: 'Large (15+)',         value: 'large' },
      ],
      initial: 0,
    },
    { onCancel },
  ) as { teamSize: TeamSize };

  // ── Step 4: 아키텍처 패턴 ───────────────────────────────────────────────
  const suggestedArch = DEFAULT_ARCH[teamSize] ?? 'flat';
  const archChoices = ['flat', 'feature-based', 'fsd', 'monorepo'];
  const { archPattern } = await prompts(
    {
      type: 'select',
      name: 'archPattern',
      message: `Architecture pattern  ${pc.dim(`(suggested: ${suggestedArch})`)}`,
      choices: [
        {
          title: 'Flat Structure           — components/, hooks/, lib/',
          value: 'flat',
        },
        {
          title: 'Feature-Based            — features/[name]/{components,hooks,api}/',
          value: 'feature-based',
        },
        {
          title: 'Feature-Slice Design     — app/, widgets/, features/, entities/, shared/',
          value: 'fsd',
        },
        {
          title: 'Monorepo (Turborepo)     — apps/web/, packages/ui/',
          value: 'monorepo',
        },
      ],
      initial: archChoices.indexOf(suggestedArch),
    },
    { onCancel },
  ) as { archPattern: ArchPattern };

  // ── Step 4b: Monorepo 경로 ─────────────────────────────────────────────
  let workspacePath: string | undefined;
  if (archPattern === 'monorepo') {
    const { wsPath } = await prompts(
      {
        type: 'text',
        name: 'wsPath',
        message: 'App workspace path (relative to repo root)',
        initial: 'apps/web',
      },
      { onCancel },
    );
    workspacePath = wsPath as string;
  }

  // ── Step 5: 라이브러리 선택 (카테고리별) ───────────────────────────────
  log.blank();
  log.info('Select libraries  (space = toggle, enter = confirm)');
  log.blank();

  const { libsCore } = await prompts(
    {
      type: 'multiselect',
      name: 'libsCore',
      message: 'Core utilities',
      choices: [
        { title: 'react-hook-form  (form state)', value: 'react-hook-form', selected: true },
        { title: 'zod              (validation)',  value: 'zod',             selected: true },
        { title: 'axios            (HTTP client)', value: 'axios',           selected: false },
      ],
      hint: '- Space to select. Return to submit',
    },
    { onCancel },
  ) as { libsCore: string[] };

  const { libsState } = await prompts(
    {
      type: 'multiselect',
      name: 'libsState',
      message: 'State management',
      choices: [
        { title: 'zustand           (global state)',  value: 'zustand',        selected: false },
        { title: 'jotai             (atomic state)',  value: 'jotai',          selected: false },
        { title: 'TanStack Query    (server state)',  value: 'tanstack-query', selected: true  },
        { title: 'SWR               (server state)',  value: 'swr',            selected: false },
      ],
      hint: '- Space to select. Return to submit',
    },
    { onCancel },
  ) as { libsState: string[] };

  const { libsUI } = await prompts(
    {
      type: 'multiselect',
      name: 'libsUI',
      message: 'UI & Styling',
      choices: [
        { title: 'shadcn/ui         (component library)', value: 'shadcn',          selected: true  },
        { title: 'Tailwind CSS      (styling)',           value: 'tailwind',        selected: true  },
        { title: 'Framer Motion     (animation)',         value: 'framer-motion',   selected: false },
      ],
      hint: '- Space to select. Return to submit',
    },
    { onCancel },
  ) as { libsUI: string[] };

  const { libsBackend } = await prompts(
    {
      type: 'multiselect',
      name: 'libsBackend',
      message: 'Auth & Data',
      choices: [
        { title: 'Better Auth       (authentication)',  value: 'better-auth', selected: false },
        { title: 'NextAuth.js       (authentication)',  value: 'next-auth',   selected: false },
        { title: 'Prisma            (ORM)',             value: 'prisma',      selected: false },
        { title: 'Drizzle           (ORM)',             value: 'drizzle',     selected: false },
      ],
      hint: '- Space to select. Return to submit',
    },
    { onCancel },
  ) as { libsBackend: string[] };

  const libraries = [
    ...(libsCore    ?? []),
    ...(libsState   ?? []),
    ...(libsUI      ?? []),
    ...(libsBackend ?? []),
    ...(archPattern === 'monorepo' ? ['monorepo'] : []),
  ];

  // ── Step 6: Feature 목록 ────────────────────────────────────────────────
  const { features } = await prompts(
    {
      type: 'list',
      name: 'features',
      message: 'Feature list (comma-separated)',
      initial: 'auth, dashboard',
      separator: ',',
    },
    { onCancel },
  );

  // ── Step 7: 최종 확인 ───────────────────────────────────────────────────
  log.blank();
  const { confirmed } = await prompts(
    {
      type: 'confirm',
      name: 'confirmed',
      message: `Install to ${pc.cyan(process.cwd())}?`,
      initial: true,
    },
    { onCancel },
  ) as { confirmed: boolean };

  if (!confirmed) {
    log.blank();
    log.info('Cancelled.');
    process.exit(0);
  }

  const featureList: string[] = (Array.isArray(features) ? features : String(features).split(','))
    .map((f: string) => f.trim())
    .filter(Boolean);

  log.blank();

  const answers: UserAnswers = {
    projectName,
    framework:    (framework    as FrameworkType) ?? 'nextjs-app',
    teamSize:     (teamSize     as TeamSize)      ?? 'solo',
    archPattern:  (archPattern  as ArchPattern)   ?? 'flat',
    libraries,
    features:     featureList,
    tool:         'claude',
    workspacePath,
  };

  await install({ targetDir: process.cwd(), answers, force, dryRun });

  log.blank();
  log.success(pc.bold('nextjs-claude-code workflow installed!'));
  log.blank();
  console.log(pc.bold('  Next steps:'));
  console.log();
  console.log(`  1. Open this project in Claude Code`);
  console.log(`  2. Run ${pc.cyan('/init')} to analyze your codebase and populate spec docs`);
  console.log(`  3. Run ${pc.cyan('/spec [feature-name] "description"')} to define features`);
  console.log(`  4. Run ${pc.cyan('/dev [feature-name]')} to implement`);
  console.log();
  console.log(pc.dim('  Docs: https://github.com/ByeongminLee/nextjs-claude-code'));
  console.log();
}

function onCancel(): void {
  log.blank();
  log.info('Cancelled.');
  process.exit(0);
}
