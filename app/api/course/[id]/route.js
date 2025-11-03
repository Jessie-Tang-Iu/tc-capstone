const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

export async function GET(req, { params }) {
  try {
    // unwrap params
    const { id } = await params;

    console.log("Fetching course ID:", id); // debug log

    const res = await fetch(`${BACKEND_URL}/courses/${id}`);
    if (!res.ok) throw new Error(`Backend error: ${res.status}`);
    const data = await res.json();
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (err) {
    console.error("Error in GET /api/course/[id]:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
