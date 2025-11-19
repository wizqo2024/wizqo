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
    
    // Debug: Log the top-level structure once per language
    if (typeof window !== 'undefined' && keys[0] === 'worksheets') {
      const debugKey = `translation-debug-${language}`
      if (!(window as any)[debugKey]) {
        (window as any)[debugKey] = true
        console.error(`[getTranslation] Top-level translations structure for ${language}:`, {
          hasTranslations: !!translations,
          hasLanguage: !!translations[language],
          languageType: typeof translations[language],
          languageKeys: translations[language] && typeof translations[language] === 'object' ? Object.keys(translations[language]).slice(0, 20) : 'N/A',
          hasWorksheets: translations[language] && typeof translations[language] === 'object' ? 'worksheets' in translations[language] : false,
          worksheetsType: translations[language] && typeof translations[language] === 'object' ? typeof translations[language].worksheets : 'N/A',
          worksheetsValue: translations[language] && typeof translations[language] === 'object' ? translations[language].worksheets : 'N/A',
          worksheetsIsUndefined: translations[language] && typeof translations[language] === 'object' ? translations[language].worksheets === undefined : 'N/A',
          worksheetsIsNull: translations[language] && typeof translations[language] === 'object' ? translations[language].worksheets === null : 'N/A',
          worksheetsKeys: (translations[language] && typeof translations[language] === 'object' && translations[language].worksheets && typeof translations[language].worksheets === 'object') ? Object.keys(translations[language].worksheets).slice(0, 30) : 'N/A'
        })
      }
    }
    
    // Debug: Log if translations object is missing or malformed
    if (!value) {
      console.warn(`[getTranslation] Translation object not found for language: ${language}`, {
        availableLanguages: Object.keys(translations),
        translationsObject: translations,
        translationsType: typeof translations,
        hasEn: !!translations.en,
        hasAr: !!translations.ar,
        hasEs: !!translations.es,
        enType: typeof translations.en,
        arType: typeof translations.ar
      })
      // Fallback to English
      value = translations.en
      if (!value) {
        console.error(`[getTranslation] Even English fallback is missing!`, { translations })
        return key
      }
    }
    
    // Debug: Check if worksheets exists and log its structure
    if (keys[0] === 'worksheets' && typeof window !== 'undefined') {
      const hasWorksheets = value && typeof value === 'object' && 'worksheets' in value
      if (!hasWorksheets) {
        console.warn(`[getTranslation] 'worksheets' not found in ${language} translations`, {
          language,
          key,
          valueKeys: value && typeof value === 'object' ? Object.keys(value).slice(0, 10) : 'N/A',
          valueType: typeof value
        })
      } else {
        // Log the worksheets object structure for debugging
        const worksheetsObj = value.worksheets
        if (worksheetsObj && typeof worksheetsObj === 'object') {
          const allKeys = Object.keys(worksheetsObj)
          // Direct access to see what we get
          const objectNamesDirect = worksheetsObj.objectNames
          const countObjectsDirect = worksheetsObj.countObjectsAndWriteNumber
          const countTheDirect = worksheetsObj.countThe
          const numberLabelDirect = worksheetsObj.numberLabel
          
          console.error(`[getTranslation] worksheets object structure for ${language}:`, {
            hasObjectNames: 'objectNames' in worksheetsObj,
            objectNamesType: typeof objectNamesDirect,
            objectNamesValue: objectNamesDirect,
            objectNamesIsUndefined: objectNamesDirect === undefined,
            objectNamesIsNull: objectNamesDirect === null,
            objectNamesKeys: objectNamesDirect && typeof objectNamesDirect === 'object' ? Object.keys(objectNamesDirect) : 'N/A',
            hasCountObjectsAndWriteNumber: 'countObjectsAndWriteNumber' in worksheetsObj,
            countObjectsAndWriteNumberValue: countObjectsDirect,
            countObjectsAndWriteNumberType: typeof countObjectsDirect,
            hasCountThe: 'countThe' in worksheetsObj,
            countTheValue: countTheDirect,
            countTheType: typeof countTheDirect,
            hasNumberLabel: 'numberLabel' in worksheetsObj,
            numberLabelValue: numberLabelDirect,
            numberLabelType: typeof numberLabelDirect,
            worksheetsKeys: allKeys.slice(0, 30),
            worksheetsKeysCount: allKeys.length,
            // Log first few key-value pairs to see actual structure
            sampleEntries: allKeys.slice(0, 10).map(k => ({ 
              key: k, 
              value: worksheetsObj[k], 
              valueType: typeof worksheetsObj[k],
              isUndefined: worksheetsObj[k] === undefined,
              isNull: worksheetsObj[k] === null,
              isObject: typeof worksheetsObj[k] === 'object' && worksheetsObj[k] !== null,
              objectKeys: (typeof worksheetsObj[k] === 'object' && worksheetsObj[k] !== null) ? Object.keys(worksheetsObj[k]).slice(0, 5) : 'N/A'
            }))
          })
        }
      }
    }
    
    // Navigate through nested keys
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i]
      if (value === null || value === undefined) {
        // Debug: log what we found so far - show in production too for debugging
        if (typeof window !== 'undefined') {
          // Get the previous value (the object we were trying to access)
          let prevValue = translations[language]
          for (let j = 0; j < i; j++) {
            if (prevValue && typeof prevValue === 'object') prevValue = prevValue[keys[j]]
            else break
          }
          
          console.error(`[getTranslation] Navigation stopped at key: ${k} (index ${i})`, {
            language,
            fullKey: key,
            keysSoFar: keys.slice(0, i),
            currentValue: value,
            previousValue: prevValue,
            previousValueType: typeof prevValue,
            previousValueIsObject: prevValue && typeof prevValue === 'object',
            previousValueKeys: prevValue && typeof prevValue === 'object' ? Object.keys(prevValue).slice(0, 30) : 'N/A',
            tryingToAccess: k,
            availableKeys: prevValue && typeof prevValue === 'object' ? Object.keys(prevValue).slice(0, 30) : 'N/A',
            // Check if the key exists but is undefined
            keyExists: prevValue && typeof prevValue === 'object' ? (k in prevValue) : false,
            keyValue: prevValue && typeof prevValue === 'object' ? prevValue[k] : 'N/A'
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
