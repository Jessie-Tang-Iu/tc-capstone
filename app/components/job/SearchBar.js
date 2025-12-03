import React from "react";
import Button from "../ui/Button";

export default function SearchBar({
    query, onQueryChange,
    location, onLocationChange,
    onSearch, onAdvancedSearch
}) {
    return (
        <div className="w-full max-w-6xl mx-auto px-4 py-6">
            {/* Desktop Search Bar */}
            <div className="hidden md:flex items-center h-11 overflow-hidden">
                <div 
                    className="flex items-center flex-1 h-full rounded-md border border-gray-300 bg-white px-3 py-2
                             text-black outline-none focus:ring-2 focus:ring-gray-200"
                >
                    {/* Keyword Field */}
                    <div className="flex-3 px-4 py-3 min-w-0">
                        <input
                            type="text"
                            value ={query}
                            onChange={(e) => onQueryChange(e.target.value.toLowerCase())}
                            placeholder="Search by title or company"
                            className="w-full text-base font-normal text-black placeholder:text-gray-500 placeholder:opacity-100 border-none outline-none bg-transparent"
                        />
                    </div>

                    {/* Divider */}
                    <div className="w-px h-9 bg-gray-200"></div>

                    {/* Location Field */}
                    <div className="flex-1 px-4 py-3 min-w-0">
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => onLocationChange(e.target.value.toLowerCase())}
                            placeholder="Location"
                            className="w-full text-base font-normal text-black placeholder:text-gray-500 placeholder:opacity-100 border-none outline-none bg-transparent"
                        />
                    </div>

                </div>

                {/* Search Button */}
                <button 
                    className="flex mx-2 bg-[#E55B3C] hover:bg-[#d14f32] text-base font-semibold ml-4 px-6 py-2 rounded-md transition duration-200 ease-in-out cursor-pointer focus:outline-none active:scale-95 text-white"
                    onClick={onSearch}
                >
                    Search
                </button>

                {/* Advanced Search Button */}
                <button 
                    className="flex mx-2 bg-[#E55B3C] hover:bg-[#d14f32] text-base font-semibold px-6 py-2 rounded-md transition duration-200 ease-in-out cursor-pointer focus:outline-none active:scale-95 text-white"
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
                        className="flex-1 px-4 py-3 rounded-md border border-gray-300 bg-white text-base text-black outline-none focus:ring-2 focus:ring-gray-200"
                    />
                </div>
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => onLocationChange(e.target.value)}
                        placeholder="Location"
                        className="flex-1 px-4 py-3 rounded-md border border-gray-300 bg-white text-base text-black outline-none focus:ring-2 focus:ring-gray-200"
                    />
                </div>

                {/* Button */}
                <div className="flex space-x-2">
                    <button 
                        className="flex-1 bg-[#E55B3C] hover:bg-[#d14f32] text-base font-semibold px-6 py-2 rounded-md transition duration-200 ease-in-out cursor-pointer focus:outline-none active:scale-95 text-white" 
                        onClick={onSearch}
                    >
                        Search
                    </button>
                    <button 
                        className="flex-1 bg-[#E55B3C] hover:bg-[#d14f32] text-base font-semibold px-6 py-2 rounded-md transition duration-200 ease-in-out cursor-pointer focus:outline-none active:scale-95 text-white" 
                        onClick={onAdvancedSearch}
                    >
                        Advanced Search
                    </button>
                </div>
            </div>
        </div>
    );
}
