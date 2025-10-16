import { ChevronDown } from "lucide-react";
import { use, useEffect, useState } from "react";

const fieldOfStudy = ["Arts", "Biology", "Business", "Chemistry", "Computer Science", "Data Science", "Economics", "Education", "Engineering", "Environmental Science", "Health Sciences", "History", "Information Technology", "Literature", "Mathematics", "Philosophy", "Physics", "Political Science", "Psychology", "Social Sciences", "Sociology"];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const years = Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i);

export default function ProfileSection({ formData, setFormData, resumeData, setResumeData }) {

  // console.log(" Form Data: ", formData);
  // console.log(" Resume Data: ", resumeData);

  // const [resume, setResume] = useState();

  // useEffect(() => {
  //   // Fetch resume in database
  //   fetch(`/api/resume/user/${formData.user_id}`)
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setResume(data);
  //       console.log(" Resume: ", data);
  //     })
  //     .catch((error) => console.error('Error fetching resume:', error));
  // }, []);

  const eduSplit = resumeData?.education ? resumeData.education.split(' | ') : [];
  // console.log(" Edu Split: ", eduSplit);

  const [education, setEducation] = useState({
    school: eduSplit[0] || "",
    degree: eduSplit[1] || "",
    fieldOfStudy: eduSplit[2] || "",
    startYear: eduSplit[3] || "",
    endYear: eduSplit[4] || "",
  });

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleResumeChange = (field, value) => {
    setResumeData(prev => ({ ...prev, [field]: value }));
  };

  const handleEducationChange = (field, value) => {
    setEducation(prev => ({ ...prev, [field]: value }));
  }

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
              // onClick={() => }
            >Add</button>
          </div>

          <div className="w-full border border-gray-300 rounded-lg p-4 mb-3">
            <div className="mb-3">
              <label className="block text-base md:text-lg font-normal text-black mb-2">School*</label>
              <input
                type="text"
                value={education.school}
                onChange={(e) => handleEducationChange('school', e.target.value)}
                placeholder="Ex: Western University"
                className="w-full h-10 px-4 py-2 text-black bg-white rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E55B3C]"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-x-6 gap-y-3 mb-3">
              <div>
                <label className="block text-base md:text-lg font-normal text-black mb-2">Degree</label>
                <input
                  type="text"
                  value={education.degree}
                  onChange={(e) => handleEducationChange('degree', e.target.value)}
                  placeholder="Ex: Bachelor's"
                  className="w-full h-10 px-4 py-2 text-black bg-white rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E55B3C]"
                />
              </div>
              <div>
                <label className="block text-base md:text-lg font-normal text-black mb-2">Field of study</label>
                <select
                  value={education.fieldOfStudy}
                  onChange={(e) => handleEducationChange('fieldOfStudy', e.target.value)}
                  className="w-full h-10 px-4 py-2 text-black bg-white rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E55B3C]"
                >
                  {fieldOfStudy.map((field) => (
                    <option key={field} value={field}>{field}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-x-6 gap-y-3 mb-3">
              <div>
                <label className="block text-base md:text-lg font-normal text-black mb-2">Start year</label>
                <select
                  value={education.startYear}
                  onChange={(e) => handleEducationChange('startYear', e.target.value)}
                className="w-full h-10 px-4 py-2 text-black bg-white rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E55B3C]"
                >
                  {years.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-base md:text-lg font-normal text-black mb-2">End year</label>
                <select
                  value={education.endYear}
                  onChange={(e) => handleEducationChange('endYear', e.target.value)}
                  className="w-full h-10 px-4 py-2 text-black bg-white rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E55B3C]"
                >
                  {years.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="w-full flex justify-center">
              <button 
                className="text-[#E55B3C] text-base font-bold hover:underline mt-2"
                // onClick={() =>}
              >Remove</button>
            </div>
          </div>
        </div>

        {/* Work Experience */}
        <div className="mt-10">
          <div className="flex justify-between items-center mb-2">
            <h2 className="block text-lg md:text-xl font-bold text-black mb-3">Work Experience</h2>
            <button 
              className="text-[#E55B3C] text-base font-bold hover:underline"
              // onClick={() => }
            >Add</button>
          </div>

          <div className="w-full border border-gray-300 rounded-lg p-4 mb-6">
            <div className="grid md:grid-cols-2 gap-x-6 gap-y-3 mb-3">
              <div>
                <label className="block text-base md:text-lg font-normal text-black mb-2">Industry*</label>
                <input
                  type="text"
                  value={formData.industry}
                  onChange={(e) => handleInputChange('industry', e.target.value)}
                  className="w-full h-10 px-4 py-2 text-black bg-white rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E55B3C]"
                />
              </div>
              <div>
                <label className="block text-base md:text-lg font-normal text-black mb-2">Title*</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Ex: Retail Sales Manager"
                  className="w-full h-10 px-4 py-2 text-black bg-white rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E55B3C]"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-x-6 gap-y-3 mb-1">
              <div>
                <label className="block text-base md:text-lg font-normal text-black mb-2">Employment type</label>
                <select
                  value={formData.employmentType}
                  onChange={(e) => handleInputChange('employmentType', e.target.value)}
                  className="w-full h-10 px-4 py-2 text-black bg-white rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E55B3C]"
                >
                  <option value="Permanent Full-time">Permanent Full-time</option>
                  <option value="Permanent Part-time">Permanent Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Temporary">Temporary</option>
                </select>
              </div>
              <div>
                <label className="block text-base md:text-lg font-normal text-black mb-2">Company or organization*</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  placeholder="Ex: Google"
                  className="w-full h-10 px-4 py-2 text-black bg-white rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E55B3C]"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <input
                type="checkbox"
                checked={formData.currentlyWorking}
                onChange={(e) => handleInputChange('currentlyWorking', e.target.checked)}
                className="rounded border-black"
              />
              <label className="text-sm text-black">Currently working in this role</label>
            </div>

            <div className="grid md:grid-cols-4 gap-x-6 gap-y-3 mb-3">
              <div>
                <label className="block text-base md:text-lg font-normal text-black mb-2">Start month</label>
                <select
                  value={formData.startMonth}
                  onChange={(e) => handleInputChange('startMonth', e.target.value)}
                  className="w-full h-10 px-4 py-2 text-black bg-white rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E55B3C]"
                >
                  {months.map((month) => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[#E55B3C] text-base md:text-lg mb-2">Start year</label>
                <select
                  value={formData.startYear}
                  onChange={(e) => handleInputChange('startYear', e.target.value)}
                  className="w-full h-10 px-4 py-2 text-black bg-white rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E55B3C]"
                >
                  {years.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-base md:text-lg font-normal text-black mb-2">End month</label>
                  <select
                    value={formData.endMonth}
                    onChange={(e) => handleInputChange('endMonth', e.target.value)}
                    className="w-full h-10 px-4 py-2 text-black bg-white rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E55B3C]"
                  >
                    {months.map((month) => (
                      <option key={month} value={month}>{month}</option>
                    ))}
                  </select>
              </div>
              <div>
                <label className="block text-[#E55B3C] text-base md:text-lg mb-2">End year</label>
                <select
                  value={formData.endYear}
                  onChange={(e) => handleInputChange('endYear', e.target.value)}
                  className="w-full h-10 px-4 py-2 text-black bg-white rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E55B3C]"
                >
                  {years.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-3">
              <label className="block text-base md:text-lg font-normal text-black mb-2">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="Ex: London, Ontario, Canada"
                className="w-full px-4 py-2 text-black bg-white rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E55B3C]"
              />
            </div>

            <div className="mb-2">
              <label className="block text-base md:text-lg font-normal text-black mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="List your major duties and successes, highlighting specific projects"
                rows={3}
                className="w-full px-4 py-2 text-black bg-white rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E55B3C]"
              />
              <div className="text-right text-sm text-gray-500 mt-1 max-w-3xl">
                {/* {formData.description.length} / 500 */}
              </div>
            </div>
            <div className="w-full flex justify-center">
              <button 
                className="text-[#E55B3C] text-base font-bold hover:underline mt-2"
                // onClick={() =>}
              >Remove</button>
            </div>
          </div>
        </div>
      </section>
    </div>
    );
}