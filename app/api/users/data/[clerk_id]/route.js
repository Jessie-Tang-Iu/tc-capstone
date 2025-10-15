export async function GET(req, { params }) {
  try {
    const { clerk_id } = params;

    if (!clerk_id) {
      return new Response(JSON.stringify({ error: "Missing clerk_id" }), { status: 400 });
    }

    const res = await fetch(`${process.env.BACKEND_URL}/users/${clerk_id}`, {
      method: "GET",
      headers: {
        "Authorization": req.headers.get("authorization"),
      },
    });

    const data = await res.json();
    return new Response(JSON.stringify(data), { status: res.status });
  } catch (err) {
    console.error("API route error (GET /users/[clerk_id]):", err);
    return new Response(JSON.stringify({ error: "Failed to fetch user data" }), { status: 500 });
  }
}
