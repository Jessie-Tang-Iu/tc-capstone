import { User, Lock, Shield, Bell, ChevronDown } from "lucide-react";

export default function Security({ formData, setFormData }) {

    const passwordRequirements = [
        { text: "8 characters", met: false },
        { text: "Uppercase letters (A-Z)", met: false },
        { text: "Lowercase letters (a-z)", met: true },
        { text: "Numbers (0-9)", met: true },
        { text: "Special characters (! @ # $ % ^ & * ( ) - _ + =)", met: false }
    ];
    
    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="space-y-8 px-5 h-[calc(100vh-180px)] md:h-[calc(100vh-240px)] overflow-y-auto">
            {/* Email Accesses */}
            <section>
                <h2 className="text-xl md:text-2xl font-bold text-black mb-6">Email accesses</h2>
                <div className="space-y-4">
                    {formData.emails.map((item, index) => (
                        <div key={index} className="flex items-center gap-4">
                            <input
                                type="email"
                                value={item.email}
                                readOnly
                                className="flex-1 px-4 py-2 text-black bg-white rounded-lg border border-gray-300"
                            />
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={item.isPrimary}
                                    onChange={(e) => {
                                        const newEmails = [...formData.emails];
                                        newEmails[index].isPrimary = e.target.checked;
                                        setFormData(prev => ({ ...prev, emails: newEmails }));
                                    }}
                                    className="rounded border-black"
                                />
                                <label className="text-sm text-black">Set as primary</label>
                            </div>
                        </div>
                    ))}
                </div>
                <button className="mt-4 px-6 py-2 bg-orange-200 text-black rounded-lg text-sm font-normal hover:bg-orange-300 transition-colors">
                    Add new email
                </button>
            </section>

            <hr className="border-gray-300" />

            {/* Phone Accesses */}
            <section>
                <h2 className="text-xl md:text-2xl font-bold text-black mb-6">Phone accesses</h2>
                <div className="space-y-4">
                    {formData.phones.map((item, index) => (
                        <div key={index} className="flex items-center gap-4">
                            <input
                                type="tel"
                                value={item.phone}
                                readOnly
                                className="flex-1 px-4 py-2 text-black bg-white rounded-lg border border-gray-300"
                            />
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={item.isPrimary}
                                    onChange={(e) => {
                                        const newPhones = [...formData.phones];
                                        newPhones[index].isPrimary = e.target.checked;
                                        setFormData(prev => ({ ...prev, phones: newPhones }));
                                    }}
                                    className="rounded border-black"
                                />
                                <label className="text-sm text-black">Set as primary</label>
                            </div>
                        </div>
                    ))}
                </div>
                <button className="mt-4 px-6 py-2 bg-orange-200 text-black rounded-lg text-sm font-normal hover:bg-orange-300 transition-colors">
                    Add new phone
                </button>
            </section>

            <hr className="border-gray-300" />

            {/* Change Password */}
            <section>
                <h2 className="text-xl md:text-2xl font-bold text-black mb-6">Change password</h2>
                <p className="text-sm text-black mb-6">All devices will automatically sign-out after password is saved</p>
                
                <div className="space-y-6 max-w-md">
                    <div>
                        <label className="block text-base md:text-lg font-normal text-black mb-2">Current password*</label>
                        <div className="relative">
                            <input
                                type="password"
                                value={formData.currentPassword}
                                onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                                placeholder="current password"
                                className="w-full px-4 py-2 rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E55B3C]"
                            />
                            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#E55B3C] text-sm font-bold">
                                Show
                            </button>
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-base md:text-lg font-normal text-black mb-2">New password*</label>
                        <div className="relative">
                            <input
                                type="password"
                                value={formData.newPassword}
                                onChange={(e) => handleInputChange('newPassword', e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E55B3C]"
                            />
                            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#E55B3C] text-sm font-bold">
                                Show
                            </button>
                        </div>
                    </div>

                    <div className="text-sm space-y-1">
                        {passwordRequirements.map((req, index) => (
                            <div key={index} className={`${req.met ? 'text-green-600' : 'text-red-600'}`}>
                                {req.text}
                            </div>
                        ))}
                    </div>

                    <div>
                        <label className="block text-base md:text-lg font-normal text-black mb-2">Retype</label>
                        <div className="relative">
                            <input
                                type="password"
                                value={formData.retypePassword}
                                onChange={(e) => handleInputChange('retypePassword', e.target.value)}
                                placeholder="retype"
                                className="w-full px-4 py-2 rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E55B3C]"
                            />
                            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#E55B3C] text-sm font-bold">
                                Show
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}