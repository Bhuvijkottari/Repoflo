/**
 * Input sanitization utilities — strips HTML tags and trims whitespace
 * to prevent XSS in any user-provided content stored in Firestore.
 */

/** Strip all HTML tags from a string */
export const stripHtml = (input: string): string =>
  input.replace(/<[^>]*>/g, "").trim();

/** Sanitize a plain text field (name, email, message, etc.) */
export const sanitizeText = (input: string, maxLength = 500): string =>
  stripHtml(input).slice(0, maxLength);

/** Sanitize a URL — only allow http/https */
export const sanitizeUrl = (input: string): string => {
  const trimmed = input.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return "";
};

/** Sanitize an email address */
export const sanitizeEmail = (input: string): string => {
  const trimmed = input.toLowerCase().trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed) ? trimmed : "";
};

/** Sanitize a support ticket message */
export const sanitizeSupportMessage = (msg: string): string =>
  sanitizeText(msg, 2000);

/** Check if a string contains potentially malicious content */
export const isSafe = (input: string): boolean => {
  const dangerous = /<script|javascript:|on\w+\s*=|<iframe|<object|<embed/gi;
  return !dangerous.test(input);
};
