BEGIN;

DROP TABLE IF EXISTS advisory_bookings CASCADE;
-- advisory bookings table
CREATE TABLE advisory_bookings (
    booking_id SERIAL PRIMARY KEY,
    advisor_id UUID NOT NULL,
    client_id UUID,
    date DATE,
    startTime TIME,
    description TEXT,
    endTime TIME
);

INSERT INTO advisory_bookings (advisor_id, client_id, date, startTime, description, endTime) VALUES 
('99999999-9999-9999-9999-999999999999', '11111111-1111-1111-1111-111111111111', '2025-09-22', '12:00:00', 'I need some advise on my front-end project', '14:00:00');

COMMIT;