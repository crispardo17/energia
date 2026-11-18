CREATE TABLE IF NOT EXISTS academy.learning_preferences (
 user_id text PRIMARY KEY REFERENCES academy.learners(id),
 preferences jsonb NOT NULL DEFAULT '{"largeText":false,"simple":true,"minutes":10,"audioRate":0.85}',
 updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS academy.learning_reviews (
 user_id text NOT NULL REFERENCES academy.learners(id),course_id text NOT NULL REFERENCES academy.courses(id),
 lesson_id text NOT NULL REFERENCES academy.course_lessons(id),concept text NOT NULL,
 streak integer NOT NULL DEFAULT 0 CHECK(streak>=0),last_correct boolean NOT NULL,
 due_at timestamptz NOT NULL DEFAULT now(),updated_at timestamptz NOT NULL DEFAULT now(),
 PRIMARY KEY(user_id,course_id,lesson_id,concept)
);
CREATE INDEX IF NOT EXISTS academy_learning_due ON academy.learning_reviews(user_id,course_id,due_at);
CREATE TABLE IF NOT EXISTS academy.learning_notes (
 user_id text NOT NULL REFERENCES academy.learners(id),lesson_id text NOT NULL REFERENCES academy.course_lessons(id),
 note text NOT NULL CHECK(length(note)<=16000),updated_at timestamptz NOT NULL DEFAULT now(),PRIMARY KEY(user_id,lesson_id)
);
ALTER TABLE academy.learning_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE academy.learning_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE academy.learning_notes ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON academy.learning_preferences,academy.learning_reviews,academy.learning_notes FROM PUBLIC;
-- Preserve submitted work. Old drafts need the current automatic assessment;
-- no written response is retroactively approved by length or keyword matching.
UPDATE academy.course_attempts SET status='reinforce',review_notes=concat_ws(E'\n',NULLIF(review_notes,''),'La ruta ahora es autónoma. Tu trabajo está guardado. Abre esta sesión y realiza la nueva comprobación automática.')
WHERE status IN ('awaiting_review','changes_requested') OR (status='draft' AND version='engineering-2026-11-v1');

-- Pauses are supported; speed is not a grading criterion.
ALTER TABLE academy.attempts ALTER COLUMN expires_at SET DEFAULT (now()+interval '30 days');
ALTER TABLE academy.course_attempts ALTER COLUMN expires_at SET DEFAULT (now()+interval '30 days');
UPDATE academy.attempts SET expires_at=GREATEST(expires_at,started_at+interval '30 days') WHERE submitted_at IS NULL;
UPDATE academy.course_attempts SET expires_at=GREATEST(expires_at,started_at+interval '30 days') WHERE status='draft';
-- Keep a learner's drafts when moving between lessons.
DROP INDEX IF EXISTS academy.academy_one_pending;
CREATE UNIQUE INDEX IF NOT EXISTS academy_one_pending_per_activity ON academy.attempts(user_id,kind,COALESCE(lesson_id,level)) WHERE submitted_at IS NULL;
