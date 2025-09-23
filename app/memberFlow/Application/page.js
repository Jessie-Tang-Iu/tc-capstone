"use client";

import ApplyCard from "@/app/components/application/AppCard";
import AppDetail from "@/app/components/application/AppDetail";
import MemberNavBar from "@/app/components/MemberNavBar";
import { useUserContext } from "@/app/context/userContext";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Applications() {
  const { user, getCurrentSession } = useUserContext();
  const userId = 7; // Change to user.id when finishing user database

  const [selectedApp, setSelectedApp] = useState();
  const [selectedAppId, setSelectedAppId] = useState();
  const [status, setStatus] = useState("");
  const [showAppDetail, setShowAppDetail] = useState(false);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    console.log(`/api/application/user/${userId}`)
    fetch(`/api/application/user/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setApplications(data)
        console.log("Fetched applications:", data);})
      .catch((error) => {
        console.error("Error fetching applications:", error);
      });
  }, []);

  useEffect(() => {
    if (selectedAppId) {
        console.log("Selected App ID changed:", selectedAppId);
        console.log(`/api/application/${selectedAppId}`)
        fetch(`/api/application/${selectedAppId}`)
            .then((res) => res.json())
            .then((data) => {
                setSelectedApp(data)
                console.log("Fetched application detail:", selectedApp);
            })
            .catch((error) => {
                console.error("Error fetching application detail:", error);
            });
    }
  }, [selectedAppId]);

  const handleAppSelect = (appId) => {
    setSelectedAppId(appId);
    setShowAppDetail(true);
    setStatus(selectedApp ? selectedApp.status : "");
  };

  const handleUpdateStatus = (status) => {
    setStatus(status);
    setApplications((prev) =>
      prev.map((a) => (a.id === selectedAppId ? { ...a, status: status } : a))
    );
  };

  const handleBackToList = () => {
    setShowAppDetail(false);
  };

  if (!user) {
    try {
      getCurrentSession();
    } catch (error) {
      console.error("Error fetching session:", error);
      alert("Error", "Failed to fetch session. Please sign in again.");
    }
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <MemberNavBar />

      <div className="pt-7 mb-3 md:mb-8 mx-5 md:mx-8">
        <h1 className="text-2xl md:text-3xl font-bold text-black">
          My Applications
        </h1>
        <p className="text-sm md:text-base text-gray-600 mt-1">
          Track the jobs you have applied for.
        </p>
      </div>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row ml-2">
        {/* Job Listings Sidebar */}
        <div
          className={`w-full md:w-96 lg:w-[400px] xl:w-[450px]
                    ${showAppDetail ? "hidden md:block" : "block"}
                    h-[calc(100vh-180px)] md:h-[calc(100vh-240px)] overflow-y-auto`}
        >
          <div className="px-2 md:px-4 py-2">
            {applications
              .map((app) => (
                <ApplyCard
                  key={app.id}
                  app={app}
                  isSelected={selectedAppId === app.id}
                  onClick={() => handleAppSelect(app.id)}
                  onUpdateStatus={() => handleUpdateStatus(status)}
                />
              ))}
          </div>
        </div>

        {/* Job Detail Panel */}
        <div
          className={`flex-1 py-2
                                ${showAppDetail ? "block" : "hidden md:block"}
                                h-[calc(100vh-180px)] md:h-[calc(100vh-240px)] relative`}
        >
          {/* Mobile Back Button */}
          <button
            onClick={handleBackToList}
            className="md:hidden top-4 ml-5 z-10 text-black rounded-lg text-sm font-normal hover:bg-[#E55B3C]/90 transition-colors"
          >
            ← Back to Jobs
          </button>
          <div className="mt-5 md:mt-0 h-full">
            <AppDetail application={selectedApp} />
          </div>
        </div>
      </div>

      {/* <div className="space-y-3 md:space-y-4">
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
                                    <span className="text-xs md:text-sm text-gray-400">{app.id}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div> */}
    </div>
  );
}