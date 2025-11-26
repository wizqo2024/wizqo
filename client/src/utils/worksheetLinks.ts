/**
 * Helper functions for worksheet links
 * Converts docId to SEO-friendly URL
 */

import { getWorksheetSEO } from '@shared/worksheetSEO'

/**
 * Get SEO-friendly URL for a worksheet
 * Falls back to print URL if SEO data not found
 */
export function getWorksheetURL(docId: string, fallbackFrom?: string): string {
  const seo = getWorksheetSEO(docId)
  if (seo) {
    return `/worksheets/${seo.slug}`
  }
  // Fallback to print URL if SEO data not available
  const from = fallbackFrom || 'worksheets'
  return `/print?doc=${docId}&from=${from}`
}

/**
 * Get print URL for a worksheet (for actual printing)
 */
export function getWorksheetPrintURL(docId: string, from?: string): string {
  const fromParam = from || 'worksheets'
  return `/print?doc=${docId}&from=${fromParam}`
}
