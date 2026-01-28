// No change needed, just checking imports.
import * as React from 'react'
const { useEffect, useState, useMemo, useCallback } = React
import { useTranslation } from '@/context/TranslationContext'
import { UnifiedNavigation } from '@/components/UnifiedNavigation'
import { Footer } from '@/components/Footer'
import { SEOMetaTags } from '@/components/SEOMetaTags'
import { getWorksheetSEOBySlug, getWorksheetSEO } from '@shared/worksheetSEO'
import { trackWorksheetView, trackWorksheetDownload } from '@/utils/analytics'
import ShadowMatchingWorksheetPage from './ShadowMatchingWorksheetPage'
import { PDFDownloadButton } from '@/components/common/PDFDownloadButton'
import { getLocaleFromURL, addLocaleToPath } from '@/utils/locale'


interface WorksheetPageProps {
  slug: string
}

export default function WorksheetPage({ slug }: WorksheetPageProps) {
  // Hardcoded redirect for custom worksheets that might get caught in generic routing
  if (slug === 'match-object-to-shadow') {
    return <ShadowMatchingWorksheetPage />
  }

  const { t, isRTL } = useTranslation()
  const [seoData, setSeoData] = useState<any>(null)
  const [notFound, setNotFound] = useState(false)
  // Initialize showAnswers state - MUST be before any conditional returns
  const [showAnswers, setShowAnswers] = useState(false)

  React.useEffect(() => {
    const data = getWorksheetSEOBySlug(slug)
    if (data) {
      setSeoData(data)
      // Track page view
      trackWorksheetView(data.docId, data.h1, 'worksheet-page', data.grade[0])
    } else {
      setNotFound(true)
    }
  }, [slug])

  if (notFound || !seoData) {
    return (
      <div className="min-h-screen bg-slate-50">
        <UnifiedNavigation />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Worksheet Not Found</h1>
          <p className="text-slate-600 mb-8">The worksheet you're looking for doesn't exist.</p>
          <a href="/worksheets/all" className="text-blue-600 hover:text-blue-800 underline">
            Browse All Worksheets
          </a>
        </div>
        <Footer />
      </div>
    )
  }

  // Get 'from' parameter from URL
  const fromParam = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('from') : null


  // Get category page URL (logic used for both breadcrumbs and 'from' parameter)
  const categorySlug = seoData.category.includes('multiplication')
    ? 'multiplication-worksheets'
    : seoData.category.includes('handwriting')
      ? 'handwriting-worksheet-maker'
      : seoData.category.includes('reading')
        ? 'reading-comprehension'
        : seoData.category.includes('order-of-operations')
          ? 'order-of-operations-worksheets'
          : seoData.category.includes('geometry')
            ? 'geometry-worksheets'
            : seoData.category.includes('geography')
              ? 'geography-worksheets'
              : seoData.category.includes('measurement')
                ? 'measurement-worksheets'
                : seoData.category.includes('logic')
                  ? 'logic-worksheets'
                  : seoData.category.includes('decimal')
                    ? 'decimal-worksheets'
                    : seoData.category.includes('math-maze')
                      ? 'math-maze-worksheets'
                      : seoData.category.includes('science')
                        ? 'science-worksheets'
                        : seoData.grade.includes('5th Grade')
                          ? '5th-grade-math-worksheets'
                          : seoData.grade.includes('4th Grade')
                            ? '4th-grade-math-worksheets'
                            : seoData.grade.includes('3rd Grade')
                              ? '3rd-grade-math-worksheets'
                              : seoData.grade.includes('2nd Grade')
                                ? '2nd-grade-math-worksheets'
                                : seoData.grade.includes('1st Grade')
                                  ? '1st-grade-math-worksheets'
                                  : seoData.grade.includes('Kindergarten')
                                    ? 'kindergarten-math-worksheets'
                                    : null

  const categoryUrl = categorySlug ? `/worksheets/${categorySlug}` : '/worksheets'





  // Get print URL (noindexed route) - include 'from' parameter for tracking
  const basePrintUrl = `/print?doc=${seoData.docId}&from=${fromParam || categorySlug || slug}&download=1`
  const printUrl = showAnswers ? `${basePrintUrl}&showAnswers=1` : basePrintUrl


  const handlePrintClick = () => {
    trackWorksheetDownload(seoData.docId, seoData.h1, 'worksheet-page', seoData.grade[0])
    window.open(printUrl, '_blank')
  }

  return (
    <div className="min-h-screen bg-slate-50 print:bg-white print:p-0" dir={isRTL ? 'rtl' : 'ltr'}>
      <SEOMetaTags
        title={seoData.title}
        description={seoData.metaDescription}
        keywords={seoData.keywords}
        canonicalUrl={`https://wizqo.com${addLocaleToPath(`/${slug}`, getLocaleFromURL())}`}
        noIndex={false}
        ogType="article"
      />

      <UnifiedNavigation />

      <main id="main-content" className="container mx-auto px-4 py-8 max-w-4xl print:max-w-none print:p-0 print:m-0">
        {/* Breadcrumbs */}
        <nav className="mb-6 text-sm text-slate-600 print:hidden" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li><a href={addLocaleToPath("/", getLocaleFromURL())} className="hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded" aria-label="Go to home page">Home</a></li>
            <li className="text-slate-400" aria-hidden="true">/</li>
            <li><a href={addLocaleToPath("/worksheets/all", getLocaleFromURL())} className="hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded" aria-label="Browse all worksheets">Worksheets</a></li>
            <li className="text-slate-400" aria-hidden="true">/</li>
            <li><a href={addLocaleToPath(categoryUrl, getLocaleFromURL())} className="hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded" aria-label={`Go to ${seoData.section} worksheets`}>{seoData.section}</a></li>
            <li className="text-slate-400" aria-hidden="true">/</li>
            <li className="text-slate-900 font-medium" aria-current="page">{seoData.h1}</li>
          </ol>
        </nav>

        {/* Main Content */}
        <article className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 mb-8 print:shadow-none print:border-0 print:p-0 print:m-0">
          {/* Header */}
          <header className="mb-6 print:hidden">
            {!seoData.richContent && (
              <h1 className="text-3xl font-bold text-slate-900 mb-4">{seoData.h1}</h1>
            )}
            <div className="flex flex-wrap gap-2 mb-4">
              {seoData.grade.map((g: string) => (
                <span key={g} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {g}
                </span>
              ))}
              {seoData.category.map((c: string) => (
                <span key={c} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                  {c}
                </span>
              ))}
            </div>
          </header>




          {/* Worksheet Preview */}
          <div className="mb-8 print:m-0 print:p-0 print:w-full">
            <div className="bg-slate-50 border-2 border-slate-200 rounded-lg p-4 mb-4 print:bg-white print:border-0 print:p-0 print:m-0">
              <iframe
                src={`${printUrl}&preview=1`}
                className="w-full border-0 rounded"
                style={{ minHeight: '600px' }}
                title={`Preview of ${seoData.h1}`}
                aria-label={`Preview of ${seoData.h1} worksheet`}
              />
            </div>

            {/* Print/Download Button */}
            <div className="flex flex-col items-center gap-4 print:hidden">
              <PDFDownloadButton
                onClick={handlePrintClick}
                isGenerating={false}
                disableDefaultPositioning={true}
                className="px-6 py-3 text-base shadow-md hover:shadow-lg"
                label="PDF Download"
              />

              {/* Show Answer Toggle */}
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={showAnswers}
                    onChange={(e) => setShowAnswers(e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </div>
                <span className="text-sm font-medium text-slate-700">Show Answer Key</span>
              </label>
            </div>
            <p className="text-sm text-slate-500 text-center mt-2 print:hidden">
              Click the button above to open the printable worksheet in a new window
            </p>
          </div>

          {/* Content (SEO Rich Content / Intro) */}
          <div className="print:hidden border-t border-slate-100 pt-8">
            {seoData.richContent ? (
              <div
                className="prose prose-slate max-w-none mb-8"
                dangerouslySetInnerHTML={{ __html: seoData.richContent }}
              />
            ) : (
              <div className="prose prose-slate max-w-none mb-8">
                <p className="text-lg text-slate-700 leading-relaxed">{seoData.intro}</p>
              </div>
            )}
          </div>

          {/* Related Worksheets */}
          {seoData.relatedDocIds.length > 0 && (
            <div className="mt-8 pt-8 border-t border-slate-200 print:hidden">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Related Worksheets</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {seoData.relatedDocIds.slice(0, 4).map((relatedDocId: string) => {
                  const related = getWorksheetSEO(relatedDocId)
                  if (!related) return null
                  return (
                    <a
                      key={relatedDocId}
                      href={addLocaleToPath(`/${related.slug}`, getLocaleFromURL())}
                      className="block p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-blue-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
                      aria-label={`View ${related.h1} worksheet`}
                    >
                      <h3 className="font-semibold text-slate-900 mb-1">{related.h1}</h3>
                      <p className="text-sm text-slate-600">{related.grade.join(', ')}</p>
                    </a>
                  )
                })}
              </div>
            </div>
          )}
        </article>

        {/* Back to Category */}
        <div className="text-center mb-8 print:hidden">
          <a
            href={categoryUrl}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded font-medium"
            aria-label={`Back to ${seoData.section} worksheets`}
          >
            {isRTL ? '→' : '←'} Back to {seoData.section} Worksheets
          </a>
        </div>
      </main>

      <Footer />
    </div>
  )
}
