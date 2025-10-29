import { useState } from "react";


export default function CoverLetter({coverLetter, setCoverLetter, isNew, setErrorMessage, onSave}) {
  const [add, setAdd] = useState(isNew);
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl md:text-2xl font-bold text-black mb-6">TC Alberta Cover Letter</h2>
        {add ? (
          <button 
            className="text-sm mb-6 px-6 py-2 bg-[#E55B3C] hover:bg-[#d14f32] font-semibold rounded-md transition duration-200 cursor-pointer focus:outline-none active:scale-95 text-white"
            onClick={() => setAdd(!add)}
           >Add</button>
          ) : (
          <button 
            className="text-sm mb-6 px-6 py-2 bg-[#E55B3C] hover:bg-[#d14f32] font-semibold rounded-md transition duration-200 cursor-pointer focus:outline-none active:scale-95 text-white"
            onClick={onSave}
          >Save</button>
        )}
      </div>

      {!add && (
        <div>
          <label className="block text-base md:text-lg font-bold text-black mb-2">Content</label>
          <textarea
            value={coverLetter.content}
            onChange={(e) => setCoverLetter(prev => ({ ...prev, ["content"]: e.target.value}))}
            // placeholder="List your major duties and successes, highlighting specific projects"
            rows={10}
            className="w-full px-4 py-2 text-black bg-white rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E55B3C]"
          />
          <div className="text-right text-sm text-gray-500 mt-1 w-full">
            {coverLetter.content.length} / 800
          </div>
        </div>)}
    </div>
  );
}