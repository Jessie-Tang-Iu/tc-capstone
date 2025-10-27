import { useEffect, useState } from "react";

const monthOptions = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const yearOptions = Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i);

export default function ExperienceCard({ index, exp, setNewExp, onSave, onRemove}) {

  const [editingExp, setEditingExp] = useState(null);
  const expSplit = exp ? exp.split(' | '): [];
  // console.log("exp card: ", expSplit);

  const [experience, setExperience] = useState({
    title: expSplit[0] || "",
    company: expSplit[1] || "",
    type: expSplit[2] || "",
    startMonth: expSplit[3] || "",
    startYear: expSplit[4] || "",
    endMonth: expSplit[5] || "",
    endYear: expSplit[6] || "",
    description: expSplit[7] || "",
  })

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
  }, [experience])

  return (
    <div 
      className={`w-full border border-gray-300 rounded-lg p-4 mb-6
                  ${(!editingExp && exp) && 'bg-white'}
                  ${(editingExp != exp && 'bg-gray-100')}`}
    >
      {/* View */}
      {(!editingExp && exp) && (
      <div className="w-full flex justify-center">
        <h2 className="flex-3 text-base md:text-lg font-bold text-black">{`${experience.title} - ${experience.company}`}</h2>
        <button className="text-[#E55B3C] text-base font-bold hover:underline ml-5" onClick={() => setEditingExp(exp) }>Edit</button>
        <button className="text-[#E55B3C] text-base font-bold hover:underline ml-5" 
          onClick={() => onRemove(index)}
        >Remove</button>
      </div>)}

      {/* Click to edit   */}
      {(editingExp === exp || !exp) && (
      <form onSubmit={() => { onSave(index); setEditingExp(null); }}>
        <div className="mb-3">
          <label className="block text-base md:text-lg font-normal text-black mb-2">Company or organization*</label>
          <input
            required
            type="text"
            value={experience.company}
            onChange={(e) => handleExperienceChange('company', e.target.value)}
            placeholder="Ex: Google"
            className="w-full h-10 px-4 py-2 text-black bg-white rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E55B3C]"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-x-6 gap-y-3 mb-1">
          <div>
            <label className="block text-base md:text-lg font-normal text-black mb-2">Title*</label>
            <input
              required
              type="text"
              value={experience.title}
              onChange={(e) => handleExperienceChange('title', e.target.value)}
              placeholder="Ex: Retail Sales Manager"
              className="w-full h-10 px-4 py-2 text-black bg-white rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E55B3C]"
            />
          </div>
          <div>
            <label className="block text-base md:text-lg font-normal text-black mb-2">Employment type</label>
            <select
              value={experience.type}
              onChange={(e) => handleExperienceChange('type', e.target.value)}
              className="w-full h-10 px-4 py-2 text-black bg-white rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E55B3C]"
            >
              <option key={0} disabled>Select a job type</option>
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

        <div className="grid md:grid-cols-2 gap-x-6 gap-y-3 mb-1">
          <div>
            <label className="block text-base md:text-lg font-normal text-black mb-2">Start month*</label>
            <select
              required
              value={experience.startMonth}
              onChange={(e) => handleExperienceChange('startMonth', e.target.value)}
              className="w-full h-10 px-4 py-2 text-black bg-white rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E55B3C]"
            >
              {monthOptions.map((month) => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[#E55B3C] text-base md:text-lg mb-2">Start year*</label>
            <select
              required
              value={experience.startYear}
              onChange={(e) => handleExperienceChange('startYear', e.target.value)}
              className="w-full h-10 px-4 py-2 text-black bg-white rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E55B3C]"
            >
              {yearOptions.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-x-6 gap-y-3 mb-1">
          <div>
            <label className="block text-base md:text-lg font-normal text-black mb-2">End month</label>
            <select
              value={experience.endMonth}
              onChange={(e) => handleExperienceChange('endMonth', e.target.value)}
              className="w-full h-10 px-4 py-2 text-black bg-white rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E55B3C]"
            >
              {monthOptions.map((month) => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[#E55B3C] text-base md:text-lg mb-2">End year</label>
            <select
              value={experience.endYear}
              onChange={(e) => handleExperienceChange('endYear', e.target.value)}
              className="w-full h-10 px-4 py-2 text-black bg-white rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E55B3C]"
            >
              <option key={0} value={""}>Select a year</option>
              {yearOptions.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-2">
          <label className="block text-base md:text-lg font-normal text-black mb-2">Description</label>
          <textarea
            value={experience.description}
            onChange={(e) => handleExperienceChange('description', e.target.value)}
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
            type="submit"
            className="text-[#E55B3C] text-base font-bold hover:underline mt-2"
            // onClick={() =>}
          >Save</button>
        </div>
      </form>)}
    </div>
  );
}