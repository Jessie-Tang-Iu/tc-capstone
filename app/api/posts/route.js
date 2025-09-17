import { getPostsController, createPostController } from "@/backend/controllers/postsController.js";

export async function GET() {
  try {
    const posts = await getPostsController();
    return new Response(JSON.stringify(posts), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const newPost = await createPostController(body);
    return new Response(JSON.stringify(newPost), { status: 201 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 400 });
  }
}