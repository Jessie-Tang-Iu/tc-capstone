/*
 * This file controls the requests between the api routes in the frontend and the backend scripts. 
 * This allows us to implement things like Auth checks in the future, also seperates our database from the frontend logic.
 * This also allows us to check data in a safe environment before sending it to the database, ESPECIALLY IMPORTANT if files are being uploaded.
*/

import * as advisoryService from "../database/scripts/advisoryService.js"; // Imports all scripts from the advisoryService.js file

// Receives the advisoryId from the frontend and calls the database to get the availability for the calendar. (Throws error if no postId is provided)
export async function getBookingsController(advisorId) {
    if(!advisorId) throw new Error("advisorId required");
    return await advisoryService.getBookingsByAdvisorId(advisorId);
}

export async function createAvailabilityController(body) {
    if(!body) throw new Error("Availability content required");
    return await advisoryService.addAvailability(body);
}

export async function deleteAvailabilityController(bookingId) {
    if(!bookingId) throw new Error("bookingId required");
    return await advisoryService.deleteAvailability(bookingId);
}

export async function updateAvailabilityController(body) {
    if(!body) throw new Error("Availability content required");
    return await advisoryService.updateAvailability(body);
}

export async function getAdvisorySessionsByAdvisorIdController(advisorId) {
    if(!advisorId) throw new Error("advisorId required");
    return await advisoryService.getAdvisorySessionsByAdvisorId(advisorId);
}

export async function changeClientStatusController(sessionId, status) {
    if(!sessionId || !status) throw new Error("sessionId and status are required");
    return await advisoryService.changeClientStatus(sessionId, status);
}

export async function getMyAdvisorySessionsController(clientId) {
    if(!clientId) throw new Error("clientId required");
    return await advisoryService.getMyAdvisorySessions(clientId);
}

export async function registerAdvisorySessionController(body) {
    if (!body) throw new Error("Registration Information is required");
    return await advisoryService.registerAdvisorySession(body);
}

export async function makeBookingController(body)  {
    if (!body) throw new Error("Booking content required");
    console.log("Booking controller received:", body);
    const result = await advisoryService.makeBooking(body);
    console.log("Booking controller result:", result);
    return result;
}