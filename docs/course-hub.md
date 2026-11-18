# Angkor Academy course hub

The public catalog exposes English and development/AI courses. Auth uses Neon-managed Google and email/password accounts, verified email and password recovery; see `account-security.md`.

Learning is independent: no teacher workflow or model is required. See `independent-learning.md` for curriculum, accessibility, objective progression, private notes, drafts and spaced review. English has forty A1 lessons and introductory A2–C2 material. Development/AI has forty-eight sessions, including a twelve-session beginner entry and framework-independent backend coverage.

Apply `scripts/migrateCourseHub.js` first on an isolated branch, then production using a direct `DATABASE_URL_UNPOOLED`. It preserves existing course IDs and history and applies the additive learning migration. Public English material is generated with `node scripts/syncCourse.js`; answer keys stay server-side.

Run `npm test` and the isolated integration script `scripts/checkIndependentLearning.js`. Existing `academy.staff` and historical review columns remain in the database to preserve history, but teacher approval is no longer a route or a prerequisite.
