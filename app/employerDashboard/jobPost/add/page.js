"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../../components/NavBarBeforeSignIn";
import EmployerSidebar from "../../../components/employerDashboard/EmployerSideBar";
import PopupMessage from "@/app/components/ui/PopupMessage";

/* Small UI atoms */
const FieldLabel = ({ children }) => (
  <div className="text-xs font-medium text-gray-700">{children}</div>
);
const Input = (props) => (
  <input
    {...props}
    className={`w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-200 ${
      props.className || ""
    }`}
  />
);
const Select = ({ children, ...props }) => (
  <select
    {...props}
    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-200"
  >
    {children}
  </select>
);
const TextAreaWithCount = ({ label, value, setValue, max = 500, rows = 5 }) => {
  const count = value.length;
  return (
    <div className="mb-6">
      <div className="mb-2 font-semibold text-sm">{label}</div>
      <div className="rounded-md border border-gray-300">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value.slice(0, max))}
          rows={rows}
          placeholder=""
          className="w-full resize-none rounded-md px-3 py-2 text-sm outline-none"
        />
        <div className="flex justify-end px-2 pb-1 text-[11px] text-gray-500">
          {count} / {max}
        </div>
      </div>
    </div>
  );
};
const HeaderButton = ({ children, kind = "solid", onClick }) => {
  const base = "px-6 py-2 rounded-md text-sm font-semibold transition";
  const solid = "bg-[#EE7D5E] text-white hover:opacity-90";
  const ghost = "bg-[#F3E1D5] text-black hover:opacity-90";
  return (
    <button
      onClick={onClick}
      className={`${base} ${kind === "solid" ? solid : ghost}`}
    >
      {children}
    </button>
  );
};

export default function AddJobPostPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("Calgary, Alberta");
  const [type, setType] = useState("On-site");
  const [salary, setSalary] = useState("");
  const [link, setLink] = useState("");
  const [aboutCompany, setAboutCompany] = useState("");
  const [aboutJob, setAboutJob] = useState("");
  const [bringToTeam, setBringToTeam] = useState("");
  const [skillsNeed, setSkillsNeed] = useState("");
  const [moreDetails, setMoreDetails] = useState("");
  const [popup, setPopup] = useState(null);

  const handleSave = () => {
    if (!title) {
      setPopup({
        type: "error",
        title: "Missing Title",
        description: "Please enter the job title before saving.",
        buttonText: "OK",
      });
      return;
    }

    console.log("New job post created:", {
      title,
      location,
      type,
      salary,
      link,
      aboutCompany,
      aboutJob,
      bringToTeam,
      skillsNeed,
      moreDetails,
    });

    setPopup({
      type: "success",
      title: "Job Post Created",
      description: "Your new job post has been added successfully.",
      buttonText: "OK",
    });
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />

      <main className="mx-auto w-full px-6 py-8">
        <h1 className="mb-6 text-2xl font-bold text-[#DD5B45]">
          Add New Job Post
        </h1>

        <div className="flex gap-6">
          <EmployerSidebar />

          <section className="flex-1 rounded-xl bg-white shadow">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <div className="text-[15px] font-semibold">New Job Post</div>
              <div className="flex items-center gap-3">
                <HeaderButton kind="ghost" onClick={() => router.back()}>
                  Cancel
                </HeaderButton>
                <HeaderButton onClick={handleSave}>Save</HeaderButton>
              </div>
            </div>

            <div className="space-y-6 px-4 py-4">
              <div>
                <FieldLabel>Job Title</FieldLabel>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Software Developer"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex flex-col gap-3">
                  <FieldLabel>Location</FieldLabel>
                  <Select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  >
                    {[
                      "Calgary, Alberta",
                      "Edmonton, Alberta",
                      "Vancouver, BC",
                      "Toronto, ON",
                    ].map((opt) => (
                      <option key={opt}>{opt}</option>
                    ))}
                  </Select>

                  <FieldLabel>Type</FieldLabel>
                  <Select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  >
                    {["Remote", "On-site", "Hybrid", "Contract"].map((opt) => (
                      <option key={opt}>{opt}</option>
                    ))}
                  </Select>

                  <FieldLabel>Salary</FieldLabel>
                  <div className="flex items-center gap-2">
                    <Input
                      value={salary}
                      onChange={(e) => setSalary(e.target.value)}
                      placeholder="e.g. 35.00"
                      inputMode="decimal"
                    />
                    <span className="text-sm text-gray-600">/ Hourly</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <FieldLabel>External Link</FieldLabel>
                  <Input
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder="https://…"
                  />
                </div>
              </div>

              <TextAreaWithCount
                label="About the Company"
                value={aboutCompany}
                setValue={setAboutCompany}
              />
              <TextAreaWithCount
                label="About the Job"
                value={aboutJob}
                setValue={setAboutJob}
              />
              <TextAreaWithCount
                label="What you bring to the team"
                value={bringToTeam}
                setValue={setBringToTeam}
              />
              <TextAreaWithCount
                label="Required Skills"
                value={skillsNeed}
                setValue={setSkillsNeed}
              />
              <TextAreaWithCount
                label="More Details"
                value={moreDetails}
                setValue={setMoreDetails}
              />
            </div>
          </section>
        </div>

        {popup && (
          <PopupMessage
            type={popup.type}
            title={popup.title}
            description={popup.description}
            buttonText={popup.buttonText}
            onClose={() => setPopup(null)}
          />
        )}
      </main>
    </div>
  );
}
