#!/usr/bin/env ts-node
/**
 * Pre-publish script: installs latest SKILL.md from skills.sh via npx
 * and saves as bundled fallback in template/.claude/skills/[name]/SKILL.md
 *
 * Run: npm run fetch-skills
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { SKILLS } from '../src/skills-installer';

const TEMPLATE_DIR = path.resolve(__dirname, '../template');

function main(): void {
  console.log('Installing skills via npx skills add...\n');

  let fetched = 0;
  let failed = 0;

  for (const skill of SKILLS) {
    const destDir = path.join(TEMPLATE_DIR, '.claude', 'skills', skill.name);
    const destPath = path.join(destDir, 'SKILL.md');

    process.stdout.write(`  ${skill.name}... `);

    try {
      execSync(skill.cli, {
        cwd: TEMPLATE_DIR,
        timeout: 30000,
        stdio: 'pipe',
      });

      if (fs.existsSync(destPath)) {
        console.log('✓');
        fetched++;
      } else {
        console.log('✗ (npx succeeded but SKILL.md not found — keeping existing)');
        failed++;
      }
    } catch {
      console.log('✗ (npx failed — keeping existing bundled version)');
      failed++;
    }
  }

  console.log(`\nDone: ${fetched} fetched, ${failed} failed (kept existing)`);

  if (failed > 0) {
    console.log('\nNote: Failed skills will use the existing bundled SKILL.md as fallback.');
    console.log('Make sure template/.claude/skills/[name]/SKILL.md exists for each skill.');
  }
}

main();
