"use client";

import { useState, useEffect } from "react";
import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL;

interface User {
  _id: string;
  username: string;
  role: string;
  isDisabled: boolean;
  createdAt: string;
}

export default function AdminFunctionPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);

  // Create account state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [createLoading, setCreateLoading] = useState(false);
  const [createMessage, setCreateMessage] = useState("");
  const [createError, setCreateError] = useState("");

  // Manage accounts state
  const [users, setUsers] = useState<User[]>([]);
  const [manageLoading, setManageLoading] = useState(false);

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

  // Toggle disable/enable
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
      <div className="flex flex-row gap-4 p-4">
        {/* Create Account Card */}
        <div
          onClick={() => setIsCreateModalOpen(true)}
          className="flex-1 bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex flex-col gap-2 cursor-pointer hover:shadow-md transition-shadow"
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
          className="flex-1 bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex flex-col gap-2 cursor-pointer hover:shadow-md transition-shadow"
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
              <input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D72638]"
              />
              <label className="text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D72638]"
              />
              <button
                onClick={handleCreate}
                disabled={createLoading}
                className="bg-[#C41E1E] text-white py-2 px-4 rounded-md transition-colors hover:bg-[#a31818] disabled:opacity-50 cursor-pointer"
              >
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
                          <button
                            onClick={() => handleToggle(user._id)}
                            className={`px-3 py-1 rounded-md text-xs font-medium cursor-pointer ${user.isDisabled ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"}`}
                          >
                            {user.isDisabled ? "Enable" : "Disable"}
                          </button>
                          <button
                            onClick={() => handleDelete(user._id)}
                            className="px-3 py-1 rounded-md text-xs font-medium bg-red-100 text-red-700 hover:bg-red-200 cursor-pointer"
                          >
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