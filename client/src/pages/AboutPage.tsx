import React from 'react';
import { UnifiedNavigation } from '../components/UnifiedNavigation';
import { Footer } from '../components/Footer';
import { useTranslation } from '@/context/TranslationContext';

export function AboutPage() {
  const { t, language, isRTL } = useTranslation()
  React.useEffect(() => {}, [language])
  
  return (
    <div className="min-h-screen bg-slate-50" dir={isRTL ? 'rtl' : 'ltr'}>
      <UnifiedNavigation currentPage="about" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-black text-slate-900 mb-6">
            {t('pages.about.title')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">Wizqo</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            {t('pages.about.subtitle')}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-xl prose prose-lg mx-auto">
          <div className="text-gray-900">
            <p className="text-lg mb-6 text-gray-700">
              {t('pages.about.intro')}
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-2">{t('pages.about.mission.title')}</h2>
            <p className="mb-4 text-gray-700">
              {t('pages.about.mission.description')}
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-2">{t('pages.about.different.title')}</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>{t('pages.about.different.items.free')}</strong></li>
              <li><strong>{t('pages.about.different.items.answerKeys')}</strong></li>
              <li><strong>{t('pages.about.different.items.allGrades')}</strong></li>
              <li><strong>{t('pages.about.different.items.multipleSubjects')}</strong></li>
              <li><strong>{t('pages.about.different.items.generator')}</strong></li>
              <li><strong>{t('pages.about.different.items.printablePDFs')}</strong></li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-2">{t('pages.about.whoWeHelp.title')}</h2>
            <p className="mb-4 text-gray-700">
              <strong>{t('pages.about.whoWeHelp.teachers')}</strong><br/><br/>
              <strong>{t('pages.about.whoWeHelp.parents')}</strong><br/><br/>
              <strong>{t('pages.about.whoWeHelp.homeschoolers')}</strong><br/><br/>
              <strong>{t('pages.about.whoWeHelp.students')}</strong>
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-2">{t('pages.about.aiPlans.title')}</h2>
            <p className="mb-8 text-gray-700">
              {t('pages.about.aiPlans.description')}
            </p>

            <p className="text-base text-gray-600">
              {t('pages.about.ready')}{' '}
              <a href="/printables" className="text-blue-600 hover:text-blue-800 transition-colors">{t('pages.about.explorePrintables')}</a>{' '}or{' '}
              <a href="/blog" className="text-blue-600 hover:text-blue-800 transition-colors">{t('pages.about.readBlog')}</a>.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-emerald-800">
              <span className="text-xs uppercase tracking-wide font-semibold">{t('pages.about.trustedBy')}</span>
              <a href="https://www.trustpilot.com/review/wizqo.com" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-900 text-sm font-medium">{t('pages.about.seeReviews')}</a>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}