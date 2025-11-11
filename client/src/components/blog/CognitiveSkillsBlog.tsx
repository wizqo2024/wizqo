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
    <div className="max-w-7xl mx-auto p-4 md:p-8 bg-gray-100">
      <header className="text-center mb-12 md:mb-16">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 text-gray-900">
          🧠 What Are Cognitive Skills? How to Strengthen Your Mind and Unlock Your True Potential
        </h1>
        <p className="text-xl italic text-gray-600 mb-8 max-w-3xl mx-auto">
          "The mind is not a vessel to be filled, but a fire to be kindled." – Plutarch
        </p>
        <p className="text-lg md:text-xl max-w-3xl mx-auto text-gray-800">
          Cognitive skills are the mental building blocks behind everything you do. They determine how effectively you think, learn, and solve problems. And the best part? Anyone can strengthen them.
        </p>
      </header>

      <main>
        <section className="mb-12 md:mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
            The 5 Core Cognitive Skills
          </h2>
          <p className="text-lg text-center max-w-3xl mx-auto mb-8 text-gray-800">
            These five skills work together to help your brain learn, remember, and apply information. A balanced profile, as shown in the chart below, is key to peak mental performance.
          </p>

          <div className="relative w-full max-w-2xl mx-auto mb-12 h-[300px] md:h-[400px]">
            <canvas ref={radarChartRef} id="radarChart"></canvas>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-lg p-6 transform hover:scale-105 transition-transform duration-300">
              <span className="text-5xl block mb-2">🧠</span>
              <h3 className="text-2xl font-bold my-2 text-gray-900">Attention</h3>
              <p className="text-gray-700 mb-3">Helps you focus on what matters most and ignore distractions.</p>
              <p className="font-semibold text-gray-800"><strong>How to Improve:</strong> Practice mindful coloring or "focus mazes."</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6 transform hover:scale-105 transition-transform duration-300">
              <span className="text-5xl block mb-2">🧮</span>
              <h3 className="text-2xl font-bold my-2 text-gray-900">Logic & Reasoning</h3>
              <p className="text-gray-700 mb-3">Enables problem-solving, critical thinking, and forming conclusions.</p>
              <p className="font-semibold text-gray-800"><strong>How to Improve:</strong> Try printable logic grids and riddles.</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6 transform hover:scale-105 transition-transform duration-300">
              <span className="text-5xl block mb-2">🔁</span>
              <h3 className="text-2xl font-bold my-2 text-gray-900">Memory</h3>
              <p className="text-gray-700 mb-3">Retains and recalls information, whether short-term or long-term.</p>
              <p className="font-semibold text-gray-800"><strong>How to Improve:</strong> Play memory match games or learn a new language.</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6 transform hover:scale-105 transition-transform duration-300 lg:col-start-2">
              <span className="text-5xl block mb-2">⚡</span>
              <h3 className="text-2xl font-bold my-2 text-gray-900">Processing Speed</h3>
              <p className="text-gray-700 mb-3">How quickly your brain can take in and react to new information.</p>
              <p className="font-semibold text-gray-800"><strong>How to Improve:</strong> Do quick word searches or rapid-fire math drills.</p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 transform hover:scale-105 transition-transform duration-300">
              <span className="text-5xl block mb-2">👁️</span>
              <h3 className="text-2xl font-bold my-2 text-gray-900">Visual Processing</h3>
              <p className="text-gray-700 mb-3">Helps you interpret and understand what you see (e.g., reading maps).</p>
              <p className="font-semibold text-gray-800"><strong>How to Improve:</strong> Complete drawing or symmetry worksheets.</p>
            </div>
          </div>

          <div className="text-center mb-8">
            <a 
              href="https://wizqo.com/interactive-worksheets-generator" 
              className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-lg text-lg font-bold hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              👉 Try Our Interactive Cognitive Skill Worksheets →
            </a>
          </div>
        </section>

        <section className="mb-12 md:mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
            The Proof: From Frustration to Focus
          </h2>
          <p className="text-lg text-center max-w-3xl mx-auto mb-10 text-gray-700">
            Small, consistent effort leads to real change. Sara, a college student, transformed her study habits by training her brain for just 10 minutes a day.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-6 mb-12">
            <div className="bg-red-50 rounded-lg shadow-md p-6 border-l-4 border-red-500">
              <h3 className="text-2xl font-bold mb-3 text-red-600">Before: Frustration</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Constantly distracted</li>
                <li>Felt overwhelmed</li>
                <li>Couldn't remember notes</li>
                <li>Doubted her abilities</li>
              </ul>
            </div>
            
            <div className="text-5xl text-center text-gray-400 font-bold hidden md:block" aria-hidden="true">&rarr;</div>
            <div className="text-5xl text-center text-gray-400 font-bold md:hidden my-4" aria-hidden="true">&darr;</div>

            <div className="bg-green-50 rounded-lg shadow-md p-6 border-l-4 border-green-500">
              <h3 className="text-2xl font-bold mb-3 text-green-600">After: Focus</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Focus improved</li>
                <li>Confidence returned</li>
                <li>Studying felt lighter</li>
                <li>Learned how to train her brain</li>
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg shadow-xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">🔬 Science Says: Your Brain Can Change</h3>
            <p className="text-lg mb-4 opacity-90">
              This isn't just a nice idea. Research on <strong>neuroplasticity</strong> confirms that your brain can grow and rewire itself at any age. Every new puzzle and challenge strengthens the connections between your brain cells.
            </p>
            <p className="text-lg italic font-semibold opacity-100">
              "Learning is not a spectator sport." – Jim Kwik
            </p>
          </div>

          <div className="text-center mt-8">
            <a 
              href="https://wizqo.com/interactive-worksheets-generator" 
              className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-lg text-lg font-bold hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              🎯 Start Building Your Cognitive Skills Today →
            </a>
          </div>
        </section>

        <section className="mb-12 md:mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
            Try This 7-Day Brain Challenge
          </h2>
          <p className="text-lg text-center max-w-3xl mx-auto mb-10 text-gray-700">
            Make it real. For one week, do one small activity each day. Notice how you feel by day 7—calmer, sharper, and more focused.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow-md p-4 text-center border-t-4 border-red-500">
              <div className="font-bold text-lg mb-2 text-red-600">Monday</div>
              <span className="text-4xl mb-2 block" role="img" aria-label="puzzle piece">🧩</span>
              <p className="text-gray-700">Solve a logic puzzle.</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 text-center border-t-4 border-orange-500">
              <div className="font-bold text-lg mb-2 text-orange-600">Tuesday</div>
              <span className="text-4xl mb-2 block" role="img" aria-label="brain">🧠</span>
              <p className="text-gray-700">Do a 5-min memory match.</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 text-center border-t-4 border-yellow-500">
              <div className="font-bold text-lg mb-2 text-yellow-600">Wednesday</div>
              <span className="text-4xl mb-2 block" role="img" aria-label="abacus">🔢</span>
              <p className="text-gray-700">Try a math worksheet.</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 text-center border-t-4 border-yellow-400">
              <div className="font-bold text-lg mb-2 text-yellow-500">Thursday</div>
              <span className="text-4xl mb-2 block" role="img" aria-label="books">📚</span>
              <p className="text-gray-700">Read something new.</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 text-center border-t-4 border-green-500">
              <div className="font-bold text-lg mb-2 text-green-600">Friday</div>
              <span className="text-4xl mb-2 block" role="img" aria-label="artist palette">🎨</span>
              <p className="text-gray-700">Color a mindful mandala.</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 text-center border-t-4 border-teal-500">
              <div className="font-bold text-lg mb-2 text-teal-600">Saturday</div>
              <span className="text-4xl mb-2 block" role="img" aria-label="thought bubble">💭</span>
              <p className="text-gray-700">Journal one new thing.</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 text-center border-t-4 border-blue-500">
              <div className="font-bold text-lg mb-2 text-blue-600">Sunday</div>
              <span className="text-4xl mb-2 block" role="img" aria-label="sparkles">🌟</span>
              <p className="text-gray-700">Reflect on your progress.</p>
            </div>
          </div>

          <div className="text-center">
            <a 
              href="https://wizqo.com/interactive-worksheets-generator" 
              className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-lg text-lg font-bold hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              📚 Get Free Cognitive Skill Worksheets for Your 7-Day Challenge →
            </a>
          </div>
        </section>

        <footer className="mt-16 text-center max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-xl">
          <h2 className="text-3xl font-bold mb-4 text-red-600">
            💖 Remember: Progress, Not Perfection
          </h2>
          <p className="text-xl mb-4 text-gray-700">
            Building cognitive strength isn't about doing everything perfectly. It's about showing up — one small step, one puzzle, one worksheet at a time.
          </p>
          <p className="text-2xl italic font-semibold text-gray-800 mb-6">
            "Small progress is still progress. And progress builds confidence."
          </p>
          <a 
            href="https://wizqo.com/interactive-worksheets-generator" 
            className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-lg text-lg font-bold hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
          >
            Ready to strengthen your cognitive skills? Explore our free interactive worksheets →
          </a>
        </footer>
      </main>
    </div>
  );
}
