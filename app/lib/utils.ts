// lib/utils.ts
// ─────────────────────────────────────────────────────────────
// Shared utility functions for DocuKnow
// ─────────────────────────────────────────────────────────────

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * cn — Merge Tailwind class names safely.
 * Combines clsx for conditional classes + twMerge for deduplication.
 *
 * Usage:
 *   cn('px-4 py-2', isActive && 'bg-red-500', className)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * formatDate — Format an ISO date string for display.
 * DATA: date strings from API responses
 *
 * Usage:
 *   formatDate('2024-05-20T10:30:00Z') → 'May 20, 2024'
 *   formatDate('2024-05-20T10:30:00Z', 'relative') → '2 hours ago'
 */
export function formatDate(
  date: string | Date,
  format: 'full' | 'short' | 'relative' | 'datetime' = 'short'
): string {
  const d = typeof date === 'string' ? new Date(date) : date;

  if (format === 'relative') {
    const diff = Date.now() - d.getTime();
    const mins  = Math.floor(diff / 60_000);
    const hours = Math.floor(diff / 3_600_000);
    const days  = Math.floor(diff / 86_400_000);

    if (mins  < 1)   return 'Just now';
    if (mins  < 60)  return `${mins}m ago`;
    if (hours < 24)  return `${hours}h ago`;
    if (days  < 7)   return `${days}d ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  if (format === 'datetime') {
    return d.toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: 'numeric', minute: '2-digit',
    });
  }

  if (format === 'full') {
    return d.toLocaleDateString('en-US', {
      month: 'long', day: 'numeric', year: 'numeric',
    });
  }

  return d.toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

/**
 * truncate — Truncate a string to a max length with ellipsis.
 * DATA: long text strings from API (document names, etc.)
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 1).trimEnd() + '…';
}

/**
 * formatFileSize — Human-readable file size.
 * DATA: file.size in bytes from upload/document API
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const exp = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** exp).toFixed(exp === 0 ? 0 : 1)} ${units[exp]}`;
}

/**
 * generateId — Simple ID generator for client-side use (toasts, etc.)
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * debounce — Debounce a function call.
 * Used internally by SearchBar; exportable for other uses.
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/**
 * getInitials — Extract initials from a full name.
 * DATA: user.name from auth/user API
 */
export function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}