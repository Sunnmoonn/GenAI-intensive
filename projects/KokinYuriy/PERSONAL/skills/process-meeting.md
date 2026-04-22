# Process meeting

Convert a meeting transcript or recording into a structured meeting note.

## Rules

- Personal meetings (mentor, investor, networking) → `3-log/meetings/`
- Project meetings (team syncs, standups) → `2-projects/{project}/{team}/meetings/`
- Never mix the two types in the same file.
- If speakers cannot be identified — mark as `[Speaker?]`, do not guess.
- Keep meeting note language matching the transcript language.

## Step 1 — Get the transcript

- If `.txt` transcript exists — use it directly.
- If only `.mp3` — transcribe first (MacWhisper or whisper.cpp). Store transcript alongside audio with the same filename.

## Step 2 — Determine meeting type

Ask if unclear. Default rule: if a project name is mentioned → project meeting.

## Step 3 — Extract from transcript

- **Summary:** 2–3 sentences. What was the meeting about? What was the outcome?
- **Key decisions** (project) or **Key takeaways** (personal): bullet list.
- **Action items:** `- [ ] Action @person — due YYYY-MM-DD`
- **Open questions:** unresolved topics for next meeting.

If no decisions found → write "No decisions recorded" (do not omit section).
If no action items → write "None identified".

## Step 4 — Create the meeting note

Filename: `YYYY-MM-DD-{topic}.md`

**Personal meeting frontmatter:**
```yaml
---
title: "{Meeting title}"
type: meeting
date: {YYYY-MM-DD}
created: {YYYY-MM-DD}
participants:
  - "Name 1"
  - "Name 2"
recording: "../../_assets/recordings/{filename}.mp3"
summary: "{2–3 sentence summary}"
---
```

**Project meeting frontmatter** (adds `team:` and `project:`):
```yaml
---
title: "{Project — Team Sync}"
type: meeting
date: {YYYY-MM-DD}
created: {YYYY-MM-DD}
team: {engineering|product|design|marketing|sales|finance|hq}
participants:
  - "Name 1"
  - "Name 2"
project: "{project-name}"
recording: "../../_assets/recordings/{filename}.mp3"
summary: "{2–3 sentence summary}"
---
```

**Body:**
```markdown
# {Meeting title}

## Summary

2–3 sentences.

## Key decisions  ← or "Key takeaways" for personal meetings

- Decision or insight 1
- Decision or insight 2

## Action items

- [ ] Action @person — due YYYY-MM-DD

## Open questions

- Question for next meeting
```

## Step 5 — Update task tracking

For each action item:
- If simple (one-liner, <1 day) → add to relevant `tasks.md` dashboard.
- If complex (multi-day, needs resources) → create SMART task file in `tasks/`.

## Step 6 — File the recording

Audio stays in `_assets/recordings/`. Never move or copy. Link via `recording:` in frontmatter.
