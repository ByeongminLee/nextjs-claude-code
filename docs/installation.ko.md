# NCC 설치 가이드

## npx

```bash
npx nextjs-claude-code@latest
```

**자동으로 수행되는 작업:**

1. 현재 디렉토리에서 프로젝트 이름 감지
2. `package.json`에서 프레임워크 및 라이브러리 자동 감지
3. `spec/` 템플릿, `.claude/` 에이전트, 스크립트, 설정 파일 복사
4. [skills.sh](https://skills.sh)에서 코어 스킬 번들링, 온디맨드 스킬 카탈로그 생성
5. `CLAUDE.md`에 세션 시작 지시 추가

대화형 프롬프트 없이 자동 설치됩니다. `--force` 옵션으로 기존 파일 덮어쓰기 가능 (확인 프롬프트 표시).

---

## Claude Code Plugin

Claude Code 플러그인으로 설치. 에이전트와 스킬이 자동 로드됩니다.

```bash
# 마켓플레이스 추가
/plugin marketplace add ByeongminLee/nextjs-claude-code

# 플러그인 설치
/plugin install nextjs-claude-code@nextjs-claude-code
```

스킬은 `/nextjs-claude-code:spec`, `/nextjs-claude-code:dev` 등으로 네임스페이스 됩니다.

> **참고**: 플러그인 설치는 agents, skills, hooks를 제공하지만 `spec/` 템플릿 파일(PROJECT.md, ARCHITECTURE.md, RULE.md 등)은 설치하지 않습니다. 플러그인 설치 후 `/init`을 실행하거나, 전체 스캐폴딩이 필요하면 npx를 사용하세요.

---

## 설치 후 생성되는 파일

```
.claude/
  agents/          전문 에이전트 (init, spec-writer, planner, lead-engineer,
                   db-engineer, ui-engineer, worker-engineer, verifier,
                   reviewer, code-quality-reviewer, loop, status, debugger,
                   rule-writer)
  skills/          skills.sh 참조 스킬 + skills-manifest.json
  scripts/         validate-spec.sh, reflect-spec.sh (PostToolUse hooks)
  settings.json    Hook 설정 (기존 hooks와 병합)

spec/
  PROJECT.md       프로젝트 컨텍스트 (프레임워크, 아키텍처, 라이브러리, 테스팅 설정)
  ARCHITECTURE.md  Feature 맵 + 디렉토리 구조 (아키텍처별)
  RULE.md          워크플로우 규칙 (불변)
  STATE.md         모든 feature와 각각의 phase (멀티 feature)
  rules/           프로젝트 코딩 규칙 (/rule로 관리)
  feature/[이름]/
    spec.md        무엇을 만드는가 (REQ-NNN 형식)
    design.md      어떻게 만드는가 (컴포넌트, 상태, 데이터 흐름)
    PLAN.md        WHAT — 태스크 목록, 체크포인트, auto-fix budget
    CONTEXT.md     WHY — 확정된 결정사항, 제약조건, 비협상 사항
    LOOP_NOTES.md  /loop 반복 간 컨텍스트 (loop agent가 생성/삭제)
    history/       변경이력 아카이브

CLAUDE.md          세션 시작 지시 (기존 내용에 추가, 덮어쓰기 아님)
```

---

## CLI 옵션

```bash
npx nextjs-claude-code@latest                       # 설치 (비대화형)
npx nextjs-claude-code@latest --force               # 기존 파일 덮어쓰기
npx nextjs-claude-code@latest --dry-run             # 실제 쓰기 없이 미리보기
```

**플러그인 업데이트 후 최신 스킬 재설치:**

```bash
npx nextjs-claude-code@latest --force
```
