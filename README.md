# Angkor Academy — course platform

Public catalogue with English (violet) and Software Development / AI (blue and cyan). Sign in with Google or email/password using Neon Auth. Registration collects name, email, password and confirmation; only the identity provider stores the password hash. Confirmation is never persisted.

The new engineering course stores its 48 sessions, nine-stage outline and server-only assessment definitions in Postgres. Student enrollments, draft answers, practical work, reflections, grades and reinforcement topics are durable. English keeps its existing attempts and progression; its teaching content is also seeded into the course catalogue.

`migrations/002_course_hub.sql` and `scripts/migrateCourseHub.js` are additive. Test against a temporary Neon branch before applying to production. Use a direct connection with `ACADEMY_ENV_FILE=/path/to/env node scripts/migrateCourseHub.js`. Never put secrets in committed files.

Engineering progression uses automatic assessment: at least 85%, all essential concepts and both application checks must pass. Free notes, reflections and text length do not approve comprehension. No human teacher or live LLM is required. This is an authored course, not an arbitrary-code runner.

Validation: `npm test`, `npm run build`, and `ACADEMY_ENV_FILE=/path/to/test-branch.env node scripts/checkCourseHub.js`. The integration test uses synthetic records and removes them. To preview against a test branch: `ACADEMY_ENV_FILE=/path/to/test-branch.env node scripts/devCourseHub.js` (port 3006 for the app and API).

## Run and validate

- `npm install`
- `npm run dev` starts the app and the real API handlers at `http://localhost:3006`. The port is strict: an occupied port causes an error instead of moving to another project's port. Keep the required server variables in `.env.local`.
- `npm test` checks authorization, grading, level gates, retention and assessment content.
- `npm run build` creates production assets.
- `npm run db:migrate` applies the additive migration from `migrations/001_academy.sql`.

Responsive layouts cover the catalogue, both learning routes, guided lessons, assessments and account dialogs. Layout checks include widths from 320 to 1920 pixels, phone landscape and the large-text preference. Dialogs scroll independently on short screens; code and long answers wrap within their containers. The mobile guide uses short step labels without changing the lesson sequence.

Server environment: `DATABASE_URL`, `NEON_AUTH_BASE_URL` (the public Neon Auth base URL). No database credentials belong in `VITE_*` variables. Values are not committed. For a separate env file, use `ACADEMY_ENV_FILE=/path/to/file npm run db:migrate`.

In Neon, allow `https://angkor-academy.vercel.app` (no trailing slash) on the branch serving production, and configure the production Google OAuth client. The callback registered in Google must be `${NEON_AUTH_BASE_URL}/callback/google`. Google authenticates through the official Neon SDK. The API validates the JWT signature, expiration, issuer and audience against the Neon JWKS; user IDs never come from request bodies.

## Progress policy

All attempts are stored under `academy` (separate from the old electricity tables). Answers and scoring remain server-side. Each attempt belongs to a verified learner, expires after two hours, and can be submitted only once (repeated submissions return the saved result). A per-user database lock serializes starts and submissions. Only one pending attempt per learner exists; opening a different exercise replaces the unfinished attempt.

To unlock the next stage:

1. Pass every lesson practice (80% overall, 75% per assessed skill).
2. Pass the stage exam (85% overall, 75% per skill).
3. After at least 24 hours, pass a separate retention form (same exam thresholds).
4. Failed exam/review attempts require a 15-minute pause.

A1 has 40 lessons in 10 sequential units and a 40-question exam/review sampled across every unit and skill. It additionally requires at least 75% in each A1 unit. Earlier eight-question A1 demo assessments cannot unlock A2. A2–C2 each have 40 sessions and 40-question exams covering ten units. These are authored learning gates, not validated CEFR proficiency tests or certificates. The forms need a much larger, teacher-reviewed bank before high-stakes use. One bounded written item is checked in each mini test; unrestricted writing and spoken fluency are not automatically assessed. Current forms are fixed authored banks with randomized order/options, not an unlimited source of unseen questions.

The dashboard reports all-attempt accuracy by skill, attempted-exercise minutes (capped per attempt, not an active-time tracker), active days in America/Bogota and 30 recent attempts. Local-only progress from the former demo is deliberately not imported as verified mastery.

## Audio

380 active authored synthetic-voice WAV recordings are bundled under `public/audio`: 40 A1 practice recordings, 20 A1 assessment/review recordings, 200 A2–C2 practice recordings and 100 A2–C2 assessment/review recordings. Older introductory media remain available for historical references. No API key or per-play synthesis is required. Listening transcripts are returned only after the attempt is submitted. This does not prevent a determined learner from independently transcribing a recording; it is an educational product, not a supervised examination system.

`scripts/generateAudio.js` regenerates audio on macOS with the installed Samantha voice (`say` + `afconvert`). Content comes from `server/listening.js` and `server/exam-content.js`. For production editorial quality, replace the files with reviewed human/commissioned recordings, preserving paths or updating the server content.

Legacy electricity API routes return 410 and cannot modify old tables. The archived implementation is excluded from deployment. Publish the repository root with `vercel deploy --prod` (a static-only deployment cannot serve the new API).


## English sessions, A1–C2

The English route now has 240 active sessions: 40 sessions and 10 units per level. `server/english-advanced.js` authors A2–C2; `server/english-session.js` adds the A–H session structure to all levels. Each session includes two recall prompts, one main focus, five contextual verb references, five vocabulary items (including deliberate reuse), pronunciation practice, three scaffolded conversation turns, sentence production and eight assessed exercises. The authored material is a learning route, not a validated CEFR certificate or a guarantee of learning speed.

Conversation and notebook writing are private practice, not an AI evaluation. A bounded written item in each mini test accepts an authored target formulation, ignoring case, punctuation and supported contractions; feedback distinguishes that check from unrestricted writing or spoken fluency. Each level exam and delayed review samples four skills across all ten units. New assessments use fixed authored banks. Reading/listening contexts vary within each form, but alternate forms may revisit situations: the system does not promise unlimited unseen questions.

Previous submitted attempts, accounts, private notes and introductory lesson rows remain stored. Original A1 exam/review policy versions remain recognised; legacy short A2–C2 exams cannot unlock the expanded stages. Sequential session access is enforced by the server. `academy.english_session_work` stores private A–H position and written activity via authenticated endpoints; RLS is enabled with no public grants. Accuracy labels describe these exercises, not independent certification of fluency. Vocabulary and verbs shown in a session are not automatically marked as mastered.

Run `node scripts/syncCourse.js` after changing authored content. Generate the 300 additional recordings with `node scripts/generateAudio.js` (Samantha on macOS); existing A1 recordings remain. Media preload is disabled until needed. Test the additive `004_english_sessions.sql` migration and catalogue seed with `ACADEMY_ENV_FILE=/path/to/branch.env node scripts/syncEnglishCurriculum.js`, then `ACADEMY_ENV_FILE=/path/to/branch.env node scripts/checkEnglishSessions.js`. Both retain existing learner work; integration records roll back. Use a direct database connection. The temporary test branch expires automatically.

Scope reference: Council of Europe [CEFR descriptors](https://www.coe.int/en/web/common-european-framework-reference-languages/cefr-descriptors). Explanations and examples are authored for this course. No personal session number in an attached prompt overrides a user's recorded progress.


## El Algoritmo de Todo — illustrated book

The catalogue includes an informational book (`algorithm-book`), separate from the two assessed courses. The public route is `/biblioteca/el-algoritmo-de-todo`. Part I is complete: chapters 1–5, 10,842 words and 26 accessible native diagrams, with linked sources. The full 50-title, seven-part index is editorial planning; chapters 6–50 are explicitly unpublished. No chapter beyond Part I, quiz, exercise, completion grade or social-video script is generated. Reader controls change typography or navigation, not the subject order.

`server/book/content.js` and `server/book/part-one.js` form the authored seed. Apply `migrations/005_algorithm_book.sql` and its catalogue/chapter seed with `ACADEMY_ENV_FILE=/path/to/direct-connection.env node scripts/syncAlgorithmBook.js`. It adds two tables and the book entry without touching course attempts, lesson progress or private notes. Published chapter content and its references are stored in Postgres and read through `GET /api/courses?action=book&chapter=1`; unpublished chapters return 404. The generic catalogue renderer distinguishes books through `outline.kind`.

Reading is public. `book-progress` requires the existing verified session and safe origin for writes. The server chooses the user ID, validates section IDs against the published chapter, and stores only a reading point and text size. Those private tables have RLS enabled and no PUBLIC grants. Signing in from the book preserves the requested reading point across the auth redirect. Scrolling/typing controls never count as comprehension or completion.

Run `npm test` for content/publishing boundaries and marker validation. On an isolated Neon branch, `ACADEMY_ENV_FILE=/path/to/branch.env node scripts/checkAlgorithmBook.js` verifies public reading, unpublished chapter rejection, authenticated bookmark ownership, persistence, text size and absence of graded attempts, then removes only its synthetic records. Production needs the new schema seeded before announcing the book link. Local development stays on port 3006.


Part I expansion: chapters 2–5 each contain 2,000–3,500 words. `?capitulo=N` addresses one published chapter, and previous/next links never offer a planned chapter. The reader restores the chapter as well as its section, preserves font size while moving, respects explicit chapter links and handles browser history. Existing chapter 1 section IDs and reading rows remain unchanged. Introductory technical content is optional to expand. All 26 figures use accessible HTML/native diagrams; the added numerical examples are synthetic and covered by arithmetic consistency checks. Neither completion grades nor external AI models are used.
