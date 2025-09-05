"use client";

import React, { useMemo, useState } from "react";
import NaNvbar from "../../../components/NavBarBeforeSignIn";
import EmployerSidebar from "../../../components/employerDashboard/EmployerSideBar";
import applications from "../../../data/applications.json";
import ChatWindow from "@/app/components/ChatWindow";
import PopupMessage from "@/app/components/ui/PopupMessage";
import SavedDocCard from "@/app/components/employerDashboard/SavedDocCard";

/* UI bits */
const Pill = ({ children, variant = "solid", onClick }) => {
  const base = "rounded-md px-4 py-2 text-sm font-medium transition";
  const solid = "bg-[#EE7D5E] text-white hover:opacity-90";
  const ghost = "bg-[#F3E1D5] text-black hover:opacity-90";
  return (
    <button
      onClick={onClick}
      className={`${base} ${variant === "solid" ? solid : ghost}`}
    >
      {children}
    </button>
  );
};

const SectionTitle = ({ children }) => (
  <h3 className="mb-3 mt-6 text-base font-semibold text-black">{children}</h3>
);

const Panel = ({ label, children }) => (
  <div className="rounded-xl bg-[#F3E1D5] px-4 py-4">
    <div className="mb-3 text-sm font-semibold underline underline-offset-4">
      {label}
    </div>
    {children}
  </div>
);

export default function ApplicationDetailsPage({ params }) {
  const [openChat, setOpenChat] = useState(false);
  const [popup, setPopup] = useState(null);

  const app = useMemo(
    () =>
      applications.find((a) => a.id === Number(params.id)) || applications[0],
    [params.id]
  );

  return (
    <div className="min-h-screen bg-white">
      <NaNvbar />

      <main className="mx-auto w-full px-6 py-8">
        <h1 className="mb-6 text-2xl font-bold text-[#DD5B45]">
          Employer DashBoard
        </h1>

        <div className="flex gap-6">
          <EmployerSidebar />

          <section className="flex-1 rounded-xl bg-white shadow">
            {/* Top header */}
            <div className="flex items-center justify-between border-b px-4 py-3">
              <div className="text-sm font-semibold text-black">
                Application #:{" "}
                {String(app.applicationNo).replace(/\d{3}$/, "###")}
              </div>
              <div className="flex items-center gap-3">
                <Pill
                  variant="ghost"
                  onClick={() =>
                    setPopup({
                      type: "confirm",
                      title: "Reject Application",
                      description:
                        "Are you sure you want to reject this application?",
                      buttonText: "Reject",
                      onConfirm: () => {
                        console.log("Rejected", app.id);
                        setPopup({
                          type: "success",
                          title: "Application Rejected",
                          description: "The applicant has been rejected.",
                          buttonText: "OK",
                        });
                      },
                    })
                  }
                >
                  Reject
                </Pill>

                <Pill
                  onClick={() =>
                    setPopup({
                      type: "confirm",
                      title: "Approve Application",
                      description:
                        "Are you sure you want to approve this application?",
                      buttonText: "Approve",
                      onConfirm: () => {
                        console.log("Approved", app.id);
                        setPopup({
                          type: "success",
                          title: "Application Approved",
                          description: "The applicant has been approved.",
                          buttonText: "OK",
                        });
                      },
                    })
                  }
                >
                  Approve
                </Pill>
              </div>
            </div>

            {/* Applicant summary */}
            <div className="flex items-start justify-between gap-4 px-4 py-4">
              <div className="flex-1 text-sm text-black">
                <div className="text-xl font-semibold">{app.applicant}</div>
                {app.headline && <div className="mt-1">{app.headline}</div>}
                {app.location && (
                  <div className="mt-1 font-semibold">{app.location}</div>
                )}
                {app.appliedAgo && <div className="mt-1">{app.appliedAgo}</div>}
              </div>
              <div className="flex w-40 shrink-0 flex-col gap-2">
                <Pill onClick={() => setOpenChat(true)}>Message</Pill>
                <Pill onClick={() => console.log("View Profile", app.id)}>
                  View Profile
                </Pill>
              </div>
            </div>

            <hr />

            {/* Insights */}
            <div className="px-4 py-4 text-gray-700">
              <h2 className="text-lg font-semibold text-black">
                Insights from profile
              </h2>

              {Array.isArray(app.experience) && app.experience.length > 0 && (
                <>
                  <SectionTitle>Experience</SectionTitle>
                  <Panel label="Experience">
                    <div className="space-y-6 text-sm">
                      {app.experience.map((e, idx) => (
                        <div key={idx}>
                          <div className="font-semibold">{e.title}</div>
                          <div>{e.company}</div>
                          <div className="text-gray-700">{e.date}</div>
                        </div>
                      ))}
                    </div>
                  </Panel>
                </>
              )}

              {Array.isArray(app.education) && app.education.length > 0 && (
                <>
                  <SectionTitle>Education</SectionTitle>
                  <Panel label="Education">
                    <div className="space-y-6 text-sm">
                      {app.education.map((ed, idx) => (
                        <div key={idx}>
                          <div className="font-semibold">{ed.school}</div>
                          <div>{ed.program}</div>
                          <div className="text-gray-700">{ed.date}</div>
                        </div>
                      ))}
                    </div>
                  </Panel>
                </>
              )}

              {/* Resume */}
              <SectionTitle>Resume</SectionTitle>
              <div className="mb-6 flex justify-center">
                <div className="mb-6 flex justify-center">
                  <SavedDocCard
                    title="Saved Resume"
                    name={app.applicant}
                    contact={[
                      "joywong1228@gmail.com",
                      "+1 (519) XXX XXXX",
                      app.location || "Calgary, AB",
                    ]}
                    bullets={[
                      "Project Manager | AAA Company",
                      "Intern | BBB Limited Company",
                      "XXX | XXXXX",
                    ]}
                    // If you have a working link, pass it:
                    // downloadUrl={app.resumeUrl}
                    // Otherwise omit it, and the popup will appear.
                  />
                </div>
              </div>

              {/* Cover Letter */}
              <SectionTitle>Cover Letter</SectionTitle>
              <div className="mb-6 flex justify-center">
                <SavedDocCard
                  title="Saved Cover Letter"
                  name={app.applicant}
                  body={`Dear Hiring Manager,

I'm excited to apply for the Web Development Internship at ABC Company...`}
                  // downloadUrl={app.coverLetterUrl}
                />
              </div>

              {/* Additional Questions */}
              <SectionTitle>Additional Question</SectionTitle>
              <div className="border-t pt-4">
                {app.additionalQuestions?.map((qa, i) => (
                  <div key={i} className="mb-6">
                    <div className="text-sm text-gray-600">{qa.question}</div>
                    <div className="mt-1 font-semibold">{qa.answer}</div>
                  </div>
                )) || (
                  <div className="text-sm text-gray-700">
                    No questions answered.
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>

        {openChat && (
          <ChatWindow
            recipient={app.applicant}
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
    </div>
  );
}
