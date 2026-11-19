-- Additive: authored session work is private, separate from graded attempts.
CREATE TABLE IF NOT EXISTS academy.english_session_work (
 user_id text NOT NULL REFERENCES academy.learners(id),
 lesson_id text NOT NULL REFERENCES academy.course_lessons(id),
 state jsonb NOT NULL CHECK(jsonb_typeof(state)='object'),
 updated_at timestamptz NOT NULL DEFAULT now(),
 PRIMARY KEY(user_id,lesson_id)
);
ALTER TABLE academy.english_session_work ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON academy.english_session_work FROM PUBLIC;
