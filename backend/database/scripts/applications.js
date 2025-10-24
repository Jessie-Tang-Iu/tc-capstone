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
    SELECT ap.id, je.title, je.company_name AS company, je.location, ap.status, ap.applied_at AS "appliedAt"
      FROM application ap JOIN (SELECT * FROM job jb JOIN employers e ON jb.employer_id = e.clerk_id) je ON ap.job_id = je.id
     WHERE user_id = $1 ORDER BY applied_at DESC`, [id]);
  return rows;
}

export async function getApplicationById(id) {
  const { rows } = await query(`
    SELECT  u.first_name, u.last_name, u.email, u.phone,
		        ap.id, ap.user_id, ap.resume_name, ap.resume_data, ap.cover_letter_name, ap.cover_letter_data, ap.status, ap.applied_at, ap.relative_first_name, ap.relative_last_name, ap.relative_email, ap.relative_phone, ap.answers,
		        jb.title, jb.company_name AS company, jb.location, jb.questions
      FROM application ap JOIN (SELECT * FROM job j JOIN employers e ON j.employer_id = e.clerk_id) jb ON ap.job_id = jb.id
                          JOIN users u ON u.clerk_id = ap.user_id
     WHERE ap.id = $1`, [id]);
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

// Update function

export async function updateApplicationStatus(id, status) {
  const { rows } = await query(`
    UPDATE application SET status = $1, applied_at = NOW() WHERE id = $2 RETURNING *`, [status, id]);
  return rows[0];
}