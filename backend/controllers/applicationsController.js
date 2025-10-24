import * as apps from "../database/scripts/applications.js";

// Call the getApplicationsByUser function
export async function getApplicationsByUser(id) {
    return await apps.getApplicationsByUser(id);
}

// Call the getApplicationById function
export async function getApplicationById(id) {
    return await apps.getApplicationById(id);
}

// Call the createApplication function
export async function createApplication(app) {
    if (!app.user_id || !app.job_id || !app.answers)
        throw new Error("Missing required information");
    console.log(app);
    return await apps.createApplication(app);
}

// Call the updateApplicationStatus function 
export async function updateApplicationStatus(id, status) {
    if (!id || !status) throw new Error("Missing required information");
    return await apps.updateApplicationStatus(id, status);
}