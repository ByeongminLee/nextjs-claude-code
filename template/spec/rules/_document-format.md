# Document Format Rules

> **Immutable.** Read when writing spec.md, design.md, or history entries.

## Writing Rules

Both `spec.md` and `design.md` must follow these rules:
- Both files must begin with YAML frontmatter (`---`)
- No inline formatting in document body: `**bold**`, `_italic_`, `` `code` ``, `~~strikethrough~~` are prohibited
- Requirements use `REQ-NNN: statement` format — no bullet prefix, one declarative statement per line
- All content must be declarative — no prose, no explanatory sentences
- Prose is only allowed in `## Purpose`, limited to 1-3 sentences

## spec.md

Frontmatter (required):
```yaml
---
feature: [name]
deps: [feature-name, ...]   # features this spec depends on; [] if none
api: [METHOD /path, ...]    # API endpoints; omit if none
testing: none                # none | optional | required
---
```

`testing` field values:
- `required`: lead-engineer writes tests; verifier Level 2b blocks if missing
- `optional`: skip test phase; verifier Level 2b warns but does not block
- `none`: no test expectations
- Default if omitted: `none`

`max-iterations` field (optional):
- Controls `/loop` max iteration count. Default: 5 if omitted.

Sections (required):
```
## Purpose
## Requirements
## Behaviors
## Out of Scope
```

## design.md

Frontmatter (required):
```yaml
---
feature: [name]
figma: "url or empty string"   # "" if UI but no Figma; "N/A" if backend
---
```

Sections (required):
```
## Components
## State
## Data Flow
## Technical Decisions
```

- All sections are required; write `N/A` if not applicable
- Section headers must match exactly (English) or accepted Korean equivalents

## History Entry Format

History entries in `spec/feature/[name]/history/` are validated by PostToolUse hook.
Written **only after verification passes** (all 4 levels).

Required:
- **Filename**: `YYYY-MM-DD-[description].md`
- **Top-level heading**: `# [Change description]`
- **Date field**: `Date: YYYY-MM-DD`
- **Required sections**: `## Reason`, `## Changes`, `## Files Modified`
- **Optional section**: `## Figma`
