"use client";

// app/src/home/page.tsx  (or wherever your Home route lives)
// ─────────────────────────────────────────────────────────────
// Home page — user-facing dashboard
//
// Sections:
//   1. Documents stats row (Total, Processed, In Progress, Needs Review)
//   2. Flow Guide cards (Standard Procedures + Workflow Diagrams)
//   3. Feedback summary (count card + recent list placeholder)
//
// DATA: All placeholder values below marked with // DATA comments.
//       Wire each to your real API calls when ready.
// ─────────────────────────────────────────────────────────────

import React from "react";
import { AppShell } from "./components/ui/Appshell";
import {
  Card,
  CardHeader,
  CardTitle,
  StatsCard,
  InfoCard,
  Button,
} from "@/app/types";
import { cn } from "@/app/lib/utils";

// ── Icons ─────────────────────────────────────────────────────
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
const ProcessIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const ProgressIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);
const ReviewIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);
const GuideIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
  </svg>
);
const DiagramIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="5" r="2" />
    <circle cx="5" cy="19" r="2" />
    <circle cx="19" cy="19" r="2" />
    <line x1="12" y1="7" x2="12" y2="12" />
    <line x1="12" y1="12" x2="5" y2="17" />
    <line x1="12" y1="12" x2="19" y2="17" />
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

// ── Section header with "View all" link ────────────────────────
const SectionHeader: React.FC<{
  title: string;
  viewAllHref?: string;
}> = ({ title, viewAllHref = "#" }) => (
  <CardHeader>
    <CardTitle>{title}</CardTitle>
    <a
      href={viewAllHref}
      className="flex items-center gap-0.5 text-xs font-medium text-[#D72638] hover:underline focus:outline-none"
    >
      View all <ChevronRightIcon />
    </a>
  </CardHeader>
);

// ── HOME PAGE ──────────────────────────────────────────────────
export default function HomePage() {
  // ── DATA: replace all static values below with real API data ──
  // e.g. const { data } = useHomeStats();
  const username = "Urdanetz"; // DATA: auth context → user.name
  const notifCount = 3; // DATA: notification API → unread count

  const docStats = {
    total: 200, // DATA: documents API → total count
    processed: 100, // DATA: documents API → processed count
    inProgress: 20, // DATA: documents API → in-progress count
    needsReview: 14, // DATA: documents API → needs-review count
  };

  const feedbackTotal = 32; // DATA: feedback API → total count

  return (
    <AppShell
      variant="home"
      pageTitle={`Welcome back, ${username}`}
      username={username}
      notifCount={notifCount}
      showSearch
    >
      <div className="space-y-6 max-w-5xl">
        {/* ── 1. Documents section ────────────────────────────── */}
        <Card variant="default" padding="md">
          <SectionHeader title="Documents" viewAllHref="/documents" />

          {/* Stats grid — 4 columns on lg, 2 on sm */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              title="Total Documents"
              value={docStats.total} // DATA
              description="All uploaded documents"
              icon={<DocIcon />}
              iconBg="bg-[#FEF0F1]"
              iconColor="text-[#D72638]"
            />
            <StatsCard
              title="Processed"
              value={docStats.processed} // DATA
              description="Successfully processed"
              icon={<ProcessIcon />}
              iconBg="bg-[#FEF0F1]"
              iconColor="text-[#D72638]"
            />
            <StatsCard
              title="In Progress"
              value={docStats.inProgress} // DATA
              description="Currently processing"
              icon={<ProgressIcon />}
              iconBg="bg-[#FEF0F1]"
              iconColor="text-[#D72638]"
            />
            <StatsCard
              title="Needs Review"
              value={docStats.needsReview} // DATA
              description="Require your attention"
              icon={<ReviewIcon />}
              iconBg="bg-amber-50"
              iconColor="text-amber-600"
            />
          </div>
        </Card>

        {/* ── 2. Flow Guide section ────────────────────────────── */}
        <Card variant="default" padding="md">
          <SectionHeader title="Flow Guide" viewAllHref="/flow-guide" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Standard Procedures card */}
            <InfoCard
              title="Standard Procedures"
              description="Step-by-step guidelines for document processing and management."
              icon={<GuideIcon />}
              iconBg="bg-[#FEF0F1]"
              iconColor="text-[#D72638]"
              action={{
                label: "Open Guide",
                // TODO: wire to your actual guide page or modal
                onClick: () => {
                  window.location.href = "/flow-guide/standard";
                },
              }}
            />

            {/* Workflow Diagrams card */}
            <InfoCard
              title="Workflow Diagrams"
              description="Visual workflows for scanning, processing and approval process."
              icon={<DiagramIcon />}
              iconBg="bg-[#FEF0F1]"
              iconColor="text-[#D72638]"
              action={{
                label: "View Diagrams",
                // TODO: wire to your actual diagrams page or modal
                onClick: () => {
                  window.location.href = "/flow-guide/diagrams";
                },
              }}
            />
          </div>
        </Card>

        {/* ── 3. Feedback section ──────────────────────────────── */}
        <Card variant="default" padding="md">
          <SectionHeader title="Feedback" viewAllHref="/feedback" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Feedback summary card (left) */}
            <Card
              variant="flat"
              padding="md"
              className="flex flex-col items-center justify-center text-center gap-3"
            >
              <div className="w-14 h-14 rounded-full bg-[#FEF0F1] flex items-center justify-center text-[#D72638] [&>svg]:w-7 [&>svg]:h-7">
                <FeedbackIcon />
              </div>
              {/* DATA: feedbackTotal from feedback API */}
              <p className="text-3xl font-bold text-[#D72638]">
                {feedbackTotal}
              </p>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Total Feedback
                </p>
                <p className="text-xs text-gray-400">
                  From users and reviewers
                </p>
              </div>
              <Button
                label="View Feedback"
                variant="primary"
                size="sm"
                onClick={() => {
                  window.location.href = "/feedback";
                }}
              />
            </Card>

            {/* Recent Feedback placeholder (right — 2 cols) */}
            {/* DATA: replace this with real feedback items from your API */}
            <div className="md:col-span-2 flex flex-col">
              <p className="text-sm font-semibold text-gray-700 mb-3">
                Recent Feedback
              </p>
              {/* Replace this empty state with a mapped list of feedback items */}
              <div className="flex-1 flex items-center justify-center rounded-xl border border-dashed border-gray-200 py-10">
                <p className="text-sm text-gray-400">
                  {/* DATA: map real feedback rows here */}
                  No recent feedback to display.
                </p>
              </div>
              {/* "Go to Feedback" footer link */}
              <div className="mt-3 flex justify-center">
                <a
                  href="/feedback"
                  className="flex items-center gap-1 text-sm text-[#D72638] hover:underline font-medium focus:outline-none"
                >
                  Go to Feedback <ChevronRightIcon />
                </a>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
