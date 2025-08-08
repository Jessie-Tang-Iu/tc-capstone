/**
 * @typedef {Object} Workshop
 * @property {number} id
 * @property {string} title
 * @property {string} date
 * @property {string} start_time
 * @property {string} end_time
 * @property {string} location
 * @property {string} description
 * @property {string} status
 */

/** @type {Event} */
export const exampleEvent = {
  id: 1,
  title: "Sample Event",
  date: "2025-09-01",
  start_time: "18:00:00",
  end_time: "20:00:00",
  location: "Online",
  description: "This is a sample event for demonstration.",
  status: "active", // e.g., "active", "cancelled", "completed"
};

/**
 * @typedef {Object} WorkshopBooking
 * @property {number} id - Primary key
 * @property {string} created_at - Timestamp of registration
 * @property {number} userID - ID of the registered user
 * @property {number} workshopID - ID of the workshop
 * @property {string} status - Booking status (e.g., "active", "cancelled")
 */

/** @type {WorkshopBooking} */
export const exampleBooking = {
  id: 1,
  created_at: "2025-08-08T18:00:00.000Z",
  userID: 1,
  workshopID: 2,
  status: "active",
};
