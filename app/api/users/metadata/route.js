import { auth } from "@clerk/nextjs/server";

export async function POST(req) {
  try {
    const { userId } = auth(); // Clerk verifies session automatically
    if (!userId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const body = await req.json();

    // Forward to your backend controller
    const res = await fetch(`${process.env.BACKEND_URL}/users/metadata`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${req.headers.get("authorization")}`, // Clerk session token
      },
      body: JSON.stringify({ ...body, userId }),
    });

    const data = await res.json();
    return new Response(JSON.stringify(data), { status: res.status });
  } catch (err) {
    console.error("API route error:", err);
    return new Response(JSON.stringify({ error: "Failed to update metadata" }), { status: 500 });
  }
}
