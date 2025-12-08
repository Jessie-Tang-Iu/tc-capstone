import { Pencil, Save, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function SkillCard({ index, skill, setNewSkill, isLoading, setIsLoading, setErrorMessage, onSave, onRemove}) {
  
  const [selectedSkill, setSelectedSkill] = useState(null);
  
  const [editingSkill, setEditingSkill] = useState(skill);

  useEffect(() => { setNewSkill(editingSkill)}, [editingSkill])

  return (
    <div 
      className={`w-full rounded-md border border-gray-300 mb-2 
                  ${(!selectedSkill && skill) ? 'bg-white' : 'ring-2 ring-[#E55B3C]'}`}
    >
      {/* View */}
      {(!selectedSkill && skill) && (
        <div className="w-full flex justify-center my-1">
          <h2 className="flex-3 text-sm font-medium text-black py-2 pl-4">{skill}</h2>
          <button  
            className="text-blue-600 hover:bg-gray-200 py-2 px-2 rounded-full transition"
            aria-label="Modify Item"
            onClick={() => { 
                if (isLoading) setErrorMessage("Skill must be saved to continue");
                else {
                  // console.log("edit skill card: ", skill);
                  setNewSkill(skill);
                  setSelectedSkill(skill); 
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
        </div>
      )}

      {/* Edit  */}
      {(selectedSkill === skill || !skill) && (
        <form 
          className="w-full flex justify-between py-2 pl-4" 
          onSubmit={() => { 
            onSave(index); 
            setSelectedSkill(null); }}
        >
          <div className="flex-1">
            <label className="inline-block w-25 text-sm text-gray-700 font-medium">Name:</label>
            <input
              required
              type="text"
              value={editingSkill}
              onChange={(e) => setEditingSkill(e.target.value)}
              placeholder="Ex: Python, Java, C#"
              className="w-auto h-8 rounded-md border border-gray-300 px-3 py-2 text-base text-black outline-none focus:ring-2 focus:ring-gray-200"
            />
          </div>
          <button 
            type="submit"
            className="text-[#E55B3C] hover:bg-gray-200 mr-1 px-2 rounded-full transition"
            aria-label="Save Data"
          >
            <Save size={20} className="w-5 h-5" />
          </button>
        </form>
      )}
    </div>
  );
}