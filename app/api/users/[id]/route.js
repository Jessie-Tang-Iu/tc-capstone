// app/api/users/[id]/route.js

//temporary file to update user status for admin purposes
import { NextResponse } from "next/server";
import { query } from "@/backend/database/db.js";
import { updateStatusByID, updateUserDataById } from "@/backend/controllers/usersController";
// import { clerkClient } from '@clerk/nextjs/server'

// const client = await clerkClient()

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

    const updated = await updateUserDataById(body);

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

    if (!body.newStatus) {
      return NextResponse.json({ error: "Missing status" }, { status: 400 });
    }

    let userData = {
      id: id,
      newStatus: body.newStatus,
      oldStatus: body.oldStatus
    }

    const result = await updateStatusByID(userData);

    if (!result) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    console.error("PATCH /api/users/[id] error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
