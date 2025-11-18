// Translation Context - Manages language state
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Language, getTranslation, isRTL, getAvailableLanguages } from '@/translations'

interface TranslationContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  isRTL: boolean
  availableLanguages: Array<{ code: Language; name: string; flag: string }>
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined)

export function TranslationProvider({ children }: { children: ReactNode }) {
  // Get language from localStorage or default to 'en'
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('wizqo-language') as Language
      return saved && ['en', 'es', 'ar'].includes(saved) ? saved : 'en'
    }
    return 'en'
  })

  // Save language preference
  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    if (typeof window !== 'undefined') {
      localStorage.setItem('wizqo-language', lang)
      // Update HTML dir attribute for RTL
      document.documentElement.dir = isRTL(lang) ? 'rtl' : 'ltr'
      document.documentElement.lang = lang
    }
  }

  // Update HTML attributes when language changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.dir = isRTL(language) ? 'rtl' : 'ltr'
      document.documentElement.lang = language
    }
  }, [language])

  const t = (key: string): string => {
    return getTranslation(language, key)
  }

  const value: TranslationContextType = {
    language,
    setLanguage,
    t,
    isRTL: isRTL(language),
    availableLanguages: getAvailableLanguages(),
  }

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
