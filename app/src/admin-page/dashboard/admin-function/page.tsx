"use client";

import { useState } from "react";
import axios from "axios";
import ProtectedRoute from "@/app/components/ProtectedRoute";

const API = process.env.NEXT_PUBLIC_API_URL;

/* ──────────────────────────────────────────────
   MODALS OUTSIDE COMPONENT
────────────────────────────────────────────── */

function CreateAccountModal({
  username,
  password,
  setUsername,
  setPassword,
  createLoading,
  createMessage,
  createError,
  handleCreate,
  onClose,
}: any) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Create Account</h2>

          <button onClick={onClose}>✕</button>
        </div>

        <div className="p-6 space-y-4">
          {createMessage && (
            <div className="p-3 bg-green-100 rounded-lg">
              {createMessage}
            </div>
          )}

          {createError && (
            <div className="p-3 bg-red-100 rounded-lg">
              {createError}
            </div>
          )}

          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="w-full border p-3 rounded-lg"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full border p-3 rounded-lg"
          />
        </div>

        <div className="flex justify-end gap-3 p-6 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border"
          >
            Cancel
          </button>

          <button
            onClick={handleCreate}
            disabled={createLoading}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white"
          >
            {createLoading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   MAIN PAGE
────────────────────────────────────────────── */

export default function AdminFunctionPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [createLoading, setCreateLoading] = useState(false);
  const [createMessage, setCreateMessage] = useState("");
  const [createError, setCreateError] = useState("");

  const getToken = () => localStorage.getItem("token");

  const getAuthHeaders = () => ({
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const handleCreate = async () => {
    setCreateMessage("");
    setCreateError("");

    if (!username || !password) {
      setCreateError("Username and password required.");
      return;
    }

    try {
      setCreateLoading(true);

      await axios.post(
        `${API}/api/admin/users`,
        {
          username,
          password,
        },
        getAuthHeaders()
      );

      setCreateMessage("✅ User created successfully");

      setUsername("");
      setPassword("");
    } catch (err: any) {
      setCreateError(
        err.response?.data?.error || "Failed to create user"
      );
    } finally {
      setCreateLoading(false);
    }
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-gray-50 p-8">

        <div
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-white border rounded-xl p-6 cursor-pointer"
        >
          <h2 className="font-semibold">Create Account</h2>
        </div>

        {isCreateModalOpen && (
          <CreateAccountModal
            username={username}
            password={password}
            setUsername={setUsername}
            setPassword={setPassword}
            createLoading={createLoading}
            createMessage={createMessage}
            createError={createError}
            handleCreate={handleCreate}
            onClose={() => {
              setIsCreateModalOpen(false);

              setUsername("");
              setPassword("");
              setCreateError("");
              setCreateMessage("");
            }}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}