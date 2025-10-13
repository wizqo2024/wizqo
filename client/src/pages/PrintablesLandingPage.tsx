import React from 'react';
import { UnifiedNavigation } from '@/components/UnifiedNavigation';
import { Footer } from '@/components/Footer';

const BUTTON_CLASS = 'inline-flex items-center justify-center px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors';
const OUTLINE_BUTTON = 'inline-flex items-center justify-center px-4 py-2 rounded-lg border border-purple-200 text-purple-700 hover:bg-purple-50 transition-colors';
const CARD_CLASS = 'bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow transition-all overflow-hidden p-4';

function ItemCard({ title, description, skills, age, href }: { title: string; description: string; skills?: string; age?: string; href: string }) {
  return (
    <div className={CARD_CLASS}>
      <div className="text-base font-semibold text-slate-900">{title}</div>
      <p className="text-slate-600 text-sm mt-1">{description}</p>
      {(skills || age) && (
        <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-600">
          {skills ? <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200">Skills: {skills}</span> : null}
          {age ? <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200">Age: {age}</span> : null}
        </div>
      )}
      <div className="mt-3">
        <a href={href} className={OUTLINE_BUTTON}>Open printable view →</a>
      </div>
    </div>
  );
}

export function PrintablesLandingPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <UnifiedNavigation currentPage="kids" />
      {(() => {
        // SEO structured data: Breadcrumbs + ItemList of printables
        const breadcrumbLd = {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://wizqo.com/" },
            { "@type": "ListItem", position: 2, name: "Kids Hub", item: "https://wizqo.com/kids" },
            { "@type": "ListItem", position: 3, name: "Printable Fun Learning Activities", item: "https://wizqo.com/printables" }
          ]
        } as const;
        const itemListLd = {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Printable Fun Learning Activities for Kids",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Word Search – Animals", url: "https://wizqo.com/print?doc=ws-animals" },
            { "@type": "ListItem", position: 2, name: "Word Search – Space", url: "https://wizqo.com/print?doc=ws-space" },
            { "@type": "ListItem", position: 3, name: "Sudoku – 4×4 (Easy)", url: "https://wizqo.com/print" },
            { "@type": "ListItem", position: 4, name: "Sudoku – 6×6 (Medium)", url: "https://wizqo.com/print?doc=sudoku6" },
            { "@type": "ListItem", position: 5, name: "Coloring – Cute Animals", url: "https://wizqo.com/print" },
            { "@type": "ListItem", position: 6, name: "Spot‑the‑Difference – Playground", url: "https://wizqo.com/print?doc=spotdiff" }
          ]
        } as const;
        return (
          <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
          </>
        );
      })()}

      <header className="relative">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-pink-50 to-amber-50" />
          <div className="absolute -top-16 -right-24 w-80 h-80 rounded-full bg-purple-200/30 blur-3xl" />
          <div className="absolute -bottom-24 -left-16 w-96 h-96 rounded-full bg-amber-200/30 blur-3xl" />
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-4 print:hidden">
            <a href="/kids" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm" aria-label="Back to Kids Hub">
              <span>←</span>
              <span>Back to Kids Hub</span>
            </a>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">Printable Fun Learning Activities</h1>
          <div className="h-1 w-16 rounded-full bg-gradient-to-r from-yellow-300 to-pink-400 mt-3 mb-3" />
          <p className="text-slate-700 max-w-3xl">
            Welcome to our Printable Fun Learning Activities page — a creative space where kids can learn, play, and grow away from screens!
            All activities are free to download, easy to print, and perfect for home, school, or travel.
          </p>
          
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 space-y-10">
        {/* Intro: What You'll Find */}
        <section>
          <div className="mb-2 text-slate-800 font-semibold">🧩 What You’ll Find</div>
          <p className="text-slate-700 text-sm max-w-3xl">We’ve organized our printable packs by activity type so you can choose what fits your child’s interests and age group.</p>
        </section>

        {/* 1. Educational Worksheets */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-2">🧠 1. Educational Worksheets</h2>
          <p className="text-slate-700 text-sm mb-3 max-w-3xl">Short, skill‑building worksheets you can finish in minutes. Use them as warm‑ups, homework helpers, or rainy‑day challenges to grow confidence in reading, math, and science.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-4">
            <ItemCard
              title="➕ Math Maze Adventure"
              description="Solve simple addition and subtraction problems to find your way through the maze! Kids answer to uncover the right path — a mix of math and logic fun."
              skills="problem-solving, basic math, critical thinking"
              age="6–10"
              href="/print?doc=math-maze"
            />
            <ItemCard
              title="✏️ Spelling Challenge Worksheet"
              description="Circle correctly spelled words or fill in missing letters. Themes include animals, school items, and food."
              skills="spelling, vocabulary, reading comprehension"
              age="6–9"
              href="/print?doc=spelling"
            />
            <ItemCard
              title="🔬 Science Fun Facts Match"
              description="Match each fun fact to its correct picture — planets, weather, and ocean creatures!"
              skills="science awareness, visual association, curiosity"
              age="8–12"
              href="/print?doc=science-match"
            />
            <ItemCard
              title="🕵️‍♀️ Grammar Detective"
              description="Become a language detective! Find and correct small grammar mistakes in funny sentences."
              skills="grammar, reading, logic"
              age="8–12"
              href="/print?doc=grammar-detective"
            />
          </div>
        </section>

        {/* 2. Creative & Art Printables */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-2">🎨 2. Creative & Art Printables</h2>
          <p className="text-slate-700 text-sm mb-3 max-w-3xl">Spark imagination with low‑prep projects kids can draw, color, and customize. These printable art prompts build hand control, creativity, and a lifelong love of making things.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-4">
            <ItemCard
              title="🖍️ Color-by-Number Pages"
              description="Color each section by number to reveal a hidden animal or scene. Includes Animals in Space and Under the Sea editions."
              skills="color recognition, number practice, creativity"
              age="5–9"
              href="/print?doc=color-by-number"
            />
            <ItemCard
              title="📚 DIY Bookmark Templates"
              description="Design your own bookmarks with quotes and doodles — print-ready outlines: ‘Be Kind’, ‘Keep Reading’, ‘Dream Big’."
              skills="creativity, design, fine motor skills"
              age="6–12"
              href="/print?doc=bookmark-templates"
            />
            <ItemCard
              title="👾 Design Your Monster"
              description="Print, draw, and name your own funny monster! Great for imagination and drawing practice."
              skills="creativity, self-expression, art skills"
              age="6–10"
              href="/print?doc=design-monster"
            />
            <ItemCard
              title="✏️ Draw the Missing Half"
              description="Half of each image is missing — complete it! A great symmetry and observation activity."
              skills="geometry, visual balance, focus"
              age="7–12"
              href="/print?doc=draw-half"
            />
          </div>
        </section>

        {/* 3. Brain & Focus Activities */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-2">🧩 3. Brain & Focus Activities</h2>
          <p className="text-slate-700 text-sm mb-3 max-w-3xl">Build attention and problem‑solving with puzzles that reward careful thinking. Great for quiet time, independent work, and on‑the‑go brain breaks.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-4">
            <ItemCard
              title="🧩 Logic Grid Puzzle"
              description="Read clues, think critically, and solve who owns what, where, or when!"
              skills="logic, reading comprehension, problem-solving"
              age="9–12"
              href="/print?doc=logic-grid"
            />
            <ItemCard
              title="🔍 Find the Hidden Object"
              description="Search and circle hidden items in a detailed scene — jungle, ocean, or city themes."
              skills="attention to detail, focus, patience"
              age="6–10"
              href="/print?doc=hidden-object"
            />
            <ItemCard
              title="🌀 Maze of Focus"
              description="Follow the path through distractions to reach your goal! Includes tips like ‘Take a deep breath’."
              skills="concentration, mindfulness, planning"
              age="6–9"
              href="/print?doc=maze-focus"
            />
          </div>
        </section>

        {/* 4. Emotional & Mindfulness Printables */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-2">💖 4. Emotional & Mindfulness Printables</h2>
          <p className="text-slate-700 text-sm mb-3 max-w-3xl">Simple, calming pages that help kids name feelings, practice gratitude, and reflect on wins. Perfect for bedtime routines or classroom mindfulness corners.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-4">
            <ItemCard
              title="💌 Gratitude Jar Worksheet"
              description="Each day, write or draw one thing you’re thankful for and color your jar as it fills up!"
              skills="gratitude, mindfulness, journaling"
              age="7–12"
              href="/print?doc=gratitude-jar"
            />
            <ItemCard
              title="🌈 Mood Tracker Coloring Page"
              description="Track feelings for the week by coloring a section based on your mood."
              skills="emotional awareness, reflection, art expression"
              age="8–12"
              href="/print?doc=mood-tracker"
            />
            <ItemCard
              title="🕉️ Mindful Coloring Mandalas"
              description="Relax and focus while coloring calming mandala patterns."
              skills="focus, mindfulness, relaxation"
              age="9–13"
              href="/print?doc=mandalas"
            />
            <ItemCard
              title="🗓️ My Goals for the Week Planner"
              description="Write three goals, one thing to try, and one thing you’re proud of — printable motivation for kids."
              skills="planning, reflection, motivation"
              age="8–12"
              href="/print?doc=weekly-goals"
            />
          </div>
        </section>

        {/* 5. Seasonal & Holiday Printables */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-2">🎉 5. Seasonal & Holiday Printables</h2>
          <p className="text-slate-700 text-sm mb-3 max-w-3xl">Celebrate the seasons with themed puzzles, hunts, and kindness challenges. Keep little hands busy during holidays, travel days, and family gatherings.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-4">
            <ItemCard
              title="🎃 Halloween Puzzle Pack"
              description="Pumpkin maze, costume word search, and spooky coloring pages — all in one."
              skills="creative play, vocabulary, fine motor skills"
              age="6–10"
              href="/print?doc=halloween-pack"
            />
            <ItemCard
              title="❄️ Winter Kindness Challenge"
              description="30 simple ways to spread kindness — color one each time you complete a task!"
              skills="empathy, kindness, social skills"
              age="6–12"
              href="/print?doc=winter-kindness"
            />
            <ItemCard
              title="🌸 Spring Nature Scavenger Hunt"
              description="Go outside and check off everything you find — leaves, flowers, clouds, bugs, and more!"
              skills="observation, curiosity, environmental awareness"
              age="6–12"
              href="/print?doc=spring-scavenger"
            />
            <ItemCard
              title="☀️ Summer Adventure Pack"
              description="Word search, beach maze, and ocean animals coloring sheet — perfect for travel."
              skills="creativity, focus, vocabulary"
              age="6–10"
              href="/print?doc=summer-pack"
            />
          </div>
        </section>

        {/* 6. Printable Challenge Packs */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-2">🌍 6. Printable Challenge Packs</h2>
          <p className="text-slate-700 text-sm mb-3 max-w-3xl">Week‑long printable packs that turn practice into a friendly challenge. Each set layers small daily wins into real progress kids can feel proud of.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-4">
            <ItemCard
              title="🧠 7-Day Brain Boost Pack"
              description="Daily puzzles, word games, and mini memory challenges to build focus and logic."
              href="/print?doc=brain-boost"
            />
            <ItemCard
              title="🎨 Creative Kids Challenge"
              description="7 days of art prompts and doodle ideas to spark creativity and reduce screen time."
              href="/print?doc=creative-challenge"
            />
            <ItemCard
              title="🌍 Around the World Word Search"
              description="Learn geography through words — explore landmarks, countries, and famous animals."
              href="/print?doc=ws-world"
            />
            <ItemCard
              title="🦁 Animal Adventure Pack"
              description="6 printables focused on wildlife fun — puzzles, coloring, and animal facts."
              href="/print?doc=animal-pack"
            />
          </div>
        </section>

        <section className="text-xs text-slate-500">
          <p className="print:hidden">Tip: Use your browser menu → Print → Save as PDF.</p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
