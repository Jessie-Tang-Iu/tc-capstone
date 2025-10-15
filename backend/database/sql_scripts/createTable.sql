BEGIN;

-- =========================================
-- DROP (FK-safe order)
-- =========================================
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
  workshop_booking,
  workshop,
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
  supabase_id   TEXT
);

-- =========================================
-- WORKSHOPS
-- =========================================
CREATE TABLE workshop (
  id                     SERIAL PRIMARY KEY,
  title                  TEXT NOT NULL,
  date                   DATE NOT NULL,
  start_time             TIME,
  end_time               TIME,          -- added 15/09/2025
  status                 TEXT NOT NULL DEFAULT 'active',
  location               TEXT,
  description            TEXT,
  image_url              TEXT,
  "maxCapacity"          INTEGER,
  "currentCapacity"      INTEGER NOT NULL DEFAULT 0,
  "registrationDeadline" TIMESTAMP,
  highlight              TEXT,          -- added 15/09/2025
  price                  NUMERIC,       -- added 15/09/2025
  supabase_id            TEXT,
  CONSTRAINT chk_capacity_nonneg  CHECK ("currentCapacity" >= 0),
  CONSTRAINT chk_capacity_bounds  CHECK ("maxCapacity" IS NULL OR "currentCapacity" <= "maxCapacity"),
  CONSTRAINT chk_price_nonneg     CHECK (price IS NULL OR price >= 0)
);

CREATE TABLE workshop_booking (
  id           SERIAL PRIMARY KEY,
  "userID"     INTEGER REFERENCES "user"(id) ON DELETE SET NULL,
  "workshopID" INTEGER REFERENCES workshop(id) ON DELETE CASCADE,
  status       TEXT NOT NULL DEFAULT 'active',
  supabase_id  TEXT,
  CONSTRAINT uq_booking UNIQUE ("userID","workshopID")
);

CREATE INDEX idx_workshop_date ON workshop (date, start_time);
CREATE INDEX idx_booking_user ON workshop_booking ("userID");
CREATE INDEX idx_booking_ws   ON workshop_booking ("workshopID");

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
  id                BIGSERIAL PRIMARY KEY,
  -- employer_id     UUID,
  title             TEXT NOT NULL,
  company           TEXT NOT NULL,
  company_info      TEXT,
  location          TEXT NOT NULL,
  industry_id       INT  REFERENCES job_industry(id),
  workplace_id      INT  REFERENCES job_workplace(id),
  type_id           INT  REFERENCES job_type(id),
  experience_id     INT  REFERENCES job_experience(id),
  status            CHAR(1) NOT NULL DEFAULT 'A', -- A/I
  salary_per_hour   NUMERIC(5,2),
  link              TEXT,
  description       TEXT,
  responsibilities  TEXT,
  requirements      TEXT,
  details           TEXT,
  benefits          TEXT,
  questions         TEXT[],
  posted_at         TIMESTAMP NOT NULL DEFAULT now(),
  CONSTRAINT chk_job_status  CHECK (status IN ('A','I')),
  CONSTRAINT chk_job_salary  CHECK (salary_per_hour IS NULL OR salary_per_hour >= 0)
);

CREATE INDEX idx_job_lookup     ON job (industry_id, workplace_id, type_id, experience_id);
CREATE INDEX idx_job_posted_at  ON job (posted_at DESC);

-- =========================================
-- APPLICATIONS / RESUME / COVER LETTER
-- =========================================
CREATE TABLE resume (
  id              BIGSERIAL PRIMARY KEY,
  user_id         INT NOT NULL UNIQUE
                   REFERENCES "user"(id) ON DELETE CASCADE,
  uploaded_at     TIMESTAMP NOT NULL DEFAULT now(),
  summary         TEXT,
  skills          TEXT,
  experience      TEXT,
  education       TEXT,
  certifications  TEXT,
  additional_info TEXT
);

CREATE TABLE cover_letter (
  id          BIGSERIAL PRIMARY KEY,
  user_id     INT NOT NULL UNIQUE
               REFERENCES "user"(id) ON DELETE CASCADE,
  uploaded_at TIMESTAMP NOT NULL DEFAULT now(),
  content     TEXT
);

CREATE TABLE application (
  id                  BIGSERIAL PRIMARY KEY,
  job_id              BIGINT NOT NULL REFERENCES job(id) ON DELETE CASCADE,
  user_id             INT    NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  resume              BYTEA,
  cover_letter        BYTEA,
  status              CHAR(1) NOT NULL DEFAULT 'S', -- S/U/I/R/O/D
  applied_at          TIMESTAMP NOT NULL DEFAULT now(),
  relative_first_name TEXT,
  relative_last_name  TEXT,
  relative_email      TEXT,
  relative_phone      TEXT,
  answers             TEXT[],
  CONSTRAINT chk_app_status CHECK (status IN ('S','U','I','R','O','D')),
  CONSTRAINT uq_app_job_user UNIQUE (job_id, user_id)
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
  status     TEXT
);

-- =========================================
-- DISCUSSION BOARD
-- (authorId kept INT as provided; wired to user for integrity)
-- =========================================
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    author VARCHAR(100) NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
 
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    post_id INT REFERENCES posts(id) ON DELETE CASCADE,
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

COMMIT;