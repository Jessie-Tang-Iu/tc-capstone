import { useUserContext } from "@/app/context/userContext";
import { X } from "lucide-react";
import { use, useState } from "react";

export default function ApplyForm({ job, onClose }) {

    const { user } = useUserContext();
    console.log("User in ApplyForm: ", user);

    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        resume: null,
        coverLetter: null,
        firstName: user.firstName || "",
        middleName: "",
        lastName: user.lastName || "",
        email: user.email || "",
        countryCode: "",
        phoneNumber: user.phone || "",
        address: "",
        additionalQuestions: ["", "", ""],
        applicationId: null
    });

    const handleNext = () => {
        if (currentStep < 5) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSkip = () => {
        if (currentStep < 4) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleSubmit = () => {
        setFormData(prev => ({
            ...prev,
            applicationId: "1234######"
        }));
        setCurrentStep(5);
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleQuestionChange = (index, value) => {
        setFormData(prev => ({
            ...prev,
            additionalQuestions: prev.additionalQuestions.map((q, i) => i === index ? value : q)
        }));
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
            {(currentStep > 1) && (
                <button
                    onClick={handleBack}
                    className="px-6 py-3 bg-white text-[#E55B3C] rounded-lg text-base font-normal hover:bg-gray-50 transition-colors border-1 border-gray-200"
                >
                    {"< Back Step"}
                </button>
            )}
            <button
                onClick={currentStep === 4 ? handleSubmit : handleNext}
                className="px-6 py-3 bg-[#E55B3C] text-white rounded-lg text-base font-normal hover:bg-[#d14f32] transition-colors"
            >
                {currentStep === 4 ? "Submit >" : "Next Step >"}
            </button>
        </div>
    );

    const ResumeCard = ({ type = "resume", title = "Previous Resume" }) => (
        <div className="w-full h-100 max-w-sm border border-black rounded-2xl p-4 bg-white">
            <div className="text-[#E55B3C] text-base font-bold mb-3">{title}</div>
            <hr className="border-gray-200 mb-3" />
            <div className="text-center">
                <div className="text-base font-bold text-black mb-2">{formData.firstName} {formData.lastName}</div>
                <div className="text-sm text-gray-500 leading-relaxed h-60">
                    {type === "resume" ? (
                        <>
                            {formData.email}<br />
                            {formData.phoneNumber}<br />
                            Calgary, AB<br />
                            Project Manager | AAA Company<br />
                            Intern | BBB Limited Company<br />
                            XXX | XXXXX
                        </>
                    ) : (
                        <>
                            Dear Hiring Manager,<br /><br />
                            I am excited to apply for the Web Development<br />
                            Internship at ABC Company. As a student<br />
                            currently pursuing a diploma in Software<br />
                            Development, I have gained solid experience in<br />
                            HTML / CSS / JavaScript / React through<br />
                            coursework and hands-on projects. I am .......
                        </>
                    )}
                </div>
            </div>
            <button className="w-full bg-[#E55B3C] text-white py-2 rounded text-sm font-normal hover:bg-[#E55B3C]/90 transition-colors mt-4">
                {type === "resume" ? "Edit Resume" : "Edit Cover Letter"}
            </button>
        </div>
    );

    const UploadArea = ({ type = "resume" }) => (
        <div className="w-full max-w-sm border border-gray-300 rounded-2xl p-4 bg-white">
            <div className="text-center">
                <div className="text-[#E55B3C] text-base font-bold mb-2">Upload New One</div>
                <div className="text-sm text-gray-500">File types: PDF, DOCS, TXT</div>
            </div>
        </div>
    );

    // Step 1: Upload Resume/Cover Letter
    const Step1 = () => (
        <div className="max-w-4xl mx-auto ">
            <h1 className="text-2xl font-bold text-black mb-8">Upload Resume/ Cover Letter</h1>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Resume Section */}
                <div className="space-y-6">
                    <ResumeCard type="resume" title="Previous Resume" />
                    <UploadArea type="resume" />
                </div>

                {/* Cover Letter Section */}
                <div className="space-y-6">
                    <ResumeCard type="coverLetter" title="Previous Cover Letter" />
                    <UploadArea type="coverLetter" />
                </div>
            </div>
        </div>
    );

    // Step 2: Personal Information
    const Step2 = () => (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-black mb-8">Relative Information</h1>
            
            <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-base font-normal text-black mb-2">First Name:</label>
                        <input
                            type="text"
                            value={formData.firstName}
                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                            className="w-full px-4 py-3 text-black bg-white border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E55B3C]"
                        />
                    </div>
                    <div>
                        <label className="block text-base font-normal text-black mb-2">Last Name:</label>
                        <input
                            type="text"
                            value={formData.lastName}
                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                            className="w-full px-4 py-3 text-black bg-white border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E55B3C]"
                        />
                    </div>
                </div>

                <hr className="border-gray-300" />

                {/* <div>
                    <label className="block text-base font-normal text-black mb-2">Email:</label>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full px-4 py-3 text-black bg-white border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E55B3C]"
                    />
                </div> */}

                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-base font-normal text-black mb-2">Email:</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className="w-full px-4 py-3 text-black bg-white border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E55B3C]"
                        />
                    </div>
                    <div>
                        <label className="block text-base font-normal text-black mb-2">Phone Number:</label>
                        <input
                            type="tel"
                            value={formData.phoneNumber}
                            onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                            className="w-full px-4 py-3 text-black bg-white border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E55B3C]"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-base font-normal text-black mb-2">Address:</label>
                    <textarea
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 text-black bg-white border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E55B3C]"
                    />
                </div>
            </form>
        </div>
    );

    // Step 3: Additional Questions
    const Step3 = () => (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-black mb-8">Additional Questions</h1>
            
            <div className="space-y-6">
                {formData.additionalQuestions.map((answer, index) => (
                    <div key={index}>
                        <label className="block text-base font-normal text-black mb-3">
                            How many years of work experience xxxxxxxxxxxxx?
                        </label>
                        <input
                            type="text"
                            value={answer}
                            onChange={(e) => handleQuestionChange(index, e.target.value)}
                            className="w-full px-4 py-3 text-black bg-white border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E55B3C]"
                        />
                    </div>
                ))}
            </div>
        </div>
    );

    // Step 4: Review Application
    const Step4 = () => (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-black mb-2">Review your application</h1>
                <p className="text-base text-gray-600">The employer will receive a copy of your profile.</p>
            </div>

            <div className="space-y-8">
                {/* Contact Info */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-black">Contact info</h2>
                        <button className="text-[#E55B3C] text-base font-bold hover:underline">Edit</button>
                    </div>
                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-lg font-bold text-black mb-4">{formData.firstName} {formData.lastName}</h3>
                                <div className="space-y-2 text-sm">
                                    <div>
                                        <span className="text-gray-500 font-bold">Email address</span>
                                        <div className="text-black font-bold">{formData.email}</div>
                                    </div>
                                    <div>
                                        <span className="text-gray-500 font-bold">Phone country code</span>
                                        <div className="text-black font-bold">Canada (+1)</div>
                                    </div>
                                    <div>
                                        <span className="text-gray-500 font-bold">Mobile phone number</span>
                                        <div className="text-black font-bold">{formData.phoneNumber}</div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div>
                                    <span className="text-gray-500 font-bold text-sm">Address</span>
                                    <div className="text-black font-bold text-sm">
                                        XXXX 52st XXX,XXX<br />
                                        Calgary, AB<br />
                                        Canada
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Resume */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-black">Resume</h2>
                        <button className="text-[#E55B3C] text-base font-bold hover:underline">Edit</button>
                    </div>
                    <div className="flex justify-center">
                        <ResumeCard type="resume" title="Saved Resume" />
                    </div>
                </div>

                {/* Cover Letter */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-black">Cover Letter</h2>
                        <button className="text-[#E55B3C] text-base font-bold hover:underline">Edit</button>
                    </div>
                    <div className="flex justify-center">
                        <ResumeCard type="coverLetter" title="Saved Cover Letter" />
                    </div>
                </div>

                {/* Additional Questions */}
                <div>
                    <h2 className="text-lg font-bold text-black mb-4">Additional questions</h2>
                    <div className="space-y-4 bg-white p-6 rounded-lg border border-gray-200">
                        <div>
                            <div className="text-gray-500 font-bold text-sm">How many years of work experience xxxxxxxxxxxxx?</div>
                            <div className="text-black font-bold text-sm">3+ years</div>
                        </div>
                        <div>
                            <div className="text-gray-500 font-bold text-sm">QuestionQuestionQuestionQuestionQuestionQuestion?</div>
                            <div className="text-black font-bold text-sm">texttexttexttexttexttexttexttexttexttext</div>
                        </div>
                        <div>
                            <div className="text-gray-500 font-bold text-sm">QuestionQuestionQuestionQuestionQuestionQuestion?</div>
                            <div className="text-black font-bold text-sm">texttexttexttexttexttexttexttexttexttext</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    // Step 5: Application Submitted
    const Step5 = () => (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white border border-gray-400 rounded-lg p-8 text-center">
                <h1 className="text-2xl font-bold text-black mb-4">Application Submitted</h1>
                <p className="text-sm text-black mb-6">no: {formData.applicationId}</p>
                
                <div className="text-left text-sm text-black space-y-4 mb-8">
                    <p>Your application has been submitted!</p>
                    
                    <div>
                        <p><strong>Position:</strong> Web Development Internship</p>
                        <p><strong>Company:</strong> ABC Company</p>
                        <p><strong>Location:</strong> Calgary, AB (Remote)</p>
                        <p><strong>Wage:</strong> $30–$35/hour · Full-time</p>
                    </div>
                    
                    <p>We hve successfully received your application.</p>
                    <p>Our team will review your submission, and if selected, you will be contacted by email for the next steps.</p>
                    
                    <p>For questions, please contact: <strong>support@techconnectalberta.ca</strong></p>
                    <p>Your application ID: <strong>{formData.applicationId}</strong></p>
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
    );

    return (
        <div className="absolute w-full h-full bg-gray-700/60 flex items-center justify-center z-10 ">
            <div className="fixed inset-0 bg-gray-100 z-50 overflow-y-auto">
          
                <div className="pt-20 pb-8 px-4">
                    {currentStep <= 4 && <JobHeader />}
                    {currentStep <= 4 && <ProgressBar />}
                    
                    <div className="container mx-auto">
                    {currentStep === 1 && <Step1 />}
                    {currentStep === 2 && <Step2 />}
                    {currentStep === 3 && <Step3 />}
                    {currentStep === 4 && <Step4 />}
                    {currentStep === 5 && <Step5 />}
                    
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
    );
};