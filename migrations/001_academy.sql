-- Additive migration: does not modify the former electricity application's data.
CREATE SCHEMA IF NOT EXISTS academy;
CREATE TABLE IF NOT EXISTS academy.learners (
 id text PRIMARY KEY, name text NOT NULL, email text NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now(), last_seen_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS academy.attempts (
 id uuid PRIMARY KEY, user_id text NOT NULL REFERENCES academy.learners(id),
 level text NOT NULL CHECK(level IN ('A1','A2','B1','B2','C1','C2')),
 lesson_id text, kind text NOT NULL CHECK(kind IN ('practice','exam','review')),
 policy_version text NOT NULL, questions jsonb NOT NULL, answers jsonb,
 result jsonb, passed boolean NOT NULL DEFAULT false,
 started_at timestamptz NOT NULL DEFAULT now(), submitted_at timestamptz,
 expires_at timestamptz NOT NULL DEFAULT (now() + interval '2 hours'),
 CHECK ((kind = 'practice') = (lesson_id IS NOT NULL))
);
CREATE INDEX IF NOT EXISTS academy_attempts_user_date ON academy.attempts(user_id, started_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS academy_one_pending ON academy.attempts(user_id) WHERE submitted_at IS NULL;
ALTER TABLE academy.learners ENABLE ROW LEVEL SECURITY;
ALTER TABLE academy.attempts ENABLE ROW LEVEL SECURITY;
-- All access goes through authenticated server routes. No anonymous or browser DB grants.
REVOKE ALL ON SCHEMA academy FROM PUBLIC;
REVOKE ALL ON ALL TABLES IN SCHEMA academy FROM PUBLIC;
