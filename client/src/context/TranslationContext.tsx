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
  // Get language from URL first (for SEO), then localStorage, then default to 'en'
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      // Priority 1: Get from URL (for SEO and shareable links)
      const urlLocale = getLocaleFromURL()
      if (urlLocale && ['en', 'es', 'ar'].includes(urlLocale)) {
        return urlLocale as Language
      }
      
      // Priority 2: Get from localStorage (user preference)
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
      }
    }
    
    // Sync on mount
    syncLanguageFromURL()
    
    // Sync on popstate (browser back/forward)
    window.addEventListener('popstate', syncLanguageFromURL)
    
    return () => {
      window.removeEventListener('popstate', syncLanguageFromURL)
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
