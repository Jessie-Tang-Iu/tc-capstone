import { getCommentsController, createCommentController } from "@/backend/controllers/commentsController"; // Imports the comment controller functions so we can call them.

// the GET function calls the getCommentsController which acts as a middleman between this GET function and the backend scripts.
// It retrieves the comments from the specific postId in the req parameters.
// If successful, it returns the comments with a 200 status (OK). If there is an error, it returns the error message with a 400 status (Bad Request).
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("post_id");
    const comments = await getCommentsController(postId);
    return new Response(JSON.stringify(comments), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 400 });
  }
}

// the POST function takes the request body (post_id, Author, Content) and calls the createCommentController which takes the request and acts as a middle man between it and the scripts.
// It takes the body sent from the page and sends it to the createCommentController to create a new comment in the database.
// If successful, it returns the newly created comment with a 201 status (Created). If there is an error, it returns the error message with a 400 status (Bad Request).
export async function POST(req) {
  try {
    const body = await req.json();
    const newComment = await createCommentController(body);
    return new Response(JSON.stringify(newComment), { status: 201 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 400 });
  }
}