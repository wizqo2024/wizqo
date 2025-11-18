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
  try {
    const keys = key.split('.')
    let value: any = translations[language]
    
    // Navigate through nested keys
    for (const k of keys) {
      if (value === null || value === undefined) break
      value = value[k]
    }
    
    // If we got a valid string, return it
    if (typeof value === 'string' && value.length > 0) {
      return value
    }
    
    // Fallback to English if translation missing
    if (language !== 'en') {
      let fallbackValue: any = translations.en
      for (const k of keys) {
        if (fallbackValue === null || fallbackValue === undefined) break
        fallbackValue = fallbackValue[k]
      }
      if (typeof fallbackValue === 'string' && fallbackValue.length > 0) {
        return fallbackValue
      }
    }
    
    // Final fallback: return the key itself (so it's visible if translation missing)
    return key
  } catch (error) {
    // If anything goes wrong, just return the key
    console.warn('Translation error for key:', key, error)
    return key
  }
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
