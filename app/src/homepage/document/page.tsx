"use client";

// app/documents/page.tsx
// ─────────────────────────────────────────────────────────────
// Documents page — user-facing
//
// Layout:
//   AppShell (home sidebar) wraps the content
//   Two tab buttons: Medical Records | Prescriptions
//   Scrollable list of document cards (icon + title + date)
//
// DATA:
//   Every value marked // DATA — replace with your real API calls.
//   Active tab filters which document list is shown.
// ─────────────────────────────────────────────────────────────

import React, { useState } from "react";
import { AppShell } from "@/app/components/ui/Appshell";
import { Card } from "@/app/components/ui/Card";
import { cn } from "@/app/lib/utils";

// ── Types ──────────────────────────────────────────────────────
type DocumentTab = "medical-records" | "prescriptions";

interface DocumentItem {
  id: string;
  title: string; // DATA: document.title from API
  date: string; // DATA: document.createdAt formatted
  category: DocumentTab;
}

// ── Document icon ──────────────────────────────────────────────
const DocFileIcon = () => (
  <svg
    className="w-6 h-6 shrink-0"
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
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

// ── PLACEHOLDER DATA — replace with your real API response ─────
// Structure: fetch documents filtered by the active tab/category.
// e.g. const { data } = useDocuments({ category: activeTab });
const SAMPLE_DOCUMENTS: DocumentItem[] = [
  {
    id: "1",
    title: "Suggestion to add more categories in Flow Guide.",
    date: "May 20, 2026 • 10:30 AM",
    category: "medical-records",
  },
  {
    id: "2",
    title: "Document OCR accuracy can be improved.",
    date: "May 19, 2026 • 04:15 PM",
    category: "medical-records",
  },
  {
    id: "3",
    title: "Need access to more reference articles.",
    date: "May 18, 2026 • 11:20 AM",
    category: "medical-records",
  },
  {
    id: "4",
    title: "Need access to more reference articles.",
    date: "May 18, 2026 • 11:20 AM",
    category: "medical-records",
  },
  {
    id: "5",
    title: "Need access to more reference articles.",
    date: "May 18, 2026 • 11:20 AM",
    category: "medical-records",
  },
  {
    id: "6",
    title: "Need access to more reference articles.",
    date: "May 18, 2026 • 11:20 AM",
    category: "medical-records",
  },
  {
    id: "7",
    title: "Need access to more reference articles.",
    date: "May 18, 2026 • 11:20 AM",
    category: "medical-records",
  },
  {
    id: "8",
    title: "Need access to more reference articles.",
    date: "May 18, 2026 • 11:20 AM",
    category: "medical-records",
  },
  {
    id: "9",
    title: "Need access to more reference articles.",
    date: "May 18, 2026 • 11:20 AM",
    category: "medical-records",
  },
  {
    id: "10",
    title: "Need access to more reference articles.",
    date: "May 18, 2026 • 11:20 AM",
    category: "medical-records",
  },
  // ── Prescriptions tab data ─────────────────────────────────
  {
    id: "11",
    title: "Prescription — Amoxicillin 500mg.",
    date: "May 20, 2026 • 09:00 AM",
    category: "prescriptions",
  },
  {
    id: "12",
    title: "Prescription — Metformin 1000mg.",
    date: "May 17, 2026 • 02:30 PM",
    category: "prescriptions",
  },
  {
    id: "13",
    title: "Prescription — Lisinopril 10mg.",
    date: "May 15, 2026 • 11:00 AM",
    category: "prescriptions",
  },
];

// ── Tab button ─────────────────────────────────────────────────
// active  → filled red background, white text
// inactive → transparent background, gray text, red border
const TabButton: React.FC<{
  label: string;
  active: boolean;
  onClick: () => void;
}> = ({ label, active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      // Base
      "flex-1 py-2.5 px-6 rounded-lg text-sm font-semibold",
      "transition-all duration-200 focus:outline-none",
      "focus-visible:ring-2 focus-visible:ring-[#D72638]/40",
      // Active state — filled red
      active
        ? "bg-[#D72638] text-white shadow-sm"
        : "bg-transparent text-gray-500 hover:text-[#D72638]",
    )}
  >
    {label}
  </button>
);

// ── Document card row ──────────────────────────────────────────
// Each document is a bordered card with an icon, title, and date.
// onClick: wire to open document details / modal when ready.
const DocumentCard: React.FC<{
  item: DocumentItem;
  onClick: (id: string) => void;
}> = ({ item, onClick }) => (
  <Card
    variant="bordered"
    padding="sm"
    onClick={() => onClick(item.id)}
    className={cn(
      "flex items-center gap-3 px-4 py-3",
      "border border-gray-200 hover:border-[#D72638]/40",
      "cursor-pointer group transition-all duration-150",
    )}
  >
    {/* Document icon */}
    <div className="text-[#D72638] [&>svg]:w-6 [&>svg]:h-6 shrink-0">
      <DocFileIcon />
    </div>

    {/* Text content */}
    <div className="flex-1 min-w-0">
      {/* DATA: document.title */}
      <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-[#D72638] transition-colors duration-150">
        {item.title}
      </p>
      {/* DATA: document.createdAt */}
      <p className="text-xs text-gray-400 mt-0.5">{item.date}</p>
    </div>
  </Card>
);

// ── DOCUMENTS PAGE ─────────────────────────────────────────────
export default function DocumentsPage() {
  // DATA: replace with auth context
  const username = "Urdanetz"; // DATA: auth context → user.name
  const notifCount = 3; // DATA: notification API → unread count

  // Active tab state
  // When you wire up the API, pass activeTab as a filter param to your fetch.
  const [activeTab, setActiveTab] = useState<DocumentTab>("medical-records");

  // Filter documents by active tab
  // DATA: replace this filter with a real API call scoped to activeTab
  const visibleDocs = SAMPLE_DOCUMENTS.filter((d) => d.category === activeTab);

  // ── Document click handler ─────────────────────────────────
  // TODO: navigate to document detail page or open a modal
  const handleDocumentClick = (id: string) => {
    console.log("Open document:", id);
    // e.g. navigate("documentDetail", { id })
  };

  return (
    <AppShell
      variant="home"
      pageTitle="Documents"
      username={username}
      notifCount={notifCount}
      showSearch
    >
      {/* ── Tab switcher ───────────────────────────────────── */}
      {/* Centered pill container with a subtle border */}
      <div className="flex justify-center mb-6">
        <div
          className={cn(
            "inline-flex items-center gap-1 p-1 rounded-xl",
            "border border-gray-200 bg-white shadow-sm",
            "w-full max-w-sm",
          )}
        >
          <TabButton
            label="Medical Records"
            active={activeTab === "medical-records"}
            onClick={() => setActiveTab("medical-records")}
          />
          <TabButton
            label="Prescriptions"
            active={activeTab === "prescriptions"}
            onClick={() => setActiveTab("prescriptions")}
          />
        </div>
      </div>

      {/* ── Document list ──────────────────────────────────── */}
      {/* Outer bordered container matching the image */}
      <div
        className={cn(
          "rounded-2xl border border-gray-200 bg-white p-4",
          "max-w-3xl mx-auto",
        )}
      >
        {visibleDocs.length === 0 ? (
          // Empty state — shown when no documents exist for the active tab
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-12 h-12 rounded-full bg-[#FEF0F1] flex items-center justify-center text-[#D72638] mb-4">
              <DocFileIcon />
            </div>
            <p className="text-sm font-semibold text-gray-700">
              No documents found
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {activeTab === "medical-records"
                ? "No medical records available yet."
                : "No prescriptions available yet."}
            </p>
          </div>
        ) : (
          // Document rows
          // DATA: replace visibleDocs with real API data
          <div className="space-y-2">
            {visibleDocs.map((doc) => (
              <DocumentCard
                key={doc.id}
                item={doc}
                onClick={handleDocumentClick}
              />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
