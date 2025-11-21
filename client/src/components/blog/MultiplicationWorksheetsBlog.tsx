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

export default function MultiplicationWorksheetsBlog() {
  const { t, language } = useTranslation();
  const retentionChartRef = useRef<HTMLCanvasElement | null>(null);
  const worksheetChartRef = useRef<HTMLCanvasElement | null>(null);
  const retentionChartInstanceRef = useRef<any>(null);
  const worksheetChartInstanceRef = useRef<any>(null);
  const isRTL = language === 'ar';

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await loadChartJs();
        if (!mounted) return;
        const Chart = (window as any).Chart;
        const chartColors = ['#3B82F6', '#F59E0B', '#10B981', '#EF4444', '#8B5CF6'];

        function wrapLabel(label: string, maxWidth: number) {
          if (label.length <= maxWidth) {
            return label;
          }
          const words = label.split(' ');
          const lines: string[] = [];
          let currentLine = '';
          for (const word of words) {
            if ((currentLine + word).length > maxWidth) {
              lines.push(currentLine.trim());
              currentLine = '';
            }
            currentLine += word + ' ';
          }
          lines.push(currentLine.trim());
          return lines;
        }

        const chartTooltipOptions = {
          callbacks: {
            title: function(tooltipItems: any[]) {
              const item = tooltipItems[0];
              let label = item.chart.data.labels[item.dataIndex];
              if (Array.isArray(label)) {
                return label.join(' ');
              } else {
                return label;
              }
            }
          }
        };

        // Retention Chart
        const ctxRetention = retentionChartRef.current?.getContext('2d');
        if (ctxRetention) {
          const labels = [
            t('pages.blog.components.multiplicationWorksheetsBlog.chartLabels.readingWatching'),
            t('pages.blog.components.multiplicationWorksheetsBlog.chartLabels.listening'),
            t('pages.blog.components.multiplicationWorksheetsBlog.chartLabels.writingWorksheets'),
            t('pages.blog.components.multiplicationWorksheetsBlog.chartLabels.teachingOthers')
          ];
          const wrappedLabels = labels.map(l => wrapLabel(l, 16));
          retentionChartInstanceRef.current = new Chart(ctxRetention, {
            type: 'bar',
            data: {
              labels: wrappedLabels,
              datasets: [{
                label: t('pages.blog.components.multiplicationWorksheetsBlog.chartLabels.retentionRate'),
                data: [20, 30, 70, 90],
                backgroundColor: chartColors,
                borderColor: chartColors.map(color => color + 'B3'),
                borderWidth: 1
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false
                },
                tooltip: chartTooltipOptions
              },
              scales: {
                y: {
                  beginAtZero: true,
                  max: 100,
                  ticks: {
                    callback: function(value: any) {
                      return value + '%'
                    }
                  }
                }
              }
            }
          });
        }

        // Worksheet Chart
        const ctxWorksheet = worksheetChartRef.current?.getContext('2d');
        if (ctxWorksheet) {
          const sortedData = [
            { label: t('pages.blog.components.multiplicationWorksheetsBlog.chartLabels.basicTimesTables'), difficulty: 1 },
            { label: t('pages.blog.components.multiplicationWorksheetsBlog.chartLabels.colorByNumber'), difficulty: 1 },
            { label: t('pages.blog.components.multiplicationWorksheetsBlog.chartLabels.doubleDigit'), difficulty: 2 },
            { label: t('pages.blog.components.multiplicationWorksheetsBlog.chartLabels.wordProblems'), difficulty: 2 },
            { label: t('pages.blog.components.multiplicationWorksheetsBlog.chartLabels.timedChallenges'), difficulty: 3 },
          ].sort((a, b) => a.difficulty - b.difficulty);

          const wrappedLabels = sortedData.map(d => wrapLabel(d.label, 16));
          const difficultyData = sortedData.map(d => d.difficulty);

          worksheetChartInstanceRef.current = new Chart(ctxWorksheet, {
            type: 'bar',
            data: {
              labels: wrappedLabels,
              datasets: [{
                label: t('pages.blog.components.multiplicationWorksheetsBlog.chartLabels.difficultyRating'),
                data: difficultyData,
                backgroundColor: chartColors,
                borderColor: chartColors.map(color => color + 'B3'),
                borderWidth: 1
              }]
            },
            options: {
              indexAxis: 'y',
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false
                },
                tooltip: chartTooltipOptions
              },
              scales: {
                x: {
                  beginAtZero: true,
                  max: 3,
                  ticks: {
                    stepSize: 1,
                    callback: function(value: any) {
                      return '⭐'.repeat(value) || 'Start';
                    }
                  }
                }
              }
            }
          });
        }
      } catch (err) {
        console.error('Failed to load charts:', err);
      }
    })();

    return () => {
      mounted = false;
      if (retentionChartInstanceRef.current) {
        retentionChartInstanceRef.current.destroy();
      }
      if (worksheetChartInstanceRef.current) {
        worksheetChartInstanceRef.current.destroy();
      }
    };
  }, [t]);

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-blue-600 mb-3">{t('pages.blog.components.multiplicationWorksheetsBlog.gameChangerTitle')}</h2>
          <p className="text-gray-700 leading-relaxed">{t('pages.blog.components.multiplicationWorksheetsBlog.gameChangerText')}</p>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-lg shadow-md flex flex-col items-center justify-center text-center">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 w-full">{t('pages.blog.components.multiplicationWorksheetsBlog.powerOfPracticeTitle')}</h2>
          <p className="text-sm md:text-base text-gray-600 mb-6 leading-relaxed w-full max-w-md mx-auto" style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>{t('pages.blog.components.multiplicationWorksheetsBlog.powerOfPracticeSubtitle')}</p>
          <div className="text-6xl md:text-8xl font-bold text-blue-600 mb-3">70%</div>
          <div className="text-xl md:text-2xl font-semibold text-gray-700 mb-4 w-full">{t('pages.blog.components.multiplicationWorksheetsBlog.improvedRetention')}</div>
          <p className="text-sm md:text-base text-gray-600 leading-relaxed w-full max-w-md mx-auto" style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>{t('pages.blog.components.multiplicationWorksheetsBlog.improvedRetentionText')}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('pages.blog.components.multiplicationWorksheetsBlog.boostRetentionTitle')}</h2>
          <p className="text-gray-600 mb-4">{t('pages.blog.components.multiplicationWorksheetsBlog.boostRetentionText')}</p>
          <div className="relative w-full max-w-[600px] mx-auto" style={{ height: '300px', maxHeight: '400px' }}>
            <canvas ref={retentionChartRef}></canvas>
          </div>
          <p className="text-gray-600 mt-4 text-center">{t('pages.blog.components.multiplicationWorksheetsBlog.boostRetentionChartNote')}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('pages.blog.components.multiplicationWorksheetsBlog.whatsInsideTitle')}</h2>
          <p className="text-gray-600 mb-4">{t('pages.blog.components.multiplicationWorksheetsBlog.whatsInsideText')}</p>
          <div className="relative w-full max-w-[600px] mx-auto" style={{ height: '300px', maxHeight: '400px' }}>
            <canvas ref={worksheetChartRef}></canvas>
          </div>
          <p className="text-gray-600 mt-4 text-center">{t('pages.blog.components.multiplicationWorksheetsBlog.whatsInsideNote')}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('pages.blog.components.multiplicationWorksheetsBlog.frustrationToFocusTitle')}</h2>
          <p className="text-gray-600 mb-4">{t('pages.blog.components.multiplicationWorksheetsBlog.frustrationToFocusText')}</p>
          <blockquote className={`bg-blue-100 ${isRTL ? 'border-r-4 rounded-l-lg' : 'border-l-4 rounded-r-lg'} border-blue-500 text-blue-800 p-4`}>
            <p className="italic">{t('pages.blog.components.multiplicationWorksheetsBlog.parentQuote')}</p>
            <cite className="mt-2 block not-italic font-semibold">{t('pages.blog.components.multiplicationWorksheetsBlog.parentCite')}</cite>
          </blockquote>
          <p className="text-gray-600 mt-4">{t('pages.blog.components.multiplicationWorksheetsBlog.frustrationToFocusNote')}</p>
        </div>

        <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">{t('pages.blog.components.multiplicationWorksheetsBlog.learningProcessTitle')}</h2>
          <p className="text-gray-700 leading-relaxed mb-6">{t('pages.blog.components.multiplicationWorksheetsBlog.learningProcessText')}</p>
          <div className="flex flex-col md:flex-row items-center justify-between w-full space-y-4 md:space-y-0 md:space-x-2">
            <div className="flex-1 w-full bg-gray-100 p-4 rounded-lg shadow-inner text-center">
              <div className="text-3xl mb-2">{t('pages.blog.components.multiplicationWorksheetsBlog.step1.number')}</div>
              <h3 className="text-xl font-semibold text-blue-600">{t('pages.blog.components.multiplicationWorksheetsBlog.step1.title')}</h3>
              <p className="text-gray-700">{t('pages.blog.components.multiplicationWorksheetsBlog.step1.description')}</p>
            </div>
            <span className="text-blue-500 text-3xl font-bold md:hidden">▼</span>
            <span className="text-blue-500 text-3xl font-bold hidden md:block px-2">{isRTL ? '←' : '→'}</span>
            <div className="flex-1 w-full bg-gray-100 p-4 rounded-lg shadow-inner text-center">
              <div className="text-3xl mb-2">{t('pages.blog.components.multiplicationWorksheetsBlog.step2.number')}</div>
              <h3 className="text-xl font-semibold text-blue-600">{t('pages.blog.components.multiplicationWorksheetsBlog.step2.title')}</h3>
              <p className="text-gray-700">{t('pages.blog.components.multiplicationWorksheetsBlog.step2.description')}</p>
            </div>
            <span className="text-blue-500 text-3xl font-bold md:hidden">▼</span>
            <span className="text-blue-500 text-3xl font-bold hidden md:block px-2">{isRTL ? '←' : '→'}</span>
            <div className="flex-1 w-full bg-gray-100 p-4 rounded-lg shadow-inner text-center">
              <div className="text-3xl mb-2">{t('pages.blog.components.multiplicationWorksheetsBlog.step3.number')}</div>
              <h3 className="text-xl font-semibold text-blue-600">{t('pages.blog.components.multiplicationWorksheetsBlog.step3.title')}</h3>
              <p className="text-gray-700">{t('pages.blog.components.multiplicationWorksheetsBlog.step3.description')}</p>
            </div>
            <span className="text-blue-500 text-3xl font-bold md:hidden">▼</span>
            <span className="text-blue-500 text-3xl font-bold hidden md:block px-2">{isRTL ? '←' : '→'}</span>
            <div className="flex-1 w-full bg-gray-100 p-4 rounded-lg shadow-inner text-center">
              <div className="text-3xl mb-2">{t('pages.blog.components.multiplicationWorksheetsBlog.step4.number')}</div>
              <h3 className="text-xl font-semibold text-blue-600">{t('pages.blog.components.multiplicationWorksheetsBlog.step4.title')}</h3>
              <p className="text-gray-700">{t('pages.blog.components.multiplicationWorksheetsBlog.step4.description')}</p>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 bg-green-500 text-white p-8 rounded-lg shadow-xl text-center">
          <h2 className="text-3xl font-bold mb-4">{t('pages.blog.components.multiplicationWorksheetsBlog.downloadTitle')}</h2>
          <p className="text-lg text-green-100 mb-6">{t('pages.blog.components.multiplicationWorksheetsBlog.downloadText')}</p>
          <a href="/interactive-worksheets-generator" className="inline-block bg-white text-green-600 font-bold py-3 px-8 rounded-full shadow-lg text-lg transform hover:scale-105 transition-transform">
            {t('pages.blog.components.multiplicationWorksheetsBlog.generateButton')}
          </a>
          <ul className={`flex flex-col md:flex-row justify-center items-center space-y-2 md:space-y-0 ${isRTL ? 'md:space-x-reverse md:space-x-6' : 'md:space-x-6'} mt-8 text-green-50`}>
            <li className="flex items-center">
              <span className={`text-2xl ${isRTL ? 'ml-2' : 'mr-2'}`}>✅</span> {t('pages.blog.components.multiplicationWorksheetsBlog.feature1')}
            </li>
            <li className="flex items-center">
              <span className={`text-2xl ${isRTL ? 'ml-2' : 'mr-2'}`}>✅</span> {t('pages.blog.components.multiplicationWorksheetsBlog.feature2')}
            </li>
            <li className="flex items-center">
              <span className={`text-2xl ${isRTL ? 'ml-2' : 'mr-2'}`}>✅</span> {t('pages.blog.components.multiplicationWorksheetsBlog.feature3')}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
