# Neon setup and Angkor Academy changes

Completed on 2026-11-18 using the official Neon agent setup prompt and Neon skill.

## Agent tools

- Installed Neon CLI 9.7.0 globally and authenticated the DEFAULT profile through the user's browser. Credentials remain in Neon's local credential store, not this repository.
- Installed the official `neon-postgres@plugins-cli` Codex plugin 3.0.10 at user scope. It supplies the Neon MCP endpoint (`https://mcp.neon.tech/mcp`) and seven skills: neon, neon-postgres, neon-auth, neon-ai-gateway, neon-functions, neon-object-storage and neon-realtime. Existing Codex settings and the node_repl MCP entry were retained. No second Neon MCP entry was added.
- Found the two project-level skills (`neon`, `neon-postgres`) outdated. Updated them through `neon skills update -y`; `skills-lock.json` is now version 2 with upstream commit hashes. Other project's skills/settings were not installed or overwritten.
- Backed up the previous project skills, skills lock and ignore file under `/var/folders/4m/b2y1r43s0xz098ps8v42_73r0000gn/T/angkor-neon-config-backup-gxqwmhkx` before updating them.
- Linked `.neon` to the existing project `winter-shadow-04529699`, organization `org-lucky-voice-78035848`, branch `main`, with `--no-env-pull --no-config`.
- Added `.neon` to `.gitignore` and `.vercelignore`. The existing `.env.local` was checked by SHA-256 and is unchanged. No new database project or additional cloud services were provisioned by the tooling setup. No `neon.ts` was created.
- Codex must reload/restart to load the plugin's skills and MCP connection. The authenticated CLI is usable immediately. MCP installation was verified on disk; a live MCP connection was not tested in this session.

## Course platform

- Rebranded the interface and browser title to Angkor Academy.
- Added Neon Auth's official SDK, verified JWT authorization and account-based progress. The authentication URL is supplied by the server's existing environment.
- Added the trusted origin `https://angkor-academy.vercel.app` to the existing Neon Auth branch. The social-login request now returns a valid Google redirect instead of `Invalid callbackURL`.
- Created only the new `academy` schema, with learner and attempt tables, indexes and RLS enabled; existing electricity data was preserved.
- Added server-only answer banks and server grading, four skill scores, per-attempt history, activity days, attempted-exercise minutes, and a dashboard.
- Added practice/exam/review gates: all lessons passed, 85% global and 75% per skill in an exam, then a separate review at least 24 hours later. Failed exams/reviews have a 15-minute pause. Requests cannot skip levels by changing a browser value.
- Attempts expire after two hours; per-user transactions serialize starts/submissions, and repeat submissions return the stored score.
- Authored and bundled 24 synthetic-voice listening recordings and practice/exam/review questions. Transcripts and correct answers are not sent until submission.
- Retired the four electricity API routes with HTTP 410 responses. Their source is archived under `server/legacy`, excluded from deployment.
- Added build/deployment config, documentation, migration/audio/test scripts and automated tests. The user's existing change to `src/hooks/useCryptoPrices.js` was preserved.
- Published the application and API to the existing Vercel project `energia`, at https://angkor-academy.vercel.app.

## Verification and remaining limits

- Eight automated tests passed, covering unauthorized requests, cross-origin writes, skill thresholds, answer stripping, audio files, level gates, cooldown and 24-hour retention.
- Production build passed. Public catalogue and audio return 200; progress without authentication returns 401; old reset route returns 410.
- Database integration ran inside a transaction that rolled back all synthetic data.
- Live integration used an ephemeral synthetic Neon account: real JWT verification, saved practice, statistics, duplicate submissions and denied level jumps all passed. The synthetic account and its course records were removed afterward.
- Browser inspection confirmed the new branding, account controls and locked A2 panel. An end-to-end Google-account selection/consent/sign-out flow was not completed in the browser.
- Google is currently configured with Neon's shared development credentials. Set a production-owned Google OAuth client in Neon before launching to real students; this setup did not fabricate or replace Google client secrets.
- The course still has 12 introductory lessons. Its small assessment forms are stage gates, not a complete or validated CEFR curriculum. Each exam currently has two items per skill, so the per-skill threshold effectively requires all of them to be correct. Writing and speaking assessment, a larger non-repeating item bank, teacher review and full A1–C2 coverage remain curriculum work.
