import { FileInput, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import PopupMessage from "@/app/components/ui/PopupMessage";
import { useRouter } from "next/navigation";


export default function ApplyForm({ job, formData, setFormData, currentStep, setCurrentStep, errorMessage, setErrorMessage, onSubmit, onClose }) {

  const router = useRouter();

  const [resume, setResume] = useState();
  const [coverLetter, setCoverLetter] = useState();

  useEffect(() => {
      // Fetch resume in database
      fetch(`/api/resume/user/${formData.user_id}`)
        .then((res) => res.json())
        .then((data) => {
            setResume(data);
            console.log(" Resume: ", data);
        })
        .catch((error) => console.error('Error fetching resume:', error));
      
      // Fetch cover letter in database
      fetch(`/api/cover_letter/user/${formData.user_id}`)
        .then((res) => res.json())
        .then((data) => {
            setCoverLetter(data);
            console.log(" CV: ", data);
        })
        .catch((error) => console.error('Error fetching cover letter: ', error));
    
    }, [formData.user_id]);

  const handleNext = () => {
    let error = false;

    // Check answers in step 3
    if (currentStep == 3) {
      formData.answers.forEach(a => {
        if (a == "") {
          setErrorMessage("Question is required to answer");
          error = true;
          return;
        }
      })
    }

    // Display uploaded file after step 1
    if (currentStep == 1) console.log(formData);

    if ((currentStep < 5) && !error) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const ProgressBar = () => (
    <div className="w-full max-w-5xl mx-auto px-4 mb-8">
      <div className="flex items-center justify-between mb-2">
        <div className="w-full bg-gray-200 h-2 rounded-full">
          <div
            className="bg-[#E55B3C] h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 4) * 100}%` }}
          />
        </div>
        <span className="ml-4 text-sm font-normal text-black">
          {currentStep}/4
        </span>
      </div>
    </div>
  );

  const JobHeader = () => (
    <div className="w-full max-w-2xl mx-auto mb-8 flex items-center justify-between">
      <div className="flex-1 bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-bold text-black mb-2">{job.title}</h2>
        <p className="text-base font-normal text-gray-600 mb-2">{job.company}</p>
        <p className="text-base font-normal text-black">{job.location}</p>
      </div>
      <button
        onClick={onClose}
        className="p-1 ml-5 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <X className="w-5 h-5 text-black" />
      </button>
    </div>
  );

  const StepNavigation = () => (
    <div className="flex justify-end gap-4 mt-8">
      {currentStep > 1 && (
        <button
          onClick={handleBack}
          className="px-6 py-3 bg-white text-[#E55B3C] rounded-lg text-base font-normal hover:bg-gray-50 transition-colors border-1 border-gray-200"
        >
          {"< Back Step"}
        </button>
      )}
      <button
        onClick={currentStep === 4 ? onSubmit : handleNext}
        className="px-6 py-3 bg-[#E55B3C] text-white rounded-lg text-base font-normal hover:bg-[#d14f32] transition-colors"
      >
        {currentStep === 4 ? "Submit >" : "Next Step >"}
      </button>
    </div>
  );

  const ResumeCard = ({ type = "resume", file }) => {
    if (type == "cover_letter") { const cvContent = file.content.split('\\n'); }
    return (
    <div className="w-full h-130 max-w-sm border border-black rounded-2xl p-4 bg-white">
      <div className="text-[#E55B3C] text-base font-bold mb-3">Previous {type == "resume" ? "Resume" : "Cover Letter"}</div>
      <hr className="border-gray-200 mb-3" />
      {file && !file.error ? (
        <div>
          <div className="text-center">
            <div className="text-base font-bold text-black">
              {file.first_name} {file.last_name}
            </div>
            <p className="text-sm text-black mb-2">{file.email}</p>
          </div>
          <div className="text-sm text-gray-500 leading-relaxed h-85">
              {type === "resume" ? (
                <>
                  <b>Summary: </b>{file.summary}
                  <br />
                  <b>Education: </b>{file.education}
                  <br />
                  <b>Certification: </b>{file.certifications}
                  <br />
                  <b>Skills: </b>{file.skills}
                  <br />
                  <b>Experience: </b>{file.experience}
                  <br />
                  <b>Additional information: </b>{file.additional_info}
                </>
            ) : (
              <>
                {file.content.split('\\n').map((line, idx) => ( <p key={idx} className="mt-2">{line}</p> ))}
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center text-base font-bold text-black h-65">Empty in database</div>
      )}
      <button 
        className="w-full bg-[#E55B3C] text-white py-2 rounded text-sm font-normal hover:bg-[#E55B3C]/90 transition-colors mt-4"
        onClick={() => router.push("/profile")}
      >
        {type === "resume" ? "Edit Resume" : "Edit Cover Letter"}
      </button>
    </div>
  )};

  const UploadArea = ({ type }) => {
    const localFileInputRef = useRef(null);
    return (
    <div 
      className="w-full max-w-sm border border-gray-300 rounded-2xl p-4 bg-white  cursor-pointer"
      onClick={() => localFileInputRef.current.click() }
    >
      <div className="text-center">
        <div className="text-[#E55B3C] text-base font-bold mb-2">
          Upload New {type == "resume" ? "Resume" : "Cover Letter"}
        </div>
        <div className="text-sm text-gray-500">File types: PDF, DOCS, TXT</div>
      </div>
      <input 
        type="file"
        ref={localFileInputRef}
        onChange={(e) => {
          const uploadedFile = e.target.files?.[0] || null;
          setFormData({ ...formData, [`${type}_name`]: uploadedFile.name, [`${type}_data`]: uploadedFile });
        }}
        className="hidden"
        accept=".pdf,.doc,.docx"
      />
      {formData[`${type}_name`] && formData[`${type}_data`]  && formData[`${type}_data`] instanceof File && (
        <div className="mt-4 text-center text-sm text-gray-700">
          Selected File: <span className="font-bold">{formData[`${type}_name`]}</span>
        </div>
      )}
    </div>
    );
  }

  return (
    <>
    <div className="absolute w-full h-full bg-gray-700/60 flex items-center justify-center z-10 ">
      <div className="fixed inset-0 bg-gray-100 z-50 overflow-y-auto">
        <div className="pt-20 pb-8 px-4">
          {currentStep <= 4 && <JobHeader />}
          {currentStep <= 4 && <ProgressBar />}

          <div className="container mx-auto">

            {/* Step 1: Resume and Cover Letter */}
            {currentStep === 1 && 
            <div className="max-w-4xl mx-auto ">
              <h1 className="text-2xl font-bold text-black mb-8">
                Upload Resume/ Cover Letter
              </h1>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Resume Section */}
                <div className="flex justify-center">
                  <div className="space-y-6">
                    {resume && <ResumeCard type="resume" file={resume} />}
                    <UploadArea type="resume" />
                  </div>
                </div>

                {/* Cover Letter Section */}
                <div className="flex justify-center">
                  <div className="space-y-6">
                    <ResumeCard type="coverLetter" file={coverLetter} />
                    <UploadArea type="cover_letter" />
                  </div>
                </div>
              </div>
            </div>
            }

            {/* Step 2: Relative Information */}
            {currentStep === 2 &&
              <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold text-black mb-8">
                  Relative Information
                </h1>

                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-base font-normal text-black mb-2">
                        First Name:
                      </label>
                      <input
                        type="text"
                        value={formData.relative_first_name}
                        onChange={(e) => setFormData({ ...formData, relative_first_name: e.target.value })}
                        className="w-full px-4 py-3 text-black bg-white border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E55B3C]"
                      />
                    </div>
                    <div>
                      <label className="block text-base font-normal text-black mb-2">
                        Last Name:
                      </label>
                      <input
                        type="text"
                        value={formData.relative_last_name}
                        onChange={(e) =>  setFormData({ ...formData, relative_last_name: e.target.value })}
                        className="w-full px-4 py-3 text-black bg-white border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E55B3C]"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-base font-normal text-black mb-2">
                        Email:
                      </label>
                      <input
                        type="email"
                        value={formData.relative_email}
                        onChange={(e) => setFormData({ ...formData, relative_email: e.target.value })}
                        className="w-full px-4 py-3 text-black bg-white border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E55B3C]"
                      />
                    </div>
                    <div>
                      <label className="block text-base font-normal text-black mb-2">
                        Phone Number:
                      </label>
                      <input
                        type="tel"
                        value={formData.relative_phone}
                        onChange={(e) => setFormData({ ...formData, relative_phone: e.target.value })}
                        className="w-full px-4 py-3 text-black bg-white border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E55B3C]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            }

            {/* Step 3: Additional Questions */}
            {currentStep === 3 && 
              <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold text-black mb-8">Additional Questions</h1>
                <div className="space-y-6">
                  {job.questions.map((question, index) => (
                    <div key={index}>
                      <label className="block text-base font-normal text-black mb-3">{question}</label>
                      <input
                        type="text"
                        value={formData.answers[index]}
                        onChange={(e) => {
                          const updatedAnswers = [...formData.answers];
                          updatedAnswers[index] = e.target.value;
                          setFormData({ ...formData, answers: updatedAnswers });
                        }}
                        className="w-full px-4 py-3 text-black bg-white border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E55B3C]"
                      />
                    </div>
                  ))}
                </div>
              </div>
            }
          
            {/* Step 4: Review Application */}
            {currentStep === 4 &&
            <div className="max-w-4xl mx-auto">
              <div className="mb-8">
                  <h1 className="text-2xl font-bold text-black mb-2">Review your application</h1>
                  <p className="text-base text-gray-600">The employer will receive a copy of your profile.</p>
              </div>

              <div className="space-y-8">
                {/* Resume */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-black">Resume</h2>
                    { !formData.resume_name && <button className="text-[#E55B3C] text-base font-bold hover:underline">Edit</button> }
                  </div>
                  <div className="flex justify-center">
                    { !formData.resume_name ?
                      <ResumeCard type="resume" file={ resume } />
                      :
                      <UploadArea type="resume" /> 
                    }
                  </div>
                </div>

                {/* Cover Letter */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-black">Cover Letter</h2>
                    { !formData.cover_letter_name && <button className="text-[#E55B3C] text-base font-bold hover:underline">Edit</button>}
                  </div>
                  <div className="flex justify-center">
                    { !formData.cover_letter_name ?
                      <ResumeCard type="coverLetter" file={ coverLetter} />
                      :
                      <UploadArea type="cover_letter" /> 
                    }
                  </div>
                </div>

                {/* Contact Info */}
                {formData.relative_first_name != "" &&
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-black">Relative information</h2>
                    <button 
                      className="text-[#E55B3C] text-base font-bold hover:underline"
                      onClick={() => setCurrentStep(2)}
                    >Edit</button>
                  </div>
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-bold text-black mb-4">{formData.relative_first_name} {formData.relative_last_name}</h3>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-gray-500 font-bold">Email address</span>
                            <div className="text-black font-bold">{formData.relative_email}</div>
                          </div>
                          <div>
                            <span className="text-gray-500 font-bold">Mobile phone number</span>
                            <div className="text-black font-bold">{formData.relative_phone}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    </div>
                </div>}

                {/* Additional Questions */}
                <div>
                  <h2 className="text-lg font-bold text-black mb-4">Additional Questions</h2>
                  <div className="space-y-4 bg-white p-6 rounded-lg border border-gray-200">
                    {job.questions.map((question, index) => (
                        <div key={index}>
                            <div className="text-gray-500 font-bold text-sm">{question}</div>
                            <div className="text-black font-bold text-sm">{formData.answers[index]}</div>
                        </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            }

            {/* Step 5: Submitted */}
            {currentStep === 5 && 
            <div className="max-w-2xl mx-auto">
              <div className="bg-white border border-gray-400 rounded-lg p-8 text-center">
                <h1 className="text-2xl font-bold text-black mb-4">Application Submitted</h1>
                    
                <div className="text-left text-sm text-black space-y-4 mb-8">
                  <p>Your application has been submitted!</p>
                        
                  <div>
                    <p><strong>Position:</strong> {job.title}</p>
                    <p><strong>Company:</strong> {job.company}</p>
                    <p><strong>Location:</strong> {job.location} - {job.workplace}</p>
                    <p><strong>Wage:</strong> ${job.salary_per_hour}/hour · {job.type}</p>
                  </div>
                        
                  <p>We hve successfully received your application.</p>
                  <p>Our team will review your submission, and if selected, you will be contacted by email for the next steps.</p>
                  
                  <p>For questions, please contact: <strong>support@techconnectalberta.ca</strong></p>
                </div>

                <div className="flex gap-4 justify-center">
                  <button className="px-6 py-3 bg-[#E55B3C] text-white rounded text-sm font-normal hover:bg-[#E55B3C]/90 transition-colors">
                    Save as PDF
                  </button>
                  <button className="px-6 py-3 bg-[#E55B3C] text-white rounded text-sm font-normal hover:bg-[#E55B3C]/90 transition-colors">
                    Send to Email
                  </button>
                </div>
              </div>
            </div>
            }

            
            {currentStep <= 4 && <StepNavigation />}

            {currentStep === 5 && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-gray-200 text-black rounded-lg text-base font-normal hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    {errorMessage &&
      <PopupMessage
        type="error"
        title={
          errorMessage.includes("answer")
            ? "Answer Question"
            : "Apply Job Failed"
        }
        description={errorMessage}
        onClose={() => setErrorMessage("")}
      />
    }
    </>
  );
}
