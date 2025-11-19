const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

export async function GET(req, { params }) {
  try {
    const { id } = params;

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    console.log("API route received userId:", userId, "for course ID:", id);

    if (!userId) {
      return new Response(
        JSON.stringify({ error: "Missing userId in query params" }),
        { status: 400 }
      );
    }

    const res = await fetch(
      `${BACKEND_URL}/courses/${id}?userId=${userId}`
    );

    if (!res.ok) throw new Error(`Backend error: ${res.status}`);

    const data = await res.json();
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (err) {
    console.error("Error in GET /api/course/[id]:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const res = await fetch(`${BACKEND_URL}/courses/${params.id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error(`Backend error: ${res.status}`);
    return new Response(JSON.stringify({ message: "Course deleted successfully" }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const body = await req.json();
    const courseId = params.id; 
    const userId = body.userId || "";

    const res = await fetch(`${BACKEND_URL}/courses/${courseId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return new Response(JSON.stringify(data), { status: res.status });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

