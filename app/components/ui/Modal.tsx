"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/app/lib/utils";

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

export interface DocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  body?: string;
  date?: string;
  images?: string[];
  className?: string;
}

export const Modal: React.FC<DocumentModalProps> = ({
  isOpen,
  onClose,
  title,
  body,
  date,
  images = [],
  className,
}) => {
  const [imgIndex, setImgIndex] = useState(0);
  const hasImages = images.length > 0;

  useEffect(() => {
    if (isOpen) setImgIndex(0);
  }, [isOpen, title]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

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
      {/* Modal card — fixed height, no scroll on the card itself */}
      <div
        className={cn(
          "relative bg-white rounded-2xl shadow-2xl overflow-hidden",
          "w-[90vw] max-w-[70vw] h-[80vh]",
          "flex", // horizontal split
          "font-[family-name:var(--font-sans)]",
          className,
        )}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className={cn(
            "absolute top-4 right-4 z-20",
            "w-7 h-7 flex items-center justify-center rounded-full",
            "text-gray-400 hover:bg-gray-100 hover:text-gray-700",
            "transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D72638]/30",
          )}
        >
          <XIcon />
        </button>

        {/* ── LEFT: title + scrollable body + date pinned at bottom ── */}
        <div className="flex-1 min-w-0 flex flex-col p-6 pr-5 overflow-hidden">
          <h2 className="text-lg font-bold text-gray-900 pr-6 mb-4 leading-snug shrink-0">
            {title}
          </h2>

          {/* Body scrolls independently */}
          <div className="flex-1 overflow-y-auto text-sm text-gray-600 leading-relaxed whitespace-pre-line min-h-0">
            {body ?? "No content available."}
          </div>

          {/* Date pinned to bottom of left column */}
          {date && (
            <p className="shrink-0 mt-3 pt-3 border-t border-gray-100 text-[11px] text-gray-400">
              {date}
            </p>
          )}
        </div>

        {/* ── RIGHT: image panel covers full height ── */}
        <div className="w-2/5 shrink-0 flex flex-col bg-[#FEF0F1]">
          {/* Image fills all available space */}
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

          {/* Carousel controls pinned at bottom of image panel */}
          <div className="shrink-0 flex flex-col items-center gap-2 py-3">
            {/* Dots */}
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
