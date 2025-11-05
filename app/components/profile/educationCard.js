import { useEffect, useState } from "react";

const degreeOptions = ["Diploma", "Bachelors", "Masters", "PhD"];
const fieldOfStudy = ["Arts", "Biology", "Business", "Chemistry", "Computer Science", "Data Science", "Economics", "Education", "Engineering", "Environmental Science", "Health Sciences", "History", "Information Technology", "Literature", "Mathematics", "Philosophy", "Physics", "Political Science", "Psychology", "Social Sciences", "Sociology", "Software Development"];
const years = Array.from({ length: 50 }, (_, i) => 2030 - i);

export default function EducationCard({ index, edu, setNewEdu, isLoading, setIsLoading, setErrorMessage, onSave, onRemove }) {

  const [error, setError] = useState(null);
  const[editingEdu, setEditingEdu] = useState(null);
  // console.log("edu card: ", edu)

  const [education, setEducation] = useState({
    school: "",
    degree: "",
    fieldOfStudy: "",
    startYear: "",
    endYear: "",
  });

  const handleEducationChange = (field, value) => {
    setEducation(prev => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    setNewEdu(education);
    // console.log("new edu card: ");
  }, [education]);

  useEffect(() => {
    let eduSplit = editingEdu ? editingEdu.split(' | ') : edu.split(' | ');

    setEducation({
      school: eduSplit[0] || "",
      degree: eduSplit[1] || "",
      fieldOfStudy: eduSplit[2] || "",
      startYear: eduSplit[3] || "",
      endYear: eduSplit[4] || "",
    });
  }, [editingEdu])

  return (
    <div 
      className={`w-full border border-gray-400 rounded-lg p-4 mb-3 
                  ${(!editingEdu && edu) && 'bg-white'} 
                  ${(editingEdu != edu) && 'bg-gray-300'}`}
    >
      {/* Edit & Remove option  */}
      {(!editingEdu && edu) && (
      <div className="w-full flex justify-center">
        <h2 className="flex-3 text-base font-bold text-black">{education.school}</h2>
        <button 
          className="text-[#E55B3C] text-base font-bold hover:underline ml-5" 
          onClick={() => { 
            if (isLoading) {
              setErrorMessage("Education must be saved to continue");
            } else {
              // console.log("edit card: ", edu);
              setEditingEdu(edu); 
              setIsLoading(true);
            }
          }}
        >Edit</button>
        <button className="text-[#E55B3C] text-base font-bold hover:underline ml-5" 
          onClick={() => onRemove(index)}
        >Remove</button>
      </div>)}

      {/* Modify option  */}
      {(editingEdu === edu || !edu) && (
      <div>
        {error && <p className="text-red-600 font-base">{error}</p>}
        {/* School */}
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
            <label className="block text-base md:text-lg font-normal text-black mb-2">Degree*</label>
            <select
              value={education.degree}
              onChange={(e) => handleEducationChange('degree', e.target.value)}
              placeholder="Ex: Bachelor's"
              className="w-full h-10 px-4 py-2 text-black bg-white rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E55B3C]"
            >
              <option key={0} value={""} disabled>Select a degree</option>
              {degreeOptions.map((degree) => (
                <option key={degree} value={degree}>{degree}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-base md:text-lg font-normal text-black mb-2">Field of study*</label>
            <select
              value={education.fieldOfStudy}
              onChange={(e) => handleEducationChange('fieldOfStudy', e.target.value)}
              className="w-full h-10 px-4 py-2 text-black bg-white rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E55B3C]"
            >
              <option key={0} value={""} disabled>Select a field</option>
              {fieldOfStudy.map((field) => (
                <option key={field} value={field}>{field}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-x-6 gap-y-3 mb-3">
          <div>
            <label className="block text-base md:text-lg font-normal text-black mb-2">Start year*</label>
            <select
              value={education.startYear}
              onChange={(e) => handleEducationChange('startYear', e.target.value)}
              className="w-full h-10 px-4 py-2 text-black bg-white rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E55B3C]"
            >
              <option key={0} value={""} disabled>Select a year</option>
              {years.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-base md:text-lg font-normal text-black mb-2">End year (expected year)*</label>
            <select
              value={education.endYear}
              onChange={(e) => handleEducationChange('endYear', e.target.value)}
              className="w-full h-10 px-4 py-2 text-black bg-white rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E55B3C]"
            >
              <option key={0} value={""} disabled>Select a year</option>
              {years.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="w-full flex justify-center">
          <button 
            className="text-[#E55B3C] text-base font-bold hover:underline mt-2"
            onClick={() => {
              let errorMessage = "";
              if (education.school == "" || education.fieldOfStudy == "" || education.degree == "" || education.startYear == "" || education.endYear == "") errorMessage = "Missing required information";
              if (education.startYear > education.endYear) errorMessage = "Year is invalid";
              if (errorMessage != "") {
                setError(errorMessage);
              } else {
                onSave(index); 
                setEditingEdu(null);
              }
            }}
          >Save</button>
        </div>
      </div>)} 

    </div>
  );
}