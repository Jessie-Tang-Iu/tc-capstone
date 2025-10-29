-- Recreate (or ALTER if you already have it)
DROP TABLE IF EXISTS application CASCADE;
DROP TABLE IF EXISTS resume CASCADE;
DROP TABLE IF EXISTS cover_letter CASCADE;

-- Application related tables
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
    resume_iv           VARCHAR(32),
    cover_letter_name   VARCHAR(500),
    cover_letter_data   BYTEA,
    cover_letter_iv     VARCHAR(32),
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

INSERT INTO users (clerk_id, username, first_name, last_name, email, phone, role) VALUES 
('testMember1', 'johnsmith', 'John', 'Smith', 'JohnS@sample.com', '403-555-1034', 'member'),
('testMember2', 'janenguyen', 'Jane', 'Nguyen', 'JaneNg@sample.com', '587-555-5078', 'member'),
('user_33TygiU42yjY3nfWxD5cEPCACv7', 'lamdao', 'Lam', 'Dao', 'lam.dao@edu.sait.ca', '403-304-3344', 'member')
ON CONFLICT (clerk_id) DO NOTHING;

INSERT INTO resume (user_id, summary, skills, experience, education, certifications, additional_info) VALUES
('testMember1', 'Experienced software developer with a passion for creating innovative solutions.', ARRAY['JavaScript, Python, SQL'], ARRAY['Full Stack Developer | TechCorp | Contract | April | 2013 | June | 2018'], ARRAY['University X | Bachelor | Computer Science | 2010 | 2014'], ARRAY['Certified Scrum Master'], 'Open to relocation.'),
('testMember2', 'Detail-oriented data analyst with expertise in data visualization and statistical analysis.', ARRAY['R, Python, Tableau'], ARRAY['Data Analyst | Data Insights | Full-time | January | 2020 | August | 2022'], ARRAY['University Y | Master | Data Science | 2012 | 2016'], ARRAY['Certified Data Analyst'], 'Looking for remote opportunities.'),
('user_33TygiU42yjY3nfWxD5cEPCACv7', 'Detail-oriented data analyst with expertise in data visualization and statistical analysis.', ARRAY['R', 'Python', 'Tableau'], ARRAY['Data Analyst | Data Insights | Full-time | January | 2020 |  |  | Design\nVisualization'], ARRAY['University Y | Master | Data Science | 2017 | 2021', 'SAIT | Diploma | Software Development | 2024 | 2026'], ARRAY['Certified Data Analyst'], 'Looking for remote opportunities.')
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO cover_letter (user_id, content) VALUES
('user_33TygiU42yjY3nfWxD5cEPCACv7', 'Dear Hiring Manager,\n\nI am excited to apply for the Data Analyst position at your organization. With a Master degree in Data Science and 3 years of hands-on experience in data analysis and visualization, I am eager to bring my expertise to your team.\n\nPlease find my resume attached for your consideration. I look forward to the possibility of discussing how I can contribute to your company success.\n\nThank you for your time and consideration.\n\nBest regards,\nJane Smith'),
('testMember1', 'Dear Hiring Manager,\n\nI am writing to express my interest in the Software Developer position at your esteemed company. With over 5 years of experience in full stack development and a strong background in JavaScript and Python, I am confident in my ability to contribute effectively to your team.\n\nI have attached my resume for your review and would welcome the opportunity to discuss how my skills and experiences align with your needs.\n\nThank you for considering my application.\n\nSincerely,\nJohn Doe'),
('testMember2', 'Dear Hiring Manager,\n\nI am excited to apply for the Data Analyst position at your organization. With a Master degree in Data Science and 3 years of hands-on experience in data analysis and visualization, I am eager to bring my expertise to your team.\n\nPlease find my resume attached for your consideration. I look forward to the possibility of discussing how I can contribute to your company success.\n\nThank you for your time and consideration.\n\nBest regards,\nJane Smith')
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO application (job_id, user_id, status, relative_first_name, relative_last_name, relative_email, relative_phone, answers) VALUES
(1,'user_33TygiU42yjY3nfWxD5cEPCACv7', 'I', 'Jane', 'Doe', 'janeD@sample.com', '555-555-5555', ARRAY['Answer A', 'Answer B', 'Answer C', 'Answer D']),
(2,'user_33TygiU42yjY3nfWxD5cEPCACv7', 'U', 'Bob', 'Smith', 'bobS@samplecom', '987-654-3210', ARRAY['Answer A', 'Answer B', 'Answer C', 'Answer D']);
