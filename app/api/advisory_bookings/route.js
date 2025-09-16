import { getAllBookings } from "@/backend/database/advisory_bookings_crud";
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