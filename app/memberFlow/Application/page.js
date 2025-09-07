"use client";

import Navbar from "@/app/components/MemberNavBar";
import { useUserContext } from "@/app/context/userContext";
import sampleApplications from "@/app/data/applications.json";

const statusColors = {
    "Submitted": "bg-gray-100 text-gray-800 border-gray-300",
    "Under review": "bg-blue-100 text-blue-800 border-blue-300",
    "Interview scheduled": "bg-green-100 text-green-800 border-green-300",
    "Rejected": "bg-red-100 text-red-800 border-red-300",
    "Offer": "bg-emerald-100 text-emerald-800 border-emerald-300",
};

export default function Applications() {

    const { user, role, getCurrentSession } = useUserContext();
    if (!user || role !== "member") {
        try {
            getCurrentSession();
        } catch (error) {
            console.error("Error fetching session:", error);
            alert("Error", "Failed to fetch session. Please sign in again.");
        }
        return <div className="min-h-screen flex items-center justify-center">
            <p className="text-gray-500">Loading...</p>
        </div>;
    }

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <div className="bg-white h-5 md:h-20" />

            <div className="container mx-auto px-4">
                <div className="mb-6 md:mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-black">My Applications</h1>
                    <p className="text-sm md:text-base text-gray-600 mt-1">Track the jobs you've applied for.</p>
                </div>

                <div className="space-y-3 md:space-y-4">
                    {sampleApplications.filter((app) => app.memberId === user.id).map((app) => (
                        <div key={app.id} className="w-full border border-gray-200 rounded-xl p-4 md:p-5 bg-white">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                                <div>
                                    <h3 className="text-base md:text-lg font-bold text-black leading-tight">{app.jobTitle}</h3>
                                    <div className="text-sm md:text-base text-gray-600">
                                        {app.company} • {app.location}
                                    </div>
                                    <div className="text-xs md:text-sm text-gray-500 mt-1">Applied on {new Date(app.appliedAt).toLocaleDateString()}</div>
                                </div>
                                <div className="flex items-center gap-2 md:gap-3">
                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs md:text-sm border ${statusColors[app.status] || "bg-gray-100 text-gray-800 border-gray-300"}`}>
                                        {app.status}
                                    </span>
                                    {/* <span className="text-xs md:text-sm text-gray-400">{app.id}</span> */}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};