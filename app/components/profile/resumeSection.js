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
    console.log("Education change: ", idx, " - ", newEdu);
    let updatedEdu = resumeData.education;
    updatedEdu[
      idx
    ] = `${newEdu.school} | ${newEdu.degree} | ${newEdu.fieldOfStudy} | ${newEdu.startYear} | ${newEdu.endYear}`;
    console.log(updatedEdu);
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
      console.log("length of education: ", updatedEdu.length);
      if (updatedEdu.length == 5) return;
      updatedEdu.push("");
      handleResumeChange("education", updatedEdu);
    }
  };

  const handleRemoveEducation = (index) => {
    console.log("remove index: ", index);
    let updatedEdu = [];
    resumeData.education.map((edu, idx) => {
      if (idx != index) updatedEdu.push(edu);
    });
    console.log(updatedEdu);
    handleResumeChange("education", updatedEdu);
  };

  // Update Experience

  const handleExperienceChange = (idx) => {
    console.log("Experience change: ", idx, " - ", newExp);
    let updatedExp = resumeData.experience;
    updatedExp[
      idx
    ] = `${newExp.title} | ${newExp.company} | ${newExp.type} | ${newExp.startMonth} | ${newExp.startYear} | ${newExp.endMonth} | ${newExp.endYear} | ${newExp.description}`;
    console.log(updatedExp);
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
      console.log("length of experience: ", updatedExp.length);
      if (updatedExp.length == 5) return;
      updatedExp.push("");
      handleResumeChange("experience", updatedExp);
    }
  };

  const handleRemoveExperience = (index) => {
    let updatedExp = [];
    resumeData.experience.map((exp, idx) => {
      if (idx != index) updatedExp.push(exp);
    });
    console.log(updatedExp);
    handleResumeChange("experience", updatedExp);
  };

  // Update certification

  const handleCertChange = (index) => {
    let updatedCerts = resumeData.certifications;
    updatedCerts[index] = newCert;
    console.log("Certification change: ", updatedCerts);
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
    console.log("Skill change: ", updatedSkills);
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
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl md:text-2xl font-bold text-black mb-6">
          TC Alberta Resume
        </h2>
        {addResume ? (
          <button
            className="text-sm mb-6 px-6 py-2 bg-[#E55B3C] hover:bg-[#d14f32] font-semibold rounded-md transition duration-200 cursor-pointer focus:outline-none active:scale-95 text-white"
            onClick={() => setAddResume(!addResume)}
          >
            Add
          </button>
        ) : (
          <button
            className="text-sm mb-6 px-6 py-2 bg-[#E55B3C] hover:bg-[#d14f32] font-semibold rounded-md transition duration-200 cursor-pointer focus:outline-none active:scale-95 text-white"
            onClick={onSave}
          >
            Save
          </button>
        )}
      </div>

      {!addResume && (
        <div>
          {/* Summary */}
          <div>
            <label className="block text-base md:text-lg font-bold text-black mb-2">
              Summary
            </label>
            <textarea
              value={resumeData.summary}
              onChange={(e) => handleResumeChange("summary", e.target.value)}
              placeholder="List your major duties and successes, highlighting specific projects"
              rows={3}
              className="w-full px-4 py-2 text-black bg-white rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E55B3C]"
            />
            <div className="text-right text-sm text-gray-500 mt-1 w-full">
              {resumeData.summary.length} / 500
            </div>
          </div>

          {/* Education */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h2 className="block text-base md:text-lg font-bold text-black mb-3">
                Education
              </h2>
              <button
                className="text-[#E55B3C] text-base font-bold hover:underline mr-1"
                onClick={handleAddEducation}
              >
                Add
              </button>
            </div>

            {resumeData.education.map((edu, idx) => (
              <EducationCard
                key={edu.id || `${idx}-${edu}`}
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
          <div className="mt-10">
            <div className="flex justify-between items-center mb-2">
              <h2 className="block text-base md:text-lg font-bold text-black mb-3">
                Work Experience
              </h2>
              <button
                className="text-[#E55B3C] text-base font-bold hover:underline mr-1"
                onClick={handleAddExperience}
              >
                Add
              </button>
            </div>

            {resumeData.experience.map((exp, idx) => (
              <ExperienceCard
                key={idx}
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
          <div className="mt-10">
            <div className="flex justify-between items-center mb-2">
              <h2 className="block text-base md:text-lg font-bold text-black mb-3">
                Skill
              </h2>
              <button
                className="text-[#E55B3C] text-base font-bold hover:underline mr-1"
                onClick={handleAddSkill}
              >
                Add
              </button>
            </div>

            {resumeData.skills.map((skill, idx) => (
              <SkillCard
                key={idx}
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
          <div className="mt-10">
            <div className="flex justify-between items-center mb-2">
              <h2 className="block text-base md:text-lg font-bold text-black mb-3">
                Certifications
              </h2>
              <button
                className="text-[#E55B3C] text-base font-bold hover:underline mr-1"
                onClick={handleAddCert}
              >
                Add
              </button>
            </div>

            {resumeData.certifications.map((cert, idx) => (
              <CertificationCard
                key={idx}
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
          <div className="mt-10">
            <label className="block text-base md:text-lg font-bold text-black mb-2">
              Additional Information
            </label>
            <textarea
              value={resumeData.additional_info}
              onChange={(e) =>
                handleResumeChange("additional_info", e.target.value)
              }
              placeholder="List your major duties and successes, highlighting specific projects"
              rows={3}
              className="w-full px-4 py-2 text-black bg-white rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E55B3C]"
            />
            <div className="text-right text-sm text-gray-500 mt-1 w-full">
              {resumeData.additional_info.length} / 500
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
