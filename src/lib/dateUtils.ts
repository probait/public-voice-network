import { format } from 'date-fns';

/**
 * Formats a date string or Date object for display in the application
 * @param date - The date to format (string or Date object)
 * @returns Formatted date string in the format "MMM d, yyyy at h:mm a"
 */
export const formatEventDate = (date: string | Date): string => {
  return format(new Date(date), 'MMM d, yyyy \'at\' h:mm a');
};

/**
 * Formats a date for display without time
 * @param date - The date to format (string or Date object)
 * @returns Formatted date string in the format "MMM d, yyyy"
 */
export const formatEventDateOnly = (date: string | Date): string => {
  return format(new Date(date), 'MMM d, yyyy');
};

/**
 * Formats a date for the event detail page with full day name
 * @param date - The date to format (string or Date object)
 * @returns Formatted date string in the format "EEEE, MMMM d, yyyy at h:mm a"
 */
export const formatEventDetailDate = (date: string | Date): string => {
  return format(new Date(date), 'EEEE, MMMM d, yyyy \'at\' h:mm a');
};