# Angkor Academy — course platform

Public catalogue with English (violet) and Software Development / AI (blue and cyan). Sign in with Google or email/password using Neon Auth. Registration collects name, email, password and confirmation; only the identity provider stores the password hash. Confirmation is never persisted.

The new engineering course stores its 24 sessions, eight-stage outline and server-only assessment definitions in Postgres. Student enrollments, draft answers, practical work, reflections, grades, reinforcement topics and teacher reviews are durable. English keeps its existing attempts and progression; its teaching content is also seeded into the course catalogue.

`migrations/002_course_hub.sql` and `scripts/migrateCourseHub.js` are additive. Test against a temporary Neon branch before applying to production. Use a direct connection with `ACADEMY_ENV_FILE=/path/to/env node scripts/migrateCourseHub.js`. An optional `ACADEMY_OWNER_EMAIL` grants instructor access only to an already registered matching learner. Never put secrets in committed files.

Engineering progression requires at least 85%, no critical mistakes and approval of the practical explanation by another authorized teacher. A correct quiz or a long text does not automatically prove comprehension. Self-review is denied. Instructors can add another registered teacher and see the latest 100 enrolled learners, their progress and the pending review queue. Open the development course and choose “Revisiones docentes”. News is editorially verified as of 2026-11-18, not an automatic daily news feed. This is an authored course, not a live LLM tutor or arbitrary-code runner.

Validation: `npm test`, `npm run build`, and `ACADEMY_ENV_FILE=/path/to/test-branch.env node scripts/checkCourseHub.js`. The integration test uses synthetic records and removes them. To preview against a test branch: `ACADEMY_ENV_FILE=/path/to/test-branch.env node scripts/devCourseHub.js` (ports 3003 and 3104).

## Run and validate

- `npm install`
- `npm run dev` starts the frontend. Use `vercel dev` for the frontend plus API routes.
- `npm test` checks authorization, grading, level gates, retention and assessment content.
- `npm run build` creates production assets.
- `npm run db:migrate` applies the additive migration from `migrations/001_academy.sql`.

Server environment: `DATABASE_URL`, `NEON_AUTH_BASE_URL` (the public Neon Auth base URL). No database credentials belong in `VITE_*` variables. Values are not committed. For a separate env file, use `ACADEMY_ENV_FILE=/path/to/file npm run db:migrate`.

In Neon, allow `https://angkor-academy.vercel.app` (no trailing slash) on the branch serving production, and configure the production Google OAuth client. The callback registered in Google must be `${NEON_AUTH_BASE_URL}/callback/google`. Google authenticates through the official Neon SDK. The API validates the JWT signature, expiration, issuer and audience against the Neon JWKS; user IDs never come from request bodies.

## Progress policy

All attempts are stored under `academy` (separate from the old electricity tables). Answers and scoring remain server-side. Each attempt belongs to a verified learner, expires after two hours, and can be submitted only once (repeated submissions return the saved result). A per-user database lock serializes starts and submissions. Only one pending attempt per learner exists; opening a different exercise replaces the unfinished attempt.

To unlock the next stage:

1. Pass every lesson practice (80% overall, 75% per assessed skill).
2. Pass the stage exam (85% overall, 75% per skill).
3. After at least 24 hours, pass a separate retention form (same exam thresholds).
4. Failed exam/review attempts require a 15-minute pause.

A1 has 40 lessons in 10 sequential units and a 40-question exam/review sampled across every unit and skill. It additionally requires at least 75% in each A1 unit. Earlier eight-question A1 demo assessments cannot unlock A2. A2–C2 retain their introductory two-lesson stages; those small forms contain two items per skill and effectively require both to be correct. These are introductory stage gates, not validated CEFR proficiency tests or certificates. The forms need a much larger, teacher-reviewed bank before high-stakes use. Writing and speaking assessment are not implemented. Current forms are fixed authored banks with randomized order/options, not an unlimited source of unseen questions.

The dashboard reports all-attempt accuracy by skill, attempted-exercise minutes (capped per attempt, not an active-time tracker), active days in America/Bogota and 30 recent attempts. Local-only progress from the former demo is deliberately not imported as verified mastery.

## Audio

80 active authored synthetic-voice WAV recordings are bundled under `public/audio`: 40 A1 practice recordings, 20 A1 assessment/review recordings and 20 recordings for A2–C2. No API key or per-play synthesis is required. Listening transcripts are returned only after the attempt is submitted. This does not prevent a determined learner from independently transcribing a recording; it is an educational product, not a supervised examination system.

`scripts/generateAudio.js` regenerates audio on macOS with the installed Samantha voice (`say` + `afconvert`). Content comes from `server/listening.js` and `server/exam-content.js`. For production editorial quality, replace the files with reviewed human/commissioned recordings, preserving paths or updating the server content.

Legacy electricity API routes return 410 and cannot modify old tables. The archived implementation is excluded from deployment. Publish the repository root with `vercel deploy --prod` (a static-only deployment cannot serve the new API).
