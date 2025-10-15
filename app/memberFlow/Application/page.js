"use client";

import ApplyCard from "@/app/components/application/AppCard";
import AppDetail from "@/app/components/application/AppDetail";
import MemberNavBar from "@/app/components/MemberNavBar";
import PopupMessage from "@/app/components/ui/PopupMessage";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const statusOptions = {
  S: "Submitted",
  U: "Under review",
  I: "Interview scheduled",
  R: "Rejected",
  O: "Offer",
  D: "Withdrawn",
};

export default function Applications() {
  const { user, getCurrentSession } = useUser();
  const router = useRouter();
  // console.log("User: ", user);

  // if (!user) {
  //   router.push("/");
  //   return;
  // }

  const userId = user?.id; // Change to user.id when finishing user database
  const [resume, setResume] = useState();
  const [coverLetter, setCoverLetter] = useState();

  const [selectedApp, setSelectedApp] = useState();
  const [selectedAppId, setSelectedAppId] = useState();
  const [showAppDetail, setShowAppDetail] = useState(false);

  const [applications, setApplications] = useState([]);
  const [status, setStatus] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!isLoaded || !user) return;

    const userId = user.id;

    // Fetch applications by user_id
    fetch(`/api/application/user/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setApplications(data);
        // console.log("Fetched applications:", data);
      })
      .catch((error) => {
        console.error("Error fetching applications:", error);
      });

    // Fetch resume by user_id
    fetch(`/api/resume/user/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setResume(data);
        // console.log("Resume: ", data);
      })
      .catch((error) => console.error("Error fetching resume:", error));

    // Fetch cover letter by user_id
    fetch(`/api/cover_letter/user/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setCoverLetter(data);
        // console.log("CV: ", data);
      })
      .catch((error) => console.error("Error fetching cover letter: ", error));
  }, [userId]);

  // Fetch the information of selected application
  useEffect(() => {
    if (selectedAppId) {
      // console.log("Selected App ID changed:", selectedAppId);
      console.log(`/api/application/${selectedAppId}`);
      fetch(`/api/application/${selectedAppId}`)
        .then((res) => res.json())
        .then((data) => {
          setSelectedApp(data);
          // console.log("Fetched application detail:", selectedApp);
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
    // console.log("resume: ", resume);
    // console.log('cover letter: ', coverLetter);
  };

  const handleUpdateStatus = async (app, newStatus) => {
    // Check valid updated status
    let statusArray = ["S", "U", "I", "R", "O", "D"];
    // console.log("newStatus: ", statusArray.indexOf(status), " status: ", statusArray.indexOf(app.status));
    if (
      statusArray.indexOf(newStatus) <= statusArray.indexOf(app.status) ||
      statusArray.indexOf(app.status) > 2
    ) {
      setStatus(app.status);
      setErrorMessage("Invalid updated status");
      return;
    }

    // Update to database
    try {
      const res = await fetch(`/api/application/${app.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStatus),
      });
      if (!res.ok) throw new Error("Failed to update status");

      setApplications((prev) =>
        prev.map((a) => (a.id === app.id ? { ...a, status: newStatus } : a))
      );
      if (selectedApp && selectedApp.id == app.id)
        setSelectedApp({ ...selectedApp, status: newStatus });
      setShowSuccess(true);
      setErrorMessage("");
    } catch (e) {
      setErrorMessage(e);
    }
  };

  const handleBackToList = () => {
    setShowAppDetail(false);
  };

  return (
    <>
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
              {applications.map((app) => (
                <ApplyCard
                  key={app.id}
                  app={app}
                  status={status}
                  setStatus={setStatus}
                  isSelected={selectedAppId === app.id}
                  onClick={() => handleAppSelect(app.id)}
                  onUpdateStatus={() => handleUpdateStatus(app, status)}
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
              className="md:hidden top-4 ml-5 z-10 text-black rounded-lg text-sm font-normal hover:underline transition-colors"
            >
              {"< Back to Jobs"}
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
      {/* {showConfirm && (
      <PopupMessage
        type="confirm"
        title="Update status?"
        description="Are you sure that you want to update your application's status?"
        onClose={() => setShowConfirm(false)}
        onConfirm={() => handleUpdateStatus}
      />
    )} */}
      {errorMessage && (
        <PopupMessage
          type="error"
          title={
            errorMessage.includes("already registered")
              ? "Already Registered"
              : "Update Failed"
          }
          description={errorMessage}
          onClose={() => setErrorMessage("")}
        />
      )}
      {showSuccess && (
        <PopupMessage
          type="success"
          title="Successfully Update"
          description={`Your application's status is updated to ${statusOptions[status]}`}
          onClose={() => setShowSuccess(false)}
        />
      )}
    </>
  );
}
