import React from "react";
import Button from "../ui/Button";

export default function SearchBar({
    query, onQueryChange,
    location, onLocationChange,
    experience, onExperienceChange,
    workplace, onWorkplaceChange,
    onSearch, onAdvancedSearch
}) {
    return (
        <div className="w-full max-w-6xl mx-auto px-4 py-6">
            {/* Desktop Search Bar */}
            <div className="hidden md:flex items-center  h-11 overflow-hidden">
                <div className="flex items-center flex-1 h-full bg-white border border-black rounded-lg">
                {/* Keyword Field */}
                <div className="flex-3 px-4 py-3 min-w-0">
                    <input
                        type="text"
                        value ={query}
                        onChange={(e) => onQueryChange(e.target.value)}
                        placeholder="Search by title or company"
                        className="w-full text-sm xl:text-base font-normal text-black placeholder-black border-none outline-none bg-transparent"
                    />
                </div>

                {/* Divider */}
                <div className="w-px h-9 bg-gray-200"></div>

                {/* Location Field */}
                <div className="flex-1 px-4 py-3 min-w-0">
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => onLocationChange(e.target.value)}
                        placeholder="Location"
                        className="w-full text-sm xl:text-base font-normal text-black placeholder-black border-none outline-none bg-transparent"
                    />
                </div>

            </div>

                {/* Search Button */}
                <button 
                    className="flex mx-2 bg-[#E55B3C] hover:bg-[#d14f32] font-semibold ml-4 px-6 py-2 rounded-md transition duration-200 ease-in-out cursor-pointer focus:outline-none active:scale-95 text-white"
                    onClick={onSearch}
                >
                    Search
                </button>

                {/* Advanced Search Button */}
                <button 
                    className="flex mx-2 bg-[#E55B3C] hover:bg-[#d14f32] font-semibold px-6 py-2 rounded-md transition duration-200 ease-in-out cursor-pointer focus:outline-none active:scale-95 text-white"
                    onClick={onAdvancedSearch}
                >
                    Advanced Search
                </button>

            </div>

            {/* Mobile Search Bar */}
            <div className="md:hidden space-y-3">
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value ={query}
                        onChange={(e) => onQueryChange(e.target.value)}
                        placeholder="Search by title or company"
                        className="flex-1 px-4 py-3 text-base font-normal text-black placeholder-black border border-black rounded-lg outline-none"
                    />
                </div>
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => onLocationChange(e.target.value)}
                        placeholder="Location"
                        className="flex-1 px-4 py-3 text-base font-normal text-black placeholder-black border border-black rounded-lg outline-none"
                    />
                </div>

                {/* Button */}
                <div className="flex space-x-2">
                    <button 
                        className="flex-1 bg-[#E55B3C] hover:bg-[#d14f32] font-semibold px-6 py-2 rounded-md transition duration-200 ease-in-out cursor-pointer focus:outline-none active:scale-95 text-white" 
                        onClick={onSearch}
                    >
                        Search
                    </button>
                    <button 
                        className="flex-1 bg-[#E55B3C] hover:bg-[#d14f32] font-semibold px-6 py-2 rounded-md transition duration-200 ease-in-out cursor-pointer focus:outline-none active:scale-95 text-white" 
                        onClick={onAdvancedSearch}
                    >
                        Advanced Search
                    </button>
                </div>
            </div>
        </div>
    );
}
