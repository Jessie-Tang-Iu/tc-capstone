import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
const toolbarOptions = [
  [{ font: [] }, { size: [] }],
  ["bold", "italic", "underline", "strike"],
  [{ color: [] }, { background: [] }],
  [{ align: [] }],
  ["clean"],
];

export default function CoverLetter({coverLetter, setCoverLetter, isNew, setErrorMessage, onSave}) {
  const [add, setAdd] = useState(isNew);
  const [content, setContent] = useState(coverLetter.content || "");

  useEffect(() => {
    setCoverLetter(prev => ({ ...prev, ["content"]: content}));
  }, [content]);

  return (
    <div>
      {add && 
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-semibold text-[#E55B3C]">TC Alberta Cover Letter</h2>
          <button 
            className="text-sm px-6 py-2 bg-[#E55B3C] hover:bg-[#d14f32] font-semibold rounded-md transition duration-200 cursor-pointer focus:outline-none active:scale-95 text-white"
            onClick={() => setAdd(!add)}
          >Add</button>
        </div>
      }

      {!add && (
        <div>
          <div className="mb-4 text-2xl font-semibold text-[#E55B3C] text-center">
            TC Alberta Cover Letter
          </div>
          <label className="block text-sm text-gray-700 font-medium mb-1">Content</label>
          <div className="h-80">
            <ReactQuill
              theme="snow"
              className="h-68 text-black rounded-md text-sm"
              value={content}
              onChange={setContent}
              modules={{ toolbar: toolbarOptions }}
            />
          </div>
          {/* <textarea
            value={coverLetter.content}
            onChange={(e) => setCoverLetter(prev => ({ ...prev, ["content"]: e.target.value}))}
            // placeholder="List your major duties and successes, highlighting specific projects"
            rows={10}
            className="w-full px-4 py-2 text-black bg-white rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E55B3C]"
          /> */}
          <div className="text-right text-sm text-gray-500 mr-1 w-full">
            {content.length} / 800
          </div>
          <div className="flex justify-center">
            <button 
              className="text-sm px-6 py-2 bg-[#E55B3C] hover:bg-[#d14f32] font-semibold rounded-md transition duration-200 cursor-pointer focus:outline-none active:scale-95 text-white"
              onClick={onSave}
            >Save</button>
          </div>
        </div>)}
    </div>
  );
}