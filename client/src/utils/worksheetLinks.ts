/**
 * Helper functions for worksheet links
 * Converts docId to SEO-friendly URL
 */

import { getWorksheetSEO } from '@shared/worksheetSEO'
import { addLocaleToPath, getLocaleFromURL } from '@/utils/locale'

/**
 * Get SEO-friendly URL for a worksheet
 * Falls back to print URL if SEO data not found
 */
export function getWorksheetURL(docId: string, fallbackFrom?: string): string {
  const seo = getWorksheetSEO(docId)
  const from = fallbackFrom || 'worksheets'

  if (seo) {
    const url = `/${seo.slug}${from ? `?from=${from}` : ''}`
    return addLocaleToPath(url, getLocaleFromURL())
  }
  // Fallback to print URL if SEO data not available
  const url = `/print?doc=${docId}&from=${from}`
  return addLocaleToPath(url, getLocaleFromURL())
}

export function getWorksheetPrintURL(docId: string, from?: string): string {
  const fromParam = from || 'worksheets'
  return `/print?doc=${docId}&from=${fromParam}&download=1`
}
