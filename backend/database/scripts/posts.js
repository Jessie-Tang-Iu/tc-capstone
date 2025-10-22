import { query } from "../db.js";

// Get all posts with author details using JOIN
export async function getAllPosts() {
  const result = await query(`
    SELECT p.*, 
           u.username, 
           u.first_name, 
           u.last_name
    FROM posts p
    JOIN users u ON p.author_id = u.clerk_id
    ORDER BY p.created_at DESC
  `);
  return result.rows;
}

// Create a new post
export async function createPost(author_id, title, content) {
  const result = await query(
    `INSERT INTO posts (author_id, title, content)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [author_id, title, content]
  );
  return result.rows[0];
}

// Update a Post

export async function updatePost(id, author_id, title, content) {
  const result = await query(
    `UPDATE posts
     SET title = $3, content = $4
     WHERE id = $1 AND author_id = $2
     RETURNING *`,
    [id, author_id, title, content]
  );
  return result.rows[0];
}
