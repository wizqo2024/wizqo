import React from 'react'
import { UnifiedNavigation } from '@/components/UnifiedNavigation'
import { Footer } from '@/components/Footer'
import { SEOMetaTags } from '@/components/SEOMetaTags'
import {
  INTERACTIVE_CATEGORIES,
  INTERACTIVE_GRADE_OPTIONS,
  type GradeBand,
} from '@shared/interactive/interactiveWorksheets'
import type {
  InteractiveWorksheetItem,
  InteractiveWorksheetPack,
} from '@shared/interactive/generator'

const DEFAULT_SELECTED_CATEGORIES = ['math', 'reading', 'writing', 'sel']

interface FiltersState {
  grade: GradeBand
  categories: string[]
  variant: number
}

const todayIso = new Date().toISOString().slice(0, 10)

function parseInitialFilters(): FiltersState {
  try {
    const params = new URLSearchParams(window.location.search)
    const gradeParam = params.get('grade') as GradeBand | null
    const validGrade = INTERACTIVE_GRADE_OPTIONS.some((g) => g.id === gradeParam) ? gradeParam! : 'k1'
    const categoriesParam = params.get('categories')
    const selectedCategories = categoriesParam
      ? categoriesParam
          .split(',')
          .map((c) => c.trim())
          .filter((c) => INTERACTIVE_CATEGORIES.some((cat) => cat.id === c))
      : []
    const variantParam = Number(params.get('variant') || '1')
    const variant = Number.isFinite(variantParam) && variantParam > 0 ? Math.floor(variantParam) : 1
    return {
      grade: validGrade,
      categories: selectedCategories.length ? selectedCategories : DEFAULT_SELECTED_CATEGORIES,
      variant,
    }
  } catch {
    return {
      grade: 'k1',
      categories: DEFAULT_SELECTED_CATEGORIES,
      variant: 1,
    }
  }
}

function updateUrl(filters: FiltersState) {
  const params = new URLSearchParams()
  params.set('grade', filters.grade)
  params.set('categories', filters.categories.join(','))
  params.set('variant', String(filters.variant))
  const newUrl = `/interactive-worksheets-generator?${params.toString()}`
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

function WorksheetPreviewCard({ item }: { item: InteractiveWorksheetItem }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-all duration-200 p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">{item.categoryLabel}</p>
          <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
        </div>
        <span className="inline-flex items-center rounded-full border border-purple-100 bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700">
          {item.difficulty}
        </span>
      </div>
      <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>
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
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>{item.gradeLabel}</span>
        <span>Answer key included</span>
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

  useFaqSchema()

  const loadPack = React.useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const params = new URLSearchParams()
      params.set('date', todayIso)
      params.set('grade', filters.grade)
      params.set('categories', filters.categories.join(','))
      params.set('variant', String(filters.variant))
      const resp = await fetch(`/api/interactive-worksheets?${params.toString()}`, { cache: 'no-store' })
      if (!resp.ok) throw new Error('Failed to generate worksheets')
      const json = await resp.json()
      setPack(json?.data || null)
    } catch (err: any) {
      setError(err?.message || 'Something went wrong while generating worksheets.')
    } finally {
      setLoading(false)
    }
  }, [filters])

  React.useEffect(() => {
    updateUrl(filters)
    loadPack()
  }, [filters, loadPack])

  const toggleCategory = (id: string) => {
    setFilters((prev) => {
      const exists = prev.categories.includes(id)
      let nextCategories: string[]
      if (exists) {
        nextCategories = prev.categories.filter((c) => c !== id)
      } else {
        nextCategories = [...prev.categories, id]
      }
      if (nextCategories.length === 0) nextCategories = [id]
      return { ...prev, categories: nextCategories }
    })
  }

  const setGrade = (grade: GradeBand) => {
    setFilters((prev) => ({ ...prev, grade, variant: 1 }))
  }

  const regenerate = () => {
    setFilters((prev) => ({ ...prev, variant: prev.variant + 1 }))
  }

  const focusCategory = (id: string) => {
    const cat = INTERACTIVE_CATEGORIES.find((c) => c.id === id)
    if (!cat) return
    setFilters((prev) => ({ ...prev, categories: [id], variant: 1 }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const selectedCategorySet = new Set(filters.categories)

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
                  Interactive Worksheets Generator
                  <span className="block text-purple-600">Free printable PDFs tailored to your class.</span>
                </h1>
                <p className="max-w-2xl text-lg text-slate-600 leading-relaxed">
                  Choose a grade band, mix and match in-demand categories, and get a fresh set of interactive worksheets with answer keys. Math, reading, SEL, science, and more—ready to print or share in seconds.
                </p>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={regenerate}
                    className="inline-flex items-center gap-2 rounded-full bg-purple-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-purple-600/20 transition hover:bg-purple-700"
                  >
                    🔄 Generate today’s interactive pack
                  </button>
                  {pack?.printUrl && (
                    <a
                      href={pack.printUrl}
                      className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-2 text-sm font-semibold text-slate-700 hover:border-purple-400 hover:text-purple-700"
                    >
                      ⬇️ Download free PDF
                    </a>
                  )}
                </div>
                <ul className="grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-purple-500">✔</span>
                    Free interactive worksheets with printable answer keys
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-purple-500">✔</span>
                    Daily unique seed so your students never see repeats
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
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <dt>Unique seed</dt>
                      <dd className="font-mono text-xs text-slate-500 break-all sm:text-right">{pack?.seed || `${todayIso}|preview`}</dd>
                    </div>
                  <div className="flex items-center justify-between">
                    <dt>Variant</dt>
                    <dd className="font-medium text-slate-900">{filters.variant}</dd>
                  </div>
                </dl>
                <p className="mt-4 rounded-xl bg-purple-50 px-3 py-2 text-xs text-purple-700">
                  Tip: click “Regenerate” anytime you need a second or third set for differentiating groups. Every run keeps answer keys attached.
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
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">2. Choose categories</h3>
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
                Morning tubs? Homework packets? Small groups? Run two variants back-to-back—each seed keeps activities unique while matching your filters.
              </p>
            </div>

            <button
              onClick={regenerate}
              className="w-full rounded-full bg-purple-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-purple-600/20 transition hover:bg-purple-700"
            >
              🔁 Regenerate pack
            </button>
          </aside>

          <section className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-xl font-semibold text-slate-900">Today’s interactive worksheets</h2>
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600">
                {loading ? 'Generating…' : `${pack?.items.length || 0} worksheets ready`}
              </span>
            </div>

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            {!error && !loading && pack?.items.length === 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-slate-600">
                No worksheets match those filters yet. Try selecting additional categories.
              </div>
            )}

            <div className="grid gap-5 md:grid-cols-2">
              {pack?.items.map((item) => (
                <WorksheetPreviewCard key={item.docId} item={item} />
              ))}
            </div>

            <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6">
              <h3 className="text-lg font-semibold text-emerald-900">Answer key ready to go</h3>
              <p className="mt-2 text-sm text-emerald-800">
                Downloading the PDF automatically adds a printable answer appendix summarizing every interactive worksheet in this pack. Perfect for quick grading or take-home review.
              </p>
              <ul className="mt-4 grid gap-2 text-sm text-emerald-900 md:grid-cols-2">
                {pack?.answerSummary.map((entry) => (
                  <li key={entry} className="flex items-start gap-2">
                    <span className="mt-1 text-emerald-600">✓</span>
                    {entry}
                  </li>
                ))}
              </ul>
              {pack?.printUrl && (
                <a
                  href={pack.printUrl}
                  className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-400 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-100"
                >
                  ⬇️ Download free PDF bundle
                </a>
              )}
            </div>
          </section>
        </section>

        <section className="bg-white py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
              {INTERACTIVE_CATEGORIES.map((category) => (
                <article key={category.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{category.icon}</span>
                    <h3 className="text-xl font-semibold text-slate-900">
                      Interactive {category.label} Worksheets – Free PDF
                    </h3>
                  </div>
                  <p className="mt-3 text-sm text-slate-600 leading-relaxed">{category.longDescription}</p>
                  <ul className="mt-4 space-y-2 text-sm text-slate-600">
                    {category.topics.map((topic) => (
                      <li key={topic} className="flex items-start gap-2">
                        <span className="mt-1 text-purple-400">•</span>
                        {topic}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => focusCategory(category.id)}
                    className="mt-4 inline-flex items-center gap-2 rounded-full border border-purple-300 px-4 py-2 text-sm font-semibold text-purple-700 hover:bg-purple-50"
                  >
                    Generate interactive {category.label.toLowerCase()} worksheets
                  </button>
                </article>
              ))}
            </div>
          </div>
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
      </main>
      <Footer />
    </div>
  )
}

export default InteractiveWorksheetsPage
