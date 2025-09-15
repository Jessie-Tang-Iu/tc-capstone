// backend/database/workshop_crud.js
import { Pool } from "pg";
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function getAllEvents() {
  const { rows } = await pool.query(`SELECT * FROM workshop ORDER BY date ASC`);
  return rows;
}

export async function getEventById(id) {
  const { rows } = await pool.query(`SELECT * FROM workshop WHERE id = $1`, [
    Number(id),
  ]);
  if (!rows.length) throw new Error("Not found");
  return rows[0];
}

export async function updateEventStatus(id, status) {
  await pool.query(`UPDATE workshop SET status = $1 WHERE id = $2`, [
    status,
    Number(id),
  ]);
}

export async function createEvent(event) {
  const query = `
    INSERT INTO workshop
      (title, date, start_time, end_time, location, description, highlight, price, status)
    VALUES
      ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *;
  `;

  const values = [
    event.title,
    event.date,
    event.startTime,
    event.endTime,
    event.location,
    event.description,
    event.highlight,
    event.price,
    "active",
  ];

  const { rows } = await pool.query(query, values);
  return rows[0];
}
