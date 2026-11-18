CREATE TABLE IF NOT EXISTS academy.courses (
 id text PRIMARY KEY, title text NOT NULL, description text NOT NULL,
 color text NOT NULL, curriculum_version text NOT NULL,
 outline jsonb NOT NULL, news jsonb NOT NULL DEFAULT '[]', updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS academy.course_lessons (
 id text PRIMARY KEY, course_id text NOT NULL REFERENCES academy.courses(id),
 position integer NOT NULL, stage integer NOT NULL, title text NOT NULL,
 body jsonb NOT NULL, assessment jsonb NOT NULL, version text NOT NULL,
 UNIQUE(course_id,position)
);
CREATE TABLE IF NOT EXISTS academy.enrollments (
 user_id text NOT NULL REFERENCES academy.learners(id), course_id text NOT NULL REFERENCES academy.courses(id),
 enrolled_at timestamptz NOT NULL DEFAULT now(),last_seen_at timestamptz NOT NULL DEFAULT now(),
 PRIMARY KEY(user_id,course_id)
);
CREATE TABLE IF NOT EXISTS academy.course_attempts (
 id uuid PRIMARY KEY,user_id text NOT NULL REFERENCES academy.learners(id),
 lesson_id text NOT NULL REFERENCES academy.course_lessons(id),version text NOT NULL,
 questions jsonb NOT NULL,answers jsonb,result jsonb,
 practical_text text,reflection_text text,
 status text NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','reinforce','awaiting_review','approved','changes_requested')),
 reviewer_id text REFERENCES academy.learners(id),review_notes text,review_rubric jsonb,
 started_at timestamptz NOT NULL DEFAULT now(),submitted_at timestamptz,reviewed_at timestamptz,
 expires_at timestamptz NOT NULL DEFAULT(now()+interval '4 hours')
);
CREATE TABLE IF NOT EXISTS academy.staff (
 user_id text PRIMARY KEY REFERENCES academy.learners(id), created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS academy_course_attempts_user ON academy.course_attempts(user_id,lesson_id,started_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS academy_course_pending ON academy.course_attempts(user_id,lesson_id) WHERE status='draft';
CREATE INDEX IF NOT EXISTS academy_reviews_queue ON academy.course_attempts(status,submitted_at) WHERE status='awaiting_review';
ALTER TABLE academy.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE academy.course_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE academy.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE academy.course_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE academy.staff ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON ALL TABLES IN SCHEMA academy FROM PUBLIC;
