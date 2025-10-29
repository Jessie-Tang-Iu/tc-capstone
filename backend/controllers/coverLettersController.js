import * as cvs from "../database/scripts/coverLetter.js";

// Call the getCoverLetterByUser function
export async function getCoverLetterByUser(id) {
    return await cvs.getCoverLetterByUser(id);
}

// Call the createCoverLetter function
export async function createCoverLetter(coverLetter) {
    if (!coverLetter.user_id || !coverLetter.content)
        throw new Error("Missing required information");
    return await cvs.createCoverLetter(coverLetter);
}

// Call the updateCoverLetter function
export async function updateCoverLetterByUser(id, coverLetter) {
    if (!coverLetter.content)
        throw new Error("Missing required information");
    return await cvs.updateCoverLetterByUser(id, coverLetter);
}