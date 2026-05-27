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
  const [isManagePostsModalOpen, setIsManagePostsModalOpen] = useState(false);

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

  // Edit post state
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editMessage, setEditMessage] = useState("");
  const [editError, setEditError] = useState("");

  // Hide from user state
  const [hideFromPost, setHideFromPost] = useState<Post | null>(null);

  const getToken = () => localStorage.getItem("token");

  const fetchUsers = async () => {
    setManageLoading(true);
    try {
      const res = await axios.get(`${API}/api/admin/users`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setUsers(res.data.users);
    } catch (err: any) {
      console.error(err);
    } finally {
      setManageLoading(false);
    }
  };

  const fetchPosts = async () => {
    setPostsLoading(true);
    try {
      const res = await axios.get(`${API}/api/posts/admin/all`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setPosts(res.data.posts);
    } catch (err: any) {
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
        { username, password },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      setCreateMessage("✅ User created successfully!");
      setUsername("");
      setPassword("");
    } catch (err: any) {
      setCreateError(err.response?.data?.error || "Failed to create user.");
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
        { title: postTitle, description: postDescription, photo: postPhoto, content: postContent },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      setPostMessage("✅ Post created successfully!");
      setPostTitle("");
      setPostDescription("");
      setPostPhoto("");
      setPostContent("");
    } catch (err: any) {
      setPostError(err.response?.data?.error || "Failed to create post.");
    } finally {
      setPostLoading(false);
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      await axios.delete(`${API}/api/posts/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
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
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      setEditMessage("✅ Post updated successfully!");
      setPosts((prev) =>
        prev.map((p) => (p._id === editingPost._id ? res.data.post : p))
      );
    } catch (err: any) {
      setEditError(err.response?.data?.error || "Failed to update post.");
    } finally {
      setEditLoading(false);
    }
  };

  const handleToggleHide = async (id: string) => {
    try {
      const res = await axios.patch(
        `${API}/api/posts/${id}/toggle-hide`,
        {},
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      setPosts((prev) =>
        prev.map((p) => (p._id === id ? { ...p, isHidden: res.data.isHidden } : p))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleHideFromUser = async (postId: string, userId: string, hide: boolean) => {
    try {
      const res = await axios.patch(
        `${API}/api/posts/${postId}/hide-from-user`,
        { userId, hide },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId ? { ...p, hiddenFrom: res.data.hiddenFrom } : p
        )
      );
      setHideFromPost((prev) =>
        prev ? { ...prev, hiddenFrom: res.data.hiddenFrom } : null
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
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      setUsers((prev) =>
        prev.map((u) =>
          u._id === id ? { ...u, isDisabled: res.data.isDisabled } : u
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
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="flex flex-row gap-6 p-4">

        {/* ACCOUNT COLUMN */}
        <div className="flex flex-col gap-4 flex-1">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest px-1">Account</h3>

          <div onClick={() => setIsCreateModalOpen(true)}
            className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex flex-col gap-2 cursor-pointer hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-[#D72638]/10 rounded-lg flex items-center justify-center mb-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="#D72638" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <line x1="19" y1="8" x2="19" y2="14" />
                <line x1="22" y1="11" x2="16" y2="11" />
              </svg>
            </div>
            <h2 className="text-base font-semibold text-gray-900">Create Account</h2>
            <p className="text-sm text-gray-500">Add a new user account to the system.</p>
          </div>

          <div onClick={() => { setIsManageModalOpen(true); fetchUsers(); }}
            className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex flex-col gap-2 cursor-pointer hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-[#D72638]/10 rounded-lg flex items-center justify-center mb-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="#D72638" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
              </svg>
            </div>
            <h2 className="text-base font-semibold text-gray-900">Manage Accounts</h2>
            <p className="text-sm text-gray-500">View, edit, or deactivate existing user accounts.</p>
          </div>
        </div>

        {/* DATA COLUMN */}
        <div className="flex flex-col gap-4 flex-1">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest px-1">Data</h3>

          <div onClick={() => setIsAddDataModalOpen(true)}
            className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex flex-col gap-2 cursor-pointer hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-[#D72638]/10 rounded-lg flex items-center justify-center mb-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="#D72638" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </div>
            <h2 className="text-base font-semibold text-gray-900">Add Data</h2>
            <p className="text-sm text-gray-500">Create a new post with title, description, photo and content.</p>
          </div>

          <div onClick={() => { setIsManagePostsModalOpen(true); fetchPosts(); fetchUsers(); }}
            className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex flex-col gap-2 cursor-pointer hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-[#D72638]/10 rounded-lg flex items-center justify-center mb-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="#D72638" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <path d="M9 17H7A5 5 0 017 7h10a5 5 0 015 5" />
                <path d="M13 21l4-4-4-4" />
                <line x1="17" y1="17" x2="9" y2="17" />
              </svg>
            </div>
            <h2 className="text-base font-semibold text-gray-900">Manage Posts</h2>
            <p className="text-sm text-gray-500">View, edit, hide and delete existing posts.</p>
          </div>
        </div>

      </div>

      {/* Create Account Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Create Account</h2>
              <button onClick={() => { setIsCreateModalOpen(false); setCreateMessage(""); setCreateError(""); }}
                className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 flex flex-col gap-4">
              {createMessage && <p className="text-green-600 text-sm">{createMessage}</p>}
              {createError && <p className="text-red-500 text-sm">{createError}</p>}
              <label className="text-sm font-medium text-gray-700">Username</label>
              <input type="text" placeholder="Enter username" value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D72638]" />
              <label className="text-sm font-medium text-gray-700">Password</label>
              <input type="password" placeholder="Enter password" value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D72638]" />
              <button onClick={handleCreate} disabled={createLoading}
                className="bg-[#C41E1E] text-white py-2 px-4 rounded-md transition-colors hover:bg-[#a31818] disabled:opacity-50 cursor-pointer">
                {createLoading ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manage Accounts Modal */}
      {isManageModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl mx-4">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Manage Accounts</h2>
              <button onClick={() => setIsManageModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              {manageLoading ? (
                <p className="text-gray-500 text-sm">Loading users...</p>
              ) : users.length === 0 ? (
                <p className="text-gray-500 text-sm">No users found.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 border-b border-gray-200">
                      <th className="pb-3">Username</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Created</th>
                      <th className="pb-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 font-medium text-gray-900">{user.username}</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.isDisabled ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}>
                            {user.isDisabled ? "Disabled" : "Active"}
                          </span>
                        </td>
                        <td className="py-3 text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                        <td className="py-3 flex gap-2">
                          <button onClick={() => handleToggle(user._id)}
                            className={`px-3 py-1 rounded-md text-xs font-medium cursor-pointer ${user.isDisabled ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"}`}>
                            {user.isDisabled ? "Enable" : "Disable"}
                          </button>
                          <button onClick={() => handleDelete(user._id)}
                            className="px-3 py-1 rounded-md text-xs font-medium bg-red-100 text-red-700 hover:bg-red-200 cursor-pointer">
                            Delete
                          </button>
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

      {/* Add Data Modal */}
      {isAddDataModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Add Data</h2>
              <button onClick={() => { setIsAddDataModalOpen(false); setPostMessage(""); setPostError(""); }}
                className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 flex flex-col gap-4">
              {postMessage && <p className="text-green-600 text-sm">{postMessage}</p>}
              {postError && <p className="text-red-500 text-sm">{postError}</p>}
              <label className="text-sm font-medium text-gray-700">Title</label>
              <input type="text" placeholder="Enter title" value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D72638]" />
              <label className="text-sm font-medium text-gray-700">Description</label>
              <input type="text" placeholder="Enter description" value={postDescription}
                onChange={(e) => setPostDescription(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D72638]" />
              <label className="text-sm font-medium text-gray-700">Photo URL <span className="text-gray-400">(optional)</span></label>
              <input type="text" placeholder="Enter photo URL" value={postPhoto}
                onChange={(e) => setPostPhoto(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D72638]" />
              <label className="text-sm font-medium text-gray-700">Content</label>
              <textarea placeholder="Enter content" value={postContent}
                onChange={(e) => setPostContent(e.target.value)} rows={5}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D72638] resize-none" />
              <button onClick={handleAddPost} disabled={postLoading}
                className="bg-[#C41E1E] text-white py-2 px-4 rounded-md transition-colors hover:bg-[#a31818] disabled:opacity-50 cursor-pointer">
                {postLoading ? "Saving..." : "Save Post"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manage Posts Modal */}
      {isManagePostsModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Manage Posts</h2>
              <button onClick={() => { setIsManagePostsModalOpen(false); setEditingPost(null); }}
                className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              {postsLoading ? (
                <p className="text-gray-500 text-sm">Loading posts...</p>
              ) : posts.length === 0 ? (
                <p className="text-gray-500 text-sm">No posts found.</p>
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
                      <tr key={post._id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 font-medium text-gray-900 max-w-[150px] truncate">{post.title}</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${post.isHidden ? "bg-gray-100 text-gray-500" : "bg-green-100 text-green-600"}`}>
                            {post.isHidden ? "Hidden" : "Visible"}
                          </span>
                        </td>
                        <td className="py-3 text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</td>
                        <td className="py-3">
                          <div className="flex gap-2 flex-wrap">
                            <button onClick={() => setEditingPost(post)}
                              className="px-3 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 cursor-pointer">
                              Edit
                            </button>
                            <button onClick={() => handleToggleHide(post._id)}
                              className={`px-3 py-1 rounded-md text-xs font-medium cursor-pointer ${post.isHidden ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"}`}>
                              {post.isHidden ? "Show All" : "Hide All"}
                            </button>
                            <button onClick={() => setHideFromPost(post)}
                              className="px-3 py-1 rounded-md text-xs font-medium bg-orange-100 text-orange-700 hover:bg-orange-200 cursor-pointer">
                              Hide From
                            </button>
                            <button onClick={() => handleDeletePost(post._id)}
                              className="px-3 py-1 rounded-md text-xs font-medium bg-red-100 text-red-700 hover:bg-red-200 cursor-pointer">
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

      {/* Edit Post Modal */}
      {editingPost && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Edit Post</h2>
              <button onClick={() => { setEditingPost(null); setEditMessage(""); setEditError(""); }}
                className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 flex flex-col gap-4">
              {editMessage && <p className="text-green-600 text-sm">{editMessage}</p>}
              {editError && <p className="text-red-500 text-sm">{editError}</p>}
              <label className="text-sm font-medium text-gray-700">Title</label>
              <input type="text" value={editingPost.title}
                onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D72638]" />
              <label className="text-sm font-medium text-gray-700">Description</label>
              <input type="text" value={editingPost.description}
                onChange={(e) => setEditingPost({ ...editingPost, description: e.target.value })}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D72638]" />
              <label className="text-sm font-medium text-gray-700">Photo URL <span className="text-gray-400">(optional)</span></label>
              <input type="text" value={editingPost.photo}
                onChange={(e) => setEditingPost({ ...editingPost, photo: e.target.value })}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D72638]" />
              <label className="text-sm font-medium text-gray-700">Content</label>
              <textarea value={editingPost.content} rows={5}
                onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D72638] resize-none" />
              <button onClick={handleEditPost} disabled={editLoading}
                className="bg-[#C41E1E] text-white py-2 px-4 rounded-md hover:bg-[#a31818] disabled:opacity-50 cursor-pointer">
                {editLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hide From User Modal */}
      {hideFromPost && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Hide From Users</h2>
              <button onClick={() => setHideFromPost(null)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-500 mb-4">
                Hide <span className="font-semibold text-gray-700">"{hideFromPost.title}"</span> from specific users:
              </p>
              {users.length === 0 ? (
                <p className="text-sm text-gray-400">No users found.</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {users.map((user) => {
                    const isHidden = hideFromPost.hiddenFrom?.includes(user._id);
                    return (
                      <div key={user._id} className="flex items-center justify-between px-4 py-3 rounded-xl border border-gray-100 hover:bg-gray-50">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{user.username}</p>
                          <p className="text-xs text-gray-400">{user.isDisabled ? "Disabled" : "Active"}</p>
                        </div>
                        <button
                          onClick={() => handleHideFromUser(hideFromPost._id, user._id, !isHidden)}
                          className={`px-3 py-1 rounded-md text-xs font-medium cursor-pointer ${isHidden ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-orange-100 text-orange-700 hover:bg-orange-200"}`}>
                          {isHidden ? "Unhide" : "Hide"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}