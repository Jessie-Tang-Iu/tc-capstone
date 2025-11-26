import { FileInput, Pencil, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import PopupMessage from "@/app/components/ui/PopupMessage";
import { useRouter } from "next/navigation";

export default function ApplyForm({ job, formData, setFormData, currentStep, setCurrentStep, errorMessage, setErrorMessage, onSubmit, onClose }) {

  const router = useRouter();

  const [resume, setResume] = useState(null);
  const [coverLetter, setCoverLetter] = useState(null);

  useEffect(() => {
    if (formData.user_id) {
      // Fetch resume in database
      fetch(`/api/resume/user/${formData.user_id}`)
        .then((res) => res.json())
        .then((data) => {
            setResume(data);
            // console.log("Resume: ", data);
        })
        .catch((error) => console.error('Error fetching resume:', error));
      
      // Fetch cover letter in database
      fetch(`/api/cover_letter/user/${formData.user_id}`)
        .then((res) => res.json())
        .then((data) => {
            setCoverLetter(data);
            // console.log(" CV: ", data);
        })
        .catch((error) => console.error('Error fetching cover letter: ', error));
    }
  }, [formData.user_id]);

  const handleNext = () => {
    let error = false;

    // Check resume and cover letter in step 1 
    if (currentStep == 1) {
      if (resume.error && !formData.resume_name) {
        setErrorMessage("Resume is required");
        return;
      }
      if (coverLetter.error && !formData.cover_letter_name) {
        setErrorMessage("Cover letter is required");
        return;
      }
    }

    // Check the job questions
    if (currentStep == 2) {
      if (job.questions) setCurrentStep(3);
      else setCurrentStep(4);
      return;
    }

    // Check answers in step 3
    if (currentStep == 3) {
      formData.answers.forEach(a => {
        const stripHtml = (html) => html.replace(/<[^>]*>/g, "").trim();
        if (stripHtml(a) == "") {
          setErrorMessage("Question is required to answer");
          error = true;
          return;
        } else {
          a = stripHtml(a);
        }
      })
    } 

    if ((currentStep < 5) && !error) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const normalizeDate = (d) => {
    if (!d) return null;
    if (typeof d === "string") return d.includes("T") ? d.split("T")[0] : d;
    if (d instanceof Date && !isNaN(d.getTime()))
      return d.toISOString().slice(0, 10);
    if (typeof d === "object" && typeof d.date === "string")
      return d.date.includes("T") ? d.date.split("T")[0] : d.date;
    return null;
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
        <h2 className="text-base font-bold text-black mb-2">{job.title}</h2>
        <p className="text-sm font-normal text-gray-600 mb-2">{job.company}</p>
        <p className="text-sm font-normal text-black">
          {job.location} · ${job.salary_per_hour} per hour · {job.type} ·{" "}
          {job.workplace} · {normalizeDate(job.posted_at)}
        </p>
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
          className="px-6 py-3 bg-white text-[#E55B3C] rounded-lg text-sm font-normal hover:bg-gray-50 transition-colors border-1 border-gray-200"
        >
          {"< Back Step"}
        </button>
      )}
      <button
        onClick={currentStep === 4 ? onSubmit : handleNext}
        className="px-6 py-3 bg-[#E55B3C] text-white rounded-lg text-sm font-normal hover:bg-[#d14f32] transition-colors"
      >
        {currentStep === 4 ? "Submit >" : "Next Step >"}
      </button>
    </div>
  );

  const ResumeCard = ({ type = "resume", file }) => {
    if (type == "cover_letter") { const cvContent = file.content.split('\\n'); }
    return (file && !file.error) && (
    <div className="w-full h-115 max-w-sm rounded-2xl bg-white">
      <div className="w-full flex px-2 py-2 justify-center bg-[#E55B3C]/90 rounded-t-2xl">
        <div className="text-white text-base font-bold mt-2 ml-2 flex-3">Database {type == "resume" ? "Resume" : "Cover Letter"}</div>
        <button  
          className="text-white hover:bg-[#d14f32] py-2 px-2 rounded-full transition-colors"
          aria-label="Modify Item"
          onClick={() => router.push(`/profile?tab=profile`)}
        >
          <Pencil size={20} className="w-5 h-5" /> 
        </button>
      </div>
        <div className="px-4 py-2">
          <div className="text-center">
            <div className="text-sm font-medium text-black mb-1">
              {file.first_name} {file.last_name}
            </div>
            <p className="text-xs font-medium text-black mb-2">{file.email}</p>
          </div>
          <div className="text-sm text-gray-500 leading-relaxed h-85 overflow-y-auto">
              {type === "resume" ? (
                <>
                  <div>
                    <b className="text-xs">Summary: </b>
                    <p className="text-xs pl-5 pt-1">{file.summary}</p>
                  </div>

                  <div className="mt-2 text-xs">
                    <b>Education: </b>
                    <ul className="pl-5 pt-1">
                      {file.education.map((edu, index) => {
                        let eduSplit = edu.split(' | ');
                        return(
                          <li key={index}>{`${eduSplit[1]} in ${eduSplit[2]} from ${eduSplit[0]} (${eduSplit[3]}-${eduSplit[4]})`}</li>
                        );
                      })}
                    </ul>
                  </div>

                  <div className="mt-2 text-xs">
                    <b>Certification: </b>
                    <div className="pl-5 pt-1">
                    {file.certifications.map((crt, index) => 
                      <span
                        key={index}
                        className="mr-2 px-2 py-1 bg-gray-200 rounded font-normal text-black"
                      >
                        {crt}
                      </span>
                    )}
                    </div>
                  </div>

                  <div className="mt-2 text-xs">
                    <b>Skills: </b>
                    <div className="pl-5 pt-1">
                    {file.skills.map((skill, index) => 
                      <span
                        key={index}
                        className="mr-2 px-2 py-1 bg-gray-200 rounded font-normal text-black"
                      >
                        {skill}
                      </span>
                    )}
                    </div>
                  </div>

                  <div className="mt-2 text-xs">
                    <b>Experience: </b>
                    <ul className="pl-5 pt-1">                   
                      {file.experience.map((exp, index) => {
                        let expSplit = exp.split(' | ');
                        let experience = "";
                        if (expSplit[5] == "" && expSplit[6] == "") {
                          experience = `${expSplit[0]} (${expSplit[2]}) at ${expSplit[1]} (from ${expSplit[3]}-${expSplit[4]})`
                        } else {
                          experience = `${expSplit[0]} (${expSplit[2]}) at ${expSplit[1]} (from ${expSplit[3]}-${expSplit[4]} to ${expSplit[5]}-${expSplit[6]})`
                        }
                        return (<li key={index}>{experience}</li>);
                      })}
                    </ul>
                  </div>

                  <div className="mt-2 text-xs">
                  <b>Additional information: </b>
                   <p className="pl-5 pt-1">{file.additional_info}</p>
                  </div>
                </>
            ) : (
              <div 
                dangerouslySetInnerHTML={{ __html: file.content }} 
                className="text-xs pt-1 leading-relaxed"
              />
            )}
          </div>
        </div>
    </div>
  )};

  const UploadArea = ({ type }) => {
    const localFileInputRef = useRef(null);

    const handleFileChange = (e) => {
      const uploadedFile = e.target.files?.[0] || null;
      if (uploadedFile) {
        const reader = new FileReader();
        reader.readAsDataURL(uploadedFile);
        // Run file reader
        reader.onload = (event) => {
          const base64Data = event.target.result.split(',')[1]; // Get only the Base64 part
          setFormData({ ...formData, [`${type}_name`]: uploadedFile.name, [`${type}_data`]: base64Data});
        }
      }
    }

    return (
    <div 
      className="w-full h-20 max-w-sm border border-gray-300 rounded-2xl p-4 bg-white cursor-pointer"
      onClick={() => localFileInputRef.current.click() }
    >
      <div className="text-center">
        <div className="text-[#E55B3C] text-sm font-bold mb-2">
          Upload New {type == "resume" ? "Resume" : "Cover Letter"}
        </div>
        {!formData[`${type}_name`] && <div className="text-xs  text-gray-500">File types: PDF, DOCS, TXT</div>}
      </div>
      <input 
        type="file"
        ref={localFileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".pdf,.doc,.docx"
      />
      {formData[`${type}_name`] && formData[`${type}_data`] && (
        <div className="mt-2 text-center text-xs text-gray-700">
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
              <h1 className="text-xl font-bold text-black mb-5">
                Upload Resume/ Cover Letter
              </h1>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Resume Section */}
                <div className="flex justify-center">
                  <div className="space-y-6">
                    <ResumeCard type="resume" file={resume} />
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
                <h1 className="text-xl font-bold text-black mb-5">
                  Relative Information
                </h1>

                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs text-gray-700 font-medium mb-1">
                        First Name:
                      </label>
                      <input
                        type="text"
                        value={formData.relative_first_name}
                        onChange={(e) => setFormData({ ...formData, relative_first_name: e.target.value })}
                        className="w-full bg-white rounded-md border border-gray-300 px-3 py-2 text-sm text-black outline-none focus:ring-2 focus:ring-gray-200"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-700 font-medium mb-1">
                        Last Name:
                      </label>
                      <input
                        type="text"
                        value={formData.relative_last_name}
                        onChange={(e) =>  setFormData({ ...formData, relative_last_name: e.target.value })}
                        className="w-full bg-white rounded-md border border-gray-300 px-3 py-2 text-sm text-black outline-none focus:ring-2 focus:ring-gray-200"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs text-gray-700 font-medium mb-1">
                        Email:
                      </label>
                      <input
                        type="email"
                        value={formData.relative_email}
                        onChange={(e) => setFormData({ ...formData, relative_email: e.target.value })}
                        className="w-full bg-white rounded-md border border-gray-300 px-3 py-2 text-sm text-black outline-none focus:ring-2 focus:ring-gray-200"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-700 font-medium mb-1">
                        Phone Number:
                      </label>
                      <input
                        type="tel"
                        value={formData.relative_phone}
                        onChange={(e) => setFormData({ ...formData, relative_phone: e.target.value })}
                        className="w-full bg-white rounded-md border border-gray-300 px-3 py-2 text-sm text-black outline-none focus:ring-2 focus:ring-gray-200"
                      />
                    </div>
                  </div>
                </div>
              </div>
            }

            {/* Step 3: Additional Questions */}
            {currentStep === 3 && job.questions && 
              <div className="max-w-4xl mx-auto">
                <h1 className="text-xl font-bold text-black mb-5">Additional Questions</h1>
                <div className="space-y-4">
                  {job.questions.map((question, index) => (
                    <div key={index}>
                      <label className="block text-xs text-gray-700 font-medium mb-1">{question}</label>
                      <input
                        type="text"
                        value={formData.answers[index]}
                        onChange={(e) => {
                          const updatedAnswers = [...formData.answers];
                          updatedAnswers[index] = e.target.value;
                          setFormData({ ...formData, answers: updatedAnswers });
                        }}
                        className="w-full bg-white rounded-md border border-gray-300 px-3 py-2 text-sm text-black outline-none focus:ring-2 focus:ring-gray-200"
                      />
                    </div>
                  ))}
                </div>
              </div>
            }
          
            {/* Step 4: Review Application */}
            {currentStep === 4 &&
            <div className="max-w-4xl mx-auto">
              <div className="mb-5">
                  <h1 className="text-xl font-bold text-black mb-1">Review your application</h1>
                  <p className="text-sm text-gray-600">The employer will receive a copy of your profile.</p>
              </div>

              <div className="space-y-5">
                {/* Resume */}
                <div>
                  <div className="flex justify-between items-center">
                    <h2 className="flex w-30 text-base font-bold text-black">Resume</h2>
                    {formData.resume_name && (
                      <div className="flex-1 items-center gap-2 mr-4">
                        <span className="inline-flex items-center justify-center py-1 mr-2 px-2 rounded bg-orange-100 text-[#E55B3C] text-xs font-bold">{formData.resume_name.split('.').pop().toUpperCase()}</span>
                        <span className="text-xs text-black bg-white px-2 py-1 font-bold rounded truncate">{formData.resume_name}</span>
                      </div>
                    )} 
                    <button 
                      className="text-[#E55B3C] text-sm font-bold hover:bg-gray-300 rounded px-2 py-1 transition"
                      onClick={() => setCurrentStep(1)}
                    >Edit</button> 
                  </div>
                  { !formData.resume_name && 
                    <div className="flex justify-center pt-2">
                      <ResumeCard type="resume" file={resume} /> 
                    </div>
                  }
                </div>

                {/* Cover Letter */}
                <div>
                  <div className="flex justify-between items-center">
                    <h2 className="flex w-30 text-base font-bold text-black">Cover Letter</h2>
                    {formData.cover_letter_name && (
                      <div className="flex-1 items-center gap-2 mr-4">
                        <span className="inline-flex items-center justify-center py-1 mr-2 px-2 rounded bg-orange-100 text-[#E55B3C] text-xs font-bold">{formData.cover_letter_name.split('.').pop().toUpperCase()}</span>
                        <span className="text-xs text-black bg-white px-2 py-1 font-bold rounded truncate">{formData.cover_letter_name}</span>
                      </div>
                    )}
                    <button 
                      className="text-[#E55B3C] text-sm font-bold hover:bg-gray-300 rounded px-2 py-1 transition"
                      onClick={() => setCurrentStep(1)}
                    >Edit</button>
                  </div>
                  { !formData.cover_letter_name &&
                    <div className="flex justify-center pt-2">
                      <ResumeCard type="coverLetter" file={coverLetter} />
                    </div>
                  }
                </div>

                {/* Contact Info */}
                {formData.relative_first_name != "" &&
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-base font-bold text-black">Relative information</h2>
                    <button 
                      className="text-[#E55B3C] text-sm font-bold hover:bg-gray-300 rounded px-2 py-1 transition"
                      onClick={() => setCurrentStep(2)}
                    >Edit</button>
                  </div>
                  <div className="bg-white px-4 py-2 rounded-lg border border-gray-200">
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
                {job.questions && (
                <div>
                  <div className="flex justify-between items-center">
                    <h2 className="text-base font-bold text-black">Additional Questions</h2>
                    <button 
                      className="text-[#E55B3C] text-sm font-bold hover:bg-gray-300 rounded px-2 py-1 transition"
                      onClick={() => setCurrentStep(3)}
                    >Edit</button>
                  </div>
                  <div className="space-y-4 bg-white px-4 py-2 mt-2 rounded-lg border border-gray-200">
                    {job.questions.map((question, index) => (
                      <div key={index}>
                        <div className="text-gray-500 font-bold text-xs">{question}</div>
                        <div className="text-black font-medium text-xs">{formData.answers[index]}</div>
                      </div>
                    ))}
                  </div>
                </div>)}
              </div>
            </div>
            }

            {/* Step 5: Submitted */}
            {currentStep === 5 && 
            <div className="max-w-2xl mx-auto">
              <div className="bg-white border border-gray-400 rounded-lg p-6 text-center">
                <h1 className="text-xl font-bold text-black mb-6">Application Submitted</h1>
                    
                <div className="text-left text-xs text-black space-y-3 mb-6">
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
                  <button className="px-4 py-2 bg-[#E55B3C] text-white rounded text-xs font-medium hover:bg-[#E55B3C]/90 transition-colors">
                    Save as PDF
                  </button>
                  <button className="px-4 py-2 bg-[#E55B3C] text-white rounded text-xs font-medium hover:bg-[#E55B3C]/90 transition-colors">
                    Send to Email
                  </button>
                </div>
              </div>
            </div>
            }

            
            {currentStep <= 4 && <StepNavigation />}

            {currentStep === 5 && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-200 text-black rounded-lg text-sm font-normal hover:bg-gray-300 transition-colors"
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
