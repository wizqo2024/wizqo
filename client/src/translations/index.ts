// Translation system - Central export
import { en } from './en'
import { es } from './es'
import { ar } from './ar'

export type Language = 'en' | 'es' | 'ar'

export const translations = {
  en,
  es,
  ar,
} as const

// Helper function to get translation with fallback
export function getTranslation(language: Language, key: string): string {
  const keys = key.split('.')
  let value: any = translations[language]
  
  // Navigate through nested keys
  for (const k of keys) {
    value = value?.[k]
    if (value === undefined) break
  }
  
  // Fallback to English if translation missing
  if (value === undefined && language !== 'en') {
    let fallbackValue: any = translations.en
    for (const k of keys) {
      fallbackValue = fallbackValue?.[k]
      if (fallbackValue === undefined) break
    }
    return fallbackValue || key
  }
  
  return value || key
}

// Check if language is RTL
export function isRTL(language: Language): boolean {
  return language === 'ar'
}

// Get all available languages
export function getAvailableLanguages(): Array<{ code: Language; name: string; flag: string }> {
  return [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  ]
}
