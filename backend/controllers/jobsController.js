import * as jobs from "../database/scripts/jobs.js";

// Call the getAllJobPosts function
export async function getJobsController() {
  return await jobs.getAllJobPosts();
}

// Call ther getJobPostById function
export async function getJobPostById(id) {
  return await jobs.getJobPostById(id);
}

// Call the getJobPostsByEmployerId function
export async function getJobsByEmployerId(id) {
  return await jobs.getJobPostByEmployerId(id);
}

// Call the getAllJobExperience function
export async function getJobExperience() {
  return await jobs.getAllJobExperience();
}

// Call the getAllJobTypes function
export async function getJobTypes() {
  return await jobs.getAllJobTypes();
}

// Call the getAllJobIndustries function
export async function getJobIndustries() {
  return await jobs.getAllJobIndustries();
}

// Call the getAllJobWorkplaces function
export async function getJobWorkplaces() {
  return await jobs.getAllJobWorkplaces();
}

// Call the createJobPost function
export async function createJobPost(post) {
  if (!post.title || !post.company || !post.location)
    throw new Error(
      "Missing required information: title, company, or location"
    );

  if (post.salaryPerHour == null || isNaN(post.salaryPerHour))
    throw new Error("Invalid salary value");

  return await jobs.createJobPost(post);
}
