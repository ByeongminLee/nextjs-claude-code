export const ko = {
  lang: 'ko',
  title: 'NCC',
  subtitle: 'nextjs-claude-code',
  tagline: 'Next.js & React를 위한 Spec-Driven AI 개발 워크플로우. Claude Code 전용.',
  description: '기능 단위로 명세를 정의하고, 정의한 대로 정확하게 구현합니다 — 모든 변경은 요구사항까지 추적됩니다.',

  features: {
    title: '주요 기능',
    items: [
      { bold: 'Spec-Driven', text: 'REQ-NNN 추적 가능한 feature spec, 준수 보고서' },
      { bold: 'TDD 기본', text: 'MSW API 목킹과 함께 Test-Driven Development가 기본' },
      { bold: '큐레이션 스킬', text: 'skills.sh에서 core 스킬 자동 설치, package.json 기반 on-demand 스킬 매칭' },
      { bold: '아키텍처 가이드', text: 'Flat, Feature-Based, FSD, Monorepo (프로젝트 구조에서 자동 감지)' },
      { bold: '라이브러리 인식 에이전트', text: '선택한 스택에 맞춰 코드 작성' },
      { bold: 'Next.js 네이티브', text: 'App Router, Server Components, Server Actions, Pages Router' },
      { bold: 'React 호환', text: 'Vite 등 다른 React 셋업도 지원' },
      { bold: 'Monorepo 지원', text: 'Turborepo 워크스페이스 인식 설치' },
      { bold: 'Claude Code 네이티브', text: 'slash commands, 멀티 에이전트 조합, lifecycle hooks (SessionStart, PreToolUse, PostToolUse, Stop)' },
      { bold: 'Hook profiles', text: 'NCC_HOOK_PROFILE로 훅 강도 조절: minimal, standard (기본), strict' },
      { bold: 'Wave 실행', text: '태스크를 의존성 기반 wave로 그룹화하여 병렬 디스패치' },
      { bold: 'Path-specific rules', text: '.claude/rules/에 paths 프론트매터로 매칭 파일에서만 로드되는 코딩 패턴' },
    ],
  },

  prerequisites: {
    title: '사전 요구사항',
    items: [
      'Node.js >= 18',
      'Claude Code 설치 및 설정 완료',
    ],
  },

  installation: {
    title: '설치',
    human: '직접 설치',
    humanLink: 'https://github.com/ByeongminLee/nextjs-claude-code/blob/main/docs/installation.ko.md',
    claude: 'Claude Code용 — 가이드를 가져와서 따라 실행:',
    command: 'curl -s https://raw.githubusercontent.com/ByeongminLee/nextjs-claude-code/main/docs/installation.ko.md',
  },

  whySdd: {
    title: '왜 SDD인가?',
    paragraphs: [
      '기능은 한 번에 완성되지 않습니다. 결제 기능을 기본 체크아웃으로 먼저 출시하고, 한 달 후 쿠폰을 추가합니다. 매번 이전에 무엇을 만들었는지, 현재 스펙이 무엇인지, 무엇이 바뀌었는지를 알아야 합니다.',
      'Spec-kit, OpenSpec 같은 기존 SDD 도구는 독립적인 변경사항에는 잘 동작하지만, 변경사항별 폴더 구조는 하나의 기능이 시간에 따라 어떻게 발전했는지 파악하기 어렵게 만듭니다.',
    ],
    example: `/spec payment-coupon "payment에 쿠폰 기능 추가, Figma: https://..."   # 스펙 정의
/dev payment-coupon                                                    # 구현`,
    points: [
      { bold: '변경 단위가 아니라 기능 단위.', text: '각 기능은 프로젝트 전체 기간 동안 유지되는 고정된 위치(spec/feature/[이름]/)를 가집니다.' },
      { bold: '점진적 개발을 위한 구조.', text: '스펙, 디자인, 구현 이력이 함께 유지되어 매 반복이 처음부터가 아닌 이전 결과 위에 쌓입니다.' },
      { bold: '속도보다 스펙 정확성.', text: 'spec-writer는 작성 전 모호한 점을 질문하고, lead-engineer는 확인된 계획을 따르며, verifier는 "동작한다"를 확인합니다.' },
    ],
    who: {
      title: '누구를 위한 도구인가?',
      text: 'NCC는 확정된 스펙을 기능 단위로 반복적으로 구현하고 추적하는 개발 방식에 최적화되어 있습니다. 출시 후에도 계속 진화하는 기능을 다루는 팀을 위한 도구입니다.',
    },
  },

  workflow: {
    title: '워크플로우',
    description: '핵심 SDD 루프 — 무엇을 만들지 정의하고, 만듭니다.',
    commands: `/spec [이름] "기능 설명"   →  spec-writer가 질문 → spec.md + design.md 작성
/dev  [이름]               →  planner → lead-engineer → verifier → 완료
/dev  [이름] --team        →  planner → lead-engineer (+ db/ui/worker 팀) → verifier → 완료`,
  },

  ops: {
    title: '명령어',
    sections: [
      {
        subtitle: '아이디에이션 & 디자인',
        commands: [
          { cmd: '/create "..."', desc: '아이디에이션→검증 파이프라인 (C-suite 리뷰)' },
          { cmd: '/brainstorm "..."', desc: '빠른 디자인 탐색 + 트레이드오프' },
          { cmd: '/reforge "[경로]" "..."', desc: '레거시 프로젝트를 spec-driven 개발로 전환' },
        ],
      },
      {
        subtitle: '리뷰 & 품질',
        commands: [
          { cmd: '/review [이름]', desc: '스펙 준수 + 코드 품질 리뷰' },
          { cmd: '/loop [이름]', desc: '리뷰 → 수정 → 재검증 반복, 모든 REQ 통과까지 (최대 5회)' },
          { cmd: '/qa', desc: 'Playwright E2E 테스트, visual regression, 접근성 감사' },
          { cmd: '/test [이름]', desc: 'TEST_STRATEGY.md 기반 테스트 실행' },
          { cmd: '/log [이름]', desc: '로깅 관행 감사' },
          { cmd: '/security [이름]', desc: '보안 감사 (OWASP Top 10)' },
        ],
      },
      {
        subtitle: 'Git & 릴리스',
        commands: [
          { cmd: '/commit [이름]', desc: 'diff 기반 커밋 메시지 자동 생성' },
          { cmd: '/pr [이름] [target]', desc: '스펙 기반 PR 본문 생성' },
        ],
      },
      {
        subtitle: '인프라',
        commands: [
          { cmd: '/cicd', desc: 'CI/CD 파이프라인 설정' },
        ],
      },
      {
        subtitle: '이슈 리포팅',
        commands: [
          { cmd: '/issue-reporter "..."', desc: 'NCC 버그/기능 요청을 GitHub에 제출 (프로젝트 데이터 자동 제거, 사용자 확인 필요)' },
        ],
      },
      {
        subtitle: '개발 유틸리티',
        commands: [
          { cmd: '/init', desc: '기존 코드베이스 분석 + spec 문서 초안 생성' },
          { cmd: '/debug "..."', desc: '가설 기반 버그 분석' },
          { cmd: '/status', desc: '프로젝트 상태 요약' },
          { cmd: '/rule "..."', desc: '코딩 규칙 추가 또는 수정' },
        ],
      },
      {
        subtitle: '업그레이드',
        commands: [
          { cmd: '/ncc-upgrade', desc: 'Claude Code 내에서 NCC 업그레이드 (플러그인/npx 자동 감지)' },
          { cmd: 'npx nextjs-claude-code upgrade', desc: '터미널에서 NCC 업그레이드 (npx 전용)' },
        ],
      },
    ],
  },

  agents: {
    title: 'Agent 역할',
    description: 'Claude Code 에이전트들이 각자의 역할과 권한을 가지고 협력합니다.',
    core: {
      subtitle: 'Core Agents',
      items: [
        { name: 'spec-writer', role: 'spec.md + design.md 작성' },
        { name: 'planner', role: 'CONTEXT.md + PLAN.md 생성, 도메인 분석 + 태스크 태깅' },
        { name: 'lead-engineer', role: 'fresh-context subagent로 구현 오케스트레이션. Wave 기반 병렬 디스패치.' },
        { name: 'verifier', role: '4단계 검증' },
      ],
    },
    subagents: {
      subtitle: 'Fresh-Context Subagents (/dev)',
      items: [
        { name: 'task-executor', role: '[lead] 태스크 구현 (타입, 유틸, 훅, API 라우트)' },
        { name: 'task-spec-reviewer', role: '태스크별 스펙 준수 + 코드 품질 리뷰' },
      ],
    },
    team: {
      subtitle: 'Team Engineers (/dev --team)',
      items: [
        { name: 'db-engineer', role: '스키마, 마이그레이션, ORM, 쿼리' },
        { name: 'ui-engineer', role: '컴포넌트, 스타일링, 애니메이션' },
        { name: 'worker-engineer', role: '단순 유틸, 타입 정의, 설정' },
      ],
    },
    reforge: {
      subtitle: 'Reforge Agents (/reforge)',
      items: [
        { name: 'reforge-orchestrator', role: '5단계 레거시→스펙 파이프라인' },
        { name: 'codebase-analyzer', role: '레거시 코드베이스 심층 분석' },
        { name: 'reforge-spec-generator', role: '분석 기반 스펙 생성' },
      ],
    },
  },

  safety: {
    title: '안전 장치',
    items: [
      { bold: 'Checkpoints', text: 'lead-engineer가 의사결정, UI 완료, 인증/결제 시 사용자 확인을 받고 진행' },
      { bold: 'Auto-fix Budget', text: '모드별 최대 3회 재시도 — 에러 분석 → 다른 접근법 → 최소 변경 → 에스컬레이션' },
      { bold: 'Verification Levels', text: '파일 존재부터 브라우저 검증까지 4단계' },
      { bold: 'Resume Protocol', text: '중단된 /dev 세션을 중단 지점부터 재개' },
      { bold: 'Hook Profiles', text: 'minimal (보안만), standard (기본), strict (+ deprecation guard, comment checker, todo enforcer)' },
      { bold: '스펙 검증', text: 'PostToolUse 훅이 잘못된 스펙 작성을 차단하고 스펙 업데이트를 리마인드' },
    ],
  },

  references: {
    title: 'References',
    text: "NCC는 Claude Code 생태계에서 검증된 최선의 패턴을 연구하고, 이를 하나의 일관된 워크플로우로 통합하여 만들어졌습니다. Wave 실행, 컨텍스트 엔지니어링, 에이전트 오케스트레이션, 토큰 최적화, 검증 루프, 스펙 기반 계획 등 핵심 기능은 <a href=\"https://github.com/gsd-build/get-shit-done\">GSD</a>, <a href=\"https://github.com/garrytan/gstack\">gstack</a>, <a href=\"https://github.com/affaan-m/everything-claude-code\">Everything Claude Code</a>, <a href=\"https://github.com/code-yeongyu/oh-my-openagent\">Oh My OpenAgent</a>, <a href=\"https://github.com/obra/superpowers\">Superpowers</a>, <a href=\"https://github.com/vercel/vercel-plugin\">Vercel Plugin</a>, <a href=\"https://github.com/github/spec-kit\">Spec Kit</a>, <a href=\"https://github.com/Fission-AI/OpenSpec\">OpenSpec</a>의 인사이트를 반영하여 개선되었습니다.",
  },

  contributing: {
    title: '기여',
    text: '이슈와 PR을 환영합니다.',
    repo: 'https://github.com/ByeongminLee/nextjs-claude-code',
  },

  license: 'MIT',
};
