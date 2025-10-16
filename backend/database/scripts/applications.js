import { query } from "../../database/db.js";

const streamToBuffer = (stream) => {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks)));
  });
}

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
    SELECT  u.first_name, u.last_name, u.email, u.phone,
		        ap.id, ap.user_id, ap.resume_name, ap.resume_data, ap.cover_letter_name, ap.cover_letter_data, ap.status, ap.applied_at, ap.relative_first_name, ap.relative_last_name, ap.relative_email, ap.relative_phone, ap.answers,
		        jb.title, jb.company, jb.location, jb.questions
      FROM application ap JOIN job jb ON ap.job_id = jb.id
                          JOIN users u ON u.clerk_id = ap.user_id
     WHERE ap.id = $1`, [id]);
  return rows[0];
}

export async function getResumeByUser(id) {
  const { rows } = await query(`
    SELECT r.user_id AS user_id, first_name, last_name, email, summary, education, certifications, experience, skills, additional_info  
      FROM resume r JOIN users u ON u.clerk_id = r.user_id
     WHERE user_id = $1`, [id]);
  return rows[0];
}

export async function getCoverLetterByUser(id) {
  const { rows } = await query(`
    SELECT cv.user_id AS user_id, first_name, last_name, email, content
      FROM cover_letter cv JOIN users u ON u.clerk_id = cv.user_id
     WHERE user_id = $1`, [id]);
  return rows[0];
}

// Create functions

export async function createApplication(app) {
  // console.log(streamToBuffer(app.resume_data));
  const { rows } = await query( `
    INSERT INTO application (user_id, job_id, resume_name, resume_data, cover_letter_name, cover_letter_data, relative_first_name, relative_last_name, relative_email, relative_phone, answers)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    RETURNING *`,
  [
    app.user_id,
    Number (app.job_id),
    app.resume_name,
    app.resume_data,
    app.cover_letter_name,
    app.cover_letter_data,
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
    UPDATE application SET status = $1, applied_at = NOW() WHERE id = $2 RETURNING *`, [status, id]);
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