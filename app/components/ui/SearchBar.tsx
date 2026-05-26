"use client";

// components/ui/SearchBar.tsx
// ─────────────────────────────────────────────────────────────
// Reusable SearchBar component
//
// PROPS:
//   placeholder  → input placeholder text
//   value        → controlled value (DATA: from parent state)
//   onChange     → change handler (DATA: updates parent state)
//   onSearch     → called on Enter or search button click
//   onClear      → called when ✕ is clicked (clears input)
//   size         → 'sm' | 'md' | 'lg'
//   fullWidth    → stretches to 100% width
//   isLoading    → shows spinner inside the bar
//   className    → additional Tailwind overrides
//
// HOW TO USE (controlled):
//   const [q, setQ] = useState("");
//   <SearchBar value={q} onChange={e => setQ(e.target.value)} onSearch={() => fetchResults(q)} />
//
// HOW TO USE (uncontrolled / simple):
//   <SearchBar placeholder="Search..." onSearch={(val) => console.log(val)} />
// ─────────────────────────────────────────────────────────────

import React, { useRef, useState } from "react";
import { cn } from "@/app/lib/utils";

// ── Icons ──────────────────────────────────────────────────────
const SearchIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const ClearIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const SpinnerIcon = () => (
  <svg
    className="animate-spin"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth={4}
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

// ── Types ──────────────────────────────────────────────────────
export type SearchBarSize = "sm" | "md" | "lg";

export interface SearchBarProps {
  placeholder?: string;
  value?: string; // controlled
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch?: (value: string) => void; // called on Enter / button click
  onClear?: () => void; // called when ✕ clicked
  size?: SearchBarSize;
  fullWidth?: boolean;
  isLoading?: boolean;
  autoFocus?: boolean;
  className?: string;
  inputClassName?: string;
}

// ── Size styles ────────────────────────────────────────────────
const sizeStyles: Record<
  SearchBarSize,
  {
    wrap: string;
    input: string;
    icon: string;
  }
> = {
  sm: {
    wrap: "h-9",
    input: "text-sm pl-8 pr-8",
    icon: "[&>svg]:w-3.5 [&>svg]:h-3.5",
  },
  md: {
    wrap: "h-10",
    input: "text-sm pl-9 pr-9",
    icon: "[&>svg]:w-4 [&>svg]:h-4",
  },
  lg: {
    wrap: "h-12",
    input: "text-base pl-11 pr-11",
    icon: "[&>svg]:w-5 [&>svg]:h-5",
  },
};

// ── SearchBar component ────────────────────────────────────────
export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search article, document...",
  value,
  onChange,
  onSearch,
  onClear,
  size = "md",
  fullWidth = false,
  isLoading = false,
  autoFocus = false,
  className,
  inputClassName,
}) => {
  // Internal state for uncontrolled usage
  const [internalValue, setInternalValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Determine whether we're controlled or uncontrolled
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  const s = sizeStyles[size];

  // ── Handlers ────────────────────────────────────────────────
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) setInternalValue(e.target.value);
    onChange?.(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSearch?.(currentValue);
    }
    if (e.key === "Escape") {
      handleClear();
    }
  };

  const handleClear = () => {
    if (!isControlled) setInternalValue("");
    onClear?.();
    inputRef.current?.focus();
  };

  const handleSearchClick = () => {
    onSearch?.(currentValue);
  };

  return (
    <div
      className={cn(
        "relative flex items-center",
        s.wrap,
        fullWidth ? "w-full" : "w-56",
        className,
      )}
    >
      {/* Left icon — spinner when loading, search icon otherwise */}
      <span
        className={cn(
          "absolute left-3 flex items-center pointer-events-none",
          isLoading ? "text-[#D72638]" : "text-gray-400",
          s.icon,
        )}
      >
        {isLoading ? <SpinnerIcon /> : <SearchIcon />}
      </span>

      {/* Input */}
      <input
        ref={inputRef}
        type="search"
        autoFocus={autoFocus}
        placeholder={placeholder}
        value={currentValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className={cn(
          // Base
          "w-full rounded-lg border border-gray-200 bg-gray-50",
          "text-gray-900 placeholder-gray-400",
          "font-[family-name:var(--font-sans)]",
          // Remove default browser search cancel button
          "[&::-webkit-search-cancel-button]:hidden",
          // Focus
          "focus:outline-none focus:ring-2 focus:ring-[#D72638]/20 focus:border-[#D72638]",
          "transition-all duration-200",
          // Height comes from wrapper, but we still set h-full
          "h-full",
          s.input,
          inputClassName,
        )}
        aria-label={placeholder}
      />

      {/* Right side: clear button (when there's text) */}
      {currentValue && !isLoading && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className={cn(
            "absolute right-3 flex items-center text-gray-400",
            "hover:text-gray-600 transition-colors duration-150",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D72638]/30 rounded",
            s.icon,
          )}
        >
          <ClearIcon />
        </button>
      )}

      {/* Right side: search button (when no text and not loading) */}
      {!currentValue && !isLoading && onSearch && (
        <button
          type="button"
          onClick={handleSearchClick}
          aria-label="Search"
          className={cn(
            "absolute right-3 flex items-center text-gray-400",
            "hover:text-[#D72638] transition-colors duration-150",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D72638]/30 rounded",
            s.icon,
          )}
        >
          <SearchIcon />
        </button>
      )}
    </div>
  );
};
