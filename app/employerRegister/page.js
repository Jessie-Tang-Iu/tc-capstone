"use client";

import { useState } from "react";
import { useSignUp, useAuth, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import NavBarBeforeSignIn from "../components/NavBarBeforeSignIn";
import Button from "../components/ui/Button";
import PopupMessage from "../components/ui/PopupMessage";

export default function EmployerRegistration() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const { signOut } = useClerk();
  const { getToken } = useAuth();
  const router = useRouter();

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
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoaded) return;

    setLoading(true);
    setError("");

    if (!formData.email || !formData.password) {
      setError("Email and password are required");
      setLoading(false);
      return;
    }

    try {
      // Create Clerk user
      const result = await signUp.create({
        emailAddress: formData.email,
        password: formData.password,
        username: formData.username,
        firstName: formData.firstName,
        lastName: formData.lastName,
      });

      if (result.status === "complete") {
        // Save employer role metadata
        const token = await getToken({ template: "backend" });
        console.log("Submitting employer registration:", formData);

        const res = await fetch(`/api/users`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            role: "employer",
            status: 'under-review',
            clerkId: result.createdUserId,
            username: formData.username,
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phoneNumber,
            companyName: formData.organizationName,
            companyRole: formData.role,
            companyId: null, // Implement company linking later if needed
          }),
        });

        if (res.ok) { 
          setShowSuccess(true);
        } else {
          setError("Your username or email is taken. Please try another.")
        }

        if (result.createdSessionId) {
          await signOut();
        }

      } else {
        setError("Unexpected signup state: " + result.status);
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError(err.errors ? err.errors[0].message : err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div>
        {/* Navigation */}
        <NavBarBeforeSignIn />
        <div className="bg-gray-100 min-h-screen py-10">
          {/* Registration Form */}
          <h1 className="text-4xl mb-2 justify-center text-center text-[#DD5B45] font-bold">
            Register as Employer/Founder
          </h1>
          <p className="text-gray-600 mb-8 justify-center text-center">
            Connect with Alberta&rsquo;s top tech professionals.
          </p>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <div className="container mx-auto px-4 max-w-4xl mt-5 text-gray-800">
            <div className=" rounded-lg shadow-md p-8 bg-[#F3E1D5]">
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <h2 className="text-3xl text-[#DD5B45] font-bold mb-4">
                    Required Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                {/* Clerk CAPTCHA */}
                <div id="clerk-captcha" className="my-4"></div>

                <div className="flex justify-center">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-black text-white rounded px-3 py-2 w-72 mt-6 hover:bg-green-500 active:bg-amber-400 mx-auto block disabled:opacity-60"
                  >
                    {loading ? "Sending request..." : "Sign Up"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {showSuccess && (
        <PopupMessage
          type="success"
          title="Successfully Registration"
          description="Your registration form was submitted successfully and will be reviewed by our admin team. Please try logging in again in 2–3 days."
          onClose={() => {
            setShowSuccess(false);
            router.push("/") // redirect after signup
          }}
        />
      )}
    </>
  );
}
