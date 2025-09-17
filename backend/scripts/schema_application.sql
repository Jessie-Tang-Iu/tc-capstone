-- Recreate (or ALTER if you already have it)
DROP TABLE IF EXISTS application CASCADE;
DROP TABLE IF EXISTS resume CASCADE;
DROP TABLE IF EXISTS cover_letter CASCADE;

-- Application related tables
CREATE TABLE resume (
    id              BIGSERIAL PRIMARY KEY,
    user_id         UUID NOT NULL UNIQUE,
    uploaded_at     TIMESTAMP NOT NULL DEFAULT now(),
    summary         TEXT,
    skills          TEXT,
    experience      TEXT,
    education       TEXT,
    certifications  TEXT,
    additional_info TEXT,
    answers         TEXT[],
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE
);

CREATE TABLE cover_letter (
    id              BIGSERIAL PRIMARY KEY,
    user_id         UUID NOT NULL UNIQUE,
    uploaded_at     TIMESTAMP NOT NULL DEFAULT now(),
    content         TEXT,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE

CREATE TABLE application (
    id                  BIGSERIAL PRIMARY KEY,
    job_id              BIGINT NOT NULL,
    user_id             UUID NOT NULL,
    resume              BYTEA,
    cover_letter        BYTEA,
    status              CHAR(1) NOT NULL DEFAULT 'P', -- P: Pending, R: Reviewed, A: Accepted, D: Declined
    applied_at          TIMESTAMP NOT NULL DEFAULT now(),
    relative_firt_name  TEXT,
    relative_last_name  TEXT,
    relative_email      TEXT,
    relative_phone      TEXT,
    CONSTRAINT chk_status CHECK (status IN ('P', 'R', 'A', 'D')),
    CONSTRAINT fk_job_user UNIQUE (job_id, user_id)
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE,
    CONSTRAINT fk_job FOREIGN KEY (job_id) REFERENCES job(id) ON DELETE CASCADE,
);