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
export async function registerEventUser(eventId, clerkId) {
  const userRes = await query(
    `SELECT clerk_id FROM users WHERE clerk_id = $1`,
    [clerkId]
  );

  if (userRes.rows.length === 0) {
    throw new Error("User not found in local users table.");
  }

  const result = await query(
    `INSERT INTO event_user (event_id, user_id, status)
     VALUES ($1, $2, 'registered')
     ON CONFLICT (event_id, user_id)
     DO UPDATE SET status = 'registered', registered_at = now()
     RETURNING *`,
    [eventId, clerkId]
  );

  return result.rows[0];
}

// Cancel a registration
export async function cancelEventUser(eventId, clerkId) {
  const result = await query(
    `UPDATE event_user
     SET status = 'cancelled'
     WHERE event_id = $1 AND user_id = $2
     RETURNING *`,
    [eventId, clerkId]
  );
  return result.rows[0];
}

// Get all events by clerk_id
export async function getEventsByClerkId(clerkId) {
  const userRes = await query(
    `SELECT clerk_id FROM users WHERE clerk_id = $1`,
    [clerkId]
  );
  if (userRes.rows.length === 0) {
    throw new Error("User not found in local users table.");
  }

  const result = await query(
    `
    SELECT e.id, e.title, e.date, e.start_time, e.end_time, e.location, e.description
    FROM event_user eu
    JOIN events e ON e.id = eu.event_id
    WHERE eu.user_id = $1 AND eu.status = 'registered'
    ORDER BY e.date, e.start_time
    `,
    [clerkId]
  );

  return result.rows;
}

// Get one event_user record
export async function getEventUser(eventId, clerkId) {
  const userRes = await query(
    `SELECT clerk_id FROM users WHERE clerk_id = $1`,
    [clerkId]
  );
  if (userRes.rows.length === 0) return null;

  const result = await query(
    `SELECT * FROM event_user WHERE event_id = $1 AND user_id = $2`,
    [eventId, clerkId]
  );

  return result.rows[0] || null;
}
