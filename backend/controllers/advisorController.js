/*
 * This file controls the requests between the api routes in the frontend and the backend scripts. 
 * This allows us to implement things like Auth checks in the future, also seperates our database from the frontend logic.
 * This also allows us to check data in a safe environment before sending it to the database, ESPECIALLY IMPORTANT if files are being uploaded.
*/

import * as advisor from "../database/scripts/advisor.js"; // Imports all scripts from the advisor.js file

// call this function to get all advisors
export async function getAllAdvisorsController() {
    return await advisor.getAllAdvisors();
}

// call this function to get an advisor by their id
export async function getAdvisorByIdController(advisorId) {
    if(!advisorId) throw new Error("advisorId required");
    return await advisor.getAdvisorById(advisorId);
}

// call this function to update an advisor profile
export async function updateAdvisorProfile(body) {
    if(!body.advisorId) throw new Error("advisorId required");
    return await advisor.updateAdvisorProfile({
        advisorId: body.advisorId,
        education: body.education,
        experience: body.experience,
    });
}
