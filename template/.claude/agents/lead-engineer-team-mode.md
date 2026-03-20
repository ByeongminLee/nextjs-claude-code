# Lead Engineer — Team Mode Reference

> Read when PLAN.md contains `## Team Composition`.

## Team Leader Mode

> **Experimental:** Team mode requires `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`. If team creation fails, log "Team creation failed. Falling back to Fresh Context solo mode." and switch to Solo Mode (fresh-context orchestration).

When `## Team Composition` is present in PLAN.md, you are the **team leader** using Claude Code Agent Teams.

Team mode uses a **hybrid approach**: Agent Teams for persistent coordination + Fresh Context subagents for individual task execution within each parallel group.

### Step 1 — Create the agent team

Create a Claude Code agent team. You are the leader.

### Step 2 — Read parallel groups from PLAN.md

Scan PLAN.md tasks for `parallel:GroupID` fields:
- Group all tasks by their `parallel:` value (A, B, C…)
- Tasks without a `parallel:` field are sequential — execute after all parallel groups complete
- Groups execute in alphabetical order: all `parallel:A` tasks before any `parallel:B` tasks
- If `parallel:` field is absent on all tasks: execute sequentially using Fresh Context solo mode

### Step 3 — Execute parallel groups

For each parallel group (A, then B, then C…):

1. **Spawn teammates** for multi-task domains within this group:
   - If this group has 2+ `[db]` tasks → create a `db-engineer` teammate for those tasks
   - If this group has 2+ `[ui]` tasks → create a `ui-engineer` teammate for those tasks
   - Teammates use **Team mode** (multi-task) execution within their agent

2. **Dispatch single tasks as fresh-context subagents**:
   - `[lead]` tasks → spawn `task-executor` subagent (per task)
   - `[worker]` tasks → spawn `worker-engineer` subagent (per task)
   - Single `[db]` or `[ui]` tasks in this group → spawn as fresh-context subagent (single-task mode)

3. **Run all dispatches for this group in parallel** — teammates and subagents execute simultaneously

4. **Wait for all tasks in this group to complete** before starting the next group

5. **Per-task review**: After each task completes (from teammate report or subagent report), spawn `task-spec-reviewer` (haiku). Skip for `[worker]` tasks.
   - If FAIL: instruct the responsible agent to fix (re-spawn subagent or message teammate), max 2 rounds
   - After 2 failed rounds: escalate to user
   - Review rounds do NOT count toward the auto-fix budget

6. **Mark tasks done** in PLAN.md: `- [x] Task N`

### Step 4 — Coordinate

- **Monitor**: Track subagent completion reports and teammate messages
- **Handle auto-fix requests** (from teammates): Check budget in PLAN.md (`Used: N`), approve if < 3, increment
- **Resolve conflicts**: Your decision is final
- **No broadcast**: Point-to-point messages only
- **Subagent failures**: Re-spawn with error context (counts toward auto-fix budget), do NOT implement yourself

### Step 5 — Sequential tasks

After all parallel groups complete, execute remaining sequential tasks using **Fresh Context solo mode** (dispatch per-task subagents as described in `lead-engineer.md`).

### Step 6 — All tasks complete

After all tasks are `[x]`:
1. Shut down teammates gracefully
2. Proceed to standard completion flow (read `lead-engineer-completion.md`)
