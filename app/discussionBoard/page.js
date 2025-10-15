"use client";

import NavBar from "../components/MemberNavBar";
import React, { useState, useEffect } from "react";
import PostItem from "../components/discussionBoard/postItem";
import PostDetail from "../components/discussionBoard/postDetail";
import CommentItem from "../components/discussionBoard/commentItem";
import SearchBar from "../components/ui/SearchBar";
import Button from "../components/ui/Button";
import { RxCross2 } from "react-icons/rx";

export default function DiscussionBoard() {
    const [posts, setPosts] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null);
    const [comments, setComments] = useState([]);

    // Search state
    const [query, setQuery] = useState("");

    // Modal state
    const [showNewPostModal, setShowNewPostModal] = useState(false);
    const [showCommentModal, setShowCommentModal] = useState(false);

    // Form state
    const [newPost, setNewPost] = useState({ author: "", title: "", content: "" });
    const [newComment, setNewComment] = useState({ author: "", content: "" });

    // Loads all posts into the frontend on page load
    useEffect(() => {
    fetch("/api/posts")
        .then((res) => {
            if (!res.ok) {
                // Throw an error so it goes to .catch()
                return res.json().then((err) => {
                throw new Error(err.error || "Unknown server error");
                });
            }
            return res.json();
            })
            .then((data) => {
            setPosts(data);
            if (data.length > 0) setSelectedPost(data[0]);
            })
        .catch((err) => console.error("Failed to fetch posts:", err.message));
    }, []);

    // Load comments when selectedPost changes
    useEffect(() => {
        if (!selectedPost) return;
        fetch(`/api/comments?post_id=${selectedPost.id}`) // Defaults to a GET request
        .then((res) => res.json())
        .then((data) => setComments(data))
        .catch((err) => console.error("Failed to fetch comments:", err));
    }, [selectedPost]);

    // Handle New Post Submit
    const handleAddPost = async () => {
        try {
        const res = await fetch("/api/posts", {
            method: "POST",
            headers: { "Content-Type": "application/json" }, // Tells the backend the sent data is JSON data
            body: JSON.stringify(newPost), // Converts the new post to a JSON object
        });
        if (!res.ok) throw new Error("Failed to create post");
            const createdPost = await res.json(); // Turns the response containing the new post into a json object and stores it
            setPosts([createdPost, ...posts]); // Adds the new post to the top of the posts array
            setSelectedPost(createdPost); // Sets the newly created post as the selected post
            setNewPost({ author: "", title: "", content: "" }); // Resets the new post form
            setShowNewPostModal(false); // Closes the new post modal
        } catch (err) {
        console.error(err); // Console logs the errors for now, will be changed to display on the frontend later when styling the frontend
        }
    };

    // Handle New Comment Submit
    const handleAddComment = async () => {
        try {
        const res = await fetch("/api/comments", {
            method: "POST",
            headers: { "Content-Type": "application/json" }, // Tells the backend the sent data is JSON data
            body: JSON.stringify({ ...newComment, post_id: selectedPost.id }), // Converts new comment and post id to a JSON object
        });
        if (!res.ok) throw new Error("Failed to add comment");
            const createdComment = await res.json();
            setComments([...comments, createdComment]); // Adds the new comment to the end of the comments array to match the way its sorted. Oldest first.
            setNewComment({ author: "", content: "" }); // Resets the new comment form
            setShowCommentModal(false); // Closes the new comment modal
        } catch (err) {
        console.error(err); // Console logs the errors for now, will be changed to display on the frontend later when styling the frontend
        }
    };

    const filteredPost = posts.filter((u) =>
        u.author.toLowerCase().includes(query.toLowerCase()) ||
        u.title.toLowerCase().includes(query.toLowerCase())
    );

    // Close modal handler
    const handleCloseWindow = () => {
        if (showCommentModal) setShowCommentModal(false);
        if (showNewPostModal) setShowNewPostModal(false);
    }

    return (
    <main className="bg-gray-100 min-h-screen pb-10">
        <NavBar />

        {/* Search Bar and Action Buttons */}
        <div className="flex justify-between mx-10 mt-5">

            <div className="flex justify-center">
                <SearchBar
                    value={query}
                    onChange={setQuery}
                    onSearch={() => {}}
                    placeholder="Search by Author | Title |  Key Words"
                />
            </div>

            <div className="flex items-center rounded-xl overflow-hidden py-1 pr-2 mt-4 space-x-4">
                <Button
                    text="New Post"
                    onClick={() => setShowNewPostModal(true)}
                />
                <Button
                    text="Add Comment"
                    onClick={() => setShowCommentModal(true)}
                    disabled={!selectedPost}
                />
            </div>
        </div>

        <div className="flex h-screen mx-10 border border-gray-300 rounded-2xl shadow-lg mt-5">
            {/* Posts List */}
            <div className="bg-[#efe7e1] w-1/4 border-r border-gray-200 rounded-2xl overflow-y-auto">
                <div className="p-4 space-y-4">
                    {Array.isArray(filteredPost) && filteredPost.map((p) => (
                        <PostItem key={p.id} {...p} onClick={() => setSelectedPost(p)} disabled={p.id == selectedPost.id }/>
                    ))}
                </div>
            </div>

            {/* Selected Post + Comments */}
            <div className="w-3/4 overflow-y-auto pl-5">
                {selectedPost && (
                    <div>
                        <PostDetail {...selectedPost} />
                        <div className="p-4 space-y-2">
                            <h3 className="text-lg font-bold text-black border-b border-gray-500 pb-4">Comments</h3>
                            {
                                comments.length === 0 ? (
                                    <div>
                                        <p className="text-black font-bold pt-4">No comment for this post yet</p>
                                        <p className="mt-2 ml-2 text-gray-700">Be the first to comment!</p>
                                    </div>
                                ) : (
                                    comments.map((c) => (
                                        <CommentItem key={c.id} {...c} />)
                            ))}
                        </div>
                    </div>
                )}
            </div>

            
        </div>

        {/* New Post Modal */}
        {showNewPostModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-xl text-black relative w-full max-w-lg mx-auto">
                <button onClick={handleCloseWindow} title="Close">
                    <RxCross2
                        className="cursor-pointer text-gray-600 hover:text-black"
                        size={20}
                    />
                </button>
                <h1 className="text-2xl font-bold text-center text-[#E55B3C] mb-2">
                    Create New Post
                </h1>
                <div className="flex flex-col px-20 my-3">
                    <label>
                        Author: 
                    </label>
                    <input 
                        type="text"
                        className="border h-8 px-2 rounded"
                        value={newPost.author}
                        onChange={(e) => setNewPost({ ...newPost, author: e.target.value })} />
                    <p className="text-red-500 mb-3"></p>

                    <label>
                        Title: 
                    </label>
                    <input 
                        type="text"
                        className="border h-8 px-2 rounded"
                        value={newPost.title}
                        onChange={(e) => setNewPost({ ...newPost, title: e.target.value })} />
                    <p className="text-red-500 mb-3"></p>

                    <label>
                        Content: 
                    </label>
                    <textarea 
                        type="text"
                        className="border px-2 rounded min-h-[4.5em]"
                        value={newPost.content}
                        onChange={(e) => setNewPost({ ...newPost, content: e.target.value })} />
                    <p className="text-red-500 mb-3"></p>
                </div>
                <div className="flex justify-center">
                    <button
                        onClick={() => setShowNewPostModal(false)}
                        type="button"
                        className="font-semibold px-3 py-2 rounded-md mr-8 bg-[#D9D9D9] transition duration-200 ease-in-out cursor-pointer focus:outline-none active:scale-95"
                    >Cancel</button>
                    <Button 
                        onClick={handleAddPost}
                        text="Post" 
                    />
                </div>
            </div>
        </div>
        )}

        {/* Add Comment Modal */}
        {showCommentModal && (
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
                <div className="bg-white p-6 rounded-xl shadow-xl text-black relative w-full max-w-lg mx-auto">
                    <button onClick={handleCloseWindow} title="Close">
                        <RxCross2
                            className="cursor-pointer text-gray-600 hover:text-black"
                            size={20}
                        />
                    </button>
                    <h1 className="text-2xl font-bold text-center text-[#E55B3C] mb-2">
                        Add Comment
                    </h1>
                                    <div className="flex flex-col px-20 my-3">
                        <label>
                            Author: 
                        </label>
                        <input 
                            type="text"
                            className="border h-8 px-2 rounded"
                            value={newComment.author}
                            onChange={(e) => setNewComment({ ...newComment, author: e.target.value })} />
                        <p className="text-red-500 mb-3"></p>

                        <label>
                            Comment: 
                        </label>
                        <textarea 
                            type="text"
                            className="border px-2 rounded min-h-[4.5em]"
                            value={newComment.content}
                            onChange={(e) => setNewComment({ ...newComment, content: e.target.value })} />
                        <p className="text-red-500 mb-3"></p>
                    </div>
                    <div className="flex justify-center">
                        <button
                            onClick={() => setShowCommentModal(false)}
                            type="button"
                            className="font-semibold px-6 py-2 rounded-md mr-8 bg-[#D9D9D9] transition duration-200 ease-in-out cursor-pointer focus:outline-none active:scale-95"
                        >Cancel</button>
                        <Button 
                            onClick={handleAddComment}
                            text="Comment" 
                        />
                    </div>
                </div>
            </div>
        )}
    </main>
    );
}