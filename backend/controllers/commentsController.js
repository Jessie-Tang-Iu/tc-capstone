/*
 * This file controls the requests between the api routes in the frontend and the backend scripts. 
 * This allows us to implement things like Auth checks in the future, also seperates our database from the frontend logic.
 * This also allows us to check data in a safe environment before sending it to the database, ESPECIALLY IMPORTANT if files are being uploaded.
*/

import * as comments from "../database/scripts/comments.js"; // Imports all scripts from the comments.js file as this controller handles calling them

// Receives the postId from the frontend and calls the database to get the comments for that post. (Throws error if no postId is provided)
export async function getCommentsController(postId) {
  if (!postId) throw new Error("postId required");
  return await comments.getCommentsByPost(postId);
}

// Takes the new comment body and converts it into a variable for each field (post_id, Author, Content). Once the login is completed, Author will be automated.
// If the content is missing, it will throw an error. (Author is optional, defaults to Anonymous if not provided)
export async function createCommentController(body) {
  const { post_id, author, content } = body;
  if (!content) throw new Error("Content required");
  return await comments.createComment(post_id, author || "Anonymous", content);
}