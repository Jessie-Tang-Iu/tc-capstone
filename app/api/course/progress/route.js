const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

export async function POST(req) {
  try {
    const body = await req.json();

    const res = await fetch(`${BACKEND_URL}/courses/progress`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return new Response(JSON.stringify(data), { status: res.status });
  } catch (err) {
    console.error("Error calling backend:", err);
    return new Response(JSON.stringify({ error: "Failed to update progress" }), {
      status: 500,
    });
  }
}
