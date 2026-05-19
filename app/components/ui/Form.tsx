// components/ui/Form.tsx
// ─────────────────────────────────────────────────────────────
// Form-level wrappers, SearchBar, SelectDropdown
//
// Components exported:
//   FormWrapper        → Wraps a form with consistent spacing
//   FormErrorMessage   → Top-level form error banner
//   SearchBar          → Debounced search input
//   SelectDropdown     → Custom styled <select> wrapper
//
// DATA / PROPS — FormWrapper:
//   onSubmit    → Form submit handler
//   children    → Form fields
//   className   → Additional classes
//
// DATA / PROPS — FormErrorMessage:
//   message     → Error string — DATA (e.g. from API error response)
//   onDismiss   → Optional dismiss handler
//
// DATA / PROPS — SearchBar:
//   placeholder → Placeholder string
//   value       → Controlled value — DATA
//   onChange    → Change handler (debounced internally)
//   onSearch    → Callback with final value after debounce
//   debounceMs  → Debounce delay (default 300ms)
//
// DATA / PROPS — SelectDropdown:
//   label       → Field label
//   options     → Array of { value, label } — DATA from API or config
//   value       → Controlled value — DATA
//   onChange    → Change handler
//   placeholder → Empty state option text
//   error       → Validation error string
// ─────────────────────────────────────────────────────────────

"use client";

import React, { useEffect, useRef, useState, useId } from "react";
import { cn } from "@/app/lib/utils";

/* ══════════════════════════════════════════════════════════
   FormWrapper
══════════════════════════════════════════════════════════ */

export interface FormWrapperProps {
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  children: React.ReactNode;
  className?: string;
  gap?: "sm" | "md" | "lg";
}

export const FormWrapper: React.FC<FormWrapperProps> = ({
  onSubmit,
  children,
  className,
  gap = "md",
}) => {
  const gapMap = { sm: "gap-3", md: "gap-5", lg: "gap-6" };

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className={cn(
        "flex flex-col w-full font-[family-name:var(--font-sans)]",
        gapMap[gap],
        className,
      )}
    >
      {children}
    </form>
  );
};

/* ══════════════════════════════════════════════════════════
   FormErrorMessage — top-level API/form error banner
   DATA: message from API error response (e.g. 401, 422)
══════════════════════════════════════════════════════════ */

export interface FormErrorMessageProps {
  message?: string | null; // DATA: error message string from API
  onDismiss?: () => void;
  className?: string;
}

export const FormErrorMessage: React.FC<FormErrorMessageProps> = ({
  message,
  onDismiss,
  className,
}) => {
  if (!message) return null;

  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-3 rounded-xl p-3.5",
        "bg-red-50 border border-red-100",
        "animate-[fadeInDown_0.2s_ease-out]",
        className,
      )}
    >
      <svg
        className="w-4 h-4 text-[#D72638] flex-shrink-0 mt-0.5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
      <p className="text-sm text-red-700 flex-1 font-[family-name:var(--font-sans)]">
        {/* DATA: API error message */}
        {message}
      </p>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="text-red-400 hover:text-red-600 transition-colors flex-shrink-0 focus:outline-none"
          aria-label="Dismiss error"
        >
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
            <path
              d="M12 4L4 12M4 4l8 8"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

/* ══════════════════════════════════════════════════════════
   SearchBar
   DATA: value/onChange from parent state, onSearch for API calls
══════════════════════════════════════════════════════════ */

export interface SearchBarProps {
  placeholder?: string;
  value?: string; // DATA: controlled search string
  onChange?: (value: string) => void; // DATA: updates parent state
  onSearch?: (value: string) => void; // DATA: fires debounced API call
  debounceMs?: number;
  className?: string;
  size?: "sm" | "md";
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search…",
  value: externalValue,
  onChange,
  onSearch,
  debounceMs = 300,
  className,
  size = "md",
}) => {
  const [internalValue, setInternalValue] = useState(externalValue ?? "");
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const controlled = externalValue !== undefined;
  const value = controlled ? externalValue : internalValue;

  useEffect(() => {
    if (controlled) setInternalValue(externalValue ?? "");
  }, [externalValue, controlled]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!controlled) setInternalValue(val);
    onChange?.(val);

    if (onSearch) {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => {
        // DATA: fires onSearch with debounced value for API query
        onSearch(val);
      }, debounceMs);
    }
  };

  const handleClear = () => {
    if (!controlled) setInternalValue("");
    onChange?.("");
    onSearch?.("");
  };

  const sizeStyles = {
    sm: "h-8 text-xs pl-8 pr-8",
    md: "h-10 text-sm pl-9 pr-9",
  };

  const iconSizes = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
  };

  const iconOffset = {
    sm: "left-2.5",
    md: "left-3",
  };

  return (
    <div className={cn("relative", className)}>
      {/* Search icon */}
      <svg
        className={cn(
          "absolute top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none",
          iconSizes[size],
          iconOffset[size],
        )}
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11zM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9z"
          clipRule="evenodd"
        />
      </svg>

      <input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        className={cn(
          "w-full rounded-xl border border-gray-200",
          "bg-white text-gray-900 placeholder-gray-400",
          "font-[family-name:var(--font-sans)]",
          "transition-all duration-200",
          "hover:border-gray-300",
          "focus:outline-none focus:border-[#D72638] focus:ring-2 focus:ring-[#D72638]/20",
          "[&::-webkit-search-cancel-button]:hidden",
          sizeStyles[size],
        )}
      />

      {/* Clear button */}
      {value && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className={cn(
            "absolute top-1/2 -translate-y-1/2 right-3",
            "text-gray-400 hover:text-gray-600",
            "transition-colors duration-150",
            "focus:outline-none",
          )}
        >
          <svg
            className={iconSizes[size]}
            viewBox="0 0 16 16"
            fill="currentColor"
          >
            <path
              d="M12 4L4 12M4 4l8 8"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

/* ══════════════════════════════════════════════════════════
   SelectDropdown
   DATA: options from API/config, value from form state
══════════════════════════════════════════════════════════ */

export interface SelectOption {
  value: string; // DATA: option value for API
  label: string; // DATA: display label
  disabled?: boolean;
}

export interface SelectDropdownProps {
  label?: string;
  options: SelectOption[]; // DATA: from API or static config
  value?: string; // DATA: controlled value
  onChange?: (value: string) => void;
  placeholder?: string;
  error?: string;
  hint?: string;
  disabled?: boolean;
  required?: boolean;
  id?: string;
  className?: string;
}

export const SelectDropdown: React.FC<SelectDropdownProps> = ({
  label,
  options,
  value,
  onChange,
  placeholder = "Select an option",
  error,
  hint,
  disabled,
  required,
  id: externalId,
  className,
}) => {
  const generatedId = useId();
  const id = externalId ?? generatedId;
  const errorId = `${id}-error`;

  return (
    <div className={cn("w-full", className)}>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 mb-1.5 font-[family-name:var(--font-sans)]"
        >
          {label}
          {required && <span className="text-[#D72638] ml-0.5">*</span>}
        </label>
      )}

      <div className="relative">
        <select
          id={id}
          value={value}
          disabled={disabled}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          onChange={(e) => onChange?.(e.target.value)}
          className={cn(
            "w-full h-10 pl-3 pr-9 rounded-lg border text-sm appearance-none",
            "bg-white text-gray-900",
            "font-[family-name:var(--font-sans)]",
            "transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-[#D72638]/20 focus:border-[#D72638]",
            "disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed",
            error
              ? "border-[#D72638] ring-2 ring-[#D72638]/20"
              : "border-gray-200 hover:border-gray-300",
            !value && "text-gray-400",
          )}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {/* DATA: options array from API response or config */}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Chevron */}
        <svg
          className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
          viewBox="0 0 16 16"
          fill="currentColor"
        >
          <path
            d="M4 6l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </div>

      {error && (
        <p
          id={errorId}
          role="alert"
          className="mt-1.5 text-xs text-[#D72638] font-[family-name:var(--font-sans)]"
        >
          {error}
        </p>
      )}
      {hint && !error && (
        <p className="mt-1.5 text-xs text-gray-400 font-[family-name:var(--font-sans)]">
          {hint}
        </p>
      )}
    </div>
  );
};
