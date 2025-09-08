import { ChevronDown } from "lucide-react";

export default function ProfileSection({ formData, setFormData }) {

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="space-y-8 ">
            {/* Basic Information */}
            <section>
                <h2 className="text-xl md:text-2xl font-bold text-black mb-6">Basic Information</h2>
              
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-base md:text-lg font-normal text-black mb-2">First name*</label>
                        <input
                            type="text"
                            value={formData.firstName}
                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                            className="w-full px-4 py-2 text-black bg-white rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                    <div>
                        <label className="block text-base md:text-lg font-normal text-black mb-2">Country/Region</label>
                        <input
                            type="text"
                            value={formData.countryRegion}
                            onChange={(e) => handleInputChange('countryRegion', e.target.value)}
                            placeholder="Ex: Canada"
                            className="w-full px-4 py-2 text-black bg-white rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-base md:text-lg font-normal text-black mb-2">Last name*</label>
                        <input
                            type="text"
                            value={formData.lastName}
                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                            className="w-full px-4 py-2 text-black bg-white rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                    <div>
                        <label className="block text-base md:text-lg font-normal text-black mb-2">City</label>
                        <input
                            type="text"
                            value={formData.city}
                            onChange={(e) => handleInputChange('city', e.target.value)}
                            placeholder="Ex: London, Ontario"
                            className="w-full px-4 py-2 text-black bg-white rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-base md:text-lg font-normal text-black mb-2">Preferred name</label>
                        <input
                            type="text"
                            value={formData.preferredName}
                            onChange={(e) => handleInputChange('preferredName', e.target.value)}
                            className="w-full px-4 py-2 text-black bg-white rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                    <div>
                        <label className="block text-base md:text-lg font-normal text-black mb-2">Email</label>
                        <div className="flex items-center gap-3">
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                className="flex-1 px-4 py-2 text-black bg-white rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={formData.showEmailInProfile}
                                    onChange={(e) => handleInputChange('showEmailInProfile', e.target.checked)}
                                    className="rounded border-black"
                                />
                                <label className="text-sm text-black">Show in profile</label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-base md:text-lg font-normal text-black mb-2">Pronouns</label>
                        <input
                            type="text"
                            value={formData.pronouns}
                            onChange={(e) => handleInputChange('pronouns', e.target.value)}
                            className="w-full px-4 py-2 text-black bg-white rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                    <div>
                        <label className="block text-base md:text-lg font-normal text-black mb-2">Phone Number</label>
                        <div className="flex items-center gap-3">
                            <input
                                type="tel"
                                value={formData.phoneNumber}
                                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                                className="flex-1 px-4 py-2 text-black bg-white rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={formData.showPhoneInProfile}
                                    onChange={(e) => handleInputChange('showPhoneInProfile', e.target.checked)}
                                    className="rounded border-black"
                                />
                                <label className="text-sm text-black">Show in profile</label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-base md:text-lg font-normal text-black mb-2">Headline*</label>
                    <textarea
                        value={formData.headline}
                        onChange={(e) => handleInputChange('headline', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 text-black bg-white rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <div className="text-right text-sm text-gray-500 mt-1">
                        {formData.headline.length} / 500
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-base md:text-lg font-normal text-black mb-2">Website</label>
                        <input
                            type="url"
                            value={formData.website}
                            onChange={(e) => handleInputChange('website', e.target.value)}
                            className="w-full px-4 py-2 text-black bg-white rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                    <div>
                        <label className="block text-base md:text-lg font-normal text-black mb-2">Link text</label>
                        <input
                            type="text"
                            value={formData.linkText}
                            onChange={(e) => handleInputChange('linkText', e.target.value)}
                            placeholder="Customize how your link will appear (optional)"
                            className="w-full px-4 py-2 text-black bg-white rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                </div>
            </section>

            <hr className="border-gray-300" />

            {/* Current Position */}
            <section>
                <h2 className="text-xl md:text-2xl font-bold text-black mb-6">Current Position</h2>
                
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-base md:text-lg font-normal text-black mb-2">Industry*</label>
                        <input
                            type="text"
                            value={formData.industry}
                            onChange={(e) => handleInputChange('industry', e.target.value)}
                            className="w-full px-4 py-2 text-black bg-white rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                    <div>
                        <label className="block text-base md:text-lg font-normal text-black mb-2">Title*</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            placeholder="Ex: Retail Sales Manager"
                            className="w-full px-4 py-2 text-black bg-white rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-base md:text-lg font-normal text-black mb-2">Employment type</label>
                        <div className="relative">
                            <select
                                value={formData.employmentType}
                                onChange={(e) => handleInputChange('employmentType', e.target.value)}
                                className="w-full px-4 py-2 text-black bg-white rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
                            >
                                <option value="Permanent Full-time">Permanent Full-time</option>
                                <option value="Permanent Part-time">Permanent Part-time</option>
                                <option value="Contract">Contract</option>
                                <option value="Temporary">Temporary</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-black pointer-events-none" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-base md:text-lg font-normal text-black mb-2">Company or organization*</label>
                        <input
                            type="text"
                            value={formData.company}
                            onChange={(e) => handleInputChange('company', e.target.value)}
                            placeholder="Ex: Google"
                            className="w-full px-4 py-2 text-black bg-white rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                </div>

                <div className="mb-6">
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={formData.currentlyWorking}
                            onChange={(e) => handleInputChange('currentlyWorking', e.target.checked)}
                            className="rounded border-black"
                        />
                        <label className="text-sm text-black">Currently working in this role</label>
                    </div>
                </div>

                <div className="grid md:grid-cols-4 gap-4 mb-6">
                    <div>
                        <label className="block text-base md:text-lg font-normal text-black mb-2">Start date*</label>
                        <div className="relative">
                            <select
                                value={formData.startMonth}
                                onChange={(e) => handleInputChange('startMonth', e.target.value)}
                                className="w-full px-4 py-2 text-black bg-white rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
                            >
                                <option value="March">March</option>
                                <option value="January">January</option>
                                <option value="February">February</option>
                                <option value="April">April</option>
                                <option value="May">May</option>
                                <option value="June">June</option>
                                <option value="July">July</option>
                                <option value="August">August</option>
                                <option value="September">September</option>
                                <option value="October">October</option>
                                <option value="November">November</option>
                                <option value="December">December</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-black pointer-events-none" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-gray-400 text-base md:text-lg mb-2">Year</label>
                        <div className="relative">
                            <select
                                value={formData.startYear}
                                onChange={(e) => handleInputChange('startYear', e.target.value)}
                                className="w-full px-4 py-2 text-black bg-white rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
                            >
                                <option value="2023">2023</option>
                                <option value="2022">2022</option>
                                <option value="2024">2024</option>
                                <option value="2025">2025</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-black pointer-events-none" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-base md:text-lg font-normal text-black mb-2">End date*</label>
                        <div className="relative">
                            <select
                                value={formData.endMonth}
                                onChange={(e) => handleInputChange('endMonth', e.target.value)}
                                className="w-full px-4 py-2 text-black bg-white rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
                            >
                                <option value="May">May</option>
                                <option value="January">January</option>
                                <option value="February">February</option>
                                <option value="March">March</option>
                                <option value="April">April</option>
                                <option value="June">June</option>
                                <option value="July">July</option>
                                <option value="August">August</option>
                                <option value="September">September</option>
                                <option value="October">October</option>
                                <option value="November">November</option>
                                <option value="December">December</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-black pointer-events-none" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-gray-400 text-base md:text-lg mb-2">Year</label>
                        <div className="relative">
                            <select
                                value={formData.endYear}
                                onChange={(e) => handleInputChange('endYear', e.target.value)}
                                className="w-full px-4 py-2 text-black bg-white rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
                            >
                                <option value="2025">2025</option>
                                <option value="2023">2023</option>
                                <option value="2024">2024</option>
                                <option value="2026">2026</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-black pointer-events-none" />
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-base md:text-lg font-normal text-black mb-2">Location</label>
                    <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        placeholder="Ex: London, Ontario, Canada"
                        className="w-full px-4 py-2 text-black bg-white rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-base md:text-lg font-normal text-black mb-2">Description</label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        placeholder="List your major duties and successes, highlighting specific projects"
                        rows={3}
                        className="w-full px-4 py-2 text-black bg-white rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <div className="text-right text-sm text-gray-500 mt-1 max-w-3xl">
                        {formData.description.length} / 500
                    </div>
                </div>
            </section>

            <hr className="border-gray-300" />

            {/* Education */}
            <section>
                <h2 className="text-xl md:text-2xl font-bold text-black mb-6">Education</h2>
                
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-base md:text-lg font-normal text-black mb-2">School*</label>
                        <input
                            type="text"
                            value={formData.school}
                            onChange={(e) => handleInputChange('school', e.target.value)}
                            placeholder="Ex: Western University"
                            className="w-full px-4 py-2 text-black bg-white rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                    <div>
                        <label className="block text-base md:text-lg font-normal text-black mb-2">Degree</label>
                        <input
                            type="text"
                            value={formData.degree}
                            onChange={(e) => handleInputChange('degree', e.target.value)}
                            placeholder="Ex: Bachelor's"
                            className="w-full px-4 py-2 text-black bg-white rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-base font-normal text-black mb-2">Field of study</label>
                    <div className="relative w-full">
                        <select
                            value={formData.fieldOfStudy}
                            onChange={(e) => handleInputChange('fieldOfStudy', e.target.value)}
                            className="w-full px-4 py-2 text-black bg-white rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
                        >
                            <option value="">Ex: Business</option>
                            <option value="Computer Science">Computer Science</option>
                            <option value="Business">Business</option>
                            <option value="Engineering">Engineering</option>
                            <option value="Arts">Arts</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-black pointer-events-none" />
                    </div>
                </div>

                <div className="grid md:grid-cols-4 gap-4 mb-6">
                    <div>
                        <label className="block text-base md:text-lg font-normal text-black mb-2">Start date*</label>
                        <div className="relative">
                            <select
                                value={formData.eduStartMonth}
                                onChange={(e) => handleInputChange('eduStartMonth', e.target.value)}
                                className="w-full px-4 py-2 text-black bg-white rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
                            >
                                <option value="March">March</option>
                                <option value="September">September</option>
                                <option value="January">January</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-black pointer-events-none" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-gray-400 text-base md:text-lg mb-2">Year</label>
                        <div className="relative">
                            <select
                                value={formData.eduStartYear}
                                onChange={(e) => handleInputChange('eduStartYear', e.target.value)}
                                className="w-full px-4 py-2 text-black bg-white rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
                            >
                                <option value="2023">2023</option>
                                <option value="2022">2022</option>
                                <option value="2021">2021</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-black pointer-events-none" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-base md:text-lg font-normal text-black mb-2">End date</label>
                        <div className="relative">
                            <select
                                value={formData.eduEndMonth}
                                onChange={(e) => handleInputChange('eduEndMonth', e.target.value)}
                                className="w-full px-4 py-2 text-black bg-white rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
                            >
                                <option value="May">May</option>
                                <option value="June">June</option>
                                <option value="April">April</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-black pointer-events-none" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-gray-400 text-base md:text-lg mb-2">Year</label>
                        <div className="relative">
                            <select
                                value={formData.eduEndYear}
                                onChange={(e) => handleInputChange('eduEndYear', e.target.value)}
                                className="w-full px-4 py-2 text-black bg-white rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
                            >
                                <option value="2025">2025</option>
                                <option value="2024">2024</option>
                                <option value="2026">2026</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-black pointer-events-none" />
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-base md:text-lg font-normal text-black mb-2">Description</label>
                    <textarea
                        value={formData.eduDescription}
                        onChange={(e) => handleInputChange('eduDescription', e.target.value)}
                        placeholder="List your major activities and societies, projects"
                        rows={3}
                        className="w-full px-4 py-2 text-black bg-white rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <div className="text-right text-sm text-gray-500 mt-1 max-w-3xl">
                        {formData.eduDescription.length} / 500
                    </div>
                </div>
            </section>
        </div>
    );
}