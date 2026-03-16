import path from 'path';
import prompts from 'prompts';
import pc from 'picocolors';
import { log, banner } from './logger';
import { install } from './installer';
import { updateSkills } from './skills-installer';
import { UserAnswers } from './types';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require('../package.json') as { version: string };

export async function run(): Promise<void> {
  const args = process.argv.slice(2);
  const command = args[0];

  // ── skill-update 명령어 ────────────────────────────────────────────────
  if (command === 'skill-update') {
    banner(pkg.version);
    log.info('Updating skills to latest versions...');
    log.blank();
    await updateSkills(process.cwd());
    log.blank();
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
  console.log(pc.dim(`  Update skills anytime: ${pc.cyan('npx nextjs-claude-code skill-update')}`));
  console.log(pc.dim('  Docs: https://github.com/ByeongminLee/nextjs-claude-code'));
  console.log();
}
