-- Informational reading is distinct from lessons, attempts and grades.
CREATE TABLE IF NOT EXISTS academy.reading_chapters (
 course_id text NOT NULL REFERENCES academy.courses(id),
 number integer NOT NULL CHECK(number>0), title text NOT NULL,
 body jsonb NOT NULL CHECK(jsonb_typeof(body)='object'),
 published boolean NOT NULL DEFAULT false,version text NOT NULL,
 updated_at timestamptz NOT NULL DEFAULT now(),PRIMARY KEY(course_id,number)
);
CREATE TABLE IF NOT EXISTS academy.reading_progress (
 user_id text NOT NULL REFERENCES academy.learners(id),
 course_id text NOT NULL,chapter_number integer NOT NULL,
 section_id text NOT NULL CHECK(length(section_id) BETWEEN 1 AND 100),
 font_size integer NOT NULL DEFAULT 21 CHECK(font_size IN (18,21,24)),
 updated_at timestamptz NOT NULL DEFAULT now(),PRIMARY KEY(user_id,course_id),
 FOREIGN KEY(course_id,chapter_number) REFERENCES academy.reading_chapters(course_id,number)
);
ALTER TABLE academy.reading_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE academy.reading_progress ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON academy.reading_chapters,academy.reading_progress FROM PUBLIC;
