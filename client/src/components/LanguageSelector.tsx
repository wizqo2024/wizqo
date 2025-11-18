// Language Selector Component
import { useTranslation } from '@/context/TranslationContext'

export function LanguageSelector() {
  const { language, setLanguage, availableLanguages } = useTranslation()

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value as 'en' | 'es' | 'ar'
    setLanguage(newLang)
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
