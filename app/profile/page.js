"use client";

import { useEffect, useState } from "react";
import MemberNavbar from "../components/MemberNavBar";
import ProfileSection from "./profileMember";
import Security from "./security";
import Privacy from "./privacy";
import Notification from "./notification";
import { useUser } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { resume } from "react-dom/server";

export default function ProfileDashboard() {

  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "";
  
  const { user, isLoaded } = useUser();
  // console.log(user)

  const router = useRouter();

  const [formData, setFormData] = useState({
    // Basic Information
    user_id: user?.id || "",
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    preferredName: "",
    pronouns: "She/Her/Hers",
    website: "",
    address: "",
    countryRegion: "",
    city: "",
    email: user?.email || "",
    phoneNumber: user?.phone || "",
    showEmailInProfile: false,
    showPhoneInProfile: false,

    // Sign & Security
    emails: [
      { email: user?.email || "#######@gmail.com", isPrimary: false },
      { email: "#######@gmail.com", isPrimary: false },
      { email: "#######@gmail.com", isPrimary: false },
    ],
    phones: [
      { phone: "US +1 (519) XXX-XXX", isPrimary: false },
      { phone: "US +1 (519) XXX-XXX", isPrimary: false },
      { phone: "US +1 (519) XXX-XXX", isPrimary: false },
    ],
  });

  const [resumeData, setResumeData] = useState();

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
        ...prev,
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        email: user?.emailAddresses[0].emailAddress || "",
        phoneNumber: user?.phoneNumbers.length > 0 ? user?.phoneNumbers[0].phoneNumber : "",
        emails: [
          { email: user?.email || "#######@gmail.com", isPrimary: true },
          { email: "#######@gmail.com", isPrimary: false },
          { email: "#######@gmail.com", isPrimary: false },
        ],
        phones: [
          { phone: user?.phoneNumbers.length > 0 ? user?.phoneNumbers[0].phoneNumber : "US +1 (519) XXX-XXX", isPrimary: true },
          { phone: "US +1 (519) XXX-XXX", isPrimary: false },
          { phone: "US +1 (519) XXX-XXX", isPrimary: false },
        ],
      }));
    }

    fetch(`/api/resume/user/${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        setResumeData(data);
        console.log(" Resume: ", data);
      })
      .catch((error) => console.error('Error fetching resume:', error));

  }, [user]);

  // const [tab, setTab] = useState("message");
  const [showDetail, setShowDetail] = useState(tab == "" ? false : true);

  if (!isLoaded) return null;


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


  return (
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
            ← Back to Setting
          </button>
          <div className="mt-5 md:mt-0 h-full">
            {tab === "profile" && 
              // user.role === "member" && 
              (<ProfileSection 
                formData={formData} 
                setFormData={setFormData}
                resumeData={resumeData}
                setResumeData={setResumeData}
              />
            )}
            
            {tab === "security" && (
              <Security formData={formData} setFormData={setFormData} />
            )}
            
            {tab === "privacy" && <Privacy />}
            
            {tab === "notifications" && (
              <Notification formData={formData} setFormData={setFormData} />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
