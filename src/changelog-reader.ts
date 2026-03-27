import fs from 'fs';
import path from 'path';
import pc from 'picocolors';

/**
 * Reads CHANGELOG.md from the package root and returns the latest version entry.
 */
export function getLatestChangelog(): string | null {
  const changelogPath = path.resolve(__dirname, '../CHANGELOG.md');
  if (!fs.existsSync(changelogPath)) return null;

  const content = fs.readFileSync(changelogPath, 'utf-8');
  const lines = content.split('\n');

  let startIdx = -1;
  let endIdx = lines.length;

  for (let i = 0; i < lines.length; i++) {
    if (/^## \[/.test(lines[i])) {
      if (startIdx === -1) {
        startIdx = i;
      } else {
        endIdx = i;
        break;
      }
    }
  }

  if (startIdx === -1) return null;
  return lines.slice(startIdx, endIdx).join('\n').trim();
}

export function displayChangelog(entry: string): void {
  console.log();
  console.log(pc.bold("  What's new:"));
  console.log();

  for (const line of entry.split('\n')) {
    if (line.startsWith('## ')) {
      // Version header — already shown in upgrade output
      continue;
    } else if (line.startsWith('### ')) {
      console.log(pc.cyan(`  ${line.replace('### ', '')}`));
    } else if (line.startsWith('- ')) {
      console.log(pc.dim(`    ${line}`));
    }
  }
  console.log();
}
