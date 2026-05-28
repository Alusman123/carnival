"use client";

// components/ui/Modal.tsx
// ─────────────────────────────────────────────────────────────
// Reusable document detail modal
//
// Changes:
//   • Body and description text are now black (text-black)
//   • Bookmark / Save button in top-right of left panel
//   • isSaved / onSaveToggle props for controlled save state
// ─────────────────────────────────────────────────────────────

import React, { useState, useEffect } from "react";
import { cn } from "@/app/lib/utils";

// ── Icons ──────────────────────────────────────────────────────
const XIcon = () => (
  <svg
    className="w-4 h-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.5}
    strokeLinecap="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const ChevronLeftIcon = () => (
  <svg
    className="w-4 h-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.5}
    strokeLinecap="round"
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
const ChevronRightIcon = () => (
  <svg
    className="w-4 h-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.5}
    strokeLinecap="round"
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

// Bookmark icon — filled red when saved, outlined when not
const BookmarkIcon = ({ filled }: { filled: boolean }) => (
  <svg
    className="w-5 h-5 transition-all duration-200"
    viewBox="0 0 24 24"
    fill={filled ? "#D72638" : "none"}
    stroke="#D72638"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
  </svg>
);

const ImagePlaceholderIcon = () => (
  <svg
    className="w-28 h-28"
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="28"
      y="18"
      width="70"
      height="70"
      rx="12"
      fill="#D72638"
      opacity="0.25"
    />
    <rect x="18" y="28" width="70" height="70" rx="12" fill="#D72638" />
    <circle cx="36" cy="50" r="6" fill="white" opacity="0.9" />
    <polyline
      points="22,88 46,56 62,74 74,62 88,88"
      stroke="white"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

// ── Types ──────────────────────────────────────────────────────
export interface DocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string; // DATA: document.description
  body?: string; // DATA: document.body / content
  date?: string; // DATA: document.createdAt formatted
  images?: string[]; // DATA: document.attachments[]
  className?: string;
  // ── Save / bookmark ─────────────────────────────────────────
  // Pass isSaved + onSaveToggle for controlled mode (wired to API).
  // If not passed, component manages save state internally.
  isSaved?: boolean;
  onSaveToggle?: (saved: boolean) => void;
}

export const Modal: React.FC<DocumentModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  body,
  date,
  images = [],
  className,
  isSaved: isSavedProp,
  onSaveToggle,
}) => {
  const [imgIndex, setImgIndex] = useState(0);
  const [savedInternal, setSavedInternal] = useState(false);

  // Use controlled prop if provided, otherwise internal state
  const saved = isSavedProp !== undefined ? isSavedProp : savedInternal;

  const hasImages = images.length > 0;

  // Reset image index when a new doc opens
  useEffect(() => {
    if (isOpen) setImgIndex(0);
  }, [isOpen, title]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  // Lock body scroll
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // ── Save toggle ──────────────────────────────────────────────
  // If onSaveToggle is provided, call it (wire to your save API).
  // Otherwise toggle internal state only.
  const handleSaveToggle = () => {
    const next = !saved;
    setSavedInternal(next);
    onSaveToggle?.(next);
    // TODO: wire to API — e.g.:
    // await fetch(`/api/documents/${id}/save`, { method: next ? "POST" : "DELETE" });
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Modal card */}
      <div
        className={cn(
          "relative bg-white rounded-2xl shadow-2xl overflow-hidden",
          "w-[90vw] max-w-[70vw] h-[80vh]",
          "flex font-[family-name:var(--font-sans)]",
          className,
        )}
      >
        {/* Close button — top-left */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className={cn(
            "absolute top-4 left-4 z-20",
            "w-7 h-7 flex items-center justify-center rounded-full",
            "text-gray-400 hover:bg-gray-100 hover:text-gray-700",
            "transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D72638]/30",
          )}
        >
          <XIcon />
        </button>

        {/* ── LEFT: title + body + date ──────────────────────── */}
        <div className="flex-1 min-w-0 flex flex-col p-6 pl-14 pr-5 overflow-hidden">
          {/* Title row — title left, bookmark right */}
          <div className="flex items-start justify-between gap-3 mb-2 shrink-0">
            <h2 className="text-lg font-bold text-black leading-snug flex-1">
              {title}
            </h2>

            {/* ── Bookmark / Save button ─────────────────────
                Filled red = saved. Outlined = not saved.
                To wire to API: pass onSaveToggle prop from the page.
                e.g. onSaveToggle={(saved) => updateSaveStatus(doc.id, saved)} */}
            <button
              type="button"
              onClick={handleSaveToggle}
              aria-label={saved ? "Unsave document" : "Save document"}
              className={cn(
                "shrink-0 w-8 h-8 flex items-center justify-center rounded-full",
                "transition-all duration-150 focus:outline-none",
                "focus-visible:ring-2 focus-visible:ring-[#D72638]/30",
                saved ? "bg-[#FEF0F1]" : "hover:bg-[#FEF0F1]",
              )}
            >
              <BookmarkIcon filled={saved} />
            </button>
          </div>

          {/* Description — black text */}
          {description && (
            <p className="text-xs font-semibold text-black mb-3 shrink-0">
              Description: {description}
            </p>
          )}

          {/* Body — scrollable, black text */}
          <div className="flex-1 overflow-y-auto min-h-0 text-sm text-black leading-relaxed whitespace-pre-line">
            {body ?? "No content available."}
          </div>

          {/* Date — pinned to bottom */}
          {date && (
            <p className="shrink-0 mt-3 pt-3 border-t border-gray-100 text-[11px] text-gray-400">
              {date}
            </p>
          )}
        </div>

        {/* ── RIGHT: image panel full height ─────────────────── */}
        <div className="w-2/5 shrink-0 flex flex-col bg-[#FEF0F1]">
          {/* Image — fills available space */}
          <div className="flex-1 flex items-center justify-center overflow-hidden min-h-0">
            {hasImages && images[imgIndex] ? (
              <img
                src={images[imgIndex]}
                alt={`Document image ${imgIndex + 1}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <ImagePlaceholderIcon />
            )}
          </div>

          {/* Carousel controls */}
          <div className="shrink-0 flex flex-col items-center gap-2 py-3">
            {/* Dot indicators */}
            <div className="flex gap-1.5">
              {(hasImages && images.length > 1 ? images : [0, 1, 2]).map(
                (_, i) =>
                  hasImages && images.length > 1 ? (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setImgIndex(i)}
                      aria-label={`Go to image ${i + 1}`}
                      className={cn(
                        "w-2 h-2 rounded-full transition-colors focus:outline-none",
                        i === imgIndex ? "bg-[#D72638]" : "bg-[#D72638]/30",
                      )}
                    />
                  ) : (
                    <span
                      key={i}
                      className={cn(
                        "w-2 h-2 rounded-full",
                        i === 0 ? "bg-[#D72638]" : "bg-[#D72638]/30",
                      )}
                    />
                  ),
              )}
            </div>

            {/* Prev / Next */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setImgIndex((i) => Math.max(0, i - 1))}
                disabled={!hasImages || imgIndex === 0}
                aria-label="Previous image"
                className={cn(
                  "w-8 h-8 flex items-center justify-center rounded-full border-2 transition-colors focus:outline-none",
                  !hasImages || imgIndex === 0
                    ? "border-[#D72638]/30 text-[#D72638]/30 cursor-not-allowed"
                    : "border-[#D72638] text-[#D72638] hover:bg-white/60 cursor-pointer",
                )}
              >
                <ChevronLeftIcon />
              </button>
              <button
                type="button"
                onClick={() =>
                  setImgIndex((i) => Math.min(images.length - 1, i + 1))
                }
                disabled={!hasImages || imgIndex === images.length - 1}
                aria-label="Next image"
                className={cn(
                  "w-8 h-8 flex items-center justify-center rounded-full border-2 transition-colors focus:outline-none",
                  !hasImages || imgIndex === images.length - 1
                    ? "border-[#D72638]/30 text-[#D72638]/30 cursor-not-allowed"
                    : "border-[#D72638] text-[#D72638] hover:bg-white/60 cursor-pointer",
                )}
              >
                <ChevronRightIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
