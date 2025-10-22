"use client";

import React, { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/app/components/NavBarBeforeSignIn";
import EmployerSidebar from "@/app/components/employerDashboard/EmployerSideBar";
import PopupMessage from "@/app/components/ui/PopupMessage";
import jobs from "@/app/data/jobs.json";

/* ========== UI Elements ========== */
const FieldLabel = ({ children }) => (
  <div className="text-xs font-medium text-gray-700 mb-1">{children}</div>
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

const HeaderButton = ({ children, kind = "solid", onClick }) => {
  const base =
    "px-6 py-2 rounded-md text-sm font-semibold transition cursor-pointer";
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

/* ========== Rich Text Editor ========== */
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
const toolbarOptions = [
  [{ font: [] }, { size: [] }],
  ["bold", "italic", "underline", "strike"],
  [{ color: [] }, { background: [] }],
  [{ align: [] }],
  ["clean"],
];

export default function JobPostEditForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const id = searchParams.get("id");
  const isEdit = !!id;
  const jobId = isEdit ? Number(id) : null;

  const existingData = useMemo(() => {
    if (!isEdit) return {};
    return jobs.find((j) => j.id === jobId) ?? {};
  }, [isEdit, jobId]);

  /* ========== Form State ========== */
  const [title, setTitle] = useState(existingData.title || "");
  const [location, setLocation] = useState(
    existingData.location || "Calgary, Alberta"
  );
  const [type, setType] = useState(existingData.type || "On-site");
  const [salary, setSalary] = useState(existingData.salary || "");
  const [link, setLink] = useState(existingData.link || "");
  const [aboutCompany, setAboutCompany] = useState(
    existingData.aboutCompany || ""
  );
  const [aboutJob, setAboutJob] = useState(existingData.aboutJob || "");
  const [bringToTeam, setBringToTeam] = useState(
    existingData.bringToTeam || ""
  );
  const [skillsNeed, setSkillsNeed] = useState(existingData.skillsNeed || "");
  const [moreDetails, setMoreDetails] = useState(
    existingData.moreDetails || ""
  );

  const [popup, setPopup] = useState(null);
  const [errors, setErrors] = useState({});

  /* ========== Handlers ========== */
  const handleSave = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Job title is required.";
    if (!String(salary).trim())
      newErrors.salary = "Please enter a salary amount.";
    if (link && !/^https?:\/\//i.test(link))
      newErrors.link = "Invalid URL format.";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const jobData = {
      id: isEdit ? existingData.id : Math.floor(Math.random() * 100000),
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
    };

    console.log(isEdit ? "Updated job:" : "Created job:", jobData);

    setPopup({
      type: "success",
      title: isEdit ? "Job Post Updated" : "Job Post Created",
      description: isEdit
        ? "Your job post has been successfully updated."
        : "Your new job post has been added successfully.",
      buttonText: "OK",
    });
  };

  /* ========== Render ========== */
  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />
      <main className="mx-auto w-full px-6 py-8">
        <h1 className="mb-6 text-2xl font-bold text-[#DD5B45]">
          {isEdit ? "Edit Job Post" : "Add New Job Post"}
        </h1>

        <div className="flex gap-6">
          <EmployerSidebar />

          <section className="flex-1 rounded-xl bg-white shadow">
            {/* Header */}
            <div className="flex items-center justify-between border-b px-4 py-3">
              <div className="text-[15px] font-semibold">
                {isEdit ? existingData.title : "New Job Post"}
              </div>
              <div className="flex items-center gap-3">
                <HeaderButton kind="ghost" onClick={() => router.back()}>
                  Cancel
                </HeaderButton>
                <HeaderButton onClick={handleSave}>Save</HeaderButton>
              </div>
            </div>

            {/* Form Body */}
            <div className="space-y-6 px-4 py-4">
              <div>
                <FieldLabel>Job Title</FieldLabel>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Software Developer"
                />
                {errors.title && (
                  <p className="text-red-500 text-xs mt-1">{errors.title}</p>
                )}
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
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <Input
                      value={salary}
                      onChange={(e) => setSalary(e.target.value)}
                      placeholder="e.g. 35.00"
                      inputMode="decimal"
                    />
                    <span className="text-sm text-gray-600">/ Hourly</span>
                  </div>
                  {errors.salary && (
                    <p className="text-red-500 text-xs mt-1">{errors.salary}</p>
                  )}
                </div>

                <div className="flex flex-col gap-3">
                  <FieldLabel>External Link</FieldLabel>
                  <Input
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder="https://..."
                  />
                  {errors.link && (
                    <p className="text-red-500 text-xs mt-1">{errors.link}</p>
                  )}
                </div>
              </div>

              {/* Rich text sections */}
              <div>
                <FieldLabel>About the Company</FieldLabel>
                <ReactQuill
                  theme="snow"
                  value={aboutCompany}
                  onChange={setAboutCompany}
                  placeholder="Describe your company background"
                  modules={{ toolbar: toolbarOptions }}
                  className="bg-white text-black min-h-[220px] rounded-md mb-15"
                  style={{ height: "220px" }}
                />
              </div>

              <div>
                <FieldLabel>About the Job</FieldLabel>
                <ReactQuill
                  theme="snow"
                  value={aboutJob}
                  onChange={setAboutJob}
                  placeholder="Explain the job responsibilities and goals"
                  modules={{ toolbar: toolbarOptions }}
                  className="bg-white text-black min-h-[220px] rounded-md mb-15"
                  style={{ height: "220px" }}
                />
              </div>

              <div>
                <FieldLabel>What You Bring to the Team</FieldLabel>
                <ReactQuill
                  theme="snow"
                  value={bringToTeam}
                  onChange={setBringToTeam}
                  placeholder="List the qualities or mindset you expect"
                  modules={{ toolbar: toolbarOptions }}
                  className="bg-white text-black min-h-[220px] rounded-md mb-15"
                  style={{ height: "220px" }}
                />
              </div>

              <div>
                <FieldLabel>Required Skills</FieldLabel>
                <ReactQuill
                  theme="snow"
                  value={skillsNeed}
                  onChange={setSkillsNeed}
                  placeholder="Outline the technical and soft skills needed"
                  modules={{ toolbar: toolbarOptions }}
                  className="bg-white text-black min-h-[220px] rounded-md mb-15"
                  style={{ height: "220px" }}
                />
              </div>

              <div>
                <FieldLabel>More Details</FieldLabel>
                <ReactQuill
                  theme="snow"
                  value={moreDetails}
                  onChange={setMoreDetails}
                  placeholder="Any additional notes or benefits"
                  modules={{ toolbar: toolbarOptions }}
                  className="bg-white text-black min-h-[220px] rounded-md mb-15"
                  style={{ height: "220px" }}
                />
              </div>
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
