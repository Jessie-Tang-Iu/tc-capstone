import { query } from "../db.js";

// Gets all posts ordered by most recently creates
export async function getAllPosts() {
  const result = await query("SELECT * FROM posts ORDER BY created_at DESC");
  return result.rows;
}

// Creates a new post with the given author, title and content from the creation function.
export async function createPost(author, title, content) {
  const result = await query(
    "INSERT INTO posts (author, title, content) VALUES ($1, $2, $3) RETURNING *",
    [author, title, content]
  );
  return result.rows[0];
}