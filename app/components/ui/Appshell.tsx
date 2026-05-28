"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/app/lib/utils";
import { NotifBadge } from "@/app/components/ui/Badge";
import { Avatar } from "@/app/components/ui/Misc";
// ✅ Correct import path — matches your actual file location
import { useNavigation, NavigationAction } from "@/app/lib/Navigation";

const EXPANDED_W = 240;
const COLLAPSED_W = 72;

interface NavItem {
  label: string;
  action: NavigationAction; // ← uses NavigationAction instead of raw href
  icon: React.ReactNode;
}

// ── Icons ──────────────────────────────────────────────────────
const HamburgerIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);
const HomeIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
    <path d="M9 21V12h6v9" />
  </svg>
);
const DocumentIcon = () => (
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
const FlowIcon = () => (
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
const UpdatesIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="23 4 23 10 17 10" />
    <polyline points="1 20 1 14 7 14" />
    <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
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
const DashboardIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
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
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" />
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
const ReportsIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);
const SettingsIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
  </svg>
);
const UserManagementIcon = () => (
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
    <line x1="23" y1="11" x2="17" y2="11" />
    <line x1="20" y1="8" x2="20" y2="14" />
  </svg>
);
const LogoutIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);
const BellIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 01-3.46 0" />
  </svg>
);
const SearchIcon = () => (
  <svg
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

const LogoMark = () => (
  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shrink-0">
    <svg viewBox="0 0 32 32" fill="none" className="w-5 h-5">
      <rect
        x="6"
        y="4"
        width="14"
        height="18"
        rx="2"
        fill="#D72638"
        opacity="0.9"
      />
      <rect
        x="12"
        y="10"
        width="14"
        height="18"
        rx="2"
        fill="#D72638"
        opacity="0.5"
      />
      <line
        x1="9"
        y1="9"
        x2="17"
        y2="9"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="9"
        y1="12"
        x2="17"
        y2="12"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="9"
        y1="15"
        x2="14"
        y2="15"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  </div>
);

// ── Nav configs — now use NavigationAction keys, not raw hrefs ──
export const HOME_NAV: NavItem[] = [
  { label: "Home", action: "home", icon: <HomeIcon /> },
  { label: "Documents", action: "documents", icon: <DocumentIcon /> },
  { label: "Flow Guide", action: "flowGuide", icon: <FlowIcon /> },
  { label: "Updates", action: "updates", icon: <UpdatesIcon /> },
  { label: "Feedback", action: "feedback", icon: <FeedbackIcon /> },
];

export const DASHBOARD_NAV: NavItem[] = [
  { label: "Dashboard", action: "dashboard", icon: <DashboardIcon /> },
  { label: "Documents", action: "dashboardDocuments", icon: <DocumentIcon /> },
  { label: "Access", action: "dashboardAccess", icon: <AccessIcon /> },
  { label: "Feedback", action: "dashboardFeedback", icon: <FeedbackIcon /> },
  { label: "Users", action: "dashboardUsers", icon: <UsersIcon /> },
  { label: "Reports", action: "dashboardReports", icon: <ReportsIcon /> },
  { label: "Settings", action: "dashboardSettings", icon: <SettingsIcon /> },
  {
    label: "User Management",
    action: "dashboardAdminFunction",
    icon: <UserManagementIcon />,
  },
];

// ── Route map for isActive checks (derived from Navigation.ts) ──
const ACTION_PATHS: Partial<Record<NavigationAction, string>> = {
  home: "/src/homepage/home",
  documents: "/src/homepage/document",
  flowGuide: "/flow-guide",
  updates: "/updates",
  feedback: "/feedback",
  dashboard: "/src/admin-page/dashboard",
  dashboardDocuments: "/src/admin-page/dashboard/document",
  dashboardAccess: "/src/admin-page/dashboard/access",
  dashboardFeedback: "/src/admin-page/dashboard/feedback",
  dashboardUsers: "/src/admin-page/dashboard/users",
  dashboardReports: "/src/admin-page/dashboard/reports",
  dashboardSettings: "/src/admin-page/dashboard/settings",
  dashboardAdminFunction: "/src/admin-page/dashboard/admin-function",
};

// ── Sidebar ────────────────────────────────────────────────────
const Sidebar: React.FC<{
  nav: NavItem[];
  expanded: boolean;
  onToggle: () => void;
  onLogout: () => void;
  username: string;
}> = ({ nav, expanded, onToggle, onLogout, username }) => {
  const pathname = usePathname();
  const { navigate } = useNavigation();

  return (
    <aside
      style={{ width: expanded ? EXPANDED_W : COLLAPSED_W }}
      className={cn(
        "fixed inset-y-0 left-0 z-30 flex flex-col bg-[#D72638]",
        "transition-[width] duration-300 ease-in-out overflow-hidden",
      )}
    >
      {/* Header */}
      <div className="flex items-center h-16 px-3 shrink-0 border-b border-white/10 gap-3">
        <button
          type="button"
          onClick={onToggle}
          aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
          className={cn(
            "shrink-0 w-10 h-10 flex items-center justify-center rounded-xl",
            "text-white/80 hover:bg-white/15 hover:text-white",
            "transition-colors duration-150 [&>svg]:w-5 [&>svg]:h-5",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40",
          )}
        >
          <HamburgerIcon />
        </button>
        <div
          className={cn(
            "flex items-center gap-2 overflow-hidden transition-all duration-300",
            expanded
              ? "opacity-100 w-auto"
              : "opacity-0 w-0 pointer-events-none",
          )}
        >
          <LogoMark />
          <span className="text-white font-bold text-base tracking-tight whitespace-nowrap">
            DocuKnow
          </span>
        </div>
      </div>

      {/* Nav — uses navigate() instead of <Link href> */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-2 space-y-0.5">
        {nav.map((item) => {
          const resolvedPath = ACTION_PATHS[item.action] ?? "";
          const isActive =
            item.action === "home"
              ? pathname === resolvedPath
              : pathname.startsWith(resolvedPath);

          return (
            <button
              key={item.action}
              type="button"
              title={!expanded ? item.label : undefined}
              onClick={() => navigate(item.action)}
              className={cn(
                "w-full flex items-center rounded-xl text-sm font-medium",
                "transition-all duration-150 whitespace-nowrap",
                "[&>span:first-child>svg]:w-5 [&>span:first-child>svg]:h-5",
                expanded ? "gap-3 px-3 py-2.5" : "justify-center px-0 py-2.5",
                isActive
                  ? "bg-white text-[#D72638]"
                  : "text-white/80 hover:bg-white/15 hover:text-white",
              )}
            >
              <span className="shrink-0">{item.icon}</span>
              <span
                className={cn(
                  "transition-all duration-300 overflow-hidden",
                  expanded ? "opacity-100 max-w-[160px]" : "opacity-0 max-w-0",
                )}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="shrink-0 px-2 pb-4 pt-2 border-t border-white/10">
        {/* Collapsed: avatar */}
        <div
          className={cn(
            "transition-all duration-300 overflow-hidden",
            expanded
              ? "opacity-0 max-h-0 pointer-events-none"
              : "opacity-100 max-h-14",
          )}
        >
          <div className="flex justify-center py-1">
            <span className="text-sm font-semibold text-gray-700 hidden sm:block">
              {username}
            </span>
            <Avatar name={username} size="sm" />
          </div>
        </div>
        {/* Expanded: logout button */}
        <div
          className={cn(
            "transition-all duration-300 overflow-hidden",
            expanded
              ? "opacity-100 max-h-14"
              : "opacity-0 max-h-0 pointer-events-none",
          )}
        >
          <button
            type="button"
            onClick={onLogout}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl",
              "text-sm font-medium text-white/80 whitespace-nowrap",
              "hover:bg-white/15 hover:text-white cursor-pointer",
              "transition-colors duration-150",
              "[&>span>svg]:w-5 [&>span>svg]:h-5",
            )}
          >
            <span className="shrink-0">
              <LogoutIcon />
            </span>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

// ── Topbar ─────────────────────────────────────────────────────
const Topbar: React.FC<{
  pageTitle: string;
  username: string;
  notifCount: number;
  showSearch: boolean;
}> = ({ pageTitle, username, notifCount, showSearch }) => (
  <header className="sticky top-0 z-20 flex items-center justify-between h-16 px-6 bg-white border-b border-gray-100">
    <h1 className="text-lg font-bold text-gray-900 font-[family-name:var(--font-sans)]">
      {pageTitle}
    </h1>
    <div className="flex items-center gap-3">
      {showSearch && (
        <div className="relative hidden sm:flex items-center">
          <span className="absolute left-3 text-gray-400 [&>svg]:w-4 [&>svg]:h-4 pointer-events-none">
            <SearchIcon />
          </span>
          <input
            type="search"
            placeholder="Search article, document..."
            className={cn(
              "h-9 w-56 pl-9 pr-3 rounded-lg border border-gray-200 bg-gray-50",
              "text-sm text-gray-900 placeholder-gray-400",
              "focus:outline-none focus:ring-2 focus:ring-[#D72638]/20 focus:border-[#D72638]",
              "transition-all duration-200",
            )}
          />
        </div>
      )}
      <div className="relative">
        <button
          type="button"
          aria-label={`${notifCount} notifications`}
          className={cn(
            "w-9 h-9 flex items-center justify-center rounded-full",
            "text-gray-500 hover:bg-gray-100 hover:text-gray-700",
            "transition-colors duration-150 [&>svg]:w-5 [&>svg]:h-5",
          )}
        >
          <BellIcon />
        </button>
        <NotifBadge count={notifCount} />
      </div>
      <span className="text-sm font-semibold text-gray-700 hidden sm:block">
        {username}
      </span>
      <Avatar name={username} size="sm" />
    </div>
  </header>
);

// ── AppShell props ─────────────────────────────────────────────
export interface AppShellProps {
  children: React.ReactNode;
  username?: string;
  notifCount?: number;
  pageTitle?: string;
  showSearch?: boolean;
  variant?: "home" | "dashboard"; // now inferred from URL; prop ignored
  defaultExpanded?: boolean;
}

// ── AppShell ───────────────────────────────────────────────────
export const AppShell: React.FC<AppShellProps> = ({
  children,
  username = "Admin",
  notifCount = 3,
  pageTitle = "",
  showSearch = true,
  defaultExpanded = true,
}) => {
  const { navigate } = useNavigation();
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(defaultExpanded);

  // Infer variant from URL — no longer relies on the prop being passed correctly
  const variant = pathname.startsWith("/src/admin-page") ? "dashboard" : "home";
  const nav = variant === "dashboard" ? DASHBOARD_NAV : HOME_NAV;
  const sidebarW = expanded ? EXPANDED_W : COLLAPSED_W;

  const handleLogout = () => {
    // TODO: call your real logout API here before navigating
    navigate("signIn");
  };

  return (
    <div className="min-h-screen bg-gray-50 font-[family-name:var(--font-sans)]">
      {expanded && (
        <div
          className="fixed inset-0 z-20"
          onClick={() => setExpanded(false)}
        />
      )}
      <Sidebar
        nav={nav}
        expanded={expanded}
        onToggle={() => setExpanded((v) => !v)}
        onLogout={handleLogout}
        username={username}
      />
      <div
        style={{ marginLeft: sidebarW }}
        className="flex flex-col min-h-screen transition-[margin-left] duration-300 ease-in-out"
      >
        <Topbar
          pageTitle={pageTitle}
          username={username}
          notifCount={notifCount}
          showSearch={showSearch}
        />
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};
