import { query } from "../db.js";

// Gets all posts ordered by most recently creates
export async function getAllPosts() {
  const result = await query("SELECT * FROM posts ORDER BY created_at DESC");
  return result.rows;
}

// Creates a new post with the given author, title and content from the creation function.
export async function createPost(user_id, author, title, content) {
  const result = await query(
    "INSERT INTO posts (user_id, author, title, content) VALUES ($1, $2, $3, $4) RETURNING *",
    [user_id, author, title, content]
  );
  return result.rows[0];
}