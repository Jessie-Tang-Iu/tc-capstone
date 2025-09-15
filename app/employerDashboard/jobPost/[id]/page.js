"use client";

import React, { useMemo, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Navbar from "../../../components/NavBarBeforeSignIn";
import EmployerSidebar from "../../../components/employerDashboard/EmployerSideBar";
import PopupMessage from "@/app/components/ui/PopupMessage";
import jobs from "../../../data/jobs.json";

/* Small UI atoms (unchanged) */
const FieldLabel = ({ children }) => (
  <div className="text-xs font-medium text-gray-700">{children}</div>
);

const Row = ({ children, right }) => (
  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
    <div className="flex flex-col">{children}</div>
    {right}
  </div>
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

const TextAreaWithCount = ({
  label,
  value,
  setValue,
  max = 500,
  rows = 5,
  placeholder,
}) => {
  const safeValue = value ?? "";
  const count = safeValue.length;

  return (
    <div className="mb-6">
      <div className="mb-2 font-semibold text-sm">{label}</div>
      <div className="rounded-md border border-gray-300">
        <textarea
          value={safeValue}
          onChange={(e) => setValue(e.target.value.slice(0, max))}
          rows={rows}
          placeholder={placeholder}
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

export default function JobPostDetailsPage() {
  const router = useRouter();
  const { id } = useParams();
  const jobId = Number(id);

  const data = useMemo(() => {
    const found = jobs.find((j) => j.id === jobId);
    return found ?? jobs[0];
  }, [jobId]);

  // form state seeded from JSON (uses list + long fields from the same JSON)
  const [status, setStatus] = useState(data.status ?? "Open");
  const [location, setLocation] = useState(data.location);
  const [type, setType] = useState(data.type);
  const [salary, setSalary] = useState(data.salary);
  const [link, setLink] = useState(data.link);

  const [aboutCompany, setAboutCompany] = useState(data.aboutCompany);
  const [aboutJob, setAboutJob] = useState(data.aboutJob);
  const [bringToTeam, setBringToTeam] = useState(data.bringToTeam);
  const [skillsNeed, setSkillsNeed] = useState(data.skillsNeed);
  const [moreDetails, setMoreDetails] = useState(data.moreDetails);

  const [popup, setPopup] = useState(null);

  const handleClose = () => router.push("/employerDashboard/jobPost");

  const handleSave = () => {
    console.log("Saved job:", {
      id: data.id,
      status,
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
      title: "Job Post Saved",
      description: "Your job post changes have been saved successfully.",
      buttonText: "OK",
    });
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />

      <main className="mx-auto w-full px-6 py-8">
        <h1 className="mb-6 text-2xl font-bold text-[#DD5B45]">
          Employer DashBoard
        </h1>

        <div className="flex gap-6">
          <EmployerSidebar />

          <section className="flex-1 rounded-xl bg-white shadow">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <div className="text-[15px] font-semibold">{data.title}</div>
              <div className="flex items-center gap-3">
                <HeaderButton kind="ghost" onClick={handleClose}>
                  Cancel
                </HeaderButton>
                <HeaderButton onClick={handleSave}>Save</HeaderButton>
              </div>
            </div>

            <div className="space-y-6 px-4 py-4">
              <Row
                right={
                  <div className="flex flex-col gap-3">
                    <FieldLabel>External Link</FieldLabel>
                    <Input
                      value={link}
                      onChange={(e) => setLink(e.target.value)}
                      placeholder="https://…"
                    />
                  </div>
                }
              >
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
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </Select>

                  <FieldLabel>Type</FieldLabel>
                  <Select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  >
                    {["Remote", "On-site", "Hybrid", "Contract"].map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </Select>

                  <FieldLabel>Salary</FieldLabel>
                  <div className="flex items-center gap-2">
                    <Input
                      value={salary}
                      onChange={(e) => setSalary(e.target.value)}
                      placeholder="e.g. 34.55"
                      inputMode="decimal"
                    />
                    <span className="text-sm text-gray-600">/ Hourly</span>
                  </div>
                </div>
              </Row>

              <TextAreaWithCount
                label="About the Company"
                value={aboutCompany}
                setValue={setAboutCompany}
                max={500}
                rows={6}
              />
              <TextAreaWithCount
                label="About the Job"
                value={aboutJob}
                setValue={setAboutJob}
                max={500}
                rows={5}
              />
              <TextAreaWithCount
                label="What you bring to the team"
                value={bringToTeam}
                setValue={setBringToTeam}
                max={500}
                rows={5}
              />
              <TextAreaWithCount
                label="What skill you need"
                value={skillsNeed}
                setValue={setSkillsNeed}
                max={500}
                rows={5}
              />
              <TextAreaWithCount
                label="More details"
                value={moreDetails}
                setValue={setMoreDetails}
                max={500}
                rows={4}
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
