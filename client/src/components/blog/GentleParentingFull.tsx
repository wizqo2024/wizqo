import React, { useEffect, useRef } from 'react';
import { useTranslation } from '@/context/TranslationContext';

function loadChartJs(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof (window as any).Chart !== 'undefined') return resolve();
    const existing = document.querySelector('script[data-chartjs-cdn]') as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('Chart.js failed to load')));
      return;
    }
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/chart.js';
    s.async = true;
    s.defer = true;
    s.setAttribute('data-chartjs-cdn', 'true');
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('Chart.js failed to load'));
    document.head.appendChild(s);
  });
}

export function GentleParentingFull() {
  const { t, language } = useTranslation();
  const chartsRef = useRef<{ [k: string]: any }>({});
  const isRTL = language === 'ar';

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      try {
        await loadChartJs();
        if (!mounted) return;
        const Chart = (window as any).Chart;

        // Bar: Cooperation
        const coopCtx = (document.getElementById('cooperationBarChart') as HTMLCanvasElement | null)?.getContext('2d');
        if (coopCtx) {
          chartsRef.current.coop = new Chart(coopCtx, {
            type: 'bar',
            data: {
              labels: [
                t('pages.blog.components.gentleParentingFull.chartLabels.traditionalDiscipline').split(' '),
                t('pages.blog.components.gentleParentingFull.chartLabels.gentleParenting').split(' ')
              ],
              datasets: [{
                label: t('pages.blog.components.gentleParentingFull.chartLabels.cooperationRate'),
                data: [37.5, 60],
                backgroundColor: ['#B0BEC5', '#81C784'],
                borderColor: ['#B0BEC5', '#4CAF50'],
                borderWidth: 1,
                borderRadius: 4,
              }]
            },
            options: {
              maintainAspectRatio: false,
              indexAxis: 'y' as const,
              scales: {
                x: { beginAtZero: true, title: { display: true, text: t('pages.blog.components.gentleParentingFull.chartLabels.cooperationRate'), color: '#2E7D32' } },
                y: { grid: { display: false } }
              },
              plugins: {
                tooltip: {
                  backgroundColor: '#FFFFFF',
                  titleColor: '#333333',
                  bodyColor: '#333333',
                  borderColor: '#81C784',
                  borderWidth: 1,
                },
                legend: { display: false }
              }
            }
          });
        }

        // Donut: Tantrum reduction
        const tantrumCtx = (document.getElementById('tantrumDonutChart') as HTMLCanvasElement | null)?.getContext('2d');
        if (tantrumCtx) {
          chartsRef.current.tantrum = new Chart(tantrumCtx, {
            type: 'doughnut',
            data: {
              labels: [
                t('pages.blog.components.gentleParentingFull.chartLabels.tantrumsReduced'),
                t('pages.blog.components.gentleParentingFull.chartLabels.remainingBaseline')
              ],
              datasets: [{
                data: [42, 58],
                backgroundColor: ['#4CAF50', '#C8E6C9'],
                hoverBackgroundColor: ['#4CAF50', '#C8E6C9'],
                borderColor: '#FFFFFF',
                borderWidth: 4,
              }]
            },
            options: {
              maintainAspectRatio: false,
              cutout: '70%',
              plugins: {
                tooltip: {
                  backgroundColor: '#FFFFFF',
                  titleColor: '#333333',
                  bodyColor: '#333333',
                  borderColor: '#81C784',
                  borderWidth: 1,
                },
                legend: { display: false }
              }
            }
          });
        }

        // Donut: Cooperation gain
        const coopDonutCtx = (document.getElementById('cooperationDonutChart') as HTMLCanvasElement | null)?.getContext('2d');
        if (coopDonutCtx) {
          chartsRef.current.coopDonut = new Chart(coopDonutCtx, {
            type: 'doughnut',
            data: {
              labels: [
                t('pages.blog.components.gentleParentingFull.chartLabels.cooperationGained'),
                t('pages.blog.components.gentleParentingFull.chartLabels.baseline')
              ],
              datasets: [{
                data: [60, 40],
                backgroundColor: ['#81C784', '#C8E6C9'],
                hoverBackgroundColor: ['#81C784', '#C8E6C9'],
                borderColor: '#FFFFFF',
                borderWidth: 4,
              }]
            },
            options: {
              maintainAspectRatio: false,
              cutout: '70%',
              plugins: {
                tooltip: {
                  backgroundColor: '#FFFFFF',
                  titleColor: '#333333',
                  bodyColor: '#333333',
                  borderColor: '#81C784',
                  borderWidth: 1,
                },
                legend: { display: false }
              }
            }
          });
        }

        // Line: Tantrum over time
        const lineCtx = (document.getElementById('tantrumLineChart') as HTMLCanvasElement | null)?.getContext('2d');
        if (lineCtx) {
          chartsRef.current.line = new Chart(lineCtx, {
            type: 'line',
            data: {
              labels: [
                t('pages.blog.components.gentleParentingFull.chartLabels.week0'),
                t('pages.blog.components.gentleParentingFull.chartLabels.week1'),
                t('pages.blog.components.gentleParentingFull.chartLabels.week2'),
                t('pages.blog.components.gentleParentingFull.chartLabels.week3'),
                t('pages.blog.components.gentleParentingFull.chartLabels.week4')
              ],
              datasets: [{
                label: t('pages.blog.components.gentleParentingFull.chartLabels.weeklyTantrumIncidents'),
                data: [10, 8.5, 7.5, 6.5, 5.8],
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                borderColor: '#4CAF50',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#4CAF50',
                pointRadius: 5,
                pointHoverRadius: 7,
              }]
            },
            options: {
              maintainAspectRatio: false,
              scales: {
                y: { beginAtZero: false, title: { display: true, text: t('pages.blog.components.gentleParentingFull.chartLabels.avgTantrumIncidents'), color: '#2E7D32' } },
                x: { title: { display: true, text: t('pages.blog.components.gentleParentingFull.chartLabels.weeksApplyingTechniques'), color: '#2E7D32' } }
              },
              plugins: {
                tooltip: {
                  backgroundColor: '#FFFFFF',
                  titleColor: '#333333',
                  bodyColor: '#333333',
                  borderColor: '#81C784',
                  borderWidth: 1,
                },
                legend: { display: false }
              }
            }
          });
        }
      } catch (e) {
        // fail silently
      }
    };
    init();

    return () => {
      mounted = false;
      try {
        Object.values(chartsRef.current).forEach((c: any) => c?.destroy?.());
      } catch {}
    };
  }, [t]);

  return (
    <div className="space-y-16" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="text-center">
        <h1 className="text-4xl md:text-5xl font-black text-green-700 mb-3">
          {t('pages.blog.components.gentleParentingFull.headerTitle')}
        </h1>
        <p className="text-lg text-green-800">
          Because parenting isn’t about perfection — it’s about connection.
        </p>
      </header>

      {/* Table of Contents */}
      <section aria-labelledby="toc-title" className="max-w-4xl mx-auto w-full">
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-5">
          <h3 id="toc-title" className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/></svg>
            {t('pages.blog.components.gentleParentingFull.tocTitle')}
          </h3>
          <nav className="flex flex-wrap gap-3">
            <a href="#what-is-gentle-parenting" className="text-green-700 hover:underline">{t('pages.blog.components.gentleParentingFull.tocItems.whatIs')}</a>
            <a href="#the-science-connection-before-correction" className="text-green-700 hover:underline">{t('pages.blog.components.gentleParentingFull.tocItems.science')}</a>
            <a href="#five-gentle-parenting-techniques" className="text-green-700 hover:underline">{t('pages.blog.components.gentleParentingFull.tocItems.techniques')}</a>
            <a href="#the-real-world-impact-by-the-numbers" className="text-green-700 hover:underline">{t('pages.blog.components.gentleParentingFull.tocItems.impact')}</a>
            <a href="#common-myths-vs-reality" className="text-green-700 hover:underline">{t('pages.blog.components.gentleParentingFull.tocItems.myths')}</a>
            <a href="#you-can-start-today" className="text-green-700 hover:underline">{t('pages.blog.components.gentleParentingFull.tocItems.startToday')}</a>
          </nav>
        </div>
      </section>

      {/* What is Gentle Parenting */}
      <section>
        <div className="bg-white rounded-xl shadow-xl p-6 md:p-10 border border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 id="what-is-gentle-parenting" className="text-3xl font-bold text-green-700 mb-3">{t('pages.blog.components.gentleParentingFull.whatIsTitle')}</h2>
              <p className="mb-3">
                The goal of <strong>mindful parenting</strong> is not a “perfect” child. By applying
                <strong> gentle parenting techniques</strong>, you build a calmer, more connected relationship.
              </p>
              <p className="mb-3">{t('pages.blog.components.gentleParentingFull.whatIsText2')}</p>
              <ul className="space-y-2 mb-4">
                <li className="flex items-center"><span className={`text-2xl ${isRTL ? 'ml-3' : 'mr-3'}`}>🤝</span><strong className="text-green-800">{t('pages.blog.components.gentleParentingFull.respect')}</strong> {t('pages.blog.components.gentleParentingFull.respectOver')}</li>
                <li className="flex items-center"><span className={`text-2xl ${isRTL ? 'ml-3' : 'mr-3'}`}>🧭</span><strong className="text-green-800">{t('pages.blog.components.gentleParentingFull.guidance')}</strong> {t('pages.blog.components.gentleParentingFull.guidanceOver')}</li>
                <li className="flex items-center"><span className={`text-2xl ${isRTL ? 'ml-3' : 'mr-3'}`}>❤️</span><strong className="text-green-800">{t('pages.blog.components.gentleParentingFull.empathy')}</strong> {t('pages.blog.components.gentleParentingFull.empathyOver')}</li>
              </ul>
              <p>It’s not about letting kids “get away” with things. It’s about teaching
                <strong> emotional intelligence</strong> and problem‑solving in real time.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-center text-green-800 mb-2">{t('pages.blog.components.gentleParentingFull.studyTitle')}</h3>
              <p className="text-sm text-center mb-4">{t('pages.blog.components.gentleParentingFull.studyText')}</p>
              <div className="max-w-lg h-64 mx-auto">
                <canvas id="cooperationBarChart" aria-label="Bar chart: cooperation improvement" role="img"></canvas>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Science section */}
      <section>
        <h2 id="the-science-connection-before-correction" className="text-3xl font-bold text-green-700 mb-4 text-center">{t('pages.blog.components.gentleParentingFull.scienceTitle')}</h2>
        <div className="bg-white rounded-xl shadow-xl p-6 md:p-10 border border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="flex flex-col items-center">
              <p className="text-center mb-4">{t('pages.blog.components.gentleParentingFull.scienceText')}</p>
              <div className="w-full max-w-xs text-center">
                <div className="bg-green-300 text-green-900 font-semibold p-4 rounded-t-lg shadow-md">
                  {t('pages.blog.components.gentleParentingFull.upstairsBrain')}
                  <span className="block text-sm font-normal text-white">({t('pages.blog.components.gentleParentingFull.upstairsBrainDesc')})</span>
                </div>
                <div className="flex justify-center my-1">
                  <div className="w-1.5 h-16 bg-green-500"></div>
                </div>
                <div className="text-center -mt-3 mb-2">
                  <div className="inline-block w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-green-500"></div>
                </div>
                <div className="bg-green-500 text-white font-semibold p-4 rounded-b-lg shadow-md">
                  {t('pages.blog.components.gentleParentingFull.downstairsBrain')}
                  <span className="block text-sm font-normal">({t('pages.blog.components.gentleParentingFull.downstairsBrainDesc')})</span>
                </div>
              </div>
              <p className="text-center mt-4 font-semibold text-green-800">{t('pages.blog.components.gentleParentingFull.connectionFirst')}</p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-green-700 mb-2">{t('pages.blog.components.gentleParentingFull.realLifeExample')}</h3>
              <p className="mb-3">{t('pages.blog.components.gentleParentingFull.realLifeStory')}</p>
              <blockquote className="border-l-4 border-green-500 pl-4 py-2 text-green-800 italic">
                “You really don’t want to stop playing, right? It’s hard to leave something fun.”
              </blockquote>
              <p className="mt-3">{t('pages.blog.components.gentleParentingFull.realLifeResult')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Techniques grid */}
      <section>
        <h2 id="five-gentle-parenting-techniques" className="text-3xl font-bold text-green-700 mb-6 text-center">{t('pages.blog.components.gentleParentingFull.techniquesTitle')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            t('pages.blog.components.gentleParentingFull.technique1.title'),
            t('pages.blog.components.gentleParentingFull.technique2.title'),
            t('pages.blog.components.gentleParentingFull.technique3.title'),
            t('pages.blog.components.gentleParentingFull.technique4.title'),
            t('pages.blog.components.gentleParentingFull.technique5.title')
          ].map((title, idx) => (
            <div key={idx} className="bg-white p-6 rounded-lg shadow-lg border border-slate-200">
              <span className="text-4xl">{idx + 1}️⃣</span>
              <h3 className="text-xl font-bold text-green-800 my-2">{title}</h3>
              <p className="text-slate-700">
                {idx === 0 && t('pages.blog.components.gentleParentingFull.technique1.description')}
                {idx === 1 && '“You’re mad because your tower fell.” Empathy lowers defenses; kids who feel seen listen better.'}
                {idx === 2 && '“Blocks or books first?” Choices reduce power struggles — a mindful parenting win.'}
                {idx === 3 && '“I’m sorry I yelled.” Repair teaches accountability and that relationships can be fixed.'}
                {idx === 4 && '“I won’t let you hit, but I will help you calm down.” Firm limits with warmth build trust.'}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* By the numbers */}
      <section>
        <h2 id="the-real-world-impact-by-the-numbers" className="text-3xl font-bold text-green-700 mb-6 text-center">{t('pages.blog.components.gentleParentingFull.impactTitle')}</h2>
        <p className="text-center max-w-3xl mx-auto mb-8">
          {t('pages.blog.components.gentleParentingFull.impactText')}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-xl text-center border border-slate-200">
            <div className="max-w-xs mx-auto h-56">
              <canvas id="tantrumDonutChart" aria-label="Donut showing tantrum reduction" role="img"></canvas>
            </div>
            <h3 className="text-lg font-semibold text-green-800 mt-4">{t('pages.blog.components.gentleParentingFull.stat1Title')}</h3>
            <p className="text-sm">{t('pages.blog.components.gentleParentingFull.stat1Subtitle')}</p>
          </div>
          <div className="bg-green-600 text-white p-6 rounded-lg shadow-xl text-center">
            <span className="text-7xl font-bold">{t('pages.blog.components.gentleParentingFull.stat2Title')}</span>
            <h3 className="text-2xl font-semibold mt-2">{t('pages.blog.components.gentleParentingFull.stat2Subtitle')}</h3>
            <p className="text-sm">{t('pages.blog.components.gentleParentingFull.stat2Description')}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-xl text-center border border-slate-200">
            <div className="max-w-xs mx-auto h-56">
              <canvas id="cooperationDonutChart" aria-label="Donut showing cooperation gain" role="img"></canvas>
            </div>
            <h3 className="text-lg font-semibold text-green-800 mt-4">{t('pages.blog.components.gentleParentingFull.stat3Title')}</h3>
            <p className="text-sm">{t('pages.blog.components.gentleParentingFull.stat3Subtitle')}</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-xl p-6 md:p-8 border border-slate-200">
          <h3 className="text-2xl font-bold text-green-700 mb-4 text-center">{t('pages.blog.components.gentleParentingFull.trackingTitle')}</h3>
          <div className="max-w-3xl h-80 mx-auto">
            <canvas id="tantrumLineChart" aria-label="Line chart: tantrum reduction trend" role="img"></canvas>
          </div>
        </div>
      </section>

      {/* Myths vs Reality */}
      <section>
        <h2 id="common-myths-vs-reality" className="text-3xl font-bold text-green-700 mb-6 text-center">{t('pages.blog.components.gentleParentingFull.mythsTitle')}</h2>
        <div className="bg-white rounded-lg shadow-xl overflow-hidden border border-slate-200">
          <table className="w-full">
            <thead className="bg-green-500 text-white">
              <tr>
                <th className={`${isRTL ? 'text-right' : 'text-left'} p-4 text-lg w-1/2`}>❌ {t('pages.blog.components.gentleParentingFull.mythLabel')}</th>
                <th className={`${isRTL ? 'text-right' : 'text-left'} p-4 text-lg w-1/2`}>✅ {t('pages.blog.components.gentleParentingFull.realityLabel')}</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr className="hover:bg-green-50">
                <td className="p-4 font-semibold">“It’s too soft.”</td>
                <td className="p-4">It’s firm and consistent — just without fear tactics. This is the foundation of effective <strong>gentle parenting techniques</strong>.</td>
              </tr>
              <tr className="hover:bg-green-50">
                <td className="p-4 font-semibold">“Kids won’t respect you.”</td>
                <td className="p-4">{t('pages.blog.components.gentleParentingFull.reality2')}</td>
              </tr>
              <tr className="hover:bg-green-50">
                <td className="p-4 font-semibold">“It takes too long.”</td>
                <td className="p-4">It’s an investment: fewer battles now, more self‑discipline later.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center">
        <h2 id="you-can-start-today" className="text-3xl font-bold text-green-700 mb-4">{t('pages.blog.components.gentleParentingFull.startTodayTitle')}</h2>
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-xl border border-slate-200">
          <p className="mb-6">Nobody’s perfect. The beauty of gentle parenting is you can start today, even after tough moments. You’re not raising a “good” kid — you’re raising a kind, emotionally aware human.</p>
          <h3 className="text-xl font-semibold text-green-800 mb-3">{t('pages.blog.components.gentleParentingFull.startSmallTitle')}</h3>
          <ul className="space-y-3 text-left w-fit mx-auto">
            <li className="flex items-center text-green-800"><span className="text-green-800 text-2xl mr-3">🧘</span><span>{t('pages.blog.components.gentleParentingFull.tip1')}</span></li>
            <li className="flex items-center"><span className="text-green-700 text-2xl mr-3">🎧</span>{t('pages.blog.components.gentleParentingFull.tip2')}</li>
            <li className="flex items-center"><span className="text-green-700 text-2xl mr-3">💬</span>Validate feelings: “You’re sad it’s bedtime, huh?”</li>
            <li className="flex items-center"><span className="text-green-700 text-2xl mr-3">🤗</span>{t('pages.blog.components.gentleParentingFull.tip4')}</li>
          </ul>
        </div>
        <div className="mt-10">
          <h2 className="text-3xl font-bold text-green-700">{t('pages.blog.components.gentleParentingFull.progressOver')}</h2>
          <h2 className="text-3xl font-bold text-green-700 mt-1">{t('pages.blog.components.gentleParentingFull.connectionOver')}</h2>
        </div>
      </section>

      {/* Internal Links */}
      <section aria-labelledby="keep-exploring-title" className="max-w-4xl mx-auto w-full">
        <h2 id="keep-exploring-title" className="text-2xl font-bold text-green-700 mb-4">
          {t('pages.blog.components.gentleParentingFull.exploreTitle')}
        </h2>
        <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
          <a href="/kids" className="block p-4 rounded-lg border border-slate-200 bg-white hover:bg-slate-50">Kids Hub – Play, Print, and Learn</a>
          <a href="/worksheets/reading-comprehension" className="block p-4 rounded-lg border border-slate-200 bg-white hover:bg-slate-50">Reading Comprehension Worksheets</a>
          <a href="/worksheets/handwriting-worksheet-maker" className="block p-4 rounded-lg border border-slate-200 bg-white hover:bg-slate-50">Handwriting Worksheet Maker (Free PDF)</a>
          <a href="/blog/easy-hobbies-that-make-you-smarter" className="block p-4 rounded-lg border border-slate-200 bg-white hover:bg-slate-50">Easy Hobbies That Make You Smarter</a>
          <a href="/printables" className="block p-4 rounded-lg border border-slate-200 bg-white hover:bg-slate-50">Printables for Kids</a>
        </div>
      </section>
    </div>
  );
}

export default GentleParentingFull;
