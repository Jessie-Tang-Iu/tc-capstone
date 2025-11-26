"use client";

import Button from "@/app/components/ui/Button";
import Navbar from "@/app/components/EmployerNavBar";
import { useEffect, useState } from "react";

// Utility function to format the phone number for display
const formatPhoneNumber = (phoneNumberString) => {
  if (!phoneNumberString) return "";
  const cleaned = ("" + phoneNumberString).replace(/\D/g, ""); // Remove all non-digit characters
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

  if (match) {
    return "(" + match[1] + ") " + match[2] + "-" + match[3];
  }
  return cleaned;
};

export default function EmployerProfile() {
  const [employer, setEmployer] = useState({
    clerk_id: null,
    username: null,
    first_name: null,
    last_name: null,
    email: null,
    phone: null, // Stores raw digits (XXXXXXXXXX)
    role: null,
    company_name: null,
    company_role: null,
  });

  // NEW STATE: Tracks if the phone input is focused
  const [isPhoneFocused, setIsPhoneFocused] = useState(false);

  const ME = "testEmployer1";

  useEffect(() => {
    fetchEmployer(ME);
  }, []);

  const fetchEmployer = async (clerkId) => {
    const res = await fetch("/api/employer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clerk_id: clerkId }),
    });

    if (!res.ok) return;

    const data = await res.json();
    setEmployer({ ...data, clerk_id: clerkId });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    alert("Profile saved");

    try {
      await fetch("/api/employer", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clerk_id: employer.clerk_id,
          first_name: employer.first_name,
          last_name: employer.last_name,
          email: employer.email,
          phone: employer.phone,
          company_name: employer.company_name,
          company_role: employer.company_role,
          company_id: employer.company_id ?? null,
        }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handlePhoneChange = (e) => {
    // Sanitize the input to keep only digits (XXXXXXXXXX)
    const rawValue = e.target.value.replace(/\D/g, "");

    // Update the state with the raw, unformatted number, limited to 10 digits
    setEmployer({ ...employer, phone: rawValue.substring(0, 10) });
  };

  return (
    <main className="relative bg-gradient-to-br from-[#f8eae2] to-white min-h-screen">
      <Navbar />

      <div className="mx-auto mt-10 p-4">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <h1 className="text-4xl font-extrabold text-[#E55B3C] mb-6">
            Employer Profile
          </h1>

          <div className="w-full my-8 p-12 bg-white rounded-xl shadow-2xl text-black">
            <form onSubmit={handleProfileSubmit}>
              <div className="mb-10 border-b pb-8 border-gray-200">
                <p className="mb-6 text-sm text-gray-500">* Required fields</p>
                <h2 className="text-2xl font-bold mb-6 text-black">
                  Personal & Company Details
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
                      value={employer.first_name || ""}
                      onChange={(e) =>
                        setEmployer({
                          ...employer,
                          first_name: e.target.value,
                        })
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
                      value={employer.last_name || ""}
                      onChange={(e) =>
                        setEmployer({
                          ...employer,
                          last_name: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="flex flex-col md:col-span-2">
                    <label className="font-semibold text-gray-700 mb-1">
                      Company Role: *
                    </label>
                    <input
                      required
                      className="border rounded-lg border-gray-300 focus:border-[#E55B3C] focus:ring-1 focus:ring-[#E55B3C] transition duration-150 p-2"
                      type="text"
                      value={employer.company_role || ""}
                      onChange={(e) =>
                        setEmployer({
                          ...employer,
                          company_role: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="flex flex-col md:col-span-2">
                    <label className="font-semibold text-gray-700 mb-1">
                      Company Name:
                    </label>
                    <input
                      className="border rounded-lg border-gray-300 focus:border-[#E55B3C] focus:ring-1 focus:ring-[#E55B3C] transition duration-150 p-2"
                      type="text"
                      value={employer.company_name || ""}
                      onChange={(e) =>
                        setEmployer({
                          ...employer,
                          company_name: e.target.value,
                        })
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
                      value={employer.email || ""}
                      onChange={(e) =>
                        setEmployer({ ...employer, email: e.target.value })
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
                      // Conditional Value: Show raw digits when focused, formatted when blurred
                      value={
                        isPhoneFocused
                          ? employer.phone || ""
                          : formatPhoneNumber(employer.phone)
                      }
                      onChange={handlePhoneChange}
                      // Set focus state to true
                      onFocus={() => setIsPhoneFocused(true)}
                      // Set focus state to false (and re-format)
                      onBlur={() => setIsPhoneFocused(false)}
                      // Max length ensures we don't allow typing beyond 10 digits
                      maxLength="10"
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
