#!/usr/bin/env ts-node
/**
 * Pre-publish script: installs latest SKILL.md from skills.sh via npx
 *
 * - Core skills → template/.claude/skills/[name]/
 * - On-demand skills → template/skills-archive/[name]/
 *
 * Run: npm run fetch-skills
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { SKILLS } from '../src/skills-installer';

const TEMPLATE_DIR = path.resolve(__dirname, '../template');

function getDestDir(skill: (typeof SKILLS)[number]): string {
  if (skill.tier === 'core') {
    return path.join(TEMPLATE_DIR, '.claude', 'skills', skill.name);
  }
  return path.join(TEMPLATE_DIR, 'skills-archive', skill.name);
}

function main(): void {
  const coreSkills = SKILLS.filter((s) => s.tier === 'core');
  const onDemandSkills = SKILLS.filter((s) => s.tier === 'on-demand');

  console.log(`Fetching skills: ${coreSkills.length} core + ${onDemandSkills.length} on-demand\n`);

  // skills-archive 디렉토리 생성
  fs.mkdirSync(path.join(TEMPLATE_DIR, 'skills-archive'), { recursive: true });

  let fetched = 0;
  let failed = 0;

  for (const skill of SKILLS) {
    const destDir = getDestDir(skill);
    const tierLabel = skill.tier === 'core' ? 'core' : 'archive';

    process.stdout.write(`  [${tierLabel}] ${skill.name}... `);

    try {
      // npx skills add는 항상 .claude/skills/에 설치하므로
      // 임시로 TEMPLATE_DIR에서 실행 후 on-demand는 옮긴다
      const tempSkillDir = path.join(TEMPLATE_DIR, '.claude', 'skills', skill.name);

      execSync(skill.cli, {
        cwd: TEMPLATE_DIR,
        timeout: 30000,
        stdio: 'pipe',
      });

      const tempSkillMd = path.join(tempSkillDir, 'SKILL.md');

      if (skill.tier === 'on-demand') {
        // on-demand: .claude/skills/에서 skills-archive/로 이동
        if (fs.existsSync(tempSkillDir)) {
          fs.mkdirSync(destDir, { recursive: true });
          copyDirRecursive(tempSkillDir, destDir);
          fs.rmSync(tempSkillDir, { recursive: true, force: true });
          console.log('✓');
          fetched++;
        } else {
          console.log('✗ (npx succeeded but dir not found — keeping existing)');
          failed++;
        }
      } else {
        // core: 이미 올바른 위치에 설치됨
        if (fs.existsSync(tempSkillMd)) {
          console.log('✓');
          fetched++;
        } else {
          console.log('✗ (npx succeeded but SKILL.md not found — keeping existing)');
          failed++;
        }
      }
    } catch {
      console.log('✗ (npx failed — keeping existing bundled version)');
      failed++;
    }
  }

  console.log(`\nDone: ${fetched} fetched, ${failed} failed (kept existing)`);

  if (failed > 0) {
    console.log('\nNote: Failed skills will use the existing bundled version as fallback.');
  }
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

main();
