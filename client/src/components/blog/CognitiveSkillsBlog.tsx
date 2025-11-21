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

export default function CognitiveSkillsBlog() {
  const { t } = useTranslation();
  const radarChartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<any>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await loadChartJs();
        if (!mounted || !radarChartRef.current) return;
        const Chart = (window as any).Chart;

        function hexToRgba(hex: string, alpha: number) {
          const r = parseInt(hex.slice(1, 3), 16);
          const g = parseInt(hex.slice(3, 5), 16);
          const b = parseInt(hex.slice(5, 7), 16);
          return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        }

        function wrapLabel(label: string) {
          const maxLen = 16;
          const words = label.split(' ');
          let lines: string[] = [];
          let currentLine = '';
          
          for (const word of words) {
            if ((currentLine + ' ' + word).trim().length > maxLen && currentLine.length > 0) {
              lines.push(currentLine.trim());
              currentLine = word;
            } else {
              if (currentLine.length === 0) {
                currentLine = word;
              } else {
                currentLine += ' ' + word;
              }
            }
          }
          lines.push(currentLine.trim());
          return lines;
        }

        function processLabels(labels: string[]) {
          return labels.map(label => label.length > 16 ? wrapLabel(label) : label);
        }

        const rawLabels = [
          t('pages.blog.components.cognitiveSkillsBlog.chartLabels.attention'),
          t('pages.blog.components.cognitiveSkillsBlog.chartLabels.logicReasoning'),
          t('pages.blog.components.cognitiveSkillsBlog.chartLabels.memory'),
          t('pages.blog.components.cognitiveSkillsBlog.chartLabels.processingSpeed'),
          t('pages.blog.components.cognitiveSkillsBlog.chartLabels.visualProcessing')
        ];
        
        const processedLabels = processLabels(rawLabels);

        if (chartInstanceRef.current) {
          chartInstanceRef.current.destroy();
        }

        chartInstanceRef.current = new Chart(radarChartRef.current.getContext('2d'), {
          type: 'radar',
          data: {
            labels: processedLabels,
            datasets: [{
              label: t('pages.blog.components.cognitiveSkillsBlog.chartLabel'),
              data: [5, 5, 5, 5, 5],
              fill: true,
              backgroundColor: hexToRgba('#43AA8B', 0.2),
              borderColor: '#43AA8B',
              pointBackgroundColor: '#43AA8B',
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: '#43AA8B'
            }]
          },
          options: {
            maintainAspectRatio: false,
            scales: {
              r: {
                suggestedMin: 0,
                suggestedMax: 5,
                ticks: {
                  stepSize: 1,
                  backdropColor: 'transparent'
                },
                pointLabels: {
                  font: {
                    size: 13,
                    weight: 'bold'
                  }
                },
                grid: {
                  color: '#E5E7EB'
                }
              }
            },
            plugins: {
              legend: {
                display: false
              },
              tooltip: {
                callbacks: {
                  title: function(tooltipItems: any) {
                    const item = tooltipItems[0];
                    let label = item.chart.data.labels[item.dataIndex];
                    if (Array.isArray(label)) {
                      return label.join(' ');
                    } else {
                      return label;
                    }
                  }
                }
              }
            }
          }
        });
      } catch (error) {
        console.error('Failed to load Chart.js:', error);
      }
    })();

    return () => {
      mounted = false;
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [t]);

  return (
    <div className="w-full py-8">
      <header className="text-center mb-12 md:mb-16">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 text-gray-900 leading-tight">
          {t('pages.blog.components.cognitiveSkillsBlog.headerTitle')}
        </h1>
        <p className="text-xl md:text-2xl italic text-gray-600 mb-8 max-w-4xl mx-auto">
          {t('pages.blog.components.cognitiveSkillsBlog.headerQuote')}
        </p>
        <p className="text-lg md:text-xl lg:text-2xl max-w-4xl mx-auto text-gray-800 leading-relaxed">
          {t('pages.blog.components.cognitiveSkillsBlog.headerDescription')}
        </p>
      </header>

      <main>
        <section className="mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-900">
            {t('pages.blog.components.cognitiveSkillsBlog.coreSkillsTitle')}
          </h2>
          <p className="text-lg md:text-xl text-center max-w-4xl mx-auto mb-10 text-gray-800 leading-relaxed">
            {t('pages.blog.components.cognitiveSkillsBlog.coreSkillsDescription')}
          </p>

          <div className="relative w-full max-w-3xl mx-auto mb-12 h-[350px] md:h-[450px]">
            <canvas ref={radarChartRef} id="radarChart"></canvas>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-10">
            <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 transform hover:scale-105 transition-transform duration-300">
              <span className="text-5xl block mb-3">🧠</span>
              <h3 className="text-2xl md:text-3xl font-bold my-3 text-gray-900">{t('pages.blog.components.cognitiveSkillsBlog.attention.title')}</h3>
              <p className="text-gray-700 mb-4 text-lg leading-relaxed">{t('pages.blog.components.cognitiveSkillsBlog.attention.description')}</p>
              <p className="font-semibold text-gray-800 text-lg"><strong>{t('pages.blog.components.cognitiveSkillsBlog.attention.improve')}</strong></p>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 transform hover:scale-105 transition-transform duration-300">
              <span className="text-5xl block mb-3">🧮</span>
              <h3 className="text-2xl md:text-3xl font-bold my-3 text-gray-900">{t('pages.blog.components.cognitiveSkillsBlog.logicReasoning.title')}</h3>
              <p className="text-gray-700 mb-4 text-lg leading-relaxed">{t('pages.blog.components.cognitiveSkillsBlog.logicReasoning.description')}</p>
              <p className="font-semibold text-gray-800 text-lg"><strong>{t('pages.blog.components.cognitiveSkillsBlog.logicReasoning.improve')}</strong></p>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 transform hover:scale-105 transition-transform duration-300">
              <span className="text-5xl block mb-3">🔁</span>
              <h3 className="text-2xl md:text-3xl font-bold my-3 text-gray-900">{t('pages.blog.components.cognitiveSkillsBlog.memory.title')}</h3>
              <p className="text-gray-700 mb-4 text-lg leading-relaxed">{t('pages.blog.components.cognitiveSkillsBlog.memory.description')}</p>
              <p className="font-semibold text-gray-800 text-lg"><strong>{t('pages.blog.components.cognitiveSkillsBlog.memory.improve')}</strong></p>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 transform hover:scale-105 transition-transform duration-300 lg:col-start-2">
              <span className="text-5xl block mb-3">⚡</span>
              <h3 className="text-2xl md:text-3xl font-bold my-3 text-gray-900">{t('pages.blog.components.cognitiveSkillsBlog.processingSpeed.title')}</h3>
              <p className="text-gray-700 mb-4 text-lg leading-relaxed">{t('pages.blog.components.cognitiveSkillsBlog.processingSpeed.description')}</p>
              <p className="font-semibold text-gray-800 text-lg"><strong>{t('pages.blog.components.cognitiveSkillsBlog.processingSpeed.improve')}</strong></p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 transform hover:scale-105 transition-transform duration-300">
              <span className="text-5xl block mb-3">👁️</span>
              <h3 className="text-2xl md:text-3xl font-bold my-3 text-gray-900">{t('pages.blog.components.cognitiveSkillsBlog.visualProcessing.title')}</h3>
              <p className="text-gray-700 mb-4 text-lg leading-relaxed">{t('pages.blog.components.cognitiveSkillsBlog.visualProcessing.description')}</p>
              <p className="font-semibold text-gray-800 text-lg"><strong>{t('pages.blog.components.cognitiveSkillsBlog.visualProcessing.improve')}</strong></p>
            </div>
          </div>
        </section>

        <section className="mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-900">
            {t('pages.blog.components.cognitiveSkillsBlog.proofTitle')}
          </h2>
          <p className="text-lg md:text-xl text-center max-w-4xl mx-auto mb-10 text-gray-700 leading-relaxed">
            {t('pages.blog.components.cognitiveSkillsBlog.proofDescription')}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-6 md:gap-8 mb-12">
            <div className="bg-red-50 rounded-lg shadow-md p-6 md:p-8 border-l-4 border-red-500">
              <h3 className="text-2xl md:text-3xl font-bold mb-4 text-red-600">{t('pages.blog.components.cognitiveSkillsBlog.beforeTitle')}</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 text-lg">
                {t('pages.blog.components.cognitiveSkillsBlog.beforeItems', { returnObjects: true }).map((item: string, idx: number) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
            
            <div className="text-5xl text-center text-gray-400 font-bold hidden md:block" aria-hidden="true">&rarr;</div>
            <div className="text-5xl text-center text-gray-400 font-bold md:hidden my-4" aria-hidden="true">&darr;</div>

            <div className="bg-green-50 rounded-lg shadow-md p-6 md:p-8 border-l-4 border-green-500">
              <h3 className="text-2xl md:text-3xl font-bold mb-4 text-green-600">{t('pages.blog.components.cognitiveSkillsBlog.afterTitle')}</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 text-lg">
                {t('pages.blog.components.cognitiveSkillsBlog.afterItems', { returnObjects: true }).map((item: string, idx: number) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg shadow-xl p-8 md:p-10 max-w-5xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">{t('pages.blog.components.cognitiveSkillsBlog.scienceTitle')}</h3>
            <p className="text-lg md:text-xl mb-4 opacity-90 leading-relaxed">
              {t('pages.blog.components.cognitiveSkillsBlog.scienceDescription')}
            </p>
            <p className="text-lg md:text-xl italic font-semibold opacity-100">
              {t('pages.blog.components.cognitiveSkillsBlog.scienceQuote')}
            </p>
          </div>
        </section>

        <section className="mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-900">
            {t('pages.blog.components.cognitiveSkillsBlog.challengeTitle')}
          </h2>
          <p className="text-lg md:text-xl text-center max-w-4xl mx-auto mb-10 text-gray-700 leading-relaxed">
            {t('pages.blog.components.cognitiveSkillsBlog.challengeDescription')}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 md:gap-6 mb-10">
            <div className="bg-white rounded-lg shadow-md p-5 md:p-6 text-center border-t-4 border-red-500">
              <div className="font-bold text-lg md:text-xl mb-2 text-red-600">{t('pages.blog.components.cognitiveSkillsBlog.monday.day')}</div>
              <span className="text-4xl md:text-5xl mb-3 block" role="img" aria-label="puzzle piece">🧩</span>
              <p className="text-gray-700 text-base md:text-lg">{t('pages.blog.components.cognitiveSkillsBlog.monday.activity')}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-5 md:p-6 text-center border-t-4 border-orange-500">
              <div className="font-bold text-lg md:text-xl mb-2 text-orange-600">{t('pages.blog.components.cognitiveSkillsBlog.tuesday.day')}</div>
              <span className="text-4xl md:text-5xl mb-3 block" role="img" aria-label="brain">🧠</span>
              <p className="text-gray-700 text-base md:text-lg">{t('pages.blog.components.cognitiveSkillsBlog.tuesday.activity')}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-5 md:p-6 text-center border-t-4 border-yellow-500">
              <div className="font-bold text-lg md:text-xl mb-2 text-yellow-600">{t('pages.blog.components.cognitiveSkillsBlog.wednesday.day')}</div>
              <span className="text-4xl md:text-5xl mb-3 block" role="img" aria-label="abacus">🔢</span>
              <p className="text-gray-700 text-base md:text-lg">{t('pages.blog.components.cognitiveSkillsBlog.wednesday.activity')}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-5 md:p-6 text-center border-t-4 border-yellow-400">
              <div className="font-bold text-lg md:text-xl mb-2 text-yellow-500">{t('pages.blog.components.cognitiveSkillsBlog.thursday.day')}</div>
              <span className="text-4xl md:text-5xl mb-3 block" role="img" aria-label="books">📚</span>
              <p className="text-gray-700 text-base md:text-lg">{t('pages.blog.components.cognitiveSkillsBlog.thursday.activity')}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-5 md:p-6 text-center border-t-4 border-green-500">
              <div className="font-bold text-lg md:text-xl mb-2 text-green-600">{t('pages.blog.components.cognitiveSkillsBlog.friday.day')}</div>
              <span className="text-4xl md:text-5xl mb-3 block" role="img" aria-label="artist palette">🎨</span>
              <p className="text-gray-700 text-base md:text-lg">{t('pages.blog.components.cognitiveSkillsBlog.friday.activity')}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-5 md:p-6 text-center border-t-4 border-teal-500">
              <div className="font-bold text-lg md:text-xl mb-2 text-teal-600">{t('pages.blog.components.cognitiveSkillsBlog.saturday.day')}</div>
              <span className="text-4xl md:text-5xl mb-3 block" role="img" aria-label="thought bubble">💭</span>
              <p className="text-gray-700 text-base md:text-lg">{t('pages.blog.components.cognitiveSkillsBlog.saturday.activity')}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-5 md:p-6 text-center border-t-4 border-blue-500">
              <div className="font-bold text-lg md:text-xl mb-2 text-blue-600">{t('pages.blog.components.cognitiveSkillsBlog.sunday.day')}</div>
              <span className="text-4xl md:text-5xl mb-3 block" role="img" aria-label="sparkles">🌟</span>
              <p className="text-gray-700 text-base md:text-lg">{t('pages.blog.components.cognitiveSkillsBlog.sunday.activity')}</p>
            </div>
          </div>
        </section>

        <footer className="mt-16 text-center max-w-4xl mx-auto bg-white p-8 md:p-10 rounded-lg shadow-xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-red-600">
            {t('pages.blog.components.cognitiveSkillsBlog.footerTitle')}
          </h2>
          <p className="text-xl md:text-2xl mb-6 text-gray-700 leading-relaxed">
            {t('pages.blog.components.cognitiveSkillsBlog.footerDescription')}
          </p>
          <p className="text-2xl md:text-3xl italic font-semibold text-gray-800 mb-8">
            {t('pages.blog.components.cognitiveSkillsBlog.footerQuote')}
          </p>
          <a 
            href="https://wizqo.com/interactive-worksheets-generator" 
            className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 md:px-10 py-4 md:py-5 rounded-lg text-lg md:text-xl font-bold hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
          >
            {t('pages.blog.components.cognitiveSkillsBlog.footerLink')}
          </a>
        </footer>
      </main>
    </div>
  );
}
