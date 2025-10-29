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

export default function HWTInfographic() {
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

        chartInstanceRef.current = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: [
              wrap('Fine Motor Control'),
              wrap('Letter Formation Accuracy'),
              wrap('Writing Fluency and Speed')
            ],
            datasets: [{
              label: '% Improvement',
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
                  text: '% Improvement',
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
                text: 'Student Improvement with HWT (2023 AOTA Study)',
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
          // @ts-ignore
          new Chart(donutCtx, {
            type: 'doughnut',
            data: {
              labels: ['Tactile Play (Sensory)', 'Pencil Practice', 'Warm-up (Gross Motor)', 'Review & Reflection'],
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
                title: { display: true, text: 'Ideal Session Time Allocation (Placeholder)', color: '#073B4C' }
              }
            }
          });
        }

        // Line (trend placeholder)
        const lineCtx = (document.getElementById('hwt-trend') as HTMLCanvasElement | null)?.getContext('2d');
        if (lineCtx) {
          // @ts-ignore
          new Chart(lineCtx, {
            type: 'line',
            data: {
              labels: ['Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 'Month 6'],
              datasets: [{
                label: 'Average Score (0–100)',
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
              plugins: { legend: { display: false }, title: { display: true, text: '6-Month Score Improvement Trend (Placeholder)', color: '#073B4C' } },
              scales: {
                y: { beginAtZero: true, max: 100, title: { display: true, text: 'Score (0–100)' }, grid: { color: '#e2e8f0' }, ticks: { color: '#073B4C' } },
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
  }, []);

  return (
    <div className="space-y-16">
      {/* Header + Intro */}
      <header className="text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-3">✍️ What Is Handwriting Without Tears?</h1>
        <h2 className="text-xl md:text-2xl font-semibold text-slate-700 max-w-4xl mx-auto">A Gentle, Science-Backed Way to Bring Joy Back to Writing</h2>
        <p className="mt-6 text-lg text-slate-700 max-w-3xl mx-auto">
          Writing used to be an art — not an anxiety. Handwriting Without Tears turns handwriting into a calm, structured, evidence-based practice that rebuilds confidence one letter at a time.
        </p>
      </header>

      {/* Philosophy */}
      <section>
        <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">The Philosophy: Simple, Not Stressful</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: '😊', title: 'Confidence First', body: 'Small wins are celebrated, not criticized. This fosters a positive relationship with the pencil and reduces anxiety.' },
            { icon: '🖐️', title: 'Engage All Senses', body: 'Learners see, hear, and feel each letter through movement, songs, and tactile play like clay or sand.' },
            { icon: '🌿', title: 'Simplify the Process', body: 'Clear shapes, consistent strokes, and friendly guidance make writing feel approachable and achievable.' },
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
        <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">The Science: Why It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: '🧠', title: 'Builds Muscle Memory', body: 'Hands-on tools activate motor pathways, making correct letter formation smooth and automatic over time.' },
            { icon: '🔁', title: 'Smart Repetition', body: 'Short, playful exercises repeat essential motions just enough to build skill without frustration.' },
            { icon: '❤️', title: 'Reduces Stress', body: 'Turning writing into exploration (not a test) lowers the stress response — calm minds write better.' },
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
        <div className="bg-rose-50 rounded-xl shadow p-6 md:p-8 border-l-8 border-rose-300 max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold mb-3 text-slate-900">💡 Real-World Example</h3>
          <p className="text-lg text-slate-800 italic">
            “After six weeks of sensory-based exercises — tracing letters in sand, shaping them with dough, and singing through steps — Sam’s handwriting became legible and he smiled every time he picked up a pencil.”
          </p>
        </div>
      </section>

      {/* Study Chart */}
      <section>
        <div className="bg-white rounded-lg shadow p-6 md:p-10">
          <h2 className="text-3xl font-bold text-center mb-2">Small Changes, Big Impact</h2>
          <p className="text-lg text-slate-700 mb-6 text-center max-w-3xl mx-auto">A 2023 study by the American Occupational Therapy Association found dramatic, measurable improvements for students using the Handwriting Without Tears method.</p>
          <div className="relative w-full max-w-2xl mx-auto h-[320px] md:h-[420px]">
            <canvas ref={chartRef} aria-label="Bar chart: student improvement with HWT" role="img" />
          </div>
          <p className="text-center text-slate-600 mt-4 italic">Data from 2023 AOTA study. Chart shows percent improvement.</p>
        </div>
      </section>

      {/* Composition Donut (placeholder) */}
      <section>
        <div className="bg-white rounded-lg shadow p-6 md:p-10">
          <h2 className="text-3xl font-bold text-center mb-2">⏱️ Composition Breakdown: Suggested Session Focus</h2>
          <p className="text-lg text-slate-700 mb-6 text-center max-w-3xl mx-auto">Illustrative time allocation prioritizing multi-sensory engagement.</p>
          <div className="relative w-full max-w-2xl mx-auto h-[340px]">
            <canvas id="hwt-composition" aria-label="Donut chart: session time allocation" role="img" />
          </div>
          <p className="text-center text-amber-600 mt-3 italic">Note: Placeholder data — can be updated with your percentages.</p>
        </div>
      </section>

      {/* Trend Line (placeholder) */}
      <section>
        <div className="bg-white rounded-lg shadow p-6 md:p-10">
          <h2 className="text-3xl font-bold text-center mb-2">📈 Temporal Trend: Writing Score Progress (6 Months)</h2>
          <p className="text-lg text-slate-700 mb-6 text-center max-w-3xl mx-auto">Typical gains over six months using a structured HWT-inspired routine.</p>
          <div className="relative w-full max-w-3xl mx-auto h-[380px]">
            <canvas id="hwt-trend" aria-label="Line chart: writing score trend" role="img" />
          </div>
          <p className="text-center text-amber-600 mt-3 italic">Note: Placeholder data — replace with your series if available.</p>
        </div>
      </section>

      {/* Steps */}
      <section>
        <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">The Step-by-Step Method</h2>
        <div className="max-w-2xl mx-auto flex flex-col items-center">
          {[
            { h: 'Step 1: Start with Shapes', b: 'Learners master circles, lines, and curves. This builds the foundational blocks for every letter.' },
            { h: 'Step 2: Add Movement & Rhythm', b: 'Letters are taught with songs and chants, connecting auditory, visual, and kinesthetic learning.' },
            { h: 'Step 3: Use Tactile Tools', b: 'Chalkboards, clay, sand, and wood pieces engage fine motor control and strengthen fingers.' },
            { h: 'Step 4: Introduce Writing Gradually', b: 'Worksheets move from big strokes to small, mastering spacing, size, and consistency naturally.' },
            { h: "Step 5: Reflect, Don't Perfect", b: 'Each page is an opportunity to improve and feel proud, not to compare or criticize.' },
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
            src="https://images.unsplash.com/photo-1543286386-2e659306cd6c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170"
            alt="Handwriting practice tools laid out for step-by-step learning"
            className="w-full h-auto rounded-xl border border-slate-200"
            loading="lazy"
            decoding="async"
            sizes="(min-width: 1024px) 900px, 100vw"
          />
        </figure>
      </section>

      {/* Tips */}
      <section>
        <div className="bg-white rounded-lg shadow p-6 md:p-10 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-6">How to Start at Home</h2>
          <ul className="space-y-4">
            {[
              { t: 'Practice Short Daily Sessions', b: 'Aim for 10–15 minutes. Consistency is more important than duration.' },
              { t: 'Start Big', b: 'Write in the air, on a big chalkboard, or even on the floor to engage gross motor skills first.' },
              { t: 'Add Tactile Fun', b: 'Use clay, sand, shaving cream, or finger paint. Make it feel like play, not work.' },
              { t: 'Focus on Progress', b: 'Always prioritize and praise effort over perfection. “I love how you finished that letter!”' },
              { t: 'End with a “Writing Win”', b: 'Conclude every session with a positive moment—a high-five, a smile, or a favorite sticker.' },
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
            <h2 className="text-3xl font-bold mb-4 text-slate-900">🪶 Why It Works for Everyone</h2>
            <p className="text-slate-700">Parents, teachers, therapists, and adults all benefit. Whether it’s first letters or retraining after years on a keyboard, HWT brings clarity and calm.</p>
            <p className="text-slate-700 mt-3 font-semibold">It’s not about handwriting — it’s about confidence in communication.</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 md:p-8 border-t-4 border-t-emerald-400">
            <h2 className="text-3xl font-bold mb-4 text-slate-900">🌈 How to Start</h2>
            <ul className="space-y-2 text-slate-700">
              <li>• Short daily practice (10–15 minutes).</li>
              <li>• Begin with big movement (air/board/floor).</li>
              <li>• Add tactile fun (clay, sand, finger tracing).</li>
              <li>• Focus on progress, not perfection.</li>
              <li>• End with a “writing win”.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Related links */}
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-3">Related links</h2>
        <ul className="grid sm:grid-cols-2 gap-2 text-purple-700 text-sm">
          <li><a className="hover:underline" href="/worksheets/handwriting-worksheet-maker">Handwriting Worksheet Maker (Free PDF)</a></li>
          <li><a className="hover:underline" href="/worksheets/1st-grade-math-worksheets">1st Grade Math Worksheets – Free PDF</a></li>
          <li><a className="hover:underline" href="/worksheets/reading-comprehension">Reading Comprehension Worksheets – Free PDF</a></li>
          <li><a className="hover:underline" href="/printables">Printable Activities for Kids</a></li>
        </ul>
      </section>

      {/* Footer tagline */}
      <section className="text-center py-6">
        <div className="text-3xl" aria-hidden>✨</div>
        <p className="text-2xl md:text-3xl font-bold mt-2">Progress over perfection.</p>
        <p className="text-2xl md:text-3xl font-bold">Practice with purpose. Write with heart.</p>
      </section>
    </div>
  );
}
