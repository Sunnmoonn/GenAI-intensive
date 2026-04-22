# Create note

Create an atomic knowledge note in `1-knowledge/notes/`.

## Rules

- One note = one theme. If material covers multiple concepts — create separate notes for each.
- Check for duplicates first: search `1-knowledge/notes/` by keyword. If note exists — update it, don't duplicate.
- Distill, do not copy-paste. Rewrite in structured form.
- Target length: 200–1000 words.

## Step 1 — Define the topic

Ask: "Can I explain what this note is about in one sentence?" If not — split into multiple notes.

## Step 2 — Create the file

Location: `1-knowledge/notes/`
Filename: `{topic-in-kebab-case}.md` — lowercase, hyphens only, matches the title field.

Frontmatter:
```yaml
---
title: "{Human-readable title}"
type: note
created: {YYYY-MM-DD}
sources:
  - "{path to _assets/ or URL}"
summary: "{One sentence: what this is and why it matters}"
---
```

## Step 3 — Write the body

```markdown
# {title}

One-paragraph summary of what this concept is and why it matters.

## Core idea

Main explanation in 2–4 paragraphs.

## How it works

Details, mechanics, frameworks. Tables for comparisons, numbered lists for processes.

## Application

When and how to apply this. Real examples preferred.

## Sources

- [Source Name](path) — what it contributed
```

## Step 4 — Connect to MOC

Find the relevant MOC in `1-knowledge/mocs/`. Add a link with annotation:
```markdown
- [Note Title](../notes/note-name.md) — one-line description
```

If no relevant MOC exists — flag it as a gap or create a new MOC.
