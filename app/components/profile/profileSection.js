import { useEffect, useState } from "react";

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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl md:text-2xl font-bold text-black mb-6">Basic Information</h2>
        <button 
          onClick={onSave}
          className="text-sm mb-6 px-6 py-2 bg-[#E55B3C] hover:bg-[#d14f32] font-semibold rounded-md transition duration-200 cursor-pointer focus:outline-none active:scale-95 text-white"
        >Save</button>
      </div>
          
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-base  font-normal text-black mb-2">First name*</label>
          <input
            required
            type="text"
            value={profile.first_name}
            onChange={(e) => handleProfileChange('first_name', e.target.value)}
            className="w-full h-10 px-4 py-2 text-black bg-white rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E55B3C]"
          />
        </div>
        <div>
          <label className="block text-base  font-normal text-black mb-2">Last name*</label>
          <input
            required
            type="text"
            value={profile.last_name}
            onChange={(e) => handleProfileChange('last_name', e.target.value)}
            className="w-full h-10 px-4 py-2 text-black bg-white rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E55B3C]"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-base  font-normal text-black mb-2">Preferred name</label>
          <input
            type="text"
            value={profile.preferred_name}
            onChange={(e) => handleProfileChange('preferred_name', e.target.value)}
            className="w-full h-10 px-4 py-2 text-black bg-white rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E55B3C]"
          />
        </div>
        <div>
          <label className="block text-base  font-normal text-black mb-2">Pronouns</label>
          <select
            value={profile.pronouns}
            onChange={(e) => handleProfileChange('pronouns', e.target.value)}
            className="w-full h-10 px-4 py-2 text-black bg-white rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E55B3C]"
          >
            <option value="She/Her/Hers">She/Her/Hers</option>
            <option value="He/Him/His">He/Him/His</option>
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-base  font-normal text-black mb-2">Email*</label>
          <input
            required
            type="text"
            value={profile.email}
            onChange={(e) => handleProfileChange('email', e.target.value)}
            className="w-full h-10 px-4 py-2 text-black bg-white rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E55B3C]"
          />
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
          <label className="block text-base  font-normal text-black mb-2">Phone Number</label>
          <input
            type="tel"
            value={profile.phone}
            onChange={(e) => handleProfileChange('phone', e.target.value)}
            className="w-full h-10 px-4 py-2 text-black bg-white rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E55B3C]"
          />
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

      <div className="mb-6">
        <label className="block text-base  font-normal text-black mb-2">Address</label>
        <input
          value={address.address1}
          onChange={(e) => handleAddressChange('address1', e.target.value)}
          placeholder="Ex: 1301 16 Avenue NW"
          className="w-full h-10 px-4 py-2 text-black bg-white rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E55B3C]"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-base  font-normal text-black mb-2">City</label>
          <input
            type="text"
            value={address.city}
            onChange={(e) => handleAddressChange('city', e.target.value)}
            placeholder="Ex: Calgary, Alberta"
            className="w-full h-10 px-4 py-2 text-black bg-white rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E55B3C]"
          />
        </div>
        <div>
          <label className="block text-base  font-normal text-black mb-2">Country/Region</label>
          <div className="flex items-center gap-3">
            <input
              type="email"
              value={address.country}
              onChange={(e) => handleAddressChange('country', e.target.value)}
              placeholder="Ex: Canada"
              className="flex-1 h-10 px-4 py-2 text-black bg-white rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E55B3C]"
            />
          </div>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-base  font-normal text-black mb-2">Website</label>
        <input
          type="url"
          value={profile.link}
          onChange={(e) => handleProfileChange('link', e.target.value)}
          className="w-full h-10 px-4 py-2 text-black bg-white rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E55B3C]"
        />
      </div>
    </div>
  );
}