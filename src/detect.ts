import fs from 'fs';
import path from 'path';
import { FrameworkType } from './types';

export const LIBRARY_MAP: Record<string, string> = {
  'react-hook-form':       'react-hook-form',
  'zod':                   'zod',
  'axios':                 'axios',
  'zustand':               'zustand',
  'jotai':                 'jotai',
  '@tanstack/react-query': 'tanstack-query',
  'swr':                   'swr',
  'tailwindcss':           'tailwind',
  'framer-motion':         'framer-motion',
  'better-auth':           'better-auth',
  'next-auth':             'next-auth',
  'prisma':                'prisma',
  'drizzle-orm':           'drizzle',
  'turbo':                 'monorepo',
  '@playwright/test':      'playwright',
  'vitest':                'vitest',
  'jest':                  'jest',
  '@apollo/client':        'apollo',
};

export function detectFromPackageJson(targetDir: string): { framework: FrameworkType; libraries: string[] } {
  const pkgPath = path.join(targetDir, 'package.json');
  if (!fs.existsSync(pkgPath)) {
    return { framework: 'nextjs-app', libraries: [] };
  }

  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8')) as {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
  };
  const deps = { ...pkg.dependencies, ...pkg.devDependencies };

  let framework: FrameworkType = 'react';
  if ('next' in deps) {
    const hasAppDir =
      fs.existsSync(path.join(targetDir, 'app')) ||
      fs.existsSync(path.join(targetDir, 'src', 'app'));
    framework = hasAppDir ? 'nextjs-app' : 'nextjs-pages';
  }

  const libraries: string[] = [];
  if (fs.existsSync(path.join(targetDir, 'components.json'))) {
    libraries.push('shadcn');
  }
  for (const [pkgName, slug] of Object.entries(LIBRARY_MAP)) {
    if (pkgName in deps) libraries.push(slug);
  }

  return { framework, libraries };
}
