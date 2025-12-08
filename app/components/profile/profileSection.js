import { useEffect, useState } from "react";
import InputField from "./inputField";

export default function Profile({profile, setProfile, onSave}) {
  // console.log("Profile Data: ", profile);

  const addressSplit = profile?.address ? profile.address.split(' | ') : [];
  const [address, setAddress] = useState({
    address1: addressSplit[0] || "",
    city: addressSplit[1] || "",
    country: addressSplit[2] || "",
  })

  // Update Profile

  const addressToString = (address) => {
    return `${address.address1} | ${address.city} | ${address.country}`
  }

  const handleAddressChange = (field, value) => {
    setAddress(prev => ({ ...prev, [field]: value}));
  };

  const handleProfileChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    handleProfileChange("address", addressToString(address));
  }, [address]);

  return (
    <div>
      <div className="mb-4 text-2xl font-semibold text-[#E55B3C] text-center">
        Personal Information
      </div>
          
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <InputField label="First name" value={profile.first_name} isEdit={false} />
        <InputField label="Last name" value={profile.last_name} isEdit={false} />
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <InputField 
          label="Preferred name" value={profile.preferred_name}
          onChange={(e) => handleProfileChange('preferred_name', e.target.value)}
        />
        <InputField 
          type="select" options={["Select pronouns", "She/Her/Hers", "He/Him/His"]} 
          label="Pronouns" value={profile.pronouns}
          onChange={(e) => handleProfileChange('pronouns', e.target.value)}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div>
          <InputField label="Email" value={profile.email} isEdit={false} />
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              checked={profile.show_email}
              onChange={(e) => handleProfileChange('show_email', e.target.checked)}
              className="rounded border-black"
            />
            <label className="text-sm text-black">Show in profile</label>
          </div>
        </div>
        <div>
          <InputField label="Phone number" value={profile.phone} isEdit={false} />
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              checked={profile.show_phone}
              onChange={(e) => handleProfileChange('show_phone', e.target.checked)}
              className="rounded border-black"
            />
            <label className="text-sm text-black">Show in profile</label>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <InputField 
          label="Address" placeholder="Ex: 1301 16 Avenue NW" value={address.address1}
          onChange={(e) => handleAddressChange('address1', e.target.value)}
        />        
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <InputField 
          label="City" placeholder="Ex: Calgary, Alberta" value={address.city}
          onChange={(e) => handleAddressChange('city', e.target.value)}
        />
        <InputField
          label="Country/Region" placeholder="Ex: Canada" value={address.country}
          onChange={(e) => handleAddressChange('country', e.target.value)}
        />
      </div>

      <div className="mb-4">
        <InputField 
          label="Website" value={profile.link}
          onChange={(e) => handleProfileChange('link', e.target.value)}
        />
      </div>

      <div className="flex justify-center">
        <button 
          className="text-sm px-6 py-2 bg-[#E55B3C] hover:bg-[#d14f32] font-semibold rounded-md transition duration-200 cursor-pointer focus:outline-none active:scale-95 text-white"
          onClick={onSave}  
        >Save</button>
      </div>
    </div>
  );
}