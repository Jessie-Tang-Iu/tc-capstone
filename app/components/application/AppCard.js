"use client";
import { Save, X } from "lucide-react";
import { useState, useEffect } from "react";

const statusColors = {
    "S": "bg-gray-100 text-gray-800 border-gray-300",
    "U": "bg-blue-100 text-blue-800 border-blue-300",
    "I": "bg-green-100 text-green-800 border-green-300",
    "R": "bg-red-100 text-red-800 border-red-300",
    "O": "bg-yellow-100 text-yellow-800 border-yellow-300",
    "D": "bg-orange-100 text-orange-800 border-orange-300",
};

const statusOptions = {
    "S": "Submitted",
    "U": "Under review",
    "I": "Interview scheduled",
    "R": "Rejected",
    "O": "Offer",
    "D": "Withdrawn",
};

export default function ApplyCard({ app, status, setStatus, isSelected = false, onClick, onUpdateStatus }) {

  const [editingId, setEditingId] = useState(null);

  return (
    <div
     className={`w-full bg-white rounded-lg px-6 py-4 mb-4 space-y-1 text-black transition ${
                 isSelected ? 'ring-2 ring-[#E55B3C] bg-[#E55B3C]/5' : 'hover:bg-gray-50'}`}
    >
      <div className="flex flex-col gap-2">
        <div>
          {/* Job title and status */}
          <div className="flex items-center gap-2 mb-2">
            <h3 onClick={onClick} className="flex-3 text-base font-bold text-black leading-tight cursor-pointer">{app.title}</h3>
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs border ${statusColors[app.status] || "bg-gray-100 text-gray-800 border-gray-300"}`}>
              {statusOptions[app.status]}
            </span>
          </div>

          {/* Company and location */}
          <div className="text-xs font-semi-bold text-gray-600">
            {app.company} • {app.location}
          </div>

          {/* Applied date */}
          <div className="text-xs text-gray-500 mt-1">Applied on {new Date(app.appliedAt).toLocaleDateString()}</div>
          
          {/* Update status button and select */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            {!editingId && (
              <button
                onClick={() => { setStatus(app.status); setEditingId(app.id); } }
                className={`mt-2 px-3 py-2 bg-[#E55B3C] text-white rounded-lg text-xs 
                            ${(app.status == "R" || app.status == "O" || app.status == "D") ? 
                            'cursor-not-allowed' : 'hover:bg-[#E55B3C]/90'}`}
                disabled={ app.status == "R" || app.status == "O" || app.status == "D" }
              >
                Update status
              </button>
            )}
                
            {editingId === app.id && (
              <div className="flex items-center gap-2 mt-2">
                <select
                  value={status}
                  onChange={(e) => {setStatus(e.target.value); }}
                  className="px-2 py-2 border border-gray-300 rounded-lg text-xs"
                >
                  {Object.entries(statusOptions).map(([key, value]) => (
                    <option key={key} value={key}>{value}</option>
                   ))}
                </select>
                                
                <button
                  onClick={() => { setEditingId(null); onUpdateStatus(app, status); }}
                  className="text-[#E55B3C] hover:bg-gray-200 ml-2 px-2 py-2 rounded-lg transition"
                >
                  <Save size={20} className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="text-black hover:bg-gray-200 px-2 py-2 rounded-lg transition"
                >
                  <X className="w-5 h-5 text-black" />
                </button>
              </div>
            )}
          </div>
        </div>
                
      </div>
    </div>
  );
}