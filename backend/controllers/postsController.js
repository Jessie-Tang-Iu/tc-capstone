/*
 * This file controls the requests between the api routes in the frontend and the backend scripts. 
 * This allows us to implement things like Auth checks in the future, also seperates our database from the frontend logic.
 * This also allows us to check data in a safe environment before sending it to the database, ESPECIALLY IMPORTANT if files are being uploaded.
*/

import * as posts from "../database/scripts/posts.js"; // Imports all scripts from the posts.js file

// Calls the getAllPosts function. 
export async function getPostsController() {
  return await posts.getAllPosts();
}

// Takes the new post body and converts it into a variable for each field (Author, Title, Content). Once the login is completed, Author will be automated.
// If the title or content are missing, it will throw an error. (Author is optional, defaults to Anonymous if not provided)
export async function createPostController(body) {
  const { author, title, content } = body;
  if (!title || !content) throw new Error("Title and content required");
  return await posts.createPost(author || "Anonymous", title, content);
}