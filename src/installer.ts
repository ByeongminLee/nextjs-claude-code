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
- When modifying a spec, also update CONTEXT.md and design.md to keep decisions in sync

### Commands

| Command | Description |
|---------|-------------|
| \`/init\` | First-time setup |
| \`/spec [name] "desc"\` | Define a feature spec |
| \`/dev [name]\` | Implement a feature (solo mode) |
| \`/dev [name] --team\` | Implement with parallel engineer team (db/ui/lead) |
| \`/review [name]\` | Check spec compliance |
| \`/loop [name]\` | Force-complete until all REQs pass |
| \`/debug "desc"\` | Systematic bug fixing |
| \`/status\` | Project status |
| \`/create "desc"\` | Ideation → C-level review → validation |
| \`/commit\` | Auto-generate commit message |
| \`/pr\` | Create PR with spec-based body |
| \`/ncc-upgrade\` | Upgrade NCC to latest version |
| \`/ncc-help\` | NCC usage help and version info |

### Navigation
- Agents: \`.claude/agents/\` — lead-engineer, task-executor, db-engineer, ui-engineer, planner, verifier
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
    ['settings.json', 'skills', 'rules'],
  );
  const skillCount = await copyDir(
    path.join(claudeTemplateDir, 'skills'),
    path.join(targetDir, '.claude', 'skills'),
    vars, force, dryRun,
    remoteSkillNames,
  );
  const rulesCount = await copyDir(
    path.join(claudeTemplateDir, 'rules'),
    path.join(targetDir, '.claude', 'rules'),
    vars, force, dryRun,
  );
  await mergeSettingsJson(
    path.join(TEMPLATE_DIR, '.claude', 'settings.json'),
    path.join(targetDir, '.claude', 'settings.json'),
    dryRun,
  );
  await mergeMcpJson(
    path.join(TEMPLATE_DIR, '.mcp.json'),
    path.join(targetDir, '.mcp.json'),
    dryRun,
  );
  await injectBlock(
    path.join(targetDir, 'CLAUDE.md'),
    FS_CLAUDE_MD_BLOCK,
    dryRun,
  );
  return agentCount + skillCount + rulesCount;
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

  if (!fs.existsSync(destPath)) {
    if (!dryRun) {
      fs.mkdirSync(path.dirname(destPath), { recursive: true });
      fs.writeFileSync(destPath, JSON.stringify(templateContent, null, 2) + '\n', 'utf-8');
    }
    return;
  }

  const existing = JSON.parse(fs.readFileSync(destPath, 'utf-8'));

  // ── Merge env ───────────────────────────────────────────────────────────────
  if (templateContent.env) {
    if (!existing.env) existing.env = {};
    for (const [key, val] of Object.entries(templateContent.env)) {
      if (!(key in existing.env)) existing.env[key] = val;
    }
  }

  // ── Merge hooks (generic — supports all hook types) ─────────────────────────
  if (!existing.hooks) existing.hooks = {};

  type HookGroup = { matcher?: string; hooks?: Array<{ command?: string }> };

  // Collect all existing hook commands across all hook types
  const existingCommands = new Set<string>();
  for (const hookType of Object.keys(existing.hooks)) {
    for (const group of (existing.hooks[hookType] as HookGroup[]) ?? []) {
      for (const h of group.hooks ?? []) {
        if (h.command) existingCommands.add(h.command);
      }
    }
  }

  // Helper: merge template hook groups into existing hook groups
  function mergeHookGroups(templateGroups: HookGroup[], existingGroups: HookGroup[]): void {
    for (const templateGroup of templateGroups) {
      const templateHooks = (templateGroup.hooks ?? []) as Array<{ command?: string }>;
      const newHooks = templateHooks.filter((h) => h.command && !existingCommands.has(h.command));
      if (newHooks.length === 0) continue;

      const matchingGroup = existingGroups.find((g) => g.matcher === templateGroup.matcher);
      if (matchingGroup) {
        if (!matchingGroup.hooks) matchingGroup.hooks = [];
        matchingGroup.hooks.push(...newHooks);
      } else {
        existingGroups.push({ ...templateGroup, hooks: newHooks });
      }
      for (const h of newHooks) {
        if (h.command) existingCommands.add(h.command);
      }
    }
  }

  // Merge all hook types from template
  for (const hookType of Object.keys(templateContent.hooks || {})) {
    if (!existing.hooks[hookType]) existing.hooks[hookType] = [];
    mergeHookGroups(templateContent.hooks[hookType], existing.hooks[hookType]);
    // Remove empty arrays
    if (existing.hooks[hookType].length === 0) {
      delete existing.hooks[hookType];
    }
  }

  if (!dryRun) {
    fs.writeFileSync(destPath, JSON.stringify(existing, null, 2) + '\n', 'utf-8');
  }
}

async function mergeMcpJson(
  templatePath: string,
  destPath: string,
  dryRun: boolean,
): Promise<void> {
  if (!fs.existsSync(templatePath)) return;
  const templateContent = JSON.parse(fs.readFileSync(templatePath, 'utf-8'));

  if (!fs.existsSync(destPath)) {
    if (!dryRun) {
      fs.mkdirSync(path.dirname(destPath), { recursive: true });
      fs.writeFileSync(destPath, JSON.stringify(templateContent, null, 2) + '\n', 'utf-8');
    }
    return;
  }

  const existing = JSON.parse(fs.readFileSync(destPath, 'utf-8'));

  // Merge mcpServers — only add servers that don't already exist
  if (templateContent.mcpServers) {
    if (!existing.mcpServers) existing.mcpServers = {};
    for (const [name, config] of Object.entries(templateContent.mcpServers)) {
      if (!(name in existing.mcpServers)) {
        existing.mcpServers[name] = config;
      }
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

