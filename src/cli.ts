import path from 'path';
import prompts from 'prompts';
import pc from 'picocolors';
import { log, banner } from './logger';
import { install } from './installer';
import { updateSkills, installSingleSkill, listAvailableSkills, suggestAndInstallSkills } from './skills-installer';
import { runDoctor } from './doctor';
import { upgrade } from './upgrader';
import { UserAnswers } from './types';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require('../package.json') as { version: string };

export async function run(): Promise<void> {
  const args = process.argv.slice(2);
  const command = args[0];

  // ── skill-update: 설치된 스킬 최신화 ────────────────────────────────────
  if (command === 'skill-update') {
    banner(pkg.version);
    log.info('Updating skills to latest versions...');
    log.blank();
    await updateSkills(process.cwd());
    log.blank();
    return;
  }

  // ── skill-add <name>: on-demand 스킬 1개 설치 ───────────────────────────
  if (command === 'skill-add') {
    const skillName = args[1];
    if (!skillName) {
      banner(pkg.version);
      log.error('Usage: npx nextjs-claude-code skill-add <skill-name>');
      log.info('Run "npx nextjs-claude-code skill-list" to see available skills.');
      process.exit(1);
    }
    banner(pkg.version);
    log.blank();
    await installSingleSkill(process.cwd(), skillName);
    log.blank();
    return;
  }

  // ── skill-list: 전체 스킬 목록 + 설치 상태 ─────────────────────────────
  if (command === 'skill-list') {
    banner(pkg.version);
    listAvailableSkills(process.cwd());
    return;
  }

  // ── skill-suggest: package.json 기반 추천 + 설치 ────────────────────────
  if (command === 'skill-suggest') {
    banner(pkg.version);
    log.blank();
    await suggestAndInstallSkills(process.cwd());
    log.blank();
    return;
  }

  // ── doctor: 설치 상태 진단 ────────────────────────────────────────────────
  if (command === 'doctor') {
    banner(pkg.version);
    await runDoctor(process.cwd());
    return;
  }

  // ── upgrade: NCC 전체 업그레이드 ─────────────────────────────────────────
  if (command === 'upgrade') {
    banner(pkg.version);
    await upgrade(process.cwd());
    return;
  }

  // ── 기본 설치 ─────────────────────────────────────────────────────────
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
    }, {
      onCancel: () => {
        log.blank();
        log.info('Cancelled.');
        process.exit(0);
      },
    });
    if (!proceed) {
      log.blank();
      log.info('Cancelled.');
      process.exit(0);
    }
    log.blank();
  }

  const projectName = path.basename(process.cwd());

  const answers: UserAnswers = {
    projectName,
    tool: 'claude',
  };

  log.blank();

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
  console.log(pc.dim(`  Manage skills:`));
  console.log(pc.dim(`    ${pc.cyan('npx nextjs-claude-code skill-list')}     — see all available skills`));
  console.log(pc.dim(`    ${pc.cyan('npx nextjs-claude-code skill-suggest')}  — auto-detect & install matching skills`));
  console.log(pc.dim(`    ${pc.cyan('npx nextjs-claude-code skill-add <n>')}  — install a specific skill`));
  console.log(pc.dim(`    ${pc.cyan('npx nextjs-claude-code skill-update')}   — update installed skills`));
  console.log(pc.dim(`    ${pc.cyan('npx nextjs-claude-code upgrade')}        — upgrade NCC to latest version`));
  console.log(pc.dim(`    ${pc.cyan('npx nextjs-claude-code doctor')}         — diagnose installation health`));
  console.log(pc.dim('  Docs: https://github.com/ByeongminLee/nextjs-claude-code'));
  console.log();
}
