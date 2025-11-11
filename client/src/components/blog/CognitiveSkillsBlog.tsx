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

export default function CognitiveSkillsBlog() {
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
          'Attention', 
          'Logic & Reasoning', 
          'Memory', 
          'Processing Speed', 
          'Visual Processing'
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
              label: 'Balanced Brain Profile',
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
  }, []);

  return (
    <div className="w-full -mx-8 lg:-mx-12 px-8 lg:px-12 py-8">
      <header className="text-center mb-12 md:mb-16">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 text-gray-900 leading-tight">
          🧠 What Are Cognitive Skills? How to Strengthen Your Mind and Unlock Your True Potential
        </h1>
        <p className="text-xl md:text-2xl italic text-gray-600 mb-8 max-w-4xl mx-auto">
          "The mind is not a vessel to be filled, but a fire to be kindled." – Plutarch
        </p>
        <p className="text-lg md:text-xl lg:text-2xl max-w-4xl mx-auto text-gray-800 leading-relaxed">
          Cognitive skills are the mental building blocks behind everything you do. They determine how effectively you think, learn, and solve problems. And the best part? Anyone can strengthen them.
        </p>
      </header>

      <main>
        <section className="mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-900">
            The 5 Core Cognitive Skills
          </h2>
          <p className="text-lg md:text-xl text-center max-w-4xl mx-auto mb-10 text-gray-800 leading-relaxed">
            These five skills work together to help your brain learn, remember, and apply information. A balanced profile, as shown in the chart below, is key to peak mental performance.
          </p>

          <div className="relative w-full max-w-3xl mx-auto mb-12 h-[350px] md:h-[450px]">
            <canvas ref={radarChartRef} id="radarChart"></canvas>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-10">
            <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 transform hover:scale-105 transition-transform duration-300">
              <span className="text-5xl block mb-3">🧠</span>
              <h3 className="text-2xl md:text-3xl font-bold my-3 text-gray-900">Attention</h3>
              <p className="text-gray-700 mb-4 text-lg leading-relaxed">Helps you focus on what matters most and ignore distractions.</p>
              <p className="font-semibold text-gray-800 text-lg"><strong>How to Improve:</strong> Practice mindful coloring or "focus mazes."</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 transform hover:scale-105 transition-transform duration-300">
              <span className="text-5xl block mb-3">🧮</span>
              <h3 className="text-2xl md:text-3xl font-bold my-3 text-gray-900">Logic & Reasoning</h3>
              <p className="text-gray-700 mb-4 text-lg leading-relaxed">Enables problem-solving, critical thinking, and forming conclusions.</p>
              <p className="font-semibold text-gray-800 text-lg"><strong>How to Improve:</strong> Try printable logic grids and riddles.</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 transform hover:scale-105 transition-transform duration-300">
              <span className="text-5xl block mb-3">🔁</span>
              <h3 className="text-2xl md:text-3xl font-bold my-3 text-gray-900">Memory</h3>
              <p className="text-gray-700 mb-4 text-lg leading-relaxed">Retains and recalls information, whether short-term or long-term.</p>
              <p className="font-semibold text-gray-800 text-lg"><strong>How to Improve:</strong> Play memory match games or learn a new language.</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 transform hover:scale-105 transition-transform duration-300 lg:col-start-2">
              <span className="text-5xl block mb-3">⚡</span>
              <h3 className="text-2xl md:text-3xl font-bold my-3 text-gray-900">Processing Speed</h3>
              <p className="text-gray-700 mb-4 text-lg leading-relaxed">How quickly your brain can take in and react to new information.</p>
              <p className="font-semibold text-gray-800 text-lg"><strong>How to Improve:</strong> Do quick word searches or rapid-fire math drills.</p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 transform hover:scale-105 transition-transform duration-300">
              <span className="text-5xl block mb-3">👁️</span>
              <h3 className="text-2xl md:text-3xl font-bold my-3 text-gray-900">Visual Processing</h3>
              <p className="text-gray-700 mb-4 text-lg leading-relaxed">Helps you interpret and understand what you see (e.g., reading maps).</p>
              <p className="font-semibold text-gray-800 text-lg"><strong>How to Improve:</strong> Complete drawing or symmetry worksheets.</p>
            </div>
          </div>
        </section>

        <section className="mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-900">
            The Proof: From Frustration to Focus
          </h2>
          <p className="text-lg md:text-xl text-center max-w-4xl mx-auto mb-10 text-gray-700 leading-relaxed">
            Small, consistent effort leads to real change. Sara, a college student, transformed her study habits by training her brain for just 10 minutes a day.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-6 md:gap-8 mb-12">
            <div className="bg-red-50 rounded-lg shadow-md p-6 md:p-8 border-l-4 border-red-500">
              <h3 className="text-2xl md:text-3xl font-bold mb-4 text-red-600">Before: Frustration</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 text-lg">
                <li>Constantly distracted</li>
                <li>Felt overwhelmed</li>
                <li>Couldn't remember notes</li>
                <li>Doubted her abilities</li>
              </ul>
            </div>
            
            <div className="text-5xl text-center text-gray-400 font-bold hidden md:block" aria-hidden="true">&rarr;</div>
            <div className="text-5xl text-center text-gray-400 font-bold md:hidden my-4" aria-hidden="true">&darr;</div>

            <div className="bg-green-50 rounded-lg shadow-md p-6 md:p-8 border-l-4 border-green-500">
              <h3 className="text-2xl md:text-3xl font-bold mb-4 text-green-600">After: Focus</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 text-lg">
                <li>Focus improved</li>
                <li>Confidence returned</li>
                <li>Studying felt lighter</li>
                <li>Learned how to train her brain</li>
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg shadow-xl p-8 md:p-10 max-w-5xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">🔬 Science Says: Your Brain Can Change</h3>
            <p className="text-lg md:text-xl mb-4 opacity-90 leading-relaxed">
              This isn't just a nice idea. Research on <strong>neuroplasticity</strong> confirms that your brain can grow and rewire itself at any age. Every new puzzle and challenge strengthens the connections between your brain cells.
            </p>
            <p className="text-lg md:text-xl italic font-semibold opacity-100">
              "Learning is not a spectator sport." – Jim Kwik
            </p>
          </div>
        </section>

        <section className="mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-900">
            Try This 7-Day Brain Challenge
          </h2>
          <p className="text-lg md:text-xl text-center max-w-4xl mx-auto mb-10 text-gray-700 leading-relaxed">
            Make it real. For one week, do one small activity each day. Notice how you feel by day 7—calmer, sharper, and more focused.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 md:gap-6 mb-10">
            <div className="bg-white rounded-lg shadow-md p-5 md:p-6 text-center border-t-4 border-red-500">
              <div className="font-bold text-lg md:text-xl mb-2 text-red-600">Monday</div>
              <span className="text-4xl md:text-5xl mb-3 block" role="img" aria-label="puzzle piece">🧩</span>
              <p className="text-gray-700 text-base md:text-lg">Solve a logic puzzle.</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-5 md:p-6 text-center border-t-4 border-orange-500">
              <div className="font-bold text-lg md:text-xl mb-2 text-orange-600">Tuesday</div>
              <span className="text-4xl md:text-5xl mb-3 block" role="img" aria-label="brain">🧠</span>
              <p className="text-gray-700 text-base md:text-lg">Do a 5-min memory match.</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-5 md:p-6 text-center border-t-4 border-yellow-500">
              <div className="font-bold text-lg md:text-xl mb-2 text-yellow-600">Wednesday</div>
              <span className="text-4xl md:text-5xl mb-3 block" role="img" aria-label="abacus">🔢</span>
              <p className="text-gray-700 text-base md:text-lg">Try a math worksheet.</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-5 md:p-6 text-center border-t-4 border-yellow-400">
              <div className="font-bold text-lg md:text-xl mb-2 text-yellow-500">Thursday</div>
              <span className="text-4xl md:text-5xl mb-3 block" role="img" aria-label="books">📚</span>
              <p className="text-gray-700 text-base md:text-lg">Read something new.</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-5 md:p-6 text-center border-t-4 border-green-500">
              <div className="font-bold text-lg md:text-xl mb-2 text-green-600">Friday</div>
              <span className="text-4xl md:text-5xl mb-3 block" role="img" aria-label="artist palette">🎨</span>
              <p className="text-gray-700 text-base md:text-lg">Color a mindful mandala.</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-5 md:p-6 text-center border-t-4 border-teal-500">
              <div className="font-bold text-lg md:text-xl mb-2 text-teal-600">Saturday</div>
              <span className="text-4xl md:text-5xl mb-3 block" role="img" aria-label="thought bubble">💭</span>
              <p className="text-gray-700 text-base md:text-lg">Journal one new thing.</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-5 md:p-6 text-center border-t-4 border-blue-500">
              <div className="font-bold text-lg md:text-xl mb-2 text-blue-600">Sunday</div>
              <span className="text-4xl md:text-5xl mb-3 block" role="img" aria-label="sparkles">🌟</span>
              <p className="text-gray-700 text-base md:text-lg">Reflect on your progress.</p>
            </div>
          </div>
        </section>

        <footer className="mt-16 text-center max-w-4xl mx-auto bg-white p-8 md:p-10 rounded-lg shadow-xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-red-600">
            💖 Remember: Progress, Not Perfection
          </h2>
          <p className="text-xl md:text-2xl mb-6 text-gray-700 leading-relaxed">
            Building cognitive strength isn't about doing everything perfectly. It's about showing up — one small step, one puzzle, one worksheet at a time.
          </p>
          <p className="text-2xl md:text-3xl italic font-semibold text-gray-800 mb-8">
            "Small progress is still progress. And progress builds confidence."
          </p>
          <a 
            href="https://wizqo.com/interactive-worksheets-generator" 
            className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 md:px-10 py-4 md:py-5 rounded-lg text-lg md:text-xl font-bold hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
          >
            Ready to strengthen your cognitive skills? Explore our free interactive worksheets →
          </a>
        </footer>
      </main>
    </div>
  );
}
