import React from 'react';
import { UnifiedNavigation } from '../components/UnifiedNavigation';
import { Footer } from '../components/Footer';
import { useTranslation } from '../context/TranslationContext';
import { SEOMetaTags } from '../components/SEOMetaTags';

export function TermsPage() {
  const { t, isRTL } = useTranslation();
  
  React.useEffect(() => {
    // Ensure re-render on language change
  }, [t]);
  
  return (
    <div className="min-h-screen bg-slate-50" dir={isRTL ? 'rtl' : 'ltr'}>
      <SEOMetaTags
        title={t('pages.terms.seoTitle')}
        description={t('pages.terms.seoDescription')}
        canonicalUrl="https://wizqo.com/terms"
      />
      <UnifiedNavigation currentPage="terms" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-black text-slate-900 mb-6">
            {t('pages.terms.title')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">{t('pages.terms.service')}</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            {t('pages.terms.lastUpdated')}: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-xl prose prose-lg mx-auto">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold">{t('pages.terms.section1.title')}</h2>
            <p>{t('pages.terms.section1.content')}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold">{t('pages.terms.section2.title')}</h2>
            <p>
              {t('pages.terms.section2.content')}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold">{t('pages.terms.section3.title')}</h2>
            <p>
              {t('pages.terms.section3.content')}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold">{t('pages.terms.section4.title')}</h2>
            <p>
              {t('pages.terms.section4.content')}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold">{t('pages.terms.section5.title')}</h2>
            <p>
              {t('pages.terms.section5.content')}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold">{t('pages.terms.section6.title')}</h2>
            <p>
              {t('pages.terms.section6.content')}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold">{t('pages.terms.section7.title')}</h2>
            <p>
              {t('pages.terms.section7.content')}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold">{t('pages.terms.section8.title')}</h2>
            <p>
              {t('pages.terms.section8.content')}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold">{t('pages.terms.section9.title')}</h2>
            <p>
              {t('pages.terms.section9.content')} <a href="mailto:admin@wizqo.com" className="text-blue-600 hover:text-blue-800 transition-colors">admin@wizqo.com</a>.
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}