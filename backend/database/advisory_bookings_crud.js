// backend/database/message_crud.js
import { Pool } from "pg";
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function getAllBookings() {
  const { rows } = await pool.query(`SELECT * FROM advisory_bookings ORDER BY date ASC`);
  return rows;
}

export async function getBookingById(id) {
  const { rows } = await pool.query(`SELECT * FROM advisory_bookings WHERE id = $1`, [
    Number(id),
  ]);
  if (!rows.length) throw new Error("Not found");
  return rows[0];
}

export async function updateBookingStatus(id, status) {
  await pool.query(`UPDATE advisory_bookings SET status = $1 WHERE id = $2`, [
    status,
    Number(id),
  ]);
}

export async function createBooking(booking) {
  const query = `
    INSERT INTO advisory_bookings
      (advisor_id, client_id, date, startTime, description, endTime)
    VALUES
      ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;

  const values = [
    booking.advisorId,
    booking.clientId,
    booking.date,
    booking.start_time,
    booking.description,
    booking.end_time,
  ];

  const { rows } = await pool.query(query, values);
  return rows[0];
}
