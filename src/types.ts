export type ToolTarget = 'claude';
export type FrameworkType = 'nextjs-app' | 'nextjs-pages' | 'react';

export interface UserAnswers {
  projectName: string;
  tool: ToolTarget;
  workspacePath?: string; // monorepo 시 앱 경로 (e.g. 'apps/web')
}

export interface InstallOptions {
  targetDir: string;
  answers: UserAnswers;
  force?: boolean;
  dryRun?: boolean;
}

export interface TemplateVars {
  PROJECT_NAME: string;
  CURRENT_DATE: string;
  [key: string]: string;
}

export interface SkillDef {
  name: string;
  url: string;
  cli: string;                  // npx skills add ... 명령어
  description: string;
  condition?: string[];        // 선택된 라이브러리 slug 중 하나라도 일치하면 설치
  framework?: FrameworkType[]; // 특정 프레임워크에서만 설치
}

export interface SkillManifestEntry {
  name: string;
  url: string;
  cli: string;
  installedAt: string;
  source: 'cli' | 'bundled';
}
