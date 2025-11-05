"use client";

import { useEffect, useState, Suspense } from "react";
import MemberNavbar from "../../components/MemberNavBar";
import ProfileSection from "./profileMember";
import Security from "./security";
import Privacy from "./privacy";
import Notification from "./notification";
import { useUser, UserProfile } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import PopupMessage from "@/app/components/ui/PopupMessage";
import { IoNuclearOutline } from "react-icons/io5";

function ProfileDashboardContent() {

  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "";
  const initialPath = (tab === 'security') ? '/security' : '/profile?tab=security';
  console.log("initial path: ", initialPath);
  
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
      className={`w-full text-left rounded-md px-4 py-3 text-base font-medium transition text-black hover:bg-[#F0E0D5] ${tab === v ? "bg-[#E2B596]" : ""}`}
    >
      {children} <span className="ml-1"></span>
      {">"}
    </button>
  );

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
    <main className="bg-gray-100 min-h-screen w-full">
      <MemberNavbar />
      <div className="pt-7 mb-3 md:mb-8 mx-5 md:mx-8">
        <h1 className="text-2xl md:text-3xl font-bold text-black">Setting</h1>
      </div>

      <div className="flex flex-col md:flex-row bg-gray-100 min-h-[calc(100vh-80px)] px-6">
        <div
          className={`w-full px-2 md:w-50 lg:w-[250px] xl:w-[300px] bg-gray-100
            ${showDetail ? "hidden md:block" : "block"}
            h-57 rounded-lg bg-white p-1 shadow`}
        >
          <TabBtn v="profile">Profile</TabBtn>
          <TabBtn v="security">Sign & Security</TabBtn>
          <TabBtn v="privacy">Data Privacy</TabBtn>
          <TabBtn v="notifications">Notifications</TabBtn>
        </div>

        <div
          className={`flex-1 pt-2
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
            
            {tab === "security" && (
              <div className="px-5 w-full h-[calc(100vh-180px)] md:h-[calc(100vh-240px)] overflow-y-auto">
                <UserProfile 
                  path="/profile"
                  routing="path"
                  initialPath={initialPath}
                  className="w-full"
                  appearance={{
                    elements: {
                      rootBox: {
                        width: 'auto',
                        maxWidth: '600px',
                        boxShadow: 'none', 
                      },
                      card: {
                        width: '80%',
                        maxWidth: '80%',
                        boxShadow: 'none',
                        padding: '24px', // Remove internal padding if needed
                      },
                      profilePage: {
                        width: '100%',
                        maxWidth: '100%',
                      },
                      profilePageContainer: { 
                        padding: '16px',
                      }
                    },
                    variables: {
                      colorPrimary: '#E55B3C', 
                      colorPrimaryForeground: 'white', 
                      colorMutedForeground: 'black',
                      colorForeground: 'black',
                      colorBorder: '#E55B3C',
                    }
                    // --- END COLOR CUSTOMIZATION ---
                  }}
                />
              </div>
            )}
            
            {tab === "privacy" && <Privacy />}
            
            {tab === "notifications" && (
              <Notification formData={notificationData} setFormData={setNotificationData} />
            )}
          </div>
        </div>
      </div>
    </main>
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
