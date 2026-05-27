"use client";

// app/src/admin-page/dashboard/documents/page.tsx
// ─────────────────────────────────────────────────────────────
// Admin Documents page
//
// Features:
//   • Search bar + Search button (full width)
//   • Upload button → opens UploadModal (drag & drop + file browse)
//   • Document list with delete trash icon per row
//   • Delete confirmation modal (Cancel / Yes)
//
// DATA: every value marked // DATA — replace with real API calls.
// ─────────────────────────────────────────────────────────────

import React, { useState, useRef, useEffect } from "react";
import { AppShell } from "@/app/components/ui/Appshell";
import { Button } from "@/app/components/ui/Button";
import { cn } from "@/app/lib/utils";
import Modal from "@/app/components/ui/Modal";
import ProtectedRoute from "@/app/components/ProtectedRoute";

// ══════════════════════════════════════════════════════════════
// TYPES
// ══════════════════════════════════════════════════════════════
interface DocumentItem {
  id: string;
  title: string; // DATA: document.title
  date: string; // DATA: document.createdAt formatted
  fileUrl?: string; // DATA: document.fileUrl
}

// ══════════════════════════════════════════════════════════════
// PLACEHOLDER DATA — replace with real API
// ══════════════════════════════════════════════════════════════
const INITIAL_DOCUMENTS: DocumentItem[] = [
  {
    id: "1",
    title: "Suggestion to add more categories in Flow Guide.",
    date: "May 20, 2026 • 10:30 AM",
  },
  {
    id: "2",
    title: "Document OCR accuracy can be improved.",
    date: "May 19, 2026 • 04:15 PM",
  },
  {
    id: "3",
    title: "Need access to more reference articles.",
    date: "May 18, 2026 • 11:20 AM",
  },
  {
    id: "4",
    title: "Need access to more reference articles.",
    date: "May 18, 2026 • 11:20 AM",
  },
  {
    id: "5",
    title: "Need access to more reference articles.",
    date: "May 18, 2026 • 11:20 AM",
  },
  {
    id: "6",
    title: "Need access to more reference articles.",
    date: "May 18, 2026 • 11:20 AM",
  },
  {
    id: "7",
    title: "Need access to more reference articles.",
    date: "May 18, 2026 • 11:20 AM",
  },
  {
    id: "8",
    title: "Need access to more reference articles.",
    date: "May 18, 2026 • 11:20 AM",
  },
  {
    id: "9",
    title: "Need access to more reference articles.",
    date: "May 18, 2026 • 11:20 AM",
  },
  {
    id: "10",
    title: "Need access to more reference articles.",
    date: "May 18, 2026 • 11:20 AM",
  },
];

// ══════════════════════════════════════════════════════════════
// ICONS
// ══════════════════════════════════════════════════════════════
const DocFileIcon = () => (
  <svg
    className="w-5 h-5 shrink-0"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);
const SearchIcon = () => (
  <svg
    className="w-4 h-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const PlusIcon = () => (
  <svg
    className="w-4 h-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.5}
    strokeLinecap="round"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const TrashIcon = () => (
  <svg
    className="w-4 h-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
  </svg>
);
const XIcon = () => (
  <svg
    className="w-4 h-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const UploadCloudIcon = () => (
  <svg
    className="w-10 h-10"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="16 16 12 12 8 16" />
    <line x1="12" y1="12" x2="12" y2="21" />
    <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3" />
  </svg>
);
const DiamondIcon = () => (
  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l10 10-10 10L2 12z" />
  </svg>
);
interface DocumentItem {
  id: string;
  title: string;
  date: string;
  fileUrl?: string;
  body?: string; // ← add
  images?: string[]; // ← add
}

// ══════════════════════════════════════════════════════════════
// UPLOAD MODAL
// ══════════════════════════════════════════════════════════════
const UploadModal: React.FC<{
  onClose: () => void;
  onUpload: (files: File[]) => void;
}> = ({ onClose, onUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setFiles((prev) => [...prev, ...Array.from(e.dataTransfer.files)]);
  };
  const handleBrowse = () => fileInputRef.current?.click();
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files)
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
  };
  const removeFile = (idx: number) =>
    setFiles((prev) => prev.filter((_, i) => i !== idx));

  // ── Upload handler ─────────────────────────────────────────
  // TODO: replace the simulated delay with your real upload API:
  // const formData = new FormData();
  // files.forEach(f => formData.append("files", f));
  // await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/documents/upload`, {
  //   method: "POST", body: formData,
  //   headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  // });
  const handleUpload = async () => {
    if (files.length === 0) return;
    setIsUploading(true);
    try {
      await new Promise((r) => setTimeout(r, 1000)); // simulate upload
      onUpload(files);
      onClose();
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl font-[family-name:var(--font-sans)]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">Upload</h2>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors focus:outline-none"
          >
            <XIcon />
          </button>
        </div>

        <div className="px-5 py-5 space-y-4">
          {/* Drop zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleBrowse}
            className={cn(
              "flex flex-col items-center justify-center gap-3 rounded-xl",
              "border-2 border-dashed transition-all duration-200 cursor-pointer",
              "py-10 px-6 text-center",
              isDragging
                ? "border-[#D72638] bg-[#FEF0F1]"
                : "border-gray-300 bg-gray-50 hover:border-[#D72638]/50 hover:bg-[#FEF0F1]/30",
            )}
          >
            <span
              className={cn(
                "transition-colors duration-200",
                isDragging ? "text-[#D72638]" : "text-[#D72638]/60",
              )}
            >
              <UploadCloudIcon />
            </span>
            <p className="text-sm text-gray-500 leading-relaxed">
              Drag or drop files, or{" "}
              <span className="text-[#D72638] font-semibold underline">
                Browse
              </span>
            </p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFileInput}
            />
          </div>

          {/* Selected file list */}
          {files.length > 0 && (
            <ul className="space-y-1.5 max-h-32 overflow-y-auto">
              {files.map((file, idx) => (
                <li
                  key={idx}
                  className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-gray-50 border border-gray-100"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-[#D72638] shrink-0">
                      <DocFileIcon />
                    </span>
                    <span className="text-xs text-gray-700 truncate">
                      {file.name}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(idx);
                    }}
                    className="text-gray-400 hover:text-[#D72638] transition-colors focus:outline-none shrink-0"
                  >
                    <XIcon />
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* Upload button */}
          <Button
            label="Upload"
            variant="primary"
            size="md"
            fullWidth
            isLoading={isUploading}
            disabled={files.length === 0}
            onClick={handleUpload}
          />
        </div>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// DELETE CONFIRMATION MODAL
// ══════════════════════════════════════════════════════════════
const DeleteModal: React.FC<{
  onCancel: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
}> = ({ onCancel, onConfirm, isDeleting = false }) => {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
      if (e.key === "Enter" && !isDeleting) onConfirm();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onCancel, onConfirm, isDeleting]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div className="w-full max-w-xs bg-white rounded-2xl shadow-2xl p-5 font-[family-name:var(--font-sans)]">
        {/* Title with diamond icon — matches the image */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[#D72638]">
            <DiamondIcon />
          </span>
          <h2 className="text-base font-bold text-gray-900">Delete</h2>
        </div>

        <p className="text-sm text-gray-500 mb-5 leading-relaxed">
          Are you sure you want to delete this Documents?
        </p>

        <div className="flex items-center justify-end gap-2">
          <Button
            label="Cancel"
            variant="outline"
            size="sm"
            onClick={onCancel}
            disabled={isDeleting}
          />
          <Button
            label="Yes"
            variant="primary"
            size="sm"
            isLoading={isDeleting}
            onClick={onConfirm}
          />
        </div>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// DOCUMENT CARD ROW
// ══════════════════════════════════════════════════════════════
const DocumentCard: React.FC<{
  item: DocumentItem;
  onDelete: (item: DocumentItem) => void;
  onClick: (item: DocumentItem) => void;
}> = ({ item, onDelete, onClick }) => (
  <div
    className={cn(
      "flex items-center gap-3 px-4 py-3 rounded-xl",
      "border border-gray-200 bg-white",
      "hover:border-[#D72638]/40 hover:shadow-sm",
      "transition-all duration-150 group",
    )}
  >
    {/* Left: icon + text — clicking opens detail view */}
    <button
      type="button"
      onClick={() => onClick(item)}
      className="flex items-center gap-3 flex-1 min-w-0 text-left focus:outline-none"
    >
      <div className="text-[#D72638] shrink-0">
        <DocFileIcon />
      </div>
      <div className="flex-1 min-w-0">
        {/* DATA: document.title */}
        <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-[#D72638] transition-colors duration-150">
          {item.title}
        </p>
        {/* DATA: document.createdAt */}
        <p className="text-xs text-gray-400 mt-0.5">{item.date}</p>
      </div>
    </button>

    {/* Right: red delete button */}
    <button
      type="button"
      onClick={() => onDelete(item)}
      aria-label={`Delete ${item.title}`}
      className={cn(
        "shrink-0 w-8 h-8 flex items-center justify-center rounded-lg",
        "text-[#D72638]/50 hover:text-[#D72638] hover:bg-[#FEF0F1]",
        "transition-all duration-150 focus:outline-none",
        "focus-visible:ring-2 focus-visible:ring-[#D72638]/30",
      )}
    >
      <TrashIcon />
    </button>
  </div>
);

// ══════════════════════════════════════════════════════════════
// ADMIN DOCUMENTS PAGE
// ══════════════════════════════════════════════════════════════
export default function AdminDocumentsPage() {
  const username = "Admin"; // DATA: auth context → user.name
  const notifCount = 5; // DATA: notification API → unread count

  const [documents, setDocuments] = useState<DocumentItem[]>(INITIAL_DOCUMENTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<DocumentItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null);

  // Client-side filter — DATA: replace with real API call
  const visibleDocs = documents.filter(
    (doc) =>
      searchQuery.trim() === "" ||
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // ── Search ─────────────────────────────────────────────────
  // TODO: replace with API call
  const handleSearch = () => {
    console.log("Search:", searchQuery);
  };

  // ── Upload callback ────────────────────────────────────────
  // TODO: re-fetch from API instead of inserting local mock items
  const handleUpload = (files: File[]) => {
    const newDocs: DocumentItem[] = files.map((file, i) => ({
      id: `new-${Date.now()}-${i}`,
      title: file.name,
      date: new Date().toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }),
    }));
    setDocuments((prev) => [...newDocs, ...prev]);
  };

  // ── Delete confirm ─────────────────────────────────────────
  // TODO: call DELETE /api/documents/:id then refresh list
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await new Promise((r) => setTimeout(r, 600)); // simulate API
      setDocuments((prev) => prev.filter((d) => d.id !== deleteTarget.id));
      setDeleteTarget(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <AppShell
        variant="dashboard"
        pageTitle="Documents"
        username={username}
        notifCount={notifCount}
        showSearch={false}
      >
        <div className="w-full space-y-4">
          {/* ── Search bar ────────────────────────────────────── */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none [&>svg]:w-4 [&>svg]:h-4">
                <SearchIcon />
              </span>
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Search article, document..."
                className={cn(
                  "w-full h-10 pl-9 pr-3 rounded-xl border border-gray-200 bg-white",
                  "text-sm text-gray-900 placeholder-gray-400",
                  "focus:outline-none focus:ring-2 focus:ring-[#D72638]/20 focus:border-[#D72638]",
                  "transition-all duration-200 [&::-webkit-search-cancel-button]:hidden",
                )}
              />
            </div>
            <Button
              label="Search"
              variant="primary"
              size="md"
              leftIcon={<SearchIcon />}
              onClick={handleSearch}
              className="shrink-0"
            />
          </div>

          {/* ── Upload button ──────────────────────────────────── */}
          <Button
            label="Upload"
            variant="outline"
            size="sm"
            leftIcon={<PlusIcon />}
            onClick={() => setUploadOpen(true)}
          />

          {/* ── Document list ──────────────────────────────────── */}
          <div className="rounded-2xl border border-[#D72638]/30 bg-white p-4">
            {visibleDocs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-12 h-12 rounded-full bg-[#FEF0F1] flex items-center justify-center text-[#D72638] mb-4">
                  <DocFileIcon />
                </div>
                <p className="text-sm font-semibold text-gray-700">
                  No documents found
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {searchQuery
                    ? `No results for "${searchQuery}"`
                    : "Upload a document to get started."}
                </p>
              </div>
            ) : (
              // DATA: replace visibleDocs with real API data
              <div className="space-y-2">
                {visibleDocs.map((doc) => (
                  <DocumentCard
                    key={doc.id}
                    item={doc}
                    onDelete={(d) => setDeleteTarget(d)}
                    onClick={(d) => setSelectedDoc(d)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Upload Modal ───────────────────────────────────── */}
        {uploadOpen && (
          <UploadModal
            onClose={() => setUploadOpen(false)}
            onUpload={handleUpload}
          />
        )}

        {/* ── Delete Confirmation Modal ──────────────────────── */}
        {deleteTarget && (
          <DeleteModal
            onCancel={() => setDeleteTarget(null)}
            onConfirm={handleDeleteConfirm}
            isDeleting={isDeleting}
          />
        )}

        <Modal
          isOpen={!!selectedDoc}
          onClose={() => setSelectedDoc(null)}
          title={selectedDoc?.title ?? ""}
          body={selectedDoc?.body}
          date={selectedDoc?.date}
          images={selectedDoc?.images}
        />
      </AppShell>
    </ProtectedRoute>
  );
}
