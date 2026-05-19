// components/ui/Feedback.tsx
// ─────────────────────────────────────────────────────────────
// UI State & Feedback components
//
// Components exported:
//   SkeletonLoader     → Animated content placeholder
//   EmptyState         → Zero-data illustration + CTA
//   ErrorMessage       → Inline error block
//   SuccessMessage     → Inline success block
//   ToastNotification  → Auto-dismissing toast (imperative API via hook)
//
// DATA / PROPS — SkeletonLoader:
//   variant   → 'text' | 'card' | 'table-row' | 'avatar' | 'custom'
//   lines     → Number of text lines (variant: 'text')
//   count     → Number of rows (variant: 'table-row' | 'card')
//
// DATA / PROPS — EmptyState:
//   title       → Main heading — DATA or static
//   description → Supporting text — DATA or static
//   icon        → Illustration/icon element
//   action      → { label, onClick } CTA button
//
// DATA / PROPS — ErrorMessage / SuccessMessage:
//   title       → Bold heading
//   message     → Detail text — DATA from API error
//   onRetry     → Retry handler (ErrorMessage)
//   onDismiss   → Dismiss handler
//
// DATA / PROPS — ToastNotification:
//   toasts      → Array of toast objects — DATA from useNotifications hook
//   Each toast: { id, type, title, message, duration }
// ─────────────────────────────────────────────────────────────

"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/app/lib/utils";

/* ══════════════════════════════════════════════════════════
   SkeletonLoader
══════════════════════════════════════════════════════════ */

const shimmer = "animate-pulse bg-gray-200 rounded";

export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({
  lines = 3,
  className,
}) => (
  <div className={cn("space-y-2.5", className)}>
    {Array.from({ length: lines }).map((_, i) => (
      <div
        key={i}
        className={cn(shimmer, "h-3", i === lines - 1 ? "w-3/4" : "w-full")}
      />
    ))}
  </div>
);

export const SkeletonCard: React.FC<{ count?: number; className?: string }> = ({
  count = 1,
  className,
}) => (
  <div className={cn("grid gap-4", className)}>
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className="bg-white rounded-xl border border-gray-100 p-5 space-y-3 animate-pulse"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gray-200" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3 w-32 bg-gray-200 rounded-full" />
            <div className="h-2.5 w-24 bg-gray-100 rounded-full" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-3 w-full bg-gray-100 rounded-full" />
          <div className="h-3 w-5/6 bg-gray-100 rounded-full" />
        </div>
      </div>
    ))}
  </div>
);

export const SkeletonTableRow: React.FC<{
  columns?: number;
  count?: number;
  className?: string;
}> = ({ columns = 5, count = 5, className }) => (
  <div className={cn("space-y-1", className)}>
    {Array.from({ length: count }).map((_, rowIdx) => (
      <div
        key={rowIdx}
        className="flex items-center gap-4 px-4 py-3 animate-pulse border-b border-gray-50"
      >
        {Array.from({ length: columns }).map((_, colIdx) => (
          <div
            key={colIdx}
            className={cn(
              "h-3 rounded-full bg-gray-200",
              colIdx === 0
                ? "w-1/4"
                : colIdx === columns - 1
                  ? "w-16"
                  : "flex-1",
            )}
          />
        ))}
      </div>
    ))}
  </div>
);

/* ══════════════════════════════════════════════════════════
   EmptyState
   DATA: title/description/action from parent component logic
══════════════════════════════════════════════════════════ */

export interface EmptyStateProps {
  title: string; // DATA: contextual empty state title
  description?: string; // DATA: contextual description
  icon?: React.ReactNode;
  action?: {
    label: string; // DATA: CTA label
    onClick: () => void; // DATA: CTA handler
  };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  action,
  className,
}) => {
  const DefaultIcon = () => (
    <svg className="w-12 h-12 text-gray-300" viewBox="0 0 48 48" fill="none">
      <rect
        x="8"
        y="6"
        width="24"
        height="32"
        rx="3"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M15 16h10M15 22h10M15 28h6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M32 30l6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="32" cy="28" r="5" stroke="currentColor" strokeWidth="2" />
    </svg>
  );

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-6 text-center",
        "font-[family-name:var(--font-sans)]",
        className,
      )}
    >
      {/* Icon */}
      <div className="mb-5 opacity-60">{icon ?? <DefaultIcon />}</div>

      {/* Title — DATA */}
      <h3 className="text-base font-semibold text-gray-700 mb-2">{title}</h3>

      {/* Description — DATA */}
      {description && (
        <p className="text-sm text-gray-400 max-w-sm leading-relaxed mb-6">
          {description}
        </p>
      )}

      {/* Action — DATA: label + handler */}
      {action && (
        <button
          onClick={action.onClick}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium",
            "bg-[#D72638] text-white",
            "hover:bg-[#B01E2C] transition-colors duration-150",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D72638]/30",
          )}
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

/* ══════════════════════════════════════════════════════════
   ErrorMessage & SuccessMessage — inline blocks
   DATA: message/title from API response or validation
══════════════════════════════════════════════════════════ */

interface FeedbackBlockProps {
  title?: string; // DATA: heading
  message: string; // DATA: detail
  onDismiss?: () => void;
  className?: string;
}

export const ErrorMessage: React.FC<
  FeedbackBlockProps & { onRetry?: () => void }
> = ({
  title = "Something went wrong",
  message,
  onRetry,
  onDismiss,
  className,
}) => (
  <div
    role="alert"
    className={cn(
      "rounded-xl p-4 border border-red-100 bg-red-50",
      "flex gap-3 font-[family-name:var(--font-sans)]",
      className,
    )}
  >
    <svg
      className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
        clipRule="evenodd"
      />
    </svg>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-red-800">{title}</p>
      <p className="text-xs text-red-600 mt-0.5">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 text-xs font-medium text-red-700 underline hover:no-underline focus:outline-none"
        >
          Try again
        </button>
      )}
    </div>
    {onDismiss && (
      <button
        onClick={onDismiss}
        className="text-red-400 hover:text-red-600 flex-shrink-0 focus:outline-none"
      >
        <svg
          className="w-4 h-4"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        >
          <path d="M12 4L4 12M4 4l8 8" />
        </svg>
      </button>
    )}
  </div>
);

export const SuccessMessage: React.FC<FeedbackBlockProps> = ({
  title = "Success",
  message,
  onDismiss,
  className,
}) => (
  <div
    role="status"
    className={cn(
      "rounded-xl p-4 border border-green-100 bg-green-50",
      "flex gap-3 font-[family-name:var(--font-sans)]",
      className,
    )}
  >
    <svg
      className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    </svg>
    <div className="flex-1">
      <p className="text-sm font-semibold text-green-800">{title}</p>
      <p className="text-xs text-green-600 mt-0.5">{message}</p>
    </div>
    {onDismiss && (
      <button
        onClick={onDismiss}
        className="text-green-400 hover:text-green-600 flex-shrink-0 focus:outline-none"
      >
        <svg
          className="w-4 h-4"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        >
          <path d="M12 4L4 12M4 4l8 8" />
        </svg>
      </button>
    )}
  </div>
);

/* ══════════════════════════════════════════════════════════
   ToastNotification
   DATA: toasts array from useNotifications() hook
         Each toast: { id, type, title, message?, duration? }
══════════════════════════════════════════════════════════ */

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string; // DATA: unique toast id (e.g. crypto.randomUUID())
  type: ToastType; // DATA: determines color/icon
  title: string; // DATA: toast heading
  message?: string; // DATA: optional detail
  duration?: number; // DATA: ms before auto-dismiss (default 4000)
}

interface ToastItemProps {
  toast: Toast;
  onDismiss: (id: string) => void;
}

const toastConfig: Record<
  ToastType,
  {
    bg: string;
    border: string;
    icon: React.ReactNode;
    titleColor: string;
    msgColor: string;
  }
> = {
  success: {
    bg: "bg-white",
    border: "border-green-100",
    titleColor: "text-gray-900",
    msgColor: "text-gray-500",
    icon: (
      <svg
        className="w-5 h-5 text-green-500"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  error: {
    bg: "bg-white",
    border: "border-red-100",
    titleColor: "text-gray-900",
    msgColor: "text-gray-500",
    icon: (
      <svg
        className="w-5 h-5 text-red-500"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  warning: {
    bg: "bg-white",
    border: "border-amber-100",
    titleColor: "text-gray-900",
    msgColor: "text-gray-500",
    icon: (
      <svg
        className="w-5 h-5 text-amber-500"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  info: {
    bg: "bg-white",
    border: "border-blue-100",
    titleColor: "text-gray-900",
    msgColor: "text-gray-500",
    icon: (
      <svg
        className="w-5 h-5 text-blue-500"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
};

const ToastItem: React.FC<ToastItemProps> = ({ toast, onDismiss }) => {
  const [exiting, setExiting] = useState(false);
  const config = toastConfig[toast.type];
  const duration = toast.duration ?? 4000;

  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(() => onDismiss(toast.id), 300);
    }, duration);
    return () => clearTimeout(timer);
  }, [toast.id, duration, onDismiss]);

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-4 rounded-xl border shadow-lg min-w-[300px] max-w-[400px]",
        "font-[family-name:var(--font-sans)]",
        config.bg,
        config.border,
        "transition-all duration-300",
        exiting
          ? "opacity-0 translate-x-4 scale-95"
          : "opacity-100 translate-x-0 scale-100",
      )}
    >
      <span className="flex-shrink-0 mt-0.5">{config.icon}</span>
      <div className="flex-1 min-w-0">
        {/* DATA: toast.title */}
        <p className={cn("text-sm font-semibold", config.titleColor)}>
          {toast.title}
        </p>
        {/* DATA: toast.message */}
        {toast.message && (
          <p className={cn("text-xs mt-0.5 leading-relaxed", config.msgColor)}>
            {toast.message}
          </p>
        )}
      </div>
      <button
        onClick={() => {
          setExiting(true);
          setTimeout(() => onDismiss(toast.id), 300);
        }}
        className="flex-shrink-0 text-gray-300 hover:text-gray-500 transition-colors focus:outline-none"
        aria-label="Dismiss"
      >
        <svg
          className="w-4 h-4"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        >
          <path d="M12 4L4 12M4 4l8 8" />
        </svg>
      </button>
    </div>
  );
};

export const ToastContainer: React.FC<{
  toasts: Toast[]; // DATA: from useNotifications hook
  onDismiss: (id: string) => void;
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
}> = ({ toasts, onDismiss, position = "top-right" }) => {
  const positionStyles = {
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
  };

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className={cn(
        "fixed z-[100] flex flex-col gap-2 pointer-events-none",
        positionStyles[position],
      )}
    >
      {/* DATA: toasts array rendered here */}
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem toast={toast} onDismiss={onDismiss} />
        </div>
      ))}
    </div>
  );
};
