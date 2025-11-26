import {
  getAllAdminsController,
  getAdminByIdController,
  updateAdminProfileController,
} from "@/backend/controllers/adminController";

import { NextResponse } from "next/server";

export async function GET() {
  try {
    const admins = await getAllAdminsController();
    return NextResponse.json(admins);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { userId } = await request.json();
    const admin = await getAdminByIdController(userId);
    return NextResponse.json(admin);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const updated = await updateAdminProfileController(body);
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
