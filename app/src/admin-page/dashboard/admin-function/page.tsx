"use client";

import { useState, useEffect } from "react";
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
  createdBy?: string;
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

  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editMessage, setEditMessage] = useState("");
  const [editError, setEditError] = useState("");

  const [hideFromPost, setHideFromPost] = useState<Post | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string>("");

  const getToken = () => localStorage.getItem("token");

  // Helper function to get auth headers
  const getAuthHeaders = () => ({
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const fetchUsers = async () => {
    setManageLoading(true);

    try {
      const res = await axios.get(`${API}/api/admin/users`, getAuthHeaders());
      setUsers(res.data.users);
    } catch (err: any) {
      console.error("Error fetching users:", err.response?.data || err);
      if (err.response?.status === 403) {
        alert("You don't have permission to view users. Admin access required.");
      }
    } finally {
      setManageLoading(false);
    }
  };

  const fetchPosts = async () => {
    setPostsLoading(true);

    try {
      const res = await axios.get(`${API}/api/posts/admin/all`, getAuthHeaders());
      setPosts(res.data.posts);
    } catch (err: any) {
      console.error("Error fetching posts:", err.response?.data || err);
      if (err.response?.status === 403) {
        alert("You don't have permission to view posts. Admin access required.");
      }
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
        getAuthHeaders()
      );

      setCreateMessage("✅ User created successfully!");
      setUsername("");
      setPassword("");
      
      // Refresh user list if modal is open
      if (isManageModalOpen) {
        fetchUsers();
      }
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
          photo: postPhoto || "",
          content: postContent,
        },
        getAuthHeaders()
      );

      setPostMessage("✅ Post created successfully!");
      
      setPostTitle("");
      setPostDescription("");
      setPostPhoto("");
      setPostContent("");
      
      // Refresh posts list if modal is open
      if (isManagePostsModalOpen) {
        fetchPosts();
      }
      
      // Auto-close modal after 2 seconds
      setTimeout(() => {
        setIsAddDataModalOpen(false);
        setPostMessage("");
      }, 2000);
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
      await axios.delete(`${API}/api/posts/${id}`, getAuthHeaders());
      setPosts((prev) => prev.filter((p) => p._id !== id));
    } catch (err: any) {
      console.error("Error deleting post:", err.response?.data || err);
      alert("Failed to delete post. " + (err.response?.data?.error || ""));
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
          photo: editingPost.photo || "",
          content: editingPost.content,
        },
        getAuthHeaders()
      );

      setEditMessage("✅ Post updated successfully!");
      
      setPosts((prev) =>
        prev.map((p) =>
          p._id === editingPost._id ? res.data.post : p
        )
      );
      
      // Close edit modal after 1 second
      setTimeout(() => {
        setEditingPost(null);
        setEditMessage("");
      }, 1000);
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
        getAuthHeaders()
      );

      setPosts((prev) =>
        prev.map((p) =>
          p._id === id
            ? { ...p, isHidden: res.data.isHidden }
            : p
        )
      );
    } catch (err: any) {
      console.error("Error toggling hide:", err.response?.data || err);
      alert("Failed to toggle post visibility. " + (err.response?.data?.error || ""));
    }
  };

  const handleHideFromUser = async (
    postId: string,
    userId: string,
    hide: boolean
  ) => {
    if (!userId) {
      alert("Please select a user first");
      return;
    }

    try {
      const res = await axios.patch(
        `${API}/api/posts/${postId}/hide-from-user`,
        {
          userId,
          hide,
        },
        getAuthHeaders()
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
      
      alert(`Post ${hide ? "hidden from" : "made visible to"} user successfully`);
    } catch (err: any) {
      console.error("Error updating user visibility:", err.response?.data || err);
      alert("Failed to update post visibility for user. " + (err.response?.data?.error || ""));
    }
  };

  const handleToggle = async (id: string) => {
    try {
      const res = await axios.patch(
        `${API}/api/admin/users/${id}/toggle`,
        {},
        getAuthHeaders()
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
    } catch (err: any) {
      console.error("Error toggling user:", err.response?.data || err);
      alert("Failed to toggle user status. " + (err.response?.data?.error || ""));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`${API}/api/admin/users/${id}`, getAuthHeaders());
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err: any) {
      console.error("Error deleting user:", err.response?.data || err);
      alert("Failed to delete user. " + (err.response?.data?.error || ""));
    }
  };

  // Create Account Modal
  const CreateAccountModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Create Account</h2>
          <button
            onClick={() => {
              setIsCreateModalOpen(false);
              setUsername("");
              setPassword("");
              setCreateMessage("");
              setCreateError("");
            }}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
        
        <div className="p-6">
          {createMessage && (
            <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm">
              {createMessage}
            </div>
          )}
          
          {createError && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
              {createError}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter username"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter password"
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={() => setIsCreateModalOpen(false)}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={createLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {createLoading ? "Creating..." : "Create User"}
          </button>
        </div>
      </div>
    </div>
  );

  // Manage Accounts Modal
  const ManageAccountsModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Manage Accounts</h2>
          <button
            onClick={() => setIsManageModalOpen(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
        
        <div className="p-6">
          {manageLoading ? (
            <p>Loading users...</p>
          ) : users.length === 0 ? (
            <p>No users found.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-200">
                  <th className="pb-3">Username</th>
                  <th className="pb-3">Role</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Created</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3">{user.username}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.role === 'admin' 
                          ? 'bg-purple-100 text-purple-700' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.isDisabled 
                          ? 'bg-red-100 text-red-700' 
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {user.isDisabled ? "Disabled" : "Active"}
                      </span>
                    </td>
                    <td className="py-3">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleToggle(user._id)}
                          className="px-3 py-1 rounded-md text-xs bg-yellow-100 hover:bg-yellow-200"
                        >
                          {user.isDisabled ? "Enable" : "Disable"}
                        </button>
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="px-3 py-1 rounded-md text-xs bg-red-100 hover:bg-red-200"
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
  );

  // Add Data Modal
  const AddDataModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Add New Post</h2>
          <button
            onClick={() => {
              setIsAddDataModalOpen(false);
              setPostTitle("");
              setPostDescription("");
              setPostPhoto("");
              setPostContent("");
              setPostMessage("");
              setPostError("");
            }}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
        
        <div className="p-6">
          {postMessage && (
            <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm">
              {postMessage}
            </div>
          )}
          
          {postError && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
              {postError}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter post title"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                value={postDescription}
                onChange={(e) => setPostDescription(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter post description"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Photo URL
              </label>
              <input
                type="text"
                value={postPhoto}
                onChange={(e) => setPostPhoto(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter photo URL (optional)"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content *
              </label>
              <textarea
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter post content"
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={() => setIsAddDataModalOpen(false)}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAddPost}
            disabled={postLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {postLoading ? "Creating..." : "Create Post"}
          </button>
        </div>
      </div>
    </div>
  );

  // Edit Post Modal
  const EditPostModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Edit Post</h2>
          <button
            onClick={() => {
              setEditingPost(null);
              setEditMessage("");
              setEditError("");
            }}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
        
        <div className="p-6">
          {editMessage && (
            <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm">
              {editMessage}
            </div>
          )}
          
          {editError && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
              {editError}
            </div>
          )}
          
          {editingPost && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={editingPost.title}
                  onChange={(e) => setEditingPost({...editingPost, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  value={editingPost.description}
                  onChange={(e) => setEditingPost({...editingPost, description: e.target.value})}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Photo URL
                </label>
                <input
                  type="text"
                  value={editingPost.photo}
                  onChange={(e) => setEditingPost({...editingPost, photo: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content *
                </label>
                <textarea
                  value={editingPost.content}
                  onChange={(e) => setEditingPost({...editingPost, content: e.target.value})}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}
        </div>
        
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={() => setEditingPost(null)}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleEditPost}
            disabled={editLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {editLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );

  // Hide From User Modal
  const HideFromUserModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Hide Post From User: {hideFromPost?.title}
          </h2>
          <button
            onClick={() => {
              setHideFromPost(null);
              setSelectedUserId("");
            }}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select User
              </label>
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a user...</option>
                {users.filter(u => u.role !== 'admin').map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.username} {user.isDisabled ? "(Disabled)" : ""}
                  </option>
                ))}
              </select>
            </div>
            
            {hideFromPost && selectedUserId && (
              <div className="flex gap-3">
                <button
                  onClick={() => handleHideFromUser(hideFromPost._id, selectedUserId, true)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Hide from User
                </button>
                <button
                  onClick={() => handleHideFromUser(hideFromPost._id, selectedUserId, false)}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Show to User
                </button>
              </div>
            )}
            
            {hideFromPost && hideFromPost.hiddenFrom.length > 0 && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Currently hidden from:
                </p>
                <div className="flex flex-wrap gap-2">
                  {hideFromPost.hiddenFrom.map((userId) => {
                    const user = users.find(u => u._id === userId);
                    return user ? (
                      <span key={userId} className="px-2 py-1 bg-gray-200 rounded-md text-xs">
                        {user.username}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Manage Posts Modal
  const ManagePostsModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-5xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Manage Posts</h2>
          <button
            onClick={() => {
              setIsManagePostsModalOpen(false);
              setEditingPost(null);
              setHideFromPost(null);
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
                  <tr key={post._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 font-medium">{post.title}</td>
                    <td className="py-3">
                      {post.isHidden ? (
                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">Hidden</span>
                      ) : (
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">Visible</span>
                      )}
                    </td>
                    <td className="py-3">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3">
                      <div className="flex gap-2 flex-wrap">
                        <button
                          onClick={() => setEditingPost(post)}
                          className="px-3 py-1 rounded-md text-xs bg-blue-100 hover:bg-blue-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleToggleHide(post._id)}
                          className="px-3 py-1 rounded-md text-xs bg-yellow-100 hover:bg-yellow-200"
                        >
                          Toggle Hide
                        </button>
                        <button
                          onClick={() => {
                            setHideFromPost(post);
                            fetchUsers();
                          }}
                          className="px-3 py-1 rounded-md text-xs bg-orange-100 hover:bg-orange-200"
                        >
                          Hide From
                        </button>
                        <button
                          onClick={() => handleDeletePost(post._id)}
                          className="px-3 py-1 rounded-md text-xs bg-red-100 hover:bg-red-200"
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
  );

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-gray-50">
        <div className="flex flex-row gap-6 p-8">
          {/* ACCOUNT COLUMN */}
          <div className="flex flex-col gap-4 flex-1">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest px-1">
              Account Management
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
              Content Management
            </h3>

            <div
              onClick={() => setIsAddDataModalOpen(true)}
              className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex flex-col gap-2 cursor-pointer hover:shadow-md transition-shadow"
            >
              <h2 className="text-base font-semibold text-gray-900">
                Add Post
              </h2>
              <p className="text-sm text-gray-500">
                Create a new blog post.
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
                View, edit, hide, and delete posts.
              </p>
            </div>
          </div>
        </div>

        {/* Modals */}
        {isCreateModalOpen && <CreateAccountModal />}
        {isManageModalOpen && <ManageAccountsModal />}
        {isAddDataModalOpen && <AddDataModal />}
        {isManagePostsModalOpen && <ManagePostsModal />}
        {editingPost && <EditPostModal />}
        {hideFromPost && <HideFromUserModal />}
      </div>
    </ProtectedRoute>
  );
}