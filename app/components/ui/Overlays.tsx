// components/ui/Overlays.tsx
// ─────────────────────────────────────────────────────────────
// Tabs, Modal, ConfirmationModal
//
// DATA / PROPS — Tabs:
//   tabs       → Array of { id, label, icon?, badge? } — DATA from config
//   activeTab  → Currently active tab id — DATA from parent state
//   onChange   → Tab switch handler
//   variant    → 'underline' | 'pill' | 'bordered'
//
// DATA / PROPS — Modal:
//   isOpen     → Boolean — DATA from useModal hook
//   onClose    → Close handler
//   title      → Modal heading — DATA
//   size       → 'sm' | 'md' | 'lg' | 'xl' | 'full'
//   children   → Modal body content
//
// DATA / PROPS — ConfirmationModal:
//   isOpen, onClose, onConfirm
//   title, message — DATA: contextual to the action
//   confirmLabel, cancelLabel
//   variant → 'danger' | 'warning' | 'info'
//   isLoading → true while async action is processing
// ─────────────────────────────────────────────────────────────

"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/app/lib/utils";
import { Button } from "./Button";
import { LoadingSpinner } from "./LoadingSpinner";

/* ══════════════════════════════════════════════════════════
   Tabs
══════════════════════════════════════════════════════════ */

export interface TabItem {
  id: string; // DATA: unique tab identifier
  label: string; // DATA: display label
  icon?: React.ReactNode;
  badge?: string | number; // DATA: badge count or text
  disabled?: boolean;
}

export type TabVariant = "underline" | "pill" | "bordered";

export interface TabsProps {
  tabs: TabItem[]; // DATA: tab config from parent
  activeTab: string; // DATA: current active tab id
  onChange: (id: string) => void;
  variant?: TabVariant;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  variant = "underline",
  className,
}) => {
  const containerStyles: Record<TabVariant, string> = {
    underline: "border-b border-gray-200 gap-0",
    pill: "bg-gray-100 p-1 rounded-xl gap-1",
    bordered: "gap-0",
  };

  const tabStyles: Record<
    TabVariant,
    { base: string; active: string; inactive: string }
  > = {
    underline: {
      base: "pb-3 px-1 text-sm font-medium border-b-2 -mb-px transition-all duration-200",
      active: "border-[#D72638] text-[#D72638]",
      inactive:
        "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
    },
    pill: {
      base: "px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200",
      active: "bg-white text-gray-900 shadow-sm",
      inactive: "text-gray-500 hover:text-gray-700",
    },
    bordered: {
      base: "px-4 py-2.5 text-sm font-medium border border-b-0 -ml-px first:ml-0 first:rounded-tl-lg last:rounded-tr-lg transition-colors duration-150",
      active: "bg-white border-gray-200 text-[#D72638] relative z-10",
      inactive: "bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100",
    },
  };

  const styles = tabStyles[variant];

  return (
    <div
      role="tablist"
      className={cn(
        "flex items-center font-[family-name:var(--font-sans)]",
        containerStyles[variant],
        className,
      )}
    >
      {/* DATA: tabs array renders here */}
      {tabs.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={activeTab === tab.id}
          aria-controls={`panel-${tab.id}`}
          disabled={tab.disabled}
          onClick={() => !tab.disabled && onChange(tab.id)}
          className={cn(
            "inline-flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D72638]/30 rounded",
            styles.base,
            activeTab === tab.id ? styles.active : styles.inactive,
            tab.disabled && "opacity-40 cursor-not-allowed",
          )}
        >
          {tab.icon && (
            <span className="[&>svg]:w-4 [&>svg]:h-4">{tab.icon}</span>
          )}
          {tab.label}
          {/* DATA: badge count */}
          {tab.badge !== undefined && (
            <span
              className={cn(
                "px-1.5 py-0.5 rounded-full text-[10px] font-semibold leading-none",
                activeTab === tab.id
                  ? "bg-[#D72638] text-white"
                  : "bg-gray-200 text-gray-600",
              )}
            >
              {tab.badge}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};

/* ══════════════════════════════════════════════════════════
   Modal
══════════════════════════════════════════════════════════ */

export type ModalSize = "sm" | "md" | "lg" | "xl" | "full";

export interface ModalProps {
  isOpen: boolean; // DATA: from useModal hook
  onClose: () => void;
  title?: string; // DATA: modal heading
  description?: string; // DATA: modal sub-heading
  size?: ModalSize;
  children: React.ReactNode;
  footer?: React.ReactNode;
  hideCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
}

const modalSizes: Record<ModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-2xl",
  full: "max-w-full mx-4",
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  size = "md",
  children,
  footer,
  hideCloseButton = false,
  closeOnOverlayClick = true,
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Trap focus & handle Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal
      aria-labelledby={title ? "modal-title" : undefined}
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-4",
        "font-[family-name:var(--font-sans)]",
      )}
      onClick={(e) => {
        if (closeOnOverlayClick && e.target === overlayRef.current) onClose();
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] animate-[fadeIn_0.15s_ease-out]" />

      {/* Panel */}
      <div
        className={cn(
          "relative w-full bg-white rounded-2xl shadow-2xl",
          "animate-[slideUp_0.2s_ease-out]",
          modalSizes[size],
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {(title || !hideCloseButton) && (
          <div className="flex items-start justify-between px-6 pt-6 pb-4">
            <div>
              {title && (
                <h2
                  id="modal-title"
                  className="text-lg font-semibold text-gray-900"
                >
                  {/* DATA: title string */}
                  {title}
                </h2>
              )}
              {description && (
                <p className="text-sm text-gray-500 mt-1">{description}</p>
              )}
            </div>
            {!hideCloseButton && (
              <button
                onClick={onClose}
                className="flex-shrink-0 ml-4 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D72638]/30"
                aria-label="Close modal"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                >
                  <path d="M15 5L5 15M5 5l10 10" />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Body — DATA: children with form/content */}
        <div
          className={cn(
            "px-6",
            !title ? "pt-6" : "",
            !footer ? "pb-6" : "pb-2",
          )}
        >
          {children}
        </div>

        {/* Footer — DATA: action buttons */}
        {footer && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════
   ConfirmationModal
   DATA: title/message from the action context (delete, submit, etc.)
══════════════════════════════════════════════════════════ */

export type ConfirmVariant = "danger" | "warning" | "info";

export interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void; // DATA: the action to confirm
  title: string; // DATA: e.g. "Delete Document?"
  message: string; // DATA: e.g. "This action cannot be undone."
  confirmLabel?: string; // DATA: e.g. "Delete"
  cancelLabel?: string;
  variant?: ConfirmVariant;
  isLoading?: boolean; // DATA: true while async delete/action runs
}

const confirmConfig: Record<
  ConfirmVariant,
  {
    iconBg: string;
    iconColor: string;
    confirmVariant: "primary" | "danger";
    icon: React.ReactNode;
  }
> = {
  danger: {
    iconBg: "bg-red-50",
    iconColor: "text-red-500",
    confirmVariant: "danger",
    icon: (
      <svg
        className="w-6 h-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
        />
      </svg>
    ),
  },
  warning: {
    iconBg: "bg-amber-50",
    iconColor: "text-amber-500",
    confirmVariant: "primary",
    icon: (
      <svg
        className="w-6 h-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
        />
      </svg>
    ),
  },
  info: {
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
    confirmVariant: "primary",
    icon: (
      <svg
        className="w-6 h-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
        />
      </svg>
    ),
  },
};

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  isLoading = false,
}) => {
  const config = confirmConfig[variant];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" hideCloseButton>
      <div className="text-center py-2 font-[family-name:var(--font-sans)]">
        {/* Icon */}
        <div
          className={cn(
            "mx-auto mb-4 w-14 h-14 rounded-full flex items-center justify-center",
            config.iconBg,
          )}
        >
          <span className={config.iconColor}>{config.icon}</span>
        </div>

        {/* Title — DATA */}
        <h3 className="text-base font-semibold text-gray-900 mb-2">{title}</h3>

        {/* Message — DATA */}
        <p className="text-sm text-gray-500 leading-relaxed mb-6">{message}</p>

        {/* Actions */}
        <div className="flex gap-3 justify-center">
          <Button
            label={cancelLabel}
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            label={isLoading ? undefined : confirmLabel}
            variant={config.confirmVariant}
            onClick={onConfirm}
            isLoading={isLoading}
            className="flex-1"
          />
        </div>
      </div>
    </Modal>
  );
};
