// backend/database/events_crud.js
import { query } from "../../database/db.js";

/** Get all events (ordered by date ascending) */
export async function getAllEvents() {
  const result = await query(
    `SELECT id, title, date, start_time, end_time, location, description, highlight, price, status
       FROM events
   ORDER BY date ASC`
  );
  return result.rows;
}

/** Update just the status of an event */
export async function updateEventStatus(id, status) {
  await query(`UPDATE events SET status = $1 WHERE id = $2`, [status, id]);
}

/** Create a new event */
export async function createEvent(event) {
  const result = await query(
    `
    INSERT INTO events
      (title, date, start_time, end_time, location, description, highlight, price, status)
    VALUES
      ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING id, title, date, start_time, end_time, location, description, highlight, price, status
    `,
    [
      event.title,
      event.date,
      event.start_time ?? null,
      event.end_time ?? null,
      event.location,
      event.description,
      event.highlight ?? "",
      Number(event.price ?? 0),
      "active",
    ]
  );
  return result.rows[0];
}

/** Get an event by ID */
export async function getEventById(id) {
  const result = await query(
    `SELECT id, title, date, start_time, end_time, location, description, highlight, price, status
       FROM events
      WHERE id = $1`,
    [id]
  );
  return result.rows[0];
}

/** Update event by ID */
export async function updateEventById(id, e) {
  const result = await query(
    `UPDATE events
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
      e.status ?? null,
      id,
    ]
  );
  return result.rows[0];
}

/** Delete an event by ID */
export async function deleteEventById(id) {
  await query(`DELETE FROM events WHERE id = $1`, [id]);
}
