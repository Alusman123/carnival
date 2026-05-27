"use client";

import React, { useState, useEffect } from "react";
import { AppShell } from "@/app/components/ui/Appshell";
import {
  Card,
  CardHeader,
  CardTitle,
  InfoCard,
} from "@/app/components/ui/Card";
import { Badge } from "@/app/components/ui/Badge";
import { SearchBar } from "@/app/components/ui/SearchBar";
import { cn } from "@/app/lib/utils";
import { useNavigation } from "@/app/lib/Navigation";
import ProtectedRoute from "@/app/components/ProtectedRoute";

// ── Icons ──────────────────────────────────────────────────────
const ChevronRightIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
const ArticleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);
const EyeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const HeartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
  </svg>
);
const GuideIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
  </svg>
);
const DiagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="5" r="2" />
    <circle cx="5" cy="19" r="2" />
    <circle cx="19" cy="19" r="2" />
    <line x1="12" y1="7" x2="12" y2="12" />
    <line x1="12" y1="12" x2="5" y2="17" />
    <line x1="12" y1="12" x2="19" y2="17" />
  </svg>
);
const UpdatesIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10" />
    <polyline points="1 20 1 14 7 14" />
    <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
  </svg>
);
const MegaphoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <path d="M15.54 8.46a5 5 0 010 7.07" />
  </svg>
);
const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

// ── Types ──────────────────────────────────────────────────────
type UpdateTag = "System" | "Action Required" | "Maintenance";
const TAG_VARIANT: Record<UpdateTag, "gray" | "warning" | "info"> = {
  System: "gray",
  "Action Required": "warning",
  Maintenance: "info",
};
interface UpdateItem {
  id: string;
  title: string;
  date: string;
  tag: UpdateTag;
  icon: React.ReactNode;
}

const SAMPLE_UPDATES: UpdateItem[] = [
  {
    id: "1",
    title: "DocuKnow Release New Update",
    date: "May 20, 2026 • 10:30 AM",
    tag: "System",
    icon: <UpdatesIcon />,
  },
  {
    id: "2",
    title: "New Document Released",
    date: "May 19, 2026 • 04:15 PM",
    tag: "Action Required",
    icon: <MegaphoneIcon />,
  },
  {
    id: "3",
    title: "Schedule Maintenance",
    date: "May 18, 2026 • 11:20 AM",
    tag: "Maintenance",
    icon: <CalendarIcon />,
  },
];

// ── Section header ─────────────────────────────────────────────
const SectionHeader: React.FC<{
  title: string;
  viewAllHref?: string;
  badge?: number;
}> = ({ title, viewAllHref = "#", badge }) => (
  <CardHeader>
    <div className="flex items-center gap-2">
      <CardTitle>{title}</CardTitle>
      {badge !== undefined && badge > 0 && (
        <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-[#D72638] text-white text-[10px] font-bold leading-none">
          {badge} New
        </span>
      )}
    </div>
    <a href={viewAllHref} className="flex items-center gap-0.5 text-xs font-medium text-[#D72638] hover:underline focus:outline-none">
      View all <ChevronRightIcon />
    </a>
  </CardHeader>
);

// ── Feature card ───────────────────────────────────────────────
const FeatureCard: React.FC<{
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  onClick: () => void;
}> = ({ title, subtitle, icon, onClick }) => (
  <button
    onClick={onClick}
    className={cn(
      "flex-1 min-w-0 rounded-xl border border-gray-200 bg-white p-5",
      "flex flex-col gap-4 text-left",
      "hover:border-[#D72638]/40 hover:shadow-md",
      "transition-all duration-200 group focus:outline-none",
      "focus-visible:ring-2 focus-visible:ring-[#D72638]/30",
    )}
  >
    <div className="w-12 h-12 rounded-xl bg-[#FEF0F1] flex items-center justify-center text-[#D72638] [&>svg]:w-7 [&>svg]:h-7 group-hover:bg-[#D72638] group-hover:text-white transition-colors duration-200">
      {icon}
    </div>
    <div>
      <p className="text-lg font-bold text-[#D72638] group-hover:text-[#B01E2C] transition-colors duration-150">{title}</p>
      <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
    </div>
  </button>
);

// ── Update row ─────────────────────────────────────────────────
const UpdateRow: React.FC<{ item: UpdateItem }> = ({ item }) => (
  <div className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
    <div className="w-8 h-8 rounded-full bg-[#FEF0F1] flex items-center justify-center text-[#D72638] shrink-0 [&>svg]:w-4 [&>svg]:h-4">
      {item.icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-gray-900 truncate">{item.title}</p>
      <p className="text-xs text-gray-400 mt-0.5">{item.date}</p>
    </div>
    <Badge label={item.tag} variant={TAG_VARIANT[item.tag]} size="sm" />
  </div>
);

// ── HOME PAGE ──────────────────────────────────────────────────
export default function HomePage() {
  const [username, setUsername] = useState("there");
  const notifCount = 3;
  const newUpdates = 4;
  const [searchQuery, setSearchQuery] = useState("");
  const { navigate } = useNavigation();

  // Get username from localStorage
  useEffect(() => {
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user.username) setUsername(user.username);
      }
    } catch {
      // fallback to default
    }
  }, []);

  const handleSearch = (value: string) => {
    console.log("Search:", value);
  };

  return (
    <ProtectedRoute requiredRole="user">
      <AppShell
        variant="home"
        pageTitle={`Welcome back, ${username}`}
        username={username}
        notifCount={notifCount}
        showSearch={false}
      >
        <div className="w-full space-y-5">
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onSearch={handleSearch}
            onClear={() => setSearchQuery("")}
            placeholder="Search article, document..."
            fullWidth
            size="md"
          />

          {/* ── 1. Feature cards ──────────────────────────────── */}
          <div className="flex flex-col sm:flex-row gap-4">
            <FeatureCard
              title="New Article"
              subtitle="12 New This Week"
              icon={<ArticleIcon />}
              onClick={() => navigate("documents")}
            />
            <FeatureCard
              title="Most Viewed"
              subtitle="Top 10 This Month"
              icon={<EyeIcon />}
              onClick={() => navigate("documents")}
            />
            <FeatureCard
              title="Saved"
              subtitle="8 Saved Articles"
              icon={<HeartIcon />}
              onClick={() => navigate("documents")}
            />
          </div>

          {/* ── 2. Flow Guide ─────────────────────────────────── */}
          <Card variant="default" padding="md">
            <SectionHeader title="Flow Guide" viewAllHref="/flow-guide" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoCard
                title="Standard Procedures"
                description="Step-by-step guidelines for document processing and management."
                icon={<GuideIcon />}
                iconBg="bg-[#FEF0F1]"
                iconColor="text-[#D72638]"
                action={{
                  label: "Open Guide",
                  onClick: () => { window.location.href = "/flow-guide/standard"; },
                }}
              />
              <InfoCard
                title="Workflow Diagrams"
                description="Visual workflows for scanning, processing and approval process."
                icon={<DiagramIcon />}
                iconBg="bg-[#FEF0F1]"
                iconColor="text-[#D72638]"
                action={{
                  label: "View Diagrams",
                  onClick: () => { window.location.href = "/flow-guide/diagrams"; },
                }}
              />
            </div>
          </Card>

          {/* ── 3. Updates ────────────────────────────────────── */}
          <Card variant="default" padding="md">
            <SectionHeader title="Updates" viewAllHref="/updates" badge={newUpdates} />
            <div className="flex flex-col md:flex-row gap-4">
              <div className={cn(
                "flex flex-col items-center justify-center gap-3",
                "rounded-xl border border-gray-100 bg-gray-50 p-6",
                "w-full md:w-48 shrink-0",
              )}>
                <div className="w-14 h-14 rounded-full bg-[#FEF0F1] flex items-center justify-center text-[#D72638] [&>svg]:w-8 [&>svg]:h-8">
                  <UpdatesIcon />
                </div>
                <div className="text-center">
                  <p className="text-base font-bold text-gray-800">Updates</p>
                  {newUpdates > 0 && (
                    <span className="inline-flex items-center justify-center mt-1 px-2.5 py-0.5 rounded-full bg-[#D72638] text-white text-xs font-bold">
                      {newUpdates} New
                    </span>
                  )}
                </div>
              </div>

              <div className="flex-1 min-w-0 divide-y divide-gray-50">
                {SAMPLE_UPDATES.map((item) => (
                  <UpdateRow key={item.id} item={item} />
                ))}
                {SAMPLE_UPDATES.length === 0 && (
                  <div className="flex items-center justify-center py-10">
                    <p className="text-sm text-gray-400">No updates yet.</p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}