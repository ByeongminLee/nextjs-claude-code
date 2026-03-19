import fs from 'fs';
import path from 'path';
import { InstallOptions, TemplateVars } from './types';
import { render, buildTemplateVars } from './renderer';
import { installSkills, SKILLS } from './skills-installer';
import { detectFromPackageJson } from './detect';
import { progress } from './logger';

const TEMPLATE_DIR = path.resolve(__dirname, '../template');

const FS_MARKER_START = '<!-- fs:start -->';
const FS_MARKER_END = '<!-- fs:end -->';

// ─── CLAUDE.md injection ────────────────────────────────────────────────────

const FS_CLAUDE_MD_BLOCK = `
${FS_MARKER_START}
## NCC — Session Start

Before any work, always read:
1. \`spec/STATE.md\` — current progress and active features
2. \`spec/rules/_workflow.md\` — core workflow rules (extended rules in \`spec/rules/_*.md\`)

Before modifying code:
- Read \`spec/feature/[name]/spec.md\` (what to build)
- Read \`spec/feature/[name]/design.md\` (how to build it)
- If \`spec/feature/[name]/CONTEXT.md\` exists, its decisions are non-negotiable

### Commands

| Command | Description |
|---------|-------------|
| \`/init\` | First-time setup |
| \`/spec [name] "desc"\` | Define a feature spec |
| \`/dev [name]\` | Implement a feature (solo mode) |
| \`/dev [name] --team\` | Implement with parallel engineer team (db/ui/worker) |
| \`/review [name]\` | Check spec compliance |
| \`/loop [name]\` | Force-complete until all REQs pass |
| \`/debug "desc"\` | Systematic bug fixing |
| \`/status\` | Project status |
| \`/commit\` | Auto-generate commit message |
| \`/pr\` | Create PR with spec-based body |

### Navigation
- Agents: \`.claude/agents/\` — lead-engineer, db-engineer, ui-engineer, worker-engineer, planner, verifier
- Skills: \`.claude/skills/\` — on-demand reference, loaded by skill name
- Rules: \`spec/rules/\` — project coding rules (read before writing code)
${FS_MARKER_END}
`;

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
  if (!existing.hooks) existing.hooks = {};
  if (!existing.hooks.PostToolUse) existing.hooks.PostToolUse = [];

  const existingPostToolUse: Array<{ matcher?: string; hooks?: Array<{ command?: string }> }> = existing.hooks.PostToolUse;

  // Collect all existing hook commands across all matcher groups
  const existingCommands = new Set<string>();
  for (const group of existingPostToolUse) {
    for (const h of group.hooks ?? []) {
      if (h.command) existingCommands.add(h.command);
    }
  }

  // For each template hook group, merge missing hooks into matching existing group or add new group
  for (const templateGroup of fsHooks) {
    const templateHooks: Array<{ command?: string }> = (templateGroup as any).hooks ?? [];
    const newHooks = templateHooks.filter((h: any) => h.command && !existingCommands.has(h.command));
    if (newHooks.length === 0) continue;

    // Find existing group with same matcher
    const matchingGroup = existingPostToolUse.find((g) => g.matcher === (templateGroup as any).matcher);
    if (matchingGroup) {
      if (!matchingGroup.hooks) matchingGroup.hooks = [];
      matchingGroup.hooks.push(...newHooks);
    } else {
      existingPostToolUse.push({ ...(templateGroup as any), hooks: newHooks });
    }
  }

  if (!dryRun) {
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

