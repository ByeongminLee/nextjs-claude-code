# NCC — nextjs-claude-code

> **NCC** — Next.js & React를 위한 Spec-Driven AI 개발 워크플로우. Claude Code 전용.
>
> 기능 단위로 명세를 정의하고, 정의한 대로 정확하게 구현합니다 — 모든 변경은 요구사항까지 추적됩니다.

[English →](../README.md)

---

## 주요 기능

- **Spec-Driven**: REQ-NNN 추적 가능한 feature spec, 준수 보고서
- **큐레이션 스킬** — skills.sh에서 설치 시 자동 업데이트, 번들 폴백. React, Next.js, UI/UX, 테스팅, 라이브러리별 best practices 포함
- **아키텍처 가이드** — Flat, Feature-Based, FSD, Monorepo (팀 규모별 권장)
- **라이브러리 인식 에이전트** — 선택한 스택에 맞춰 코드 작성
- **Next.js 네이티브** — App Router, Server Components, Server Actions, Pages Router
- **React 호환** — Vite 등 다른 React 셋업도 지원
- **Monorepo 지원** — Turborepo 워크스페이스 인식 설치
- **Claude Code 네이티브** — slash commands, agent 오케스트레이션, PostToolUse hooks

---

## 설치

**직접 설치** — [설치 가이드](installation.ko.md)

**For Claude Code** — 가이드를 가져와서 따라 실행:

```bash
curl -s https://raw.githubusercontent.com/ByeongminLee/nextjs-claude-code/main/docs/installation.md
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
- **속도보다 스펙 정확성.** spec-writer는 작성 전 모호한 점을 질문하고, executor는 확인된 계획을 따르며, verifier는 "파일이 있다"가 아니라 "동작한다"를 확인합니다.

### 누구를 위한 도구인가?

NCC는 **확정된 스펙을 기능 단위로 반복적으로 구현하고 추적하는 개발 방식**에 최적화되어 있습니다.

출시 후에도 계속 진화하는 기능을 다루는 팀을 위한 도구입니다. 결제 기능 하나가 기본 체크아웃 → 쿠폰 → 구독 → 프로모션으로 수개월에 걸쳐 발전할 때, 매 이터레이션마다 이전 스펙·디자인·구현 이력이 같은 위치에 누적되어 있어야 합니다.

---

## 워크플로우

```
/spec [이름] "기능 설명"   →  spec-writer가 질문 → spec.md + design.md 작성
/dev  [이름]               →  planner → executor → verifier → 완료
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
                         executor            ──→    소스 코드
                            │
                            ↓
                         verifier            ──→    (읽기 전용 검증)
                            │
                            ↓ (검증 통과 후)
                         executor            ──→    spec/feature/[이름]/history/
                                                     spec/STATE.md

/review [이름]      ──→  reviewer            ──→    (스펙 준수 보고서)
                         code-quality-       ──→    (코드 품질 보고서)
                         reviewer

/loop [이름]        ──→  loop               ──→    reviewer (REQ 체크)
                            │                        ↓ (실패 REQ 있으면)
                            ↓                       executor (타겟 수정)
                         (반복, 최대 5회)            ↓ (재검증)
                            ↓                       verifier (Level 1-3)
                         완료 또는 에스컬레이션      spec/feature/[이름]/history/

/status             ──→  status              ──→    (읽기 전용 보고서)

/debug "..."        ──→  debugger            ──→    spec/DEBUG.md
                                                     spec/STATE.md

/rule "..."         ──→  rule-writer         ──→    spec/rules/[주제].md
```

## Agent 역할 분리

| Agent                  | 역할                                 | 코드 수정 | 문서 수정             |
| ---------------------- | ------------------------------------ | --------- | --------------------- |
| `init`                 | 코드베이스 분석, spec 문서 초안 작성 | No        | Yes                   |
| `spec-writer`          | spec.md + design.md 작성             | No        | Yes                   |
| `planner`              | CONTEXT.md + PLAN.md 생성            | No        | Yes                   |
| `executor`             | 구현                                 | Yes       | 부분 (STATE, history) |
| `verifier`             | 4단계 검증                           | No        | No                    |
| `reviewer`             | 스펙 준수 보고서                     | No        | No                    |
| `code-quality-reviewer`| 코드 품질 리뷰                       | No        | No                    |
| `status`               | 프로젝트 상태 요약                   | No        | No                    |
| `debugger`             | 버그 수정                            | Yes       | Yes (DEBUG.md)        |
| `rule-writer`          | 프로젝트 코딩 규칙 관리              | No        | Yes (spec/rules/)     |
| `loop`                 | REQ 강제 충족 루프                   | Yes (executor 경유) | 부분 (STATE, history) |

---

## 안전 장치

### Checkpoints

executor가 아래 조건에서 반드시 멈추고 사용자 확인을 받습니다:

| 타입                      | 조건                                | 동작                            |
| ------------------------- | ----------------------------------- | ------------------------------- |
| `checkpoint:decision`     | 구현 방향 선택 필요, 타입 구조 변경 | 선택지 제시 후 대기             |
| `checkpoint:human-verify` | UI 구현 완료                        | 브라우저 확인 요청 후 대기      |
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
| 2b   | 테스트 파일이 존재하는가 | `testing: required`이면 차단, 아니면 경고만 |
| 3    | 컴포넌트/훅/API가 실제로 연결됐는가 | import, 호출 추적          |
| 4    | 실제로 동작하는가                   | 브라우저 직접 확인         |

### Resume Protocol

`/dev`가 중단되면 (세션 크래시, 타임아웃, 컨텍스트 한계) 다시 `/dev`를 실행하면 중단된 지점부터 재개합니다:

- `spec/STATE.md`가 각 feature의 phase를 독립적으로 추적: `idle` → `planning` → `executing` → `verifying` → `idle` (또는 `/loop` 실행 중에는 `looping`)
- `/dev`는 해당 feature의 phase를 읽고 처음부터 재시작하지 않고 적절한 에이전트로 라우팅
- `spec/feature/[이름]/PLAN.md`에서 완료된 태스크 (`- [x]`)는 재개 시 건너뜀
- Auto-fix budget (`Used: N`)은 세션 간 유지
- spec.md가 PLAN.md 생성 이후 수정되었으면 경고 후 재계획 제안
- **모델 라우팅**: 기본 sonnet, 작은/기계적 작업(verifier, cleanup, 단순 수정)은 haiku. Opus는 사용하지 않음. 기준은 `spec/RULE.md` Model Routing 참조

| Phase | `/dev` 재개 시 동작 |
|---|---|
| `idle` | 처음부터 시작 → planner |
| `planning` | feature의 PLAN.md 상태 확인 → 계획 재개 또는 executor로 이동 |
| `executing` | 완료된 태스크 건너뜀 → 첫 `- [ ]`부터 계속 |
| `verifying` | executor를 통해 verifier 재실행 |
| `looping` | LOOP_NOTES.md 읽어 현재 iteration부터 재개 |

---

## 기여

이슈와 PR을 환영합니다.

---

## 라이선스

MIT
