import React from 'react';
import { UnifiedNavigation } from '../components/UnifiedNavigation';
import { Footer } from '../components/Footer';
import { useTranslation } from '../context/TranslationContext';
import { SEOMetaTags } from '../components/SEOMetaTags';

export function PrivacyPage() {
  const { t, isRTL } = useTranslation();
  
  React.useEffect(() => {
    // Ensure re-render on language change
  }, [t]);
  
  return (
    <div className="min-h-screen bg-slate-50" dir={isRTL ? 'rtl' : 'ltr'}>
      <SEOMetaTags
        title={t('pages.privacy.seoTitle')}
        description={t('pages.privacy.seoDescription')}
        canonicalUrl="https://wizqo.com/privacy"
      />
      <UnifiedNavigation currentPage="privacy" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-black text-slate-900 mb-6">
            {t('pages.privacy.title')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">{t('pages.privacy.policy')}</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            {t('pages.privacy.lastUpdated')}: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-xl prose prose-lg mx-auto">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('pages.privacy.section1.title')}</h2>
            <p className="text-gray-700 mb-4">
              {t('pages.privacy.section1.content')}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('pages.privacy.section2.title')}</h2>
            <p className="text-gray-700 mb-4">{t('pages.privacy.section2.intro')}</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>{t('pages.privacy.section2.item1')}</li>
              <li>{t('pages.privacy.section2.item2')}</li>
              <li>{t('pages.privacy.section2.item3')}</li>
              <li>{t('pages.privacy.section2.item4')}</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('pages.privacy.section3.title')}</h2>
            <p className="text-gray-700 mb-4">{t('pages.privacy.section3.intro')}</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>{t('pages.privacy.section3.item1')}</li>
              <li>{t('pages.privacy.section3.item2')}</li>
              <li>{t('pages.privacy.section3.item3')}</li>
              <li>{t('pages.privacy.section3.item4')}</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('pages.privacy.section4.title')}</h2>
            <p className="text-gray-700 mb-4">
              {t('pages.privacy.section4.content')}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('pages.privacy.section5.title')}</h2>
            <p className="text-gray-700 mb-4">
              {t('pages.privacy.section5.content')}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('pages.privacy.section6.title')}</h2>
            <p className="text-gray-700 mb-4">
              {t('pages.privacy.section6.content')}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('pages.privacy.section7.title')}</h2>
            <p className="text-gray-700 mb-4">
              {t('pages.privacy.section7.content')}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('pages.privacy.section8.title')}</h2>
            <p className="text-gray-700 mb-4">{t('pages.privacy.section8.intro')}</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>{t('pages.privacy.section8.item1')}</li>
              <li>{t('pages.privacy.section8.item2')}</li>
              <li>{t('pages.privacy.section8.item3')}</li>
              <li>{t('pages.privacy.section8.item4')}</li>
            </ul>
            <p className="text-gray-700 mt-4">{t('pages.privacy.section8.contact')} <a href="mailto:admin@wizqo.com" className="text-blue-600 hover:text-blue-800 transition-colors">admin@wizqo.com</a>.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('pages.privacy.section9.title')}</h2>
            <p className="text-gray-700 mb-4">
              {t('pages.privacy.section9.content')}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('pages.privacy.section10.title')}</h2>
            <p className="text-gray-700 mb-4">
              {t('pages.privacy.section10.content')}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('pages.privacy.section11.title')}</h2>
            <p className="text-gray-700">
              {t('pages.privacy.section11.content')}{" "}
              <a href="mailto:admin@wizqo.com" className="text-blue-600 hover:text-blue-800 transition-colors">
                admin@wizqo.com
              </a>.
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}