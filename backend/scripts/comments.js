import { query } from "../database/db.js";

export async function getCommentsByPost(postId) {
  const result = await query(
    "SELECT * FROM comments WHERE post_id = $1 ORDER BY created_at ASC",
    [postId]
  );
  return result.rows;
}

export async function createComment(postId, author, content) {
  const result = await query(
    "INSERT INTO comments (post_id, author, content) VALUES ($1, $2, $3) RETURNING *",
    [postId, author, content]
  );
  return result.rows[0];
}