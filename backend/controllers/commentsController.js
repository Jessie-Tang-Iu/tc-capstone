/*
 * This file controls the requests between the api routes in the frontend and the backend scripts. 
 * This allows us to implement things like Auth checks in the future, also seperates our database from the frontend logic.
 * This also allows us to check data in a safe environment before sending it to the database, ESPECIALLY IMPORTANT if files are being uploaded.
*/

import * as comments from "../database/scripts/comments.js";

// Fetch all comments for a post
export async function getCommentsController(postId) {
  if (!postId) throw new Error("postId required");
  return await comments.getCommentsByPost(postId);
}

// Create a new comment
export async function createCommentController(body) {
  const { post_id, author_id, content } = body;
  if (!post_id || !author_id || !content)
    throw new Error("Missing required fields");
  return await comments.createComment(post_id, author_id, content);
}
