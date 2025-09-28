export async function POST(req) {
  try {
    const body = await req.json();

    const res = await fetch(`${process.env.BACKEND_URL}/users/metadata`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": req.headers.get("authorization"), // forward raw token
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return new Response(JSON.stringify(data), { status: res.status });
  } catch (err) {
    console.error("API route error:", err);
    return new Response(JSON.stringify({ error: "Failed to update metadata" }), { status: 500 });
  }
}

