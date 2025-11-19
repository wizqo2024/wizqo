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

// Explicitly export interactive worksheet keys to prevent tree-shaking
// This ensures these keys are included in the bundle
export const interactiveWorksheetKeys = {
  en: {
    countObjectsAndWriteNumber: en.worksheets.countObjectsAndWriteNumber,
    countThe: en.worksheets.countThe,
    numberLabel: en.worksheets.numberLabel,
    objectNames: en.worksheets.objectNames,
    mathPuzzle: en.worksheets.mathPuzzle,
    mathRace: en.worksheets.mathRace,
    reflection: en.worksheets.reflection,
  },
  es: {
    countObjectsAndWriteNumber: es.worksheets.countObjectsAndWriteNumber,
    countThe: es.worksheets.countThe,
    numberLabel: es.worksheets.numberLabel,
    objectNames: es.worksheets.objectNames,
    mathPuzzle: es.worksheets.mathPuzzle,
    mathRace: es.worksheets.mathRace,
    reflection: es.worksheets.reflection,
  },
  ar: {
    countObjectsAndWriteNumber: ar.worksheets.countObjectsAndWriteNumber,
    countThe: ar.worksheets.countThe,
    numberLabel: ar.worksheets.numberLabel,
    objectNames: ar.worksheets.objectNames,
    mathPuzzle: ar.worksheets.mathPuzzle,
    mathRace: ar.worksheets.mathRace,
    reflection: ar.worksheets.reflection,
  },
} as const

// Runtime merge: Ensure interactive worksheet keys are always present
// This fixes the tree-shaking issue by directly injecting the keys
const ensureInteractiveWorksheetKeys = () => {
  // Define the keys directly to prevent tree-shaking
  const interactiveKeys = {
    en: {
      countObjectsAndWriteNumber: 'Count the objects and write the number.',
      countThe: 'Count the {{object}}',
      numberLabel: 'Number',
      objectNames: {
        stars: 'stars',
        hearts: 'hearts',
        circles: 'circles',
        apples: 'apples',
        balls: 'balls',
        flowers: 'flowers',
        butterflies: 'butterflies',
        fish: 'fish',
      },
      mathPuzzle: {
        instructions: 'Fill in the missing numbers to complete each equation. Show a different strategy (number line, draw, tens frame) for at least two puzzles.',
        answerLabel: 'Puzzle {{number}} answer',
      },
      mathRace: {
        instructions: 'Set a 60-second timer. Solve as many facts as you can, then circle your personal record.',
      },
      reflection: {
        title: 'Reflection',
        mathRaceQuestions: 'How many facts did you solve? ______ • Which strategy helped you most? ____________________',
        generalQuestions: 'What helped you complete your tasks? What would you do differently next time?',
        mandalaQuestion: 'Reflection: How did creating this mandala make you feel?',
      },
    },
    es: {
      countObjectsAndWriteNumber: 'Cuenta los objetos y escribe el número.',
      countThe: 'Cuenta {{object}}',
      numberLabel: 'Número',
      objectNames: {
        stars: 'estrellas',
        hearts: 'corazones',
        circles: 'círculos',
        apples: 'manzanas',
        balls: 'pelotas',
        flowers: 'flores',
        butterflies: 'mariposas',
        fish: 'peces',
      },
      mathPuzzle: {
        instructions: 'Completa los números faltantes para completar cada ecuación. Muestra una estrategia diferente (recta numérica, dibujo, marco de diez) para al menos dos rompecabezas.',
        answerLabel: 'Respuesta del rompecabezas {{number}}',
      },
      mathRace: {
        instructions: 'Configura un temporizador de 60 segundos. Resuelve tantos hechos como puedas, luego marca tu récord personal.',
      },
      reflection: {
        title: 'Reflexión',
        mathRaceQuestions: '¿Cuántos hechos resolviste? ______ • ¿Qué estrategia te ayudó más? ____________________',
        generalQuestions: '¿Qué te ayudó a completar tus tareas? ¿Qué harías diferente la próxima vez?',
        mandalaQuestion: 'Reflexión: ¿Cómo te hizo sentir crear este mandala?',
      },
    },
    ar: {
      countObjectsAndWriteNumber: 'عد الكائنات واكتب الرقم.',
      countThe: 'عد {{object}}',
      numberLabel: 'الرقم',
      objectNames: {
        stars: 'النجوم',
        hearts: 'القلوب',
        circles: 'الدوائر',
        apples: 'التفاح',
        balls: 'الكرات',
        flowers: 'الزهور',
        butterflies: 'الفراشات',
        fish: 'الأسماك',
      },
      mathPuzzle: {
        instructions: 'املأ الأرقام المفقودة لإكمال كل معادلة. أظهر استراتيجية مختلفة (خط الأعداد، الرسم، إطار العشرة) لاثنين على الأقل من الألغاز.',
        answerLabel: 'إجابة اللغز {{number}}',
      },
      mathRace: {
        instructions: 'اضبط مؤقتاً لمدة 60 ثانية. حل أكبر عدد ممكن من الحقائق، ثم ضع دائرة حول رقمك الشخصي.',
      },
      reflection: {
        title: 'التفكير',
        mathRaceQuestions: 'كم عدد الحقائق التي حللتها؟ ______ • ما الاستراتيجية التي ساعدتك أكثر؟ ____________________',
        generalQuestions: 'ما الذي ساعدك على إكمال مهامك؟ ماذا ستفعل بشكل مختلف في المرة القادمة؟',
        mandalaQuestion: 'التفكير: كيف جعلك إنشاء هذا الماندالا تشعر؟',
      },
    },
  }

  // Merge into translations object if keys are missing
  for (const lang of ['en', 'es', 'ar'] as const) {
    const langTranslations = (translations as any)[lang]
    if (langTranslations && langTranslations.worksheets) {
      const worksheets = langTranslations.worksheets
      const keys = interactiveKeys[lang]
      
      // Only merge if keys are missing (to avoid overwriting if they exist)
      if (!worksheets.countObjectsAndWriteNumber) {
        worksheets.countObjectsAndWriteNumber = keys.countObjectsAndWriteNumber
      }
      if (!worksheets.countThe) {
        worksheets.countThe = keys.countThe
      }
      if (!worksheets.numberLabel) {
        worksheets.numberLabel = keys.numberLabel
      }
      if (!worksheets.objectNames) {
        worksheets.objectNames = keys.objectNames
      }
      if (!worksheets.mathPuzzle) {
        worksheets.mathPuzzle = keys.mathPuzzle
      }
      if (!worksheets.mathRace) {
        worksheets.mathRace = keys.mathRace
      }
      if (!worksheets.reflection) {
        worksheets.reflection = keys.reflection
      }
    }
  }
}

// Run the merge immediately
ensureInteractiveWorksheetKeys()

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
        const langObj = translations[language]
        const worksheetsObj = langObj && typeof langObj === 'object' ? langObj.worksheets : undefined
        const objectNamesObj = worksheetsObj && typeof worksheetsObj === 'object' ? worksheetsObj.objectNames : undefined
        
        console.error(`[getTranslation] Top-level translations structure for ${language}:`, {
          hasTranslations: !!translations,
          hasLanguage: !!langObj,
          languageType: typeof langObj,
          languageKeys: langObj && typeof langObj === 'object' ? Object.keys(langObj).slice(0, 20) : 'N/A',
          hasWorksheets: langObj && typeof langObj === 'object' ? 'worksheets' in langObj : false,
          worksheetsType: typeof worksheetsObj,
          worksheetsValue: worksheetsObj,
          worksheetsIsUndefined: worksheetsObj === undefined,
          worksheetsIsNull: worksheetsObj === null,
          worksheetsKeys: worksheetsObj && typeof worksheetsObj === 'object' ? Object.keys(worksheetsObj).slice(0, 30) : 'N/A',
          // Direct access to nested objects
          hasObjectNames: worksheetsObj && typeof worksheetsObj === 'object' ? 'objectNames' in worksheetsObj : false,
          objectNamesType: typeof objectNamesObj,
          objectNamesValue: objectNamesObj,
          objectNamesIsUndefined: objectNamesObj === undefined,
          objectNamesKeys: objectNamesObj && typeof objectNamesObj === 'object' ? Object.keys(objectNamesObj).slice(0, 10) : 'N/A',
          // Try direct access to specific keys
          directCountObjects: worksheetsObj && typeof worksheetsObj === 'object' ? worksheetsObj.countObjectsAndWriteNumber : 'N/A',
          directCountThe: worksheetsObj && typeof worksheetsObj === 'object' ? worksheetsObj.countThe : 'N/A',
          directNumberLabel: worksheetsObj && typeof worksheetsObj === 'object' ? worksheetsObj.numberLabel : 'N/A',
          directObjectNamesBalls: objectNamesObj && typeof objectNamesObj === 'object' ? objectNamesObj.balls : 'N/A'
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
        // If we're looking for interactive worksheet keys and they're missing,
        // try to get them from the exported interactiveWorksheetKeys
        // Only check interactiveWorksheetKeys for actual interactive keys (not regular worksheet keys)
        const INTERACTIVE_KEYS = ['countObjectsAndWriteNumber', 'countThe', 'numberLabel', 'objectNames', 'mathPuzzle', 'mathRace', 'reflection']
        if (keys[0] === 'worksheets' && i >= 1) {
          const interactiveKey = keys[1] as keyof typeof interactiveWorksheetKeys.en
          // Only try interactiveWorksheetKeys fallback if this is actually an interactive key
          if (interactiveKey && INTERACTIVE_KEYS.includes(interactiveKey) && interactiveWorksheetKeys[language] && interactiveKey in interactiveWorksheetKeys[language]) {
            const interactiveValue = (interactiveWorksheetKeys[language] as any)[interactiveKey]
            if (interactiveValue !== undefined) {
              if (typeof window !== 'undefined') {
                console.log(`[getTranslation] Using interactiveWorksheetKeys fallback for: ${key}, language: ${language}, interactiveKey: ${interactiveKey}`)
              }
              // Continue navigation from the interactive value
              value = interactiveValue
              // Continue with remaining keys if any (starting from index 2, since we already handled 0 and 1)
              for (let j = 2; j < keys.length; j++) {
                if (value === null || value === undefined) break
                value = value[keys[j]]
              }
              if (value !== null && value !== undefined) {
                if (Array.isArray(value) || (typeof value === 'object' && typeof value !== 'string')) {
                  return value
                }
                if (typeof value === 'string') {
                  return value
                }
              }
            } else if (typeof window !== 'undefined') {
              console.warn(`[getTranslation] interactiveWorksheetKeys[${language}][${interactiveKey}] is undefined`)
            }
          }
          // Don't log warnings for non-interactive keys - they're just regular worksheet keys
        }
        
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
      // Also try interactiveWorksheetKeys fallback for English
      // Only check for actual interactive keys
      const INTERACTIVE_KEYS = ['countObjectsAndWriteNumber', 'countThe', 'numberLabel', 'objectNames', 'mathPuzzle', 'mathRace', 'reflection']
      if (keys[0] === 'worksheets' && keys.length >= 2) {
        const interactiveKey = keys[1] as keyof typeof interactiveWorksheetKeys.en
        if (interactiveKey && INTERACTIVE_KEYS.includes(interactiveKey) && interactiveWorksheetKeys.en && interactiveKey in interactiveWorksheetKeys.en) {
          const interactiveValue = (interactiveWorksheetKeys.en as any)[interactiveKey]
          if (interactiveValue !== undefined) {
            let englishValue = interactiveValue
            // Continue with remaining keys if any
            for (let j = 2; j < keys.length; j++) {
              if (englishValue === null || englishValue === undefined) break
              englishValue = englishValue[keys[j]]
            }
            if (englishValue !== null && englishValue !== undefined) {
              if (Array.isArray(englishValue) || (typeof englishValue === 'object' && typeof englishValue !== 'string')) {
                return englishValue
              }
              if (typeof englishValue === 'string') {
                return englishValue
              }
            }
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
