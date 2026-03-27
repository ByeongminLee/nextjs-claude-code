# NCC — nextjs-claude-code

> Spec-Driven AI Development — 단 두 개의 명령어로 정의하고 빌드합니다.

기능을 정의하고, Claude가 정의한 대로 정확하게 만듭니다. 모든 변경은 요구사항까지 추적됩니다.

```
/spec auth "이메일 로그인"  →  spec.md + design.md
/dev auth                  →  계획 → 구현 → 검증 → 완료
```

[English →](../../README.md)

---

## 두 개의 명령어면 충분합니다.

### 명세 & 개발 — `/spec` + `/dev`

핵심 워크플로우. 무엇을 만들지 정의하고, 정의한 대로 정확하게 만듭니다.

```bash
/spec auth "이메일 + OAuth 로그인"   # spec-writer → spec.md + design.md
/dev auth                           # planner → lead-engineer → verifier → 완료
/dev auth --team                    # 병렬 팀 (db/ui 엔지니어)
/loop auth                          # 리뷰 → 수정 → 재검증 → 모든 REQ 통과까지
```

### 아이디어가 없다면? → `/create`

원시 아이디어를 검증된 제품 컨셉으로. 7개의 핵심 질문이 사고를 날카롭게 만듭니다 — 그리고 가상의 C-suite(CEO, CTO, CPO, CMO, CDO)가 **팀으로 토론**하며 spec을 쓰기 전에 맹점을 잡아냅니다. [상세 →](create-workflow.md)

```bash
/create "냉장고 사진으로 레시피를 추천하는 AI 앱"
# → 7개 핵심 질문 → 3가지 접근법 → C-suite 팀 토론
# → VISION.md + C-REVIEW.md + DECISION.md → /spec으로 변환
```

### 레거시 프로젝트가 있다면? → `/reforge`

기존 코드베이스를 spec-driven 개발로 전환합니다. 레거시 코드를 분석하고, 변경 명세를 받아, 기존 로직과 요청된 수정을 결합한 feature spec을 생성합니다.

```bash
/reforge ./_legacy/old-project "App Router로 전환, Tailwind 추가"
# → 분석 → 변경 명세 → 델타 → 스펙 생성 → 검증
# → feature별 spec.md + design.md → /dev [feature]
```

### 운영 — 리뷰, 테스트, 배포

독립 실행 가능한 품질/보안/배포 명령어. [전체 명령어 →](commands.md)

```bash
/review auth      # 스펙 준수 + 코드 품질
/security --audit # OWASP Top 10 프로젝트 전체 스캔
/commit auth      # REQ 연결된 커밋 메시지 자동 생성
/pr auth          # 스펙 기반 PR 생성
```

---

## 빠른 시작

```bash
npx nextjs-claude-code@latest     # SDD 워크플로우 설치
/init                              # 코드베이스 분석, spec 문서 생성
/spec auth "이메일 로그인"           # feature spec 정의
/dev auth                          # 구현
```

**사전 요구사항**: Node.js >= 18, [Claude Code](https://claude.ai/claude-code)

**설치 가이드**: [직접 설치](installation.md) | Claude Code: `curl -s https://raw.githubusercontent.com/ByeongminLee/nextjs-claude-code/main/docs/ko/installation.md`

---

## 왜 Spec-Driven인가?

기능은 한 번에 완성되지 않습니다. 결제를 기본 체크아웃으로 출시하고, 한 달 후 쿠폰, 그 다음 구독, 프로모션을 추가합니다. 매번 이전에 무엇을 만들었는지를 알아야 합니다.

- **변경 단위가 아니라 기능 단위.** 각 기능은 `spec/feature/[이름]/`에 고정 위치를 가집니다.
- **점진적 개발.** 스펙, 디자인, 구현 이력이 함께 누적됩니다.
- **속도보다 정확성.** spec-writer는 질문 먼저, lead-engineer는 확인된 계획을 따르고, verifier는 "동작한다"를 확인합니다.

---

## 주요 기능

- **Spec-Driven**: REQ-NNN 추적, 준수 보고서
- **TDD 기본**: MSW API 목킹, 테스트 우선
- **큐레이션 스킬** — [skills.sh](https://skills.sh)에서 core 번들 + 라이브러리별 on-demand
- **아키텍처 가이드** — Flat, Feature-Based, FSD, Monorepo (자동 감지)
- **C-레벨 아이디에이션** — `/create`로 CEO/CTO/CPO/CMO/CDO 리뷰 파이프라인
- **레거시 Reforge** — `/reforge`로 기존 프로젝트를 spec-driven 개발로 전환
- **Next.js + React** — App Router, Server Components, Pages Router, Vite
- **Wave 실행** — 의존성 기반 병렬 디스패치
- **멀티 에이전트 팀** — `--team` 모드로 db/ui/worker 엔지니어
- **Hook profiles** — `minimal` / `standard` / `strict` 강도 조절
- **Context 최적화** — repo profiler, compact recovery, artifact size limits

---

## 워크플로우

```
사용자                    Claude Agents              파일
────                      ─────────────              ─────
/create "아이디어"   ──→  create-orchestrator ──→    spec/create/[이름]/VISION.md
                         c-ceo/cto/cpo/cmo/cdo     spec/create/[이름]/C-REVIEW.md
                                                   spec/create/[이름]/DECISION.md

/reforge [경로]     ──→  reforge-orchestrator──→    spec/reforge/[이름]/ANALYSIS.md
  "변경사항"              codebase-analyzer          spec/reforge/[이름]/DELTA.md
                         reforge-spec-gen    ──→    spec/feature/[이름]/spec.md + design.md

/spec [이름] "..."  ──→  spec-writer        ──→    spec/feature/[이름]/spec.md
                                                   spec/feature/[이름]/design.md

/dev [이름]         ──→  planner            ──→    spec/feature/[이름]/PLAN.md
                            ↓ (사용자 확인 후)
                         lead-engineer      ──→    소스 코드
                            ↓ (--team: db/ui/worker)
                         verifier           ──→    검증 보고서
                            ↓
                         completion          ──→    spec/STATE.md + history/
```

---

## 안전 장치

| 기능 | 설명 |
|------|------|
| Checkpoints | `decision` (방향 선택), `human-verify` (UI 확인), `auth-gate` (결제/인증) |
| Auto-fix budget | 모드별 3회 재시도 후 에스컬레이션 |
| 검증 | 5단계: 파일 존재 → stub 없음 → 테스트/목 존재 → 연결 확인 → 브라우저 테스트 → 사용자 확인 |
| Resume protocol | `/dev` 재실행 시 중단점부터 재개 (phase 인식) |
| Hook profiles | `minimal` (보안만) → `standard` → `strict` (전체 가드) |
| 토큰 격리 | `/create` 문서는 `spec/create/`, `/reforge` 문서는 `spec/reforge/`에 저장 — `/spec`이나 `/dev`에서 로드 안 됨 |

---

## 상세 문서

- [전체 명령어](commands.md) — 옵션 포함 명령어 목록
- [Agent 역할](agents.md) — 권한 매트릭스 포함
- [/create 워크플로우](create-workflow.md) — 아이디에이션 파이프라인 상세
- [설치 가이드](installation.md) — 설정 방법

---

## 문제 해결

| 문제 | 해결 |
|------|------|
| Plan 승인 멈춤 | `/dev [이름]` 재실행 |
| Auto-fix budget 소진 | PLAN.md에서 `Used: 0`으로 수정 |
| 팀 모드 미동작 | settings에서 `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` 확인 |
| 훅 에러 | `NCC_HOOK_PROFILE=minimal` 설정 |

---

## References

NCC는 [GSD](https://github.com/gsd-build/get-shit-done), [gstack](https://github.com/garrytan/gstack), [Everything Claude Code](https://github.com/affaan-m/everything-claude-code), [Oh My OpenAgent](https://github.com/code-yeongyu/oh-my-openagent), [Superpowers](https://github.com/obra/superpowers), [Vercel Plugin](https://github.com/vercel/vercel-plugin), [Spec Kit](https://github.com/github/spec-kit), [OpenSpec](https://github.com/Fission-AI/OpenSpec)의 검증된 패턴을 통합했습니다.

---

## 기여

이슈와 PR: [github.com/ByeongminLee/nextjs-claude-code](https://github.com/ByeongminLee/nextjs-claude-code)

---

## 라이선스

MIT
