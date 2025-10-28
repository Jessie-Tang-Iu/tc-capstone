/*
 * This file controls the requests between the api routes in the frontend and the backend scripts. 
 * This allows us to implement things like Auth checks in the future, also seperates our database from the frontend logic.
 * This also allows us to check data in a safe environment before sending it to the database, ESPECIALLY IMPORTANT if files are being uploaded.
*/

import * as posts from "../database/scripts/posts.js";

// Fetch all posts
export async function getPostsController() {
  return await posts.getAllPosts();
}

// Create a new post
export async function createPostController(body) {
  const { author_id, title, content, tags } = body;
  if (!author_id || !title || !content)
    throw new Error("Missing required fields");
  return await posts.createPost(author_id, title, content, tags || []);
}

// Edit an existing post
export async function updatePostController(body) {
  const { id, author_id, title, content, tags } = body;
  if (!id || !author_id || !title || !content)
    throw new Error("Missing required fields");
  return await posts.updatePost(id, author_id, title, content, tags || []);
}
