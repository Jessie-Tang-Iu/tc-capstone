import { createAvailabilityController, deleteAvailabilityController, updateAvailabilityController } from "@/backend/controllers/advisoryServiceController";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const body = await request.json();

        if (!body.advisorId || !body.date || !body.start || !body.end) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        const newAvailability = {
            advisorId: body.advisorId,
            date: body.date,
            start_time: body.start,
            end_time: body.end,
            status: "open",
        }

        const inserted = await createAvailabilityController(newAvailability);

        return NextResponse.json(inserted, { status: 201 });
    } catch (error) {
        console.error("Error adding availability:",error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req) {
    const { searchParams } = new URL(req.url);
    const bookingId = searchParams.get("bookingId");
    try {
        if(!bookingId) {
            return NextResponse.json({ error: "Missing Booking ID" }, { status: 400 });
        }

        await deleteAvailabilityController(bookingId);
        return NextResponse.json({ message: "Deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("DELETE /api/advisory_bookings failed:", error);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        const body = await request.json();

        if (!body.bookingId || !body.date || !body.start || !body.end) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        const newAvailability = {
            bookingId: body.bookingId,
            date: body.date,
            start_time: body.start,
            end_time: body.end,
        }

        const updated = await updateAvailabilityController(newAvailability);

        return NextResponse.json(updated, { status: 201 });
    } catch (error) {
        console.error("Error in PUT /api/advisory_bookings:", error);
        return NextResponse.json({ error: "Failed to change availability" }, { status: 500 });
    }
}