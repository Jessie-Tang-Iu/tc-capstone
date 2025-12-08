import Profile from "../../components/profile/profileSection";
import Resume from "../../components/profile/resumeSection";
import CoverLetter from "../../components/profile/coverLetterSection";
import { useUser } from "@clerk/nextjs";
import { useEffect, useMemo, useState } from "react";

export default function ProfileSection({ setSuccessMessage, setErrorMessage }) {

  const { user, isLoaded, isSignedIn } = useUser();

  const [profile, setProfile] = useState(null);
  const [resumeData, setResumeData] = useState(null);
  const [coverLetterData, setCoverLetterData] = useState(null);

  const role = useMemo(() => {
    if (!user) return null;
      return user.publicMetadata.role;
  }, [user]);

  useEffect(() => {
    if (user) {
      // console.log("User from Clerk: ", user);
      // Fetch user data
      fetch(`/api/users/${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          // console.log("Profile: ", data);
          setProfile(data);
          setProfile(prev => ({ 
            ...prev, 
            first_name: user.firstName,
            last_name: user.lastName, 
            email: user.emailAddresses[0].emailAddress,  
            phone: user.phoneNumbers[0]?.phoneNumber || "",
          }));
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
              user_id: user.id,
              content: "",
            })
          } else setCoverLetterData(data);
          // console.log("Cover letter profile page : ", data);
        })
        .catch((error) => console.error('Error fetching cover letter: ', error));
    }
  }, [user]);

  const handleSaveProfile = async () => {
    // console.log("Saved profile: ", profile); 
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
      if (resumeData.isNew) {
        setResumeData((prev) => ({ ...prev, isNew: false }));
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
    // console.log("Main profile page - saved cover letter: ", coverLetterData);
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
      if (coverLetterData.isNew) {
        setCoverLetterData((prev) => ({ ...prev, isNew: false }));
      }
      setSuccessMessage("Cover letter is saved");
    } catch (err) {
      setErrorMessage("Saving cover letter failed\n", err.message);
    }
  }

  if (!isLoaded) {
    return <p className="pl-5 text-black">Loading...</p>;
  }

  if (!isSignedIn) {
    // Don’t render anything while redirecting
    return null;
  }

  if (!profile || !resumeData || !coverLetterData) {
  return <p className="pl-5 text-black">Loading user data...</p>;
}

  return (
    <div className="space-y-8 px-5 h-[calc(100vh-180px)] md:h-[calc(100vh-240px)] overflow-y-auto">
      {/* Basic Information */}
      <div className="mb-6 rounded-xl bg-white p-6 shadow">
      <Profile
        profile={profile}
        setProfile={setProfile}
        onSave={handleSaveProfile}
      />
      </div>

      {/* Resume */}
      {role === "member" && 
      <div className="mb-6 rounded-xl bg-white p-6 shadow">
        <Resume 
          resumeData={resumeData}
          setResumeData={setResumeData}
          isNewResume={resumeData?.isNew ? true : false}
          setErrorMessage={setErrorMessage}
          onSave={handleSaveResume}
        />
      </div>}

      {/* Cover Letter */}
      {role === "member" &&
      <div className="mb-6 rounded-xl bg-white p-6 shadow">
        <CoverLetter 
          coverLetter={coverLetterData}
          setCoverLetter={setCoverLetterData}
          isNew={coverLetterData?.isNew ? true : false}
          setErrorMessage={setErrorMessage}
          onSave={handleSaveCoverLetter}
        />
      </div>}
    </div>
    );
}