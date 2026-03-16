---
name: image-optimizer
description: Optimize images to WebP format. Scans a directory, converts jpg/png/gif/bmp/tiff to WebP using sharp, reports compression results. Run with input/output path arguments.
argument-hint: "[input directory] [optional: output directory]"
---

# Image Optimizer

Convert project images to WebP. Uses the bundled `optimize-images.js` script with sharp.

## When to Use

- After adding new images to the project
- Before deployment to reduce asset size
- When Lighthouse flags image optimization
- Pre-optimized WebP avoids Next.js build-time conversion overhead

## Procedure

### 1. Determine paths

- If `$ARGUMENTS` provides paths, use them
- Otherwise scan for common image directories: `public/images/`, `public/assets/`, `src/assets/`, `assets/`
- Ask: "Replace originals or save to separate directory?"

### 2. Ensure sharp is available

```bash
node -e "require('sharp')" 2>/dev/null || npm install --no-save sharp
```

### 3. Run the optimizer

The script is at `.claude/skills/image-optimizer/optimize-images.js`:

```bash
# Replace originals with WebP
node .claude/skills/image-optimizer/optimize-images.js public/images

# Separate output directory
node .claude/skills/image-optimizer/optimize-images.js public/images public/images-webp

# Custom quality (90) and max dimensions (2560x1440)
node .claude/skills/image-optimizer/optimize-images.js public/images public/images 90 2560 1440
```

| Argument | Default | Description |
|----------|---------|-------------|
| input_dir | (required) | Directory to scan for images |
| output_dir | same as input | Where to write WebP files. Same dir = replace originals |
| quality | 80 | WebP quality 1-100 |
| max_width | 1920 | Downscale wider images (no upscaling) |
| max_height | 1080 | Downscale taller images (no upscaling) |

### 4. Update source references

After conversion, find and replace old image references:

```bash
grep -rn "\.png\|\.jpg\|\.jpeg" --include="*.tsx" --include="*.ts" --include="*.css" src/ app/
```

Replace `.png` / `.jpg` extensions with `.webp` in source code.

### 5. Verify

```bash
npx tsc --noEmit   # or npx next build
```

## Notes

- Supported inputs: jpg, jpeg, png, gif, bmp, tiff
- Animated GIFs lose animation in WebP — warn user before converting
- Sharp is the same library Next.js uses internally
