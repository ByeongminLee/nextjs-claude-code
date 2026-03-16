export type ToolTarget = 'claude';
export type FrameworkType = 'nextjs-app' | 'nextjs-pages' | 'react';
export type TeamSize = 'solo' | 'small' | 'medium' | 'large';
export type ArchPattern = 'flat' | 'feature-based' | 'fsd' | 'monorepo';

export interface UserAnswers {
  projectName: string;
  framework: FrameworkType;
  teamSize: TeamSize;
  archPattern: ArchPattern;
  libraries: string[];
  features: string[];
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
  FRAMEWORK: string;
  TECH_STACK: string;         // 조합된 스택 문자열 (agent 참조용)
  ARCH_PATTERN: string;
  ARCH_PATTERN_LABEL: string;
  ROUTER_TYPE: string;
  LIBRARIES_LIST: string;
  FEATURES_LIST: string;
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
