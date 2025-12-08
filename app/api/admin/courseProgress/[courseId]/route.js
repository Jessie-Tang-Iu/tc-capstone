const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

export async function GET(req, { params }) {
  try {
    const { courseId } = params;

    if (!courseId) {
      return new Response(
        JSON.stringify({ error: "Missing CourseID" }),
        { status: 400 }
      );
    }

    const res = await fetch(
        `${BACKEND_URL}/admin/courseProgress/${courseId}`
    )

    if (!res.ok) throw new Error(`Backend error: ${res.status}`);

    const data = await res.json();
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (err) {
    console.error("Error fetching course progress:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
