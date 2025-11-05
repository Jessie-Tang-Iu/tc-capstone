import Profile from "../../components/profile/profileSection";
import Resume from "../../components/profile/resumeSection";
import CoverLetter from "../../components/profile/coverLetterSection";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export default function ProfileSection({ setSuccessMessage, setErrorMessage }) {

  const { user, isLoaded, isSignedIn } = useUser();

  const [profile, setProfile] = useState(null);
  const [resumeData, setResumeData] = useState(null);
  const [coverLetterData, setCoverLetterData] = useState(null);

  useEffect(() => {
    if (user) {
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
          // console.log("Cover letter profile page : ", data);
        })
        .catch((error) => console.error('Error fetching cover letter: ', error));
    }
  }, [user]);

  const handleSaveProfile = async () => {
    if (!profile.first_name) { setErrorMessage("First name is required"); return; }
    if (!profile.last_name) { setErrorMessage("Last name is required"); return; }
    if (!profile.email) { setErrorMessage("Email is required"); return; }
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

  if (!profile || !resumeData || !coverLetterData) {
  return <p>Loading user data...</p>;
}

  return (
    <div className="space-y-8 px-5 h-[calc(100vh-180px)] md:h-[calc(100vh-240px)] overflow-y-auto">
      {/* Basic Information */}
      <Profile
        profile={profile}
        setProfile={setProfile}
        onSave={handleSaveProfile}
      />

      <hr className="border-gray-300" />

      {/* Resume */}
      <Resume 
        resumeData={resumeData}
        setResumeData={setResumeData}
        isNewResume={resumeData?.isNew ? true : false}
        setErrorMessage={setErrorMessage}
        onSave={handleSaveResume}
      />

      <hr className="border-gray-300" />

      {/* Cover Letter */}
      <CoverLetter 
        coverLetter={coverLetterData}
        setCoverLetter={setCoverLetterData}
        isNew={coverLetterData?.isNew ? true : false}
        setErrorMessage={setErrorMessage}
        onSave={handleSaveCoverLetter}
      />
    </div>
    );
}