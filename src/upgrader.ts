import { execSync } from 'child_process';
import path from 'path';
import pc from 'picocolors';
import { log, progress } from './logger';
import { install } from './installer';
import { updateSkills } from './skills-installer';
import { UserAnswers } from './types';
import { getLatestChangelog, displayChangelog } from './changelog-reader';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require('../package.json') as { version: string };

function fetchLatestVersion(): string | null {
  try {
    const result = execSync('npm view nextjs-claude-code version', {
      encoding: 'utf-8',
      timeout: 15_000,
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    return result.trim();
  } catch {
    return null;
  }
}

function fetchLatestGitTag(repoDir: string): string | null {
  try {
    const result = execSync('git describe --tags --abbrev=0 origin/main 2>/dev/null || git rev-parse --short origin/main', {
      cwd: repoDir,
      encoding: 'utf-8',
      timeout: 10_000,
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    return result.trim();
  } catch {
    return null;
  }
}

function compareVersions(current: string, latest: string): -1 | 0 | 1 {
  const a = current.split('.').map(Number);
  const b = latest.split('.').map(Number);
  for (let i = 0; i < 3; i++) {
    if ((a[i] ?? 0) < (b[i] ?? 0)) return -1;
    if ((a[i] ?? 0) > (b[i] ?? 0)) return 1;
  }
  return 0;
}

// ─── Plugin upgrade (git pull) ──────────────────────────────────────────────

export async function upgradePlugin(pluginRoot: string, targetDir: string): Promise<void> {
  log.info('Plugin installation detected.');
  log.blank();

  // Get current state
  let currentRef: string;
  try {
    currentRef = execSync('git rev-parse --short HEAD', {
      cwd: pluginRoot,
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
    }).trim();
  } catch {
    currentRef = 'unknown';
  }

  console.log(`  ${pc.dim('Plugin root:')} ${pluginRoot}`);
  console.log(`  ${pc.dim('Current ref:')} ${currentRef}`);
  log.blank();

  // Fetch latest
  progress.update('Fetching latest from remote...');
  try {
    execSync('git fetch origin', {
      cwd: pluginRoot,
      encoding: 'utf-8',
      timeout: 30_000,
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    progress.succeed('Remote fetched');
  } catch {
    progress.fail('Could not fetch from remote');
    log.error('Check your network connection and try again.');
    return;
  }

  // Check if update is available
  let behind: number;
  try {
    const behindStr = execSync('git rev-list --count HEAD..origin/main', {
      cwd: pluginRoot,
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
    }).trim();
    behind = parseInt(behindStr, 10);
  } catch {
    behind = 0;
  }

  if (behind === 0) {
    log.success('Plugin is already up to date.');
    const latestTag = fetchLatestGitTag(pluginRoot);
    if (latestTag) {
      console.log(`  ${pc.dim('Version:')} ${latestTag}`);
    }
    log.blank();

    // Still update skills in case they're stale
    log.info('Updating skills...');
    await updateSkills(targetDir);
    log.blank();
    return;
  }

  console.log(`  ${pc.dim('Behind:')} ${behind} commit(s)`);
  log.blank();

  // Check for local modifications
  try {
    const status = execSync('git status --porcelain', {
      cwd: pluginRoot,
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
    }).trim();
    if (status) {
      log.warn('Plugin directory has local modifications:');
      console.log(pc.dim(status.split('\n').map(l => `    ${l}`).join('\n')));
      log.blank();
      log.info('Stashing local changes before pull...');
      execSync('git stash', {
        cwd: pluginRoot,
        encoding: 'utf-8',
        timeout: 10_000,
        stdio: ['pipe', 'pipe', 'pipe'],
      });
    }
  } catch {
    // ignore — proceed with pull
  }

  // Pull latest
  progress.update('Pulling latest changes...');
  try {
    execSync('git pull origin main', {
      cwd: pluginRoot,
      encoding: 'utf-8',
      timeout: 60_000,
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    progress.succeed('Plugin updated');
  } catch (err) {
    progress.fail('git pull failed');
    log.error('Merge conflict or network error. Resolve manually:');
    console.log(pc.dim(`  cd ${pluginRoot} && git pull origin main`));
    log.blank();
    return;
  }

  // Show new ref
  let newRef: string;
  try {
    newRef = execSync('git rev-parse --short HEAD', {
      cwd: pluginRoot,
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
    }).trim();
  } catch {
    newRef = 'unknown';
  }

  log.blank();
  console.log(`  ${pc.dim('Updated:')} ${currentRef} → ${newRef}`);
  const latestTag = fetchLatestGitTag(pluginRoot);
  if (latestTag) {
    console.log(`  ${pc.dim('Version:')} ${latestTag}`);
  }
  log.blank();

  // Update skills
  log.info('Updating skills...');
  await updateSkills(targetDir);

  log.blank();
  log.success(pc.bold('NCC plugin upgrade complete'));

  const pluginChangelog = getLatestChangelog();
  if (pluginChangelog) displayChangelog(pluginChangelog);

  log.blank();
}

// ─── npx upgrade ────────────────────────────────────────────────────────────

export async function upgrade(targetDir: string): Promise<void> {
  const currentVersion = pkg.version;

  // ── Check latest version on npm ─────────────────────────────────────────
  progress.update('Checking latest version on npm...');
  const latestVersion = fetchLatestVersion();

  if (!latestVersion) {
    progress.fail('Could not fetch latest version from npm');
    log.info('Proceeding with local upgrade using current package...');
    log.blank();
  } else {
    progress.succeed(`Version check complete`);
    log.blank();
    console.log(`  ${pc.dim('Current:')} v${currentVersion}`);
    console.log(`  ${pc.dim('Latest:')}  v${latestVersion}`);
    log.blank();

    const cmp = compareVersions(currentVersion, latestVersion);

    if (cmp === 0) {
      log.success('Already on the latest version.');
      log.info('Re-installing to sync files...');
      log.blank();
    } else if (cmp === 1) {
      log.warn('Local version is newer than npm (dev build?).');
      log.info('Re-installing to sync files...');
      log.blank();
    } else {
      // Current < Latest → need to fetch latest first
      progress.update(`Downloading nextjs-claude-code@${latestVersion}...`);
      try {
        execSync(`npx nextjs-claude-code@${latestVersion} --force`, {
          cwd: targetDir,
          encoding: 'utf-8',
          timeout: 120_000,
          stdio: 'inherit',
        });
        progress.succeed(`Upgraded to v${latestVersion}`);
        log.blank();
        // The npx command already ran install, so we just update skills and exit
        log.info('Updating skills...');
        await updateSkills(targetDir);
        log.blank();
        log.success(pc.bold(`NCC upgraded to v${latestVersion}`));

        const npxChangelog = getLatestChangelog();
        if (npxChangelog) displayChangelog(npxChangelog);

        log.blank();
        return;
      } catch {
        progress.fail('npx upgrade failed — falling back to local reinstall');
        log.blank();
      }
    }
  }

  // ── Local reinstall (force mode) ────────────────────────────────────────
  const projectName = path.basename(targetDir);
  const answers: UserAnswers = {
    projectName,
    tool: 'claude',
  };

  await install({ targetDir, answers, force: true, dryRun: false });

  log.blank();
  log.info('Updating skills...');
  await updateSkills(targetDir);

  log.blank();
  log.success(pc.bold(`NCC upgrade complete (v${currentVersion})`));

  const localChangelog = getLatestChangelog();
  if (localChangelog) displayChangelog(localChangelog);

  log.blank();
}
