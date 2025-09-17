// backend/database/job_crud.js
import { Pool } from "pg";
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function getApplicationsByUserId(id) {
  const { rows } = await pool.query(`
    SELECT * 
      FROM application ap   JOIN resume re ON ap.user_id = re.user_id
                            JOIN cover_letter cv ON ap.user_id = cv.user_id
     WHERE user_id = $1 ORDER BY applied_at DESC`, [id]);
  return rows;
}