// backend/database/workshop_crud.js
import { Pool } from "pg";
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function getAllEvents() {
  const { rows } = await pool.query(`SELECT * FROM workshop ORDER BY date ASC`);
  return rows;
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

export async function getEventById(id) {
  const { rows } = await pool.query(
    `SELECT id, title, date, start_time, end_time, location, description, highlight, price, status
     FROM workshop
     WHERE id = $1`,
    [id]
  );
  return rows[0];
}

export async function updateEventById(id, e) {
  // Build update list (status is optional)
  const { rows } = await pool.query(
    `UPDATE workshop
        SET title=$1,
            date=$2,
            start_time=$3,
            end_time=$4,
            location=$5,
            description=$6,
            highlight=$7,
            price=$8,
            status=COALESCE($9, status)
      WHERE id=$10
      RETURNING id, title, date, start_time, end_time, location, description, highlight, price, status`,
    [
      e.title,
      e.date,
      e.start_time ?? null,
      e.end_time ?? null,
      e.location,
      e.description,
      e.highlight ?? "",
      Number(e.price ?? 0),
      e.status ?? null, // if undefined, keep existing
      id,
    ]
  );
  return rows[0];
}

export async function deleteEventById(id) {
  await pool.query(`DELETE FROM workshop WHERE id = $1`, [id]);
}
