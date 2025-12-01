import React from 'react'
import { UnifiedNavigation } from '@/components/UnifiedNavigation'
import { Footer } from '@/components/Footer'
import { SEOMetaTags } from '@/components/SEOMetaTags'
import { useTranslation } from '@/context/TranslationContext'
import { WizqoLogo } from '@/components/WizqoLogo'

export default function NotFoundPage() {
  const { t, isRTL } = useTranslation()

  return (
    <div className="min-h-screen bg-slate-50" dir={isRTL ? 'rtl' : 'ltr'}>
      <SEOMetaTags
        title="404 - Page Not Found | Wizqo"
        description="The page you're looking for doesn't exist. Browse our free printable worksheets for kids (K-5) - math, reading, writing, and more!"
        noIndex={true}
      />
      
      <UnifiedNavigation />
      
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center">
          {/* 404 Visual */}
          <div className="mb-8">
            <div className="inline-block">
              <h1 className="text-9xl font-black text-purple-600 mb-4">404</h1>
              <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto rounded-full"></div>
            </div>
          </div>

          {/* Message */}
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Oops! Page Not Found
          </h2>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            The page you're looking for doesn't exist or has been moved. But don't worry - we have lots of free worksheets waiting for you!
          </p>

          {/* Helpful Links */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm mb-8">
            <h3 className="text-xl font-semibold text-slate-900 mb-6">
              Popular Pages You Might Like:
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <a
                href="/worksheets/all"
                className="flex items-center gap-3 p-4 rounded-lg border border-slate-200 hover:border-purple-300 hover:bg-purple-50 transition-all group"
              >
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                  <span className="text-xl">📚</span>
                </div>
                <div className="text-left">
                  <div className="font-semibold text-slate-900 group-hover:text-purple-600">All Worksheets</div>
                  <div className="text-sm text-slate-600">Browse 299+ free worksheets</div>
                </div>
              </a>

              <a
                href="/interactive-worksheets-generator"
                className="flex items-center gap-3 p-4 rounded-lg border border-slate-200 hover:border-purple-300 hover:bg-purple-50 transition-all group"
              >
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                  <span className="text-xl">✨</span>
                </div>
                <div className="text-left">
                  <div className="font-semibold text-slate-900 group-hover:text-purple-600">Worksheet Generator</div>
                  <div className="text-sm text-slate-600">Create custom worksheets</div>
                </div>
              </a>

              <a
                href="/worksheets/multiplication-worksheets"
                className="flex items-center gap-3 p-4 rounded-lg border border-slate-200 hover:border-purple-300 hover:bg-purple-50 transition-all group"
              >
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                  <span className="text-xl">✖️</span>
                </div>
                <div className="text-left">
                  <div className="font-semibold text-slate-900 group-hover:text-purple-600">Multiplication Worksheets</div>
                  <div className="text-sm text-slate-600">Free printable PDFs</div>
                </div>
              </a>

              <a
                href="/blog"
                className="flex items-center gap-3 p-4 rounded-lg border border-slate-200 hover:border-purple-300 hover:bg-purple-50 transition-all group"
              >
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                  <span className="text-xl">📝</span>
                </div>
                <div className="text-left">
                  <div className="font-semibold text-slate-900 group-hover:text-purple-600">Blog</div>
                  <div className="text-sm text-slate-600">Teaching tips & resources</div>
                </div>
              </a>
            </div>
          </div>

          {/* Home Button */}
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors shadow-md hover:shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Go to Homepage
          </a>
        </div>
      </main>

      <Footer />
    </div>
  )
}
