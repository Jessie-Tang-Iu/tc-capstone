import { useEffect, useState } from "react";

export default function SkillCard({ index, skill, setNewSkill, isLoading, setIsLoading, setErrorMessage, onSave, onRemove}) {
  
  const [selectedSkill, setSelectedSkill] = useState(null);
  
  const [editingSkill, setEditingSkill] = useState(skill);

  useEffect(() => { setNewSkill(editingSkill)}, [editingSkill])

  return (
    <div 
      className={`w-full border border-gray-400 rounded-lg p-4 mb-3 
                  ${(!selectedSkill && skill) && 'bg-white'} 
                  ${(selectedSkill != skill) && 'bg-gray-300'}`}
    >
      {/* View */}
      {(!selectedSkill && skill) && (
        <div className="w-full flex justify-center">
          <h2 className="flex-3 text-base font-bold text-black">{skill}</h2>
          <button 
            className="text-[#E55B3C] text-base font-bold hover:underline ml-5" 
            onClick={() => { 
              if (isLoading) setErrorMessage("Skill must be saved to continue");
              else {
                // console.log("edit skill card: ", skill);
                setNewSkill(skill);
                setSelectedSkill(skill); 
                setIsLoading(true);
              }
            }}
          >Edit</button>
          <button className="text-[#E55B3C] text-base font-bold hover:underline ml-5" 
            onClick={() => onRemove(index)}
          >Remove</button>
        </div>
      )}

      {/* Edit  */}
      {(selectedSkill === skill || !skill) && (
        <form 
          className="w-full flex justify-between" 
          onSubmit={() => { 
            onSave(index); 
            setSelectedSkill(null); }}
        >
          <div className="flex-1">
            <label className="inline-block w-25 text-base  font-normal text-black">Name:</label>
            <input
              required
              type="text"
              value={editingSkill}
              onChange={(e) => setEditingSkill(e.target.value)}
              placeholder="Ex: Python, Java, C#"
              className="w-auto h-10 px-4 py-2 text-black bg-white rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E55B3C]"
            />
          </div>
          <button 
            type="submit"
            className="text-[#E55B3C] text-base font-bold hover:underline ml-5"
          >Save</button>
        </form>
      )}
    </div>
  );
}