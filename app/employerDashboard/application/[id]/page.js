"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Navbar from "@/app/components/EmployerNavBar";
import EmployerSidebar from "@/app/components/employerDashboard/EmployerSideBar";
import ChatWindow from "@/app/components/ChatWindow";
import PopupMessage from "@/app/components/ui/PopupMessage";
import SavedDocCard from "@/app/components/employerDashboard/SavedDocCard";
import UserDetailsCard from "@/app/components/adminDashboard/UserDetailsCard";
import { useUser } from "@clerk/nextjs";
import ResumeCard from "@/app/components/application/ResumeCard";
import RelativePreview from "@/app/components/application/RelativePreview";
import ResumePreview from "@/app/components/application/ResumePreview";
import CoverLetter from "@/app/components/profile/coverLetterSection";
import CoverLetterPreview from "@/app/components/application/CoverLetterPreview";
import AnswerPreview from "@/app/components/application/AnswerPreview";
import withEmployerAuth from "@/app/components/employerDashboard/withEmployerAuth";
const SectionTitle = ({ children }) => (
  <h3 className="mb-3 mt-6 text-base font-semibold text-black">{children}</h3>
);

function ApplicationDetailsPage() {
  const { id } = useParams();

  const { user, isLoaded } = useUser();
  const router = useRouter();
  const numericId = Number(id);

  const [app, setApp] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [userResume, setUserResume] = useState();
  const [userCoverLetter, setUserCoverLetter] = useState();

  const [loading, setLoading] = useState(true);
  const [openChat, setOpenChat] = useState(false);
  const [popup, setPopup] = useState(null);
  const [statusStyle, setStatusStyle] = useState("");
  const [showProfile, setShowProfile] = useState(false);

  // Fetch application info
  const fetchAppData = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch applications by user_id
      const resApp = await fetch(`/api/application/${numericId}`, { cache: "no-store" });
      if (!resApp.ok) throw new Error("Failed to fetch application detail");
      const appData = await resApp.json();
      setApp(appData);

      // Fetch applicant's profile
      const resUser = await fetch(`/api/users/${appData.user_id}`);
      if (!resUser.ok) throw new Error("Failed to fetch applicant's profile")
      const user = await resUser.json();
      // console.log("user: ", user);
      setUserDetails(user);
          
      // Fetch resume by user_id
      const resResume = await fetch(`/api/resume/user/${appData.user_id}`, { cache: "no-store" });
      if (!resResume.ok) throw new Error("Failed to fetch user's resume");
      const resumeData = await resResume.json();
      setUserResume(resumeData);
  
      // Fetch cover letter by user_id
      const resCL = await fetch(`/api/cover_letter/user/${appData.user_id}`, { cache: "no-store" });
      if (!resCL.ok) throw new Error("Failed to fetch user's cover letter");
      const clData = await resCL.json();
      setUserCoverLetter(clData);
    } catch (error) {
      console.error("Error to fetch data: ", error);
    } finally {
      setLoading(false);
    }
  })

  useEffect(() => {
    if (numericId) fetchAppData();
  }, [numericId]);

  // Change badge color based on status
  useEffect(() => {
    if (!app) return;
    switch (app.status) {
      case "S":
        setStatusStyle("bg-gray-100 text-gray-800");
        break;
      case "U":
        setStatusStyle("bg-blue-100 text-blue-800");
        break;
      case "I":
        setStatusStyle("bg-green-100 text-green-800");
        break;
      case "R":
        setStatusStyle("bg-red-100 text-red-800");
        break;
      case "O":
        setStatusStyle("bg-yellow-100 text-yellow-800");
        break;
      case "D":
        setStatusStyle("bg-orange-100 text-orange-800");
        break;
    }
  }, [app?.status]);

  // Update status dropdown
  const updateStatus = async (newStatus) => {
    try {
      const res = await fetch(`/api/application/${app.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStatus),
      });
      if (!res.ok) throw new Error("Failed to update status");
      const data = await res.json();
      setApp((prev) => ({ ...prev, status: data.status }));
    } catch (err) {
      console.error("Status update failed:", err);
      alert("Failed to update application status");
    }
  };

  if (!isLoaded)
    return <div className="p-10 text-center text-black">Loading...</div>;

  return (
    <div className="w-full min-h-screen bg-linear-to-br from-[#f8eae2] to-white">
      <Navbar />
      <main className="mx-auto w-full px-6 py-8">
        <h1 className="mb-6 text-3xl font-bold text-[#DD5B45]">
          Employer Dashboard
        </h1>

        <div className="flex gap-6">
          <EmployerSidebar />

          {!app ? (
            <div className="p-10 text-center text-black">
              {loading ? "Loading..." : "Application not found"}
            </div>
          ) : (
            <section className="flex-1 rounded-xl bg-white shadow">
              <div className="flex items-center justify-between border-b px-4 py-3">
                <div className="flex items-center text-base font-semibold text-black">
                  Application: {String(app.id).padStart(3, "0")}
                </div>

                <div className="flex items-center gap-3">
                  <select
                    disabled={loading}
                    value={app.status}
                    onChange={(e) => updateStatus(e.target.value)}
                    className={`w-35 h-9 rounded-md text-base font-semibold border text-center ${statusStyle} ${
                      loading
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:opacity-90 active:scale-[0.98] transition"
                    }`}
                  >
                    <option value="S" className="bg-gray-100 text-gray-800">
                      Submitted
                    </option>
                    <option value="U" className="bg-blue-100 text-blue-800">
                      Under Review
                    </option>
                    <option value="I" className="bg-green-100 text-green-800">
                      Interview
                    </option>
                    <option value="R" className="bg-red-100 text-red-800">
                      Rejected
                    </option>
                    <option value="O" className="bg-yellow-100 text-yellow-800">
                      Offer
                    </option>
                    <option value="D" className="bg-orange-100 text-orange-800">
                      Withdrawn
                    </option>
                  </select>

                  <button
                    onClick={() =>
                      router.push("/employerDashboard/application")
                    }
                    className="rounded-md bg-[#F3E1D5] px-4 py-2 text-base font-semibold text-black hover:opacity-90 active:scale-[0.98] transition"
                  >
                    Back
                  </button>
                </div>
              </div>

              <div className="flex items-start justify-between gap-4 px-4 py-4">
                <div className="flex-1 text-base text-black">
                  <div className="text-2xl font-semibold">
                    {app.first_name} {app.last_name}
                  </div>
                  <div className="mt-1 font-semibold">{app.location}</div>
                  <div className="mt-1">
                    Applied: {new Date(app.applied_at).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex w-40 shrink-0 flex-col gap-2">
                  <button
                    onClick={() => setOpenChat(true)}
                    className="rounded-md bg-[#EE7D5E] px-4 py-2 text-base font-medium text-white hover:opacity-90"
                  >
                    Message
                  </button>
                  <button
                    onClick={() => setShowProfile(true)}
                    className="rounded-md bg-[#F3E1D5] px-4 py-2 text-base font-medium text-black hover:opacity-90"
                  >
                    View Profile
                  </button>
                </div>
              </div>

              <hr />

              {!loading &&
              <div className="px-4 py-4 text-gray-700">
                {/* Relative Information */}
                {(app.relative_first_name != "" ||
                  app.relative_last_name != "") && (
                  <div className="mb-4">
                    <RelativePreview title="Relative Information" app={app} />
                  </div>
                )}

                {/* Resume Information */}
                {userResume && (
                  <div className="mb-4">
                    <ResumePreview
                      title="Resume Information"
                      app={app}
                      resume={userResume}
                    />
                  </div>
                )}

                {/* Cover letter Information */}
                {userCoverLetter && (
                  <div className="mb-4">
                    <CoverLetterPreview
                      title="Cover Letter Information"
                      app={app}
                      coverLetter={userCoverLetter}
                    />
                  </div>
                )}

                {/* Answer employer Questions */}
                <AnswerPreview title="Employer Questions" app={app} />
              </div>}
            </section>
          )}
        </div>

        {openChat && app && (
          <ChatWindow
            me={user.id}
            recipient={app.user_id}
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

export default withEmployerAuth(ApplicationDetailsPage);
