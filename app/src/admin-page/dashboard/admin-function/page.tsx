"use client";
// 5
import { useState } from "react";
import axios from "axios";

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
}

export default function AdminFunctionPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [isAddDataModalOpen, setIsAddDataModalOpen] = useState(false);
  const [isManagePostsModalOpen, setIsManagePostsModalOpen] = useState(false);

  // Create account state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [createLoading, setCreateLoading] = useState(false);
  const [createMessage, setCreateMessage] = useState("");
  const [createError, setCreateError] = useState("");

  // Manage accounts state
  const [users, setUsers] = useState<User[]>([]);
  const [manageLoading, setManageLoading] = useState(false);

  // Add data state
  const [postTitle, setPostTitle] = useState("");
  const [postDescription, setPostDescription] = useState("");
  const [postPhoto, setPostPhoto] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postLoading, setPostLoading] = useState(false);
  const [postMessage, setPostMessage] = useState("");
  const [postError, setPostError] = useState("");

  // Manage posts state
  const [posts, setPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(false);

  const getToken = () => localStorage.getItem("token");

  // Fetch all users
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

  // Fetch all posts
  const fetchPosts = async () => {
    setPostsLoading(true);
    try {
      const res = await axios.get(`${API}/api/posts`);
      setPosts(res.data.posts);
    } catch (err: any) {
      console.error(err);
    } finally {
      setPostsLoading(false);
    }
  };

  // Create user
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

  // Create post
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

  // Delete post
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

  // Toggle disable/enable user
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

  // Delete user
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
      <div className="flex flex-row flex-wrap gap-4 p-4">
        {/* Create Account Card */}
        <div
          onClick={() => setIsCreateModalOpen(true)}
          className="flex-1 min-w-[200px] bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex flex-col gap-2 cursor-pointer hover:shadow-md transition-shadow"
        >
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

        {/* Manage Accounts Card */}
        <div
          onClick={() => { setIsManageModalOpen(true); fetchUsers(); }}
          className="flex-1 min-w-[200px] bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex flex-col gap-2 cursor-pointer hover:shadow-md transition-shadow"
        >
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

        {/* Add Data Card */}
        <div
          onClick={() => setIsAddDataModalOpen(true)}
          className="flex-1 min-w-[200px] bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex flex-col gap-2 cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="w-10 h-10 bg-[#D72638]/10 rounded-lg flex items-center justify-center mb-2">
            <svg viewBox="0 0 24 24" fill="none" stroke="#D72638" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </div>
          <h2 className="text-base font-semibold text-gray-900">Add Data</h2>
          <p className="text-sm text-gray-500">Create a new post with title, description, photo and content.</p>
        </div>

        {/* Manage Posts Card */}
        <div
          onClick={() => { setIsManagePostsModalOpen(true); fetchPosts(); }}
          className="flex-1 min-w-[200px] bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex flex-col gap-2 cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="w-10 h-10 bg-[#D72638]/10 rounded-lg flex items-center justify-center mb-2">
            <svg viewBox="0 0 24 24" fill="none" stroke="#D72638" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <path d="M9 17H7A5 5 0 017 7h10a5 5 0 015 5" />
              <path d="M13 21l4-4-4-4" />
              <line x1="17" y1="17" x2="9" y2="17" />
            </svg>
          </div>
          <h2 className="text-base font-semibold text-gray-900">Manage Posts</h2>
          <p className="text-sm text-gray-500">View and delete existing posts.</p>
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
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Manage Posts</h2>
              <button onClick={() => setIsManagePostsModalOpen(false)}
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
                      <th className="pb-3">Description</th>
                      <th className="pb-3">Created</th>
                      <th className="pb-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {posts.map((post) => (
                      <tr key={post._id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 font-medium text-gray-900">{post.title}</td>
                        <td className="py-3 text-gray-500 max-w-[200px] truncate">{post.description}</td>
                        <td className="py-3 text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</td>
                        <td className="py-3">
                          <button onClick={() => handleDeletePost(post._id)}
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
    </>
  );
}