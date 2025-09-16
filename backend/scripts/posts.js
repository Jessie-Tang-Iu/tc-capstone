import { query } from "../database/db.js";

export async function getAllPosts() {
  const result = await query("SELECT * FROM posts ORDER BY created_at DESC");
  return result.rows;
}

export async function createPost(author, title, content) {
  const result = await query(
    "INSERT INTO posts (author, title, content) VALUES ($1, $2, $3) RETURNING *",
    [author, title, content]
  );
  return result.rows[0];
}