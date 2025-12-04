"use client";

import Button from "@/app/components/ui/Button";
import Navbar from "../../components/AdminNavBar";
import { useEffect, useState } from "react";
import withAdminAuth from "@/app/components/adminDashboard/withAdminAuth";

const formatPhoneNumber = (phoneNumberString) => {
  if (!phoneNumberString) return "";
  const cleaned = ("" + phoneNumberString).replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

  if (match) {
    return "(" + match[1] + ") " + match[2] + "-" + match[3];
  }
  return cleaned;
};

function AdminProfile() {
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

  const ME = "testAdmin1";

  useEffect(() => {
    if (!ME) return;
    fetchAdmin(ME);
  }, [ME]);

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

  const handlePhoneChange = (e) => {
    const rawValue = e.target.value.replace(/\D/g, "");

    setAdmin({ ...admin, phone: rawValue.substring(0, 10) });
  };

  return (
    <main className="bg-gradient-to-br from-[#f8eae2] to-white min-h-screen">
      <Navbar />

      <div className="mx-auto mt-10 p-4">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <h1 className="text-4xl font-extrabold text-[#E55B3C] mb-6">
            Admin Profile
          </h1>

          <div className="w-full my-8 p-12 bg-white rounded-xl shadow-2xl text-black">
            <form onSubmit={handleProfileSubmit}>
              <div className="mb-10 border-b pb-8 border-gray-200">
                <p className="mb-6 text-sm text-gray-500">
                  * Indicates required fields
                </p>
                <h2 className="text-2xl font-bold mb-6 text-black">
                  Personal & Office Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <div className="flex flex-col">
                    <label className="font-semibold text-gray-700 mb-1">
                      First Name: *
                    </label>
                    <input
                      required
                      className="border rounded-lg border-gray-300 focus:border-[#E55B3C] focus:ring-1 focus:ring-[#E55B3C] transition duration-150 p-2"
                      type="text"
                      value={admin.first_name || ""}
                      onChange={(e) =>
                        setAdmin({ ...admin, first_name: e.target.value })
                      }
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="font-semibold text-gray-700 mb-1">
                      Last Name: *
                    </label>
                    <input
                      required
                      className="border rounded-lg border-gray-300 focus:border-[#E55B3C] focus:ring-1 focus:ring-[#E55B3C] transition duration-150 p-2"
                      type="text"
                      value={admin.last_name || ""}
                      onChange={(e) =>
                        setAdmin({ ...admin, last_name: e.target.value })
                      }
                    />
                  </div>

                  <div className="flex flex-col md:col-span-2">
                    <label className="font-semibold text-gray-700 mb-1">
                      Department: *
                    </label>
                    <input
                      required
                      className="border rounded-lg border-gray-300 focus:border-[#E55B3C] focus:ring-1 focus:ring-[#E55B3C] transition duration-150 p-2"
                      type="text"
                      value={admin.department || ""}
                      onChange={(e) =>
                        setAdmin({ ...admin, department: e.target.value })
                      }
                    />
                  </div>

                  <div className="flex flex-col md:col-span-2">
                    <label className="font-semibold text-gray-700 mb-1">
                      Office Location:
                    </label>
                    <input
                      className="border rounded-lg border-gray-300 focus:border-[#E55B3C] focus:ring-1 focus:ring-[#E55B3C] transition duration-150 p-2"
                      type="text"
                      value={admin.office_location || ""}
                      onChange={(e) =>
                        setAdmin({ ...admin, office_location: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="mb-10">
                <h2 className="text-2xl font-bold mb-6 text-black">
                  Contact Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <div className="flex flex-col">
                    <label className="font-semibold text-gray-700 mb-1">
                      Email: *
                    </label>
                    <input
                      required
                      className="border rounded-lg border-gray-300 focus:border-[#E55B3C] focus:ring-1 focus:ring-[#E55B3C] transition duration-150 p-2"
                      type="email"
                      value={admin.email || ""}
                      onChange={(e) =>
                        setAdmin({ ...admin, email: e.target.value })
                      }
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="font-semibold text-gray-700 mb-1">
                      Phone:
                    </label>
                    <input
                      className="border rounded-lg border-gray-300 focus:border-[#E55B3C] focus:ring-1 focus:ring-[#E55B3C] transition duration-150 p-2"
                      type="tel"
                      value={formatPhoneNumber(admin.phone)}
                      onChange={handlePhoneChange}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-center pt-4">
                <Button text="Save Profile" type="submit" />
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

export default withAdminAuth(AdminProfile);
