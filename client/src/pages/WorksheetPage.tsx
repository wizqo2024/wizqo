import React from 'react'
import { useTranslation } from '@/context/TranslationContext'
import { UnifiedNavigation } from '@/components/UnifiedNavigation'
import { Footer } from '@/components/Footer'
import { SEOMetaTags } from '@/components/SEOMetaTags'
import { getWorksheetSEOBySlug, getWorksheetSEO } from '@shared/worksheetSEO'
import { trackWorksheetView, trackWorksheetDownload } from '@/utils/analytics'

interface WorksheetPageProps {
  slug: string
}

export default function WorksheetPage({ slug }: WorksheetPageProps) {
  const { t, isRTL } = useTranslation()
  const [seoData, setSeoData] = React.useState<ReturnType<typeof getWorksheetSEOBySlug> | null>(null)
  const [notFound, setNotFound] = React.useState(false)

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

  // Get print URL (noindexed route) - include 'from' parameter for tracking
  const printUrl = `/print?doc=${seoData.docId}&from=${slug}`
  
  // Get category page URL
  const categoryUrl = seoData.category.includes('multiplication') 
    ? '/worksheets/multiplication-worksheets'
    : seoData.category.includes('division')
    ? '/worksheets/3rd-grade-math-worksheets'
    : seoData.category.includes('fractions')
    ? '/worksheets/3rd-grade-math-worksheets'
    : seoData.grade.includes('Kindergarten')
    ? '/worksheets/kindergarten-math-worksheets'
    : seoData.grade.includes('1st Grade')
    ? '/worksheets/1st-grade-math-worksheets'
    : seoData.grade.includes('2nd Grade')
    ? '/worksheets/2nd-grade-math-worksheets'
    : seoData.grade.includes('3rd Grade')
    ? '/worksheets/3rd-grade-math-worksheets'
    : seoData.grade.includes('4th Grade')
    ? '/worksheets/4th-grade-math-worksheets'
    : seoData.grade.includes('5th Grade')
    ? '/worksheets/5th-grade-math-worksheets'
    : '/worksheets'

  const handlePrintClick = () => {
    trackWorksheetDownload(seoData.docId, seoData.h1, 'worksheet-page', seoData.grade[0])
    window.open(printUrl, '_blank')
  }

  return (
    <div className="min-h-screen bg-slate-50" dir={isRTL ? 'rtl' : 'ltr'}>
      <SEOMetaTags
        title={seoData.title}
        description={seoData.metaDescription}
        keywords={seoData.keywords}
        canonicalUrl={`https://wizqo.com/worksheets/${slug}`}
        noIndex={false}
        ogType="article"
      />
      
      <UnifiedNavigation />
      
      <main id="main-content" className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Breadcrumbs */}
        <nav className="mb-6 text-sm text-slate-600" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li><a href="/" className="hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded" aria-label="Go to home page">Home</a></li>
            <li className="text-slate-400" aria-hidden="true">/</li>
            <li><a href="/worksheets/all" className="hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded" aria-label="Browse all worksheets">Worksheets</a></li>
            <li className="text-slate-400" aria-hidden="true">/</li>
            <li><a href={categoryUrl} className="hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded" aria-label={`Go to ${seoData.section} worksheets`}>{seoData.section}</a></li>
            <li className="text-slate-400" aria-hidden="true">/</li>
            <li className="text-slate-900 font-medium" aria-current="page">{seoData.h1}</li>
          </ol>
        </nav>

        {/* Main Content */}
        <article className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 mb-8">
          {/* Header */}
          <header className="mb-6">
            <h1 className="text-3xl font-bold text-slate-900 mb-4">{seoData.h1}</h1>
            <div className="flex flex-wrap gap-2 mb-4">
              {seoData.grade.map(g => (
                <span key={g} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {g}
                </span>
              ))}
              {seoData.category.map(c => (
                <span key={c} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                  {c}
                </span>
              ))}
            </div>
          </header>

          {/* Intro Content */}
          <div className="prose prose-slate max-w-none mb-8">
            <p className="text-lg text-slate-700 leading-relaxed">{seoData.intro}</p>
          </div>

          {/* Visual Examples Section - Preview of Problem Format */}
          {seoData.visualExamples && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-500 p-6 rounded-lg mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">📝 Preview - What's Inside</h2>
              <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
                <pre className="text-sm font-mono text-slate-700 whitespace-pre-wrap leading-relaxed font-normal">
                  {seoData.visualExamples}
                </pre>
              </div>
              <p className="text-sm text-slate-600 mt-3">
                <strong>Note:</strong> Each worksheet includes a detailed worked example with step-by-step strategies inside the PDF.
              </p>
            </div>
          )}

          {/* Learning Objectives */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded mb-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">📚 What You'll Practice</h2>
            <ul className="space-y-2">
              {seoData.learningObjectives.map((obj, i) => (
                <li key={i} className="flex items-start">
                  <span className="text-blue-500 mr-2">✓</span>
                  <span className="text-slate-700">{obj}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Worksheet Preview */}
          <div className="mb-8">
            <div className="bg-slate-50 border-2 border-slate-200 rounded-lg p-4 mb-4">
              <iframe
                src={`${printUrl}&preview=1`}
                className="w-full border-0 rounded"
                style={{ minHeight: '600px' }}
                title={`Preview of ${seoData.h1}`}
                aria-label={`Preview of ${seoData.h1} worksheet`}
              />
            </div>
            
            {/* Print/Download Button */}
            <div className="flex gap-4 justify-center">
              <button
                onClick={handlePrintClick}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors shadow-md hover:shadow-lg"
                aria-label={`Print or download ${seoData.h1} as PDF`}
              >
                📄 Print or Download PDF
              </button>
            </div>
            <p className="text-sm text-slate-500 text-center mt-2">
              Click the button above to open the printable worksheet in a new window
            </p>
          </div>

          {/* Related Worksheets */}
          {seoData.relatedDocIds.length > 0 && (
            <div className="mt-8 pt-8 border-t border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Related Worksheets</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {seoData.relatedDocIds.slice(0, 4).map(relatedDocId => {
                  const related = getWorksheetSEO(relatedDocId)
                  if (!related) return null
                  return (
                    <a
                      key={relatedDocId}
                      href={`/worksheets/${related.slug}`}
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
        <div className="text-center mb-8">
          <a
            href={categoryUrl}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded font-medium"
            aria-label={`Back to ${seoData.section} worksheets`}
          >
            ← Back to {seoData.section} Worksheets
          </a>
        </div>
      </main>

      <Footer />
    </div>
  )
}
