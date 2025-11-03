"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/app/components/BlankNavBar";
import EmployerSidebar from "@/app/components/employerDashboard/EmployerSideBar";
import PopupMessage from "@/app/components/ui/PopupMessage";

/* ========== UI ========== */
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

/* ========== ReactQuill ========== */
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

  const [loading, setLoading] = useState(true);
  const [popup, setPopup] = useState(null);
  const [errors, setErrors] = useState({});
  const [jobData, setJobData] = useState({});

  // dropdown options
  const [industries, setIndustries] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [types, setTypes] = useState([]);
  const [workplaces, setWorkplaces] = useState([]);

  // fetch dropdowns
  useEffect(() => {
    const loadDropdowns = async () => {
      try {
        const [ind, exp, typ, work] = await Promise.all([
          fetch("/api/job/industries").then((r) => r.json()),
          fetch("/api/job/experience").then((r) => r.json()),
          fetch("/api/job/types").then((r) => r.json()),
          fetch("/api/job/workplaces").then((r) => r.json()),
        ]);
        console.log("Dropdown results:", { ind, exp, typ, work }); // <--
        setIndustries(ind);
        setExperiences(exp);
        setTypes(typ);
        setWorkplaces(work);
      } catch (err) {
        console.error("Dropdown load failed:", err);
      }
    };
    loadDropdowns();
  }, []);

  /* ======= Fetch existing job ======= */
  useEffect(() => {
    if (!isEdit) {
      setLoading(false);
      return;
    }
    const fetchJob = async () => {
      try {
        const res = await fetch(`/api/job/${jobId}`);
        if (!res.ok) throw new Error("Failed to load job details");
        const data = await res.json();
        setJobData(data);
      } catch (err) {
        console.error("Error fetching job:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [isEdit, jobId]);

  useEffect(() => {
    if (isEdit && jobData?.title) {
      setTitle(jobData.title || "");
      setCompany(jobData.company || jobData.company_name || ""); // ← key fix
      setLocation(jobData.location || "Calgary, Alberta");
      setIndustryId(jobData.industry_id || "");
      setWorkplaceId(jobData.workplace_id || "");
      setTypeId(jobData.type_id || "");
      setExperienceId(jobData.experience_id || "");
      setSalary(jobData.salary_per_hour || "");
      setLink(jobData.link || "");
      setAboutCompany(jobData.company_info || "");
      setAboutJob(jobData.description || "");
      setBringToTeam(jobData.responsibilities || "");
      setSkillsNeed(jobData.requirements || "");
      setMoreDetails(jobData.details || "");
      setBenefits(jobData.benefits || "");
    }
  }, [jobData, isEdit]);

  /* ======= Form fields ======= */
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("Calgary, Alberta");
  const [industryId, setIndustryId] = useState("");
  const [workplaceId, setWorkplaceId] = useState("");
  const [typeId, setTypeId] = useState("");
  const [experienceId, setExperienceId] = useState("");
  const [salary, setSalary] = useState("");
  const [link, setLink] = useState("");
  const [aboutCompany, setAboutCompany] = useState("");
  const [aboutJob, setAboutJob] = useState("");
  const [bringToTeam, setBringToTeam] = useState("");
  const [skillsNeed, setSkillsNeed] = useState("");
  const [moreDetails, setMoreDetails] = useState("");
  const [benefits, setBenefits] = useState("");

  /* ======= Prefill ======= */
  useEffect(() => {
    if (isEdit && jobData?.title) {
      setTitle(jobData.title || "");
      setCompany(jobData.company || "");
      setLocation(jobData.location || "Calgary, Alberta");
      setIndustryId(jobData.industry_id || "");
      setWorkplaceId(jobData.workplace_id || "");
      setTypeId(jobData.type_id || "");
      setExperienceId(jobData.experience_id || "");
      setSalary(jobData.salary_per_hour || "");
      setLink(jobData.link || "");
      setAboutCompany(jobData.company_info || "");
      setAboutJob(jobData.description || "");
      setBringToTeam(jobData.responsibilities || "");
      setSkillsNeed(jobData.requirements || "");
      setMoreDetails(jobData.details || "");
      setBenefits(jobData.benefits || "");
    }
  }, [jobData, isEdit]);

  /* ======= Save ======= */
  const handleSave = async () => {
    const newErrors = {};
    const stripHtml = (html) => html.replace(/<[^>]*>/g, "").trim();

    if (!title.trim()) newErrors.title = "Job title is required.";
    if (!company.trim()) newErrors.company = "Company name is required.";
    if (!location.trim()) newErrors.location = "Location is required.";
    if (!industryId) newErrors.industry = "Industry is required.";
    if (!workplaceId) newErrors.workplace = "Workplace is required.";
    if (!typeId) newErrors.type = "Job type is required.";
    if (!experienceId) newErrors.experience = "Experience level is required.";
    if (!String(salary).trim()) newErrors.salary = "Salary is required.";

    if (!stripHtml(aboutCompany))
      newErrors.aboutCompany = "Company info is required.";
    if (!stripHtml(aboutJob))
      newErrors.aboutJob = "Job description is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const payload = {
      title,
      company,
      location,
      postedAt: new Date().toISOString(),
      industryId: Number(industryId),
      workplaceId: Number(workplaceId),
      typeId: Number(typeId),
      experienceId: Number(experienceId),
      salaryPerHour: Number(salary),
      link,
      aboutCompany,
      description: aboutJob,
      responsibilities: bringToTeam,
      requirements: skillsNeed,
      details: moreDetails,
      benefits,
    };

    try {
      const res = await fetch(isEdit ? `/api/job/${jobId}` : "/api/job", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`Failed to save job post (${res.status})`);
      setPopup({
        type: "success",
        title: isEdit ? "Updated" : "Created",
        description: isEdit
          ? "Job post successfully updated."
          : "New job post added successfully.",
        buttonText: "OK",
      });
    } catch (err) {
      console.error("Error saving job:", err);
      setPopup({
        type: "error",
        title: "Error",
        description: err.message,
        buttonText: "OK",
      });
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading...
      </div>
    );

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#f8eae2] to-white text-black">
      <Navbar />
      <main className="mx-auto w-full px-6 py-8">
        <h1 className="mb-6 text-2xl font-bold text-[#DD5B45]">
          {isEdit ? "Edit Job Post" : "Add New Job Post"}
        </h1>

        <div className="flex gap-6">
          <EmployerSidebar />

          <section className="flex-1 rounded-xl bg-white shadow px-4 py-4">
            {/* Header */}
            <div className="flex items-center justify-between border-b pb-3 mb-6">
              <div className="text-[15px] font-semibold">
                {title || "New Job"}
              </div>
              <div className="flex items-center gap-3">
                <HeaderButton kind="ghost" onClick={() => router.back()}>
                  Cancel
                </HeaderButton>
                <HeaderButton onClick={handleSave}>Save</HeaderButton>
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FieldLabel>Job Title</FieldLabel>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                {errors.title && (
                  <p className="text-red-500 text-xs">{errors.title}</p>
                )}
              </div>

              <div>
                <FieldLabel>Company</FieldLabel>
                <Input
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
                {errors.company && (
                  <p className="text-red-500 text-xs">{errors.company}</p>
                )}
              </div>

              <div>
                <FieldLabel>Location</FieldLabel>
                <Input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
                {errors.location && (
                  <p className="text-red-500 text-xs">{errors.location}</p>
                )}
              </div>

              <div>
                <FieldLabel>Salary (per hour)</FieldLabel>
                <Input
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  placeholder="e.g. 30.00"
                />
                {errors.salary && (
                  <p className="text-red-500 text-xs">{errors.salary}</p>
                )}
              </div>
            </div>

            {/* Dropdowns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <FieldLabel>Industry</FieldLabel>
                <Select
                  value={industryId}
                  onChange={(e) => setIndustryId(e.target.value)}
                >
                  <option value="">Select Industry</option>
                  {industries.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.name}
                    </option>
                  ))}
                </Select>
                {errors.industry && (
                  <p className="text-red-500 text-xs">{errors.industry}</p>
                )}
              </div>

              <div>
                <FieldLabel>Workplace</FieldLabel>
                <Select
                  value={workplaceId}
                  onChange={(e) => setWorkplaceId(e.target.value)}
                >
                  <option value="">Select Workplace</option>
                  {workplaces.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.name}
                    </option>
                  ))}
                </Select>
                {errors.workplace && (
                  <p className="text-red-500 text-xs">{errors.workplace}</p>
                )}
              </div>

              <div>
                <FieldLabel>Job Type</FieldLabel>
                <Select
                  value={typeId}
                  onChange={(e) => setTypeId(e.target.value)}
                >
                  <option value="">Select Type</option>
                  {types.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.name}
                    </option>
                  ))}
                </Select>
                {errors.type && (
                  <p className="text-red-500 text-xs">{errors.type}</p>
                )}
              </div>

              <div>
                <FieldLabel>Experience</FieldLabel>
                <Select
                  value={experienceId}
                  onChange={(e) => setExperienceId(e.target.value)}
                >
                  <option value="">Select Experience</option>
                  {experiences.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.name}
                    </option>
                  ))}
                </Select>
                {errors.experience && (
                  <p className="text-red-500 text-xs">{errors.experience}</p>
                )}
              </div>
            </div>

            {/* Rich Text Fields */}
            <div className="mt-8">
              <FieldLabel>About the Company</FieldLabel>
              <ReactQuill
                theme="snow"
                value={aboutCompany}
                onChange={setAboutCompany}
                modules={{ toolbar: toolbarOptions }}
              />
              {errors.aboutCompany && (
                <p className="text-red-500 text-xs">{errors.aboutCompany}</p>
              )}
            </div>

            <div className="mt-8">
              <FieldLabel>About the Job</FieldLabel>
              <ReactQuill
                theme="snow"
                value={aboutJob}
                onChange={setAboutJob}
                modules={{ toolbar: toolbarOptions }}
              />
              {errors.aboutJob && (
                <p className="text-red-500 text-xs">{errors.aboutJob}</p>
              )}
            </div>

            <div className="mt-8">
              <FieldLabel>Responsibilities</FieldLabel>
              <ReactQuill
                theme="snow"
                value={bringToTeam}
                onChange={setBringToTeam}
                modules={{ toolbar: toolbarOptions }}
              />
            </div>

            <div className="mt-8">
              <FieldLabel>Requirements</FieldLabel>
              <ReactQuill
                theme="snow"
                value={skillsNeed}
                onChange={setSkillsNeed}
                modules={{ toolbar: toolbarOptions }}
              />
            </div>

            <div className="mt-8">
              <FieldLabel>Details</FieldLabel>
              <ReactQuill
                theme="snow"
                value={moreDetails}
                onChange={setMoreDetails}
                modules={{ toolbar: toolbarOptions }}
              />
            </div>

            <div className="mt-8 mb-12">
              <FieldLabel>Benefits</FieldLabel>
              <ReactQuill
                theme="snow"
                value={benefits}
                onChange={setBenefits}
                modules={{ toolbar: toolbarOptions }}
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
