"use client";

import React, { useState, useEffect } from "react";
import AdminCourse from "../components/adminDashboard/AdminCourse";


export default function AdminDashboard() {
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch all courses from API
    useEffect(() => {
        async function fetchCourses() {
        try {
            const res = await fetch("/api/course");
            if (!res.ok) throw new Error("Failed to fetch courses");
            const data = await res.json();
            setCourses(data);
            setFilteredCourses(data);
        } catch (err) {
            console.error("Error loading courses:", err);
        } finally {
            setLoading(false);
        }
        }
        fetchCourses();
    }, []);

    return (
        <main className="w-full min-h-screen bg-gradient-to-br from-[#f8eae2] to-white">
            <div className="w-5/6 min-h-screen flex flex-wrap content-start">
                {filteredCourses.length > 0 ? (
                    filteredCourses.map((course) => (
                        <AdminCourse key={course.id} course={course} />
                    ))
                    ) : (
                    <p className="text-gray-600 p-4">No courses found.</p>
                )}
            </div>            
        </main>
    )
}
