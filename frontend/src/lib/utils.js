import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility to merge tailwind classes safely.
 * Allows using clsx syntax and merges conflicting tailwind classes.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date string to a human readable format
 */
export function formatDate(dateString, options = {}) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const defaultOptions = { month: 'short', day: 'numeric', year: 'numeric' };
  return new Intl.DateTimeFormat('en-US', { ...defaultOptions, ...options }).format(date);
}

/**
 * Get color class based on AI match score
 */
export function getScoreColorClass(score) {
  if (score >= 80) return 'text-accent-500';
  if (score >= 60) return 'text-warning-500';
  return 'text-danger-500';
}

/**
 * Format currency
 */
export function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}
