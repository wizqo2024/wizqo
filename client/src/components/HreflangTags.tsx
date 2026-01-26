// Hreflang Tags Component for SEO
// Tells search engines about alternate language versions of the page
import React from 'react'
import { getAllLocaleUrls, type Locale } from '@/utils/locale'

interface HreflangTagsProps {
  /**
   * Current path without locale prefix (e.g., '/worksheets/multiplication-worksheets')
   * If not provided, will use current window.location.pathname
   */
  path?: string
  /**
   * Base URL (defaults to window.location.origin)
   */
  baseUrl?: string
}

export function HreflangTags({ path, baseUrl }: HreflangTagsProps) {
  // Get current path from URL if not provided
  const currentPath = path || (typeof window !== 'undefined' ? window.location.pathname : '/')
  const origin = baseUrl || (typeof window !== 'undefined' ? window.location.origin : 'https://wizqo.com')
  
  // Get all locale versions
  const localeUrls = getAllLocaleUrls(currentPath)
  
  return (
    <>
      {localeUrls.map(({ locale, url }) => (
        <link
          key={locale}
          rel="alternate"
          hrefLang={locale}
          href={url}
        />
      ))}
      {/* x-default points to English version (or user's browser language) */}
      <link
        rel="alternate"
        hrefLang="x-default"
        href={localeUrls.find(l => l.locale === 'en')?.url || `${origin}/`}
      />
    </>
  )
}
