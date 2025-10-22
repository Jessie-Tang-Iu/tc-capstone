-- Recreate (or ALTER if you already have it)
DROP TABLE IF EXISTS job CASCADE;
DROP TABLE IF EXISTS job_industry CASCADE;
DROP TABLE IF EXISTS job_type CASCADE;
DROP TABLE IF EXISTS job_experience CASCADE;
DROP TABLE IF EXISTS job_workplace CASCADE;

-- Job related tables
CREATE TABLE job_industry (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);
CREATE TABLE job_type (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);
CREATE TABLE job_experience (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);
CREATE TABLE job_workplace (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

-- Main job table
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

-- INSERT DATA INTO USERS AND EMPLOYERS TABLE
-- users
INSERT INTO users (clerk_id, username, first_name, last_name, email, phone, role) VALUES 
('testEmployer1', 'TCcompany', 'Employer', 'A', 'employer1@techcorp.com', '403-555-1134', 'employer'),
('testEmployer2', 'HFcompany', 'Employer', 'B', 'employer2@healthfirst.com', '403-555-1334', 'employer'),
('testEmployer3', 'BTcompany', 'Employer', 'C', 'employer3@banktrust.com', '403-555-1434', 'employer'),
('testEmployer4', 'IBcompany', 'Employer', 'D', 'employer4@infrabuild.com', '403-555-1534', 'employer'),
('testEmployer5', 'BMacademy', 'Employer', 'E', 'employer5@brightminds.com', '403-555-1634', 'employer')
ON CONFLICT (clerk_id) DO NOTHING;

-- employers
INSERT INTO employers (company_id, clerk_id, company_name, company_role) VALUES
('testCompany1', 'testEmployer1', 'TechCorp company', 'HR assistant'),
('testCompany2', 'testEmployer2', 'HealthFirst company', 'project manager'),
('testCompany3', 'testEmployer3', 'BankTrust company', 'HR assistant'),
('testCompany4', 'testEmployer4', 'InfraBuild company', 'HR assistant'),
('testCompany5', 'testEmployer5', 'BrightMinds academy', 'HR assistant')
ON CONFLICT (clerk_id) DO NOTHING;

-- INSERT DATA INTO JOB TABLES
-- industries
INSERT INTO job_industry (name) VALUES
('IT'),
('Banking'),
('Insurance'),
('Healthcare'),
('Manufacturing'),
('Hospitality'),
('Transportation'),
('Construction'),
('Real Estate'),
('Marketing'),
('Sales'),
('Human Resources'),
('Legal'),
('Arts & Entertainment'),
('Non-Profit'),
('Government'),
('Telecommunications'),
('Education'),
('Retail'),
('Pharmaceutical'),
('Energy'),
('Agriculture'),
('Food & Beverage'),
('Consulting'),
('Media & Publishing'),
('Travel & Tourism'),
('Other');

-- types
INSERT INTO job_type (name) VALUES
('Full-time'),
('Part-time'),
('Contract'),
('Temporary'),
('Internship'),
('Co-op'),
('Volunteer'),
('Freelance'),
('Other');

-- experience
INSERT INTO job_experience (name) VALUES
('Entry'),
('Senior'),
('Mid-Senior'),
('Junior'),
('Associate'),
('Other');

-- workplaces
INSERT INTO job_workplace (name) VALUES
('On-site'),
('Remote'),
('Hybrid'),
('Other');

-- jobs
INSERT INTO job (title, employer_id, company_info, location, posted_at, industry_id, workplace_id, type_id, experience_id, salary_per_hour, link, description, responsibilities, requirements, details, benefits) VALUES
('Software Engineer', 'testEmployer1', 'TechCorp is a leading technology solutions provider specializing in cloud computing and AI-driven products.', 'Vancouver, BC', '2025-09-10', 1, 2, 1, 3, 32.35, 'https://techcorp.com/jobs/123', 'Develop and maintain software applications.', 'Design, code, test software.', 'Bachelors degree in Computer Science.', 'Full job details here.', 'Health insurance, 401k'),
('Nurse Practitioner', 'testEmployer2', 'HealthFirst operates a network of clinics focused on patient-centered care and innovative health solutions.', 'Calgary, AB', '2025-09-12', 4, 2, 2, 2, 45.00, 'https://healthfirst.com/careers/np', 'Provide primary and specialty healthcare services.', 'Diagnose and treat patients.', 'Registered Nurse with NP license.', 'Full job details here.', 'Comprehensive health benefits'),
('Financial Analyst', 'testEmployer3', 'BankTrust is a major Canadian bank offering a wide range of financial services to individuals and businesses.', 'Toronto, ON', '2025-09-08', 2, 3, 3, 3, 29.75, 'https://banktrust.com/jobs/finanalyst', 'Analyze financial data and trends.', 'Prepare reports and forecasts.', 'Degree in Finance or related field.', 'Full job details here.', 'Retirement plan, bonuses'),
('Civil Engineer', 'testEmployer4', 'InfraBuild specializes in large-scale infrastructure projects, including bridges, highways, and public works.', 'Edmonton, AB', '2025-09-11', 8, 2, 4, 3, 36.50, 'https://infrabuild.com/careers/civileng', 'Design and oversee construction projects.', 'Project management and site supervision.', 'P.Eng. designation required.', 'Full job details here.', 'Vehicle allowance, health benefits'),
('Teacher', 'testEmployer5', 'BrightMinds Academy is a private K-12 school dedicated to innovative teaching and student success.', 'Winnipeg, MB', '2025-09-09', 17, 1, 5, 1, 28.00, 'https://brightminds.ca/jobs/teacher', 'Teach and mentor students in assigned subjects.', 'Lesson planning and classroom management.', 'Teaching certificate required.', 'Full job details here.', 'Professional development, pension');

-- Questions field can include questions like:
UPDATE job
   SET questions = ARRAY[
    'Why are you interested in this position?',
    'Describe a challenging situation you faced at work and how you handled it.',
    'What are your salary expectations?',
    'When can you start?']
 WHERE id IN (1, 2, 3, 4, 5);