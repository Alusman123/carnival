// components/ui/Button.tsx
// ─────────────────────────────────────────────────────────────
// Reusable Button component for DocuKnow
//
// DATA / PROPS:
//   label      → The button text (string | React.ReactNode)
//   onClick    → Click handler function
//   variant    → Visual style: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
//   size       → 'sm' | 'md' | 'lg'
//   leftIcon   → Icon element rendered before the label
//   rightIcon  → Icon element rendered after the label
//   isLoading  → Shows spinner and disables button when true
//   disabled   → Disables button when true
//   fullWidth  → Stretches button to 100% width
//   type       → 'button' | 'submit' | 'reset'
//   className  → Additional Tailwind classes for overrides
// ─────────────────────────────────────────────────────────────

import React from "react";
import { LoadingSpinner } from "./LoadingSpinner";
import { cn } from "@/app/lib/utils";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isLoading?: boolean;
  fullWidth?: boolean;
  children?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: [
    "bg-[#D72638] text-white",
    "hover:bg-[#B01E2C] active:bg-[#9A1A25]",
    "shadow-[0_4px_14px_0_rgb(215_38_56_/_0.35)]",
    "hover:shadow-[0_6px_20px_0_rgb(215_38_56_/_0.45)]",
    "disabled:bg-[#D72638]/50 disabled:shadow-none",
  ].join(" "),

  secondary: [
    "bg-[#FEF0F1] text-[#D72638]",
    "hover:bg-[#FCE4E6] active:bg-[#F9D0D3]",
    "disabled:opacity-50",
  ].join(" "),

  outline: [
    "bg-transparent text-[#D72638] border border-[#D72638]",
    "hover:bg-[#FEF0F1] active:bg-[#FCE4E6]",
    "disabled:opacity-50",
  ].join(" "),

  ghost: [
    "bg-transparent text-gray-600",
    "hover:bg-gray-100 hover:text-gray-900 active:bg-gray-200",
    "disabled:opacity-50",
  ].join(" "),

  danger: [
    "bg-red-600 text-white",
    "hover:bg-red-700 active:bg-red-800",
    "shadow-sm hover:shadow-md",
    "disabled:opacity-50",
  ].join(" "),
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs gap-1.5 rounded-md",
  md: "h-10 px-4 text-sm gap-2 rounded-lg",
  lg: "h-12 px-6 text-base gap-2.5 rounded-xl",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      label,
      children,
      variant = "primary",
      size = "md",
      leftIcon,
      rightIcon,
      isLoading = false,
      fullWidth = false,
      disabled,
      className,
      type = "button",
      ...rest
    },
    ref,
  ) => {
    const content = label ?? children;

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={cn(
          // Base
          "relative inline-flex items-center justify-center",
          "font-medium font-[family-name:var(--font-sans)]",
          "transition-all duration-200 ease-in-out",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D72638] focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed select-none",
          "cursor-pointer",
          // Variant
          variantStyles[variant],
          // Size
          sizeStyles[size],
          // Full width
          fullWidth && "w-full",
          className,
        )}
        {...rest}
      >
        {/* Loading overlay */}
        {isLoading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <LoadingSpinner
              size="sm"
              color={
                variant === "primary" || variant === "danger" ? "white" : "red"
              }
            />
          </span>
        )}

        {/* Content (hidden while loading to preserve width) */}
        <span
          className={cn(
            "flex items-center gap-inherit",
            isLoading && "invisible",
          )}
        >
          {leftIcon && (
            <span className="flex-shrink-0 [&>svg]:w-4 [&>svg]:h-4">
              {leftIcon}
            </span>
          )}
          {content && <span>{content}</span>}
          {rightIcon && (
            <span className="flex-shrink-0 [&>svg]:w-4 [&>svg]:h-4">
              {rightIcon}
            </span>
          )}
        </span>
      </button>
    );
  },
);

Button.displayName = "Button";

// ─────────────────────────────────────────────────────────────
// IconButton — square button with only an icon
// DATA: icon, variant, size, label (for aria), onClick
// ─────────────────────────────────────────────────────────────
export interface IconButtonProps extends Omit<
  ButtonProps,
  "label" | "leftIcon" | "rightIcon" | "fullWidth"
> {
  icon: React.ReactNode;
  "aria-label": string;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, size = "md", variant = "ghost", className, ...rest }, ref) => {
    const iconSizeMap: Record<ButtonSize, string> = {
      sm: "h-8 w-8 rounded-md",
      md: "h-10 w-10 rounded-lg",
      lg: "h-12 w-12 rounded-xl",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center flex-shrink-0",
          "transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D72638] focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "cursor-pointer [&>svg]:w-5 [&>svg]:h-5",
          variantStyles[variant],
          iconSizeMap[size],
          // Remove horizontal padding from variantStyles for icon buttons
          "!px-0",
          className,
        )}
        {...rest}
      >
        {icon}
      </button>
    );
  },
);

IconButton.displayName = "IconButton";
