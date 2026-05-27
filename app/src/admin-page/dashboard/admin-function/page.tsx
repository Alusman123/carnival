"use client";

import { useState } from "react";
import axios from "axios";
import ProtectedRoute from "@/app/components/ProtectedRoute";

const API = process.env.NEXT_PUBLIC_API_URL;

interface User {
  _id: string;
  username: string;
  role: string;
  isDisabled: boolean;
  createdAt: string;
}

interface Post {
  _id: string;
  title: string;
  description: string;
  photo: string;
  content: string;
  createdAt: string;
  isHidden: boolean;
  hiddenFrom: string[];
}

export default function AdminFunctionPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [isAddDataModalOpen, setIsAddDataModalOpen] = useState(false);
  const [isManagePostsModalOpen, setIsManagePostsModalOpen] =
    useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [createLoading, setCreateLoading] = useState(false);
  const [createMessage, setCreateMessage] = useState("");
  const [createError, setCreateError] = useState("");

  const [users, setUsers] = useState<User[]>([]);
  const [manageLoading, setManageLoading] = useState(false);

  const [postTitle, setPostTitle] = useState("");
  const [postDescription, setPostDescription] = useState("");
  const [postPhoto, setPostPhoto] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postLoading, setPostLoading] = useState(false);
  const [postMessage, setPostMessage] = useState("");
  const [postError, setPostError] = useState("");

  const [posts, setPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(false);

  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editMessage, setEditMessage] = useState("");
  const [editError, setEditError] = useState("");

  const [hideFromPost, setHideFromPost] = useState<Post | null>(null);

  const getToken = () => localStorage.getItem("token");

  const fetchUsers = async () => {
    setManageLoading(true);

    try {
      const res = await axios.get(`${API}/api/admin/users`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      setUsers(res.data.users);
    } catch (err) {
      console.error(err);
    } finally {
      setManageLoading(false);
    }
  };

  const fetchPosts = async () => {
    setPostsLoading(true);

    try {
      const res = await axios.get(`${API}/api/posts/admin/all`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      setPosts(res.data.posts);
    } catch (err) {
      console.error(err);
    } finally {
      setPostsLoading(false);
    }
  };

  const handleCreate = async () => {
    setCreateMessage("");
    setCreateError("");

    if (!username || !password) {
      setCreateError("Username and password are required.");
      return;
    }

    setCreateLoading(true);

    try {
      await axios.post(
        `${API}/api/admin/users`,
        {
          username,
          password,
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      setCreateMessage("✅ User created successfully!");
      setUsername("");
      setPassword("");
    } catch (err: any) {
      setCreateError(
        err.response?.data?.error || "Failed to create user."
      );
    } finally {
      setCreateLoading(false);
    }
  };

  const handleAddPost = async () => {
    setPostMessage("");
    setPostError("");

    if (!postTitle || !postDescription || !postContent) {
      setPostError("Title, description and content are required.");
      return;
    }

    setPostLoading(true);

    try {
      await axios.post(
        `${API}/api/posts`,
        {
          title: postTitle,
          description: postDescription,
          photo: postPhoto,
          content: postContent,
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      setPostMessage("✅ Post created successfully!");

      setPostTitle("");
      setPostDescription("");
      setPostPhoto("");
      setPostContent("");
    } catch (err: any) {
      setPostError(
        err.response?.data?.error || "Failed to create post."
      );
    } finally {
      setPostLoading(false);
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      await axios.delete(`${API}/api/posts/${id}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      setPosts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditPost = async () => {
    if (!editingPost) return;

    setEditMessage("");
    setEditError("");
    setEditLoading(true);

    try {
      const res = await axios.put(
        `${API}/api/posts/${editingPost._id}`,
        {
          title: editingPost.title,
          description: editingPost.description,
          photo: editingPost.photo,
          content: editingPost.content,
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      setEditMessage("✅ Post updated successfully!");

      setPosts((prev) =>
        prev.map((p) =>
          p._id === editingPost._id ? res.data.post : p
        )
      );
    } catch (err: any) {
      setEditError(
        err.response?.data?.error || "Failed to update post."
      );
    } finally {
      setEditLoading(false);
    }
  };

  const handleToggleHide = async (id: string) => {
    try {
      const res = await axios.patch(
        `${API}/api/posts/${id}/toggle-hide`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      setPosts((prev) =>
        prev.map((p) =>
          p._id === id
            ? { ...p, isHidden: res.data.isHidden }
            : p
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleHideFromUser = async (
    postId: string,
    userId: string,
    hide: boolean
  ) => {
    try {
      const res = await axios.patch(
        `${API}/api/posts/${postId}/hide-from-user`,
        {
          userId,
          hide,
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId
            ? { ...p, hiddenFrom: res.data.hiddenFrom }
            : p
        )
      );

      setHideFromPost((prev) =>
        prev
          ? {
              ...prev,
              hiddenFrom: res.data.hiddenFrom,
            }
          : null
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggle = async (id: string) => {
    try {
      const res = await axios.patch(
        `${API}/api/admin/users/${id}/toggle`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      setUsers((prev) =>
        prev.map((u) =>
          u._id === id
            ? {
                ...u,
                isDisabled: res.data.isDisabled,
              }
            : u
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`${API}/api/admin/users/${id}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <>
        <div className="flex flex-row gap-6 p-4">
          {/* ACCOUNT COLUMN */}
          <div className="flex flex-col gap-4 flex-1">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest px-1">
              Account
            </h3>

            <div
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex flex-col gap-2 cursor-pointer hover:shadow-md transition-shadow"
            >
              <h2 className="text-base font-semibold text-gray-900">
                Create Account
              </h2>

              <p className="text-sm text-gray-500">
                Add a new user account to the system.
              </p>
            </div>

            <div
              onClick={() => {
                setIsManageModalOpen(true);
                fetchUsers();
              }}
              className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex flex-col gap-2 cursor-pointer hover:shadow-md transition-shadow"
            >
              <h2 className="text-base font-semibold text-gray-900">
                Manage Accounts
              </h2>

              <p className="text-sm text-gray-500">
                View, edit, or deactivate existing user accounts.
              </p>
            </div>
          </div>

          {/* DATA COLUMN */}
          <div className="flex flex-col gap-4 flex-1">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest px-1">
              Data
            </h3>

            <div
              onClick={() => setIsAddDataModalOpen(true)}
              className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex flex-col gap-2 cursor-pointer hover:shadow-md transition-shadow"
            >
              <h2 className="text-base font-semibold text-gray-900">
                Add Data
              </h2>

              <p className="text-sm text-gray-500">
                Create a new post.
              </p>
            </div>

            <div
              onClick={() => {
                setIsManagePostsModalOpen(true);
                fetchPosts();
                fetchUsers();
              }}
              className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex flex-col gap-2 cursor-pointer hover:shadow-md transition-shadow"
            >
              <h2 className="text-base font-semibold text-gray-900">
                Manage Posts
              </h2>

              <p className="text-sm text-gray-500">
                View, edit, hide and delete posts.
              </p>
            </div>
          </div>
        </div>

        {/* MANAGE POSTS MODAL */}
        {isManagePostsModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  Manage Posts
                </h2>

                <button
                  onClick={() => {
                    setIsManagePostsModalOpen(false);
                    setEditingPost(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="p-6">
                {postsLoading ? (
                  <p>Loading posts...</p>
                ) : posts.length === 0 ? (
                  <p>No posts found.</p>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-500 border-b border-gray-200">
                        <th className="pb-3">Title</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3">Created</th>
                        <th className="pb-3">Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {posts.map((post) => (
                        <tr
                          key={post._id}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          <td className="py-3">
                            {post.title}
                          </td>

                          <td className="py-3">
                            {post.isHidden
                              ? "Hidden"
                              : "Visible"}
                          </td>

                          <td className="py-3">
                            {new Date(
                              post.createdAt
                            ).toLocaleDateString()}
                          </td>

                          <td className="py-3">
                            <div className="flex gap-2 flex-wrap">
                              <button
                                onClick={() =>
                                  setEditingPost(post)
                                }
                                className="px-3 py-1 rounded-md text-xs bg-blue-100"
                              >
                                Edit
                              </button>

                              <button
                                onClick={() =>
                                  handleToggleHide(post._id)
                                }
                                className="px-3 py-1 rounded-md text-xs bg-yellow-100"
                              >
                                Toggle Hide
                              </button>

                              <button
                                onClick={() =>
                                  setHideFromPost(post)
                                }
                                className="px-3 py-1 rounded-md text-xs bg-orange-100"
                              >
                                Hide From
                              </button>

                              <button
                                onClick={() =>
                                  handleDeletePost(post._id)
                                }
                                className="px-3 py-1 rounded-md text-xs bg-red-100"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}
      </>
    </ProtectedRoute>
  );
}