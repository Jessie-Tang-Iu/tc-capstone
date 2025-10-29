const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

export async function GET(req, { params }) {
  try {
    const res = await fetch(`${BACKEND_URL}/courses/${params.id}`);
    if (!res.ok) throw new Error(`Backend error: ${res.status}`);
    const data = await res.json();
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
