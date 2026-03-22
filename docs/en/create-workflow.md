# /create — Ideation to Validation Pipeline

> Go from a raw idea to a validated, C-level-reviewed product concept — in one command.

[한국어 →](../ko/create-workflow.md)

---

## When to Use

| Scenario | Command |
|----------|---------|
| **No plan at all** — starting from scratch | `/create "my idea"` |
| **Major new feature** — need validation before investing | `/create "add payments"` |
| **Already have a spec** — quick design exploration | `/brainstorm "feature"` |
`/create` is the **earliest stage** — before `/spec`, before `/dev`. Once you have a validated concept, convert it to a spec and build.

---

## Pipeline: 5 Phases

```
Phase 1: Context       Read project state (if existing project)
    ↓
Phase 2: Questions      6 forcing questions (one at a time, your language)
    ↓
Phase 3: Approaches     2-3 alternatives with trade-offs → you choose
    ↓
Phase 4: C-Level Review CEO → CTO → CPO → CMO sequential review
    ↓
Phase 5: Decision       VISION + REVIEW + DECISION docs → optional spec conversion
```

### Phase 1: Context Gathering

- Reads `spec/PROJECT.md` and `spec/ARCHITECTURE.md` (if they exist)
- Scans `spec/feature/` for existing features
- Detects your language from the description

### Phase 2: Forcing Questions

Six questions that expose demand reality and constraints. Asked **one at a time** in your language:

1. **Demand reality** — Who has this problem? How do they solve it now?
2. **Premise challenge** — What happens if we do nothing?
3. **Target user** — Who specifically? What's their workflow?
4. **Success criteria** — What metric moves if this works?
5. **Constraints** — What can't change?
6. **10-star experience** — What does perfection look like?

Skip any question you've already answered. Say "just do it" to fast-track.

### Phase 3: Approach Generation

Always generates 2-3 alternatives:

- **Minimal Viable** — fastest to ship, smallest scope
- **Ideal Architecture** — best long-term design
- **Creative/Lateral** — unexpected reframing (optional)

Each includes: effort, risk, pros, cons, and "fits when" condition.

### Phase 4: C-Suite Team Review

Five specialists evaluate your concept **in parallel**, then debate disagreements:

| Role | Focus | Skills |
|------|-------|--------|
| **CEO** | Vision, scope, demand, resource allocation | investor-materials, investor-outreach |
| **CTO** | Architecture, feasibility, tech debt, security | architectures, vercel-react-best-practices |
| **CPO** | User value, stories, metrics, UX | pm-product-strategy, brainstorming |
| **CMO** | Positioning, competition, messaging, growth | marketing-psychology, copywriting |
| **CDO** | Design, information architecture, accessibility | frontend-design, brainstorming |

**Round 1**: All 5 review independently (parallel). Each returns **APPROVE**, **CONCERN**, or **BLOCK**.
**Round 2** (conditional): If any BLOCK or contradicting opinions → relevant agents debate with opposing views shared.

### Phase 5: Decision & Spec Conversion

After review, you get three documents in `spec/create/[name]/`:
- `VISION.md` — problem, demand, target user, value prop
- `C-REVIEW.md` — all 5 C-suite assessments + debate summary
- `DECISION.md` — chosen approach, key decisions, constraints

Then choose: **Convert to spec?**
- **Yes** → get a ready-to-paste `/spec` command
- **No** → documents saved for future reference

---

## Output Documents

All documents are written to `spec/create/[name]/` — completely isolated from `spec/feature/`.

| Document | Max Lines | Contains |
|----------|-----------|---------|
| VISION.md | 80 | Problem, Demand, Target User, Value Prop, Success Criteria |
| C-REVIEW.md | 100 | CEO/CTO/CPO/CMO/CDO assessments with verdicts and risks |
| DECISION.md | 60 | Chosen approach, key decisions, constraints, spec status |

---

## Token Isolation

`/create` documents are **never loaded** by other commands:
- `/spec` reads `spec/feature/[name]/` only
- `/dev` reads `spec/feature/[name]/` only
- `/init` scans `spec/` top-level only

This means `/create` adds **zero token cost** to your regular development workflow.

---

## Spec Conversion

When you choose to convert, `/create` outputs:

```
/spec [name] "[problem + approach + constraints summary]"
```

Paste this into Claude Code. The spec-writer builds from your summary — it does NOT auto-read `spec/create/` files.

This keeps the boundary clean: `/create` is ideation, `/spec` is specification.

---

## Examples

### New project from scratch:
```
/create "AI-powered recipe app that suggests meals based on what's in your fridge"
```

### New feature on existing project:
```
/create "add real-time collaboration to the document editor"
```

### After validation:
```
/spec recipe-app "AI recipe suggestions from fridge inventory. Minimal approach: image recognition + recipe DB lookup. Constraint: must work offline."
```

---

## FAQ

**Q: Do I need to run /init before /create?**
No. `/create` works on greenfield projects too. If `spec/PROJECT.md` exists, it uses the context; if not, it proceeds without it.

**Q: Can I skip the C-level review?**
Not currently — the review is part of the pipeline. But each review is concise (15 lines max), so it adds minimal time.

**Q: What if a C-level reviewer BLOCKs my idea?**
You'll see the concern highlighted. You can address it, modify your approach, or proceed anyway. BLOCKs are advisory, not gates.

**Q: Does /create affect my /spec or /dev workflow?**
No. Token isolation ensures zero impact. `/create` writes to `spec/create/`, which is never read by other commands.

**Q: Can I re-run /create on the same concept?**
Yes. It will overwrite the existing `spec/create/[name]/` documents.
