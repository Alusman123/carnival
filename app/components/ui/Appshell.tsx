"use client";

// components/AppShell.tsx
// ─────────────────────────────────────────────────────────────
// Shared layout wrapper for all authenticated pages.
//
// Structure:
//   <AppShell>          ← wraps everything
//     <Sidebar />       ← fixed left nav (240px wide)
//     <main>            ← scrollable content area
//       <Topbar />      ← sticky top bar with search + avatar
//       {children}      ← page content injected here
//     </main>
//   </AppShell>
//
// HOW TO USE:
//   Wrap any authenticated page with <AppShell pageTitle="...">
//     <YourPageContent />
//   </AppShell>
//
// DATA PROPS:
//   pageTitle     → shown in the top bar (string)
//   username      → displayed as "Welcome back, {username}" — DATA from auth
//   notifCount    → unread notifications — DATA from notification API
//   showSearch    → show/hide the search bar in topbar (default true)
//   children      → page content
// ─────────────────────────────────────────────────────────────

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/app/lib/utils";
import { NotifBadge } from "@/app/components/ui/Badge";
import { Logo, Avatar } from "@/app/components/ui/Misc";
import { useNavigation } from "@/app/lib/Navigation";

// ── Nav item type ─────────────────────────────────────────────
interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

// ── Icons (inline SVG — swap with your icon library if needed) ─
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
    <polyline points="10 9 9 9 8 9" />
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

// ── Nav config — HOME sidebar ──────────────────────────────────
// Update hrefs to match your actual page routes.
export const HOME_NAV: NavItem[] = [
  { label: "Home", href: "/", icon: <HomeIcon /> },
  { label: "Documents", href: "/documents", icon: <DocumentIcon /> },
  { label: "Flow Guide", href: "/flow-guide", icon: <FlowIcon /> },
  { label: "Updates", href: "/updates", icon: <UpdatesIcon /> },
  { label: "Feedback", href: "/feedback", icon: <FeedbackIcon /> },
];

// ── Nav config — DASHBOARD sidebar ─────────────────────────────
export const DASHBOARD_NAV: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: <DashboardIcon /> },
  { label: "Documents", href: "/dashboard/documents", icon: <DocumentIcon /> },
  { label: "Access", href: "/dashboard/access", icon: <AccessIcon /> },
  { label: "Feedback", href: "/dashboard/feedback", icon: <FeedbackIcon /> },
  { label: "Users", href: "/dashboard/users", icon: <UsersIcon /> },
  { label: "Reports", href: "/dashboard/reports", icon: <ReportsIcon /> },
  { label: "Settings", href: "/dashboard/settings", icon: <SettingsIcon /> },
];

// ── AppShell props ─────────────────────────────────────────────
export interface AppShellProps {
  children: React.ReactNode;
  // DATA props — replace with real values from your auth/notification context
  username?: string; // DATA: from auth context (e.g. useAuth().user.name)
  notifCount?: number; // DATA: from notification API / real-time socket
  pageTitle?: string; // shown in top bar; also used to auto-select nav variant
  showSearch?: boolean;
  // Pass "home" for the user-facing sidebar, "dashboard" for the admin sidebar
  variant?: "home" | "dashboard";
}

// ── Sidebar ────────────────────────────────────────────────────
const Sidebar: React.FC<{
  nav: NavItem[];
  onLogout: () => void;
}> = ({ nav, onLogout }) => {
  const pathname = usePathname();

  return (
    // Sidebar: fixed, 240px wide (--sidebar-width in globals.css)
    // To change width: update w-[240px] here AND --sidebar-width in globals.css
    <aside className="fixed inset-y-0 left-0 z-30 flex flex-col w-[240px] bg-[#D72638]">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-16 border-b border-white/10 shrink-0">
        <Logo
          size="sm"
          variant="full"
          appName="DocuKnow"
          // Override text color to white since sidebar is red
          className="[&_span]:text-white"
        />
      </div>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
        {nav.map((item) => {
          // Exact match for home ("/"), prefix match for all others
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium",
                "transition-all duration-150",
                "[&>span>svg]:w-5 [&>span>svg]:h-5",
                isActive
                  ? "bg-white text-[#D72638]" // active: white pill
                  : "text-white/80 hover:bg-white/10 hover:text-white", // inactive
              )}
            >
              <span className="shrink-0">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout button — pinned to bottom */}
      <div className="shrink-0 px-3 pb-5 pt-2 border-t border-white/10">
        <button
          type="button"
          onClick={onLogout}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl",
            "text-sm font-medium text-white/80",
            "hover:bg-white/10 hover:text-white",
            "transition-all duration-150",
            "[&>span>svg]:w-5 [&>span>svg]:h-5",
            "cursor-pointer",
          )}
        >
          <span className="shrink-0">
            <LogoutIcon />
          </span>
          <span>Logout</span>
        </button>
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
  // Topbar: sticky, full-width minus sidebar, 64px tall (--navbar-height)
  // Left margin (ml-[240px]) must match sidebar width
  <header className="sticky top-0 z-20 flex items-center justify-between h-16 px-6 bg-white border-b border-gray-100">
    {/* Left: page title */}
    <h1 className="text-lg font-bold text-gray-900 font-[family-name:var(--font-sans)]">
      {pageTitle}
    </h1>

    {/* Right: search + notification + avatar */}
    <div className="flex items-center gap-3">
      {/* Search bar — DATA: wire to your search API */}
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

      {/* Notification bell — DATA: notifCount from notification API */}
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

      {/* Avatar — DATA: username for initials, wire src from user.avatarUrl */}
      <Avatar
        name={username}
        size="sm"
        // src={user.avatarUrl}  ← uncomment and wire when you have real auth
      />
    </div>
  </header>
);

// ── AppShell (main export) ─────────────────────────────────────
export const AppShell: React.FC<AppShellProps> = ({
  children,
  username = "Admin", // TODO: replace with auth context value
  notifCount = 3, // TODO: replace with notification API value
  pageTitle = "",
  showSearch = true,
  variant = "home",
}) => {
  const { navigate } = useNavigation();

  // Choose sidebar nav based on variant
  const nav = variant === "dashboard" ? DASHBOARD_NAV : HOME_NAV;

  const handleLogout = () => {
    // TODO: call your real logout API here before navigating
    navigate("signIn");
  };

  return (
    <div className="min-h-screen bg-gray-50 font-[family-name:var(--font-sans)]">
      {/* Fixed sidebar */}
      <Sidebar nav={nav} onLogout={handleLogout} />

      {/* Main area: offset by sidebar width */}
      <div className="ml-[240px] flex flex-col min-h-screen">
        <Topbar
          pageTitle={pageTitle}
          username={username}
          notifCount={notifCount}
          showSearch={showSearch}
        />
        {/* Page content */}
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};
