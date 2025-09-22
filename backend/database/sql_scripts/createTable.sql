BEGIN;

-- =========================================
-- DROP (FK-safe order)
-- =========================================
DROP TABLE IF EXISTS
  comments,
  posts,
  advisory_bookings,
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
-- DISCUSSION BOARD
-- (authorId kept INT as provided; wired to user for integrity)
-- =========================================
CREATE TABLE posts (
  id         SERIAL PRIMARY KEY,
  authorId   INT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  author     VARCHAR(100) NOT NULL,
  title      TEXT NOT NULL,
  content    TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE comments (
  id         SERIAL PRIMARY KEY,
  authorId   INT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  post_id    INT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  author     VARCHAR(100) NOT NULL,
  content    TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX idx_posts_author     ON posts (authorId, created_at DESC);
CREATE INDEX idx_comments_post    ON comments (post_id, created_at);
CREATE INDEX idx_comments_author  ON comments (authorId, created_at DESC);

COMMIT;