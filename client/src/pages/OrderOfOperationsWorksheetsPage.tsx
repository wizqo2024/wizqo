import React, { useState, useMemo } from 'react'
import { UnifiedNavigation } from '@/components/UnifiedNavigation'
import { Footer } from '@/components/Footer'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { CategoryFilter, type Category } from '@/components/CategoryFilter'
import { trackCategoryFilter } from '@/utils/analytics'
import { useTranslation } from '@/context/TranslationContext'
import { getWorksheetURL } from '@/utils/worksheetLinks'

interface WorksheetItem {
  title: string
  description: string
  href: string
  docId: string
  categories: string[]
  gradeRange?: string
}

export default function OrderOfOperationsWorksheetsPage() {
  const { t, language, isRTL } = useTranslation()
  const [previewItem, setPreviewItem] = React.useState<WorksheetItem | null>(null);
  React.useEffect(() => {}, [language])
  
  const PEMDAS_CATEGORIES: Category[] = useMemo(() => [
    { id: 'basic', label: 'Basic PEMDAS', icon: '🔢' },
    { id: 'parentheses', label: 'With Parentheses', icon: '📝' },
    { id: 'exponents', label: 'With Exponents', icon: '⚡' },
    { id: 'multi-step', label: 'Multi-Step Problems', icon: '🧮' },
    { id: 'word-problems', label: 'Word Problems', icon: '📚' },
    { id: 'practice', label: 'Practice Sheets', icon: '✏️' },
  ], [])
  
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set())

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev)
      const isSelecting = !next.has(categoryId)
      if (isSelecting) {
        next.add(categoryId)
        trackCategoryFilter(categoryId, 'select', 'order-of-operations-worksheets')
      } else {
        next.delete(categoryId)
        trackCategoryFilter(categoryId, 'deselect', 'order-of-operations-worksheets')
      }
      return next
    })
  }

  const clearCategories = () => {
    setSelectedCategories(new Set())
  }

  // Define all worksheets with their categories - unique PEMDAS worksheets
  const allWorksheets: WorksheetItem[] = useMemo(() => [
    // 4th Grade - Beginner worksheets
    { title: 'Basic Order of Operations (PEMDAS)', description: 'Start with simple expressions using multiplication, division, addition, and subtraction. Perfect for building confidence in 4th grade students.', href: getWorksheetURL('pemdas-basic', 'order-of-operations'), docId: 'pemdas-basic', categories: ['basic', 'practice'], gradeRange: '4th' },
    { title: 'PEMDAS with Parentheses', description: 'Practice solving expressions with parentheses. Step-by-step exercises that help kids understand which operations come first.', href: getWorksheetURL('pemdas-parentheses', 'order-of-operations'), docId: 'pemdas-parentheses', categories: ['parentheses', 'basic'], gradeRange: '4th' },
    { title: 'Order of Operations Practice Sheet', description: 'Mixed practice problems covering all basic operations. Build fluency with PEMDAS rules through repeated practice.', href: getWorksheetURL('pemdas-practice', 'order-of-operations'), docId: 'pemdas-practice', categories: ['practice', 'basic'], gradeRange: '4th' },
    // 5th Grade - Intermediate worksheets
    { title: 'PEMDAS with Exponents', description: 'Master expressions with exponents. Learn to solve problems like 2³ + 4 × 3 using the correct order of operations.', href: getWorksheetURL('pemdas-exponents', 'order-of-operations'), docId: 'pemdas-exponents', categories: ['exponents', 'multi-step'], gradeRange: '5th' },
    { title: 'Multi-Step PEMDAS Problems', description: 'Challenge yourself with complex expressions combining parentheses, exponents, and all operations. Perfect for 5th grade mastery.', href: getWorksheetURL('pemdas-multistep', 'order-of-operations'), docId: 'pemdas-multistep', categories: ['multi-step', 'exponents'], gradeRange: '5th' },
    { title: 'PEMDAS Word Problems', description: 'Apply order of operations to real-world scenarios. Solve word problems that require careful step-by-step thinking.', href: getWorksheetURL('pemdas-word-problems', 'order-of-operations'), docId: 'pemdas-word-problems', categories: ['word-problems', 'multi-step'], gradeRange: '5th' },
    { title: 'Advanced Parentheses and Exponents', description: 'Tackle challenging problems with nested parentheses and exponents. Build confidence in complex expressions.', href: getWorksheetURL('pemdas-advanced', 'order-of-operations'), docId: 'pemdas-advanced', categories: ['parentheses', 'exponents'], gradeRange: '5th' },
    // 6th Grade - Advanced worksheets
    { title: 'Complex PEMDAS Expressions', description: 'Master the most challenging order of operations problems. Perfect for 6th grade students ready for advanced practice.', href: getWorksheetURL('pemdas-complex', 'order-of-operations'), docId: 'pemdas-complex', categories: ['multi-step', 'exponents'], gradeRange: '6th' },
    { title: 'PEMDAS Rules and Practice', description: 'Comprehensive review of PEMDAS rules with step-by-step examples and practice problems. Great for test preparation.', href: getWorksheetURL('pemdas-rules', 'order-of-operations'), docId: 'pemdas-rules', categories: ['practice', 'basic'], gradeRange: '6th' },
    { title: 'Mixed PEMDAS Review', description: 'Review all PEMDAS concepts with mixed problems. Covers parentheses, exponents, and all operations for complete mastery.', href: getWorksheetURL('pemdas-mixed-review', 'order-of-operations'), docId: 'pemdas-mixed-review', categories: ['practice', 'multi-step'], gradeRange: '6th' },
    // All Grades - Practice and review
    { title: 'PEMDAS Fluency Practice', description: 'Build speed and accuracy with timed PEMDAS practice. Perfect for students who need extra repetition to master the order of operations.', href: getWorksheetURL('pemdas-fluency', 'order-of-operations'), docId: 'pemdas-fluency', categories: ['practice'], gradeRange: 'All' },
    { title: 'Step-by-Step PEMDAS Guide', description: 'Learn PEMDAS with clear step-by-step instructions and worked examples. Ideal for students who struggle with order of operations.', href: getWorksheetURL('pemdas-step-by-step', 'order-of-operations'), docId: 'pemdas-step-by-step', categories: ['basic', 'practice'], gradeRange: 'All' },
  ], [])

  // Filter worksheets based on selected categories
  const filteredWorksheets = useMemo(() => {
    if (selectedCategories.size === 0) return allWorksheets
    return allWorksheets.filter((ws) => 
      ws.categories.some((cat) => selectedCategories.has(cat))
    )
  }, [selectedCategories, allWorksheets])

  // Group filtered worksheets by grade range
  const groupedWorksheets = useMemo(() => {
    const groups: Record<string, WorksheetItem[]> = {}
    filteredWorksheets.forEach((ws) => {
      const range = ws.gradeRange || 'All'
      if (!groups[range]) groups[range] = []
      groups[range].push(ws)
    })
    return groups
  }, [filteredWorksheets])
  
  return (
    <div className="min-h-screen bg-slate-50" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* SEO tags are set in App.tsx for this route */}
      {(() => {
        const canonical = "https://wizqo.com/worksheets/order-of-operations-worksheets";
        const breadcrumbId = `${canonical}#breadcrumbs`;
        const breadcrumbLd = {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "@id": breadcrumbId,
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://wizqo.com/" },
            { "@type": "ListItem", position: 2, name: "Worksheets", item: "https://wizqo.com/interactive-worksheets-generator" },
            { "@type": "ListItem", position: 3, name: "Order of Operations Worksheets", item: "https://wizqo.com/worksheets/order-of-operations-worksheets" }
          ]
        } as const;
        return (
          <>
            <script id="breadcrumbs" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
          </>
        );
      })()}
      <UnifiedNavigation />
      {/* Print-only Name/Date overlay for this page */}
      <style>{`
        @media print {
          @page { margin: 0; }
          html, body { margin: 0 !important; padding: 0 !important; }
          .print-name-date { position: fixed; bottom: 0.35in; left: 0.5in; right: 0.5in; display: flex; justify-content: space-between; color: #334155; font-size: 12px; z-index: 9999; pointer-events: none; }
          .print-name-date .label { margin-right: 6px; }
          .print-name-date .line { border-bottom: 1px solid #94a3b8; min-width: 2.5in; height: 0.9em; display: inline-block; }
        }
      `}</style>
      <div className="hidden print:block print-name-date" aria-hidden>
        <div>
          <span className="label">Name</span>
          <span className="line" />
        </div>
        <div>
          <span className="label">Date</span>
          <span className="line" />
        </div>
      </div>
      <main className="bg-gradient-to-b from-purple-50/70 via-white to-white">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-100/60 via-white to-emerald-50/50" aria-hidden />
          <div className="relative mx-auto max-w-6xl px-4 pb-14 pt-16 sm:px-6 lg:px-8">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-white px-3 py-1 text-sm font-medium text-purple-700 shadow-sm">
                Free Printable PDFs
              </span>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                Free Order of Operations Worksheets (PEMDAS)
                <span className="block text-purple-600">Printable PDFs</span>
              </h1>
              <p className="max-w-2xl text-lg text-slate-600 leading-relaxed">
                Make PEMDAS finally "click"! Download free Order of Operations worksheets (PDF) with step-by-step practice. Stress-free exercises that build confidence in 4th–6th grade students. No login — just print and learn.
              </p>
            </div>
          </div>
        </section>
        
        <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8 space-y-10">
        <section className="bg-white border border-slate-200 rounded-2xl p-5">
          <h2 className="text-xl font-bold text-slate-900 mb-2">What Are PEMDAS & the Order of Operations?</h2>
          <p className="text-slate-700 text-sm max-w-3xl mb-4">
            Understanding the order of operations is one of the big math milestones in upper-elementary grades. Many kids feel frustrated when equations start including parentheses, exponents, and multiple steps — and that's normal.
          </p>
          <p className="text-slate-700 text-sm max-w-3xl mb-4">
            These worksheets are designed to be:
          </p>
          <ul className="text-slate-700 text-sm max-w-3xl mb-4 list-disc list-inside space-y-1">
            <li>Calm</li>
            <li>Clear</li>
            <li>Confidence-boosting</li>
            <li>Classroom-friendly</li>
            <li>Printable in seconds</li>
          </ul>
          <p className="text-slate-700 text-sm max-w-3xl">
            Perfect for grades 4–6 (and even review for 7th).
          </p>
        </section>

        {/* Main content with sidebar layout */}
        <section className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
          {/* Left sidebar - Category Filter */}
          <aside className="space-y-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <CategoryFilter
                categories={PEMDAS_CATEGORIES}
                selectedCategories={selectedCategories}
                onToggleCategory={toggleCategory}
                onClearAll={clearCategories}
                title="Filter by Category"
              />
            </div>
          </aside>

          {/* Right content - Worksheets Grid */}
          <div className="space-y-8">
          {Object.entries(groupedWorksheets).map(([gradeRange, worksheets]) => {
            const label = gradeRange === 'All' 
              ? 'All Grades'
              : `${gradeRange} Grade`
            
            return (
              <div key={gradeRange}>
                <h2 className="text-xl font-bold text-slate-900 mb-2">{label}</h2>
                <div className="grid sm:grid-cols-2 gap-6">
                  {worksheets.map((ws) => (
                    <WorksheetThumbnailCard
                      key={ws.docId}
                      title={ws.title}
                      description={ws.description}
                      href={ws.href}
                      docId={ws.docId}
                      onPreview={setPreviewItem}
                    />
                  ))}
                </div>
              </div>
            )
          })}
          {filteredWorksheets.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              <p className="text-lg">No worksheets found. Try adjusting your filters.</p>
              <button
                onClick={clearCategories}
                className="mt-4 text-purple-600 hover:text-purple-700 font-medium"
              >
                Clear Filters
              </button>
            </div>
          )}
          </div>
        </section>

        {/* Free Order of Operations Worksheets Section */}
        <section className="bg-white border border-slate-200 rounded-2xl p-5">
          <h2 className="text-xl font-bold text-slate-900 mb-2">Free Order of Operations Worksheets (PDF)</h2>
          <p className="text-slate-700 text-sm max-w-3xl">
            Download and print these no-stress PEMDAS worksheets. Each page includes an answer key.
          </p>
        </section>

        {/* Explore More Worksheets */}
        <section className="bg-white border border-slate-200 rounded-2xl p-5">
          <h2 className="text-xl font-bold text-slate-900">Explore More Worksheets</h2>
          <ul className="mt-3 grid sm:grid-cols-2 gap-2 text-sm text-purple-700">
            <li><a className="hover:underline" href="/worksheets/multiplication-worksheets">Multiplication Worksheets</a></li>
            <li><a className="hover:underline" href="/worksheets/times-table-multiplication-worksheets">Times Table Multiplication Worksheets</a></li>
            <li><a className="hover:underline" href="/worksheets/fractions-to-decimals-worksheets">Converting Fractions to Decimals Worksheets</a></li>
            <li><a className="hover:underline" href="/worksheets/4th-grade-math-worksheets">4th Grade Math Worksheets – Free PDF</a></li>
            <li><a className="hover:underline" href="/worksheets/5th-grade-math-worksheets">5th Grade Math Worksheets – Printable</a></li>
            <li><a className="hover:underline" href="/printables">Printable Fun Learning Activities</a></li>
          </ul>
        </section>

        <section className="mb-10 bg-white border border-slate-200 rounded-2xl p-5">
          <h2 className="text-xl font-bold text-slate-900 mb-4">FAQs</h2>
          <Accordion type="single" collapsible className="divide-y rounded-xl border border-slate-200 bg-white">
            <AccordionItem value="q1">
              <AccordionTrigger className="px-4">Are order of operations worksheets free to download?</AccordionTrigger>
              <AccordionContent className="px-4 text-slate-700">
                Yes! All order of operations worksheets are completely free. Generate unlimited unique worksheets, download as PDFs, and print as many copies as you need. No sign-up required.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger className="px-4">What grade levels are PEMDAS worksheets available for?</AccordionTrigger>
              <AccordionContent className="px-4 text-slate-700">
                Our order of operations worksheets are perfect for 4th grade, 5th grade, and 6th grade students. Each worksheet is tailored to the appropriate grade level with step-by-step practice and answer keys.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger className="px-4">Do PEMDAS worksheets include answer keys?</AccordionTrigger>
              <AccordionContent className="px-4 text-slate-700">
                Yes! Every order of operations worksheet automatically includes a complete answer key with step-by-step solutions, making grading quick and easy for teachers and parents.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q4">
              <AccordionTrigger className="px-4">What skills are covered in order of operations worksheets?</AccordionTrigger>
              <AccordionContent className="px-4 text-slate-700">
                Our worksheets cover basic PEMDAS rules, expressions with parentheses, exponents, multi-step problems, word problems, and mixed review. Perfect for building confidence and mastering the order of operations.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
        </div>
      </main>
      <Footer />
      
      {/* Preview Modal */}
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
                  <p className="text-sm text-slate-600 mt-1">{previewItem.description}</p>
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
                  {/* Worksheet Preview */}
                  <div className="bg-white shadow-lg rounded-lg p-8 print:shadow-none">
                    <iframe
                      src={previewItem.href}
                      className="w-full h-full min-h-[600px] border-0"
                      title={previewItem.title}
                    />
                  </div>
                  
                  {/* Info Footer */}
                  <div className="mt-6 rounded-xl border border-purple-200 bg-purple-50 p-4 text-sm text-purple-800">
                    <p className="font-semibold mb-2">Preview</p>
                    <p>Click the Download button below to download as PDF or use your browser's print function.</p>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="mt-6 flex items-center gap-3">
                    <button
                      onClick={() => {
                        const newWindow = window.open(previewItem.href, '_blank')
                        if (newWindow) {
                          setTimeout(() => {
                            newWindow.print()
                          }, 500)
                        }
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-purple-200 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium shadow-sm"
                    >
                      Download
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const WorksheetThumbnailCard = React.memo(function WorksheetThumbnailCard({ title, description, href, docId, onPreview }: { title: string; description: string; href: string; docId: string; onPreview?: (item: WorksheetItem) => void }) {
  const { t, language } = useTranslation();
  const previewUrl = href + (href.includes('?') ? '&preview=1' : '?preview=1')
  
  // Use translations if available (fallback to provided title/description) - memoize to prevent re-renders
  // Use language instead of t in dependencies to avoid re-renders when t function reference changes
  const translatedTitle = React.useMemo(() => {
    if (!docId) return title;
    const translated = t(`worksheets.${docId}.title`);
    return translated && translated !== `worksheets.${docId}.title` ? translated : title;
  }, [docId, title, language, t]);
  
  const translatedDescription = React.useMemo(() => {
    if (!docId) return description;
    const translated = t(`worksheets.${docId}.description`);
    return translated && translated !== `worksheets.${docId}.description` ? translated : description;
  }, [docId, description, language, t]);
  
  return (
    <article className="rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-all duration-200 p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-slate-900">{translatedTitle}</h3>
        </div>
      </div>
      
      <p className="text-sm text-slate-600 leading-relaxed">{translatedDescription}</p>
      
      {/* Worksheet Thumbnail Preview */}
      <div 
        className="relative w-full bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg border border-slate-200 overflow-hidden cursor-pointer group shadow-sm hover:shadow-md transition-shadow"
        onClick={() => onPreview?.({ title: translatedTitle, description: translatedDescription, href, docId, categories: [], gradeRange: '' })}
        style={{ 
          height: '140px',
          aspectRatio: '2.5/1',
        }}
      >
        {/* Thumbnail content using iframe with preview mode */}
        <iframe
          src={previewUrl}
          className="w-full h-full border-0"
          style={{
            transform: 'scale(0.25)',
            transformOrigin: 'top left',
            width: '400%',
            height: '400%',
            pointerEvents: 'none',
          }}
          title={`Preview of ${title}`}
          loading="lazy"
        />
        {/* Gradient fade at bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-50 pointer-events-none" />
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center pointer-events-none">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg text-xs font-semibold text-purple-700 border-2 border-purple-300 shadow-lg pointer-events-auto">
            Click to view full worksheet
          </div>
        </div>
        {/* Corner fold effect */}
        <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-br from-slate-200/50 to-transparent pointer-events-none" />
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span>Answer key included</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const newWindow = window.open(href, '_blank')
              if (newWindow) {
                setTimeout(() => {
                  newWindow.print()
                }, 500)
              }
            }}
            className="text-xs font-medium text-purple-600 hover:text-purple-700 px-3 py-1 rounded-full border border-purple-200 hover:border-purple-300 transition-colors"
          >
            Download
          </button>
        </div>
      </div>
    </article>
  )
})
