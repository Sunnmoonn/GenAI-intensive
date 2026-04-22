# Create playbook

Create a step-by-step executable instruction in `1-knowledge/playbooks/`.

Playbooks are written for humans — hired operators, contractors, team members.
For Claude-executable automations, use commands in `.claude/commands/`.

## Rules

- One playbook = one process. If it does two things — split it.
- All four RIPO sections are mandatory: Role, Input, Process, Output.
- Process steps must be numbered and specific — "research the market" is too vague.
- Status starts as `draft` until the playbook is tested once end-to-end.

## Step 1 — Define scope

Answer: "After following this playbook, what will the executor have produced?"
If you cannot answer in one sentence — scope is too broad.

## Step 2 — Choose domain prefix

Filename: `{domain}-{action}.md`

| Prefix | Domain |
|---|---|
| `product-` | Product management, discovery, delivery |
| `marketing-` | Marketing, content, growth |
| `startup-` | Fundraising, MVP, team ops |
| `blockchain-` | Blockchain, DeFi, stablecoins |
| `engineering-` | Code, architecture, DevOps |
| `sales-` | Sales, outreach, partnerships |
| `finance-` | Budget, unit economics |
| `workflow-` | Vault processes |

New domain only when 3+ playbooks justify it. Use closest existing prefix until then.

## Step 3 — Find theoretical foundation

Search `1-knowledge/notes/` for related concepts. These become `based_on:` links.
The playbook references theory — does not repeat it.

## Step 4 — Write the playbook

Location: `1-knowledge/playbooks/`

Frontmatter:
```yaml
---
title: "{Action Title}"
type: playbook
status: draft
created: {YYYY-MM-DD}
based_on:
  - "../notes/{related-note}.md"
summary: "{One sentence: what this enables you to do}"
---
```

Body structure (RIPO — all sections required):

```markdown
# {title}

## Role

Who executes this. What expertise is expected. What permissions/access are needed.

## Input

What data, context, or resources are required before starting:
- Specific files or documents needed
- Access to tools or services
- Decisions that must be made beforehand

## Output

What the result must look like (define BEFORE Process):
- Format and structure
- Quality criteria
- Where to save it

## Process

### 1. First step
Specific enough to execute without asking questions.

### 2. Second step
Include if/then for edge cases. Inline templates where helpful.

## Example

One concrete input → output showing the EXACT format expected.

## Constraints

What NOT to do. Edge cases. What to do when data is missing.

## Related

- [Relevant Note](../notes/example.md) — theoretical foundation
- [Next Playbook](./domain-next-step.md) — what to do after this
```

## Step 5 — Connect to MOC

Add link to relevant MOC in `1-knowledge/mocs/` with annotation.
If creating the playbook reveals a knowledge gap — mark it as Missing in the MOC.
