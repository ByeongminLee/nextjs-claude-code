# 명령어 레퍼런스

[← README로 돌아가기](README.md) | [English →](../en/commands.md)

---

## 아이디에이션 & 디자인

| 명령어 | 설명 |
|--------|------|
| `/create "설명"` | 아이디에이션→검증 파이프라인. 핵심 질문 → 대안 접근법 → C-레벨 리뷰 (CEO/CTO/CPO/CMO/CDO) → 검증된 컨셉. 선택적으로 `/spec` 입력으로 변환. [상세 →](create-workflow.md) |
| `/brainstorm "설명"` | 빠른 디자인 탐색. 소크라테스식 질문 → 2-3가지 접근법 + 트레이드오프 → spec 준비 요약. |
| `/reforge "[경로]" "변경사항"` | 레거시→스펙 변환. 5단계 파이프라인: 분석 → 변경 명세 → 델타 → 스펙 생성 → 검증. |

## 핵심 워크플로우

| 명령어 | 설명 |
|--------|------|
| `/spec [이름] "설명"` | 피처 spec 정의. 요구사항 명확화 후 `spec/feature/[이름]/spec.md` + `design.md` 작성. |
| `/dev [이름]` | 피처 구현 (솔로 모드). Planner → lead-engineer → verifier. |
| `/dev [이름] --team` | 병렬 팀 구현. Lead-engineer가 db/ui/worker 엔지니어 오케스트레이션. |
| `/loop [이름]` | 리뷰 → 수정 → 재검증 반복, 모든 REQ 통과까지 (최대 5회). |

## 리뷰 & 품질

| 명령어 | 설명 |
|--------|------|
| `/review [이름]` | 감사 명령. 스펙 준수 + 코드 품질 검사. 전략 파일 존재 시 유닛/통합 테스트, 로깅, 보안 감사 조건부 실행. |
| `/qa` | AI 브라우저 QA. spec REQ를 읽고 Playwright MCP로 실제 브라우저 테스트. `--quick` 스모크 테스트. `--visual` 스크린샷. `--a11y` axe-core. |
| `/test [이름]` | 유닛/통합 테스트. TEST_STRATEGY.md 기반. `--setup` 설정. 브라우저 테스트는 `/qa` 사용. |
| `/log [이름]` | 로깅 관행 감사. `--audit` 프로젝트 전체. `--setup` 설정. |
| `/security [이름]` | 보안 감사 (OWASP Top 10). `--audit` 전체. `--diff` 변경분만. `--setup` 설정. |

## Git & 릴리스

| 명령어 | 설명 |
|--------|------|
| `/commit [이름]` | diff 기반 커밋 메시지 자동 생성. REQ 번호 연결. 커밋 컨벤션 준수. |
| `/pr [이름] [target]` | 스펙 기반 PR 본문 생성. 타겟 브랜치 자동 감지. changelog + 버전 업데이트. |

## 개발 유틸리티

| 명령어 | 설명 |
|--------|------|
| `/init` | 코드베이스 분석. 프레임워크, 라이브러리 감지 후 PROJECT.md, ARCHITECTURE.md, STATE.md 생성. |
| `/debug "설명"` | 가설 기반 버그 분석. `spec/DEBUG.md`에 과정 기록. |
| `/status` | `spec/STATE.md` 기반 프로젝트 상태 요약. 읽기 전용. |
| `/rule "설명"` | `spec/rules/`에 코딩 규칙 추가 또는 수정. |

## 인프라

| 명령어 | 설명 |
|--------|------|
| `/cicd` | (실험) CI/CD 파이프라인 설정. 플랫폼별 스킬 탐색. |

## 이슈 리포팅

| 명령어 | 설명 |
|--------|------|
| `/issue-reporter "설명"` | NCC GitHub에 버그/기능 요청 제출. 프로젝트 데이터 자동 제거 후 전송. |

## 스킬 관리 (CLI)

| 명령어 | 설명 |
|--------|------|
| `npx nextjs-claude-code skill-list` | 사용 가능한 스킬 및 설치 상태 조회 |
| `npx nextjs-claude-code skill-add [이름]` | 특정 스킬 설치 |
| `npx nextjs-claude-code skill-update` | 설치된 스킬 최신 버전으로 업데이트 |
| `npx nextjs-claude-code skill-suggest` | package.json 기반 스킬 추천 |

## 업그레이드

| 명령어 | 설명 |
|--------|------|
| `/ncc-upgrade` | Claude Code 내에서 NCC 업그레이드. 플러그인/npx 자동 감지. |
| `npx nextjs-claude-code upgrade` | 터미널에서 NCC 업그레이드 (npx 전용). |
| `/ncc-help` | NCC 사용법 및 버전 정보. |
| `npx nextjs-claude-code doctor` | 설치 상태 진단. |

**업데이트 대상:** agents, hooks, scripts, rules, skills, CLAUDE.md 블록, settings.json (병합).
**보존 대상:** `spec/feature/`, `spec/STATE.md`, CLAUDE.md 사용자 콘텐츠, `skills-lock.json`.
