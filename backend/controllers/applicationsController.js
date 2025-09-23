import * as apps from "../scripts/applications.js";

// Call the getApplicationsByUser function
export async function getApplicationsByUser(id) {
    return await apps.getApplicationsByUser(id);
}

// Call the getApplicationById function
export async function getApplicationById(id) {
    return await apps.getApplicationById(id);
}

// Call the getResumeByUser function
export async function getResumeByUser(id) {
    return await apps.getResumeByUser(id);
}

// Call the getCoverLetterByUser function
export async function getCoverLetterByUser(id) {
    return await apps.getCoverLetterByUser(id);
}

// Call the createApplication function
export async function createApplication(app) {
    if (!app.user_id || !app.job_id || !app.answers)
        throw new Error("Missing required information");
    console.log(app);
    return await apps.createApplication(app);
}

// Call the createResume function
export async function createResume(resume) {
    if (!resume.user_id || !resume.summary || !resume.skills || !resume.education || !resume.experience)
        throw new Error("Missing required information");
    return await apps.createResume(resume);
}

// Call the createCoverLetter function
export async function createCoverLetter(coverLetter) {
    if (!coverLetter.user_id || !coverLetter.content)
        throw new Error("Missing required information");
    return await apps.createCoverLetter(coverLetter);
}

// Call the updateApplicationStatus function 
export async function updateApplicationStatus(body) {
    const { id, status } = body;
    if (!id || !status) throw new Error("Missing required information");
    return await apps.updateApplicationStatus(id, status);
}

// Call the updateResume function
export async function updateResume(resume) {
    if (!resume.user_id || !resume.summary || !resume.skills || !resume.education || !resume.experience)
        throw new Error("Missing required information");
    return await apps.updateResume(resume);
}

// Call the updateCoverLetter function
export async function updateCoverLetter(coverLetter) {
    if (!coverLetter.user_id || !coverLetter.content)
        throw new Error("Missing required information");
    return await apps.updateCoverLetter(coverLetter);
}