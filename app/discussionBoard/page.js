"use client";

import NavBar from "../components/MemberNavBar";
import React, { useState, useEffect } from "react";
import PostItem from "../components/discussionBoard/postItem";
import PostDetail from "../components/discussionBoard/postDetail";
import CommentItem from "../components/discussionBoard/commentItem";
import SearchBar from "../components/ui/SearchBar";
import Button from "../components/ui/Button";
import { RxCross2 } from "react-icons/rx";
import { useUser } from "@clerk/nextjs";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function DiscussionBoard() {
    const { user } = useUser();
    const userID = user?.id;
    const userName = user?.fullName || user?.username || "Anonymous";

    const [posts, setPosts] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null);
    const [comments, setComments] = useState([]);

    const [query, setQuery] = useState("");
    const [showNewPostModal, setShowNewPostModal] = useState(false);
    const [showCommentModal, setShowCommentModal] = useState(false);
    const [showEditPostModal, setShowEditPostModal] = useState(false);

    const [newPost, setNewPost] = useState({ author_id: userID, author_name: userName, title: "", content: "" });
    const [newComment, setNewComment] = useState({ author_id: userID, author_name: userName, content: "" });
    const [editPost, setEditPost] = useState({ id: null, title: "", content: "" });


    // Loads all posts into the frontend on page load
    useEffect(() => {
        fetch("/api/posts")
            .then((res) => {
                if (!res.ok) {
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
        fetch(`/api/comments?post_id=${selectedPost.id}`)
            .then((res) => res.json())
            .then((data) => setComments(data))
            .catch((err) => console.error("Failed to fetch comments:", err));
    }, [selectedPost]);

    // Handle New Post Submit
    const handleAddPost = async () => {
        try {
            // Build post payload
            const postPayload = {
                author_id: userID,
                author_name: userName,
                title: newPost.title.trim(),
                content: newPost.content.trim(),
            };

            // Send to backend
            const res = await fetch("/api/posts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(postPayload),
            });

            if (!res.ok) throw new Error("Failed to create post");

            const createdPost = await res.json();

            // Update UI
            setPosts((prev) => [createdPost, ...prev]);
            setSelectedPost(createdPost);
            setNewPost({ title: "", content: "" });
            setShowNewPostModal(false);
        } catch (err) {
            console.error("Error creating post:", err);
        }
    };

    // Handle New Comment Submit
    const handleAddComment = async () => {
        try {
            if (!selectedPost) throw new Error("No post selected");

            const commentPayload = {
                post_id: selectedPost.id,
                author_id: userID,
                author_name: userName,
                content: newComment.content.trim(),
            };

            const res = await fetch("/api/comments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(commentPayload),
            });

            if (!res.ok) throw new Error("Failed to add comment");

            const createdComment = await res.json();

            setComments((prev) => [...prev, createdComment]);
            setNewComment({ content: "" });
            setShowCommentModal(false);
        } catch (err) {
            console.error("Error adding comment:", err);
        }
    };
    
    // Handle Edit Post, takes the new data and updates the post in the backend
    const handleEditPost = async () => {
        try {
            const updatedPayload = {
                id: editPost.id,
                author_id: userID,
                title: editPost.title.trim(),
                content: editPost.content.trim(),
            };

            console.log("Updating post with payload:", updatedPayload);

            const res = await fetch("/api/posts", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedPayload),
            });

            if (!res.ok) throw new Error("Failed to update post");
            const updatedPost = await res.json();

            // Update UI
            setPosts((prev) =>
            prev.map((p) => (p.id === updatedPost.id ? updatedPost : p))
            );
            setSelectedPost(updatedPost);
            setShowEditPostModal(false);
        } catch (err) {
            console.error("Error updating post:", err);
        }
    };

    // Filter posts based on search query
    const filteredPost = posts.filter(
        (p) =>
            (p.author_name?.toLowerCase() || "").includes(query.toLowerCase()) ||
            (p.title?.toLowerCase() || "").includes(query.toLowerCase())
    );

    // Close modal handler
    const handleCloseWindow = () => {
        setShowNewPostModal(false);
        setShowCommentModal(false);
    };

    return (
        <main className="bg-gray-100 min-h-screen pb-10">
            <NavBar />

            {/* Search Bar and Action Buttons */}
            <div className="flex justify-between mx-10 mt-5">
                <div className="flex justify-center">
                    <SearchBar
                        value={query}
                        onChange={setQuery}
                        placeholder="Search by Author | Title | Keywords"
                    />
                </div>

                <div className="flex items-center rounded-xl overflow-hidden py-1 pr-2 mt-4 space-x-4">
                    <Button text="New Post" onClick={() => setShowNewPostModal(true)} />
                    <Button
                        text="Add Comment"
                        onClick={() => setShowCommentModal(true)}
                        disabled={!selectedPost}
                    />
                </div>
            </div>

            {/* Main Board */}
            <div className="flex h-screen mx-10 border border-gray-300 rounded-2xl shadow-lg mt-5">
                {/* Posts List */}
                <div className="bg-[#efe7e1] w-1/4 border-r border-gray-200 rounded-2xl overflow-y-auto">
                    <div className="p-4 space-y-4">
                        {Array.isArray(filteredPost) &&
                            filteredPost.map((p) => (
                                <PostItem
                                    key={p.id}
                                    {...p}
                                    onClick={() => setSelectedPost(p)}
                                    disabled={p.id === selectedPost?.id}
                                />
                            ))}
                    </div>
                </div>

                {/* Selected Post + Comments */}
                <div className="w-3/4 overflow-y-auto pl-5">
                    {selectedPost && (
                        <div>
                            <PostDetail
                                {...selectedPost}
                                onEdit={(post) => {
                                    setEditPost({
                                    id: post.id,
                                    title: post.title,
                                    content: post.content,
                                    });
                                    setShowEditPostModal(true);
                                }}
                            />
                            <div className="p-4 space-y-2">
                                <h3 className="text-lg font-bold text-black border-b border-gray-500 pb-4">
                                    Comments
                                </h3>
                                {comments.length === 0 ? (
                                    <div>
                                        <p className="text-black font-bold pt-4">
                                            No comments for this post yet
                                        </p>
                                        <p className="mt-2 ml-2 text-gray-700">
                                            Be the first to comment!
                                        </p>
                                    </div>
                                ) : (
                                    comments.map((c) => <CommentItem key={c.id} {...c} />)
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* New Post Modal */}
            {showNewPostModal && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl mx-auto overflow-hidden text-black">
                    {/* Header */}
                    <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-gray-50">
                        <h1 className="text-2xl font-bold text-[#E55B3C]">Create New Post</h1>
                        <button onClick={handleCloseWindow} title="Close">
                        <RxCross2 className="cursor-pointer text-gray-600 hover:text-black" size={22} />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-6 space-y-5">
                        <p className="text-sm text-gray-600">
                        Posting as <span className="font-semibold">{userName}</span>
                        </p>

                        {/* Title */}
                        <div>
                        <label className="block font-medium mb-1">Title</label>
                        <input
                            type="text"
                            className="border border-gray-300 focus:ring-2 focus:ring-[#E55B3C] focus:outline-none w-full px-3 py-2 rounded-lg"
                            value={newPost.title}
                            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                            placeholder="Enter your post title"
                        />
                        </div>

                        {/* Content */}
                        <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="block font-medium">Content (Markdown Supported)</label>
                            <a
                            href="https://www.markdownguide.org/basic-syntax/"
                            target="_blank"
                            className="text-xs text-blue-600 hover:underline"
                            rel="noopener noreferrer"
                            >
                            Markdown help ↗
                            </a>
                        </div>

                        {/* Markdown Textarea + Preview */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <textarea
                            className="border border-gray-300 rounded-lg w-full p-3 min-h-[10em] focus:ring-2 focus:ring-[#E55B3C] focus:outline-none"
                            placeholder="Write your post here using Markdown..."
                            value={newPost.content}
                            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                            />

                            {/* Live Markdown Preview */}
                            <div className="border border-gray-200 rounded-lg p-3 bg-gray-50 prose prose-sm max-w-none overflow-y-auto">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {newPost.content || "_Nothing to preview yet..._"}
                            </ReactMarkdown>
                            </div>
                        </div>
                        </div>
                    </div>

                    {/* Footer Buttons */}
                    <div className="flex justify-end gap-4 px-6 py-4 border-t border-gray-200 bg-gray-50">
                        <button
                        onClick={() => setShowNewPostModal(false)}
                        type="button"
                        className="font-semibold px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 transition duration-200 active:scale-95"
                        >
                        Cancel
                        </button>
                        <Button onClick={handleAddPost} text="Post" />
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
                            <p className="text-sm text-gray-600 mb-3">
                                Commenting as{" "}
                                <span className="font-semibold">{userName}</span>
                            </p>

                            <label>Comment:</label>
                            <textarea
                                className="border px-2 rounded min-h-[4.5em]"
                                value={newComment.content}
                                onChange={(e) =>
                                    setNewComment({ ...newComment, content: e.target.value })
                                }
                            />
                            <p className="text-red-500 mb-3"></p>
                        </div>
                        <div className="flex justify-center">
                            <button
                                onClick={() => setShowCommentModal(false)}
                                type="button"
                                className="font-semibold px-6 py-2 rounded-md mr-8 bg-[#D9D9D9] transition duration-200 ease-in-out cursor-pointer focus:outline-none active:scale-95"
                            >
                                Cancel
                            </button>
                            <Button onClick={handleAddComment} text="Comment" />
                        </div>
                    </div>
                </div>
            )}
            
            {/* Edit Post Modal */}
            {showEditPostModal && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl mx-auto overflow-hidden text-black">
                    {/* Header */}
                    <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-gray-50">
                        <h1 className="text-2xl font-bold text-[#E55B3C]">Edit Post</h1>
                        <button onClick={() => setShowEditPostModal(false)} title="Close">
                        <RxCross2 className="cursor-pointer text-gray-600 hover:text-black" size={22} />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-6 space-y-5">
                        <p className="text-sm text-gray-600">
                        Editing as <span className="font-semibold">{userName}</span>
                        </p>

                        {/* Title */}
                        <div>
                        <label className="block font-medium mb-1">Title</label>
                        <input
                            type="text"
                            className="border border-gray-300 focus:ring-2 focus:ring-[#E55B3C] focus:outline-none w-full px-3 py-2 rounded-lg"
                            value={editPost.title}
                            onChange={(e) => setEditPost({ ...editPost, title: e.target.value })}
                        />
                        </div>

                        {/* Content */}
                        <div>
                        <label className="block font-medium mb-1">Content (Markdown Supported)</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <textarea
                            className="border border-gray-300 rounded-lg w-full p-3 min-h-[10em] focus:ring-2 focus:ring-[#E55B3C] focus:outline-none"
                            value={editPost.content}
                            onChange={(e) => setEditPost({ ...editPost, content: e.target.value })}
                            />
                            <div className="border border-gray-200 rounded-lg p-3 bg-gray-50 prose prose-sm max-w-none overflow-y-auto">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {editPost.content || "_Nothing to preview yet..._"}
                            </ReactMarkdown>
                            </div>
                        </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-4 px-6 py-4 border-t border-gray-200 bg-gray-50">
                        <button
                        onClick={() => setShowEditPostModal(false)}
                        type="button"
                        className="font-semibold px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 transition duration-200 active:scale-95"
                        >
                        Cancel
                        </button>
                        <Button onClick={handleEditPost} text="Save Changes" />
                    </div>
                    </div>
                </div>
            )}
        </main>
    );
}
