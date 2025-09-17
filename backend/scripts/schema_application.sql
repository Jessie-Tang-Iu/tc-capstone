-- Recreate (or ALTER if you already have it)
DROP TABLE IF EXISTS application CASCADE;
DROP TABLE IF EXISTS resume CASCADE;
DROP TABLE IF EXISTS cover_letter CASCADE;

-- Application related tables
CREATE TABLE resume (
    id              BIGSERIAL PRIMARY KEY,
    user_id         INT NOT NULL UNIQUE,
    uploaded_at     TIMESTAMP NOT NULL DEFAULT now(),
    summary         TEXT,
    skills          TEXT,
    experience      TEXT,
    education       TEXT,
    certifications  TEXT,
    additional_info TEXT,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE
);

CREATE TABLE cover_letter (
    id              BIGSERIAL PRIMARY KEY,
    user_id         INT NOT NULL UNIQUE,
    uploaded_at     TIMESTAMP NOT NULL DEFAULT now(),
    content         TEXT,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE
);

CREATE TABLE application (
    id                  BIGSERIAL PRIMARY KEY,
    job_id              BIGINT NOT NULL,
    user_id             INT NOT NULL,
    resume              BYTEA,
    cover_letter        BYTEA,
    status              CHAR(1) NOT NULL DEFAULT 'S', -- S: Submitted, U: Under Reviewed, I: Interview Scheduled, R: Rejected, O: Offer, D: Withdrawn
    applied_at          TIMESTAMP NOT NULL DEFAULT now(),
    relative_first_name  TEXT,
    relative_last_name  TEXT,
    relative_email      TEXT,
    relative_phone      TEXT,
    answers             TEXT[],
    CONSTRAINT chk_status CHECK (status IN ('S', 'U', 'I', 'R', 'O', 'D')),
    CONSTRAINT fk_job_user UNIQUE (job_id, user_id),
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE,
    CONSTRAINT fk_job FOREIGN KEY (job_id) REFERENCES job(id) ON DELETE CASCADE
);

INSERT INTO "user" (id, firstname, lastname, email, role) VALUES
(11111, 'John', 'Smith', 'JohnS@sample.com', 'member'),
(22222, 'Jane', 'Nguyen', 'JaneNg@sample.com', 'member')
ON CONFLICT (id) DO NOTHING;

INSERT INTO resume (user_id, summary, skills, experience, education, certifications, additional_info) VALUES
(11111, 'Experienced software developer with a passion for creating innovative solutions.', 'JavaScript, Python, SQL', '5 years at TechCorp as a Full Stack Developer', 'B.Sc. in Computer Science from University X', 'Certified Scrum Master', 'Open to relocation.'),
(22222, 'Detail-oriented data analyst with expertise in data visualization and statistical analysis.', 'R, Python, Tableau', '3 years at DataInsights as a Data Analyst', 'M.Sc. in Data Science from University Y', 'Certified Data Analyst', 'Looking for remote opportunities.');

INSERT INTO cover_letter (user_id, content) VALUES
(11111, 'Dear Hiring Manager,\n\nI am writing to express my interest in the Software Developer position at your esteemed company. With over 5 years of experience in full stack development and a strong background in JavaScript and Python, I am confident in my ability to contribute effectively to your team.\n\nI have attached my resume for your review and would welcome the opportunity to discuss how my skills and experiences align with your needs.\n\nThank you for considering my application.\n\nSincerely,\nJohn Doe'),
(22222, 'Dear Hiring Manager,\n\nI am excited to apply for the Data Analyst position at your organization. With a Master degree in Data Science and 3 years of hands-on experience in data analysis and visualization, I am eager to bring my expertise to your team.\n\nPlease find my resume attached for your consideration. I look forward to the possibility of discussing how I can contribute to your company success.\n\nThank you for your time and consideration.\n\nBest regards,\nJane Smith');

INSERT INTO application (job_id, user_id, resume, cover_letter, status, relative_first_name, relative_last_name, relative_email, relative_phone, answers) VALUES
(1, 11111, NULL, NULL, 'S', 'Alice', 'Johnson', 'aliceJ@sample.com', '123-456-7890', ARRAY['Answer 1', 'Answer 2', 'Answer 3', 'Answer 4', 'Answer 5']),
(1, 22222, NULL, NULL, 'I', 'Jane', 'Doe', 'janeD@sample.com', '555-555-5555', ARRAY['Answer A', 'Answer B', 'Answer C', 'Answer D', 'Answer E']),
(2, 22222, NULL, NULL, 'U', 'Bob', 'Smith', 'bobS@sample.com', '987-654-3210', ARRAY['Answer A', 'Answer B', 'Answer C', 'Answer D', 'Answer E']);
