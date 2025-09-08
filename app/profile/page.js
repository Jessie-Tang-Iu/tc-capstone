"use client";

import { useState } from "react";
import Navbar from "../components/MemberNavBar";
import ProfileSection from "../components/profile/profileMember";
import Security from "../components/profile/security";
import Privacy from "../components/profile/privacy";
import Notification from "../components/profile/notification";
import { useUserContext } from "../context/userContext";

export default function ProfileDashboard() {

    const { user } = useUserContext();

    const [tab, setTab] = useState("message");
    const [showDetail, setShowDetail] = useState(false);

    const TabBtn = ({ v, children }) => (
        <button
            value={v}
            onClick={(e) => {setTab(e.currentTarget.value); setShowDetail(true);}}
            className={`w-full text-left rounded-md px-4 py-3 text-base font-medium transition
                text-black hover:bg-[#F0E0D5] ${tab === v ? "bg-[#E2B596]" : ""}`}
        >
            {children} <span className="ml-1"></span>
            {">"}
        </button>
    );

    const [formData, setFormData] = useState({
        // Basic Information
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        preferredName: "",
        pronouns: "She/Her",
        headline: "",
        website: "",
        linkText: "",
        countryRegion: "",
        city: "",
        email: user?.email || "",
        phoneNumber: user?.phone || "",
        showEmailInProfile: false,
        showPhoneInProfile: false,
        
        // Current Position
        industry: "Software Development",
        title: "",
        employmentType: "Permanent Full-time",
        company: "",
        currentlyWorking: false,
        startMonth: "March",
        startYear: "2023",
        endMonth: "May",
        endYear: "2025",
        location: "",
        description: "",
        
        // Education
        school: "",
        degree: "",
        fieldOfStudy: "",
        eduStartMonth: "March",
        eduStartYear: "2023",
        eduEndMonth: "May",
        eduEndYear: "2025",
        eduDescription: "",
        
        // Sign & Security
        emails: [
            { email: user?.email || "#######@gmail.com", isPrimary: false },
            { email: "#######@gmail.com", isPrimary: false },
            { email: "#######@gmail.com", isPrimary: false }
        ],
        phones: [
            { phone: "US +1 (519) XXX-XXX", isPrimary: false },
            { phone: "US +1 (519) XXX-XXX", isPrimary: false },
            { phone: "US +1 (519) XXX-XXX", isPrimary: false }
        ],
        currentPassword: "",
        newPassword: "",
        retypePassword: "",
        
        // Notifications
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
            accountError: { email: false, phone: false }
        }
    });

    const handleBackToList = () => {
        setShowDetail(false);
    };

    return (
        <main className="w-full min-h-screen bg-gray-100">
            <Navbar />

            <div className="pt-7 mb-3 md:mb-8 mx-5 md:mx-8">
                <h1 className="text-2xl md:text-3xl font-bold text-black">Setting</h1>
            </div>

            {/* Main Content */}
            <div className="flex flex-col md:flex-row">
                {/*Advisor Side Bar*/}
                <div 
                    className={`w-full px-2 md:w-50 lg:w-[250px] xl:w-[300px]
                    ${showDetail ? 'hidden md:block' : 'block'}
                    h-[calc(100vh-180px)] md:h-[calc(100vh-240px)] overflow-y-auto`}
                >
                    <TabBtn v="profile">Profile</TabBtn>
                    <TabBtn v="security">Sign & Security</TabBtn>
                    <TabBtn v="privacy">Data Privacy</TabBtn>
                    <TabBtn v="notifications">Notifications</TabBtn>
                </div>

                {/* Detail Panel */}
                <div 
                    className={`flex-1 py-2 px-5
                                ${showDetail ? 'block' : 'hidden md:block'}
                                h-[calc(100vh-180px)] md:h-[calc(100vh-240px)] relative`}
                >
                    {/* Mobile Back Button */}
                    <button
                        onClick={handleBackToList}
                        className="md:hidden top-4 z-10 text-black rounded-lg text-sm font-normal cursor-pointer transition-colors"
                    >
                        ← Back to Setting
                    </button>
                    <div className="mt-5 md:mt-0 h-full">
                        {(tab === "profile" && user.role === "member") && <ProfileSection formData={formData} setFormData={setFormData} />}
                        {tab === "security" && <Security formData={formData} setFormData={setFormData} />}
                        {tab === "privacy" && <Privacy />}
                        {tab === "notifications" && <Notification formData={formData} setFormData={setFormData} />}
                    </div>
                </div> 
            </div>
        </main>
    );
}