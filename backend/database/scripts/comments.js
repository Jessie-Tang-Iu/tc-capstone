import { query } from "../db.js";

// Get comments for a post with author details using JOIN
export async function getCommentsByPost(postId) {
  const result = await query(`
    SELECT c.*, 
           u.username, 
           u.first_name, 
           u.last_name
    FROM comments c
    JOIN users u ON c.author_id = u.clerk_id
    WHERE c.post_id = $1
    ORDER BY c.created_at ASC
  `, [postId]);
  return result.rows;
}

// Create new comment
export async function createComment(postId, author_id, content) {
  const result = await query(
    `INSERT INTO comments (post_id, author_id, content)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [postId, author_id, content]
  );
  return result.rows[0];
}
