"use client";

import NavBar from "../components/MemberNavBar";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import PostItem from "../components/discussionBoard/postItem";
import PostDetail from "../components/discussionBoard/postDetail";
import CommentItem from "../components/discussionBoard/commentItem";
import SearchBar from "../components/ui/SearchBar";
import Button from "../components/ui/Button";
import { RxCross2 } from "react-icons/rx";
import { useUser } from "@clerk/nextjs";

import "react-quill-new/dist/quill.snow.css";
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

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

    const [newPost, setNewPost] = useState({ author_id: userID, author_name: userName, title: "", content: "", tags: "", });
    const [newComment, setNewComment] = useState({ author_id: userID, author_name: userName, content: "" });
    const [editPost, setEditPost] = useState({ id: null, title: "", content: "", tags: "" });


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
                tags: newPost.tags
                    .split(",")
                    .map((t) => t.trim())
                    .filter((t) => t !== ""),
            };

            console.log("Creating post with payload:", postPayload);

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

    // Configures what features are available in the Quill editor toolbar
    const quillModules = {
        toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link"],
        ["clean"],
        ],
    };

    return (
        <main className="bg-gray-100 min-h-screen pb-5">
            <NavBar />

            <header className="mt-5 mb-2 mx-2 md:mx-10 rounded-xl bg-white p-6 shadow text-center">
                <div className="mb-4 text-4xl font-semibold text-[#E55B3C]">
                    Discussion Board
                </div>
                
                {/* Search Bar and Action Buttons */}
                <div className="flex flex-wrap justify-center items-center gap-3 lg:gap-15">
                    <SearchBar
                        value={query}
                        onChange={setQuery}
                        placeholder="Search by Author | Title | Keywords"
                    />

                    <div className="flex justify-center gap-3">
                        <Button text="New Post" onClick={() => setShowNewPostModal(true)} />
                        <Button
                            text="Add Comment"
                            onClick={() => setShowCommentModal(true)}
                            disabled={!selectedPost}
                        />
                    </div>
                </div>
            </header>            

            {/* Main Board */}
            <div className="flex flex-row min-h-screen gap-2 mx-2 md:mx-10 mt-4">
                {/* Posts List */}
                <div 
                    className={`w-1/4 min-w-45 max-w-80 block
                          h-[calc(100vh-180px)] md:h-[calc(100vh-240px)] overflow-y-auto`}
                >
                    <div className="px-2 py-1 space-y-2">
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
                <div className="w-full bg-white my-1 min-h-screen rounded-xl overflow-y-auto">
                    {selectedPost && (
                        <div>
                            <PostDetail
                                {...selectedPost}
                                onEdit={(post) => {
                                    setEditPost({
                                        id: post.id,
                                        title: post.title,
                                        content: post.content,
                                        tags: (post.tags || []).join(", "),
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
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl mx-auto text-black">
                        <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-50">
                        <h1 className="text-2xl font-bold text-[#E55B3C]">Create New Post</h1>
                        <RxCross2
                            onClick={handleCloseWindow}
                            className="cursor-pointer text-gray-600 hover:text-black"
                            size={22}
                        />
                        </div>

                        <div className="p-6 space-y-5">
                        <p className="text-sm text-gray-600">
                            Posting as <span className="font-semibold">{userName}</span>
                        </p>

                        {/* Title */}
                        <input
                            type="text"
                            className="border border-gray-300 focus:ring-2 focus:ring-[#E55B3C] w-full px-3 py-2 rounded-lg"
                            placeholder="Enter post title"
                            value={newPost.title}
                            onChange={(e) =>
                            setNewPost({ ...newPost, title: e.target.value })
                            }
                        />
                        {/* Tags */}
                        <input
                            type="text"
                            className="border border-gray-300 focus:ring-2 focus:ring-[#E55B3C] w-full px-3 py-2 rounded-lg"
                            placeholder="Enter tags, separated by commas (e.g. react,nextjs,frontend)"
                            value={newPost.tags}
                            onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                        />

                        {/* Quill Editor */}
                        <ReactQuill
                            theme="snow"
                            modules={quillModules}
                            value={newPost.content}
                            onChange={(val) => setNewPost({ ...newPost, content: val })}
                            className="min-h-[10em] rounded-lg"
                        />
                        </div>

                        <div className="flex justify-end gap-4 px-6 py-4 border-t bg-gray-50">
                        <button
                            onClick={handleCloseWindow}
                            className="px-4 py-2 bg-gray-200 rounded-md font-semibold hover:bg-gray-300"
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
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl mx-auto text-black">
                        <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-50">
                        <h1 className="text-2xl font-bold text-[#E55B3C]">Edit Post</h1>
                        <RxCross2
                            onClick={handleCloseWindow}
                            className="cursor-pointer text-gray-600 hover:text-black"
                            size={22}
                        />
                        </div>

                        <div className="p-6 space-y-5">
                        <p className="text-sm text-gray-600">
                            Editing as <span className="font-semibold">{userName}</span>
                        </p>

                        <input
                            type="text"
                            className="border border-gray-300 focus:ring-2 focus:ring-[#E55B3C] w-full px-3 py-2 rounded-lg"
                            value={editPost.title}
                            onChange={(e) =>
                            setEditPost({ ...editPost, title: e.target.value })
                            }
                        />

                        <input
                            type="text"
                            className="border border-gray-300 focus:ring-2 focus:ring-[#E55B3C] w-full px-3 py-2 rounded-lg"
                            placeholder="Enter tags separated by commas (e.g. react,nextjs,frontend)"
                            value={editPost.tags}
                            onChange={(e) => setEditPost({ ...editPost, tags: e.target.value })}
                        />

                        <ReactQuill
                            theme="snow"
                            modules={quillModules}
                            value={editPost.content}
                            onChange={(val) => setEditPost({ ...editPost, content: val })}
                            className="min-h-[10em] rounded-lg"
                        />
                        </div>

                        <div className="flex justify-end gap-4 px-6 py-4 border-t bg-gray-50">
                        <button
                            onClick={handleCloseWindow}
                            className="px-4 py-2 bg-gray-200 rounded-md font-semibold hover:bg-gray-300"
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
