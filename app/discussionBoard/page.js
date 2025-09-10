"use client";

import NavBar from "../components/MemberNavBar";
import React, { useState } from "react";
import PostItem from "../components/discussionBoard/postItem";
import PostDetail from "../components/discussionBoard/postDetail";
import CommentItem from "../components/discussionBoard/commentItem";

import postsJson from "../data/discussionData.json";

export default function DiscussionBoard() {
  const [posts, setPosts] = useState(postsJson);
  const [selectedPost, setSelectedPost] = useState(postsJson[0]);

  // Modal state
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);

  // Form state
  const [newPost, setNewPost] = useState({ author: "", title: "", content: "" });
  const [newComment, setNewComment] = useState({ author: "", content: "" });

  // Handle New Post Submit
  const handleAddPost = () => {
    const post = {
      id: posts.length + 1, // Simulates a incremental ID system
      author: newPost.author || "Anonymous", // Replace with AuthorID when implementing backend
      title: newPost.title,
      content: newPost.content,
      comments: [],
    };
    setPosts([post, ...posts]);
    setSelectedPost(post);
    setNewPost({ author: "", title: "", content: "" });
    setShowNewPostModal(false);
  };

  // Handle New Comment Submit
  const handleAddComment = () => {
    const comment = {
      id: selectedPost.comments.length + 1,
      author: newComment.author || "Anonymous",
      time: "Just now",
      content: newComment.content,
    };
    const updatedPost = {
      ...selectedPost,
      comments: [...selectedPost.comments, comment],
      commentsCount: selectedPost.commentsCount + 1,
    };
    const updatedPosts = posts.map((p) =>
      p.id === updatedPost.id ? updatedPost : p
    );
    setPosts(updatedPosts);
    setSelectedPost(updatedPost);
    setNewComment({ author: "", content: "" });
    setShowCommentModal(false);
  };

  return (
    <main className="bg-gray-100 min-h-screen">
        <NavBar />

        {/* Search Bar and Action Buttons */}
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
            <button
                className="bg-[#F26D51] text-white px-4 py-2 rounded-lg"
                onClick={() => setShowNewPostModal(true)}
            >
                New Post
            </button>
            <button
                className="bg-[#F26D51] text-white px-4 py-2 ml-2 rounded-lg"
                onClick={() => setShowCommentModal(true)}
            >
                Add Comment
            </button>
            </div>
        </div>

        <div className="flex h-screen">
            {/* Posts List */}
            <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
            <div className="p-4 space-y-4">
                {posts.map((p) => (
                <PostItem key={p.id} {...p} onClick={() => setSelectedPost(p)} />
                ))}
            </div>
            </div>

            {/* Selected Post */}
            <div className="w-2/3 overflow-y-auto">
            <PostDetail {...selectedPost} />
            </div>
        </div>

        {/* New Post Modal */}
        {showNewPostModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
                <div className="bg-white p-6 rounded-xl w-1/3 shadow-lg">
                    <h2 className="text-xl font-bold mb-4 text-black">Create New Post</h2>
                    <input
                    type="text"
                    placeholder="Author"
                    value={newPost.author}
                    onChange={(e) => setNewPost({ ...newPost, author: e.target.value })}
                    className="w-full p-2 border rounded mb-2 text-black placeholder-black"
                    />
                    <input
                    type="text"
                    placeholder="Title"
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    className="w-full p-2 border rounded mb-2 text-black placeholder-black"
                    />
                    <textarea
                    placeholder="Content"
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    className="w-full p-2 border rounded mb-2 text-black placeholder-black"
                    />
                    <div className="flex justify-end space-x-2">
                        <button className="px-4 py-2 bg-gray-300 rounded" onClick={() => setShowNewPostModal(false)}>Cancel</button>
                        <button className="px-4 py-2 bg-[#F26D51] text-white rounded" onClick={handleAddPost}>Post</button>
                    </div>
                </div>
            </div>
        )}

        {/* Add Comment Modal */}
        {showCommentModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
                <div className="bg-white p-6 rounded-xl w-1/3 shadow-lg">
                    <h2 className="text-xl font-bold mb-4 text-black">Add Comment</h2>
                    <input
                    type="text"
                    placeholder="Author"
                    value={newComment.author}
                    onChange={(e) => setNewComment({ ...newComment, author: e.target.value })}
                    className="w-full p-2 border rounded mb-2 text-black placeholder-black"
                    />
                    <textarea
                    placeholder="Comment"
                    value={newComment.content}
                    onChange={(e) => setNewComment({ ...newComment, content: e.target.value })}
                    className="w-full p-2 border rounded mb-2 text-black placeholder-black"
                    />
                    <div className="flex justify-end space-x-2">
                        <button className="px-4 py-2 bg-gray-300 rounded" onClick={() => setShowCommentModal(false)}>Cancel</button>
                        <button className="px-4 py-2 bg-[#F26D51] text-white rounded" onClick={handleAddComment}>Comment</button>
                    </div>
                </div>  
            </div>
        )}
    </main>
  );
}