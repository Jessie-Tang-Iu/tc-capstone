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
    -- employer_id      TEXT NOT NULL,
    title               TEXT NOT NULL,
    company             TEXT NOT NULL,
    location            TEXT NOT NULL,
    industry_id         INT REFERENCES job_industry(id),
    workplace_id        INT REFERENCES job_workplace(id),
    type_id             INT REFERENCES job_type(id),
    experience_id       INT REFERENCES job_experience(id),
    status              CHAR(1) NOT NULL DEFAULT 'A', -- A: Active, I: Inactive
    salary_per_hour     NUMERIC(5, 2),
    link                TEXT,
    description         TEXT,
    responsibilities    TEXT,
    requirements        TEXT,
    details             TEXT,
    benefits            TEXT,
    posted_at           TIMESTAMP NOT NULL DEFAULT now()
    CONSTRAINT chk_status CHECK (status IN ('A', 'I'))
);

-- Insert data into job tables
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

INSERT INTO job_experience (name) VALUES
('Entry'),
('Senior'),
('Mid-Senior'),
('Junior'),
('Associate'),
('Other');

INSERT INTO job_workplace (name) VALUES
('On-site'),
('Remote'),
('Hybrid'),
('Other');

INSERT INTO job (title, company, location, posted_at, industry_id, workplace_id, type_id, experience_id, salary_per_hour, link, description, responsibilities, requirements, details, benefits) VALUES
('Software Engineer', 'TechCorp', 'Vancouver, BC', '2025-09-10', 1, 3, 1, 3, 32.35, 'https://techcorp.com/jobs/123', 'Develop and maintain software applications.', 'Design, code, test software.', 'Bachelors degree in Computer Science.', 'Full job details here.', 'Health insurance, 401k'),
('Data Analyst', 'DataSolutions', 'Montreal, QC', '2025-09-05', 1, 2, 1, 2, 27.45, 'https://datasolutions.com/careers/456', 'Analyze data to support business decisions.', 'Collect and analyze data sets.', 'Experience with SQL and Python.', 'Full job details here.', 'Flexible hours'),
('Marketing Manager', 'MarketMakers', 'Calgary, AB', '2025-08-15', 10, 1, 1, 4, 38.35, 'https://marketmakers.com/jobs/789', 'Lead marketing campaigns and strategies.', 'Plan and execute marketing initiatives.', '5+ years in marketing roles.', 'Full job details here.', 'Bonuses and commissions'),
('Sales Associate', 'RetailWorld', 'Edmonton, AB', '2025-08-21', 19, 1, 2, 1, 24.15, 'https://retailworld.com/careers/101', 'Assist customers and drive sales.', 'Customer service and sales.', 'High school diploma.', 'Full job details here.', 'Employee discounts'),
('Project Manager', 'BuildIt', 'Toronto, ON', '2025-08-10', 8, 1, 1, 3, 35.95, 'https://buildit.com/jobs/202', 'Manage construction projects from start to finish.', 'Oversee project timelines and budgets.', 'PMP certification preferred.', 'Full job details here.', 'Health benefits');