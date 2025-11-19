import { Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

const monthOptions = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const yearOptions = Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i);

export default function ExperienceCard({ index, exp, setNewExp, isLoading, setIsLoading, setErrorMessage, onSave, onRemove}) {

  const [error, setError] = useState(null);
  const [editingExp, setEditingExp] = useState(null);
  // console.log("exp card: ", expSplit);

  const [experience, setExperience] = useState({
    title: "",
    company: "",
    type: "",
    startMonth: "",
    startYear: "",
    endMonth: "",
    endYear: "",
    description: "",
  });

  const [typeOptions, setTypeOptions] = useState([]);

  const handleExperienceChange = (field, value) => {
    setExperience (prev => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    fetch('api/job/types')
      .then((res) => res.json())
      .then((data) => setTypeOptions(data))
      .catch((err) => console.log("Failed to fetch job types: ", err));
  }, []);

  useEffect(() => {
    setNewExp(experience);
  }, [experience]);
  
  useEffect(() => {
    let expSplit = editingExp ? editingExp.split(' | '): exp.split(' | ');

    setExperience({
      title: expSplit[0] || "",
      company: expSplit[1] || "",
      type: expSplit[2] || "",
      startMonth: expSplit[3] || "",
      startYear: expSplit[4] || "",
      endMonth: expSplit[5] || "",
      endYear: expSplit[6] || "",
      description: expSplit[7] || "",
    })
  }, [])

  return (
    <div 
      className={`w-full rounded-md border border-gray-300 mb-2
                  ${(!editingExp && exp) ? 'bg-white' : 'ring-2 ring-[#E55B3C]'}`}
    >
      {/* View */}
      {(!editingExp && exp) && (
      <div className="w-full flex justify-center my-1">
        <h2 className="flex-3 text-sm font-medium text-black py-2 pl-4">{`${experience.title} - ${experience.company}`}</h2>
        
        <button  
          className="text-blue-600 hover:bg-gray-200 py-2 px-2 rounded-full transition"
          aria-label="Modify Item"
          onClick={() => {
            if (isLoading) setErrorMessage("Experience must be saved to continue");
            else {
              setEditingExp(exp);
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

      {/* Click to edit   */}
      {(editingExp === exp || !exp) && (
      <div className="py-2 px-4">
        {error && <p className="text-red-600 text-xs font-base">{error}</p>}
        <div className="my-2">
          <label className="block text-xs text-gray-700 font-medium mb-1">Company or organization*</label>
          <input
            type="text"
            value={experience.company}
            onChange={(e) => handleExperienceChange('company', e.target.value)}
            placeholder="Ex: Google"
            className="w-full h-10 rounded-md border border-gray-300 px-3 py-2 text-sm text-black outline-none focus:ring-2 focus:ring-gray-200"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-x-6 gap-y-2 mb-2">
          <div>
            <label className="block text-xs text-gray-700 font-medium mb-1">Title*</label>
            <input
              type="text"
              value={experience.title}
              onChange={(e) => handleExperienceChange('title', e.target.value)}
              placeholder="Ex: Retail Sales Manager"
              className="w-full h-10 rounded-md border border-gray-300 px-3 py-2 text-sm text-black outline-none focus:ring-2 focus:ring-gray-200"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-700 font-medium mb-1">Employment type</label>
            <select
              value={experience.type}
              onChange={(e) => handleExperienceChange('type', e.target.value)}
              className="w-full h-10 rounded-md border border-gray-300 px-3 py-2 text-sm text-black outline-none focus:ring-2 focus:ring-gray-200"
            >
              <option key={0} value="" disabled>Select a job type</option>
              {typeOptions.map((type) => (
                <option key={type.id} value={type.name}>{type.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* <div className="flex items-center gap-2 mb-3">
            <input
            type="checkbox"
            checked={formData.currentlyWorking}
            onChange={(e) => handleInputChange('currentlyWorking', e.target.checked)}
            className="rounded border-black"
            />
            <label className="text-sm text-black">Currently working in this role</label>
        </div> */}

        <div className="grid md:grid-cols-2 gap-x-6 gap-y-2 mb-2">
          <div>
            <label className="block text-xs text-gray-700 font-medium mb-1">Start month*</label>
            <select
              value={experience.startMonth}
              onChange={(e) => handleExperienceChange('startMonth', e.target.value)}
              className="w-full h-10 rounded-md border border-gray-300 px-3 py-2 text-sm text-black outline-none focus:ring-2 focus:ring-gray-200"
            >
              <option key={0} value={""} disabled>Select a month</option>
              {monthOptions.map((month) => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-black text-xs font-medium mb-1">Start year*</label>
            <select
              value={experience.startYear}
              onChange={(e) => handleExperienceChange('startYear', e.target.value)}
              className="w-full h-10 rounded-md border border-gray-300 px-3 py-2 text-sm text-black outline-none focus:ring-2 focus:ring-gray-200"
            >
              <option key={0} value={""} disabled>Select a year</option>
              {yearOptions.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-x-6 gap-y-2 mb-2">
          <div>
            <label className="block text-xs text-gray-700 font-medium mb-1">End month</label>
            <select
              value={experience.endMonth}
              onChange={(e) => handleExperienceChange('endMonth', e.target.value)}
              className="w-full h-10 rounded-md border border-gray-300 px-3 py-2 text-sm text-black outline-none focus:ring-2 focus:ring-gray-200"
            >
              <option key={0} value={""} disabled>Select a month</option>
              {monthOptions.map((month) => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-black text-xs font-medium mb-1">End year</label>
            <select
              value={experience.endYear}
              onChange={(e) => handleExperienceChange('endYear', e.target.value)}
              className="w-full h-10 rounded-md border border-gray-300 px-3 py-2 text-sm text-black outline-none focus:ring-2 focus:ring-gray-200"
            >
              <option key={0} value={""} disabled>Select a year</option>
              {yearOptions.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="my-2">
          <label className="block text-xs text-gray-700 font-medium mb-1">Description</label>
          <textarea
            value={experience.description}
            onChange={(e) => handleExperienceChange('description', e.target.value)}
            placeholder="List your major duties and successes, highlighting specific projects"
            rows={3}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-black outline-none focus:ring-2 focus:ring-gray-200"
          />
          <div className="text-right text-sm text-gray-500 mt-1 max-w-3xl">
            {/* {formData.description.length} / 500 */}
          </div>
        </div>
        
        <div className="w-full flex justify-center py-1">
          <div>
          <button 
            className="bg-[#EE7D5E] text-white hover:opacity-90 px-6 py-2 rounded-md text-xs font-semibold transition cursor-pointer"
            onClick={() => {
              let errorMessage = "";
              if (experience.company == "" || experience.title == "" || experience.startMonth == "" || experience.startYear == "")
                errorMessage = "Missing required information";
              if (experience.endYear != "" && experience.startYear > experience.endYear)
                errorMessage = "Time is invalid";
              if (errorMessage != "") {
                setError(errorMessage);
              } else {
                onSave(index);
                setEditingExp(null);
              }
            }}
          >Save</button>
          </div>
          <div>
          {/* <button 
            className="bg-[#F3E1D5] text-black hover:opacity-90 px-6 py-2 rounded-md text-xs font-semibold transition cursor-pointer ml-6"
            onClick={() => {
              setIsLoading(false);
              setEditingExp(null);
              setError(null);
            }}
          >Cancel</button> */}
          </div>
        </div>
      </div>)}
    </div>
  );
}