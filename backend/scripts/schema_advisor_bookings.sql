BEGIN;

DROP TABLE IF EXISTS advisory_bookings CASCADE;
-- advisory bookings table
CREATE TABLE advisory_bookings (
    booking_id SERIAL PRIMARY KEY,
    advisor_id TEXT NOT NULL,
    client_id TEXT,
    date DATE,
    startTime TIME,
    description TEXT,
    endTime TIME,
    status TEXT
);

-- test data
INSERT INTO advisory_bookings (advisor_id, client_id, date, startTime, description, endTime, status) VALUES 
('99999999-9999-9999-9999-999999999999', '11111111-1111-1111-1111-111111111111', '2025-09-16', '10:00:00', 'I need some advise on my front-end project', '12:00:00', 'booked'),
('99999999-9999-9999-9999-999999999999', '11111111-1111-1111-1111-111111111111', '2025-09-22', '12:00:00', 'I need some advise on my front-end project', '14:00:00', 'booked'),
('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', '2025-09-22', '12:00:00', 'I need some advise on my front-end project', '14:00:00', 'booked');

INSERT INTO advisory_bookings (advisor_id, date, startTime, endTime, status) VALUES 
('99999999-9999-9999-9999-999999999999', '2025-09-14', '10:00:00', '12:00:00', 'open'),
('99999999-9999-9999-9999-999999999999', '2025-09-16', '12:00:00', '14:00:00', 'open'),
('99999999-9999-9999-9999-999999999999', '2025-09-17', '12:00:00', '14:00:00', 'open'),
('99999999-9999-9999-9999-999999999999', '2025-09-17', '14:00:00', '16:00:00', 'open'),
('99999999-9999-9999-9999-999999999999', '2025-09-18', '11:00:00', '13:00:00', 'open'),
('99999999-9999-9999-9999-999999999999', '2025-09-19', '10:00:00', '12:00:00', 'open'),
('22222222-2222-2222-2222-222222222222', '2025-09-20', '10:00:00', '12:00:00', 'open');

COMMIT;