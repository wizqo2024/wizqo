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

export function GentleParentingFull() {
  const chartsRef = useRef<{ [k: string]: any }>({});

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
              labels: [['Traditional', 'Discipline'], ['Gentle', 'Parenting']],
              datasets: [{
                label: 'Reported Cooperation Rate',
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
                x: { beginAtZero: true, title: { display: true, text: 'Cooperation Rate (%)', color: '#2E7D32' } },
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
              labels: ['Tantrums Reduced', 'Remaining Baseline'],
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
              labels: ['Cooperation Gained', 'Baseline'],
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
              labels: ['Week 0', 'Week 1', 'Week 2', 'Week 3', 'Week 4'],
              datasets: [{
                label: 'Weekly Tantrum Incidents',
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
                y: { beginAtZero: false, title: { display: true, text: 'Avg. Tantrum Incidents', color: '#2E7D32' } },
                x: { title: { display: true, text: 'Weeks Applying Techniques', color: '#2E7D32' } }
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
  }, []);

  return (
    <div className="space-y-16">
      {/* Header */}
      <header className="text-center">
        <h1 className="text-4xl md:text-5xl font-black text-green-700 mb-3">
          Gentle Parenting Techniques That Actually Work — Real Stories, Science, and Simple Wins
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
            Table of Contents
          </h3>
          <nav className="flex flex-wrap gap-3">
            <a href="#what-is-gentle-parenting" className="text-green-700 hover:underline">What Is Gentle Parenting?</a>
            <a href="#the-science-connection-before-correction" className="text-green-700 hover:underline">The Science: Connection Before Correction</a>
            <a href="#five-gentle-parenting-techniques" className="text-green-700 hover:underline">5 Techniques That Work</a>
            <a href="#the-real-world-impact-by-the-numbers" className="text-green-700 hover:underline">Impact: By the Numbers</a>
            <a href="#common-myths-vs-reality" className="text-green-700 hover:underline">Common Myths vs. Reality</a>
            <a href="#you-can-start-today" className="text-green-700 hover:underline">You Can Start Today</a>
          </nav>
        </div>
      </section>

      {/* What is Gentle Parenting */}
      <section>
        <div className="bg-white rounded-xl shadow-xl p-6 md:p-10 border border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 id="what-is-gentle-parenting" className="text-3xl font-bold text-green-700 mb-3">What Is Gentle Parenting?</h2>
              <p className="mb-3">
                The goal of <strong>mindful parenting</strong> is not a “perfect” child. By applying
                <strong> gentle parenting techniques</strong>, you build a calmer, more connected relationship.
              </p>
              <p className="mb-3">At its heart, it means:</p>
              <ul className="space-y-2 mb-4">
                <li className="flex items-center"><span className="text-2xl mr-3">🤝</span><strong className="text-green-800">Respect</strong> over fear.</li>
                <li className="flex items-center"><span className="text-2xl mr-3">🧭</span><strong className="text-green-800">Guidance</strong> over punishment.</li>
                <li className="flex items-center"><span className="text-2xl mr-3">❤️</span><strong className="text-green-800">Empathy</strong> over control.</li>
              </ul>
              <p>It’s not about letting kids “get away” with things. It’s about teaching
                <strong> emotional intelligence</strong> and problem‑solving in real time.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-center text-green-800 mb-2">Study: Impact on Child Cooperation</h3>
              <p className="text-sm text-center mb-4">A 2023 APA study found parents shifting to gentle techniques saw a 60% improvement in cooperation vs. traditional methods.</p>
              <div className="max-w-lg h-64 mx-auto">
                <canvas id="cooperationBarChart" aria-label="Bar chart: cooperation improvement" role="img"></canvas>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Science section */}
      <section>
        <h2 id="the-science-connection-before-correction" className="text-3xl font-bold text-green-700 mb-4 text-center">The Science: Connection Before Correction</h2>
        <div className="bg-white rounded-xl shadow-xl p-6 md:p-10 border border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="flex flex-col items-center">
              <p className="text-center mb-4">A child's "downstairs brain" (emotions) often overrides the "upstairs brain" (logic) when upset. Connection calms first; then correction teaches.</p>
              <div className="w-full max-w-xs text-center">
                <div className="bg-green-300 text-green-900 font-semibold p-4 rounded-t-lg shadow-md">
                  🧠 Upstairs Brain
                  <span className="block text-sm font-normal text-white">(Logic, Reasoning, Control)</span>
                </div>
                <div className="flex justify-center my-1">
                  <div className="w-1.5 h-16 bg-green-500"></div>
                </div>
                <div className="text-center -mt-3 mb-2">
                  <div className="inline-block w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-green-500"></div>
                </div>
                <div className="bg-green-500 text-white font-semibold p-4 rounded-b-lg shadow-md">
                  ❤️ Downstairs Brain
                  <span className="block text-sm font-normal">(Emotions, Instincts, Tantrums)</span>
                </div>
              </div>
              <p className="text-center mt-4 font-semibold text-green-800">Connection first. Cooperation next.</p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-green-700 mb-2">Real-Life Example:</h3>
              <p className="mb-3">When 7‑year‑old Mia refused to put on her shoes, instead of yelling, her mom knelt and said:</p>
              <blockquote className="border-l-4 border-green-500 pl-4 py-2 text-green-800 italic">
                “You really don’t want to stop playing, right? It’s hard to leave something fun.”
              </blockquote>
              <p className="mt-3">Mia nodded, took a deep breath — and then slipped on her shoes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Techniques grid */}
      <section>
        <h2 id="five-gentle-parenting-techniques" className="text-3xl font-bold text-green-700 mb-6 text-center">5 Gentle Parenting Techniques That Work</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {["Pause Before Reacting","Name the Emotion","Offer Choices, Not Orders","Repair After Conflict","Set Boundaries with Love"].map((title, idx) => (
            <div key={idx} className="bg-white p-6 rounded-lg shadow-lg border border-slate-200">
              <span className="text-4xl">{idx + 1}️⃣</span>
              <h3 className="text-xl font-bold text-green-800 my-2">{title}</h3>
              <p className="text-slate-700">
                {idx === 0 && 'Even 5 seconds can reset your tone. Using gentle parenting techniques models calm discipline — a vital skill.'}
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
        <h2 id="the-real-world-impact-by-the-numbers" className="text-3xl font-bold text-green-700 mb-6 text-center">The Real‑World Impact: By the Numbers</h2>
        <p className="text-center max-w-3xl mx-auto mb-8">
          <strong>Gentle parenting techniques</strong> are backed by science. They reduce stress hormones and improve connected cooperation over time.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-xl text-center border border-slate-200">
            <div className="max-w-xs mx-auto h-56">
              <canvas id="tantrumDonutChart" aria-label="Donut showing tantrum reduction" role="img"></canvas>
            </div>
            <h3 className="text-lg font-semibold text-green-800 mt-4">42% Fewer Tantrums</h3>
            <p className="text-sm">Reported after 30 days.</p>
          </div>
          <div className="bg-green-600 text-white p-6 rounded-lg shadow-xl text-center">
            <span className="text-7xl font-bold">3x</span>
            <h3 className="text-2xl font-semibold mt-2">Better Emotional Vocabulary</h3>
            <p className="text-sm">In kids aged 3–8.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-xl text-center border border-slate-200">
            <div className="max-w-xs mx-auto h-56">
              <canvas id="cooperationDonutChart" aria-label="Donut showing cooperation gain" role="img"></canvas>
            </div>
            <h3 className="text-lg font-semibold text-green-800 mt-4">60% Higher Cooperation</h3>
            <p className="text-sm">From improved connection.</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-xl p-6 md:p-8 border border-slate-200">
          <h3 className="text-2xl font-bold text-green-700 mb-4 text-center">Tracking Progress: Tantrum Reduction Over Time</h3>
          <div className="max-w-3xl h-80 mx-auto">
            <canvas id="tantrumLineChart" aria-label="Line chart: tantrum reduction trend" role="img"></canvas>
          </div>
        </div>
      </section>

      {/* Myths vs Reality */}
      <section>
        <h2 id="common-myths-vs-reality" className="text-3xl font-bold text-green-700 mb-6 text-center">Common Myths vs. Reality</h2>
        <div className="bg-white rounded-lg shadow-xl overflow-hidden border border-slate-200">
          <table className="w-full">
            <thead className="bg-green-500 text-white">
              <tr>
                <th className="text-left p-4 text-lg w-1/2">❌ Myth</th>
                <th className="text-left p-4 text-lg w-1/2">✅ Reality</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr className="hover:bg-green-50">
                <td className="p-4 font-semibold">“It’s too soft.”</td>
                <td className="p-4">It’s firm and consistent — just without fear tactics. This is the foundation of effective <strong>gentle parenting techniques</strong>.</td>
              </tr>
              <tr className="hover:bg-green-50">
                <td className="p-4 font-semibold">“Kids won’t respect you.”</td>
                <td className="p-4">Respect is modeled, not demanded. Calm, respectful parents model the behavior they want to see.</td>
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
        <h2 id="you-can-start-today" className="text-3xl font-bold text-green-700 mb-4">You Can Start Today</h2>
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-xl border border-slate-200">
          <p className="mb-6">Nobody’s perfect. The beauty of gentle parenting is you can start today, even after tough moments. You’re not raising a “good” kid — you’re raising a kind, emotionally aware human.</p>
          <h3 className="text-xl font-semibold text-green-800 mb-3">Start Small:</h3>
          <ul className="space-y-3 text-left w-fit mx-auto">
            <li className="flex items-center text-green-800"><span className="text-green-800 text-2xl mr-3">🧘</span><span>Take one deep breath before reacting, a step toward <span className="font-semibold">parenting without yelling</span>.</span></li>
            <li className="flex items-center"><span className="text-green-700 text-2xl mr-3">🎧</span>Listen more than you lecture.</li>
            <li className="flex items-center"><span className="text-green-700 text-2xl mr-3">💬</span>Validate feelings: “You’re sad it’s bedtime, huh?”</li>
            <li className="flex items-center"><span className="text-green-700 text-2xl mr-3">🤗</span>Hug after hard moments.</li>
          </ul>
        </div>
        <div className="mt-10">
          <h2 className="text-3xl font-bold text-green-700">🌟 Progress over perfection.</h2>
          <h2 className="text-3xl font-bold text-green-700 mt-1">Connection over control.</h2>
        </div>
      </section>

      {/* Internal Links */}
      <section aria-labelledby="keep-exploring-title" className="max-w-4xl mx-auto w-full">
        <h2 id="keep-exploring-title" className="text-2xl font-bold text-green-700 mb-4">
          Motivate your child with these activities
        </h2>
        <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
          <a href="/kids" className="block p-4 rounded-lg border border-slate-200 bg-white hover:bg-slate-50">Kids Hub – Play, Print, and Learn</a>
          <a href="/worksheets/reading-comprehension" className="block p-4 rounded-lg border border-slate-200 bg-white hover:bg-slate-50">Reading Comprehension Worksheets</a>
          <a href="/blog/easy-hobbies-that-make-you-smarter" className="block p-4 rounded-lg border border-slate-200 bg-white hover:bg-slate-50">Easy Hobbies That Make You Smarter</a>
          <a href="/printables" className="block p-4 rounded-lg border border-slate-200 bg-white hover:bg-slate-50">Printables for Kids</a>
        </div>
      </section>
    </div>
  );
}

export default GentleParentingFull;
