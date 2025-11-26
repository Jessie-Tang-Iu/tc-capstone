import { query } from "@/backend/database/db.js";

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
  console.log("cover letter script: ", coverLetter);
  const { rows } = await query(`
    INSERT INTO cover_letter (user_id, content)
    VALUES ($1, $2) RETURNING *`, 
  [
    coverLetter.user_id,
    coverLetter.content
  ]);
  return rows[0];
}

// Update function
export async function updateCoverLetterByUser(id, coverLetter) {
  // console.log("cover letter script: ", coverLetter);
  const { rows } = await query(`
    UPDATE cover_letter SET content = $1
     WHERE user_id = $2 RETURNING *`, 
  [
    coverLetter.content,
    id
  ]);
  return rows[0];
}