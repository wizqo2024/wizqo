import React from 'react'

export default function WorksheetsGrade2Page() {
  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-4 print:hidden">
        <a href="/printables" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm" aria-label="Back to Printables">
          <span>←</span>
          <span>Back to Printables</span>
        </a>
      </div>
      <header className="mb-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">2nd Grade Math Worksheets (Free Printables)</h1>
        <p className="text-slate-700 mt-3 max-w-3xl">Free 2nd grade math worksheets—number sense, addition/subtraction to 100, ten‑frames, skip counting, and word‑problem warmups you can print and use at home or in class. Download as PDF.</p>
        
      </header>

      <section className="space-y-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <h2 className="text-lg font-semibold text-slate-900 mb-2">What’s Inside</h2>
          <p className="text-slate-700">Build fluency with focused practice: place value (tens/ones), ten‑frames, number lines, addition and subtraction within 20, and attention‑boosting puzzles. Each worksheet is one page, easy to print, and designed for quick daily practice.</p>
          <div className="mt-3 print:hidden">
            <a
              href="/print?doc=pack&age=68&time=5&skill=focus"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
              aria-label="Build a 5-minute math print pack"
            >
              🧰 Build a 5‑Minute Print Pack
            </a>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <h2 className="text-lg font-semibold text-slate-900">Number Sense</h2>
          <ul className="grid sm:grid-cols-2 gap-3 text-slate-800">
            <li><a className="block border border-slate-200 rounded-lg p-3 bg-white hover:bg-slate-50" href="/print?doc=ten-frames-1-20">Ten Frames 1–20 →</a></li>
            <li><a className="block border border-slate-200 rounded-lg p-3 bg-white hover:bg-slate-50" href="/print?doc=number-tracing-1-20">Number Tracing 1–20 →</a></li>
          </ul>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <h2 className="text-lg font-semibold text-slate-900">Addition & Subtraction</h2>
          <ul className="grid sm:grid-cols-2 gap-3 text-slate-800">
            <li><a className="block border border-slate-200 rounded-lg p-3 bg-white hover:bg-slate-50" href="/print?doc=addition-subtraction-0-10">Add/Sub within 10 →</a></li>
            <li><a className="block border border-slate-200 rounded-lg p-3 bg-white hover:bg-slate-50" href="/print?doc=math-maze">Math Maze →</a></li>
          </ul>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <h2 className="text-lg font-semibold text-slate-900">Fluency Boosters</h2>
          <ul className="grid sm:grid-cols-2 gap-3 text-slate-800">
            <li><a className="block border border-slate-200 rounded-lg p-3 bg-white hover:bg-slate-50" href="/print?doc=dot-to-dot-1-20">Skip Counting (Dot‑to‑Dot 1–20) →</a></li>
            <li><a className="block border border-slate-200 rounded-lg p-3 bg-white hover:bg-slate-50" href="/print?doc=spot-difference">Focus: Spot‑the‑Difference →</a></li>
          </ul>
        </div>
        
      </section>

      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-4">
        <h2 className="text-lg font-semibold text-slate-900">FAQs</h2>
        <dl className="mt-3 space-y-3 text-slate-800">
          <div>
            <dt className="font-semibold">Can I use these in the classroom?</dt>
            <dd>Yes, they’re free for personal and classroom use.</dd>
          </div>
          <div>
            <dt className="font-semibold">What skills are covered?</dt>
            <dd>Counting, number sense, place value, addition/subtraction within 20 and 100, focus and attention.</dd>
          </div>
          <div>
            <dt className="font-semibold">Are these worksheets printable as PDF?</dt>
            <dd>Yes. Open any worksheet and use your browser’s Print → Save as PDF to download.</dd>
          </div>
        </dl>
      </section>
    </main>
  )
}
