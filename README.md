# CourseGuide AI

An instructor-controlled course assistant prototype that answers student questions using approved course materials, cites every material claim, and escalates questions it cannot answer safely.

## Run locally

This prototype has no build step. Open `index.html` directly, or serve the folder with any static web server.

```bash
python -m http.server 4173
```

Then visit `http://localhost:4173`.

## Included interactions

- Course-specific suggested questions
- Grounded sample answers with source citations
- Citation previews that open the relevant source location
- Student-visible course materials with authority and visibility metadata
- Saved answers that retain their supporting source
- Safe escalation for personal exceptions and unsupported questions
- Save, copy, and feedback controls
- Instructor Test Console for ANSWER, RESTRICTED, and CONFLICT states
- Applied-policy and retrieved-evidence diagnostics
- Responsive desktop and mobile layouts

## Prototype scope

This repository is a polished, dependency-free product prototype. Its course content and responses are representative fixtures so the complete student and instructor safety flows can be evaluated before a backend is introduced.

## Production roadmap

A production version would add instructor authentication, course/material management, document ingestion and retrieval, student access codes, analytics, and an escalation inbox. Supabase is a suitable option for authentication, PostgreSQL/pgvector storage, row-level security, and event logging when those features are introduced.
