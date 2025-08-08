"use client";

import React, { useEffect } from "react";
import Button from "@/app/components/ui/Button";

export default function PopupMessage({
  type = "confirm", // 'confirm' | 'success'
  title,
  description,
  onClose,
  onConfirm,
}) {
  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
        {/* Main Message */}
        <div className="text-center mb-6">
          <h3
            className={`text-lg font-bold mb-2 ${
              type === "confirm" ? "text-[#E55B3C]" : "text-green-600"
            }`}
          >
            {title}
          </h3>
          {Array.isArray(description) ? (
            <div className="text-gray-700 text-sm space-y-1 mb-4">
              {description.map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
          ) : (
            <p className="text-gray-700 text-sm mb-4">{description}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          {type === "confirm" && (
            <>
              <button
                onClick={onClose}
                className="bg-gray-200 text-black font-semibold px-6 py-2 rounded-lg hover:bg-gray-300 transition cursor-pointer"
              >
                Cancel
              </button>
              <Button text="Register" onClick={onConfirm} />
            </>
          )}

          {type === "success" && <Button text="OK" onClick={onClose} />}
        </div>
      </div>
    </div>
  );
}
