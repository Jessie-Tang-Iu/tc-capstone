import { query } from "../../database/db.js";

// Gets all bookings ordered by date
export async function getAllBookings() {
  const result  = await query(`SELECT * FROM advisory_bookings ORDER BY date ASC`);
  return result.rows;
}

// Get all bookings by advisoryId
export async function getBookingsByAdvisorId(id) {
  const result = await query(`SELECT a.*, u.clerk_id, u.username, u.first_name, u.last_name, u.email, u.phone, u.role FROM advisory_bookings a 
                              LEFT OUTER JOIN public.users u
                              ON a.client_id = u.clerk_id
                              WHERE advisor_id = $1`, 
    [id]
  );
  if (!result.rows.length) throw new Error("Not found");
  return result.rows;
}

// Get the booking by bookingId
export async function getBookingByBookingId(id) {
  const result = await query(`SELECT * FROM advisory_bookings WHERE booking_id = $1`, [
    Number(id),
  ]);
  if (!result.rows.length) throw new Error("Not found");
  return result.rows[0];
}

// Add an availability to the table
export async function addAvailability(booking) {
  const sql = `
    INSERT INTO advisory_bookings
      (advisor_id, date, startTime, endTime, status)
    VALUES
      ($1, $2, $3, $4, $5)
    RETURNING *;
  `;

  const values = [
    booking.advisorId,
    booking.date,
    booking.start_time,
    booking.end_time,
    booking.status,
  ];

  const result = await query(sql, values);
  return result.rows[0];
}

// Delete an availability by bookingId
export async function deleteAvailability(id) {
  await query(`DELETE FROM advisory_bookings WHERE booking_id = $1`, [
      Number(id),
    ]);
}

// Update an availability's details 
export async function updateAvailability(booking) {
  const sql = `
  UPDATE advisory_bookings
    SET date=$2,
        startTime=$3,
        endTime=$4
    WHERE booking_id = $1
    RETURNING booking_id, date, startTime, endTime`;

  const values = [
    booking.bookingId,
    booking.date,
    booking.start_time,
    booking.end_time,
  ];

  const result = await query(sql, values);
  if (result.rows.length === 0) {
    throw new Error("Update failed: booking not found");
  }
  return result.rows[0];
}

export async function getAdvisorySessionsByAdvisorId(advisorId) {
  const result = await query(`SELECT a.*, u.clerk_id, u.username, u.first_name, u.last_name, u.email, u.phone, u.role FROM advisory_sessions a 
                                JOIN users u
                                ON a.client_id = u.clerk_id
                                WHERE a.advisor_id = $1`, [
    advisorId,
  ]);
  console.log("Query result:", result.rows);
  return result.rows;
}

export async function changeClientStatus(sessionId, status) {
  const result = await query(`UPDATE advisory_sessions SET status = $2 WHERE session_id = $1 RETURNING *`,[
    sessionId,
    status
  ]);
  return result.rows[0];
}

export async function getMyAdvisorySessions(clientId) {
  const result = await query(`SELECT a.session_id, a.advisor_id, a.client_id, a.message, a.status, u.first_name, u.last_name, u.email, ad.company_role, ad.company_name
                              FROM advisory_sessions a
                              LEFT OUTER JOIN users u
                              ON a.advisor_id = u.clerk_id
                              LEFT OUTER JOIN advisors ad
                              ON ad.clerk_id = a.advisor_id
                              WHERE a.client_id = $1`, [
    clientId,
  ]);
  return result.rows;
}

export async function registerAdvisorySession(session) {
  const sql = `
    INSERT INTO advisory_sessions
      (advisor_id, client_id, message, status)
    VALUES
      ($1, $2, $3, $4)
    RETURNING *;
  `;

  const values = [
    session.advisorId,
    session.clientId,
    session.message,
    session.status,
  ];

  const result = await query(sql, values);
  return result.rows[0];
}

export async function makeBooking(booking)  {
  const sql = `
  UPDATE advisory_bookings
    SET client_id=$2,
        description=$3,
        status=$4
    WHERE booking_id = $1
    RETURNING booking_id, client_id, description, status`;

  const values = [
    Number(booking.bookingId),
    booking.clientId,
    booking.description,
    booking.status,
  ];

  const result = await query(sql, values);
  if (result.rows.length === 0) {
    throw new Error("Booking failed: booking not found");
  }
  return result.rows[0];
}