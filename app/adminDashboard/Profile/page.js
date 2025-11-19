"use client";

import Button from "@/app/components/ui/Button";
import Navbar from "../../components/AdminNavBar";
import { useEffect, useState } from "react";

export default function AdminProfile() {
  const [admin, setAdmin] = useState({
    clerk_id: null,
    username: null,
    first_name: null,
    last_name: null,
    email: null,
    phone: null,
    role: "admin",
    office_location: null,
    department: null,
  });

  // TEMP hardcoded admin ID
  const ME = "testAdmin1";

  useEffect(() => {
    if (!ME) return;
    fetchAdmin(ME);
  }, [ME]);

  // Fetch admin data
  const fetchAdmin = async (userId) => {
    try {
      const res = await fetch(`/api/admin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (!res.ok) {
        console.error("Failed to fetch admin");
        return;
      }

      const data = await res.json();
      setAdmin(data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  // Update admin profile
  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    alert("Profile saved");

    const payload = {
      userId: admin.clerk_id,
      first_name: admin.first_name,
      last_name: admin.last_name,
      email: admin.email,
      phone: admin.phone,
      office_location: admin.office_location,
      department: admin.department,
    };

    try {
      const res = await fetch(`/api/admin`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        console.error("Failed to update admin profile");
        return;
      }

      fetchAdmin(ME);
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  return (
    <main className="bg-gradient-to-br from-[#f8eae2] to-white min-h-screen">
      <Navbar />

      <div className="mx-auto mt-10">
        <div className="w-4/5 mx-auto flex flex-col justify-center items-center">
          <h1 className="text-3xl font-bold text-[#E55B3C]">Admin Profile</h1>

          <div className="w-full my-8 p-12 bg-white rounded-lg shadow-md text-black">
            <form onSubmit={handleProfileSubmit}>
              <div className="flex justify-between">
                <div className="mb-10">
                  <p className="mb-6 text-gray-600">* Indicates required</p>
                  <h1 className="text-2xl text-black font-bold mb-2">
                    Personal Information
                  </h1>

                  {/* First / Last */}
                  <div className="flex flex-row space-x-4">
                    <div className="flex flex-col">
                      <label className="font-bold">First Name: *</label>
                      <input
                        required
                        className="border rounded border-black mb-6 p-1"
                        type="text"
                        value={admin.first_name || ""}
                        onChange={(e) =>
                          setAdmin({ ...admin, first_name: e.target.value })
                        }
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="font-bold">Last Name: *</label>
                      <input
                        required
                        className="border rounded border-black mb-6 p-1"
                        type="text"
                        value={admin.last_name || ""}
                        onChange={(e) =>
                          setAdmin({ ...admin, last_name: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  {/* Department */}
                  <div className="flex flex-col">
                    <label className="font-bold">Department: *</label>
                    <input
                      required
                      className="border rounded border-black mb-6 p-1"
                      type="text"
                      value={admin.department || ""}
                      onChange={(e) =>
                        setAdmin({ ...admin, department: e.target.value })
                      }
                    />
                  </div>

                  {/* Office */}
                  <div className="flex flex-col">
                    <label className="font-bold">Office Location:</label>
                    <input
                      className="border rounded border-black mb-6 p-1"
                      type="text"
                      value={admin.office_location || ""}
                      onChange={(e) =>
                        setAdmin({ ...admin, office_location: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* Save button */}
                <div>
                  <Button text="Save" type="submit" />
                </div>
              </div>

              {/* Contact */}
              <div className="mb-10">
                <h1 className="text-2xl text-black font-bold mb-2">
                  Contact Information
                </h1>

                <div className="flex flex-row space-x-2 mb-6 items-center">
                  <label className="">Phone:</label>
                  <input
                    className="border rounded border-black p-1"
                    type="text"
                    value={admin.phone || ""}
                    onChange={(e) =>
                      setAdmin({ ...admin, phone: e.target.value })
                    }
                  />
                </div>

                <div className="flex flex-row space-x-2 mb-6 items-center">
                  <label>Email: *</label>
                  <input
                    required
                    className="border rounded border-black p-1"
                    type="text"
                    value={admin.email || ""}
                    onChange={(e) =>
                      setAdmin({ ...admin, email: e.target.value })
                    }
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
