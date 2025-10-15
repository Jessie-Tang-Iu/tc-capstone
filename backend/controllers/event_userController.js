/*
 * This file controls the logic between the frontend API routes and the backend database functions
 * for event_user (user registrations for events).
 *
 * It handles data validation, error handling, and any auth checks (future).
 */

import * as eventUser from "../database/scripts/event_user.js";

// Get all event-user registrations (for admin)
export async function getAllEventUsersController() {
  return await eventUser.getAllEventUsers();
}

// Get all users for a specific event
export async function getUsersByEventController(eventId) {
  if (!eventId) throw new Error("Event ID required");
  return await eventUser.getUsersByEvent(eventId);
}

// Get all events that a specific user registered for
export async function getEventsByUserController(userId) {
  if (!userId) throw new Error("User ID required");
  return await eventUser.getEventsByUser(userId);
}
// Cancel a user's registration
export async function cancelEventUserController(eventId, userId) {
  if (!eventId || !userId) throw new Error("Event ID and User ID required");
  return await eventUser.cancelEventUser(eventId, userId);
}

// Check if a user is already registered for an event
export async function getEventsByClerkIdController(clerkId) {
  if (!clerkId) throw new Error("Clerk ID required");
  return await eventUser.getEventsByClerkId(clerkId);
}

//check if a user is already registered for an event
export async function registerEventUserController(eventId, clerkId) {
  if (!eventId || !clerkId) throw new Error("Event ID and Clerk ID required");

  const existing = await eventUser.getEventUser(eventId, clerkId);
  if (existing && existing.status === "registered") {
    throw new Error("Event already registered.");
  }
  return await eventUser.registerEventUser(eventId, clerkId);
}
