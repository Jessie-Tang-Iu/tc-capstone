"use client";

import NavBar from "../components/MemberNavBar";
import React, { useState, useEffect } from "react";
import PostItem from "../components/discussionBoard/postItem";
import PostDetail from "../components/discussionBoard/postDetail";
import CommentItem from "../components/discussionBoard/commentItem";

export default function DiscussionBoard() {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [comments, setComments] = useState([]);

  // Modal state
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);

  // Form state
  const [newPost, setNewPost] = useState({ author: "", title: "", content: "" });
  const [newComment, setNewComment] = useState({ author: "", content: "" });

  // Loads post on page load
  useEffect(() => {
    fetch("/api/posts")
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
        if (data.length > 0) {
          setSelectedPost(data[0]);
        }
      })
      .catch((err) => console.error("Failed to fetch posts:", err));
  }, []);

  // Load comments when selectedPost changes
  useEffect(() => {
    if (!selectedPost) return;
    fetch(`/api/comments?post_id=${selectedPost.id}`)
      .then((res) => res.json())
      .then((data) => setComments(data))
      .catch((err) => console.error("Failed to fetch comments:", err));
  }, [selectedPost]);

  // Handle New Post Submit
  const handleAddPost = async () => {
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPost),
      });
      if (!res.ok) throw new Error("Failed to create post");
      const createdPost = await res.json();
      setPosts([createdPost, ...posts]);
      setSelectedPost(createdPost);
      setNewPost({ author: "", title: "", content: "" });
      setShowNewPostModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  // Handle New Comment Submit
  const handleAddComment = async () => {
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newComment, post_id: selectedPost.id }),
      });
      if (!res.ok) throw new Error("Failed to add comment");
      const createdComment = await res.json();
      setComments([...comments, createdComment]);
      setNewComment({ author: "", content: "" });
      setShowCommentModal(false);
    } catch (err) {
      console.error(err);
    }
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
                    disabled={!selectedPost}
                >
                    Add Comment
                </button>
            </div>
        </div>

        <div className="flex h-screen">
            {/* Posts List */}
            <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
                <div className="p-4 space-y-4">
                    {Array.isArray(posts) && posts.map((p) => (
                        <PostItem key={p.id} {...p} onClick={() => setSelectedPost(p)} />
                    ))}
                </div>
            </div>

            {/* Selected Post + Comments */}
            <div className="w-2/3 overflow-y-auto">
                {selectedPost && (
                    <div>
                        <PostDetail {...selectedPost} />
                        <div className="p-4 space-y-2">
                            <h3 className="text-lg font-bold text-black">Comments</h3>
                            {Array.isArray(comments) && comments.map((c) => (
                                <CommentItem key={c.id} {...c} />
                            ))}
                        </div>
                    </div>
                )}
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
                    <button
                        className="px-4 py-2 bg-gray-300 rounded"
                        onClick={() => setShowNewPostModal(false)}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-2 bg-[#F26D51] text-white rounded"
                        onClick={handleAddPost}
                    >
                        Post
                    </button>
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
                        <button
                            className="px-4 py-2 bg-gray-300 rounded"
                            onClick={() => setShowCommentModal(false)}
                        >
                            Cancel
                        </button>
                        <button
                            className="px-4 py-2 bg-[#F26D51] text-white rounded"
                            onClick={handleAddComment}
                        >
                            Comment
                        </button>
                    </div>
            </div>
        </div>
    )}
    </main>
  );
}