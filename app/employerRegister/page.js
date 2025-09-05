"use client";

import { useState } from "react";
import Link from "next/link";
import NavBarBeforeSignIn from "../components/NavBarBeforeSignIn";
import Button from "../components/ui/Button";

export default function EmployerRegistration() {
  // Form state
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    organizationName: "",
    role: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  });

  // UI state
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Frontend validation
    if (!formData.email || !formData.password) {
      setError("Email and password are required");
      setLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      console.log("Form submitted:", formData);
      setLoading(false);
      // Here you would typically redirect or show success message
    }, 1000);
  };

  return (
    <div>
      {/* Navigation */}
      <NavBarBeforeSignIn />
      <div className="bg-gray-100 min-h-screen py-10">
        {/* Registration Form */}
        <h1 className="text-4xl mb-2 justify-center text-center text-[#DD5B45] font-bold">
          Register as Employer/Founder
        </h1>
        <p className="text-gray-600 mb-8 justify-center text-center">
<<<<<<< Updated upstream
          Connect with Alberta's top tech professionals.
=======
          Connect with Alberta&rsquo;s top tech professionals.
>>>>>>> Stashed changes
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="container mx-auto px-4 max-w-4xl mt-5">
          <div className=" rounded-lg shadow-md p-8 bg-[#F3E1D5]">
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <h2 className="text-3xl font-semibold text-[#DD5B45] font-bold mb-4">
                  Required Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="username"
                      className="block text-gray-700 mb-2"
                    >
                      Username
                    </label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      required
                      value={formData.username}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border bg-[#E2B596] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="block text-gray-700 mb-2"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border bg-[#E2B596] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="organizationName"
                      className="block text-gray-700 mb-2"
                    >
                      Organization/Company Name
                    </label>
                    <input
                      type="text"
                      id="organizationName"
                      name="organizationName"
                      required
                      value={formData.organizationName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border bg-[#E2B596] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="role" className="block text-gray-700 mb-2">
                      Your Role
                    </label>
                    <input
                      type="text"
                      id="role"
                      name="role"
                      required
                      value={formData.role}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border bg-[#E2B596] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      //   placeholder="Founder, HR Manager, etc."
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-gray-700 mb-2"
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border bg-[#E2B596] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-gray-700 mb-2"
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border bg-[#E2B596] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border bg-[#E2B596] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phoneNumber"
                      className="block text-gray-700 mb-2"
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      required
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border bg-[#E2B596] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <p className="text-gray-600 mb-6 italic justify-center text-center">
                The rest of the information can be updated in the profile page
              </p>

              <div className="flex justify-center">
                <Button text="Register" />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
