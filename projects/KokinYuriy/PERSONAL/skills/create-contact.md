# Create contact

Add a person to the personal CRM in `1-knowledge/contacts/`.

## Rules

- One file = one person. Check for duplicates before creating.
- `met:` = when first interacted, not file creation date.
- Leave unknown fields empty — do not guess.
- `summary:` is the primary search target: "{role} at {company}, {expertise}"

## Step 1 — Check for duplicates

Search `1-knowledge/contacts/` for the person's name. If file exists — update it.

## Step 2 — Create the file

Filename: `{firstname-lastname}.md` in kebab-case.
Location: `1-knowledge/contacts/`

Frontmatter:
```yaml
---
title: "{Full Name}"
type: contact
company: "{Company}"
role: "{Role}"
met: {YYYY-MM-DD}
created: {YYYY-MM-DD}
phone: "{if known}"
telegram: "{if known}"
email: "{if known}"
linkedin: "{if known}"
summary: "{Role} at {Company}, {key expertise or relationship context}"
---
```

## Step 3 — Write the body

```markdown
# {Name}

## Context

How we met, what connects us. 1–2 sentences.

## Expertise and interests

What this person knows. What I can ask them about.
What value I can provide to them.

## Key interactions

- YYYY-MM-DD — what we discussed, outcomes

## Open topics

Things to discuss next time.
```
