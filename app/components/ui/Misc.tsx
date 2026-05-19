// components/ui/Misc.tsx
// ─────────────────────────────────────────────────────────────
// Miscellaneous reusable primitives: Avatar, Logo, Divider, Tooltip
//
// DATA / PROPS — Avatar:
//   src      → Image URL — DATA from user profile
//   name     → Full name (used for initials fallback) — DATA from user
//   size     → 'xs' | 'sm' | 'md' | 'lg' | 'xl'
//   role     → Optional role badge overlay
//   online   → Shows green online indicator dot
//
// DATA / PROPS — Logo:
//   size     → 'sm' | 'md' | 'lg'
//   variant  → 'full' (icon + text) | 'icon' (icon only)
//   href     → Wraps in link when provided
//
// DATA / PROPS — Divider:
//   label    → Optional centered text label
//   orientation → 'horizontal' | 'vertical'
//
// DATA / PROPS — Tooltip:
//   content  → Tooltip text — DATA
//   position → 'top' | 'bottom' | 'left' | 'right'
//   children → The trigger element
// ─────────────────────────────────────────────────────────────

"use client";

import React, { useState } from "react";
import { cn } from "@/app/lib/utils";

/* ══════════════════════════════════════════════════════════
   Avatar
══════════════════════════════════════════════════════════ */

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface AvatarProps {
  src?: string | null; // DATA: user.avatarUrl from API
  name?: string; // DATA: user.name from API (for initials)
  size?: AvatarSize;
  online?: boolean; // DATA: user presence/online status
  className?: string;
}

const avatarSizes: Record<
  AvatarSize,
  { container: string; text: string; dot: string }
> = {
  xs: {
    container: "w-6 h-6 text-[9px]",
    text: "font-semibold",
    dot: "w-1.5 h-1.5 border",
  },
  sm: {
    container: "w-8 h-8 text-xs",
    text: "font-semibold",
    dot: "w-2 h-2 border",
  },
  md: {
    container: "w-9 h-9 text-sm",
    text: "font-semibold",
    dot: "w-2.5 h-2.5 border-2",
  },
  lg: {
    container: "w-11 h-11 text-base",
    text: "font-bold",
    dot: "w-3 h-3 border-2",
  },
  xl: {
    container: "w-14 h-14 text-xl",
    text: "font-bold",
    dot: "w-3.5 h-3.5 border-2",
  },
};

function getInitials(name?: string): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

// Deterministic color from name
function getAvatarColor(name?: string): string {
  const colors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-amber-500",
    "bg-emerald-500",
    "bg-teal-500",
    "bg-cyan-500",
    "bg-blue-500",
    "bg-indigo-500",
    "bg-violet-500",
    "bg-pink-500",
  ];
  if (!name) return "bg-gray-400";
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = "md",
  online,
  className,
}) => {
  const [imgError, setImgError] = useState(false);
  const sizeStyle = avatarSizes[size];
  const showInitials = !src || imgError;
  const initials = getInitials(name);
  const bgColor = getAvatarColor(name);

  return (
    <div className={cn("relative inline-flex flex-shrink-0", className)}>
      <div
        className={cn(
          "rounded-full flex items-center justify-center overflow-hidden",
          "ring-2 ring-white",
          sizeStyle.container,
          showInitials && bgColor,
        )}
      >
        {!showInitials ? (
          // DATA: src from user.avatarUrl
          <img
            src={src!}
            alt={name ?? "User avatar"}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <span
            className={cn(
              "text-white leading-none",
              sizeStyle.text,
              "font-[family-name:var(--font-sans)]",
            )}
          >
            {initials}
          </span>
        )}
      </div>

      {/* Online indicator — DATA: online boolean from presence API */}
      {online !== undefined && (
        <span
          aria-label={online ? "Online" : "Offline"}
          className={cn(
            "absolute bottom-0 right-0 rounded-full border-white",
            sizeStyle.dot,
            online ? "bg-green-400" : "bg-gray-300",
          )}
        />
      )}
    </div>
  );
};

/* ══════════════════════════════════════════════════════════
   Logo — DocuKnow brand logo
   DATA: No dynamic data — static brand asset
══════════════════════════════════════════════════════════ */

export type LogoSize = "sm" | "md" | "lg";
export type LogoVariant = "full" | "icon";

export interface LogoProps {
  size?: LogoSize;
  variant?: LogoVariant;
  href?: string;
  className?: string;
  // DATA: If you ever want to make app name dynamic, pass it as `appName`
  appName?: string;
}

const logoSizes: Record<LogoSize, { icon: string; text: string }> = {
  sm: { icon: "w-6 h-6", text: "text-base" },
  md: { icon: "w-8 h-8", text: "text-xl" },
  lg: { icon: "w-10 h-10", text: "text-2xl" },
};

const LogoIcon: React.FC<{ className?: string }> = ({ className }) => (
  <div
    className={cn(
      "bg-[#D72638] rounded-xl flex items-center justify-center flex-shrink-0",
      className,
    )}
  >
    <svg viewBox="0 0 32 32" fill="none" className="w-5/8 h-5/8">
      <rect
        x="6"
        y="4"
        width="14"
        height="18"
        rx="2"
        fill="white"
        opacity="0.9"
      />
      <rect
        x="12"
        y="10"
        width="14"
        height="18"
        rx="2"
        fill="white"
        opacity="0.6"
      />
      <line
        x1="9"
        y1="9"
        x2="17"
        y2="9"
        stroke="#D72638"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="9"
        y1="12"
        x2="17"
        y2="12"
        stroke="#D72638"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="9"
        y1="15"
        x2="14"
        y2="15"
        stroke="#D72638"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  </div>
);

export const Logo: React.FC<LogoProps> = ({
  size = "md",
  variant = "full",
  href,
  className,
  appName = "DocuKnow",
}) => {
  const { icon, text } = logoSizes[size];

  const inner = (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoIcon className={icon} />
      {variant === "full" && (
        <span
          className={cn(
            "font-bold text-gray-900 tracking-tight",
            "font-[family-name:var(--font-sans)]",
            text,
          )}
        >
          {/* DATA: appName prop */}
          {appName}
        </span>
      )}
    </span>
  );

  if (href) {
    return (
      <a
        href={href}
        className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D72638]/30 rounded-lg"
      >
        {inner}
      </a>
    );
  }

  return inner;
};

/* ══════════════════════════════════════════════════════════
   Divider
══════════════════════════════════════════════════════════ */

export interface DividerProps {
  label?: string; // Optional centered text — DATA or static
  orientation?: "horizontal" | "vertical";
  className?: string;
}

export const Divider: React.FC<DividerProps> = ({
  label,
  orientation = "horizontal",
  className,
}) => {
  if (orientation === "vertical") {
    return (
      <div
        className={cn("w-px bg-gray-200 self-stretch", className)}
        role="separator"
      />
    );
  }

  if (label) {
    return (
      <div
        className={cn("flex items-center gap-3", className)}
        role="separator"
      >
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400 font-medium whitespace-nowrap font-[family-name:var(--font-sans)]">
          {/* DATA: label string */}
          {label}
        </span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>
    );
  }

  return (
    <hr
      className={cn("border-0 border-t border-gray-200", className)}
      role="separator"
    />
  );
};

/* ══════════════════════════════════════════════════════════
   Tooltip
══════════════════════════════════════════════════════════ */

export type TooltipPosition = "top" | "bottom" | "left" | "right";

export interface TooltipProps {
  content: string; // DATA: tooltip text
  position?: TooltipPosition;
  children: React.ReactNode;
  className?: string;
}

const tooltipPositions: Record<
  TooltipPosition,
  { tooltip: string; arrow: string }
> = {
  top: {
    tooltip: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    arrow: "top-full left-1/2 -translate-x-1/2 border-t-gray-800",
  },
  bottom: {
    tooltip: "top-full left-1/2 -translate-x-1/2 mt-2",
    arrow: "bottom-full left-1/2 -translate-x-1/2 border-b-gray-800",
  },
  left: {
    tooltip: "right-full top-1/2 -translate-y-1/2 mr-2",
    arrow: "left-full top-1/2 -translate-y-1/2 border-l-gray-800",
  },
  right: {
    tooltip: "left-full top-1/2 -translate-y-1/2 ml-2",
    arrow: "right-full top-1/2 -translate-y-1/2 border-r-gray-800",
  },
};

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  position = "top",
  children,
  className,
}) => {
  const [visible, setVisible] = useState(false);
  const pos = tooltipPositions[position];

  return (
    <div
      className={cn("relative inline-flex", className)}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}

      {/* Tooltip bubble */}
      <div
        role="tooltip"
        className={cn(
          "absolute z-50 pointer-events-none",
          "px-2.5 py-1.5 rounded-lg",
          "bg-gray-800 text-white text-xs font-medium whitespace-nowrap",
          "font-[family-name:var(--font-sans)]",
          "transition-all duration-150",
          pos.tooltip,
          visible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-0.5 pointer-events-none",
        )}
      >
        {/* DATA: content string */}
        {content}
      </div>
    </div>
  );
};
