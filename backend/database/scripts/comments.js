import { query } from "../db.js";

// Gets the comments for a specific post by the postId, ordered by the oldest first
export async function getCommentsByPost(postId) {
  const result = await query(
    "SELECT * FROM comments WHERE post_id = $1 ORDER BY created_at ASC",
    [postId]
  );
  return result.rows;
}

// Creates a new comment using the specific postId to link it to a post, along with the author and comment itself.
export async function createComment(postId, user_id, author, content) {
  const result = await query(
    "INSERT INTO comments (post_id, user_id, author, content) VALUES ($1, $2, $3, $4) RETURNING *",
    [postId, user_id, author, content]
  );
  return result.rows[0];
}