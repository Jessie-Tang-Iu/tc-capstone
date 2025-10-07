import { query } from "../db.js";

// Get all registrations (optional: for admin use)
export async function getAllEventUsers() {
  const result = await query(
    `SELECT * FROM event_user ORDER BY registered_at DESC`
  );
  return result.rows;
}

// Get all users registered for one event
export async function getUsersByEvent(eventId) {
  const result = await query(
    `SELECT * FROM event_user WHERE event_id = $1 ORDER BY registered_at DESC`,
    [eventId]
  );
  return result.rows;
}

// Get all events that one user registered for
export async function getEventsByUser(userId) {
  const result = await query(
    `SELECT * FROM event_user WHERE user_id = $1 ORDER BY registered_at DESC`,
    [userId]
  );
  return result.rows;
}

// Register a user for an event
export async function registerEventUser(eventId, userId) {
  const result = await query(
    `INSERT INTO event_user (event_id, user_id, status)
     VALUES ($1, $2, 'registered')
     ON CONFLICT (event_id, user_id)
     DO UPDATE SET status = 'registered', registered_at = now()
     RETURNING *`,
    [eventId, userId]
  );
  return result.rows[0];
}

// Cancel a registration
export async function cancelEventUser(eventId, userId) {
  const result = await query(
    `UPDATE event_user
     SET status = 'cancelled'
     WHERE event_id = $1 AND user_id = $2
     RETURNING *`,
    [eventId, userId]
  );
  return result.rows[0];
}

// Check if user is already registered
export async function getEventUser(eventId, userId) {
  const result = await query(
    `SELECT * FROM event_user WHERE event_id = $1 AND user_id = $2`,
    [eventId, userId]
  );
  return result.rows[0] || null;
}
