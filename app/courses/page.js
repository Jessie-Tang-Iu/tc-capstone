"use client";

import Navbar from "../components/MemberNavBar";
import CourseSection from "../components/courseSection/courseSection";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PageContent() {


    return (
        <div>
            <Navbar />
            <main className="bg-gray-100 min-h-screen">
                <div className="flex justify-center">
                    <div className="flex items-center border border-black rounded-xl overflow-hidden py-1 pr-2 mt-4">
                        <input 
                        type="text" 
                        placeholder="What to learn?" 
                        className="px-3 py-2 w-64 focus:outline-none placeholder-black"
                        />
                        <button className="bg-[#F26D51] text-white px-3 py-1 rounded-lg">Search</button>
                        <button className="bg-[#F26D51] text-white px-3 py-1 ml-2 rounded-lg">Advanced Search</button>
                    </div>
                </div>

                <div>
                    <h1 className="text-black font-bold text-lg ml-32">Up and Coming</h1>
                    <div className="flex flex-wrap gap-4 justify-around mt-4 mb-8 px-16">
                        <CourseSection />
                        <CourseSection />
                        <CourseSection />
                        <CourseSection />
                        <CourseSection />
                    </div>
                </div>
            </main>
        </div>
    );
}
