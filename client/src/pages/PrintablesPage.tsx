import React from 'react'
import { WizqoLogo } from '@/components/WizqoLogo'
import InteractiveBundleSections from '@/components/InteractiveBundleSections'
import { PRINTABLE_BUNDLE_SECTIONS, getPrintableSectionForDoc } from '@/data/printableBundles'
import { INTERACTIVE_CATEGORIES } from '@shared/interactive/interactiveWorksheets'

const INTERACTIVE_DOC_IDS = INTERACTIVE_CATEGORIES.flatMap((category) => category.docs.map((doc) => doc.id))
const ANSWERABLE_BASE_DOC_IDS = [
  'science-match',
  'spelling',
  'logic-grid',
  'grammar-detective',
  'math-maze',
  // Reading print views
  'reading-mini-1',
  'reading-g1-lost-hat',
  'reading-g1-ants',
  'reading-g1-bus-ride',
  'reading-g1-pet-fish',
  'reading-g2-paper-bridge',
  'reading-g2-rainy-garden',
  'reading-g2-library-card',
  'reading-g2-lost-and-found',
  'reading-g3-lighthouse',
  'reading-g3-science-fair',
  'reading-g3-community-garden',
  // 2nd grade math printables
  'place-value-hto',
  'skip-count-5-10-120',
  'add-2digit-100',
  'sub-2digit-100',
  'word-problems-100',
  'compare-2digit',
  'even-odd-100',
]

function resolveDocTitle(docId: string, context: { packTime: string; bundleCategory?: string }): string {
  const { packTime, bundleCategory } = context
  switch (docId) {
    case 'bundle':
      return bundleCategory ? `${bundleCategory} Printable Bundle` : 'Printable Bundle'
    case 'ten-frames-1-20':
      return '🔟 Ten Frames 1–20'
    case 'number-tracing-1-20':
      return '🔢 Number Tracing 1–20'
    case 'stem-balloon-rocket':
      return '🚀 Balloon Rocket (STEM)'
    case 'stem-walking-water':
      return '🌈 Walking Water (STEM)'
    case 'arts-3-shape-creature':
      return '🎨 Draw From 3 Shapes (Arts)'
    case 'number-tracing-1-10':
      return '🔢 Number Tracing 1–10'
    case 'uppercase-lowercase-match':
      return 'Aa–Zz Upper/Lower Letter Match'
    case 'beginning-sounds-az':
      return '🔤 Beginning Sounds (A–Z)'
    case 'addition-subtraction-0-10':
      return '➕➖ Addition & Subtraction 0–10'
    case 'ten-frames-1-10':
      return '🔟 Ten Frames 1–10'
    case 'shapes-colors-sort':
      return '◻ Shapes & Colors Sort (Cut & Glue)'
    case 'dot-to-dot-1-20':
      return '1–20 Dot‑to‑Dot'
    case 'tangram-animals':
      return 'Tangram Animals (Cutouts)'
    case 'spot-difference':
    case 'spotdiff':
      return '👀 Spot‑the‑Difference'
    case 'directed-drawing-animals':
      return '🖊️ Directed Drawing: Animals'
    case 'cut-and-paste-crafts':
      return '✂️ Cut‑and‑Paste Paper Crafts'
    case 'feelings-checkin':
      return '😊 Feelings Check‑In Meter'
    case 'reward-chart':
      return '⭐ Weekly Reward / Sticker Chart'
    case 'reading-mini-1':
      return '📖 Mini Reading Passage + 3 Questions'
    case 'reading-g1-lost-hat':
      return '📖 Grade 1 — The Lost Hat (Reading)'
    case 'reading-g1-ants':
      return '📖 Grade 1 — Lunch for the Ants (Reading)'
    case 'reading-g1-bus-ride':
      return '📖 Grade 1 — The Bus Ride (Reading)'
    case 'reading-g1-pet-fish':
      return '📖 Grade 1 — The Pet Fish (Reading)'
    case 'reading-g2-paper-bridge':
      return '📖 Grade 2 — The Paper Bridge (Reading)'
    case 'reading-g2-rainy-garden':
      return '📖 Grade 2 — Rainy Day Garden (Reading)'
    case 'reading-g2-library-card':
      return '📖 Grade 2 — New Library Card (Reading)'
    case 'reading-g2-lost-and-found':
      return '📖 Grade 2 — Lost and Found (Reading)'
    case 'reading-g3-lighthouse':
      return '📖 Grade 3 — The Lighthouse Keeper’s Trick (Reading)'
    case 'reading-g3-science-fair':
      return '📖 Grade 3 — The Science Fair Plan (Reading)'
    case 'reading-g3-community-garden':
      return '📖 Grade 3 — The Community Garden (Reading)'
    case 'pack':
      return `Today’s ${packTime}-Minute Print Pack`
    case 'math-maze':
      return '➕ Math Maze Adventure'
    case 'spelling':
      return '✏️ Spelling Challenge Worksheet'
    case 'science-match':
      return '🔬 Science Fun Facts Match'
    case 'grammar-detective':
      return '🕵️‍♀️ Grammar Detective'
    case 'sudoku4':
      return '🔢 Sudoku – 4×4 (Easy)'
    case 'sudoku6':
      return '🧮 Sudoku – 6×6 (Medium)'
    case 'place-value-hto':
      return '🧮 Place Value (Tens/Ones)'
    case 'skip-count-5-10-120':
      return '🔁 Skip Counting by 5s & 10s'
    case 'add-2digit-100':
      return '➕ Add 2-Digit Numbers (to 100)'
    case 'sub-2digit-100':
      return '➖ Subtract 2-Digit Numbers (to 100)'
    case 'word-problems-100':
      return '🧠 Word Problems (within 100)'
    case 'compare-2digit':
      return '⚖️ Compare 2-Digit Numbers'
    case 'even-odd-100':
      return '🔢 Even or Odd to 100'
    case 'time-5min':
      return '⏰ Tell Time to 5 Minutes'
    case 'color-by-number':
      return '🖍️ Color-by-Number Pages'
    // New 1st Grade worksheets
    case 'number-bonds-10':
      return '🔢 Number Bonds to 10'
    case 'count-write-30':
      return '📊 Count & Write 1–30'
    case 'missing-numbers-50':
      return '🔍 Missing Numbers 1–50'
    case 'picture-addition-10':
      return '➕ Picture Addition to 10'
    case 'subtraction-stories':
      return '➖ Subtraction Stories'
    case 'balance-equations-10':
      return '⚖️ Balance Equations (to 10)'
    case 'skip-count-2s':
      return '➡️ Skip Counting by 2s'
    case 'number-line-add':
      return '🔢 Number Line Addition'
    case 'doubles-facts':
      return '🎯 Doubles Facts Practice'
    case 'pattern-complete':
      return '🧩 Pattern Completion'
    case 'missing-shape':
      return '🔍 Find the Missing Shape'
    case 'size-comparison':
      return '📏 Size Comparison'
    // New 2nd Grade worksheets
    case 'expanded-form-200':
      return '🔢 Expanded Form to 200'
    case 'number-patterns-200':
      return '📊 Number Patterns to 200'
    case 'rounding-nearest-10':
      return '🔍 Rounding to Nearest 10'
    case 'add-three-numbers':
      return '➕ Adding 3 Numbers'
    case 'missing-addends':
      return '➖ Missing Addends'
    case 'fact-families-20':
      return '⚖️ Fact Families (to 20)'
    case 'mental-math-20':
      return '🔢 Mental Math (Add/Sub to 20)'
    case 'number-line-200':
      return '📈 Number Line to 200'
    case 'doubles-near-doubles':
      return '🎯 Doubles & Near Doubles'
    case 'money-coins-bills':
      return '💰 Money: Coins & Bills'
    case 'measurement-length':
      return '📏 Measurement: Length'
    case 'bar-graphs-data':
      return '📊 Bar Graphs & Data'
    case 'bookmark-templates':
      return '📚 DIY Bookmark Templates'
    case 'design-monster':
      return '👾 Design Your Monster'
    case 'draw-half':
      return '✏️ Draw the Missing Half'
    case 'coloring-animals':
      return '🦁 Animal Friends Coloring'
    case 'coloring-nature':
      return '🌼 Nature & Seasons Coloring'
    case 'coloring-space':
      return '🚀 Space Adventure Coloring'
    case 'coloring-vehicles':
      return '🚗 Vehicles & Transport Coloring'
    case 'coloring-letters-numbers':
      return '🔢 Alphabet & Number Coloring'
    case 'coloring-heroes':
      return '🦸 Superheroes & Everyday Heroes'
    case 'coloring':
      return '🎨 Coloring Page – Cute Animal'
    case 'hidden-object':
      return '🔎 Find the Hidden Object'
    case 'maze-focus':
      return '🌀 Maze of Focus'
    case 'ws-animals':
      return '🧠 Word Search – Animals'
    case 'ws-space':
      return '🧠 Word Search – Space'
    case 'logic-grid':
      return '🧩 Logic Grid Puzzle'
    case 'gratitude-jar':
      return '💌 Gratitude Jar Worksheet'
    case 'mood-tracker':
      return '🌈 Mood Tracker Coloring Page'
    case 'mandalas':
      return '🕉️ Mindful Coloring Mandalas'
    case 'weekly-goals':
      return '🗓️ My Goals for the Week'
    case 'halloween-pack':
      return '🎃 Halloween Puzzle Pack'
    case 'winter-kindness':
      return '❄️ Winter Kindness Challenge'
    case 'spring-scavenger':
      return '🌸 Spring Nature Scavenger Hunt'
    case 'summer-pack':
      return '☀️ Summer Adventure Pack'
    case 'brain-boost':
      return '🧠 7-Day Brain Boost Pack'
    case 'creative-challenge':
      return '🎨 Creative Kids Challenge'
    case 'ws-world':
      return '🌍 Around the World Word Search'
    case 'animal-pack':
      return '🦁 Animal Adventure Pack'
    case 'geo-continents-k2':
      return '🌍 Label the 7 Continents (K–2)'
    case 'geo-compass-rose':
      return '🧭 Compass Rose & Directions'
    case 'geo-landforms':
      return '🏔️ Landforms vs Water Bodies'
    case 'geo-latlong':
      return '🗺️ Latitude & Longitude Basics'
    // Interactive Worksheets - Math
    case 'interactive-math-rhythm':
      return '🔢 Number Pattern Rhythm'
    case 'interactive-math-race':
      return '🏁 Math Race Challenge'
    case 'interactive-math-puzzle':
      return '🧩 Equation Puzzle Box'
    case 'interactive-math-shapes':
      return '🔺 Geometry Shape Challenge'
    case 'interactive-math-money':
      return '💰 Money Math Mastery'
    case 'interactive-math-fractions':
      return '🥧 Fraction Fun Practice'
    case 'interactive-math-measurement':
      return '📏 Measurement Mission'
    // Interactive Worksheets - Reading
    case 'interactive-reading-adventure':
      return '📖 Reading Adventure Quest'
    case 'interactive-reading-detective':
      return '🔍 Reading Detective Challenge'
    case 'interactive-reading-vocab':
      return '📚 Vocabulary Builder Workshop'
    case 'interactive-reading-summary':
      return '📝 Summary & Main Idea'
    case 'interactive-reading-compare':
      return '⚖️ Compare & Contrast Passages'
    case 'interactive-reading-prek':
      return '📖 Picture Story Time'
    case 'interactive-reading-storymap':
      return '🗺️ Story Map Builders'
    // Interactive Worksheets - Writing
    case 'interactive-writing-prompts':
      return '✍️ Creative Writing Prompts'
    case 'interactive-writing-sentences':
      return '📝 Sentence Builder Workshop'
    case 'interactive-writing-poetry':
      return '🎭 Poetry Writing Practice'
    case 'interactive-writing-opinion':
      return '💬 Opinion Writing Framework'
    case 'interactive-writing-prek':
      return '✏️ Drawing & Labeling'
    // Interactive Worksheets - Science
    case 'interactive-science-observation':
      return '🔬 Science Observation Journal'
    case 'interactive-science-lifecycle':
      return '🌱 Life Cycle Explorer'
    case 'interactive-science-states':
      return '⚗️ States of Matter Lab'
    case 'interactive-science-weather':
      return '🌦️ Weather Watcher Journal'
    case 'interactive-science-prek':
      return '🌱 Nature Explorer'
    case 'interactive-science-space':
      return '🚀 Space & Astronomy Explorer'
    // Interactive Worksheets - Geography
    case 'interactive-geography-map':
      return '🗺️ Interactive Map Skills'
    case 'interactive-geography-culture':
      return '🌍 Culture Explorer'
    case 'interactive-geography-history':
      return '📅 Historical Timeline Builder'
    case 'interactive-geography-prek':
      return '🏘️ My Community Explorer'
    // Interactive Worksheets - Grammar
    case 'interactive-grammar-parts':
      return '📖 Parts of Speech Practice'
    case 'interactive-grammar-tenses':
      return '⏰ Verb Tense Mastery'
    case 'interactive-grammar-antonyms':
      return '🔤 Synonyms & Antonyms Challenge'
    case 'interactive-grammar-prek':
      return '🔤 Word & Picture Match'
    // Interactive Worksheets - Art
    case 'interactive-art-design':
      return '🎨 Creative Design Challenge'
    case 'interactive-art-colorwheel':
      return '🌈 Color Theory Practice'
    case 'interactive-art-sketch':
      return '✏️ Sketch & Observe'
    // Interactive Worksheets - Early Learning
    case 'interactive-early-phonics':
      return '🔤 Phonics Fun Practice'
    case 'interactive-early-counting':
      return '🔢 Counting & Number Recognition'
    case 'interactive-early-patterns':
      return '🔄 Pattern Recognition Explorer'
    case 'interactive-early-shapes':
      return '◻️ Shape & Color Explorer'
    case 'interactive-early-letters':
      return '✍️ Letter Formation Practice'
    case 'interactive-early-numbers':
      return '🔢 Number Writing & Recognition'
    case 'interactive-early-foundations':
      return '📚 Foundational Skills Review'
    case 'interactive-early-basics':
      return '🌟 Basic Skills Practice'
    // Interactive Worksheets - Logic
    case 'interactive-logic-sequence':
      return '📊 Sequencing Challenge'
    case 'interactive-logic-riddles':
      return '🧩 Brain Teaser Riddles'
    case 'interactive-logic-deduction':
      return '🔍 Deductive Reasoning Quest'
    case 'interactive-logic-prek':
      return '🧩 Simple Patterns & Sorting'
    // Interactive Worksheets - SEL
    case 'interactive-sel-mindfulness':
      return '🧘 Mindfulness & Reflection'
    case 'interactive-sel-empathy':
      return '❤️ Empathy Builder'
    case 'interactive-sel-goals':
      return '🎯 Goal Setting & Growth'
    case 'interactive-sel-prek':
      return '😊 Feelings & Emotions Explorer'
    default:
      return 'Printable Fun Learning Activities'
  }
}

const interactiveDocIds = INTERACTIVE_CATEGORIES.flatMap((category) => category.docs.map((doc) => doc.id))
const BUNDLE_DOC_ALLOWLIST = new Set<string>([
  ...Object.values(PRINTABLE_BUNDLE_SECTIONS).flat(),
  ...interactiveDocIds,
])

export function PrintablesPage() {
  const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '')
  const doc = params.get('doc') || ''
  const autoPrint = (params.get('autoprint') || '').toLowerCase() === '1' || (params.get('autoprint') || '').toLowerCase() === 'true'
  const packTime = params.get('time') || '5'
  const packAge = params.get('age') || 'k2'
  const packSkill = params.get('skill') || 'mixed'
  const seedParam = params.get('seed') || ''
  const timestampParam = params.get('timestamp') || ''
  const variantParam = params.get('variant') || '1'
  const [showAnswers, setShowAnswers] = React.useState(false)
  const [copiedLink, setCopiedLink] = React.useState(false)
  const bundleItemsParam = params.get('items') || ''
  const bundleCategoryParam = params.get('category') || ''
  // Customization parameters
  const teacherName = params.get('teacher') || ''
  const className = params.get('class') || ''
  const studentsParam = params.get('students') || ''
  const studentNames = studentsParam ? studentsParam.split(',').map(s => s.trim()).filter(Boolean) : []
  const activeDocs = React.useMemo(() => {
    if (doc === 'bundle') {
      return bundleItemsParam
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s && BUNDLE_DOC_ALLOWLIST.has(s))
    }
    return doc ? [doc] : []
  }, [doc, bundleItemsParam])
  const interactiveDocs = React.useMemo(
    () => activeDocs.filter((id) => id.startsWith('interactive-')),
    [activeDocs]
  )
  const primaryDoc = activeDocs[0] || doc || ''
  const answerableDocs = React.useMemo(
    () => new Set([...ANSWERABLE_BASE_DOC_IDS, ...INTERACTIVE_DOC_IDS]),
    []
  )
  const bundleHasAnswers = doc === 'bundle' && activeDocs.some(id => answerableDocs.has(id))
  const shouldShowAnswerToggle = (activeDocs.length === 1 && answerableDocs.has(primaryDoc)) || bundleHasAnswers
  const docTitle = React.useMemo(() => {
    // If single worksheet, show its title instead of "Bundle"
    if (doc === 'bundle' && activeDocs.length === 1 && activeDocs[0].startsWith('interactive-')) {
      const singleDocId = activeDocs[0]
      // Try to get the worksheet title from INTERACTIVE_CATEGORIES
      for (const category of INTERACTIVE_CATEGORIES) {
        const worksheet = category.docs.find(d => d.id === singleDocId)
        if (worksheet) {
          return `${category.icon} ${worksheet.title}`
        }
      }
    }
    return resolveDocTitle(doc || '', { packTime, bundleCategory: bundleCategoryParam || undefined })
  }, [doc, packTime, bundleCategoryParam, activeDocs])
  const pinHref = React.useMemo(() => {
    try {
      const url = typeof window !== 'undefined' ? window.location.href : 'https://wizqo.com/print'
      const desc = `${docTitle} — free printable for kids`
      return `https://www.pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(desc)}`
    } catch {
      return '#'
    }
  }, [docTitle])

  // Build a daily/variant seed: today if none provided
  const todaySeed = React.useMemo(() => {
    try {
      const d = new Date()
      const y = d.getUTCFullYear()
      const m = String(d.getUTCMonth() + 1).padStart(2, '0')
      const day = String(d.getUTCDate()).padStart(2, '0')
      return `${y}-${m}-${day}`
    } catch {
      return '2025-01-01'
    }
  }, [])

  const effectiveSeed = seedParam || (timestampParam ? `ts:${timestampParam}` : todaySeed)
  const variant = parseInt(variantParam || '1', 10)
  const bundleAnswerSections: Array<{ docId: string; title: string; content: React.ReactNode }> = []
  const showAnswersForDoc = (docId: string, factory: () => React.ReactNode) => {
    if (!showAnswers) return null
    const content = factory()
    if (doc === 'bundle') {
      const title = resolveDocTitle(docId, { packTime, bundleCategory: bundleCategoryParam || undefined })
      let summaryContent = content
      if (React.isValidElement(content)) {
        const existing = content.props.className || ''
        const cleaned = existing.replace(/\bmt-\d+\b/g, '').trim()
        summaryContent = React.cloneElement(content, {
          className: `${cleaned} mb-0`.trim()
        })
      }
      bundleAnswerSections.push({ docId, title, content: summaryContent })
    }
    return content
  }

  const friendlyAge = (v: string) => 
    v === 'k1' ? 'K–1'
    : v === 'k2' ? 'K–2'
    : v === 'g1' ? '1st Grade'
    : v === 'g2' ? '2nd Grade'
    : v === '35' ? '3–5'
    : v === '68' ? '6–8'
    : v
  const friendlyFocus = (v: string) => ({ mixed: 'Mixed', focus: 'Focus', reading: 'Reading', stem: 'STEM', creativity: 'Creativity', math: 'Math' } as any)[v] || v

  // Deterministic tiny RNG for repeatable print packs
  function makeRng(seedStr: string) {
    let seed = 0
    for (let i = 0; i < seedStr.length; i++) seed = (seed + seedStr.charCodeAt(i)) >>> 0
    return function rng() {
      seed = (seed * 1664525 + 1013904223) >>> 0
      return seed / 0xffffffff
    }
  }
  function pick<T>(arr: T[], rng: () => number) { return arr[Math.floor(rng() * arr.length)] }
  function pickNUnique<T>(arr: T[], n: number, rng: () => number): T[] {
    const pool = arr.slice()
    const out: T[] = []
    while (out.length < Math.min(n, pool.length)) {
      const idx = Math.floor(rng() * pool.length)
      out.push(pool.splice(idx, 1)[0])
    }
    return out
  }
  function buildWords(theme: string, age: string): string[] {
    if (theme === 'sight') {
      return age === 'k2'
        ? ['THE','AND','IS','YOU','ARE','IT','IN','TO','WE','GO']
        : age === '35'
          ? ['THIS','THAT','WHEN','YOUR','WHICH','WHERE','THEIR','COULD','WOULD','SHOULD']
          : ['BECAUSE','THROUGH','BEFORE','BETWEEN','AROUND','ANOTHER','ALREADY','THOUGHT','ENOUGH','FAMILY']
    }
    if (theme === 'space') {
      return age === 'k2'
        ? ['MOON','STAR','SKY','SUN','ROCK','DUST','SHIP','RING']
        : age === '35'
          ? ['MARS','COMET','ORBIT','ROVER','VENUS','SATURN','PLUTO','CRATER']
          : ['NEBULA','GALAXY','ROCKET','ASTRO','QUASAR','ECLIPSE','METEOR','COSMOS']
    }
    // animals
    return age === 'k2'
      ? ['CAT','DOG','OWL','PIG','ANT','FOX','BEE','COW','BAT','HEN']
      : age === '35'
        ? ['HORSE','TIGER','EAGLE','WHALE','MOUSE','OTTER','CAMEL','ZEBRA','GORILLA']
        : ['LLAMA','ORCA','PANDA','LYNX','HYENA','JAGUAR','RHINO','DOLPHIN','BUFFALO']
  }
  function buildGridLetters(words: string[], size: number, seedStr: string): string[] {
    const rng = makeRng(seedStr)
    const A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const grid = new Array(size * size).fill('')
    // place words horizontally on successive rows
    let row = 0
    for (const w of words) {
      if (row >= size) break
      const start = Math.max(0, Math.floor((size - Math.min(w.length, size)) * rng()))
      for (let i = 0; i < Math.min(w.length, size); i++) grid[row * size + start + i] = w[i]
      row++
    }
    // fill blanks with random letters
    for (let i = 0; i < grid.length; i++) if (!grid[i]) grid[i] = A[Math.floor(rng() * A.length)]
    return grid
  }

  // Simple Sudoku generator for 4x4 and 6x6 (non-interactive)
  function shuffleArray<T>(arr: T[], rng: () => number): T[] {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1))
      const tmp = arr[i]
      arr[i] = arr[j]
      arr[j] = tmp
    }
    return arr
  }
  function genSudoku(side: number, boxRows: number, boxCols: number, rng: () => number, minClues: number, maxClues: number) {
    const nums = Array.from({ length: side }, (_, i) => i + 1)
    // Base Latin pattern that respects sub-boxes
    const base: number[][] = Array.from({ length: side }, (_, r) =>
      Array.from({ length: side }, (_, c) => {
        const idx = (r * boxCols + Math.floor(r / boxRows) + c) % side
        return nums[idx]
      })
    )
    // Symbol permutation
    const sym = shuffleArray(nums.slice(), rng)
    let board = base.map(row => row.map(v => sym[v - 1]))
    // Row order: shuffle within bands, then shuffle bands
    const rowBands: number[][] = []
    for (let b = 0; b < side; b += boxRows) {
      const group = Array.from({ length: boxRows }, (_, i) => b + i)
      rowBands.push(shuffleArray(group, rng))
    }
    shuffleArray(rowBands, rng)
    const rowOrder = rowBands.flat()
    // Column order: shuffle within stacks, then shuffle stacks
    const colStacks: number[][] = []
    for (let s = 0; s < side; s += boxCols) {
      const group = Array.from({ length: boxCols }, (_, i) => s + i)
      colStacks.push(shuffleArray(group, rng))
    }
    shuffleArray(colStacks, rng)
    const colOrder = colStacks.flat()
    // Apply permutations
    board = rowOrder.map(r => colOrder.map(c => board[r][c]))
    // Remove cells to create puzzle
    const total = side * side
    const clues = Math.max(minClues, Math.min(maxClues, minClues + Math.floor(rng() * (maxClues - minClues + 1))))
    const blanks = Math.max(0, total - clues)
    const indices = shuffleArray(Array.from({ length: total }, (_, i) => i), rng)
    const blankSet = new Set(indices.slice(0, blanks))
    const puzzle = Array.from({ length: side }, (_, r) =>
      Array.from({ length: side }, (_, c) => (blankSet.has(r * side + c) ? null : board[r][c]))
    )
    return { puzzle, solution: board }
  }
  const mathMazeCells = React.useMemo(() => {
    if (!activeDocs.includes('math-maze')) return [] as string[]
    const cells: string[] = []
    const rng = makeRng(`${effectiveSeed}|math-maze|v${variant}`)
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (r === 0 && c === 0) { cells.push('S'); continue }
        if (r === 6 && c === 6) { cells.push('F'); continue }
        const useAddition = rng() < 0.7
        if (useAddition) {
          let a = Math.floor(rng() * 9) + 1
          let b = Math.floor(rng() * 9) + 1
          if (a + b > 18) b = Math.max(1, 18 - a)
          cells.push(`${a}+${b}`)
        } else {
          const big = Math.floor(rng() * 9) + 1
          const small = Math.floor(rng() * (big + 1))
          cells.push(`${big}-${small}`)
        }
      }
    }
    return cells
  }, [activeDocs, effectiveSeed, variant])
  function SafeImg({ sources, alt, className }: { sources: string[]; alt: string; className?: string }) {
    const [idx, setIdx] = React.useState(0)
    const src = sources[idx] || sources[0]
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        referrerPolicy="no-referrer"
        loading="eager"
        decoding="async"
        onError={() => setIdx((i) => Math.min(i + 1, sources.length - 1))}
      />
    )
  }
  // Auto-open browser print dialog when requested (e.g., from "Download PDF" links)
  React.useEffect(() => {
    try {
      if (!autoPrint) return
      // Defer a bit to let the view render fully
      const t = setTimeout(() => { try { window.print() } catch {} }, 1200)
      return () => clearTimeout(t)
    } catch {}
  }, [autoPrint])
  return (
    <div className="min-h-screen bg-white">
      <style>{`
        @media print {
          @page { 
            margin: 0;
            size: A4;
          }
          html, body { 
            margin: 0 !important; 
            padding: 0 !important; 
            font-size: 11pt;
            line-height: 1.3;
          }
          /* Hide URLs in print */
          a[href]::after { content: none !important; }
          a { text-decoration: none !important; }
          /* Remove backgrounds and borders in print for cleaner look - but preserve worksheet content */
          * {
            box-shadow: none !important;
          }
          /* Remove borders from navigation and UI elements, but keep worksheet content borders */
          header, .print\\:hidden, nav, button {
            border: none !important;
            border-radius: 0 !important;
          }
          /* Preserve worksheet section borders and styling for readability */
          section[class*="break-inside-avoid"] {
            border: 1px solid #e2e8f0 !important;
            border-radius: 4px !important;
            background: white !important;
          }
          /* Preserve content borders within worksheets */
          section[class*="break-inside-avoid"] div[class*="border"],
          section[class*="break-inside-avoid"] div[class*="rounded"] {
            border: 1px solid #cbd5e1 !important;
            border-radius: 4px !important;
          }
          /* Remove decorative corner accents in print */
          section[class*="break-inside-avoid"] > div[class*="absolute"] {
            display: none !important;
          }
          /* Customization header at top of page - only appears once */
          .print-customization-header { 
            display: block;
            margin-bottom: 0.5rem;
            padding: 0.25rem 0.5in;
            border-bottom: 1px solid #e2e8f0;
            font-size: 9pt; 
            color: #1e293b; 
            line-height: 1.3; 
            font-weight: 500;
            page-break-after: avoid;
          }
          .print-customization-header strong { font-weight: 600; color: #0f172a; }
          /* Better spacing for print - more compact */
          section { 
            margin-bottom: 0.75rem !important; 
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            padding: 0 0.5in;
          }
          .break-inside-avoid { 
            page-break-inside: avoid !important; 
            break-inside: avoid !important; 
          }
          /* Prevent text merging and improve readability - tighter spacing */
          p { 
            line-height: 1.4 !important; 
            margin: 0.25rem 0 !important;
          }
          div, span { 
            line-height: 1.3 !important; 
          }
          h1, h2, h3 { 
            page-break-after: avoid !important; 
            margin-bottom: 0.25rem !important;
            margin-top: 0.5rem !important;
            line-height: 1.2 !important;
          }
          /* Clean up excessive spacing - reduced */
          .mb-10 { margin-bottom: 0.75rem !important; }
          .mb-4, .mb-6 { margin-bottom: 0.5rem !important; }
          .p-4, .p-5, .p-6 { padding: 0.5rem !important; }
          .py-10 { padding-top: 0.5rem !important; padding-bottom: 0.5rem !important; }
        }
      `}</style>
      {/* Print layout optimized - updated 2025-01-11 */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 print:p-0 print:py-4">
        {/* Customization header (print view - appears once at top) */}
        {(teacherName || className || studentNames.length > 0) && (
          <div className="hidden print:block print-customization-header" aria-hidden>
            <div className="flex flex-wrap gap-x-3 items-center">
              {teacherName && <span><strong>Teacher:</strong> {teacherName}</span>}
              {className && teacherName && <span className="text-slate-400">•</span>}
              {className && <span><strong>Class:</strong> {className}</span>}
              {studentNames.length > 0 && (teacherName || className) && <span className="text-slate-400">•</span>}
              {studentNames.length > 0 && (
                <span><strong>Students:</strong> {studentNames.join(', ')}</span>
              )}
            </div>
          </div>
        )}
        {/* Doc-specific back link is above header; sections appear below header */}
        <div className="mb-4 print:hidden flex justify-end">
          <a
            href={(() => {
              try {
                const u = new URL(typeof window !== 'undefined' ? window.location.href : 'https://wizqo.com/print')
                const from = u.searchParams.get('from')
                // If coming from interactive worksheets generator, go back there
                if (from === 'interactive') {
                  return '/interactive-worksheets-generator'
                }
                // Determine category anchor by doc or bundle selection
                const cat = (() => {
                  if (doc === 'bundle') {
                    if (bundleCategoryParam) return bundleCategoryParam
                    if (primaryDoc) {
                      return getPrintableSectionForDoc(primaryDoc) || (primaryDoc.startsWith('coloring') ? 'Coloring' : primaryDoc.startsWith('geo-') ? 'Geography' : '')
                    }
                    return ''
                  }
                  if (!doc) return ''
                  return getPrintableSectionForDoc(doc) || (doc.startsWith('coloring') ? 'Coloring' : doc.startsWith('geo-') ? 'Geography' : '')
                })()
                const hash = cat ? `#${encodeURIComponent(cat)}` : ''
                return from === 'printables' ? `/printables${hash}` : '/printables'
              } catch {
                return '/printables'
              }
            })()}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm"
            aria-label="Back printable page"
          >
            <span>←</span>
            <span>{(() => {
              try {
                const u = new URL(typeof window !== 'undefined' ? window.location.href : 'https://wizqo.com/print')
                const from = u.searchParams.get('from')
                if (from === 'interactive') {
                  return 'Back to Interactive Worksheets Generator'
                }
                return 'Back printable page'
              } catch {
                return 'Back printable page'
              }
            })()}</span>
          </a>
        </div>
        <header className="relative mb-6 flex items-center justify-between border-b border-slate-200 pb-3 print:hidden">
          <div className="print:hidden absolute -top-3 right-0 flex items-center gap-2 opacity-70 pointer-events-none">
            <span className="animate-bounce">➕</span>
            <span className="animate-bounce animation-delay-2000">🔢</span>
            <span className="animate-bounce animation-delay-4000">🕒</span>
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">{docTitle}</h1>
            <p className="text-slate-600 mt-2 print:mt-1 text-sm">Print these kid‑friendly activities. Use your browser’s Print → Save as PDF to download.</p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={pinHref}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden print:hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 text-sm"
              title="Pin this printable"
              aria-label="Pin this printable on Pinterest"
            >
              <span>📌</span>
              <span>Pin this</span>
            </a>
            
            {shouldShowAnswerToggle && (
              <div className="print:hidden">
                <button
                  onClick={() => setShowAnswers((v) => !v)}
                  aria-pressed={showAnswers}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-1 ${showAnswers ? 'bg-emerald-700 hover:bg-emerald-800 text-white border-emerald-700' : 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600'}`}
                  title="Toggle answer key visibility"
                >
                  {showAnswers ? 'Hide answers' : 'Show answers'}
                </button>
              </div>
            )}
            <div className="print:hidden">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-1 bg-purple-600 hover:bg-purple-700 text-white border-purple-600"
                title="Download as PDF"
                aria-label="Download as PDF"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download PDF
              </button>
            </div>
            <div className="print:block">
              <WizqoLogo className="w-20 h-auto opacity-80" />
            </div>
          </div>
        </header>

        {/* Doc-specific sections (unique content per topic) */}
        {interactiveDocs.length > 0 && (
          <InteractiveBundleSections
            docIds={interactiveDocs}
            seed={effectiveSeed}
            variant={variant}
            showAnswers={showAnswers}
            teacherName={teacherName}
            className={className}
            studentNames={studentNames}
          />
        )}
        {activeDocs.includes('geo-continents-k2') && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">🌍 Label the 7 Continents (K–2)</h2>
            <p className="text-slate-600 text-sm mb-3">Beginner‑friendly world outline. Write each continent’s name on the lines below. Optional: color each continent a different color.</p>
            <div className="border border-slate-300 rounded p-4 bg-white">
              <svg viewBox="0 0 800 500" className="w-full h-auto" role="img" aria-labelledby="continents-title">
                <title id="continents-title">World map outline with 7 continents</title>
                <g fill="none" stroke="#111827" strokeWidth="4">
                  <rect x="40" y="40" width="720" height="420" rx="8" />
                  {/* Simplified continent shapes (kid-friendly) */}
                  {/* North America */}
                  <ellipse cx="180" cy="160" rx="70" ry="45" />
                  {/* South America */}
                  <ellipse cx="280" cy="285" rx="45" ry="60" />
                  {/* Europe */}
                  <ellipse cx="370" cy="170" rx="28" ry="18" />
                  {/* Africa */}
                  <ellipse cx="430" cy="305" rx="55" ry="70" />
                  {/* Asia */}
                  <ellipse cx="540" cy="205" rx="95" ry="60" />
                  {/* Australia */}
                  <ellipse cx="620" cy="320" rx="35" ry="25" />
                  {/* Antarctica */}
                  <rect x="160" y="430" width="480" height="18" rx="8" />
                </g>
                {/* Numbered markers for each continent */}
                <g fill="#111827" fontSize="14" textAnchor="middle">
                  {/* 1: North America */}
                  <circle cx="180" cy="160" r="14" fill="white" stroke="#111827" strokeWidth="2" />
                  <text x="180" y="165">1</text>
                  {/* 2: South America */}
                  <circle cx="280" cy="285" r="14" fill="white" stroke="#111827" strokeWidth="2" />
                  <text x="280" y="290">2</text>
                  {/* 3: Europe */}
                  <circle cx="370" cy="170" r="12" fill="white" stroke="#111827" strokeWidth="2" />
                  <text x="370" y="175">3</text>
                  {/* 4: Africa */}
                  <circle cx="430" cy="305" r="14" fill="white" stroke="#111827" strokeWidth="2" />
                  <text x="430" y="310">4</text>
                  {/* 5: Asia */}
                  <circle cx="540" cy="205" r="14" fill="white" stroke="#111827" strokeWidth="2" />
                  <text x="540" y="210">5</text>
                  {/* 6: Australia */}
                  <circle cx="620" cy="320" r="12" fill="white" stroke="#111827" strokeWidth="2" />
                  <text x="620" y="325">6</text>
                  {/* 7: Antarctica */}
                  <circle cx="400" cy="440" r="14" fill="white" stroke="#111827" strokeWidth="2" />
                  <text x="400" y="445">7</text>
                </g>
              </svg>
            </div>
            {/* Word bank + write lines */}
            <div className="mt-3 grid md:grid-cols-2 gap-3">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                <div className="text-slate-900 font-semibold mb-1">Word Bank</div>
                <ul className="text-slate-700 text-sm grid grid-cols-2 gap-x-4 gap-y-1">
                  <li>North America</li>
                  <li>South America</li>
                  <li>Europe</li>
                  <li>Africa</li>
                  <li>Asia</li>
                  <li>Australia</li>
                  <li>Antarctica</li>
                </ul>
              </div>
              <div className="border border-slate-200 rounded-lg p-3">
                <div className="text-slate-900 font-semibold mb-1">Write the Names</div>
                <ol className="text-slate-700 text-sm space-y-1">
                  {Array.from({ length: 7 }).map((_,i)=> (
                    <li key={i} className="flex items-center gap-2"><span className="font-semibold">{i+1}.</span> <span className="flex-1 border-b border-slate-300 inline-block" style={{ minWidth: '10rem' }} /></li>
                  ))}
                </ol>
              </div>
            </div>
          </section>
        )}

        {activeDocs.includes('geo-compass-rose') && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">🧭 Compass Rose & Directions</h2>
            <p className="text-slate-600 text-sm mb-3">Color the compass and label cardinal (N, E, S, W) and intercardinal (NE, SE, SW, NW) directions.</p>
            <div className="border border-slate-300 rounded p-4 bg-white">
              <svg viewBox="0 0 600 600" className="w-full h-auto" role="img" aria-labelledby="compass-title">
                <title id="compass-title">Compass rose</title>
                <g fill="none" stroke="#111827" strokeWidth="4">
                  <circle cx="300" cy="300" r="180" />
                  <line x1="300" y1="100" x2="300" y2="500" />
                  <line x1="100" y1="300" x2="500" y2="300" />
                  <path d="M300 120 L330 300 L300 480 L270 300 Z" />
                  <path d="M120 300 L300 330 L480 300 L300 270 Z" />
                </g>
                <g fill="#111827" fontSize="20" textAnchor="middle">
                  <text x="300" y="80">N</text>
                  <text x="520" y="305">E</text>
                  <text x="300" y="540">S</text>
                  <text x="80" y="305">W</text>
                  <text x="410" y="170">NE</text>
                  <text x="410" y="430">SE</text>
                  <text x="190" y="430">SW</text>
                  <text x="190" y="170">NW</text>
                </g>
              </svg>
            </div>
          </section>
        )}

        {activeDocs.includes('geo-landforms') && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">🏔️ Landforms vs Water Bodies</h2>
            <p className="text-slate-600 text-sm mb-3">Draw a line from each word to its matching picture. (A–E)</p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  label: 'Mountain',
                  svg: (
                    <g>
                      {/* twin peaks */}
                      <path d="M40 160 L90 75 L140 160 Z" />
                      <path d="M95 160 L135 95 L200 160 Z" />
                      {/* ridge/snow lines */}
                      <path d="M80 120 L90 105 L100 120" />
                      <path d="M140 120 L150 108 L160 120" />
                    </g>
                  )
                },
                {
                  label: 'Valley',
                  svg: (
                    <g>
                      {/* two mountains with a V valley */}
                      <path d="M30 160 L80 95 L110 160 Z" />
                      <path d="M130 160 L170 95 L210 160 Z" />
                      {/* valley floor curve */}
                      <path d="M30 160 Q120 145 210 160" />
                    </g>
                  )
                },
                {
                  label: 'Island',
                  svg: (
                    <g>
                      {/* shoreline */}
                      <path d="M80 145 C110 110, 170 110, 200 145 C175 165, 115 165, 80 145 Z" />
                      {/* tiny palm tree */}
                      <path d="M150 140 C145 125, 146 115, 148 105" />
                      <path d="M148 105 C142 100, 135 100, 130 105" />
                      <path d="M148 105 C154 100, 162 100, 168 105" />
                    </g>
                  )
                },
                {
                  label: 'Lake',
                  svg: (
                    <g>
                      {/* irregular lake outline */}
                      <path d="M80 130 C100 110, 140 100, 180 120 C200 135, 170 160, 130 160 C110 158, 90 150, 80 130 Z" />
                      {/* gentle waves */}
                      <path d="M100 135 C110 140, 120 140, 130 135" />
                      <path d="M120 145 C130 150, 140 150, 150 145" />
                    </g>
                  )
                },
                {
                  label: 'River',
                  svg: (
                    <g>
                      {/* meandering river with banks */}
                      <path d="M40 65 C80 85, 110 55, 150 75 C190 95, 150 120, 190 140" />
                      <path d="M30 75 C70 95, 100 65, 140 85 C180 105, 140 130, 180 150" />
                    </g>
                  )
                },
              ].map((it, idx) => {
                const letter = String.fromCharCode(65 + idx); // A, B, C, ...
                return (
                  <div key={it.label} className="relative border border-slate-300 rounded p-4 bg-white">
                    <div className="absolute top-2 left-2 w-6 h-6 rounded-full border border-slate-600 text-slate-800 flex items-center justify-center text-xs font-bold bg-white">
                      {letter}
                    </div>
                    <svg viewBox="0 0 240 180" className="w-full h-auto" aria-hidden>
                      <g fill="none" stroke="#111827" strokeWidth="4">{it.svg}</g>
                    </svg>
                  </div>
                );
              })}
            </div>
            {/* Match list */}
            <div className="mt-3 grid md:grid-cols-2 gap-3">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                <div className="text-slate-900 font-semibold mb-1">Words</div>
                <ol className="text-slate-700 text-sm space-y-1">
                  {['Mountain','Valley','Island','Lake','River'].map((w,i)=> (
                    <li key={w} className="flex items-center gap-2">
                      <span className="inline-block w-5 text-slate-500">{i+1}.</span>
                      <span className="flex-1">{w}</span>
                      <span className="inline-block w-10 text-slate-400 border-b border-slate-300" />
                    </li>
                  ))}
                </ol>
              </div>
              <div className="text-slate-500 text-xs border border-slate-200 rounded-lg p-3">
                Tip: Landforms are parts of the land (mountain, valley, island). Water bodies hold or carry water (lake, river).
              </div>
            </div>
          </section>
        )}

        {activeDocs.includes('geo-latlong') && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">🗺️ Latitude & Longitude Basics</h2>
            <p className="text-slate-600 text-sm mb-3">Read grid lines and plot simple coordinates. Practice with a minimal world grid. Tip: Latitude is horizontal (N/S). Longitude is vertical (E/W).</p>
            <div className="border border-slate-300 rounded p-4 bg-white">
              <svg viewBox="0 0 800 500" className="w-full h-auto" role="img" aria-labelledby="latlong-title">
                <title id="latlong-title">Latitude and longitude grid</title>
                <g fill="none" stroke="#94a3b8" strokeWidth="2">
                  {Array.from({ length: 10 }).map((_,i)=> (<line key={`h-${i}`} x1="40" y1={50+i*40} x2="760" y2={50+i*40} />))}
                  {Array.from({ length: 16 }).map((_,i)=> (<line key={`v-${i}`} x1={40+i*45} y1="50" x2={40+i*45} y2="450" />))}
                </g>
                {/* Axes labels */}
                <g fill="#111827" fontSize="12">
                  {/* Equator and Prime Meridian labels */}
                  <text x="380" y="46">Equator (0°)</text>
                  <text x="36" y="260" transform="rotate(-90 36,260)">Prime Meridian (0°)</text>
                  {/* Latitude tick labels */}
                  {([-60,-30,0,30,60] as number[]).map((lat) => {
                    const y = 50 + ((90 - lat) / 180) * 400; // map -90..90 to 50..450
                    const label = lat === 0 ? '0°' : (Math.abs(lat) + '°' + (lat > 0 ? 'N' : 'S'));
                    return (<text key={`lat-${lat}`} x={30} y={y+4} textAnchor="end">{label}</text>);
                  })}
                  {/* Longitude tick labels */}
                  {([-120,-90,-60,-30,0,30,60,90,120] as number[]).map((lon) => {
                    const x = 40 + ((lon + 120) / 240) * 720; // map -120..120 to 40..760
                    const label = lon === 0 ? '0°' : (Math.abs(lon) + '°' + (lon > 0 ? 'E' : 'W'));
                    return (<text key={`lon-${lon}`} x={x} y={468} textAnchor="middle">{label}</text>);
                  })}
                </g>
                <g fill="none" stroke="#111827" strokeWidth="3.5">
                  <circle cx="260" cy="170" r="18" />
                  <rect x="520" y="300" width="24" height="24" />
                </g>
                <g fill="#111827" fontSize="14">
                  <text x="250" y="160">A (15°N, 80°W)</text>
                  <text x="515" y="295">B (20°S, 40°E)</text>
                </g>
              </svg>
            </div>
            {/* Practice coordinates */}
            <div className="mt-3 grid md:grid-cols-2 gap-3">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                <div className="text-slate-900 font-semibold mb-1">Try plotting:</div>
                <ul className="text-slate-700 text-sm list-disc list-inside">
                  <li>C (0°, 120°E)</li>
                  <li>D (45°N, 60°W)</li>
                </ul>
              </div>
              <div className="text-slate-500 text-xs border border-slate-200 rounded-lg p-3">
                Tip: Latitude (−90° to 90°) increases northward. Longitude (−180° to 180°) increases eastward. On this grid, we show from 120°W to 120°E.
              </div>
            </div>
          </section>
        )}
        {activeDocs.includes('number-tracing-1-10') && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">🔢 Trace Numbers 1–10</h2>
            <p className="text-slate-600 text-sm mb-3">Start‑point arrows included. Say each number while tracing; then color one object for each number.</p>
            <div className="grid grid-cols-2 gap-4">
              {[1,2,3,4,5,6,7,8,9,10].map((n) => (
                <svg key={n} viewBox="0 0 400 200" className="w-full h-auto bg-white border border-slate-300 rounded">
                  <g fill="none" stroke="#94a3b8" strokeWidth="3">
                    <path strokeDasharray="6 6" d={`M40 160 H360`} />
                  </g>
                  <g fill="none" stroke="#111827" strokeWidth="5" strokeLinecap="round">
                    {n===1 && <path d="M120 150 L120 60" />}
                    {n===2 && <path d="M90 90 Q120 60, 150 90 Q180 120, 90 150 H180" />}
                    {n===3 && <path d="M105 85 C135 65,170 85,150 100 C170 115,135 135,105 115" />}
                    {n===4 && (
                      <g>
                        <path d="M160 60 L100 110 H170" />
                        <path d="M160 60 V150" />
                      </g>
                    )}
                    {n===5 && <path d="M170 70 H100 V110 Q130 90, 160 110 Q170 140, 120 150" />}
                    {n===6 && <path d="M160 80 Q100 80, 110 120 Q140 160, 170 130 Q150 110, 120 120" />}
                    {n===7 && <path d="M90 70 H170 L110 150" />}
                    {n===8 && (
                      <g>
                        <circle cx="120" cy="95" r="26" fill="none" />
                        <circle cx="120" cy="135" r="26" fill="none" />
                      </g>
                    )}
                    {n===9 && (
                      <g>
                        <circle cx="135" cy="100" r="28" fill="none" />
                        <path d="M162 120 Q150 150, 120 150" />
                      </g>
                    )}
                    {n===10 && (
                      <g>
                        <path d="M90 150 L90 80" />
                        <circle cx="140" cy="115" r="30" fill="none" />
                      </g>
                    )}
                  </g>
                  <circle cx="48" cy="54" r="4" fill="#ef4444" />
                  <line x1="48" y1="54" x2="70" y2="54" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="70" y1="54" x2="64" y2="49" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="70" y1="54" x2="64" y2="59" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
                  <circle cx="80" cy="70" r="6" fill="#ef4444" />
                  <text x="300" y="60" fontSize="28" fill="#111827">{n}</text>
                </svg>
              ))}
            </div>
          </section>
        )}

        {activeDocs.includes('number-tracing-1-20') && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">🔢 Trace Numbers 1–20</h2>
            <p className="text-slate-600 text-sm mb-3">Start‑point arrows included. Say each number while tracing; then color one object for each number.</p>
            <div className="grid grid-cols-2 gap-4">
              {[...Array(20).keys()].map((i) => {
                const n = i + 1;
                return (
                  <svg key={n} viewBox="0 0 400 200" className="w-full h-auto bg-white border border-slate-300 rounded">
                    <g fill="none" stroke="#94a3b8" strokeWidth="3">
                      <path strokeDasharray="6 6" d={`M40 160 H360`} />
                    </g>
                    <g fill="none" stroke="#111827" strokeWidth="5" strokeLinecap="round">
                      {n===1 && <path d="M120 150 L120 60" />}
                      {n===2 && <path d="M90 90 Q120 60, 150 90 Q180 120, 90 150 H180" />}
                      {n===3 && <path d="M105 85 C135 65,170 85,150 100 C170 115,135 135,105 115" />}
                      {n===4 && (
                        <g>
                          <path d="M160 60 L100 110 H170" />
                          <path d="M160 60 V150" />
                        </g>
                      )}
                      {n===5 && <path d="M170 70 H100 V110 Q130 90, 160 110 Q170 140, 120 150" />}
                      {n===6 && <path d="M160 80 Q100 80, 110 120 Q140 160, 170 130 Q150 110, 120 120" />}
                      {n===7 && <path d="M90 70 H170 L110 150" />}
                      {n===8 && (
                        <g>
                          <circle cx="120" cy="95" r="26" fill="none" />
                          <circle cx="120" cy="135" r="26" fill="none" />
                        </g>
                      )}
                      {n===9 && (
                        <g>
                          <circle cx="135" cy="100" r="28" fill="none" />
                          <path d="M162 120 Q150 150, 120 150" />
                        </g>
                      )}
                      {n===10 && (
                        <g>
                          <path d="M90 150 L90 80" />
                          <circle cx="140" cy="115" r="30" fill="none" />
                        </g>
                      )}
                    </g>
                      <circle cx="48" cy="54" r="4" fill="#ef4444" />
                      <line x1="48" y1="54" x2="70" y2="54" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
                      <line x1="70" y1="54" x2="64" y2="49" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
                      <line x1="70" y1="54" x2="64" y2="59" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
                    <circle cx="80" cy="70" r="6" fill="#ef4444" />
                    <text x="300" y="60" fontSize="28" fill="#111827">{n}</text>
                  </svg>
                );
              })}
            </div>
          </section>
        )}

        {activeDocs.includes('uppercase-lowercase-match') && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">Aa–Zz Upper/Lower Letter Match</h2>
            <p className="text-slate-600 text-sm mb-3">Draw lines from uppercase to lowercase. Say the sound for each match.</p>
            <div className="grid grid-cols-2 gap-4">
              {[['A','a'],['B','b'],['C','c'],['D','d'],['E','e'],['F','f'],['G','g'],['H','h'],['I','i'],['J','j'],['K','k'],['L','l'],['M','m']].map(([U,l]) => (
                <svg key={U} viewBox="0 0 400 120" className="w-full h-auto bg-white border border-slate-300 rounded">
                  <circle cx="48" cy="40" r="4" fill="#ef4444" />
                  <line x1="48" y1="40" x2="70" y2="40" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="70" y1="40" x2="64" y2="35" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="70" y1="40" x2="64" y2="45" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
                  <text x="60" y="70" fontSize="48" fill="#111827">{U}</text>
                  <circle cx="80" cy="90" r="6" fill="#94a3b8" />
                  <text x="300" y="70" fontSize="48" fill="#111827">{l}</text>
                  <circle cx="330" cy="40" r="4" fill="#ef4444" />
                  <line x1="330" y1="40" x2="308" y2="40" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="308" y1="40" x2="314" y2="35" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="308" y1="40" x2="314" y2="45" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
                  <circle cx="320" cy="90" r="6" fill="#94a3b8" />
                </svg>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[['N','n'],['O','o'],['P','p'],['Q','q'],['R','r'],['S','s'],['T','t'],['U','u'],['V','v'],['W','w'],['X','x'],['Y','y'],['Z','z']].map(([U,l]) => (
                <svg key={U} viewBox="0 0 400 120" className="w-full h-auto bg-white border border-slate-300 rounded">
                  <circle cx="48" cy="40" r="4" fill="#ef4444" />
                  <line x1="48" y1="40" x2="70" y2="40" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="70" y1="40" x2="64" y2="35" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="70" y1="40" x2="64" y2="45" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
                  <text x="60" y="70" fontSize="48" fill="#111827">{U}</text>
                  <circle cx="80" cy="90" r="6" fill="#94a3b8" />
                  <text x="300" y="70" fontSize="48" fill="#111827">{l}</text>
                  <circle cx="330" cy="40" r="4" fill="#ef4444" />
                  <line x1="330" y1="40" x2="308" y2="40" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="308" y1="40" x2="314" y2="35" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="308" y1="40" x2="314" y2="45" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
                  <circle cx="320" cy="90" r="6" fill="#94a3b8" />
                </svg>
              ))}
            </div>
          </section>
        )}

        {activeDocs.includes('beginning-sounds-az') && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">Beginning Sounds (A–Z)</h2>
            <p className="text-slate-600 text-sm mb-3">Circle pictures that begin with each letter. Say the sound out loud (e.g., A as in apple).</p>
            <div className="grid grid-cols-2 gap-4">
              {(() => {
                const rows: Array<[string,string,string,string]> = [
                  ['A','🍎','✈️','🦋'],
                  ['B','🐝','🚲','🍌'],
                  ['C','🐱','🚗','☕'],
                  ['D','🐶','🦆','🍩'],
                  ['E','🥚','🦅','👂'],
                  ['F','🐟','🦊','🏁'],
                  ['G','🦒','👓','🦎'],
                  ['H','🏠','🐹','🥅'],
                  ['I','🍦','🏝️','🧊'],
                  ['J','🤹','🧃','🕹️'],
                  ['K','🔑','🌋','🪁'],
                  ['L','🦁','🍋','🌿'],
                  ['M','🐭','🌙','🍄'],
                  ['N','🥜','巛','📓'],
                  ['O','🐙','🧅','🍊'],
                  ['P','🐼','🥧','🖊️'],
                  ['Q','👸','🧶','🧭'],
                  ['R','🐰','🚀','🌧️'],
                  ['S','🐍','⭐','🌞'],
                  ['T','🐯','🌮','🌳'],
                  ['U','☂️','🦄','⛽'],
                  ['V','🎻','🚐','🌋'],
                  ['W','🐳','🍉','🚶'],
                  ['X','🪓','📦','🧪'],
                  ['Y','🛶','🪀','🍠'],
                  ['Z','🦓','⚡','👟'],
                ]
                return rows.map(([L,a,b,c]) => (
                  <svg key={L} viewBox="0 0 400 160" className="w-full h-auto bg-white border border-slate-300 rounded">
                    <text x="40" y="60" fontSize="40" fill="#111827">{L}</text>
                    <text x="140" y="60" fontSize="36">{a}</text>
                    <text x="200" y="60" fontSize="36">{b}</text>
                    <text x="260" y="60" fontSize="36">{c}</text>
                    <rect x="130" y="80" width="40" height="40" fill="none" stroke="#94a3b8" />
                    <rect x="190" y="80" width="40" height="40" fill="none" stroke="#94a3b8" />
                    <rect x="250" y="80" width="40" height="40" fill="none" stroke="#94a3b8" />
                  </svg>
                ))
              })()}
            </div>
          </section>
        )}

        {activeDocs.includes('addition-subtraction-0-10') && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">Addition & Subtraction 0–10</h2>
            <p className="text-slate-600 text-sm mb-3">Use the number line if needed. Write the answer in the box.</p>
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 12 }).map((_,i)=> (
                <svg key={i} viewBox="0 0 400 160" className="w-full h-auto bg-white border border-slate-300 rounded">
                  <g fill="none" stroke="#94a3b8" strokeWidth="3">
                    <path d="M60 120 H340" />
                    {Array.from({ length: 11 }).map((__,k)=> (
                      <line key={k} x1={60 + k*28} y1={120} x2={60 + k*28} y2={110} />
                    ))}
                  </g>
                  <text x="60" y="60" fontSize="32" fill="#111827">__ {i%2===0?'+':'-'} __ = ____</text>
                </svg>
              ))}
            </div>
          </section>
        )}

        {activeDocs.includes('ten-frames-1-10') && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">Ten Frames 1–10</h2>
            <p className="text-slate-600 text-sm mb-3">Color the circles to match each number. Say how many are filled and how many are empty.</p>
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 10 }).map((_,n)=> (
                <svg key={n} viewBox="0 0 400 160" className="w-full h-auto bg-white border border-slate-300 rounded">
                  <text x="40" y="50" fontSize="36" fill="#111827">{n+1}</text>
                  <g transform="translate(120,60)">
                    {Array.from({ length: 10 }).map((__,i)=> (
                      <rect key={i} x={(i%5)*40} y={Math.floor(i/5)*40} width="36" height="36" fill="none" stroke="#111827" />
                    ))}
                  </g>
                </svg>
              ))}
            </div>
          </section>
        )}

        {activeDocs.includes('place-value-hto') && (() => {
          const nums = [12, 27, 45, 63, 84, 99, 30, 51];
          const isColor = true; // default colorful visuals
          return (
            <section className="relative overflow-hidden mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
              <div className="absolute inset-0 -z-10 print:hidden">
                <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full ${isColor ? 'bg-purple-200/40' : 'bg-slate-200/20'} animate-blob`} />
                <div className={`absolute -bottom-12 -left-8 w-28 h-28 rounded-full ${isColor ? 'bg-amber-200/40' : 'bg-slate-200/20'} animate-blob animation-delay-2000`} />
                <div className={`absolute top-1/2 -left-6 w-24 h-24 rounded-full ${isColor ? 'bg-sky-200/40' : 'bg-slate-200/20'} animate-blob animation-delay-4000`} />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Place Value – Tens and Ones (to 99)
                <span className="ml-2 print:hidden inline-block animate-bounce">🔢</span>
              </h2>
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-violet-400 to-pink-400 animate-gradient-x mb-2" />
              {/* Visual legend */}
              <div className="print:hidden mb-3 flex items-center gap-4 text-sm">
                <svg viewBox="0 0 160 40" className="h-10 w-auto">
                  {/* Tens rod */}
                  <rect x="10" y="6" width="12" height="28" fill={isColor ? '#22c55e' : 'none'} stroke="#111827" strokeWidth="2" />
                  <text x="30" y="24" fontSize="12" fill="#111827">Tens rod</text>
                  {/* Ones cubes */}
                  {Array.from({length:3}).map((_,i)=> (
                    <rect key={i} x={86 + i*14} y={12} width="10" height="10" fill={isColor ? '#60a5fa' : 'none'} stroke="#111827" strokeWidth="2" />
                  ))}
                  <text x="130" y="24" fontSize="12" fill="#111827">Ones</text>
                </svg>
              </div>
              <p className="text-slate-600 text-sm mb-3">Write how many tens and ones. Then write the number in expanded form.</p>
              <div className="grid grid-cols-2 gap-3">
                {nums.map((n,i)=> (
                  <div key={i} className="border border-slate-300 rounded-lg p-3 bg-white">
                    <div className="text-slate-800 font-semibold mb-2">Number: {n}</div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className="border border-slate-300 rounded p-2">Tens: ______</div>
                      <div className="border border-slate-300 rounded p-2">Ones: ______</div>
                      <div className="border border-slate-300 rounded p-2">Expanded: ______ + ______</div>
                    </div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('place-value-hto', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {nums.map((n,i)=> {
                      const tens = Math.floor(n/10); const ones = n%10;
                      return (
                        <li key={i}>{n}: Tens {tens}, Ones {ones}, Expanded {tens*10} + {ones}</li>
                      )
                    })}
                  </ul>
                </div>
              ))}
            </section>
          );
        })()}

        {activeDocs.includes('skip-count-5-10-120') && (() => {
          const seq5 = Array.from({ length: 24 }, (_, i) => (i + 1) * 5); // 5..120
          const seq10 = Array.from({ length: 12 }, (_, i) => (i + 1) * 10); // 10..120
          const isBlank5 = (i: number) => i % 3 === 1; // blank some boxes for practice
          const isBlank10 = (i: number) => i % 3 === 2;
          return (
            <section className="relative overflow-hidden mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
              <div className="absolute inset-0 -z-10 print:hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-fuchsia-200/40 animate-blob" />
                <div className="absolute -bottom-14 -left-10 w-36 h-36 rounded-full bg-amber-200/40 animate-blob animation-delay-2000" />
                <div className="absolute top-1/2 right-8 w-24 h-24 rounded-full bg-rose-200/40 animate-blob animation-delay-4000" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Skip Counting by 5s and 10s (to 120)
                <span className="ml-2 print:hidden inline-block animate-bounce">🔁</span>
              </h2>
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-fuchsia-400 to-amber-400 animate-gradient-x mb-2" />
              <p className="text-slate-600 text-sm mb-3">Fill in the missing numbers.</p>
              <div className="space-y-6 text-sm">
                <div>
                  <div className="font-semibold text-slate-800 mb-2">Count by 5s to 120</div>
                  <div className="grid grid-cols-12 gap-1">
                    {seq5.map((n, i) => (
                      <div key={i} className="h-12 border border-slate-300 rounded flex items-center justify-center bg-white">
                        {isBlank5(i) ? <span className="inline-block w-14 border-b-2 border-slate-400" /> : <span className="font-mono text-base text-slate-900">{n}</span>}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="font-semibold text-slate-800 mb-2">Count by 10s to 120</div>
                  <div className="grid grid-cols-12 gap-1">
                    {seq10.map((n, i) => (
                      <div key={i} className="h-12 border border-slate-300 rounded flex items-center justify-center bg-white">
                        {isBlank10(i) ? <span className="inline-block w-14 border-b-2 border-slate-400" /> : <span className="font-mono text-base text-slate-900">{n}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {showAnswersForDoc('skip-count-5-10-120', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <div className="text-sm">Filled numbers are the printed ones; blanks indicate where students should write. Series: by 5s to 120 and by 10s to 120.</div>
                </div>
              ))}
            </section>
          );
        })()}

        {activeDocs.includes('add-2digit-100') && (() => {
          // Stable seeded RNG so toggling answers doesn't change content
          const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`);
          function nextInt(min: number, max: number) {
            return Math.floor(rng() * (max - min + 1)) + min;
          }
          function genPairs(count: number) {
            const out: Array<[number, number]> = [];
            let guard = 0;
            while (out.length < count && guard < 10000) {
              const a = nextInt(10, 99);
              const b = nextInt(10, 99);
              if ((a%10) + (b%10) < 10 && a + b <= 100) out.push([a,b]);
              guard++;
            }
            return out;
          }
          const pairs = genPairs(10);
          return (
            <section className="relative overflow-hidden mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
              <div className="absolute inset-0 -z-10 print:hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-emerald-200/40 animate-blob" />
                <div className="absolute -bottom-12 -left-8 w-28 h-28 rounded-full bg-lime-200/40 animate-blob animation-delay-2000" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full bg-sky-200/40 animate-blob animation-delay-4000" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">2‑Digit Addition (No Regrouping)
                <span className="ml-2 print:hidden inline-block animate-bounce">➕</span>
              </h2>
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-emerald-400 to-sky-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-2 gap-3">
                {pairs.map(([a,b],i)=> (
                  <div key={i} className="border border-slate-300 rounded p-3 bg-white w-full">
                    <div className="font-mono text-2xl leading-7 text-right">
                      <div>{a}</div>
                      <div>+ {b}</div>
                      <div className="border-t border-slate-400 mt-1 pt-1">____</div>
                    </div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('add-2digit-100', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {pairs.map(([a,b],i)=> (<li key={i}>{a} + {b} = {a+b}</li>))}
                  </ul>
                </div>
              ))}
            </section>
          );
        })()}

        {activeDocs.includes('sub-2digit-100') && (() => {
          const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`);
          function nextInt(min: number, max: number) {
            return Math.floor(rng() * (max - min + 1)) + min;
          }
          function genPairs(count: number) {
            const out: Array<[number, number]> = [];
            let guard = 0;
            while (out.length < count && guard < 10000) {
              const a = nextInt(10, 99);
              const b = nextInt(10, 99);
              if ((a%10) >= (b%10) && a >= b) out.push([a,b]);
              guard++;
            }
            return out;
          }
          const pairs = genPairs(10);
          return (
            <section className="relative overflow-hidden mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
              <div className="absolute inset-0 -z-10 print:hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-pink-200/40 animate-blob" />
                <div className="absolute -bottom-12 -left-8 w-28 h-28 rounded-full bg-rose-200/40 animate-blob animation-delay-2000" />
                <div className="absolute top-1/2 right-8 w-20 h-20 rounded-full bg-fuchsia-200/40 animate-blob animation-delay-4000" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">2‑Digit Subtraction (No Regrouping)
                <span className="ml-2 print:hidden inline-block animate-bounce">➖</span>
              </h2>
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-rose-400 to-fuchsia-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-2 gap-3">
                {pairs.map(([a,b],i)=> (
                  <div key={i} className="border border-slate-300 rounded p-3 bg-white w-full">
                    <div className="font-mono text-2xl leading-7 text-right">
                      <div>{a}</div>
                      <div>− {b}</div>
                      <div className="border-t border-slate-400 mt-1 pt-1">____</div>
                    </div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('sub-2digit-100', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {pairs.map(([a,b],i)=> (<li key={i}>{a} − {b} = {a-b}</li>))}
                  </ul>
                </div>
              ))}
            </section>
          );
        })()}

        {activeDocs.includes('word-problems-100') && (
          <section className="relative overflow-hidden mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <div className="absolute inset-0 -z-10 print:hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-yellow-200/40 animate-blob" />
              <div className="absolute -bottom-12 -left-8 w-28 h-28 rounded-full bg-amber-200/40 animate-blob animation-delay-2000" />
              <div className="absolute top-1/2 left-8 w-20 h-20 rounded-full bg-lime-200/40 animate-blob animation-delay-4000" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">2nd‑Grade Word Problems (within 100)
              <span className="ml-2 print:hidden inline-block animate-bounce">🧮</span>
            </h2>
            <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-amber-400 to-lime-400 animate-gradient-x mb-2" />
            <ol className="list-decimal list-inside space-y-2 text-sm text-slate-800">
              {[
                'Mia has 24 marbles. She gets 15 more. How many now?',
                'A class has 32 books on one shelf and 17 on another. How many in all?',
                'Liam had 45 stickers. He gave 20 to a friend. How many left?',
                'A box has 38 pencils. 10 were used. How many remain?',
                'Sara read 27 pages on Monday and 22 on Tuesday. How many pages total?'
              ].map((q,i)=> (
                <li key={i}>
                  {q}
                  <div className="h-6 border-b border-slate-400 mt-1" />
                </li>
              ))}
            </ol>
            {showAnswersForDoc('word-problems-100', () => (
              <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                <div className="font-semibold mb-1">Answer key</div>
                <ol className="list-decimal list-inside space-y-0.5">
                  <li>24 + 15 = 39</li>
                  <li>32 + 17 = 49</li>
                  <li>45 − 20 = 25</li>
                  <li>38 − 10 = 28</li>
                  <li>27 + 22 = 49</li>
                </ol>
              </div>
            ))}
          </section>
        )}

        {activeDocs.includes('compare-2digit') && (() => {
          const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`);
          function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }
          const pairs: Array<[number, number]> = Array.from({length:10}).map(()=> {
            const a = nextInt(10,99); const b = nextInt(10,99); return [a,b];
          });
          return (
            <section className="relative overflow-hidden mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
              <div className="absolute inset-0 -z-10 print:hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-sky-200/40 animate-blob" />
                <div className="absolute -bottom-12 -left-8 w-28 h-28 rounded-full bg-indigo-200/40 animate-blob animation-delay-2000" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full bg-purple-200/40 animate-blob animation-delay-4000" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Compare 2‑Digit Numbers
                <span className="ml-2 print:hidden inline-block animate-bounce">⚖️</span>
              </h2>
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-indigo-400 to-sky-400 animate-gradient-x mb-2" />
              <p className="text-slate-600 text-sm mb-3">Write one symbol in each box: <span className="font-mono">&gt;</span>, <span className="font-mono">&lt;</span>, or <span className="font-mono">=</span>. Tip: Compare tens first. If tens are equal, compare ones.</p>
              <div className="mb-3 text-sm text-slate-700">
                <div className="inline-flex items-center gap-3 border border-slate-200 rounded-lg px-3 py-2 bg-white">
                  <span className="font-mono">58</span>
                  <span className="font-mono">&gt;</span>
                  <span className="font-mono">41</span>
                  <span className="text-slate-500">(5 tens vs 4 tens → 58 is greater)</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xl font-mono">
                {pairs.map(([a,b],i)=> (
                  <div key={i} className="border border-slate-300 rounded p-3 bg-white w-full flex items-center justify-between">
                    <span>{a}</span>
                    <span className="mx-2 inline-block w-12 border-b-2 border-slate-400" aria-label="comparison symbol box" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('compare-2digit', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key (sample logic)</div>
                  <div className="text-sm">Compare tens first; if equal, compare ones. Example: 58 &gt; 41 because 5 tens &gt; 4 tens.</div>
                </div>
              ))}
            </section>
          );
        })()}

        {activeDocs.includes('even-odd-100') && (() => {
          const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`);
          const nums = Array.from({length:20}).map(()=> Math.floor(rng()*100));
          return (
            <section className="relative overflow-hidden mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
              <div className="absolute inset-0 -z-10 print:hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-violet-200/40 animate-blob" />
                <div className="absolute -bottom-12 -left-8 w-28 h-28 rounded-full bg-rose-200/40 animate-blob animation-delay-2000" />
                <div className="absolute top-1/2 right-8 w-20 h-20 rounded-full bg-sky-200/40 animate-blob animation-delay-4000" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Even or Odd? (to 100)
                <span className="ml-2 print:hidden inline-block animate-bounce">🧲</span>
              </h2>
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-violet-400 to-rose-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-2 gap-3 text-xl font-mono">
                {nums.map((n,i)=> (
                  <div key={i} className="border border-slate-300 rounded p-3 bg-white w-full flex items-center justify-between">
                    <span>{n}</span>
                    <span className="mx-2">Even ☐  Odd ☐</span>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('even-odd-100', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {nums.map((n,i)=> (<li key={i}>{n}: {n%2===0 ? 'Even' : 'Odd'}</li>))}
                  </ul>
                </div>
              ))}
            </section>
          );
        })()}

        {activeDocs.includes('time-5min') && (
          <section className="relative overflow-hidden mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <div className="absolute inset-0 -z-10 print:hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-sky-200/40 animate-blob" />
              <div className="absolute -bottom-12 -left-8 w-28 h-28 rounded-full bg-teal-200/40 animate-blob animation-delay-2000" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full bg-indigo-200/40 animate-blob animation-delay-4000" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Tell Time to 5 Minutes
              <span className="ml-2 print:hidden inline-block animate-bounce">🕒</span>
            </h2>
            <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-sky-400 to-indigo-400 animate-gradient-x mb-2" />
            <div className="grid grid-cols-2 gap-3">
              {['3:25','9:40','12:05','6:30','1:55','10:10','7:45','2:20'].map((t,i)=> (
                <svg key={i} viewBox="0 0 200 200" className="w-full h-auto bg-white border border-slate-300 rounded">
                  <circle cx="100" cy="100" r="80" fill="none" stroke="#111827" strokeWidth="3" />
                  {/* hour marks */}
                  {Array.from({length:12}).map((_,k)=> { const a=(k/12)*Math.PI*2; const x1=100+Math.cos(a)*70; const y1=100+Math.sin(a)*70; const x2=100+Math.cos(a)*80; const y2=100+Math.sin(a)*80; return <line key={k} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#111827" /> })}
                  <text x="100" y="180" textAnchor="middle" fontSize="16" fill="#111827">{t}</text>
                  {/* student draws hands */}
                </svg>
              ))}
            </div>
          </section>
        )}

        {activeDocs.includes('ten-frames-1-20') && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">Ten Frames 1–20</h2>
            <p className="text-slate-600 text-sm mb-3">Color the circles to match each number. Say how many are filled and how many are empty.</p>
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 20 }).map((_,n)=> (
                <svg key={n} viewBox="0 0 400 160" className="w-full h-auto bg-white border border-slate-300 rounded">
                  <text x="40" y="50" fontSize="36" fill="#111827">{n+1}</text>
                  <g transform="translate(120,60)">
                    {Array.from({ length: 10 }).map((__,i)=> (
                      <rect key={i} x={(i%5)*40} y={Math.floor(i/5)*40} width="36" height="36" fill="none" stroke="#111827" />
                    ))}
                  </g>
                </svg>
              ))}
            </div>
          </section>
        )}

        {activeDocs.includes('shapes-colors-sort') && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">Shapes & Colors Sort (Cut & Glue)</h2>
            <p className="text-slate-600 text-sm mb-3">Cut out the shapes, then sort into the right color boxes. Practice scissor skills safely.</p>
            <div className="grid grid-cols-2 gap-4">
              <svg viewBox="0 0 400 300" className="w-full h-auto bg-white border border-slate-300 rounded">
                <g fill="none" stroke="#111827" strokeWidth="3.5">
                  <rect x="40" y="40" width="120" height="80" />
                  <rect x="240" y="40" width="120" height="80" />
                  <rect x="140" y="160" width="120" height="80" />
                </g>
                <text x="70" y="95" fontSize="18" fill="#0ea5e9">BLUE</text>
                <text x="280" y="95" fontSize="18" fill="#ef4444">RED</text>
                <text x="175" y="215" fontSize="18" fill="#22c55e">GREEN</text>
              </svg>
              <svg viewBox="0 0 400 300" className="w-full h-auto bg-white border border-slate-300 rounded">
                <g fill="none" stroke="#111827" strokeWidth="3.5">
                  <circle cx="80" cy="60" r="20" />
                  <rect x="40" y="110" width="60" height="40" />
                  <polygon points="160,60 190,110 130,110" />
                  <circle cx="250" cy="60" r="20" />
                  <rect x="220" y="110" width="60" height="40" />
                  <polygon points="340,60 370,110 310,110" />
                </g>
              </svg>
            </div>
          </section>
        )}

        {activeDocs.includes('dot-to-dot-1-20') && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">1–20 Dot‑to‑Dot</h2>
            <p className="text-slate-600 text-sm mb-3">Connect the dots in order to reveal the picture.</p>
            <svg viewBox="0 0 800 400" className="w-full h-auto bg-white border border-slate-300 rounded">
              {Array.from({ length: 20 }).map((_,i)=> (
                <g key={i}>
                  <circle cx={60 + i*35} cy={200 + (i%2===0? -30:30)} r="4" fill="#111827" />
                  <text x={60 + i*35 + 6} y={200 + (i%2===0? -30:30) - 6} fontSize="12">{i+1}</text>
                </g>
              ))}
            </svg>
          </section>
        )}

        {activeDocs.includes('tangram-animals') && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">Tangram Animals (Cutouts)</h2>
            <p className="text-slate-600 text-sm mb-3">Cut the shapes and arrange to make animal silhouettes. Glue the final shape on a clean sheet.</p>
            <svg viewBox="0 0 800 400" className="w-full h-auto bg-white border border-slate-300 rounded">
              <g fill="none" stroke="#111827" strokeWidth="3.5">
                <polygon points="100,50 200,50 200,150 100,150" />
                <polygon points="220,50 270,100 220,150 170,100" />
                <polygon points="300,50 350,50 350,150 300,150" />
                <polygon points="380,50 430,100 380,150 330,100" />
                <polygon points="460,50 560,50 560,150 460,150" />
              </g>
            </svg>
          </section>
        )}

        {activeDocs.includes('spot-difference') && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">Spot‑the‑Difference (7)</h2>
            <p className="text-slate-600 text-sm mb-3">Find 7 differences between the two pictures.</p>
            <div className="grid grid-cols-2 gap-4">
              <HiddenObjectsSceneSVGA />
              <HiddenObjectsSceneSVGB />
            </div>
          </section>
        )}

        {activeDocs.includes('directed-drawing-animals') && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">Directed Drawing: Animals</h2>
            <p className="text-slate-600 text-sm mb-3">Follow each step to draw a fish silhouette using simple shapes. No face features (eyes, nose, mouth, ears).</p>
            {/* Full-page, 6-step grid (2x3) with thick strokes for easy tracing */}
            <svg viewBox="0 0 900 1200" className="w-full h-auto bg-white border border-slate-300 rounded">
              <g fill="none" stroke="#111827" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
                {/* Panel frames */}
                <rect x="50" y="60" width="360" height="300" rx="16" />
                <rect x="490" y="60" width="360" height="300" rx="16" />
                <rect x="50" y="420" width="360" height="300" rx="16" />
                <rect x="490" y="420" width="360" height="300" rx="16" />
                <rect x="50" y="780" width="360" height="300" rx="16" />
                <rect x="490" y="780" width="360" height="300" rx="16" />

                {/* Step numbers */}
                <text x="70" y="100" fontSize="28" fill="#111827">1</text>
                <text x="510" y="100" fontSize="28" fill="#111827">2</text>
                <text x="70" y="460" fontSize="28" fill="#111827">3</text>
                <text x="510" y="460" fontSize="28" fill="#111827">4</text>
                <text x="70" y="820" fontSize="28" fill="#111827">5</text>
                <text x="510" y="820" fontSize="28" fill="#111827">6</text>

                {/* Step 1 (panel 1): Body ellipse */}
                <ellipse cx="230" cy="210" rx="130" ry="70" />
                {/* Step 2 (panel 2): Add tail */}
                <ellipse cx="670" cy="210" rx="130" ry="70" />
                <polygon points="740,210 830,160 830,260" />
                {/* Step 3 (panel 3): Dorsal fin */}
                <ellipse cx="230" cy="570" rx="130" ry="70" />
                <polygon points="260,520 320,490 300,540" />
                <polygon points="740,210 830,160 830,260" opacity="0" />
                {/* Step 4 (panel 4): Ventral fin */}
                <ellipse cx="670" cy="570" rx="130" ry="70" />
                <polygon points="700,620 760,650 740,600" />
                <polygon points="740,570 830,520 830,620" opacity="0" />
                {/* Step 5 (panel 5): Side fin */}
                <ellipse cx="230" cy="930" rx="130" ry="70" />
                <polygon points="160,930 110,960 160,990" />
                {/* Step 6 (panel 6): Gentle stripes (no face) */}
                <ellipse cx="670" cy="930" rx="130" ry="70" />
                <path d="M600 900 C 640 880, 700 880, 740 900" />
                <path d="M590 930 C 640 915, 700 915, 750 930" />
                <path d="M610 960 C 650 980, 690 980, 730 960" />
              </g>
            </svg>
          </section>
        )}

        {activeDocs.includes('cut-and-paste-crafts') && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">Cut‑and‑Paste Paper Crafts</h2>
            <p className="text-slate-600 text-sm mb-3">Cut the parts and glue them in place. Color when finished.</p>
            <svg viewBox="0 0 800 300" className="w-full h-auto bg-white border border-slate-300 rounded">
              <g fill="none" stroke="#111827" strokeWidth="3.5">
                <rect x="80" y="60" width="80" height="80" />
                <circle cx="220" cy="100" r="40" />
                <polygon points="320,60 380,140 260,140" />
                <rect x="420" y="60" width="80" height="80" />
                <rect x="510" y="70" width="30" height="60" />
                <rect x="550" y="70" width="30" height="60" />
              </g>
            </svg>
          </section>
        )}

        {activeDocs.includes('feelings-checkin') && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">Feelings Check‑In Meter</h2>
            <p className="text-slate-600 text-sm mb-3">Point to or color how you feel today.</p>
            <svg viewBox="0 0 800 300" className="w-full h-auto bg-white border border-slate-300 rounded">
              <defs>
                <linearGradient id="mood" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#22c55e" />
                  <stop offset="50%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#ef4444" />
                </linearGradient>
              </defs>
              <rect x="100" y="120" width="600" height="40" fill="url(#mood)" rx="8" />
              <circle cx="400" cy="140" r="56" fill="none" stroke="#111827" strokeWidth="4" />
              <text x="90" y="190" fontSize="16">Calm</text>
              <text x="380" y="190" fontSize="16">Okay</text>
              <text x="680" y="190" fontSize="16">Upset</text>
            </svg>
          </section>
        )}

        {activeDocs.includes('reward-chart') && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">Weekly Reward / Sticker Chart</h2>
            <p className="text-slate-600 text-sm mb-3">Add a sticker or color a star each time you complete a task.</p>
            <svg viewBox="0 0 800 400" className="w-full h-auto bg-white border border-slate-300 rounded">
              <g fill="none" stroke="#111827" strokeWidth="3.5">
                <rect x="100" y="80" width="600" height="220" />
                {Array.from({ length: 5 }).map((_,r)=> (
                  <line key={r} x1="100" y1={80 + (r+1)*44} x2="700" y2={80 + (r+1)*44} />
                ))}
                {Array.from({ length: 6 }).map((_,c)=> (
                  <line key={c} x1={100 + (c+1)*100} y1="80" x2={100 + (c+1)*100} y2="300" />
                ))}
              </g>
              <text x="120" y="70" fontSize="16">Mon</text>
              <text x="220" y="70" fontSize="16">Tue</text>
              <text x="320" y="70" fontSize="16">Wed</text>
              <text x="420" y="70" fontSize="16">Thu</text>
              <text x="520" y="70" fontSize="16">Fri</text>
              <text x="620" y="70" fontSize="16">Sat</text>
              <text x="690" y="70" fontSize="16">Sun</text>
            </svg>
          </section>
        )}

        {activeDocs.includes('reading-mini-1') && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">Mini Reading Passage + 3 Questions</h2>
            <p className="text-slate-600 text-sm mb-3">Read the short passage, then answer the questions in full sentences.</p>
            <div className="bg-white border border-slate-300 rounded p-4">
              <p className="text-slate-800 text-base">Sara planted a tiny seed in a cup by the window. Every day, she gave it a little water and turned the cup toward the sun. One morning, she saw a green sprout peek out of the soil. Sara smiled. “Hello, little plant,” she whispered.</p>
              <ol className="list-decimal list-inside mt-3 text-slate-800 text-base space-y-1">
                <li>Where did Sara put the cup?</li>
                <li>What did she give the seed every day?</li>
                <li>What did Sara see in the soil?</li>
              </ol>
              {showAnswersForDoc('reading-mini-1', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ol className="list-decimal list-inside space-y-0.5">
                    <li>By the window</li>
                    <li>A little water</li>
                    <li>A green sprout</li>
                  </ol>
                </div>
              ))}
            </div>
          </section>
        )}
        {activeDocs.includes('reading-g1-lost-hat') && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">Passage — The Lost Hat (Grade 1)</h2>
            <div className="bg-white border border-slate-300 rounded p-4">
              <p className="text-slate-800 text-base">Mia ran to the park. The wind was strong. Her red hat flew off! She looked under the slide and behind a tree. A dog found the hat by the bench. Mia laughed and waved. “Thank you!”</p>
              <ol className="list-decimal list-inside mt-3 text-slate-800 text-base space-y-1">
                <li>Where did Mia go?</li>
                <li>What color was the hat?</li>
                <li>Who found the hat?</li>
                <li>Why did the hat fly off?</li>
              </ol>
              {showAnswersForDoc('reading-g1-lost-hat', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ol className="list-decimal list-inside space-y-0.5">
                    <li>The park</li>
                    <li>Red</li>
                    <li>A dog</li>
                    <li>The wind was strong</li>
                  </ol>
                </div>
              ))}
            </div>
          </section>
        )}
        {activeDocs.includes('reading-g1-ants') && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">Passage — Lunch for the Ants (Grade 1)</h2>
            <div className="bg-white border border-slate-300 rounded p-4">
              <p className="text-slate-800 text-base">Sam dropped a crumb. Ants marched in a line. They carried the crumb together. Sam watched quietly. He did not step near them. Soon, the ants were gone. The floor was clean!</p>
              <ol className="list-decimal list-inside mt-3 text-slate-800 text-base space-y-1">
                <li>What did Sam drop?</li>
                <li>How did the ants move?</li>
                <li>What did Sam do while he watched?</li>
                <li>What happened to the floor?</li>
              </ol>
              {showAnswersForDoc('reading-g1-ants', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ol className="list-decimal list-inside space-y-0.5">
                    <li>A crumb</li>
                    <li>In a line</li>
                    <li>He watched quietly and didn’t step near them</li>
                    <li>It was clean</li>
                  </ol>
                </div>
              ))}
            </div>
          </section>
        )}
        {activeDocs.includes('reading-g1-bus-ride') && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">Passage — The Bus Ride (Grade 1)</h2>
            <div className="bg-white border border-slate-300 rounded p-4">
              <p className="text-slate-800 text-base">Eli held his mom’s hand on the bus. The seats were soft and blue. The driver rang a bell and the doors opened. “This is our stop,” Mom said. Eli smiled and waved to the driver.</p>
              <ol className="list-decimal list-inside mt-3 text-slate-800 text-base space-y-1">
                <li>What color were the seats?</li>
                <li>Who did Eli hold hands with?</li>
                <li>What sound did the driver make?</li>
                <li>Why did the doors open?</li>
              </ol>
              {showAnswersForDoc('reading-g1-bus-ride', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ol className="list-decimal list-inside space-y-0.5">
                    <li>Blue</li>
                    <li>His mom</li>
                    <li>A bell</li>
                    <li>It was their stop</li>
                  </ol>
                </div>
              ))}
            </div>
          </section>
        )}
        {activeDocs.includes('reading-g1-pet-fish') && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">Passage — The Pet Fish (Grade 1)</h2>
            <div className="bg-white border border-slate-300 rounded p-4">
              <p className="text-slate-800 text-base">Tara had a tiny orange fish. She named it Dot. Every morning, she shook in two flakes of food. Dot swam in little circles. Tara drew a picture of Dot for her wall.</p>
              <ol className="list-decimal list-inside mt-3 text-slate-800 text-base space-y-1">
                <li>What pet did Tara have?</li>
                <li>What was its name?</li>
                <li>How many flakes did she feed it?</li>
                <li>What did Tara put on her wall?</li>
              </ol>
              {showAnswersForDoc('reading-g1-pet-fish', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ol className="list-decimal list-inside space-y-0.5">
                    <li>A tiny orange fish</li>
                    <li>Dot</li>
                    <li>Two flakes</li>
                    <li>A picture of Dot</li>
                  </ol>
                </div>
              ))}
            </div>
          </section>
        )}
        {activeDocs.includes('reading-g2-paper-bridge') && (
          <section className="relative overflow-hidden mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <div className="absolute inset-0 -z-10 print:hidden">
              <div className="absolute -top-10 -left-10 w-32 h-32 rounded-full bg-amber-200/40 animate-blob" />
              <div className="absolute -bottom-12 -right-8 w-28 h-28 rounded-full bg-sky-200/40 animate-blob animation-delay-2000" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <svg className="h-5 w-5 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 7h18M3 12h18M3 17h18" />
              </svg>
              Passage — The Paper Bridge (Grade 2)
            </h2>
            <div className="bg-white border border-slate-300 rounded p-4">
              {/* Small illustrative header */}
              <div className="print:hidden mb-3">
                <svg viewBox="0 0 500 80" className="w-full h-16">
                  <rect x="80" y="50" width="340" height="8" fill="#94a3b8" />
                  <rect x="100" y="30" width="80" height="20" fill="#22c55e" />
                  <rect x="190" y="30" width="80" height="20" fill="#60a5fa" />
                  <rect x="280" y="30" width="80" height="20" fill="#f59e0b" />
                </svg>
              </div>
              <p className="text-slate-800 text-base">Lena wanted a tiny bridge for her toy river. She folded strips of paper and taped them together. The first bridge bent and fell. She added more layers, tested again, and smiled. The paper bridge held three toy cars!</p>
              <ol className="list-decimal list-inside mt-3 text-slate-800 text-base space-y-1">
                <li>What was Lena building?</li>
                <li>Why did the first bridge fail?</li>
                <li>What change helped it work?</li>
                <li>How many cars did it hold?</li>
              </ol>
              {showAnswersForDoc('reading-g2-paper-bridge', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ol className="list-decimal list-inside space-y-0.5">
                    <li>A tiny paper bridge</li>
                    <li>It bent and fell (too weak)</li>
                    <li>More layers</li>
                    <li>Three cars</li>
                  </ol>
                </div>
              ))}
            </div>
          </section>
        )}
        {activeDocs.includes('reading-g2-rainy-garden') && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">Passage — Rainy Day Garden (Grade 2)</h2>
            <div className="bg-white border border-slate-300 rounded p-4">
              <p className="text-slate-800 text-base">Asha kept a notebook for her balcony garden. On rainy days, she didn’t water her plants. She drew a cloud symbol instead. After a week of rain, her beans grew fast. Asha wrote, “Let the rain help.”</p>
              <ol className="list-decimal list-inside mt-3 text-slate-800 text-base space-y-1">
                <li>What did Asha keep?</li>
                <li>What symbol did she draw on rainy days?</li>
                <li>What happened to her beans after a week?</li>
                <li>What lesson did she write?</li>
              </ol>
              {showAnswersForDoc('reading-g2-rainy-garden', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ol className="list-decimal list-inside space-y-0.5">
                    <li>A notebook</li>
                    <li>A cloud</li>
                    <li>They grew fast</li>
                    <li>“Let the rain help”</li>
                  </ol>
                </div>
              ))}
            </div>
          </section>
        )}
        {activeDocs.includes('reading-g2-library-card') && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">Passage — New Library Card (Grade 2)</h2>
            <div className="bg-white border border-slate-300 rounded p-4">
              <p className="text-slate-800 text-base">Jada visited the library with her uncle. She filled out a form and signed her name carefully. The librarian handed her a shiny new card. “Now you can borrow books,” he said. Jada chose two mysteries and a science book.</p>
              <ol className="list-decimal list-inside mt-3 text-slate-800 text-base space-y-1">
                <li>Where did Jada go?</li>
                <li>What did she receive from the librarian?</li>
                <li>What kinds of books did she choose?</li>
                <li>Why did she sign her name?</li>
              </ol>
              {showAnswersForDoc('reading-g2-library-card', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ol className="list-decimal list-inside space-y-0.5">
                    <li>The library</li>
                    <li>A new library card</li>
                    <li>Two mysteries and a science book</li>
                    <li>To complete the form and get the card</li>
                  </ol>
                </div>
              ))}
            </div>
          </section>
        )}
        {activeDocs.includes('reading-g2-lost-and-found') && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">Passage — Lost and Found (Grade 2)</h2>
            <div className="bg-white border border-slate-300 rounded p-4">
              <p className="text-slate-800 text-base">At recess, Ben noticed a glove under the slide. He brought it to the office and wrote “blue glove” in the lost‑and‑found log. After lunch, a classmate came looking for a glove and smiled when she saw it.</p>
              <ol className="list-decimal list-inside mt-3 text-slate-800 text-base space-y-1">
                <li>Where did Ben find the glove?</li>
                <li>Where did he take it?</li>
                <li>What did he write?</li>
                <li>Who came later, and what happened?</li>
              </ol>
              {showAnswersForDoc('reading-g2-lost-and-found', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ol className="list-decimal list-inside space-y-0.5">
                    <li>Under the slide</li>
                    <li>The office</li>
                    <li>“blue glove” in the lost‑and‑found log</li>
                    <li>A classmate; she found her glove</li>
                  </ol>
                </div>
              ))}
            </div>
          </section>
        )}
        {activeDocs.includes('reading-g3-lighthouse') && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">Passage — The Lighthouse Keeper’s Trick (Grade 3)</h2>
            <div className="bg-white border border-slate-300 rounded p-4">
              <p className="text-slate-800 text-base">A storm rolled over the coast, and waves pounded the rocks. Mira checked the lighthouse lamps—bright, steady, and safe. But the fog was thick, and a fishing boat drifted off course. Mira remembered a trick her father taught her. She covered one lamp for a few seconds, then uncovered it, making a slow flash. The boat turned toward the beam and away from the rocks. When the storm passed, Mira logged the event: “Used flash method to guide a boat. Lamps steady.”</p>
              <ol className="list-decimal list-inside mt-3 text-slate-800 text-base space-y-1">
                <li>What problem did the boat have?</li>
                <li>What “trick” did Mira use?</li>
                <li>Why did the trick help the boat?</li>
                <li>What does Mira’s log note tell us about her work?</li>
              </ol>
              {showAnswersForDoc('reading-g3-lighthouse', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ol className="list-decimal list-inside space-y-0.5">
                    <li>It drifted off course in thick fog</li>
                    <li>A timed lamp flash</li>
                    <li>It guided the boat toward the safe beam and away from rocks</li>
                    <li>She keeps careful records and uses safe methods</li>
                  </ol>
                </div>
              ))}
            </div>
          </section>
        )}
        {activeDocs.includes('reading-g3-science-fair') && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">Passage — The Science Fair Plan (Grade 3)</h2>
            <div className="bg-white border border-slate-300 rounded p-4">
              <p className="text-slate-800 text-base">Our team listed problems we see at home. We chose one: sticky labels that won’t peel cleanly. We planned tests: different soaking times, natural oils, and gentle heat. We predicted that warm oil would loosen the glue fastest, and we wrote a careful procedure.</p>
              <ol className="list-decimal list-inside mt-3 text-slate-800 text-base space-y-1">
                <li>What problem did the team choose?</li>
                <li>What were two variables they planned to test?</li>
                <li>What did they predict?</li>
                <li>Why did they write a procedure?</li>
              </ol>
              {showAnswersForDoc('reading-g3-science-fair', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ol className="list-decimal list-inside space-y-0.5">
                    <li>Sticky labels that won’t peel cleanly</li>
                    <li>Soaking time and natural oils</li>
                    <li>Warm oil would loosen the glue fastest</li>
                    <li>To follow steps consistently and fairly</li>
                  </ol>
                </div>
              ))}
            </div>
          </section>
        )}
        {activeDocs.includes('reading-g3-community-garden') && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">Passage — The Community Garden (Grade 3)</h2>
            <div className="bg-white border border-slate-300 rounded p-4">
              <p className="text-slate-800 text-base">The empty lot near our school looked messy in spring. Families asked the town for permission to plant. We drew a map with paths, a tool shed, and a compost bin. By fall, we harvested tomatoes and herbs, and we sold bundles to raise money for books.</p>
              <ol className="list-decimal list-inside mt-3 text-slate-800 text-base space-y-1">
                <li>What did families ask the town for?</li>
                <li>What three things were on the map?</li>
                <li>What did they harvest?</li>
                <li>How did they use the money they earned?</li>
              </ol>
              {showAnswersForDoc('reading-g3-community-garden', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ol className="list-decimal list-inside space-y-0.5">
                    <li>Permission to plant a garden</li>
                    <li>Paths, a tool shed, and a compost bin</li>
                    <li>Tomatoes and herbs</li>
                    <li>For books (sold bundles to raise money)</li>
                  </ol>
                </div>
              ))}
            </div>
          </section>
        )}
        {activeDocs.includes('pack') && (() => {
          // Build dynamic pack content by time/age/skill
          const timeInt = parseInt(packTime || '5', 10);
          const itemCount = timeInt <= 5 ? 3 : (timeInt <= 10 ? 4 : 5);
          const isK2 = packAge === 'k1' || packAge === 'k2' || packAge === 'g1' || packAge === 'g2';
          const is35 = packAge === '35';
          const wsSize = 8;
          const seedStr = `${effectiveSeed}|v${variant}|t${packTime}|a${packAge}|s${packSkill}`;
          const rng = makeRng(seedStr);
          const theme = packSkill === 'reading' ? 'sight' : (packSkill === 'stem' ? 'space' : pick(['animals', 'space', 'sight'], rng));
          const wordsFull = buildWords(theme, packAge);
          const words = pickNUnique(wordsFull, 8, rng);
          const grid = buildGridLetters(words.slice(0, 8), wsSize, seedStr);
          const treatAsMath = packSkill === 'math';
          // Choose a different maze path based on age and seed for variety
          let mazePath = '';
          if (isK2) {
            mazePath = pick([
              'M10 20h80v20H30v20h60v20H40v20h50',
              'M10 20h70v20H30v20h50v20H20v20h70'
            ], rng);
          } else if (is35) {
            mazePath = pick([
              'M10 20h90v15H20v15h80v15H30v15h70v15H40v15h60',
              'M10 20h80v15H30v15h70v15H20v15h80v15H30v15h70'
            ], rng);
          } else {
            mazePath = pick([
              'M10 15h90v10H20v10h80v10H30v10h70v10H40v10h60v10H50v10h50',
              'M10 15h70v10H30v10h80v10H40v10h70v10H50v10h60v10H60v10h40'
            ], rng);
          }
          const drawingPrompt = packSkill === 'creativity'
            ? 'Invent a gadget for school. Label 3 parts.'
            : isK2
              ? 'Draw a creature from a circle, triangle, and rectangle.'
              : 'Draw your favorite animal and write one fact.';

          const items: React.ReactNode[] = [];
          // Helpers for extra activities
          function scrambleWordLocal(w: string) {
            const a = w.split('');
            for (let i = a.length - 1; i > 0; i--) {
              const j = Math.floor(rng() * (i + 1));
              [a[i], a[j]] = [a[j], a[i]];
            }
            return a.join('');
          }
          function buildMiniMathProblems(n: number) {
            const out: string[] = [];
            for (let i = 0; i < n; i++) {
              const a = Math.floor(rng() * (isK2 ? 9 : 12)) + 1;
              const b = Math.floor(rng() * (isK2 ? 9 : 12)) + 1;
              const useAdd = isK2 ? true : rng() < 0.6;
              if (useAdd) out.push(`${a} + ${b} = ____`);
              else out.push(`${Math.max(a,b)} - ${Math.min(a,b)} = ____`);
            }
            return out;
          }
          function buildMiniSudoku() {
            const base = [
              [1,2,3,4],
              [3,4,1,2],
              [2,1,4,3],
              [4,3,2,1],
            ];
            const removals = 6 + Math.floor(rng()*3);
            const grid: number[][] = base.map(r=>r.slice());
            let removed = 0;
            while (removed < removals) {
              const r = Math.floor(rng()*4);
              const c = Math.floor(rng()*4);
              if (grid[r][c] !== 0) { grid[r][c] = 0; removed++; }
            }
            return grid;
          }

          // Reading-specific generators
          function buildReadingPassage(age: string) {
            const poolG1 = [
              {
                text: 'Liam had a blue kite. On a windy day, he ran to the park. The kite rose high. Liam laughed and waved at it.',
                qs: ['What color was the kite?','Where did Liam go?','Why did the kite rise?']
              },
              {
                text: 'Nina put seeds in a pot. She set it by the sunny window. Each morning, she gave it water. A small leaf popped up!',
                qs: ['What did Nina put in the pot?','Where did she place the pot?','What popped up?']
              },
              {
                text: 'The class made a bird feeder from a cup. They filled it with seeds and hung it on a tree. A red bird came to snack.',
                qs: ['What did the class make?','What did they put in it?','Who came to snack?']
              }
            ];
            const poolG2 = [
              {
                text: 'Omar wanted to fix his squeaky bike wheel. He watched a quick video and learned to add oil to the axle. After two tries, the squeak was gone.',
                qs: ['What was Omar trying to fix?','What did he add to the axle?','What happened after two tries?']
              },
              {
                text: 'Maya kept a weather chart on her wall. She drew a sun for hot days, a cloud for cool days, and a raindrop for storms. After a week, her chart had many symbols.',
                qs: ['What did Maya keep on her wall?','What symbol did she draw for storms?','How long did she track the weather?']
              },
              {
                text: 'Leo and his sister built a pillow fort. They tested two roof designs until one stayed up. They read books inside with a small lamp.',
                qs: ['What did they build?','How many roof designs did they test?','What did they do inside the fort?']
              }
            ];
            const poolG3 = [
              {
                text: 'A town near the river held an early‑morning clean‑up. People wore gloves and filled bags with plastic and paper. By noon, the river path looked new. One volunteer wrote, “Teamwork made a big job smaller.”',
                qs: ['What problem were people solving?','When did they work?','What does the note tell us about the work?']
              },
              {
                text: 'The lighthouse keeper tested the backup lamp once a month. During a thick fog, the main lamp flickered. The keeper calmly switched to the backup, and ships stayed safe.',
                qs: ['How often was the backup lamp tested?','What happened during the fog?','Why did ships stay safe?']
              },
              {
                text: 'At the garden market, prices were lower near closing time. Jae waited, then bought apples and carrots with the same coins. He saved money by being patient.',
                qs: ['Where did Jae shop?','When were prices lower?','How did Jae save money?']
              }
            ];
            const pool = age === 'g1' ? poolG1 : (age === 'g2' ? poolG2 : poolG3);
            const pickIdx = Math.floor(rng() * pool.length);
            return pool[pickIdx];
          }

          function pushReadingComprehensionFull() {
            const p = buildReadingPassage(packAge);
            items.push(
              <div key={`rc-full-${variant}`} className="border border-slate-200 rounded-lg p-4 sm:col-span-2">
                <div className="font-semibold text-xl mb-2">Reading Comprehension — Passage & Questions</div>
                <p className="text-lg text-slate-800 mb-3">{p.text}</p>
                <ol className="list-decimal list-inside space-y-1 text-lg text-slate-800">
                  {p.qs.map((q, i) => (
                    <li key={i}>{q}</li>
                  ))}
                </ol>
              </div>
            );
          }

          function pushSequenceTask() {
            const seqPools: Record<string, string[][]> = {
              g1: [
                ['Put on boots.','Open the door.','Play in the snow.'],
                ['Crack the egg.','Stir in a bowl.','Cook in a pan.']
              ],
              g2: [
                ['Pick a book.','Find a quiet seat.','Read for ten minutes.'],
                ['Mix soil and water.','Press seeds into soil.','Label the pot.']
              ],
              '35': [
                ['Plan the route.','Pack supplies.','Start the hike.'],
                ['List choices.','Compare costs.','Choose the best value.']
              ]
            };
            const pool = seqPools[packAge as 'g1'|'g2'|'35'] || seqPools.g1;
            const choice = pool[Math.floor(rng()*pool.length)];
            items.push(
              <div key={`sequence-${variant}`} className="border border-slate-200 rounded-lg p-4">
                <div className="font-semibold text-xl mb-2">Sequence the Steps (1–3)</div>
                <ol className="list-decimal list-inside space-y-1 text-lg text-slate-800">
                  {choice.map((s, i)=> (<li key={i}><span className="opacity-0">{i+1}. </span>{s}</li>))}
                </ol>
              </div>
            );
          }

          function pushMainIdeaTask() {
            const p = buildReadingPassage(packAge);
            const distractorA = 'Fun Day';
            const distractorB = 'The Big Storm';
            const options = [
              'Best Title',
              distractorA,
              distractorB
            ];
            // Shuffle options deterministically
            const order = [0,1,2].sort(()=> (rng() < 0.5 ? -1 : 1));
            items.push(
              <div key={`main-idea-${variant}`} className="border border-slate-200 rounded-lg p-4">
                <div className="font-semibold text-xl mb-2">Main Idea — Choose the Best Title</div>
                <p className="text-base text-slate-800 mb-3">{p.text}</p>
                <ul className="space-y-1 text-lg text-slate-800">
                  {order.map((i)=> (
                    <li key={i}><span className="inline-block w-4 h-4 border border-slate-400 mr-2 align-middle"/> {options[i]}</li>
                  ))}
                </ul>
              </div>
            );
          }
          // 1) Word Search or Reading prompt
          if (!treatAsMath && packSkill !== 'creativity') {
            items.push(
              <div key="ws" className="border border-slate-200 rounded-lg p-4">
                <div className="font-semibold text-xl mb-3">Mini Word Search — {theme === 'sight' ? 'Sight Words' : theme === 'space' ? 'Space' : 'Animals'}</div>
                <div className={`grid grid-cols-8 gap-2 font-mono text-lg`}>
                  {grid.map((c,i)=> (
                    <div key={i} className="w-10 h-10 border border-slate-300 rounded-sm flex items-center justify-center">{c}</div>
                  ))}
                </div>
                <div className="mt-3 text-lg text-slate-700">Find: {words.join(', ')}</div>
              </div>
            );
          }
          // 2) Reading/S.T.E.M./Maze secondary item based on focus
          if (packSkill === 'stem') {
            items.push(
              <div key="stem" className="border border-slate-200 rounded-lg p-4">
                <div className="font-semibold text-lg mb-2">STEM Mini‑Task</div>
                <div className="text-base text-slate-700">Balance a ruler on your finger. Slide a coin along the ruler — what happens? Write one observation.</div>
                <div className="mt-3 h-24 border border-dashed border-slate-300 rounded-md" />
              </div>
            );
          } else if (packSkill === 'reading') {
            // Add a fuller reading comprehension task instead of a maze
            pushReadingComprehensionFull();
          } else {
            // Build a unique grid maze using a seeded DFS (recursive backtracker)
            const mazeCols = isK2 ? 8 : (is35 ? 10 : 12);
            const mazeRows = isK2 ? 8 : (is35 ? 10 : 12);
            const total = mazeCols * mazeRows;
            const cells = Array.from({ length: total }, () => ({ t: true, r: true, b: true, l: true })) as { t: boolean; r: boolean; b: boolean; l: boolean }[];
            const visited = new Array(total).fill(false) as boolean[];
            const indexOf = (x: number, y: number) => y * mazeCols + x;
            const inBounds = (x: number, y: number) => x >= 0 && y >= 0 && x < mazeCols && y < mazeRows;
            const stack: number[] = [0];
            visited[0] = true;
            while (stack.length) {
              const cur = stack[stack.length - 1];
              const cx = cur % mazeCols;
              const cy = Math.floor(cur / mazeCols);
              const neigh: Array<{ i: number; dir: 't' | 'r' | 'b' | 'l' }> = [];
              if (inBounds(cx, cy - 1) && !visited[indexOf(cx, cy - 1)]) neigh.push({ i: indexOf(cx, cy - 1), dir: 't' });
              if (inBounds(cx + 1, cy) && !visited[indexOf(cx + 1, cy)]) neigh.push({ i: indexOf(cx + 1, cy), dir: 'r' });
              if (inBounds(cx, cy + 1) && !visited[indexOf(cx, cy + 1)]) neigh.push({ i: indexOf(cx, cy + 1), dir: 'b' });
              if (inBounds(cx - 1, cy) && !visited[indexOf(cx - 1, cy)]) neigh.push({ i: indexOf(cx - 1, cy), dir: 'l' });
              if (neigh.length === 0) { stack.pop(); continue; }
              // pick neighbor deterministically
              const pickIdx = Math.floor(rng() * neigh.length);
              const next = neigh[pickIdx];
              // carve passage
              if (next.dir === 't') { cells[cur].t = false; cells[next.i].b = false; }
              if (next.dir === 'r') { cells[cur].r = false; cells[next.i].l = false; }
              if (next.dir === 'b') { cells[cur].b = false; cells[next.i].t = false; }
              if (next.dir === 'l') { cells[cur].l = false; cells[next.i].r = false; }
              visited[next.i] = true;
              stack.push(next.i);
            }

            // Convert walls to SVG lines
            const cellSize = 12;
            const pad = 6;
            const svgW = mazeCols * cellSize + pad * 2;
            const svgH = mazeRows * cellSize + pad * 2;
            const lines: Array<{ x1: number; y1: number; x2: number; y2: number }> = [];
            for (let y = 0; y < mazeRows; y++) {
              for (let x = 0; x < mazeCols; x++) {
                const i = indexOf(x, y);
                const w = cells[i];
                const x0 = pad + x * cellSize;
                const y0 = pad + y * cellSize;
                const x1 = x0 + cellSize;
                const y1 = y0 + cellSize;
                if (w.t) lines.push({ x1: x0, y1: y0, x2: x1, y2: y0 });
                if (w.l) lines.push({ x1: x0, y1: y0, x2: x0, y2: y1 });
                if (w.b) lines.push({ x1: x0, y1: y1, x2: x1, y2: y1 });
                if (w.r) lines.push({ x1: x1, y1: y0, x2: x1, y2: y1 });
              }
            }

            items.push(
              <div key="maze" className="border border-slate-200 rounded-lg p-5 sm:col-span-2">
                <div className="font-semibold text-2xl mb-3">Quick Maze</div>
                <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-96" preserveAspectRatio="xMinYMin meet">
                  <rect x={2} y={2} width={svgW - 4} height={svgH - 4} rx={8} fill="#fff" stroke="#cbd5e1" strokeWidth={2} />
                  {lines.map((l, idx) => (
                    <line key={idx} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke="#475569" strokeWidth={3} strokeLinecap="round" />
                  ))}
                  <text x={pad + 2} y={pad + 14} fontSize={10} fill="#10B981" textAnchor="start">START</text>
                  <text x={svgW - (pad + 2)} y={svgH - (pad + 2)} fontSize={10} fill="#EC4899" textAnchor="end">FINISH</text>
                </svg>
              </div>
            );
          }
          // Build an extras pool; prioritize by focus
          const extras: React.ReactNode[] = [];
          const pushColoring = () => {
            const letter = (words[Math.floor(rng()*words.length)] || 'A').slice(0, 1).toUpperCase();
            const isSpace = theme === 'space';
            const isSight = theme === 'sight';
            const isAnimals = theme === 'animals';
            // Seeded extras for variety
            const stars = Array.from({ length: 18 }, () => ({ x: Math.floor(rng() * 760) + 20, y: Math.floor(rng() * 520) + 40 }));
            const planet = { cx: 140 + Math.floor(rng()*160), cy: 120 + Math.floor(rng()*160), r: 32 + Math.floor(rng()*24) };
            const animalTypes = ['Fish','Turtle','Butterfly','Bird','Dino'] as const;
            const animalPick = animalTypes[Math.floor(rng()*animalTypes.length)];
            extras.push(
              <div key="coloring-sheet" className="border border-slate-200 rounded-lg p-4 sm:col-span-2">
                <div className="font-semibold text-xl mb-2">Coloring Sheet — {isSpace ? 'Rocket' : isSight ? `Letter ${letter}` : animalPick}</div>
                <svg viewBox="0 0 800 600" className="w-full h-[28rem] sm:h-[32rem] print:h-[36rem]" fill="none" stroke="#334155" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" role="img" aria-labelledby="coloring-title">
                  <title id="coloring-title">Big coloring illustration</title>
                  {isSpace && (
                    <g>
                      {/* Rocket body */}
                      <path d="M400 100 Q420 60 440 100 L440 360 Q420 400 400 360 Z"/>
                      {/* Window */}
                      <circle cx="420" cy="200" r="24" />
                      {/* Fins */}
                      <path d="M440 300 L500 340 L440 340 Z"/>
                      <path d="M400 300 L340 340 L400 340 Z"/>
                      {/* Flame */}
                      <path d="M400 360 Q420 420 440 360"/>
                      {/* Planet and ring */}
                      <circle cx={planet.cx} cy={planet.cy} r={planet.r} />
                      <ellipse cx={planet.cx} cy={planet.cy} rx={planet.r + 24} ry={planet.r / 2 + 8} />
                      {/* Stars */}
                      {stars.slice(0,12).map((s, i) => (<circle key={i} cx={s.x} cy={s.y} r={6 + (i%3)} />))}
                    </g>
                  )}
                  {isAnimals && (
                    <g>
                      {animalPick === 'Fish' && (
                        <g>
                          <ellipse cx="420" cy="280" rx={140 + Math.floor(rng()*20)} ry={80 + Math.floor(rng()*20)}/>
                          <polygon points={`540,280 ${580 + Math.floor(rng()*60)},${240 + Math.floor(rng()*40)} ${580 + Math.floor(rng()*60)},${320 - Math.floor(rng()*40)}`}/>
                          <circle cx={350 + Math.floor(rng()*30)} cy={250 + Math.floor(rng()*30)} r="10" />
                          <path d={`M${320 + Math.floor(rng()*10)} 280 Q${360 + Math.floor(rng()*10)} ${300 + Math.floor(rng()*10)} ${400 + Math.floor(rng()*10)} 280`}/>
                          <path d={`M${320 + Math.floor(rng()*10)} 240 Q${360 + Math.floor(rng()*10)} ${260 + Math.floor(rng()*10)} ${400 + Math.floor(rng()*10)} 240`}/>
                          {stars.slice(0,6).map((s, i) => (<circle key={i} cx={280 + i*20} cy={160 + i*22} r={8} />))}
                        </g>
                      )}
                      {animalPick === 'Turtle' && (
                        <g>
                          <circle cx="420" cy="300" r={100 + Math.floor(rng()*20)} />
                          <circle cx="340" cy="300" r="22" />
                          <ellipse cx="380" cy="360" rx="28" ry="16"/>
                          <ellipse cx="460" cy="360" rx="28" ry="16"/>
                          <ellipse cx="380" cy="240" rx="28" ry="16"/>
                          <ellipse cx="460" cy="240" rx="28" ry="16"/>
                          <path d="M360 300 H480"/>
                          <path d="M420 240 V360"/>
                          <path d="M380 260 L460 340"/>
                          <path d="M460 260 L380 340"/>
                        </g>
                      )}
                      {animalPick === 'Butterfly' && (
                        <g>
                          <line x1="420" y1="220" x2="420" y2="360"/>
                          <path d="M420 260 Q360 220 300 260 Q360 300 420 280"/>
                          <path d="M420 260 Q480 220 540 260 Q480 300 420 280"/>
                          <path d="M420 300 Q360 340 300 320 Q360 300 420 320"/>
                          <path d="M420 300 Q480 340 540 320 Q480 300 420 320"/>
                          <circle cx="340" cy="260" r="10"/>
                          <circle cx="500" cy="260" r="10"/>
                        </g>
                      )}
                      {animalPick === 'Bird' && (
                        <g>
                          <ellipse cx="420" cy="300" rx="120" ry="70"/>
                          <polygon points="520,300 560,280 560,320"/>
                          <circle cx="360" cy="280" r="8" />
                          <path d="M420 290 Q380 320 340 310"/>
                          <line x1="400" y1="360" x2="390" y2="390"/>
                          <line x1="440" y1="360" x2="450" y2="390"/>
                        </g>
                      )}
                      {animalPick === 'Dino' && (
                        <g>
                          <ellipse cx="420" cy="340" rx="140" ry="60"/>
                          <path d="M360 240 Q380 200 420 220 Q460 240 460 280"/>
                          <circle cx="380" cy="220" r="8" />
                          <path d="M500 340 Q560 320 580 300"/>
                        </g>
                      )}
                    </g>
                  )}
                  {isSight && (
                    <g>
                      {/* Giant letter outline */}
                      <text x="260" y="360" fontSize="280" stroke="#334155" fill="none">{letter}</text>
                      {/* Book */}
                      <rect x="520" y="220" width="160" height="120" rx="8"/>
                      <line x1="600" y1="220" x2="600" y2="340"/>
                      <path d="M520 240 Q560 260 600 240"/>
                      <path d="M600 240 Q640 260 680 240"/>
                    </g>
                  )}
                </svg>
              </div>
            );
          };
          const pushDrawing = () => extras.push(
            <div key="draw" className="border border-slate-200 rounded-lg p-4 sm:col-span-2">
              <div className="font-semibold text-xl mb-2">Drawing Prompt</div>
              <div className="text-lg text-slate-700">{drawingPrompt}</div>
              <div className="mt-3 h-72 border border-dashed border-slate-300 rounded-md" />
            </div>
          );
          const pushMiniMath = () => extras.push(
            <div key="mini-math" className="border border-slate-200 rounded-lg p-4">
              <div className="font-semibold text-xl mb-2">Mini Math — Quick Sums</div>
              <div className="grid sm:grid-cols-2 gap-2 text-lg text-slate-800">
                {buildMiniMathProblems(8).map((p, i)=> (
                  <div key={i} className="flex items-center justify-between">
                    <span>{p}</span>
                    <span className="ml-3 flex-1 border-b border-slate-300" />
                  </div>
                ))}
              </div>
            </div>
          );
          const pushPlaceValue = () => extras.push(
            <div key="place-value" className="border border-slate-200 rounded-lg p-4">
              <div className="font-semibold text-xl mb-2">Place Value — Tens & Ones</div>
              <div className="grid sm:grid-cols-2 gap-3 text-lg text-slate-800">
                {Array.from({length:6}).map((_,i)=>{
                  const n = 10 + Math.floor(rng()*89);
                  const tens = Math.floor(n/10);
                  const ones = n % 10;
                  return (
                    <div key={i} className="border border-slate-200 rounded p-2">
                      <div className="flex items-center justify-between"><span>Number:</span><span className="font-semibold">{n}</span></div>
                      <div className="flex items-center justify-between mt-1"><span>Tens:</span><span className="ml-3 flex-1 border-b border-slate-300" /></div>
                      <div className="flex items-center justify-between mt-1"><span>Ones:</span><span className="ml-3 flex-1 border-b border-slate-300" /></div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
          const pushTenFramesPractice = () => extras.push(
            <div key="ten-frames-mini" className="border border-slate-200 rounded-lg p-4">
              <div className="font-semibold text-xl mb-2">Ten Frames — Fill the Counters</div>
              <div className="grid sm:grid-cols-2 gap-3">
                {Array.from({length:2}).map((_,i)=>{
                  // Grade-appropriate targets: up to 10 for K–2 pack, to 20 for Grade 2
                  const raw = packAge === 'k2' ? (4 + Math.floor(rng()*7)) : (packAge === 'g2' ? (11 + Math.floor(rng()*10)) : (6 + Math.floor(rng()*14)));
                  const target = Math.max(1, Math.min(raw, 20));
                  const frames = target > 10 ? 2 : 1;
                  const viewW = frames === 2 ? 440 : 220;
                  return (
                    <svg key={i} viewBox={`0 0 ${viewW} 110`} className="w-full h-auto bg-white border border-slate-300 rounded">
                      <text x="10" y="20" fontSize="14" fill="#111827">Make {target}</text>
                      {Array.from({length:frames}).map((__,fIdx)=> (
                        <g key={fIdx} transform={`translate(${10 + fIdx*210},30)`}>
                          {Array.from({length:10}).map((__,j)=> (
                            <rect key={j} x={(j%5)*40} y={Math.floor(j/5)*40} width="36" height="36" fill="none" stroke="#111827" />
                          ))}
                          {(() => {
                            const start = fIdx*10;
                            const end = Math.min(target, (fIdx+1)*10);
                            const count = Math.max(0, end - start);
                            return Array.from({length:count}).map((__,k)=> (
                              <circle key={k} cx={18 + (k%5)*40} cy={18 + Math.floor(k/5)*40} r="10" fill="#7c3aed" />
                            ));
                          })()}
                        </g>
                      ))}
                    </svg>
                  );
                })}
              </div>
            </div>
          );
          const pushScramble = () => {
            const scrambleWords = words.slice(0, Math.min(5, words.length));
            extras.push(
              <div key="scramble" className="border border-slate-200 rounded-lg p-4">
                <div className="font-semibold text-xl mb-2">Word Scramble</div>
                <div className="space-y-2 text-lg text-slate-800">
                  {scrambleWords.map((w,i)=> (
                    <div key={i} className="flex items-center justify-between">
                      <span>Unscramble: {scrambleWordLocal(w)}</span>
                      <span className="ml-3 flex-1 border-b border-slate-300" />
                    </div>
                  ))}
                </div>
              </div>
            );
          };
          const pushReading = () => {
            const readingSnippets = [
              'A fox saw the moon in the pond. It tried to catch it, but the water rippled and the moon danced away.',
              'Sara planted a tiny seed. Every day she gave it water and a song. One morning, a green leaf waved hello.'
            ];
            const reading = readingSnippets[Math.floor(rng()*readingSnippets.length)];
            extras.push(
              <div key="reading" className="border border-slate-200 rounded-lg p-4">
                <div className="font-semibold text-xl mb-2">Mini Reading</div>
                <p className="text-lg text-slate-800 mb-3">{reading}</p>
                <ol className="list-decimal list-inside space-y-1 text-lg text-slate-800">
                  <li>Circle the main character.</li>
                  <li>Underline one action word.</li>
                </ol>
              </div>
            );
          };
          const pushMiniSudoku = () => {
            const miniS = buildMiniSudoku();
            extras.push(
              <div key="mini-sudoku" className="border border-slate-200 rounded-lg p-4">
                <div className="font-semibold text-xl mb-2">Mini Sudoku — 4×4</div>
                <div className="inline-grid grid-cols-4 gap-[3px] text-lg font-mono">
                  {miniS.flat().map((v, i)=> (
                    <div key={i} className="w-12 h-12 border border-slate-300 rounded-sm flex items-center justify-center bg-white">
                      {v === 0 ? '' : v}
                    </div>
                  ))}
                </div>
              </div>
            );
          };

          if (treatAsMath) {
            pushMiniMath();
            pushPlaceValue();
            pushMiniSudoku();
            pushTenFramesPractice();
          } else if (packSkill === 'creativity') {
            pushColoring();
            pushDrawing();
            pushScramble();
            pushMiniMath();
            pushMiniSudoku();
            pushReading();
          } else if (packSkill === 'reading') {
            // Reading-focused extras only
            pushColoring(); // letter/book variant if theme === 'sight'
            pushReading(); // mini snippet + 2 questions
            pushScramble(); // sight-word scramble
            pushSequenceTask();
            pushMainIdeaTask();
          } else if (packSkill === 'stem') {
            pushColoring();
            pushMiniMath();
            pushMiniSudoku();
            pushScramble();
            pushReading();
            pushDrawing();
          } else if (packSkill === 'math') {
            pushMiniMath();
            pushPlaceValue();
            pushMiniSudoku();
            pushTenFramesPractice();
          } else {
            // mixed/focus
            pushColoring();
            pushMiniMath();
            pushScramble();
            pushReading();
            pushMiniSudoku();
            pushDrawing();
          }

          // Fill remaining slots from extras
          for (const extra of extras) {
            if (items.length >= itemCount) break;
            items.push(extra);
          }

          const buildLink = (nextVariant?: number, nextSeed?: string) => {
            const sp = new URLSearchParams({
              doc: 'pack',
              time: packTime,
              age: packAge,
              skill: packSkill,
              seed: nextSeed || effectiveSeed,
              variant: String(nextVariant ?? variant)
            })
            return `/print?${sp.toString()}`
          }

          const shareUrl = (typeof window !== 'undefined') ? `${window.location.origin}${buildLink()}` : buildLink()
          async function copyShare() {
            try {
              await navigator.clipboard.writeText(shareUrl)
              setCopiedLink(true)
              setTimeout(()=> setCopiedLink(false), 1500)
            } catch {}
          }

          const nextVariantUrl = buildLink(variant + 1)
          const todayUrl = buildLink(1, todaySeed)

          const displayFocus = treatAsMath ? 'Math' : friendlyFocus(packSkill);
          return (
            <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-5 print:border-0 print:p-0">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900">{docTitle}</h2>
                  <div className="text-slate-700 text-xl">Time: {packTime} min • Age: {friendlyAge(packAge)} • Focus: {displayFocus}</div>
                  <div className="text-slate-700 text-sm">Seed: {effectiveSeed} • Variant: {variant}</div>
                </div>
                <div className="print:hidden flex items-center gap-2">
                  <a href={todayUrl} className="inline-flex items-center px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm">Today’s Pack</a>
                  <a href={nextVariantUrl} className="inline-flex items-center px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm">New Pack</a>
                  <button onClick={copyShare} className="inline-flex items-center px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm">{copiedLink ? 'Link Copied!' : 'Copy Link'}</button>
                </div>
              </div>
              <div className="text-slate-700 text-xl mt-3 mb-3">Quick wins you can finish today. Check off as you go!</div>
              <div className="grid sm:grid-cols-2 gap-6">
                {items.slice(0, itemCount)}
              </div>
            </section>
          );
        })()}
        {activeDocs.includes('stem-balloon-rocket') && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-2xl font-bold text-slate-900">🚀 Balloon Rocket (STEM)</h2>
            <p className="text-slate-700 text-base mb-4">Time: 10 minutes • Ages: 7–10</p>
            <div className="grid sm:grid-cols-2 gap-6 print:grid-cols-1">
              <div>
                <div className="font-semibold text-slate-800 mb-2">Materials</div>
                <ul className="list-disc list-inside text-base text-slate-700 space-y-1">
                  <li>Balloon</li>
                  <li>2–3 m string</li>
                  <li>Plastic straw</li>
                  <li>Clear tape</li>
                  <li>Two chairs (to tie the string)</li>
                </ul>
              </div>
              <div>
                <div className="font-semibold text-slate-800 mb-2">Steps</div>
                <ol className="list-decimal list-inside text-base text-slate-700 space-y-1.5">
                  <li>Thread the string through the straw.</li>
                  <li>Tie the string tightly between two chairs.</li>
                  <li>Tape the balloon to the straw (opening facing backward).</li>
                  <li>Inflate (don’t knot), hold, then release.</li>
                  <li>Measure distance and try again.</li>
                </ol>
              </div>
            </div>
            <div className="mt-4 grid sm:grid-cols-2 gap-4">
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-900 text-base">
                <div className="font-semibold mb-2">Learn</div>
                Air pushes backward; the rocket moves forward (action/reaction).
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-slate-700 text-base">
                <div className="font-semibold mb-2">Try next</div>
                Test balloon sizes, angles, or add a small paper “cargo”.
              </div>
            </div>
          </section>
        )}

        {activeDocs.includes('stem-walking-water') && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-2xl font-bold text-slate-900">🌈 Walking Water (STEM)</h2>
            <p className="text-slate-700 text-base mb-4">Time: 15–20 minutes • Ages: 6–10</p>
            <div className="grid sm:grid-cols-2 gap-6 print:grid-cols-1">
              <div>
                <div className="font-semibold text-slate-800 mb-2">Materials</div>
                <ul className="list-disc list-inside text-base text-slate-700 space-y-1">
                  <li>3 clear cups</li>
                  <li>Water</li>
                  <li>Paper towels</li>
                  <li>Red + blue food coloring</li>
                </ul>
              </div>
              <div>
                <div className="font-semibold text-slate-800 mb-2">Steps</div>
                <ol className="list-decimal list-inside text-base text-slate-700 space-y-1.5">
                  <li>Fill the outer cups with colored water; leave the middle empty.</li>
                  <li>Fold paper towels into two “bridges”.</li>
                  <li>Place bridges into the cups.</li>
                  <li>Watch colors “walk” into the middle cup.</li>
                  <li>Record what changed.</li>
                </ol>
              </div>
            </div>
            <div className="mt-4 grid sm:grid-cols-2 gap-4">
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-900 text-base">
                <div className="font-semibold mb-2">Learn</div>
                Water climbs paper fibers (capillary action) and mixes colors.
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-slate-700 text-base">
                <div className="font-semibold mb-2">Try next</div>
                Try different towel brands, longer gaps, or other color pairs.
              </div>
            </div>
          </section>
        )}

        {activeDocs.includes('arts-3-shape-creature') && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-2xl font-bold text-slate-900">🎨 Draw From 3 Shapes (Arts)</h2>
            <p className="text-slate-700 text-base mb-4">Time: 10–15 minutes • Ages: 6–12</p>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <div className="font-semibold text-slate-800 mb-2">Materials</div>
                <ul className="list-disc list-inside text-base text-slate-700 space-y-1">
                  <li>Paper</li>
                  <li>Pencil or markers</li>
                </ul>
              </div>
              <div>
                <div className="font-semibold text-slate-800 mb-2">Steps</div>
                <ol className="list-decimal list-inside text-base text-slate-700 space-y-1.5">
                  <li>Draw a big circle, triangle, and rectangle anywhere.</li>
                  <li>Turn one shape into a face (eyes/mouth).</li>
                  <li>Connect shapes into one creature.</li>
                  <li>Add patterns and a background.</li>
                  <li>Name your creature and write a 1‑line story.</li>
                </ol>
              </div>
            </div>
            <div className="mt-4 grid sm:grid-cols-2 gap-4">
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-900 text-base">
                <div className="font-semibold mb-2">Learn</div>
                Play with shape language and composition using simple constraints.
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-slate-700 text-base">
                <div className="font-semibold mb-2">Try next</div>
                Mirror (symmetry) version, only curved lines, or only straight lines.
              </div>
            </div>
          </section>
        )}
      {/* (Removed legacy one-pager duplicates) */}
        {activeDocs.includes('math-maze') && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">➕ Math Maze Adventure</h2>
            <p className="text-slate-600 text-sm mb-3">Start at S and reach F. Move up/down/left/right only onto tiles whose equation equals the target shown in that row. Circle your path!</p>
            <div className="flex items-start gap-4">
              <div className="inline-grid grid-cols-7 gap-[2px] text-sm font-mono">
                {mathMazeCells.map((t,i)=> (
                  <div key={i} className="w-10 h-10 border border-slate-300 rounded-sm flex items-center justify-center bg-white">{t}</div>
                ))}
              </div>
              <div className="text-xs text-slate-600">
                <div className="font-semibold mb-1">How to play</div>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Choose a target number per row (e.g., row 1 = 6).</li>
                  <li>Step only on equations that equal that row’s target.</li>
                  <li>Draw your path from S to F without diagonal moves.</li>
                </ol>
                {showAnswersForDoc('math-maze', () => (
                  <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-2 text-emerald-900">
                    <div className="font-semibold mb-1">Example target plan</div>
                    <ul className="list-disc list-inside space-y-0.5">
                      <li>Row 1 target: 6 → valid tiles: 4+2, 8-2…</li>
                      <li>Row 2 target: 8 → valid tiles: 6+2, 9-1…</li>
                      <li>Row 3 target: 10 → valid tiles: 7+3, 12-2…</li>
                    </ul>
                    <div className="text-xs mt-1">Tip: Any path obeying row targets is correct; teacher can pick targets.</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {activeDocs.includes('spelling') && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">✏️ Spelling Challenge Worksheet</h2>
            <p className="text-slate-600 text-sm mb-3">Circle the correctly spelled word in each group. Then write it neatly on the line.</p>
            {[
              ['elefant','elephant','elephent'],
              ['becaus','because','becuase'],
              ['skool','school','scool'],
              ['butterflie','butterfly','buterfly'],
              ['tommorow','tomorrow','tommorrow']
            ].map((row, i) => (
              <div key={i} className="flex items-center justify-between gap-3 mb-2">
                <div className="text-sm font-mono">{i+1}.) {row.join('   ')}</div>
                <div className="flex-1 border-b border-slate-300 ml-3" />
              </div>
            ))}
            {showAnswersForDoc('spelling', () => (
              <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                <div className="font-semibold mb-1">Answer key</div>
                <ol className="list-decimal list-inside space-y-0.5">
                  <li>1) elephant</li>
                  <li>2) because</li>
                  <li>3) school</li>
                  <li>4) butterfly</li>
                  <li>5) tomorrow</li>
                </ol>
              </div>
            ))}
          </section>
        )}

        {activeDocs.includes('science-match') && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">🔬 Science Fun Facts Match</h2>
            <p className="text-slate-600 text-sm mb-3">Draw a line to match each fact with its pair.</p>
            <div className="grid grid-cols-2 gap-6">
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Mars is known as the red planet.</li>
                <li>Whales are the largest mammals.</li>
                <li>Lightning is a giant spark of electricity.</li>
                <li>Penguins live in the Southern Hemisphere.</li>
                <li>Clouds are made of tiny water droplets.</li>
                <li>Earth orbits the Sun once a year.</li>
              </ol>
              <ul className="list-none space-y-1 text-sm">
                <li>A) Weather water in the sky</li>
                <li>B) A cold‑loving bird</li>
                <li>C) The blue planet’s path</li>
                <li>D) A huge ocean animal</li>
                <li>E) A dusty red world</li>
                <li>F) Shocking sky energy</li>
              </ul>
            </div>
            {showAnswersForDoc('science-match', () => (
              <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                <div className="font-semibold mb-1">Answer key</div>
                <ol className="list-decimal list-inside space-y-0.5">
                  <li>1 → E (red planet → dusty red world)</li>
                  <li>2 → D (largest mammals → huge ocean animal)</li>
                  <li>3 → F (spark of electricity → shocking sky energy)</li>
                  <li>4 → B (lives in the south → cold‑loving bird)</li>
                  <li>5 → A (made of water droplets → weather water in the sky)</li>
                  <li>6 → C (orbits the Sun → the blue planet’s path)</li>
                </ol>
              </div>
            ))}
          </section>
        )}

        {activeDocs.includes('grammar-detective') && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">🕵️‍♀️ Grammar Detective</h2>
            <p className="text-slate-600 text-sm mb-3">Find and fix the mistake in each sentence. Rewrite it correctly on the line.</p>
            {[
              'we goes to the park every saturday.',
              'The cats is sleeping under the table.',
              'i can run faster then my friend.',
              'There is two pencils on the desk.',
              'She dont like broccoli.'
            ].map((s, i) => (
              <div key={i} className="mb-3">
                <div className="text-sm">{i+1}.) {s}</div>
                <div className="border-b border-slate-300 mt-2" />
              </div>
            ))}
            {showAnswersForDoc('grammar-detective', () => (
              <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                <div className="font-semibold mb-1">Answer key</div>
                <ol className="list-decimal list-inside space-y-0.5">
                  <li>We go to the park every Saturday.</li>
                  <li>The cats are sleeping under the table.</li>
                  <li>I can run faster than my friend.</li>
                  <li>There are two pencils on the desk.</li>
                  <li>She doesn't like broccoli.</li>
                </ol>
              </div>
            ))}
          </section>
        )}

        {activeDocs.includes('color-by-number') && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">🖍️ Color‑by‑Number</h2>
            <p className="text-slate-600 text-sm mb-3">Use the legend to color the grid. Reveal the hidden scene!</p>
            <div className="flex items-start gap-6">
              <div className="inline-grid grid-cols-16 gap-[2px] text-[10px] font-mono">
                {Array.from({length: 16*16}).map((_,i)=> (
                  <div key={i} className="w-5 h-5 border border-slate-300 rounded-[2px] flex items-center justify-center bg-white">
                    {(i*7 + i%5)%4 + 1}
                  </div>
                ))}
              </div>
              <div className="text-xs text-slate-700">
                <div className="font-semibold mb-1">Legend</div>
                <ul className="space-y-1">
                  <li>1 = Yellow</li>
                  <li>2 = Blue</li>
                  <li>3 = Green</li>
                  <li>4 = Red</li>
                </ul>
              </div>
            </div>
          </section>
        )}

        {activeDocs.includes('bookmark-templates') && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">📚 DIY Bookmark Templates</h2>
            <p className="text-slate-600 text-sm mb-3">Cut along the dotted lines. Decorate with doodles and colors. Add your name on the back!</p>
            <div className="grid grid-cols-3 gap-4">
              {['Be Kind','Keep Reading','Dream Big'].map((t,i)=> (
                <div key={i} className="relative h-64 border border-slate-400 rounded bg-white">
                  <div className="absolute inset-0 border-2 border-dashed border-slate-300 m-2 rounded" />
                  <div className="flex items-center justify-center h-full text-slate-700 font-semibold">{t}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeDocs.includes('design-monster') && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">👾 Design Your Monster</h2>
            <p className="text-slate-600 text-sm mb-3">Draw inside the box and give your monster a name. Check the features you used.</p>
            <div className="h-64 border border-slate-400 rounded bg-white mb-3" />
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="font-semibold text-slate-800 mb-1">Features</div>
                <div className="grid grid-cols-2 gap-1 text-slate-700">
                  {['Horns','Spots','Stripes','Furry','Scales','One eye','Three eyes','Big teeth'].map((f)=> (
                    <label key={f} className="inline-flex items-center gap-2"><span className="w-3 h-3 border border-slate-400 inline-block"/> {f}</label>
                  ))}
                </div>
              </div>
              <div>
                <div className="font-semibold text-slate-800 mb-1">Monster Name</div>
                <div className="border-b border-slate-400 h-6" />
              </div>
            </div>
          </section>
        )}

        {activeDocs.includes('draw-half') && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">✏️ Draw the Missing Half</h2>
            <p className="text-slate-600 text-sm mb-3">Copy the right side to complete each picture. Use the grid as a guide.</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <svg viewBox="0 0 220 220" className="w-full h-auto bg-white border border-slate-300">
                <defs>
                  <pattern id="g1" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M20 0 H0 V20" fill="none" stroke="#e5e7eb" strokeWidth="1" />
                  </pattern>
                  <clipPath id="half1"><rect x="0" y="0" width="110" height="220" /></clipPath>
                </defs>
                <rect x="0" y="0" width="220" height="220" fill="url(#g1)" />
                <g clipPath="url(#half1)">
                  <path d="M40 110 C70 40, 150 40, 180 110 C150 180, 70 180, 40 110 Z" fill="none" stroke="#111827" strokeWidth="3" />
                </g>
                <line x1="110" y1="0" x2="110" y2="220" stroke="#9ca3af" strokeDasharray="4 4" />
              </svg>
              <svg viewBox="0 0 220 220" className="w-full h-auto bg-white border border-slate-300">
                <defs>
                  <pattern id="g2" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M20 0 H0 V20" fill="none" stroke="#e5e7eb" strokeWidth="1" />
                  </pattern>
                  <clipPath id="half2"><rect x="0" y="0" width="110" height="220" /></clipPath>
                </defs>
                <rect x="0" y="0" width="220" height="220" fill="url(#g2)" />
                <g clipPath="url(#half2)">
                  <path d="M70 180 L110 40 L150 180 Z" fill="none" stroke="#111827" strokeWidth="3" />
                </g>
                <line x1="110" y1="0" x2="110" y2="220" stroke="#9ca3af" strokeDasharray="4 4" />
              </svg>
              {/* Four more prompts */}
              {[
                (id: string) => (
                  <svg key={id} viewBox="0 0 220 220" className="w-full h-auto bg-white border border-slate-300">
                    <defs>
                      <pattern id={`${id}-g`} width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M20 0 H0 V20" fill="none" stroke="#e5e7eb" strokeWidth="1" />
                      </pattern>
                      <clipPath id={`${id}-half`}><rect x="0" y="0" width="110" height="220" /></clipPath>
                    </defs>
                    <rect x="0" y="0" width="220" height="220" fill={`url(#${id}-g)`} />
                    <g clipPath={`url(#${id}-half)`}>
                      {/* Heart */}
                      <path d="M110 90 C90 50, 40 60, 40 95 C40 130, 110 160, 110 180" fill="none" stroke="#111827" strokeWidth="3" />
                    </g>
                    <line x1="110" y1="0" x2="110" y2="220" stroke="#9ca3af" strokeDasharray="4 4" />
                  </svg>
                ),
                (id: string) => (
                  <svg key={id} viewBox="0 0 220 220" className="w-full h-auto bg-white border border-slate-300">
                    <defs>
                      <pattern id={`${id}-g`} width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M20 0 H0 V20" fill="none" stroke="#e5e7eb" strokeWidth="1" />
                      </pattern>
                      <clipPath id={`${id}-half`}><rect x="0" y="0" width="110" height="220" /></clipPath>
                    </defs>
                    <rect x="0" y="0" width="220" height="220" fill={`url(#${id}-g)`} />
                    <g clipPath={`url(#${id}-half)`}>
                      {/* House */}
                      <path d="M60 120 L110 80 L160 120" fill="none" stroke="#111827" strokeWidth="3" />
                      <rect x="70" y="120" width="80" height="60" fill="none" stroke="#111827" strokeWidth="3" />
                    </g>
                    <line x1="110" y1="0" x2="110" y2="220" stroke="#9ca3af" strokeDasharray="4 4" />
                  </svg>
                ),
                (id: string) => (
                  <svg key={id} viewBox="0 0 220 220" className="w-full h-auto bg-white border border-slate-300">
                    <defs>
                      <pattern id={`${id}-g`} width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M20 0 H0 V20" fill="none" stroke="#e5e7eb" strokeWidth="1" />
                      </pattern>
                      <clipPath id={`${id}-half`}><rect x="0" y="0" width="110" height="220" /></clipPath>
                    </defs>
                    <rect x="0" y="0" width="220" height="220" fill={`url(#${id}-g)`} />
                    <g clipPath={`url(#${id}-half)`}>
                      {/* Rocket */}
                      <path d="M110 70 L130 120 L110 170 L90 120 Z" fill="none" stroke="#111827" strokeWidth="3" />
                      <circle cx="110" cy="120" r="10" fill="none" stroke="#111827" strokeWidth="3" />
                    </g>
                    <line x1="110" y1="0" x2="110" y2="220" stroke="#9ca3af" strokeDasharray="4 4" />
                  </svg>
                ),
                (id: string) => (
                  <svg key={id} viewBox="0 0 220 220" className="w-full h-auto bg-white border border-slate-300">
                    <defs>
                      <pattern id={`${id}-g`} width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M20 0 H0 V20" fill="none" stroke="#e5e7eb" strokeWidth="1" />
                      </pattern>
                      <clipPath id={`${id}-half`}><rect x="0" y="0" width="110" height="220" /></clipPath>
                    </defs>
                    <rect x="0" y="0" width="220" height="220" fill={`url(#${id}-g)`} />
                    <g clipPath={`url(#${id}-half)`}>
                      {/* Butterfly */}
                      <path d="M110 110 Q90 80 70 100 Q90 120 110 110" fill="none" stroke="#111827" strokeWidth="3" />
                      <path d="M110 130 Q90 160 70 140 Q90 120 110 130" fill="none" stroke="#111827" strokeWidth="3" />
                      <line x1="110" y1="80" x2="110" y2="150" stroke="#111827" strokeWidth="3" />
                    </g>
                    <line x1="110" y1="0" x2="110" y2="220" stroke="#9ca3af" strokeDasharray="4 4" />
                  </svg>
                ),
              ].map((fn, i) => fn(`dh-${i}`))}
            </div>
          </section>
        )}

        {activeDocs.includes('logic-grid') && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">🧩 Logic Grid Puzzle</h2>
            <p className="text-slate-600 text-sm mb-3">Mark ✓ for matches and ✗ for no match. Use the clues to solve.</p>
            <div className="overflow-x-auto">
              <table className="border-collapse">
                <thead>
                  <tr>
                    <th className="border border-slate-400 px-2 py-1 text-sm bg-slate-50"></th>
                    {['Cat','Dog','Fish'].map((h)=> (
                      <th key={h} className="border border-slate-400 px-2 py-1 text-sm bg-slate-50">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {['Liam','Ava','Noah'].map((n)=> (
                    <tr key={n}>
                      <td className="border border-slate-400 px-2 py-1 text-sm bg-slate-50">{n}</td>
                      {Array.from({length:3}).map((_,i)=> (
                        <td key={i} className="border border-slate-400 w-10 h-10"></td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-3 text-xs text-slate-700">
              <div className="font-semibold">Clues</div>
              <ol className="list-decimal list-inside space-y-1">
                <li>Liam does not own the dog.</li>
                <li>Ava’s pet swims.</li>
                <li>Noah’s pet barks.</li>
              </ol>
            </div>
            {showAnswersForDoc('logic-grid', () => (
              <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                <div className="font-semibold mb-1">Answer (unique)</div>
                <ul className="list-disc list-inside">
                  <li>Ava → Fish</li>
                  <li>Noah → Dog</li>
                  <li>Liam → Cat</li>
                </ul>
              </div>
            ))}
          </section>
        )}

        {activeDocs.includes('hidden-object') && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">🔍 Find the Hidden Object</h2>
            <p className="text-slate-600 text-sm mb-3">Find and circle each item hidden in the scene below.</p>
            <div className="mb-3">
              <HiddenObjectsSceneSVGA />
            </div>
            <ul className="grid grid-cols-2 gap-2 text-sm text-slate-700">
              {['Key','Apple','Star','Leaf','Car','Book','Shell','Cloud','Ball','Hat'].map((x)=> (<li key={x}>☐ {x}</li>))}
            </ul>
          </section>
        )}

        {activeDocs.includes('maze-focus') && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">🌀 Maze of Focus</h2>
            <p className="text-slate-600 text-sm mb-3">Follow the steps from START to FINISH. Skip distractions!</p>
            <div className="grid grid-cols-4 gap-2 text-sm">
              {['START','Deep breath','Phone buzz (skip)','One step','Snack break','Water sip','Chit‑chat (skip)','Stretch','Refocus','Tiny goal','Timer 10 min','FINISH','⭐ Great job!'].map((t,i)=> (
                <div key={i} className={`h-12 border rounded flex items-center justify-center ${/skip/i.test(t)?'bg-slate-50 text-slate-400':'bg-white'}`}>{t}</div>
              ))}
            </div>
            <div className="mt-4 grid md:grid-cols-3 gap-3 text-sm">
              <div className="border border-slate-200 rounded-lg p-3 bg-white print:bg-transparent print:border-0">
                <div className="font-semibold text-slate-800 mb-2">Progress checklist</div>
                <ul className="space-y-1 text-slate-700">
                  <li>☐ Started my timer</li>
                  <li>☐ Skipped one distraction</li>
                  <li>☐ Reached my tiny goal</li>
                </ul>
              </div>
              <div className="border border-slate-200 rounded-lg p-3 bg-white print:bg-transparent print:border-0">
                <div className="font-semibold text-slate-800 mb-2">Set your timer</div>
                <div className="h-6 border-b border-slate-400" />
                <div className="mt-3 font-semibold text-slate-800 mb-1">Reward</div>
                <div className="h-6 border-b border-slate-400" />
              </div>
              <div className="border border-slate-200 rounded-lg p-3 bg-white print:bg-transparent print:border-0">
                <div className="font-semibold text-slate-800 mb-2">Notes</div>
                <div className="h-6 border-b border-slate-300 mb-1" />
                <div className="h-6 border-b border-slate-300 mb-1" />
                <div className="h-6 border-b border-slate-300" />
              </div>
            </div>
          </section>
        )}

        {activeDocs.includes('gratitude-jar') && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">💌 Gratitude Jar</h2>
            <p className="text-slate-600 text-sm mb-3">Write or draw one thing you’re thankful for in each circle.</p>
            <svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid meet" className="w-full h-auto bg-white border border-slate-300">
              <g fill="none" stroke="#111827" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke">
                <path d="M120 70 H280" />
                <path d="M140 70 C140 40, 260 40, 260 70" />
                <path d="M130 70 C120 140, 120 320, 200 360 C280 320, 280 140, 270 70" />
              </g>
              {Array.from({length:18}).map((_,i)=> {
                const col = i%6
                const row = Math.floor(i/6)
                const cx = 70 + col*50
                const cy = 110 + row*60
                return <circle key={i} cx={cx} cy={cy} r={18} stroke="#9ca3af" fill="none" vectorEffect="non-scaling-stroke" />
              })}
            </svg>
          </section>
        )}

        {activeDocs.includes('mood-tracker') && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">🌈 Mood Tracker</h2>
            <p className="text-slate-600 text-sm mb-3">Color each day based on your mood. Use your own color legend.</p>
            <table className="w-full border border-slate-300">
              <thead>
                <tr className="bg-slate-50 text-sm">
                  <th className="border border-slate-300 px-2 py-1 text-left">Day</th>
                  <th className="border border-slate-300 px-2 py-1 text-left">How I felt</th>
                  <th className="border border-slate-300 px-2 py-1 text-left">Notes</th>
                </tr>
              </thead>
              <tbody>
                {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d)=> (
                  <tr key={d} className="h-10">
                    <td className="border border-slate-300 px-2">{d}</td>
                    <td className="border border-slate-300" />
                    <td className="border border-slate-300" />
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {activeDocs.includes('mandalas') && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">🕉️ Mindful Coloring Mandalas</h2>
            <p className="text-slate-600 text-sm mb-3">Color slowly. Start from the center and move outward.</p>
            <svg viewBox="0 0 400 400" className="w-full h-auto bg-white border border-slate-300">
              <g fill="none" stroke="#111827" strokeWidth="2">
                {Array.from({length:6}).map((_,i)=> (
                  <circle key={i} cx={200} cy={200} r={30 + i*25} />
                ))}
                {Array.from({length:12}).map((_,i)=> {
                  const ang = (i/12)*Math.PI*2
                  const x1 = 200 + Math.cos(ang)*40
                  const y1 = 200 + Math.sin(ang)*40
                  const x2 = 200 + Math.cos(ang)*160
                  const y2 = 200 + Math.sin(ang)*160
                  return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />
                })}
                {Array.from({length:8}).map((_,i)=> {
                  const ang = (i/8)*Math.PI*2
                  const r=110
                  const x = 200 + Math.cos(ang)*r
                  const y = 200 + Math.sin(ang)*r
                  return <polygon key={i} points={`${x},${y} ${x+8},${y+14} ${x-8},${y+14}`} />
                })}
              </g>
            </svg>
          </section>
        )}

        {activeDocs.includes('weekly-goals') && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">🗓️ My Goals for the Week</h2>
            <p className="text-slate-600 text-sm mb-3">Write 3 goals, 1 thing to try, and 1 thing you’re proud of.</p>
            {['Goal 1','Goal 2','Goal 3','Try this','Proud of'].map((t,i)=> (
              <div key={i} className="mb-3">
                <div className="text-sm font-semibold text-slate-800">{t}</div>
                <div className="h-6 border-b border-slate-400" />
              </div>
            ))}
          </section>
        )}

        {activeDocs.includes('halloween-pack') && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">🎃 Halloween Puzzle Pack</h2>
            <p className="text-slate-600 text-sm mb-3">Mini pack: word list + costume ideas + tiny maze.</p>
            <div className="grid grid-cols-2 gap-6 text-sm">
              <div>
                <div className="font-semibold mb-1">Spooky Word List</div>
                <ul className="list-disc list-inside space-y-1">
                  {['ghost','pumpkin','witch','bat','candy','mask','moon','owl'].map(w=> <li key={w}>{w}</li>)}
                </ul>
              </div>
              <div>
                <div className="font-semibold mb-1">Costume Idea Box</div>
                <div className="h-32 border border-dashed border-slate-400 rounded" />
              </div>
            </div>
            <div className="mt-6 hidden" aria-hidden>
              <div className="font-semibold mb-1 text-sm">Tiny Maze</div>
              {(() => {
                // Generated mini-maze (10x10) with far-edge FINISH; true openings at START/FINISH
                const cols = 10, rows = 10;
                const cellSize = 20;
                const pad = 14; // padding inside SVG
                const svgW = cols * cellSize + pad * 2;
                const svgH = rows * cellSize + pad * 2;
                type Walls = { t: boolean; r: boolean; b: boolean; l: boolean };
                const cells: Walls[] = Array.from({ length: cols * rows }, () => ({ t: true, r: true, b: true, l: true }));
                const visited = new Array(cols * rows).fill(false) as boolean[];
                const idx = (x: number, y: number) => y * cols + x;
                const inBounds = (x: number, y: number) => x >= 0 && y >= 0 && x < cols && y < rows;
                // Depth-first backtracker (deterministic neighbor order)
                const stack: number[] = [0];
                visited[0] = true;
                while (stack.length) {
                  const cur = stack[stack.length - 1];
                  const cx = cur % cols;
                  const cy = Math.floor(cur / cols);
                  const order: Array<{ x: number; y: number; dir: 't'|'r'|'b'|'l' }> = [
                    { x: cx, y: cy - 1, dir: 't' },
                    { x: cx + 1, y: cy, dir: 'r' },
                    { x: cx, y: cy + 1, dir: 'b' },
                    { x: cx - 1, y: cy, dir: 'l' }
                  ];
                  const neigh = order.filter(n => inBounds(n.x, n.y) && !visited[idx(n.x, n.y)]);
                  if (!neigh.length) { stack.pop(); continue; }
                  const next = neigh[0];
                  const ni = idx(next.x, next.y);
                  if (next.dir === 't') { cells[cur].t = false; cells[ni].b = false; }
                  if (next.dir === 'r') { cells[cur].r = false; cells[ni].l = false; }
                  if (next.dir === 'b') { cells[cur].b = false; cells[ni].t = false; }
                  if (next.dir === 'l') { cells[cur].l = false; cells[ni].r = false; }
                  visited[ni] = true;
                  stack.push(ni);
                }
                // BFS to pick farthest border cell (right/bottom) as FINISH
                const dist = new Array(cols * rows).fill(Infinity) as number[];
                const q: number[] = [];
                dist[0] = 0; q.push(0);
                while (q.length) {
                  const cur = q.shift()!;
                  const cx = cur % cols; const cy = Math.floor(cur / cols);
                  const here = cells[cur];
                  const tryPush = (nx: number, ny: number, open: boolean) => {
                    if (!open || !inBounds(nx, ny)) return;
                    const ni = idx(nx, ny);
                    if (dist[ni] !== Infinity) return;
                    dist[ni] = dist[cur] + 1; q.push(ni);
                  };
                  tryPush(cx, cy - 1, !here.t);
                  tryPush(cx + 1, cy, !here.r ? true : false);
                  tryPush(cx, cy + 1, !here.b);
                  tryPush(cx - 1, cy, !here.l);
                }
                let exitI = cols * rows - 1; let maxD = -1;
                for (let y = 0; y < rows; y++) {
                  const iRight = idx(cols - 1, y); if (dist[iRight] > maxD) { maxD = dist[iRight]; exitI = iRight; }
                }
                for (let x = 0; x < cols; x++) {
                  const iBottom = idx(x, rows - 1); if (dist[iBottom] > maxD) { maxD = dist[iBottom]; exitI = iBottom; }
                }
                const exitX = exitI % cols; const exitY = Math.floor(exitI / cols);
                const exitSide: 'right' | 'bottom' = exitX === cols - 1 ? 'right' : 'bottom';
                const lines: Array<{ x1: number; y1: number; x2: number; y2: number }> = [];
                for (let y = 0; y < rows; y++) {
                  for (let x = 0; x < cols; x++) {
                    const c = cells[idx(x, y)];
                    const x0 = pad + x * cellSize;
                    const y0 = pad + y * cellSize;
                    const x1 = x0 + cellSize;
                    const y1 = y0 + cellSize;
                    const isStart = x === 0 && y === 0;
                    const isExitCell = x === exitX && y === exitY;
                    if (c.t) lines.push({ x1: x0, y1: y0, x2: x1, y2: y0 });
                    if (c.l && !isStart) lines.push({ x1: x0, y1: y0, x2: x0, y2: y1 });
                    if (c.b && !(isExitCell && exitSide === 'bottom')) lines.push({ x1: x0, y1: y1, x2: x1, y2: y1 });
                    if (c.r && !(isExitCell && exitSide === 'right')) lines.push({ x1: x1, y1: y0, x2: x1, y2: y1 });
                  }
                }
                return (
                  <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full max-w-md bg-white border border-slate-300 rounded">
                    {/* outer border with openings at START and computed FINISH */}
                    <g stroke="#334155" strokeWidth={4} strokeLinecap="round">
                      {/* top border */}
                      <line x1={pad} y1={pad} x2={pad + cols * cellSize} y2={pad} />
                      {/* left border (skip start opening) */}
                      <line x1={pad} y1={pad + cellSize} x2={pad} y2={pad + rows * cellSize} />
                      {/* right border with optional gap for FINISH */}
                      {exitSide === 'right' ? (
                        <>
                          <line x1={pad + cols * cellSize} y1={pad} x2={pad + cols * cellSize} y2={pad + exitY * cellSize} />
                          <line x1={pad + cols * cellSize} y1={pad + (exitY + 1) * cellSize} x2={pad + cols * cellSize} y2={pad + rows * cellSize} />
                        </>
                      ) : (
                        <line x1={pad + cols * cellSize} y1={pad} x2={pad + cols * cellSize} y2={pad + rows * cellSize} />
                      )}
                      {/* bottom border with optional gap for FINISH */}
                      {exitSide === 'bottom' ? (
                        <>
                          <line x1={pad} y1={pad + rows * cellSize} x2={pad + exitX * cellSize} y2={pad + rows * cellSize} />
                          <line x1={pad + (exitX + 1) * cellSize} y1={pad + rows * cellSize} x2={pad + cols * cellSize} y2={pad + rows * cellSize} />
                        </>
                      ) : (
                        <line x1={pad} y1={pad + rows * cellSize} x2={pad + cols * cellSize} y2={pad + rows * cellSize} />
                      )}
                    </g>
                    {/* maze walls */}
                    {lines.map((l, i) => (
                      <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke="#334155" strokeWidth={4} strokeLinecap="round" />
                    ))}
                    {/* labels */}
                    <text x={pad - 6} y={pad - 8} fontSize="12" fill="#10B981" fontWeight={700}>START</text>
                    {exitSide === 'right' ? (
                      <text x={svgW - (pad - 8)} y={pad + exitY * cellSize + cellSize * 0.6} fontSize="12" fill="#ef4444" fontWeight={700} textAnchor="end">FINISH</text>
                    ) : (
                      <text x={pad + exitX * cellSize + cellSize * 0.5} y={svgH - (pad - 6)} fontSize="12" fill="#ef4444" fontWeight={700} textAnchor="middle">FINISH</text>
                    )}
                  </svg>
                );
              })()}
            </div>
          </section>
        )}

        {activeDocs.includes('winter-kindness') && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">❄️ Winter Kindness Challenge</h2>
            <p className="text-slate-600 text-sm mb-3">Color a square each time you complete a kind act.</p>
            <div className="grid grid-cols-5 gap-2">
              {Array.from({length:25}).map((_,i)=> (
                <div key={i} className="h-10 border border-slate-300 rounded text-[10px] p-1">Act #{i+1}</div>
              ))}
            </div>
          </section>
        )}

        {activeDocs.includes('spring-scavenger') && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">🌸 Spring Nature Scavenger Hunt</h2>
            <p className="text-slate-600 text-sm mb-3">Go outside and check off what you discover.</p>
            <ul className="grid grid-cols-2 gap-2 text-sm text-slate-700">
              {['Leaf with spots','Pink flower','Three smooth stones','Ant trail','Bird feather','Cloud shaped like an animal','Two kinds of grass','Buzzing insect','Tiny pinecone','Something yellow'].map(x=> <li key={x}>☐ {x}</li>)}
            </ul>
          </section>
        )}

        {activeDocs.includes('summer-pack') && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">☀️ Summer Adventure Pack</h2>
            <p className="text-slate-600 text-sm mb-3">A quick set for travel days: word list + maze box + drawing prompt.</p>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <ul className="list-disc list-inside space-y-1">
                {['beach','shell','sand','wave','sun','boat','crab','icecream'].map(w=> <li key={w}>{w}</li>)}
              </ul>
              <div className="h-24 border border-dashed border-slate-400 rounded" />
              <div>
                <div className="font-semibold mb-1">Draw: Your best summer day</div>
                <div className="h-24 border border-slate-300 rounded" />
              </div>
            </div>
          </section>
        )}

        {activeDocs.includes('brain-boost') && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">🧠 7‑Day Brain Boost Pack</h2>
            <p className="text-slate-600 text-sm mb-3">Do one mini‑challenge each day. Track your streak!</p>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              {['Memory pairs','Word jumble','Counting maze','Pattern copy','Quick sudoku','Riddle time','Spot the change'].map((t,i)=> <li key={i}>{t}</li>)}
            </ol>
            <div className="mt-4">
              <div className="text-sm font-semibold text-slate-800 mb-2">Streak tracker</div>
              <table className="w-full border border-slate-300 text-sm">
                <thead>
                  <tr className="bg-slate-50">
                    {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => (
                      <th key={d} className="border border-slate-300 px-2 py-1 text-center">{d}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {Array.from({length:7}).map((_,i)=> (
                      <td key={i} className="border border-slate-300 h-8 text-center align-middle">☐</td>
                    ))}
                  </tr>
                </tbody>
              </table>
              <div className="mt-3 grid md:grid-cols-2 gap-3">
                <div>
                  <div className="text-sm font-semibold text-slate-800 mb-1">What was tricky?</div>
                  <div className="h-6 border-b border-slate-400 mb-1" />
                  <div className="h-6 border-b border-slate-400" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-800 mb-1">What I nailed</div>
                  <div className="h-6 border-b border-slate-400 mb-1" />
                  <div className="h-6 border-b border-slate-400" />
                </div>
              </div>
            </div>
          </section>
        )}

        {activeDocs.includes('creative-challenge') && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">🎨 Creative Kids Challenge</h2>
            <p className="text-slate-600 text-sm mb-3">7 days of quick art prompts. Spend 5–10 minutes each.</p>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              {['Draw a robot pet','Design a flag','Invent a snack package','Doodle your name in 3 styles','Sketch a tiny house','Create a new animal','Make a comic in 3 panels'].map((t,i)=> <li key={i}>{t}</li>)}
            </ol>
          </section>
        )}

        {activeDocs.includes('ws-world') && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">🌍 Around the World Word Search</h2>
            <p className="text-slate-600 text-sm mb-3">Find all the world words hidden in the grid. Use the clue list to track your progress.</p>
            {(() => {
              const words = ['PARIS','NILE','AFRICA','ASIA','ALPS','TOKYO','ITALY','NORTH','SOUTH','RIO','BERLIN']
              return (
                <div className="md:flex md:items-start md:gap-6">
                  <div className="flex-1">
                    <div className="grid grid-cols-12 gap-[2px] font-mono text-sm bg-slate-50 p-3 rounded-lg print:bg-transparent print:p-0">
                    {generateWordSearchGrid(12, [...words], makeRng(`${effectiveSeed}|ws-world|main|v${variant}`)).map((row, r) => (
                        <React.Fragment key={r}>
                          {row.map((ch, c) => (
                            <div key={c} className="w-6 h-6 border border-slate-300 flex items-center justify-center rounded-sm">{ch}</div>
                          ))}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 md:w-64 border border-slate-200 rounded-lg p-3 bg-white print:bg-transparent print:border-0">
                    <div className="text-sm font-semibold text-slate-800 mb-2">Clue words</div>
                    <ul className="text-sm text-slate-700 space-y-1">
                      {words.map(w => (<li key={w}>☐ {w}</li>))}
                    </ul>
                  </div>
                </div>
              )
            })()}
          </section>
        )}

        {activeDocs.includes('animal-pack') && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">🦁 Animal Adventure Pack</h2>
            <p className="text-slate-600 text-sm mb-3">Mix of animal‑themed puzzles to print and enjoy.</p>
            <div className="grid md:grid-cols-2 gap-4">
              {/* Mini maze */}
              <div>
                <div className="text-sm font-semibold text-slate-800 mb-2">Mini maze: Help the cub reach its den</div>
                {(() => {
                  // Harder mini-maze (10x10) with farthest-edge DEN from START (0,0)
                  const cols = 10, rows = 10;
                  const cellSize = 20;
                  const pad = 14;
                  const svgW = cols * cellSize + pad * 2;
                  const svgH = rows * cellSize + pad * 2;
                  type Walls = { t: boolean; r: boolean; b: boolean; l: boolean };
                  const cells: Walls[] = Array.from({ length: cols * rows }, () => ({ t: true, r: true, b: true, l: true }));
                  const visited = new Array(cols * rows).fill(false) as boolean[];
                  const idx = (x: number, y: number) => y * cols + x;
                  const inBounds = (x: number, y: number) => x >= 0 && y >= 0 && x < cols && y < rows;
                  // Depth-first backtracker (deterministic neighbor order)
                  const stack: number[] = [0];
                  visited[0] = true;
                  while (stack.length) {
                    const cur = stack[stack.length - 1];
                    const cx = cur % cols; const cy = Math.floor(cur / cols);
                    const order: Array<{ x: number; y: number; dir: 't'|'r'|'b'|'l' }> = [
                      { x: cx, y: cy - 1, dir: 't' },
                      { x: cx + 1, y: cy, dir: 'r' },
                      { x: cx, y: cy + 1, dir: 'b' },
                      { x: cx - 1, y: cy, dir: 'l' }
                    ];
                    const neigh = order.filter(n => inBounds(n.x, n.y) && !visited[idx(n.x, n.y)]);
                    if (!neigh.length) { stack.pop(); continue; }
                    const next = neigh[0];
                    const ni = idx(next.x, next.y);
                    if (next.dir === 't') { cells[cur].t = false; cells[ni].b = false; }
                    if (next.dir === 'r') { cells[cur].r = false; cells[ni].l = false; }
                    if (next.dir === 'b') { cells[cur].b = false; cells[ni].t = false; }
                    if (next.dir === 'l') { cells[cur].l = false; cells[ni].r = false; }
                    visited[ni] = true;
                    stack.push(ni);
                  }
                  // BFS to locate farthest border cell on right/bottom
                  const dist = new Array(cols * rows).fill(Infinity) as number[];
                  const q: number[] = [];
                  dist[0] = 0; q.push(0);
                  while (q.length) {
                    const cur = q.shift()!;
                    const cx = cur % cols; const cy = Math.floor(cur / cols);
                    const here = cells[cur];
                    const tryPush = (nx: number, ny: number, open: boolean) => {
                      if (!open || !inBounds(nx, ny)) return;
                      const ni = idx(nx, ny);
                      if (dist[ni] !== Infinity) return;
                      dist[ni] = dist[cur] + 1; q.push(ni);
                    };
                    tryPush(cx, cy - 1, !here.t);
                    tryPush(cx + 1, cy, !here.r ? true : false);
                    tryPush(cx, cy + 1, !here.b);
                    tryPush(cx - 1, cy, !here.l);
                  }
                  let exitI = cols * rows - 1; let maxD = -1;
                  for (let y = 0; y < rows; y++) {
                    const iRight = idx(cols - 1, y); if (dist[iRight] > maxD) { maxD = dist[iRight]; exitI = iRight; }
                  }
                  for (let x = 0; x < cols; x++) {
                    const iBottom = idx(x, rows - 1); if (dist[iBottom] > maxD) { maxD = dist[iBottom]; exitI = iBottom; }
                  }
                  const exitX = exitI % cols; const exitY = Math.floor(exitI / cols);
                  const exitSide: 'right' | 'bottom' = exitX === cols - 1 ? 'right' : 'bottom';
                  const lines: Array<{ x1: number; y1: number; x2: number; y2: number }> = [];
                  for (let y = 0; y < rows; y++) {
                    for (let x = 0; x < cols; x++) {
                      const c = cells[idx(x, y)];
                      const x0 = pad + x * cellSize; const y0 = pad + y * cellSize;
                      const x1 = x0 + cellSize; const y1 = y0 + cellSize;
                      const isStart = x === 0 && y === 0;
                      const isExitCell = x === exitX && y === exitY;
                      if (c.t) lines.push({ x1: x0, y1: y0, x2: x1, y2: y0 });
                      if (c.l && !isStart) lines.push({ x1: x0, y1: y0, x2: x0, y2: y1 });
                      if (c.b && !(isExitCell && exitSide === 'bottom')) lines.push({ x1: x0, y1: y1, x2: x1, y2: y1 });
                      if (c.r && !(isExitCell && exitSide === 'right')) lines.push({ x1: x1, y1: y0, x2: x1, y2: y1 });
                    }
                  }
                  return (
                    <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full max-w-md bg-white border border-slate-300 rounded">
                      {/* outer border with openings at START and computed DEN */}
                      <g stroke="#334155" strokeWidth={4} strokeLinecap="round">
                        {/* top border */}
                        <line x1={pad} y1={pad} x2={pad + cols * cellSize} y2={pad} />
                        {/* left border (skip start opening) */}
                        <line x1={pad} y1={pad + cellSize} x2={pad} y2={pad + rows * cellSize} />
                        {/* right border with optional gap for DEN */}
                        {exitSide === 'right' ? (
                          <>
                            <line x1={pad + cols * cellSize} y1={pad} x2={pad + cols * cellSize} y2={pad + exitY * cellSize} />
                            <line x1={pad + cols * cellSize} y1={pad + (exitY + 1) * cellSize} x2={pad + cols * cellSize} y2={pad + rows * cellSize} />
                          </>
                        ) : (
                          <line x1={pad + cols * cellSize} y1={pad} x2={pad + cols * cellSize} y2={pad + rows * cellSize} />
                        )}
                        {/* bottom border with optional gap for DEN */}
                        {exitSide === 'bottom' ? (
                          <>
                            <line x1={pad} y1={pad + rows * cellSize} x2={pad + exitX * cellSize} y2={pad + rows * cellSize} />
                            <line x1={pad + (exitX + 1) * cellSize} y1={pad + rows * cellSize} x2={pad + cols * cellSize} y2={pad + rows * cellSize} />
                          </>
                        ) : (
                          <line x1={pad} y1={pad + rows * cellSize} x2={pad + cols * cellSize} y2={pad + rows * cellSize} />
                        )}
                      </g>
                      {/* maze walls */}
                      {lines.map((l, i) => (
                        <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke="#334155" strokeWidth={4} strokeLinecap="round" />
                      ))}
                      {/* labels */}
                      <text x={pad - 6} y={pad - 8} fontSize="12" fill="#10B981" fontWeight={700}>START</text>
                      {exitSide === 'right' ? (
                        <text x={svgW - (pad - 8)} y={pad + exitY * cellSize + cellSize * 0.6} fontSize="12" fill="#ef4444" fontWeight={700} textAnchor="end">DEN</text>
                      ) : (
                        <text x={pad + exitX * cellSize + cellSize * 0.5} y={svgH - (pad - 6)} fontSize="12" fill="#ef4444" fontWeight={700} textAnchor="middle">DEN</text>
                      )}
                    </svg>
                  );
                })()}
              </div>
              {/* Word list with checkboxes */}
              <div className="md:pl-2">
                <div className="text-sm font-semibold text-slate-800 mb-2">Word list</div>
                <div className="border border-slate-200 rounded-lg p-3 bg-white print:bg-transparent print:border-0">
                  <ul className="text-sm text-slate-700 space-y-1 columns-2 md:columns-1">
                    {['lion','zebra','panda','eagle','whale','koala'].map(w => (
                      <li key={w}>☐ {w}</li>
                    ))}
                  </ul>
                  <div className="mt-3 text-sm">
                    <div className="font-semibold text-slate-800 mb-1">Pick two animals to combine</div>
                    <div className="flex items-center gap-3 mb-1">
                      <span>☐</span>
                      <div className="flex-1 border-b border-slate-400" />
                    </div>
                    <div className="flex items-center gap-3">
                      <span>☐</span>
                      <div className="flex-1 border-b border-slate-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Draw challenge */}
            <div className="mt-4">
              <div className="text-sm font-semibold text-slate-800 mb-2">Draw challenge: Create your own creature</div>
              <div className="h-64 sm:h-72 print:h-[26rem] border border-slate-300 rounded bg-white" />
              <div className="mt-2 text-sm font-semibold text-slate-800">Creature name</div>
              <div className="h-6 border-b border-slate-400" />
            </div>
          </section>
        )}

        {(!doc || activeDocs.includes('ws-animals')) && (
        <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
          <h2 className="text-lg font-bold text-slate-900">🧠 Word Search – Animals</h2>
          <p className="text-slate-600 text-sm mb-3">Find 12 animal names. Circle horizontally, vertically, or diagonally.</p>
          <div className="grid grid-cols-12 gap-[2px] font-mono text-sm bg-slate-50 p-3 rounded-lg print:bg-transparent print:p-0">
            {generateWordSearchGrid(12, ["DOG","CAT","LION","BEAR","WOLF","SEAL","FROG","EAGLE","MOUSE","HORSE","ZEBRA","SNAKE"], makeRng(`${effectiveSeed}|ws-animals|main|v${variant}`)).map((row, r) => (
              <React.Fragment key={r}>
                {row.map((ch, c) => (
                  <div key={c} className="w-6 h-6 border border-slate-300 flex items-center justify-center rounded-sm">{ch}</div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </section>
        )}

        {activeDocs.includes('ws-space') && (
        <section className="mb-10 break-inside-avoid">
          <h2 className="text-lg font-bold text-slate-900">🧠 Word Search – Space</h2>
          <p className="text-slate-600 text-sm mb-3">Find 12 space words. Circle horizontally, vertically, or diagonally.</p>
          <div className="grid grid-cols-12 gap-1 font-mono text-sm">
            {generateWordSearchGrid(12, ["STAR","MOON","SUN","COMET","ORBIT","SPACE","ALIEN","ROVER","MARS","VENUS","NEBULA","ASTRO"], makeRng(`${effectiveSeed}|ws-space|main|v${variant}`)).map((row, r) => (
              <React.Fragment key={r}>
                {row.map((ch, c) => (
                  <div key={c} className="w-6 h-6 border border-slate-300 flex items-center justify-center">{ch}</div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </section>
        )}

        {(!doc || activeDocs.includes('sudoku4')) && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">🔢 Sudoku – 4×4 (Easy)</h2>
            <p className="text-slate-600 text-sm mb-3">Fill numbers 1–4 so each row/column contains all numbers with no repeats.</p>
            <div className="inline-grid grid-cols-4 gap-0 bg-slate-50 p-3 rounded-lg print:bg-transparent print:p-0 relative">
              {/* visual subgrid lines */}
              <div className="pointer-events-none absolute inset-3 grid grid-cols-2 grid-rows-2">
                <div className="border-2 border-slate-400/60" />
                <div className="border-2 border-slate-400/60" />
                <div className="border-2 border-slate-400/60" />
                <div className="border-2 border-slate-400/60" />
              </div>
              {(() => {
                const rng = makeRng(`${effectiveSeed}|s4|v${variant}`)
                const data = genSudoku(4, 2, 2, rng, 8, 12)
                const grid = (showAnswers ? data.solution : data.puzzle).flat()
                return grid.map((val: number | null, i: number) => (
                  <div key={i} className="w-10 h-10 border border-slate-400 flex items-center justify-center">
                    {val != null ? <span className="font-semibold text-slate-900">{val}</span> : null}
                  </div>
                ))
              })()}
            </div>
            <div className="mt-3 text-slate-700 text-sm">
              <div className="font-medium mb-1">Clues</div>
              <ul className="list-disc list-inside space-y-0.5">
                <li>Start with rows or columns that already have more numbers.</li>
                <li>Look for missing numbers in each 2×2 box.</li>
                <li>Use elimination: if 1 and 2 exist in a row, place 3 or 4.</li>
              </ul>
            </div>
          </section>
        )}

        {activeDocs.includes('sudoku6') && (
        <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
          <h2 className="text-lg font-bold text-slate-900">🔢 Sudoku – 6×6 (Medium)</h2>
          <p className="text-slate-600 text-sm mb-3">Fill numbers 1–6 so each row/column contains all numbers with no repeats.</p>
          <div className="inline-grid grid-cols-6 gap-0 bg-slate-50 p-3 rounded-lg print:bg-transparent print:p-0 relative">
            {/* visual subgrid lines (3×2 boxes) */}
            <div className="pointer-events-none absolute inset-3 grid grid-cols-3 grid-rows-2">
              <div className="border-2 border-slate-400/60" />
              <div className="border-2 border-slate-400/60" />
              <div className="border-2 border-slate-400/60" />
              <div className="border-2 border-slate-400/60" />
              <div className="border-2 border-slate-400/60" />
              <div className="border-2 border-slate-400/60" />
            </div>
            {(() => {
              const rng = makeRng(`${effectiveSeed}|s6|v${variant}`)
              const data = genSudoku(6, 2, 3, rng, 18, 24)
              const grid = (showAnswers ? data.solution : data.puzzle).flat()
              return grid.map((val: number | null, i: number) => (
                <div key={i} className="w-10 h-10 border border-slate-400 flex items-center justify-center">
                  {val != null ? <span className="font-semibold text-slate-900">{val}</span> : null}
                </div>
              ))
            })()}
          </div>
          <div className="mt-3 text-slate-700 text-sm">
            <div className="font-medium mb-1">Clues</div>
            <ul className="list-disc list-inside space-y-0.5">
              <li>Check each 3×2 box: fill the only spot a number can go.</li>
              <li>Scan for singles: if a row is missing only “5”, place it.</li>
              <li>Use pencil marks lightly (mentally) to eliminate options.</li>
            </ul>
          </div>
        </section>
        )}

        {activeDocs.includes('coloring') && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">🎨 Coloring Page – Cute Animal</h2>
            <p className="text-slate-600 text-sm mb-3">Print and color the outline below.</p>
            <div className="border border-slate-300 rounded p-4 bg-white print:border-0 print:p-0">
              <ColoringSVG />
            </div>
          </section>
        )}

        {activeDocs.includes('coloring-letters-numbers') && (
          <section className="mb-10 print:mb-0 break-inside-avoid print:break-inside-auto border border-slate-200 rounded-xl p-4 print:border-0 print:p-0" style={{ pageBreakInside: 'auto' } as any}>
            <h2 className="text-lg font-bold text-slate-900 print:hidden">🔢 Alphabet & Number Coloring Pages</h2>
            <p className="text-slate-600 text-sm mb-3 print:hidden">A–Z animals and 1–10 rockets — trace, color, and learn letters and numbers.</p>
            {/* A–Z Letters grid (large) */}
            <div className="mb-8 grid grid-cols-3 sm:grid-cols-4 gap-6 print:gap-4">
              {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((ch, i) => (
                <div key={i} className="aspect-square min-h-[180px] sm:min-h-[220px] border border-slate-300 rounded bg-white flex items-center justify-center">
                  <svg viewBox="0 0 200 200" className="w-full h-full">
                    <text x="100" y="135" textAnchor="middle" fontSize="120" fill="none" stroke="#111827" strokeWidth="4">{ch}</text>
                  </svg>
                </div>
              ))}
            </div>
            {/* 1–10 Numbers with rocket icon (large) */}
            <div className="grid grid-cols-5 sm:grid-cols-5 gap-6 print:gap-4">
              {Array.from({ length: 10 }, (_, idx) => idx + 1).map((n) => (
                <div key={n} className="aspect-square min-h-[180px] sm:min-h-[220px] border border-slate-300 rounded bg-white flex items-center justify-center">
                  <svg viewBox="0 0 200 200" className="w-full h-full">
                    <text x="70" y="135" textAnchor="middle" fontSize="96" fill="none" stroke="#111827" strokeWidth="4">{n}</text>
                    {/* small rocket */}
                    <g fill="none" stroke="#111827" strokeWidth="4">
                      <path d="M120 70 L140 110 L120 150 L100 110 Z" />
                      <circle cx="120" cy="110" r="8" />
                      <path d="M100 150 L120 170 L140 150" />
                    </g>
                  </svg>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeDocs.includes('coloring-animals') && (
          <section className="mb-10 border border-slate-200 rounded-xl p-4 print:border-0 print:p-0" style={{ breakInside: 'auto' as any, pageBreakInside: 'auto' as any }}>
            <h2 className="text-lg font-bold text-slate-900">🦁 Animal Friends Coloring Pages</h2>
            <p className="text-slate-600 text-sm mb-3">Meet our friendly jungle and sea animals — lions, pandas, dolphins, and more. Ages 5–10.</p>
            <div className="mb-3 print:hidden">
              <button
                onClick={() => {
                  try {
                    // Fallback: open print; most browsers offer Save as PDF
                    window.print();
                  } catch {}
                }}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm"
                aria-label="Download as PDF"
                title="Download as PDF (uses your browser's Save as PDF)"
              >
                <span>⬇️</span>
                <span>Download PDF</span>
              </button>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="border border-slate-300 rounded p-4 bg-white">
                {/* Lion */}
                <svg viewBox="0 0 400 300" className="w-full h-auto" aria-hidden>
                  <g fill="none" stroke="#111827" strokeWidth="4">
                    <circle cx="200" cy="150" r="70" />
                    <circle cx="200" cy="150" r="95" strokeDasharray="8 8" />
                    <circle cx="175" cy="140" r="8" />
                    <circle cx="225" cy="140" r="8" />
                    <path d="M190 165 Q200 175 210 165" />
                    <path d="M145 200 Q200 220 255 200" />
                  </g>
                </svg>
              </div>
              <div className="border border-slate-300 rounded p-4 bg-white">
                {/* Turtle */}
                <svg viewBox="0 0 400 300" className="w-full h-auto" aria-hidden>
                  <g fill="none" stroke="#111827" strokeWidth="4">
                    <ellipse cx="200" cy="180" rx="80" ry="45" />
                    <circle cx="120" cy="175" r="20" />
                    <line x1="155" y1="200" x2="135" y2="220" />
                    <line x1="245" y1="200" x2="265" y2="220" />
                    <line x1="180" y1="220" x2="170" y2="240" />
                    <line x1="220" y1="220" x2="230" y2="240" />
                  </g>
                </svg>
              </div>
              <div className="border border-slate-300 rounded p-4 bg-white">
                {/* Dolphin */}
                <svg viewBox="0 0 400 300" className="w-full h-auto" aria-hidden>
                  <g fill="none" stroke="#111827" strokeWidth="4">
                    <path d="M60 180 C120 80, 260 80, 320 160 C250 140, 180 180, 120 190 Z" />
                    <path d="M120 190 L90 215 L140 205 Z" />
                    <circle cx="260" cy="145" r="5" />
                    <path d="M300 160 L340 160 L320 180 Z" />
                  </g>
                </svg>
              </div>
              <div className="border border-slate-300 rounded p-4 bg-white">
                {/* Elephant */}
                <svg viewBox="0 0 400 300" className="w-full h-auto" aria-hidden>
                  <g fill="none" stroke="#111827" strokeWidth="4">
                    <path d="M90 200 C120 120, 260 120, 300 190 C270 210, 200 220, 140 210 Z" />
                    <circle cx="260" cy="165" r="6" />
                    <path d="M110 190 Q100 210 120 220" />
                  </g>
                </svg>
              </div>
              <div className="border border-slate-300 rounded p-4 bg-white">
                {/* Fish */}
                <svg viewBox="0 0 400 300" className="w-full h-auto" aria-hidden>
                  <g fill="none" stroke="#111827" strokeWidth="4">
                    <path d="M120 160 C180 120, 240 120, 300 160 C240 200, 180 200, 120 160 Z" />
                    <path d="M120 160 L90 145 L95 175 Z" />
                    <circle cx="260" cy="160" r="5" />
                  </g>
                </svg>
              </div>
              <div className="border border-slate-300 rounded p-4 bg-white">
                {/* Bird */}
                <svg viewBox="0 0 400 300" className="w-full h-auto" aria-hidden>
                  <g fill="none" stroke="#111827" strokeWidth="4">
                    <path d="M90 190 C140 150, 220 150, 270 190" />
                    <path d="M180 170 L210 150 L200 190 Z" />
                    <circle cx="280" cy="180" r="4" />
                  </g>
                </svg>
              </div>
            </div>
          </section>
        )}

        {activeDocs.includes('coloring-nature') && (
          <section className="mb-10 border border-slate-200 rounded-xl p-4 print:border-0 print:p-0" style={{ breakInside: 'auto' as any, pageBreakInside: 'auto' as any }}>
            <h2 className="text-lg font-bold text-slate-900">🌼 Nature & Seasons Coloring Pack</h2>
            <p className="text-slate-600 text-sm mb-3">Color flowers, trees, rainbows, and seasonal scenes (spring to winter).</p>
            <div className="grid sm:grid-cols-2 gap-6 print:grid-cols-1">
              <div className="border border-slate-300 rounded p-4 bg-white">
                {/* Flower */}
                <svg viewBox="0 0 400 300" className="w-full h-auto" aria-hidden>
                  <g fill="none" stroke="#111827" strokeWidth="3.5">
                    <circle cx="200" cy="130" r="14" />
                    <circle cx="235" cy="130" r="18" />
                    <circle cx="165" cy="130" r="18" />
                    <circle cx="200" cy="95" r="18" />
                    <circle cx="200" cy="165" r="18" />
                    <path d="M200 144 L200 230" />
                    <path d="M200 200 Q230 220 250 240" />
                  </g>
                </svg>
              </div>
              <div className="border border-slate-300 rounded p-4 bg-white">
                {/* Leaf (large) */}
                <svg viewBox="0 0 400 300" className="w-full h-auto" aria-hidden>
                  <g fill="none" stroke="#111827" strokeWidth="3.5">
                    <path d="M120 220 C200 120, 300 120, 280 220 C220 240, 180 240, 120 220 Z" />
                    <path d="M200 220 L200 150" />
                  </g>
                </svg>
              </div>
              <div className="border border-slate-300 rounded p-4 bg-white">
                {/* Tree */}
                <svg viewBox="0 0 400 300" className="w-full h-auto" aria-hidden>
                  <g fill="none" stroke="#111827" strokeWidth="3.5">
                    <rect x="185" y="180" width="30" height="60" />
                    <circle cx="200" cy="150" r="22" />
                    <circle cx="170" cy="165" r="20" />
                    <circle cx="230" cy="165" r="20" />
                  </g>
                </svg>
              </div>
              <div className="border border-slate-300 rounded p-4 bg-white">
                {/* Rainbow */}
                <svg viewBox="0 0 400 300" className="w-full h-auto" aria-hidden>
                  <g fill="none" stroke="#111827" strokeWidth="3.5">
                    <path d="M80 220 Q200 100 320 220" />
                    <path d="M100 220 Q200 120 300 220" />
                    <path d="M120 220 Q200 140 280 220" />
                  </g>
                </svg>
              </div>
              <div className="border border-slate-300 rounded p-4 bg-white">
                {/* Mountain */}
                <svg viewBox="0 0 400 300" className="w-full h-auto" aria-hidden>
                  <g fill="none" stroke="#111827" strokeWidth="3.5">
                    <path d="M60 220 L160 120 L200 180 L240 140 L340 220 Z" />
                  </g>
                </svg>
              </div>
              <div className="border border-slate-300 rounded p-4 bg-white">
                {/* Sun */}
                <svg viewBox="0 0 400 300" className="w-full h-auto" aria-hidden>
                  <g fill="none" stroke="#111827" strokeWidth="3.5">
                    <circle cx="200" cy="140" r="24" />
                    {Array.from({length:12}).map((_,i)=>{const a=i*Math.PI*2/12;return <line key={i} x1={200} y1={140} x2={200+Math.cos(a)*50} y2={140+Math.sin(a)*50} />})}
                  </g>
                </svg>
              </div>
            </div>
          </section>
        )}

        {activeDocs.includes('coloring-space') && (
          <section className="mb-10 print:mb-0 break-inside-avoid print:break-inside-auto border border-slate-200 rounded-xl p-4 print:border-0 print:p-0" style={{ pageBreakInside: 'auto' } as any}>
            <h2 className="text-lg font-bold text-slate-900 print:hidden">🚀 Space Adventure Coloring Pages</h2>
            <p className="text-slate-600 text-sm mb-3 print:hidden">Rockets, planets, and astronauts. Great for science week or STEM lessons.</p>
            {/* Enlarge coloring pages: single column, generous spacing for easy coloring/printing */}
            <div className="grid grid-cols-1 gap-8 print:gap-0">
              <div className="border border-slate-300 rounded p-6 bg-white print:p-0 print:m-0 print:border-0 print:rounded-none">
                {/* Rocket - large coloring page */}
                <svg viewBox="0 0 850 1100" className="w-full h-auto" aria-hidden>
                  <g fill="none" stroke="#111827" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
                    {/* Nose cone */}
                    <polygon points="325,150 425,80 525,150" />
                    {/* Body */}
                    <rect x="325" y="150" width="200" height="500" rx="100" />
                    {/* Windows */}
                    <circle cx="425" cy="300" r="60" />
                    <circle cx="425" cy="420" r="35" />
                    {/* Fins */}
                    <polygon points="325,500 275,650 325,650" />
                    <polygon points="525,500 575,650 525,650" />
                    {/* Flames */}
                    <polygon points="425,650 380,750 425,850 470,750" />
                    {/* Stripes */}
                    <rect x="325" y="520" width="200" height="20" />
                    <rect x="325" y="560" width="200" height="20" />
                    {/* Stars background */}
                    <circle cx="120" cy="220" r="8" />
                    <circle cx="700" cy="260" r="8" />
                    <circle cx="660" cy="720" r="8" />
                    <circle cx="160" cy="800" r="8" />
                  </g>
                </svg>
              </div>
              <div className="border border-slate-300 rounded p-6 bg-white print:p-0 print:m-0 print:border-0 print:rounded-none">
                {/* Comet - large coloring page */}
                <svg viewBox="0 0 850 1100" className="w-full h-auto" aria-hidden>
                  <g fill="none" stroke="#111827" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
                    {/* Head */}
                    <circle cx="620" cy="300" r="80" />
                    {/* Tail (layered) */}
                    <polygon points="120,740 300,560 520,420 560,460 340,600 150,780" />
                    <polygon points="100,680 280,520 500,400 520,430 300,570 130,730" />
                    {/* Sparkles */}
                    <polygon points="200,260 210,290 240,300 210,310 200,340 190,310 160,300 190,290" />
                    <polygon points="700,700 710,720 730,730 710,740 700,760 690,740 670,730 690,720" />
                  </g>
                </svg>
              </div>
              <div className="border border-slate-300 rounded p-6 bg-white print:p-0 print:m-0 print:border-0 print:rounded-none">
                {/* Planet with rings - large coloring page */}
                <svg viewBox="0 0 850 1100" className="w-full h-auto" aria-hidden>
                  <g fill="none" stroke="#111827" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
                    {/* Planet */}
                    <circle cx="425" cy="550" r="250" />
                    {/* Rings (band between two ellipses) */}
                    <ellipse cx="425" cy="550" rx="360" ry="90" />
                    <ellipse cx="425" cy="550" rx="300" ry="70" />
                    {/* Surface stripes */}
                    <path d="M230 500 C 320 470, 530 470, 620 500" />
                    <path d="M220 560 C 320 590, 530 590, 630 560" />
                    <path d="M260 620 C 360 650, 490 650, 590 620" />
                  </g>
                </svg>
              </div>
              <div className="border border-slate-300 rounded p-6 bg-white print:p-0 print:m-0 print:border-0 print:rounded-none">
                {/* Astronaut - large coloring page */}
                <svg viewBox="0 0 850 1100" className="w-full h-auto" aria-hidden>
                  <g fill="none" stroke="#111827" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
                    {/* Helmet */}
                    <circle cx="425" cy="250" r="180" />
                    <rect x="320" y="220" width="210" height="80" rx="20" />
                    {/* Torso */}
                    <rect x="325" y="430" width="200" height="220" rx="30" />
                    {/* Arms */}
                    <rect x="255" y="450" width="60" height="160" rx="20" />
                    <rect x="535" y="450" width="60" height="160" rx="20" />
                    {/* Controls */}
                    <circle cx="385" cy="520" r="18" />
                    <circle cx="465" cy="520" r="18" />
                    <rect x="365" y="560" width="120" height="40" rx="10" />
                    {/* Legs */}
                    <rect x="345" y="660" width="60" height="160" rx="20" />
                    <rect x="445" y="660" width="60" height="160" rx="20" />
                  </g>
                </svg>
              </div>
              <div className="border border-slate-300 rounded p-6 bg-white print:p-0 print:m-0 print:border-0 print:rounded-none">
                {/* Satellite - large coloring page */}
                <svg viewBox="0 0 850 1100" className="w-full h-auto" aria-hidden>
                  <g fill="none" stroke="#111827" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
                    {/* Body */}
                    <rect x="370" y="450" width="110" height="110" rx="10" />
                    {/* Panels */}
                    <rect x="160" y="440" width="180" height="130" rx="8" />
                    <rect x="540" y="440" width="180" height="130" rx="8" />
                    {/* Grid lines */}
                    <line x1="210" y1="440" x2="210" y2="570" />
                    <line x1="260" y1="440" x2="260" y2="570" />
                    <line x1="160" y1="490" x2="340" y2="490" />
                    <line x1="590" y1="440" x2="590" y2="570" />
                    <line x1="640" y1="440" x2="640" y2="570" />
                    <line x1="540" y1="490" x2="720" y2="490" />
                    {/* Antenna */}
                    <line x1="425" y1="450" x2="425" y2="380" />
                    <circle cx="425" cy="360" r="14" />
                  </g>
                </svg>
              </div>
              <div className="border border-slate-300 rounded p-6 bg-white print:p-0 print:m-0 print:border-0 print:rounded-none">
                {/* Star cluster - large coloring page */}
                <svg viewBox="0 0 850 1100" className="w-full h-auto" aria-hidden>
                  <g fill="none" stroke="#111827" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
                    {/* Large stars */}
                    <polygon points="200,200 230,270 305,280 245,330 260,400 200,360 140,400 155,330 95,280 170,270" />
                    <polygon points="640,260 670,330 745,340 685,390 700,460 640,420 580,460 595,390 535,340 610,330" />
                    {/* Medium stars */}
                    <polygon points="400,750 420,790 465,800 430,830 440,870 400,845 360,870 370,830 335,800 380,790" />
                    <polygon points="220,760 235,790 270,795 245,815 250,850 220,830 190,850 195,815 170,795 205,790" />
                  </g>
                </svg>
              </div>
            </div>
          </section>
        )}

        {activeDocs.includes('coloring-vehicles') && (
          <section className="mb-10 print:mb-0 break-inside-avoid print:break-inside-auto border border-slate-200 rounded-xl p-4 print:border-0 print:p-0" style={{ pageBreakInside: 'auto' } as any}>
            <h2 className="text-lg font-bold text-slate-900 print:hidden">🚗 Vehicles & Transport Coloring Sheets</h2>
            <p className="text-slate-600 text-sm mb-3 print:hidden">Cars, trucks, airplanes, and trains to keep little drivers busy and creative.</p>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="border border-slate-300 rounded p-4 bg-white">
                {/* Car */}
                <svg viewBox="0 0 400 300" className="w-full h-auto" aria-hidden>
                  <g fill="none" stroke="#111827" strokeWidth="3.5">
                    <rect x="120" y="170" width="160" height="40" rx="8" />
                    <path d="M150 170 Q200 140 250 170" />
                    <circle cx="160" cy="220" r="14" />
                    <circle cx="240" cy="220" r="14" />
                  </g>
                </svg>
              </div>
              <div className="border border-slate-300 rounded p-4 bg-white">
                {/* Truck */}
                <svg viewBox="0 0 400 300" className="w-full h-auto" aria-hidden>
                  <g fill="none" stroke="#111827" strokeWidth="3.5">
                    <rect x="110" y="170" width="130" height="40" />
                    <rect x="240" y="180" width="40" height="30" />
                    <circle cx="150" cy="220" r="12" />
                    <circle cx="230" cy="220" r="12" />
                  </g>
                </svg>
              </div>
              <div className="border border-slate-300 rounded p-4 bg-white">
                {/* Airplane */}
                <svg viewBox="0 0 400 300" className="w-full h-auto" aria-hidden>
                  <g fill="none" stroke="#111827" strokeWidth="3.5">
                    <path d="M80 180 L320 140 L320 160 L80 200 Z" />
                    <path d="M220 150 L280 100" />
                    <path d="M200 160 L260 210" />
                  </g>
                </svg>
              </div>
              <div className="border border-slate-300 rounded p-4 bg-white">
                {/* Train engine */}
                <svg viewBox="0 0 400 300" className="w-full h-auto" aria-hidden>
                  <g fill="none" stroke="#111827" strokeWidth="3.5">
                    <rect x="120" y="160" width="160" height="40" />
                    <rect x="230" y="140" width="50" height="20" />
                    <circle cx="160" cy="210" r="12" />
                    <circle cx="240" cy="210" r="12" />
                  </g>
                </svg>
              </div>
              <div className="border border-slate-300 rounded p-4 bg-white">
                {/* Boat */}
                <svg viewBox="0 0 400 300" className="w-full h-auto" aria-hidden>
                  <g fill="none" stroke="#111827" strokeWidth="3.5">
                    <path d="M100 200 L300 200 L260 230 L140 230 Z" />
                    <rect x="180" y="170" width="40" height="30" />
                  </g>
                </svg>
              </div>
              <div className="border border-slate-300 rounded p-4 bg-white">
                {/* Helicopter */}
                <svg viewBox="0 0 400 300" className="w-full h-auto" aria-hidden>
                  <g fill="none" stroke="#111827" strokeWidth="3.5">
                    <rect x="170" y="170" width="60" height="25" />
                    <line x1="200" y1="170" x2="200" y2="150" />
                    <line x1="150" y1="150" x2="250" y2="150" />
                  </g>
                </svg>
              </div>
            </div>
          </section>
        )}

        {activeDocs.includes('coloring-heroes') && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">🦸 Superheroes & Everyday Heroes Coloring Pages</h2>
            <p className="text-slate-600 text-sm mb-3">Celebrate courage and kindness — superheroes and community helpers (doctors, firefighters, teachers).</p>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="border border-slate-300 rounded p-4 bg-white">
                {/* Shield */}
                <svg viewBox="0 0 400 300" className="w-full h-auto" aria-hidden>
                  <g fill="none" stroke="#111827" strokeWidth="3.5">
                    <path d="M200 90 L260 110 L250 170 L200 210 L150 170 L140 110 Z" />
                    <path d="M200 110 L235 125 L228 165 L200 188 L172 165 L165 125 Z" />
                  </g>
                </svg>
              </div>
              <div className="border border-slate-300 rounded p-4 bg-white">
                {/* Firefighter helmet */}
                <svg viewBox="0 0 400 300" className="w-full h-auto" aria-hidden>
                  <g fill="none" stroke="#111827" strokeWidth="3.5">
                    <path d="M140 200 Q200 140 260 200" />
                    <rect x="160" y="195" width="80" height="20" />
                  </g>
                </svg>
              </div>
              <div className="border border-slate-300 rounded p-4 bg-white">
                {/* Star badge */}
                <svg viewBox="0 0 400 300" className="w-full h-auto" aria-hidden>
                  <g fill="none" stroke="#111827" strokeWidth="3.5">
                    <polygon points="200,100 215,145 260,145 225,170 240,210 200,185 160,210 175,170 140,145 185,145" />
                  </g>
                </svg>
              </div>
              <div className="border border-slate-300 rounded p-4 bg-white">
                {/* Cape */}
                <svg viewBox="0 0 400 300" className="w-full h-auto" aria-hidden>
                  <g fill="none" stroke="#111827" strokeWidth="3.5">
                    <path d="M160 100 Q200 200 240 100 Q220 160 180 160 Z" />
                  </g>
                </svg>
              </div>
              <div className="border border-slate-300 rounded p-4 bg-white">
                {/* Mask */}
                <svg viewBox="0 0 400 300" className="w-full h-auto" aria-hidden>
                  <g fill="none" stroke="#111827" strokeWidth="3.5">
                    <rect x="150" y="140" width="100" height="30" rx="10" />
                    <circle cx="175" cy="155" r="8" />
                    <circle cx="225" cy="155" r="8" />
                  </g>
                </svg>
              </div>
              <div className="border border-slate-300 rounded p-4 bg-white">
                {/* Doctor stethoscope */}
                <svg viewBox="0 0 400 300" className="w-full h-auto" aria-hidden>
                  <g fill="none" stroke="#111827" strokeWidth="3.5">
                    <path d="M180 120 C160 160, 240 160, 220 120" />
                    <circle cx="250" cy="130" r="10" />
                  </g>
                </svg>
              </div>
            </div>
          </section>
        )}

        {/* New 1st Grade Worksheets */}
        {activeDocs.includes('number-bonds-10') && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">🔢 Number Bonds to 10</h2>
            <p className="text-slate-600 text-sm mb-3">Complete each number bond. Write the missing part that makes 10.</p>
            <div className="grid grid-cols-2 gap-4">
              {[7, 3, 5, 8, 4, 6, 2, 9].map((n) => (
                <svg key={n} viewBox="0 0 400 180" className="w-full h-auto bg-white border border-slate-300 rounded">
                  <circle cx="200" cy="60" r="35" fill="none" stroke="#111827" strokeWidth="3" />
                  <text x="200" y="70" fontSize="32" fill="#111827" textAnchor="middle">10</text>
                  <circle cx="120" cy="130" r="25" fill="none" stroke="#111827" strokeWidth="2.5" />
                  <text x="120" y="140" fontSize="24" fill="#111827" textAnchor="middle">{n}</text>
                  <circle cx="280" cy="130" r="25" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeDasharray="4 4" />
                  <text x="280" y="140" fontSize="24" fill="#94a3b8" textAnchor="middle">__</text>
                  <line x1="175" y1="85" x2="135" y2="105" stroke="#111827" strokeWidth="2" />
                  <line x1="225" y1="85" x2="265" y2="105" stroke="#111827" strokeWidth="2" />
                </svg>
              ))}
            </div>
          </section>
        )}

        {activeDocs.includes('count-write-30') && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">📊 Count & Write 1–30</h2>
            <p className="text-slate-600 text-sm mb-3">Count the objects and write the number in the box.</p>
            <div className="grid grid-cols-2 gap-4">
              {[5, 8, 12, 15, 18, 20, 23, 25].map((count) => (
                <svg key={count} viewBox="0 0 400 160" className="w-full h-auto bg-white border border-slate-300 rounded">
                  <g fill="#111827">
                    {Array.from({ length: count }).map((_, i) => {
                      const cols = Math.ceil(Math.sqrt(count))
                      const row = Math.floor(i / cols)
                      const col = i % cols
                      return <circle key={i} cx={80 + col * 25} cy={60 + row * 25} r="8" />
                    })}
                  </g>
                  <rect x="280" y="40" width="80" height="50" fill="none" stroke="#111827" strokeWidth="2.5" />
                  <text x="320" y="75" fontSize="28" fill="#94a3b8" textAnchor="middle">__</text>
                </svg>
              ))}
            </div>
          </section>
        )}

        {activeDocs.includes('missing-numbers-50') && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">🔍 Missing Numbers 1–50</h2>
            <p className="text-slate-600 text-sm mb-3">Fill in the missing numbers on each number line.</p>
            <div className="space-y-4">
              {[[1, 5], [10, 15], [20, 25], [30, 35], [40, 45]].map(([start, end], idx) => (
                <svg key={idx} viewBox="0 0 600 100" className="w-full h-auto bg-white border border-slate-300 rounded">
                  <g fill="none" stroke="#111827" strokeWidth="3">
                    <line x1="50" y1="50" x2="550" y2="50" />
                    {Array.from({ length: end - start + 1 }).map((_, i) => {
                      const num = start + i
                      const x = 50 + (i * 500) / (end - start)
                      return (
                        <g key={i}>
                          <line x1={x} y1="50" x2={x} y2="40" />
                          {num % 5 === 0 || num === start || num === end ? (
                            <text x={x} y="30" fontSize="18" fill="#111827" textAnchor="middle">{num}</text>
                          ) : (
                            <text x={x} y="30" fontSize="18" fill="#94a3b8" textAnchor="middle">__</text>
                          )}
                        </g>
                      )
                    })}
                  </g>
                </svg>
              ))}
            </div>
          </section>
        )}

        {activeDocs.includes('picture-addition-10') && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">➕ Picture Addition to 10</h2>
            <p className="text-slate-600 text-sm mb-3">Count the pictures in each group and add them together.</p>
            <div className="grid grid-cols-2 gap-4">
              {[[3, 4], [2, 5], [4, 3], [1, 6], [5, 2], [3, 5]].map(([a, b], idx) => (
                <svg key={idx} viewBox="0 0 400 180" className="w-full h-auto bg-white border border-slate-300 rounded">
                  <g fill="#111827">
                    {Array.from({ length: a }).map((_, i) => (
                      <circle key={i} cx={60 + i * 30} cy="60" r="10" />
                    ))}
                  </g>
                  <text x="200" y="70" fontSize="32" fill="#111827" textAnchor="middle">+</text>
                  <g fill="#111827">
                    {Array.from({ length: b }).map((_, i) => (
                      <circle key={i} cx={240 + i * 30} cy="60" r="10" />
                    ))}
                  </g>
                  <line x1="50" y1="120" x2="350" y2="120" stroke="#111827" strokeWidth="2" />
                  <rect x="160" y="130" width="80" height="40" fill="none" stroke="#111827" strokeWidth="2.5" />
                  <text x="200" y="160" fontSize="28" fill="#94a3b8" textAnchor="middle">__</text>
                </svg>
              ))}
            </div>
          </section>
        )}

        {activeDocs.includes('subtraction-stories') && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">➖ Subtraction Stories</h2>
            <p className="text-slate-600 text-sm mb-3">Read the story and solve the subtraction problem.</p>
            <div className="space-y-4">
              {[
                { total: 8, take: 3, story: '8 apples, 3 eaten' },
                { total: 7, take: 2, story: '7 birds, 2 flew away' },
                { total: 9, take: 4, story: '9 flowers, 4 picked' },
                { total: 10, take: 5, story: '10 cookies, 5 shared' }
              ].map(({ total, take, story }, idx) => (
                <div key={idx} className="border border-slate-300 rounded p-4 bg-white">
                  <p className="text-slate-700 text-sm mb-2">{story}</p>
                  <svg viewBox="0 0 500 120" className="w-full h-auto">
                    <g fill="#111827">
                      {Array.from({ length: total }).map((_, i) => (
                        <circle key={i} cx={50 + i * 40} cy="60" r="12" fill={i < take ? '#ef4444' : '#111827'} opacity={i < take ? 0.3 : 1} />
                      ))}
                    </g>
                    <text x="250" y="70" fontSize="28" fill="#111827" textAnchor="middle">{total} - {take} = __</text>
                  </svg>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeDocs.includes('balance-equations-10') && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">⚖️ Balance Equations (to 10)</h2>
            <p className="text-slate-600 text-sm mb-3">Find the missing number to make both sides equal.</p>
            <div className="space-y-4">
              {[
                { left: '3 + 2', right: '__ + 1' },
                { left: '5 + __', right: '4 + 3' },
                { left: '6 - 2', right: '__ - 1' },
                { left: '8 - __', right: '10 - 3' }
              ].map((eq, idx) => (
                <svg key={idx} viewBox="0 0 500 120" className="w-full h-auto bg-white border border-slate-300 rounded">
                  <g fill="none" stroke="#111827" strokeWidth="3">
                    <path d="M100 80 L400 80" />
                    <path d="M250 40 L250 80" />
                    <circle cx="150" cy="60" r="20" />
                    <circle cx="350" cy="60" r="20" />
                  </g>
                  <text x="150" y="70" fontSize="24" fill="#111827" textAnchor="middle">{eq.left}</text>
                  <text x="350" y="70" fontSize="24" fill="#111827" textAnchor="middle">{eq.right}</text>
                </svg>
              ))}
            </div>
          </section>
        )}

        {activeDocs.includes('skip-count-2s') && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">➡️ Skip Counting by 2s</h2>
            <p className="text-slate-600 text-sm mb-3">Count by 2s. Fill in the missing numbers.</p>
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, idx) => (
                <svg key={idx} viewBox="0 0 500 100" className="w-full h-auto bg-white border border-slate-300 rounded">
                  <g fill="#111827">
                    {[2, 4, 6, 8, 10, 12, 14, 16, 18, 20].map((num, i) => {
                      const x = 40 + i * 42
                      return (
                        <g key={i}>
                          <circle cx={x} cy="50" r="15" fill="none" stroke="#111827" strokeWidth="2" />
                          {i % 2 === idx % 2 ? (
                            <text x={x} y="58" fontSize="18" fill="#111827" textAnchor="middle">{num}</text>
                          ) : (
                            <text x={x} y="58" fontSize="18" fill="#94a3b8" textAnchor="middle">__</text>
                          )}
                        </g>
                      )
                    })}
                  </g>
                </svg>
              ))}
            </div>
          </section>
        )}

        {activeDocs.includes('number-line-add') && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">🔢 Number Line Addition</h2>
            <p className="text-slate-600 text-sm mb-3">Use the number line to solve each addition problem.</p>
            <div className="space-y-4">
              {[[3, 4], [5, 3], [2, 6], [4, 5]].map(([a, b], idx) => (
                <svg key={idx} viewBox="0 0 600 120" className="w-full h-auto bg-white border border-slate-300 rounded">
                  <g fill="none" stroke="#111827" strokeWidth="2">
                    <line x1="50" y1="60" x2="550" y2="60" />
                    {Array.from({ length: 16 }).map((_, i) => (
                      <line key={i} x1={50 + i * 33.3} y1="60" x2={50 + i * 33.3} y2="50" />
                    ))}
                  </g>
                  <text x="50" y="80" fontSize="20" fill="#111827">{a} + {b} = __</text>
                  <circle cx={50 + a * 33.3} cy="60" r="8" fill="#3b82f6" />
                  <path d={`M${50 + a * 33.3} 60 L${50 + (a + b) * 33.3} 60`} stroke="#3b82f6" strokeWidth="3" markerEnd="url(#arrowhead)" />
                  <defs>
                    <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                      <polygon points="0 0, 10 3, 0 6" fill="#3b82f6" />
                    </marker>
                  </defs>
                </svg>
              ))}
            </div>
          </section>
        )}

        {activeDocs.includes('doubles-facts') && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">🎯 Doubles Facts Practice</h2>
            <p className="text-slate-600 text-sm mb-3">Practice doubles: 1+1, 2+2, 3+3, and so on.</p>
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <svg key={n} viewBox="0 0 400 140" className="w-full h-auto bg-white border border-slate-300 rounded">
                  <g fill="#111827">
                    {Array.from({ length: n * 2 }).map((_, i) => {
                      const cols = Math.ceil(Math.sqrt(n * 2))
                      const row = Math.floor(i / cols)
                      const col = i % cols
                      return <circle key={i} cx={60 + col * 25} cy={40 + row * 25} r="8" />
                    })}
                  </g>
                  <text x="200" y="100" fontSize="28" fill="#111827" textAnchor="middle">{n} + {n} = __</text>
                </svg>
              ))}
            </div>
          </section>
        )}

        {activeDocs.includes('pattern-complete') && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">🧩 Pattern Completion</h2>
            <p className="text-slate-600 text-sm mb-3">Complete each pattern. Draw or color the missing shapes.</p>
            <div className="space-y-4">
              {[
                { pattern: ['circle', 'square', 'circle', 'square'], type: 'AB' },
                { pattern: ['red', 'blue', 'green', 'red', 'blue'], type: 'ABC' },
                { pattern: ['triangle', 'triangle', 'circle', 'triangle'], type: 'AAB' }
              ].map(({ pattern, type }, idx) => (
                <div key={idx} className="border border-slate-300 rounded p-4 bg-white">
                  <p className="text-slate-700 text-sm mb-2 font-semibold">{type} Pattern</p>
                  <div className="flex items-center gap-3">
                    {pattern.map((shape, i) => (
                      <div key={i} className="w-16 h-16 border-2 border-slate-400 rounded flex items-center justify-center">
                        {shape === 'circle' && <div className="w-12 h-12 rounded-full border-2 border-slate-600" />}
                        {shape === 'square' && <div className="w-12 h-12 border-2 border-slate-600" />}
                        {shape === 'triangle' && <div className="w-0 h-0 border-l-6 border-r-6 border-b-12 border-transparent border-b-slate-600" />}
                        {shape === 'red' && <div className="w-12 h-12 bg-red-400 rounded" />}
                        {shape === 'blue' && <div className="w-12 h-12 bg-blue-400 rounded" />}
                        {shape === 'green' && <div className="w-12 h-12 bg-green-400 rounded" />}
                      </div>
                    ))}
                    <div className="w-16 h-16 border-2 border-dashed border-slate-400 rounded flex items-center justify-center">
                      <span className="text-slate-400">__</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeDocs.includes('missing-shape') && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">🔍 Find the Missing Shape</h2>
            <p className="text-slate-600 text-sm mb-3">Look at the pattern and draw the missing shape.</p>
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 6 }).map((_, idx) => {
                const shapes = ['circle', 'square', 'triangle', 'circle', 'square']
                return (
                  <div key={idx} className="border border-slate-300 rounded p-4 bg-white">
                    <div className="flex items-center gap-2 mb-2">
                      {shapes.map((shape, i) => (
                        <div key={i} className="w-12 h-12 border-2 border-slate-600 rounded flex items-center justify-center">
                          {shape === 'circle' && <div className="w-8 h-8 rounded-full border-2 border-slate-600" />}
                          {shape === 'square' && <div className="w-8 h-8 border-2 border-slate-600" />}
                          {shape === 'triangle' && <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-transparent border-b-slate-600" />}
                        </div>
                      ))}
                      <div className="w-12 h-12 border-2 border-dashed border-slate-400 rounded flex items-center justify-center">
                        <span className="text-slate-400">?</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {activeDocs.includes('size-comparison') && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">📏 Size Comparison</h2>
            <p className="text-slate-600 text-sm mb-3">Compare the objects. Circle the bigger one or the smaller one.</p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Circle the bigger', items: [30, 50] },
                { label: 'Circle the smaller', items: [40, 25] },
                { label: 'Circle the longer', items: [60, 35] },
                { label: 'Circle the shorter', items: [45, 70] }
              ].map(({ label, items }, idx) => (
                <div key={idx} className="border border-slate-300 rounded p-4 bg-white">
                  <p className="text-slate-700 text-sm mb-2 font-semibold">{label}</p>
                  <div className="flex items-end gap-4 justify-center">
                    <div className="text-center">
                      <div className={`w-${items[0]} h-${items[0]} bg-blue-400 rounded mb-2`} style={{ width: `${items[0]}px`, height: `${items[0]}px` }} />
                      <span className="text-xs">A</span>
                    </div>
                    <div className="text-center">
                      <div className={`w-${items[1]} h-${items[1]} bg-green-400 rounded mb-2`} style={{ width: `${items[1]}px`, height: `${items[1]}px` }} />
                      <span className="text-xs">B</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* New 2nd Grade Worksheets */}
        {activeDocs.includes('expanded-form-200') && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">🔢 Expanded Form to 200</h2>
            <p className="text-slate-600 text-sm mb-3">Write each number in expanded form (100+20+5).</p>
            <div className="space-y-4">
              {[125, 143, 167, 189, 152, 176].map((num) => {
                const hundreds = Math.floor(num / 100)
                const tens = Math.floor((num % 100) / 10)
                const ones = num % 10
                return (
                  <div key={num} className="border border-slate-300 rounded p-4 bg-white">
                    <p className="text-slate-700 text-lg mb-2 font-semibold">{num} = __ + __ + __</p>
                    <p className="text-slate-600 text-sm">Hint: {hundreds}00 + {tens}0 + {ones}</p>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {activeDocs.includes('number-patterns-200') && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">📊 Number Patterns to 200</h2>
            <p className="text-slate-600 text-sm mb-3">Find the pattern and fill in the missing numbers.</p>
            <div className="space-y-4">
              {[
                { pattern: [10, 20, 30, '__', 50, '__', 70], rule: '+10' },
                { pattern: [5, 10, 15, '__', 25, '__', 35], rule: '+5' },
                { pattern: [100, 110, 120, '__', 140, '__', 160], rule: '+10' }
              ].map(({ pattern, rule }, idx) => (
                <div key={idx} className="border border-slate-300 rounded p-4 bg-white">
                  <p className="text-slate-700 text-sm mb-2">Pattern: {rule}</p>
                  <div className="flex gap-2">
                    {pattern.map((num, i) => (
                      <div key={i} className="w-16 h-16 border-2 border-slate-600 rounded flex items-center justify-center">
                        <span className="text-slate-900 font-semibold">{typeof num === 'number' ? num : '__'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeDocs.includes('rounding-nearest-10') && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">🔍 Rounding to Nearest 10</h2>
            <p className="text-slate-600 text-sm mb-3">Round each number to the nearest 10.</p>
            <div className="grid grid-cols-2 gap-4">
              {[23, 37, 45, 58, 64, 76, 82, 91].map((num) => {
                const rounded = Math.round(num / 10) * 10
                return (
                  <div key={num} className="border border-slate-300 rounded p-4 bg-white">
                    <p className="text-slate-700 text-lg mb-2">{num} rounds to __</p>
                    <p className="text-slate-600 text-sm">Hint: {num} is closer to {rounded}</p>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {activeDocs.includes('add-three-numbers') && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">➕ Adding 3 Numbers</h2>
            <p className="text-slate-600 text-sm mb-3">Add three numbers together.</p>
            <div className="grid grid-cols-2 gap-4">
              {[[3, 4, 2], [5, 2, 3], [4, 3, 3], [6, 2, 1], [2, 5, 3], [4, 4, 2]].map((nums, idx) => (
                <svg key={idx} viewBox="0 0 400 120" className="w-full h-auto bg-white border border-slate-300 rounded">
                  <text x="200" y="60" fontSize="32" fill="#111827" textAnchor="middle">{nums[0]} + {nums[1]} + {nums[2]} = __</text>
                </svg>
              ))}
            </div>
          </section>
        )}

        {activeDocs.includes('missing-addends') && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">➖ Missing Addends</h2>
            <p className="text-slate-600 text-sm mb-3">Find the missing number in each addition equation.</p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { a: 3, sum: 8 },
                { a: 5, sum: 12 },
                { a: 4, sum: 10 },
                { a: 6, sum: 15 },
                { a: 7, sum: 14 },
                { a: 2, sum: 9 }
              ].map(({ a, sum }, idx) => (
                <svg key={idx} viewBox="0 0 400 120" className="w-full h-auto bg-white border border-slate-300 rounded">
                  <text x="200" y="60" fontSize="32" fill="#111827" textAnchor="middle">{a} + __ = {sum}</text>
                </svg>
              ))}
            </div>
          </section>
        )}

        {activeDocs.includes('fact-families-20') && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">⚖️ Fact Families (to 20)</h2>
            <p className="text-slate-600 text-sm mb-3">Complete each fact family with 4 related equations.</p>
            <div className="space-y-4">
              {[[5, 8, 13], [6, 7, 13], [4, 9, 13]].map(([a, b, sum], idx) => (
                <div key={idx} className="border border-slate-300 rounded p-4 bg-white">
                  <p className="text-slate-700 text-sm mb-2 font-semibold">Fact Family: {a}, {b}, {sum}</p>
                  <div className="grid grid-cols-2 gap-2">
                    <p className="text-slate-900">{a} + {b} = __</p>
                    <p className="text-slate-900">{b} + {a} = __</p>
                    <p className="text-slate-900">{sum} - {a} = __</p>
                    <p className="text-slate-900">{sum} - {b} = __</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeDocs.includes('mental-math-20') && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">🔢 Mental Math (Add/Sub to 20)</h2>
            <p className="text-slate-600 text-sm mb-3">Solve these quickly in your head!</p>
            <div className="grid grid-cols-3 gap-3">
              {[
                '7+5', '9+4', '8+6', '12-5', '15-7', '18-9',
                '6+7', '5+8', '11-4', '14-6', '16-8', '20-9'
              ].map((prob, idx) => (
                <div key={idx} className="border border-slate-300 rounded p-3 bg-white text-center">
                  <p className="text-slate-900 text-lg font-semibold">{prob} = __</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeDocs.includes('number-line-200') && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">📈 Number Line to 200</h2>
            <p className="text-slate-600 text-sm mb-3">Use the number line to solve problems and locate numbers.</p>
            <div className="space-y-4">
              {[0, 50, 100, 150, 200].map((start) => (
                <svg key={start} viewBox="0 0 600 100" className="w-full h-auto bg-white border border-slate-300 rounded">
                  <g fill="none" stroke="#111827" strokeWidth="2">
                    <line x1="50" y1="50" x2="550" y2="50" />
                    {Array.from({ length: 6 }).map((_, i) => {
                      const num = start + i * 10
                      const x = 50 + i * 100
                      return (
                        <g key={i}>
                          <line x1={x} y1="50" x2={x} y2="40" />
                          <text x={x} y="30" fontSize="16" fill="#111827" textAnchor="middle">{num}</text>
                        </g>
                      )
                    })}
                  </g>
                  <text x="300" y="80" fontSize="18" fill="#94a3b8" textAnchor="middle">Locate: __</text>
                </svg>
              ))}
            </div>
          </section>
        )}

        {activeDocs.includes('doubles-near-doubles') && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">🎯 Doubles & Near Doubles</h2>
            <p className="text-slate-600 text-sm mb-3">Practice doubles and near doubles (doubles +1).</p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { type: 'Double', a: 6 },
                { type: 'Double', a: 7 },
                { type: 'Near Double', a: 6 },
                { type: 'Near Double', a: 8 }
              ].map(({ type, a }, idx) => (
                <div key={idx} className="border border-slate-300 rounded p-4 bg-white">
                  <p className="text-slate-700 text-sm mb-2 font-semibold">{type}</p>
                  <p className="text-slate-900 text-lg">{a} + {type === 'Double' ? a : a + 1} = __</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeDocs.includes('money-coins-bills') && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">💰 Money: Coins & Bills</h2>
            <p className="text-slate-600 text-sm mb-3">Count the coins and write the total amount.</p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { coins: [1, 1, 5, 5], label: '2 pennies, 2 nickels' },
                { coins: [10, 5, 1], label: '1 dime, 1 nickel, 1 penny' },
                { coins: [25, 10, 5], label: '1 quarter, 1 dime, 1 nickel' },
                { coins: [10, 10, 5, 1, 1], label: '2 dimes, 1 nickel, 2 pennies' }
              ].map(({ coins, label }, idx) => {
                const total = coins.reduce((a, b) => a + b, 0)
                return (
                  <div key={idx} className="border border-slate-300 rounded p-4 bg-white">
                    <p className="text-slate-700 text-sm mb-2">{label}</p>
                    <div className="flex gap-2 mb-2">
                      {coins.map((val, i) => (
                        <div key={i} className="w-12 h-12 rounded-full border-2 border-slate-600 flex items-center justify-center text-xs">
                          {val}¢
                        </div>
                      ))}
                    </div>
                    <p className="text-slate-900 text-lg font-semibold">Total: __¢</p>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {activeDocs.includes('measurement-length') && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">📏 Measurement: Length</h2>
            <p className="text-slate-600 text-sm mb-3">Compare lengths using inches and centimeters.</p>
            <div className="space-y-4">
              {[
                { a: 5, b: 8, unit: 'inches' },
                { a: 12, b: 7, unit: 'cm' },
                { a: 10, b: 15, unit: 'inches' }
              ].map(({ a, b, unit }, idx) => (
                <div key={idx} className="border border-slate-300 rounded p-4 bg-white">
                  <p className="text-slate-700 text-sm mb-2">Which is longer?</p>
                  <div className="flex items-end gap-4">
                    <div>
                      <div className="bg-blue-400 mb-2" style={{ width: `${a * 10}px`, height: '20px' }} />
                      <span className="text-xs">A: {a} {unit}</span>
                    </div>
                    <div>
                      <div className="bg-green-400 mb-2" style={{ width: `${b * 10}px`, height: '20px' }} />
                      <span className="text-xs">B: {b} {unit}</span>
                    </div>
                  </div>
                  <p className="text-slate-900 mt-2">Answer: __</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeDocs.includes('bar-graphs-data') && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">📊 Bar Graphs & Data</h2>
            <p className="text-slate-600 text-sm mb-3">Read the bar graph and answer the questions.</p>
            <div className="border border-slate-300 rounded p-4 bg-white">
              <p className="text-slate-700 text-sm mb-3 font-semibold">Favorite Colors</p>
              <svg viewBox="0 0 500 300" className="w-full h-auto">
                <g fill="#3b82f6">
                  <rect x="50" y="200" width="60" height="80" />
                  <text x="80" y="295" fontSize="14" fill="#111827" textAnchor="middle">Red</text>
                </g>
                <g fill="#10b981">
                  <rect x="130" y="150" width="60" height="130" />
                  <text x="160" y="295" fontSize="14" fill="#111827" textAnchor="middle">Blue</text>
                </g>
                <g fill="#f59e0b">
                  <rect x="210" y="180" width="60" height="100" />
                  <text x="240" y="295" fontSize="14" fill="#111827" textAnchor="middle">Green</text>
                </g>
                <g fill="#ef4444">
                  <rect x="290" y="120" width="60" height="160" />
                  <text x="320" y="295" fontSize="14" fill="#111827" textAnchor="middle">Yellow</text>
                </g>
                <line x1="40" y1="280" x2="360" y2="280" stroke="#111827" strokeWidth="2" />
                <line x1="40" y1="280" x2="40" y2="100" stroke="#111827" strokeWidth="2" />
              </svg>
              <div className="mt-3 space-y-1">
                <p className="text-slate-700 text-sm">1. Which color is most popular? __</p>
                <p className="text-slate-700 text-sm">2. How many chose Red? __</p>
                <p className="text-slate-700 text-sm">3. How many more chose Yellow than Green? __</p>
              </div>
            </div>
          </section>
        )}

        {doc === 'bundle' && showAnswers && bundleAnswerSections.length > 0 && (
          <section className="mb-10 break-inside-avoid border border-emerald-200 rounded-xl p-4 bg-emerald-50 text-emerald-900 print:border-0 print:bg-white print:text-black">
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2">🧾 Bundle Answer Appendix</h2>
            <p className="text-sm mb-4 text-emerald-900/80 print:text-slate-700">Quick glance answers for every printable in this bundle. Keep scrolling for the full worksheets, or print this page for an overview.</p>
            <div className="space-y-4">
              {bundleAnswerSections.map(({ docId, title, content }) => (
                <div key={docId} className="print:break-inside-avoid">
                  <div className="font-semibold text-emerald-900 mb-2">{title}</div>
                  {content}
                </div>
              ))}
            </div>
          </section>
        )}

        <footer className="text-center text-slate-500 text-xs print:hidden">
          Tip: Use your browser menu → Print → Save as PDF.
        </footer>
      </div>
    </div>
  )
}

function generateWordSearchGrid(size: number, words: string[], rng: () => number): string[][] {
  // very basic filler grid with words placed sequentially across rows to demonstrate printing
  const grid: string[][] = Array.from({ length: size }, () => Array.from({ length: size }, () => ''))
  let r = 0, c = 0
  for (const w of words) {
    for (let i = 0; i < w.length; i++) {
      if (r >= size) break
      grid[r][c] = w[i]
      c++
      if (c >= size) { r++; c = 0 }
    }
    r++; c = 0
    if (r >= size) break
  }
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (!grid[i][j]) grid[i][j] = letters[Math.floor(rng() * letters.length)]
    }
  }
  return grid
}

function ColoringSVG() {
  // Simple cat face line art for coloring
  return (
    <svg viewBox="0 0 400 400" className="w-full h-auto" aria-hidden>
      <g fill="none" stroke="#111827" strokeWidth="4">
        <circle cx="200" cy="210" r="120" />
        <polygon points="110,120 170,80 170,150" />
        <polygon points="290,120 230,80 230,150" />
        <circle cx="160" cy="200" r="16" />
        <circle cx="240" cy="200" r="16" />
        <polygon points="200,220 190,235 210,235" />
        <path d="M150 260 Q200 300 250 260" />
        <line x1="120" y1="220" x2="70" y2="210" />
        <line x1="120" y1="230" x2="70" y2="230" />
        <line x1="120" y1="240" x2="70" y2="250" />
        <line x1="280" y1="220" x2="330" y2="210" />
        <line x1="280" y1="230" x2="330" y2="230" />
        <line x1="280" y1="240" x2="330" y2="250" />
      </g>
    </svg>
  )
}

function HiddenObjectsSceneSVGA() {
  // Hand-drawn busy scene with hidden shapes matching the checklist
  return (
    <svg viewBox="0 0 800 400" className="w-full h-auto bg-white border border-slate-300 rounded">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e0f2fe" />
          <stop offset="100%" stopColor="#ffffff" />
        </linearGradient>
      </defs>
      {/* Background sky and ground */}
      <rect x="0" y="0" width="800" height="240" fill="url(#sky)" />
      <rect x="0" y="240" width="800" height="160" fill="#f1f5f9" />

      {/* Trees */}
      {[100, 220, 560, 700].map((x, i) => (
        <g key={i}>
          <rect x={x} y={220} width="10" height="40" fill="#64748b" />
          <circle cx={x+5} cy={200} r="28" fill="#a7f3d0" />
          <circle cx={x-15} cy={215} r="18" fill="#a7f3d0" />
          <circle cx={x+22} cy={215} r="18" fill="#a7f3d0" />
        </g>
      ))}

      {/* Cloud (hidden object: Cloud) – larger, line-art */}
      <g>
        <ellipse cx="180" cy="90" rx="70" ry="28" fill="none" stroke="#111827" strokeWidth="3.5" />
        <ellipse cx="215" cy="90" rx="50" ry="22" fill="none" stroke="#111827" strokeWidth="3.5" />
        <ellipse cx="140" cy="96" rx="45" ry="18" fill="none" stroke="#111827" strokeWidth="3.5" />
      </g>

      {/* Star (hidden on tree) – bigger, line-art */}
      <polygon points="560,145 568,170 596,170 572,186 580,210 560,196 540,210 548,186 524,170 552,170" fill="none" stroke="#111827" strokeWidth="3.5" />

      {/* Leaf (on ground) – clearer outline with vein */}
      <g>
        <path d="M290 300 C320 280, 360 310, 330 330 C345 345, 305 350, 290 330 Z" fill="none" stroke="#111827" strokeWidth="3.5" />
        <path d="M325 295 Q325 315 318 332" fill="none" stroke="#111827" strokeWidth="2.5" />
      </g>

      {/* Book (bench) – larger, line-art with page lines */}
      <g>
        <rect x="392" y="285" width="80" height="10" fill="none" stroke="#111827" strokeWidth="3" />
        <rect x="398" y="248" width="68" height="36" rx="2" fill="none" stroke="#111827" strokeWidth="3" />
        <line x1="432" y1="248" x2="432" y2="284" stroke="#111827" strokeWidth="3" />
        <line x1="404" y1="256" x2="464" y2="256" stroke="#111827" strokeWidth="2" />
        <line x1="404" y1="263" x2="464" y2="263" stroke="#111827" strokeWidth="2" />
        <line x1="404" y1="270" x2="464" y2="270" stroke="#111827" strokeWidth="2" />
      </g>

      {/* Car (simple) – larger, line-art */}
      <g>
        <rect x="620" y="265" width="120" height="36" rx="8" fill="none" stroke="#111827" strokeWidth="3.5" />
        <rect x="650" y="270" width="50" height="16" rx="3" fill="none" stroke="#111827" strokeWidth="2.5" />
        <circle cx="648" cy="308" r="14" fill="none" stroke="#111827" strokeWidth="3.5" />
        <circle cx="712" cy="308" r="14" fill="none" stroke="#111827" strokeWidth="3.5" />
      </g>

      {/* Key (on ground) – larger, line-art with teeth */}
      <g>
        <circle cx="520" cy="328" r="14" fill="none" stroke="#111827" strokeWidth="3.5" />
        <rect x="538" y="325" width="36" height="8" fill="none" stroke="#111827" strokeWidth="3.5" />
        <rect x="574" y="325" width="8" height="12" fill="none" stroke="#111827" strokeWidth="3.5" />
        <rect x="584" y="325" width="8" height="12" fill="none" stroke="#111827" strokeWidth="3.5" />
      </g>

      {/* Apple (on tree) – larger, line-art with stem + leaf */}
      <g>
        <circle cx="220" cy="205" r="14" fill="none" stroke="#111827" strokeWidth="3.5" />
        <line x1="220" y1="191" x2="220" y2="199" stroke="#111827" strokeWidth="3" />
        <ellipse cx="228" cy="196" rx="8" ry="4" fill="none" stroke="#111827" strokeWidth="2.5" />
      </g>

      {/* Shell (near pond) – larger, line-art with scallops */}
      <g>
        <path d="M100 324 C118 296, 162 296, 180 324 C172 340, 108 340, 100 324 Z" fill="none" stroke="#111827" strokeWidth="3.5" />
        {Array.from({length:5}).map((_,i)=>{
          const x = 112 + i*14; return (<path key={i} d={`M${x} 322 Q${x+4} 312 ${x+8} 322`} stroke="#111827" fill="none" strokeWidth="2.5"/>);
        })}
      </g>

      {/* Ball – larger, line-art with stripes */}
      <g>
        <circle cx="360" cy="310" r="16" fill="none" stroke="#111827" strokeWidth="3.5" />
        <path d="M342 310 Q360 296 378 310" stroke="#111827" strokeWidth="2.5" fill="none" />
        <path d="M360 294 Q370 310 360 326" stroke="#111827" strokeWidth="2.5" fill="none" />
      </g>

      {/* Hat (on bench) – clearer fedora outline */}
      <g>
        <ellipse cx="475" cy="282" rx="28" ry="10" fill="none" stroke="#111827" strokeWidth="3.5" />
        <path d="M452 268 Q475 258 498 268" fill="none" stroke="#111827" strokeWidth="3.5" />
        <rect x="458" y="264" width="34" height="14" fill="none" stroke="#111827" strokeWidth="3.5" />
        <line x1="458" y1="270" x2="492" y2="270" stroke="#111827" strokeWidth="3" />
      </g>
    </svg>
  )
}

// Variant B with 7 differences from A: (1) no star, (2) leaf moved, (3) book moved, (4) car color/position, (5) key moved, (6) apple moved, (7) add a bird
function HiddenObjectsSceneSVGB() {
  return (
    <svg viewBox="0 0 800 400" className="w-full h-auto bg-white border border-slate-300 rounded">
      <defs>
        <linearGradient id="skyB" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e0f2fe" />
          <stop offset="100%" stopColor="#ffffff" />
        </linearGradient>
      </defs>
      {/* Background sky and ground */}
      <rect x="0" y="0" width="800" height="240" fill="url(#skyB)" />
      <rect x="0" y="240" width="800" height="160" fill="#f1f5f9" />

      {/* Trees */}
      {[100, 220, 560, 700].map((x, i) => (
        <g key={i}>
          <rect x={x} y="220" width="10" height="40" fill="#64748b" />
          <circle cx={x+5} cy="200" r="28" fill="#a7f3d0" />
          <circle cx={x-15} cy="215" r="18" fill="#a7f3d0" />
          <circle cx={x+22} cy="215" r="18" fill="#a7f3d0" />
        </g>
      ))}

      {/* Cloud (same) */}
      <g>
        <ellipse cx="180" cy="90" rx="50" ry="20" fill="#ffffff" stroke="#94a3b8" />
        <ellipse cx="210" cy="90" rx="35" ry="16" fill="#ffffff" stroke="#94a3b8" />
        <ellipse cx="150" cy="94" rx="30" ry="14" fill="#ffffff" stroke="#94a3b8" />
      </g>

      {/* Star removed (difference 1) */}

      {/* Leaf moved (difference 2) */}
      <path d="M500 310 C520 300, 540 320, 520 330 C530 340, 510 345, 500 330 Z" fill="#86efac" stroke="#16a34a" />

      {/* Book moved to ground (difference 3) */}
      <g>
        <rect x="460" y="310" width="60" height="8" fill="#94a3b8" />
        <rect x="465" y="280" width="50" height="30" fill="#e2e8f0" stroke="#64748b" />
        <line x1="490" y1="280" x2="490" y2="310" stroke="#64748b" />
      </g>

      {/* Car changed color and slightly moved (difference 4) */}
      <g>
        <rect x="620" y="275" width="90" height="30" rx="6" fill="#86efac" stroke="#64748b" />
        <circle cx="640" cy="310" r="10" fill="#475569" />
        <circle cx="690" cy="310" r="10" fill="#475569" />
      </g>

      {/* Key moved (difference 5) */}
      <g>
        <circle cx="140" cy="335" r="8" fill="#fde68a" stroke="#b45309" />
        <rect x="148" y="333" width="20" height="4" fill="#fde68a" stroke="#b45309" />
        <rect x="168" y="333" width="4" height="6" fill="#fde68a" stroke="#b45309" />
        <rect x="173" y="333" width="4" height="6" fill="#fde68a" stroke="#b45309" />
      </g>

      {/* Apple moved (difference 6) */}
      <circle cx="260" cy="190" r="8" fill="#ef4444" stroke="#991b1b" />

      {/* Shell (same) */}
      <g>
        <path d="M110 320 C120 300, 150 300, 160 320 C155 330, 115 330, 110 320 Z" fill="#f5d0fe" stroke="#a855f7" />
        <line x1="120" y1="318" x2="150" y2="318" stroke="#9333ea" />
      </g>

      {/* Bird in sky (difference 7) */}
      <g>
        <path d="M600 80 Q610 70, 620 80 M620 80 Q630 70, 640 80" fill="none" stroke="#64748b" strokeWidth="3" />
      </g>
    </svg>
  )
}
