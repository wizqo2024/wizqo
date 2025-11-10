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

export default function MultiplicationWorksheetsBlog() {
  const retentionChartRef = useRef<HTMLCanvasElement | null>(null);
  const worksheetChartRef = useRef<HTMLCanvasElement | null>(null);
  const retentionChartInstanceRef = useRef<any>(null);
  const worksheetChartInstanceRef = useRef<any>(null);

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
          const labels = ['Reading or Watching', 'Listening', 'Writing / Worksheets', 'Teaching Others'];
          const wrappedLabels = labels.map(l => wrapLabel(l, 16));
          retentionChartInstanceRef.current = new Chart(ctxRetention, {
            type: 'bar',
            data: {
              labels: wrappedLabels,
              datasets: [{
                label: 'Retention Rate',
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
            { label: 'Basic 1–5 Times Tables', difficulty: 1 },
            { label: 'Color-by-Number Pages', difficulty: 1 },
            { label: 'Double-Digit Practice', difficulty: 2 },
            { label: 'Word Problem Sheets', difficulty: 2 },
            { label: 'Timed Challenges', difficulty: 3 },
          ].sort((a, b) => a.difficulty - b.difficulty);

          const wrappedLabels = sortedData.map(d => wrapLabel(d.label, 16));
          const difficultyData = sortedData.map(d => d.difficulty);

          worksheetChartInstanceRef.current = new Chart(ctxWorksheet, {
            type: 'bar',
            data: {
              labels: wrappedLabels,
              datasets: [{
                label: 'Difficulty Rating (out of 3)',
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
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-blue-600 mb-3">Why Are Worksheets a Game Changer?</h2>
          <p className="text-gray-700 leading-relaxed">For many learners, multiplication is where math starts to feel "serious." As numbers get bigger, confidence can drop. Printable worksheets transform this frustration into visible progress, building skill, structure, and self-belief one page at a time. Unlike screens, they offer repetition without distraction and build visual memory. For teachers and parents looking to create unlimited unique practice sheets, our <a href="/interactive-worksheets-generator" className="text-blue-600 hover:text-blue-800 underline font-semibold">Interactive Worksheets Generator</a> makes it easy to generate fresh multiplication worksheets with answer keys in seconds.</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">The Power of Practice</h2>
          <p className="text-gray-600 mb-4">Learning science is clear: writing by hand engages the brain differently and more effectively than typing or tapping.</p>
          <div className="text-8xl font-bold text-blue-600">70%</div>
          <div className="text-2xl font-semibold text-gray-700 mt-2">Improved Retention</div>
          <p className="text-gray-600 mt-4">That's the boost learners get from writing answers by hand. Each solved page is a small victory that builds motivation and long-term memory.</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">How Printables Boost Retention</h2>
          <p className="text-gray-600 mb-4">Worksheets are a powerful, evidence-based method for building long-term knowledge. Compared to passive learning, active writing and problem-solving create much stronger neural pathways.</p>
          <div className="relative w-full max-w-[600px] mx-auto" style={{ height: '300px', maxHeight: '400px' }}>
            <canvas ref={retentionChartRef}></canvas>
          </div>
          <p className="text-gray-600 mt-4 text-center">This chart shows the average retention rate by learning method, highlighting why active practice is superior for mastery.</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">What's Inside the Worksheet Pack?</h2>
          <p className="text-gray-600 mb-4">The free pack is designed to build skills progressively, from basic familiarity to real-world application, with a mix of fun and focus. This chart visualizes the relative difficulty of each sheet type. Our <a href="/interactive-worksheets-generator" className="text-blue-600 hover:text-blue-800 underline font-semibold">Interactive Worksheets Generator</a> creates multiplication worksheets that include arrays, word problems, and timed challenges—all with printable answer keys included.</p>
          <div className="relative w-full max-w-[600px] mx-auto" style={{ height: '300px', maxHeight: '400px' }}>
            <canvas ref={worksheetChartRef}></canvas>
          </div>
          <p className="text-gray-600 mt-4 text-center">The pack also includes answer keys, fun themes, and visual guides to ensure learners feel supported and engaged.</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">From Frustration to Focus</h2>
          <p className="text-gray-600 mb-4">A parent from Dubai shared their story, proving that the right materials can turn routine into reward and change a child's mindset about math.</p>
          <blockquote className="bg-blue-100 border-l-4 border-blue-500 text-blue-800 p-4 rounded-r-lg">
            <p className="italic">"My son hated multiplication drills until we tried these printable sheets. The color-by-number pages made him laugh... Now he finishes practice before I even ask!"</p>
            <cite className="mt-2 block not-italic font-semibold">— A Parent from Dubai</cite>
          </blockquote>
          <p className="text-gray-600 mt-4">This is the goal: turning a chore into a choice by making learning feel rewarding.</p>
        </div>

        <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">The 4-Step Learning Process</h2>
          <p className="text-gray-700 leading-relaxed mb-6">Our sheets follow a simple but effective pattern. Learners don't just guess; they connect math with meaning and build a solid foundation for fluency. Each step builds naturally on the previous one, creating a clear path from confusion to confidence.</p>
          <div className="flex flex-col md:flex-row items-center justify-between w-full space-y-4 md:space-y-0 md:space-x-2">
            <div className="flex-1 w-full bg-gray-100 p-4 rounded-lg shadow-inner text-center">
              <div className="text-3xl mb-2">1.</div>
              <h3 className="text-xl font-semibold text-blue-600">Visualize</h3>
              <p className="text-gray-700">Group objects and count patterns.</p>
            </div>
            <span className="text-blue-500 text-3xl font-bold md:hidden">▼</span>
            <span className="text-blue-500 text-3xl font-bold hidden md:block px-2">→</span>
            <div className="flex-1 w-full bg-gray-100 p-4 rounded-lg shadow-inner text-center">
              <div className="text-3xl mb-2">2.</div>
              <h3 className="text-xl font-semibold text-blue-600">Understand</h3>
              <p className="text-gray-700">See math as "adding equal groups."</p>
            </div>
            <span className="text-blue-500 text-3xl font-bold md:hidden">▼</span>
            <span className="text-blue-500 text-3xl font-bold hidden md:block px-2">→</span>
            <div className="flex-1 w-full bg-gray-100 p-4 rounded-lg shadow-inner text-center">
              <div className="text-3xl mb-2">3.</div>
              <h3 className="text-xl font-semibold text-blue-600">Apply</h3>
              <p className="text-gray-700">Solve fun, real-life word problems.</p>
            </div>
            <span className="text-blue-500 text-3xl font-bold md:hidden">▼</span>
            <span className="text-blue-500 text-3xl font-bold hidden md:block px-2">→</span>
            <div className="flex-1 w-full bg-gray-100 p-4 rounded-lg shadow-inner text-center">
              <div className="text-3xl mb-2">4.</div>
              <h3 className="text-xl font-semibold text-blue-600">Recall</h3>
              <p className="text-gray-700">Practice timed drills for fluency.</p>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 bg-green-500 text-white p-8 rounded-lg shadow-xl text-center">
          <h2 className="text-3xl font-bold mb-4">Download Your Free Printable Worksheets</h2>
          <p className="text-lg text-green-100 mb-6">Ready to get started? Get your free pack designed for learning, confidence, and fun. Use our <a href="/interactive-worksheets-generator" className="text-white underline font-semibold hover:text-green-100">Interactive Worksheets Generator</a> to create unlimited unique multiplication worksheets with answer keys—perfect for classrooms, homework, or extra practice.</p>
          <a href="/interactive-worksheets-generator" className="inline-block bg-white text-green-600 font-bold py-3 px-8 rounded-full shadow-lg text-lg transform hover:scale-105 transition-transform">
            Generate Free Worksheets Now
          </a>
          <ul className="flex flex-col md:flex-row justify-center items-center space-y-2 md:space-y-0 md:space-x-6 mt-8 text-green-50">
            <li className="flex items-center">
              <span className="text-2xl mr-2">✅</span> No sign-up required
            </li>
            <li className="flex items-center">
              <span className="text-2xl mr-2">✅</span> Classroom & home use
            </li>
            <li className="flex items-center">
              <span className="text-2xl mr-2">✅</span> Reusable and shareable
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
