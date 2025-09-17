import { getCommentsController, createCommentController } from "@/backend/controllers/commentsController";

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

export async function POST(req) {
  try {
    const body = await req.json();
    const newComment = await createCommentController(body);
    return new Response(JSON.stringify(newComment), { status: 201 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 400 });
  }
}