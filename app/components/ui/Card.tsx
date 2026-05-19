// components/ui/Card.tsx
// ─────────────────────────────────────────────────────────────
// Reusable Card primitives for DocuKnow
//
// Components exported:
//   Card         → Base card shell with variants
//   StatsCard    → Metric card (number + label + icon + trend)
//   InfoCard     → Two-column info card with icon, title, description, action
//
// DATA / PROPS — Card:
//   children      → Card content
//   variant       → 'default' | 'bordered' | 'flat' | 'elevated'
//   padding       → 'none' | 'sm' | 'md' | 'lg'
//   onClick       → Makes card clickable (hover state)
//   className     → Tailwind overrides
//
// DATA / PROPS — StatsCard:
//   title         → Metric label (e.g. "Total Documents")
//   value         → The main number/value — DATA from API
//   icon          → Icon element
//   iconColor     → Tailwind color class for icon bg
//   trend         → { value: number; direction: 'up' | 'down'; label?: string }
//   description   → Sub-label below the value
//   isLoading     → Skeleton state
//
// DATA / PROPS — InfoCard:
//   title         → Card heading
//   description   → Supporting paragraph
//   icon          → Icon element
//   action        → { label: string; onClick: () => void } | ReactNode
//   href          → Turns card into a link
//   isLoading     → Skeleton state
// ─────────────────────────────────────────────────────────────

import React from "react";
import { cn } from "@/app/lib/utils";

/* ══════════════════════════════════════════════════════════
   Base Card
══════════════════════════════════════════════════════════ */

export type CardVariant = "default" | "bordered" | "flat" | "elevated";
export type CardPadding = "none" | "sm" | "md" | "lg";

export interface CardProps {
  children?: React.ReactNode;
  variant?: CardVariant;
  padding?: CardPadding;
  onClick?: () => void;
  className?: string;
  as?: React.ElementType;
}

const variantStyles: Record<CardVariant, string> = {
  default: "bg-white border border-gray-100 shadow-sm",
  bordered: "bg-white border-2 border-gray-200",
  flat: "bg-gray-50 border border-gray-100",
  elevated: "bg-white shadow-md border border-gray-50",
};

const paddingStyles: Record<CardPadding, string> = {
  none: "",
  sm: "p-3",
  md: "p-5",
  lg: "p-6",
};

export const Card: React.FC<CardProps> = ({
  children,
  variant = "default",
  padding = "md",
  onClick,
  className,
  as: Tag = "div",
}) => {
  return (
    <Tag
      onClick={onClick}
      className={cn(
        "rounded-xl font-[family-name:var(--font-sans)]",
        variantStyles[variant],
        paddingStyles[padding],
        onClick && [
          "cursor-pointer",
          "transition-all duration-200",
          "hover:shadow-md hover:-translate-y-0.5",
          "active:translate-y-0 active:shadow-sm",
        ],
        className,
      )}
    >
      {children}
    </Tag>
  );
};

/* ──────────────────────────────────────────────────────── */
/* Card sub-components for structured layouts              */
/* ──────────────────────────────────────────────────────── */

export const CardHeader: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <div className={cn("flex items-center justify-between mb-4", className)}>
    {children}
  </div>
);

export const CardTitle: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <h3
    className={cn(
      "text-base font-semibold text-gray-900 font-[family-name:var(--font-sans)]",
      className,
    )}
  >
    {children}
  </h3>
);

export const CardFooter: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <div className={cn("mt-4 pt-4 border-t border-gray-100", className)}>
    {children}
  </div>
);

/* ══════════════════════════════════════════════════════════
   StatsCard — Dashboard metric card
══════════════════════════════════════════════════════════ */

export interface StatsTrend {
  value: number; // Percentage change — DATA from analytics API
  direction: "up" | "down"; // Whether the change is positive/negative
  label?: string; // e.g. "vs last month" — DATA
}

export interface StatsCardProps {
  title: string; // Metric name — DATA from config or API
  value: string | number; // Main value — DATA from API
  icon?: React.ReactNode; // Icon element
  iconBg?: string; // Tailwind bg class e.g. "bg-red-50"
  iconColor?: string; // Tailwind text class e.g. "text-[#D72638]"
  trend?: StatsTrend; // Optional trend — DATA from analytics
  description?: string; // Sub-label — DATA e.g. "All uploaded documents"
  isLoading?: boolean;
  className?: string;
  onClick?: () => void;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  iconBg = "bg-[#FEF0F1]",
  iconColor = "text-[#D72638]",
  trend,
  description,
  isLoading = false,
  className,
  onClick,
}) => {
  if (isLoading) {
    return (
      <Card className={className} padding="md">
        <div className="animate-pulse space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-200" />
            <div className="h-3 w-24 bg-gray-200 rounded-full" />
          </div>
          <div className="h-8 w-20 bg-gray-200 rounded-lg" />
          <div className="h-3 w-32 bg-gray-100 rounded-full" />
        </div>
      </Card>
    );
  }

  const TrendUpIcon = () => (
    <svg className="w-3 h-3" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 4l4 4H4l4-4z" />
    </svg>
  );

  const TrendDownIcon = () => (
    <svg className="w-3 h-3" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 12L4 8h8l-4 4z" />
    </svg>
  );

  return (
    <Card className={cn("group", className)} padding="md" onClick={onClick}>
      <div className="flex items-start justify-between mb-3">
        {/* Icon */}
        {icon && (
          <div
            className={cn(
              "flex items-center justify-center w-10 h-10 rounded-xl",
              "transition-transform duration-200 group-hover:scale-110",
              iconBg,
            )}
          >
            <span className={cn("[&>svg]:w-5 [&>svg]:h-5", iconColor)}>
              {icon}
            </span>
          </div>
        )}

        {/* Trend badge */}
        {trend && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 text-xs font-medium px-2 py-0.5 rounded-full",
              trend.direction === "up"
                ? "text-green-700 bg-green-50"
                : "text-red-600 bg-red-50",
            )}
          >
            {trend.direction === "up" ? <TrendUpIcon /> : <TrendDownIcon />}
            {Math.abs(trend.value)}%
          </span>
        )}
      </div>

      {/* Value — DATA: populated from API response */}
      <p className="text-3xl font-bold text-gray-900 tracking-tight mt-1">
        {value}
      </p>

      {/* Title */}
      <p className="text-sm font-medium text-gray-500 mt-1">{title}</p>

      {/* Description — DATA: sub-label string */}
      {description && (
        <p className="text-xs text-gray-400 mt-0.5">{description}</p>
      )}

      {/* Trend label */}
      {trend?.label && (
        <p className="text-xs text-gray-400 mt-1">{trend.label}</p>
      )}
    </Card>
  );
};

/* ══════════════════════════════════════════════════════════
   InfoCard — Feature/action card (used in Flow Guide, etc.)
══════════════════════════════════════════════════════════ */

export interface InfoCardAction {
  label: string; // Button label — DATA from config
  onClick: () => void;
}

export interface InfoCardProps {
  title: string; // Card heading — DATA from config or API
  description?: string; // Supporting text — DATA from config or API
  icon?: React.ReactNode;
  iconBg?: string;
  iconColor?: string;
  action?: InfoCardAction; // CTA button — DATA (label + handler)
  badge?: string; // Optional tag badge — DATA e.g. "New"
  isLoading?: boolean;
  className?: string;
}

export const InfoCard: React.FC<InfoCardProps> = ({
  title,
  description,
  icon,
  iconBg = "bg-[#FEF0F1]",
  iconColor = "text-[#D72638]",
  action,
  badge,
  isLoading = false,
  className,
}) => {
  if (isLoading) {
    return (
      <Card className={className} padding="md" variant="bordered">
        <div className="animate-pulse space-y-3">
          <div className="w-9 h-9 rounded-lg bg-gray-200" />
          <div className="h-4 w-36 bg-gray-200 rounded-full" />
          <div className="space-y-1.5">
            <div className="h-3 w-full bg-gray-100 rounded-full" />
            <div className="h-3 w-3/4 bg-gray-100 rounded-full" />
          </div>
          <div className="h-8 w-24 bg-gray-200 rounded-lg" />
        </div>
      </Card>
    );
  }

  return (
    <Card
      className={cn("flex flex-col gap-3", className)}
      padding="md"
      variant="bordered"
    >
      <div className="flex items-start justify-between">
        {icon && (
          <div
            className={cn(
              "flex items-center justify-center w-9 h-9 rounded-lg",
              iconBg,
            )}
          >
            <span className={cn("[&>svg]:w-4 [&>svg]:h-4", iconColor)}>
              {icon}
            </span>
          </div>
        )}
        {badge && (
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#FEF0F1] text-[#D72638]">
            {badge}
          </span>
        )}
      </div>

      {/* Title — DATA: title string */}
      <h4 className="text-sm font-semibold text-gray-900">{title}</h4>

      {/* Description — DATA: description string */}
      {description && (
        <p className="text-xs text-gray-500 leading-relaxed flex-1">
          {description}
        </p>
      )}

      {/* Action — DATA: action.label + action.onClick */}
      {action && (
        <button
          onClick={action.onClick}
          className={cn(
            "self-start text-xs font-semibold px-3 py-1.5 rounded-lg",
            "bg-[#D72638] text-white",
            "hover:bg-[#B01E2C] transition-colors duration-150",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D72638]/30",
          )}
        >
          {action.label}
        </button>
      )}
    </Card>
  );
};
