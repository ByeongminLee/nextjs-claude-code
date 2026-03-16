import { TemplateVars, UserAnswers, FrameworkType, ArchPattern } from './types';

export function render(content: string, vars: TemplateVars): string {
  return content.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    return key in vars ? vars[key] : `{{${key}}}`;
  });
}

const FRAMEWORK_LABELS: Record<FrameworkType, string> = {
  'nextjs-app':   'Next.js App Router',
  'nextjs-pages': 'Next.js Pages Router',
  'react':        'React (Vite)',
};

const ARCH_LABELS: Record<ArchPattern, string> = {
  'flat':          'Flat Structure',
  'feature-based': 'Feature-Based',
  'fsd':           'Feature-Slice Design (FSD)',
  'monorepo':      'Monorepo (Turborepo)',
};

export function buildTemplateVars(answers: UserAnswers): TemplateVars {
  const today = new Date();
  const currentDate = today.toISOString().split('T')[0];

  const frameworkLabel = FRAMEWORK_LABELS[answers.framework];
  const archLabel = ARCH_LABELS[answers.archPattern];

  const routerType = answers.framework === 'nextjs-app'
    ? 'App Router'
    : answers.framework === 'nextjs-pages'
    ? 'Pages Router'
    : 'N/A';

  const librariesList = answers.libraries.length > 0
    ? answers.libraries.join(', ')
    : 'none selected';

  const techStack = [
    frameworkLabel,
    'TypeScript',
    ...answers.libraries,
  ].join(', ');

  const featuresList = answers.features
    .map((f) => `| ${f} | <!-- /init will fill this in --> | <!-- /init will fill this in --> |`)
    .join('\n');

  return {
    PROJECT_NAME:       answers.projectName,
    FRAMEWORK:          frameworkLabel,
    TECH_STACK:         techStack,
    ARCH_PATTERN:       answers.archPattern,
    ARCH_PATTERN_LABEL: archLabel,
    ROUTER_TYPE:        routerType,
    LIBRARIES_LIST:     librariesList,
    FEATURES_LIST:      featuresList,
    CURRENT_DATE:       currentDate,
  };
}

export function sanitizeFeatureName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}
