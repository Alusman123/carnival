"use client";

// app/src/admin-page/dashboard/page.tsx
// ─────────────────────────────────────────────────────────────
// Admin Dashboard — redesigned to match the image
//
// Changes from previous version:
//   • AppShell variant="dashboard" — uses DASHBOARD_NAV with
//     User Management added
//   • Topbar shows username text "Admin" next to avatar
//   • StatsCard with bordered variant + larger numbers
//   • Tables unchanged in structure, tightened in style
//   • Full-width layout (removed max-w-6xl cap)
//
// DATA: All values marked // DATA — replace with API calls.
// ─────────────────────────────────────────────────────────────

import React, { useState } from "react";
import { AppShell } from "@/app/components/ui/Appshell";
import {
  Card,
  CardHeader,
  CardTitle,
  StatsCard,
} from "@/app/components/ui/Card";
import { StatusBadge, DocumentStatus } from "@/app/components/ui/Badge";
import { cn } from "@/app/lib/utils";
import ProtectedRoute from "@/app/components/ProtectedRoute";
// ── Icons ──────────────────────────────────────────────────────
const DocIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);
const AccessIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
  </svg>
);
const FeedbackIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
  </svg>
);
const UsersIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
  </svg>
);
const EyeIcon = () => (
  <svg
    className="w-4 h-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const ChevronRightIcon = () => (
  <svg
    className="w-4 h-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

// ── Types ──────────────────────────────────────────────────────
interface DocumentRow {
  id: string;
  name: string; // DATA: document.name
  submittedBy: string; // DATA: document.submittedBy.name
  date: string; // DATA: document.createdAt formatted
  status: DocumentStatus; // DATA: document.status
}
interface AccessRow {
  id: string;
  userName: string; // DATA: access.user.name
  requestedResource: string; // DATA: access.resource
  date: string; // DATA: access.requestedAt
  status: DocumentStatus;
}
interface FeedbackRow {
  id: string;
  userName: string; // DATA: feedback.user.name
  feedback: string; // DATA: feedback.message
  date: string; // DATA: feedback.createdAt
  status: DocumentStatus;
}

// ── Placeholder data ───────────────────────────────────────────
const SAMPLE_DOCUMENTS: DocumentRow[] = [
  {
    id: "1",
    name: "Project Proposal.pdf",
    submittedBy: "John Doe",
    date: "May 20, 2024",
    status: "approved",
  },
  {
    id: "2",
    name: "Budget Report.xlsx",
    submittedBy: "Sarah Smith",
    date: "May 19, 2024",
    status: "approved",
  },
  {
    id: "3",
    name: "Contract Document.pdf",
    submittedBy: "Michael Brown",
    date: "May 18, 2024",
    status: "approved",
  },
];
const SAMPLE_ACCESS: AccessRow[] = [
  {
    id: "1",
    userName: "Emily Johnson",
    requestedResource: "Project Dashboard",
    date: "May 20, 2024",
    status: "approved",
  },
  {
    id: "2",
    userName: "James Wilson",
    requestedResource: "Financial Reports",
    date: "May 19, 2024",
    status: "approved",
  },
  {
    id: "3",
    userName: "Sophia Davis",
    requestedResource: "User Management",
    date: "May 18, 2024",
    status: "approved",
  },
];
const SAMPLE_FEEDBACK: FeedbackRow[] = [
  {
    id: "1",
    userName: "Daniel Lee",
    feedback: "Great system! Very user friendly.",
    date: "May 20, 2024",
    status: "new",
  },
  {
    id: "2",
    userName: "Olivia Martinez",
    feedback: "Please add dark mode to the dashboard.",
    date: "May 19, 2024",
    status: "review",
  },
  {
    id: "3",
    userName: "William Taylor",
    feedback: "Reports loading could be faster.",
    date: "May 18, 2024",
    status: "resolved",
  },
];

// ── Tab bar ────────────────────────────────────────────────────
type TabValue = "approved" | "pending" | "denied";
const TABS: { label: string; value: TabValue }[] = [
  { label: "Approved", value: "approved" },
  { label: "Pending", value: "pending" },
  { label: "Denied", value: "denied" },
];

const TableTabs: React.FC<{
  active: TabValue;
  onChange: (v: TabValue) => void;
}> = ({ active, onChange }) => (
  <div className="flex gap-5 mb-4 border-b border-gray-100 pb-0">
    {TABS.map((tab) => (
      <button
        key={tab.value}
        type="button"
        onClick={() => onChange(tab.value)}
        className={cn(
          "text-sm font-medium pb-2 border-b-2 -mb-px transition-colors duration-150 focus:outline-none",
          active === tab.value
            ? "border-[#D72638] text-[#D72638]"
            : "border-transparent text-gray-400 hover:text-gray-600",
        )}
      >
        {tab.label}
      </button>
    ))}
  </div>
);

// ── Table primitives ───────────────────────────────────────────
const Th: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <th
    className={cn(
      "text-left text-xs font-semibold text-gray-400 uppercase tracking-wide py-2.5 px-4",
      className,
    )}
  >
    {children}
  </th>
);
const Td: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <td
    className={cn(
      "text-sm text-gray-700 py-3 px-4 border-b border-gray-50 last:border-0",
      className,
    )}
  >
    {children}
  </td>
);

// ── Section header ─────────────────────────────────────────────
const SectionHeader: React.FC<{
  title: string;
  viewAllHref?: string;
  viewAllLabel?: string;
  icon: React.ReactNode;
}> = ({ title, viewAllHref = "#", viewAllLabel, icon }) => (
  <CardHeader>
    <div className="flex items-center gap-2 [&>svg]:w-5 [&>svg]:h-5 text-[#D72638]">
      {icon}
      <CardTitle>{title}</CardTitle>
    </div>
    <a
      href={viewAllHref}
      className="flex items-center gap-0.5 text-xs font-medium text-[#D72638] hover:underline focus:outline-none"
    >
      {viewAllLabel ?? `View all ${title.toLowerCase()}`} <ChevronRightIcon />
    </a>
  </CardHeader>
);

// ── DASHBOARD PAGE ─────────────────────────────────────────────
export default function DashboardPage() {
  // DATA: replace with auth context + API calls
  const username = "Admin"; // DATA: auth context → user.name
  const notifCount = 5; // DATA: notification API → unread count

  const stats = {
    totalDocs: 128, // DATA: documents API
    accessReqs: 96, // DATA: access API
    feedbackCount: 42, // DATA: feedback API
    totalUsers: 215, // DATA: users API
  };

  const [docTab, setDocTab] = useState<TabValue>("approved");
  const [accessTab, setAccessTab] = useState<TabValue>("approved");

  return (
    <ProtectedRoute requiredRole="admin">
      <AppShell
        variant="dashboard"
        pageTitle="Dashboard"
        username={username}
        notifCount={notifCount}
        showSearch={false}
        // Passes username to topbar so "Admin" text shows next to avatar
      >
        {/* Full width — no max-w cap, fills available space */}
        <div className="w-full space-y-5">
          {/* ── 1. Stats row ──────────────────────────────────── */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            {/* Each StatsCard uses the bordered variant to match the image */}
            <StatsCard
              title="Total Documents"
              value={stats.totalDocs} // DATA
              icon={<DocIcon />}
              iconBg="bg-[#FEF0F1]"
              iconColor="text-[#D72638]"
              className="border border-[#D72638]/20"
            />
            <StatsCard
              title="Total Access Requests"
              value={stats.accessReqs} // DATA
              icon={<AccessIcon />}
              iconBg="bg-[#FEF0F1]"
              iconColor="text-[#D72638]"
              className="border border-[#D72638]/20"
            />
            <StatsCard
              title="Total Feedback"
              value={stats.feedbackCount} // DATA
              icon={<FeedbackIcon />}
              iconBg="bg-[#FEF0F1]"
              iconColor="text-[#D72638]"
              className="border border-[#D72638]/20"
            />
            <StatsCard
              title="Total Users"
              value={stats.totalUsers} // DATA
              icon={<UsersIcon />}
              iconBg="bg-[#FEF0F1]"
              iconColor="text-[#D72638]"
              className="border border-[#D72638]/20"
            />
          </div>

          {/* ── 2. Documents table ────────────────────────────── */}
          <Card variant="default" padding="md">
            <SectionHeader
              title="Documents"
              viewAllHref="/src/admin-page/dashboard/documents"
              viewAllLabel="View all documents"
              icon={<DocIcon />}
            />
            <TableTabs active={docTab} onChange={setDocTab} />
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <Th>Document Name</Th>
                    <Th>Submitted By</Th>
                    <Th>Date</Th>
                    <Th>Status</Th>
                    <Th className="text-right">Actions</Th>
                  </tr>
                </thead>
                <tbody>
                  {/* DATA: replace with API result filtered by docTab */}
                  {SAMPLE_DOCUMENTS.map((doc) => (
                    <tr
                      key={doc.id}
                      className="hover:bg-gray-50/70 transition-colors"
                    >
                      <Td className="font-medium text-gray-900">{doc.name}</Td>
                      <Td>{doc.submittedBy}</Td>
                      <Td>{doc.date}</Td>
                      <Td>
                        <StatusBadge status={doc.status} size="sm" />
                      </Td>
                      <Td className="text-right">
                        <button
                          type="button"
                          aria-label={`View ${doc.name}`}
                          className="text-gray-400 hover:text-[#D72638] transition-colors focus:outline-none p-1 rounded"
                        >
                          <EyeIcon />
                        </button>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* ── 3. Access table ───────────────────────────────── */}
          <Card variant="default" padding="md">
            <SectionHeader
              title="Access"
              viewAllHref="/src/admin-page/dashboard/access"
              viewAllLabel="View all access"
              icon={<AccessIcon />}
            />
            <TableTabs active={accessTab} onChange={setAccessTab} />
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <Th>User Name</Th>
                    <Th>Requested Resource</Th>
                    <Th>Date</Th>
                    <Th>Status</Th>
                    <Th className="text-right">Actions</Th>
                  </tr>
                </thead>
                <tbody>
                  {/* DATA: replace with API result filtered by accessTab */}
                  {SAMPLE_ACCESS.map((row) => (
                    <tr
                      key={row.id}
                      className="hover:bg-gray-50/70 transition-colors"
                    >
                      <Td className="font-medium text-gray-900">
                        {row.userName}
                      </Td>
                      <Td>{row.requestedResource}</Td>
                      <Td>{row.date}</Td>
                      <Td>
                        <StatusBadge status={row.status} size="sm" />
                      </Td>
                      <Td className="text-right">
                        <button
                          type="button"
                          aria-label={`View ${row.userName}'s request`}
                          className="text-gray-400 hover:text-[#D72638] transition-colors focus:outline-none p-1 rounded"
                        >
                          <EyeIcon />
                        </button>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* ── 4. Feedback table ─────────────────────────────── */}
          <Card variant="default" padding="md">
            <SectionHeader
              title="Feedback"
              viewAllHref="/src/admin-page/dashboard/feedback"
              viewAllLabel="View all feedback"
              icon={<FeedbackIcon />}
            />
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <Th>User Name</Th>
                    <Th>Feedback</Th>
                    <Th>Date</Th>
                    <Th>Status</Th>
                    <Th className="text-right">Actions</Th>
                  </tr>
                </thead>
                <tbody>
                  {/* DATA: replace with real feedback API data */}
                  {SAMPLE_FEEDBACK.map((row) => (
                    <tr
                      key={row.id}
                      className="hover:bg-gray-50/70 transition-colors"
                    >
                      <Td className="font-medium text-gray-900 whitespace-nowrap">
                        {row.userName}
                      </Td>
                      <Td className="max-w-[240px]">
                        <span className="truncate block text-gray-500">
                          {row.feedback}
                        </span>
                      </Td>
                      <Td>{row.date}</Td>
                      <Td>
                        <StatusBadge status={row.status} size="sm" />
                      </Td>
                      <Td className="text-right">
                        <button
                          type="button"
                          aria-label={`View ${row.userName}'s feedback`}
                          className="text-gray-400 hover:text-[#D72638] transition-colors focus:outline-none p-1 rounded"
                        >
                          <EyeIcon />
                        </button>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}
