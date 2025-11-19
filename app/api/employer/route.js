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

export async function PUT(req) {
  const body = await req.json();
  const updated = await updateEmployerProfileController(body);
  return NextResponse.json(updated);
}
