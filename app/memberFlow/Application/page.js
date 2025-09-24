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
  const [resume, setResume] = useState();
  const [coverLetter, setCoverLetter] = useState();

  const [selectedApp, setSelectedApp] = useState();
  const [selectedAppId, setSelectedAppId] = useState();
  const [showAppDetail, setShowAppDetail] = useState(false);
  
  const [applications, setApplications] = useState([]);
  const [status, setStatus] = useState("");

  useEffect(() => {
    // Fetch applications by user_id
    fetch(`/api/application/user/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setApplications(data)
        // console.log("Fetched applications:", data);
      })
      .catch((error) => {
        console.error("Error fetching applications:", error);
      }
    );

    // Fetch resume by user_id
    fetch(`/api/resume/user/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setResume(data);
        // console.log("Resume: ", data);
      })
      .catch((error) => console.error('Error fetching resume:', error)
    );

    // Fetch cover letter by user_id
    fetch(`/api/cover_letter/user/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setCoverLetter(data);
        // console.log("CV: ", data);
      })
      .catch((error) => console.error('Error fetching cover letter: ', error)
    );
  }, []);

  // Fetch the information of selected application
  useEffect(() => {
    if (selectedAppId) {
      console.log("Selected App ID changed:", selectedAppId);
      console.log(`/api/application/${selectedAppId}`)
      fetch(`/api/application/${selectedAppId}`)
        .then((res) => res.json())
        .then((data) => {
          setSelectedApp(data)
          // console.log("Fetched application detail:", selectedApp);
        })
        .catch((error) => {
          console.error("Error fetching application detail:", error);
        }
      );
    }
  }, [selectedAppId]);

  const handleAppSelect = (appId) => {
    setSelectedAppId(appId);
    setShowAppDetail(true);
    setStatus(selectedApp ? selectedApp.status : "");
    // console.log("resume: ", resume);
    // console.log('cover letter: ', coverLetter);
  };

  const handleUpdateStatus = async (newStatus) => {
    let statusArray = ["S", "U", "I", "R", "O", "D"];
    console.log("newStatus: ", statusArray.indexOf(status), " status: ", statusArray.indexOf(selectedApp.status));
    if ((statusArray.indexOf(newStatus) < statusArray.indexOf(selectedApp.status)) || (statusArray.indexOf(selectedApp.status) > 2)) {
      setStatus(selectedApp.status);
      console.error("Invalid updated status");
    } else {
      try {
        const res = await fetch(`/api/application/${selectedAppId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newStatus),
        });
        if (!res.ok) throw new Error("Failed to update status");
        setApplications((prev) =>
          prev.map((a) => (a.id === selectedAppId ? { ...a, status: status } : a))
        );
        setSelectedApp({ ...selectedApp, status: status });
      } catch (e) {
        console.error(e);
      }
    }
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
                  status={status}
                  setStatus={setStatus}
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
            <AppDetail 
              app={selectedApp} 
              resume={resume}
              coverLetter={coverLetter}
              // onDownload={() => {}}
            />
          </div>
        </div>
      </div>
    </div>
  );
}