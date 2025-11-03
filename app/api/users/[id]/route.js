// app/api/users/[id]/route.js

//temporary file to update user status for admin purposes
import { NextResponse } from "next/server";
import { query } from "@/backend/database/db.js";

export async function GET(_req, { params }) {
  const { id } = await params;
  try {
    const { rows } = await query(
      "SELECT * FROM public.users WHERE clerk_id = $1",
      [id]
    );
    if (rows.length == 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(rows[0], { status: 200 });
  } catch (err) {
    console.error("GET /api/users/[id] failed: ", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  const { id } = await params;
  try {
    const body = await req.json();

    if (!body.status) {
      return NextResponse.json(
        { error: "Missing information" },
        { status: 400 }
      );
    }

    const updated = await query(
      `UPDATE users
          SET first_name = $1, last_name = $2, preferred_name = $3, pronouns = $4,
              email = $5, show_email = $6, phone = $7, show_phone = $8,
              address = $9, link = $10
        WHERE clerk_id = $11
       RETURNING *`,
      [
        body.first_name,
        body.last_name,
        body.preferred_name,
        body.pronouns,
        body.email,
        body.show_email,
        body.phone,
        body.show_phone,
        body.address,
        body.link,
        id,
      ]
    );

    if (updated.rowCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(updated.rows[0], { status: 200 });
  } catch (err) {
    console.error("PUT /api/users/[id] failed: ", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();

    if (!body.status) {
      return NextResponse.json({ error: "Missing status" }, { status: 400 });
    }

    const result = await query(
      "UPDATE users SET status = $1 WHERE clerk_id = $2 RETURNING *",
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
