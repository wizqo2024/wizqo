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
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      // Priority 1: Get from URL path (for SEO and shareable links)
      const urlLocale = getLocaleFromURL()
      if (urlLocale && ['en', 'es', 'ar'].includes(urlLocale)) {
        return urlLocale as Language
      }
      
      // Priority 2: Get from query parameter (for /print route)
      const params = new URLSearchParams(window.location.search)
      const langParam = params.get('lang')
      if (langParam && ['en', 'es', 'ar'].includes(langParam)) {
        return langParam as Language
      }
      
      // Priority 3: Get from localStorage (user preference)
      const saved = localStorage.getItem('wizqo-language') as Language
      if (saved && ['en', 'es', 'ar'].includes(saved)) {
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
      if (urlLocale && ['en', 'es', 'ar'].includes(urlLocale) && urlLocale !== language) {
        setLanguageState(urlLocale as Language)
        // Also save to localStorage so it persists when navigating to routes without locale prefix (like /print)
        if (typeof window !== 'undefined') {
          localStorage.setItem('wizqo-language', urlLocale)
          document.documentElement.dir = isRTL(urlLocale) ? 'rtl' : 'ltr'
          document.documentElement.lang = urlLocale
        }
      } else if (!urlLocale) {
        // If no locale in URL path, check query parameter
        const params = new URLSearchParams(window.location.search)
        const langParam = params.get('lang')
        if (langParam && ['en', 'es', 'ar'].includes(langParam) && langParam !== language) {
          setLanguageState(langParam as Language)
          localStorage.setItem('wizqo-language', langParam)
          document.documentElement.dir = isRTL(langParam) ? 'rtl' : 'ltr'
          document.documentElement.lang = langParam
        } else {
          // If no locale in URL or query param, check localStorage and update if different
          const saved = localStorage.getItem('wizqo-language') as Language
          if (saved && ['en', 'es', 'ar'].includes(saved) && saved !== language) {
            setLanguageState(saved)
            document.documentElement.dir = isRTL(saved) ? 'rtl' : 'ltr'
            document.documentElement.lang = saved
          }
        }
      }
    }
    
    // Sync on mount - always check localStorage when no URL locale
    syncLanguageFromURL()
    
    // Also check query parameter immediately after mount (in case it wasn't in initial state)
    React.useEffect(() => {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search)
        const langParam = params.get('lang')
        if (langParam && ['en', 'es', 'ar'].includes(langParam) && langParam !== language) {
          setLanguageState(langParam as Language)
          localStorage.setItem('wizqo-language', langParam)
          document.documentElement.dir = isRTL(langParam) ? 'rtl' : 'ltr'
          document.documentElement.lang = langParam
        }
      }
    }, []) // Run once on mount
    
    // Also check on location change (for navigation without page reload)
    const checkLanguage = () => {
      const urlLocale = getLocaleFromURL()
      if (!urlLocale) {
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
