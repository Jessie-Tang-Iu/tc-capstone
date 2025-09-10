"use client";

import Link from "next/link";
import Navbar from "../components/MemberNavBar";
import CourseCard from "../components/courseCard/courseCard";
import courses from "../data/courses.json";

export default function PageContent() {


    return (
        <div className="bg-gray-100 min-h-screen">
            <Navbar />
            <header className="flex justify-center mx-16">
                <div className="flex justify-between border border-black rounded-xl overflow-hidden p-2 my-4 w-1/4 h-15">
                    <input
                        type="text"
                        placeholder="Search by Course Title or Tags"
                        className="px-3 py-2 w-64 focus:outline-none placeholder-gray-700"
                    />
                    <button className="bg-[#F26D51] text-white px-3 py-1 rounded-lg">Search</button>
                </div>
            </header>
            <main className="flex">
                <div className="w-1/6 border-r-black border-r-1 min-h-screen text-black my-5 ">
                    <div className="ml-8 mb-4">
                        <h2 className="font-bold text-xl">Filter By</h2>
                        <h3 className="font-medium text-lg mt-2">Course Level</h3>
                        <input type="checkbox" id="lvlBeg" name="lvlBeg" value="beg"/>
                        <label htmlFor="lvlBeg"> Beginner</label><br/>

                        <input type="checkbox" id="lvlInter" name="lvlInter" value="inter"/>
                        <label htmlFor="lvlInter"> Intermediate</label><br/>

                        <input type="checkbox" id="lvlAdv" name="lvlAdv" value="adv"/>
                        <label htmlFor="lvlAdv"> Beginner</label><br/>
                    </div>
                    <div className="ml-8 mb-4">
                        <h3 className="font-medium text-lg mt-2">Offers Certificate</h3>
                    </div>
                    <div className="ml-8 mb-4">
                        <h3 className="font-medium text-lg mt-2">Type</h3>
                    </div>
                </div>
                <div className="w-5/6 min-h-screen flex flex-wrap content-start">
                    {courses.map((course) => (
                        <CourseCard key={course.courseID} course={course} />
                    ))}
                </div>  
            </main>
        </div>
    );
}
