import React from 'react';
import { UnifiedNavigation } from '@/components/UnifiedNavigation';
import { Footer } from '@/components/Footer';
import { SEOMetaTags } from '@/components/SEOMetaTags';

export default function ReadingComprehensionPage() {
  const scrollTo = (id: string) => {
    try {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch {}
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <SEOMetaTags
        title="Free Printable Reading Comprehension Worksheets for Kids (PDF)"
        description="Download free printable reading comprehension worksheets for kids. Fun and engaging passages with questions, answers, and PDFs for grades 1–3."
        canonicalUrl="https://wizqo.com/worksheets/reading-comprehension"
      />
      <UnifiedNavigation currentPage="printables" />

      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Free Printable Reading Comprehension Worksheets for Kids (PDF)</h1>
          <p className="mt-2 text-slate-700 max-w-3xl">Fun and engaging passages with questions, answers, and print‑ready PDFs. Ideal for Grades 1–3 and at‑home practice.</p>
          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            <button onClick={() => scrollTo('grade-1')} className="px-3 py-1.5 rounded-full border border-slate-200 text-slate-700 hover:bg-slate-50">Grade 1</button>
            <button onClick={() => scrollTo('grade-2')} className="px-3 py-1.5 rounded-full border border-slate-200 text-slate-700 hover:bg-slate-50">Grade 2</button>
            <button onClick={() => scrollTo('grade-3')} className="px-3 py-1.5 rounded-full border border-slate-200 text-slate-700 hover:bg-slate-50">Grade 3</button>
          </div>
          <div className="mt-4 print:hidden">
            <button
              onClick={() => { try { window.print(); } catch {} }}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm"
            >
              <span>⬇️</span>
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* What's Inside + Pack Builder */}
        <section className="bg-white border border-slate-200 rounded-2xl p-5">
          <h2 className="text-xl font-bold text-slate-900">What’s Inside</h2>
          <p className="text-slate-700 text-sm mt-1 max-w-3xl">
            Free printable reading comprehension worksheets (PDF) with answer keys — short reading
            passages with questions and answers for Grades 1–3. Topics include main idea, details,
            sequencing, and vocabulary in context. Open the print view to save as PDF.
          </p>
          <div className="mt-4">
            <BuildPackReadingInline />
          </div>
        </section>
        {/* Grade 1 */}
        <section id="grade-1" className="bg-white border border-slate-200 rounded-2xl p-5">
          <h2 className="text-xl font-bold text-slate-900">Grade 1 Reading Comprehension Worksheets (Free Printable PDF)</h2>
          <p className="text-slate-700 text-sm mt-1">Short, decodable passages with picture‑supported questions and an answer key. Focus: who/what/where, sequence, and one inference. Great for early readers and ESL.</p>
          {/* Quick printable link */}
          <div className="mt-4 grid md:grid-cols-2 gap-4">
            <ItemCard
              title="📖 Grade 1 Passage + 3 Questions (PDF)"
              description="Short reading passage with three questions and answer key. Open print view to download as PDF."
              href="/print?doc=reading-mini-1"
            />
          </div>
          <div className="mt-4 grid md:grid-cols-2 gap-4">
            <article className="border border-slate-200 rounded-xl p-4">
              <div className="text-slate-800 font-semibold mb-2">Passage A — The Lost Hat</div>
              <p className="text-slate-800 text-sm">Mia ran to the park. The wind was strong. Her red hat flew off! She looked under the slide and behind a tree. A dog found the hat by the bench. Mia laughed and waved. “Thank you!”</p>
              <ol className="mt-3 list-decimal list-inside text-sm text-slate-800 space-y-1">
                <li>Where did Mia go?</li>
                <li>What color was the hat?</li>
                <li>Who found the hat?</li>
                <li>Why did the hat fly off?</li>
              </ol>
              <details className="mt-2 text-sm text-slate-600"><summary className="cursor-pointer">Answer key</summary><div>1) The park 2) Red 3) A dog 4) The wind was strong</div></details>
            </article>
            <article className="border border-slate-200 rounded-xl p-4">
              <div className="text-slate-800 font-semibold mb-2">Passage B — Lunch for the Ants</div>
              <p className="text-slate-800 text-sm">Sam dropped a crumb. Ants marched in a line. They carried the crumb together. Sam watched quietly. He did not step near them. Soon, the ants were gone. The floor was clean!</p>
              <ol className="mt-3 list-decimal list-inside text-sm text-slate-800 space-y-1">
                <li>What did Sam drop?</li>
                <li>How did the ants move?</li>
                <li>What did Sam do while he watched?</li>
                <li>What happened to the floor?</li>
              </ol>
              <details className="mt-2 text-sm text-slate-600"><summary className="cursor-pointer">Answer key</summary><div>1) A crumb 2) In a line 3) He watched quietly and didn’t step near them 4) It was clean</div></details>
            </article>
          </div>
        </section>

        {/* Grade 2 */}
        <section id="grade-2" className="bg-white border border-slate-200 rounded-2xl p-5">
          <h2 className="text-xl font-bold text-slate-900">Grade 2 Reading Comprehension Worksheets (with Answer Key, PDF)</h2>
          <p className="text-slate-700 text-sm mt-1">One‑paragraph passages with who/what/why, sequence, and vocabulary in context. Printable worksheets with answer key included — ideal for homework, centers, and small groups.</p>
          {/* Quick printable link */}
          <div className="mt-4 grid md:grid-cols-2 gap-4">
            <ItemCard
              title="📖 Grade 2 Passage + 3 Questions (PDF)"
              description="Printable reading comprehension worksheet with short passage, questions, and answer key."
              href="/print?doc=reading-mini-1"
            />
          </div>
          <div className="mt-4 grid md:grid-cols-2 gap-4">
            <article className="border border-slate-200 rounded-xl p-4">
              <div className="text-slate-800 font-semibold mb-2">Passage C — The Paper Bridge</div>
              <p className="text-slate-800 text-sm">Lena wanted a tiny bridge for her toy river. She folded strips of paper and taped them together. The first bridge bent and fell. She added more layers, tested again, and smiled. The paper bridge held three toy cars!</p>
              <ol className="mt-3 list-decimal list-inside text-sm text-slate-800 space-y-1">
                <li>What was Lena building?</li>
                <li>Why did the first bridge fail?</li>
                <li>What change helped it work?</li>
                <li>How many cars did it hold?</li>
              </ol>
              <details className="mt-2 text-sm text-slate-600"><summary className="cursor-pointer">Answer key</summary><div>1) A tiny bridge 2) It bent and fell (too weak) 3) More layers 4) Three cars</div></details>
            </article>
            <article className="border border-slate-200 rounded-xl p-4">
              <div className="text-slate-800 font-semibold mb-2">Passage D — Rainy Day Garden</div>
              <p className="text-slate-800 text-sm">Asha kept a notebook for her balcony garden. On rainy days, she didn’t water her plants. She drew a cloud symbol instead. After a week of rain, her beans grew fast. Asha wrote, “Let the rain help.”</p>
              <ol className="mt-3 list-decimal list-inside text-sm text-slate-800 space-y-1">
                <li>What did Asha keep?</li>
                <li>What symbol did she draw on rainy days?</li>
                <li>What happened to her beans after a week?</li>
                <li>What lesson did she write?</li>
              </ol>
              <details className="mt-2 text-sm text-slate-600"><summary className="cursor-pointer">Answer key</summary><div>1) A notebook 2) A cloud 3) They grew fast 4) “Let the rain help”</div></details>
            </article>
          </div>
        </section>

        {/* Grade 3 */}
        <section id="grade-3" className="bg-white border border-slate-200 rounded-2xl p-5">
          <h2 className="text-xl font-bold text-slate-900">Grade 3 Reading Comprehension — Short Passages with Questions and Answers (PDF)</h2>
          <p className="text-slate-700 text-sm mt-1">Longer passages with main idea, supporting details, and a simple inference or conclusion. Free printable worksheets (PDF) with answer key — reading practice for 3rd grade.</p>
          {/* Quick printable link */}
          <div className="mt-4 grid md:grid-cols-2 gap-4">
            <ItemCard
              title="📖 Grade 3 Short Passage + Q&A (PDF)"
              description="Short reading passage with comprehension questions and answers. Open printable PDF view."
              href="/print?doc=reading-mini-1"
            />
          </div>
          <div className="mt-4 grid md:grid-cols-2 gap-4">
            <article className="border border-slate-200 rounded-xl p-4 md:col-span-2">
              <div className="text-slate-800 font-semibold mb-2">Passage E — The Lighthouse Keeper’s Trick</div>
              <p className="text-slate-800 text-sm">A storm rolled over the coast, and waves pounded the rocks. Mira checked the lighthouse lamps—bright, steady, and safe. But the fog was thick, and a fishing boat drifted off course. Mira remembered a trick her father taught her. She covered one lamp for a few seconds, then uncovered it, making a slow flash. The boat turned toward the beam and away from the rocks. When the storm passed, Mira logged the event: “Used flash method to guide a boat. Lamps steady.”</p>
              <ol className="mt-3 list-decimal list-inside text-sm text-slate-800 space-y-1">
                <li>What problem did the boat have?</li>
                <li>What “trick” did Mira use?</li>
                <li>Why did the trick help the boat?</li>
                <li>What does Mira’s log note tell us about her work?</li>
              </ol>
              <details className="mt-2 text-sm text-slate-600"><summary className="cursor-pointer">Answer key</summary><div>1) It drifted off course in thick fog 2) A timed lamp flash 3) It guided the boat back to the safe path 4) She keeps careful records and uses safe methods</div></details>
            </article>
          </div>
        </section>

        {/* FAQs */}
        <section className="bg-white border border-slate-200 rounded-2xl p-5">
          <h2 className="text-xl font-bold text-slate-900">FAQs</h2>
          <div className="mt-3 space-y-3 text-sm text-slate-800">
            <div>
              <div className="font-semibold">How do I download the worksheets as PDF?</div>
              <p>Use the “Download PDF” button (Print → Save as PDF) for a full‑page printable. Each section is laid out for easy printing.</p>
            </div>
            <div>
              <div className="font-semibold">Can I use these in class?</div>
              <p>Yes—feel free to use and share the worksheets in classrooms or at home.</p>
            </div>
            <div>
              <div className="font-semibold">What skills do these build?</div>
              <p>Key skills: finding details, main idea, sequence, vocabulary in context, and light inference.</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

const CARD_CLASS = 'bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow transition-all overflow-hidden p-4';
function ItemCard({ title, description, href }: { title: string; description: string; href: string }) {
  return (
    <div className={CARD_CLASS}>
      <div className="text-base font-semibold text-slate-900">{title}</div>
      <p className="text-slate-600 text-sm mt-1">{description}</p>
      <div className="mt-3">
        <a href={href} className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-purple-200 text-purple-700 hover:bg-purple-50 transition-colors">Open printable view →</a>
      </div>
    </div>
  );
}

function BuildPackReadingInline() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 print:hidden">
      <div className="text-base font-semibold text-slate-900 mb-1">🧰 Build a 5‑Minute Print Pack</div>
      <p className="text-slate-700 text-sm mb-3 max-w-3xl">Create a quick reading comprehension set — short passages with questions and answer keys.</p>
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <label className="text-sm text-slate-600">Time
          <select id="rcp-time" className="ml-2 px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white" defaultValue="5"
            onChange={(e) => { (document.getElementById('rcp-time') as HTMLSelectElement).setAttribute('data-v', e.target.value); }}
          >
            <option value="5">5 min</option>
            <option value="10">10 min</option>
            <option value="15">15 min</option>
          </select>
        </label>
        <label className="text-sm text-slate-600">Grade
          <select id="rcp-grade" className="ml-2 px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white" defaultValue="g1"
            onChange={(e) => { (document.getElementById('rcp-grade') as HTMLSelectElement).setAttribute('data-v', e.target.value); }}
          >
            <option value="g1">Grade 1</option>
            <option value="g2">Grade 2</option>
            <option value="35">Grade 3</option>
          </select>
        </label>
        <div className="text-sm text-slate-600">Focus <span className="font-medium ml-2">Reading</span></div>
        <button
          onClick={() => {
            try {
              const t = (document.getElementById('rcp-time') as HTMLSelectElement)?.getAttribute('data-v') || '5';
              const g = (document.getElementById('rcp-grade') as HTMLSelectElement)?.getAttribute('data-v') || 'g1';
              const url = `/print?doc=pack&time=${encodeURIComponent(t)}&age=${encodeURIComponent(g)}&skill=reading`;
              window.location.href = url;
            } catch {}
          }}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          Build Pack →
        </button>
      </div>
    </div>
  );
}
