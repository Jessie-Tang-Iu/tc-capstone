import { addAvailability, deleteAvailability, getAllBookings, updateAvailability } from "@/backend/database/advisory_bookings_crud";
import { NextResponse } from "next/server";



export async function GET() {
    try{
        let bookings = await getAllBookings();

        return NextResponse.json(bookings);
    } catch (error) {
        console.error("GET /api/advisory_bookings failed:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

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

        const inserted = await addAvailability(newAvailability);

        return NextResponse.json(inserted, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to add availability" }, { status: 500 });
    }
}

export async function DELETE(req) {
    const { searchParams } = new URL(req.url);
    const bookingId = searchParams.get("bookingId");
    try {
        if(!bookingId) {
            return NextResponse.json({ error: "Missing Booking ID" }, { status: 400 });
        }

        await deleteAvailability(bookingId);
        return NextResponse.json({ message: "Deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("DELETE /api/advisory_bookings failed:", err);
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

        const updated = await updateAvailability(newAvailability);

        return NextResponse.json(updated, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to change availability" }, { status: 500 });
    }
}