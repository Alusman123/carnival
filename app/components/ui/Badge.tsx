// components/ui/Badge.tsx
// ─────────────────────────────────────────────────────────────
// Reusable Badge components for DocuKnow
//
// Components exported:
//   Badge          → Generic labeled tag/chip
//   StatusBadge    → Document/access status (Approved, Pending, Denied, New, etc.)
//   UserRoleBadge  → User role chip (Admin, User, Reviewer, etc.)
//   NotifBadge     → Notification count bubble
//
// DATA / PROPS — Badge:
//   label     → Display text — DATA
//   variant   → Color scheme
//   size      → 'sm' | 'md'
//   dot       → Show leading colored dot
//   icon      → Optional leading icon
//   onRemove  → Shows ✕ button for tag-style chips
//
// DATA / PROPS — StatusBadge:
//   status    → 'approved' | 'pending' | 'denied' | 'new' |
//               'in-progress' | 'resolved' | 'review' — DATA from API
//
// DATA / PROPS — UserRoleBadge:
//   role      → 'admin' | 'user' | 'reviewer' | 'manager' — DATA from user object
//
// DATA / PROPS — NotifBadge:
//   count     → Notification number — DATA from notification API
//   max       → Cap display at this number (default 99)
// ─────────────────────────────────────────────────────────────

import React from "react";
import { cn } from "@/app/lib/utils";

/* ══════════════════════════════════════════════════════════
   Generic Badge
══════════════════════════════════════════════════════════ */

export type BadgeVariant =
  | "default"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "gray";

export type BadgeSize = "sm" | "md";

export interface BadgeProps {
  label: string; // DATA: badge text
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  icon?: React.ReactNode;
  onRemove?: () => void; // DATA: removal handler for tag chips
  className?: string;
}

const badgeVariantStyles: Record<
  BadgeVariant,
  { bg: string; text: string; dot: string }
> = {
  default: { bg: "bg-gray-100", text: "text-gray-700", dot: "bg-gray-400" },
  primary: { bg: "bg-[#FEF0F1]", text: "text-[#D72638]", dot: "bg-[#D72638]" },
  success: { bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500" },
  warning: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-400" },
  danger: { bg: "bg-red-50", text: "text-red-600", dot: "bg-red-500" },
  info: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  gray: { bg: "bg-gray-50", text: "text-gray-500", dot: "bg-gray-400" },
};

const badgeSizeStyles: Record<BadgeSize, string> = {
  sm: "text-[10px] px-1.5 py-0.5 gap-1",
  md: "text-xs px-2.5 py-1 gap-1.5",
};

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = "default",
  size = "md",
  dot = false,
  icon,
  onRemove,
  className,
}) => {
  const styles = badgeVariantStyles[variant];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium",
        "font-[family-name:var(--font-sans)]",
        styles.bg,
        styles.text,
        badgeSizeStyles[size],
        className,
      )}
    >
      {dot && (
        <span
          className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", styles.dot)}
        />
      )}
      {icon && (
        <span className="[&>svg]:w-3 [&>svg]:h-3 flex-shrink-0">{icon}</span>
      )}
      {label}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className={cn(
            "ml-0.5 rounded-full p-0.5",
            "hover:bg-black/10 transition-colors duration-100",
            "focus:outline-none focus-visible:ring-1 focus-visible:ring-current",
          )}
          aria-label={`Remove ${label}`}
        >
          <svg className="w-2.5 h-2.5" viewBox="0 0 10 10" fill="currentColor">
            <path
              d="M8.5 1.5L1.5 8.5M1.5 1.5L8.5 8.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      )}
    </span>
  );
};

/* ══════════════════════════════════════════════════════════
   StatusBadge — document/access/feedback status
   DATA: status comes from API response object
══════════════════════════════════════════════════════════ */

export type DocumentStatus =
  | "approved"
  | "pending"
  | "denied"
  | "new"
  | "in-progress"
  | "resolved"
  | "review"
  | "processing";

interface StatusConfig {
  label: string;
  variant: BadgeVariant;
}

// DATA: map of status → display config
// Add new statuses here as the API evolves
const statusConfig: Record<DocumentStatus, StatusConfig> = {
  approved: { label: "Approved", variant: "success" },
  pending: { label: "Pending", variant: "warning" },
  denied: { label: "Denied", variant: "danger" },
  new: { label: "New", variant: "info" },
  "in-progress": { label: "In Progress", variant: "primary" },
  resolved: { label: "Resolved", variant: "success" },
  review: { label: "Needs Review", variant: "warning" },
  processing: { label: "Processing", variant: "gray" },
};

export interface StatusBadgeProps {
  status: DocumentStatus; // DATA: from document/feedback/access API
  size?: BadgeSize;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = "md",
  className,
}) => {
  const config = statusConfig[status] ?? {
    label: status,
    variant: "gray" as BadgeVariant,
  };

  return (
    <Badge
      label={config.label}
      variant={config.variant}
      size={size}
      dot
      className={className}
    />
  );
};

/* ══════════════════════════════════════════════════════════
   UserRoleBadge
   DATA: role comes from user object in auth/user API
══════════════════════════════════════════════════════════ */

export type UserRole = "admin" | "user" | "reviewer" | "manager" | "guest";

const roleConfig: Record<UserRole, { label: string; variant: BadgeVariant }> = {
  admin: { label: "Admin", variant: "danger" },
  manager: { label: "Manager", variant: "primary" },
  reviewer: { label: "Reviewer", variant: "info" },
  user: { label: "User", variant: "default" },
  guest: { label: "Guest", variant: "gray" },
};

export interface UserRoleBadgeProps {
  role: UserRole; // DATA: from user.role in API response
  size?: BadgeSize;
  className?: string;
}

export const UserRoleBadge: React.FC<UserRoleBadgeProps> = ({
  role,
  size = "md",
  className,
}) => {
  const config = roleConfig[role] ?? {
    label: role,
    variant: "gray" as BadgeVariant,
  };

  return (
    <Badge
      label={config.label}
      variant={config.variant}
      size={size}
      className={className}
    />
  );
};

/* ══════════════════════════════════════════════════════════
   NotifBadge — notification count bubble
   DATA: count from notification API / real-time socket
══════════════════════════════════════════════════════════ */

export interface NotifBadgeProps {
  count: number; // DATA: unread notification count
  max?: number; // Cap before showing "99+"
  className?: string;
}

export const NotifBadge: React.FC<NotifBadgeProps> = ({
  count,
  max = 99,
  className,
}) => {
  if (count <= 0) return null;

  const display = count > max ? `${max}+` : String(count);

  return (
    <span
      aria-label={`${count} notifications`}
      className={cn(
        "absolute -top-1 -right-1",
        "inline-flex items-center justify-center",
        "min-w-[18px] h-[18px] px-1",
        "bg-[#D72638] text-white",
        "text-[10px] font-bold leading-none",
        "rounded-full ring-2 ring-white",
        "font-[family-name:var(--font-sans)]",
        "animate-[bounce_0.4s_ease-out]",
        className,
      )}
    >
      {display}
    </span>
  );
};
