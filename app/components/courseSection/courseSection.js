"use client";

import { useState, useEffect, useRef } from "react";

export default function CourseSection({ section }) {
    

    return (
        <div className="border border-gray-300 rounded-lg p-4 bg-white shadow-md hover:shadow-lg transition-shadow w-[16%] h-[20%]">
            <h2 className="text-black text-lg font-semibold mb-2">{section.title}</h2>
            <p className="text-gray-600 mb-4">{section.description}</p>
        </div>
    );
}