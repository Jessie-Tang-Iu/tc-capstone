"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Navbar from "../../../components/BlankNavBar";
import EmployerSidebar from "../../../components/employerDashboard/EmployerSideBar";
import ChatWindow from "@/app/components/ChatWindow";
import PopupMessage from "@/app/components/ui/PopupMessage";
import SavedDocCard from "@/app/components/employerDashboard/SavedDocCard";
import UserDetailsCard from "@/app/components/adminDashboard/UserDetailsCard";

const SectionTitle = ({ children }) => (
  <h3 className="mb-3 mt-6 text-base font-semibold text-black">{children}</h3>
);

export default function ApplicationDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const numericId = Number(id);

  const [app, setApp] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openChat, setOpenChat] = useState(false);
  const [popup, setPopup] = useState(null);
  const [statusStyle, setStatusStyle] = useState("");
  const [showProfile, setShowProfile] = useState(false);

  // Fetch application info
  useEffect(() => {
    const fetchApp = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/application?employer_id=testEmployer1`);
        const data = await res.json();
        const found = data.find((a) => Number(a.id) === numericId);
        if (!found) return setApp(null);

        // Add clerk_id (map if stored under user_id)
        found.clerk_id = found.user_id || found.clerk_id || null;
        setApp(found);

        // Fetch user details if we have clerk_id
        if (found.clerk_id) {
          const resUser = await fetch(`/api/users/${found.clerk_id}`);
          if (resUser.ok) {
            const user = await resUser.json();
            setUserDetails(user);
          }
        }
      } catch (err) {
        console.error("Error fetching application:", err);
        setApp(null);
      } finally {
        setLoading(false);
      }
    };
    fetchApp();
  }, [numericId]);

  // Change badge color based on status
  useEffect(() => {
    if (!app) return;
    switch (app.status) {
      case "A":
        setStatusStyle("bg-green-100 text-green-700");
        break;
      case "R":
        setStatusStyle("bg-red-100 text-red-700");
        break;
      case "I":
        setStatusStyle("bg-yellow-100 text-yellow-700");
        break;
      case "O":
        setStatusStyle("bg-blue-100 text-blue-700");
        break;
      case "D":
        setStatusStyle("bg-gray-300 text-gray-700");
        break;
      default:
        setStatusStyle("bg-gray-100 text-gray-600");
    }
  }, [app?.status]);

  // Update status dropdown
  const updateStatus = async (newStatus) => {
    try {
      const res = await fetch(`/api/application/${app.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      const data = await res.json();
      setApp((prev) => ({ ...prev, status: data.status }));
    } catch (err) {
      console.error("Status update failed:", err);
      alert("Failed to update application status");
    }
  };

  if (loading)
    return <div className="p-10 text-center text-black">Loading...</div>;

  if (!app)
    return (
      <div className="p-10 text-center text-black">Application not found.</div>
    );

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#f8eae2] to-white">
      <Navbar />
      <main className="mx-auto w-full px-6 py-8">
        <h1 className="mb-6 text-2xl font-bold text-[#DD5B45]">
          Employer Dashboard
        </h1>

        <div className="flex gap-6">
          <EmployerSidebar />

          <section className="flex-1 rounded-xl bg-white shadow">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <div className="flex items-center text-sm font-semibold text-black">
                Application: {String(app.id).padStart(3, "0")}
              </div>

              <div className="flex items-center gap-3">
                <select
                  disabled={loading}
                  value={app.status}
                  onChange={(e) => updateStatus(e.target.value)}
                  className={`w-32 h-9 rounded-md text-sm font-semibold border text-center ${statusStyle} ${
                    loading
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:opacity-90 active:scale-[0.98] transition"
                  }`}
                >
                  <option value="S">Submitted</option>
                  <option value="U">Under Review</option>
                  <option value="I">Interview</option>
                  <option value="R">Rejected</option>
                  <option value="O">Offer</option>
                  <option value="D">Withdrawn</option>
                  <option value="A">Approved</option>
                </select>

                <button
                  onClick={() => router.push("/employerDashboard/application")}
                  className="rounded-md bg-[#F3E1D5] px-4 py-2 text-sm font-semibold text-black hover:opacity-90 active:scale-[0.98] transition"
                >
                  Cancel
                </button>
              </div>
            </div>

            <div className="flex items-start justify-between gap-4 px-4 py-4">
              <div className="flex-1 text-sm text-black">
                <div className="text-xl font-semibold">
                  {app.first_name} {app.last_name}
                </div>
                <div className="mt-1 font-semibold">{app.location}</div>
                <div className="mt-1">
                  Applied: {new Date(app.appliedAt).toLocaleDateString()}
                </div>
              </div>
              <div className="flex w-40 shrink-0 flex-col gap-2">
                <button
                  onClick={() => setOpenChat(true)}
                  className="rounded-md bg-[#EE7D5E] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
                >
                  Message
                </button>
                <button
                  onClick={() => setShowProfile(true)}
                  className="rounded-md bg-[#F3E1D5] px-4 py-2 text-sm font-medium text-black hover:opacity-90"
                >
                  View Profile
                </button>
              </div>
            </div>

            <hr />

            <div className="px-4 py-4 text-gray-700">
              <SectionTitle>Resume</SectionTitle>
              <div className="mb-6 flex justify-center">
                <SavedDocCard
                  title="Saved Resume"
                  name={`${app.first_name} ${app.last_name}`}
                  contact={[
                    app.email || "no-email",
                    app.phone || "no-phone",
                    app.location || "N/A",
                  ]}
                  bullets={[
                    "Professional experience and education details unavailable (placeholder)",
                  ]}
                />
              </div>

              <SectionTitle>Cover Letter</SectionTitle>
              <div className="mb-6 flex justify-center">
                <SavedDocCard
                  title="Saved Cover Letter"
                  name={`${app.first_name} ${app.last_name}`}
                  body={`Dear Hiring Manager,\n\nI'm excited to apply for the position at ${app.company}. I believe my background aligns with your requirements...`}
                />
              </div>
            </div>
          </section>
        </div>

        {openChat && (
          <ChatWindow
            recipient={`${app.first_name} ${app.last_name}`}
            onClose={() => setOpenChat(false)}
            onSend={(text) => console.log("send:", text)}
          />
        )}

        {popup && (
          <PopupMessage
            type={popup.type}
            title={popup.title}
            description={popup.description}
            buttonText={popup.buttonText}
            onConfirm={popup.onConfirm}
            onClose={() => setPopup(null)}
          />
        )}
      </main>

      {showProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="max-w-3xl w-full mx-4">
            <UserDetailsCard
              user={userDetails || app}
              roleLabel="Member"
              onClose={() => setShowProfile(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
