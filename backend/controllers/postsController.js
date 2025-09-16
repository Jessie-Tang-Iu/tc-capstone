import * as posts from "../scripts/posts.js";

export async function getPostsController() {
  return await posts.getAllPosts();
}

export async function createPostController(body) {
  const { author, title, content } = body;
  if (!title || !content) throw new Error("Title and content required");
  return await posts.createPost(author || "Anonymous", title, content);
}