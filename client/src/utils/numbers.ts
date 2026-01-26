// Utility functions for number formatting, especially for Arabic language

/**
 * Convert Western Arabic numerals (0-9) to Eastern Arabic numerals (٠-٩)
 * Used for proper Arabic localization
 */
export function toEasternArabicNumerals(num: number | string): string {
  const easternArabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩']
  const numStr = String(num)
  return numStr.replace(/\d/g, (digit) => easternArabicDigits[parseInt(digit, 10)])
}

/**
 * Format a number based on language
 * For Arabic, uses Eastern Arabic numerals
 * For other languages, uses standard Western numerals
 */
export function formatNumber(num: number | string, language: 'en' | 'es' | 'ar'): string {
  if (language === 'ar') {
    return toEasternArabicNumerals(num)
  }
  return String(num)
}

/**
 * Format a number range (e.g., "1-10") based on language
 */
export function formatNumberRange(start: number | string, end: number | string, language: 'en' | 'es' | 'ar'): string {
  if (language === 'ar') {
    return `${toEasternArabicNumerals(start)}–${toEasternArabicNumerals(end)}`
  }
  return `${start}–${end}`
}
