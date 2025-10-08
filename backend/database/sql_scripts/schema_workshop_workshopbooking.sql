BEGIN;
-- Drop in FK-safe order (run only if you want a clean reset)
DROP TABLE IF EXISTS workshop_booking CASCADE;
DROP TABLE IF EXISTS workshop CASCADE;
DROP TABLE IF EXISTS users CASCADE;
-- Users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
	status VARCHAR(50) NOT NULL DEFAULT 'active',
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'member', 'advisor', 'employer')),
    clerk_id VARCHAR(255) UNIQUE NOT NULL,
	CONSTRAINT chk_status CHECK (status IN ('banned', 'active', 'underreview'))
);
-- Workshops
CREATE TABLE workshop (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    date DATE NOT NULL,
    start_time TIME,
    status TEXT NOT NULL DEFAULT 'active',
    location TEXT,
    description TEXT,
    image_url TEXT,
    "maxCapacity" INTEGER,
    "currentCapacity" INTEGER NOT NULL DEFAULT 0,
    "registrationDeadline" TIMESTAMP,
    supabase_id TEXT,
    -- optional external reference
    -- Guards
    CONSTRAINT chk_capacity_nonneg CHECK ("currentCapacity" >= 0),
    CONSTRAINT chk_capacity_bounds CHECK (
        "maxCapacity" IS NULL
        OR "currentCapacity" <= "maxCapacity"
    )
);
-- Workshop bookings
CREATE TABLE workshop_booking (
    id SERIAL PRIMARY KEY,
    "userID" INTEGER REFERENCES "users"(id) ON DELETE
    SET NULL,
        "workshopID" INTEGER REFERENCES workshop(id) ON DELETE CASCADE,
        status TEXT NOT NULL DEFAULT 'active',
        supabase_id TEXT,
        -- optional external reference
        -- prevent duplicate bookings per user/workshop
        CONSTRAINT uq_booking UNIQUE ("userID", "workshopID")
);
-- Helpful indexes
CREATE INDEX idx_workshop_date ON workshop (date, start_time);
CREATE INDEX idx_booking_user ON workshop_booking ("userID");
CREATE INDEX idx_booking_ws ON workshop_booking ("workshopID");
COMMIT;
--fix bug on 15/9/2025: missing attribute in workshop table
ALTER TABLE workshop
ADD COLUMN end_time TIME,
    ADD COLUMN highlight TEXT,
    ADD COLUMN price NUMERIC;