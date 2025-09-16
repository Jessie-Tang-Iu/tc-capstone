import * as comments from "../scripts/comments.js";

export async function getCommentsController(postId) {
  if (!postId) throw new Error("postId required");
  return await comments.getCommentsByPost(postId);
}

export async function createCommentController(body) {
  const { post_id, author, content } = body;
  if (!content) throw new Error("Content required");
  return await comments.createComment(post_id, author || "Anonymous", content);
}