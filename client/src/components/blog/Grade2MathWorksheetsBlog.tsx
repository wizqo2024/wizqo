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

export default function Grade2MathWorksheetsBlog() {
  const anxietyChartRef = useRef<HTMLCanvasElement | null>(null);
  const coreConceptsChartRef = useRef<HTMLCanvasElement | null>(null);
  const placeValueChartRef = useRef<HTMLCanvasElement | null>(null);
  const wordProblemsChartRef = useRef<HTMLCanvasElement | null>(null);
  const multiplicationChartRef = useRef<HTMLCanvasElement | null>(null);
  const funFactorChartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstancesRef = useRef<any[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await loadChartJs();
        if (!mounted) return;
        const Chart = (window as any).Chart;
        const PALETTE = {
          red: '#FF6B6B',
          yellow: '#FFD166',
          green: '#06D6A0',
          blue: '#118AB2',
          darkBlue: '#073B4C',
          gray: '#6c757d'
        };

        const tooltipTitleCallback = (tooltipItems: any[]) => {
          const item = tooltipItems[0];
          let label = item.chart.data.labels[item.dataIndex];
          if (Array.isArray(label)) {
            return label.join(' ');
          } else {
            return label;
          }
        };

        const processLabels = (labels: string[]) => {
          const charLimit = 16;
          return labels.map(label => {
            if (label.length > charLimit) {
              let words = label.split(' ');
              let lines: string[] = [];
              let currentLine = '';
              for (let word of words) {
                if ((currentLine + word).length > charLimit && currentLine.length > 0) {
                  lines.push(currentLine.trim());
                  currentLine = word + ' ';
                } else {
                  currentLine += word + ' ';
                }
              }
              lines.push(currentLine.trim());
              return lines;
            }
            return label;
          });
        };

        const commonChartOptions = {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: {
                color: PALETTE.darkBlue
              }
            },
            tooltip: {
              callbacks: {
                title: tooltipTitleCallback
              }
            }
          },
          color: PALETTE.darkBlue,
        };

        // Anxiety Chart
        const anxietyCtx = anxietyChartRef.current?.getContext('2d');
        if (anxietyCtx) {
          const chart = new Chart(anxietyCtx, {
            type: 'doughnut',
            data: {
              labels: ['Experience Anxiety', 'Feel Confident'],
              datasets: [{
                data: [65, 35],
                backgroundColor: [PALETTE.red, PALETTE.blue],
                borderWidth: 0,
              }]
            },
            options: {
              ...commonChartOptions,
              cutout: '70%',
              plugins: {
                ...commonChartOptions.plugins,
                legend: {
                  position: 'bottom',
                  labels: {
                    color: PALETTE.darkBlue
                  }
                },
              }
            }
          });
          chartInstancesRef.current.push(chart);
        }

        // Core Concepts Chart
        const coreConceptsCtx = coreConceptsChartRef.current?.getContext('2d');
        if (coreConceptsCtx) {
          const radarLabels = ['Number Sense (Place Value)', 'Addition/Subtraction Fluency', 'Problem Solving (Word Problems)', 'Future Skills (Multiplication)', 'Engagement & Fun'];
          const processedRadarLabels = processLabels(radarLabels);
          const chart = new Chart(coreConceptsCtx, {
            type: 'radar',
            data: {
              labels: processedRadarLabels,
              datasets: [{
                label: 'Worksheet Focus',
                data: [9, 10, 8, 7, 9],
                backgroundColor: 'rgba(17, 138, 178, 0.2)',
                borderColor: PALETTE.blue,
                pointBackgroundColor: PALETTE.blue,
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: PALETTE.blue
              }]
            },
            options: {
              ...commonChartOptions,
              scales: {
                r: {
                  angleLines: { color: '#ddd' },
                  grid: { color: '#eee' },
                  pointLabels: {
                    color: PALETTE.darkBlue,
                    font: {
                      size: 13
                    }
                  },
                  ticks: {
                    backdropColor: 'transparent',
                    color: PALETTE.gray,
                    stepSize: 2
                  }
                }
              }
            }
          });
          chartInstancesRef.current.push(chart);
        }

        // Place Value Chart
        const placeValueCtx = placeValueChartRef.current?.getContext('2d');
        if (placeValueCtx) {
          const pieLabels = ['Tens & Ones', 'Hundreds, Tens, Ones', 'Expanded Form', 'Comparing Numbers', 'Number Ordering'];
          const processedPieLabels = processLabels(pieLabels);
          const chart = new Chart(placeValueCtx, {
            type: 'pie',
            data: {
              labels: processedPieLabels,
              datasets: [{
                data: [25, 20, 20, 20, 15],
                backgroundColor: [PALETTE.green, PALETTE.blue, PALETTE.yellow, PALETTE.red, PALETTE.gray],
                borderWidth: 0
              }]
            },
            options: {
              ...commonChartOptions,
              plugins: {
                ...commonChartOptions.plugins,
                legend: {
                  position: 'bottom',
                  labels: {
                    color: PALETTE.darkBlue,
                    boxWidth: 20,
                  }
                },
              }
            }
          });
          chartInstancesRef.current.push(chart);
        }

        // Word Problems Chart
        const wordProblemsCtx = wordProblemsChartRef.current?.getContext('2d');
        if (wordProblemsCtx) {
          const barLabels = ['Real-World Examples', 'Logic-Based Problems', 'Multi-Step Thinking', 'Simple Money Problems', 'Measurement Problems'];
          const processedBarLabels = processLabels(barLabels);
          const chart = new Chart(wordProblemsCtx, {
            type: 'bar',
            data: {
              labels: processedBarLabels,
              datasets: [{
                label: 'Problem Variety',
                data: [10, 7, 6, 8, 7],
                backgroundColor: [PALETTE.yellow, PALETTE.yellow, PALETTE.yellow, PALETTE.yellow, PALETTE.yellow],
                borderRadius: 4
              }]
            },
            options: {
              ...commonChartOptions,
              plugins: {
                ...commonChartOptions.plugins,
                legend: { display: false }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  grid: {
                    color: '#eee'
                  },
                  ticks: { color: PALETTE.gray }
                },
                x: {
                  grid: {
                    display: false
                  },
                  ticks: { color: PALETTE.darkBlue }
                }
              }
            }
          });
          chartInstancesRef.current.push(chart);
        }

        // Multiplication Chart
        const multiplicationCtx = multiplicationChartRef.current?.getContext('2d');
        if (multiplicationCtx) {
          const chart = new Chart(multiplicationCtx, {
            type: 'bubble',
            data: {
              labels: ['Repeated Addition', 'Equal Groups', 'Arrays', 'Skip Counting'],
              datasets: [{
                label: 'Repeated Addition',
                data: [{ x: 3, y: 5, r: 25 }],
                backgroundColor: 'rgba(255, 107, 107, 0.7)'
              }, {
                label: 'Equal Groups',
                data: [{ x: 6, y: 8, r: 20 }],
                backgroundColor: 'rgba(255, 107, 107, 0.7)'
              }, {
                label: 'Arrays',
                data: [{ x: 8, y: 4, r: 18 }],
                backgroundColor: 'rgba(255, 107, 107, 0.7)'
              }, {
                label: 'Skip Counting',
                data: [{ x: 5, y: 2, r: 15 }],
                backgroundColor: 'rgba(255, 107, 107, 0.7)'
              }]
            },
            options: {
              ...commonChartOptions,
              plugins: {
                ...commonChartOptions.plugins,
                legend: { display: false }
              },
              scales: {
                y: {
                  display: false,
                  grid: { display: false }
                },
                x: {
                  display: false,
                  grid: { display: false }
                }
              }
            }
          });
          chartInstancesRef.current.push(chart);
        }

        // Fun Factor Chart
        const funFactorCtx = funFactorChartRef.current?.getContext('2d');
        if (funFactorCtx) {
          const chart = new Chart(funFactorCtx, {
            type: 'bar',
            data: {
              labels: ['Learning Blend'],
              datasets: [
                {
                  label: 'Focused Practice',
                  data: [60],
                  backgroundColor: PALETTE.blue,
                  borderRadius: 4
                },
                {
                  label: 'Fun & Games',
                  data: [40],
                  backgroundColor: PALETTE.green,
                  borderRadius: 4
                }
              ]
            },
            options: {
              ...commonChartOptions,
              indexAxis: 'y',
              plugins: {
                ...commonChartOptions.plugins,
                legend: {
                  position: 'bottom',
                  labels: {
                    color: PALETTE.darkBlue
                  }
                },
              },
              scales: {
                x: {
                  stacked: true,
                  display: false,
                  grid: { display: false }
                },
                y: {
                  stacked: true,
                  display: false,
                  grid: { display: false }
                }
              }
            }
          });
          chartInstancesRef.current.push(chart);
        }
      } catch (err) {
        console.error('Failed to load charts:', err);
      }
    })();

    return () => {
      mounted = false;
      chartInstancesRef.current.forEach(chart => {
        if (chart) chart.destroy();
      });
      chartInstancesRef.current = [];
    };
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 bg-gray-50">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-[#073B4C] mb-4">Free Grade 2 Math Worksheets (PDF)</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">Download high-quality, printable resources to build your child's confidence and make learning fun! Explore our comprehensive collection of <a href="/worksheets/2nd-grade-math-worksheets" className="text-blue-600 hover:text-blue-800 underline font-semibold">2nd grade math worksheets</a> designed to support every learning style.</p>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-xl p-6 md:p-8 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-[#073B4C] mb-4">The Challenge: Math Anxiety</h2>
          <p className="text-gray-600 mb-4">Grade 2 (ages 7-8) is a critical time. As concepts get harder, many children first experience math anxiety. This can impact their confidence for years to come.</p>
          <div className="relative w-full max-w-[600px] mx-auto" style={{ height: '280px', maxHeight: '400px' }}>
            <canvas ref={anxietyChartRef}></canvas>
          </div>
          <p className="text-sm text-gray-500 mt-4 text-center">Our worksheets are designed to turn potential anxiety into a feeling of accomplishment, with a focus on positive reinforcement.</p>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-6 md:p-8">
          <h2 className="text-2xl font-bold text-[#073B4C] mb-4">The Goal: Building Confidence</h2>
          <p className="text-gray-600 mb-4">Confidence isn't just a bonus; it's the foundation. When kids feel successful, they build resilience and a "growth mindset." We focus on a simple, powerful loop:</p>
          <div className="flex flex-col space-y-4 mt-6">
            <div className="flex items-center p-4 bg-green-50 rounded-lg shadow-inner">
              <span className="text-3xl mr-4">1.</span>
              <div className="flex-1">
                <h3 className="font-semibold text-green-800">Practice</h3>
                <p className="text-green-700">Clear, kid-friendly worksheets that feel achievable.</p>
              </div>
            </div>
            <div className="flex justify-center -my-2">
              <span className="text-4xl text-gray-400">↓</span>
            </div>
            <div className="flex items-center p-4 bg-yellow-50 rounded-lg shadow-inner">
              <span className="text-3xl mr-4">2.</span>
              <div className="flex-1">
                <h3 className="font-semibold text-yellow-800">Mastery</h3>
                <p className="text-yellow-700">One concept at a time, allowing kids to "win" often.</p>
              </div>
            </div>
            <div className="flex justify-center -my-2">
              <span className="text-4xl text-gray-400">↓</span>
            </div>
            <div className="flex items-center p-4 bg-blue-50 rounded-lg shadow-inner">
              <span className="text-3xl mr-4">3.</span>
              <div className="flex-1">
                <h3 className="font-semibold text-blue-800">Confidence</h3>
                <p className="text-blue-700">The "I can do this!" feeling that encourages more practice.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 bg-white rounded-lg shadow-xl p-6 md:p-8">
          <h2 className="text-2xl font-bold text-center text-[#073B4C] mb-4">What Makes Grade 2 Math So Important?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto text-center">Grade 2 builds the entire foundation for future math. Our worksheets provide balanced coverage across all 5 key areas, ensuring no skill gaps are left behind. If your child is just starting, check out our <a href="/worksheets/1st-grade-math-worksheets" className="text-blue-600 hover:text-blue-800 underline font-semibold">1st grade math worksheets</a> to build foundational skills first.</p>
          <div className="relative w-full max-w-[600px] mx-auto" style={{ height: '400px', maxHeight: '450px' }}>
            <canvas ref={coreConceptsChartRef}></canvas>
          </div>
          <p className="text-sm text-gray-500 mt-4 text-center">This balanced approach ensures students develop fluency, deep number sense, and critical problem-solving skills simultaneously.</p>
        </div>

        <div className="md:col-span-2 text-center mt-8">
          <h2 className="text-3xl font-bold text-[#073B4C] mb-4">A Closer Look: The 5 Core Worksheet Categories</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">We structure learning by topic, allowing children to build mastery step-by-step. Here's a breakdown of what's included in each critical category. All worksheets are available in our <a href="/worksheets/2nd-grade-math-worksheets" className="text-blue-600 hover:text-blue-800 underline font-semibold">2nd grade math worksheets collection</a>.</p>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-6 md:p-8">
          <h3 className="text-xl font-bold text-[#118AB2] mb-4">1. Addition & Subtraction Fluency</h3>
          <p className="text-gray-600 mb-6">This is all about building speed and accuracy. Our worksheets follow a clear progression, moving from simple sums to complex regrouping, ensuring kids never feel overwhelmed.</p>
          
          <div className="flex flex-col space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg shadow-inner border-l-4 border-[#118AB2]">
              <h4 className="font-semibold">Step 1: 2-Digit Practice</h4>
              <p className="text-sm text-gray-600">Mastering basic sums and differences.</p>
            </div>
            <div className="flex justify-center text-2xl text-gray-400">↓</div>
            <div className="p-4 bg-gray-50 rounded-lg shadow-inner border-l-4 border-[#118AB2]">
              <h4 className="font-semibold">Step 2: 3-Digit Practice</h4>
              <p className="text-sm text-gray-600">Applying the same concepts to larger numbers.</p>
            </div>
            <div className="flex justify-center text-2xl text-gray-400">↓</div>
            <div className="p-4 bg-gray-50 rounded-lg shadow-inner border-l-4 border-[#118AB2]">
              <h4 className="font-semibold">Step 3: Borrowing & Regrouping</h4>
              <p className="text-sm text-gray-600">Tackling the trickiest part of subtraction and addition.</p>
            </div>
            <div className="flex justify-center text-2xl text-gray-400">↓</div>
            <div className="p-4 bg-gray-50 rounded-lg shadow-inner border-l-4 border-[#118AB2]">
              <h4 className="font-semibold">Step 4: Speed Drills</h4>
              <p className="text-sm text-gray-600">Building true fluency and automatic recall.</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-6 md:p-8">
          <h3 className="text-xl font-bold text-[#06D6A0] mb-4">2. Strengthening Place Value</h3>
          <p className="text-gray-600 mb-6">Understanding *why* a '5' in 52 is different from a '5' in 520 is the most important Grade 2 skill. Our worksheets break this "number sense" into key parts.</p>
          <div className="relative w-full max-w-[600px] mx-auto" style={{ height: '320px', maxHeight: '400px' }}>
            <canvas ref={placeValueChartRef}></canvas>
          </div>
          <p className="text-sm text-gray-500 mt-4 text-center">By practicing all these components, children move from just counting to truly understanding how numbers are built.</p>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-6 md:p-8">
          <h3 className="text-xl font-bold text-[#FFD166] mb-4">3. Meaningful Word Problems</h3>
          <p className="text-gray-600 mb-6">This is where math meets the real world. We focus on worksheets that teach children how to *think* like a problem-solver and apply their skills to stories and scenarios.</p>
          <div className="relative w-full max-w-[600px] mx-auto" style={{ height: '400px', maxHeight: '450px' }}>
            <canvas ref={wordProblemsChartRef}></canvas>
          </div>
          <p className="text-sm text-gray-500 mt-4 text-center">This variety ensures kids learn to identify the *question* being asked, not just look for numbers to add or subtract.</p>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-6 md:p-8">
          <h3 className="text-xl font-bold text-[#FF6B6B] mb-4">4. Early Multiplication Concepts</h3>
          <p className="text-gray-600 mb-6">To prepare them for Grade 3, we introduce the *idea* of multiplication. These concepts are presented visually, making the transition intuitive and stress-free. For more advanced practice, explore our <a href="/worksheets/3rd-grade-math-worksheets" className="text-blue-600 hover:text-blue-800 underline font-semibold">3rd grade math worksheets</a> when your child is ready.</p>
          <div className="relative w-full max-w-[600px] mx-auto" style={{ height: '400px', maxHeight: '450px' }}>
            <canvas ref={multiplicationChartRef}></canvas>
          </div>
          <p className="text-sm text-gray-500 mt-4 text-center">Each bubble represents a core concept, with size indicating its foundational importance. All are linked, showing multiplication is just a faster way to add.</p>
        </div>

        <div className="md:col-span-2 bg-white rounded-lg shadow-xl p-6 md:p-8">
          <h2 className="text-2xl font-bold text-center text-[#073B4C] mb-4">5. The 'Fun Factor': Engagement is Everything</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto text-center">Kids learn best when they don't *realize* they're learning. We believe in a healthy blend of focused practice and pure fun. Our resources include mazes, puzzles, and coloring pages to keep kids motivated.</p>
          <div className="relative w-full max-w-[600px] mx-auto" style={{ height: '200px', maxHeight: '250px' }}>
            <canvas ref={funFactorChartRef}></canvas>
          </div>
          <p className="text-sm text-gray-500 mt-4 text-center">This blend ensures children associate math with positive feelings, building a habit of practice that lasts.</p>
        </div>
        
        <div className="md:col-span-2 bg-white rounded-lg shadow-xl p-6 md:p-8">
          <h2 className="text-2xl font-bold text-center text-[#073B4C] mb-4">Why Parents & Teachers Love These Worksheets</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto text-center">Our resources are designed to be effective, accessible, and high-quality. Here are the features that make a difference:</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 text-center">
            <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
              <span className="text-5xl">✔</span>
              <h4 className="font-semibold mt-2">100% Free</h4>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
              <span className="text-5xl">📥</span>
              <h4 className="font-semibold mt-2">Printable PDF</h4>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
              <span className="text-5xl">🔑</span>
              <h4 className="font-semibold mt-2">No Login Required</h4>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
              <span className="text-5xl">🎓</span>
              <h4 className="font-semibold mt-2">Educator Designed</h4>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
              <span className="text-5xl">🏠</span>
              <h4 className="font-semibold mt-2">Home & Classroom</h4>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
              <span className="text-5xl">😊</span>
              <h4 className="font-semibold mt-2">Kid-Friendly Layout</h4>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 bg-green-500 text-white p-8 rounded-lg shadow-xl text-center">
          <h2 className="text-3xl font-bold mb-4">Download Your Free Grade 2 Math Worksheets</h2>
          <p className="text-lg text-green-100 mb-6">Ready to get started? Get your free pack designed for learning, confidence, and fun. Browse our complete collection of <a href="/worksheets/2nd-grade-math-worksheets" className="text-white underline font-semibold hover:text-green-100">2nd grade math worksheets</a> or use our <a href="/interactive-worksheets-generator" className="text-white underline font-semibold hover:text-green-100">Interactive Worksheets Generator</a> to create unlimited unique worksheets with answer keys—perfect for classrooms, homework, or extra practice.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a href="/worksheets/2nd-grade-math-worksheets" className="inline-block bg-white text-green-600 font-bold py-3 px-8 rounded-full shadow-lg text-lg transform hover:scale-105 transition-transform">
              Browse 2nd Grade Worksheets
            </a>
            <a href="/interactive-worksheets-generator" className="inline-block bg-green-600 text-white font-bold py-3 px-8 rounded-full shadow-lg text-lg transform hover:scale-105 transition-transform border-2 border-white">
              Generate Custom Worksheets
            </a>
          </div>
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
      </main>

      <footer className="text-center mt-12 py-8 border-t border-gray-300">
        <p className="text-lg text-gray-700 max-w-3xl mx-auto">You're not just downloading worksheets—you're building your child's confidence. Give them the tools to believe in themselves today. Explore more resources: <a href="/worksheets/1st-grade-math-worksheets" className="text-blue-600 hover:text-blue-800 underline">1st Grade Math</a>, <a href="/worksheets/3rd-grade-math-worksheets" className="text-blue-600 hover:text-blue-800 underline">3rd Grade Math</a>, or <a href="/interactive-worksheets-generator" className="text-blue-600 hover:text-blue-800 underline">create custom worksheets</a>.</p>
      </footer>
    </div>
  );
}
