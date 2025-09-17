// backend/database/job_crud.js
import { Pool } from "pg";
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function getApplicationsByUser(id) {
  const { rows } = await pool.query(`
    SELECT ap.id, jb.title, jb.company, jb.location, ap.status, ap.applied_at AS "appliedAt"
      FROM application ap JOIN job jb ON ap.job_id = jb.id
     WHERE user_id = $1 ORDER BY applied_at DESC`, [id]);
  return rows;
}

export async function getApplicationById(id) {
  const { rows } = await pool.query(`
    SELECT  u.id AS userID, u.firstname AS userFN, u.lastname AS userLN, u.email AS userE, 
		        ap.id, ap.resume, ap.cover_letter, ap.status, ap.applied_at, ap.relative_first_name AS relativeFN, ap.relative_last_name AS relativeLN, ap.relative_email AS relativeE, ap.relative_phone AS relativeP, ap.answers,
		        jb.title, jb.company, jb.location, jb.questions
      FROM application ap JOIN job jb ON ap.job_id = jb.id
                          JOIN public."user" u ON u.id = ap.user_id
     WHERE ap.id = $1`, [id]);
  return rows[0];
}

export async function getResumeByUser(id) {
  const { rows } = await pool.query(`
    SELECT * FROM resume WHERE user_id = $1`, [id]);
  return rows[0];
}

export async function getCoverLetterByUser(id) {
  const { rows } = await pool.query(`
    SELECT * FROM cover_letter WHERE user_id = $1`, [id]);
  return rows[0];
}

export async function createApplication(app) {
  const query = `
    INSERT INTO application (user_id, job_id, status, applied_at, resume, cover_letter, relative_first_name, relative_last_name, relative_email, relative_phone, answers)
    VALUES ($1, $2, 'P', NOW(), $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)`
  
  const values = [
    app.userId,
    app.jobId,
    app.status,
    app.appliedAt,
    app.resume,
    app.coverLetter,
    app.firstName,
    app.lastName,
    app.email,
    app.phone,
    app.answers
  ];
  const { rows } = await pool.query(query, values);
  return rows[0];
}

export async function createResume(resume) {
  const query = `
    INSERT INTO resume (user_id, upload_at, summary, skills, experience, education, certifications, additional_info)
    VALUES ($1, NOW(), $2, $3, $4, $5, $6, $7)`;
  const values = [
    resume.userId,
    resume.summary,
    resume.skills,
    resume.experience,
    resume.education,
    resume.certifications,
    resume.additionalInfo
  ];
  const { rows } = await pool.query(query, values);
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
  const { rows } = await pool.query(query, values);
  return rows[0];
}

export async function updateApplicationStatus(id, status) {
  const { rows } = await pool.query(`
    UPDATE application SET status = $1 WHERE id = $2 RETURNING *`, [status, id]);
  return rows[0];
}

export async function updateResume(userId, resume) {
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
    userId
  ];
  const { rows } = await pool.query(query, values);
  return rows[0];
}

export async function updateCoverLetter(userId, coverLetter) {
  const query = `
    UPDATE cover_letter SET upload_at = NOW(), content = $1
     WHERE user_id = $2 RETURNING *`;
  const values = [
    coverLetter.content,
    userId
  ];
  const { rows } = await pool.query(query, values);
  return rows[0];
}