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

export default function HWTInfographic() {
  const { t } = useTranslation();
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<any>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await loadChartJs();
        if (!mounted) return;
        const Chart = (window as any).Chart;
        const ctx = chartRef.current?.getContext('2d');
        if (!ctx) return;
        
        // Destroy existing chart if it exists
        if (chartInstanceRef.current) {
          try {
            chartInstanceRef.current.destroy();
          } catch {}
        }

        // Multi-line labels helper (wraps for readability)
        const wrap = (label: string, max = 22) => {
          const words = label.split(' ');
          const lines: string[] = [];
          let cur = '';
          for (const w of words) {
            const test = (cur + ' ' + w).trim();
            if (test.length > max && cur) {
              lines.push(cur);
              cur = w;
            } else {
              cur = test;
            }
          }
          if (cur) lines.push(cur);
          return lines;
        };

        const fineMotorLabel = t('pages.blog.components.hwtInfographic.chartLabels.fineMotor') || 'Fine Motor Control';
        const letterFormationLabel = t('pages.blog.components.hwtInfographic.chartLabels.letterFormation') || 'Letter Formation Accuracy';
        const fluencyLabel = t('pages.blog.components.hwtInfographic.chartLabels.fluency') || 'Writing Fluency and Speed';
        const improvementLabel = t('pages.blog.components.hwtInfographic.chartLabels.improvement') || '% Improvement';
        const chartTitle = t('pages.blog.components.hwtInfographic.chartLabels.chartTitle') || 'Student Improvement with HWT (2023 AOTA Study)';
        
        chartInstanceRef.current = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: [
              wrap(fineMotorLabel),
              wrap(letterFormationLabel),
              wrap(fluencyLabel)
            ],
            datasets: [{
              label: improvementLabel,
              data: [35, 48, 40],
              backgroundColor: ['#06D6A0', '#118AB2', '#FFD166'],
              borderColor: ['#06D6A0', '#118AB2', '#FFD166'],
              borderWidth: 1,
              borderRadius: 6,
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: improvementLabel,
                  color: '#073B4C',
                },
                ticks: { color: '#073B4C' },
                grid: { color: '#e2e8f0' },
              },
              x: {
                ticks: { color: '#073B4C' },
                grid: { display: false },
              }
            },
            plugins: {
              legend: { display: false },
              title: {
                display: true,
                text: chartTitle,
                color: '#073B4C',
              },
              tooltip: {
                backgroundColor: '#073B4C',
                callbacks: {
                  title: (items: any[]) => {
                    const it = items?.[0];
                    const label = it?.chart?.data?.labels?.[it?.dataIndex];
                    return Array.isArray(label) ? label.join(' ') : label;
                  }
                }
              }
            }
          }
        });

        // Donut (composition placeholder)
        const donutCtx = (document.getElementById('hwt-composition') as HTMLCanvasElement | null)?.getContext('2d');
        if (donutCtx) {
          const tactileLabel = t('pages.blog.components.hwtInfographic.chartLabels.tactilePlay') || 'Tactile Play (Sensory)';
          const pencilLabel = t('pages.blog.components.hwtInfographic.chartLabels.pencilPractice') || 'Pencil Practice';
          const warmupLabel = t('pages.blog.components.hwtInfographic.chartLabels.warmup') || 'Warm-up (Gross Motor)';
          const reviewLabel = t('pages.blog.components.hwtInfographic.chartLabels.review') || 'Review & Reflection';
          const compositionTitle = t('pages.blog.components.hwtInfographic.chartLabels.compositionTitle') || 'Ideal Session Time Allocation (Placeholder)';
          // @ts-ignore
          new Chart(donutCtx, {
            type: 'doughnut',
            data: {
              labels: [tactileLabel, pencilLabel, warmupLabel, reviewLabel],
              datasets: [{
                data: [40, 30, 20, 10],
                backgroundColor: ['#FF6B6B', '#FFD166', '#06D6A0', '#118AB2'],
                hoverOffset: 8,
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: true, position: 'bottom' as const },
                title: { display: true, text: compositionTitle, color: '#073B4C' }
              }
            }
          });
        }

        // Line (trend placeholder)
        const lineCtx = (document.getElementById('hwt-trend') as HTMLCanvasElement | null)?.getContext('2d');
        if (lineCtx) {
          const monthLabel = t('pages.blog.components.hwtInfographic.chartLabels.month') || 'Month';
          const averageScoreLabel = t('pages.blog.components.hwtInfographic.chartLabels.averageScore') || 'Average Score (0–100)';
          const scoreLabel = t('pages.blog.components.hwtInfographic.chartLabels.score') || 'Score (0–100)';
          const trendTitle = t('pages.blog.components.hwtInfographic.chartLabels.trendTitle') || '6-Month Score Improvement Trend (Placeholder)';
          // @ts-ignore
          new Chart(lineCtx, {
            type: 'line',
            data: {
              labels: [`${monthLabel} 1`, `${monthLabel} 2`, `${monthLabel} 3`, `${monthLabel} 4`, `${monthLabel} 5`, `${monthLabel} 6`],
              datasets: [{
                label: averageScoreLabel,
                data: [55, 62, 70, 78, 85, 90],
                borderColor: '#FF6B6B',
                backgroundColor: 'rgba(255,107,107,0.25)',
                tension: 0.4,
                fill: true,
                pointRadius: 4,
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false }, title: { display: true, text: trendTitle, color: '#073B4C' } },
              scales: {
                y: { beginAtZero: true, max: 100, title: { display: true, text: scoreLabel }, grid: { color: '#e2e8f0' }, ticks: { color: '#073B4C' } },
                x: { grid: { display: false }, ticks: { color: '#073B4C' } }
              }
            }
          });
        }
      } catch {}
    })();
    return () => {
      mounted = false;
      try { chartInstanceRef.current?.destroy?.(); } catch {}
    };
  }, [t]);

  return (
    <div className="space-y-16">
      {/* Header + Intro */}
      <header className="text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-3">{t('pages.blog.components.hwtInfographic.headerTitle')}</h1>
        <h2 className="text-xl md:text-2xl font-semibold text-slate-700 max-w-4xl mx-auto">{t('pages.blog.components.hwtInfographic.headerSubtitle')}</h2>
        <p className="mt-6 text-lg text-slate-700 max-w-3xl mx-auto">
          {t('pages.blog.components.hwtInfographic.headerDescription')}
        </p>
      </header>

      {/* Philosophy */}
      <section>
        <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">{t('pages.blog.components.hwtInfographic.philosophyTitle')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: '😊', title: t('pages.blog.components.hwtInfographic.philosophyConfidence.title'), body: t('pages.blog.components.hwtInfographic.philosophyConfidence.body') },
            { icon: '🖐️', title: t('pages.blog.components.hwtInfographic.philosophySenses.title'), body: t('pages.blog.components.hwtInfographic.philosophySenses.body') },
            { icon: '🌿', title: t('pages.blog.components.hwtInfographic.philosophySimplify.title'), body: t('pages.blog.components.hwtInfographic.philosophySimplify.body') },
          ].map((c, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6 text-center">
              <div className="text-5xl" aria-hidden>{c.icon}</div>
              <h3 className="text-xl font-semibold mt-4 mb-2">{c.title}</h3>
              <p className="text-slate-700">{c.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Science */}
      <section>
        <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">{t('pages.blog.components.hwtInfographic.scienceTitle')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: '🧠', title: t('pages.blog.components.hwtInfographic.scienceMemory.title'), body: t('pages.blog.components.hwtInfographic.scienceMemory.body') },
            { icon: '🔁', title: t('pages.blog.components.hwtInfographic.scienceRepetition.title'), body: t('pages.blog.components.hwtInfographic.scienceRepetition.body') },
            { icon: '❤️', title: t('pages.blog.components.hwtInfographic.scienceStress.title'), body: t('pages.blog.components.hwtInfographic.scienceStress.body') },
          ].map((c, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6 text-center">
              <div className="text-5xl" aria-hidden>{c.icon}</div>
              <h3 className="text-xl font-semibold mt-4 mb-2">{c.title}</h3>
              <p className="text-slate-700">{c.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Real-world example */}
      <section>
        <div className="bg-green-50 rounded-xl shadow p-6 md:p-8 border-l-8 border-green-300 max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold mb-3 text-slate-900">{t('pages.blog.components.hwtInfographic.exampleTitle')}</h3>
          <p className="text-lg text-slate-800 italic">
            “After six weeks of sensory-based exercises — tracing letters in sand, shaping them with dough, and singing through steps — Sam’s handwriting became legible and he smiled every time he picked up a pencil.”
          </p>
        </div>
      </section>

      {/* Study Chart */}
      <section>
        <div className="bg-white rounded-lg shadow p-6 md:p-10">
          <h2 className="text-3xl font-bold text-center mb-2">{t('pages.blog.components.hwtInfographic.impactTitle')}</h2>
          <p className="text-lg text-slate-700 mb-6 text-center max-w-3xl mx-auto">{t('pages.blog.components.hwtInfographic.impactDescription')}</p>
          <div className="relative w-full max-w-2xl mx-auto h-[320px] md:h-[420px]">
            <canvas ref={chartRef} aria-label="Bar chart: student improvement with HWT" role="img" />
          </div>
          <p className="text-center text-slate-600 mt-4 italic">{t('pages.blog.components.hwtInfographic.impactNote')}</p>
        </div>
      </section>

      {/* Composition Donut (placeholder) */}
      <section>
        <div className="bg-white rounded-lg shadow p-6 md:p-10">
          <h2 className="text-3xl font-bold text-center mb-2">{t('pages.blog.components.hwtInfographic.compositionTitle')}</h2>
          <p className="text-lg text-slate-700 mb-6 text-center max-w-3xl mx-auto">{t('pages.blog.components.hwtInfographic.compositionDescription')}</p>
          <div className="relative w-full max-w-2xl mx-auto h-[340px]">
            <canvas id="hwt-composition" aria-label="Donut chart: session time allocation" role="img" />
          </div>
          <p className="text-center text-amber-600 mt-3 italic">{t('pages.blog.components.hwtInfographic.compositionNote')}</p>
        </div>
      </section>

      {/* Trend Line (placeholder) */}
      <section>
        <div className="bg-white rounded-lg shadow p-6 md:p-10">
          <h2 className="text-3xl font-bold text-center mb-2">{t('pages.blog.components.hwtInfographic.trendTitle')}</h2>
          <p className="text-lg text-slate-700 mb-6 text-center max-w-3xl mx-auto">{t('pages.blog.components.hwtInfographic.trendDescription')}</p>
          <div className="relative w-full max-w-3xl mx-auto h-[380px]">
            <canvas id="hwt-trend" aria-label="Line chart: writing score trend" role="img" />
          </div>
          <p className="text-center text-amber-600 mt-3 italic">{t('pages.blog.components.hwtInfographic.trendNote')}</p>
        </div>
      </section>

      {/* Steps */}
      <section>
        <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">{t('pages.blog.components.hwtInfographic.stepsTitle')}</h2>
        <div className="max-w-2xl mx-auto flex flex-col items-center">
          {[
            { h: t('pages.blog.components.hwtInfographic.step1.title'), b: t('pages.blog.components.hwtInfographic.step1.body') },
            { h: t('pages.blog.components.hwtInfographic.step2.title'), b: t('pages.blog.components.hwtInfographic.step2.body') },
            { h: t('pages.blog.components.hwtInfographic.step3.title'), b: t('pages.blog.components.hwtInfographic.step3.body') },
            { h: t('pages.blog.components.hwtInfographic.step4.title'), b: t('pages.blog.components.hwtInfographic.step4.body') },
            { h: t('pages.blog.components.hwtInfographic.step5.title'), b: t('pages.blog.components.hwtInfographic.step5.body') },
          ].map((s, i, arr) => (
            <React.Fragment key={i}>
              <div className="bg-white rounded-lg shadow p-6 w-full text-center">
                <h3 className="text-xl font-semibold text-slate-800">{s.h}</h3>
                <p className="text-slate-700 mt-1">{s.b}</p>
              </div>
              {i < arr.length - 1 && (
                <div className="text-slate-400 text-4xl my-2" aria-hidden>↓</div>
              )}
            </React.Fragment>
          ))}
        </div>
        <figure className="max-w-3xl mx-auto mt-6">
          <img
            src="https://images.unsplash.com/photo-1613289720033-c79deb7d3fca?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=736"
            alt="Handwriting practice tools laid out for step-by-step learning"
            className="w-full rounded-xl border border-slate-200 object-cover max-h-72 md:max-h-96"
            loading="lazy"
            decoding="async"
            sizes="(min-width: 1024px) 900px, 100vw"
          />
        </figure>
      </section>

      {/* Tips */}
      <section>
        <div className="bg-white rounded-lg shadow p-6 md:p-10 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-6">{t('pages.blog.components.hwtInfographic.homeTitle')}</h2>
          <ul className="space-y-4">
            {[
              { t: t('pages.blog.components.hwtInfographic.homeTip1.title'), b: t('pages.blog.components.hwtInfographic.homeTip1.body') },
              { t: t('pages.blog.components.hwtInfographic.homeTip2.title'), b: t('pages.blog.components.hwtInfographic.homeTip2.body') },
              { t: t('pages.blog.components.hwtInfographic.homeTip3.title'), b: t('pages.blog.components.hwtInfographic.homeTip3.body') },
              { t: t('pages.blog.components.hwtInfographic.homeTip4.title'), b: 'Always prioritize and praise effort over perfection. “I love how you finished that letter!”' },
              { t: 'End with a “Writing Win”', b: t('pages.blog.components.hwtInfographic.homeTip5.body') },
            ].map((tip, i) => (
              <li key={i} className="flex items-start">
                <span className="text-2xl mr-3" aria-hidden>✅</span>
                <span className="text-slate-700"><strong className="font-semibold">{tip.t}:</strong> {tip.b}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Why it works + How to start */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6 md:p-8 border-t-4 border-t-amber-300">
            <h2 className="text-3xl font-bold mb-4 text-slate-900">{t('pages.blog.components.hwtInfographic.whyTitle')}</h2>
            <p className="text-slate-700">Parents, teachers, therapists, and adults all benefit. Whether it’s first letters or retraining after years on a keyboard, HWT brings clarity and calm.</p>
            <p className="text-slate-700 mt-3 font-semibold">It’s not about handwriting — it’s about confidence in communication.</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 md:p-8 border-t-4 border-t-emerald-400">
            <h2 className="text-3xl font-bold mb-4 text-slate-900">{t('pages.blog.components.hwtInfographic.howTitle')}</h2>
            <ul className="space-y-2 text-slate-700">
              <li>• {t('pages.blog.components.hwtInfographic.howTip1')}</li>
              <li>• {t('pages.blog.components.hwtInfographic.howTip2')}</li>
              <li>• {t('pages.blog.components.hwtInfographic.howTip3')}</li>
              <li>• {t('pages.blog.components.hwtInfographic.howTip4')}</li>
              <li>• End with a “writing win”.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Related links */}
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-3">{t('pages.blog.components.hwtInfographic.exploreTitle')}</h2>
        <ul className="grid sm:grid-cols-2 gap-2 text-purple-700 text-sm">
          <li><a className="hover:underline" href="/worksheets/handwriting-worksheet-maker">{t('pages.blog.components.hwtInfographic.exploreLink1')}</a></li>
          <li><a className="hover:underline" href="/worksheets/1st-grade-math-worksheets">{t('pages.blog.components.hwtInfographic.exploreLink2')}</a></li>
          <li><a className="hover:underline" href="/worksheets/reading-comprehension">{t('pages.blog.components.hwtInfographic.exploreLink3')}</a></li>
          <li><a className="hover:underline" href="/printables">{t('pages.blog.components.hwtInfographic.exploreLink4')}</a></li>
        </ul>
      </section>

      {/* Footer tagline */}
      <section className="text-center py-6">
        <div className="text-3xl" aria-hidden>✨</div>
        <p className="text-2xl md:text-3xl font-bold mt-2">{t('pages.blog.components.hwtInfographic.footerLine1')}</p>
        <p className="text-2xl md:text-3xl font-bold">{t('pages.blog.components.hwtInfographic.footerLine2')}</p>
      </section>
    </div>
  );
}
