// backend/database/advisory_bookings_crud.js
import { Pool } from "pg";
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function getAllBookings() {
  const { rows } = await pool.query(`SELECT * FROM advisory_bookings ORDER BY date ASC`);
  return rows;
}

export async function getBookingsByAdvisorId(id) {
  const { rows } = await pool.query(`SELECT * FROM advisory_bookings WHERE advisor_id = $1`, 
    [id]
  );
  if (!rows.length) throw new Error("Not found");
  return rows;
}

export async function getBookingByBookingId(id) {
  const { rows } = await pool.query(`SELECT * FROM advisory_bookings WHERE booking_id = $1`, [
    Number(id),
  ]);
  if (!rows.length) throw new Error("Not found");
  return rows[0];
}

export async function addAvailability(booking) {
  const query = `
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

  const { rows } = await pool.query(query, values);
  return rows[0];
}

export async function deleteAvailability(id) {
  await pool.query(`DELETE FROM advisory_bookings WHERE booking_id = $1`, [
      Number(id),
    ]);
}
