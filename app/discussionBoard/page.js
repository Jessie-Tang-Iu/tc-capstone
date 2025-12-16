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
    const [showEditPostModal, setShowEditPostModal] = useState(false);

    const [newPost, setNewPost] = useState({
        title: "",
        content: "",
        tags: "",
    });

    const [newComment, setNewComment] = useState({
        content: "",
    });

    const [editPost, setEditPost] = useState({
        id: null,
        title: "",
        content: "",
        tags: "",
    });

    useEffect(() => {
        fetch("/api/posts")
            .then((res) => res.json())
            .then((data) => {
                setPosts(data);
                if (data.length > 0) setSelectedPost(data[0]);
            })
            .catch(console.error);
    }, []);

    useEffect(() => {
        if (!selectedPost) return;
        fetch(`/api/comments?post_id=${selectedPost.id}`)
            .then((res) => res.json())
            .then(setComments)
            .catch(console.error);
    }, [selectedPost]);

    const handleAddPost = async () => {
        const res = await fetch("/api/posts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                author_id: userID,
                author_name: userName,
                title: newPost.title.trim(),
                content: newPost.content.trim(),
                tags: newPost.tags
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean),
            }),
        });

        const created = await res.json();

        // Ensure author_name is set here
        const postWithAuthor = {
            ...created,
            author_name: userName,
            first_name: user?.firstName || null,
            last_name: user?.lastName || null,
            username: user?.username || null,
        };

        setPosts((p) => [postWithAuthor, ...p]);
        setSelectedPost(postWithAuthor);
        setShowNewPostModal(false);
        setNewPost({ title: "", content: "", tags: "" });
    };

    const handleAddComment = async () => {
        if (!newComment.content.trim()) return;

        const res = await fetch("/api/comments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                post_id: selectedPost.id,
                author_id: userID,
                author_name: userName,
                content: newComment.content.trim(),
            }),
        });

        const created = await res.json();

        const commentWithAuthor = {
            ...created,
            author_name: userName,
            first_name: user?.firstName || null,
            last_name: user?.lastName || null,
            username: user?.username || null,
        };

        setComments((c) => [...c, commentWithAuthor])
        setNewComment({ content: "" });
    };

    const handleEditPost = async () => {
        const res = await fetch("/api/posts", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: editPost.id,
                author_id: userID,
                title: editPost.title.trim(),
                content: editPost.content.trim(),
                tags: editPost.tags
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean),
            }),
        });

        const updated = await res.json();
        setPosts((p) => p.map((x) => (x.id === updated.id ? updated : x)));
        setSelectedPost(updated);
        setShowEditPostModal(false);
    };

    const filteredPosts = posts.filter(
        (p) =>
            p.title?.toLowerCase().includes(query.toLowerCase()) ||
            p.author_name?.toLowerCase().includes(query.toLowerCase())
    );

    const quillModules = {
        toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link"],
            ["clean"],
        ],
    };

    return (
        <main className="bg-gray-100 min-h-screen pb-5">
            <NavBar />

            <header className="mt-5 mx-2 md:mx-10 bg-white p-6 rounded-xl shadow relative">
                <h1 className="text-4xl text-center font-semibold text-[#E55B3C]">
                    Discussion Board
                </h1>

                <button
                    onClick={() => setShowNewPostModal(true)}
                    className="absolute top-6 right-6 text-[#E55B3C] font-semibold hover:underline"
                >
                    + New Post
                </button>

                <div className="mt-6 flex justify-center">
                    <SearchBar
                        value={query}
                        onChange={setQuery}
                        placeholder="Search by author or title"
                    />
                </div>
            </header>

            <div className="flex gap-2 mx-2 md:mx-10 mt-4">
                <div className="w-1/4 max-w-80 overflow-y-auto p-2">
                    {filteredPosts.map((p) => (
                        <PostItem
                            key={p.id}
                            {...p}
                            onClick={() => setSelectedPost(p)}
                            disabled={p.id === selectedPost?.id}
                        />
                    ))}
                </div>

                <div className="w-full bg-white rounded-xl">
                    {selectedPost && (
                        <>
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

                            {/* Inline Comment Bar */}
                            <div className="flex gap-3 p-4 border-t">
                                <input
                                    className="flex-1 border rounded px-3 py-2 text-black placeholder:text-gray-600"
                                    placeholder="Write a comment..."
                                    value={newComment.content}
                                    onChange={(e) =>
                                        setNewComment({ content: e.target.value })
                                    }
                                />
                                <Button text="Send" onClick={handleAddComment} />
                            </div>

                            <div className="p-4">
                                <h3 className="font-bold mb-3 border-b pb-2 text-black">
                                    Comments
                                </h3>

                                {comments.length === 0 ? (
                                    <p className="text-gray-600">
                                        No comments yet.
                                    </p>
                                ) : (
                                    comments.map((c) => (
                                        <CommentItem key={c.id} {...c} />
                                    ))
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* New Post Modal */}
            {showNewPostModal && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 text-black placeholder:text-gray-400">
                    <div className="bg-white rounded-2xl w-full max-w-3xl">
                        <div className="flex justify-between p-4 border-b ">
                            <h2 className="text-2xl font-bold text-[#E55B3C]">
                                Create Post
                            </h2>
                            <RxCross2
                                onClick={() => setShowNewPostModal(false)}
                                className="cursor-pointer"
                            />
                        </div>

                        <div className="p-6 space-y-4 ">
                            <input
                                className="w-full border rounded px-3 py-2 text-black placeholder:text-gray-400"
                                placeholder="Title"
                                value={newPost.title}
                                onChange={(e) =>
                                    setNewPost({ ...newPost, title: e.target.value })
                                }
                            />

                            <input
                                className="w-full border rounded px-3 py-2 text-black placeholder:text-gray-400"
                                placeholder="Tags (comma separated)"
                                value={newPost.tags}
                                onChange={(e) =>
                                    setNewPost({ ...newPost, tags: e.target.value })
                                }
                            />

                            <ReactQuill
                                modules={quillModules}
                                value={newPost.content}
                                onChange={(val) =>
                                    setNewPost({ ...newPost, content: val })
                                }
                            />
                        </div>

                        <div className="flex justify-end gap-3 p-4 border-t">
                            <button
                                onClick={() => setShowNewPostModal(false)}
                                className="px-4 py-2 bg-gray-200 rounded"
                            >
                                Cancel
                            </button>
                            <Button text="Post" onClick={handleAddPost} />
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Post Modal */}
            {showEditPostModal && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 text-black placeholder:text-gray-400">
                    <div className="bg-white rounded-2xl w-full max-w-3xl">
                        <div className="flex justify-between p-4 border-b">
                            <h2 className="text-2xl font-bold text-[#E55B3C]">
                                Edit Post
                            </h2>
                            <RxCross2
                                onClick={() => setShowEditPostModal(false)}
                                className="cursor-pointer"
                            />
                        </div>

                        <div className="p-6 space-y-4">
                            <input
                                className="w-full border rounded px-3 py-2 text-black placeholder:text-gray-400"
                                value={editPost.title}
                                onChange={(e) =>
                                    setEditPost({
                                        ...editPost,
                                        title: e.target.value,
                                    })
                                }
                            />

                            <input
                                className="w-full border rounded px-3 py-2 text-black placeholder:text-gray-400"
                                value={editPost.tags}
                                onChange={(e) =>
                                    setEditPost({
                                        ...editPost,
                                        tags: e.target.value,
                                    })
                                }
                            />

                            <ReactQuill
                                modules={quillModules}
                                value={editPost.content}
                                onChange={(val) =>
                                    setEditPost({
                                        ...editPost,
                                        content: val,
                                    })
                                }
                            />
                        </div>

                        <div className="flex justify-end gap-3 p-4 border-t">
                            <button
                                onClick={() => setShowEditPostModal(false)}
                                className="px-4 py-2 bg-gray-200 rounded"
                            >
                                Cancel
                            </button>
                            <Button
                                text="Save Changes"
                                onClick={handleEditPost}
                            />
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
