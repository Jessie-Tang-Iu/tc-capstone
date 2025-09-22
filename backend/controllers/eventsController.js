/*
 * This file controls the requests between the API routes in the frontend and the events DB scripts.
 * It keeps DB logic out of the frontend, allows validation, and makes it easy to add Auth later.
 */

import * as events from "../database/scripts/events"; // Import DB functions

/** Get all events */
export async function getEventsController() {
  return await events.getAllEvents();
}

/** Get one event by ID */
export async function getEventByIdController(id) {
  if (!id) throw new Error("Event ID required");
  return await events.getEventById(Number(id));
}

/** Create new event */
export async function createEventController(body) {
  const {
    title,
    date,
    startTime,
    endTime,
    location,
    description,
    highlight,
    price,
  } = body;

  if (!title || !date || !location) {
    throw new Error("Title, date, and location are required");
  }

  return await events.createEvent({
    title,
    date,
    start_time: startTime ?? null,
    end_time: endTime ?? null,
    location,
    description,
    highlight: highlight ?? "",
    price: Number(price ?? 0),
  });
}

/** Update event by ID */
export async function updateEventController(id, body) {
  if (!id) throw new Error("Event ID required");

  const {
    title,
    date,
    startTime,
    endTime,
    location,
    description,
    highlight,
    price,
    status,
  } = body;

  return await events.updateEventById(Number(id), {
    title,
    date,
    start_time: startTime ?? null,
    end_time: endTime ?? null,
    location,
    description,
    highlight: highlight ?? "",
    price: Number(price ?? 0),
    status: status ?? undefined,
  });
}

/** Delete event by ID */
export async function deleteEventController(id) {
  if (!id) throw new Error("Event ID required");
  return await events.deleteEventById(Number(id));
}
