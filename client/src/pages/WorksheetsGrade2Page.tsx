import React from 'react'
import { useTranslation } from '@/context/TranslationContext'

export default function WorksheetsGrade2Page() {
  const { t, isRTL } = useTranslation();
  const [packTime, setPackTime] = React.useState('5')
  
  React.useEffect(() => {
    // Ensure re-render on language change
  }, [t]);
  
  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="mb-4 print:hidden">
        <a href="/printables" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm" aria-label={t('pages.grade2.backToPrintablesAria')}>
          <span>←</span>
          <span>{t('pages.grade2.backToPrintables')}</span>
        </a>
      </div>
      <header className="mb-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">{t('pages.grade2.title')}</h1>
        <p className="text-slate-700 mt-3 max-w-3xl">{t('pages.grade2.description')}</p>
        
      </header>

      <section className="space-y-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <h2 className="text-lg font-semibold text-slate-900 mb-2">{t('pages.grade2.whatsInside')}</h2>
          <p className="text-slate-700">{t('pages.grade2.whatsInsideDesc')}</p>
          <div className="mt-4 print:hidden">
            <h3 className="text-sm font-semibold text-slate-900 mb-2">{t('pages.grade2.buildPack')}</h3>
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <label className="text-sm text-slate-600">{t('pages.grade2.time')}
                <select value={packTime} onChange={(e)=>setPackTime(e.target.value)} className="ml-2 px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white">
                  <option value="5">{t('pages.grade2.time5')}</option>
                  <option value="10">{t('pages.grade2.time10')}</option>
                  <option value="15">{t('pages.grade2.time15')}</option>
                </select>
              </label>
              <button
                onClick={() => { try { window.location.href = `/print?doc=pack&time=${packTime}&age=68&skill=focus` } catch {} }}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                aria-label={t('pages.grade2.buildPackAria')}
              >
                {t('pages.printables.buildPackButton')}
              </button>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <h2 className="text-lg font-semibold text-slate-900">{t('pages.grade2.numberSense')}</h2>
          <ul className="grid sm:grid-cols-2 gap-3 text-slate-800">
            <li><a className="block border border-slate-200 rounded-lg p-3 bg-white hover:bg-slate-50" href="/print?doc=ten-frames-1-20">{t('pages.grade2.tenFrames')} →</a></li>
            <li><a className="block border border-slate-200 rounded-lg p-3 bg-white hover:bg-slate-50" href="/print?doc=number-tracing-1-20">{t('pages.grade2.numberTracing')} →</a></li>
          </ul>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <h2 className="text-lg font-semibold text-slate-900">{t('pages.grade2.additionSubtraction')}</h2>
          <ul className="grid sm:grid-cols-2 gap-3 text-slate-800">
            <li><a className="block border border-slate-200 rounded-lg p-3 bg-white hover:bg-slate-50" href="/print?doc=addition-subtraction-0-10">{t('pages.grade2.addSubWithin10')} →</a></li>
            <li><a className="block border border-slate-200 rounded-lg p-3 bg-white hover:bg-slate-50" href="/print?doc=math-maze">{t('pages.grade2.mathMaze')} →</a></li>
          </ul>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <h2 className="text-lg font-semibold text-slate-900">{t('pages.grade2.fluencyBoosters')}</h2>
          <ul className="grid sm:grid-cols-2 gap-3 text-slate-800">
            <li><a className="block border border-slate-200 rounded-lg p-3 bg-white hover:bg-slate-50" href="/print?doc=dot-to-dot-1-20">{t('pages.grade2.skipCounting')} →</a></li>
            <li><a className="block border border-slate-200 rounded-lg p-3 bg-white hover:bg-slate-50" href="/print?doc=spot-difference">{t('pages.grade2.spotDifference')} →</a></li>
          </ul>
        </div>
        
      </section>

      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-4">
        <h2 className="text-lg font-semibold text-slate-900">{t('pages.grade2.faqs')}</h2>
        <dl className="mt-3 space-y-3 text-slate-800">
          <div>
            <dt className="font-semibold">{t('pages.grade2.faq1Question')}</dt>
            <dd>{t('pages.grade2.faq1Answer')}</dd>
          </div>
          <div>
            <dt className="font-semibold">{t('pages.grade2.faq2Question')}</dt>
            <dd>{t('pages.grade2.faq2Answer')}</dd>
          </div>
          <div>
            <dt className="font-semibold">{t('pages.grade2.faq3Question')}</dt>
            <dd>{t('pages.grade2.faq3Answer')}</dd>
          </div>
        </dl>
      </section>
    </main>
  )
}
