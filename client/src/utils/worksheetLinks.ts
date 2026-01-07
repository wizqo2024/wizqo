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
  const from = fallbackFrom || 'worksheets'

  if (seo) {
    return `/worksheets/${seo.slug}${from ? `?from=${from}` : ''}`
  }
  // Fallback to print URL if SEO data not available
  return `/print?doc=${docId}&from=${from}`
}

export function getWorksheetPrintURL(docId: string, from?: string): string {
  const fromParam = from || 'worksheets'
  return `/print?doc=${docId}&from=${fromParam}&download=1`
}
