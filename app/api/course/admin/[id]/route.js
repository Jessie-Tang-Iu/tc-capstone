const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

// This is the same as fetching course details in /api/course/[id] but it doesn't check for userID right now since it's an admin route.
// Eventually this will have authentication when it fetches more data than the user does.

export async function GET(req, { params }) {
  try {
    const { id } = await params;

    const res = await fetch(`${BACKEND_URL}/courses/admin/${id}`);

    if (!res.ok) throw new Error(`Backend error: ${res.status}`);

    const data = await res.json();
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (err) {
    console.error("Error in GET /api/course/admin/[id]:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
