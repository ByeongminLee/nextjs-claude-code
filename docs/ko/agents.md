# Agent 역할

[← README로 돌아가기](README.md) | [English →](../en/agents.md)

---

## Core Agents (워크플로우)

| Agent | 역할 | 코드 수정 | 문서 수정 |
|-------|------|:---:|:---:|
| `init` | 코드베이스 분석, spec 문서 초안 | No | Yes |
| `spec-writer` | spec.md + design.md 작성 (TDD 시 TEST.md 포함) | No | Yes |
| `planner` | CONTEXT.md + PLAN.md 생성, 도메인 분석 + 태스크 태깅 | No | Yes |
| `lead-engineer` | fresh-context 서브에이전트로 구현 오케스트레이션. Wave 병렬 디스패치. | No (오케스트레이터) | 부분 |
| `verifier` | 4단계 검증 | No | No |

## 아이디에이션 Agents (/create)

| Agent | 역할 | 스킬 | 문서 수정 |
|-------|------|------|:---:|
| `create-orchestrator` | 5단계 파이프라인, C-suite 팀 오케스트레이션 | — | Yes (spec/create/) |
| `c-ceo` | 비전, 스코프, 수요 검증, 10-star thinking | investor-materials, investor-outreach | No |
| `c-cto` | 아키텍처, 실현 가능성, 기술부채, 보안 | architectures, vercel-react-best-practices | No |
| `c-cpo` | 유저 가치, 스토리, 성공 지표, UX | pm-product-strategy, brainstorming | No |
| `c-cmo` | 시장 포지셔닝, 메시징, 성장 잠재력 | marketing-psychology, copywriting | No |
| `c-cdo` | 디자인, 정보 아키텍처, AI slop 감지 | frontend-design, brainstorming | No |
| `brainstormer` | 소크라테스식 디자인 탐색, 2-3가지 접근법 | — | No |

## Reforge Agents (/reforge)

| Agent | 역할 | 코드 수정 | 문서 수정 |
|-------|------|:---:|:---:|
| `reforge-orchestrator` | 5단계 레거시→스펙 파이프라인 오케스트레이션 | No | Yes (spec/reforge/, spec/feature/) |
| `codebase-analyzer` | 레거시 코드베이스 심층 분석 (읽기 전용) | No | Yes (spec/reforge/[name]/) |
| `reforge-spec-generator` | 분석 기반 spec.md + design.md 생성 | No | Yes (spec/feature/) |

## Fresh-Context 서브에이전트 (/dev)

| Agent | 역할 | 모델 | 코드 수정 |
|-------|------|:---:|:---:|
| `task-executor` | [lead] 태스크 구현 (타입, 유틸, 훅, API) | sonnet | Yes |
| `task-spec-reviewer` | 태스크별 스펙 준수 + 코드 품질 리뷰 | haiku | No |
| `performance-optimizer` | Core Web Vitals 진단 | sonnet | No |

## Team Engineers (/dev --team)

| Agent | 역할 | 모델 | 코드 수정 |
|-------|------|:---:|:---:|
| `db-engineer` | 스키마, 마이그레이션, ORM, 쿼리, RLS | sonnet | Yes (DB만) |
| `ui-engineer` | 컴포넌트, 스타일링, 애니메이션, 반응형 | sonnet | Yes (UI만) |
| `worker-engineer` | 단순 유틸, 타입, 설정 (최대 200줄) | haiku | Yes (할당 파일) |

> **참고:** 팀 모드는 `.claude/settings.json`에 `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` 필요.

## Ops Agents

| Agent | 역할 | 코드 수정 | 문서 수정 |
|-------|------|:---:|:---:|
| `reviewer` | 스펙 준수 보고서 | No | No |
| `code-quality-reviewer` | 코드 품질 리뷰 | No | No |
| `tester` | 테스트 실행 + TEST.md | 테스트 파일만 | Yes |
| `browser-tester` | (실험) 브라우저 테스트 + Figma 비교 | No | No |
| `committer` | 커밋 메시지 자동 생성 | No | No |
| `pr-creator` | PR 생성 + changelog + 버전 범프 | CHANGELOG만 | Yes |
| `git-strategy-detector` | 브랜치 전략 + 템플릿 | No | Yes |
| `log-auditor` | 로깅 감사 및 수정 | fix 모드만 | No |
| `security-reviewer` | 보안 감사 (OWASP Top 10) | No | No |
| `loop` | REQ 강제 충족 | lead-engineer 경유 | 부분 |
| `status` | 프로젝트 상태 요약 | No | No |
| `debugger` | 버그 수정 | Yes | Yes |
| `rule-writer` | 코딩 규칙 관리 | No | Yes |
| `issue-reporter` | NCC 버그 제출 (데이터 자동 제거) | No | No |
