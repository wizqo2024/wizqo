// Language Selector Component
import React, { useState, useRef, useEffect } from 'react'
import { useTranslation } from '@/context/TranslationContext'
import { addLocaleToPath, removeLocaleFromPath, type Locale } from '@/utils/locale'
import { ChevronDown } from 'lucide-react'

export function LanguageSelector() {
  const { language, setLanguage, availableLanguages } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const currentLanguage = availableLanguages.find(lang => lang.code === language) || availableLanguages[0]

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleLanguageChange = (newLang: Locale) => {
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
    
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2 py-1.5 rounded-md text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-colors"
        aria-label="Select language"
        aria-expanded={isOpen}
      >
        <span className="text-lg">{currentLanguage.flag}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 bg-white border border-slate-200 rounded-md shadow-lg z-50 min-w-[140px]">
          {availableLanguages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code as Locale)}
              className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-slate-50 transition-colors ${
                language === lang.code ? 'bg-purple-50 text-purple-600' : 'text-slate-700'
              }`}
            >
              <span className="text-lg">{lang.flag}</span>
              <span>{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
