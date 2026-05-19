// components/ui/Input.tsx
// ─────────────────────────────────────────────────────────────
// Reusable Input + PasswordInput for DocuKnow forms
//
// DATA / PROPS — Input:
//   label       → Field label text (string)
//   placeholder → Placeholder string
//   value       → Controlled value (string)
//   onChange    → Change handler
//   error       → Error message string — triggers red border + message
//   hint        → Helper text below the field
//   leftIcon    → Icon element inside left side of input
//   rightIcon   → Icon element inside right side of input
//   disabled    → Disables the field
//   required    → Marks field as required (shows asterisk)
//   id / name   → Native input attributes
//   type        → 'text' | 'email' | 'number' | etc.
//   className   → Additional classes for the input element
//
// DATA / PROPS — PasswordInput:
//   Same as Input, but type is always 'password' / 'text'
//   and includes a built-in show/hide toggle button.
// ─────────────────────────────────────────────────────────────

"use client";

import React, { useState, useId } from "react";
import { cn } from "@/app/lib/utils";

/* ── Shared label/hint/error sub-components ─────────────── */

interface FieldLabelProps {
  label: string;
  htmlFor: string;
  required?: boolean;
}

const FieldLabel: React.FC<FieldLabelProps> = ({
  label,
  htmlFor,
  required,
}) => (
  <label
    htmlFor={htmlFor}
    className="block text-sm font-medium text-gray-700 mb-1.5 font-[family-name:var(--font-sans)]"
  >
    {label}
    {required && <span className="text-[#D72638] ml-0.5">*</span>}
  </label>
);

const FieldHint: React.FC<{ hint: string }> = ({ hint }) => (
  <p className="mt-1.5 text-xs text-gray-400 font-[family-name:var(--font-sans)]">
    {hint}
  </p>
);

const FieldError: React.FC<{ error: string; id: string }> = ({ error, id }) => (
  <p
    id={id}
    role="alert"
    className="mt-1.5 text-xs text-[#D72638] flex items-center gap-1 font-[family-name:var(--font-sans)]"
  >
    {/* Inline error icon */}
    <svg
      className="w-3.5 h-3.5 flex-shrink-0"
      viewBox="0 0 16 16"
      fill="currentColor"
    >
      <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 3.5a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0v-3A.75.75 0 0 1 8 4.5zm0 6.5a.875.875 0 1 1 0-1.75A.875.875 0 0 1 8 11z" />
    </svg>
    {error}
  </p>
);

/* ── Base input styles ──────────────────────────────────── */
const baseInput = [
  "w-full bg-white border rounded-lg text-sm text-gray-900 placeholder-gray-400",
  "font-[family-name:var(--font-sans)]",
  "transition-all duration-200 ease-in-out",
  "focus:outline-none focus:ring-2 focus:ring-[#D72638]/20 focus:border-[#D72638]",
  "disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed",
  "read-only:bg-gray-50",
].join(" ");

/* ══════════════════════════════════════════════════════════
   Input Component
══════════════════════════════════════════════════════════ */

export interface InputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "className"
> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  inputClassName?: string;
  wrapperClassName?: string;
  required?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      id: externalId,
      inputClassName,
      wrapperClassName,
      required,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const id = externalId ?? generatedId;
    const errorId = `${id}-error`;

    const hasLeft = Boolean(leftIcon);
    const hasRight = Boolean(rightIcon);

    return (
      <div className={cn("w-full", wrapperClassName)}>
        {label && <FieldLabel label={label} htmlFor={id} required={required} />}

        <div className="relative">
          {/* Left icon */}
          {hasLeft && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 [&>svg]:w-4 [&>svg]:h-4 pointer-events-none">
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            id={id}
            required={required}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : undefined}
            className={cn(
              baseInput,
              "h-10 px-3",
              hasLeft && "pl-9",
              hasRight && "pr-9",
              error
                ? "border-[#D72638] ring-2 ring-[#D72638]/20"
                : "border-gray-200 hover:border-gray-300",
              inputClassName,
            )}
            {...props}
          />

          {/* Right icon */}
          {hasRight && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 [&>svg]:w-4 [&>svg]:h-4 pointer-events-none">
              {rightIcon}
            </span>
          )}
        </div>

        {error && <FieldError error={error} id={errorId} />}
        {hint && !error && <FieldHint hint={hint} />}
      </div>
    );
  },
);

Input.displayName = "Input";

/* ══════════════════════════════════════════════════════════
   PasswordInput Component
   Extends Input with show/hide toggle
══════════════════════════════════════════════════════════ */

export interface PasswordInputProps extends Omit<
  InputProps,
  "type" | "rightIcon"
> {
  showStrengthMeter?: boolean;
  // DATA: value is used to calculate strength when showStrengthMeter is true
}

export const PasswordInput = React.forwardRef<
  HTMLInputElement,
  PasswordInputProps
>(({ showStrengthMeter = false, value, ...props }, ref) => {
  const [show, setShow] = useState(false);

  // Simple strength score: 0-4
  const getStrength = (val: string): number => {
    if (!val) return 0;
    let score = 0;
    if (val.length >= 8) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;
    return score;
  };

  const strength = showStrengthMeter ? getStrength(String(value ?? "")) : 0;
  const strengthLabels = ["", "Weak", "Fair", "Good", "Strong"];
  const strengthColors = [
    "",
    "bg-red-400",
    "bg-orange-400",
    "bg-yellow-400",
    "bg-green-500",
  ];

  const EyeOpenIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );

  const EyeClosedIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );

  return (
    <div className="w-full">
      <div className="relative">
        <Input
          ref={ref}
          type={show ? "text" : "password"}
          value={value}
          rightIcon={
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="pointer-events-auto text-gray-400 hover:text-gray-600 transition-colors duration-150 focus:outline-none"
              aria-label={show ? "Hide password" : "Show password"}
            >
              {show ? <EyeClosedIcon /> : <EyeOpenIcon />}
            </button>
          }
          {...props}
        />
      </div>

      {/* Strength meter — DATA: driven by value prop */}
      {showStrengthMeter && String(value ?? "").length > 0 && (
        <div className="mt-2">
          <div className="flex gap-1 h-1">
            {[1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={cn(
                  "flex-1 rounded-full transition-all duration-300",
                  strength >= level ? strengthColors[strength] : "bg-gray-200",
                )}
              />
            ))}
          </div>
          {strength > 0 && (
            <p className="mt-1 text-xs text-gray-500 font-[family-name:var(--font-sans)]">
              Password strength:{" "}
              <span
                className={cn(
                  "font-medium",
                  strength <= 1 && "text-red-500",
                  strength === 2 && "text-orange-500",
                  strength === 3 && "text-yellow-600",
                  strength === 4 && "text-green-600",
                )}
              >
                {strengthLabels[strength]}
              </span>
            </p>
          )}
        </div>
      )}
    </div>
  );
});

PasswordInput.displayName = "PasswordInput";

/* ══════════════════════════════════════════════════════════
   TextArea Component
══════════════════════════════════════════════════════════ */

export interface TextAreaProps extends Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  "className"
> {
  label?: string;
  error?: string;
  hint?: string;
  wrapperClassName?: string;
  inputClassName?: string;
  required?: boolean;
  // DATA: value, onChange for controlled usage
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      label,
      error,
      hint,
      id: externalId,
      wrapperClassName,
      inputClassName,
      required,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const id = externalId ?? generatedId;
    const errorId = `${id}-error`;

    return (
      <div className={cn("w-full", wrapperClassName)}>
        {label && <FieldLabel label={label} htmlFor={id} required={required} />}
        <textarea
          ref={ref}
          id={id}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            baseInput,
            "px-3 py-2.5 min-h-[100px] resize-y",
            error
              ? "border-[#D72638] ring-2 ring-[#D72638]/20"
              : "border-gray-200 hover:border-gray-300",
            inputClassName,
          )}
          {...props}
        />
        {error && <FieldError error={error} id={errorId} />}
        {hint && !error && <FieldHint hint={hint} />}
      </div>
    );
  },
);

TextArea.displayName = "TextArea";

/* ══════════════════════════════════════════════════════════
   Checkbox Component
══════════════════════════════════════════════════════════ */

export interface CheckboxProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "className"
> {
  label: React.ReactNode;
  error?: string;
  // DATA: checked, onChange for controlled usage
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  error,
  id: externalId,
  ...props
}) => {
  const generatedId = useId();
  const id = externalId ?? generatedId;

  return (
    <div>
      <label
        htmlFor={id}
        className="flex items-start gap-2.5 cursor-pointer group"
      >
        <div className="relative flex-shrink-0 mt-0.5">
          <input type="checkbox" id={id} className="peer sr-only" {...props} />
          <div
            className={cn(
              "w-4 h-4 rounded border-2 transition-all duration-150",
              "border-gray-300 bg-white",
              "peer-checked:bg-[#D72638] peer-checked:border-[#D72638]",
              "peer-focus-visible:ring-2 peer-focus-visible:ring-[#D72638]/30",
              "group-hover:border-[#D72638]/60",
              error && "border-[#D72638]",
            )}
          />
          {/* Checkmark */}
          <svg
            className="absolute inset-0 w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-150 pointer-events-none"
            viewBox="0 0 16 16"
            fill="currentColor"
          >
            <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
          </svg>
        </div>
        <span className="text-sm text-gray-600 font-[family-name:var(--font-sans)] leading-relaxed">
          {label}
        </span>
      </label>
      {error && (
        <p className="mt-1 text-xs text-[#D72638] ml-6 font-[family-name:var(--font-sans)]">
          {error}
        </p>
      )}
    </div>
  );
};
