import React from "react";
import Link from "next/link";

export default function CourseCard ({ course, userId }) {
    return (
        <Link className="border border-gray-300 rounded-lg p-4 m-4 w-[30%] bg-white text-black shadow-md" href={`/courses/${course.id}?userId=${userId}`}>
            <div className="">
                <p className="text-sm">{course.type}</p>
                <h2 className="text-lg font-medium">{course.title}</h2>
                <div className="bg-gray-200 h-40 flex items-center justify-center text-gray-600 mt-4">
                    IMAGE IF HAVE
                </div>
                <p className="mt-2">{course.description}</p>
                <div className="flex text-sm text-gray-500 mt-4">
                    <p>{course.level}</p>
                    <p className="ml-2">{course.lessonCount} Lessons</p>
                    <p className="ml-2">{course.duration}</p>
                </div>
            </div>
        </Link>
    );
}
