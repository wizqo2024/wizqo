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
// Returns string, array, or object depending on the translation value
export function getTranslation(language: Language, key: string): string | any {
  try {
    const keys = key.split('.')
    let value: any = translations[language]
    
    if (!value) {
      console.warn(`[getTranslation] Translation object not found for language: ${language}`, {
        availableLanguages: Object.keys(translations),
        translationsObject: translations
      })
      // Fallback to English
      value = translations.en
      if (!value) {
        return key
      }
    }
    
    // Navigate through nested keys
    for (const k of keys) {
      if (value === null || value === undefined) {
        // Debug: log what we found so far
        if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
          console.warn(`[getTranslation] Navigation stopped at key: ${k}`, {
            language,
            fullKey: key,
            keysSoFar: keys.slice(0, keys.indexOf(k)),
            currentValue: value,
            availableKeys: value && typeof value === 'object' ? Object.keys(value) : 'N/A'
          })
        }
        break
      }
      value = value[k]
    }
    
    // If we got a valid value (string, array, or object), return it
    if (value !== null && value !== undefined) {
      // Return arrays and objects as-is
      if (Array.isArray(value) || (typeof value === 'object' && typeof value !== 'string')) {
        return value
      }
      // Return strings (including empty strings) - but check if it's actually a translation
      if (typeof value === 'string') {
        // If the value is the same as the key, it might be a missing translation
        // But we still return it since it's a valid string
        return value
      }
    }
    
    // Fallback to English if translation missing
    if (language !== 'en') {
      let fallbackValue: any = translations.en
      if (fallbackValue) {
        for (const k of keys) {
          if (fallbackValue === null || fallbackValue === undefined) break
          fallbackValue = fallbackValue[k]
        }
        if (fallbackValue !== null && fallbackValue !== undefined) {
          // Return arrays and objects as-is
          if (Array.isArray(fallbackValue) || (typeof fallbackValue === 'object' && typeof fallbackValue !== 'string')) {
            return fallbackValue
          }
          // Return strings
          if (typeof fallbackValue === 'string') {
            return fallbackValue
          }
        }
      }
    }
    
    // Final fallback: return the key itself (so it's visible if translation missing)
    // Only warn in development to avoid console spam
    if (typeof window !== 'undefined' && (window as any).__DEV__) {
      console.warn(`Translation missing for key: ${key} in language: ${language}`)
    }
    return key
  } catch (error) {
    // If anything goes wrong, just return the key
    if (typeof window !== 'undefined' && (window as any).__DEV__) {
      console.warn('Translation error for key:', key, 'language:', language, error)
    }
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
