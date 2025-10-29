import * as resumes from "../database/scripts/resumes.js";

// Call the getResumeByUser function
export async function getResumeByUser(id) {
    return await resumes.getResumeByUser(id);
}

// Call the createResume function
export async function createResume(resume) {
    if (!resume.user_id || !resume.summary || !resume.education)
        throw new Error("Missing required information");
    return await resumes.createResume(resume);
}

// Call the updateResume function
export async function updateResumeByUser(id, resume) {
    if (!resume.user_id || !resume.summary || !resume.education)
        throw new Error("Missing required information");
    return await resumes.updateResumeByUser(id, resume);
}