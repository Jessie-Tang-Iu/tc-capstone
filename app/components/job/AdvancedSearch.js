"use client";

import React, { useState } from 'react';
import { X } from "lucide-react";

export default function AdvancedSearch({ onClose }) {
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
                        <label className="flex items-center space-x-3">
                            <input
                            type="checkbox"
                            name="experienceLevel"
                            value="internship"
                            className="w-4 h-4 text-black border-black rounded focus:ring-black"
                            />
                            <span className="text-sm font-normal text-black">Internship</span>
                        </label>
                        <label className="flex items-center space-x-3">
                            <input
                            type="checkbox"
                            name="experienceLevel"
                            value="entryLevel"
                            className="w-4 h-4 text-black border-black rounded focus:ring-black"
                            />
                            <span className="text-sm font-normal text-black">Entry level</span>
                        </label>
                        <label className="flex items-center space-x-3">
                            <input
                            type="checkbox"
                            name="experienceLevel"
                            value="associate"
                            className="w-4 h-4 text-black border-black rounded focus:ring-black"
                            />
                            <span className="text-sm font-normal text-black">Associate</span>
                        </label>
                        <label className="flex items-center space-x-3">
                            <input
                            type="checkbox"
                            name="experienceLevel"
                            value="midSenior"
                            className="w-4 h-4 text-black border-black rounded focus:ring-black"
                            />
                            <span className="text-sm font-normal text-black">Mid-Senior</span>
                        </label>
                        <label className="flex items-center space-x-3">
                            <input
                            type="checkbox"
                            name="experienceLevel"
                            value="director"
                            className="w-4 h-4 text-black border-black rounded focus:ring-black"
                            />
                            <span className="text-sm font-normal text-black">Director</span>
                        </label>
                        <label className="flex items-center space-x-3">
                            <input
                            type="checkbox"
                            name="experienceLevel"
                            value="executive"
                            className="w-4 h-4 text-black border-black rounded focus:ring-black"
                            />
                            <span className="text-sm font-normal text-black">Executive</span>
                        </label>
                        </div>
                    </section>

                    {/* Divider */}
                    <hr className="border-gray-200" />

                    {/* Job type */}
                    <section>
                        <h3 className="text-xl font-bold text-black mb-4">Job type</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        <label className="flex items-center space-x-3">
                            <input
                            type="checkbox"
                            name="jobType"
                            value="fullTime"
                            className="w-4 h-4 text-black border-black rounded focus:ring-black"
                            />
                            <span className="text-sm font-normal text-black">Full-time</span>
                        </label>
                        <label className="flex items-center space-x-3">
                            <input
                            type="checkbox"
                            name="jobType"
                            value="partTime"
                            className="w-4 h-4 text-black border-black rounded focus:ring-black"
                            />
                            <span className="text-sm font-normal text-black">Part-time</span>
                        </label>
                        <label className="flex items-center space-x-3">
                            <input
                            type="checkbox"
                            name="jobType"
                            value="contract"
                            className="w-4 h-4 text-black border-black rounded focus:ring-black"
                            />
                            <span className="text-sm font-normal text-black">Contract</span>
                        </label>
                        <label className="flex items-center space-x-3">
                            <input
                            type="checkbox"
                            name="jobType"
                            value="temporary"
                            className="w-4 h-4 text-black border-black rounded focus:ring-black"
                            />
                            <span className="text-sm font-normal text-black">Temporary</span>
                        </label>
                        <label className="flex items-center space-x-3">
                            <input
                            type="checkbox"
                            name="jobType"
                            value="volunteer"
                            className="w-4 h-4 text-black border-black rounded focus:ring-black"
                            />
                            <span className="text-sm font-normal text-black">Volunteer</span>
                        </label>
                        <label className="flex items-center space-x-3">
                            <input
                            type="checkbox"
                            name="jobType"
                            value="internship"
                            className="w-4 h-4 text-black border-black rounded focus:ring-black"
                            />
                            <span className="text-sm font-normal text-black">Internship</span>
                        </label>
                        <label className="flex items-center space-x-3 col-span-4 sm:col-span-2 lg:col-span-1">
                            <input
                            type="checkbox"
                            name="jobType"
                            value="other"
                            className="w-4 h-4 text-black border-black rounded focus:ring-black"
                            />
                            <span className="text-sm font-normal text-black">Other</span>
                        </label>
                        </div>
                    </section>

                    {/* Divider */}
                    <hr className="border-gray-200" />

                    {/* Remote */}
                    <section>
                        <h3 className="text-xl font-bold text-black mb-4">Remote</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        <label className="flex items-center space-x-3">
                            <input
                            type="checkbox"
                            name="remote"
                            value="hybrid"
                            className="w-4 h-4 text-black border-black rounded focus:ring-black"
                            />
                            <span className="text-sm font-normal text-black">Hybrid</span>
                        </label>
                        <label className="flex items-center space-x-3">
                            <input
                            type="checkbox"
                            name="remote"
                            value="onSite"
                            className="w-4 h-4 text-black border-black rounded focus:ring-black"
                            />
                            <span className="text-sm font-normal text-black">On-site</span>
                        </label>
                        <label className="flex items-center space-x-3 col-span-4 sm:col-span-2 lg:col-span-1">
                            <input
                            type="checkbox"
                            name="remote"
                            value="remote"
                            className="w-4 h-4 text-black border-black rounded focus:ring-black"
                            />
                            <span className="text-sm font-normal text-black">Remote</span>
                        </label>
                        </div>
                    </section>

                    {/* Divider */}
                    <hr className="border-gray-200" />

                    {/* Location */}
                    <section>
                        <h3 className="text-xl font-bold text-black mb-4">Location</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        <label className="flex items-center space-x-3">
                            <input
                            type="checkbox"
                            name="location"
                            value="toronto"
                            className="w-4 h-4 text-black border-black rounded focus:ring-black"
                            />
                            <span className="text-sm font-normal text-black">Toronto, ON</span>
                        </label>
                        <label className="flex items-center space-x-3">
                            <input
                            type="checkbox"
                            name="location"
                            value="montreal"
                            className="w-4 h-4 text-black border-black rounded focus:ring-black"
                            />
                            <span className="text-sm font-normal text-black">Montreal, QC</span>
                        </label>
                        <label className="flex items-center space-x-3">
                            <input
                            type="checkbox"
                            name="location"
                            value="ottawa"
                            className="w-4 h-4 text-black border-black rounded focus:ring-black"
                            />
                            <span className="text-sm font-normal text-black">Ottawa, ON</span>
                        </label>
                        <label className="flex items-center space-x-3">
                            <input
                            type="checkbox"
                            name="location"
                            value="vancouver"
                            className="w-4 h-4 text-black border-black rounded focus:ring-black"
                            />
                            <span className="text-sm font-normal text-black">Vancouver, BC</span>
                        </label>
                        {/* Additional location placeholders */}
                        {[...Array(4)].map((_, index) => (
                            <label key={index} className="flex items-center space-x-3">
                            <input
                                type="checkbox"
                                name="location"
                                value={`location${index + 5}`}
                                className="w-4 h-4 text-black border-black rounded focus:ring-black"
                            />
                            <span className="text-sm font-normal text-black">Location</span>
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
                        <label className="flex items-center space-x-3">
                            <input
                            type="checkbox"
                            name="industry"
                            value="itServices"
                            className="w-4 h-4 text-black border-black rounded focus:ring-black"
                            />
                            <span className="text-sm font-normal text-black">IT services</span>
                        </label>
                        <label className="flex items-center space-x-3">
                            <input
                            type="checkbox"
                            name="industry"
                            value="banking"
                            className="w-4 h-4 text-black border-black rounded focus:ring-black"
                            />
                            <span className="text-sm font-normal text-black">Banking</span>
                        </label>
                        <label className="flex items-center space-x-3">
                            <input
                            type="checkbox"
                            name="industry"
                            value="insurance"
                            className="w-4 h-4 text-black border-black rounded focus:ring-black"
                            />
                            <span className="text-sm font-normal text-black">Insurance</span>
                        </label>
                        <label className="flex items-center space-x-3">
                            <input
                            type="checkbox"
                            name="industry"
                            value="financial"
                            className="w-4 h-4 text-black border-black rounded focus:ring-black"
                            />
                            <span className="text-sm font-normal text-black">Financial</span>
                        </label>
                        {/* Additional industry placeholders */}
                        {[...Array(4)].map((_, index) => (
                            <label key={index} className="flex items-center space-x-3">
                            <input
                                type="checkbox"
                                name="industry"
                                value={`industry${index + 5}`}
                                className="w-4 h-4 text-black border-black rounded focus:ring-black"
                            />
                            <span className="text-sm font-normal text-black">industry</span>
                            </label>
                        ))}
                        </div>
                    </section>

                    {/* Divider */}
                    <hr className="border-gray-200" />

                    {/* Salary */}
                    <section>
                        <h3 className="text-xl font-bold text-black mb-4">Salary</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        <label className="flex items-center space-x-3">
                            <input
                            type="radio"
                            name="salary"
                            value="40000+"
                            className="w-4 h-4 text-black border-black focus:ring-black"
                            />
                            <span className="text-sm font-normal text-black">$40,000+</span>
                        </label>
                        <label className="flex items-center space-x-3">
                            <input
                            type="radio"
                            name="salary"
                            value="60000+"
                            className="w-4 h-4 text-black border-black focus:ring-black"
                            />
                            <span className="text-sm font-normal text-black">$60,000+</span>
                        </label>
                        {/* Additional salary placeholders */}
                        {[...Array(6)].map((_, index) => (
                            <label key={index} className="flex items-center space-x-3">
                            <input
                                type="radio"
                                name="salary"
                                value={`salary${index + 3}`}
                                className="w-4 h-4 text-black border-black focus:ring-black"
                            />
                            <span className="text-sm font-normal text-black">text</span>
                            </label>
                        ))}
                        </div>
                    </section>

                    {/* Divider */}
                    <hr className="border-gray-200" />

                    {/* More sections */}
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
                    ))}
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