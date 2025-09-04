"use client";

import React, { useEffect } from "react";
import Button from "@/app/components/ui/Button";

export default function PopupMessage({
  type = "confirm", // 'confirm' | 'success' | 'error'
  title,
  description,
  onClose,
  onConfirm,
  buttonText, //  optional custom button label
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title + Description */}
        <div className="text-center mb-6">
          <h3
            className={`text-lg font-bold mb-2 ${
              type === "confirm"
                ? "text-[#E55B3C]"
                : type === "error"
                ? "text-red-600"
                : "text-green-600"
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

        {/* Buttons */}
        <div className="flex justify-center gap-4">
          {type === "confirm" && (
            <>
              <button
                onClick={onClose}
                className="bg-gray-200 text-black font-semibold px-6 py-2 rounded-lg hover:bg-gray-300 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="bg-red-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-red-700 transition cursor-pointer"
              >
                {buttonText || "Confirm"}
              </button>{" "}
            </>
          )}

          {(type === "success" || type === "error") && (
            <Button text={buttonText || "OK"} onClick={onClose} />
          )}
        </div>
      </div>
    </div>
  );
}
