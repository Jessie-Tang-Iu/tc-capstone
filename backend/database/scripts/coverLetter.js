import { query } from "../../database/db.js";

// Get function
export async function getCoverLetterByUser(id) {
  const { rows } = await query(`
    SELECT cv.user_id AS user_id, first_name, last_name, email, content
      FROM cover_letter cv JOIN users u ON u.clerk_id = cv.user_id
     WHERE user_id = $1`, [id]);
  return rows[0];
}

// Create functions
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
export async function updateCoverLetterByUser(id, coverLetter) {
  const query = `
    UPDATE cover_letter SET upload_at = NOW(), content = $1
     WHERE user_id = $2 RETURNING *`;
  const values = [
    coverLetter.content,
    id
  ];
  const { rows } = await query(query, values);
  return rows[0];
}