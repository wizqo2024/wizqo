import React, { useEffect, useRef } from 'react';

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

function wrapLabels(label: string): string {
  const MAX_LENGTH = 16;
  if (label.length <= MAX_LENGTH) return label;
  
  const words = label.split(' ');
  const lines: string[] = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    if (currentLine.length + 1 + words[i].length <= MAX_LENGTH) {
      currentLine += ' ' + words[i];
    } else {
      lines.push(currentLine);
      currentLine = words[i];
    }
  }
  lines.push(currentLine);
  return lines.join('\n');
}

export default function MicroJournalingBlog() {
  const timeChartRef = useRef<HTMLCanvasElement | null>(null);
  const journeyChartRef = useRef<HTMLCanvasElement | null>(null);
  const psychChartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstancesRef = useRef<any[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await loadChartJs();
        if (!mounted) return;
        const Chart = (window as any).Chart;

        const commonOptions = {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            tooltip: {
              backgroundColor: 'rgba(38, 70, 83, 0.9)',
              titleFont: { size: 14, family: 'Inter' },
              bodyFont: { size: 13, family: 'Inter' },
              padding: 10,
              cornerRadius: 8,
            },
            legend: {
              labels: {
                font: { family: 'Inter', size: 12 },
                color: '#264653'
              }
            }
          }
        };

        // Chart 1: Time Investment (Donut)
        if (timeChartRef.current) {
          const ctx = timeChartRef.current.getContext('2d');
          const chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
              labels: ['Micro Journaling', 'Sleeping', 'Work/Commute', 'Leisure/Chores'].map(wrapLabels),
              datasets: [{
                data: [5, 480, 540, 415],
                backgroundColor: ['#E76F51', '#264653', '#2A9D8F', '#E9C46A'],
                borderWidth: 0,
                hoverOffset: 10
              }]
            },
            options: {
              ...commonOptions,
              cutout: '70%',
              plugins: {
                ...commonOptions.plugins,
                legend: { position: 'bottom' }
              }
            }
          });
          chartInstancesRef.current.push(chart);
        }

        // Chart 2: Sara's Journey (Line)
        if (journeyChartRef.current) {
          const ctx = journeyChartRef.current.getContext('2d');
          const chart = new Chart(ctx, {
            type: 'line',
            data: {
              labels: ['Tuesday (Breaking Point)', 'Wednesday Morning', 'Wednesday Night', 'Thursday (The Shift)', 'Friday (Control)'].map(wrapLabels),
              datasets: [{
                label: 'Sense of Clarity & Control (1-10)',
                data: [1, 2, 4, 7, 9],
                borderColor: '#2A9D8F',
                backgroundColor: 'rgba(42, 157, 143, 0.1)',
                borderWidth: 3,
                pointBackgroundColor: '#fff',
                pointBorderColor: '#E76F51',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8,
                fill: true,
                tension: 0.4
              }]
            },
            options: {
              ...commonOptions,
              scales: {
                y: {
                  beginAtZero: true,
                  max: 10,
                  grid: { color: '#f0f0f0' },
                  ticks: { color: '#888' }
                },
                x: {
                  grid: { display: false },
                  ticks: { color: '#666' }
                }
              }
            }
          });
          chartInstancesRef.current.push(chart);
        }

        // Chart 3: Psychology (Radar)
        if (psychChartRef.current) {
          const ctx = psychChartRef.current.getContext('2d');
          const chart = new Chart(ctx, {
            type: 'radar',
            data: {
              labels: ['Mental Focus', 'Emotional Calm', 'Self-Awareness', 'Mood Stability', 'Cognitive Clarity'].map(wrapLabels),
              datasets: [{
                label: 'Burned Out Brain',
                data: [2, 1, 3, 2, 2],
                fill: true,
                backgroundColor: 'rgba(231, 111, 81, 0.2)',
                borderColor: '#E76F51',
                pointBackgroundColor: '#E76F51',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: '#E76F51'
              }, {
                label: 'Micro Journaling Brain',
                data: [8, 7, 9, 8, 9],
                fill: true,
                backgroundColor: 'rgba(42, 157, 143, 0.2)',
                borderColor: '#2A9D8F',
                pointBackgroundColor: '#2A9D8F',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: '#2A9D8F'
              }]
            },
            options: {
              ...commonOptions,
              scales: {
                r: {
                  angleLines: { color: '#eee' },
                  grid: { color: '#eee' },
                  pointLabels: {
                    font: { size: 12, family: 'Inter' },
                    color: '#264653'
                  },
                  suggestedMin: 0,
                  suggestedMax: 10
                }
              }
            }
          });
          chartInstancesRef.current.push(chart);
        }
      } catch (error) {
        console.error('Failed to load charts:', error);
      }
    })();

    return () => {
      mounted = false;
      chartInstancesRef.current.forEach(chart => {
        if (chart && typeof chart.destroy === 'function') {
          chart.destroy();
        }
      });
      chartInstancesRef.current = [];
    };
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 space-y-16 mt-8" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* HEADER / HERO */}
      <header className="bg-[#264653] text-white py-12 px-4 shadow-lg rounded-2xl">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight">Micro Journaling in 2025</h1>
          <p className="text-xl md:text-2xl text-[#E9C46A] font-light">The 5-Minute Habit That Transforms Your Mind</p>
          <div className="mt-8 mx-auto w-24 h-1 bg-[#E76F51] rounded"></div>
        </div>
      </header>

      {/* SECTION 1: THE PROBLEM & CONTEXT */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-bold text-[#264653] mb-4 border-l-4 border-[#E76F51] pl-4">Life in 2025: Too Fast to Breathe?</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            In 2025, the pace of life has accelerated. Stress is high, and free time is a luxury. Most people feel they are 
            <strong> "too busy"</strong> to maintain a mental health practice. But clarity doesn't require hours; it requires consistency.
          </p>
          <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-[#2A9D8F]">
            <h3 className="font-bold text-xl mb-2 text-[#2A9D8F]">The Core Promise</h3>
            <p className="text-gray-600">Micro journaling shifts your mood, lightens stress, and provides clarity in just <strong>2 minutes</strong> a day. It is the "tiny reset button" for your brain.</p>
          </div>
        </div>
        
        {/* VIZ 1: Time Investment Donut */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-center font-bold text-gray-800 mb-2">The 24-Hour Reality Check</h3>
          <p className="text-center text-sm text-gray-500 mb-4">How much of your day does it actually take?</p>
          <div className="relative w-full max-w-[600px] mx-auto" style={{ height: '300px' }}>
            <canvas ref={timeChartRef}></canvas>
          </div>
          <p className="text-center mt-4 text-sm font-semibold text-[#264653] bg-gray-100 p-2 rounded">
            Visualization: 5 Minutes (0.3%) vs. The Rest of Your Day (99.7%)
          </p>
        </div>
      </section>

      {/* SECTION 2: SARA'S STORY (LINE CHART) */}
      <section>
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-3xl font-bold text-[#264653] mb-4">Episodes 1 & 2: Sara's Breaking Point</h2>
          <p className="text-lg text-gray-600">
            Sara wasn't lazy; she was exhausted. A blank journal felt like a chore. Then, she tried a 2-minute experiment. 
            This chart tracks her reported sense of "Control" and "Clarity" over the first critical 72 hours.
          </p>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-100">
          <div className="relative w-full max-w-[800px] mx-auto" style={{ height: '400px' }}>
            <canvas ref={journeyChartRef}></canvas>
          </div>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-red-50 rounded-lg">
              <span className="block font-bold text-[#E76F51]">Tuesday Night</span>
              <span className="text-sm text-gray-600">"I can't even write about my life."</span>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <span className="block font-bold text-[#F4A261]">Wednesday</span>
              <span className="text-sm text-gray-600">"Today was too much, but I survived."</span>
            </div>
            <div className="p-3 bg-teal-50 rounded-lg">
              <span className="block font-bold text-[#2A9D8F]">72 Hours Later</span>
              <span className="text-sm text-gray-600">"I finally feel like I'm hearing myself again."</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: THE DEFINITION & RULES */}
      <section className="bg-[#264653] text-white rounded-2xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#2A9D8F] rounded-full opacity-20"></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-8 text-center text-[#E9C46A]">What Is Micro Journaling?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 text-center hover:bg-white/20 transition duration-300">
              <div className="text-4xl mb-4">✍️</div>
              <h3 className="text-xl font-bold mb-2">Tiny Volume</h3>
              <p className="text-gray-200">1–5 sentences a day. No essays. No pressure to fill a page.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 text-center hover:bg-white/20 transition duration-300">
              <div className="text-4xl mb-4">❓</div>
              <h3 className="text-xl font-bold mb-2">One Question</h3>
              <p className="text-gray-200">Focus on 1 meaningful question to anchor your thoughts.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 text-center hover:bg-white/20 transition duration-300">
              <div className="text-4xl mb-4">⏱️</div>
              <h3 className="text-xl font-bold mb-2">Two Minutes</h3>
              <p className="text-gray-200">Done before your coffee cools. Designed for the exhausted.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: PSYCHOLOGY (RADAR CHART) */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="order-2 lg:order-1">
          <div className="bg-white p-4 md:p-6 rounded-xl shadow-md">
            <h3 className="text-center font-bold text-gray-800 mb-2">The "Burned Out" vs. "Micro Journaling" Brain</h3>
            <p className="text-center text-sm text-gray-500 mb-4">Impact on key psychological metrics</p>
            <div className="relative w-full max-w-[600px] mx-auto" style={{ height: '300px' }}>
              <canvas ref={psychChartRef}></canvas>
            </div>
          </div>
        </div>
        <div className="order-1 lg:order-2">
          <h2 className="text-3xl font-bold text-[#264653] mb-4 border-l-4 border-[#F4A261] pl-4">Episode 3: Why It Works</h2>
          <p className="text-lg text-gray-700 mb-6">
            Psychologists note that the brain loves <strong>short reflection loops</strong>. Even a 30-second pause can stop a spiral.
          </p>
          <ul className="space-y-4">
            <li className="flex items-start">
              <span className="text-[#2A9D8F] font-bold text-xl mr-3">✔</span>
              <p className="text-gray-700"><strong>Stress Reduces:</strong> Putting thoughts into words offloads cognitive burden.</p>
            </li>
            <li className="flex items-start">
              <span className="text-[#2A9D8F] font-bold text-xl mr-3">✔</span>
              <p className="text-gray-700"><strong>Emotions Organize:</strong> Chaos becomes structure in just a few sentences.</p>
            </li>
            <li className="flex items-start">
              <span className="text-[#2A9D8F] font-bold text-xl mr-3">✔</span>
              <p className="text-gray-700"><strong>Feeling "Seen":</strong> You become the witness to your own life.</p>
            </li>
          </ul>
          <div className="mt-6 bg-[#F4A261]/10 p-4 rounded-lg border border-[#F4A261]">
            <p className="text-[#E76F51] font-bold text-sm">PRO TIP 2025</p>
            <p className="text-gray-800 italic">Tools like <strong>Wizqo</strong> enhance this with mood-based reflections and emotional growth tracking.</p>
          </div>
        </div>
      </section>

      {/* SECTION 5: PROMPTS (GRID LAYOUT) */}
      <section>
        <h2 className="text-3xl font-bold text-center text-[#264653] mb-8">5 Prompts to Try Today <span className="text-lg font-normal text-gray-500 block mt-2">(Takes &lt; 30 seconds)</span></h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition border-t-4 border-[#2A9D8F]">
            <div className="text-[#2A9D8F] font-bold text-lg mb-2">01. Emotion</div>
            <p className="text-xl font-medium text-gray-800">"What's one word to describe how I feel right now?"</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition border-t-4 border-[#E9C46A]">
            <div className="text-[#E9C46A] font-bold text-lg mb-2">02. Observation</div>
            <p className="text-xl font-medium text-gray-800">"What moment stood out to me today?"</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition border-t-4 border-[#E76F51]">
            <div className="text-[#E76F51] font-bold text-lg mb-2">03. Release</div>
            <p className="text-xl font-medium text-gray-800">"What am I overthinking?"</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition border-t-4 border-[#264653] md:col-span-1 lg:col-start-1 lg:col-end-2">
            <div className="text-[#264653] font-bold text-lg mb-2">04. Validation</div>
            <p className="text-xl font-medium text-gray-800">"What's something I'm quietly proud of?"</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition border-t-4 border-[#F4A261] md:col-span-2 lg:col-span-2">
            <div className="text-[#F4A261] font-bold text-lg mb-2">05. Intention</div>
            <p className="text-xl font-medium text-gray-800">"What's one thing I want tomorrow to feel like?"</p>
          </div>
        </div>
      </section>

      {/* SECTION 6: THE CHALLENGE (PROCESS FLOW) */}
      <section className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
        <h2 className="text-3xl font-bold text-[#264653] mb-8 text-center">The 48-Hour Challenge</h2>
        <div className="flex flex-col md:flex-row justify-center items-center md:items-stretch gap-8">
          <div className="flex-1 bg-gray-50 p-6 rounded-xl border border-gray-200 relative">
            <div className="absolute -top-4 -left-4 bg-[#264653] text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl shadow">1</div>
            <h3 className="text-xl font-bold text-[#264653] mb-2 mt-2">Day 1: The Reveal</h3>
            <p className="text-gray-600 mb-4">Write 1 raw sentence about how you feel.</p>
            <div className="bg-white p-3 rounded border border-gray-200 italic text-gray-500 text-sm">
              "I feel overwhelmed by the project deadline..."
            </div>
            <span className="inline-block mt-4 text-xs font-bold text-[#E76F51] uppercase tracking-wider">No Filters.</span>
          </div>
          <div className="hidden md:flex items-center text-[#2A9D8F] text-4xl">→</div>
          <div className="md:hidden text-[#2A9D8F] text-4xl rotate-90">→</div>
          <div className="flex-1 bg-gray-50 p-6 rounded-xl border border-gray-200 relative">
            <div className="absolute -top-4 -left-4 bg-[#2A9D8F] text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl shadow">2</div>
            <h3 className="text-xl font-bold text-[#264653] mb-2 mt-2">Day 2: The Shift</h3>
            <p className="text-gray-600 mb-4">Write 1 sentence about something you're proud you handled.</p>
            <div className="bg-white p-3 rounded border border-gray-200 italic text-gray-500 text-sm">
              "I kept my cool during that meeting today."
            </div>
            <span className="inline-block mt-4 text-xs font-bold text-[#2A9D8F] uppercase tracking-wider">Notice the win.</span>
          </div>
          <div className="hidden md:flex items-center text-[#2A9D8F] text-4xl">→</div>
          <div className="md:hidden text-[#2A9D8F] text-4xl rotate-90">→</div>
          <div className="flex-1 bg-[#2A9D8F] p-6 rounded-xl text-white flex flex-col justify-center text-center shadow-lg">
            <h3 className="text-xl font-bold mb-2">The Result</h3>
            <ul className="text-sm space-y-2 text-left mx-auto">
              <li>✨ Better Focus</li>
              <li>✨ Less Irritability</li>
              <li>✨ A Quieter Mind</li>
            </ul>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="text-center py-12 border-t border-gray-200 mt-12">
        <h2 className="text-2xl font-bold text-[#264653] mb-4">Micro Wins → Micro Clarity → Macro Peace</h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-8">
          It doesn't take an hour. It doesn't require motivation. Just one tiny moment of truth each day.
          Your mind deserves 5 minutes of honesty.
        </p>
        <div className="text-sm text-gray-400">
          Generated from "Micro Journaling: The 5-Minute Habit That's Changing Lives"
        </div>
      </footer>
    </div>
  );
}
