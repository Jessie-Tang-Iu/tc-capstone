"use client";

import Button from "@/app/components/ui/Button";
import Navbar from "@/app/components/EmployerNavBar";
import { useEffect, useState } from "react";

export default function EmployerProfile() {
  const [employer, setEmployer] = useState({
    clerk_id: null,
    username: null,
    first_name: null,
    last_name: null,
    email: null,
    phone: null,
    role: null,
    company_name: null,
    company_role: null,
  });

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

    // Always show popup
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

  return (
    <main className="relative bg-gradient-to-br from-[#f8eae2] to-white min-h-screen">
      <Navbar />

      <div className="mx-auto mt-10">
        <div className="w-4/5 mx-auto flex flex-col justify-center items-center">
          <h1 className="text-3xl font-bold text-[#E55B3C]">
            Employer Profile
          </h1>

          <div className="w-full my-8 p-12 bg-white rounded-lg shadow-md text-black">
            <form onSubmit={handleProfileSubmit}>
              <div className="flex justify-between">
                <div className="mb-10">
                  <p className="mb-6 text-gray-600">* Required</p>
                  <h1 className="text-2xl font-bold mb-2 text-black">
                    Personal Information
                  </h1>

                  <div className="flex flex-row space-x-4">
                    <div className="flex flex-col">
                      <label className="font-bold text-black">
                        First Name: *
                      </label>
                      <input
                        required
                        className="border rounded border-black mb-6 p-1"
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
                      <label className="font-bold text-black">
                        Last Name: *
                      </label>
                      <input
                        required
                        className="border rounded border-black mb-6 p-1"
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
                  </div>

                  <div className="flex flex-col">
                    <label className="font-bold text-black">
                      Company Role: *
                    </label>
                    <input
                      required
                      className="border rounded border-black mb-6 p-1"
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

                  <div className="flex flex-col">
                    <label className="font-bold text-black">
                      Company Name:
                    </label>
                    <input
                      className="border rounded border-black mb-6 p-1"
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

                <div>
                  <Button text="Save" type="submit" />
                </div>
              </div>

              <div className="mb-10">
                <h1 className="text-2xl font-bold mb-2 text-black">
                  Contact Information
                </h1>

                <div className="flex flex-row space-x-2 mb-6 items-center">
                  <label className="text-black">Phone:</label>
                  <input
                    className="border rounded border-black p-1"
                    type="text"
                    value={employer.phone || ""}
                    onChange={(e) =>
                      setEmployer({ ...employer, phone: e.target.value })
                    }
                  />
                </div>

                <div className="flex flex-row space-x-2 mb-6 items-center">
                  <label className="text-black">Email: *</label>
                  <input
                    required
                    className="border rounded border-black p-1"
                    type="text"
                    value={employer.email || ""}
                    onChange={(e) =>
                      setEmployer({ ...employer, email: e.target.value })
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
