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
  // IMPORTANT: Query parameter takes priority over localStorage for /print route with ?lang=ar
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      // Priority 1: Get from URL path (for SEO and shareable links)
      const urlLocale = getLocaleFromURL()
      if (urlLocale && ['en', 'es', 'ar'].includes(urlLocale)) {
        // Set HTML attributes immediately
        document.documentElement.dir = isRTL(urlLocale) ? 'rtl' : 'ltr'
        document.documentElement.lang = urlLocale
        return urlLocale as Language
      }
      
      // Priority 2: Get from query parameter (for /print route)
      // This MUST take priority over localStorage when present in URL
      const params = new URLSearchParams(window.location.search)
      const langParam = params.get('lang')
      if (langParam && ['en', 'es', 'ar'].includes(langParam)) {
        // Set HTML attributes immediately
        document.documentElement.dir = isRTL(langParam) ? 'rtl' : 'ltr'
        document.documentElement.lang = langParam
        // Also save to localStorage so it persists
        localStorage.setItem('wizqo-language', langParam)
        return langParam as Language
      }
      
      // Priority 3: Get from localStorage (user preference)
      // Only use this if no URL locale or query parameter is present
      const saved = localStorage.getItem('wizqo-language') as Language
      if (saved && ['en', 'es', 'ar'].includes(saved)) {
        // Set HTML attributes immediately
        document.documentElement.dir = isRTL(saved) ? 'rtl' : 'ltr'
        document.documentElement.lang = saved
        return saved
      }
    }
    return 'en'
  })
  
  // Sync language with URL when URL changes (e.g., browser back/forward)
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const syncLanguageFromURL = () => {
      const urlLocale = getLocaleFromURL()
      // Priority 1: URL path locale (for SEO)
      if (urlLocale && ['en', 'es', 'ar'].includes(urlLocale)) {
        if (urlLocale !== language) {
          setLanguageState(urlLocale as Language)
          localStorage.setItem('wizqo-language', urlLocale)
          document.documentElement.dir = isRTL(urlLocale) ? 'rtl' : 'ltr'
          document.documentElement.lang = urlLocale
        }
        return // Early return to avoid checking query param if URL locale exists
      }
      
      // Priority 2: Query parameter (for /print route with ?lang=ar)
      // This takes priority over localStorage when present in URL
      const params = new URLSearchParams(window.location.search)
      const langParam = params.get('lang')
      if (langParam && ['en', 'es', 'ar'].includes(langParam)) {
        // Always update if lang param exists and is different, or if we need to ensure it's set
        if (langParam !== language) {
          setLanguageState(langParam as Language)
          localStorage.setItem('wizqo-language', langParam)
          document.documentElement.dir = isRTL(langParam) ? 'rtl' : 'ltr'
          document.documentElement.lang = langParam
        }
        return // Early return to avoid checking localStorage
      }
      
      // Priority 3: localStorage (user preference) - only if no URL locale or query param
      if (!urlLocale && !langParam && typeof window !== 'undefined') {
        const saved = localStorage.getItem('wizqo-language') as Language
        if (saved && ['en', 'es', 'ar'].includes(saved) && saved !== language) {
          setLanguageState(saved)
          document.documentElement.dir = isRTL(saved) ? 'rtl' : 'ltr'
          document.documentElement.lang = saved
        }
      }
    }
    
    // Also check on location change (for navigation without page reload)
    const checkLanguage = () => {
      const urlLocale = getLocaleFromURL()
      if (!urlLocale) {
        // Check query parameter first (takes priority)
        const params = new URLSearchParams(window.location.search)
        const langParam = params.get('lang')
        if (langParam && ['en', 'es', 'ar'].includes(langParam)) {
          if (langParam !== language) {
            setLanguageState(langParam as Language)
            localStorage.setItem('wizqo-language', langParam)
            document.documentElement.dir = isRTL(langParam) ? 'rtl' : 'ltr'
            document.documentElement.lang = langParam
          }
        } else {
          const saved = localStorage.getItem('wizqo-language') as Language
          if (saved && ['en', 'es', 'ar'].includes(saved) && saved !== language) {
            setLanguageState(saved)
            document.documentElement.dir = isRTL(saved) ? 'rtl' : 'ltr'
            document.documentElement.lang = saved
          }
        }
      }
    }
    
    // Sync immediately on mount (don't wait for setTimeout)
    syncLanguageFromURL()
    
    // Also use setTimeout as backup to ensure it runs after render
    const timeoutId = setTimeout(() => {
      syncLanguageFromURL()
    }, 0)
    
    // Additional check specifically for query parameter on mount
    // This is critical for /print route which uses ?lang=ar
    const timeoutId2 = setTimeout(() => {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search)
        const langParam = params.get('lang')
        if (langParam && ['en', 'es', 'ar'].includes(langParam)) {
          // Always set if lang param exists, even if it matches current language
          // This ensures it's set correctly on initial load and forces re-render
          setLanguageState(langParam as Language)
          localStorage.setItem('wizqo-language', langParam)
          document.documentElement.dir = isRTL(langParam) ? 'rtl' : 'ltr'
          document.documentElement.lang = langParam
        }
      }
    }, 0)
    
    // Sync on popstate (browser back/forward)
    window.addEventListener('popstate', syncLanguageFromURL)
    
    // Check on hashchange (for SPA navigation)
    window.addEventListener('hashchange', checkLanguage)
    
    // Also listen for storage events (when language is changed in another tab/window)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'wizqo-language' && e.newValue && ['en', 'es', 'ar'].includes(e.newValue)) {
        setLanguageState(e.newValue as Language)
        document.documentElement.dir = isRTL(e.newValue as Language) ? 'rtl' : 'ltr'
        document.documentElement.lang = e.newValue
      }
    }
    window.addEventListener('storage', handleStorageChange)
    
    // Listen for custom event when language is changed (for same-window updates)
    const handleLanguageChange = () => {
      if (!getLocaleFromURL()) {
        // Check query parameter first
        const params = new URLSearchParams(window.location.search)
        const langParam = params.get('lang')
        if (langParam && ['en', 'es', 'ar'].includes(langParam) && langParam !== language) {
          setLanguageState(langParam as Language)
          localStorage.setItem('wizqo-language', langParam)
          document.documentElement.dir = isRTL(langParam) ? 'rtl' : 'ltr'
          document.documentElement.lang = langParam
        } else {
          const saved = localStorage.getItem('wizqo-language') as Language
          if (saved && ['en', 'es', 'ar'].includes(saved) && saved !== language) {
            setLanguageState(saved)
            document.documentElement.dir = isRTL(saved) ? 'rtl' : 'ltr'
            document.documentElement.lang = saved
          }
        }
      }
    }
    window.addEventListener('languagechange', handleLanguageChange as EventListener)
    
    return () => {
      clearTimeout(timeoutId)
      clearTimeout(timeoutId2)
      window.removeEventListener('popstate', syncLanguageFromURL)
      window.removeEventListener('hashchange', checkLanguage)
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('languagechange', handleLanguageChange as EventListener)
    }
  }, [language])

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
    return getTranslation(language, key)
  }, [language])

  // Use useMemo to ensure value object reference changes when language changes
  const value: TranslationContextType = React.useMemo(() => ({
    language,
    setLanguage,
    t,
    isRTL: isRTL(language),
    availableLanguages: getAvailableLanguages(),
  }), [language, setLanguage, t])

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
