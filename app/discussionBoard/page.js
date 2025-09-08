"use client";

import NavBar from "../components/MemberNavBar";
import React, { useState } from "react";
import PostItem from "../components/discussionBoard/postItem";
import PostDetail from "../components/discussionBoard/postDetail";
import CommentItem from "../components/discussionBoard/commentItem";

import postsData from "../data/discussionData.json";

export default function DiscussionBoard() {
  const [selectedPost, setSelectedPost] = useState(postsData[0]);

  return (
    <main className="bg-gray-100 min-h-screen">
        <NavBar />
      {/* Search + Buttons */}
        <div className="flex justify-between mx-16">
            <div className="flex items-center border border-black rounded-xl overflow-hidden py-1 pr-2 mt-4">
                <input
                    type="text"
                    placeholder="Search by Title or Tag"
                    className="px-3 py-2 w-64 focus:outline-none placeholder-black"
                />
                <button className="bg-[#F26D51] text-white px-3 py-1 rounded-lg">Search</button>
                <button className="bg-[#F26D51] text-white px-3 py-1 ml-2 rounded-lg">
                Advanced Search
                </button>
            </div>

            <div className="flex items-center rounded-xl overflow-hidden py-1 pr-2 mt-4">
                <button className="bg-[#F26D51] text-white px-4 py-2 rounded-lg">New Post</button>
                <button className="bg-[#F26D51] text-white px-4 py-2 ml-2 rounded-lg">
                    Add Comment
                </button>
            </div>
        </div>

        {/* Layout */}
        <div className="flex h-screen">
            {/* Left: Posts */}
            <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
            <div className="p-4 space-y-4">
                {postsData.map((p) => (
                <PostItem
                    key={p.id}
                    {...p}
                    onClick={() => setSelectedPost(p)}
                />
                ))}
            </div>
            </div>

            {/* Right: Selected Post */}
            <div className="w-2/3 overflow-y-auto">
            <PostDetail {...selectedPost} />
            </div>
        </div>
        </main>
  );
}