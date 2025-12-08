import { Plus } from 'lucide-react';
import { useState } from "react";
import ExperienceCard from "./experienceCard";
import SkillCard from "./skillCard";
import EducationCard from "./educationCard";
import CertificationCard from "./certificationCard";

export default function Resume({
  resumeData,
  setResumeData,
  isNewResume,
  setErrorMessage,
  onSave,
}) {
  // console.log("resume section: ", resumeData);

  const [addResume, setAddResume] = useState(isNewResume);

  const [isEduLoading, setIsEduLoading] = useState(false);
  const [newEdu, setNewEdu] = useState({
    school: "",
    degree: "",
    fieldOfStudy: "",
    startYear: "",
    endYear: "",
  });

  const [isExpLoading, setIsExpLoading] = useState(false);
  const [newExp, setNewExp] = useState({
    title: "",
    company: "",
    type: "",
    startMonth: "",
    startYear: "",
    endMonth: "",
    endYear: "",
    description: "",
  });

  const [isSkillLoading, setIsSkillLoading] = useState(false);
  const [newSkill, setNewSkill] = useState("");

  const [isCertLoading, setIsCertLoading] = useState(false);
  const [newCert, setNewCert] = useState("");

  // Update Resume

  const handleResumeChange = (field, value) => {
    setResumeData((prev) => ({ ...prev, [field]: value }));
  };

  // Update Education

  const handleEducationChange = (idx) => {
    console.log("Resume - Education change: ", idx, " - ", newEdu);
    let updatedEdu = resumeData.education;
    updatedEdu[idx] = `${newEdu.school} | ${newEdu.degree} | ${newEdu.fieldOfStudy} | ${newEdu.startYear} | ${newEdu.endYear}`;
    // console.log(updatedEdu);
    handleResumeChange("education", updatedEdu);
    setNewEdu({
      school: "",
      degree: "",
      fieldOfStudy: "",
      startYear: "",
      endYear: "",
    });
    setIsEduLoading(false);
  };

  const handleAddEducation = () => {
    if (isEduLoading) setErrorMessage("Education must be saved to continue");
    else {
      setIsEduLoading(true);
      let updatedEdu = resumeData.education;
      // console.log("length of education: ", updatedEdu.length);
      if (updatedEdu.length == 5) return;
      updatedEdu.push("");
      handleResumeChange("education", updatedEdu);
    }
  };

  const handleRemoveEducation = (index) => {
    // console.log("remove index: ", index);
    let updatedEdu = [];
    resumeData.education.map((edu, idx) => {if (idx != index) updatedEdu.push(edu);});
    // console.log(updatedEdu);
    handleResumeChange("education", updatedEdu);
  };

  // Update Experience

  const handleExperienceChange = (idx) => {
    // console.log("Experience change: ", idx, " - ", newExp);
    let updatedExp = resumeData.experience;
    updatedExp[idx] = `${newExp.title} | ${newExp.company} | ${newExp.type} | ${newExp.startMonth} | ${newExp.startYear} | ${newExp.endMonth} | ${newExp.endYear} | ${newExp.description}`;
    // console.log(updatedExp);
    handleResumeChange("experience", updatedExp);
    setNewExp({
      title: "",
      company: "",
      type: "",
      startMonth: "",
      startYear: "",
      endMonth: "",
      endYear: "",
      description: "",
    });
    setIsExpLoading(false);
  };

  const handleAddExperience = () => {
    if (isExpLoading) setErrorMessage("Experience must be saved to continue");
    else {
      setIsExpLoading(true);
      let updatedExp = resumeData.experience;
      // console.log("length of experience: ", updatedExp.length);
      if (updatedExp.length == 5) return;
      updatedExp.push("");
      handleResumeChange("experience", updatedExp);
    }
  };

  const handleRemoveExperience = (index) => {
    let updatedExp = [];
    resumeData.experience.map((exp, idx) => { if (idx != index) updatedExp.push(exp) });
    // console.log(updatedExp);
    handleResumeChange("experience", updatedExp);
  };

  // Update certification

  const handleCertChange = (index) => {
    let updatedCerts = resumeData.certifications;
    updatedCerts[index] = newCert;
    // console.log("Certification change: ", updatedCerts);
    handleResumeChange("certifications", updatedCerts);
    setNewCert("");
    setIsCertLoading(false);
  };

  const handleAddCert = () => {
    if (isCertLoading) setErrorMessage("Skill must be saved to continue");
    else {
      setIsCertLoading(true);
      let updatedCerts = resumeData.certifications;
      updatedCerts.push("");
      handleResumeChange("certifications", updatedCerts);
    }
  };

  const handleRemoveCert = (index) => {
    let updatedCerts = [];
    resumeData.certifications.map((cert, idx) => {
      if (idx != index) updatedCerts.push(cert);
    });
    handleResumeChange("certifications", updatedCerts);
  };

  // Update skill

  const handleSkillChange = (index) => {
    let updatedSkills = resumeData.skills;
    updatedSkills[index] = newSkill;
    // console.log("Skill change: ", updatedSkills);
    handleResumeChange("skills", updatedSkills);
    setNewSkill("");
    setIsSkillLoading(false);
  };

  const handleAddSkill = () => {
    if (isSkillLoading) setErrorMessage("Skill must be saved to continue");
    else {
      setIsSkillLoading(true);
      let updatedSkills = resumeData.skills;
      updatedSkills.push("");
      handleResumeChange("skills", updatedSkills);
    }
  };

  const handleRemoveSkill = (index) => {
    let updatedSkills = [];
    resumeData.skills.map((skill, idx) => {
      if (idx != index) updatedSkills.push(skill);
    });
    handleResumeChange("skills", updatedSkills);
  };

  return (
    <div>
      {addResume && 
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-[#E55B3C]">
            TC Alberta Resume
          </h2>
          <button
            className="text-sm px-6 py-2 bg-[#E55B3C] hover:bg-[#d14f32] font-semibold rounded-md transition duration-200 cursor-pointer focus:outline-none active:scale-95 text-white"
            onClick={() => setAddResume(!addResume)}
          >
            Add
          </button>
        </div>
      }

      {!addResume && (
        <div>
          <div className="mb-4 text-2xl font-semibold text-[#E55B3C] text-center">
            TC Alberta Resume
          </div>
          {/* Summary */}
          <div className="mb-4">
            <label className="block text-sm text-gray-700 font-medium mb-1">
              Summary
            </label>
            <textarea
              value={resumeData.summary}
              onChange={(e) => handleResumeChange("summary", e.target.value)}
              placeholder="List your major duties and successes, highlighting specific projects"
              rows={3}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-base text-black outline-none focus:ring-2 focus:ring-gray-200"
            />
            <div className="text-right text-sm text-gray-500 mr-1 w-full">
              {resumeData.summary.length} / 500
            </div>
          </div>

          {/* Education */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <h2 className="block text-sm text-gray-700 font-medium mt-2">
                Education
              </h2>
              <button 
                onClick={handleAddEducation}
                className="flex items-center space-x-1 mb-1 px-2 py-1 bg-green-600 text-sm font-bold text-white rounded-md hover:bg-green-700 transition"
              >
                <Plus size={12} /> {/* The 'Plus' icon */}
                <span>Add</span>
              </button>
            </div>

            {resumeData.education.map((edu, idx) => (
              <EducationCard 
                key={`${idx} - ${edu}`} 
                index={idx}
                edu={edu}
                setNewEdu={setNewEdu}
                isLoading={isEduLoading}
                setIsLoading={setIsEduLoading}
                setErrorMessage={setErrorMessage}
                onSave={() => handleEducationChange(idx)}
                onRemove={() => handleRemoveEducation(idx)}
              />
            ))}
          </div>

          {/* Work Experience */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <h2 className="block text-sm text-gray-700 font-medium mt-2">
                Work Experience
              </h2>
              <button 
                onClick={handleAddExperience}
                className="flex items-center space-x-1 mb-1 px-2 py-1 bg-green-600 text-sm font-bold text-white rounded-md hover:bg-green-700 transition"
              >
                <Plus size={12} /> {/* The 'Plus' icon */}
                <span>Add</span>
              </button>
            </div>

            {resumeData.experience.map((exp, idx) => (
              <ExperienceCard
                key={`${idx} - ${exp}`}
                index={idx}
                exp={exp}
                setNewExp={setNewExp}
                isLoading={isExpLoading}
                setIsLoading={setIsExpLoading}
                setErrorMessage={setErrorMessage}
                onSave={() => handleExperienceChange(idx)}
                onRemove={() => handleRemoveExperience(idx)}
              />
            ))}
          </div>

          {/* Skills */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <h2 className="block text-sm text-gray-700 font-medium mt-2">
                Skill
              </h2>
              <button 
                onClick={handleAddSkill}
               className="flex items-center space-x-1 mb-1 px-2 py-1 bg-green-600 text-sm font-bold text-white rounded-md hover:bg-green-700 transition"
              >
                <Plus size={12} /> {/* The 'Plus' icon */}
                <span>Add</span>
              </button>
            </div>

            {resumeData.skills.map((skill, idx) => (
              <SkillCard 
                key={`${idx} - ${skill}`}
                index={idx}
                skill={skill}
                setNewSkill={setNewSkill}
                isLoading={isSkillLoading}
                setIsLoading={setIsSkillLoading}
                setErrorMessage={setErrorMessage}
                onSave={() => handleSkillChange(idx)}
                onRemove={() => handleRemoveSkill(idx)}
              />
            ))}
          </div>

          {/* Certification */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-1">
              <h2 className="block text-sm text-gray-700 font-medium mt-2">
                Certificate
              </h2>
              <button 
                onClick={handleAddCert}
                className="flex items-center space-x-1 mb-1 px-2 py-1 bg-green-600 text-sm font-bold text-white rounded-md hover:bg-green-700 transition"
              >
                <Plus size={12} /> {/* The 'Plus' icon */}
                <span>Add</span>
              </button>
            </div>

            {resumeData.certifications.map((cert, idx) => (
              <CertificationCard 
                key={`${idx} - ${cert}`}
                index={idx}
                cert={cert}
                setNewCert={setNewCert}
                isLoading={isCertLoading}
                setIsLoading={setIsCertLoading}
                setErrorMessage={setErrorMessage}
                onSave={() => handleCertChange(idx)}
                onRemove={() => handleRemoveCert(idx)}
              />
            ))}
          </div>

          {/* Additional information */}
          <div className="mb-4">
            <label className="block text-sm text-gray-700 font-medium mb-1">
              Additional Information
            </label>
            <textarea
              value={resumeData.additional_info}
              onChange={(e) =>
                handleResumeChange("additional_info", e.target.value)
              }
              placeholder="List your major duties and successes, highlighting specific projects"
              rows={3}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-base text-black outline-none focus:ring-2 focus:ring-gray-200"
            />
            <div className="text-right text-sm text-gray-500 mr-1 w-full">
              {resumeData.additional_info?.length} / 500
            </div>
          </div>
          <div className="flex justify-center">
            <button
              className="text-sm px-6 py-2 bg-[#E55B3C] hover:bg-[#d14f32] font-semibold rounded-md transition duration-200 cursor-pointer focus:outline-none active:scale-95 text-white"
              onClick={onSave}
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
