DROP TABLE IF EXISTS employers CASCADE;
DROP TABLE IF EXISTS advisors CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
    clerk_id VARCHAR(255) PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'member', 'advisor', 'employer')),
);

CREATE TABLE employers (
    employer_id SERIAL PRIMARY KEY,
    clerk_id PRIMARY KEY,
    user_id INT UNIQUE NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    company_role VARCHAR(100) NOT NULL,
    company_id VARCHAR(100),
    CONSTRAINT fk_employer_user FOREIGN KEY (clerk_id) REFERENCES users(clerk_id) ON DELETE CASCADE
);

CREATE TABLE advisors (
    advisor_id SERIAL PRIMARY KEY,
    clerk_id PRIMARY KEY,
    user_id INT UNIQUE NOT NULL,
    advisor_title VARCHAR(100) NOT NULL,
    company_name VARCHAR(255),
    CONSTRAINT fk_advisor_user FOREIGN KEY (clerk_id) REFERENCES users(clerk_id) ON DELETE CASCADE
);
