import React from 'react'

export default function WorksheetsGrade2Page() {
  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <header className="mb-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">2nd Grade Math Worksheets (Free Printables)</h1>
        <p className="text-slate-700 mt-3 max-w-3xl">Free 2nd grade math worksheets—number sense, addition/subtraction to 100, ten‑frames, and practice pages you can print and use at home or in class. Download as PDF.</p>
      </header>

      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Number Sense</h2>
          <ul className="grid sm:grid-cols-2 gap-3 text-slate-800">
            <li><a className="block border border-slate-200 rounded-lg p-3 bg-white hover:bg-slate-50" href="/print?doc=ten-frames-1-20">Ten Frames 1–20 →</a></li>
            <li><a className="block border border-slate-200 rounded-lg p-3 bg-white hover:bg-slate-50" href="/print?doc=number-tracing-1-20">Number Tracing 1–20 →</a></li>
          </ul>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Addition & Subtraction</h2>
          <ul className="grid sm:grid-cols-2 gap-3 text-slate-800">
            <li><a className="block border border-slate-200 rounded-lg p-3 bg-white hover:bg-slate-50" href="/print?doc=addition-subtraction-0-10">Add/Sub within 10 →</a></li>
            <li><a className="block border border-slate-200 rounded-lg p-3 bg-white hover:bg-slate-50" href="/print?doc=math-maze">Math Maze →</a></li>
          </ul>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Focus & Logic</h2>
          <ul className="grid sm:grid-cols-2 gap-3 text-slate-800">
            <li><a className="block border border-slate-200 rounded-lg p-3 bg-white hover:bg-slate-50" href="/print?doc=dot-to-dot-1-20">Dot‑to‑Dot 1–20 →</a></li>
            <li><a className="block border border-slate-200 rounded-lg p-3 bg-white hover:bg-slate-50" href="/print?doc=spot-difference">Spot‑the‑Difference →</a></li>
          </ul>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-slate-900">FAQs</h2>
        <dl className="mt-3 space-y-3 text-slate-800">
          <div>
            <dt className="font-semibold">Can I use these in the classroom?</dt>
            <dd>Yes, they’re free for personal and classroom use.</dd>
          </div>
          <div>
            <dt className="font-semibold">What skills are covered?</dt>
            <dd>Counting, number sense, addition/subtraction within 100, focus and attention.</dd>
          </div>
        </dl>
      </section>
    </main>
  )
}
