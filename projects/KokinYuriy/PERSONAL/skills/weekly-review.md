# Weekly review

Run the weekly sprint review: close the current week, extract lessons, plan the next.

## Required context (read before starting)

- Most recent file in `3-log/weekly/` — last week's goals
- Current quarterly OKRs in `3-log/goals/YYYY-Qn.md`
- Annual OKRs in `3-log/goals/YYYY-annual.md`
- Active project task dashboards: `2-projects/*/tasks.md`
- Files in `0-inbox/` — need triage
- Google Calendar data (optional — time breakdown by category)

## Step 1 — Review last week's goals

Open the previous weekly retro. For each of the 3 goals:
- Was it achieved? What was the result?
- If not — why? (blocked / deprioritized / underestimated)

## Step 2 — Capture what happened

Key events, achievements, and blockers this week. Facts, not feelings.
What moved the needle?

## Step 3 — Extract lessons

1–2 insights: what did you learn, what would you do differently.
Not a journal entry — keep it sharp.

## Step 4 — Analyze time (if GCal available)

Break down hours by category: product work, engineering, meetings, study, fitness, admin.

## Step 5 — Quarterly OKR check-in

Open current quarterly OKRs (`3-log/goals/YYYY-Qn.md`). For each KR:
- Update **Current** column with latest number/status.
- Estimate **Score** (0.0–1.0) based on progress to Target. Update the cell.
- If a KR hasn't moved for 2+ weeks — flag in Lessons, reconsider initiatives (not the KR itself).
- If mid-quarter review date has arrived — fill the Mid-quarter review section.

Save the updated quarterly file (update `updated:` field in frontmatter).

This is a ~5 min numeric update, not goal-setting. OKR are quarterly, we don't rewrite them weekly.

## Step 6 — Plan next week (SMART goals)

Set exactly 3 SMART goals for the upcoming week. SMART = Specific, Measurable, Achievable, Relevant, Time-bound (see [SMART note](../../1-knowledge/notes/smart-goals.md)).

For each goal:
- **Specific:** what exactly gets done, who is involved.
- **Measurable:** deliverable or metric that proves "done".
- **Achievable:** realistic in one week given time and resources.
- **Relevant:** connects to a specific KR in quarterly OKR (reference KR ID, e.g. "Q2 O1.KR1.1") or to a critical project task.
- **Time-bound:** deadline inside the week (not just "by end of week" — specify day).

Sources: KRs with low progress, unfinished goals from this week, overdue project tasks.

**Relation to OKR:** OKR = what matters this quarter (state-of-world goals). SMART weekly goals = tactical actions that move those KRs. Don't confuse levels.

## Step 7 — Create the retro file

Filename: `YYYY-Wnn.md`
Location: `3-log/weekly/`

Frontmatter:
```yaml
---
title: "Week {N} — {year}"
type: weekly
week: "{YYYY-Wnn}"
period: "{YYYY-MM-DD} / {YYYY-MM-DD}"
created: {YYYY-MM-DD}
goals_achieved: {n}
goals_total: 3
summary: "{One sentence: what defined this week}"
---
```

Body:
```markdown
# Week {N} — {year}

## Goals this week

1. [x] Goal — result
2. [ ] Goal — reason not done
3. [x] Goal — result

## What happened

Key events and achievements.

## Lessons

What I learned. What to do differently.

## Goals next week (SMART)

### 1. {Goal title}
- **Specific:** {what exactly, who}
- **Measurable:** {deliverable or metric}
- **Achievable:** {why realistic in one week}
- **Relevant:** drives Q{n} O{x}.KR{x.y} — {one-line why it matters}
- **Time-bound:** by {day} {time}

### 2. {Goal title}
- **Specific:** ...
- **Measurable:** ...
- **Achievable:** ...
- **Relevant:** drives Q{n} O{x}.KR{x.y}
- **Time-bound:** ...

### 3. {Goal title}
- **Specific:** ...
- **Measurable:** ...
- **Achievable:** ...
- **Relevant:** drives Q{n} O{x}.KR{x.y}
- **Time-bound:** ...

## GCal summary

- Product work: Xh
- Engineering: Xh
- Meetings: Xh
- Study: Xh
- Fitness: Xh
```

## Step 8 — Triage inbox

Go through every file in `0-inbox/`. For each:
- Move to correct location with proper format, OR
- Delete if no longer relevant.

Inbox must be empty (or near-empty) after this step.

## Step 9 — Scan active projects

Check `2-projects/*/tasks.md` for overdue or blocked tasks.
Flag anything urgent in the retro or carry into next week's goals.
