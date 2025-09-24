import { query } from "../../database/db.js";

// Get function

export async function getApplicationsByUser(id) {
  const { rows } = await query(`
    SELECT ap.id, jb.title, jb.company, jb.location, ap.status, ap.applied_at AS "appliedAt"
      FROM application ap JOIN job jb ON ap.job_id = jb.id
     WHERE user_id = $1 ORDER BY applied_at DESC`, [id]);
  return rows;
}

export async function getApplicationById(id) {
  const { rows } = await query(`
    SELECT  u.id AS userID, u.firstname AS userFN, u.lastname AS userLN, u.email AS userE, 
		        ap.id, ap.resume, ap.cover_letter, ap.status, ap.applied_at, ap.relative_first_name AS relativeFN, ap.relative_last_name AS relativeLN, ap.relative_email AS relativeE, ap.relative_phone AS relativeP, ap.answers,
		        jb.title, jb.company, jb.location, jb.questions
      FROM application ap JOIN job jb ON ap.job_id = jb.id
                          JOIN public."user" u ON u.id = ap.user_id
     WHERE ap.id = $1`, [id]);
  return rows[0];
}

export async function getResumeByUser(id) {
  const { rows } = await query(`
    SELECT * FROM resume WHERE user_id = $1`, [id]);
  return rows[0];
}

export async function getCoverLetterByUser(id) {
  const { rows } = await query(`
    SELECT * FROM cover_letter WHERE user_id = $1`, [id]);
  return rows[0];
}

// Create functions

export async function createApplication(app) {
  const { rows } = await query( `
    INSERT INTO application (user_id, job_id, resume, cover_letter, relative_first_name, relative_last_name, relative_email, relative_phone, answers)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *`,
  [
    app.user_id,
    Number (app.job_id),
    app.resume,
    app.cover_letter,
    app.relative_first_name,
    app.relative_last_name,
    app.relative_email,
    app.relative_phone,
    app.answers
  ]);
  return rows[0];
}

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

export async function createCoverLetter(coverLetter) {
  const query = `
    INSERT INTO cover_letter (user_id, upload_at, content)
    VALUES ($1, NOW(), $2)`;
  const values = [
    coverLetter.userId,
    coverLetter.content
  ];
  const { rows } = await query(query, values);
  return rows[0];
}

// Update function

export async function updateApplicationStatus(id, status) {
  const { rows } = await query(`
    UPDATE application SET status = $1 WHERE id = $2 RETURNING *`, [status, id]);
  return rows[0];
}

export async function updateResume(resume) {
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
    resume.user_id
  ];
  const { rows } = await query(query, values);
  return rows[0];
}

export async function updateCoverLetter(coverLetter) {
  const query = `
    UPDATE cover_letter SET upload_at = NOW(), content = $1
     WHERE user_id = $2 RETURNING *`;
  const values = [
    coverLetter.content,
    coverLetter.user_id
  ];
  const { rows } = await query(query, values);
  return rows[0];
}