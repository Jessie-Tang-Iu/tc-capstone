import React from "react";
import Link from "next/link";

export default function CourseCard ({ course, userId }) {
    return (
    <Link
        className="block border border-gray-200 rounded-xl p-5 mr-4 mb-4 w-[32%] min-w-72 bg-white text-black shadow-sm hover:shadow-md transition-shadow flex flex-col"
        href={`/courses/${course.id}?userId=${userId}`}
    >
        <div className="flex-1">
            <p className="text-xs text-gray-500 mb-1">{course.type}</p>
            <h2 className="text-xl font-semibold leading-tight mb-2">{course.title}</h2>
            <p className="text-sm text-gray-700 mb-4 leading-relaxed">
            {course.description}
            </p>
        </div>

        <div className="flex items-center text-sm text-gray-500 space-x-3 mt-auto">
            <p>{course.level}</p>
            <p>{course.lesson_count} Lessons</p>
            <p>{course.duration}</p>
        </div>
    </Link>
    );
}
