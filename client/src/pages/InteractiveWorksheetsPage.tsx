import React from 'react'
import { UnifiedNavigation } from '@/components/UnifiedNavigation'
import { Footer } from '@/components/Footer'
import { SEOMetaTags } from '@/components/SEOMetaTags'
import InteractiveBundleSections from '@/components/InteractiveBundleSections'
import Shuffle from '@/components/Shuffle'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  INTERACTIVE_CATEGORIES,
  INTERACTIVE_GRADE_OPTIONS,
  type GradeBand,
} from '@shared/interactive/interactiveWorksheets'
import type {
  InteractiveWorksheetItem,
  InteractiveWorksheetPack,
} from '@shared/interactive/generator'
import { getDocMeta } from '@shared/interactive/interactiveWorksheets'

const DEFAULT_SELECTED_CATEGORIES = ['math']
const DEFAULT_GRADE: GradeBand = 'preK'
const MAX_DUPLICATE_ATTEMPTS = 4

const CATEGORY_ORDER = new Map(
  INTERACTIVE_CATEGORIES.map((category, index) => [category.id, index] as const)
)

const normalizeCategoryIds = (ids: string[]): string[] => {
  const unique = Array.from(new Set(ids)).filter((id) => INTERACTIVE_CATEGORIES.some((c) => c.id === id))
  const sorted = unique.sort((a, b) => (CATEGORY_ORDER.get(a) ?? Number.MAX_SAFE_INTEGER) - (CATEGORY_ORDER.get(b) ?? Number.MAX_SAFE_INTEGER))
  return sorted.length > 0 ? sorted : DEFAULT_SELECTED_CATEGORIES
}

const DEFAULT_NORMALIZED_CATEGORIES = normalizeCategoryIds(DEFAULT_SELECTED_CATEGORIES)
const DEFAULT_CATEGORIES_KEY = DEFAULT_NORMALIZED_CATEGORIES.join(',')

interface FiltersState {
  grade: GradeBand
  categories: string[]
  variant: number
  _timestamp?: number // Force React to detect changes
  _generateTimestamp?: number // Timestamp for seed generation when explicitly generating new
}

// Favorites/Collections storage helpers
const FAVORITES_STORAGE_KEY = 'wizqo-interactive-worksheets-favorites'
const CUSTOMIZATION_STORAGE_KEY = 'wizqo-interactive-worksheets-customization'

interface FavoriteWorksheet {
  docId: string
  title: string
  categoryLabel: string
  gradeLabel: string
  addedAt: number
}

interface CustomizationData {
  studentNames: string[]
  teacherName: string
  className: string
}

function loadFavorites(): FavoriteWorksheet[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(FAVORITES_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveFavorites(favorites: FavoriteWorksheet[]) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites))
  } catch {}
}

function loadCustomization(): CustomizationData {
  if (typeof window === 'undefined') return { studentNames: [], teacherName: '', className: '' }
  try {
    const stored = localStorage.getItem(CUSTOMIZATION_STORAGE_KEY)
    return stored ? JSON.parse(stored) : { studentNames: [], teacherName: '', className: '' }
  } catch {
    return { studentNames: [], teacherName: '', className: '' }
  }
}

function saveCustomization(data: CustomizationData) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(CUSTOMIZATION_STORAGE_KEY, JSON.stringify(data))
  } catch {}
}

// Search helper function
function matchesSearch(item: InteractiveWorksheetItem, searchQuery: string): boolean {
  if (!searchQuery.trim()) return true
  const query = searchQuery.toLowerCase().trim()
  
  // Search in title
  if (item.title.toLowerCase().includes(query)) return true
  
  // Search in description
  if (item.description.toLowerCase().includes(query)) return true
  
  // Search in category label (e.g., "Math", "Reading") - exact and partial match
  const categoryLabelLower = item.categoryLabel.toLowerCase()
  if (categoryLabelLower === query || categoryLabelLower.includes(query) || query.includes(categoryLabelLower)) return true
  
  // Search in category ID (e.g., "math", "reading", "science") - exact and partial match
  const categoryIdLower = item.categoryId.toLowerCase()
  if (categoryIdLower === query || categoryIdLower.includes(query) || query.includes(categoryIdLower)) return true
  
  // Also check all categories from INTERACTIVE_CATEGORIES for direct matches
  for (const category of INTERACTIVE_CATEGORIES) {
    const categoryIdLower = category.id.toLowerCase()
    const categoryLabelLower = category.label.toLowerCase()
    // Check if query matches category ID or label (exact or partial)
    if (query === categoryIdLower || 
        query === categoryLabelLower ||
        query.includes(categoryIdLower) || 
        categoryIdLower.includes(query) ||
        query.includes(categoryLabelLower) || 
        categoryLabelLower.includes(query)) {
      // Check if this item belongs to this category
      if (item.categoryId.toLowerCase() === categoryIdLower || 
          item.categoryLabel.toLowerCase() === categoryLabelLower) {
        return true
      }
    }
  }
  
  // Search in grade label (e.g., "Preschool", "K–1", "2nd–3rd", or "Preschool / K–1 / G2")
  // Normalize dashes (en dash – and hyphen -) for consistent matching
  const gradeLabelLower = item.gradeLabel.toLowerCase().replace(/[–—]/g, '-')
  const normalizedQuery = query.replace(/[–—]/g, '-')
  if (gradeLabelLower.includes(normalizedQuery) || normalizedQuery.includes(gradeLabelLower)) return true
  
  // Map grade search terms to grade labels
  // gradeLabel can be like "Preschool / K–1 / G2", so we need to check each part
  const gradeSearchMap: Record<string, string[]> = {
    // Search terms -> grade labels they should match (normalized with hyphens)
    'preschool': ['preschool', 'prek', 'pre-k'],
    'prek': ['preschool', 'prek'],
    'pre-k': ['preschool', 'prek'],
    'k1': ['k-1', 'k 1'],
    'k-1': ['k-1', 'k 1'],
    'k 1': ['k-1', 'k 1'],
    'kindergarten': ['k-1'],
    'first grade': ['k-1'],
    'g2': ['2nd-3rd', '2nd 3rd'],
    '2nd': ['2nd-3rd'],
    '3rd': ['2nd-3rd'],
    'second': ['2nd-3rd'],
    'third': ['2nd-3rd'],
    '2nd-3rd': ['2nd-3rd'],
    '35': ['4th-5th', '4th 5th'],
    '4th': ['4th-5th'],
    '5th': ['4th-5th'],
    'fourth': ['4th-5th'],
    'fifth': ['4th-5th'],
    '4th-5th': ['4th-5th'],
    '68': ['6th-8th', '6th 8th'],
    '6th': ['6th-8th'],
    '7th': ['6th-8th'],
    '8th': ['6th-8th'],
    'sixth': ['6th-8th'],
    'seventh': ['6th-8th'],
    'eighth': ['6th-8th'],
    '6th-8th': ['6th-8th'],
  }
  
  // Check if query matches any grade search term
  for (const [searchTerm, gradeLabels] of Object.entries(gradeSearchMap)) {
    if (normalizedQuery.includes(searchTerm) || searchTerm.includes(normalizedQuery)) {
      // Check if item's gradeLabel contains any of the matching grade labels
      if (gradeLabels.some(label => gradeLabelLower.includes(label.toLowerCase()))) {
        return true
      }
    }
  }
  
  // Also check against INTERACTIVE_GRADE_OPTIONS directly
  for (const gradeOption of INTERACTIVE_GRADE_OPTIONS) {
    // Normalize grade option label (replace en dash with hyphen)
    const gradeLabelLowerOption = gradeOption.label.toLowerCase().replace(/[–—]/g, '-')
    const gradeIdLower = gradeOption.id.toLowerCase()
    // Check if query matches grade option label or ID
    if (normalizedQuery.includes(gradeLabelLowerOption) || 
        gradeLabelLowerOption.includes(normalizedQuery) ||
        normalizedQuery.includes(gradeIdLower) ||
        gradeIdLower.includes(normalizedQuery)) {
      // Check if item's gradeLabel contains this grade
      if (gradeLabelLower.includes(gradeLabelLowerOption)) {
        return true
      }
    }
  }
  
  // Search in category name variations
  const categoryVariations: Record<string, string[]> = {
    'math': ['mathematics', 'arithmetic', 'numbers', 'calculation'],
    'reading': ['read', 'comprehension', 'literacy', 'books', 'stories'],
    'writing': ['write', 'essay', 'composition', 'creative'],
    'science': ['scientific', 'experiment', 'biology', 'chemistry', 'physics'],
    'social studies': ['geography', 'history', 'culture', 'social'],
    'grammar': ['language', 'vocabulary', 'words', 'english'],
    'art': ['drawing', 'coloring', 'creative', 'design'],
    'early learning': ['early', 'preschool', 'toddler', 'beginner'],
    'critical thinking': ['logic', 'puzzle', 'problem solving', 'reasoning'],
    'social emotional': ['sel', 'emotions', 'feelings', 'mindfulness', 'empathy'],
  }
  
  // Check if query matches any category variation
  for (const [categoryId, variations] of Object.entries(categoryVariations)) {
    // Check if query matches any variation
    if (variations.some(v => query.includes(v) || v.includes(query))) {
      if (item.categoryId.toLowerCase().includes(categoryId.toLowerCase()) || 
          item.categoryLabel.toLowerCase().includes(categoryId.toLowerCase())) {
        return true
      }
    }
  }
  
  // Search in focus tags
  if (item.focus.some((tag) => tag.toLowerCase().includes(query))) return true
  
  return false
}

const todayIso = new Date().toISOString().slice(0, 10)

function parseInitialFilters(): FiltersState {
  try {
    const params = new URLSearchParams(window.location.search)
    const gradeParam = params.get('grade') as GradeBand | null
      const validGrade = INTERACTIVE_GRADE_OPTIONS.some((g) => g.id === gradeParam) ? gradeParam! : DEFAULT_GRADE
    const categoriesParam = params.get('categories')
      let selectedCategories: string[] = []
    if (categoriesParam) {
      // Parse and normalize categories from URL
      const rawCategories = categoriesParam.split(',').map((c) => c.trim()).filter(Boolean)
      selectedCategories = normalizeCategoryIds(rawCategories)
    }
    // If no valid categories found in URL, use defaults
    if (selectedCategories.length === 0) {
        selectedCategories = DEFAULT_NORMALIZED_CATEGORIES.slice()
    }
    // Always start with variant 1 for SEO - variant is internal only, not in URL
    const variant = 1
    // Generate unique timestamp on initial load for unique content
    const generateTimestamp = Date.now() + Math.floor(Math.random() * 1000)
    return {
      grade: validGrade,
        categories: selectedCategories.slice(),
      variant,
      _timestamp: Date.now(), // Initialize with timestamp
      _generateTimestamp: generateTimestamp // Generate unique timestamp for initial load
    }
  } catch {
    const generateTimestamp = Date.now() + Math.floor(Math.random() * 1000)
    return {
      grade: DEFAULT_GRADE,
      categories: DEFAULT_NORMALIZED_CATEGORIES.slice(),
      variant: 1,
      _timestamp: Date.now(), // Initialize with timestamp
      _generateTimestamp: generateTimestamp, // Generate unique timestamp for initial load
    }
  }
}

function updateUrl(filters: FiltersState) {
  const params = new URLSearchParams()
  params.set('grade', filters.grade)
  const categories = normalizeCategoryIds(filters.categories)
  if (categories.length) {
    params.set('categories', categories.join(','))
  }
  const queryString = params.toString()
  const newUrl = queryString ? `/interactive-worksheets-generator?${queryString}` : '/interactive-worksheets-generator'
  window.history.replaceState({}, '', newUrl)
}

function GradeToggle({
  active,
  label,
  onSelect,
}: {
  active: boolean
  label: string
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors border ${
        active
          ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
          : 'text-slate-600 border-slate-200 hover:border-purple-300 hover:text-purple-700'
      }`}
    >
      {label}
    </button>
  )
}

function CategoryToggle({
  active,
  icon,
  label,
  onToggle,
}: {
  active: boolean
  icon: string
  label: string
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`flex items-center gap-2 w-full rounded-xl border px-3 py-2 text-left transition-colors ${
        active
          ? 'border-purple-500 bg-purple-50 text-purple-700'
          : 'border-slate-200 hover:border-purple-300 hover:bg-purple-50/60 text-slate-600'
      }`}
    >
      <span className="text-lg">{icon}</span>
      <span className="font-medium">{label}</span>
    </button>
  )
}

function WorksheetPreviewCard({ 
  item, 
  onToggleFavorite, 
  isFavorite,
  onPreview,
  onDownload,
  pack,
  filters,
}: { 
  item: InteractiveWorksheetItem
  onToggleFavorite: (item: InteractiveWorksheetItem) => void
  isFavorite: boolean
  onPreview: (item: InteractiveWorksheetItem) => void
  onDownload: (docId: string) => string
  pack: InteractiveWorksheetPack | null
  filters: FiltersState
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-all duration-200 p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1">
          <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">{item.categoryLabel}</p>
          <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center rounded-full border border-purple-100 bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700">
            {item.difficulty}
          </span>
          <button
            onClick={() => onToggleFavorite(item)}
            className={`p-2 rounded-full transition-colors ${
              isFavorite 
                ? 'text-yellow-500 hover:text-yellow-600' 
                : 'text-slate-400 hover:text-yellow-500'
            }`}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <svg className="w-5 h-5" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </button>
        </div>
      </div>
      
      <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>
      
      {/* Worksheet Thumbnail Preview */}
      {pack && pack.seed ? (
        <div 
          className="relative w-full bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg border border-slate-200 overflow-hidden cursor-pointer group shadow-sm hover:shadow-md transition-shadow"
          onClick={() => onPreview(item)}
          style={{ 
            height: '140px',
            aspectRatio: '2.5/1',
          }}
        >
          {/* Thumbnail content container */}
          <div className="absolute inset-0 p-3 overflow-hidden">
            <div 
              className="bg-white rounded shadow-sm"
              style={{
                transform: 'scale(0.25)',
                transformOrigin: 'top left',
                width: '400%',
                height: 'auto',
                minHeight: '400%',
                pointerEvents: 'none',
              }}
            >
              <div className="bg-white p-4" style={{ width: '100%' }}>
                <InteractiveBundleSections
                  docIds={[item.docId]}
                  seed={pack.seed}
                  variant={filters.variant}
                  showAnswers={false}
                />
              </div>
            </div>
          </div>
          {/* Gradient fade at bottom */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-50 pointer-events-none" />
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center pointer-events-none">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg text-xs font-semibold text-purple-700 border-2 border-purple-300 shadow-lg pointer-events-auto">
              👁️ Click to preview full worksheet
            </div>
          </div>
          {/* Corner fold effect */}
          <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-br from-slate-200/50 to-transparent pointer-events-none" />
        </div>
      ) : (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 flex items-center justify-center" style={{ height: '140px' }}>
          <p className="text-xs text-slate-400">Preview will appear after generation</p>
        </div>
      )}
      
      {item.focus.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {item.focus.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span>{item.gradeLabel}</span>
          <span>Answer key included</span>
        </div>
        <div className="flex items-center gap-2">
          {pack?.printUrl && (
            <a
              href={onDownload(item.docId)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-purple-600 hover:text-purple-700 px-3 py-1 rounded-full border border-purple-200 hover:border-purple-300 transition-colors"
            >
              ⬇️ Download
            </a>
          )}
          <button
            onClick={() => onPreview(item)}
            className="text-xs font-medium text-purple-600 hover:text-purple-700 px-3 py-1 rounded-full border border-purple-200 hover:border-purple-300 transition-colors"
          >
            👁️ Preview
          </button>
        </div>
      </div>
    </article>
  )
}

const FAQ_ITEMS = [
  {
    question: 'Are these interactive worksheets really free?',
    answer:
      'Yes. Every interactive worksheet pack on Wizqo is 100% free to generate and download as a PDF. No account or credit card required.',
  },
  {
    question: 'How do I get a fresh set every day?',
    answer:
      'The generator uses a daily seed so each calendar day unlocks a unique combination. Click “Regenerate” for additional variants if you need more than one set.',
  },
  {
    question: 'Can I choose the grade level and subjects?',
    answer:
      'Absolutely. Use the filter sidebar to pick a grade band plus up to ten in-demand categories like Math, Reading, Science, SEL, and Early Learning.',
  },
  {
    question: 'Do the printable PDFs include answer keys?',
    answer:
      'Yes. Every interactive worksheet bundle includes a printable answer appendix so you can check work quickly or send home with families.',
  },
  {
    question: 'May I use these interactive worksheets in my classroom?',
    answer:
      'Teachers, tutors, homeschoolers, and therapists can freely use and print these resources for students. We just ask that you keep the Wizqo footer credit intact.',
  },
]

const FAQ_SCRIPT_ID = 'interactive-worksheets-faq-schema'

function useFaqSchema() {
  React.useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQ_ITEMS.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    }

    const existing = document.getElementById(FAQ_SCRIPT_ID)
    if (existing) {
      existing.textContent = JSON.stringify(schema)
      return
    }

    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.id = FAQ_SCRIPT_ID
    script.textContent = JSON.stringify(schema)
    document.head.appendChild(script)

    return () => {
      try {
        document.head.removeChild(script)
      } catch {}
    }
  }, [])
}

export function InteractiveWorksheetsPage() {
  const [filters, setFilters] = React.useState<FiltersState>(() => parseInitialFilters())
  const [pack, setPack] = React.useState<InteractiveWorksheetPack | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const abortControllerRef = React.useRef<AbortController | null>(null)
  const lastDocKeyRef = React.useRef<string | null>(null)
  const duplicateAttemptsRef = React.useRef<number>(0)
  
  // New feature states
  const [searchQuery, setSearchQuery] = React.useState('')
  const [favorites, setFavorites] = React.useState<FavoriteWorksheet[]>(() => loadFavorites())
  const [previewItem, setPreviewItem] = React.useState<InteractiveWorksheetItem | null>(null)
  const [showCustomization, setShowCustomization] = React.useState(false)
  const [customization, setCustomization] = React.useState<CustomizationData>(() => loadCustomization())
  const [showFavorites, setShowFavorites] = React.useState(false)

  const resetDuplicateTracking = React.useCallback(() => {
    duplicateAttemptsRef.current = 0
    lastDocKeyRef.current = null
  }, [])

  // Helper function to detect if search query matches a category
  const getCategoriesFromSearch = React.useCallback((query: string): string[] => {
    if (!query.trim()) return []
    const queryLower = query.toLowerCase().trim()
    const matchedCategories: string[] = []
    
    // Check all categories from INTERACTIVE_CATEGORIES
    for (const category of INTERACTIVE_CATEGORIES) {
      const categoryIdLower = category.id.toLowerCase()
      const categoryLabelLower = category.label.toLowerCase()
      
      // Check if query matches category ID or label (exact or partial)
      if (queryLower === categoryIdLower || 
          queryLower === categoryLabelLower ||
          queryLower.includes(categoryIdLower) || 
          categoryIdLower.includes(queryLower) ||
          queryLower.includes(categoryLabelLower) || 
          categoryLabelLower.includes(queryLower)) {
        matchedCategories.push(category.id)
      }
    }
    
    return matchedCategories
  }, [])

  useFaqSchema()

  const loadPack = React.useCallback(async (currentFilters: FiltersState) => {
    // Cancel any in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    
    // Create new abort controller for this request
    const abortController = new AbortController()
    abortControllerRef.current = abortController
      
      try {
        setLoading(true)
        setError(null)

        const params = new URLSearchParams()
        params.set('date', todayIso)
        params.set('grade', currentFilters.grade)

        // Get effective categories (selected + searched)
        const searchCategories = getCategoriesFromSearch(searchQuery)
        const categoriesToSend = [...new Set([...currentFilters.categories, ...searchCategories])]
        const finalCategories = categoriesToSend.length > 0 ? categoriesToSend : DEFAULT_NORMALIZED_CATEGORIES
        params.set('categories', finalCategories.join(','))
        params.set('variant', String(currentFilters.variant))

        const timestamp = currentFilters._generateTimestamp || (Date.now() + Math.floor(Math.random() * 1000))
        params.set('timestamp', String(timestamp))
        params.set('_t', String(Date.now()))

        const apiUrl = `/api/interactive-worksheets?${params.toString()}`
        const resp = await fetch(apiUrl, {
          cache: 'no-store',
          signal: abortController.signal,
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            Pragma: 'no-cache',
          },
        })

        if (!resp.ok) {
          const errorText = await resp.text()
          throw new Error(`Failed to generate worksheets: ${resp.status} ${errorText}`)
        }

        const json = await resp.json()
        if (json?.data) {
          const items: InteractiveWorksheetItem[] = Array.isArray(json.data?.items)
            ? json.data.items
            : []
          const docKey =
            items.length > 0
              ? items
                  .map((item) => item.docId)
                  .slice()
                  .sort()
                  .join('|')
              : ''

          if (
            docKey &&
            docKey === lastDocKeyRef.current &&
            duplicateAttemptsRef.current < MAX_DUPLICATE_ATTEMPTS
          ) {
            duplicateAttemptsRef.current += 1
            setFilters((prev) => {
              const nextVariant = prev.variant + 1
              const nextGenerateTimestamp = Date.now() + Math.floor(Math.random() * 1000)
              return {
                ...prev,
                variant: nextVariant,
                _timestamp: Date.now(),
                _generateTimestamp: nextGenerateTimestamp,
              }
            })
            return
          }

          duplicateAttemptsRef.current = 0
          lastDocKeyRef.current = docKey || null
          setPack(json.data)
        } else {
          throw new Error('Invalid response format from server')
        }
    } catch (err: any) {
      // Don't set error if request was aborted (user changed filters)
      if (err.name === 'AbortError') {
        return
      }
      setError(err?.message || 'Something went wrong while generating worksheets.')
      setPack(null) // Clear pack on error
    } finally {
      // Only update loading state if this is still the current request
      if (!abortController.signal.aborted) {
        setLoading(false)
      }
    }
  }, [searchQuery, getCategoriesFromSearch])

  // Sync filters with URL parameters when URL changes (e.g., browser back/forward)
  // Note: Only syncs user-facing filters (grade, categories), not internal ones (variant, timestamp)
  React.useEffect(() => {
    const handlePopState = () => {
      const newFilters = parseInitialFilters()
      // Only update if filters actually changed to avoid infinite loops
      setFilters((prev) => {
        if (
          prev.grade !== newFilters.grade ||
          prev.categories.join(',') !== newFilters.categories.join(',')
        ) {
          return newFilters
        }
        return prev
      })
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  // Memoize categories string to prevent unnecessary re-renders
  const categoriesKey = React.useMemo(() => filters.categories.join(','), [filters.categories])
  const hasCustomCategories = categoriesKey !== DEFAULT_CATEGORIES_KEY

  React.useEffect(() => {
    updateUrl(filters)
    loadPack(filters)
  }, [filters.grade, categoriesKey, filters.variant, filters._generateTimestamp, searchQuery, loadPack, getCategoriesFromSearch])

  const toggleCategory = (id: string) => {
    resetDuplicateTracking()
    setFilters((prev) => {
      const exists = prev.categories.includes(id)
      let nextCategories: string[]
      if (exists) {
        nextCategories = prev.categories.filter((c) => c !== id)
      } else {
        nextCategories = normalizeCategoryIds([...prev.categories, id])
      }
      if (nextCategories.length === 0) nextCategories = [id]
      // Reset variant to 1 when categories change and generate new unique timestamp
      const generateTimestamp = Date.now() + Math.floor(Math.random() * 1000)
      return { 
        ...prev, 
        categories: normalizeCategoryIds(nextCategories), 
        variant: 1,
        _timestamp: Date.now(), // Force React to detect change
        _generateTimestamp: generateTimestamp // Generate unique timestamp for new selection
      }
    })
  }

    const resetCategories = React.useCallback(() => {
      resetDuplicateTracking()
      setFilters((prev) => {
        if (prev.categories.join(',') === DEFAULT_CATEGORIES_KEY) return prev
        const generateTimestamp = Date.now() + Math.floor(Math.random() * 1000)
        return {
          ...prev,
          categories: DEFAULT_NORMALIZED_CATEGORIES.slice(),
          variant: 1,
          _timestamp: Date.now(),
          _generateTimestamp: generateTimestamp,
        }
      })
    }, [resetDuplicateTracking])

  const setGrade = (grade: GradeBand) => {
    resetDuplicateTracking()
    setFilters((prev) => {
      // Generate unique timestamp when grade changes for unique content
      const generateTimestamp = Date.now() + Math.floor(Math.random() * 1000)
      return { 
        ...prev, 
        grade, 
        variant: 1,
        _timestamp: Date.now(), // Force React to detect change
        _generateTimestamp: generateTimestamp // Generate unique timestamp for new selection
      }
    })
  }

  // Social sharing handler
  const handleShare = React.useCallback((platform: 'facebook' | 'twitter' | 'pinterest' | 'copy') => {
    if (typeof window === 'undefined') return
    
    const url = window.location.href
    const title = 'Free Interactive Worksheets Generator'
    const text = 'Unlimited unique printable PDFs with answer keys!'
    const description = 'Free Interactive Worksheets Generator - Unlimited unique printable PDFs with answer keys!'

    switch (platform) {
      case 'facebook':
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
          'facebook-share',
          'width=600,height=400'
        )
        break
      case 'twitter':
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
          'twitter-share',
          'width=600,height=400'
        )
        break
      case 'pinterest':
        window.open(
          `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(description)}`,
          'pinterest-share',
          'width=600,height=400'
        )
        break
      case 'copy':
        if (navigator.share) {
          navigator.share({
            title,
            text,
            url,
          }).catch(() => {
            // Fallback to clipboard
            navigator.clipboard.writeText(url).then(() => {
              alert('Link copied to clipboard!')
            }).catch(() => {
              alert('Unable to copy link. Please copy manually: ' + url)
            })
          })
        } else if (navigator.clipboard) {
          navigator.clipboard.writeText(url).then(() => {
            alert('Link copied to clipboard!')
          }).catch(() => {
            // Fallback for older browsers
            const textArea = document.createElement('textarea')
            textArea.value = url
            textArea.style.position = 'fixed'
            textArea.style.opacity = '0'
            document.body.appendChild(textArea)
            textArea.select()
            try {
              document.execCommand('copy')
              alert('Link copied to clipboard!')
            } catch (err) {
              alert('Unable to copy link. Please copy manually: ' + url)
            }
            document.body.removeChild(textArea)
          })
        } else {
          alert('Please copy this link: ' + url)
        }
        break
    }
  }, [])

  // Generate new unique pack with current filters (increment variant for unlimited unique generations)
  const generateTodayPack = React.useCallback(() => {
    resetDuplicateTracking()
    setFilters((prev) => {
      const newVariant = prev.variant + 1
      // Use high-precision timestamp + random component + variant for guaranteed uniqueness
      // This ensures every click generates a completely unique set
      const now = Date.now()
      const randomOffset = Math.floor(Math.random() * 1000000) // Larger random range
      const variantOffset = newVariant * 1000000 // Variant contributes significantly
      const generateTimestamp = now + randomOffset + variantOffset
      
      return { 
        ...prev, 
        variant: newVariant,
        _timestamp: now, // Force React to detect change
        _generateTimestamp: generateTimestamp // Unique timestamp for seed generation - ensures unlimited unique sets
      }
    })
  }, [resetDuplicateTracking])

  // Regenerate with next variant for unique pack (for different groups/tubs)
  const regenerate = React.useCallback(() => {
    resetDuplicateTracking()
    setFilters((prev) => {
      const newVariant = prev.variant + 1
      // Use Date.now() + small random component for guaranteed uniqueness
      const generateTimestamp = Date.now() + Math.floor(Math.random() * 1000)
      // Force state update by creating new object with timestamp
      return { 
        ...prev, 
        variant: newVariant,
        _timestamp: Date.now(), // Force React to detect change
        _generateTimestamp: generateTimestamp // Unique timestamp for seed generation
      }
    })
  }, [resetDuplicateTracking])

  const selectedCategorySet = new Set(filters.categories)

  // Favorites handlers
  const toggleFavorite = React.useCallback((item: InteractiveWorksheetItem) => {
    setFavorites((prev) => {
      const exists = prev.some((fav) => fav.docId === item.docId)
      let next: FavoriteWorksheet[]
      if (exists) {
        next = prev.filter((fav) => fav.docId !== item.docId)
      } else {
        next = [
          ...prev,
          {
            docId: item.docId,
            title: item.title,
            categoryLabel: item.categoryLabel,
            gradeLabel: item.gradeLabel,
            addedAt: Date.now(),
          },
        ]
      }
      saveFavorites(next)
      return next
    })
  }, [])

  const isFavorite = React.useCallback(
    (docId: string) => favorites.some((fav) => fav.docId === docId),
    [favorites]
  )

  // Preview handler
  const handlePreview = React.useCallback((item: InteractiveWorksheetItem) => {
    setPreviewItem(item)
  }, [])

  // Customization handlers
  const handleCustomizationChange = React.useCallback((field: keyof CustomizationData, value: string | string[]) => {
    setCustomization((prev) => {
      const next = { ...prev, [field]: value }
      saveCustomization(next)
      return next
    })
  }, [])

  const addStudentName = React.useCallback(() => {
    handleCustomizationChange('studentNames', [...customization.studentNames, ''])
  }, [customization.studentNames, handleCustomizationChange])

  const removeStudentName = React.useCallback(
    (index: number) => {
      handleCustomizationChange(
        'studentNames',
        customization.studentNames.filter((_, i) => i !== index)
      )
    },
    [customization.studentNames, handleCustomizationChange]
  )

  // Filter worksheets by search query
  const filteredItems = React.useMemo(() => {
    if (!pack) return []
    // If there's a search query, filter the pack items
    if (searchQuery.trim()) {
      return pack.items.filter((item) => matchesSearch(item, searchQuery))
    }
    // Otherwise return all pack items
    return pack.items
  }, [pack, searchQuery])

  // Get the count of worksheets that will be downloaded (based on selected categories)
  const downloadSheetCount = React.useMemo(() => {
    if (!pack) return 0
    // Count should match the number of selected categories (one worksheet per category)
    // Use filters.categories.length to show what user selected, not pack.items.length
    return filters.categories.length > 0 ? filters.categories.length : pack.items.length
  }, [pack, filters.categories])

  // Generate print URL with customization
  const getPrintUrl = React.useCallback(() => {
    if (!pack?.printUrl) return ''
    const url = new URL(pack.printUrl, window.location.origin)
    if (customization.teacherName) url.searchParams.set('teacher', customization.teacherName)
    if (customization.className) url.searchParams.set('class', customization.className)
    if (customization.studentNames.length > 0) {
      url.searchParams.set('students', customization.studentNames.join(','))
    }
    return url.toString()
  }, [pack, customization])

  // Generate print URL for a single worksheet
  const getSingleWorksheetPrintUrl = React.useCallback((docId: string) => {
    if (!pack?.printUrl) return ''
    const url = new URL(pack.printUrl, window.location.origin)
    // Replace items parameter to show only this single worksheet
    url.searchParams.set('items', docId)
    if (customization.teacherName) url.searchParams.set('teacher', customization.teacherName)
    if (customization.className) url.searchParams.set('class', customization.className)
    if (customization.studentNames.length > 0) {
      url.searchParams.set('students', customization.studentNames.join(','))
    }
    return url.toString()
  }, [pack, customization])

  return (
    <div className="min-h-screen bg-slate-50">
      <SEOMetaTags
        title="Interactive Worksheets Generator | Free Printable PDF Activities"
        description="Generate interactive worksheets for math, reading, science, SEL, and more. Free printable PDFs with daily refresh and answer keys for every grade."
        canonicalUrl="https://wizqo.com/interactive-worksheets-generator"
        keywords="interactive worksheets, free worksheets pdf, interactive math worksheets, interactive reading worksheets, printable interactive worksheets"
      />
      <UnifiedNavigation currentPage="interactive-worksheets" />
      <main className="bg-gradient-to-b from-purple-50/70 via-white to-white">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-100/60 via-white to-emerald-50/50" aria-hidden />
          <div className="relative mx-auto max-w-6xl px-4 pb-14 pt-16 sm:px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-center">
              <div className="space-y-6">
                <span className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-white px-3 py-1 text-sm font-medium text-purple-700 shadow-sm">
                  ✨ Free interactive worksheets • New every day
                </span>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                  <Shuffle 
                    text="Interactive Worksheets Generator"
                    tag="span"
                    className="block"
                    textAlign="left"
                    duration={0.4}
                    stagger={0.02}
                    shuffleDirection="right"
                    scrambleCharset="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
                    triggerOnce={true}
                    threshold={0.2}
                  />
                  <span className="block text-purple-600">Free printable PDFs tailored to your class.</span>
                </h1>
                <p className="max-w-2xl text-lg text-slate-600 leading-relaxed">
                  Choose a grade band, mix and match in-demand categories, and get a fresh set of interactive worksheets with answer keys. Math, reading, SEL, science, and more—ready to print or share in seconds.
                </p>
                <p className="max-w-2xl text-sm text-slate-500">
                  Need screen-free brain breaks too? Explore the playful activities inside our <a href="/kids" className="text-purple-600 hover:text-purple-700 underline underline-offset-2">Kids Hub</a> or build multi-day plans with grade-level packs like the <a href="/worksheets/1st-grade-math-worksheets" className="text-purple-600 hover:text-purple-700 underline underline-offset-2">1st Grade Math Worksheets collection</a>.
                </p>
                <div className="mt-6 space-y-4">
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={generateTodayPack}
                      className="inline-flex items-center gap-2 rounded-full bg-purple-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-purple-600/20 transition hover:bg-purple-700"
                    >
                      🔄 Generate new unique pack
                    </button>
                    <button
                      onClick={() => setShowCustomization(true)}
                      className="inline-flex items-center gap-2 rounded-full border border-purple-300 bg-purple-50 px-5 py-2 text-sm font-semibold text-purple-700 hover:bg-purple-100 transition"
                    >
                      ✏️ Customize
                    </button>
                    <button
                      onClick={() => setShowFavorites(true)}
                      className="inline-flex items-center gap-2 rounded-full border border-yellow-300 bg-yellow-50 px-5 py-2 text-sm font-semibold text-yellow-700 hover:bg-yellow-100 transition"
                    >
                      ⭐ Favorites ({favorites.length})
                    </button>
                    {pack?.printUrl && (
                      <>
                        <a
                          href={getPrintUrl()}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-2 text-sm font-semibold text-slate-700 hover:border-purple-400 hover:text-purple-700"
                        >
                          📦 Bulk Download free PDF ({downloadSheetCount} {downloadSheetCount === 1 ? 'sheet' : 'sheets'})
                        </a>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500">Share:</span>
                          <button
                            onClick={() => handleShare('facebook')}
                            className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                            aria-label="Share on Facebook"
                            title="Share on Facebook"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                            </svg>
                          </button>
                          <button
                            onClick={() => handleShare('twitter')}
                            className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-sky-500 text-white hover:bg-sky-600 transition-colors"
                            aria-label="Share on Twitter"
                            title="Share on Twitter"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                            </svg>
                          </button>
                          <button
                            onClick={() => handleShare('pinterest')}
                            className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors"
                            aria-label="Share on Pinterest"
                            title="Share on Pinterest"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.487.535 6.624 0 11.99-5.367 11.99-11.988C23.97 5.39 18.565.026 11.985.026L12.017 0z"/>
                            </svg>
                          </button>
                          <button
                            onClick={() => handleShare('copy')}
                            className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-slate-600 text-white hover:bg-slate-700 transition-colors"
                            aria-label="Copy link or share"
                            title="Copy link"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                            </svg>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                  <ul className="grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                    <li className="flex items-start gap-2">
                      <span className="mt-1 text-purple-500">✔</span>
                      Free interactive worksheets with printable answer keys
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 text-purple-500">✔</span>
                      Unlimited unique generations—click again for a completely new set
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 text-purple-500">✔</span>
                      10 high-demand categories across math, literacy, SEL, STEM
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 text-purple-500">✔</span>
                      One-click PDF download or shareable link for families
                    </li>
                  </ul>
                </div>
              </div>
              <div className="rounded-3xl border border-purple-200 bg-white/70 p-6 shadow-xl shadow-purple-100 backdrop-blur">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Filters at a glance</h2>
                <dl className="space-y-3 text-sm text-slate-600">
                  <div className="flex items-center justify-between">
                    <dt>Grade band</dt>
                    <dd className="font-medium text-slate-900">{INTERACTIVE_GRADE_OPTIONS.find((g) => g.id === filters.grade)?.label || 'K–1'}</dd>
                  </div>
                  <div>
                    <dt className="mb-2">Categories selected</dt>
                    <dd className="flex flex-wrap gap-2">
                      {filters.categories.map((id) => {
                        const cat = INTERACTIVE_CATEGORIES.find((c) => c.id === id)
                        return (
                          <span key={id} className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2 py-0.5 text-xs text-purple-700">
                            {cat?.icon}
                            {cat?.label || id}
                          </span>
                        )
                      })}
                    </dd>
                  </div>
                </dl>
                <p className="mt-4 rounded-xl bg-purple-50 px-3 py-2 text-xs text-purple-700">
                  💡 Tip: Click "Generate new unique pack" as many times as you want! Each click creates a completely unique set based on your grade and category filters. Perfect for multiple groups, daily practice, or unlimited variety!
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-8 px-4 pb-16 sm:px-6 lg:grid-cols-[320px_minmax(0,1fr)] lg:px-8">
          <aside className="space-y-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">1. Pick a grade band</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {INTERACTIVE_GRADE_OPTIONS.map((opt) => (
                  <GradeToggle
                    key={opt.id}
                    label={opt.label}
                    active={filters.grade === opt.id}
                    onSelect={() => setGrade(opt.id as GradeBand)}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">2. Choose categories</h3>
                {hasCustomCategories && (
                  <button
                    type="button"
                    onClick={resetCategories}
                    className="text-xs font-semibold text-purple-600 hover:text-purple-700"
                  >
                    Clear
                  </button>
                )}
              </div>
              <p className="text-xs text-slate-500">Select as many as you like—each pack pulls one unique worksheet per category.</p>
              <div className="grid gap-2">
                {INTERACTIVE_CATEGORIES.map((cat) => (
                  <CategoryToggle
                    key={cat.id}
                    icon={cat.icon}
                    label={cat.label}
                    active={selectedCategorySet.has(cat.id)}
                    onToggle={() => toggleCategory(cat.id)}
                  />
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-purple-50 p-4 text-sm text-purple-800">
              <p className="font-semibold">Pro tip</p>
              <p>
                Generate unlimited unique sets! Each time you click "Generate new unique pack", you'll get a completely different set of worksheets based on your selected grade and categories. Perfect for multiple groups, daily practice, or when you need variety!
              </p>
            </div>
          </aside>

          <section className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-xl font-semibold text-slate-900">Today’s interactive worksheets</h2>
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600">
                {loading ? 'Generating…' : `${searchQuery ? filteredItems.length : pack?.items.length || 0}${searchQuery && pack ? ` of ${pack.items.length}` : ''} worksheets ready`}
              </span>
            </div>
            
            {/* Search Bar */}
            {pack && pack.items.length > 0 && (
              <div className="flex justify-end">
                <div className="relative w-full max-w-md">
                  <input
                    type="text"
                    placeholder="🔍 Search worksheets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-full border border-slate-300 bg-white px-4 py-2 pl-10 text-sm text-slate-900 placeholder-slate-400 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200 shadow-sm"
                  />
                  <svg
                    className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      aria-label="Clear search"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            {!error && !loading && pack && pack.items.length === 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-slate-600">
                No worksheets match those filters yet. Try selecting additional categories.
              </div>
            )}

            {!error && !loading && pack && pack.items.length > 0 && (
              <>
                {filteredItems.length === 0 ? (
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-slate-600">
                    No worksheets match your search query "{searchQuery}". Try a different search term.
                  </div>
                ) : (
                  <>
                    <div className="grid gap-5 md:grid-cols-2">
                      {filteredItems.map((item) => (
                        <WorksheetPreviewCard 
                          key={item.docId} 
                          item={item}
                          onToggleFavorite={toggleFavorite}
                          isFavorite={isFavorite(item.docId)}
                          onPreview={handlePreview}
                          onDownload={getSingleWorksheetPrintUrl}
                          pack={pack}
                          filters={filters}
                        />
                      ))}
                    </div>

                    <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6">
                      <h3 className="text-lg font-semibold text-emerald-900">Answer key ready to go</h3>
                      <p className="mt-2 text-sm text-emerald-800">
                        Downloading the PDF automatically adds a printable answer appendix summarizing every interactive worksheet in this pack. Perfect for quick grading or take-home review.
                      </p>
                    </div>
                  </>
                )}
              </>
            )}
          </section>
        </section>

        <section className="bg-slate-900 py-16 text-slate-100">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-3xl font-semibold">Teachers are loving Wizqo’s interactive worksheets</h2>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              <blockquote className="rounded-3xl border border-white/10 bg-white/5 p-5 text-left">
                <p className="text-sm text-slate-100">
                  “I used the free interactive worksheets generator for my grade 3 math block—each group got a different PDF with quick answer keys. No repeats all week!”
                </p>
                <footer className="mt-3 text-xs uppercase tracking-wide text-purple-200">Mia • 3rd Grade Teacher</footer>
              </blockquote>
              <blockquote className="rounded-3xl border border-white/10 bg-white/5 p-5 text-left">
                <p className="text-sm text-slate-100">
                  “The SEL and reading comprehension sets are gold. I love that the generator is totally free and prints with answers.”
                </p>
                <footer className="mt-3 text-xs uppercase tracking-wide text-purple-200">Jordan • Literacy Coach</footer>
              </blockquote>
            </div>
          </div>
        </section>

        <section className="bg-white py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-semibold text-slate-900">Interactive worksheets FAQs</h2>
            <dl className="mt-6 space-y-6">
              {FAQ_ITEMS.map((item) => (
                <div key={item.question} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <dt className="font-semibold text-slate-900">{item.question}</dt>
                  <dd className="mt-2 text-sm text-slate-600">{item.answer}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="bg-slate-50 py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">Related Resources</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <a
                href="/worksheets/1st-grade-math-worksheets"
                className="rounded-2xl border border-slate-200 bg-white p-6 hover:border-purple-300 hover:shadow-md transition-all"
              >
                <h3 className="text-lg font-semibold text-slate-900 mb-2">1st Grade Math Worksheets</h3>
                <p className="text-sm text-slate-600">
                  Free printable math worksheets covering number sense, addition/subtraction, ten-frames, and shapes.
                </p>
              </a>
              <a
                href="/worksheets/2nd-grade-math-worksheets"
                className="rounded-2xl border border-slate-200 bg-white p-6 hover:border-purple-300 hover:shadow-md transition-all"
              >
                <h3 className="text-lg font-semibold text-slate-900 mb-2">2nd Grade Math Worksheets</h3>
                <p className="text-sm text-slate-600">
                  Place value, addition/subtraction within 100, skip counting, and more grade 2 math practice.
                </p>
              </a>
              <a
                href="/worksheets/handwriting-worksheet-maker"
                className="rounded-2xl border border-slate-200 bg-white p-6 hover:border-purple-300 hover:shadow-md transition-all"
              >
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Handwriting Worksheet Maker</h3>
                <p className="text-sm text-slate-600">
                  Create custom handwriting practice sheets with tracing letters, words, and sentences.
                </p>
              </a>
              <a
                href="/worksheets/reading-comprehension"
                className="rounded-2xl border border-slate-200 bg-white p-6 hover:border-purple-300 hover:shadow-md transition-all"
              >
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Reading Comprehension Worksheets</h3>
                <p className="text-sm text-slate-600">
                  Free printable reading comprehension worksheets with passages and questions for grades 1-3.
                </p>
              </a>
              <a
                href="/printables/name-tracing-generator"
                className="rounded-2xl border border-slate-200 bg-white p-6 hover:border-purple-300 hover:shadow-md transition-all"
              >
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Name Tracing Generator</h3>
                <p className="text-sm text-slate-600">
                  Generate personalized name tracing worksheets with dotted letters and friendly guidelines.
                </p>
              </a>
              <a
                href="/printables"
                className="rounded-2xl border border-slate-200 bg-white p-6 hover:border-purple-300 hover:shadow-md transition-all"
              >
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Free Printables Hub</h3>
                <p className="text-sm text-slate-600">
                  Word searches, Sudoku, coloring pages, spot-the-difference games, and more printable activities.
                </p>
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      
      {/* Preview Side Panel */}
      {previewItem && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 transition-opacity"
            onClick={() => setPreviewItem(null)}
          />
          
          {/* Side Panel */}
          <div className="absolute right-0 top-0 h-full w-full max-w-4xl bg-white shadow-2xl transform transition-transform duration-300 ease-in-out">
            <div className="flex h-full flex-col">
              {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-slate-900">{previewItem.title}</h2>
                  <p className="text-sm text-slate-600 mt-1">
                    {previewItem.description} • {previewItem.categoryLabel} • {previewItem.gradeLabel}
                  </p>
                </div>
                <button
                  onClick={() => setPreviewItem(null)}
                  className="ml-4 p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                  aria-label="Close preview"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto bg-slate-50">
                <div className="mx-auto max-w-3xl px-6 py-8">
                  {/* Print Layout Preview */}
                  <div className="bg-white shadow-lg rounded-lg p-8 print:shadow-none">
                    {pack && previewItem && (
                      <InteractiveBundleSections
                        docIds={[previewItem.docId]}
                        seed={pack.seed}
                        variant={filters.variant}
                        showAnswers={false}
                      />
                    )}
                  </div>
                  
                  {/* Info Footer */}
                  <div className="mt-6 rounded-xl border border-purple-200 bg-purple-50 p-4 text-sm text-purple-800">
                    <p className="font-semibold mb-2">📄 Print Preview</p>
                    <p>This is how the worksheet will appear when printed.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Customization Modal */}
      <Dialog open={showCustomization} onOpenChange={setShowCustomization}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Customize Worksheets</DialogTitle>
            <DialogDescription>
              Add student names, teacher name, and class name to personalize your worksheets before downloading.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 mt-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Teacher Name</label>
              <input
                type="text"
                value={customization.teacherName}
                onChange={(e) => handleCustomizationChange('teacherName', e.target.value)}
                placeholder="Enter teacher name"
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Class Name</label>
              <input
                type="text"
                value={customization.className}
                onChange={(e) => handleCustomizationChange('className', e.target.value)}
                placeholder="Enter class name (e.g., Grade 3A)"
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-slate-700">Student Names</label>
                <button
                  onClick={addStudentName}
                  className="text-sm font-medium text-purple-600 hover:text-purple-700"
                >
                  + Add Student
                </button>
              </div>
              {customization.studentNames.length === 0 ? (
                <p className="text-sm text-slate-500 italic">No students added yet. Click "Add Student" to add names.</p>
              ) : (
                <div className="space-y-2">
                  {customization.studentNames.map((name, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => {
                          const updated = [...customization.studentNames]
                          updated[index] = e.target.value
                          handleCustomizationChange('studentNames', updated)
                        }}
                        className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200"
                      />
                      <button
                        onClick={() => removeStudentName(index)}
                        className="p-2 text-red-600 hover:text-red-700 rounded-lg hover:bg-red-50"
                        aria-label="Remove student"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="rounded-xl bg-purple-50 p-4 text-sm text-purple-800">
              <p className="font-semibold mb-1">💡 Tip:</p>
              <p>Your customization will be included in your PDF download URL. You can add up to 30 student names.</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Favorites Modal */}
      <Dialog open={showFavorites} onOpenChange={setShowFavorites}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>My Favorite Worksheets</DialogTitle>
            <DialogDescription>
              {favorites.length === 0 
                ? 'You haven\'t saved any favorite worksheets yet. Click the star icon on any worksheet to add it to your favorites.'
                : `You have ${favorites.length} favorite worksheet${favorites.length === 1 ? '' : 's'}.`}
            </DialogDescription>
          </DialogHeader>
          {favorites.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              <p className="text-slate-600">Start favoriting worksheets to build your collection!</p>
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {favorites.map((fav) => (
                <div key={fav.docId} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex-1 cursor-pointer" onClick={() => {
                    // Generate URL for this favorite worksheet
                    const url = new URL(window.location.href)
                    url.searchParams.set('items', fav.docId)
                    window.location.href = url.toString()
                  }}>
                    <h3 className="font-semibold text-slate-900">{fav.title}</h3>
                    <div className="flex items-center gap-3 mt-1 text-sm text-slate-600">
                      <span>{fav.categoryLabel}</span>
                      <span>•</span>
                      <span>{fav.gradeLabel}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={getSingleWorksheetPrintUrl(fav.docId)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 text-sm font-medium text-purple-700 hover:text-purple-800 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Open
                    </a>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        // Remove favorite directly by docId without needing pack
                        setFavorites((prev) => {
                          const next = prev.filter((f) => f.docId !== fav.docId)
                          saveFavorites(next)
                          return next
                        })
                      }}
                      className="p-2 text-yellow-500 hover:text-yellow-600 rounded-lg hover:bg-yellow-50"
                      aria-label="Remove from favorites"
                    >
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default InteractiveWorksheetsPage
