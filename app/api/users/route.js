// app/api/users/route.js

//this is a temporary file to fetch all users from the database for admin purposes
import { query } from "@/backend/database/db.js";

export async function GET() {
  try {
    const res = await query("SELECT * FROM users ORDER BY id ASC");
    return new Response(JSON.stringify(res.rows), { status: 200 });
  } catch (err) {
    console.error("Error fetching users:", err);
    return new Response(JSON.stringify({ error: "Failed to fetch users" }), {
      status: 500,
    });
  }
}
