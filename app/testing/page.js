"use client";

import { useEffect, useState } from "react";
import { getBookingsByUser } from "@/lib/workshop_booking_crud";

export default function Testing() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const dummyUserId = 1;
        const result = await getBookingsByUser(dummyUserId);
        console.log("Debug fetched bookings:", result);
        setBookings(result || []);
      } catch (err) {
        console.error("Error fetching bookings:", err.message);
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Booking Debugger</h1>

      {loading ? (
        <p>Loading...</p>
      ) : bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <ul className="space-y-4">
          {bookings.map((item, index) => (
            <li key={item.id ?? index} className="border p-4 rounded">
              <div>
                <strong>Booking ID:</strong> {item.id}
              </div>
              <div>
                <strong>Status:</strong> {item.status}
              </div>

              <div className="mt-2">
                <strong>User Info</strong>
              </div>
              <div>First Name: {item.users?.firstname}</div>
              <div>Last Name: {item.users?.lastname}</div>
              <div>Email: {item.users?.email}</div>

              <div className="mt-2">
                <strong>Workshop Info</strong>
              </div>
              <div>Title: {item.workshop?.title}</div>
              <div>Start Time: {item.workshop?.start_time}</div>
              <div>Description: {item.workshop?.description}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
