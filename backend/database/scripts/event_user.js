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

// -------------------------------
// Register a user for an event
// -------------------------------
export async function registerEventUser(eventId, clerkId) {
  // Step 1: find the local numeric user.id by Clerk ID
  const userRes = await query(`SELECT id FROM "user" WHERE clerk_id = $1`, [
    clerkId,
  ]);

  if (userRes.rows.length === 0) {
    throw new Error("User not found in local user table.");
  }

  const internalUserId = userRes.rows[0].id;

  // Step 2: insert registration
  const result = await query(
    `INSERT INTO event_user (event_id, user_id, status)
     VALUES ($1, $2, 'registered')
     ON CONFLICT (event_id, user_id)
     DO UPDATE SET status = 'registered', registered_at = now()
     RETURNING *`,
    [eventId, internalUserId]
  );

  return result.rows[0];
}

// -------------------------------
// Cancel a registration
// -------------------------------
export async function cancelEventUser(eventId, clerkId) {
  // Step 1: map Clerk ID to numeric ID
  const userRes = await query(`SELECT id FROM "user" WHERE clerk_id = $1`, [
    clerkId,
  ]);

  if (userRes.rows.length === 0) {
    throw new Error("User not found in local user table.");
  }

  const internalUserId = userRes.rows[0].id;

  // Step 2: update record
  const result = await query(
    `UPDATE event_user
     SET status = 'cancelled'
     WHERE event_id = $1 AND user_id = $2
     RETURNING *`,
    [eventId, internalUserId]
  );

  return result.rows[0];
}

// Check if user is already registered
export async function getEventUser(eventId, clerkId) {
  const userRes = await query(`SELECT id FROM "user" WHERE clerk_id = $1`, [
    clerkId,
  ]);

  if (userRes.rows.length === 0) return null;

  const internalUserId = userRes.rows[0].id;

  const result = await query(
    `SELECT * FROM event_user WHERE event_id = $1 AND user_id = $2`,
    [eventId, internalUserId]
  );
  return result.rows[0] || null;
}
