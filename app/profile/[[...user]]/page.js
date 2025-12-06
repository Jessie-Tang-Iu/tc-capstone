"use client";

import { useEffect, useState, Suspense } from "react";
import MemberNavbar from "../../components/MemberNavBar";
import AdvisorNavbar from "../../components/AdvisorNavBar";
import ProfileSection from "./profileMember";
import Security from "./security";
import Privacy from "./privacy";
import Notification from "./notification";
import { useUser } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import PopupMessage from "@/app/components/ui/PopupMessage";

function ProfileDashboardContent() {

  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "";
  
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [profile, setProfile] = useState(null);

  const [notificationData, setNotificationData] = useState({
    notifications: {
      newMessage: { email: false, phone: true },
      newComment: { email: true, phone: true },
      newConnection: { email: true, phone: true },
      accountUpdated: { email: false, phone: false },
      verifications: { email: false, phone: false },
      eventRegistered: { email: false, phone: false },
      eventReminder: { email: true, phone: false },
      eventUpdate: { email: true, phone: false },
      messageFromAdmin: { email: false, phone: false },
      accountError: { email: false, phone: false },
    },
  });

  const [userRole, setUserRole] = useState("");


  useEffect(() => {
    if (user) {
      // Fetch user data
      fetch(`/api/users/${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          // console.log("Profile: ", data);
          setProfile(data);
        })
        .catch((error) => console.error('Error fetching profile: ', error));
    }
  }, [user]);

  // const [tab, setTab] = useState("message");
  const [showDetail, setShowDetail] = useState(tab == "" ? false : true);

  const TabBtn = ({ v, children }) => (
    <button
      value={v}
      onClick={(e) => {
        router.push(`/profile?tab=${v}`);
        setShowDetail(true);
      }}
      className={`w-full text-left rounded-md px-4 py-2 my-1 text-base font-medium transition text-black hover:bg-[#F0E0D5] ${tab === v ? "bg-[#E2B596]" : ""}`}
    >
      {children} <span className="ml-1"></span>
      {">"}
    </button>
  );

  // check user role
  useEffect(() => {
    console.log("Profile data in role check: ", profile);
    if (profile && profile.role) {
      setUserRole(profile.role);
    }
  }, [profile]);

  const handleBackToList = () => setShowDetail(false);

  if (!isLoaded) {
    return <p>Loading...</p>;
  }

  if (!isSignedIn) {
    // Don’t render anything while redirecting
    return null;
  }

  return (
    <>
    <div className="w-full min-h-screen bg-linear-to-br from-[#f8eae2] to-white">
      
      {userRole === "member" && (
        <MemberNavbar />
      )}

      {userRole === "advisor" && (
        <AdvisorNavbar />
      )}
      

      <main className="mx-auto w-full px-6 py-8">
        <h1 className="mb-6 text-3xl font-bold text-[#DD5B45]">
          Profile Settings
        </h1>
      

      <div className="flex flex-col md:flex-row min-h-[calc(100vh-80px)]">
        <div
          className={`w-full px-2 min-w-3xs md:w-50 lg:w-[250px]
            ${showDetail ? "hidden md:block" : "block"}
            h-50 bg-white rounded-lg p-1 shadow`}
        >
          <TabBtn v="security">Profile & Security</TabBtn>
          <TabBtn v="profile">User Information</TabBtn>
          <TabBtn v="privacy">Data Privacy</TabBtn>
          <TabBtn v="notifications">Notifications</TabBtn>
        </div>

        <div
          className={`flex-1
            ${showDetail ? "block" : "hidden md:block"}
            h-[calc(100vh-180px)] md:h-[calc(100vh-240px)] relative`}
        >
          <button
            onClick={handleBackToList}
            className="md:hidden top-4 z-10 pl-5 text-black rounded-lg text-sm font-normal cursor-pointer transition-colors"
          >
            {"< Back to Setting"}
          </button>
          <div className="mt-5 md:mt-0 h-full">
            {tab === "profile" && (
              // user.role === "member" &&
              <ProfileSection 
                setSuccessMessage={setSuccessMessage}
                setErrorMessage={setErrorMessage}
              />
            )}
            
            {tab === "security" && <Security /> }
            
            {tab === "privacy" && <Privacy />}
            
            {tab === "notifications" && (
              <Notification formData={notificationData} setFormData={setNotificationData} />
            )}
          </div>
        </div>
      </div>
      </main>
    </div>

    {errorMessage && (
      <PopupMessage
        type="error"
        title={
        errorMessage.includes("required")
          ? "Missing information"
          : "Update Failed"
        }
        description={errorMessage}
        onClose={() => setErrorMessage("")}
      />
    )}

    {successMessage && (
      <PopupMessage
        type="success"
        title="Successfully Update"
        description={successMessage}
        onClose={() => setSuccessMessage("")}
      />
    )}
    </>
  );
}

export default function ProfileDashboard() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProfileDashboardContent />
    </Suspense>
  );
}
