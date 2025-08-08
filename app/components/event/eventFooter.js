"use client";

import React, { useEffect, useState } from "react";
import Button from "../ui/Button";
import { formatDateToFullDisplay } from "../ui/formatDate";

export default function EventFooterBar({ dateTime, title, onRegister }) {
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    setFormattedDate(formatDateToFullDisplay(dateTime));
  }, [dateTime]);

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white px-6 py-4 border-t border-gray-200 z-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
      {" "}
      {/* Left Section: Date + Title stacked vertically */}
      <div className="flex flex-col">
        <div className="text-black text-sm sm:text-base">
          {formattedDate || "—"}
        </div>
        <div className="text-black font-bold text-base sm:text-lg">{title}</div>
      </div>
      {/* Right - Button */}
      <div className="flex justify-end">
        <Button text="Register Me" onClick={onRegister} />
      </div>
    </div>
  );
}
