import { NextResponse } from "next/server";
import {
  getReportByIdController,
  deleteReportByIdController,
  markReportedBannedController,
  markReportRemovedController,
  updateReportByIdController,
} from "@/backend/controllers/reportsController.js";

// GET /api/reports/:id → fetch one report
export async function GET(req, { params }) {
  try {
    const report = await getReportByIdController(params.id);
    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }
    return NextResponse.json(report, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PUT /api/reports/:id → generic update (ban/remove or other fields)
export async function PUT(req, { params }) {
  try {
    const body = await req.json();

    let updated;

    // if specifically passed flags, handle with helpers
    if (body.is_banned !== undefined) {
      updated = await markReportedBannedController(params.id, body.is_banned);
    } else if (body.is_removed !== undefined) {
      updated = await markReportRemovedController(params.id, body.is_removed);
    } else {
      // fallback: generic update (reason, followup_id, etc.)
      updated = await updateReportByIdController(params.id, body);
    }

    return NextResponse.json(updated, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

// DELETE /api/reports/:id → hard delete
export async function DELETE(req, { params }) {
  try {
    await deleteReportByIdController(params.id);
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
