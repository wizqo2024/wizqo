import React from 'react';
import { UnifiedNavigation } from '../components/UnifiedNavigation';
import { Footer } from '../components/Footer';
import { useTranslation } from '../context/TranslationContext';
import { SEOMetaTags } from '../components/SEOMetaTags';

export function CookiesPage() {
  const { t, isRTL } = useTranslation();
  
  React.useEffect(() => {
    // Ensure re-render on language change
  }, [t]);
  
  return (
    <div className="min-h-screen bg-slate-50" dir={isRTL ? 'rtl' : 'ltr'}>
      <SEOMetaTags
        title={t('pages.cookies.seoTitle')}
        description={t('pages.cookies.seoDescription')}
        canonicalUrl="https://wizqo.com/cookies"
      />
      <UnifiedNavigation currentPage="cookies" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-black text-slate-900 mb-6">
            {t('pages.cookies.title')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">{t('pages.cookies.policy')}</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            {t('pages.cookies.lastUpdated')}: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-xl prose prose-lg mx-auto">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold">{t('pages.cookies.section1.title')}</h2>
            <p className="text-gray-700">
              {t('pages.cookies.section1.content')}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold">{t('pages.cookies.section2.title')}</h2>
            <p className="text-gray-700">{t('pages.cookies.section2.intro')}</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>{t('pages.cookies.section2.item1')}</li>
              <li>{t('pages.cookies.section2.item2')}</li>
              <li>{t('pages.cookies.section2.item3')}</li>
              <li>{t('pages.cookies.section2.item4')}</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold">{t('pages.cookies.section3.title')}</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li><strong>{t('pages.cookies.section3.essentialTitle')}</strong>: {t('pages.cookies.section3.essentialDesc')}</li>
              <li><strong>{t('pages.cookies.section3.analyticsTitle')}</strong>: {t('pages.cookies.section3.analyticsDesc')}</li>
              <li><strong>{t('pages.cookies.section3.functionalTitle')}</strong>: {t('pages.cookies.section3.functionalDesc')}</li>
              <li><strong>{t('pages.cookies.section3.marketingTitle')}</strong>: {t('pages.cookies.section3.marketingDesc')}</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold">{t('pages.cookies.section4.title')}</h2>
            <p className="text-gray-700">
              {t('pages.cookies.section4.content1')}
            </p>
            <p className="text-gray-700">
              {t('pages.cookies.section4.content2')}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold">{t('pages.cookies.section5.title')}</h2>
            <p className="text-gray-700">
              {t('pages.cookies.section5.content')}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold">{t('pages.cookies.section6.title')}</h2>
            <p className="text-gray-700">
              {t('pages.cookies.section6.content')}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold">{t('pages.cookies.section7.title')}</h2>
            <p className="text-gray-700">
              {t('pages.cookies.section7.content')}{" "}
              <a href="mailto:admin@wizqo.com" className="text-blue-600 hover:text-blue-800 transition-colors">admin@wizqo.com</a>.
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}