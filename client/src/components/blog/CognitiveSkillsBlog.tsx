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

  // Helper function to safely get translations with fallback
  const safeT = (key: string, fallback: string = key): string => {
    try {
      const result = t(key);
      // If translation returns the key itself, it means translation is missing
      return result === key ? fallback : result;
    } catch (error) {
      console.warn(`Translation missing for key: ${key}`, error);
      return fallback;
    }
  };

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
          safeT('pages.blog.components.cognitiveSkillsBlog.chartLabels.attention', 'Attention'),
          safeT('pages.blog.components.cognitiveSkillsBlog.chartLabels.logicReasoning', 'Logic & Reasoning'),
          safeT('pages.blog.components.cognitiveSkillsBlog.chartLabels.memory', 'Memory'),
          safeT('pages.blog.components.cognitiveSkillsBlog.chartLabels.processingSpeed', 'Processing Speed'),
          safeT('pages.blog.components.cognitiveSkillsBlog.chartLabels.visualProcessing', 'Visual Processing')
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
              label: safeT('pages.blog.components.cognitiveSkillsBlog.chartLabel', 'Cognitive Skills'),
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
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 text-gray-900 leading-tight">
          {safeT('pages.blog.components.cognitiveSkillsBlog.headerTitle', '🧠 What Are Cognitive Skills? How to Strengthen Your Mind and Unlock Your True Potential')}
        </h2>
        <p className="text-xl md:text-2xl italic text-gray-600 mb-8 max-w-4xl mx-auto">
          {safeT('pages.blog.components.cognitiveSkillsBlog.headerQuote', '"The mind is not a vessel to be filled, but a fire to be kindled."')}
        </p>
        <p className="text-lg md:text-xl lg:text-2xl max-w-4xl mx-auto text-gray-800 leading-relaxed">
          {safeT('pages.blog.components.cognitiveSkillsBlog.headerDescription', 'Discover how cognitive skills shape focus, memory, and confidence — plus free printable brain games and a 7-day challenge to help you think sharper and feel stronger.')}
        </p>
      </header>

      <main>
        <section className="mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-900">
            {safeT('pages.blog.components.cognitiveSkillsBlog.coreSkillsTitle', 'The 5 Core Cognitive Skills')}
          </h2>
          <p className="text-lg md:text-xl text-center max-w-4xl mx-auto mb-10 text-gray-800 leading-relaxed">
            {safeT('pages.blog.components.cognitiveSkillsBlog.coreSkillsDescription', 'These five skills work together to help you learn, solve problems, and think clearly. When you strengthen one, you boost them all.')}
          </p>

          <div className="relative w-full max-w-3xl mx-auto mb-12 h-[350px] md:h-[450px]">
            <canvas ref={radarChartRef} id="radarChart"></canvas>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-10">
            <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 transform hover:scale-105 transition-transform duration-300">
              <span className="text-5xl block mb-3">🧠</span>
              <h3 className="text-2xl md:text-3xl font-bold my-3 text-gray-900">{safeT('pages.blog.components.cognitiveSkillsBlog.attention.title', 'Attention')}</h3>
              <p className="text-gray-700 mb-4 text-lg leading-relaxed">{safeT('pages.blog.components.cognitiveSkillsBlog.attention.description', 'Your ability to focus on what matters and ignore distractions. Strong attention helps you stay on task, follow directions, and complete work without getting sidetracked.')}</p>
              <p className="font-semibold text-gray-800 text-lg"><strong>{safeT('pages.blog.components.cognitiveSkillsBlog.attention.improve', 'Improve with: puzzles, spot-the-difference games, and focused reading practice.')}</strong></p>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 transform hover:scale-105 transition-transform duration-300">
              <span className="text-5xl block mb-3">🧮</span>
              <h3 className="text-2xl md:text-3xl font-bold my-3 text-gray-900">{safeT('pages.blog.components.cognitiveSkillsBlog.logicReasoning.title', 'Logic & Reasoning')}</h3>
              <p className="text-gray-700 mb-4 text-lg leading-relaxed">{safeT('pages.blog.components.cognitiveSkillsBlog.logicReasoning.description', 'How you solve problems, make connections, and think through challenges step-by-step. This skill helps you understand cause and effect, see patterns, and make smart decisions.')}</p>
              <p className="font-semibold text-gray-800 text-lg"><strong>{safeT('pages.blog.components.cognitiveSkillsBlog.logicReasoning.improve', 'Improve with: math puzzles, word problems, and logic grid exercises.')}</strong></p>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 transform hover:scale-105 transition-transform duration-300">
              <span className="text-5xl block mb-3">🔁</span>
              <h3 className="text-2xl md:text-3xl font-bold my-3 text-gray-900">{safeT('pages.blog.components.cognitiveSkillsBlog.memory.title', 'Memory')}</h3>
              <p className="text-gray-700 mb-4 text-lg leading-relaxed">{safeT('pages.blog.components.cognitiveSkillsBlog.memory.description', 'Your ability to store and recall information. Working memory holds information temporarily (like phone numbers), while long-term memory stores facts and experiences for later.')}</p>
              <p className="font-semibold text-gray-800 text-lg"><strong>{safeT('pages.blog.components.cognitiveSkillsBlog.memory.improve', 'Improve with: memory games, repetition practice, and storytelling activities.')}</strong></p>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 transform hover:scale-105 transition-transform duration-300 lg:col-start-2">
              <span className="text-5xl block mb-3">⚡</span>
              <h3 className="text-2xl md:text-3xl font-bold my-3 text-gray-900">{safeT('pages.blog.components.cognitiveSkillsBlog.processingSpeed.title', 'Processing Speed')}</h3>
              <p className="text-gray-700 mb-4 text-lg leading-relaxed">{safeT('pages.blog.components.cognitiveSkillsBlog.processingSpeed.description', 'How quickly you can take in, understand, and respond to information. Faster processing helps you keep up in conversations, complete tasks efficiently, and feel more confident.')}</p>
              <p className="font-semibold text-gray-800 text-lg"><strong>{safeT('pages.blog.components.cognitiveSkillsBlog.processingSpeed.improve', 'Improve with: timed math drills, quick decision games, and rapid reading practice.')}</strong></p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 transform hover:scale-105 transition-transform duration-300">
              <span className="text-5xl block mb-3">👁️</span>
              <h3 className="text-2xl md:text-3xl font-bold my-3 text-gray-900">{safeT('pages.blog.components.cognitiveSkillsBlog.visualProcessing.title', 'Visual Processing')}</h3>
              <p className="text-gray-700 mb-4 text-lg leading-relaxed">{safeT('pages.blog.components.cognitiveSkillsBlog.visualProcessing.description', 'How your brain makes sense of what you see. This includes recognizing shapes, understanding spatial relationships, and noticing details in images or text.')}</p>
              <p className="font-semibold text-gray-800 text-lg"><strong>{safeT('pages.blog.components.cognitiveSkillsBlog.visualProcessing.improve', 'Improve with: pattern matching, visual puzzles, and drawing exercises.')}</strong></p>
            </div>
          </div>
        </section>

        <section className="mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-900">
            {safeT('pages.blog.components.cognitiveSkillsBlog.proofTitle', 'Real Results: Before & After')}
          </h2>
          <p className="text-lg md:text-xl text-center max-w-4xl mx-auto mb-10 text-gray-700 leading-relaxed">
            {safeT('pages.blog.components.cognitiveSkillsBlog.proofDescription', 'See how strengthening cognitive skills transforms learning and confidence.')}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-6 md:gap-8 mb-12">
            <div className="bg-red-50 rounded-lg shadow-md p-6 md:p-8 border-l-4 border-red-500">
              <h3 className="text-2xl md:text-3xl font-bold mb-4 text-red-600">{safeT('pages.blog.components.cognitiveSkillsBlog.beforeTitle', 'Before')}</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 text-lg">
                {(() => {
                  try {
                    const items = t('pages.blog.components.cognitiveSkillsBlog.beforeItems', { returnObjects: true });
                    if (Array.isArray(items)) {
                      return items.map((item: string, idx: number) => <li key={idx}>{item}</li>);
                    }
                  } catch (e) {}
                  // Fallback items
                  return [
                    'Struggles to focus for more than 5 minutes',
                    'Gets overwhelmed by multi-step problems',
                    'Forgets instructions quickly',
                    'Feels slow compared to peers',
                    'Misses details in reading or math',
                  ].map((item, idx) => <li key={idx}>{item}</li>);
                })()}
              </ul>
            </div>
            
            <div className="text-5xl text-center text-gray-400 font-bold hidden md:block" aria-hidden="true">&rarr;</div>
            <div className="text-5xl text-center text-gray-400 font-bold md:hidden my-4" aria-hidden="true">&darr;</div>

            <div className="bg-green-50 rounded-lg shadow-md p-6 md:p-8 border-l-4 border-green-500">
              <h3 className="text-2xl md:text-3xl font-bold mb-4 text-green-600">{safeT('pages.blog.components.cognitiveSkillsBlog.afterTitle', 'After')}</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 text-lg">
                {(() => {
                  try {
                    const items = t('pages.blog.components.cognitiveSkillsBlog.afterItems', { returnObjects: true });
                    if (Array.isArray(items)) {
                      return items.map((item: string, idx: number) => <li key={idx}>{item}</li>);
                    }
                  } catch (e) {}
                  // Fallback items
                  return [
                    'Stays focused for 20+ minutes on challenging tasks',
                    'Breaks down complex problems into manageable steps',
                    'Remembers and follows multi-step directions',
                    'Completes work at a comfortable pace',
                    'Notices patterns and details with confidence',
                  ].map((item, idx) => <li key={idx}>{item}</li>);
                })()}
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg shadow-xl p-8 md:p-10 max-w-5xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">{safeT('pages.blog.components.cognitiveSkillsBlog.scienceTitle', 'The Science: Why Cognitive Skills Matter')}</h3>
            <p className="text-lg md:text-xl mb-4 opacity-90 leading-relaxed">
              {safeT('pages.blog.components.cognitiveSkillsBlog.scienceDescription', 'Research shows that targeted cognitive skill training can improve academic performance, boost confidence, and reduce learning anxiety. A 2023 study found that students who practiced cognitive exercises for just 10 minutes a day saw significant improvements in focus, memory, and problem-solving within 6 weeks.')}
            </p>
            <p className="text-lg md:text-xl italic font-semibold opacity-100">
              {safeT('pages.blog.components.cognitiveSkillsBlog.scienceQuote', '"Cognitive skills are the foundation of all learning. When we strengthen them, we unlock potential that was always there — we just needed the right tools to access it."')}
            </p>
          </div>
        </section>

        <section className="mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-900">
            {safeT('pages.blog.components.cognitiveSkillsBlog.challengeTitle', 'The 7-Day Cognitive Skills Challenge')}
          </h2>
          <p className="text-lg md:text-xl text-center max-w-4xl mx-auto mb-10 text-gray-700 leading-relaxed">
            {safeT('pages.blog.components.cognitiveSkillsBlog.challengeDescription', 'Try this simple daily routine to strengthen all five cognitive skills. Each day focuses on a different skill, but they all work together to build a stronger mind.')}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 md:gap-6 mb-10">
            <div className="bg-white rounded-lg shadow-md p-5 md:p-6 text-center border-t-4 border-red-500">
              <div className="font-bold text-lg md:text-xl mb-2 text-red-600">{safeT('pages.blog.components.cognitiveSkillsBlog.monday.day', 'Monday')}</div>
              <span className="text-4xl md:text-5xl mb-3 block" role="img" aria-label="puzzle piece">🧩</span>
              <p className="text-gray-700 text-base md:text-lg">{safeT('pages.blog.components.cognitiveSkillsBlog.monday.activity', 'Puzzle Power: Complete a spot-the-difference or pattern puzzle (10 minutes)')}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-5 md:p-6 text-center border-t-4 border-orange-500">
              <div className="font-bold text-lg md:text-xl mb-2 text-orange-600">{safeT('pages.blog.components.cognitiveSkillsBlog.tuesday.day', 'Tuesday')}</div>
              <span className="text-4xl md:text-5xl mb-3 block" role="img" aria-label="brain">🧠</span>
              <p className="text-gray-700 text-base md:text-lg">{safeT('pages.blog.components.cognitiveSkillsBlog.tuesday.activity', 'Brain Training: Practice memory games or recall exercises (10 minutes)')}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-5 md:p-6 text-center border-t-4 border-yellow-500">
              <div className="font-bold text-lg md:text-xl mb-2 text-yellow-600">{safeT('pages.blog.components.cognitiveSkillsBlog.wednesday.day', 'Wednesday')}</div>
              <span className="text-4xl md:text-5xl mb-3 block" role="img" aria-label="abacus">🔢</span>
              <p className="text-gray-700 text-base md:text-lg">{safeT('pages.blog.components.cognitiveSkillsBlog.wednesday.activity', 'Math Mind: Solve 5 logic or word problems (10 minutes)')}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-5 md:p-6 text-center border-t-4 border-yellow-400">
              <div className="font-bold text-lg md:text-xl mb-2 text-yellow-500">{safeT('pages.blog.components.cognitiveSkillsBlog.thursday.day', 'Thursday')}</div>
              <span className="text-4xl md:text-5xl mb-3 block" role="img" aria-label="books">📚</span>
              <p className="text-gray-700 text-base md:text-lg">{safeT('pages.blog.components.cognitiveSkillsBlog.thursday.activity', 'Reading Focus: Read a short passage and answer detail questions (10 minutes)')}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-5 md:p-6 text-center border-t-4 border-green-500">
              <div className="font-bold text-lg md:text-xl mb-2 text-green-600">{safeT('pages.blog.components.cognitiveSkillsBlog.friday.day', 'Friday')}</div>
              <span className="text-4xl md:text-5xl mb-3 block" role="img" aria-label="artist palette">🎨</span>
              <p className="text-gray-700 text-base md:text-lg">{safeT('pages.blog.components.cognitiveSkillsBlog.friday.activity', 'Visual Skills: Complete a visual pattern or drawing exercise (10 minutes)')}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-5 md:p-6 text-center border-t-4 border-teal-500">
              <div className="font-bold text-lg md:text-xl mb-2 text-teal-600">{safeT('pages.blog.components.cognitiveSkillsBlog.saturday.day', 'Saturday')}</div>
              <span className="text-4xl md:text-5xl mb-3 block" role="img" aria-label="thought bubble">💭</span>
              <p className="text-gray-700 text-base md:text-lg">{safeT('pages.blog.components.cognitiveSkillsBlog.saturday.activity', 'Speed Practice: Timed math drills or quick decision games (10 minutes)')}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-5 md:p-6 text-center border-t-4 border-blue-500">
              <div className="font-bold text-lg md:text-xl mb-2 text-blue-600">{safeT('pages.blog.components.cognitiveSkillsBlog.sunday.day', 'Sunday')}</div>
              <span className="text-4xl md:text-5xl mb-3 block" role="img" aria-label="sparkles">🌟</span>
              <p className="text-gray-700 text-base md:text-lg">{safeT('pages.blog.components.cognitiveSkillsBlog.sunday.activity', 'Mix & Match: Combine any 2 activities from the week (15 minutes)')}</p>
            </div>
          </div>
        </section>

        <footer className="mt-16 text-center max-w-4xl mx-auto bg-white p-8 md:p-10 rounded-lg shadow-xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-red-600">
            {safeT('pages.blog.components.cognitiveSkillsBlog.footerTitle', '💖 Remember: Progress, Not Perfection')}
          </h2>
          <p className="text-xl md:text-2xl mb-6 text-gray-700 leading-relaxed">
            {safeT('pages.blog.components.cognitiveSkillsBlog.footerDescription', 'Building cognitive strength isn\'t about doing everything perfectly. It\'s about showing up — one small step, one puzzle, one worksheet at a time.')}
          </p>
          <p className="text-2xl md:text-3xl italic font-semibold text-gray-800 mb-8">
            {safeT('pages.blog.components.cognitiveSkillsBlog.footerQuote', '"Small progress is still progress. And progress builds confidence."')}
          </p>
          <a 
            href="https://wizqo.com/interactive-worksheets-generator" 
            className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 md:px-10 py-4 md:py-5 rounded-lg text-lg md:text-xl font-bold hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
          >
            {safeT('pages.blog.components.cognitiveSkillsBlog.footerLink', 'Ready to strengthen your cognitive skills? Explore our free interactive worksheets →')}
          </a>
        </footer>
      </main>
    </div>
  );
}
