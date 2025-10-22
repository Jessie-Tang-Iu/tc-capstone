import { ChevronDown } from "lucide-react";
import { use, useEffect, useState } from "react";
import EducationCard from "../components/profile/educationCard";
import ExperienceCard from "../components/profile/experienceCard";

const fieldOfStudy = ["Arts", "Biology", "Business", "Chemistry", "Computer Science", "Data Science", "Economics", "Education", "Engineering", "Environmental Science", "Health Sciences", "History", "Information Technology", "Literature", "Mathematics", "Philosophy", "Physics", "Political Science", "Psychology", "Social Sciences", "Sociology"];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const years = Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i);

export default function ProfileSection({ formData, setFormData, resumeData, setResumeData }) {

  // console.log(" Form Data: ", formData);
  // console.log(" Resume Data: ", resumeData);

  const [newEdu, setNewEdu] = useState({
    school: "", degree: "", fieldOfStudy: "", startYear: "", endYear: ""
  });

  const [newExp, setNewExp] = useState({
    title: "", company: "", type: "", startMonth: "", startYear: "", endMonth: "", endYear: "", description: "",
  });

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleResumeChange = (field, value) => {
    setResumeData(prev => ({ ...prev, [field]: value }));
  };

  const handleEducationChange = (idx) => {
    console.log(idx);
    if (!newEdu.school || !newEdu.degree || !newEdu.fieldOfStudy || !newEdu.startYear || !newEdu.endYear) {
      return;
    }
    let updatedEdu = resumeData.education;
    updatedEdu[idx] = `${newEdu.school} | ${newEdu.degree} | ${newEdu.fieldOfStudy} | ${newEdu.startYear} | ${newEdu.endYear}`;
    console.log(updatedEdu);
    handleResumeChange("education", updatedEdu);
    setNewEdu({school: "", degree: "", fieldOfStudy: "", startYear: "", endYear: ""})
  };

  const handleAddEducation = () => {
    let updatedEdu = resumeData.education;
    console.log("length of education: ", updatedEdu.length);
    if (updatedEdu.length == 5) return;
    updatedEdu.push("");
    handleResumeChange("education", updatedEdu);
  };

  const handleRemoveEducation = (index) => {
    let updatedEdu = [];
    resumeData.education.map((edu, idx) => {if (idx != index) updatedEdu.push(edu)});
    console.log(updatedEdu);
    handleResumeChange("education", updatedEdu);
  };

  const handleExperienceChange = (idx) => {
    console.log(idx);
    if (!newExp.title || !newExp.company || !newExp.startMonth || !newEdu.startYear) {
      return;
    }
    let updatedExp = resumeData.experience;
    updatedExp[idx] = `${newExp.title} | ${newExp.company} | ${newExp.type} | ${newExp.startMonth} | ${newExp.startYear} | ${newExp.endMonth} | ${newExp.endYear} | ${newExp.description}`;
    console.log(updatedExp);
    handleFormChange("experience", updatedExp);
    setNewExp({title: "", company: "", type: "", startMonth: "", startYear: "", endMonth: "", endYear: "", description: ""})
  };

  const handleAddExperience = () => {
    let updatedExp = resumeData.experience;
    console.log("length of experience: ", updatedExp.length);
    if (updatedExp.length == 5) return;
    updatedExp.push("");
    handleResumeChange("experience", updatedExp);
  };

  const handleRemoveExperience = (index) => {
    let updatedExp = [];
    resumeData.experience.map((exp, idx) => {if (idx != index) updatedExp.push(exp)});
    console.log(updatedExp);
    handleResumeChange("experience", updatedExp);
  };

  return (
    <div className="space-y-8 px-5 h-[calc(100vh-180px)] md:h-[calc(100vh-240px)] overflow-y-auto">
      {/* Basic Information */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl md:text-2xl font-bold text-black mb-6">Basic Information</h2>
          <button className="text-sm mb-6 px-6 py-2 bg-[#E55B3C] hover:bg-[#d14f32] font-semibold rounded-md transition duration-200 cursor-pointer focus:outline-none active:scale-95 text-white">Save</button>
        </div>
            
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-base md:text-lg font-normal text-black mb-2">First name*</label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => handleFormChange('firstName', e.target.value)}
              className="w-full h-10 px-4 py-2 text-black bg-white rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E55B3C]"
            />
          </div>
          <div>
            <label className="block text-base md:text-lg font-normal text-black mb-2">Last name*</label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => handleFormChange('lastName', e.target.value)}
              className="w-full h-10 px-4 py-2 text-black bg-white rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E55B3C]"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-base md:text-lg font-normal text-black mb-2">Preferred name</label>
            <input
              type="text"
              value={formData.preferredName}
              onChange={(e) => handleFormChange('preferredName', e.target.value)}
              className="w-full h-10 px-4 py-2 text-black bg-white rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E55B3C]"
            />
          </div>
          <div>
            <label className="block text-base md:text-lg font-normal text-black mb-2">Pronouns</label>
            <select
              value={formData.pronouns}
              onChange={(e) => handleFormChange('pronouns', e.target.value)}
              className="w-full h-10 px-4 py-2 text-black bg-white rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E55B3C]"
            >
              <option value="She/Her/Hers">She/Her/Hers</option>
              <option value="He/Him/His">He/Him/His</option>
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-base md:text-lg font-normal text-black mb-2">Email</label>
            <input
              type="text"
              value={formData.email}
              onChange={(e) => handleFormChange('email', e.target.value)}
              className="w-full h-10 px-4 py-2 text-black bg-white rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E55B3C]"
            />
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                checked={formData.showEmailInProfile}
                onChange={(e) => handleFormChange('showEmailInProfile', e.target.checked)}
                className="rounded border-black"
              />
              <label className="text-sm text-black">Show in profile</label>
            </div>
          </div>
          <div>
            <label className="block text-base md:text-lg font-normal text-black mb-2">Phone Number</label>
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => handleFormChange('phoneNumber', e.target.value)}
              className="w-full h-10 px-4 py-2 text-black bg-white rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E55B3C]"
            />
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                checked={formData.showPhoneInProfile}
                onChange={(e) => handleFormChange('showPhoneInProfile', e.target.checked)}
                className="rounded border-black"
              />
              <label className="text-sm text-black">Show in profile</label>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-base md:text-lg font-normal text-black mb-2">Address</label>
          <input
            value={formData.headline}
            onChange={(e) => handleFormChange('headline', e.target.value)}
            placeholder="Ex: 1301 16 Avenue NW"
            className="w-full h-10 px-4 py-2 text-black bg-white rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E55B3C]"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-base md:text-lg font-normal text-black mb-2">City</label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => handleFormChange('preferredName', e.target.value)}
              placeholder="Ex: Calgary, Alberta"
              className="w-full h-10 px-4 py-2 text-black bg-white rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E55B3C]"
            />
          </div>
          <div>
            <label className="block text-base md:text-lg font-normal text-black mb-2">Country/Region</label>
            <div className="flex items-center gap-3">
              <input
                type="email"
                value={formData.countryRegion}
                onChange={(e) => handleFormChange('email', e.target.value)}
                placeholder="Ex: Canada"
                className="flex-1 h-10 px-4 py-2 text-black bg-white rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E55B3C]"
              />
            </div>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-base md:text-lg font-normal text-black mb-2">Website</label>
          <input
            type="url"
            value={formData.website}
            onChange={(e) => handleFormChange('website', e.target.value)}
            className="w-full h-10 px-4 py-2 text-black bg-white rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E55B3C]"
          />
        </div>
      </section>

      <hr className="border-gray-300" />

      {/* Resume */}
      {resumeData &&
      <section>
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl md:text-2xl font-bold text-black mb-6">TC Alberta Resume</h2>
          <button className="text-sm mb-6 px-6 py-2 bg-[#E55B3C] hover:bg-[#d14f32] font-semibold rounded-md transition duration-200 cursor-pointer focus:outline-none active:scale-95 text-white">Save</button>
        </div>

        <div>
          <label className="block text-lg md:text-xl font-bold text-black mb-2">Summary</label>
          <textarea
            value={resumeData.summary}
            onChange={(e) => handleResumeChange('description', e.target.value)}
            placeholder="List your major duties and successes, highlighting specific projects"
            rows={3}
            className="w-full px-4 py-2 text-black bg-white rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E55B3C]"
          />
          <div className="text-right text-sm text-gray-500 mt-1 max-w-3xl">
            {resumeData.summary.length} / 500
          </div>
        </div>

        {/* Education */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h2 className="block text-lg md:text-xl font-bold text-black mb-3">Education</h2>
            <button 
              className="text-[#E55B3C] text-base font-bold hover:underline"
              onClick={handleAddEducation}
            >Add</button>
          </div>

          {resumeData.education.map((edu, idx) => (
            <EducationCard 
              key={idx} 
              index={idx}
              edu={edu}
              setNewEdu={setNewEdu}
              onSave={() => handleEducationChange(idx)}
              onRemove={() => handleRemoveEducation(idx)}
            />
          ))}
        </div>

        {/* Work Experience */}
        <div className="mt-10">
          <div className="flex justify-between items-center mb-2">
            <h2 className="block text-lg md:text-xl font-bold text-black mb-3">Work Experience</h2>
            <button 
              className="text-[#E55B3C] text-base font-bold hover:underline"
              onClick={handleAddExperience}
            >Add</button>
          </div>

          {resumeData.experience.map((exp, idx) => (
            <ExperienceCard
              key={idx}
              index={idx}
              exp={exp}
              setNewExp={setNewExp}
              onSave={() => handleExperienceChange(idx)}
              onRemove={() => handleRemoveExperience(idx)}
            />
          ))}
        </div>
      </section>
      }
    </div>
    );
}