import { query } from "../../database/db.js"

// Get function
export async function getResumeByUser(id) {
  const { rows } = await query(`
    SELECT r.user_id AS user_id, first_name, last_name, email, summary, education, certifications, experience, skills, additional_info  
      FROM resume r JOIN users u ON u.clerk_id = r.user_id
     WHERE user_id = $1`, [id]);
  return rows[0];
}

// Create functions
export async function createResume(resume) {
  const { rows } = await query(`
    INSERT INTO resume (user_id, upload_at, summary, skills, experience, education, certifications, additional_info)
    VALUES ($1, NOW(), $2, $3, $4, $5, $6, $7) RETURNING *`,
  [
    resume.user_id,
    resume.summary,
    resume.skills,
    resume.experience,
    resume.education,
    resume.certifications,
    resume.additionalInfo
  ]);
  return rows[0];
}

// Update function
export async function updateResumeByUser(id, resume) {
  const query = `
    UPDATE resume 
       SET upload_at = NOW(), summary = $1, skills = $2, experience = $3, education = $4, certifications = $5, additional_info = $6
     WHERE user_id = $7 RETURNING *`;
  const values = [
    resume.summary,
    resume.skills,
    resume.experience,
    resume.education,
    resume.certifications,
    resume.additionalInfo,
    id
  ];
  const { rows } = await query(query, values);
  return rows[0];
}