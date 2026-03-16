#!/usr/bin/env node

/**
 * NCC Image Optimizer — Converts images to WebP using sharp
 *
 * Usage:
 *   node optimize-images.js <input_dir> [output_dir] [quality] [max_width] [max_height]
 *
 * Examples:
 *   node optimize-images.js public/images                      # Replace originals
 *   node optimize-images.js public/images public/images-webp   # Separate output
 *   node optimize-images.js src/assets src/assets 90 2560 1440 # Custom quality & size
 */

const fs = require('fs');
const path = require('path');

let sharp;
try {
  sharp = require('sharp');
} catch {
  console.error('sharp is not installed. Run: npm install --no-save sharp');
  process.exit(1);
}

const INPUT_DIR = process.argv[2];
const OUTPUT_DIR = process.argv[3] || INPUT_DIR;
const QUALITY = parseInt(process.argv[4] || '80');
const MAX_WIDTH = parseInt(process.argv[5] || '1920');
const MAX_HEIGHT = parseInt(process.argv[6] || '1080');
const REPLACE = OUTPUT_DIR === INPUT_DIR;

if (!INPUT_DIR) {
  console.error('Usage: node optimize-images.js <input_dir> [output_dir] [quality] [max_width] [max_height]');
  process.exit(1);
}

const SUPPORTED = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff'];

function findImages(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findImages(fullPath));
    } else if (SUPPORTED.includes(path.extname(entry.name).toLowerCase())) {
      results.push(fullPath);
    }
  }
  return results;
}

async function optimize(inputPath) {
  const rel = path.relative(INPUT_DIR, inputPath);
  const outDir = path.join(OUTPUT_DIR, path.dirname(rel));
  const outName = path.basename(rel, path.extname(rel)) + '.webp';
  const outPath = path.join(outDir, outName);

  fs.mkdirSync(outDir, { recursive: true });

  const origSize = fs.statSync(inputPath).size;

  await sharp(inputPath)
    .resize(MAX_WIDTH, MAX_HEIGHT, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: QUALITY, effort: 6 })
    .toFile(outPath);

  const newSize = fs.statSync(outPath).size;
  const saved = Math.round((1 - newSize / origSize) * 100);

  if (REPLACE && outPath !== inputPath) {
    fs.unlinkSync(inputPath);
  }

  return {
    file: rel,
    origKB: Math.round(origSize / 1024),
    newKB: Math.round(newSize / 1024),
    saved,
  };
}

async function main() {
  const images = findImages(INPUT_DIR);
  if (images.length === 0) {
    console.log('No images found in ' + INPUT_DIR);
    process.exit(0);
  }

  console.log('Found ' + images.length + ' images in ' + INPUT_DIR);
  console.log('Output: ' + (REPLACE ? 'replacing originals' : OUTPUT_DIR));
  console.log('Quality: ' + QUALITY + ' | Max: ' + MAX_WIDTH + 'x' + MAX_HEIGHT + '\n');

  let totalOrig = 0;
  let totalNew = 0;

  for (const img of images) {
    const r = await optimize(img);
    totalOrig += r.origKB;
    totalNew += r.newKB;
    console.log('  ' + r.file + ': ' + r.origKB + 'KB -> ' + r.newKB + 'KB (' + r.saved + '% saved)');
  }

  const totalSaved = totalOrig > 0 ? Math.round((1 - totalNew / totalOrig) * 100) : 0;
  console.log('\n--- Summary ---');
  console.log('Files: ' + images.length);
  console.log('Original: ' + totalOrig + 'KB');
  console.log('Optimized: ' + totalNew + 'KB');
  console.log('Saved: ' + (totalOrig - totalNew) + 'KB (' + totalSaved + '%)');
}

main().catch(function (e) {
  console.error(e.message);
  process.exit(1);
});
