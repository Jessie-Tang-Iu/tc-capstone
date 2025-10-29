import Profile from "../components/profile/profileSection";
import Resume from "../components/profile/resumeSection";
import CoverLetter from "../components/profile/coverLetterSection";

export default function ProfileSection({ formData, setFormData, resumeData, setResumeData, isNewResume, coverLetterData, setCoverLetterData, isNewCoverLetter, setSuccessMessage, setErrorMessage, onProfileSave, onResumeSave, onCoverLetterSave }) {

  return (
    <div className="space-y-8 px-5 h-[calc(100vh-180px)] md:h-[calc(100vh-240px)] overflow-y-auto">
      {/* Basic Information */}
      <Profile
        profile={formData}
        setProfile={setFormData}
        onSave={onProfileSave}
      />

      <hr className="border-gray-300" />

      {/* Resume */}
      <Resume 
        resumeData={resumeData}
        setResumeData={setResumeData}
        isNewResume={isNewResume}
        setErrorMessage={setErrorMessage}
        onSave={onResumeSave}
      />

      <hr className="border-gray-300" />

      {/* Cover Letter */}
      <CoverLetter 
        coverLetter={coverLetterData}
        setCoverLetter={setCoverLetterData}
        isNew={isNewCoverLetter}
        setErrorMessage={setErrorMessage}
        onSave={onCoverLetterSave}
      />
    </div>
    );
}