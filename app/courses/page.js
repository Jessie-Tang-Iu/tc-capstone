"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import Navbar from "../components/MemberNavBar";
import CourseCard from "../components/courseCard/courseCard.js";
import courses from "../data/courses.json";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function PageContent() {
    const { isLoaded, isSignedIn, user } = useUser();
    const router = useRouter();

    // Redirect if not signed in
    useEffect(() => {
        if (isLoaded && !isSignedIn) {
        router.push("/signIn");
        }
    }, [isLoaded, isSignedIn, router]);

    if (!isLoaded) {
        return <p>Loading...</p>;
    }

    if (!isSignedIn) {
        // Don’t render anything while redirecting
        return null;
    }

    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState({
        beginner: false,
        intermediate: false,
        advanced: false,
        certificateYes: false,
        certificateNo: false,
        online: false,
        inPerson: false,
        workshop: false,
    });

    const [filteredCourses, setFilteredCourses] = useState(courses);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value.toLowerCase());
    }

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setFilters((prev) => ({
            ...prev,
            [name]: checked
        }));
    }

    const filterSearch = () => {
        let results = courses;

        // Gets all filters and converts them into key value pairs ex. [beginner: true] 
        // Then filters out the ones with a true value, then it removes the true/false value for search purposes ex. [beginner, advanced]
        const activeLevels = Object.entries(filters)
            .filter(([key, value]) => value && ["beginner", "intermediate", "advanced"].includes(key))
            .map(([key]) => key);

        console.log("ActiveLevels: ", activeLevels);

        // Does the same as the above function but for course types (Online, In Person, Workshop)
        const activeTypes = Object.entries(filters)
            .filter(([key, value]) => value && ["online", "inPerson", "workshop"].includes(key))
            .map(([key]) => key.toLowerCase());
        
        console.log("ActiveTypes: ", activeTypes);

        results = results.filter((course) => {
            console.log("Course: ", course.title);
            // This compares the courses level to the active filters, if one matches its added to the matchesLevel variable, if none are checked then it returns all courses.
            const matchesLevel =
                activeLevels.length === 0 || activeLevels.includes(course.level); 

            console.log("MatchesLevel: ", matchesLevel);

            // This checks if the certificate filter is applied, if both are checked or unchecked it returns all courses
            // If one of the checks is tricked to true it compares the course certificate value to the filter value
            const matchesCertificate =
                (!filters.certificateYes && !filters.certificateNo) || // no cert filter applied
                (filters.certificateYes && course.certificate === true) ||
                (filters.certificateNo && course.certificate === false);

            console.log("MatchesCertificate: ", matchesCertificate);

            // filters by course type, if the course type is Online and the filter for Online is true it is returned, it doesnt this for all 3.
            const matchesType =
            activeTypes.length === 0 ||
                (filters.online && course.type === "Online") ||
                (filters.inPerson && course.type === "In Person") ||
                (filters.workshop && course.type === "Workshop");

            console.log("MatchesType: ", matchesType);

            // Returns the filtered courses
            return matchesLevel && matchesCertificate && matchesType;
        });

        // Checks the filtered courses against the search query
        if (searchQuery.trim() !== "") {
            results = results.filter((course) =>
                course.title.toLowerCase().includes(searchQuery)
            );
        }

        setFilteredCourses(results);
    }
    return (
        <div className="bg-gray-100 min-h-screen">
            <Navbar />

            {/* Search Bar */}
            <header className="flex justify-center mx-16">
                <div className="flex justify-between border border-black rounded-xl overflow-hidden p-2 my-4 w-1/4 h-15">
                    <input
                        type="text"
                        placeholder="Search by Course Title or Tags"
                        className="px-3 py-2 w-64 focus:outline-none placeholder-gray-700 text-black"
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                    <button className="bg-[#F26D51] text-white px-3 py-1 rounded-lg" onClick={filterSearch}>
                        Search
                    </button>
                </div>
            </header>

            {/* Course Filters and Course Cards */}
            <main className="flex">
                <div className="w-1/6 border-r-black border-r-1 min-h-screen text-black my-5 ">

                    {/* Course Level Filters */}
                    <div className="ml-8 mb-4">
                        <h2 className="font-bold text-xl">Filter By</h2>
                        <h3 className="font-medium text-lg mt-2">Course Level</h3>
                        <input
                        type="checkbox"
                        id="lvlBeg"
                        name="beginner"
                        checked={filters.beginner}
                        onChange={handleCheckboxChange}
                        />
                        <label htmlFor="lvlBeg"> Beginner</label>
                        <br />

                        <input
                        type="checkbox"
                        id="lvlInter"
                        name="intermediate"
                        checked={filters.intermediate}
                        onChange={handleCheckboxChange}
                        />
                        <label htmlFor="lvlInter"> Intermediate</label>
                        <br />

                        <input
                        type="checkbox"
                        id="lvlAdv"
                        name="advanced"
                        checked={filters.advanced}
                        onChange={handleCheckboxChange}
                        />
                        <label htmlFor="lvlAdv"> Advanced</label>
                        <br />
                    </div>

                    {/* Certificate Filters */}
                    <div className="ml-8 mb-4">
                        <h3 className="font-medium text-lg mt-2">Offers Certificate</h3>
                        <input
                        type="checkbox"
                        id="certificateYes"
                        name="certificateYes"
                        checked={filters.certificateYes}
                        onChange={handleCheckboxChange}
                        />
                        <label htmlFor="certificateYes"> Yes</label>
                        <br />

                        <input
                        type="checkbox"
                        id="certificateNo"
                        name="certificateNo"
                        checked={filters.certificateNo}
                        onChange={handleCheckboxChange}
                        />
                        <label htmlFor="certificateNo"> No</label>
                    </div>

                    <div className="ml-8 mb-4">
                        <h3 className="font-medium text-lg mt-2">Type</h3>
                        <input
                            type="checkbox"
                            id="online"
                            name="online"
                            checked={filters.online}
                            onChange={handleCheckboxChange}
                        />
                        <label htmlFor="online"> Online</label>
                        <br />

                        <input
                            type="checkbox"
                            id="inPerson"
                            name="inPerson"
                            checked={filters.inPerson}
                            onChange={handleCheckboxChange}
                        />
                        <label htmlFor="inPerson"> In Person</label>
                        <br />

                        <input
                            type="checkbox"
                            id="workshop"
                            name="workshop"
                            checked={filters.workshop}
                            onChange={handleCheckboxChange}
                        />
                        <label htmlFor="workshop"> Workshop</label>
                    </div>
                </div>

                {/* Course Cards Loop */}
                <div className="w-5/6 min-h-screen flex flex-wrap content-start">
                {filteredCourses.length > 0 ? (
                    filteredCourses.map((course) => (
                    <CourseCard key={course.courseID} course={course} />
                    ))
                ) : (
                    <p className="text-gray-600 p-4">No courses found.</p>
                )}
                </div>
            </main>
        </div>
    );
}
