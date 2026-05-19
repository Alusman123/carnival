// components/ui/LoadingSpinner.tsx
// ─────────────────────────────────────────────────────────────
// Reusable loading spinner for buttons, overlays, and suspense
//
// DATA / PROPS:
//   size   → 'xs' | 'sm' | 'md' | 'lg' — controls diameter
//   color  → 'red' | 'white' | 'gray'   — spinner track color
//   label  → Optional accessible text (screen readers)
// ─────────────────────────────────────────────────────────────

import React from "react";
import { cn } from "@/app/lib/utils";

export type SpinnerSize = "xs" | "sm" | "md" | "lg";
export type SpinnerColor = "red" | "white" | "gray";

interface LoadingSpinnerProps {
  size?: SpinnerSize;
  color?: SpinnerColor;
  label?: string;
  className?: string;
}

const sizeMap: Record<SpinnerSize, string> = {
  xs: "h-3 w-3 border-[1.5px]",
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-8 w-8 border-[3px]",
};

const colorMap: Record<SpinnerColor, string> = {
  red: "border-[#D72638]/20 border-t-[#D72638]",
  white: "border-white/30 border-t-white",
  gray: "border-gray-200 border-t-gray-500",
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  color = "red",
  label = "Loading…",
  className,
}) => {
  return (
    <span
      role="status"
      aria-label={label}
      className={cn("inline-flex items-center justify-center", className)}
    >
      <span
        className={cn(
          "rounded-full animate-spin",
          sizeMap[size],
          colorMap[color],
        )}
      />
      <span className="sr-only">{label}</span>
    </span>
  );
};

// ─────────────────────────────────────────────────────────────
// FullPageSpinner — centered spinner for page-level loading
// ─────────────────────────────────────────────────────────────
export const FullPageSpinner: React.FC<{ label?: string }> = ({
  label = "Loading…",
}) => (
  <div className="fixed inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-50">
    <LoadingSpinner size="lg" color="red" label={label} />
    <p className="mt-4 text-sm text-gray-500 font-[family-name:var(--font-sans)]">
      {label}
    </p>
  </div>
);
