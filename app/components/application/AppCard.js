"use client";
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
            // className="bg-white rounded-lg shadow px-6 py-4 space-y-2 text-black cursor-pointer hover:opacity-95 transition"
            className={`w-full bg-white rounded-lg px-6 py-4 mb-5 space-y-2 text-black transition ${
                isSelected ? 'ring-2 ring-[#E55B3C] bg-[#E55B3C]/5' : 'hover:bg-gray-50'
            }`}
        >
            <div className="flex flex-col gap-3">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <h3 onClick={onClick} className="flex-3 text-base md:text-lg font-bold text-black leading-tight cursor-pointer">{app.title}</h3>
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs md:text-sm border ${statusColors[app.status] || "bg-gray-100 text-gray-800 border-gray-300"}`}>
                            {statusOptions[app.status]}
                        </span>
                    </div>
                    <div className="text-sm md:text-base text-gray-600">
                        {app.company} • {app.location}
                    </div>
                    <div className="text-xs md:text-sm text-gray-500 mt-1">Applied on {new Date(app.appliedAt).toLocaleDateString()}</div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 md:gap-3">
                        {!editingId && (
                            <button
                                onClick={() => { setStatus(app.status); setEditingId(app.id); } }
                                className="mt-3 px-3 py-2 bg-[#E55B3C] text-white rounded-lg text-xs md:text-sm hover:bg-[#E55B3C]/90"
                                disabled={ app.status == "R" || app.status == "O" || app.status == "D" }
                            >
                                Update status
                            </button>
                        )}
                        
                        {editingId === app.id && (
                            <div className="flex items-center gap-2 mt-3">
                                <select
                                    value={status}
                                    onChange={(e) => {setStatus(e.target.value); }}
                                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                >
                                    {Object.entries(statusOptions).map(([key, value]) => (
                                        <option key={key} value={key}>{value}</option>
                                    ))}
                                </select>
                                
                                <button
                                    onClick={() => { setEditingId(null); onUpdateStatus(app, status); }}
                                    className="px-3 py-2 bg-[#E55B3C] text-white rounded-lg text-sm hover:bg-[#E55B3C]/90"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={() => setEditingId(null)}
                                    className="px-3 py-2 bg-gray-200 text-black rounded-lg text-sm hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                </div>
                </div>
                
            </div>
        </div>
    );
}