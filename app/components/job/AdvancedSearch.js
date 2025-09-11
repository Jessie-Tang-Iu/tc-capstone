"use client";

import React, { useState } from 'react';
import { X } from "lucide-react";
import jobFilters from "../../data/filterForJob.json";

export default function AdvancedSearch({ filters, setFilters, onClose }) {

    const handleFilterChange = (field, value) => {
        if (field == "sortBy" || field == "datePosted") {
            setFilters(prev => ({ ...prev, [field]: value }));
        } else {
            setFilters(prev => ({ ...prev, field: append(value)}))
        }
        console.log(filters);
    };

    return (
        <div className="absolute w-full h-full bg-gray-700/60 flex items-center justify-center z-10 ">
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 mt-15">
                <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg relative">
                    {/* Header */}
                    <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                        <h2 className="text-xl font-bold text-black">Advanced search</h2>
                        <button
                            onClick={onClose}
                            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5 text-black" />
                        </button>
                    </div>

                    {/* Form Content */}
                    <div className="p-4 space-y-6">

                        {/* Sort by */}
                        <section>
                            <h3 className="text-xl font-bold text-black mb-4">Sort by</h3>
                            <div className="space-y-3">
                            <label className="flex items-center space-x-3">
                                <input
                                    type="radio"
                                    name="sortBy"
                                    value="recent"
                                    className="w-4 h-4 text-black border-black focus:ring-black"
                                />
                                <span className="text-sm font-normal text-black">Most recent</span>
                            </label>
                            <label className="flex items-center space-x-3">
                                <input
                                    type="radio"
                                    name="sortBy"
                                    value="relevant"
                                    
                                    className="w-4 h-4 text-black border-black focus:ring-black"
                                />
                                <span className="text-sm font-normal text-black">Most relevant</span>
                            </label>
                            </div>
                        </section>

                        {/* Divider */}
                        <hr className="border-gray-200" />

                        {/* Date posted */}
                        <section>
                            <h3 className="text-xl font-bold text-black mb-4">Date posted</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            <label className="flex items-center space-x-3">
                                <input
                                type="radio"
                                name="datePosted"
                                value="anytime"
                                className="w-4 h-4 text-black border-black focus:ring-black"
                                />
                                <span className="text-sm font-normal text-black">Any time</span>
                            </label>
                            <label className="flex items-center space-x-3">
                                <input
                                type="radio"
                                name="datePosted"
                                value="pastWeek"
                                className="w-4 h-4 text-black border-black focus:ring-black"
                                />
                                <span className="text-sm font-normal text-black">Past week</span>
                            </label>
                            <label className="flex items-center space-x-3">
                                <input
                                type="radio"
                                name="datePosted"
                                value="pastMonth"
                                className="w-4 h-4 text-black border-black focus:ring-black"
                                />
                                <span className="text-sm font-normal text-black">Past month</span>
                            </label>
                            <label className="flex items-center space-x-3">
                                <input
                                type="radio"
                                name="datePosted"
                                value="past24Hours"
                                className="w-4 h-4 text-black border-black focus:ring-black"
                                />
                                <span className="text-sm font-normal text-black">Past 24 hours</span>
                            </label>
                            </div>
                        </section>

                        {/* Divider */}
                        <hr className="border-gray-200" />

                        {/* Experience level */}
                        <section>
                            <h3 className="text-xl font-bold text-black mb-4">Experience level</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                {jobFilters.experience.map((experience) => (
                                    <label key={experience.id} className="flex items-center space-x-3">
                                        <input
                                            type="checkbox"
                                            name="type"
                                            value={experience.name}
                                            className="w-4 h-4 text-black border-black rounded focus:ring-black"
                                        />
                                        <span className="text-sm font-normal text-black">{`${experience.name}`}</span>
                                    </label>
                                ))}
                            </div>
                        </section>

                        {/* Divider */}
                        <hr className="border-gray-200" />

                        {/* Job type */}
                        <section>
                            <h3 className="text-xl font-bold text-black mb-4">Job type</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                {jobFilters.type.map((type) => (
                                    <label key={type.id} className="flex items-center space-x-3">
                                        <input
                                            type="checkbox"
                                            name="type"
                                            value={type.name}
                                            className="w-4 h-4 text-black border-black rounded focus:ring-black"
                                        />
                                        <span className="text-sm font-normal text-black">{`${type.name}`}</span>
                                    </label>
                                ))}
                            </div>
                        </section>

                        {/* Divider */}
                        <hr className="border-gray-200" />

                        {/* Workplace */}
                        <section>
                            <h3 className="text-xl font-bold text-black mb-4">Workplace</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                {jobFilters.workplace.map((workplace) => (
                                    <label key={workplace.id} className="flex items-center space-x-3">
                                        <input
                                            type="checkbox"
                                            name="location"
                                            value={workplace.name}
                                            className="w-4 h-4 text-black border-black rounded focus:ring-black"
                                        />
                                        <span className="text-sm font-normal text-black">{`${workplace.name}`}</span>
                                    </label>
                                ))}
                            </div>
                        </section>

                        {/* Divider */}
                        <hr className="border-gray-200" />

                        {/* Location */}
                        <section>
                            <h3 className="text-xl font-bold text-black mb-4">Location</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                {jobFilters.locations.map((location) => (
                                    <label key={location.id} className="flex items-center space-x-3">
                                        <input
                                            type="checkbox"
                                            name="location"
                                            value={location.city}
                                            className="w-4 h-4 text-black border-black rounded focus:ring-black"
                                        />
                                        <span className="text-sm font-normal text-black">{`${location.city}, ${location.province}`}</span>
                                    </label>
                                ))}
                            </div>
                        </section>

                        {/* Divider */}
                        <hr className="border-gray-200" />

                        {/* Industry */}
                        <section>
                            <h3 className="text-xl font-bold text-black mb-4">Industry</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                {jobFilters.industries.map((industry) => (
                                    <label key={industry.id} className="flex items-center space-x-3">
                                    <input
                                        type="checkbox"
                                        name="industry"
                                        value={industry.name}
                                        className="w-4 h-4 text-black border-black rounded focus:ring-black"
                                    />
                                    <span className="text-sm font-normal text-black">{industry.name}</span>
                                    </label>
                                ))}
                            </div>
                        </section>

                        {/* Divider */}
                        <hr className="border-gray-200" />

                        {/* Salary */}
                        <section>
                            <h3 className="text-xl font-bold text-black mb-4">Salary (per hour)</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                {[...Array(8)].map((_, index) => (
                                    <label key={index} className="flex items-center space-x-3">
                                        <input
                                            type="radio"
                                            name="salary"
                                            value={(index-1) * 5 + 15}
                                            className="w-4 h-4 text-black border-black focus:ring-black"
                                        />
                                        <span className="text-sm font-normal text-black">
                                            {`$${15 + 5 * (index)}-${15 + 5 * (index + 1)}`}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </section>
                        
                        {/* Divider 
                        <hr className="border-gray-200" />

                        {/* More sections 
                        {[...Array(3)].map((_, sectionIndex) => (
                        <section key={sectionIndex}>
                            <h3 className="text-xl font-bold text-black mb-4">More</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                {[...Array(4)].map((_, index) => (
                                <label key={index} className="flex items-center space-x-3">
                                    <input
                                    type="radio"
                                    name={`more${sectionIndex + 1}`}
                                    value={`option${index + 1}`}
                                    className="w-4 h-4 text-black border-black focus:ring-black"
                                    />
                                    <span className="text-sm font-normal text-black">text</span>
                                </label>
                                ))}
                            </div>
                            {sectionIndex < 2 && <hr className="border-gray-200 mt-6" />}
                        </section>
                        ))} */}
                    </div>

                    {/* Footer with action buttons */}
                    <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-gray-200 text-black px-4 py-2 rounded-lg text-sm font-normal hover:bg-gray-300 transition-colors"
                        >
                            Clear All
                        </button>
                        <button
                            type="submit"
                            onClick={onClose}
                            className="flex-1 bg-[#E55B3C] text-white px-4 py-2 rounded-lg text-sm font-normal hover:bg-[#d14f32] transition-colors"
                        >
                            Apply Filters
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}