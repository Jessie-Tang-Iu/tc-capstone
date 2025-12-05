import {
  getEmployerByIdController,
  updateEmployerProfileController,
  getAllEmployersController,
} from "@/backend/controllers/employerController";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { clerk_id } = await req.json();
  const data = await getEmployerByIdController(clerk_id);
  return NextResponse.json(data);
}

export async function PUT(req, { params }) {
  const { id } = await params;
  try {
    const body = await req.json();

    if (!body.id) {
      return NextResponse.json(
        { error: "Missing information" },
        { status: 400 }
      );
    }

    const updated = await updateEmployerProfileController(body);

    if (!updated) {
      return NextResponse.json({ error: "Employer not found" }, { status: 404 });
    }

    return NextResponse.json(updated, { status: 200 });
  } catch (err) {
    console.error("PUT /api/employer/[id] failed: ", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


export async function GET(_req, { params }) {
  const { id } = await params;
  try {
    const data = await getEmployerByIdController(id);

    if (!data) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("GET /api/employer/[id] failed: ", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}