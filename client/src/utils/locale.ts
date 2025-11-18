// Locale utility functions for URL-based language routing
export type Locale = 'en' | 'es' | 'ar'

export const DEFAULT_LOCALE: Locale = 'en'
export const SUPPORTED_LOCALES: Locale[] = ['en', 'es', 'ar']

/**
 * Extract locale from pathname
 * Returns locale and path without locale prefix
 * Examples:
 *   /es/worksheets/multiplication -> { locale: 'es', path: '/worksheets/multiplication' }
 *   /ar/about -> { locale: 'ar', path: '/about' }
 *   /worksheets/multiplication -> { locale: 'en', path: '/worksheets/multiplication' }
 */
export function parseLocaleFromPath(pathname: string): { locale: Locale; path: string } {
  const segments = pathname.split('/').filter(Boolean)
  
  // Check if first segment is a locale
  if (segments.length > 0 && SUPPORTED_LOCALES.includes(segments[0] as Locale)) {
    const locale = segments[0] as Locale
    const path = '/' + segments.slice(1).join('/')
    return { locale, path: path || '/' }
  }
  
  // Default to English (no prefix)
  return { locale: DEFAULT_LOCALE, path: pathname }
}

/**
 * Get locale from current URL
 */
export function getLocaleFromURL(): Locale {
  if (typeof window === 'undefined') return DEFAULT_LOCALE
  const { locale } = parseLocaleFromPath(window.location.pathname)
  return locale
}

/**
 * Add locale prefix to path
 * Examples:
 *   addLocaleToPath('/worksheets', 'es') -> '/es/worksheets'
 *   addLocaleToPath('/worksheets', 'en') -> '/worksheets' (no prefix for English)
 */
export function addLocaleToPath(path: string, locale: Locale): string {
  // Remove leading/trailing slashes and normalize
  const cleanPath = path.replace(/^\/+|\/+$/g, '') || ''
  const normalizedPath = cleanPath ? `/${cleanPath}` : '/'
  
  // English doesn't get a prefix (backward compatibility)
  if (locale === DEFAULT_LOCALE) {
    return normalizedPath
  }
  
  // Other locales get prefix
  return `/${locale}${normalizedPath}`
}

/**
 * Remove locale from path (if present)
 * Examples:
 *   removeLocaleFromPath('/es/worksheets') -> '/worksheets'
 *   removeLocaleFromPath('/worksheets') -> '/worksheets'
 */
export function removeLocaleFromPath(path: string): string {
  const { path: pathWithoutLocale } = parseLocaleFromPath(path)
  return pathWithoutLocale
}

/**
 * Get all locale versions of a URL for hreflang tags
 */
export function getAllLocaleUrls(path: string): Array<{ locale: Locale; url: string }> {
  const cleanPath = removeLocaleFromPath(path)
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://wizqo.com'
  
  return SUPPORTED_LOCALES.map(locale => ({
    locale,
    url: `${baseUrl}${addLocaleToPath(cleanPath, locale)}`
  }))
}

/**
 * Check if a path should have locale prefix
 * Some paths like /api, /print should not have locale
 */
export function shouldAddLocale(path: string): boolean {
  const excludedPaths = ['/api', '/print', '/_next', '/static', '/assets']
  return !excludedPaths.some(excluded => path.startsWith(excluded))
}
