// app/api/users/[id]/route.js

//temporary file to update user status for admin purposes
import { NextResponse } from "next/server";
import { query } from "@/backend/database/db.js";

export async function PATCH(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();

    if (!body.status) {
      return NextResponse.json({ error: "Missing status" }, { status: 400 });
    }

    const result = await query(
      "UPDATE users SET status = $1 WHERE id = $2 RETURNING *",
      [body.status, id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (err) {
    console.error("PATCH /api/users/[id] error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
