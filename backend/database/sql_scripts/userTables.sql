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
    status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('banned', 'active', 'under-review'))
);

CREATE TABLE employers (
    clerk_id VARCHAR(255) PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    company_role VARCHAR(100) NOT NULL,
    company_id VARCHAR(100),
    CONSTRAINT fk_employer_user FOREIGN KEY (clerk_id) REFERENCES users(clerk_id) ON DELETE CASCADE
);

CREATE TABLE advisors (
    clerk_id VARCHAR(255) PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    company_role VARCHAR(100) NOT NULL,
    CONSTRAINT fk_advisor_user FOREIGN KEY (clerk_id) REFERENCES users(clerk_id) ON DELETE CASCADE
);
