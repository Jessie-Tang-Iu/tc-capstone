BEGIN;

-- =========================================
-- DROP (FK-safe order)
-- =========================================

-- workshop table is not longer available, its replaced by event table
DROP TABLE IF EXISTS workshop_booking CASCADE;
DROP TABLE IF EXISTS workshop CASCADE;


DROP TABLE IF EXISTS
  reports,
  comments,
  posts,
  advisory_bookings,
  advisory_sessions,
  application,
  cover_letter,
  resume,
  job,
  job_workplace,
  job_experience,
  job_type,
  job_industry,
  message,
  events, 
  event_user,
  "user"
CASCADE;

-- =========================================
-- CORE: Users
-- =========================================
CREATE TABLE "user" (
  id            SERIAL PRIMARY KEY,
  email         TEXT UNIQUE NOT NULL,
  firstname     TEXT,
  lastname      TEXT,
  username      TEXT,
  status        TEXT NOT NULL DEFAULT 'active',
  role          TEXT,
  supabase_id   TEXT,
  clerk_id      TEXT UNIQUE
);

-- =========================================
-- Events
-- =========================================
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  status TEXT NOT NULL DEFAULT 'active',
  location TEXT,
  description TEXT,
  image_url TEXT,
  max_capacity INTEGER,
  current_capacity INTEGER NOT NULL DEFAULT 0,
  registration_deadline TIMESTAMP,
  highlight TEXT,
  price NUMERIC,
  CONSTRAINT chk_capacity_nonneg CHECK (current_capacity >= 0),
  CONSTRAINT chk_capacity_bounds CHECK (max_capacity IS NULL OR current_capacity <= max_capacity),
  CONSTRAINT chk_price_nonneg CHECK (price IS NULL OR price >= 0)
);

CREATE INDEX idx_event_date ON events (date, start_time);

-- =========================================
-- event_user
-- =========================================
CREATE TABLE event_user (
  id SERIAL PRIMARY KEY,
  event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'registered',
  registered_at TIMESTAMP NOT NULL DEFAULT now(),
  CONSTRAINT uq_event_user UNIQUE (event_id, user_id)
);

CREATE INDEX idx_event_user_event ON event_user (event_id);
CREATE INDEX idx_event_user_user ON event_user (user_id);

-- =========================================
-- MESSAGING
-- =========================================
CREATE TABLE message (
  id               BIGSERIAL PRIMARY KEY,
  sent_user_id     TEXT NOT NULL,
  receive_user_id  TEXT NOT NULL,
  content          TEXT NOT NULL,
  sent_at          TIMESTAMP NOT NULL DEFAULT now(),
  status           CHAR(1) NOT NULL DEFAULT 'S', -- S: sent/read-state app-level
  conversation_id  TEXT GENERATED ALWAYS AS
    (LEAST(sent_user_id, receive_user_id) || ':' || GREATEST(sent_user_id, receive_user_id))
  STORED
);

CREATE INDEX idx_message_sender       ON message (sent_user_id);
CREATE INDEX idx_message_receiver     ON message (receive_user_id);
CREATE INDEX idx_message_conversation ON message (conversation_id);

-- Optional: clear seed area (kept empty but ready)
-- TRUNCATE message RESTART IDENTITY;

-- =========================================
-- JOBS (lookup tables + main)
-- =========================================
CREATE TABLE job_industry (
  id   SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE job_type (
  id   SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE job_experience (
  id   SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE job_workplace (
  id   SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE job (
  id                  BIGSERIAL PRIMARY KEY,
  employer_id         VARCHAR(255) NOT NULL,
  title               TEXT NOT NULL,
  company_info        TEXT,
  location            TEXT NOT NULL,
  industry_id         INT,
  workplace_id        INT,
  type_id             INT,
  experience_id       INT,
  status              CHAR(1) NOT NULL DEFAULT 'A', -- A: Active, I: Inactive
  salary_per_hour     NUMERIC(5, 2),
  link                TEXT,
  description         TEXT,
  responsibilities    TEXT,
  requirements        TEXT,
  details             TEXT,
  benefits            TEXT,
  questions           TEXT[],
  posted_at           TIMESTAMP NOT NULL DEFAULT now(),
  CONSTRAINT chk_status CHECK (status IN ('A', 'I')),
  CONSTRAINT chk_salary CHECK (salary_per_hour >= 0),
  CONSTRAINT fk_employer FOREIGN KEY (employer_id) REFERENCES employers(clerk_id),
  CONSTRAINT fk_industry FOREIGN KEY (industry_id) REFERENCES job_industry(id),
  CONSTRAINT fk_workplace FOREIGN KEY (workplace_id) REFERENCES job_workplace(id),
  CONSTRAINT fk_type FOREIGN KEY (type_id) REFERENCES job_type(id),
  CONSTRAINT fk_experience FOREIGN KEY (experience_id) REFERENCES job_experience(id)
);

CREATE INDEX idx_job_lookup     ON job (industry_id, workplace_id, type_id, experience_id);
CREATE INDEX idx_job_posted_at  ON job (posted_at DESC);

-- =========================================
-- APPLICATIONS / RESUME / COVER LETTER
-- =========================================
CREATE TABLE resume (
  id              BIGSERIAL PRIMARY KEY,
  user_id         VARCHAR(255) UNIQUE NOT NULL,
  uploaded_at     TIMESTAMP NOT NULL DEFAULT now(),
  summary         TEXT,
  skills          TEXT[],
  experience      TEXT[],
  education       TEXT[],
  certifications  TEXT[],
  additional_info TEXT,
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES "users"(clerk_id) ON DELETE CASCADE
);

CREATE TABLE cover_letter (
  id              BIGSERIAL PRIMARY KEY,
  user_id         VARCHAR(255) NOT NULL UNIQUE,
  uploaded_at     TIMESTAMP NOT NULL DEFAULT now(),
  content         TEXT,
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES "users"(clerk_id) ON DELETE CASCADE
);

CREATE TABLE application (
  id                  BIGSERIAL PRIMARY KEY,
  job_id              BIGINT NOT NULL,
  user_id             VARCHAR(255) NOT NULL,
  resume_name         VARCHAR(500),
  resume_data         BYTEA,
  cover_letter_name   VARCHAR(500),
  cover_letter_data   BYTEA,
  status              CHAR(1) NOT NULL DEFAULT 'S', -- S: Submitted, U: Under Reviewed, I: Interview Scheduled, R: Rejected, O: Offer, D: Withdrawn
  applied_at          TIMESTAMP NOT NULL DEFAULT now(),
  relative_first_name  TEXT,
  relative_last_name  TEXT,
  relative_email      TEXT,
  relative_phone      TEXT,
  answers             TEXT[],
  CONSTRAINT chk_status CHECK (status IN ('S', 'U', 'I', 'R', 'O', 'D')),
  CONSTRAINT fk_job_user UNIQUE (job_id, user_id),
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(clerk_id) ON DELETE CASCADE,
  CONSTRAINT fk_job FOREIGN KEY (job_id) REFERENCES job(id) ON DELETE CASCADE
);

CREATE INDEX idx_app_user   ON application (user_id);
CREATE INDEX idx_app_job    ON application (job_id);
CREATE INDEX idx_app_status ON application (status);

-- =========================================
-- ADVISORY BOOKINGS
-- (kept TEXT ids to match your current usage; add FKs later if needed)
-- =========================================
CREATE TABLE advisory_bookings (
  booking_id  SERIAL PRIMARY KEY,
  advisor_id  TEXT NOT NULL,
  client_id   TEXT,
  date        DATE,
  startTime   TIME,
  endTime     TIME,
  description TEXT,
  status      TEXT
);

CREATE INDEX idx_advisory_advisor_date ON advisory_bookings (advisor_id, date);
CREATE INDEX idx_advisory_client_date  ON advisory_bookings (client_id, date);

-- =========================================
-- ADVISORY SESSIONS
-- (kept TEXT ids to match your current usage; add FKs later if needed)
-- =========================================
CREATE TABLE advisory_sessions (
  session_id SERIAL PRIMARY KEY,
  advisor_id TEXT NOT NULL,
  client_id  TEXT NOT NULL,
  message    TEXT,
  status     TEXT
);

-- =========================================
-- DISCUSSION BOARD
-- (authorId kept INT as provided; wired to user for integrity)
-- =========================================
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    author VARCHAR(100) NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
 
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    post_id INT REFERENCES posts(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    author VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_posts_author     ON posts (author, created_at DESC);
CREATE INDEX idx_comments_post    ON comments (post_id, created_at);
CREATE INDEX idx_comments_author  ON comments (author, created_at DESC);

CREATE TABLE reports (
  report_id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,   -- internal PK
  source_page         TEXT NOT NULL,                                     -- e.g. "profile", "post", or URL slug
  followup_id         TEXT,                                              -- external tracking id if needed
  reported_user_id    UUID NOT NULL,                                     -- or BIGINT if numeric user ids
  reason              TEXT NOT NULL,                                     -- e.g. 'hate_speech', 'fake_account'
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_removed          BOOLEAN NOT NULL DEFAULT FALSE,
  is_banned           BOOLEAN NOT NULL DEFAULT FALSE,
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Optional: constrain reason to a known set (text enum via CHECK)
ALTER TABLE reports
ADD CONSTRAINT reports_reason_chk
CHECK (reason IN ('hate_speech','fake_account','spam','harassment','other'));

-- Optional: “8-digit id” visible to users (separate human-friendly code)
-- Store as CHAR(8) or TEXT with a CHECK; make it unique.
ALTER TABLE reports
ADD COLUMN public_code CHAR(8);

ALTER TABLE reports
ADD CONSTRAINT reports_public_code_chk
CHECK (public_code ~ '^[0-9]{8}$');

ALTER TABLE reports
ADD CONSTRAINT reports_public_code_uk UNIQUE (public_code);

-- Updated-at trigger to auto-maintain timestamps
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER reports_set_updated_at
BEFORE UPDATE ON reports
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- Helpful indexes
CREATE INDEX idx_reports_reported_user_id ON reports (reported_user_id);
CREATE INDEX idx_reports_created_at ON reports (created_at);
CREATE INDEX idx_reports_reason ON reports (reason);
CREATE INDEX idx_reports_is_removed ON reports (is_removed);
CREATE INDEX idx_reports_is_banned ON reports (is_banned);


COMMIT;

----event booking 
CREATE TABLE event_user (
  id SERIAL PRIMARY KEY,
  event_id INTEGER NOT NULL REFERENCES workshop(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'registered',  -- could be 'registered', 'cancelled', 'attended'
  registered_at TIMESTAMP NOT NULL DEFAULT now(),
  CONSTRAINT uq_event_user UNIQUE (event_id, user_id)
);

ALTER TABLE "user"
ADD COLUMN clerk_id TEXT UNIQUE;

CREATE INDEX idx_event_user_event ON event_user (event_id);
CREATE INDEX idx_event_user_user ON event_user (user_id);