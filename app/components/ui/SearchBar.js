// app/components/ui/SearchBar.jsx
"use client";

import React from "react";
import Button from "@/app/components/ui/Button";

export default function SearchBar({ value, onChange, onSearch, placeholder }) {
  const effectivePlaceholder = placeholder || "Username...";

  return (
    <div className="flex items-center gap-2">
      <input
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={effectivePlaceholder}
        className="w-72 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm
                   text-black placeholder:text-gray-500 placeholder:opacity-100
                   outline-none focus:ring-2 focus:ring-gray-200"
      />
      <Button text="Search" onClick={onSearch} />
    </div>
  );
}
