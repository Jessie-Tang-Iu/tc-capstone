import { query } from "../../database/db.js";
import crypto from 'crypto';

// --- ENCRYPTION CONFIG & UTILITIES ---
const algorithm = 'aes-256-cbc';

if (!process.env.ENCRYPTION_SECRET) {
  // This will throw a specific error during build if the variable is missing,
  // making it clear what needs to be fixed in the Vercel configuration.
  throw new Error('Missing ENCRYPTION_SECRET environment variable.');
}

const secretKey = Buffer.from(process.env.ENCRYPTION_SECRET, 'base64');

if (secretKey.length != 32) {
  throw new Error('ENCRYPTION_SECRET must be 32 bytes (256 bits) long after Base64 decoding.');
}

/**
 * Encrypts a Buffer using AES-256-CBC.
 * Returns an object containing the Initialization Vector (IV) and the encrypted data.
 */
const encryptData = (buffer) => {
    const iv = crypto.randomBytes(16); // Generate unique 16-byte IV for security
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
    
    const encryptedData = Buffer.concat([cipher.update(buffer), cipher.final()]);
    
    return { 
        iv: iv.toString('hex'), 
        data: encryptedData 
    };
};

/**
 * Decrypts a Buffer using AES-256-CBC and a known IV.
 */
const decryptData = (encryptedBuffer, ivHex) => {
    // 1. Recreate the IV Buffer from the stored hex string
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
    
    // 2. Decrypt the data
    const decryptedData = Buffer.concat([decipher.update(encryptedBuffer), decipher.final()]);
    
    return decryptedData; // This is the original binary file Buffer
};

// Get function

export async function getApplicationsByUser(id) {
  const { rows } = await query(`
    SELECT ap.id, je.title, je.company_name AS company, je.location, ap.status, ap.applied_at AS "appliedAt", je.id AS "jobId"
      FROM application ap JOIN (SELECT * FROM job jb JOIN employers e ON jb.employer_id = e.clerk_id) je ON ap.job_id = je.id
     WHERE user_id = $1 ORDER BY applied_at DESC`, [id]);
  return rows;
}

export async function getApplicationById(id) {
  const { rows } = await query(`
    SELECT  u.first_name, u.last_name, u.email, u.phone,
		        ap.id, ap.user_id, ap.resume_name, ap.resume_data, ap.resume_iv, ap.cover_letter_name, ap.cover_letter_data, ap.cover_letter_iv,
            ap.status, ap.applied_at, ap.relative_first_name, ap.relative_last_name, ap.relative_email, ap.relative_phone, ap.answers,
		        jb.title, jb.company_name AS company, jb.location, jb.questions
      FROM application ap JOIN (SELECT * FROM job j JOIN employers e ON j.employer_id = e.clerk_id) jb ON ap.job_id = jb.id
                          JOIN users u ON u.clerk_id = ap.user_id
     WHERE ap.id = $1`, [id]);
  
  const app = rows[0];

  // Decrypt Resume data
  if (app.resume_data && app.resume_iv) {
    app.resume_data = decryptData(app.resume_data, app.resume_iv);
  }

  // Decrypt Cover Letter data
  if (app.cover_letter_data && app.cover_letter_iv) {
    app.cover_letter_data = decryptData(app.cover_letter_data, app.cover_letter_iv)
  }

  return app;
}

// Create functions
export async function createApplication(app) {

  // Encrypt Resume data
  let encryptedResume = {data: null, iv: null};
  if (app.resume_data) {
    let base64String = app.resume_data;
    let resumeBuffer = Buffer.from(base64String, 'base64'); // Decode
    encryptedResume = encryptData(resumeBuffer);
  }

  // Encrypt Cover Letter data
  let encryptedCoverLetter = {data: null, iv: null};
  if (app.cover_letter_data) {
    let base64String = app.cover_letter_data;
    let coverLetterBuffer = Buffer.from(base64String, 'base64'); // decode
    encryptedCoverLetter = encryptData(coverLetterBuffer);
  }
  
  const { rows } = await query( `
    INSERT INTO application (user_id, job_id, resume_name, resume_data, resume_iv, cover_letter_name, cover_letter_data, cover_letter_iv, relative_first_name, relative_last_name, relative_email, relative_phone, answers)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
    RETURNING *`,
  [
    app.user_id,
    Number (app.job_id),
    app.resume_name,
    encryptedResume.data,
    encryptedResume.iv,
    app.cover_letter_name,
    encryptedCoverLetter.data,
    encryptedCoverLetter.iv,
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