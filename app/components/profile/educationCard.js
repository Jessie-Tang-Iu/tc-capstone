import { useEffect, useState } from "react";
import { Pencil, Trash2 } from 'lucide-react';
import InputField from "./inputField";

const degreeOptions = ["Select a degree", "Diploma", "Bachelors", "Masters", "PhD"];
const fieldOfStudy = ["Select a field", "Arts", "Biology", "Business", "Chemistry", "Computer Science", "Data Science", "Economics", "Education", "Engineering", "Environmental Science", "Health Sciences", "History", "Information Technology", "Literature", "Mathematics", "Philosophy", "Physics", "Political Science", "Psychology", "Social Sciences", "Sociology", "Software Development"];
const years = ["Select a year", ...Array.from({ length: 50 }, (_, i) => 2030 - i)];

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
      className={`w-full rounded-md border border-gray-300 mb-2 
                  ${(!editingEdu && edu) ? 'bg-white' : 'ring-2 ring-[#E55B3C]'}`}
    > 
      {/* Edit & Remove option  */}
      {(!editingEdu && edu) && (
      <div className="w-full flex justify-center my-1">
        <h2 className="flex-3 text-sm font-medium text-black py-2 pl-4">{education.school}</h2>

        <button  
          className="text-blue-600 hover:bg-gray-200 py-2 px-2 rounded-full transition"
          aria-label="Modify Item"
          onClick={() => { 
            if (isLoading) {
              setErrorMessage("Education must be saved to continue");
            } else {
              // console.log("edit card: ", edu);
              setEditingEdu(edu); 
              setIsLoading(true);
            }
          }}
        >
          <Pencil size={20} className="w-5 h-5" /> 
        </button>

        <button 
          onClick={() => onRemove(index)}
          className="text-red-600 hover:bg-gray-200 py-2 px-2 mr-1 rounded-full transition"
          aria-label="Delete Item"
        >
          <Trash2 size={20} className="w-5 h-5" />
        </button>
      </div>)}

      {/* Modify option  */}
      {(editingEdu === edu || !edu) && (
      <div className="py-2 px-4">
        {error && <p className="text-red-600 text-sm font-base">{error}</p>}
        {/* School */}
        <div className="my-2">
          <InputField 
            label="School *" value={education.school} placeholder="Ex: Western University"
            onChange={(e) => handleEducationChange('school', e.target.value)}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-x-6 gap-y-2 mb-2">
          <InputField 
            type="select" options={degreeOptions} 
            label="Degree *" value={education.degree}
            onChange={(e) => handleEducationChange('degree', e.target.value)}
          />
          <InputField 
            type="select" options={fieldOfStudy}
            label="Field of study *" value={education.fieldOfStudy}
            onChange={(e) => handleEducationChange('fieldOfStudy', e.target.value)}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-x-6 gap-y-2 mb-2">
          <InputField 
            label="Start year *" value={education.startYear}
            type="select" options={years}
            onChange={(e) => handleEducationChange('startYear', e.target.value)}
          />
          <InputField 
              label="End year (expected year) *" value={education.endYear}
              type="select" options={years}
              onChange={(e) => handleEducationChange('endYear', e.target.value)}
            />
        </div>
        <div className="w-full flex justify-center py-1">
          <div>
          <button 
            className="bg-[#EE7D5E] text-white hover:opacity-90 px-6 py-2 rounded-md text-sm font-semibold transition cursor-pointer"
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
          <div>
          {/* <button 
            className="bg-[#F3E1D5] text-black hover:opacity-90 px-6 py-2 rounded-md text-xs font-semibold transition cursor-pointer ml-6"
            onClick={() => {
              setIsLoading(false);
              setEditingEdu(null);
              setError(null);
            }}
          >Cancel</button> */}
          </div>
        </div>
      </div>)} 

    </div>
  );
}