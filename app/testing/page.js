"use client";

import { useEffect, useMemo, useState } from "react";
import { getUser } from "@/lib/supabase_auth";
import { ensureProfile } from "@/lib/user_crud";
import { getBookingsByUser } from "@/lib/workshop_booking_crud";
import Navbar from "../components/NavBar";

export default function Testing() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authUser, setAuthUser] = useState(null);
  const [error, setError] = useState("");

  const fmt = useMemo(
    () =>
      new Intl.DateTimeFormat(undefined, {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
    []
  );

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");

      try {
        // 1) Signed-in Supabase user?
        const u = await getUser();
        if (!u) {
          setAuthUser(null);
          setBookings([]);
          setError("You must be signed in to view your bookings.");
          return;
        }
        setAuthUser(u);

        // 2) Resolve the LOCAL "user" row (creates if missing) to get its numeric id
        const localProfile = await ensureProfile({
          username: (u.email || "").split("@")[0],
          status: "active",
        });
        if (!localProfile?.id) {
          setBookings([]);
          setError('Could not resolve local user id from table "user".');
          return;
        }

        // 3) Fetch bookings for this local user id
        const rows = await getBookingsByUser(localProfile.id);
        setBookings(Array.isArray(rows) ? rows : []);
      } catch (e) {
        setError(e?.message || String(e));
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-1">Booking Debugger</h1>
        <p className="text-sm text-gray-600 mb-6">
          {authUser ? `Signed in as: ${authUser.email}` : "Not signed in"}
        </p>
        {/* {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-600 font-semibold">{error}</p>
        ) : bookings.length === 0 ? (
          <p>No bookings found.</p>
        ) : (
          <ul className="space-y-4">
            {bookings.map((item) => (
              <li
                key={item.id}
                className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
              >
                <div className="mb-1">
                  <strong>Booking ID:</strong> {item.id}
                </div>
                <div className="mb-3">
                  <strong>Status:</strong> {item.status}
                </div>

                <div className="mt-2 font-semibold">User Info</div>
                <div>First Name: {item.user?.firstname ?? "—"}</div>
                <div>Last Name: {item.user?.lastname ?? "—"}</div>
                <div>Email: {item.user?.email ?? "—"}</div>

                <div className="mt-3 font-semibold">Workshop Info</div>
                <div>Title: {item.workshop?.title ?? "—"}</div>
                <div>
                  Start Time:{" "}
                  {item.workshop?.start_time
                    ? fmt.format(new Date(item.workshop.start_time))
                    : "—"}
                </div>
                <div>Description: {item.workshop?.description ?? "—"}</div>
              </li>
            ))}
          </ul> */}
      </div>
    </div>
  );
}
