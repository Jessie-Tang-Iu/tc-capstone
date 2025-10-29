"use client";

import { useEffect, useState, Suspense } from "react";
import MemberNavbar from "../components/MemberNavBar";
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

  const [profile, setProfile] = useState();

  const [formData, setFormData] = useState();

  const [resumeData, setResumeData] = useState();
  const [coverLetterData, setCoverLetterData] = useState();

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
      // console.log(user);

      setFormData((prev) => ({
        emails: [
          { email: user?.emailAddresses[0].emailAddress || "#######@gmail.com", isPrimary: true },
          { email: "#######@gmail.com", isPrimary: false },
          { email: "#######@gmail.com", isPrimary: false },
        ],
        phones: [
          { phone: user?.phoneNumbers.length > 0 ? user?.phoneNumbers[0].phoneNumber : "US +1 (519) XXX-XXX", isPrimary: true },
          { phone: "US +1 (519) XXX-XXX", isPrimary: false },
          { phone: "US +1 (519) XXX-XXX", isPrimary: false },
        ],
      }));

      // Fetch user data
      fetch(`/api/users/${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        // console.log("Profile: ", data);
        setProfile(data);
      })
      .catch((error) => console.error('Error fetching profile: ', error))

      // Fetch user resume
      fetch(`/api/resume/user/${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            setResumeData({
              isNew: true,
              user_id: user.id,
              summary: "",
              education: [],
              experience: [],
              certifications: [],
              skills: [],
              additional_info: "",
            })
          } else setResumeData(data);
          // console.log(" Resume: ", data);
        })
        .catch((error) => console.error('Error fetching resume: ', error));

      // Fetch user cover letter
      fetch(`/api/cover_letter/user/${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            setCoverLetterData({
              isNew: true,
              content: "",
            })
          } else setCoverLetterData(data);
          console.log("Cover letter profile page : ", data);
        })
        .catch((error) => console.error('Error fetching cover letter: ', error));
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

  const handleSaveProfile = async () => {
    if (!profile.first_name) { setErrorMessage("First name is required"); return; }
    if (!profile.last_name) { setErrorMessage("Last name is required"); return; }
    if (!profile.email) { setErrorMessage("Email is required"); return; }
    console.log("Saved profile: ", profile); 
    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      })
      if (!res.ok) {
        setErrorMessage("Saving profile error: ", res.status, await res.text());
        return;
      }
      setSuccessMessage("User information is saved")
    } catch (err) {
      setErrorMessage("Saving profile failed: ", err.message);
    }
  }

  const handleSaveResume =  async () => {
    if (!resumeData.summary) { 
      setErrorMessage("Summary is required"); 
      return; 
    }
    console.log("Main profile page - saved resume: ", resumeData);
    let fetchURL = resumeData.isNew ? `/api/resume` : `/api/resume/user/${user.id}`;
    let fetchMethod = resumeData.isNew ? "POST" : "PUT";
    try {
      const res = await fetch(fetchURL, {
        method: fetchMethod,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resumeData),
      })
      if (!res.ok) {
        throw new Error (res.status, await res.text());
      }
      setSuccessMessage("Resume is saved");
    } catch (err) {
      setErrorMessage("Saving resume failed\n", err.message);
    }
  }

  const handleSaveCoverLetter = async () => {
    if (!coverLetterData.content) { 
      setErrorMessage("Content of cover letter is required"); 
      return; 
    }
    console.log("Main profile page - saved cover letter: ", coverLetterData);
    let fetchURL = coverLetterData.isNew ? `/api/cover_letter` : `/api/cover_letter/user/${user.id}`;
    let fetchMethod = coverLetterData.isNew ? `POST` : "PUT";
    try {
      const res = await fetch(fetchURL, {
        method: fetchMethod,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(coverLetterData)
      })
      if (!res.ok) {
        throw new Error (res.status, await res.text());
      }
      setSuccessMessage("Cover letter is saved");
    } catch (err) {
      setErrorMessage("Saving cover letter failed\n", err.message);
    }
  }

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
                formData={profile} 
                setFormData={setProfile}
                resumeData={resumeData}
                setResumeData={setResumeData}
                isNewResume={resumeData?.isNew ? true : false}
                coverLetterData={coverLetterData}
                setCoverLetterData={setCoverLetterData}
                isNewCoverLetter={coverLetterData?.isNew ? true : false}
                setSuccessMessage={setSuccessMessage}
                setErrorMessage={setErrorMessage}
                onProfileSave={handleSaveProfile}
                onResumeSave={handleSaveResume}
                onCoverLetterSave={handleSaveCoverLetter}
              />
            )}
            
            {tab === "security" && (
              <Security formData={formData} setFormData={setFormData} />
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
