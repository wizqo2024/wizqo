import React, { useMemo, useRef, useState } from 'react';
import { SEOMetaTags } from '@/components/SEOMetaTags';
import { UnifiedNavigation } from '@/components/UnifiedNavigation';
import { Footer } from '@/components/Footer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import MemoryMatch from '@/components/kids/MemoryMatch';
import WordSearch from '@/components/kids/WordSearch';
import PuzzleGame from '@/components/kids/PuzzleGame';
import TypingSafari from '@/components/kids/TypingSafari';
import PatternBuilder from '@/components/kids/PatternBuilder';

const CARD_CLASS = 'bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow transition-all overflow-hidden';
const BUTTON_CLASS = 'inline-flex items-center justify-center px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors';
const OUTLINE_BUTTON = 'inline-flex items-center justify-center px-4 py-2 rounded-lg border border-purple-200 text-purple-800 hover:bg-purple-50 transition-colors font-semibold';
const CHIP_CLASS = 'inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-purple-100 text-purple-700';

// Curated, kid‑safe Unsplash images (playground, puzzles, crayons, classroom)
const KID_SAFE = {
  coloringCrayons: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=80', // crayons/kid coloring
  classroomHands: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=1600&q=80', // classroom hands up
  planetsModel: 'https://images.unsplash.com/photo-1532980400857-e8d9d275d858?auto=format&fit=crop&w=1600&q=80', // planets model
  puzzleJigsaw: 'https://images.unsplash.com/photo-1604881991720-f91add269bed?auto=format&fit=crop&w=1600&q=80', // jigsaw puzzle
  puzzleDesk: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=1600&q=80', // puzzle pieces on desk
  playgroundKids: 'https://images.unsplash.com/photo-1519681719073-a6b3c1f0b122?auto=format&fit=crop&w=1600&q=80', // kids at playground
  childStudyDesk: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1600&q=80', // child studying
  childWriting: 'https://images.unsplash.com/photo-1519455953755-af066f52f1ea?auto=format&fit=crop&w=1600&q=80', // child writing
  kidJournaling: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=1600&q=80', // kid journaling
  kidsWithAnimals: 'https://images.unsplash.com/photo-1477764860582-56fdf29dfc4d?auto=format&fit=crop&w=1600&q=80' // animals with kids
} as const;

export default function KidsPage() {
  const usedImageUrlsRef = useRef<Set<string>>(new Set());
  const KIDS_GENERIC_IMAGE = KID_SAFE.coloringCrayons;
  const KIDS_IMAGE_POOL = useMemo(
    () => [
      KID_SAFE.playgroundKids,
      KID_SAFE.classroomHands,
      KID_SAFE.coloringCrayons,
      KID_SAFE.puzzleJigsaw,
      KID_SAFE.puzzleDesk,
      KID_SAFE.childStudyDesk,
      KID_SAFE.childWriting,
      KID_SAFE.kidJournaling,
      KID_SAFE.planetsModel,
      KID_SAFE.kidsWithAnimals
    ],
    []
  );

  function SmartImage({ primary, alts = [], alt, className, fetchPriority, disableDedup }: { primary: string; alts?: string[]; alt: string; className?: string; fetchPriority?: 'auto' | 'low' | 'high'; disableDedup?: boolean }) {
    const initialSrc = useMemo(() => {
      if (disableDedup) return primary;
      const set = usedImageUrlsRef.current;
      const candidates = [primary, ...alts, KIDS_GENERIC_IMAGE, ...KIDS_IMAGE_POOL];
      for (const url of candidates) {
        if (!set.has(url)) {
          set.add(url);
          return url;
        }
      }
      return primary;
    }, [primary, alts, disableDedup]);

    const [src, setSrc] = useState<string>(initialSrc);
    const [idx, setIdx] = useState<number>(0);

    const fallbackList = useMemo(() => {
      const list = [primary, ...alts, KIDS_GENERIC_IMAGE, ...KIDS_IMAGE_POOL].filter((u) => u !== src);
      return list;
    }, [primary, alts, src]);

    function onError() {
      if (disableDedup) {
        for (let i = idx; i < fallbackList.length; i++) {
          const candidate = fallbackList[i];
          setSrc(candidate);
          setIdx(i + 1);
          return;
        }
        setSrc(KIDS_GENERIC_IMAGE);
        return;
      }
      const set = usedImageUrlsRef.current;
      for (let i = idx; i < fallbackList.length; i++) {
        const candidate = fallbackList[i];
        if (!set.has(candidate)) {
          set.add(candidate);
          setSrc(candidate);
          setIdx(i + 1);
          return;
        }
      }
      setSrc(KIDS_GENERIC_IMAGE);
    }

    return (
      <img
        src={src}
        alt={alt}
        className={className}
        referrerPolicy="no-referrer"
        loading={fetchPriority === 'high' ? 'eager' : 'lazy'}
        decoding="async"
        sizes="(min-width: 1024px) 800px, 100vw"
        fetchPriority={fetchPriority || 'auto'}
        onError={onError}
      />
    );
  }

  // Support game subpages: /kids/games/<slug>
  const path = (typeof window !== 'undefined' ? window.location.pathname : '/kids');
  const parts = path.replace(/^\/+/,'').split('/');
  const sub1 = parts[1] || '';
  const sub2 = parts[2] || '';
  if (sub1 === 'games') {
    // Map slug -> human-readable game title for accurate SEO titles/snippets
    const gameNameMap: Record<string, string> = {
      'memory': 'Memory Match',
      'word-search': 'Word Search',
      'puzzle': 'Puzzle Game',
      'typing': 'Typing Safari',
      'pattern': 'Pattern Builder'
    };
    const gameSlug = (sub2 || 'memory').toLowerCase();
    const gameTitle = gameNameMap[gameSlug] || 'Memory Match';
    return (
      <div className="min-h-screen bg-slate-50">
        <SEOMetaTags
          title={`Kids Hub – ${gameTitle}`}
          description="Play free fun learning games for kids online – Memory Match, Word Search, Puzzle, Typing Safari, and Pattern Builder. Kid‑safe, fast, and mobile‑friendly."
          canonicalUrl={`https://wizqo.com/kids/games/${gameSlug}`}
        />
        <UnifiedNavigation currentPage="kids" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="sr-only">{gameTitle}</h1>
            <a className={OUTLINE_BUTTON} href="/kids">Back to Kids Hub</a>
          </div>
          {gameSlug === 'word-search' ? <WordSearch /> : gameSlug === 'puzzle' ? <PuzzleGame /> : gameSlug === 'typing' ? <TypingSafari /> : gameSlug === 'pattern' ? <PatternBuilder /> : <MemoryMatch />}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <SEOMetaTags
        title="Kids Hub – Fun Learning Games & Printable Activities for Kids"
        description="Discover our Kids Hub: free fun learning games, printable puzzles, and creative 7-day skill plans that make learning fun for children ages 6–12."
        canonicalUrl="https://wizqo.com/kids"
        ogType="website"
        twitterCard="summary_large_image"
      />
      {(() => {
        // Inject structured data for better indexing
        const faqLd = {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "How can I make learning fun for my child?",
              acceptedAnswer: { "@type": "Answer", text: "Turn lessons into games, use printable puzzles, and encourage creativity through art or short challenges." }
            },
            {
              "@type": "Question",
              name: "What are the best fun learning games for kids online?",
              acceptedAnswer: { "@type": "Answer", text: "Memory Match improves focus and Word Search builds vocabulary. These quick, browser‑based games help kids learn new words and enjoy learning." }
            },
            {
              "@type": "Question",
              name: "What printable activities help kids learn better?",
              acceptedAnswer: { "@type": "Answer", text: "Printable puzzles like Sudoku, Word Search, and Spot‑the‑Difference improve problem‑solving and attention to detail. Coloring pages support creativity and relaxation." }
            },
            {
              "@type": "Question",
              name: "What fun skills can kids learn in a week?",
              acceptedAnswer: { "@type": "Answer", text: "Kids can build creative skills in just seven days with plans like Origami Basics or Drawing Animals that teach patience, focus, and creativity." }
            }
          ]
        } as const;
        const breadcrumbLd = {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://wizqo.com/" },
            { "@type": "ListItem", position: 2, name: "Kids Hub", item: "https://wizqo.com/kids" }
          ]
        } as const;
        return (
          <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
          </>
        );
      })()}
      <UnifiedNavigation currentPage="kids" />

      {/* Hero */}
      <header className="relative text-white">
        {/* Background cover image */}
        <div className="absolute inset-0 pointer-events-none">
          <picture>
            <source srcSet="https://images.unsplash.com/photo-1627163439134-7a8c47e08208?auto=format&fit=crop&q=65&w=1920&fm=avif" type="image/avif" />
            <source srcSet="https://images.unsplash.com/photo-1627163439134-7a8c47e08208?auto=format&fit=crop&q=70&w=1920&fm=webp" type="image/webp" />
            <img
              src="https://images.unsplash.com/photo-1627163439134-7a8c47e08208?auto=format&fit=crop&q=80&w=1920"
              alt="Fun learning background"
              className="w-full h-full object-cover"
              width="1920"
              height="1080"
              loading="eager"
              decoding="async"
            />
          </picture>
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/20" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="inline-flex items-center px-3 py-1 mb-3 text-xs font-semibold uppercase tracking-wide rounded-full bg-white/15 border border-white/20 backdrop-blur">🎉 Kids Hub</div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-2 bg-gradient-to-r from-yellow-200 via-pink-200 to-purple-300 bg-clip-text text-transparent drop-shadow-[0_1px_1px_rgba(0,0,0,0.4)]">Fun Learning Games & Activities for Kids</h1>
          <div className="h-1 w-20 rounded-full bg-gradient-to-r from-yellow-300 to-pink-400 mb-4" />
          <p className="text-lg opacity-95 max-w-3xl">
            Learning doesn’t have to be boring! Our Kids Hub is full of <strong>fun learning games for kids</strong>, creative printables,
            and short skill‑building challenges that turn study time into playtime. Perfect for ages 6–12, these activities help children
            focus, think, and create — all while having fun.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#play" className={OUTLINE_BUTTON}>🎮 Play games</a>
            <a href="/printables" className={OUTLINE_BUTTON}>🖨️ Download printables</a>
            {/* Above-the-fold links to key worksheets */}
            <a href="/worksheets/handwriting-worksheet-maker" className={OUTLINE_BUTTON} aria-label="Handwriting worksheets (PDF)">✍️ Handwriting worksheets</a>
            <a href="/worksheets/1st-grade-math-worksheets" className={OUTLINE_BUTTON} aria-label="1st Grade Math Worksheets – Printable">➕ 1st grade math</a>
          </div>
        </div>
      </header>
      {/* Kids-themed floating cards (desktop only) */}
      <div className="hidden lg:block">
        <div className="absolute top-[22rem] left-10 z-10">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 transform rotate-12 hover:rotate-6 hover:-translate-y-1 transition-transform duration-300 shadow-lg">
            <div className="text-2xl">🎨</div>
            <p className="text-white text-sm mt-1">Coloring</p>
          </div>
        </div>
        <div className="absolute top-[18rem] right-16 z-10">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 transform -rotate-12 hover:-rotate-6 hover:-translate-y-1 transition-transform duration-300 shadow-lg">
            <div className="text-2xl">🧩</div>
            <p className="text-white text-sm mt-1">Puzzles</p>
          </div>
        </div>
        <div className="absolute bottom-[26rem] left-1/4 z-10">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 transform rotate-6 hover:rotate-3 hover:-translate-y-1 transition-transform duration-300 shadow-lg">
            <div className="text-2xl">🚀</div>
            <p className="text-white text-sm mt-1">Space</p>
          </div>
        </div>
        <div className="absolute bottom-[30rem] right-1/4 z-10">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 transform -rotate-6 hover:-rotate-3 hover:-translate-y-1 transition-transform duration-300 shadow-lg">
            <div className="text-2xl">🐾</div>
            <p className="text-white text-sm mt-1">Animals</p>
          </div>
        </div>
        <div className="absolute top-[26rem] right-[45%] z-10">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 transform rotate-3 hover:rotate-0 hover:-translate-y-1 transition-transform duration-300 shadow-lg">
            <div className="text-2xl">📚</div>
            <p className="text-white text-sm mt-1">Study</p>
          </div>
        </div>
        <div className="absolute top-[20rem] right-[30%] z-10">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 transform rotate-6 hover:rotate-0 hover:-translate-y-1 transition-transform duration-300 shadow-lg">
            <div className="text-2xl">🎮</div>
            <p className="text-white text-sm mt-1">Games</p>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Play Free Fun Learning Games Online */}
        <section id="play">
          <div className="mb-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">Play Free Fun Learning Games Online</h2>
            <div className="h-1 w-16 rounded-full bg-gradient-to-r from-yellow-300 to-pink-400 mt-2 mb-2" />
            <p className="mt-2 text-slate-700 max-w-3xl">
              Keep your brain active with our <strong>fun learning games for kids online</strong>.
              Play quick, interactive games that test memory and vocabulary skills:
            </p>
            <ul className="mt-3 list-disc list-inside text-slate-700 space-y-1">
              <li>🃏 Memory Match – Find all pairs before time runs out!</li>
              <li>🔤 Word Search Game – Race the clock to uncover hidden words.</li>
              <li>🧩 Puzzle Game – Fix the picture by swapping tiles.</li>
              <li>⌨️ Typing Safari – Type letters and words to help animals cross.</li>
            </ul>
            
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <article className={CARD_CLASS}>
              <SmartImage
                primary={"https://images.unsplash.com/photo-1668294141622-18e9998a00f6?q=80&w=1600&auto=format&fit=crop&kidv=mm1"}
                alts={[KID_SAFE.puzzleDesk, KID_SAFE.classroomHands, KID_SAFE.coloringCrayons]}
                alt="Memory match game cover"
                className="w-full h-40 object-cover"
                disableDedup
              />
              <div className="p-5">
                <div className="flex gap-2 mb-2">
                  <span className={CHIP_CLASS}>Ages 6–8</span>
                  <span className={CHIP_CLASS}>Easy/Medium</span>
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">Memory Match</h3>
                <p className="text-slate-600 text-sm mb-4">Find all pairs in the fewest moves. Timer + best score.</p>
                <a href="/kids/games/memory" className={BUTTON_CLASS}>Play</a>
              </div>
            </article>

            {/* Puzzle Game */}
            <article className={CARD_CLASS}>
              <SmartImage
                primary={"https://plus.unsplash.com/premium_photo-1732776567082-cbcd94f49316?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&kidv=puzzle-cover-2"}
                alts={[KID_SAFE.kidsWithAnimals, KID_SAFE.classroomHands]}
                alt="Puzzle game cover"
                className="w-full h-40 object-cover"
                disableDedup
              />
              <div className="p-5">
                <div className="flex gap-2 mb-2">
                  <span className={CHIP_CLASS}>Ages 6–10</span>
                  <span className={CHIP_CLASS}>Drag & Drop</span>
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">Puzzle Game</h3>
                <p className="text-slate-600 text-sm mb-4">Fix the picture by swapping tiles. Animals & Nature.</p>
                <a href="/kids/games/puzzle" className={BUTTON_CLASS}>Play</a>
              </div>
            </article>
            <article className={CARD_CLASS}>
              <SmartImage
                primary={"https://plus.unsplash.com/premium_photo-1720694751690-ab68c805bf36?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
                alts={[KID_SAFE.classroomHands, KID_SAFE.childStudyDesk, KID_SAFE.kidJournaling, KID_SAFE.childWriting]}
                alt="Word search game cover"
                className="w-full h-40 object-cover"
                disableDedup
              />
              <div className="p-5">
                <div className="flex gap-2 mb-2">
                  <span className={CHIP_CLASS}>Ages 9–12</span>
                  <span className={CHIP_CLASS}>Animals/Space</span>
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">Word Search</h3>
                <p className="text-slate-600 text-sm mb-4">Find all hidden words in time. Mobile friendly.</p>
                <a href="/kids/games/word-search" className={BUTTON_CLASS}>Play</a>
              </div>
            </article>
            {/* Typing Safari */}
            <article className={CARD_CLASS}>
              <SmartImage
                primary={"https://images.unsplash.com/photo-1708033777801-37deb9d4bec4?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170&kidv=typing-cover-1"}
                alts={[KID_SAFE.childWriting, KID_SAFE.kidJournaling, KID_SAFE.classroomHands]}
                alt="Typing safari game cover"
                className="w-full h-40 object-cover"
                disableDedup
              />
              <div className="p-5">
                <div className="flex gap-2 mb-2">
                  <span className={CHIP_CLASS}>Ages 7–12</span>
                  <span className={CHIP_CLASS}>Typing</span>
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">Typing Safari</h3>
                <p className="text-slate-600 text-sm mb-4">Type letters and words to help animals cross the river.</p>
                <a href="/kids/games/typing" className={BUTTON_CLASS}>Play</a>
              </div>
            </article>
            {/* Pattern Builder */}
            <article className={CARD_CLASS}>
              <SmartImage
                primary={"https://plus.unsplash.com/premium_photo-1681400285322-048eeaa7f1c1?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1074&kidv=pattern-cover-1"}
                alts={[KID_SAFE.planetsModel, KID_SAFE.puzzleJigsaw, KID_SAFE.classroomHands]}
                alt="Pattern Builder game cover"
                className="w-full h-40 object-cover"
                disableDedup
              />
              <div className="p-5">
                <div className="flex gap-2 mb-2">
                  <span className={CHIP_CLASS}>Ages 6–10</span>
                  <span className={CHIP_CLASS}>Memory</span>
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">Pattern Builder</h3>
                <p className="text-slate-600 text-sm mb-4">Watch the pattern and repeat it before time runs out.</p>
                <a href="/kids/games/pattern" className={BUTTON_CLASS}>Play</a>
              </div>
            </article>
          </div>
        </section>

        {/* Printable Fun Learning Activities */}
        <section id="print">
          <div className="mb-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">Printable Fun Learning Activities</h2>
            <div className="h-1 w-16 rounded-full bg-gradient-to-r from-yellow-300 to-pink-400 mt-2 mb-2" />
            <p className="mt-2 text-slate-700 max-w-3xl">
              Take a break from screens with our <strong>fun learning activities for kids</strong> you can print at home.
              Download puzzles and worksheets designed to boost focus, logic, and creativity:
            </p>
            <ul className="mt-3 list-disc list-inside text-slate-700 space-y-1">
              <li>🧠 Word Search – Animals & Space</li>
              <li>🔢 Sudoku – Easy (4×4) & Medium (6×6)</li>
              <li>🎨 Coloring Page – Creative Animals</li>
            </ul>
            <div className="mt-4">
              <div className="flex flex-wrap gap-2">
                <a href="/printables" className={OUTLINE_BUTTON}>Explore more →</a>
                <a href="/worksheets/handwriting-worksheet-maker" className={OUTLINE_BUTTON} aria-label="Open Handwriting Worksheet Maker">✍️ Handwriting Worksheet Maker</a>
              </div>
            </div>
          </div>

          {/* List of cards removed per request; keep only summary + CTA */}
        </section>

        {/* Creative Generators */}
        <section id="generators" className="mt-12">
          <div className="mb-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">Create Something Magical</h2>
            <div className="h-1 w-16 rounded-full bg-gradient-to-r from-yellow-300 to-pink-400 mt-2 mb-2" />
            <p className="mt-2 text-slate-700 max-w-3xl">
              Use our kid-friendly generators to make printable keepsakes in minutes. Customize awards, handwriting sheets, and more — perfect for
              classrooms, homeschool, or daily motivation.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            <article className={CARD_CLASS}>
              <SmartImage
                primary="https://images.unsplash.com/photo-1589330694653-ded6df03f754?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1216"
                alts={[KID_SAFE.classroomHands, KID_SAFE.childWriting, KID_SAFE.kidsWithAnimals]}
                alt="Certificate maker preview"
                className="w-full h-40 object-cover"
              />
              <div className="p-5">
                <div className="flex gap-2 mb-2">
                  <span className={CHIP_CLASS}>Print-ready</span>
                  <span className={CHIP_CLASS}>Custom text</span>
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">Certificate Maker</h3>
                <p className="text-slate-600 text-sm mb-4">Celebrate big wins with personalized certificates, cute badges, and editable fields.</p>
                <a href="/printables/certificate-maker" className={BUTTON_CLASS} aria-label="Open certificate maker">Make a certificate</a>
              </div>
            </article>

            <article className={CARD_CLASS}>
              <SmartImage
                primary="https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=1200&q=80"
                alts={[KID_SAFE.childWriting, KID_SAFE.coloringCrayons, KID_SAFE.childStudyDesk]}
                alt="Name tracing worksheet preview"
                className="w-full h-40 object-cover"
              />
              <div className="p-5">
                <div className="flex gap-2 mb-2">
                  <span className={CHIP_CLASS}>Handwriting</span>
                  <span className={CHIP_CLASS}>Custom name</span>
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">Name Tracing Generator</h3>
                <p className="text-slate-600 text-sm mb-4">Type any name to create dotted, bubble, or cursive tracing sheets instantly.</p>
                <a href="/printables/name-tracing-generator" className={BUTTON_CLASS} aria-label="Open name tracing generator">Create worksheet</a>
              </div>
            </article>

            <article className={CARD_CLASS}>
              <SmartImage
                primary="https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=1200&q=80"
                alts={[KID_SAFE.childWriting, KID_SAFE.childStudyDesk, KID_SAFE.kidsWithAnimals]}
                alt="Handwriting worksheet preview"
                className="w-full h-40 object-cover"
              />
              <div className="p-5">
                <div className="flex gap-2 mb-2">
                  <span className={CHIP_CLASS}>Printables</span>
                  <span className={CHIP_CLASS}>Letters & words</span>
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">Handwriting Worksheet Maker</h3>
                <p className="text-slate-600 text-sm mb-4">Generate dotted letters, words, or sentences with primary line guides in seconds.</p>
                <a href="/worksheets/handwriting-worksheet-maker" className={BUTTON_CLASS} aria-label="Open handwriting worksheet maker">Build practice sheet</a>
              </div>
            </article>
          </div>
        </section>

        {/* 7‑Day Fun Skills to Learn */}
        <section id="skills">
          <div className="mb-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">7‑Day Fun Skills to Learn</h2>
            <div className="h-1 w-16 rounded-full bg-gradient-to-r from-yellow-300 to-pink-400 mt-2 mb-2" />
            <p className="mt-2 text-slate-700 max-w-3xl">
              Explore short, guided plans that help kids build new creative skills step‑by‑step.
              Each plan includes daily tasks, printable checklists, and mini‑rewards to keep kids motivated.
            </p>
            <ul className="mt-3 list-disc list-inside text-slate-700 space-y-1">
              <li>✂️ Origami Basics – Fold amazing paper animals.</li>
              <li>🐾 Drawing Animals – Learn to sketch your favorite creatures.</li>
            </ul>
            <div className="mt-4">
              <a href="/generate" className={BUTTON_CLASS}>Start a 7‑Day Plan →</a>
            </div>
          </div>
        </section>

        {/* Kids Blog Picks */}
        <section id="kids-blog">
          <div className="mb-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">Kids Blog Picks</h2>
            <div className="h-1 w-16 rounded-full bg-gradient-to-r from-yellow-300 to-pink-400 mt-2 mb-2" />
            <p className="mt-2 text-slate-700 max-w-3xl">
              Explore helpful reads about <strong>making learning fun</strong>, building good study habits, and simple activities kids can enjoy.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {KIDS_BLOGS.map(post => (
              <article key={post.id} className={CARD_CLASS}>
                <SmartImage
                  primary={post.cover}
                  alts={[KID_SAFE.classroomHands, KID_SAFE.childWriting, KID_SAFE.playgroundKids]}
                  alt={`${post.title} – kids blog`}
                  className="w-full h-32 object-cover"
                />
                <div className="p-5">
                  <h3 className="font-semibold text-slate-900 mb-1">{post.title}</h3>
                  <p className="text-slate-600 text-sm mb-4">{post.subtitle}</p>
                  <a href={post.href} className="text-purple-600 hover:text-purple-700 font-medium">Read</a>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* FAQs – Making Learning Fun for Kids */}
        <section id="faqs">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-slate-900">🧠 FAQs – Making Learning Fun for Kids</h2>
          </div>
          <Accordion type="single" collapsible className="divide-y rounded-xl border border-slate-200 bg-white">
            <AccordionItem value="q1">
              <AccordionTrigger className="px-4">How can I make learning fun for my child?</AccordionTrigger>
              <AccordionContent className="px-4 text-slate-700">
                Turn lessons into games, use printable puzzles, and encourage creativity through art or short challenges. Mix brief study
                sessions with <strong>fun learning games for kids</strong> that build focus and confidence.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger className="px-4">What are the best fun learning games for kids online?</AccordionTrigger>
              <AccordionContent className="px-4 text-slate-700">
                Memory Match improves focus and Word Search builds vocabulary. These quick, browser‑based games help kids learn new words,
                improve memory, and enjoy learning at their own pace.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger className="px-4">What printable activities help kids learn better?</AccordionTrigger>
              <AccordionContent className="px-4 text-slate-700">
                Printable puzzles like Sudoku, Word Search, and Spot‑the‑Difference improve problem‑solving and attention to detail.
                Coloring pages support creativity and relaxation — perfect for learning and play.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q4">
              <AccordionTrigger className="px-4">What fun skills can kids learn in a week?</AccordionTrigger>
              <AccordionContent className="px-4 text-slate-700">
                Kids can build creative skills in just seven days with simple step‑by‑step plans like Origami Basics or Drawing Animals.
                These short challenges teach patience, focus, and creativity while keeping learning exciting.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q5">
              <AccordionTrigger className="px-4">Why is fun learning important for kids?</AccordionTrigger>
              <AccordionContent className="px-4 text-slate-700">
                Fun learning keeps kids curious, reduces study stress, and improves motivation. When children enjoy what they’re doing,
                they naturally absorb more and develop a love for lifelong learning.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
      </main>
      <Footer />
    </div>
  );
}

const PRINTABLES = [
  {
    id: 'ws-animals',
    title: 'Word Search – Animals',
    subtitle: 'Find 12 animal names',
    chips: ['Ages 6–8', 'Easy'],
    href: '/print?doc=ws-animals',
    cover: KID_SAFE.kidsWithAnimals
  },
  {
    id: 'ws-space',
    title: 'Word Search – Space',
    subtitle: 'Find 12 space words',
    chips: ['Ages 9–12', 'Moderate'],
    href: '/print?doc=ws-space',
    cover: KID_SAFE.planetsModel
  },
  {
    id: 'sudoku-4',
    title: 'Sudoku – 4×4 (Easy)',
    subtitle: 'Beginner logic puzzle',
    chips: ['Ages 6–8', 'Easy'],
    href: '/print?doc=sudoku4',
    cover: KID_SAFE.puzzleJigsaw
  },
  {
    id: 'sudoku-6',
    title: 'Sudoku – 6×6 (Medium)',
    subtitle: 'A bit more challenge',
    chips: ['Ages 9–12', 'Medium'],
    href: '/print?doc=sudoku6',
    cover: KID_SAFE.classroomHands
  },
  {
    id: 'coloring',
    title: 'Coloring – Cute Animals',
    subtitle: 'Creative and calming',
    chips: ['Ages 6–8'],
    href: '/print?doc=coloring',
    cover: KID_SAFE.coloringCrayons
  },
  
];

const HELPERS = [
  {
    id: 'focus-in-10',
    title: 'Focus in 10 (for Kids)',
    subtitle: 'Quick routine to start homework calmly',
    href: '/blog',
    cover: KID_SAFE.childStudyDesk
  },
  {
    id: 'kid-note-taking',
    title: 'Simple Note‑Taking for Homework',
    subtitle: 'Write just what matters — with examples',
    href: '/blog',
    cover: KID_SAFE.childWriting
  },
  {
    id: 'micro-journaling-kids',
    title: 'Micro‑Journaling for Kids',
    subtitle: '1–2 lines that build confidence',
    href: '/blog',
    cover: KID_SAFE.kidJournaling
  }
];

// Temporary kids-related blog picks (links to existing posts)
const KIDS_BLOGS = [
  {
    id: 'educational-games-for-kids',
    title: 'Educational Games for Kids',
    subtitle: '4 fun games that build real skills',
    href: '/blog/educational-games-for-kids',
    cover: 'https://plus.unsplash.com/premium_photo-1723802502661-b7e0445732c2?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170&kidv=edu-games-cover-3',
  },
  {
    id: 'free-printable-coloring-pages-for-kids',
    title: '🖍️ Free Printable Coloring Pages for Kids That Make Learning Fun',
    subtitle: 'Creative, screen‑free activities that build focus and skills',
    href: '/blog/free-printable-coloring-pages-for-kids',
    cover: 'https://images.unsplash.com/photo-1617117206620-b01f2919ff86?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170',
  },
  {
    id: 'outdoor-hobbies-for-students',
    title: 'Outdoor Hobbies for Students',
    subtitle: 'Move, explore, and learn outside',
    href: '/blog/outdoor-hobbies-for-students',
    cover: KID_SAFE.classroomHands,
  },
];

