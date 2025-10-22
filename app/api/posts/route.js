import { getPostsController, createPostController, updatePostController } from "@/backend/controllers/postsController.js"; // Imports the post controller functions so we can call them.

// the GET function calls the getPostsController which faclitates the request between the frontend and the backend scripts for the posts.
// If successful, it returns the posts with a 200 status (OK). If there is an error, it returns the error message with a 500 status (Internal Server Error).
export async function GET() {
  try {
    const posts = await getPostsController();
    return new Response(JSON.stringify(posts), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

// the POST function takes the request body (Author, Title, Content) and calls the createPostController which faclitates the request to the backend scripts to create a new post.
// If successful, it returns the newly created post with a 201 status (Created) for us to . If there is an error, it returns the error message with a 400 status (Bad Request).
export async function POST(req) {
  try {
    const body = await req.json();
    const newPost = await createPostController(body);
    return new Response(JSON.stringify(newPost), { status: 201 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 400 });
  }
}

// the PUT function takes the request body (Post ID, Author, Title, Content) and calls the updatePostController which faclitates the request to the backend scripts to update an existing post.
// If successful, it returns the updated post with a 200 status (OK). If there is an error, it returns the error message with a 400 status (Bad Request).
export async function PUT(req) {
  try {
    const body = await req.json();
    const updatedPost = await updatePostController(body);
    return new Response(JSON.stringify(updatedPost), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 400 });
  }
}
