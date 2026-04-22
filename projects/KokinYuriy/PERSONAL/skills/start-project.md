# Start project

Scaffold a new project in `2-projects/`.

## Required input (ask if missing)

- Project name and one-sentence description
- Scope: `solo` or `team`
- If team: which teams to activate (hq always created)
- If team: current product stage (`discovery` / `delivery` / `scale`)
- If team: tech stack (for engineering CLAUDE.md)

## Step 1 — Create the project directory

Location: `2-projects/{project-name}/` (kebab-case)

## Step 2 — Create root files

**README.md** frontmatter:
```yaml
---
title: "{Project Name}"
type: project
scope: {solo|team}
status: active
started: {YYYY-MM-DD}
created: {YYYY-MM-DD}
summary: "{One sentence description}"
---
```
Body: what the project is, why it exists, target audience, current stage.

**tasks.md** — empty dashboard:
```yaml
---
title: "{Project Name} — Tasks"
type: tasks
project: "{project-name}"
created: {YYYY-MM-DD}
updated: {YYYY-MM-DD}
summary: "Current sprint and backlog"
---
```
Sections: `## Current sprint`, `## Backlog`, `## Done`

## Step 3 — For solo projects

Create `tasks/` and `notes/` directories. Done — skip to Step 7.

## Step 4 — For team projects: root CLAUDE.md

```markdown
# {Project} — Agent Context

## Project
{What this product/business is. Target audience. Current stage.}

## Tech stack
{Languages, frameworks, infrastructure}

## Rules for all agents
- Read your team CLAUDE.md before starting work
- Update tasks.md after completing any task
- Document decisions in specs/ as needed
```

## Step 5 — Create HQ (always for team projects)

```
hq/
├── README.md       — vision, mission, current stage
├── CLAUDE.md       — COO agent role
├── tasks.md        — strategic OKRs
├── tasks/
├── gtm-strategy.md
├── hadi-cycles.md
├── meetings/
└── notes/
```

**gtm-strategy.md** template:
```markdown
# GTM Strategy

## ICP (Ideal Customer Profile)
{Who is the target customer? Segment, size, pain.}

## Positioning
{How is this product different? What is the unique value?}

## Channels
{How will customers find this product?}

## Pricing
{Revenue model. Price points. Unit economics targets.}
```

**hadi-cycles.md** template:
```markdown
# HADI Cycles

## Active

### HADI-001: {Hypothesis}
- Stage: {discovery|delivery|scale}
- Team: {team}
- Hypothesis: "{Users need X because Y}"
- Action: {What we do to test}
- Data: {What we measure}
- Insights: {Filled after cycle}
- Status: active
- Next: {What to do based on results}
```

## Step 6 — Create team directories

For each selected team:
```
{team}/
├── README.md      — team charter: focus, priorities
├── CLAUDE.md      — agent job description
├── tasks.md       — team dashboard
├── tasks/
├── meetings/
├── specs/         — (product, engineering, marketing only)
└── notes/
```

Each team **CLAUDE.md** follows this structure:
- **Identity:** "{Role} for {project}. You manage {scope}."
- **Context:** paths to read (project README, team tasks, relevant playbooks)
- **Task:** responsibilities (3–5 bullet points)
- **Output:** what deliverables this agent produces and where
- **Constraints:** read/write access rules, quality standards

## Step 7 — Update indexes

Add the project to `2-projects/README.md` active projects list.
