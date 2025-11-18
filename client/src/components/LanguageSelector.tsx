// Language Selector Component
import React from 'react'
import { useTranslation } from '@/context/TranslationContext'
import { addLocaleToPath, removeLocaleFromPath, type Locale } from '@/utils/locale'

export function LanguageSelector() {
  const { language, setLanguage, availableLanguages } = useTranslation()

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value as Locale
    console.log('Language changing to:', newLang)
    
    // Get current path without locale
    const currentPath = typeof window !== 'undefined' 
      ? removeLocaleFromPath(window.location.pathname)
      : '/'
    
    // Build new URL with locale prefix
    const newPath = addLocaleToPath(currentPath, newLang)
    const newUrl = newPath + (typeof window !== 'undefined' ? window.location.search : '')
    
    // Update language state
    setLanguage(newLang)
    
    // Navigate to new URL (this will trigger route change)
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', newUrl)
      // Trigger a custom event to notify App.tsx of the route change
      window.dispatchEvent(new PopStateEvent('popstate'))
    }
  }

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="language-select" className="text-sm text-slate-600 hidden sm:inline">
        Language:
      </label>
      <select
        id="language-select"
        value={language}
        onChange={handleLanguageChange}
        className="border border-slate-300 rounded-md px-3 py-1.5 text-sm bg-white hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        aria-label="Select language"
      >
        {availableLanguages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
    </div>
  )
}
