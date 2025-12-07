"use client";

import React, { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/app/components/EmployerNavBar";
import EmployerSidebar from "@/app/components/employerDashboard/EmployerSideBar";
import PopupMessage from "@/app/components/ui/PopupMessage";

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
    "px-4 py-2 rounded-md text-sm font-semibold transition cursor-pointer";
  const solid = "bg-[#EE7D5E] text-white hover:opacity-90 active:scale-[0.98]";
  const ghost = "bg-[#F3E1D5] text-black hover:opacity-90 active:scale-[0.98]";
  return (
    <button
      onClick={onClick}
      className={`${base} ${kind === "solid" ? solid : ghost}`}
    >
      {children}
    </button>
  );
};

const ActionDropdown = ({ children, label, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center rounded-md bg-gray-200 px-4 py-2 text-sm font-semibold text-black hover:bg-gray-300 transition active:scale-[0.98]"
      >
        {label}
        <svg
          className={`ml-2 h-4 w-4 transform transition-transform ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {React.Children.map(children, (child) =>
              React.cloneElement(child, {
                onClick: () => {
                  child.props.onClick();
                  setIsOpen(false);
                },
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const DropdownItem = ({ children, onClick, className = "" }) => (
  <button
    onClick={onClick}
    className={`block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 ${className}`}
    role="menuitem"
  >
    {children}
  </button>
);

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

  const prefillForm = (data) => {
    setTitle(data.title || "");
    // Use jobData.company_name as fallback if jobData.company is null/undefined
    setCompany(data.company || data.company_name || "");
    setLocation(data.location || "Calgary, Alberta");
    setIndustryId(data.industry_id || "");
    setWorkplaceId(data.workplace_id || "");
    setTypeId(data.type_id || "");
    setExperienceId(data.experience_id || "");
    setSalary(data.salary_per_hour || "");
    setLink(data.link || "");
    setAboutCompany(data.company_info || "");
    setAboutJob(data.description || "");
    setBringToTeam(data.responsibilities || "");
    setSkillsNeed(data.requirements || "");
    setMoreDetails(data.details || "");
    setBenefits(data.benefits || "");
  };

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
        prefillForm(data); // Prefill directly after fetch
      } catch (err) {
        console.error("Error fetching job:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [isEdit, jobId]);

  const handleJobStatusChange = async (newStatus) => {
    const action = newStatus === "A" ? "Reopen" : "Close";
    if (!confirm(`Are you sure you want to ${action.toLowerCase()} this job?`))
      return;

    try {
      const res = await fetch(`/api/job/${jobId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error(`Failed to ${action.toLowerCase()} job`);
      alert(`Job ${action.toLowerCase()}ed successfully`);
      // Update jobData status locally or re-fetch job
      setJobData((prev) => ({ ...prev, status: newStatus }));
      // router.push("/employerDashboard/jobPost");
    } catch (err) {
      alert(`Error ${action.toLowerCase()}ing job: ` + err.message);
    }
  };

  const handleDeleteJob = async () => {
    if (
      !confirm(
        "WARNING: Permanently delete this job post? This action cannot be undone, and the job will be completely removed from the database."
      )
    )
      return;

    try {
      // Revert to DELETE method for hard deletion as required
      const res = await fetch(`/api/job/${jobId}`, {
        method: "DELETE",
      });

      if (!res.ok)
        throw new Error(`Failed to delete job (Status: ${res.status})`);

      alert("Job permanently deleted.");
      router.push("/employerDashboard/jobPost");
    } catch (err) {
      alert("Error deleting job: " + err.message);
    }
  };

  const handleSave = async () => {
    const newErrors = {};
    // Regex for stripping HTML tags and entities, then trimming whitespace
    const stripHtml = (html) =>
      html
        .replace(/<[^>]*>/g, "")
        .replace(/&nbsp;|\s/g, "")
        .trim();

    if (!title.trim()) newErrors.title = "Job title is required.";
    if (!company.trim()) newErrors.company = "Company name is required.";
    if (!location.trim()) newErrors.location = "Location is required.";
    if (!industryId) newErrors.industry = "Industry is required.";
    if (!workplaceId) newErrors.workplace = "Workplace is required.";
    if (!typeId) newErrors.type = "Job type is required.";
    if (!experienceId) newErrors.experience = "Experience level is required.";
    if (!String(salary).trim() || isNaN(Number(salary)))
      newErrors.salary = "Valid salary is required.";

    // Check required Rich Text fields after stripping HTML
    if (!stripHtml(aboutCompany))
      newErrors.aboutCompany = "Company info is required.";
    if (!stripHtml(aboutJob))
      newErrors.aboutJob = "Job description is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Scroll to the first error if needed
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
      // If creating a new job, navigate to the edit page for the new job
      if (!isEdit) {
        const result = await res.json();
        router.push(`/employerDashboard/jobPost/edit?id=${result.id}`);
      }
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
        <h1 className="mb-6 text-3xl font-bold text-[#DD5B45]">
          {isEdit ? "Edit Job Post" : "Add New Job Post"}
        </h1>

        <div className="flex gap-6">
          <EmployerSidebar />

          <section className="flex-1 rounded-xl bg-white shadow px-4 py-4">
            {/* Header: Simplified and cleaner buttons */}
            <div className="flex items-center justify-between border-b pb-3 mb-6">
              <div className="text-[15px] font-semibold">
                {title || "New Job"}
              </div>

              <div className="flex items-center gap-3">
                <HeaderButton
                  kind="ghost"
                  onClick={() => router.push("/employerDashboard/jobPost")}
                >
                  Back
                </HeaderButton>

                <HeaderButton onClick={handleSave}>Save</HeaderButton>

                {isEdit && (
                  <ActionDropdown label="Actions">
                    {/* Reopen / Close Job Action */}
                    {jobData?.status === "I" ? (
                      <DropdownItem
                        onClick={() => handleJobStatusChange("A")}
                        className="text-green-600"
                      >
                        Reopen Job
                      </DropdownItem>
                    ) : (
                      <DropdownItem
                        onClick={() => handleJobStatusChange("I")}
                        className="text-gray-600"
                      >
                        Close Job
                      </DropdownItem>
                    )}

                    {/* Delete Action */}
                    <DropdownItem
                      onClick={handleDeleteJob}
                      className="text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </DropdownItem>
                  </ActionDropdown>
                )}
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
