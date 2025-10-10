import React, { useMemo, useRef, useState } from 'react';
import { SEOMetaTags } from '@/components/SEOMetaTags';
import { UnifiedNavigation } from '@/components/UnifiedNavigation';
import { Footer } from '@/components/Footer';
import MemoryMatch from '@/components/kids/MemoryMatch';
import WordSearch from '@/components/kids/WordSearch';

const CARD_CLASS = 'bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow transition-all overflow-hidden';
const BUTTON_CLASS = 'inline-flex items-center justify-center px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors';
const OUTLINE_BUTTON = 'inline-flex items-center justify-center px-4 py-2 rounded-lg border border-purple-200 text-purple-700 hover:bg-purple-50 transition-colors';
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

  // Support game subpages: /kids/games/memory and /kids/games/word-search
  const path = (typeof window !== 'undefined' ? window.location.pathname : '/kids');
  const parts = path.replace(/^\/+/,'').split('/');
  const sub1 = parts[1] || '';
  const sub2 = parts[2] || '';
  if (sub1 === 'games') {
    return (
      <div className="min-h-screen bg-slate-50">
        <SEOMetaTags
          title={`Kids Hub – ${sub2 === 'word-search' ? 'Word Search' : 'Memory Match'} Game`}
          description="Play free fun learning games for kids online – Memory Match and Word Search. Kid-safe, fast, and mobile-friendly."
          canonicalUrl={`https://wizqo.com/kids/games/${sub2 || 'memory'}`}
        />
        <UnifiedNavigation currentPage="kids" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-slate-900">
              {sub2 === 'word-search' ? 'Word Search' : 'Memory Match'}
            </h1>
            <a className={OUTLINE_BUTTON} href="/kids">Back to Kids Hub</a>
          </div>
          {sub2 === 'word-search' ? <WordSearch /> : <MemoryMatch />}
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
      />
      <UnifiedNavigation currentPage="kids" />

      {/* Hero */}
      <header className="relative text-white">
        <SmartImage
          primary={KID_SAFE.playgroundKids}
          alts={[KID_SAFE.coloringCrayons, KID_SAFE.classroomHands, KID_SAFE.puzzleJigsaw, KID_SAFE.childStudyDesk]}
          alt="Kids Hub hero background (playground fun)"
          className="absolute inset-0 w-full h-full object-cover"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 via-purple-700/40 to-pink-700/40" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-3">Fun Learning Games & Activities for Kids</h1>
          <p className="text-lg opacity-90 max-w-3xl">
            Learning doesn’t have to be boring! Our Kids Hub is full of <strong>fun learning games for kids</strong>, creative printables,
            and short skill‑building challenges that turn study time into playtime. Perfect for ages 6–12, these activities help children
            focus, think, and create — all while having fun.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#print" className={BUTTON_CLASS}>Download printables</a>
            <a href="#play" className={OUTLINE_BUTTON}>Play games</a>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Printable Fun Learning Activities */}
        <section id="print">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-slate-900">Printable Fun Learning Activities</h2>
            <p className="mt-2 text-slate-700 max-w-3xl">
              Take a break from screens with our <strong>fun learning activities for kids</strong> you can print at home.
              Download puzzles and worksheets designed to boost focus, logic, and creativity:
            </p>
            <ul className="mt-3 list-disc list-inside text-slate-700 space-y-1">
              <li>🧠 Word Search – Animals & Space</li>
              <li>🔢 Sudoku – Easy (4×4) & Medium (6×6)</li>
              <li>🎨 Coloring Page – Creative Animals</li>
              <li>👀 Spot‑the‑Difference – Playground Fun</li>
            </ul>
            <div className="mt-4">
              <a href="/printables/kids-pack-week1.zip" className={OUTLINE_BUTTON}>Download the Fun Learning Pack →</a>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PRINTABLES.map(p => (
              <article key={p.id} className={CARD_CLASS}>
                <SmartImage
                  primary={p.cover}
                  alts={[KID_SAFE.coloringCrayons, KID_SAFE.kidsWithAnimals, KID_SAFE.classroomHands, KID_SAFE.puzzleDesk, KID_SAFE.puzzleJigsaw, KID_SAFE.planetsModel, KID_SAFE.playgroundKids, KID_SAFE.childWriting, KID_SAFE.kidJournaling]}
                  alt={`${p.title} – kids printable`}
                  className="w-full h-36 object-cover"
                />
                <div className="p-5">
                  <div className="flex gap-2 mb-2">
                    {p.chips.map((c, i) => (<span key={i} className={CHIP_CLASS}>{c}</span>))}
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1">{p.title}</h3>
                  <p className="text-slate-600 text-sm mb-4">{p.subtitle}</p>
                  <a href={p.href} className={BUTTON_CLASS} download>Download PDF</a>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Play Free Fun Learning Games Online */}
        <section id="play">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-slate-900">Play Free Fun Learning Games Online</h2>
            <p className="mt-2 text-slate-700 max-w-3xl">
              Keep your brain active with our <strong>fun learning games for kids online</strong>.
              Play quick, interactive games that test memory and vocabulary skills:
            </p>
            <ul className="mt-3 list-disc list-inside text-slate-700 space-y-1">
              <li>🃏 Memory Match – Find all pairs before time runs out!</li>
              <li>🔤 Word Search Game – Race the clock to uncover hidden words.</li>
            </ul>
            <div className="mt-4">
              <a href="#play" className={OUTLINE_BUTTON}>Start Playing Now →</a>
            </div>
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

            <article className={CARD_CLASS}>
              <SmartImage
                primary={"https://images.unsplash.com/photo-1668294141622-18e9998a00f6?q=80&w=1600&auto=format&fit=crop&kidv=ws2"}
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
          </div>
        </section>

        {/* 7‑Day Fun Skills to Learn */}
        <section id="skills">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-slate-900">7‑Day Fun Skills to Learn</h2>
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
            <h2 className="text-2xl font-bold text-slate-900">Kids Blog Picks</h2>
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
            <div className="mt-3 space-y-4 text-slate-700">
              <div>
                <h3 className="font-semibold">How can I make learning fun for my child?</h3>
                <p>
                  Turn lessons into games, use printable puzzles, and encourage creativity through art or short challenges.
                  Mix brief study sessions with <strong>fun learning games for kids</strong> that build focus and confidence.
                </p>
              </div>
              <div>
                <h3 className="font-semibold">What are the best fun learning games for kids online?</h3>
                <p>
                  Memory Match improves focus and Word Search builds vocabulary. These quick, browser‑based games help kids learn new words,
                  improve memory, and enjoy learning at their own pace.
                </p>
              </div>
              <div>
                <h3 className="font-semibold">What printable activities help kids learn better?</h3>
                <p>
                  Printable puzzles like Sudoku, Word Search, and Spot‑the‑Difference improve problem‑solving and attention to detail.
                  Coloring pages support creativity and relaxation — perfect for learning and play.
                </p>
              </div>
              <div>
                <h3 className="font-semibold">What fun skills can kids learn in a week?</h3>
                <p>
                  Kids can build creative skills in just seven days with simple step‑by‑step plans like Origami Basics or Drawing Animals.
                  These short challenges teach patience, focus, and creativity while keeping learning exciting.
                </p>
              </div>
              <div>
                <h3 className="font-semibold">Why is fun learning important for kids?</h3>
                <p>
                  Fun learning keeps kids curious, reduces study stress, and improves motivation. When children enjoy what they’re doing,
                  they naturally absorb more and develop a love for lifelong learning.
                </p>
              </div>
            </div>
          </div>
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
    href: '/printables/kids-wordsearch-animals.pdf',
    cover: KID_SAFE.kidsWithAnimals
  },
  {
    id: 'ws-space',
    title: 'Word Search – Space',
    subtitle: 'Find 12 space words',
    chips: ['Ages 9–12', 'Moderate'],
    href: '/printables/kids-wordsearch-space.pdf',
    cover: KID_SAFE.planetsModel
  },
  {
    id: 'sudoku-4',
    title: 'Sudoku – 4×4 (Easy)',
    subtitle: 'Beginner logic puzzle',
    chips: ['Ages 6–8', 'Easy'],
    href: '/printables/kids-sudoku-4x4.pdf',
    cover: KID_SAFE.puzzleJigsaw
  },
  {
    id: 'sudoku-6',
    title: 'Sudoku – 6×6 (Medium)',
    subtitle: 'A bit more challenge',
    chips: ['Ages 9–12', 'Medium'],
    href: '/printables/kids-sudoku-6x6.pdf',
    cover: KID_SAFE.classroomHands
  },
  {
    id: 'coloring',
    title: 'Coloring – Cute Animals',
    subtitle: 'Creative and calming',
    chips: ['Ages 6–8'],
    href: '/printables/kids-coloring-animals.pdf',
    cover: KID_SAFE.coloringCrayons
  },
  {
    id: 'spot-diff',
    title: 'Spot the Difference – Playground',
    subtitle: 'Find 8 differences',
    chips: ['Ages 6–10'],
    href: '/printables/kids-spot-the-difference-playground.pdf',
    cover: KID_SAFE.playgroundKids
  }
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
    id: 'relaxing-hobbies',
    title: 'Relaxing Hobbies',
    subtitle: 'Simple activities to unwind and focus',
    href: '/blog/relaxing-hobbies',
    cover: KID_SAFE.coloringCrayons,
  },
  {
    id: 'productive-hobbies-for-students',
    title: 'Productive Hobbies for Students',
    subtitle: 'Grow skills with quick daily practice',
    href: '/blog/productive-hobbies-for-students',
    cover: KID_SAFE.kidJournaling,
  },
  {
    id: 'outdoor-hobbies-for-students',
    title: 'Outdoor Hobbies for Students',
    subtitle: 'Move, explore, and learn outside',
    href: '/blog/outdoor-hobbies-for-students',
    cover: KID_SAFE.classroomHands,
  },
];

