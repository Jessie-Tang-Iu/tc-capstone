"use client";

import React, { useState } from "react";
import PopupMessage from "@/app/components/ui/PopupMessage";

export default function SavedDocCard({
  title = "Saved Document",
  name,
  contact = [], // array of strings
  bullets = [], // array of strings (for resume highlights)
  body = "", // long text (for cover letter)
  downloadUrl, // optional direct link to the file
  onDownload, // optional custom handler () => void | Promise<void>
  disabled = false, // disable Download button
}) {
  const [popup, setPopup] = useState(null);

  const handleDownload = async () => {
    if (disabled) return;

    try {
      if (onDownload) {
        // If parent signals failure by throwing or returning false
        const result = await Promise.resolve(onDownload());
        if (result === false) throw new Error("unavailable");
        return;
      }

      if (!downloadUrl) throw new Error("no-url");

      // Try to open in a new tab; if blocked or failed, show popup
      const w = window.open(downloadUrl, "_blank", "noopener,noreferrer");
      if (!w) throw new Error("blocked");
    } catch (_) {
      setPopup({
        type: "error",
        title: "Download Unavailable",
        description:
          "The link is currently unavailable. Please try again later or contact the applicant.",
        buttonText: "OK",
      });
    }
  };

  return (
    <>
      <div className="max-w-md rounded-xl border border-gray-300 bg-white p-4 shadow-sm">
        {/* Title */}
        <div className="mb-3 text-sm font-semibold text-[#EE7D5E]">{title}</div>

        {/* Divider */}
        <div className="border-t" />

        {/* Content */}
        <div className="mt-3 space-y-2 text-sm text-black">
          {name && <div className="font-semibold">{name}</div>}

          {contact.length > 0 && (
            <div className="space-y-0.5 text-gray-700">
              {contact.map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </div>
          )}

          {bullets.length > 0 && (
            <ul className="ml-4 list-disc space-y-1 text-gray-800">
              {bullets.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          )}

          {body && (
            <div className="whitespace-pre-line text-gray-700">{body}</div>
          )}
        </div>

        {/* Download button */}
        <button
          onClick={handleDownload}
          disabled={disabled}
          className={`mt-4 w-full rounded-md px-4 py-2 text-sm font-medium text-white ${
            disabled
              ? "cursor-not-allowed bg-gray-300"
              : "bg-[#EE7D5E] hover:opacity-90"
          }`}
        >
          Download
        </button>
      </div>

      {popup && (
        <PopupMessage
          type={popup.type}
          title={popup.title}
          description={popup.description}
          buttonText={popup.buttonText}
          onClose={() => setPopup(null)}
        />
      )}
    </>
  );
}
