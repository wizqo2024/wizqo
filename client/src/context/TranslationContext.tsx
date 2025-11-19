// Translation Context - Manages language state
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Language, getTranslation, isRTL, getAvailableLanguages } from '@/translations'
import { getLocaleFromURL, parseLocaleFromPath, type Locale } from '@/utils/locale'

interface TranslationContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  isRTL: boolean
  availableLanguages: Array<{ code: Language; name: string; flag: string }>
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined)

export function TranslationProvider({ children }: { children: ReactNode }) {
  // Get language from URL first (for SEO), then query param, then localStorage, then default to 'en'
  // IMPORTANT: Query parameter must take priority over localStorage for /print route
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      // Priority 1: Get from URL path (for SEO and shareable links)
      // BUT: Only use path locale if it's actually in the path (not default 'en')
      // For paths like /print, there's no locale prefix, so we should check query param
      const pathname = window.location.pathname
      const pathSegments = pathname.split('/').filter(Boolean)
      const hasLocaleInPath = pathSegments.length > 0 && ['en', 'es', 'ar'].includes(pathSegments[0])
      
      if (hasLocaleInPath) {
        const urlLocale = pathSegments[0] as Language
        console.log('[TranslationContext] Initial state: Using URL path locale:', urlLocale)
        return urlLocale
      }
      
      // Priority 2: Get from query parameter (for /print route) - MUST check this before localStorage
      // This is especially important for /print route which doesn't have locale in path
      const params = new URLSearchParams(window.location.search)
      const langParam = params.get('lang')
      if (langParam && ['en', 'es', 'ar'].includes(langParam)) {
        console.log('[TranslationContext] Initial state: Using query param lang:', langParam)
        // Also save to localStorage so it persists
        localStorage.setItem('wizqo-language', langParam)
        return langParam as Language
      }
      
      // Priority 3: Get from localStorage (user preference) - only if no URL param
      const saved = localStorage.getItem('wizqo-language') as Language
      if (saved && ['en', 'es', 'ar'].includes(saved)) {
        console.log('[TranslationContext] Initial state: Using localStorage:', saved)
        return saved
      }
    }
    console.log('[TranslationContext] Initial state: Using default: en')
    return 'en'
  })
  
  // Sync language with URL when URL changes (e.g., browser back/forward)
  // This effect runs on mount and when location changes, but NOT when language changes
  // to avoid loops. URL query parameter always takes priority.
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const syncLanguageFromURL = () => {
      // Priority 1: Check URL path locale
      // BUT: Only use path locale if it's actually in the path (not default 'en')
      // For paths like /print, there's no locale prefix, so we should check query param
      const pathname = typeof window !== 'undefined' ? window.location.pathname : ''
      const pathSegments = pathname.split('/').filter(Boolean)
      const hasLocaleInPath = pathSegments.length > 0 && ['en', 'es', 'ar'].includes(pathSegments[0])
      
      if (hasLocaleInPath) {
        const urlLocale = pathSegments[0] as Language
        setLanguageState((currentLang) => {
          if (currentLang !== urlLocale) {
            localStorage.setItem('wizqo-language', urlLocale)
            document.documentElement.dir = isRTL(urlLocale) ? 'rtl' : 'ltr'
            document.documentElement.lang = urlLocale
            return urlLocale as Language
          }
          return currentLang
        })
        return // Early return to avoid checking query param if URL locale exists
      }
      
      // Priority 2: Check query parameter (for /print route with ?lang=ar)
      // This MUST take priority over localStorage
      const params = new URLSearchParams(window.location.search)
      const langParam = params.get('lang')
      if (langParam && ['en', 'es', 'ar'].includes(langParam)) {
        setLanguageState((currentLang) => {
          if (currentLang !== langParam) {
            console.log('[TranslationContext] syncLanguageFromURL: Setting language from query param:', langParam, 'current:', currentLang)
            localStorage.setItem('wizqo-language', langParam)
            document.documentElement.dir = isRTL(langParam) ? 'rtl' : 'ltr'
            document.documentElement.lang = langParam
            return langParam as Language
          }
          return currentLang
        })
        return // Early return to avoid checking localStorage
      }
      
      // Priority 3: Only use localStorage if no URL locale or query param exists
      // This ensures URL parameters always take priority
      const saved = localStorage.getItem('wizqo-language') as Language
      if (saved && ['en', 'es', 'ar'].includes(saved)) {
        setLanguageState((currentLang) => {
          if (currentLang !== saved) {
            document.documentElement.dir = isRTL(saved) ? 'rtl' : 'ltr'
            document.documentElement.lang = saved
            return saved
          }
          return currentLang
        })
      }
    }
    
    // Sync immediately on mount - this ensures URL query params are read right away
    syncLanguageFromURL()
    
    // Also check on location change (for navigation without page reload)
    const checkLanguage = () => {
      syncLanguageFromURL()
    }
    
    // Sync on popstate (browser back/forward)
    window.addEventListener('popstate', syncLanguageFromURL)
    
    // Check on hashchange (for SPA navigation)
    window.addEventListener('hashchange', checkLanguage)
    
    // Also check periodically for URL query parameter changes (e.g., when lang=ar is added)
    // This is important for /print route where language might change via query param
    const checkInterval = setInterval(() => {
      syncLanguageFromURL()
    }, 200) // Check every 200ms for URL changes
    
    // Listen for storage events (when language is changed in another tab/window)
    // But only apply if no URL parameter exists
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'wizqo-language' && e.newValue && ['en', 'es', 'ar'].includes(e.newValue)) {
        // Only apply storage change if no URL parameter overrides it
        const urlLocale = getLocaleFromURL()
        const params = new URLSearchParams(window.location.search)
        const langParam = params.get('lang')
        
        // If URL has a language parameter, don't override with storage
        if (!urlLocale && !langParam) {
          setLanguageState(e.newValue as Language)
          document.documentElement.dir = isRTL(e.newValue as Language) ? 'rtl' : 'ltr'
          document.documentElement.lang = e.newValue
        }
      }
    }
    window.addEventListener('storage', handleStorageChange)
    
    return () => {
      window.removeEventListener('popstate', syncLanguageFromURL)
      window.removeEventListener('hashchange', checkLanguage)
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(checkInterval)
    }
  }, []) // Empty deps - only run on mount and location changes

  // Save language preference
  const setLanguage = React.useCallback((lang: Language) => {
    console.log('setLanguage called with:', lang)
    setLanguageState((prevLang) => {
      console.log('Previous language:', prevLang, 'New language:', lang)
      if (prevLang !== lang) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('wizqo-language', lang)
          // Update HTML dir attribute for RTL
          document.documentElement.dir = isRTL(lang) ? 'rtl' : 'ltr'
          document.documentElement.lang = lang
          
          // For /print route, update the lang query parameter instead of path
          const currentPath = window.location.pathname
          if (currentPath === '/print' || currentPath.startsWith('/print/')) {
            const url = new URL(window.location.href)
            url.searchParams.set('lang', lang)
            // Update URL without reloading the page
            window.history.replaceState({}, '', url.toString())
          }
          
          // Dispatch custom event to notify other components
          window.dispatchEvent(new CustomEvent('languagechange', { detail: { language: lang } }))
        }
        return lang
      }
      return prevLang
    })
  }, [])

  // Update HTML attributes when language changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.dir = isRTL(language) ? 'rtl' : 'ltr'
      document.documentElement.lang = language
    }
  }, [language])

  const t = React.useCallback((key: string): string | any => {
    const result = getTranslation(language, key)
    // Debug: Log if language is ar but we're getting English results
    if (typeof window !== 'undefined' && language === 'ar' && 
        (key.includes('countObjectsAndWriteNumber') || key.includes('countThe') || key.includes('numberLabel'))) {
      const englishResult = getTranslation('en', key)
      if (result === englishResult && result !== key) {
        console.warn(`[TranslationContext] Got English translation for Arabic: key=${key}, language=${language}, result=${result}`)
      }
    }
    return result
  }, [language])

  // Use useMemo to ensure value object reference changes when language changes
  const value: TranslationContextType = React.useMemo(() => {
    // Debug: Log language changes
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const urlLang = urlParams.get('lang')
      if (urlLang && urlLang !== language) {
        console.warn(`[TranslationContext] Language mismatch: URL has lang=${urlLang} but state is language=${language}`)
      }
    }
    return {
      language,
      setLanguage,
      t,
      isRTL: isRTL(language),
      availableLanguages: getAvailableLanguages(),
    }
  }, [language, setLanguage, t])

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  )
}

export function useTranslation() {
  const context = useContext(TranslationContext)
  if (context === undefined) {
    // Fallback to English if provider not available (for SSR or edge cases)
    return {
      language: 'en' as Language,
      setLanguage: () => {},
      t: (key: string) => key,
      isRTL: false,
      availableLanguages: getAvailableLanguages(),
    }
  }
  return context
}
