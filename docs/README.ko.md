# NCC — nextjs-claude-code

> **NCC** — Next.js & React를 위한 Spec-Driven AI 개발 워크플로우. Claude Code 전용.
>
> 기능 단위로 명세를 정의하고, 정의한 대로 정확하게 구현합니다 — 모든 변경은 요구사항까지 추적됩니다.

[English →](../README.md)

---

## 주요 기능

- **Spec-Driven**: REQ-NNN 추적 가능한 feature spec, 준수 보고서
- **TDD 기본**: MSW API 목킹과 함께 Test-Driven Development가 기본 — 테스트 먼저, 구현은 그 다음
- **큐레이션 스킬** — [skills.sh](https://skills.sh) (Claude Code 커뮤니티 스킬 레지스트리)에서 번들 core 스킬 자동 설치, 라이브러리별 on-demand 스킬 선택 설치. React, Next.js, UI/UX, 테스팅 패턴 포함
- **아키텍처 가이드** — Flat, Feature-Based, FSD, Monorepo (프로젝트 구조에서 자동 감지; `/init`으로 조정 가능)
- **라이브러리 인식 에이전트** — 선택한 스택에 맞춰 코드 작성
- **Next.js 네이티브** — App Router, Server Components, Server Actions, Pages Router
- **React 호환** — Vite 등 다른 React 셋업도 지원
- **Monorepo 지원** — monorepo 패턴(Turborepo, apps/packages) 감지 후 `/init`에서 스킬/규칙 적용
- **Claude Code 네이티브** — slash commands, 멀티 에이전트 조합, PostToolUse hooks (파일 작성/수정 후 자동 실행되는 검증 스크립트)

---

## 사전 요구사항

- Node.js >= 18
- [Claude Code](https://claude.ai/claude-code) 설치 및 설정 완료

---

## 설치

**직접 설치** — [설치 가이드](installation.ko.md)

**For Claude Code** — 가이드를 가져와서 따라 실행:

```bash
curl -s https://raw.githubusercontent.com/ByeongminLee/nextjs-claude-code/main/docs/installation.ko.md
```

---

## 빠른 시작

```bash
npx nextjs-claude-code@latest     # SDD 워크플로우 설치
/init                              # 코드베이스 분석, spec 문서 생성
/spec auth "이메일 로그인"           # feature spec 정의
/dev auth                          # 구현
```

---

## 왜 SDD인가?

기능은 한 번에 완성되지 않습니다. 결제 기능을 기본 체크아웃으로 먼저 출시하고, 한 달 후 쿠폰을 추가합니다. 매번 이전에 무엇을 만들었는지, 현재 스펙이 무엇인지, 무엇이 바뀌었는지를 알아야 합니다.

Spec-kit, OpenSpec 같은 기존 SDD 도구는 독립적인 변경사항에는 잘 동작하지만, 변경사항별 폴더 구조는 하나의 기능이 시간에 따라 어떻게 발전했는지 파악하기 어렵게 만듭니다.

```bash
/spec payment-coupon "payment에 쿠폰 기능 추가, Figma: https://..."   # 스펙 정의
/dev payment-coupon                                                    # 구현
```

- **변경 단위가 아니라 기능 단위.** 각 기능은 프로젝트 전체 기간 동안 유지되는 고정된 위치(`spec/feature/[이름]/`)를 가집니다. 변경사항은 history 항목으로 누적됩니다.
- **점진적 개발을 위한 구조.** 스펙, 디자인, 구현 이력이 함께 유지되어 매 반복이 처음부터가 아닌 이전 결과 위에 쌓입니다.
- **속도보다 스펙 정확성.** spec-writer는 작성 전 모호한 점을 질문하고, lead-engineer는 확인된 계획을 따르며, verifier는 "파일이 있다"가 아니라 "동작한다"를 확인합니다.

### 누구를 위한 도구인가?

NCC는 **확정된 스펙을 기능 단위로 반복적으로 구현하고 추적하는 개발 방식**에 최적화되어 있습니다.

출시 후에도 계속 진화하는 기능을 다루는 팀을 위한 도구입니다. 결제 기능 하나가 기본 체크아웃 → 쿠폰 → 구독 → 프로모션으로 수개월에 걸쳐 발전할 때, 매 이터레이션마다 이전 스펙·디자인·구현 이력이 같은 위치에 누적되어 있어야 합니다.

---

## 워크플로우

```
/spec [이름] "기능 설명"   →  spec-writer가 질문 → spec.md + design.md 작성
/dev  [이름]               →  planner → lead-engineer → verifier → 완료
/dev  [이름] --team        →  planner → lead-engineer (+ db/ui/worker 팀) → verifier → 완료
/loop [이름]               →  reviewer → 타겟 수정 → 재검증 → 100% 충족까지 반복
```

### 동작 방식

```
사용자                    Claude Agents              파일
────                      ─────────────              ─────
/spec [이름] "..."  ──→  spec-writer         ──→    spec/feature/[이름]/spec.md
                                                     spec/feature/[이름]/design.md

/dev [이름]         ──→  planner             ──→    spec/feature/[이름]/CONTEXT.md (WHY)
                            │                        spec/feature/[이름]/PLAN.md (WHAT)
                            ↓ (사용자 확인 후)
                         lead-engineer      ──→    소스 코드
                            │  (--team: db/ui/worker 엔지니어 스폰)
                            ↓
                         verifier            ──→    (읽기 전용 검증)
                            │
                            ↓ (검증 통과 후)
                         lead-engineer      ──→    spec/feature/[이름]/history/
                                                     spec/STATE.md

/review [이름]      ──→  reviewer            ──→    (스펙 준수 보고서)
                         code-quality-       ──→    (코드 품질 보고서)
                         reviewer

/loop [이름]        ──→  loop               ──→    reviewer (REQ 체크)
                            │                        ↓ (실패 REQ 있으면)
                            ↓                       lead-engineer (타겟 수정)
                         (반복, 최대 5회)            ↓ (재검증)
                            ↓                       verifier (Level 1-3)
                         완료 또는 에스컬레이션      spec/feature/[이름]/history/

/status             ──→  status              ──→    (읽기 전용 보고서)

/debug "..."        ──→  debugger            ──→    spec/DEBUG.md
                                                     spec/STATE.md

/rule "..."         ──→  rule-writer         ──→    spec/rules/[주제].md
```

## Ops

독립 실행 가능한 명령어 — 필요할 때 언제든 사용하세요.

### 리뷰 & 품질

| 명령어 | 설명 |
|--------|------|
| `/review [이름]` | 전체 feature 단위 스펙 준수 + 코드 품질 리뷰 (태스크 간 통합 관점). TEST_STRATEGY.md / LOG_STRATEGY.md / SECURITY_STRATEGY.md 존재 시 tester, log-auditor, security-reviewer 조건부 실행. |
| `/loop [이름]` | 리뷰 → 수정 → 재검증 반복, 모든 REQ 통과까지 (최대 5회). |
| `/test [이름]` | TEST_STRATEGY.md 기반 테스트 실행. `--browser`로 시각 테스트 + Figma 비교. `--setup`으로 설정. |
| `/log [이름]` | 로깅 관행 감사. `--audit`로 프로젝트 전체 스캔. `--setup`으로 LOG_STRATEGY.md 설정. |
| `/security [이름]` | 보안 감사 (OWASP Top 10). `--audit`로 프로젝트 전체 스캔. `--diff`로 변경 파일만. `--setup`으로 SECURITY_STRATEGY.md 설정. |

### Git & 릴리스

| 명령어 | 설명 |
|--------|------|
| `/commit [이름]` | diff 기반 커밋 메시지 자동 생성. 커밋 컨벤션 준수. REQ 번호 연결. |
| `/pr [이름] [target]` | 스펙 기반 PR 본문 생성. 타겟 브랜치 자동 감지. changelog + version 업데이트. |

### 인프라

| 명령어 | 설명 |
|--------|------|
| `/cicd` | (experimental) CI/CD 파이프라인 설정. 플랫폼별 가이드 사용. spec/CICD.md 생성. |

### 개발 유틸리티

| 명령어 | 설명 |
|--------|------|
| `/init` | 코드베이스 구조 분석, 프레임워크·라이브러리 감지, PROJECT.md(기술 스택), ARCHITECTURE.md(아키텍처 패턴), STATE.md 생성. 설치 후 1회 실행. |
| `/debug "..."` | 가설 기반 버그 분석. spec/DEBUG.md에 과정 기록. |
| `/status` | spec/STATE.md 기반 프로젝트 상태 요약. |
| `/rule "..."` | spec/rules/에 코딩 규칙 추가 또는 수정. |

### 스킬 관리

| 명령어 | 설명 |
|--------|------|
| `npx nextjs-claude-code skill-list` | 사용 가능한 스킬 및 설치 상태 조회 |
| `npx nextjs-claude-code skill-add [name]` | 특정 스킬 추가 설치 |
| `npx nextjs-claude-code skill-update` | 설치된 스킬을 최신 버전으로 업데이트 |
| `npx nextjs-claude-code skill-suggest` | package.json 의존성 기반 스킬 추천 |

---

## Agent 역할 분리

### Core Agents (워크플로우)

| Agent | 역할 | 코드 수정 | 문서 수정 |
|-------|------|:---------:|:---------:|
| `init` | 코드베이스 분석, spec 문서 초안 작성 | No | Yes |
| `spec-writer` | spec.md + design.md 작성 | No | Yes |
| `planner` | CONTEXT.md + PLAN.md 생성, 도메인 분석 + 태스크 태깅 | No | Yes |
| `lead-engineer` | 구현 (솔로 또는 팀 리더) | Yes | 부분 (STATE, history) |
| `verifier` | 4단계 검증 | No | No (읽기 전용) |

### Team Engineers (`/dev --team`)

| Agent | 역할 | 모델 | 코드 수정 |
|-------|------|:----:|:---------:|
| `db-engineer` | 스키마, 마이그레이션, ORM, 쿼리, RLS | sonnet | Yes (DB 파일만) |
| `ui-engineer` | 컴포넌트, 스타일링, 애니메이션, 반응형 | sonnet | Yes (UI 파일만) |
| `worker-engineer` | 단순 유틸, 타입 정의, 설정 (≤200줄) | haiku | Yes (할당 파일만) |

> **참고:** 팀 모드는 `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` 환경변수가 필요합니다. npx 설치 시 `.claude/settings.json`에 설정되며, 플러그인 설치 시 `plugin.json` env로 제공됩니다.

### Ops Agents

| Agent | 역할 | 코드 수정 | 문서 수정 |
|-------|------|:---------:|:---------:|
| `reviewer` | 스펙 준수 보고서 | No | No (읽기 전용) |
| `code-quality-reviewer` | 코드 품질 리뷰 | No | No (읽기 전용) |
| `tester` | 테스트 실행 + TEST.md 관리 | 테스트 파일만 생성 | Yes (TEST.md) |
| `browser-tester` | (experimental) 브라우저 테스트 + Figma 비교 | No | No (읽기 전용) |
| `committer` | 커밋 메시지 자동 생성 | No | No |
| `pr-creator` | PR 생성 + changelog + 버전 범프 | No (CHANGELOG.md + 버전만) | Yes (CHANGELOG.md) |
| `git-strategy-detector` | 브랜치 전략 감지 + 템플릿 생성 | No | Yes (GIT_STRATEGY.md) |
| `log-auditor` | 로깅 감사 및 수정 | fix 모드에서만 (`/log [이름]`) | No (읽기 전용) |
| `security-reviewer` | 보안 감사 (OWASP Top 10) | No | No (읽기 전용) |
| `cicd-builder` | (experimental) CI/CD 파이프라인 생성 | Yes | Yes (CICD.md) |
| `loop` | REQ 강제 충족 루프 | Yes (lead-engineer 경유) | 부분 (STATE, history) |
| `status` | 프로젝트 상태 요약 | No | No (읽기 전용) |
| `debugger` | 버그 수정 | Yes | Yes (DEBUG.md) |
| `rule-writer` | 프로젝트 코딩 규칙 관리 | No | Yes (spec/rules/) |

---

## 안전 장치

### Checkpoints

lead-engineer가 아래 조건에서 반드시 멈추고 사용자 확인을 받습니다:

| 타입                      | 조건                                | 동작                            |
| ------------------------- | ----------------------------------- | ------------------------------- |
| `checkpoint:decision`     | 구현 방향 선택 필요, 타입 구조 변경 | 선택지 제시 후 대기             |
| `checkpoint:human-verify` | UI 구현 완료, 검증 Level 1-3 통과 후 | 브라우저 확인 요청 후 대기      |
| `checkpoint:auth-gate`    | 결제/인증 수동 작업 필요            | 항상 멈춤, 절대 시뮬레이션 없음 |

### Auto-fix Budget

모드별 최대 3회 재시도:
- **`/dev`**: 전체 세션에서 공유 (세션 간 유지)
- **`/loop`**: iteration마다 리셋 (iteration당 독립 budget)
- **`/debug`**: 버그당 3회

```
1회: 에러 분석 후 수정
2회: 다른 접근법으로 수정
3회: 최소 변경으로 수정
초과: [에스컬레이션] 구현 중단, 사용자에게 보고
```

### Verification Levels

모든 `/dev` 완료 후 verifier가 자동 실행됩니다:

| 단계 | 검증 내용                           | 방법                       |
| ---- | ----------------------------------- | -------------------------- |
| 1    | 계획된 파일이 모두 존재하는가       | 파일 존재 확인             |
| 2    | stub이나 placeholder가 없는가       | TODO, 빈 함수, 더미값 grep |
| 2b   | 테스트 파일이 존재하는가 (기본: 차단) | `testing: required` 또는 생략(기본)이면 차단, `optional`/`none`이면 경고만 |
| 3    | 컴포넌트/훅/API가 실제로 연결됐는가 | import, 호출 추적          |
| 4    | 실제로 동작하는가                   | 브라우저 직접 확인         |

### Resume Protocol

`/dev`가 중단되면 (세션 크래시, 타임아웃, 컨텍스트 한계) 다시 `/dev`를 실행하면 중단된 지점부터 재개합니다:

- `spec/STATE.md`가 각 feature의 phase를 독립적으로 추적: `idle` → `planning` → `executing` → `verifying` → `idle` (또는 `/loop` 실행 중에는 `looping`)
- `/dev`는 해당 feature의 phase를 읽고 처음부터 재시작하지 않고 적절한 에이전트로 라우팅
- `spec/feature/[이름]/PLAN.md`에서 완료된 태스크 (`- [x]`)는 재개 시 건너뜀
- Auto-fix budget (`Used: N`)은 세션 간 유지
- spec.md가 PLAN.md 생성 이후 수정되었으면 경고 후 재계획 제안
- **모델 라우팅**: 기본 sonnet, 작은/기계적 작업(verifier, cleanup, 단순 수정)은 haiku. Opus는 사용하지 않음. 기준은 `spec/rules/_model-routing.md` 참조

| Phase | `/dev` 재개 시 동작 |
|---|---|
| `idle` | 처음부터 시작 → planner |
| `planning` | feature의 PLAN.md 상태 확인 → 계획 재개 또는 lead-engineer로 이동 |
| `executing` | 완료된 태스크 건너뜀 → 첫 `- [ ]`부터 계속 |
| `verifying` | lead-engineer를 통해 verifier 재실행 |
| `looping` | LOOP_NOTES.md 읽어 현재 iteration부터 재개 |

### 추가 안전 장치

- **스펙 검증 훅**: PostToolUse 훅이 잘못된 형식의 spec.md, design.md 작성을 차단
- **스펙 반영 훅**: 코드 변경으로 새 export/route가 추가되면 스펙 업데이트를 리마인드
- **계획 노후화 검사**: `/dev` 실행 시 spec.md가 PLAN.md 생성 이후 수정되었으면 경고
- **브랜치 전략 인식**: `/commit`과 `/pr`이 브랜치 전략을 자동 감지하고 커밋 컨벤션 적용
- **조건부 리뷰 에이전트**: tester, log-auditor, security-reviewer는 각각의 전략 파일(TEST_STRATEGY.md, LOG_STRATEGY.md, SECURITY_STRATEGY.md)이 존재할 때만 `/review`에 참여
- **체인지로그 자동화**: `/pr`이 커밋 타입 기반으로 CHANGELOG.md 자동 업데이트 및 package.json 버전 범프 (Semantic Versioning)

---

## 문제 해결

| 문제 | 해결 방법 |
|------|-----------|
| Plan 승인이 "pending"에서 멈춤 | `/dev [이름]`을 다시 실행하여 계획 흐름 재시작 |
| Auto-fix budget 소진 | lead-engineer가 3회 시도 후 중단. 에러를 직접 확인하고 가이드 제공. 수동 수정 후 budget 리셋하려면 PLAN.md에서 `Used:` 값을 `0`으로 변경 |
| 팀 모드 미동작 | `.claude/settings.json`에 `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` 설정 확인 |
| Spec validation이 파일 작성 차단 | 섹션 헤더가 예상 형식(영어 또는 한국어)과 일치하는지 확인 |
| 훅 에러가 매 파일 작성마다 발생 | `.claude/settings.json`에서 특정 훅 제거 또는 비활성화 |
| 계획 후 스펙 변경 | `/dev [이름]` 재실행 — 스펙 노후화를 감지하고 재계획 제안 |

---

## 기여

이슈와 PR을 환영합니다: [github.com/ByeongminLee/nextjs-claude-code](https://github.com/ByeongminLee/nextjs-claude-code)

버그 리포트나 기능 제안은 [이슈 페이지](https://github.com/ByeongminLee/nextjs-claude-code/issues)에서 받고 있습니다.

---

## 라이선스

MIT
