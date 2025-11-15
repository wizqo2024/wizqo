import React from 'react'
import type { ReactNode } from 'react'
import { WizqoLogo } from '@/components/WizqoLogo'
import InteractiveBundleSections from '@/components/InteractiveBundleSections'
import { PRINTABLE_BUNDLE_SECTIONS, getPrintableSectionForDoc } from '@/data/printableBundles'
import { INTERACTIVE_CATEGORIES } from '@shared/interactive/interactiveWorksheets'
import { 
  trackWorksheetDownload, 
  trackWorksheetView, 
  trackPrintDialog, 
  trackAnswerKeyToggle,
  trackTimeOnPage,
  trackScrollDepth,
  trackUserFlow
} from '@/utils/analytics'

const INTERACTIVE_DOC_IDS = INTERACTIVE_CATEGORIES.flatMap((category) => category.docs.map((doc) => doc.id))

// Helper function to get theme for regular worksheets based on docId
function getWorksheetTheme(docId: string): {
  background: string
  border: string
  text: string
  cornerAccent: string
  cornerAccent2: string
} {
  // Math worksheets
  if (docId.includes('math') || docId.includes('number') || docId.includes('addition') || docId.includes('subtraction') || 
      docId.includes('place-value') || docId.includes('counting') || docId.includes('skip-count') || docId.includes('expanded') ||
      docId.includes('rounding') || docId.includes('fact') || docId.includes('mental-math') || docId.includes('doubles') ||
      docId.includes('compare') || docId.includes('word-problems') || docId.includes('number-line') || docId.includes('number-patterns') ||
      docId.includes('missing-addends') || docId.includes('add-three') || docId.includes('balance-equations') || docId.includes('picture-addition') ||
      docId.includes('subtraction-stories') || docId.includes('number-bonds') || docId.includes('count-write') || docId.includes('missing-numbers') ||
      docId.includes('ten-frames') || docId.includes('number-tracing') || docId.includes('dot-to-dot') || docId.includes('color-by-number')) {
    return {
      background: 'bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50',
      border: 'border-purple-300',
      text: 'text-purple-900',
      cornerAccent: 'rgba(196, 181, 253, 0.3)',
      cornerAccent2: 'rgba(251, 207, 232, 0.2)',
    }
  }
  // Reading worksheets
  if (docId.includes('reading') || docId.includes('comprehension')) {
    return {
      background: 'bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50',
      border: 'border-blue-300',
      text: 'text-blue-800',
      cornerAccent: 'rgba(191, 219, 254, 0.3)',
      cornerAccent2: 'rgba(186, 230, 253, 0.2)',
    }
  }
  // Writing/Handwriting worksheets
  if (docId.includes('writing') || docId.includes('handwriting') || docId.includes('tracing') || docId.includes('spelling') || docId.includes('grammar')) {
    return {
      background: 'bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50',
      border: 'border-emerald-300',
      text: 'text-emerald-800',
      cornerAccent: 'rgba(167, 243, 208, 0.3)',
      cornerAccent2: 'rgba(134, 239, 172, 0.2)',
    }
  }
  // Science worksheets
  if (docId.includes('science') || docId.includes('stem')) {
    return {
      background: 'bg-gradient-to-br from-green-50 via-lime-50 to-emerald-50',
      border: 'border-green-300',
      text: 'text-green-800',
      cornerAccent: 'rgba(187, 247, 208, 0.3)',
      cornerAccent2: 'rgba(167, 243, 208, 0.2)',
    }
  }
  // Geography worksheets
  if (docId.includes('geo') || docId.includes('geography') || docId.includes('continents') || docId.includes('map')) {
    return {
      background: 'bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50',
      border: 'border-amber-300',
      text: 'text-amber-800',
      cornerAccent: 'rgba(253, 230, 138, 0.3)',
      cornerAccent2: 'rgba(254, 243, 199, 0.2)',
    }
  }
  // Logic/Focus worksheets
  if (docId.includes('logic') || docId.includes('spot-difference') || docId.includes('pattern') || docId.includes('maze') || 
      docId.includes('missing-shape') || docId.includes('size-comparison') || docId.includes('shapes-colors-sort')) {
    return {
      background: 'bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50',
      border: 'border-slate-300',
      text: 'text-slate-800',
      cornerAccent: 'rgba(226, 232, 240, 0.3)',
      cornerAccent2: 'rgba(241, 245, 249, 0.2)',
    }
  }
  // Default theme
  return {
    background: 'bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50',
    border: 'border-purple-300',
    text: 'text-purple-800',
    cornerAccent: 'rgba(196, 181, 253, 0.3)',
    cornerAccent2: 'rgba(251, 207, 232, 0.2)',
  }
}

// Helper component to wrap worksheet sections with nice styling
function WorksheetSectionWrapper({ 
  docId, 
  title, 
  emoji, 
  description, 
  children 
}: { 
  docId: string
  title: string
  emoji?: string
  description?: string
  children: ReactNode 
}) {
  const theme = getWorksheetTheme(docId)
  return (
    <section className={`mb-10 break-inside-avoid rounded-xl border-2 ${theme.border} ${theme.background} p-6 print:border-0 print:p-0 print:bg-white shadow-lg relative overflow-hidden`}>
      {/* Decorative corner accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br rounded-bl-full pointer-events-none print:hidden" style={{ backgroundColor: theme.cornerAccent }} />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr rounded-tr-full pointer-events-none print:hidden" style={{ backgroundColor: theme.cornerAccent2 }} />
      <div className="relative z-10">
        <h2 className={`text-xl font-bold ${theme.text} mb-2 flex items-center gap-2`}>
          {emoji && <span className="text-4xl">{emoji}</span>}
          <span>{title}</span>
        </h2>
        {description && <p className={`text-sm ${theme.text} opacity-90 font-medium mb-4`}>{description}</p>}
        {children}
      </div>
    </section>
  )
}

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
  'reading-g1-red-balloon',
  'reading-g1-big-box',
  'reading-g1-garden-snail',
  'reading-g1-birthday-cake',
  'reading-g2-paper-bridge',
  'reading-g2-rainy-garden',
  'reading-g2-library-card',
  'reading-g2-lost-and-found',
  'reading-g2-bird-feeder',
  'reading-g2-cookie-recipe',
  'reading-g2-tree-house',
  'reading-g3-lighthouse',
  'reading-g3-science-fair',
  'reading-g3-community-garden',
  'reading-g3-school-play',
  'reading-g3-art-project',
  // 2nd grade math printables
  'place-value-hto',
  'skip-count-5-10-120',
  'add-2digit-100',
  'sub-2digit-100',
  'word-problems-100',
  'compare-2digit',
  'even-odd-100',
  // New 1st Grade worksheets
  'number-bonds-10',
  'count-write-30',
  'missing-numbers-50',
  'picture-addition-10',
  'subtraction-stories',
  'balance-equations-10',
  'skip-count-2s',
  'number-line-add',
  'doubles-facts',
  'pattern-complete',
  'missing-shape',
  'size-comparison',
  // New 2nd Grade worksheets
  'expanded-form-200',
  'number-patterns-200',
  'rounding-nearest-10',
  'add-three-numbers',
  'missing-addends',
  'fact-families-20',
  'mental-math-20',
  'number-line-200',
  'doubles-near-doubles',
  // Multiplication worksheets
  'mult-facts-1-5',
  'mult-arrays-2-5',
  'skip-count-mult',
  'mult-word-problems-2-3',
  'mult-facts-6-12',
  'mult-arrays-models',
  'mult-multi-step-word',
  'mult-fact-families',
  'mult-2x1',
  'mult-2x2',
  'mult-area-model',
  'mult-complex-word',
  'mult-fact-fluency',
  'mult-mixed-review',
  'mult-strategies',
  'mult-patterns',
  // Times Table worksheets
  'times-table-horizontal-1-5',
  'times-table-horizontal-6-12',
  'times-table-horizontal-1-12',
  'times-table-vertical-1-5',
  'times-table-vertical-6-12',
  'times-table-vertical-1-12',
  'times-table-missing-1-5',
  'times-table-missing-6-12',
  'times-table-missing-mixed',
  'times-table-timed-1-5',
  'times-table-timed-6-12',
  'times-table-timed-1-12',
  'times-table-blank-1-5',
  'times-table-blank-6-12',
  'times-table-blank-1-12',
  'times-table-confidence-1-5',
  'times-table-confidence-6-12',
  'times-table-fluency-1-12',
  'times-table-mixed-review',
  'times-table-color-1-5',
  'times-table-color-6-12',
  'times-table-color-1-12',
  'money-coins-bills',
  'measurement-length',
  'bar-graphs-data',
  'more-less',
  'more-less-equal-10',
  // Kindergarten worksheets
  'count-circle-1-10',
  'count-match-1-20',
  'how-many-1-15',
  'count-color-1-10',
  'counting-objects-20',
  'number-id-1-10',
  'number-tracing-1-10',
  'number-matching-1-15',
  'number-order-1-20',
  'find-number-1-10',
  'shape-identification',
  'color-shapes',
  'shape-sorting',
  'color-recognition',
  'draw-shape',
  'ab-pattern',
  'color-patterns',
  'shape-patterns',
  'what-comes-next',
  'big-small',
  'more-less',
  'long-short',
  'heavy-light',
  'same-different',
  'line-tracing',
  'curve-tracing',
  'zigzag-lines',
  'path-tracing',
  // 3rd Grade worksheets
  'mult-facts-0-12',
  'mult-arrays',
  'mult-word-problems',
  'mult-by-10-100',
  'mult-properties',
  'div-facts-1-12',
  'div-with-remainders',
  'div-word-problems',
  'fact-families-mult-div',
  'div-by-10-100',
  'fractions-whole',
  'comparing-fractions',
  'equivalent-fractions',
  'fractions-number-line',
  'add-sub-fractions',
  'multi-step-word-problems',
  'elapsed-time-word-problems',
  'money-word-problems',
  'perimeter-area-word-problems',
  'identify-polygons',
  'perimeter-shapes',
  'area-rectangles',
  'lines-rays-angles',
  'symmetry',
  'time-to-minute',
  'customary-units',
  'metric-units',
  'liquid-measurement',
  'mass-weight',
  // 4th Grade worksheets
  'mult-2x1-digit',
  'mult-2x2-digit',
  'long-division-1digit',
  'long-division-2digit',
  'area-model-mult',
  'partial-products',
  'equivalent-fractions-4th',
  'comparing-fractions-4th',
  'add-sub-fractions-4th',
  'mixed-improper-fractions',
  'decimals-place-value',
  'comparing-decimals',
  'add-sub-decimals',
  'fractions-to-decimals',
  'classifying-angles',
  'area-perimeter-4th',
  'lines-angles-4th',
  'classifying-triangles',
  'classifying-quadrilaterals',
  'symmetry-transformations',
  'customary-conversion',
  'metric-conversion',
  'elapsed-time-4th',
  'liquid-measurement-4th',
  'mass-weight-4th',
  'multi-step-word-4th',
  'fraction-word-problems',
  'decimal-word-problems',
  'measurement-word-problems',
  'geometry-word-problems',
  'line-plots',
  'bar-graphs-pictographs',
  'mean-median-mode',
  // 5th Grade worksheets
  'mult-3x2-digit',
  'long-division-multidigit',
  'order-of-operations',
  'powers-of-10',
  'rounding-decimals',
  'estimating-sums-differences',
  'add-sub-mixed-numbers',
  'multiplying-fractions',
  'dividing-fractions',
  'multiplying-decimals',
  'dividing-decimals',
  'fractions-decimals-percents',
  'comparing-ordering-fractions-decimals',
  'evaluating-expressions',
  'writing-expressions',
  'solving-one-step-equations',
  'patterns-rules',
  'coordinate-graphing',
  'volume-rectangular-prisms',
  'area-triangles-parallelograms',
  'classifying-shapes',
  'nets-3d-shapes',
  'transformations-5th',
  'multi-step-word-5th',
  'fraction-word-problems-5th',
  'decimal-word-problems-5th',
  'ratio-proportion-word-problems',
  'percent-word-problems',
  'line-graphs',
  'mean-median-mode-range',
  'stem-leaf-plots',
  'probability',
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
    case 'reading-g1-red-balloon':
      return '📖 Grade 1 — The Red Balloon (Reading)'
    case 'reading-g1-big-box':
      return '📖 Grade 1 — The Big Box (Reading)'
    case 'reading-g1-garden-snail':
      return '📖 Grade 1 — The Garden Snail (Reading)'
    case 'reading-g1-birthday-cake':
      return '📖 Grade 1 — The Birthday Cake (Reading)'
    case 'reading-g2-bird-feeder':
      return '📖 Grade 2 — The Bird Feeder (Reading)'
    case 'reading-g2-cookie-recipe':
      return '📖 Grade 2 — The Cookie Recipe (Reading)'
    case 'reading-g2-tree-house':
      return '📖 Grade 2 — The Tree House (Reading)'
    case 'reading-g3-school-play':
      return '📖 Grade 3 — The School Play (Reading)'
    case 'reading-g3-art-project':
      return '📖 Grade 3 — The Art Project (Reading)'
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
    case 'add-2digit-regrouping':
      return '➕ 2‑Digit Addition (WITH Regrouping)'
    case 'sub-2digit-regrouping':
      return '➖ 2‑Digit Subtraction (WITH Regrouping)'
    case 'fractions-halves-thirds-fourths':
      return '🍕 Fractions: Halves, Thirds, Fourths'
    case 'rhyming-words':
      return '🎵 Rhyming Words'
    case 'cvc-words':
      return '📚 CVC Words (Consonant-Vowel-Consonant)'
    case 'sight-words-pre-primer':
      return '👁️ Sight Words (Dolch Pre-Primer)'
    case 'letter-tracing-az':
      return '✏️ Letter Tracing A–Z'
    case 'more-less-equal-10':
      return '⚖️ More, Less, or Equal? (1–10)'
    case 'counting-objects-20':
      return '🔢 Count the Objects (1–20)'
    case 'sentence-building':
      return '📝 Sentence Building'
    // Multiplication worksheets
    case 'mult-facts-1-5':
      return '✖️ Basic Multiplication Facts (1-5)'
    case 'mult-arrays-2-5':
      return '📊 Multiplication Arrays (2-5)'
    case 'skip-count-mult':
      return '➡️ Skip Counting for Multiplication'
    case 'mult-word-problems-2-3':
      return '🧮 Multiplication Word Problems (2nd-3rd)'
    case 'mult-facts-6-12':
      return '✖️ Advanced Multiplication Facts (6-12)'
    case 'mult-arrays-models':
      return '📊 Multiplication Arrays & Models'
    case 'mult-multi-step-word':
      return '🧮 Multi-Step Word Problems'
    case 'mult-fact-families':
      return '⚖️ Fact Families (Multiplication & Division)'
    case 'mult-2x1':
      return '✖️ Multi-Digit Multiplication (2×1)'
    case 'mult-2x2':
      return '✖️ Multi-Digit Multiplication (2×2)'
    case 'mult-area-model':
      return '📊 Area Model Multiplication'
    case 'mult-complex-word':
      return '🧮 Complex Word Problems'
    case 'mult-fact-fluency':
      return '⏱️ Multiplication Fact Fluency'
    case 'mult-mixed-review':
      return '🔢 Mixed Multiplication Review'
    case 'mult-strategies':
      return '🎯 Multiplication Strategies'
    case 'mult-patterns':
      return '📈 Multiplication Patterns'
    // Times Table worksheets
    case 'times-table-horizontal-1-5':
      return '➡️ Horizontal Times Table (1-5)'
    case 'times-table-horizontal-6-12':
      return '➡️ Horizontal Times Table (6-12)'
    case 'times-table-horizontal-1-12':
      return '➡️ Complete Horizontal Times Table (1-12)'
    case 'times-table-vertical-1-5':
      return '⬇️ Vertical Times Table (1-5)'
    case 'times-table-vertical-6-12':
      return '⬇️ Vertical Times Table (6-12)'
    case 'times-table-vertical-1-12':
      return '⬇️ Complete Vertical Times Table (1-12)'
    case 'times-table-missing-1-5':
      return '❓ Missing Number Times Table (1-5)'
    case 'times-table-missing-6-12':
      return '❓ Missing Number Times Table (6-12)'
    case 'times-table-missing-mixed':
      return '❓ Mixed Missing Number Challenge'
    case 'times-table-timed-1-5':
      return '⏱️ Timed Times Table Test (1-5)'
    case 'times-table-timed-6-12':
      return '⏱️ Timed Times Table Test (6-12)'
    case 'times-table-timed-1-12':
      return '⏱️ Complete Timed Test (1-12)'
    case 'times-table-blank-1-5':
      return '📋 Blank Times Table (1-5) - Fill In'
    case 'times-table-blank-6-12':
      return '📋 Blank Times Table (6-12) - Fill In'
    case 'times-table-blank-1-12':
      return '📋 Complete Blank Times Table (1-12)'
    case 'times-table-confidence-1-5':
      return '💪 Confidence-Building Times Table (1-5)'
    case 'times-table-confidence-6-12':
      return '💪 Confidence-Building Times Table (6-12)'
    case 'times-table-fluency-1-12':
      return '⚡ Times Table Fluency Practice (1-12)'
    case 'times-table-mixed-review':
      return '⚡ Mixed Times Table Review'
    case 'times-table-color-1-5':
      return '🎨 Color-by-Number Times Table (1-5)'
    case 'times-table-color-6-12':
      return '🎨 Color-by-Number Times Table (6-12)'
    case 'times-table-color-1-12':
      return '🎨 Color-by-Number Times Table (1-12)'
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
    // Kindergarten worksheets
    case 'count-circle-1-10':
      return '🔢 Count & Circle 1–10'
    case 'count-match-1-20':
      return '🔢 Count & Match 1–20'
    case 'how-many-1-15':
      return '🔢 How Many? (1–15)'
    case 'count-color-1-10':
      return '🔢 Count & Color (1–10)'
    case 'number-id-1-10':
      return '🔟 Number Identification 1–10'
    case 'number-matching-1-15':
      return '🔟 Number Matching 1–15'
    case 'number-order-1-20':
      return '🔟 Number Order 1–20'
    case 'find-number-1-10':
      return '🔟 Find the Number (1–10)'
    case 'shape-identification':
      return '🟩 Shape Identification'
    case 'color-shapes':
      return '🟩 Color the Shapes'
    case 'shape-sorting':
      return '🟩 Shape Sorting'
    case 'color-recognition':
      return '🟩 Color Recognition'
    case 'draw-shape':
      return '🟩 Draw the Shape'
    case 'ab-pattern':
      return '🧩 AB Pattern Completion'
    case 'color-patterns':
      return '🧩 Color Patterns'
    case 'shape-patterns':
      return '🧩 Shape Patterns'
    case 'what-comes-next':
      return '🧩 What Comes Next?'
    case 'big-small':
      return '⚖️ Big and Small'
    case 'more-less':
      return '⚖️ More and Less'
    case 'long-short':
      return '⚖️ Long and Short'
    case 'heavy-light':
      return '⚖️ Heavy and Light'
    case 'same-different':
      return '⚖️ Same and Different'
    case 'line-tracing':
      return '✏️ Line Tracing'
    case 'curve-tracing':
      return '✏️ Curve Tracing'
    case 'zigzag-lines':
      return '✏️ Zigzag Lines'
    case 'path-tracing':
      return '✏️ Path Tracing'
    // 3rd Grade worksheets
    case 'mult-facts-0-12':
      return '✖️ Multiplication Facts 0–12'
    case 'mult-arrays':
      return '✖️ Multiplication Arrays'
    case 'mult-word-problems':
      return '✖️ Multiplication Word Problems'
    case 'mult-by-10-100':
      return '✖️ Multiplying by 10, 100'
    case 'mult-properties':
      return '✖️ Properties of Multiplication'
    case 'div-facts-1-12':
      return '➗ Division Facts 1–12'
    case 'div-with-remainders':
      return '➗ Division with Remainders'
    case 'div-word-problems':
      return '➗ Division Word Problems'
    case 'fact-families-mult-div':
      return '➗ Fact Families (Mult/Div)'
    case 'div-by-10-100':
      return '➗ Dividing by 10, 100'
    case 'fractions-whole':
      return '🍕 Fractions: Parts of a Whole'
    case 'comparing-fractions':
      return '🍕 Comparing Fractions'
    case 'equivalent-fractions':
      return '🍕 Equivalent Fractions'
    case 'fractions-number-line':
      return '🍕 Fractions on a Number Line'
    case 'add-sub-fractions':
      return '🍕 Adding & Subtracting Fractions'
    case 'multi-step-word-problems':
      return '🧮 Multi-Step Word Problems'
    case 'elapsed-time-word-problems':
      return '🧮 Elapsed Time Word Problems'
    case 'money-word-problems':
      return '🧮 Money Word Problems'
    case 'perimeter-area-word-problems':
      return '🧮 Perimeter & Area Word Problems'
    case 'identify-polygons':
      return '📐 Identify Polygons'
    case 'perimeter-shapes':
      return '📐 Perimeter of Shapes'
    case 'area-rectangles':
      return '📐 Area of Rectangles'
    case 'lines-rays-angles':
      return '📐 Lines, Rays, and Angles'
    case 'symmetry':
      return '📐 Symmetry'
    case 'time-to-minute':
      return '📏 Time to the Minute'
    case 'customary-units':
      return '📏 Customary Units'
    case 'metric-units':
      return '📏 Metric Units'
    case 'liquid-measurement':
      return '📏 Liquid Measurement'
    case 'mass-weight':
      return '📏 Mass and Weight'
    // 4th Grade worksheets
    case 'mult-2x1-digit':
      return '🔢 Multi-Digit Multiplication (2×1)'
    case 'mult-2x2-digit':
      return '🔢 Multi-Digit Multiplication (2×2)'
    case 'long-division-1digit':
      return '🔢 Long Division (1-Digit Divisor)'
    case 'long-division-2digit':
      return '🔢 Long Division (2-Digit Divisor)'
    case 'area-model-mult':
      return '🔢 Area Model Multiplication'
    case 'partial-products':
      return '🔢 Partial Products Multiplication'
    case 'equivalent-fractions-4th':
      return '🍕 Equivalent Fractions'
    case 'comparing-fractions-4th':
      return '🍕 Comparing Fractions'
    case 'add-sub-fractions-4th':
      return '🍕 Adding & Subtracting Fractions'
    case 'mixed-improper-fractions':
      return '🍕 Mixed Numbers & Improper Fractions'
    case 'decimals-place-value':
      return '🍕 Decimals: Place Value'
    case 'comparing-decimals':
      return '🍕 Comparing & Ordering Decimals'
    case 'add-sub-decimals':
      return '🍕 Adding & Subtracting Decimals'
    case 'fractions-to-decimals':
      return '🍕 Fractions to Decimals'
    case 'classifying-angles':
      return '📐 Classifying Angles'
    case 'area-perimeter-4th':
      return '📐 Area & Perimeter'
    case 'lines-angles-4th':
      return '📐 Lines & Angles'
    case 'classifying-triangles':
      return '📐 Classifying Triangles'
    case 'classifying-quadrilaterals':
      return '📐 Classifying Quadrilaterals'
    case 'symmetry-transformations':
      return '📐 Symmetry & Transformations'
    case 'customary-conversion':
      return '📏 Customary Units Conversion'
    case 'metric-conversion':
      return '📏 Metric Units Conversion'
    case 'elapsed-time-4th':
      return '📏 Elapsed Time'
    case 'liquid-measurement-4th':
      return '📏 Liquid Measurement'
    case 'mass-weight-4th':
      return '📏 Mass and Weight'
    case 'multi-step-word-4th':
      return '🧮 Multi-Step Word Problems'
    case 'fraction-word-problems':
      return '🧮 Fraction Word Problems'
    case 'decimal-word-problems':
      return '🧮 Decimal Word Problems'
    case 'measurement-word-problems':
      return '🧮 Measurement Word Problems'
    case 'geometry-word-problems':
      return '🧮 Geometry Word Problems'
    case 'line-plots':
      return '📊 Line Plots'
    case 'bar-graphs-pictographs':
      return '📊 Bar Graphs & Pictographs'
    case 'mean-median-mode':
      return '📊 Mean, Median, Mode'
    // 5th Grade worksheets
    case 'mult-3x2-digit':
      return '🔢 Multi-Digit Multiplication (3×2)'
    case 'long-division-multidigit':
      return '🔢 Long Division (Multi-Digit)'
    case 'order-of-operations':
      return '🔢 Order of Operations'
    case 'powers-of-10':
      return '🔢 Powers of 10'
    case 'rounding-decimals':
      return '🔢 Rounding Decimals'
    case 'estimating-sums-differences':
      return '🔢 Estimating Sums & Differences'
    case 'add-sub-mixed-numbers':
      return '🍕 Adding & Subtracting Mixed Numbers'
    case 'multiplying-fractions':
      return '🍕 Multiplying Fractions'
    case 'dividing-fractions':
      return '🍕 Dividing Fractions'
    case 'multiplying-decimals':
      return '🍕 Multiplying Decimals'
    case 'dividing-decimals':
      return '🍕 Dividing Decimals'
    case 'fractions-decimals-percents':
      return '🍕 Fractions, Decimals, & Percents'
    case 'comparing-ordering-fractions-decimals':
      return '🍕 Comparing & Ordering Fractions/Decimals'
    case 'evaluating-expressions':
      return '📐 Evaluating Expressions'
    case 'writing-expressions':
      return '📐 Writing Expressions'
    case 'solving-one-step-equations':
      return '📐 Solving One-Step Equations'
    case 'patterns-rules':
      return '📐 Patterns & Rules'
    case 'coordinate-graphing':
      return '📐 Coordinate Graphing'
    case 'volume-rectangular-prisms':
      return '📐 Volume of Rectangular Prisms'
    case 'area-triangles-parallelograms':
      return '📐 Area of Triangles & Parallelograms'
    case 'classifying-shapes':
      return '📐 Classifying 2D & 3D Shapes'
    case 'nets-3d-shapes':
      return '📐 Nets of 3D Shapes'
    case 'transformations-5th':
      return '📐 Transformations'
    case 'multi-step-word-5th':
      return '🧮 Multi-Step Word Problems'
    case 'fraction-word-problems-5th':
      return '🧮 Fraction Word Problems'
    case 'decimal-word-problems-5th':
      return '🧮 Decimal Word Problems'
    case 'ratio-proportion-word-problems':
      return '🧮 Ratio & Proportion Word Problems'
    case 'percent-word-problems':
      return '🧮 Percent Word Problems'
    case 'line-graphs':
      return '📊 Line Graphs'
    case 'mean-median-mode-range':
      return '📊 Mean, Median, Mode, Range'
    case 'stem-leaf-plots':
      return '📊 Stem-and-Leaf Plots'
    case 'probability':
      return '📊 Probability'
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
  const isPreview = (params.get('preview') || '').toLowerCase() === '1' || (params.get('preview') || '').toLowerCase() === 'true'
  const packTime = params.get('time') || '5'
  const packAge = params.get('age') || 'k2'
  const packSkill = params.get('skill') || 'mixed'
  const fromParam = params.get('from') || ''
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
  const bundleAnswerSections: Array<{ docId: string; title: string; content: ReactNode }> = []
  const showAnswersForDoc = (docId: string, factory: () => ReactNode) => {
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
    : v === '25' ? '2nd-5th Grade'
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
        : age === '25' || age === '35'
          ? ['THIS','THAT','WHEN','YOUR','WHICH','WHERE','THEIR','COULD','WOULD','SHOULD']
          : ['BECAUSE','THROUGH','BEFORE','BETWEEN','AROUND','ANOTHER','ALREADY','THOUGHT','ENOUGH','FAMILY']
    }
    if (theme === 'space') {
      return age === 'k2'
        ? ['MOON','STAR','SKY','SUN','ROCK','DUST','SHIP','RING']
        : age === '25' || age === '35'
          ? ['MARS','COMET','ORBIT','ROVER','VENUS','SATURN','PLUTO','CRATER']
          : ['NEBULA','GALAXY','ROCKET','ASTRO','QUASAR','ECLIPSE','METEOR','COSMOS']
    }
    // animals
    return age === 'k2'
      ? ['CAT','DOG','OWL','PIG','ANT','FOX','BEE','COW','BAT','HEN']
      : age === '25' || age === '35'
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
  // Track worksheet view on mount
  React.useEffect(() => {
    if (doc && primaryDoc) {
      const from = params.get('from') || 'unknown'
      const grade = from.includes('grade') ? from.replace('-grade', '') : 
                    from.includes('kindergarten') ? 'kindergarten' :
                    from.includes('multiplication') ? 'multiplication' :
                    from.includes('reading') ? 'reading' : undefined
      trackWorksheetView(primaryDoc, docTitle, from, grade)
    }
  }, [doc, primaryDoc, docTitle])

  // Track time on page
  React.useEffect(() => {
    const startTime = Date.now()
    return () => {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000)
      if (timeSpent > 3) { // Only track if user spent more than 3 seconds
        trackTimeOnPage(`/print?doc=${doc}`, timeSpent)
      }
    }
  }, [doc])

  // Track scroll depth
  React.useEffect(() => {
    let maxScroll = 0
    const handleScroll = () => {
      const scrollPercent = Math.round(
        ((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight) * 100
      )
      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent
        if (scrollPercent >= 25 && scrollPercent < 50 && maxScroll < 50) {
          trackScrollDepth(`/print?doc=${doc}`, 25)
        } else if (scrollPercent >= 50 && scrollPercent < 75 && maxScroll < 75) {
          trackScrollDepth(`/print?doc=${doc}`, 50)
        } else if (scrollPercent >= 75 && scrollPercent < 100 && maxScroll < 100) {
          trackScrollDepth(`/print?doc=${doc}`, 75)
        } else if (scrollPercent >= 100) {
          trackScrollDepth(`/print?doc=${doc}`, 100)
        }
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [doc])

  // Auto-open browser print dialog when requested (e.g., from "Download PDF" links)
  React.useEffect(() => {
    try {
      if (!autoPrint) return
      // Defer a bit to let the view render fully
      const t = setTimeout(() => { 
        try { 
          window.print()
          // Track auto-print
          if (doc && primaryDoc) {
            const from = params.get('from') || 'unknown'
            const grade = from.includes('grade') ? from.replace('-grade', '') : undefined
            trackPrintDialog(primaryDoc, from)
            trackWorksheetDownload(primaryDoc, docTitle, from, grade)
          }
        } catch {} 
      }, 1200)
      return () => clearTimeout(t)
    } catch {}
  }, [autoPrint, doc, primaryDoc, docTitle])
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
        /* Preview mode - hide navigation and UI elements for thumbnail previews */
        .preview-mode header,
        .preview-mode .mb-4,
        .preview-mode nav,
        .preview-mode button,
        .preview-mode a[href*="pinterest"],
        .preview-mode a[aria-label*="Back"],
        .preview-mode a[aria-label*="Pin"],
        .preview-mode a[aria-label*="Download"] {
          display: none !important;
        }
        .preview-mode {
          padding: 0.5rem !important;
          max-width: 100% !important;
        }
      `}</style>
      {/* Print layout optimized - updated 2025-01-11 */}
      <div className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 print:p-0 print:py-4 ${isPreview ? 'preview-mode' : ''}`}>
        {/* Customization header (print view - appears once at top) */}
        {(teacherName || className || studentNames.length > 0) && !isPreview && (
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
        {!isPreview && (
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
                // If coming from grade pages, go back to the appropriate grade page
                if (from === 'kindergarten') {
                  return '/worksheets/kindergarten-math-worksheets'
                }
                if (from === '1st-grade') {
                  return '/worksheets/1st-grade-math-worksheets'
                }
                if (from === '2nd-grade') {
                  return '/worksheets/2nd-grade-math-worksheets'
                }
                if (from === '3rd-grade') {
                  return '/worksheets/3rd-grade-math-worksheets'
                }
                if (from === '4th-grade') {
                  return '/worksheets/4th-grade-math-worksheets'
                }
                if (from === '5th-grade') {
                  return '/worksheets/5th-grade-math-worksheets'
                }
                if (from === 'reading-comprehension') {
                  return '/worksheets/reading-comprehension'
                }
                if (from === 'multiplication') {
                  return '/worksheets/multiplication-worksheets'
                }
                if (from === 'times-table') {
                  return '/worksheets/times-table-multiplication-worksheets'
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
                if (from === 'kindergarten') {
                  return 'Back to Kindergarten Math Worksheets'
                }
                if (from === '1st-grade') {
                  return 'Back to 1st Grade Math Worksheets'
                }
                if (from === '2nd-grade') {
                  return 'Back to 2nd Grade Math Worksheets'
                }
                if (from === '3rd-grade') {
                  return 'Back to 3rd Grade Math Worksheets'
                }
                if (from === '4th-grade') {
                  return 'Back to 4th Grade Math Worksheets'
                }
                if (from === '5th-grade') {
                  return 'Back to 5th Grade Math Worksheets'
                }
                if (from === 'reading-comprehension') {
                  return 'Back to Reading Comprehension Worksheets'
                }
                if (from === 'multiplication') {
                  return 'Back to Multiplication Worksheets'
                }
                if (from === 'times-table') {
                  return 'Back to Times Table Multiplication Worksheets'
                }
                return 'Back printable page'
              } catch {
                return 'Back printable page'
              }
            })()}</span>
          </a>
        </div>
        )}
        {!isPreview && (
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
                  onClick={() => {
                    const newValue = !showAnswers
                    setShowAnswers(newValue)
                    trackAnswerKeyToggle(primaryDoc, newValue ? 'show' : 'hide')
                  }}
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
                onClick={() => {
                  const from = params.get('from') || 'unknown'
                  const grade = from.includes('grade') ? from.replace('-grade', '') : 
                                from.includes('kindergarten') ? 'kindergarten' :
                                from.includes('multiplication') ? 'multiplication' :
                                from.includes('reading') ? 'reading' : undefined
                  trackPrintDialog(primaryDoc, from)
                  trackWorksheetDownload(primaryDoc, docTitle, from, grade)
                  window.print()
                }}
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
        )}

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
          <WorksheetSectionWrapper
            docId="number-tracing-1-10"
            title="Trace Numbers 1–10"
            emoji="🔢"
            description="Start‑point arrows included. Say each number while tracing; then color one object for each number."
          >
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
            {showAnswersForDoc('number-tracing-1-10', () => (
              <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                <div className="font-semibold mb-1">Answer key</div>
                <p className="text-sm">Trace each number following the dashed lines. Start at the red dot and follow the arrow direction.</p>
              </div>
            ))}
          </WorksheetSectionWrapper>
        )}

        {activeDocs.includes('number-tracing-1-20') && (
          <WorksheetSectionWrapper
            docId="number-tracing-1-20"
            title="Trace Numbers 1–20"
            emoji="🔢"
            description="Start‑point arrows included. Say each number while tracing; then color one object for each number."
          >
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
            {showAnswersForDoc('number-tracing-1-20', () => (
              <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                <div className="font-semibold mb-1">Answer key</div>
                <p className="text-sm">Trace each number following the dashed lines. Start at the red dot and follow the arrow direction. Numbers 1-20 should be traced in order.</p>
              </div>
            ))}
          </WorksheetSectionWrapper>
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
          <WorksheetSectionWrapper
            docId="addition-subtraction-0-10"
            title="Addition & Subtraction 0–10"
            emoji="➕➖"
            description="Use the number line if needed to solve each addition problem. Write the correct answer in the blank space provided."
          >
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
          </WorksheetSectionWrapper>
        )}

        {activeDocs.includes('ten-frames-1-10') && (
          <WorksheetSectionWrapper
            docId="ten-frames-1-10"
            title="Ten Frames 1–10"
            emoji="🔟"
            description="Color the circles to match each number. Say how many are filled and how many are empty."
          >
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
          </WorksheetSectionWrapper>
        )}

        {activeDocs.includes('place-value-hto') && (() => {
          const nums = [12, 27, 45, 63, 84, 99, 30, 51];
          const isColor = true; // default colorful visuals
          return (
            <WorksheetSectionWrapper
              docId="place-value-hto"
              title="Place Value – Tens and Ones (to 99)"
              emoji="🔢"
              description="Write how many tens and ones in each number. Then write the complete number in expanded form in the blank spaces."
            >
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
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('skip-count-5-10-120') && (() => {
          const seq5 = Array.from({ length: 24 }, (_, i) => (i + 1) * 5); // 5..120
          const seq10 = Array.from({ length: 12 }, (_, i) => (i + 1) * 10); // 10..120
          const isBlank5 = (i: number) => i % 3 === 1; // blank some boxes for practice
          const isBlank10 = (i: number) => i % 3 === 2;
          return (
            <WorksheetSectionWrapper
              docId="skip-count-5-10-120"
              title="Skip Counting by 5s and 10s (to 120)"
              emoji="🔁"
              description="Fill in the missing numbers."
            >
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-fuchsia-400 to-amber-400 animate-gradient-x mb-2" />
              <div className="space-y-6 text-sm">
                <div>
                  <div className="font-semibold text-slate-800 mb-2">Count by 5s to 120</div>
                  <div className="grid grid-cols-12 gap-1">
                    {seq5.map((n, i) => (
                      <div key={i} className="h-12 border border-slate-300 rounded flex items-center justify-center bg-white">
                        {isBlank5(i) ? <span className="inline-block w-20 h-10 border-b-[3px] border-slate-600 align-middle" /> : <span className="font-mono text-base text-slate-900">{n}</span>}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="font-semibold text-slate-800 mb-2">Count by 10s to 120</div>
                  <div className="grid grid-cols-12 gap-1">
                    {seq10.map((n, i) => (
                      <div key={i} className="h-12 border border-slate-300 rounded flex items-center justify-center bg-white">
                        {isBlank10(i) ? <span className="inline-block w-20 h-10 border-b-[3px] border-slate-600 align-middle" /> : <span className="font-mono text-base text-slate-900">{n}</span>}
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
            </WorksheetSectionWrapper>
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
            <WorksheetSectionWrapper
              docId="add-2digit-100"
              title="2‑Digit Addition (No Regrouping)"
              emoji="➕"
              description="Add the two numbers. No regrouping needed."
            >
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-emerald-400 to-sky-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-2 gap-3">
                {pairs.map(([a,b],i)=> (
                  <div key={i} className="border border-slate-300 rounded p-3 bg-white w-full">
                    <div className="font-mono text-2xl leading-7 text-right">
                      <div>{a}</div>
                      <div>+ {b}</div>
                      <div className="border-t-[3px] border-slate-600 mt-2 pt-2 h-12 flex items-center"><span className="inline-block w-20 h-10 border-b-[3px] border-slate-600" /></div>
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
            </WorksheetSectionWrapper>
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
            <WorksheetSectionWrapper
              docId="sub-2digit-100"
              title="2‑Digit Subtraction (No Regrouping)"
              emoji="➖"
              description="Subtract the two numbers. No regrouping needed."
            >
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-rose-400 to-fuchsia-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-2 gap-3">
                {pairs.map(([a,b],i)=> (
                  <div key={i} className="border border-slate-300 rounded p-3 bg-white w-full">
                    <div className="font-mono text-2xl leading-7 text-right">
                      <div>{a}</div>
                      <div>− {b}</div>
                      <div className="border-t-[3px] border-slate-600 mt-2 pt-2 h-12 flex items-center"><span className="inline-block w-20 h-10 border-b-[3px] border-slate-600" /></div>
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
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('word-problems-100') && (
          <WorksheetSectionWrapper
            docId="word-problems-100"
            title="2nd‑Grade Word Problems (within 100)"
            emoji="🧮"
            description="Read each word problem carefully. Write a number sentence (equation) and solve. Show your answer in the blank space."
          >
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
                  <div className="h-10 border-b-[3px] border-slate-600 mt-2" />
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
          </WorksheetSectionWrapper>
        )}

        {activeDocs.includes('compare-2digit') && (() => {
          const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`);
          function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }
          const pairs: Array<[number, number]> = Array.from({length:10}).map(()=> {
            const a = nextInt(10,99); const b = nextInt(10,99); return [a,b];
          });
          return (
            <WorksheetSectionWrapper
              docId="compare-2digit"
              title="Compare 2‑Digit Numbers"
              emoji="⚖️"
              description="Write one comparison symbol in each blank: > (greater than), < (less than), or = (equal to). Tip: Compare tens first. If tens are equal, compare ones."
            >
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-indigo-400 to-sky-400 animate-gradient-x mb-2" />
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
                    <span className="mx-2 inline-block w-16 h-10 border-b-[3px] border-slate-600 align-middle" aria-label="comparison symbol box" />
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
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('even-odd-100') && (() => {
          const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`);
          const nums = Array.from({length:20}).map(()=> Math.floor(rng()*100));
          return (
            <WorksheetSectionWrapper
              docId="even-odd-100"
              title="Even or Odd? (to 100)"
              emoji="🧲"
              description="Circle whether each number is even or odd."
            >
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
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('time-5min') && (
          <WorksheetSectionWrapper
            docId="time-5min"
            title="Tell Time to 5 Minutes"
            emoji="🕒"
            description="Draw the clock hands to show each time."
          >
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
          </WorksheetSectionWrapper>
        )}

        {activeDocs.includes('ten-frames-1-20') && (
          <WorksheetSectionWrapper
            docId="ten-frames-1-20"
            title="Ten Frames 1–20"
            emoji="🔟"
            description="Color the circles to match each number. Say how many are filled and how many are empty."
          >
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
          </WorksheetSectionWrapper>
        )}

        {activeDocs.includes('shapes-colors-sort') && (
          <WorksheetSectionWrapper
            docId="shapes-colors-sort"
            title="Shapes & Colors Sort (Cut & Glue)"
            emoji="🟩"
            description="Cut out the shapes, then sort into the right color boxes. Practice scissor skills safely."
          >
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
          </WorksheetSectionWrapper>
        )}

        {activeDocs.includes('dot-to-dot-1-20') && (
          <WorksheetSectionWrapper
            docId="dot-to-dot-1-20"
            title="1–20 Dot‑to‑Dot"
            emoji="🔢"
            description="Connect the dots in order to reveal the picture."
          >
            <svg viewBox="0 0 800 400" className="w-full h-auto bg-white border border-slate-300 rounded">
              {Array.from({ length: 20 }).map((_,i)=> (
                <g key={i}>
                  <circle cx={60 + i*35} cy={200 + (i%2===0? -30:30)} r="4" fill="#111827" />
                  <text x={60 + i*35 + 6} y={200 + (i%2===0? -30:30) - 6} fontSize="12">{i+1}</text>
                </g>
              ))}
            </svg>
          </WorksheetSectionWrapper>
        )}

        {activeDocs.includes('tangram-animals') && (
          <WorksheetSectionWrapper
            docId="tangram-animals"
            title="Tangram Animals (Cutouts)"
            emoji="🧩"
            description="Cut the shapes and arrange to make animal silhouettes. Glue the final shape on a clean sheet."
          >
            <svg viewBox="0 0 800 400" className="w-full h-auto bg-white border border-slate-300 rounded">
              <g fill="none" stroke="#111827" strokeWidth="3.5">
                <polygon points="100,50 200,50 200,150 100,150" />
                <polygon points="220,50 270,100 220,150 170,100" />
                <polygon points="300,50 350,50 350,150 300,150" />
                <polygon points="380,50 430,100 380,150 330,100" />
                <polygon points="460,50 560,50 560,150 460,150" />
              </g>
            </svg>
          </WorksheetSectionWrapper>
        )}

        {activeDocs.includes('spot-difference') && (
          <WorksheetSectionWrapper
            docId="spot-difference"
            title="Spot‑the‑Difference (7)"
            emoji="👀"
            description="Find 7 differences between the two pictures."
          >
            <div className="grid grid-cols-2 gap-4">
              <HiddenObjectsSceneSVGA />
              <HiddenObjectsSceneSVGB />
            </div>
          </WorksheetSectionWrapper>
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
          <WorksheetSectionWrapper
            docId="reading-g1-pet-fish"
            title="Passage — The Pet Fish (Grade 1)"
            emoji="📖"
            description="Short passage with 4 comprehension questions. Read carefully and answer in full sentences."
          >
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
          </WorksheetSectionWrapper>
        )}
        {activeDocs.includes('reading-g2-paper-bridge') && (
          <WorksheetSectionWrapper
            docId="reading-g2-paper-bridge"
            title="Passage — The Paper Bridge (Grade 2)"
            emoji="📖"
            description="Short passage with comprehension questions. Read carefully and answer in full sentences."
          >
            <div className="bg-white border border-slate-300 rounded p-4">
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
          </WorksheetSectionWrapper>
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
        {activeDocs.includes('reading-g1-red-balloon') && (
          <WorksheetSectionWrapper
            docId="reading-g1-red-balloon"
            title="Passage — The Red Balloon (Grade 1)"
            emoji="📖"
            description="Short passage with 4 comprehension questions. Read carefully and answer in full sentences."
          >
            <div className="bg-white border border-slate-300 rounded p-4">
              <p className="text-slate-800 text-base">Sam got a red balloon at the fair. He held the string tight. The wind blew and the balloon went up, up, up! Sam watched it fly away. His dad said, "We can get another one." Sam smiled and nodded.</p>
              <ol className="list-decimal list-inside mt-3 text-slate-800 text-base space-y-1">
                <li>Where did Sam get the balloon?</li>
                <li>What color was the balloon?</li>
                <li>What happened when the wind blew?</li>
                <li>What did Dad say?</li>
              </ol>
              {showAnswersForDoc('reading-g1-red-balloon', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ol className="list-decimal list-inside space-y-0.5">
                    <li>At the fair</li>
                    <li>Red</li>
                    <li>It flew away</li>
                    <li>"We can get another one"</li>
                  </ol>
                </div>
              ))}
            </div>
          </WorksheetSectionWrapper>
        )}
        {activeDocs.includes('reading-g1-big-box') && (
          <WorksheetSectionWrapper
            docId="reading-g1-big-box"
            title="Passage — The Big Box (Grade 1)"
            emoji="📖"
            description="Short passage with 4 comprehension questions. Read carefully and answer in full sentences."
          >
            <div className="bg-white border border-slate-300 rounded p-4">
              <p className="text-slate-800 text-base">Mia found a big box in the garage. She opened it and saw old toys. There was a doll, a car, and a ball. Mia asked Mom, "Can I play with these?" Mom said yes. Mia played all afternoon.</p>
              <ol className="list-decimal list-inside mt-3 text-slate-800 text-base space-y-1">
                <li>Where did Mia find the box?</li>
                <li>What was inside the box?</li>
                <li>What three things did she see?</li>
                <li>How long did Mia play?</li>
              </ol>
              {showAnswersForDoc('reading-g1-big-box', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ol className="list-decimal list-inside space-y-0.5">
                    <li>In the garage</li>
                    <li>Old toys</li>
                    <li>A doll, a car, and a ball</li>
                    <li>All afternoon</li>
                  </ol>
                </div>
              ))}
            </div>
          </WorksheetSectionWrapper>
        )}
        {activeDocs.includes('reading-g1-garden-snail') && (
          <WorksheetSectionWrapper
            docId="reading-g1-garden-snail"
            title="Passage — The Garden Snail (Grade 1)"
            emoji="📖"
            description="Short passage with 4 comprehension questions. Read carefully and answer in full sentences."
          >
            <div className="bg-white border border-slate-300 rounded p-4">
              <p className="text-slate-800 text-base">Noah saw a snail in the garden. It had a brown shell. The snail moved very slowly. Noah watched it crawl on a leaf. The snail left a shiny trail. Noah smiled and said, "Hello, little snail!"</p>
              <ol className="list-decimal list-inside mt-3 text-slate-800 text-base space-y-1">
                <li>Where did Noah see the snail?</li>
                <li>What color was the shell?</li>
                <li>How did the snail move?</li>
                <li>What did the snail leave behind?</li>
              </ol>
              {showAnswersForDoc('reading-g1-garden-snail', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ol className="list-decimal list-inside space-y-0.5">
                    <li>In the garden</li>
                    <li>Brown</li>
                    <li>Very slowly</li>
                    <li>A shiny trail</li>
                  </ol>
                </div>
              ))}
            </div>
          </WorksheetSectionWrapper>
        )}
        {activeDocs.includes('reading-g1-birthday-cake') && (
          <WorksheetSectionWrapper
            docId="reading-g1-birthday-cake"
            title="Passage — The Birthday Cake (Grade 1)"
            emoji="📖"
            description="Short passage with 4 comprehension questions. Read carefully and answer in full sentences."
          >
            <div className="bg-white border border-slate-300 rounded p-4">
              <p className="text-slate-800 text-base">It was Emma's birthday. Mom made a chocolate cake. There were five candles on top. Emma closed her eyes and made a wish. Then she blew out all the candles. Everyone clapped and sang "Happy Birthday!"</p>
              <ol className="list-decimal list-inside mt-3 text-slate-800 text-base space-y-1">
                <li>Whose birthday was it?</li>
                <li>What kind of cake did Mom make?</li>
                <li>How many candles were on the cake?</li>
                <li>What did everyone do after Emma blew out the candles?</li>
              </ol>
              {showAnswersForDoc('reading-g1-birthday-cake', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ol className="list-decimal list-inside space-y-0.5">
                    <li>Emma's</li>
                    <li>Chocolate cake</li>
                    <li>Five</li>
                    <li>Clapped and sang "Happy Birthday!"</li>
                  </ol>
                </div>
              ))}
            </div>
          </WorksheetSectionWrapper>
        )}
        {activeDocs.includes('reading-g2-bird-feeder') && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">Passage — The Bird Feeder (Grade 2)</h2>
            <div className="bg-white border border-slate-300 rounded p-4">
              <p className="text-slate-800 text-base">Carlos and his sister made a bird feeder from a milk carton. They cut a hole in the side and filled it with seeds. They hung it on a tree branch. The next morning, a blue jay came to eat. Carlos wrote in his journal, "Our feeder works!"</p>
              <ol className="list-decimal list-inside mt-3 text-slate-800 text-base space-y-1">
                <li>What did they use to make the feeder?</li>
                <li>What did they put inside?</li>
                <li>Where did they hang it?</li>
                <li>What bird came to visit?</li>
              </ol>
              {showAnswersForDoc('reading-g2-bird-feeder', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ol className="list-decimal list-inside space-y-0.5">
                    <li>A milk carton</li>
                    <li>Seeds</li>
                    <li>On a tree branch</li>
                    <li>A blue jay</li>
                  </ol>
                </div>
              ))}
            </div>
          </section>
        )}
        {activeDocs.includes('reading-g2-cookie-recipe') && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">Passage — The Cookie Recipe (Grade 2)</h2>
            <div className="bg-white border border-slate-300 rounded p-4">
              <p className="text-slate-800 text-base">Ava wanted to bake cookies with her grandma. They read the recipe together. They needed flour, sugar, eggs, and butter. Ava measured the flour carefully. Grandma said, "Good job!" The cookies came out golden and sweet.</p>
              <ol className="list-decimal list-inside mt-3 text-slate-800 text-base space-y-1">
                <li>Who did Ava bake with?</li>
                <li>What did they read together?</li>
                <li>What four things did they need?</li>
                <li>How did the cookies turn out?</li>
              </ol>
              {showAnswersForDoc('reading-g2-cookie-recipe', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ol className="list-decimal list-inside space-y-0.5">
                    <li>Her grandma</li>
                    <li>The recipe</li>
                    <li>Flour, sugar, eggs, and butter</li>
                    <li>Golden and sweet</li>
                  </ol>
                </div>
              ))}
            </div>
          </section>
        )}
        {activeDocs.includes('reading-g2-tree-house') && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">Passage — The Tree House (Grade 2)</h2>
            <div className="bg-white border border-slate-300 rounded p-4">
              <p className="text-slate-800 text-base">Jake's dad helped him build a tree house in the backyard. They used wood planks and strong nails. Jake climbed up the ladder first. He looked out the window and saw the whole yard. "This is my secret hideout!" he said.</p>
              <ol className="list-decimal list-inside mt-3 text-slate-800 text-base space-y-1">
                <li>Who helped Jake build the tree house?</li>
                <li>What did they use to build it?</li>
                <li>What did Jake see from the window?</li>
                <li>What did Jake call the tree house?</li>
              </ol>
              {showAnswersForDoc('reading-g2-tree-house', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ol className="list-decimal list-inside space-y-0.5">
                    <li>His dad</li>
                    <li>Wood planks and strong nails</li>
                    <li>The whole yard</li>
                    <li>His secret hideout</li>
                  </ol>
                </div>
              ))}
            </div>
          </section>
        )}
        {activeDocs.includes('reading-g3-school-play') && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">Passage — The School Play (Grade 3)</h2>
            <div className="bg-white border border-slate-300 rounded p-4">
              <p className="text-slate-800 text-base">Our class practiced a play about explorers for three weeks. On the big day, the gym was full of parents. I forgot one line, but I kept going. After the show, my teacher said, "You handled that mistake like a pro." I learned that making mistakes is okay if you keep trying.</p>
              <ol className="list-decimal list-inside mt-3 text-slate-800 text-base space-y-1">
                <li>What was the play about?</li>
                <li>How long did they practice?</li>
                <li>What happened during the performance?</li>
                <li>What lesson did the narrator learn?</li>
              </ol>
              {showAnswersForDoc('reading-g3-school-play', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ol className="list-decimal list-inside space-y-0.5">
                    <li>Explorers</li>
                    <li>Three weeks</li>
                    <li>The narrator forgot one line but kept going</li>
                    <li>Making mistakes is okay if you keep trying</li>
                  </ol>
                </div>
              ))}
            </div>
          </section>
        )}
        {activeDocs.includes('reading-g3-art-project') && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">Passage — The Art Project (Grade 3)</h2>
            <div className="bg-white border border-slate-300 rounded p-4">
              <p className="text-slate-800 text-base">Ms. Chen asked us to create art using only recycled materials. I collected bottle caps, old magazines, and cardboard. At first, I wasn't sure what to make. Then I saw the bottle caps and thought of a mosaic. I glued them into a flower shape. Ms. Chen said my project showed creativity and care for the environment.</p>
              <ol className="list-decimal list-inside mt-3 text-slate-800 text-base space-y-1">
                <li>What materials did the narrator use?</li>
                <li>What did the narrator create?</li>
                <li>What did Ms. Chen say about the project?</li>
                <li>What two things did the project show?</li>
              </ol>
              {showAnswersForDoc('reading-g3-art-project', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ol className="list-decimal list-inside space-y-0.5">
                    <li>Bottle caps, old magazines, and cardboard</li>
                    <li>A flower-shaped mosaic</li>
                    <li>It showed creativity and care for the environment</li>
                    <li>Creativity and care for the environment</li>
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
          const is25 = packAge === '25'; // 2nd-5th Grade
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
          } else if (is25 || is35) {
            // 2nd-5th Grade or 3-5: use intermediate difficulty
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

          const items: ReactNode[] = [];
          
          // Add page-specific worksheet content based on 'from' parameter
          function pushPageSpecificWorksheet() {
            if (!fromParam || !treatAsMath) return; // Only for math packs with from parameter
            
            const pageRng = makeRng(`${seedStr}|page-specific`);
            function pageNextInt(min: number, max: number) { return Math.floor(pageRng() * (max - min + 1)) + min; }
            
            // Times Table page - include times-table worksheets
            if (fromParam === 'times-table') {
              const timesTableTypes = [
                'times-table-horizontal-1-5',
                'times-table-horizontal-6-12',
                'times-table-horizontal-1-12',
                'times-table-vertical-1-5',
                'times-table-vertical-6-12',
                'times-table-missing-1-5',
                'times-table-missing-6-12',
                'times-table-timed-1-5',
                'times-table-timed-6-12',
                'times-table-confidence-1-5',
                'times-table-confidence-6-12',
                'times-table-fluency-1-12',
                'times-table-mixed-review'
              ];
              const selectedType = timesTableTypes[Math.floor(pageRng() * timesTableTypes.length)];
              
              // Generate worksheet content based on type
              if (selectedType.startsWith('times-table-horizontal')) {
                const range = selectedType.includes('1-5') ? [1, 5] : selectedType.includes('6-12') ? [6, 12] : [1, 12];
                const count = selectedType.includes('1-12') ? 12 : 10;
                const facts: Array<[number, number]> = Array.from({length: count}).map(() => {
                  const a = pageNextInt(range[0], range[1]);
                  const b = pageNextInt(range[0], range[1]);
                  return [a, b];
                });
                items.push(
                  <div key="page-specific-tt" className="border border-slate-200 rounded-lg p-4 sm:col-span-2">
                    <div className="font-semibold text-xl mb-2">Times Table Practice — Horizontal Format</div>
                    <div className="grid grid-cols-3 gap-2 text-base">
                      {facts.map(([a, b], i) => (
                        <div key={i} className="border border-slate-300 rounded p-2 text-center">
                          <div className="font-mono">{a} × {b} = <span className="inline-block w-12 h-5 border-b-2 border-slate-600 mx-1" /></div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              } else if (selectedType.startsWith('times-table-vertical')) {
                const range = selectedType.includes('1-5') ? [1, 5] : selectedType.includes('6-12') ? [6, 12] : [1, 12];
                const count = 8;
                const facts: Array<[number, number]> = Array.from({length: count}).map(() => {
                  const a = pageNextInt(range[0], range[1]);
                  const b = pageNextInt(range[0], range[1]);
                  return [a, b];
                });
                items.push(
                  <div key="page-specific-tt" className="border border-slate-200 rounded-lg p-4 sm:col-span-2">
                    <div className="font-semibold text-xl mb-2">Times Table Practice — Vertical Format</div>
                    <div className="grid grid-cols-2 gap-3">
                      {facts.map(([a, b], i) => (
                        <div key={i} className="border border-slate-300 rounded p-2">
                          <div className="font-mono text-lg text-right">
                            <div>{a}</div>
                            <div>× {b}</div>
                            <div className="border-t-2 border-slate-600 mt-1 pt-1 h-8 flex items-center justify-end">
                              <span className="inline-block w-16 h-6 border-b-2 border-slate-600" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              } else if (selectedType.startsWith('times-table-missing')) {
                const range = selectedType.includes('1-5') ? [1, 5] : [6, 12];
                const count = 8;
                const problems = Array.from({length: count}).map(() => {
                  const type = pageNextInt(1, 3);
                  const a = pageNextInt(range[0], range[1]);
                  const b = pageNextInt(range[0], range[1]);
                  const answer = a * b;
                  if (type === 1) return { a, b, showAnswer: false };
                  if (type === 2) return { a, answer, showB: false };
                  return { b, answer, showA: false };
                });
                items.push(
                  <div key="page-specific-tt" className="border border-slate-200 rounded-lg p-4 sm:col-span-2">
                    <div className="font-semibold text-xl mb-2">Times Table Practice — Missing Numbers</div>
                    <div className="grid grid-cols-2 gap-2 text-base">
                      {problems.map((p, i) => (
                        <div key={i} className="border border-slate-300 rounded p-2 text-center">
                          <div className="font-mono">
                            {p.a !== undefined ? p.a : <span className="inline-block w-10 h-5 border-b-2 border-slate-600 mx-1" />} × 
                            {p.b !== undefined ? p.b : <span className="inline-block w-10 h-5 border-b-2 border-slate-600 mx-1" />} = 
                            {p.answer !== undefined ? p.answer : <span className="inline-block w-10 h-5 border-b-2 border-slate-600 mx-1" />}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              } else if (selectedType.startsWith('times-table-timed')) {
                const range = selectedType.includes('1-5') ? [1, 5] : [6, 12];
                const count = 12;
                const facts: Array<[number, number]> = Array.from({length: count}).map(() => {
                  const a = pageNextInt(range[0], range[1]);
                  const b = pageNextInt(range[0], range[1]);
                  return [a, b];
                });
                items.push(
                  <div key="page-specific-tt" className="border border-slate-200 rounded-lg p-4 sm:col-span-2">
                    <div className="font-semibold text-xl mb-2">Times Table Practice — Speed Test</div>
                    <div className="mb-2 text-sm text-slate-600">⏱️ Complete in 2 minutes!</div>
                    <div className="grid grid-cols-4 gap-1.5 text-sm">
                      {facts.map(([a, b], i) => (
                        <div key={i} className="border border-slate-300 rounded p-1.5 text-center">
                          <div className="font-mono text-xs">{a} × {b} = <span className="inline-block w-8 h-4 border-b border-slate-600 mx-0.5" /></div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              } else {
                // Confidence or fluency - use horizontal format
                const range = selectedType.includes('1-5') ? [1, 5] : selectedType.includes('6-12') ? [6, 12] : [1, 12];
                const count = 10;
                const facts: Array<[number, number]> = Array.from({length: count}).map(() => {
                  const a = pageNextInt(range[0], range[1]);
                  const b = pageNextInt(range[0], range[1]);
                  return [a, b];
                });
                items.push(
                  <div key="page-specific-tt" className="border border-slate-200 rounded-lg p-4 sm:col-span-2">
                    <div className="font-semibold text-xl mb-2">Times Table Practice — Build Confidence</div>
                    <div className="grid grid-cols-2 gap-2 text-base">
                      {facts.map(([a, b], i) => (
                        <div key={i} className="border-2 border-blue-200 rounded-lg p-2 bg-blue-50">
                          <div className="font-mono text-lg text-center text-blue-700">
                            {a} × {b} = <span className="inline-block w-14 h-6 border-b-2 border-blue-600 mx-1" />
                          </div>
                          <div className="text-xs text-slate-600 text-center mt-1">Hint: {a} groups of {b}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }
            }
            // Multiplication page - include multiplication worksheets
            else if (fromParam === 'multiplication') {
              const multTypes = [
                'mult-facts-1-5',
                'mult-facts-6-12',
                'mult-arrays-2-5',
                'mult-word-problems-2-3',
                'mult-fact-families',
                'mult-fact-fluency'
              ];
              const selectedType = multTypes[Math.floor(pageRng() * multTypes.length)];
              
              if (selectedType.startsWith('mult-facts')) {
                const range = selectedType.includes('1-5') ? [1, 5] : [6, 12];
                const count = 12;
                const facts: Array<[number, number]> = Array.from({length: count}).map(() => {
                  const a = pageNextInt(range[0], range[1]);
                  const b = pageNextInt(range[0], range[1]);
                  return [a, b];
                });
                items.push(
                  <div key="page-specific-mult" className="border border-slate-200 rounded-lg p-4 sm:col-span-2">
                    <div className="font-semibold text-xl mb-2">Multiplication Facts Practice</div>
                    <div className="grid grid-cols-3 gap-2 text-base">
                      {facts.map(([a, b], i) => (
                        <div key={i} className="border border-slate-300 rounded p-2 text-center">
                          <div className="font-mono">{a} × {b} = <span className="inline-block w-12 h-5 border-b-2 border-slate-600 mx-1" /></div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              } else if (selectedType.includes('arrays')) {
                const count = 4;
                const arrays: Array<[number, number]> = Array.from({length: count}).map(() => {
                  const rows = pageNextInt(2, 5);
                  const cols = pageNextInt(2, 5);
                  return [rows, cols];
                });
                items.push(
                  <div key="page-specific-mult" className="border border-slate-200 rounded-lg p-4 sm:col-span-2">
                    <div className="font-semibold text-xl mb-2">Multiplication Arrays</div>
                    <div className="grid grid-cols-2 gap-3">
                      {arrays.map(([rows, cols], i) => (
                        <div key={i} className="border border-slate-300 rounded p-3">
                          <div className="text-center mb-2 font-semibold">{rows} × {cols} = <span className="inline-block w-12 h-5 border-b-2 border-slate-600 mx-1" /></div>
                          <div className="grid gap-1" style={{gridTemplateColumns: `repeat(${cols}, 1fr)`, maxWidth: '120px', margin: '0 auto'}}>
                            {Array.from({length: rows * cols}).map((_, idx) => (
                              <div key={idx} className="aspect-square border border-slate-400 rounded bg-slate-100" />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              } else if (selectedType.includes('word-problems')) {
                const problems = [
                  'Emma has 3 bags. Each bag has 4 apples. How many apples in all?',
                  'There are 5 rows of flowers. Each row has 3 flowers. How many flowers total?',
                  'Jake buys 2 packs of stickers. Each pack has 6 stickers. How many stickers does he have?'
                ];
                items.push(
                  <div key="page-specific-mult" className="border border-slate-200 rounded-lg p-4 sm:col-span-2">
                    <div className="font-semibold text-xl mb-2">Multiplication Word Problems</div>
                    <ol className="list-decimal list-inside space-y-2 text-base text-slate-800">
                      {problems.map((p, i) => (
                        <li key={i}>{p} <span className="inline-block w-16 h-5 border-b-2 border-slate-600 ml-2" /></li>
                      ))}
                    </ol>
                  </div>
                );
              } else {
                // Fact families or fluency
                const count = 6;
                const facts: Array<[number, number]> = Array.from({length: count}).map(() => {
                  const a = pageNextInt(2, 6);
                  const b = pageNextInt(2, 6);
                  return [a, b];
                });
                items.push(
                  <div key="page-specific-mult" className="border border-slate-200 rounded-lg p-4 sm:col-span-2">
                    <div className="font-semibold text-xl mb-2">Multiplication Practice</div>
                    <div className="grid grid-cols-3 gap-2 text-base">
                      {facts.map(([a, b], i) => (
                        <div key={i} className="border border-slate-300 rounded p-2 text-center">
                          <div className="font-mono">{a} × {b} = <span className="inline-block w-12 h-5 border-b-2 border-slate-600 mx-1" /></div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }
            }
            // Grade-specific pages - include grade-appropriate worksheets
            else if (fromParam === '1st-grade' || fromParam === '2nd-grade' || fromParam === '3rd-grade' || 
                     fromParam === '4th-grade' || fromParam === '5th-grade' || fromParam === 'kindergarten') {
              const grade = fromParam.replace('-grade', '');
              const count = 8;
              const facts: Array<[number, number]> = Array.from({length: count}).map(() => {
                let range: [number, number];
                if (grade === 'kindergarten' || grade === '1st') range = [1, 5];
                else if (grade === '2nd') range = [1, 10];
                else if (grade === '3rd') range = [1, 12];
                else range = [1, 12];
                const a = pageNextInt(range[0], range[1]);
                const b = pageNextInt(range[0], range[1]);
                return [a, b];
              });
              items.push(
                <div key="page-specific-grade" className="border border-slate-200 rounded-lg p-4 sm:col-span-2">
                  <div className="font-semibold text-xl mb-2">{grade === 'kindergarten' ? 'Kindergarten' : grade.charAt(0).toUpperCase() + grade.slice(1)} Grade Math Practice</div>
                  <div className="grid grid-cols-4 gap-2 text-sm">
                    {facts.map(([a, b], i) => (
                      <div key={i} className="border border-slate-300 rounded p-1.5 text-center">
                        <div className="font-mono text-xs">{a} × {b} = <span className="inline-block w-8 h-4 border-b border-slate-600 mx-0.5" /></div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }
          }
          
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
              const isSimple = isK2; // K-2 only
              const a = Math.floor(rng() * (isSimple ? 9 : 12)) + 1;
              const b = Math.floor(rng() * (isSimple ? 9 : 12)) + 1;
              const useAdd = isSimple ? true : rng() < 0.6;
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
            // For '25' (2nd-5th grade), use a mix of g2 and g3 passages
            let pool;
            if (age === 'g1') {
              pool = poolG1;
            } else if (age === 'g2') {
              pool = poolG2;
            } else if (age === '25') {
              // Mix of 2nd and 3rd grade passages for 2nd-5th grade range
              pool = [...poolG2, ...poolG3];
            } else {
              pool = poolG3;
            }
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
            const pool = seqPools[packAge as 'g1'|'g2'|'25'|'35'] || (is25 ? seqPools.g2 : seqPools.g1);
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
          // 0) Add page-specific worksheet if from parameter is set
          pushPageSpecificWorksheet();
          
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
            const mazeCols = isK2 ? 8 : ((is25 || is35) ? 10 : 12);
            const mazeRows = isK2 ? 8 : ((is25 || is35) ? 10 : 12);
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
          const extras: ReactNode[] = [];
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
                  // Grade-appropriate targets: up to 10 for K–2 pack, to 20 for Grade 2, higher for 2-5
                  const raw = packAge === 'k2' ? (4 + Math.floor(rng()*7)) : (packAge === 'g2' ? (11 + Math.floor(rng()*10)) : (packAge === '25' ? (11 + Math.floor(rng()*10)) : (6 + Math.floor(rng()*14))));
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
            // Preserve the 'from' parameter to maintain page-specific content
            if (fromParam) {
              sp.set('from', fromParam)
            }
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
                <div className="h-10 border-b-3 border-slate-600" />
                <div className="mt-3 font-semibold text-slate-800 mb-1">Reward</div>
                <div className="h-10 border-b-3 border-slate-600" />
              </div>
              <div className="border border-slate-200 rounded-lg p-3 bg-white print:bg-transparent print:border-0">
                <div className="font-semibold text-slate-800 mb-2">Notes</div>
                <div className="h-10 border-b-3 border-slate-600 mb-2" />
                <div className="h-10 border-b-3 border-slate-600 mb-2" />
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
                <div className="h-10 border-b-3 border-slate-600" />
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
                  <div className="h-10 border-b-3 border-slate-600" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-800 mb-1">What I nailed</div>
                  <div className="h-6 border-b border-slate-400 mb-1" />
                  <div className="h-10 border-b-3 border-slate-600" />
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
            {showAnswersForDoc('number-bonds-10', () => (
              <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                <div className="font-semibold mb-1">Answer key</div>
                <ul className="list-disc list-inside space-y-0.5">
                  {[7, 3, 5, 8, 4, 6, 2, 9].map((n, i) => (
                    <li key={i}>10 = {n} + {10 - n}</li>
                  ))}
                </ul>
              </div>
            ))}
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
            {showAnswersForDoc('count-write-30', () => (
              <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                <div className="font-semibold mb-1">Answer key</div>
                <ul className="list-disc list-inside space-y-0.5">
                  {[5, 8, 12, 15, 18, 20, 23, 25].map((count, i) => (
                    <li key={i}>Box {i + 1}: {count} objects</li>
                  ))}
                </ul>
              </div>
            ))}
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
            {showAnswersForDoc('missing-numbers-50', () => (
              <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                <div className="font-semibold mb-1">Answer key</div>
                <ul className="list-disc list-inside space-y-0.5">
                  {[[1, 5], [10, 15], [20, 25], [30, 35], [40, 45]].map(([start, end], idx) => {
                    const missing = Array.from({ length: end - start + 1 }, (_, i) => start + i).filter(n => n % 5 !== 0 && n !== start && n !== end)
                    return <li key={idx}>Line {idx + 1}: Missing numbers are {missing.join(', ')}</li>
                  })}
                </ul>
              </div>
            ))}
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
            {showAnswersForDoc('picture-addition-10', () => (
              <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                <div className="font-semibold mb-1">Answer key</div>
                <ul className="list-disc list-inside space-y-0.5">
                  {[[3, 4], [2, 5], [4, 3], [1, 6], [5, 2], [3, 5]].map(([a, b], idx) => (
                    <li key={idx}>{a} + {b} = {a + b}</li>
                  ))}
                </ul>
              </div>
            ))}
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
            {showAnswersForDoc('subtraction-stories', () => (
              <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                <div className="font-semibold mb-1">Answer key</div>
                <ul className="list-disc list-inside space-y-0.5">
                  {[
                    { total: 8, take: 3 },
                    { total: 7, take: 2 },
                    { total: 9, take: 4 },
                    { total: 10, take: 5 }
                  ].map(({ total, take }, idx) => (
                    <li key={idx}>{total} - {take} = {total - take}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        )}

        {activeDocs.includes('balance-equations-10') && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">⚖️ Balance Equations (to 10)</h2>
            <p className="text-slate-600 text-sm mb-3">Find the missing number to make both sides equal.</p>
            <div className="space-y-4">
              {[
                { left: '3 + 2', right: '__ + 1', answer: 4 },
                { left: '5 + __', right: '4 + 3', answer: 2 },
                { left: '6 - 2', right: '__ - 1', answer: 5 },
                { left: '8 - __', right: '10 - 3', answer: 5 }
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
            {showAnswersForDoc('balance-equations-10', () => (
              <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                <div className="font-semibold mb-1">Answer key</div>
                <ul className="list-disc list-inside space-y-0.5">
                  {[
                    { left: '3 + 2', right: '__ + 1', answer: 4 },
                    { left: '5 + __', right: '4 + 3', answer: 2 },
                    { left: '6 - 2', right: '__ - 1', answer: 5 },
                    { left: '8 - __', right: '10 - 3', answer: 5 }
                  ].map((eq, idx) => (
                    <li key={idx}>{eq.left.replace('__', eq.answer.toString())} = {eq.right.replace('__', eq.answer.toString())}</li>
                  ))}
                </ul>
              </div>
            ))}
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
            {showAnswersForDoc('skip-count-2s', () => (
              <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                <div className="font-semibold mb-1">Answer key</div>
                <p className="text-sm">Complete sequence: 2, 4, 6, 8, 10, 12, 14, 16, 18, 20</p>
              </div>
            ))}
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
            {showAnswersForDoc('number-line-add', () => (
              <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                <div className="font-semibold mb-1">Answer key</div>
                <ul className="list-disc list-inside space-y-0.5">
                  {[[3, 4], [5, 3], [2, 6], [4, 5]].map(([a, b], idx) => (
                    <li key={idx}>{a} + {b} = {a + b}</li>
                  ))}
                </ul>
              </div>
            ))}
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
            {showAnswersForDoc('doubles-facts', () => (
              <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                <div className="font-semibold mb-1">Answer key</div>
                <ul className="list-disc list-inside space-y-0.5">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                    <li key={n}>{n} + {n} = {n * 2}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        )}

        {activeDocs.includes('pattern-complete') && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">🧩 Pattern Completion</h2>
            <p className="text-slate-600 text-sm mb-3">Complete each pattern. Draw or color the missing shapes.</p>
            <div className="space-y-4">
              {[
                { pattern: ['circle', 'square', 'circle', 'square'], type: 'AB', next: 'circle' },
                { pattern: ['red', 'blue', 'green', 'red', 'blue'], type: 'ABC', next: 'green' },
                { pattern: ['triangle', 'triangle', 'circle', 'triangle'], type: 'AAB', next: 'triangle' }
              ].map(({ pattern, type }, idx) => (
                <div key={idx} className="border border-slate-300 rounded p-4 bg-white">
                  <p className="text-slate-700 text-sm mb-2 font-semibold">{type} Pattern</p>
                  <div className="flex items-center gap-3">
                    {pattern.map((shape, i) => (
                      <div key={i} className="w-16 h-16 border-2 border-slate-400 rounded flex items-center justify-center">
                        {shape === 'circle' && <div className="w-12 h-12 rounded-full border-2 border-slate-600" />}
                        {shape === 'square' && <div className="w-12 h-12 border-2 border-slate-600" />}
                        {shape === 'triangle' && <div className="w-0 h-0 border-l-6 border-r-6 border-b-12 border-transparent border-b-slate-600" />}
                        {shape === 'red' && <div className="w-12 h-12 border-4 border-red-500 rounded bg-white" />}
                        {shape === 'blue' && <div className="w-12 h-12 border-4 border-blue-500 rounded bg-white" />}
                        {shape === 'green' && <div className="w-12 h-12 border-4 border-green-500 rounded bg-white" />}
                      </div>
                    ))}
                    <div className="w-16 h-16 border-2 border-dashed border-slate-400 rounded flex items-center justify-center">
                      <span className="text-slate-400">__</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {showAnswersForDoc('pattern-complete', () => (
              <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                <div className="font-semibold mb-1">Answer key</div>
                <ul className="list-disc list-inside space-y-0.5">
                  <li>AB Pattern: Next shape is circle</li>
                  <li>ABC Pattern: Next color is green</li>
                  <li>AAB Pattern: Next shape is triangle</li>
                </ul>
              </div>
            ))}
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
                        <div key={i} className="w-16 h-16 print:w-20 print:h-20 border-4 border-slate-600 rounded flex items-center justify-center">
                          {shape === 'circle' && <div className="w-12 h-12 print:w-16 print:h-16 rounded-full border-4 border-slate-600" />}
                          {shape === 'square' && <div className="w-12 h-12 print:w-16 print:h-16 border-4 border-slate-600" />}
                          {shape === 'triangle' && <div className="w-0 h-0 border-l-6 border-r-6 border-b-12 print:border-l-8 print:border-r-8 print:border-b-16 border-transparent border-b-slate-600" />}
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
            {showAnswersForDoc('missing-shape', () => (
              <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                <div className="font-semibold mb-1">Answer key</div>
                <p className="text-sm">Pattern: circle, square, triangle, circle, square. Missing shape: triangle</p>
              </div>
            ))}
          </section>
        )}

        {activeDocs.includes('size-comparison') && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">📏 Size Comparison</h2>
            <p className="text-slate-600 text-sm mb-3">Compare the objects. Circle the bigger one or the smaller one.</p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Circle the bigger', items: [30, 50], answer: 'B' },
                { label: 'Circle the smaller', items: [40, 25], answer: 'B' },
                { label: 'Circle the longer', items: [60, 35], answer: 'A' },
                { label: 'Circle the shorter', items: [45, 70], answer: 'A' }
              ].map(({ label, items }, idx) => (
                <div key={idx} className="border border-slate-300 rounded p-4 bg-white">
                  <p className="text-slate-700 text-sm mb-2 font-semibold">{label}</p>
                  <div className="flex items-end gap-4 justify-center">
                    <div className="text-center">
                      <div className="border-4 border-blue-500 rounded mb-2 bg-white" style={{ width: `${items[0]}px`, height: `${items[0]}px` }} />
                      <span className="text-xs">A</span>
                    </div>
                    <div className="text-center">
                      <div className="border-4 border-green-500 rounded mb-2 bg-white" style={{ width: `${items[1]}px`, height: `${items[1]}px` }} />
                      <span className="text-xs">B</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {showAnswersForDoc('size-comparison', () => (
              <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                <div className="font-semibold mb-1">Answer key</div>
                <ul className="list-disc list-inside space-y-0.5">
                  <li>Circle the bigger: B (50px &gt; 30px)</li>
                  <li>Circle the smaller: B (25px &lt; 40px)</li>
                  <li>Circle the longer: A (60px &gt; 35px)</li>
                  <li>Circle the shorter: A (45px &lt; 70px)</li>
                </ul>
              </div>
            ))}
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
            {showAnswersForDoc('expanded-form-200', () => (
              <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                <div className="font-semibold mb-1">Answer key</div>
                <ul className="list-disc list-inside space-y-0.5">
                  {[125, 143, 167, 189, 152, 176].map((num) => {
                    const hundreds = Math.floor(num / 100)
                    const tens = Math.floor((num % 100) / 10)
                    const ones = num % 10
                    return <li key={num}>{num} = {hundreds * 100} + {tens * 10} + {ones}</li>
                  })}
                </ul>
              </div>
            ))}
          </section>
        )}

        {activeDocs.includes('number-patterns-200') && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">📊 Number Patterns to 200</h2>
            <p className="text-slate-600 text-sm mb-3">Find the pattern and fill in the missing numbers.</p>
            <div className="space-y-4">
              {[
                { pattern: [10, 20, 30, '__', 50, '__', 70], rule: '+10', answers: [40, 60] },
                { pattern: [5, 10, 15, '__', 25, '__', 35], rule: '+5', answers: [20, 30] },
                { pattern: [100, 110, 120, '__', 140, '__', 160], rule: '+10', answers: [130, 150] }
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
            {showAnswersForDoc('number-patterns-200', () => (
              <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                <div className="font-semibold mb-1">Answer key</div>
                <ul className="list-disc list-inside space-y-0.5">
                  <li>Pattern +10: Missing numbers are 40, 60</li>
                  <li>Pattern +5: Missing numbers are 20, 30</li>
                  <li>Pattern +10: Missing numbers are 130, 150</li>
                </ul>
              </div>
            ))}
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
            {showAnswersForDoc('rounding-nearest-10', () => (
              <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                <div className="font-semibold mb-1">Answer key</div>
                <ul className="list-disc list-inside space-y-0.5">
                  {[23, 37, 45, 58, 64, 76, 82, 91].map((num) => {
                    const rounded = Math.round(num / 10) * 10
                    return <li key={num}>{num} rounds to {rounded}</li>
                  })}
                </ul>
              </div>
            ))}
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
            {showAnswersForDoc('add-three-numbers', () => (
              <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                <div className="font-semibold mb-1">Answer key</div>
                <ul className="list-disc list-inside space-y-0.5">
                  {[[3, 4, 2], [5, 2, 3], [4, 3, 3], [6, 2, 1], [2, 5, 3], [4, 4, 2]].map((nums, idx) => (
                    <li key={idx}>{nums[0]} + {nums[1]} + {nums[2]} = {nums[0] + nums[1] + nums[2]}</li>
                  ))}
                </ul>
              </div>
            ))}
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
            {showAnswersForDoc('missing-addends', () => (
              <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                <div className="font-semibold mb-1">Answer key</div>
                <ul className="list-disc list-inside space-y-0.5">
                  {[
                    { a: 3, sum: 8 },
                    { a: 5, sum: 12 },
                    { a: 4, sum: 10 },
                    { a: 6, sum: 15 },
                    { a: 7, sum: 14 },
                    { a: 2, sum: 9 }
                  ].map(({ a, sum }, idx) => (
                    <li key={idx}>{a} + {sum - a} = {sum}</li>
                  ))}
                </ul>
              </div>
            ))}
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
            {showAnswersForDoc('fact-families-20', () => (
              <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                <div className="font-semibold mb-1">Answer key</div>
                <ul className="list-disc list-inside space-y-0.5">
                  {[[5, 8, 13], [6, 7, 13], [4, 9, 13]].map(([a, b, sum], idx) => (
                    <li key={idx}>Family {idx + 1}: {a}+{b}={sum}, {b}+{a}={sum}, {sum}-{a}={b}, {sum}-{b}={a}</li>
                  ))}
                </ul>
              </div>
            ))}
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
            {showAnswersForDoc('mental-math-20', () => (
              <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                <div className="font-semibold mb-1">Answer key</div>
                <ul className="list-disc list-inside space-y-0.5 columns-2">
                  {[
                    { prob: '7+5', ans: 12 },
                    { prob: '9+4', ans: 13 },
                    { prob: '8+6', ans: 14 },
                    { prob: '12-5', ans: 7 },
                    { prob: '15-7', ans: 8 },
                    { prob: '18-9', ans: 9 },
                    { prob: '6+7', ans: 13 },
                    { prob: '5+8', ans: 13 },
                    { prob: '11-4', ans: 7 },
                    { prob: '14-6', ans: 8 },
                    { prob: '16-8', ans: 8 },
                    { prob: '20-9', ans: 11 }
                  ].map(({ prob, ans }, idx) => (
                    <li key={idx}>{prob} = {ans}</li>
                  ))}
                </ul>
              </div>
            ))}
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
            {showAnswersForDoc('number-line-200', () => (
              <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                <div className="font-semibold mb-1">Answer key</div>
                <p className="text-sm">Number lines show intervals of 10. Students can locate any number within each range.</p>
              </div>
            ))}
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
            {showAnswersForDoc('doubles-near-doubles', () => (
              <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                <div className="font-semibold mb-1">Answer key</div>
                <ul className="list-disc list-inside space-y-0.5">
                  <li>6 + 6 = 12 (Double)</li>
                  <li>7 + 7 = 14 (Double)</li>
                  <li>6 + 7 = 13 (Near Double: 6+6+1)</li>
                  <li>8 + 9 = 17 (Near Double: 8+8+1)</li>
                </ul>
              </div>
            ))}
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
            {showAnswersForDoc('money-coins-bills', () => (
              <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                <div className="font-semibold mb-1">Answer key</div>
                <ul className="list-disc list-inside space-y-0.5">
                  {[
                    { coins: [1, 1, 5, 5], label: '2 pennies, 2 nickels' },
                    { coins: [10, 5, 1], label: '1 dime, 1 nickel, 1 penny' },
                    { coins: [25, 10, 5], label: '1 quarter, 1 dime, 1 nickel' },
                    { coins: [10, 10, 5, 1, 1], label: '2 dimes, 1 nickel, 2 pennies' }
                  ].map(({ coins }, idx) => {
                    const total = coins.reduce((a, b) => a + b, 0)
                    return <li key={idx}>Total: {total}¢</li>
                  })}
                </ul>
              </div>
            ))}
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
                      <div className="border-4 border-blue-500 mb-2 bg-white" style={{ width: `${a * 10}px`, height: '20px' }} />
                      <span className="text-xs">A: {a} {unit}</span>
                    </div>
                    <div>
                      <div className="border-4 border-green-500 mb-2 bg-white" style={{ width: `${b * 10}px`, height: '20px' }} />
                      <span className="text-xs">B: {b} {unit}</span>
                    </div>
                  </div>
                  <p className="text-slate-900 mt-2">Answer: __</p>
                </div>
              ))}
            </div>
            {showAnswersForDoc('measurement-length', () => (
              <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                <div className="font-semibold mb-1">Answer key</div>
                <ul className="list-disc list-inside space-y-0.5">
                  <li>5 inches vs 8 inches: B is longer (8 &gt; 5)</li>
                  <li>12 cm vs 7 cm: A is longer (12 &gt; 7)</li>
                  <li>10 inches vs 15 inches: B is longer (15 &gt; 10)</li>
                </ul>
              </div>
            ))}
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
            {showAnswersForDoc('bar-graphs-data', () => (
              <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                <div className="font-semibold mb-1">Answer key</div>
                <ul className="list-disc list-inside space-y-0.5">
                  <li>1. Yellow is most popular (tallest bar)</li>
                  <li>2. Red: approximately 8 votes</li>
                  <li>3. Yellow has approximately 6 more votes than Green</li>
                </ul>
              </div>
            ))}
          </section>
        )}

        {/* NEW CRITICAL WORKSHEETS - Fresh and Unique, No Duplicates */}
        
        {activeDocs.includes('add-2digit-regrouping') && (() => {
          const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`);
          function nextInt(min: number, max: number) {
            return Math.floor(rng() * (max - min + 1)) + min;
          }
          function genPairsWithRegrouping(count: number) {
            const out: Array<[number, number]> = [];
            let guard = 0;
            while (out.length < count && guard < 10000) {
              const a = nextInt(15, 99);
              const b = nextInt(6, 99);
              if (a + b <= 100 && ((a % 10) + (b % 10)) >= 10) {
                out.push([a, b]);
              }
              guard++;
            }
            return out;
          }
          const pairs = genPairsWithRegrouping(10);
          return (
            <WorksheetSectionWrapper
              docId="add-2digit-regrouping"
              title="2‑Digit Addition (WITH Regrouping)"
              emoji="➕"
              description="Add the two numbers. You will need to regroup (carry) when the ones add up to 10 or more."
            >
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-2 gap-3">
                {pairs.map(([a, b], i) => (
                  <div key={i} className="border border-slate-300 rounded p-3 bg-white w-full">
                    <div className="font-mono text-2xl leading-7 text-right">
                      <div>{a}</div>
                      <div>+ {b}</div>
                      <div className="border-t-[3px] border-slate-600 mt-2 pt-2 h-12 flex items-center"><span className="inline-block w-20 h-10 border-b-[3px] border-slate-600" /></div>
                    </div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('add-2digit-regrouping', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {pairs.map(([a, b], i) => (<li key={i}>{a} + {b} = {a + b}</li>))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('sub-2digit-regrouping') && (() => {
          const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`);
          function nextInt(min: number, max: number) {
            return Math.floor(rng() * (max - min + 1)) + min;
          }
          function genPairsWithRegrouping(count: number) {
            const out: Array<[number, number]> = [];
            let guard = 0;
            while (out.length < count && guard < 10000) {
              const a = nextInt(20, 99);
              const b = nextInt(1, a - 1);
              if ((a % 10) < (b % 10)) {
                out.push([a, b]);
              }
              guard++;
            }
            return out;
          }
          const pairs = genPairsWithRegrouping(10);
          return (
            <WorksheetSectionWrapper
              docId="sub-2digit-regrouping"
              title="2‑Digit Subtraction (WITH Regrouping)"
              emoji="➖"
              description="Subtract the two numbers. You will need to regroup (borrow) when the ones digit is smaller."
            >
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-orange-400 to-red-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-2 gap-3">
                {pairs.map(([a, b], i) => (
                  <div key={i} className="border border-slate-300 rounded p-3 bg-white w-full">
                    <div className="font-mono text-2xl leading-7 text-right">
                      <div>{a}</div>
                      <div>− {b}</div>
                      <div className="border-t-[3px] border-slate-600 mt-2 pt-2 h-12 flex items-center"><span className="inline-block w-20 h-10 border-b-[3px] border-slate-600" /></div>
                    </div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('sub-2digit-regrouping', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {pairs.map(([a, b], i) => (<li key={i}>{a} − {b} = {a - b}</li>))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('fractions-halves-thirds-fourths') && (
          <WorksheetSectionWrapper
            docId="fractions-halves-thirds-fourths"
            title="Fractions: Halves, Thirds, Fourths"
            emoji="🍕"
            description="Color the fraction shown in each shape. Then write the fraction name in the blank space provided."
          >
            <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 animate-gradient-x mb-2" />
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: '1/2', parts: 2, filled: 1 },
                { label: '1/3', parts: 3, filled: 1 },
                { label: '2/3', parts: 3, filled: 2 },
                { label: '1/4', parts: 4, filled: 1 },
                { label: '2/4', parts: 4, filled: 2 },
                { label: '3/4', parts: 4, filled: 3 },
              ].map((frac, idx) => (
                <div key={idx} className="border border-slate-300 rounded p-4 bg-white">
                  <svg viewBox="0 0 200 200" className="w-full h-auto mb-2">
                    <rect x="20" y="20" width="160" height="160" fill="none" stroke="#111827" strokeWidth="3" />
                    {Array.from({ length: frac.parts }).map((_, i) => {
                      const isFilled = i < frac.filled;
                      const width = 160 / frac.parts;
                      const x = 20 + i * width;
                      return (
                        <rect
                          key={i}
                          x={x}
                          y={20}
                          width={width}
                          height={160}
                          fill={isFilled ? '#3b82f6' : '#e5e7eb'}
                          stroke="#111827"
                          strokeWidth={i === 0 || i === frac.parts ? 0 : 2}
                        />
                      );
                    })}
                  </svg>
                  <p className="text-center text-slate-700 font-semibold">{frac.label}</p>
                  <p className="text-center text-slate-600 text-sm mt-1">Write: "____"</p>
                </div>
              ))}
            </div>
            {showAnswersForDoc('fractions-halves-thirds-fourths', () => (
              <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                <div className="font-semibold mb-1">Answer key</div>
                <ul className="list-disc list-inside space-y-0.5">
                  <li>1/2 = one half</li>
                  <li>1/3 = one third</li>
                  <li>2/3 = two thirds</li>
                  <li>1/4 = one fourth (or one quarter)</li>
                  <li>2/4 = two fourths (or one half)</li>
                  <li>3/4 = three fourths (or three quarters)</li>
                </ul>
              </div>
            ))}
          </WorksheetSectionWrapper>
        )}

        {/* Multiplication Worksheets */}
        {activeDocs.includes('mult-facts-1-5') && (() => {
          const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`);
          function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }
          const facts: Array<[number, number]> = Array.from({length: 12}).map(() => {
            const a = nextInt(1, 5); const b = nextInt(1, 5); return [a, b];
          });
          return (
            <WorksheetSectionWrapper
              docId="mult-facts-1-5"
              title="Basic Multiplication Facts (1-5)"
              emoji="✖️"
              description="Write the correct answer in each blank. These problems help students memorize multiplication facts from 1–5."
            >
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-2 gap-3">
                {facts.map(([a, b], i) => (
                  <div key={i} className="border border-slate-300 rounded p-3 bg-white w-full">
                    <div className="font-mono text-2xl leading-7 text-center">
                      <div>{a} × {b} = <span className="inline-block w-20 h-10 border-b-[3px] border-slate-600 mx-1 align-middle" /></div>
                    </div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('mult-facts-1-5', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {facts.map(([a, b], i) => (<li key={i}>{a} × {b} = {a * b}</li>))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('mult-arrays-2-5') && (() => {
          const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`);
          function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }
          const arrays: Array<[number, number]> = Array.from({length: 6}).map(() => {
            const rows = nextInt(2, 5); const cols = nextInt(2, 5); return [rows, cols];
          });
          return (
            <WorksheetSectionWrapper
              docId="mult-arrays-2-5"
              title="Multiplication Arrays (2-5)"
              emoji="📊"
              description="Draw an array for each multiplication problem. Count the total number of objects and write the answer in the blank."
            >
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-2 gap-4">
                {arrays.map(([rows, cols], i) => (
                  <div key={i} className="border border-slate-300 rounded p-4 bg-white">
                    <div className="text-center mb-2 font-semibold text-slate-800">{rows} × {cols} = <span className="inline-block w-20 h-10 border-b-[3px] border-slate-600 mx-1 align-middle" /></div>
                    <div className="grid gap-1" style={{gridTemplateColumns: `repeat(${cols}, 1fr)`, maxWidth: '200px', margin: '0 auto'}}>
                      {Array.from({length: rows * cols}).map((_, idx) => (
                        <div key={idx} className="aspect-square border border-slate-400 rounded bg-slate-100" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('mult-arrays-2-5', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {arrays.map(([rows, cols], i) => (<li key={i}>{rows} × {cols} = {rows * cols}</li>))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('skip-count-mult') && (
          <WorksheetSectionWrapper
            docId="skip-count-mult"
            title="Skip Counting for Multiplication"
            emoji="➡️"
              description="Skip count to find the missing numbers in each pattern. Then write the complete multiplication fact in the blank."
          >
            <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-green-400 to-teal-400 animate-gradient-x mb-2" />
            <div className="space-y-4">
              {[
                { pattern: [2, 4, '__', 8, '__', 12], mult: '2 × __ = __' },
                { pattern: [3, '__', 9, '__', 15, 18], mult: '3 × __ = __' },
                { pattern: [5, 10, '__', 20, '__', 30], mult: '5 × __ = __' },
                { pattern: [10, '__', 30, 40, '__', 60], mult: '10 × __ = __' },
              ].map((item, idx) => (
                <div key={idx} className="border border-slate-300 rounded p-4 bg-white">
                  <div className="font-mono text-xl mb-2">
                    {item.pattern.map((n, i) => (
                      <span key={i} className="inline-block w-16 h-10 text-center border-b-[3px] border-slate-600 mx-1 align-middle">
                        {typeof n === 'number' ? n : ''}
                      </span>
                    ))}
                  </div>
                  <div className="text-center text-slate-700">{item.mult}</div>
                </div>
              ))}
            </div>
            {showAnswersForDoc('skip-count-mult', () => (
              <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                <div className="font-semibold mb-1">Answer key</div>
                <ul className="list-disc list-inside space-y-0.5">
                  <li>2, 4, 6, 8, 10, 12 (2 × 6 = 12)</li>
                  <li>3, 6, 9, 12, 15, 18 (3 × 6 = 18)</li>
                  <li>5, 10, 15, 20, 25, 30 (5 × 6 = 30)</li>
                  <li>10, 20, 30, 40, 50, 60 (10 × 6 = 60)</li>
                </ul>
              </div>
            ))}
          </WorksheetSectionWrapper>
        )}

        {activeDocs.includes('mult-word-problems-2-3') && (
          <WorksheetSectionWrapper
            docId="mult-word-problems-2-3"
            title="Multiplication Word Problems (2nd-3rd)"
            emoji="🧮"
              description="Read each word problem carefully. Write a multiplication equation and solve. Show your answer in the blank space provided."
          >
            <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 animate-gradient-x mb-2" />
            <ol className="list-decimal list-inside space-y-3 text-sm text-slate-800">
              {[
                'Emma has 3 bags. Each bag has 4 apples. How many apples in all?',
                'There are 5 rows of flowers. Each row has 3 flowers. How many flowers total?',
                'Jake buys 2 packs of stickers. Each pack has 6 stickers. How many stickers does he have?',
                'A classroom has 4 tables. Each table seats 5 students. How many students can sit?',
                'Mom bakes 3 trays of cookies. Each tray has 8 cookies. How many cookies total?',
              ].map((q, i) => (
                <li key={i}>
                  {q}
                  <div className="h-10 border-b-[3px] border-slate-600 mt-2" />
                </li>
              ))}
            </ol>
            {showAnswersForDoc('mult-word-problems-2-3', () => (
              <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                <div className="font-semibold mb-1">Answer key</div>
                <ol className="list-decimal list-inside space-y-0.5">
                  <li>3 × 4 = 12 apples</li>
                  <li>5 × 3 = 15 flowers</li>
                  <li>2 × 6 = 12 stickers</li>
                  <li>4 × 5 = 20 students</li>
                  <li>3 × 8 = 24 cookies</li>
                </ol>
              </div>
            ))}
          </WorksheetSectionWrapper>
        )}

        {activeDocs.includes('mult-facts-6-12') && (() => {
          const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`);
          function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }
          const facts: Array<[number, number]> = Array.from({length: 12}).map(() => {
            const a = nextInt(6, 12); const b = nextInt(6, 12); return [a, b];
          });
          return (
            <WorksheetSectionWrapper
              docId="mult-facts-6-12"
              title="Advanced Multiplication Facts (6-12)"
              emoji="✖️"
              description="Write the correct answer in each blank. These problems help students memorize multiplication facts from 6–12."
            >
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-2 gap-3">
                {facts.map(([a, b], i) => (
                  <div key={i} className="border border-slate-300 rounded p-3 bg-white w-full">
                    <div className="font-mono text-2xl leading-7 text-center">
                      <div>{a} × {b} = <span className="inline-block w-20 h-10 border-b-[3px] border-slate-600 mx-1 align-middle" /></div>
                    </div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('mult-facts-6-12', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {facts.map(([a, b], i) => (<li key={i}>{a} × {b} = {a * b}</li>))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('mult-arrays-models') && (() => {
          const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`);
          function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }
          const arrays: Array<[number, number]> = Array.from({length: 6}).map(() => {
            const rows = nextInt(3, 6); const cols = nextInt(3, 6); return [rows, cols];
          });
          return (
            <WorksheetSectionWrapper
              docId="mult-arrays-models"
              title="Multiplication Arrays & Models"
              emoji="📊"
              description="Draw an array for each problem. Use the array to solve."
            >
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-2 gap-4">
                {arrays.map(([rows, cols], i) => (
                  <div key={i} className="border border-slate-300 rounded p-4 bg-white">
                    <div className="text-center mb-2 font-semibold text-slate-800">{rows} × {cols} = <span className="inline-block w-20 h-10 border-b-[3px] border-slate-600 mx-1 align-middle" /></div>
                    <div className="grid gap-1" style={{gridTemplateColumns: `repeat(${cols}, 1fr)`, maxWidth: '200px', margin: '0 auto'}}>
                      {Array.from({length: rows * cols}).map((_, idx) => (
                        <div key={idx} className="aspect-square border border-slate-400 rounded bg-slate-100" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('mult-arrays-models', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {arrays.map(([rows, cols], i) => (<li key={i}>{rows} × {cols} = {rows * cols}</li>))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('mult-multi-step-word') && (
          <WorksheetSectionWrapper
            docId="mult-multi-step-word"
            title="Multi-Step Word Problems"
            emoji="🧮"
            description="Read each problem carefully. Show your work and solve."
          >
            <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 animate-gradient-x mb-2" />
            <ol className="list-decimal list-inside space-y-4 text-sm text-slate-800">
              {[
                'A store has 4 shelves. Each shelf holds 6 boxes. Each box has 5 toys. How many toys in all?',
                'There are 3 classrooms. Each classroom has 8 desks. Each desk seats 2 students. How many students can sit?',
                'A garden has 5 rows of plants. Each row has 7 plants. If 3 plants in each row are flowers, how many flowers total?',
                'A bakery makes 6 batches of cookies. Each batch has 12 cookies. They sell 20 cookies. How many cookies are left?',
              ].map((q, i) => (
                <li key={i}>
                  {q}
                  <div className="h-12 border-b border-slate-400 mt-2" />
                </li>
              ))}
            </ol>
            {showAnswersForDoc('mult-multi-step-word', () => (
              <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                <div className="font-semibold mb-1">Answer key</div>
                <ol className="list-decimal list-inside space-y-0.5">
                  <li>4 × 6 × 5 = 120 toys</li>
                  <li>3 × 8 × 2 = 48 students</li>
                  <li>5 × 3 = 15 flowers</li>
                  <li>6 × 12 - 20 = 52 cookies left</li>
                </ol>
              </div>
            ))}
          </WorksheetSectionWrapper>
        )}

        {activeDocs.includes('mult-fact-families') && (() => {
          const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`);
          function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }
          const families: Array<[number, number]> = Array.from({length: 6}).map(() => {
            const a = nextInt(2, 6); const b = nextInt(2, 6); return [a, b];
          });
          return (
            <WorksheetSectionWrapper
              docId="mult-fact-families"
              title="Fact Families (Multiplication & Division)"
              emoji="⚖️"
              description="Complete each fact family. Write all four related facts (two multiplication and two division) in the blanks provided."
            >
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 animate-gradient-x mb-2" />
              <div className="space-y-4">
                {families.map(([a, b], i) => {
                  const product = a * b;
                  return (
                    <div key={i} className="border border-slate-300 rounded p-4 bg-white">
                      <div className="font-semibold mb-2 text-slate-800">Fact Family for {product}:</div>
                      <div className="grid grid-cols-2 gap-2 text-lg font-mono">
                        <div>{a} × {b} = <span className="inline-block w-20 h-10 border-b-[3px] border-slate-600 mx-1 align-middle" /></div>
                        <div>{b} × {a} = <span className="inline-block w-20 h-10 border-b-3 border-slate-600 mx-1 align-middle" /></div>
                        <div>{product} ÷ {a} = <span className="inline-block w-20 h-10 border-b-3 border-slate-600 mx-1 align-middle" /></div>
                        <div>{product} ÷ {b} = <span className="inline-block w-20 h-10 border-b-3 border-slate-600 mx-1 align-middle" /></div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {showAnswersForDoc('mult-fact-families', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {families.map(([a, b], i) => {
                      const product = a * b;
                      return (
                        <li key={i}>{a} × {b} = {product}, {b} × {a} = {product}, {product} ÷ {a} = {b}, {product} ÷ {b} = {a}</li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('mult-2x1') && (() => {
          const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`);
          function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }
          const problems: Array<[number, number]> = Array.from({length: 8}).map(() => {
            const a = nextInt(10, 99); const b = nextInt(2, 9); return [a, b];
          });
          return (
            <WorksheetSectionWrapper
              docId="mult-2x1"
              title="Multi-Digit Multiplication (2×1)"
              emoji="✖️"
              description="Multiply 2-digit numbers by 1-digit numbers. Show regrouping if needed."
            >
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-2 gap-3">
                {problems.map(([a, b], i) => (
                  <div key={i} className="border border-slate-300 rounded p-3 bg-white w-full">
                    <div className="font-mono text-2xl leading-7 text-right">
                      <div>{a}</div>
                      <div>× {b}</div>
                      <div className="border-t-[3px] border-slate-600 mt-2 pt-2 h-12 flex items-center"><span className="inline-block w-20 h-10 border-b-[3px] border-slate-600" /></div>
                    </div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('mult-2x1', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {problems.map(([a, b], i) => (<li key={i}>{a} × {b} = {a * b}</li>))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('mult-2x1-digit') && (() => {
          const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`);
          function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }
          const problems: Array<[number, number]> = Array.from({length: 8}).map(() => {
            const a = nextInt(10, 99); const b = nextInt(2, 9); return [a, b];
          });
          return (
            <WorksheetSectionWrapper
              docId="mult-2x1-digit"
              title="Multi-Digit Multiplication (2×1)"
              emoji="✖️"
              description="Multiply 2-digit numbers by 1-digit numbers. Show regrouping if needed."
            >
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-2 gap-3">
                {problems.map(([a, b], i) => (
                  <div key={i} className="border border-slate-300 rounded p-3 bg-white w-full">
                    <div className="font-mono text-2xl leading-7 text-right">
                      <div>{a}</div>
                      <div>× {b}</div>
                      <div className="border-t-[3px] border-slate-600 mt-2 pt-2 h-12 flex items-center"><span className="inline-block w-20 h-10 border-b-[3px] border-slate-600" /></div>
                    </div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('mult-2x1-digit', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {problems.map(([a, b], i) => (<li key={i}>{a} × {b} = {a * b}</li>))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('mult-2x2') && (() => {
          const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`);
          function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }
          const problems: Array<[number, number]> = Array.from({length: 6}).map(() => {
            const a = nextInt(10, 99); const b = nextInt(10, 99); return [a, b];
          });
          return (
            <WorksheetSectionWrapper
              docId="mult-2x2"
              title="Multi-Digit Multiplication (2×2)"
              emoji="✖️"
              description="Multiply 2-digit numbers by 2-digit numbers using the standard algorithm."
            >
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-2 gap-3">
                {problems.map(([a, b], i) => (
                  <div key={i} className="border border-slate-300 rounded p-3 bg-white w-full">
                    <div className="font-mono text-xl leading-7 text-right">
                      <div>{a}</div>
                      <div>× {b}</div>
                      <div className="border-t-[3px] border-slate-600 mt-2 pt-2 h-12 flex items-center"><span className="inline-block w-20 h-10 border-b-[3px] border-slate-600" /></div>
                    </div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('mult-2x2', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {problems.map(([a, b], i) => (<li key={i}>{a} × {b} = {a * b}</li>))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('mult-2x2-digit') && (() => {
          const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`);
          function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }
          const problems: Array<[number, number]> = Array.from({length: 6}).map(() => {
            const a = nextInt(10, 99); const b = nextInt(10, 99); return [a, b];
          });
          return (
            <WorksheetSectionWrapper
              docId="mult-2x2-digit"
              title="Multi-Digit Multiplication (2×2)"
              emoji="✖️"
              description="Multiply 2-digit numbers by 2-digit numbers using the standard algorithm."
            >
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-2 gap-3">
                {problems.map(([a, b], i) => (
                  <div key={i} className="border border-slate-300 rounded p-3 bg-white w-full">
                    <div className="font-mono text-xl leading-7 text-right">
                      <div>{a}</div>
                      <div>× {b}</div>
                      <div className="border-t-[3px] border-slate-600 mt-2 pt-2 h-12 flex items-center"><span className="inline-block w-20 h-10 border-b-[3px] border-slate-600" /></div>
                    </div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('mult-2x2-digit', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {problems.map(([a, b], i) => (<li key={i}>{a} × {b} = {a * b}</li>))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('mult-3x2-digit') && (() => {
          const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`);
          function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }
          const problems: Array<[number, number]> = Array.from({length: 6}).map(() => {
            const a = nextInt(100, 999); const b = nextInt(10, 99); return [a, b];
          });
          return (
            <WorksheetSectionWrapper
              docId="mult-3x2-digit"
              title="Multi-Digit Multiplication (3×2)"
              emoji="✖️"
              description="Multiply 3-digit numbers by 2-digit numbers using the standard algorithm."
            >
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-2 gap-3">
                {problems.map(([a, b], i) => (
                  <div key={i} className="border border-slate-300 rounded p-3 bg-white w-full">
                    <div className="font-mono text-lg leading-7 text-right">
                      <div>{a}</div>
                      <div>× {b}</div>
                      <div className="border-t-[3px] border-slate-600 mt-2 pt-2 h-12 flex items-center"><span className="inline-block w-20 h-10 border-b-[3px] border-slate-600" /></div>
                    </div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('mult-3x2-digit', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {problems.map(([a, b], i) => (<li key={i}>{a} × {b} = {a * b}</li>))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('mult-area-model') && (() => {
          const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`);
          function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }
          const problems: Array<[number, number]> = Array.from({length: 4}).map(() => {
            const a = nextInt(12, 35); const b = nextInt(12, 35); return [a, b];
          });
          return (
            <WorksheetSectionWrapper
              docId="mult-area-model"
              title="Area Model Multiplication"
              emoji="📊"
              description="Use the area model to solve each multiplication problem. Break numbers into tens and ones, then write the final answer in the blank."
            >
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 animate-gradient-x mb-2" />
              <div className="space-y-4">
                {problems.map(([a, b], i) => {
                  const aTens = Math.floor(a / 10); const aOnes = a % 10;
                  const bTens = Math.floor(b / 10); const bOnes = b % 10;
                  return (
                    <div key={i} className="border border-slate-300 rounded p-4 bg-white">
                      <div className="font-semibold mb-2 text-slate-800 text-center">{a} × {b} = <span className="inline-block w-20 h-10 border-b-[3px] border-slate-600 mx-1 align-middle" /></div>
                      <div className="grid grid-cols-2 gap-2 max-w-md mx-auto">
                        <div className="border-2 border-slate-400 rounded p-2 text-center">
                          <div className="text-xs text-slate-700 font-medium">{aTens}0 × {bTens}0 = <span className="inline-block w-12 h-6 border-b-[2px] border-slate-600 mx-0.5 align-middle" /></div>
                        </div>
                        <div className="border-2 border-slate-400 rounded p-2 text-center">
                          <div className="text-xs text-slate-700 font-medium">{aTens}0 × {bOnes} = <span className="inline-block w-12 h-6 border-b-[2px] border-slate-600 mx-0.5 align-middle" /></div>
                        </div>
                        <div className="border-2 border-slate-400 rounded p-2 text-center">
                          <div className="text-xs text-slate-700 font-medium">{aOnes} × {bTens}0 = <span className="inline-block w-12 h-6 border-b-[2px] border-slate-600 mx-0.5 align-middle" /></div>
                        </div>
                        <div className="border-2 border-slate-400 rounded p-2 text-center">
                          <div className="text-xs text-slate-700 font-medium">{aOnes} × {bOnes} = <span className="inline-block w-12 h-6 border-b-[2px] border-slate-600 mx-0.5 align-middle" /></div>
                        </div>
                      </div>
                      <div className="text-center mt-2 text-slate-800 font-semibold">Total: <span className="inline-block w-20 h-10 border-b-[3px] border-slate-600 mx-1 align-middle" /></div>
                    </div>
                  );
                })}
              </div>
              {showAnswersForDoc('mult-area-model', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {problems.map(([a, b], i) => {
                      const aTens = Math.floor(a / 10); const aOnes = a % 10;
                      const bTens = Math.floor(b / 10); const bOnes = b % 10;
                      return (
                        <li key={i}>{a} × {b} = {a * b} (Area: {aTens * 10}×{bTens * 10} + {aTens * 10}×{bOnes} + {aOnes}×{bTens * 10} + {aOnes}×{bOnes})</li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('mult-complex-word') && (
          <WorksheetSectionWrapper
            docId="mult-complex-word"
            title="Complex Word Problems"
            emoji="🧮"
            description="Solve each multi-step word problem. Show all your work step by step and write your final answer in the blank space."
          >
            <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 animate-gradient-x mb-2" />
            <ol className="list-decimal list-inside space-y-4 text-sm text-slate-800">
              {[
                'A school has 8 classrooms. Each classroom has 25 students. If each student needs 3 pencils, how many pencils are needed in all?',
                'A factory makes 12 boxes per hour. Each box contains 24 items. If they work for 5 hours, how many items are made?',
                'A store sells 15 packs of markers. Each pack has 8 markers. If 20 markers are sold separately, how many markers are left?',
                'A garden has 6 rows of vegetables. Each row has 18 plants. If 3 plants in each row are tomatoes, how many non-tomato plants are there?',
              ].map((q, i) => (
                <li key={i}>
                  {q}
                  <div className="h-12 border-b border-slate-400 mt-2" />
                </li>
              ))}
            </ol>
            {showAnswersForDoc('mult-complex-word', () => (
              <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                <div className="font-semibold mb-1">Answer key</div>
                <ol className="list-decimal list-inside space-y-0.5">
                  <li>8 × 25 × 3 = 600 pencils</li>
                  <li>12 × 24 × 5 = 1,440 items</li>
                  <li>15 × 8 - 20 = 100 markers left</li>
                  <li>6 × (18 - 3) = 90 non-tomato plants</li>
                </ol>
              </div>
            ))}
          </WorksheetSectionWrapper>
        )}

        {activeDocs.includes('mult-fact-fluency') && (() => {
          const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`);
          function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }
          const facts: Array<[number, number]> = Array.from({length: 20}).map(() => {
            const a = nextInt(1, 12); const b = nextInt(1, 12); return [a, b];
          });
          return (
            <WorksheetSectionWrapper
              docId="mult-fact-fluency"
              title="Multiplication Fact Fluency"
              emoji="⏱️"
              description="Solve as many facts as you can quickly. Practice all facts 1-12."
            >
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-4 gap-2">
                {facts.map(([a, b], i) => (
                  <div key={i} className="border border-slate-300 rounded p-2 bg-white text-center">
                    <div className="font-mono text-lg">{a} × {b} = <span className="inline-block w-20 h-10 border-b-[3px] border-slate-600 mx-1 align-middle" /></div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('mult-fact-fluency', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <div className="grid grid-cols-4 gap-2 text-xs">
                    {facts.map(([a, b], i) => (
                      <div key={i}>{a} × {b} = {a * b}</div>
                    ))}
                  </div>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('mult-mixed-review') && (() => {
          const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`);
          function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }
          const facts: Array<[number, number]> = Array.from({length: 16}).map(() => {
            const a = nextInt(1, 12); const b = nextInt(1, 12); return [a, b];
          });
          return (
            <WorksheetSectionWrapper
              docId="mult-mixed-review"
              title="Mixed Multiplication Review"
              emoji="🔢"
              description="Mixed practice with all multiplication facts. Review everything you've learned."
            >
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-4 gap-2">
                {facts.map(([a, b], i) => (
                  <div key={i} className="border border-slate-300 rounded p-2 bg-white text-center">
                    <div className="font-mono text-lg">{a} × {b} = <span className="inline-block w-20 h-10 border-b-[3px] border-slate-600 mx-1 align-middle" /></div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('mult-mixed-review', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <div className="grid grid-cols-4 gap-2 text-xs">
                    {facts.map(([a, b], i) => (
                      <div key={i}>{a} × {b} = {a * b}</div>
                    ))}
                  </div>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('mult-strategies') && (
          <WorksheetSectionWrapper
            docId="mult-strategies"
            title="Multiplication Strategies"
            emoji="🎯"
            description="Use different strategies to solve each problem. Try skip counting, arrays, or repeated addition. Write your answer in the blank space provided."
          >
            <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-green-400 to-teal-400 animate-gradient-x mb-2" />
            <div className="space-y-4">
              {[
                { problem: '4 × 5', strategy: 'Skip count by 5s: ____' },
                { problem: '3 × 6', strategy: 'Draw an array: ____ rows × ____ columns' },
                { problem: '7 × 2', strategy: 'Repeated addition: ____ + ____ = ____' },
                { problem: '5 × 8', strategy: 'Use doubles: 5 × 4 = ____, so 5 × 8 = ____' },
                { problem: '6 × 9', strategy: 'Break apart: 6 × 10 = ____, so 6 × 9 = ____' },
              ].map((item, idx) => (
                <div key={idx} className="border border-slate-300 rounded p-4 bg-white">
                  <div className="font-semibold text-slate-800 mb-2">{item.problem} = <span className="inline-block w-20 h-10 border-b-[3px] border-slate-600 mx-1 align-middle" /></div>
                  <div className="text-slate-700">{item.strategy}</div>
                  <div className="h-6 border-b border-slate-400 mt-2" />
                </div>
              ))}
            </div>
            {showAnswersForDoc('mult-strategies', () => (
              <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                <div className="font-semibold mb-1">Answer key</div>
                <ul className="list-disc list-inside space-y-0.5">
                  <li>4 × 5 = 20 (5, 10, 15, 20)</li>
                  <li>3 × 6 = 18 (3 rows × 6 columns)</li>
                  <li>7 × 2 = 14 (2 + 2 + 2 + 2 + 2 + 2 + 2)</li>
                  <li>5 × 8 = 40 (5 × 4 = 20, so 5 × 8 = 40)</li>
                  <li>6 × 9 = 54 (6 × 10 = 60, so 6 × 9 = 54)</li>
                </ul>
              </div>
            ))}
          </WorksheetSectionWrapper>
        )}

        {activeDocs.includes('mult-patterns') && (
          <WorksheetSectionWrapper
            docId="mult-patterns"
            title="Multiplication Patterns"
            emoji="📈"
            description="Identify and extend the multiplication patterns. What do you notice?"
          >
            <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 animate-gradient-x mb-2" />
            <div className="space-y-4">
              {[
                { pattern: '2 × 1 = 2, 2 × 2 = 4, 2 × 3 = 6, 2 × 4 = ___, 2 × 5 = ___' },
                { pattern: '5 × 2 = 10, 5 × 4 = 20, 5 × 6 = 30, 5 × 8 = ___, 5 × 10 = ___' },
                { pattern: '3 × 3 = 9, 3 × 6 = 18, 3 × 9 = 27, 3 × 12 = ___, 3 × 15 = ___' },
                { pattern: '10 × 1 = 10, 10 × 2 = 20, 10 × 3 = 30, 10 × 4 = ___, 10 × 5 = ___' },
              ].map((item, idx) => (
                <div key={idx} className="border border-slate-300 rounded p-4 bg-white">
                  <div className="text-slate-800 font-mono">{item.pattern}</div>
                </div>
              ))}
            </div>
            {showAnswersForDoc('mult-patterns', () => (
              <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                <div className="font-semibold mb-1">Answer key</div>
                <ul className="list-disc list-inside space-y-0.5">
                  <li>2 × 4 = 8, 2 × 5 = 10 (pattern: add 2 each time)</li>
                  <li>5 × 8 = 40, 5 × 10 = 50 (pattern: even numbers, add 10)</li>
                  <li>3 × 12 = 36, 3 × 15 = 45 (pattern: multiples of 3)</li>
                  <li>10 × 4 = 40, 10 × 5 = 50 (pattern: add 10 each time)</li>
                </ul>
              </div>
            ))}
          </WorksheetSectionWrapper>
        )}

        {/* Times Table Worksheets */}
        {activeDocs.includes('times-table-horizontal-1-5') && (() => {
          const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`);
          function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }
          const facts: Array<[number, number]> = Array.from({length: 15}).map(() => {
            const a = nextInt(1, 5); const b = nextInt(1, 5); return [a, b];
          });
          return (
            <WorksheetSectionWrapper
              docId="times-table-horizontal-1-5"
              title="Horizontal Times Table (1-5)"
              emoji="➡️"
              description="Practice times tables 1-5 in horizontal format. Write the answer in each blank. Build confidence with simple, stress-free multiplication practice."
            >
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-3 gap-3">
                {facts.map(([a, b], i) => (
                  <div key={i} className="border border-slate-300 rounded p-3 bg-white text-center">
                    <div className="font-mono text-xl leading-7">
                      {a} × {b} = <span className="inline-block w-16 h-8 border-b-[3px] border-slate-600 mx-1 align-middle" />
                    </div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('times-table-horizontal-1-5', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {facts.map(([a, b], i) => (<li key={i}>{a} × {b} = {a * b}</li>))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('times-table-horizontal-6-12') && (() => {
          const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`);
          function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }
          const facts: Array<[number, number]> = Array.from({length: 15}).map(() => {
            const a = nextInt(6, 12); const b = nextInt(6, 12); return [a, b];
          });
          return (
            <WorksheetSectionWrapper
              docId="times-table-horizontal-6-12"
              title="Horizontal Times Table (6-12)"
              emoji="➡️"
              description="Master times tables 6-12 in horizontal format. Fun and simple worksheets to make multiplication easier for advancing learners."
            >
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-3 gap-3">
                {facts.map(([a, b], i) => (
                  <div key={i} className="border border-slate-300 rounded p-3 bg-white text-center">
                    <div className="font-mono text-xl leading-7">
                      {a} × {b} = <span className="inline-block w-16 h-8 border-b-[3px] border-slate-600 mx-1 align-middle" />
                    </div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('times-table-horizontal-6-12', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {facts.map(([a, b], i) => (<li key={i}>{a} × {b} = {a * b}</li>))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('times-table-horizontal-1-12') && (() => {
          const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`);
          function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }
          const facts: Array<[number, number]> = Array.from({length: 20}).map(() => {
            const a = nextInt(1, 12); const b = nextInt(1, 12); return [a, b];
          });
          return (
            <WorksheetSectionWrapper
              docId="times-table-horizontal-1-12"
              title="Complete Horizontal Times Table (1-12)"
              emoji="➡️"
              description="Comprehensive horizontal times table practice covering all facts 1-12. Perfect for building multiplication fluency and speed."
            >
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-3 gap-3">
                {facts.map(([a, b], i) => (
                  <div key={i} className="border border-slate-300 rounded p-3 bg-white text-center">
                    <div className="font-mono text-xl leading-7">
                      {a} × {b} = <span className="inline-block w-16 h-8 border-b-[3px] border-slate-600 mx-1 align-middle" />
                    </div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('times-table-horizontal-1-12', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {facts.map(([a, b], i) => (<li key={i}>{a} × {b} = {a * b}</li>))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('times-table-vertical-1-5') && (() => {
          const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`);
          function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }
          const facts: Array<[number, number]> = Array.from({length: 12}).map(() => {
            const a = nextInt(1, 5); const b = nextInt(1, 5); return [a, b];
          });
          return (
            <WorksheetSectionWrapper
              docId="times-table-vertical-1-5"
              title="Vertical Times Table (1-5)"
              emoji="⬇️"
              description="Practice times tables 1-5 in vertical format. Step-by-step multiplication worksheets designed for kids who struggle with multiplication."
            >
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-green-400 to-emerald-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-2 gap-4">
                {facts.map(([a, b], i) => (
                  <div key={i} className="border border-slate-300 rounded p-3 bg-white">
                    <div className="font-mono text-2xl leading-7 text-right">
                      <div>{a}</div>
                      <div>× {b}</div>
                      <div className="border-t-[3px] border-slate-600 mt-2 pt-2 h-10 flex items-center justify-end">
                        <span className="inline-block w-20 h-8 border-b-[3px] border-slate-600" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('times-table-vertical-1-5', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {facts.map(([a, b], i) => (<li key={i}>{a} × {b} = {a * b}</li>))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('times-table-vertical-6-12') && (() => {
          const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`);
          function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }
          const facts: Array<[number, number]> = Array.from({length: 12}).map(() => {
            const a = nextInt(6, 12); const b = nextInt(6, 12); return [a, b];
          });
          return (
            <WorksheetSectionWrapper
              docId="times-table-vertical-6-12"
              title="Vertical Times Table (6-12)"
              emoji="⬇️"
              description="Master times tables 6-12 in vertical format. Engaging multiplication worksheets that make learning fun and build math confidence."
            >
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-2 gap-4">
                {facts.map(([a, b], i) => (
                  <div key={i} className="border border-slate-300 rounded p-3 bg-white">
                    <div className="font-mono text-2xl leading-7 text-right">
                      <div>{a}</div>
                      <div>× {b}</div>
                      <div className="border-t-[3px] border-slate-600 mt-2 pt-2 h-10 flex items-center justify-end">
                        <span className="inline-block w-20 h-8 border-b-[3px] border-slate-600" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('times-table-vertical-6-12', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {facts.map(([a, b], i) => (<li key={i}>{a} × {b} = {a * b}</li>))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('times-table-vertical-1-12') && (() => {
          const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`);
          function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }
          const facts: Array<[number, number]> = Array.from({length: 16}).map(() => {
            const a = nextInt(1, 12); const b = nextInt(1, 12); return [a, b];
          });
          return (
            <WorksheetSectionWrapper
              docId="times-table-vertical-1-12"
              title="Complete Vertical Times Table (1-12)"
              emoji="⬇️"
              description="Comprehensive vertical times table practice covering all facts 1-12. Printable worksheets to help kids overcome math fear."
            >
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-2 gap-4">
                {facts.map(([a, b], i) => (
                  <div key={i} className="border border-slate-300 rounded p-3 bg-white">
                    <div className="font-mono text-2xl leading-7 text-right">
                      <div>{a}</div>
                      <div>× {b}</div>
                      <div className="border-t-[3px] border-slate-600 mt-2 pt-2 h-10 flex items-center justify-end">
                        <span className="inline-block w-20 h-8 border-b-[3px] border-slate-600" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('times-table-vertical-1-12', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {facts.map(([a, b], i) => (<li key={i}>{a} × {b} = {a * b}</li>))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('times-table-missing-1-5') && (() => {
          const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`);
          function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }
          const problems: Array<{a?: number, b?: number, answer?: number, missingType: 'answer' | 'a' | 'b'}> = Array.from({length: 12}).map(() => {
            const type = nextInt(1, 3);
            const a = nextInt(1, 5);
            const b = nextInt(1, 5);
            const answer = a * b;
            if (type === 1) return { a, b, missingType: 'answer' as const }; // missing answer
            if (type === 2) return { a, answer, missingType: 'b' as const }; // missing b
            return { b, answer, missingType: 'a' as const }; // missing a
          });
          return (
            <WorksheetSectionWrapper
              docId="times-table-missing-1-5"
              title="Missing Number Times Table (1-5)"
              emoji="❓"
              description="Fill in the missing numbers in times table problems. No-tears times table practice sheets that build understanding through pattern recognition."
            >
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-2 gap-3">
                {problems.map((p, i) => (
                  <div key={i} className="border border-slate-300 rounded p-3 bg-white text-center">
                    <div className="font-mono text-xl leading-7">
                      {p.a !== undefined ? p.a : <span className="inline-block w-12 h-8 border-b-[3px] border-slate-600 mx-1" />} × {p.b !== undefined ? p.b : <span className="inline-block w-12 h-8 border-b-[3px] border-slate-600 mx-1" />} = {p.answer !== undefined ? p.answer : <span className="inline-block w-12 h-8 border-b-[3px] border-slate-600 mx-1" />}
                    </div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('times-table-missing-1-5', () => {
                const answers = problems.map((p) => {
                  if (p.missingType === 'answer') {
                    return { a: p.a!, b: p.b!, answer: p.a! * p.b! };
                  } else if (p.missingType === 'b' && p.a !== undefined && p.answer !== undefined) {
                    return { a: p.a, b: p.answer / p.a, answer: p.answer };
                  } else if (p.missingType === 'a' && p.b !== undefined && p.answer !== undefined) {
                    return { a: p.answer / p.b, b: p.b, answer: p.answer };
                  }
                  return { a: 1, b: 1, answer: 1 }; // fallback
                });
                return (
                  <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                    <div className="font-semibold mb-1">Answer key</div>
                    <ul className="list-disc list-inside space-y-0.5">
                      {answers.map((ans, i) => (
                        <li key={i}>{ans.a} × {ans.b} = {ans.answer}</li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('times-table-missing-6-12') && (() => {
          const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`);
          function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }
          const problems: Array<{a?: number, b?: number, answer?: number, missingType: 'answer' | 'a' | 'b'}> = Array.from({length: 12}).map(() => {
            const type = nextInt(1, 3);
            const a = nextInt(6, 12);
            const b = nextInt(6, 12);
            const answer = a * b;
            if (type === 1) return { a, b, missingType: 'answer' as const }; // missing answer
            if (type === 2) return { a, answer, missingType: 'b' as const }; // missing b
            return { b, answer, missingType: 'a' as const }; // missing a
          });
          return (
            <WorksheetSectionWrapper
              docId="times-table-missing-6-12"
              title="Missing Number Times Table (6-12)"
              emoji="❓"
              description="Complete missing numbers in advanced times table problems. Gentle step-by-step multiplication worksheets for confident learning."
            >
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-2 gap-3">
                {problems.map((p, i) => (
                  <div key={i} className="border border-slate-300 rounded p-3 bg-white text-center">
                    <div className="font-mono text-xl leading-7">
                      {p.a !== undefined ? p.a : <span className="inline-block w-12 h-8 border-b-[3px] border-slate-600 mx-1" />} × {p.b !== undefined ? p.b : <span className="inline-block w-12 h-8 border-b-[3px] border-slate-600 mx-1" />} = {p.answer !== undefined ? p.answer : <span className="inline-block w-12 h-8 border-b-[3px] border-slate-600 mx-1" />}
                    </div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('times-table-missing-6-12', () => {
                const answers = problems.map((p) => {
                  if (p.missingType === 'answer') {
                    return { a: p.a!, b: p.b!, answer: p.a! * p.b! };
                  } else if (p.missingType === 'b' && p.a !== undefined && p.answer !== undefined) {
                    return { a: p.a, b: p.answer / p.a, answer: p.answer };
                  } else if (p.missingType === 'a' && p.b !== undefined && p.answer !== undefined) {
                    return { a: p.answer / p.b, b: p.b, answer: p.answer };
                  }
                  return { a: 1, b: 1, answer: 1 }; // fallback
                });
                return (
                  <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                    <div className="font-semibold mb-1">Answer key</div>
                    <ul className="list-disc list-inside space-y-0.5">
                      {answers.map((ans, i) => (
                        <li key={i}>{ans.a} × {ans.b} = {ans.answer}</li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('times-table-missing-mixed') && (() => {
          const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`);
          function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }
          const problems: Array<{a?: number, b?: number, answer?: number, missingType: 'answer' | 'a' | 'b'}> = Array.from({length: 16}).map(() => {
            const type = nextInt(1, 3);
            const a = nextInt(1, 12);
            const b = nextInt(1, 12);
            const answer = a * b;
            if (type === 1) return { a, b, missingType: 'answer' as const }; // missing answer
            if (type === 2) return { a, answer, missingType: 'b' as const }; // missing b
            return { b, answer, missingType: 'a' as const }; // missing a
          });
          return (
            <WorksheetSectionWrapper
              docId="times-table-missing-mixed"
              title="Mixed Missing Number Challenge"
              emoji="❓"
              description="Mixed missing number problems across all times tables 1-12. Build multiplication fluency with engaging practice that makes learning fun."
            >
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-2 gap-3">
                {problems.map((p, i) => (
                  <div key={i} className="border border-slate-300 rounded p-3 bg-white text-center">
                    <div className="font-mono text-xl leading-7">
                      {p.a !== undefined ? p.a : <span className="inline-block w-12 h-8 border-b-[3px] border-slate-600 mx-1" />} × {p.b !== undefined ? p.b : <span className="inline-block w-12 h-8 border-b-[3px] border-slate-600 mx-1" />} = {p.answer !== undefined ? p.answer : <span className="inline-block w-12 h-8 border-b-[3px] border-slate-600 mx-1" />}
                    </div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('times-table-missing-mixed', () => {
                const answers = problems.map((p) => {
                  if (p.missingType === 'answer') {
                    return { a: p.a!, b: p.b!, answer: p.a! * p.b! };
                  } else if (p.missingType === 'b' && p.a !== undefined && p.answer !== undefined) {
                    return { a: p.a, b: p.answer / p.a, answer: p.answer };
                  } else if (p.missingType === 'a' && p.b !== undefined && p.answer !== undefined) {
                    return { a: p.answer / p.b, b: p.b, answer: p.answer };
                  }
                  return { a: 1, b: 1, answer: 1 }; // fallback
                });
                return (
                  <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                    <div className="font-semibold mb-1">Answer key</div>
                    <ul className="list-disc list-inside space-y-0.5">
                      {answers.map((ans, i) => (
                        <li key={i}>{ans.a} × {ans.b} = {ans.answer}</li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('times-table-timed-1-5') && (() => {
          const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`);
          function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }
          const facts: Array<[number, number]> = Array.from({length: 20}).map(() => {
            const a = nextInt(1, 5); const b = nextInt(1, 5); return [a, b];
          });
          return (
            <WorksheetSectionWrapper
              docId="times-table-timed-1-5"
              title="Timed Times Table Test (1-5)"
              emoji="⏱️"
              description="Build speed and accuracy with timed multiplication tests for facts 1-5. Printable timed multiplication test sheets for confident practice."
            >
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-red-400 to-orange-400 animate-gradient-x mb-2" />
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-900">
                <strong>⏱️ Time yourself!</strong> Try to complete all problems in 2 minutes. Write your start time: ______
              </div>
              <div className="grid grid-cols-4 gap-2">
                {facts.map(([a, b], i) => (
                  <div key={i} className="border border-slate-300 rounded p-2 bg-white text-center">
                    <div className="font-mono text-lg leading-6">
                      {a} × {b} = <span className="inline-block w-12 h-6 border-b-[2px] border-slate-600 mx-1" />
                    </div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('times-table-timed-1-5', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {facts.map(([a, b], i) => (<li key={i}>{a} × {b} = {a * b}</li>))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('times-table-timed-6-12') && (() => {
          const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`);
          function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }
          const facts: Array<[number, number]> = Array.from({length: 20}).map(() => {
            const a = nextInt(6, 12); const b = nextInt(6, 12); return [a, b];
          });
          return (
            <WorksheetSectionWrapper
              docId="times-table-timed-6-12"
              title="Timed Times Table Test (6-12)"
              emoji="⏱️"
              description="Master speed with timed multiplication tests for facts 6-12. Fun multiplication worksheets that build confidence and math fact practice."
            >
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-900">
                <strong>⏱️ Time yourself!</strong> Try to complete all problems in 3 minutes. Write your start time: ______
              </div>
              <div className="grid grid-cols-4 gap-2">
                {facts.map(([a, b], i) => (
                  <div key={i} className="border border-slate-300 rounded p-2 bg-white text-center">
                    <div className="font-mono text-lg leading-6">
                      {a} × {b} = <span className="inline-block w-12 h-6 border-b-[2px] border-slate-600 mx-1" />
                    </div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('times-table-timed-6-12', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {facts.map(([a, b], i) => (<li key={i}>{a} × {b} = {a * b}</li>))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('times-table-timed-1-12') && (() => {
          const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`);
          function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }
          const facts: Array<[number, number]> = Array.from({length: 30}).map(() => {
            const a = nextInt(1, 12); const b = nextInt(1, 12); return [a, b];
          });
          return (
            <WorksheetSectionWrapper
              docId="times-table-timed-1-12"
              title="Complete Timed Test (1-12)"
              emoji="⏱️"
              description="Comprehensive timed multiplication test covering all facts 1-12. Perfect for building multiplication fluency and memorizing times tables."
            >
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 animate-gradient-x mb-2" />
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-900">
                <strong>⏱️ Time yourself!</strong> Try to complete all problems in 5 minutes. Write your start time: ______
              </div>
              <div className="grid grid-cols-4 gap-2">
                {facts.map(([a, b], i) => (
                  <div key={i} className="border border-slate-300 rounded p-2 bg-white text-center">
                    <div className="font-mono text-lg leading-6">
                      {a} × {b} = <span className="inline-block w-12 h-6 border-b-[2px] border-slate-600 mx-1" />
                    </div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('times-table-timed-1-12', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {facts.map(([a, b], i) => (<li key={i}>{a} × {b} = {a * b}</li>))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('times-table-blank-1-5') && (
          <WorksheetSectionWrapper
            docId="times-table-blank-1-5"
            title="Blank Times Table (1-5) - Fill In"
            emoji="📋"
            description="Blank times table worksheets to fill in for facts 1-5. Perfect for memorization practice and building multiplication confidence."
          >
            <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 animate-gradient-x mb-2" />
            <div className="space-y-4">
              <div className="border border-slate-300 rounded p-4 bg-white">
                <div className="text-center font-semibold mb-3 text-slate-800">Fill in the Times Table (1-5)</div>
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border border-slate-400 p-2 bg-slate-100">×</th>
                      {[1, 2, 3, 4, 5].map(n => (
                        <th key={n} className="border border-slate-400 p-2 bg-slate-100">{n}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 3, 4, 5].map(row => (
                      <tr key={row}>
                        <td className="border border-slate-400 p-2 bg-slate-100 font-semibold">{row}</td>
                        {[1, 2, 3, 4, 5].map(col => (
                          <td key={col} className="border border-slate-400 p-2 text-center">
                            <span className="inline-block w-12 h-6 border-b-[2px] border-slate-600" />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {showAnswersForDoc('times-table-blank-1-5', () => (
              <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                <div className="font-semibold mb-1">Answer key</div>
                <div className="text-xs">Complete times table: 1×1=1, 1×2=2, 1×3=3, 1×4=4, 1×5=5, 2×1=2, 2×2=4, 2×3=6, 2×4=8, 2×5=10, 3×1=3, 3×2=6, 3×3=9, 3×4=12, 3×5=15, 4×1=4, 4×2=8, 4×3=12, 4×4=16, 4×5=20, 5×1=5, 5×2=10, 5×3=15, 5×4=20, 5×5=25</div>
              </div>
            ))}
          </WorksheetSectionWrapper>
        )}

        {activeDocs.includes('times-table-blank-6-12') && (
          <WorksheetSectionWrapper
            docId="times-table-blank-6-12"
            title="Blank Times Table (6-12) - Fill In"
            emoji="📋"
            description="Blank times table worksheets to fill in for facts 6-12. Worksheets for kids who struggle with multiplication - build confidence step by step."
          >
            <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
            <div className="space-y-4">
              <div className="border border-slate-300 rounded p-4 bg-white">
                <div className="text-center font-semibold mb-3 text-slate-800">Fill in the Times Table (6-12)</div>
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr>
                      <th className="border border-slate-400 p-2 bg-slate-100">×</th>
                      {[6, 7, 8, 9, 10, 11, 12].map(n => (
                        <th key={n} className="border border-slate-400 p-2 bg-slate-100">{n}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[6, 7, 8, 9, 10, 11, 12].map(row => (
                      <tr key={row}>
                        <td className="border border-slate-400 p-2 bg-slate-100 font-semibold">{row}</td>
                        {[6, 7, 8, 9, 10, 11, 12].map(col => (
                          <td key={col} className="border border-slate-400 p-2 text-center">
                            <span className="inline-block w-10 h-5 border-b-[2px] border-slate-600" />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {showAnswersForDoc('times-table-blank-6-12', () => (
              <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                <div className="font-semibold mb-1">Answer key</div>
                <div className="text-xs">Complete times table for 6-12. For example: 6×6=36, 6×7=42, 6×8=48, 6×9=54, 6×10=60, 6×11=66, 6×12=72, and so on for all combinations.</div>
              </div>
            ))}
          </WorksheetSectionWrapper>
        )}

        {activeDocs.includes('times-table-blank-1-12') && (
          <WorksheetSectionWrapper
            docId="times-table-blank-1-12"
            title="Complete Blank Times Table (1-12)"
            emoji="📋"
            description="Complete blank times table grid for all facts 1-12. Printable worksheets to help kids overcome math fear and build multiplication fluency."
          >
            <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 animate-gradient-x mb-2" />
            <div className="space-y-4">
              <div className="border border-slate-300 rounded p-4 bg-white">
                <div className="text-center font-semibold mb-3 text-slate-800">Fill in the Complete Times Table (1-12)</div>
                <table className="w-full border-collapse text-xs">
                  <thead>
                    <tr>
                      <th className="border border-slate-400 p-1 bg-slate-100">×</th>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(n => (
                        <th key={n} className="border border-slate-400 p-1 bg-slate-100">{n}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(row => (
                      <tr key={row}>
                        <td className="border border-slate-400 p-1 bg-slate-100 font-semibold">{row}</td>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(col => (
                          <td key={col} className="border border-slate-400 p-1 text-center">
                            <span className="inline-block w-8 h-4 border-b-[1px] border-slate-600" />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {showAnswersForDoc('times-table-blank-1-12', () => (
              <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                <div className="font-semibold mb-1">Answer key</div>
                <div className="text-xs">Complete 12×12 times table. Each cell (row × column) = product. For example: 1×1=1, 1×2=2, ..., 12×12=144</div>
              </div>
            ))}
          </WorksheetSectionWrapper>
        )}

        {activeDocs.includes('times-table-confidence-1-5') && (() => {
          const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`);
          function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }
          const facts: Array<[number, number]> = Array.from({length: 10}).map(() => {
            const a = nextInt(1, 5); const b = nextInt(1, 5); return [a, b];
          });
          return (
            <WorksheetSectionWrapper
              docId="times-table-confidence-1-5"
              title="Confidence-Building Times Table (1-5)"
              emoji="💪"
              description="Stress-free times table worksheets designed to build confidence. Fun and simple worksheets to make multiplication easier for struggling learners."
            >
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-green-400 to-emerald-400 animate-gradient-x mb-2" />
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-900">
                <strong>💪 You've got this!</strong> Take your time. There's no rush. Each problem helps you get stronger!
              </div>
              <div className="grid grid-cols-2 gap-4">
                {facts.map(([a, b], i) => (
                  <div key={i} className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
                    <div className="text-center mb-2 text-slate-700 text-sm">Problem {i + 1}</div>
                    <div className="font-mono text-3xl leading-8 text-center text-blue-700">
                      {a} × {b} = <span className="inline-block w-20 h-10 border-b-[3px] border-blue-600 mx-1 align-middle" />
                    </div>
                    <div className="mt-2 text-xs text-slate-600 text-center">Hint: Think {a} groups of {b}</div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('times-table-confidence-1-5', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {facts.map(([a, b], i) => (<li key={i}>{a} × {b} = {a * b}</li>))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('times-table-confidence-6-12') && (() => {
          const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`);
          function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }
          const facts: Array<[number, number]> = Array.from({length: 10}).map(() => {
            const a = nextInt(6, 12); const b = nextInt(6, 12); return [a, b];
          });
          return (
            <WorksheetSectionWrapper
              docId="times-table-confidence-6-12"
              title="Confidence-Building Times Table (6-12)"
              emoji="💪"
              description="Gentle step-by-step multiplication worksheets for facts 6-12. No-tears times table practice sheets that build understanding and confidence."
            >
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-900">
                <strong>💪 You're doing great!</strong> These problems might look big, but you can solve them step by step!
              </div>
              <div className="grid grid-cols-2 gap-4">
                {facts.map(([a, b], i) => (
                  <div key={i} className="border-2 border-purple-200 rounded-lg p-4 bg-purple-50">
                    <div className="text-center mb-2 text-slate-700 text-sm">Problem {i + 1}</div>
                    <div className="font-mono text-3xl leading-8 text-center text-purple-700">
                      {a} × {b} = <span className="inline-block w-20 h-10 border-b-[3px] border-purple-600 mx-1 align-middle" />
                    </div>
                    <div className="mt-2 text-xs text-slate-600 text-center">Hint: Break it into smaller parts if needed</div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('times-table-confidence-6-12', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {facts.map(([a, b], i) => (<li key={i}>{a} × {b} = {a * b}</li>))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('times-table-fluency-1-12') && (() => {
          const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`);
          function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }
          const facts: Array<[number, number]> = Array.from({length: 25}).map(() => {
            const a = nextInt(1, 12); const b = nextInt(1, 12); return [a, b];
          });
          return (
            <WorksheetSectionWrapper
              docId="times-table-fluency-1-12"
              title="Times Table Fluency Practice (1-12)"
              emoji="⚡"
              description="Build multiplication fluency with comprehensive practice covering all times tables 1-12. Repeated addition worksheets that make learning fun."
            >
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-3 gap-3">
                {facts.map(([a, b], i) => (
                  <div key={i} className="border border-slate-300 rounded p-3 bg-white text-center">
                    <div className="font-mono text-xl leading-7">
                      {a} × {b} = <span className="inline-block w-16 h-8 border-b-[3px] border-slate-600 mx-1 align-middle" />
                    </div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('times-table-fluency-1-12', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {facts.map(([a, b], i) => (<li key={i}>{a} × {b} = {a * b}</li>))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('times-table-mixed-review') && (() => {
          const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`);
          function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }
          const facts: Array<[number, number]> = Array.from({length: 30}).map(() => {
            const a = nextInt(1, 12); const b = nextInt(1, 12); return [a, b];
          });
          return (
            <WorksheetSectionWrapper
              docId="times-table-mixed-review"
              title="Mixed Times Table Review"
              emoji="⚡"
              description="Mixed review of all times tables 1-12 for comprehensive practice. Math fact practice worksheets that build speed, accuracy, and confidence."
            >
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-4 gap-2">
                {facts.map(([a, b], i) => (
                  <div key={i} className="border border-slate-300 rounded p-2 bg-white text-center">
                    <div className="font-mono text-lg leading-6">
                      {a} × {b} = <span className="inline-block w-12 h-6 border-b-[2px] border-slate-600 mx-1" />
                    </div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('times-table-mixed-review', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {facts.map(([a, b], i) => (<li key={i}>{a} × {b} = {a * b}</li>))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('times-table-color-1-5') && (() => {
          const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`);
          function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }
          const colorMap: Record<number, string> = {
            1: 'Red', 2: 'Blue', 3: 'Green', 4: 'Yellow', 5: 'Orange',
            6: 'Purple', 8: 'Pink', 9: 'Brown', 10: 'Gray', 12: 'Cyan',
            15: 'Magenta', 16: 'Lime', 20: 'Teal', 25: 'Coral'
          };
          const facts: Array<[number, number, number]> = Array.from({length: 12}).map(() => {
            const a = nextInt(1, 5); const b = nextInt(1, 5); return [a, b, a * b];
          });
          return (
            <WorksheetSectionWrapper
              docId="times-table-color-1-5"
              title="Color-by-Number Times Table (1-5)"
              emoji="🎨"
              description="Solve multiplication problems and color the picture! Fun color-by-number worksheets that make times table practice engaging and visual."
            >
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 animate-gradient-x mb-2" />
              <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded text-sm text-purple-900">
                <strong>🎨 Color Key:</strong> Solve each problem, then color the shape with the matching answer color!
              </div>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {Object.entries(colorMap).slice(0, 8).map(([num, color]) => (
                  <div key={num} className="flex items-center gap-2 text-sm">
                    <div className="w-8 h-8 print:w-10 print:h-10 border-4 border-slate-400 rounded bg-white" />
                    <span className="font-semibold">{num}</span>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-3">
                {facts.map(([a, b, answer], i) => (
                  <div key={i} className="border-2 border-slate-300 rounded-lg p-3 bg-white text-center">
                    <div className="font-mono text-xl leading-7 mb-2">
                      {a} × {b} = <span className="inline-block w-16 h-8 border-b-[3px] border-slate-600 mx-1 align-middle" />
                    </div>
                    <div className="w-20 h-20 print:w-24 print:h-24 mx-auto border-4 border-slate-400 rounded bg-white">
                      <span className="text-xs text-slate-500">Color</span>
                    </div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('times-table-color-1-5', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {facts.map(([a, b, answer], i) => (<li key={i}>{a} × {b} = {answer} ({colorMap[answer] || 'Custom color'})</li>))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('times-table-color-6-12') && (() => {
          const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`);
          function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }
          const colorMap: Record<number, string> = {
            36: 'Red', 42: 'Blue', 48: 'Green', 54: 'Yellow', 60: 'Orange',
            66: 'Purple', 72: 'Pink', 81: 'Brown', 90: 'Gray', 100: 'Cyan',
            108: 'Magenta', 120: 'Lime', 121: 'Teal', 144: 'Coral'
          };
          const facts: Array<[number, number, number]> = Array.from({length: 12}).map(() => {
            const a = nextInt(6, 12); const b = nextInt(6, 12); return [a, b, a * b];
          });
          return (
            <WorksheetSectionWrapper
              docId="times-table-color-6-12"
              title="Color-by-Number Times Table (6-12)"
              emoji="🎨"
              description="Master times tables 6-12 with fun color-by-number activities. Engaging multiplication worksheets that combine math practice with creativity."
            >
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded text-sm text-purple-900">
                <strong>🎨 Color Key:</strong> Solve each problem, then color the shape with the matching answer color!
              </div>
              <div className="grid grid-cols-4 gap-2 mb-4 text-xs">
                {Object.entries(colorMap).slice(0, 8).map(([num, color]) => (
                  <div key={num} className="flex items-center gap-1">
                    <div className="w-6 h-6 print:w-8 print:h-8 border-4 border-slate-400 rounded bg-white" />
                    <span className="font-semibold">{num}</span>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-3">
                {facts.map(([a, b, answer], i) => (
                  <div key={i} className="border-2 border-slate-300 rounded-lg p-3 bg-white text-center">
                    <div className="font-mono text-xl leading-7 mb-2">
                      {a} × {b} = <span className="inline-block w-16 h-8 border-b-[3px] border-slate-600 mx-1 align-middle" />
                    </div>
                    <div className="w-20 h-20 print:w-24 print:h-24 mx-auto border-4 border-slate-400 rounded bg-white">
                      <span className="text-xs text-slate-500">Color</span>
                    </div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('times-table-color-6-12', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {facts.map(([a, b, answer], i) => (<li key={i}>{a} × {b} = {answer} ({colorMap[answer] || 'Custom color'})</li>))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('times-table-color-1-12') && (() => {
          const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`);
          function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }
          const colorMap: Record<number, string> = {
            1: 'Red', 4: 'Blue', 9: 'Green', 16: 'Yellow', 25: 'Orange',
            36: 'Purple', 49: 'Pink', 64: 'Brown', 81: 'Gray', 100: 'Cyan',
            121: 'Magenta', 144: 'Lime'
          };
          const facts: Array<[number, number, number]> = Array.from({length: 15}).map(() => {
            const a = nextInt(1, 12); const b = nextInt(1, 12); return [a, b, a * b];
          });
          return (
            <WorksheetSectionWrapper
              docId="times-table-color-1-12"
              title="Color-by-Number Times Table (1-12)"
              emoji="🎨"
              description="Complete color-by-number picture using all times tables 1-12. Multiplication color-by-number worksheets that make learning fun and rewarding."
            >
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 animate-gradient-x mb-2" />
              <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded text-sm text-purple-900">
                <strong>🎨 Color Key:</strong> Solve each problem, then color the shape with the matching answer color!
              </div>
              <div className="grid grid-cols-4 gap-2 mb-4 text-xs">
                {Object.entries(colorMap).slice(0, 10).map(([num, color]) => (
                  <div key={num} className="flex items-center gap-1">
                    <div className="w-6 h-6 print:w-8 print:h-8 border-4 border-slate-400 rounded bg-white" />
                    <span className="font-semibold">{num}</span>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-3">
                {facts.map(([a, b, answer], i) => (
                  <div key={i} className="border-2 border-slate-300 rounded-lg p-3 bg-white text-center">
                    <div className="font-mono text-xl leading-7 mb-2">
                      {a} × {b} = <span className="inline-block w-16 h-8 border-b-[3px] border-slate-600 mx-1 align-middle" />
                    </div>
                    <div className="w-20 h-20 print:w-24 print:h-24 mx-auto border-4 border-slate-400 rounded bg-white">
                      <span className="text-xs text-slate-500">Color</span>
                    </div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('times-table-color-1-12', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {facts.map(([a, b, answer], i) => (<li key={i}>{a} × {b} = {answer} ({colorMap[answer] || 'Custom color'})</li>))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('rhyming-words') && (
          <WorksheetSectionWrapper
            docId="rhyming-words"
            title="Rhyming Words"
            emoji="🎵"
            description="Circle the word that rhymes with the picture. Say both words out loud."
          >
            <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 animate-gradient-x mb-2" />
            <div className="grid grid-cols-2 gap-4">
              {[
                { word: 'cat', options: ['bat', 'dog', 'car'], correct: 0 },
                { word: 'hat', options: ['mat', 'cup', 'tree'], correct: 0 },
                { word: 'sun', options: ['run', 'bed', 'car'], correct: 0 },
                { word: 'cake', options: ['lake', 'book', 'ball'], correct: 0 },
                { word: 'bee', options: ['tree', 'cat', 'dog'], correct: 0 },
                { word: 'boat', options: ['goat', 'car', 'house'], correct: 0 },
              ].map((item, idx) => (
                <div key={idx} className="border border-slate-300 rounded p-4 bg-white">
                  <div className="text-center mb-2">
                    <div className="text-4xl mb-2">
                      {item.word === 'cat' && '🐱'}
                      {item.word === 'hat' && '🎩'}
                      {item.word === 'sun' && '☀️'}
                      {item.word === 'cake' && '🎂'}
                      {item.word === 'bee' && '🐝'}
                      {item.word === 'boat' && '⛵'}
                    </div>
                    <p className="text-xl font-bold text-slate-900">{item.word}</p>
                  </div>
                  <div className="space-y-2">
                    {item.options.map((opt, optIdx) => (
                      <label key={optIdx} className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name={`rhyme-${idx}`} value={optIdx} className="w-4 h-4" />
                        <span className="text-slate-700">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {showAnswersForDoc('rhyming-words', () => (
              <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                <div className="font-semibold mb-1">Answer key</div>
                <ul className="list-disc list-inside space-y-0.5">
                  <li>cat → bat</li>
                  <li>hat → mat</li>
                  <li>sun → run</li>
                  <li>cake → lake</li>
                  <li>bee → tree</li>
                  <li>boat → goat</li>
                </ul>
              </div>
            ))}
          </WorksheetSectionWrapper>
        )}

        {activeDocs.includes('cvc-words') && (
          <WorksheetSectionWrapper
            docId="cvc-words"
            title="CVC Words (Consonant-Vowel-Consonant)"
            emoji="📚"
            description="Read each CVC (consonant-vowel-consonant) word. Match it to the correct picture. Then write the word in the blank space."
          >
            <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 animate-gradient-x mb-2" />
            <div className="grid grid-cols-2 gap-4">
              {[
                { word: 'cat', emoji: '🐱' },
                { word: 'dog', emoji: '🐶' },
                { word: 'sun', emoji: '☀️' },
                { word: 'hat', emoji: '🎩' },
                { word: 'pen', emoji: '✏️' },
                { word: 'cup', emoji: '☕' },
              ].map((item, idx) => (
                <div key={idx} className="border border-slate-300 rounded p-4 bg-white">
                  <div className="text-center mb-3">
                    <div className="text-5xl mb-2">{item.emoji}</div>
                    <div className="text-2xl font-bold text-slate-900 mb-2">{item.word}</div>
                    <div className="flex gap-2 justify-center">
                      {item.word.split('').map((letter, i) => (
                        <div key={i} className="w-10 h-12 border-2 border-slate-400 rounded flex items-center justify-center">
                          <span className="text-xl font-semibold text-slate-700">{letter}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-slate-600 text-sm mb-1">Write the word:</p>
                    <div className="h-10 border-b-[3px] border-slate-600 w-full" />
                  </div>
                </div>
              ))}
            </div>
            {showAnswersForDoc('cvc-words', () => (
              <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                <div className="font-semibold mb-1">Answer key</div>
                <ul className="list-disc list-inside space-y-0.5">
                  <li>cat, dog, sun, hat, pen, cup</li>
                </ul>
              </div>
            ))}
          </WorksheetSectionWrapper>
        )}

        {activeDocs.includes('sight-words-pre-primer') && (
          <WorksheetSectionWrapper
            docId="sight-words-pre-primer"
            title="Sight Words (Dolch Pre-Primer)"
            emoji="👁️"
            description="Read each sight word. Trace it carefully, then write it three times in the blank lines provided."
          >
            <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-indigo-400 to-blue-400 animate-gradient-x mb-2" />
            <div className="grid grid-cols-2 gap-4">
              {['the', 'and', 'to', 'a', 'I', 'you', 'it', 'in', 'said', 'for', 'up', 'look'].map((word, idx) => (
                <div key={idx} className="border border-slate-300 rounded p-4 bg-white">
                  <div className="text-center mb-3">
                    <p className="text-3xl font-bold text-slate-900 mb-2">{word}</p>
                    <div className="flex gap-1 justify-center mb-2">
                      <span className="text-slate-400 text-sm">Trace:</span>
                      <span className="text-2xl font-light text-slate-500" style={{ fontFamily: 'monospace' }}>{word}</span>
                    </div>
                    <div className="space-y-1">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-10 border-b-[3px] border-slate-600" />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {showAnswersForDoc('sight-words-pre-primer', () => (
              <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                <div className="font-semibold mb-1">Teaching tip</div>
                <p className="text-sm">These are high-frequency words that children should recognize instantly. Practice reading them in context, not just in isolation.</p>
              </div>
            ))}
          </WorksheetSectionWrapper>
        )}

        {activeDocs.includes('letter-tracing-az') && (
          <WorksheetSectionWrapper
            docId="letter-tracing-az"
            title="Letter Tracing A–Z"
            emoji="✏️"
            description="Trace each letter. Start at the dot. Say the letter name and sound."
          >
            <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-green-400 to-teal-400 animate-gradient-x mb-2" />
            <div className="grid grid-cols-2 gap-4">
              {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'].map((letter, idx) => (
                <svg key={idx} viewBox="0 0 400 200" className="w-full h-auto bg-white border border-slate-300 rounded">
                  <g fill="none" stroke="#94a3b8" strokeWidth="3">
                    <path strokeDasharray="6 6" d={`M40 160 H360`} />
                  </g>
                  <g fill="none" stroke="#111827" strokeWidth="5" strokeLinecap="round">
                    {letter === 'A' && <path d="M200 40 L160 160 M200 40 L240 160 M180 120 L220 120" />}
                    {letter === 'B' && <path d="M160 40 L160 160 M160 40 Q200 40, 200 80 Q200 120, 160 120 M160 120 Q200 120, 200 160" />}
                    {letter === 'C' && <path d="M240 60 Q200 40, 160 60 Q140 100, 160 140 Q200 160, 240 140" />}
                    {letter === 'D' && <path d="M160 40 L160 160 M160 40 Q200 40, 240 80 Q240 120, 200 160 Q160 160, 160 120" />}
                    {letter === 'E' && <path d="M160 40 L160 160 M160 40 L240 40 M160 100 L220 100 M160 160 L240 160" />}
                    {letter === 'F' && <path d="M160 40 L160 160 M160 40 L240 40 M160 100 L220 100" />}
                    {letter === 'G' && <path d="M240 60 Q200 40, 160 60 Q140 100, 160 140 Q200 160, 240 140 M240 120 L200 120" />}
                    {letter === 'H' && <path d="M160 40 L160 160 M240 40 L240 160 M160 100 L240 100" />}
                    {letter === 'I' && <path d="M200 40 L200 160 M180 40 L220 40 M180 160 L220 160" />}
                    {letter === 'J' && <path d="M240 40 L240 140 Q240 160, 200 160 L160 160" />}
                    {letter === 'K' && <path d="M160 40 L160 160 M160 100 L240 40 M160 100 L240 160" />}
                    {letter === 'L' && <path d="M160 40 L160 160 L240 160" />}
                    {letter === 'M' && <path d="M160 160 L160 40 L200 100 L240 40 L240 160" />}
                    {letter === 'N' && <path d="M160 160 L160 40 L240 160 L240 40" />}
                    {letter === 'O' && <ellipse cx="200" cy="100" rx="40" ry="60" />}
                    {letter === 'P' && <path d="M160 40 L160 160 M160 40 Q200 40, 200 80 Q200 120, 160 120" />}
                    {letter === 'Q' && <ellipse cx="200" cy="100" rx="40" ry="60" />}
                    {letter === 'R' && <path d="M160 40 L160 160 M160 40 Q200 40, 200 80 Q200 120, 160 120 M160 120 L240 160" />}
                    {letter === 'S' && <path d="M240 60 Q200 40, 160 60 Q140 80, 180 100 Q220 120, 240 140 Q260 160, 200 160" />}
                    {letter === 'T' && <path d="M200 40 L200 160 M160 40 L240 40" />}
                    {letter === 'U' && <path d="M160 40 L160 120 Q160 160, 200 160 Q240 160, 240 120 L240 40" />}
                    {letter === 'V' && <path d="M160 40 L200 160 L240 40" />}
                    {letter === 'W' && <path d="M160 40 L180 160 L200 100 L220 160 L240 40" />}
                    {letter === 'X' && <path d="M160 40 L240 160 M240 40 L160 160" />}
                    {letter === 'Y' && <path d="M200 40 L200 100 M160 40 L200 100 L240 40 M200 100 L200 160" />}
                    {letter === 'Z' && <path d="M160 40 L240 40 L160 160 L240 160" />}
                  </g>
                  <circle cx="200" cy="50" r="4" fill="#ef4444" />
                  <text x="200" y="190" fontSize="24" fill="#111827" textAnchor="middle">{letter}</text>
                </svg>
              ))}
            </div>
            {showAnswersForDoc('letter-tracing-az', () => (
              <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                <div className="font-semibold mb-1">Teaching tip</div>
                <p className="text-sm">Start at the red dot and follow the arrow direction. Practice saying the letter name and sound while tracing. Use proper pencil grip and take your time.</p>
              </div>
            ))}
          </WorksheetSectionWrapper>
        )}

        {activeDocs.includes('more-less-equal-10') && (
          <WorksheetSectionWrapper
            docId="more-less-equal-10"
            title="More, Less, or Equal? (1–10)"
            emoji="⚖️"
            description="Compare the two groups. Circle: more, less, or equal."
          >
            <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 animate-gradient-x mb-2" />
            <div className="grid grid-cols-2 gap-4">
              {[
                { left: 3, right: 5 },
                { left: 7, right: 4 },
                { left: 6, right: 6 },
                { left: 8, right: 3 },
                { left: 2, right: 9 },
                { left: 5, right: 5 },
              ].map((pair, idx) => (
                <div key={idx} className="border border-slate-300 rounded p-4 bg-white">
                  <div className="flex items-center justify-around mb-3">
                    <div className="text-center">
                      <div className="flex gap-1 flex-wrap justify-center mb-2" style={{ width: '80px' }}>
                        {Array.from({ length: pair.left }).map((_, i) => (
                          <div key={i} className="w-8 h-8 print:w-10 print:h-10 rounded-full border-4 border-slate-400 bg-white" />
                        ))}
                      </div>
                      <p className="text-xl font-bold text-slate-900">{pair.left}</p>
                    </div>
                    <div className="text-2xl text-slate-400">vs</div>
                    <div className="text-center">
                      <div className="flex gap-1 flex-wrap justify-center mb-2" style={{ width: '80px' }}>
                        {Array.from({ length: pair.right }).map((_, i) => (
                          <div key={i} className="w-8 h-8 print:w-10 print:h-10 rounded-full border-4 border-slate-400 bg-white" />
                        ))}
                      </div>
                      <p className="text-xl font-bold text-slate-900">{pair.right}</p>
                    </div>
                  </div>
                  <div className="flex gap-3 justify-center">
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input type="radio" name={`compare-${idx}`} value="more" className="w-4 h-4" />
                      <span className="text-slate-700">More</span>
                    </label>
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input type="radio" name={`compare-${idx}`} value="less" className="w-4 h-4" />
                      <span className="text-slate-700">Less</span>
                    </label>
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input type="radio" name={`compare-${idx}`} value="equal" className="w-4 h-4" />
                      <span className="text-slate-700">Equal</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
            {showAnswersForDoc('more-less-equal-10', () => (
              <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                <div className="font-semibold mb-1">Answer key</div>
                <ul className="list-disc list-inside space-y-0.5">
                  <li>3 vs 5: Less (3 &lt; 5)</li>
                  <li>7 vs 4: More (7 &gt; 4)</li>
                  <li>6 vs 6: Equal (6 = 6)</li>
                  <li>8 vs 3: More (8 &gt; 3)</li>
                  <li>2 vs 9: Less (2 &lt; 9)</li>
                  <li>5 vs 5: Equal (5 = 5)</li>
                </ul>
              </div>
            ))}
          </WorksheetSectionWrapper>
        )}

        {activeDocs.includes('counting-objects-20') && (
          <WorksheetSectionWrapper
            docId="counting-objects-20"
            title="Count the Objects (1–20)"
            emoji="🔢"
            description="Count each group of objects carefully. Write the total number in the blank space provided."
          >
            <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-rose-400 to-pink-400 animate-gradient-x mb-2" />
            <div className="grid grid-cols-2 gap-4">
              {[4, 7, 12, 9, 15, 18, 6, 11, 14, 20].map((count, idx) => (
                <div key={idx} className="border border-slate-300 rounded p-4 bg-white">
                  <div className="flex flex-wrap gap-2 justify-center mb-3" style={{ minHeight: '80px' }}>
                    {Array.from({ length: count }).map((_, i) => {
                      const shapes = ['⭐', '🔴', '🟢', '🔵', '🟡', '🟣', '🟠', '⚫'];
                      return (
                        <span key={i} className="text-2xl">
                          {shapes[i % shapes.length]}
                        </span>
                      );
                    })}
                  </div>
                  <div className="text-center">
                    <p className="text-slate-600 text-sm mb-1">How many?</p>
                    <div className="inline-block border-2 border-slate-400 rounded px-4 py-2">
                      <span className="text-2xl font-bold text-slate-900">__</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {showAnswersForDoc('counting-objects-20', () => (
              <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                <div className="font-semibold mb-1">Answer key</div>
                <ul className="list-disc list-inside space-y-0.5">
                  {[4, 7, 12, 9, 15, 18, 6, 11, 14, 20].map((count, i) => (
                    <li key={i}>Group {i + 1}: {count} objects</li>
                  ))}
                </ul>
              </div>
            ))}
          </WorksheetSectionWrapper>
        )}

        {activeDocs.includes('sentence-building') && (
          <WorksheetSectionWrapper
            docId="sentence-building"
            title="Sentence Building"
            emoji="📝"
            description="Put the words in order to make a complete sentence. Write the sentence on the line provided below."
          >
            <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-violet-400 to-purple-400 animate-gradient-x mb-2" />
            <div className="space-y-4">
              {[
                { words: ['The', 'cat', 'is', 'sleeping', '.'], sentence: 'The cat is sleeping.' },
                { words: ['I', 'like', 'to', 'read', '.'], sentence: 'I like to read.' },
                { words: ['We', 'play', 'at', 'the', 'park', '.'], sentence: 'We play at the park.' },
                { words: ['She', 'has', 'a', 'red', 'ball', '.'], sentence: 'She has a red ball.' },
              ].map((item, idx) => (
                <div key={idx} className="border border-slate-300 rounded p-4 bg-white">
                  <div className="mb-3">
                    <p className="text-slate-600 text-sm mb-2">Words (put in order):</p>
                    <div className="flex flex-wrap gap-2">
                      {item.words.map((word, wIdx) => (
                        <span key={wIdx} className="px-3 py-1 border-2 border-slate-400 rounded text-slate-700 font-semibold">
                          {word}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-slate-600 text-sm mb-1">Write the sentence:</p>
                    <div className="h-12 border-b-[3px] border-slate-600 w-full" />
                  </div>
                </div>
              ))}
            </div>
            {showAnswersForDoc('sentence-building', () => (
              <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                <div className="font-semibold mb-1">Answer key</div>
                <ul className="list-disc list-inside space-y-0.5">
                  {[
                    'The cat is sleeping.',
                    'I like to read.',
                    'We play at the park.',
                    'She has a red ball.',
                  ].map((sent, i) => (
                    <li key={i}>{sent}</li>
                  ))}
                </ul>
              </div>
            ))}
          </WorksheetSectionWrapper>
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

        {/* Kindergarten Worksheets */}
        {activeDocs.includes('count-circle-1-10') && (() => {
          const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`)
          const problems = Array.from({ length: 8 }, () => {
            const count = Math.floor(rng() * 10) + 1
            return { count, objects: Array.from({ length: count }, (_, i) => i) }
          })
          return (
            <WorksheetSectionWrapper
              docId="count-circle-1-10"
              title="Count & Circle 1–10"
              emoji="🔢"
              description="Count the objects in each box. Circle the correct number."
            >
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-900">
                <strong>📝 Instructions:</strong> Count the circles in each box. Then circle the number that matches the count.
              </div>
              <div className="grid grid-cols-2 gap-4">
                {problems.map((p, i) => (
                  <div key={i} className="border border-slate-300 rounded-lg p-4 bg-white">
                    <div className="flex gap-2 mb-3 flex-wrap">
                      {p.objects.map((_, j) => (
                        <div key={j} className="w-12 h-12 print:w-16 print:h-16 rounded-full border-4 border-slate-400 bg-white" />
                      ))}
                    </div>
                    <div className="flex gap-2 justify-center">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                        <button key={n} className="w-10 h-10 border-2 border-slate-300 rounded-full text-lg font-semibold text-slate-700 hover:border-purple-500">
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('count-circle-1-10', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {problems.map((p, i) => (
                      <li key={i}>Box {i + 1}: Circle {p.count}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          )
        })()}

        {activeDocs.includes('count-match-1-20') && (() => {
          const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`)
          const problems = Array.from({ length: 6 }, () => {
            const count = Math.floor(rng() * 20) + 1
            return { count, objects: Array.from({ length: count }, (_, i) => i) }
          })
          return (
            <WorksheetSectionWrapper
              docId="count-match-1-20"
              title="Count & Match 1–20"
              emoji="🔢"
              description="Count the objects and draw a line to match with the correct number."
            >
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-2 gap-4">
                {problems.map((p, i) => (
                  <div key={i} className="border border-slate-300 rounded-lg p-4 bg-white">
                    <div className="flex gap-1 mb-3 flex-wrap">
                      {p.objects.map((_, j) => (
                        <div key={j} className="w-10 h-10 print:w-12 print:h-12 rounded-full border-4 border-slate-400 bg-white" />
                      ))}
                    </div>
                    <div className="flex gap-2 justify-center">
                      {[p.count - 2, p.count - 1, p.count, p.count + 1, p.count + 2].filter(n => n > 0 && n <= 20).map(n => (
                        <div key={n} className="w-12 h-12 border-2 border-slate-300 rounded-lg flex items-center justify-center text-xl font-bold text-slate-700">
                          {n}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('count-match-1-20', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {problems.map((p, i) => (
                      <li key={i}>Row {i + 1}: Match to {p.count}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          )
        })()}

        {activeDocs.includes('how-many-1-15') && (() => {
          const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`)
          const problems = Array.from({ length: 8 }, () => {
            const count = Math.floor(rng() * 15) + 1
            return { count, objects: Array.from({ length: count }, (_, i) => i) }
          })
          return (
            <WorksheetSectionWrapper
              docId="how-many-1-15"
              title="How Many? (1–15)"
              emoji="🔢"
              description="Count how many objects you see. Write the number in the box."
            >
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-2 gap-4">
                {problems.map((p, i) => (
                  <div key={i} className="border border-slate-300 rounded-lg p-4 bg-white">
                    <div className="flex gap-1 mb-3 flex-wrap justify-center">
                      {p.objects.map((_, j) => (
                        <div key={j} className="w-10 h-10 print:w-12 print:h-12 rounded-full border-4 border-slate-400 bg-white" />
                      ))}
                    </div>
                    <div className="text-center">
                      <div className="inline-block w-20 h-12 border-2 border-slate-400 rounded text-center text-2xl font-bold text-slate-700 flex items-center justify-center">
                        ___
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('how-many-1-15', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {problems.map((p, i) => (
                      <li key={i}>Box {i + 1}: {p.count}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          )
        })()}

        {activeDocs.includes('count-color-1-10') && (() => {
          const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`)
          const emojis = ['⭐', '🍎', '🎈', '🐱', '🚗', '🌺', '🦋', '🍪', '🎨', '🐶']
          const problems = Array.from({ length: 6 }, () => {
            const count = Math.floor(rng() * 10) + 1
            const total = 10
            const emoji = emojis[Math.floor(rng() * emojis.length)]
            return { count, total, emoji, objects: Array.from({ length: total }, (_, i) => i) }
          })
          return (
            <WorksheetSectionWrapper
              docId="count-color-1-10"
              title="Count & Color (1–10)"
              emoji="🔢"
              description="Count the objects and color the correct number of items."
            >
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-900">
                <strong>📝 Instructions:</strong> Look at each row below. Count the objects and color the number of items shown in the instruction.
              </div>
              <div className="grid grid-cols-1 gap-6">
                {problems.map((p, i) => (
                  <div key={i} className="border-2 border-slate-300 rounded-lg p-6 bg-white">
                    <div className="text-center mb-4">
                      <div className="text-2xl font-semibold text-slate-800 mb-2">Color {p.count} {p.emoji}</div>
                      <div className="text-sm text-slate-600">Count and color exactly {p.count} items</div>
                    </div>
                    <div className="flex gap-3 flex-wrap justify-center">
                      {p.objects.map((_, j) => (
                        <div key={j} className="w-16 h-16 print:w-20 print:h-20 border-4 border-slate-400 rounded-lg flex items-center justify-center text-3xl print:text-4xl bg-white">
                          {p.emoji}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('count-color-1-10', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {problems.map((p, i) => (
                      <li key={i}>Row {i + 1}: Color {p.count} {p.emoji}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          )
        })()}

        {activeDocs.includes('number-id-1-10') && (() => {
          const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`)
          const targetNumber = Math.floor(rng() * 10) + 1
          const numbers = Array.from({ length: 30 }, () => Math.floor(rng() * 10) + 1)
          return (
            <WorksheetSectionWrapper
              docId="number-id-1-10"
              title="Number Identification 1–10"
              emoji="🔟"
              description={`Find and circle all the number ${targetNumber}s.`}
            >
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="text-center mb-4">
                <p className="text-xl font-bold text-slate-900">Find and circle all the {targetNumber}s</p>
              </div>
              <div className="grid grid-cols-10 gap-2">
                {numbers.map((n, i) => (
                  <div key={i} className="w-12 h-12 border-2 border-slate-300 rounded-lg flex items-center justify-center text-2xl font-bold bg-white text-slate-700">
                    {n}
                  </div>
                ))}
              </div>
              {showAnswersForDoc('number-id-1-10', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <p className="text-sm">Circle all {targetNumber}s. Found: {numbers.filter(n => n === targetNumber).length} instances.</p>
                </div>
              ))}
            </WorksheetSectionWrapper>
          )
        })()}

        {activeDocs.includes('number-matching-1-15') && (() => {
          const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`)
          const numberWords = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen']
          const allNumbers = Array.from({ length: 15 }, (_, i) => i + 1)
          const shuffledNumbers = [...allNumbers].sort(() => (rng() > 0.5 ? 1 : -1))
          const selectedNumbers = shuffledNumbers.slice(0, 6)
          const problems = selectedNumbers.map(num => ({ num, word: numberWords[num - 1] }))
          return (
            <WorksheetSectionWrapper
              docId="number-matching-1-15"
              title="Number Matching 1–15"
              emoji="🔟"
              description="Match the number word to the numeral. Connect with a line."
            >
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-900">
                <strong>📝 Instructions:</strong> Draw a line to connect each number on the left to its matching word on the right.
              </div>
              <div className="grid grid-cols-1 gap-4">
                {problems.map((p, i) => (
                  <div key={i} className="border-2 border-slate-300 rounded-lg p-6 bg-white">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-20 h-20 print:w-24 print:h-24 border-4 border-blue-500 rounded-lg flex items-center justify-center text-4xl print:text-5xl font-bold text-blue-700 bg-blue-50">
                          {p.num}
                        </div>
                      </div>
                      <div className="flex-1 border-t-2 border-dashed border-slate-400 mx-4" />
                      <div className="flex-shrink-0">
                        <div className="w-32 print:w-40 border-2 border-slate-300 rounded-lg p-3 bg-slate-50 min-h-16 print:min-h-20 flex items-center justify-center">
                          <div className="text-xl print:text-2xl font-semibold text-slate-700 capitalize text-center">{p.word}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('number-matching-1-15', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {problems.map((p, i) => (
                      <li key={i}>{p.num} = {p.word}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          )
        })()}

        {activeDocs.includes('number-order-1-20') && (() => {
          const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`)
          const start = Math.floor(rng() * 10) + 1
          const sequence = Array.from({ length: 6 }, (_, i) => start + i).filter(n => n <= 20)
          const shuffled = [...sequence].sort(() => (rng() > 0.5 ? 1 : -1))
          return (
            <WorksheetSectionWrapper
              docId="number-order-1-20"
              title="Number Order 1–20"
              emoji="🔟"
              description="Cut and paste numbers in order from smallest to largest."
            >
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="mb-4">
                <p className="text-sm text-slate-600 mb-2">Numbers to order:</p>
                <div className="flex gap-2 flex-wrap">
                  {shuffled.map((n, i) => (
                    <div key={i} className="w-12 h-12 border-2 border-slate-300 rounded-lg flex items-center justify-center text-xl font-bold text-slate-700 bg-slate-50">
                      {n}
                    </div>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <p className="text-sm text-slate-600 mb-2">Write in order:</p>
                <div className="flex gap-2">
                  {sequence.map((_, i) => (
                    <div key={i} className="w-12 h-12 border-2 border-dashed border-slate-400 rounded-lg flex items-center justify-center text-xl font-bold text-slate-400">
                      __
                    </div>
                  ))}
                </div>
              </div>
              {showAnswersForDoc('number-order-1-20', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <p className="text-sm">Order: {sequence.join(', ')}</p>
                </div>
              ))}
            </WorksheetSectionWrapper>
          )
        })()}

        {activeDocs.includes('find-number-1-10') && (() => {
          const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`)
          const targetNumber = Math.floor(rng() * 10) + 1
          const grid = Array.from({ length: 40 }, () => Math.floor(rng() * 10) + 1)
          return (
            <WorksheetSectionWrapper
              docId="find-number-1-10"
              title="Find the Number (1–10)"
              emoji="🔟"
              description={`Look at the number ${targetNumber}. Find and circle all the matching numbers.`}
            >
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-900">
                <strong>📝 Instructions:</strong> Look at the number below. Find and circle all the {targetNumber}s in the grid.
              </div>
              <div className="text-center mb-6">
                <div className="inline-block w-32 h-32 print:w-40 print:h-40 border-4 border-purple-500 rounded-lg flex items-center justify-center text-6xl print:text-7xl font-bold text-purple-700 bg-purple-50 mb-3">
                  {targetNumber}
                </div>
                <p className="text-xl font-semibold text-slate-800">Find all the {targetNumber}s</p>
              </div>
              <div className="grid grid-cols-5 gap-3 print:gap-4">
                {grid.map((n, i) => (
                  <div key={i} className="w-16 h-16 print:w-20 print:h-20 border-4 border-slate-300 rounded-lg flex items-center justify-center text-2xl print:text-3xl font-bold bg-white text-slate-700">
                    {n}
                  </div>
                ))}
              </div>
              {showAnswersForDoc('find-number-1-10', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <p className="text-sm">Circle all {targetNumber}s. Found: {grid.filter(n => n === targetNumber).length} instances.</p>
                </div>
              ))}
            </WorksheetSectionWrapper>
          )
        })()}

        {activeDocs.includes('shape-identification') && (() => {
          const renderShape = (type: string, size: number = 60, x: number = 0, y: number = 0) => {
            const svgMap: Record<string, JSX.Element> = {
              circle: <circle cx={x + size/2} cy={y + size/2} r={size*0.375} fill="none" stroke="#475569" strokeWidth="3" />,
              square: <rect x={x + size*0.125} y={y + size*0.125} width={size*0.75} height={size*0.75} fill="none" stroke="#475569" strokeWidth="3" />,
              triangle: <polygon points={`${x + size/2},${y + size*0.125} ${x + size*0.125},${y + size*0.875} ${x + size*0.875},${y + size*0.875}`} fill="none" stroke="#475569" strokeWidth="3" />,
              rectangle: <rect x={x + size*0.1875} y={y + size*0.25} width={size*0.625} height={size*0.5} fill="none" stroke="#475569" strokeWidth="3" />,
            };
            return svgMap[type] || null;
          };
          const tasks = [
            { name: 'Circle', type: 'circle', instruction: 'Circle all the circles', shapes: ['circle', 'square', 'circle', 'triangle', 'rectangle', 'circle', 'square', 'triangle', 'circle', 'rectangle', 'square', 'triangle'] },
            { name: 'Square', type: 'square', instruction: 'Circle all the squares', shapes: ['square', 'circle', 'triangle', 'square', 'rectangle', 'circle', 'square', 'triangle', 'rectangle', 'square', 'circle', 'triangle'] },
            { name: 'Triangle', type: 'triangle', instruction: 'Circle all the triangles', shapes: ['triangle', 'circle', 'square', 'triangle', 'rectangle', 'circle', 'triangle', 'square', 'rectangle', 'circle', 'triangle', 'square'] },
            { name: 'Rectangle', type: 'rectangle', instruction: 'Circle all the rectangles', shapes: ['rectangle', 'circle', 'square', 'triangle', 'rectangle', 'circle', 'square', 'rectangle', 'triangle', 'circle', 'rectangle', 'square'] },
          ];
          return (
            <WorksheetSectionWrapper
              docId="shape-identification"
              title="Shape Identification"
              emoji="🟩"
              description="Circle the circle, square, triangle, and rectangle. Learn basic shapes."
            >
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-900">
                <strong>📝 Instructions:</strong> Look at each section below. Find and circle all the shapes that match the instruction.
              </div>
              <div className="grid grid-cols-1 gap-6">
                {tasks.map((task, taskIdx) => (
                  <div key={taskIdx} className="border-2 border-slate-300 rounded-lg p-6 bg-white">
                    <div className="text-center mb-4">
                      <div className="text-xl font-semibold text-slate-800 mb-2">{task.instruction}</div>
                      <div className="text-sm text-slate-600 mb-3">Find the {task.name.toLowerCase()}s</div>
                      <svg viewBox="0 0 60 60" className="w-16 h-16 mx-auto mb-2">
                        {renderShape(task.type, 60, 0, 0)}
                      </svg>
                    </div>
                    <div className="border-2 border-dashed border-slate-400 rounded-lg p-6 bg-slate-50">
                      <div className="grid grid-cols-4 gap-4">
                        {task.shapes.map((shapeType, i) => (
                          <div key={i} className="flex justify-center items-center">
                            <svg viewBox="0 0 60 60" className="w-20 h-20 print:w-24 print:h-24">
                              {renderShape(shapeType, 60, 0, 0)}
                            </svg>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('shape-identification', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {tasks.map((t, i) => (
                      <li key={i}>{t.instruction}: Circle all {t.name.toLowerCase()}s in the grid</li>
                    ))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          )
        })()}

        {activeDocs.includes('ab-pattern') && (() => {
          const patterns = [
            { items: ['🔴', '🔵', '🔴', '🔵', '🔴', '___'], answer: '🔵' },
            { items: ['🟢', '🟡', '🟢', '🟡', '🟢', '___'], answer: '🟡' },
            { items: ['⭐', '💫', '⭐', '💫', '⭐', '___'], answer: '💫' },
            { items: ['🔺', '🔻', '🔺', '🔻', '🔺', '___'], answer: '🔻' },
          ]
          return (
            <WorksheetSectionWrapper
              docId="ab-pattern"
              title="AB Pattern Completion"
              emoji="🧩"
              description="Look at the pattern. What comes next? Circle or draw the next item."
            >
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-2 gap-4">
                {patterns.map((p, i) => (
                  <div key={i} className="border border-slate-300 rounded-lg p-4 bg-white">
                    <div className="text-center mb-2 text-sm text-slate-600">Pattern {i + 1}</div>
                    <div className="flex gap-3 justify-center items-center mb-3">
                      {p.items.map((item, j) => (
                        <div key={j} className={`text-3xl ${j === p.items.length - 1 ? 'border-2 border-dashed border-slate-400 rounded p-2' : ''}`}>
                          {item}
                        </div>
                      ))}
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-slate-600 mb-2">What comes next?</p>
                      <div className="flex gap-2 justify-center">
                        {[p.answer, p.items[0]].map((opt, j) => (
                          <div key={j} className="w-16 h-16 border-2 border-slate-300 rounded-lg flex items-center justify-center text-2xl">
                            {opt}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('ab-pattern', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {patterns.map((p, i) => (
                      <li key={i}>Pattern {i + 1}: {p.answer}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          )
        })()}

        {activeDocs.includes('big-small') && (() => {
          const pairs = [
            { big: '🐘', small: '🐭', bigLabel: 'Elephant', smallLabel: 'Mouse' },
            { big: '🏠', small: '🏡', bigLabel: 'Big House', smallLabel: 'Small House' },
            { big: '🌳', small: '🌱', bigLabel: 'Tree', smallLabel: 'Seedling' },
            { big: '🚗', small: '🚙', bigLabel: 'Car', smallLabel: 'Small Car' },
          ]
          return (
            <WorksheetSectionWrapper
              docId="big-small"
              title="Big and Small"
              emoji="⚖️"
              description="Circle the big object. Put an X on the small object."
            >
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-2 gap-4">
                {pairs.map((p, i) => (
                  <div key={i} className="border border-slate-300 rounded-lg p-4 bg-white">
                    <div className="flex items-center justify-around mb-3">
                      <div className="text-center">
                        <div className="text-5xl mb-1">{p.big}</div>
                        <p className="text-xs text-slate-600">{p.bigLabel}</p>
                        <div className="mt-2">
                          <span className="inline-block w-6 h-6 border-2 border-slate-400 rounded-full" />
                          <span className="ml-1 text-xs text-slate-600">Circle</span>
                        </div>
                      </div>
                      <div className="text-2xl text-slate-400">vs</div>
                      <div className="text-center">
                        <div className="text-3xl mb-1">{p.small}</div>
                        <p className="text-xs text-slate-600">{p.smallLabel}</p>
                        <div className="mt-2">
                          <span className="text-xl">✗</span>
                          <span className="ml-1 text-xs text-slate-600">X</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('big-small', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {pairs.map((p, i) => (
                      <li key={i}>Row {i + 1}: Circle {p.bigLabel}, X on {p.smallLabel}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          )
        })()}

        {activeDocs.includes('more-less') && (() => {
          const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`)
          const problems = Array.from({ length: 6 }, () => {
            const left = Math.floor(rng() * 10) + 1
            const right = Math.floor(rng() * 10) + 1
            return { left, right }
          })
          return (
            <WorksheetSectionWrapper
              docId="more-less"
              title="More and Less"
              emoji="⚖️"
              description="Count each group. Circle the group that has more."
            >
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-2 gap-4">
                {problems.map((p, i) => (
                  <div key={i} className="border border-slate-300 rounded-lg p-4 bg-white">
                    <div className="flex items-center justify-around mb-3">
                      <div className="text-center">
                        <div className="flex gap-1 flex-wrap justify-center mb-2" style={{ width: '80px' }}>
                          {Array.from({ length: p.left }).map((_, j) => (
                            <div key={j} className="w-8 h-8 print:w-10 print:h-10 rounded-full border-4 border-slate-400 bg-white" />
                          ))}
                        </div>
                        <p className="text-xl font-bold text-slate-900">{p.left}</p>
                      </div>
                      <div className="text-2xl text-slate-400">vs</div>
                      <div className="text-center">
                        <div className="flex gap-1 flex-wrap justify-center mb-2" style={{ width: '80px' }}>
                          {Array.from({ length: p.right }).map((_, j) => (
                            <div key={j} className="w-8 h-8 print:w-10 print:h-10 rounded-full border-4 border-slate-400 bg-white" />
                          ))}
                        </div>
                        <p className="text-xl font-bold text-slate-900">{p.right}</p>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="inline-block w-8 h-8 border-2 border-slate-400 rounded-full" />
                      <span className="ml-2 text-sm text-slate-600">Circle the group with more</span>
                    </div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('more-less', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {problems.map((p, i) => {
                      const answer = p.left > p.right ? 'Left' : p.right > p.left ? 'Right' : 'Equal'
                      return <li key={i}>Row {i + 1}: {answer} ({p.left} vs {p.right})</li>
                    })}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          )
        })()}

        {/* 3rd Grade Worksheets */}
        {activeDocs.includes('mult-facts-0-12') && (() => {
          const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`)
          const problems = Array.from({ length: 20 }, () => {
            const a = Math.floor(rng() * 13)
            const b = Math.floor(rng() * 13)
            return { a, b, answer: a * b }
          })
          return (
            <WorksheetSectionWrapper
              docId="mult-facts-0-12"
              title="Multiplication Facts 0–12"
              emoji="✖️"
              description="Practice all multiplication facts from 0×0 to 12×12. Build speed and accuracy."
            >
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-2 gap-3">
                {problems.map((p, i) => (
                  <div key={i} className="border border-slate-300 rounded p-3 bg-white">
                    <div className="font-mono text-2xl leading-7 text-right">
                      <div>{p.a}</div>
                      <div>× {p.b}</div>
                      <div className="border-t-[3px] border-slate-600 mt-2 pt-2 h-12 flex items-center"><span className="inline-block w-20 h-10 border-b-[3px] border-slate-600" /></div>
                    </div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('mult-facts-0-12', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {problems.map((p, i) => (
                      <li key={i}>{p.a} × {p.b} = {p.answer}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          )
        })()}

        {activeDocs.includes('div-facts-1-12') && (() => {
          const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`)
          const problems = Array.from({ length: 20 }, () => {
            const b = Math.floor(rng() * 12) + 1
            const quotient = Math.floor(rng() * 12) + 1
            const dividend = b * quotient
            return { dividend, b, answer: quotient }
          })
          return (
            <WorksheetSectionWrapper
              docId="div-facts-1-12"
              title="Division Facts 1–12"
              emoji="➗"
              description="Master division facts from 1÷1 to 144÷12. Build division fluency."
            >
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-2 gap-3">
                {problems.map((p, i) => (
                  <div key={i} className="border border-slate-300 rounded p-3 bg-white">
                    <div className="font-mono text-2xl leading-7 text-right">
                      <div>{p.dividend}</div>
                      <div>÷ {p.b}</div>
                      <div className="border-t-[3px] border-slate-600 mt-2 pt-2 h-12 flex items-center"><span className="inline-block w-20 h-10 border-b-[3px] border-slate-600" /></div>
                    </div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('div-facts-1-12', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {problems.map((p, i) => (
                      <li key={i}>{p.dividend} ÷ {p.b} = {p.answer}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          )
        })()}

        {activeDocs.includes('fractions-whole') && (() => {
          const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`)
          const problems = [
            { numerator: 1, denominator: 2, total: 8 },
            { numerator: 1, denominator: 4, total: 8 },
            { numerator: 3, denominator: 4, total: 8 },
            { numerator: 1, denominator: 3, total: 9 },
            { numerator: 2, denominator: 3, total: 9 },
            { numerator: 1, denominator: 5, total: 10 },
          ]
          return (
            <WorksheetSectionWrapper
              docId="fractions-whole"
              title="Fractions: Parts of a Whole"
              emoji="🍕"
              description="Color the fraction shown. Understand fractions as parts of a whole."
            >
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-2 gap-4">
                {problems.map((p, i) => {
                  const toColor = Math.floor((p.numerator / p.denominator) * p.total)
                  return (
                    <div key={i} className="border border-slate-300 rounded-lg p-4 bg-white">
                      <div className="text-center mb-2">
                        <p className="text-lg font-bold text-slate-900">{p.numerator}/{p.denominator}</p>
                      </div>
                      <div className="grid grid-cols-4 gap-1 mb-2">
                        {Array.from({ length: p.total }).map((_, j) => (
                          <div key={j} className={`aspect-square border-4 ${j < toColor ? 'border-blue-500 bg-white' : 'border-slate-300 bg-white'}`} />
                        ))}
                      </div>
                      <p className="text-xs text-center text-slate-600">Color {toColor} out of {p.total} parts (the ones with blue border)</p>
                    </div>
                  )
                })}
              </div>
              {showAnswersForDoc('fractions-whole', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {problems.map((p, i) => {
                      const toColor = Math.floor((p.numerator / p.denominator) * p.total)
                      return <li key={i}>{p.numerator}/{p.denominator}: Color {toColor} parts</li>
                    })}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          )
        })()}

        {activeDocs.includes('equivalent-fractions-4th') && (() => {
          const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`)
          function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }
          const problems = Array.from({ length: 8 }, () => {
            const denom = [2, 3, 4, 5, 6, 8][nextInt(0, 5)]
            const num = nextInt(1, denom - 1)
            // Generate equivalent fraction by multiplying numerator and denominator by same factor
            const factor = nextInt(2, 4)
            const equivNum = num * factor
            const equivDenom = denom * factor
            return { original: `${num}/${denom}`, equivalent: `${equivNum}/${equivDenom}`, num, denom, equivNum, equivDenom }
          })
          return (
            <WorksheetSectionWrapper
              docId="equivalent-fractions-4th"
              title="Equivalent Fractions"
              emoji="🍕"
              description="Find an equivalent fraction for each given fraction. Use multiplication or division."
            >
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-2 gap-4">
                {problems.map((p, i) => (
                  <div key={i} className="border border-slate-300 rounded-lg p-4 bg-white">
                    <div className="text-center mb-3">
                      <p className="text-xl font-bold text-slate-900 mb-2">{p.original}</p>
                      <p className="text-sm text-slate-600 mb-1">Find an equivalent fraction:</p>
                      <div className="text-lg font-mono text-slate-800">____ / ____</div>
                    </div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('equivalent-fractions-4th', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {problems.map((p, i) => (
                      <li key={i}>{p.original} = {p.equivalent} (multiply by {p.equivNum / p.num})</li>
                    ))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          )
        })()}

        {/* 4th Grade Worksheets */}
        {activeDocs.includes('long-division-1digit') && (() => {
          const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`);
          function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }
          const problems = Array.from({length: 6}, () => {
            const divisor = nextInt(2, 9);
            const quotient = nextInt(10, 99);
            const dividend = divisor * quotient + nextInt(0, divisor - 1);
            return { dividend, divisor, quotient, remainder: dividend % divisor };
          });
          return (
            <WorksheetSectionWrapper docId="long-division-1digit" title="Long Division (1-Digit Divisor)" emoji="🔢" description="Divide each number. Show your work and write any remainder.">
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="space-y-4">
                {problems.map((p, i) => (
                  <div key={i} className="border border-slate-300 rounded p-4 bg-white">
                    <div className="font-mono text-xl text-right">
                      <div>{p.divisor} ) {p.dividend}</div>
                      <div className="border-t border-slate-400 mt-2 pt-2">____</div>
                    </div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('long-division-1digit', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {problems.map((p, i) => (
                      <li key={i}>{p.dividend} ÷ {p.divisor} = {Math.floor(p.dividend / p.divisor)}{p.remainder > 0 ? ` R${p.remainder}` : ''}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('long-division-2digit') && (() => {
          const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`);
          function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }
          const problems = Array.from({length: 4}, () => {
            const divisor = nextInt(11, 25);
            const quotient = nextInt(10, 50);
            const dividend = divisor * quotient + nextInt(0, divisor - 1);
            return { dividend, divisor, quotient, remainder: dividend % divisor };
          });
          return (
            <WorksheetSectionWrapper docId="long-division-2digit" title="Long Division (2-Digit Divisor)" emoji="🔢" description="Divide each number. Show your work and write any remainder.">
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="space-y-4">
                {problems.map((p, i) => (
                  <div key={i} className="border border-slate-300 rounded p-4 bg-white">
                    <div className="font-mono text-lg text-right">
                      <div>{p.divisor} ) {p.dividend}</div>
                      <div className="border-t border-slate-400 mt-2 pt-2">____</div>
                    </div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('long-division-2digit', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {problems.map((p, i) => (
                      <li key={i}>{p.dividend} ÷ {p.divisor} = {Math.floor(p.dividend / p.divisor)}{p.remainder > 0 ? ` R${p.remainder}` : ''}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('area-model-mult') && (() => {
          const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`);
          function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }
          const problems = Array.from({length: 4}, () => {
            const a = nextInt(12, 35); const b = nextInt(12, 35);
            return { a, b, product: a * b };
          });
          return (
            <WorksheetSectionWrapper docId="area-model-mult" title="Area Model Multiplication" emoji="📊" description="Use the area model to solve each multiplication problem.">
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-2 gap-4">
                {problems.map((p, i) => (
                  <div key={i} className="border border-slate-300 rounded p-4 bg-white">
                    <div className="text-center mb-2 font-semibold">{p.a} × {p.b} = ____</div>
                    <div className="border-2 border-slate-400 rounded" style={{width: '120px', height: '80px', margin: '0 auto'}}>
                      <div className="grid grid-cols-2 h-full">
                        <div className="border-r border-b border-slate-400"></div>
                        <div className="border-b border-slate-400"></div>
                        <div className="border-r border-slate-400"></div>
                        <div></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('area-model-mult', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {problems.map((p, i) => (<li key={i}>{p.a} × {p.b} = {p.product}</li>))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('partial-products') && (() => {
          const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`);
          function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }
          const problems = Array.from({length: 4}, () => {
            const a = nextInt(12, 35); const b = nextInt(12, 35);
            return { a, b, product: a * b };
          });
          return (
            <WorksheetSectionWrapper docId="partial-products" title="Partial Products Multiplication" emoji="🔢" description="Break down each multiplication into partial products.">
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="space-y-4">
                {problems.map((p, i) => (
                  <div key={i} className="border border-slate-300 rounded p-4 bg-white">
                    <div className="font-mono text-xl mb-2">{p.a} × {p.b}</div>
                    <div className="space-y-1 text-sm">
                      <div>({Math.floor(p.a/10)*10} × {Math.floor(p.b/10)*10}) = ____</div>
                      <div>({Math.floor(p.a/10)*10} × {p.b%10}) = ____</div>
                      <div>({p.a%10} × {Math.floor(p.b/10)*10}) = ____</div>
                      <div>({p.a%10} × {p.b%10}) = ____</div>
                      <div className="border-t border-slate-400 mt-1 pt-1 font-semibold">Total: ____</div>
                    </div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('partial-products', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {problems.map((p, i) => (<li key={i}>{p.a} × {p.b} = {p.product}</li>))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('comparing-fractions-4th') && (() => {
          const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`);
          function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }
          const problems = Array.from({length: 8}, () => {
            const denom1 = [2, 3, 4, 5, 6, 8][nextInt(0, 5)];
            const num1 = nextInt(1, denom1 - 1);
            const denom2 = [2, 3, 4, 5, 6, 8][nextInt(0, 5)];
            const num2 = nextInt(1, denom2 - 1);
            const val1 = num1 / denom1;
            const val2 = num2 / denom2;
            return { frac1: `${num1}/${denom1}`, frac2: `${num2}/${denom2}`, val1, val2 };
          });
          return (
            <WorksheetSectionWrapper docId="comparing-fractions-4th" title="Comparing Fractions" emoji="🍕" description="Compare each pair of fractions using >, <, or =.">
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-2 gap-4">
                {problems.map((p, i) => (
                  <div key={i} className="border border-slate-300 rounded-lg p-4 bg-white">
                    <div className="text-center text-xl font-bold">
                      {p.frac1} ____ {p.frac2}
                    </div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('comparing-fractions-4th', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {problems.map((p, i) => {
                      const symbol = p.val1 > p.val2 ? '>' : p.val1 < p.val2 ? '<' : '=';
                      return <li key={i}>{p.frac1} {symbol} {p.frac2}</li>;
                    })}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('add-sub-fractions-4th') && (() => {
          const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`);
          function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }
          const problems = Array.from({length: 6}, () => {
            const denom = [2, 3, 4, 5, 6, 8][nextInt(0, 5)];
            const num1 = nextInt(1, denom - 1);
            const num2 = nextInt(1, denom - 1);
            const op = nextInt(0, 1) === 0 ? '+' : '-';
            return { num1, num2, denom, op };
          });
          return (
            <WorksheetSectionWrapper docId="add-sub-fractions-4th" title="Adding & Subtracting Fractions" emoji="🍕" description="Add or subtract each pair of fractions with like denominators.">
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-2 gap-4">
                {problems.map((p, i) => (
                  <div key={i} className="border border-slate-300 rounded-lg p-4 bg-white">
                    <div className="text-center text-xl font-mono">
                      {p.num1}/{p.denom} {p.op} {p.num2}/{p.denom} = ____
                    </div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('add-sub-fractions-4th', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {problems.map((p, i) => {
                      const result = p.op === '+' ? p.num1 + p.num2 : p.num1 - p.num2;
                      return <li key={i}>{p.num1}/{p.denom} {p.op} {p.num2}/{p.denom} = {result}/{p.denom}</li>;
                    })}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('mixed-improper-fractions') && (() => {
          const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`);
          function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }
          const problems = Array.from({length: 6}, () => {
            const whole = nextInt(1, 3);
            const num = nextInt(1, 3);
            const denom = nextInt(2, 4);
            const improper = whole * denom + num;
            return { whole, num, denom, improper: `${improper}/${denom}`, mixed: `${whole} ${num}/${denom}` };
          });
          return (
            <WorksheetSectionWrapper docId="mixed-improper-fractions" title="Mixed Numbers & Improper Fractions" emoji="🍕" description="Convert between mixed numbers and improper fractions.">
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-2 gap-4">
                {problems.map((p, i) => (
                  <div key={i} className="border border-slate-300 rounded-lg p-4 bg-white">
                    <div className="text-center text-lg font-bold mb-2">{i % 2 === 0 ? p.mixed : p.improper}</div>
                    <div className="text-center text-sm text-slate-600">Convert to: {i % 2 === 0 ? 'improper fraction' : 'mixed number'}</div>
                    <div className="text-center text-xl font-mono mt-2">____</div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('mixed-improper-fractions', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {problems.map((p, i) => (
                      <li key={i}>{i % 2 === 0 ? `${p.mixed} = ${p.improper}` : `${p.improper} = ${p.mixed}`}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {/* 5th Grade Worksheets */}
        {activeDocs.includes('add-sub-mixed-numbers') && (() => {
          const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`);
          function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }
          const problems = Array.from({length: 6}, () => {
            const whole1 = nextInt(1, 3);
            const num1 = nextInt(1, 3);
            const denom1 = nextInt(2, 4);
            const whole2 = nextInt(1, 3);
            const num2 = nextInt(1, 3);
            const denom2 = denom1; // Same denominator for simplicity
            const op = nextInt(0, 1) === 0 ? '+' : '-';
            return { whole1, num1, denom1, whole2, num2, denom2, op };
          });
          return (
            <WorksheetSectionWrapper docId="add-sub-mixed-numbers" title="Adding & Subtracting Mixed Numbers" emoji="🍕" description="Add or subtract each pair of mixed numbers. Regroup when needed.">
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-2 gap-4">
                {problems.map((p, i) => (
                  <div key={i} className="border border-slate-300 rounded-lg p-4 bg-white">
                    <div className="text-center text-xl font-mono">
                      {p.whole1} {p.num1}/{p.denom1} {p.op} {p.whole2} {p.num2}/{p.denom2} = ____
                    </div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('add-sub-mixed-numbers', () => {
                const answers = problems.map(p => {
                  const frac1 = p.whole1 * p.denom1 + p.num1;
                  const frac2 = p.whole2 * p.denom2 + p.num2;
                  const result = p.op === '+' ? frac1 + frac2 : frac1 - frac2;
                  const whole = Math.floor(result / p.denom1);
                  const num = result % p.denom1;
                  return { whole, num, denom: p.denom1 };
                });
                return (
                  <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                    <div className="font-semibold mb-1">Answer key</div>
                    <ul className="list-disc list-inside space-y-0.5">
                      {problems.map((p, i) => {
                        const a = answers[i];
                        return <li key={i}>{p.whole1} {p.num1}/{p.denom1} {p.op} {p.whole2} {p.num2}/{p.denom2} = {a.whole} {a.num}/{a.denom}</li>;
                      })}
                    </ul>
                  </div>
                );
              })}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('decimals-place-value') && (() => {
          const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`);
          function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }
          const problems = Array.from({length: 8}, () => {
            const whole = nextInt(1, 99);
            const tenths = nextInt(0, 9);
            const hundredths = nextInt(0, 9);
            return { value: `${whole}.${tenths}${hundredths}`, whole, tenths, hundredths };
          });
          return (
            <WorksheetSectionWrapper docId="decimals-place-value" title="Decimals: Place Value" emoji="🍕" description="Write the place value of each underlined digit.">
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-2 gap-4">
                {problems.map((p, i) => (
                  <div key={i} className="border border-slate-300 rounded-lg p-4 bg-white">
                    <div className="text-center text-xl font-mono mb-2">{p.value}</div>
                    <div className="text-center text-sm text-slate-600">Tenths: ____ Hundredths: ____</div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('decimals-place-value', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {problems.map((p, i) => (<li key={i}>{p.value}: Tenths = {p.tenths}, Hundredths = {p.hundredths}</li>))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('comparing-decimals') && (() => {
          const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`);
          function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }
          const problems = Array.from({length: 8}, () => {
            const d1 = (nextInt(1, 99) / 10).toFixed(1);
            const d2 = (nextInt(1, 99) / 10).toFixed(1);
            return { d1: parseFloat(d1), d2: parseFloat(d2) };
          });
          return (
            <WorksheetSectionWrapper docId="comparing-decimals" title="Comparing & Ordering Decimals" emoji="🍕" description="Compare each pair using >, <, or =.">
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-2 gap-4">
                {problems.map((p, i) => (
                  <div key={i} className="border border-slate-300 rounded-lg p-4 bg-white">
                    <div className="text-center text-xl font-bold">{p.d1} ____ {p.d2}</div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('comparing-decimals', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {problems.map((p, i) => {
                      const symbol = p.d1 > p.d2 ? '>' : p.d1 < p.d2 ? '<' : '=';
                      return <li key={i}>{p.d1} {symbol} {p.d2}</li>;
                    })}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('add-sub-decimals') && (() => {
          const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`);
          function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }
          const problems = Array.from({length: 6}, () => {
            const d1 = (nextInt(10, 99) / 10).toFixed(1);
            const d2 = (nextInt(10, 99) / 10).toFixed(1);
            const op = nextInt(0, 1) === 0 ? '+' : '-';
            return { d1: parseFloat(d1), d2: parseFloat(d2), op };
          });
          return (
            <WorksheetSectionWrapper docId="add-sub-decimals" title="Adding & Subtracting Decimals" emoji="🍕" description="Add or subtract each pair of decimals. Line up decimal points.">
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-2 gap-4">
                {problems.map((p, i) => (
                  <div key={i} className="border border-slate-300 rounded-lg p-4 bg-white">
                    <div className="text-center text-xl font-mono">
                      {p.d1} {p.op} {p.d2} = ____
                    </div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('add-sub-decimals', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {problems.map((p, i) => {
                      const result = p.op === '+' ? (p.d1 + p.d2).toFixed(1) : (p.d1 - p.d2).toFixed(1);
                      return <li key={i}>{p.d1} {p.op} {p.d2} = {result}</li>;
                    })}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('fractions-to-decimals') && (() => {
          const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`);
          function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }
          const problems = Array.from({length: 8}, () => {
            const denom = [2, 4, 5, 10][nextInt(0, 3)];
            const num = nextInt(1, denom - 1);
            return { num, denom, decimal: (num / denom).toFixed(2) };
          });
          return (
            <WorksheetSectionWrapper docId="fractions-to-decimals" title="Fractions to Decimals" emoji="🍕" description="Convert each fraction to a decimal.">
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-2 gap-4">
                {problems.map((p, i) => (
                  <div key={i} className="border border-slate-300 rounded-lg p-4 bg-white">
                    <div className="text-center text-xl font-bold mb-2">{p.num}/{p.denom}</div>
                    <div className="text-center text-lg font-mono">= ____</div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('fractions-to-decimals', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {problems.map((p, i) => (<li key={i}>{p.num}/{p.denom} = {p.decimal}</li>))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('multiplying-fractions') && (() => {
          const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`);
          function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }
          const problems = Array.from({length: 6}, () => {
            const num1 = nextInt(1, 5); const denom1 = nextInt(2, 6);
            const num2 = nextInt(1, 5); const denom2 = nextInt(2, 6);
            return { num1, denom1, num2, denom2, productNum: num1 * num2, productDenom: denom1 * denom2 };
          });
          return (
            <WorksheetSectionWrapper docId="multiplying-fractions" title="Multiplying Fractions" emoji="🍕" description="Multiply each pair of fractions. Simplify your answer.">
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-2 gap-4">
                {problems.map((p, i) => (
                  <div key={i} className="border border-slate-300 rounded-lg p-4 bg-white">
                    <div className="text-center text-xl font-mono">
                      {p.num1}/{p.denom1} × {p.num2}/{p.denom2} = ____
                    </div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('multiplying-fractions', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {problems.map((p, i) => (<li key={i}>{p.num1}/{p.denom1} × {p.num2}/{p.denom2} = {p.productNum}/{p.productDenom}</li>))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('dividing-fractions') && (() => {
          const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`);
          function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }
          const problems = Array.from({length: 6}, () => {
            const num1 = nextInt(1, 5); const denom1 = nextInt(2, 6);
            const num2 = nextInt(1, 5); const denom2 = nextInt(2, 6);
            return { num1, denom1, num2, denom2, quotientNum: num1 * denom2, quotientDenom: denom1 * num2 };
          });
          return (
            <WorksheetSectionWrapper docId="dividing-fractions" title="Dividing Fractions" emoji="🍕" description="Divide each pair of fractions. Use keep, change, flip.">
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-2 gap-4">
                {problems.map((p, i) => (
                  <div key={i} className="border border-slate-300 rounded-lg p-4 bg-white">
                    <div className="text-center text-xl font-mono">
                      {p.num1}/{p.denom1} ÷ {p.num2}/{p.denom2} = ____
                    </div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('dividing-fractions', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {problems.map((p, i) => (<li key={i}>{p.num1}/{p.denom1} ÷ {p.num2}/{p.denom2} = {p.quotientNum}/{p.quotientDenom}</li>))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('multiplying-decimals') && (() => {
          const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`);
          function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }
          const problems = Array.from({length: 6}, () => {
            const d1 = (nextInt(10, 99) / 10).toFixed(1);
            const d2 = (nextInt(10, 99) / 10).toFixed(1);
            return { d1: parseFloat(d1), d2: parseFloat(d2), product: (parseFloat(d1) * parseFloat(d2)).toFixed(2) };
          });
          return (
            <WorksheetSectionWrapper docId="multiplying-decimals" title="Multiplying Decimals" emoji="🍕" description="Multiply each pair of decimals. Count decimal places.">
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-2 gap-4">
                {problems.map((p, i) => (
                  <div key={i} className="border border-slate-300 rounded-lg p-4 bg-white">
                    <div className="text-center text-xl font-mono">
                      {p.d1} × {p.d2} = ____
                    </div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('multiplying-decimals', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {problems.map((p, i) => (<li key={i}>{p.d1} × {p.d2} = {p.product}</li>))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('dividing-decimals') && (() => {
          const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`);
          function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }
          const problems = Array.from({length: 6}, () => {
            const d1 = (nextInt(20, 99) / 10).toFixed(1);
            const d2 = (nextInt(2, 9) / 10).toFixed(1);
            return { d1: parseFloat(d1), d2: parseFloat(d2), quotient: (parseFloat(d1) / parseFloat(d2)).toFixed(2) };
          });
          return (
            <WorksheetSectionWrapper docId="dividing-decimals" title="Dividing Decimals" emoji="🍕" description="Divide each pair of decimals. Move decimal points correctly.">
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-2 gap-4">
                {problems.map((p, i) => (
                  <div key={i} className="border border-slate-300 rounded-lg p-4 bg-white">
                    <div className="text-center text-xl font-mono">
                      {p.d1} ÷ {p.d2} = ____
                    </div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('dividing-decimals', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {problems.map((p, i) => (<li key={i}>{p.d1} ÷ {p.d2} = {p.quotient}</li>))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('long-division-multidigit') && (() => {
          const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`);
          function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }
          const problems = Array.from({length: 4}, () => {
            const divisor = nextInt(12, 25);
            const quotient = nextInt(20, 50);
            const dividend = divisor * quotient + nextInt(0, divisor - 1);
            return { dividend, divisor, quotient, remainder: dividend % divisor };
          });
          return (
            <WorksheetSectionWrapper docId="long-division-multidigit" title="Long Division (Multi-Digit)" emoji="🔢" description="Divide each number. Show your work and write any remainder.">
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="space-y-4">
                {problems.map((p, i) => (
                  <div key={i} className="border border-slate-300 rounded p-4 bg-white">
                    <div className="font-mono text-lg text-right">
                      <div>{p.divisor} ) {p.dividend}</div>
                      <div className="border-t border-slate-400 mt-2 pt-2">____</div>
                    </div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('long-division-multidigit', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {problems.map((p, i) => (
                      <li key={i}>{p.dividend} ÷ {p.divisor} = {Math.floor(p.dividend / p.divisor)}{p.remainder > 0 ? ` R${p.remainder}` : ''}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('order-of-operations') && (() => {
          const problems = [
            { expr: '3 + 4 × 2', answer: 11 },
            { expr: '(5 + 3) × 2', answer: 16 },
            { expr: '10 - 2 × 3', answer: 4 },
            { expr: '12 ÷ 3 + 5', answer: 9 },
            { expr: '2 × (4 + 3)', answer: 14 },
            { expr: '15 - 3 × 2 + 1', answer: 10 },
          ];
          return (
            <WorksheetSectionWrapper docId="order-of-operations" title="Order of Operations" emoji="🔢" description="Solve each expression using PEMDAS (parentheses, exponents, multiplication, division, addition, subtraction).">
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-2 gap-4">
                {problems.map((p, i) => (
                  <div key={i} className="border border-slate-300 rounded-lg p-4 bg-white">
                    <div className="text-center text-xl font-mono mb-2">{p.expr}</div>
                    <div className="text-center text-lg font-mono">= ____</div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('order-of-operations', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {problems.map((p, i) => (<li key={i}>{p.expr} = {p.answer}</li>))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('powers-of-10') && (() => {
          const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`);
          function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }
          const problems = Array.from({length: 8}, () => {
            const num = nextInt(1, 9);
            const power = nextInt(1, 3);
            return { num, power, result: num * Math.pow(10, power) };
          });
          return (
            <WorksheetSectionWrapper docId="powers-of-10" title="Powers of 10" emoji="🔢" description="Multiply or divide each number by a power of 10.">
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-2 gap-4">
                {problems.map((p, i) => (
                  <div key={i} className="border border-slate-300 rounded-lg p-4 bg-white">
                    <div className="text-center text-xl font-mono">
                      {p.num} × 10<sup>{p.power}</sup> = ____
                    </div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('powers-of-10', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {problems.map((p, i) => (<li key={i}>{p.num} × 10<sup>{p.power}</sup> = {p.result}</li>))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('rounding-decimals') && (() => {
          const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`);
          function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }
          const problems = Array.from({length: 8}, () => {
            const num = (nextInt(100, 999) / 100).toFixed(2);
            const place = ['whole', 'tenth', 'hundredth'][nextInt(0, 2)];
            let rounded;
            if (place === 'whole') rounded = Math.round(parseFloat(num));
            else if (place === 'tenth') rounded = Math.round(parseFloat(num) * 10) / 10;
            else rounded = parseFloat(num);
            return { num, place, rounded };
          });
          return (
            <WorksheetSectionWrapper docId="rounding-decimals" title="Rounding Decimals" emoji="🔢" description="Round each decimal to the specified place value.">
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-2 gap-4">
                {problems.map((p, i) => (
                  <div key={i} className="border border-slate-300 rounded-lg p-4 bg-white">
                    <div className="text-center text-xl font-mono mb-2">{p.num}</div>
                    <div className="text-center text-sm text-slate-600">Round to nearest {p.place}: ____</div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('rounding-decimals', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {problems.map((p, i) => (<li key={i}>{p.num} rounded to {p.place} = {p.rounded}</li>))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('estimating-sums-differences') && (() => {
          const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`);
          function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }
          const problems = Array.from({length: 6}, () => {
            const a = nextInt(100, 999);
            const b = nextInt(100, 999);
            const op = nextInt(0, 1) === 0 ? '+' : '-';
            const estimate = op === '+' ? Math.round(a/10)*10 + Math.round(b/10)*10 : Math.round(a/10)*10 - Math.round(b/10)*10;
            return { a, b, op, estimate };
          });
          return (
            <WorksheetSectionWrapper docId="estimating-sums-differences" title="Estimating Sums & Differences" emoji="🔢" description="Estimate each sum or difference by rounding to the nearest ten.">
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-2 gap-4">
                {problems.map((p, i) => (
                  <div key={i} className="border border-slate-300 rounded-lg p-4 bg-white">
                    <div className="text-center text-xl font-mono">
                      {p.a} {p.op} {p.b} ≈ ____
                    </div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('estimating-sums-differences', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {problems.map((p, i) => (<li key={i}>{p.a} {p.op} {p.b} ≈ {p.estimate}</li>))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('area-perimeter-4th') && (() => {
          const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`);
          function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }
          const problems = Array.from({length: 6}, () => {
            const length = nextInt(5, 15);
            const width = nextInt(3, 10);
            return { length, width, area: length * width, perimeter: 2 * (length + width) };
          });
          return (
            <WorksheetSectionWrapper docId="area-perimeter-4th" title="Area & Perimeter" emoji="📐" description="Find the area and perimeter of each rectangle.">
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-2 gap-4">
                {problems.map((p, i) => (
                  <div key={i} className="border border-slate-300 rounded-lg p-4 bg-white">
                    <div className="text-center mb-2">Length: {p.length} units, Width: {p.width} units</div>
                    <div className="text-center text-sm text-slate-600">Area: ____ Perimeter: ____</div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('area-perimeter-4th', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {problems.map((p, i) => (<li key={i}>Area = {p.area} sq units, Perimeter = {p.perimeter} units</li>))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('area-triangles-parallelograms') && (() => {
          const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`);
          function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }
          const problems = Array.from({length: 6}, () => {
            const base = nextInt(4, 12);
            const height = nextInt(3, 10);
            return { base, height, area: (base * height) / 2 };
          });
          return (
            <WorksheetSectionWrapper docId="area-triangles-parallelograms" title="Area of Triangles & Parallelograms" emoji="📐" description="Find the area using the formula: Area = (base × height) ÷ 2 for triangles.">
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-2 gap-4">
                {problems.map((p, i) => (
                  <div key={i} className="border border-slate-300 rounded-lg p-4 bg-white">
                    <div className="text-center mb-2">Base: {p.base} units, Height: {p.height} units</div>
                    <div className="text-center text-sm text-slate-600">Area: ____</div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('area-triangles-parallelograms', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {problems.map((p, i) => (<li key={i}>Area = {p.area} sq units</li>))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('volume-rectangular-prisms') && (() => {
          const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`);
          function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }
          const problems = Array.from({length: 6}, () => {
            const length = nextInt(3, 8);
            const width = nextInt(3, 8);
            const height = nextInt(3, 8);
            return { length, width, height, volume: length * width * height };
          });
          return (
            <WorksheetSectionWrapper docId="volume-rectangular-prisms" title="Volume of Rectangular Prisms" emoji="📐" description="Find the volume using V = l × w × h.">
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-2 gap-4">
                {problems.map((p, i) => (
                  <div key={i} className="border border-slate-300 rounded-lg p-4 bg-white">
                    <div className="text-center mb-2">L: {p.length}, W: {p.width}, H: {p.height}</div>
                    <div className="text-center text-sm text-slate-600">Volume: ____</div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('volume-rectangular-prisms', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {problems.map((p, i) => (<li key={i}>Volume = {p.volume} cubic units</li>))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('classifying-angles') && (() => {
          const angles = [
            { measure: 45, type: 'acute' },
            { measure: 90, type: 'right' },
            { measure: 120, type: 'obtuse' },
            { measure: 30, type: 'acute' },
            { measure: 100, type: 'obtuse' },
            { measure: 180, type: 'straight' },
          ];
          return (
            <WorksheetSectionWrapper docId="classifying-angles" title="Classifying Angles" emoji="📐" description="Classify each angle as acute, right, obtuse, or straight.">
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-2 gap-4">
                {angles.map((a, i) => (
                  <div key={i} className="border border-slate-300 rounded-lg p-4 bg-white">
                    <div className="text-center text-xl font-bold mb-2">{a.measure}°</div>
                    <div className="text-center text-sm text-slate-600">Type: ____</div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('classifying-angles', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {angles.map((a, i) => (<li key={i}>{a.measure}° = {a.type}</li>))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('classifying-triangles') && (() => {
          const triangles = [
            { sides: [3, 3, 3], type: 'equilateral' },
            { sides: [5, 5, 6], type: 'isosceles' },
            { sides: [3, 4, 5], type: 'scalene' },
            { sides: [4, 4, 4], type: 'equilateral' },
            { sides: [6, 6, 8], type: 'isosceles' },
            { sides: [5, 7, 9], type: 'scalene' },
          ];
          return (
            <WorksheetSectionWrapper docId="classifying-triangles" title="Classifying Triangles" emoji="📐" description="Classify each triangle by its sides.">
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-2 gap-4">
                {triangles.map((t, i) => (
                  <div key={i} className="border border-slate-300 rounded-lg p-4 bg-white">
                    <div className="text-center mb-2">Sides: {t.sides.join(', ')}</div>
                    <div className="text-center text-sm text-slate-600">Type: ____</div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('classifying-triangles', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {triangles.map((t, i) => (<li key={i}>{t.sides.join(', ')} = {t.type}</li>))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('classifying-quadrilaterals') && (() => {
          const shapes = ['square', 'rectangle', 'parallelogram', 'trapezoid', 'rhombus', 'quadrilateral'];
          return (
            <WorksheetSectionWrapper docId="classifying-quadrilaterals" title="Classifying Quadrilaterals" emoji="📐" description="Identify each quadrilateral.">
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-2 gap-4">
                {shapes.map((s, i) => (
                  <div key={i} className="border border-slate-300 rounded-lg p-4 bg-white">
                    <div className="text-center mb-2 font-semibold">{s}</div>
                    <div className="text-center text-sm text-slate-600">Draw and label: ____</div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('classifying-quadrilaterals', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {shapes.map((s, i) => (<li key={i}>{s}: 4-sided polygon with specific properties</li>))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('classifying-shapes') && (() => {
          const shapes = ['triangle', 'square', 'rectangle', 'pentagon', 'hexagon', 'octagon'];
          return (
            <WorksheetSectionWrapper docId="classifying-shapes" title="Classifying 2D & 3D Shapes" emoji="📐" description="Identify and classify each shape.">
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-2 gap-4">
                {shapes.map((s, i) => (
                  <div key={i} className="border border-slate-300 rounded-lg p-4 bg-white">
                    <div className="text-center mb-2 font-semibold">{s}</div>
                    <div className="text-center text-sm text-slate-600">Sides: ____</div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('classifying-shapes', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {shapes.map((s, i) => {
                      const sides = { triangle: 3, square: 4, rectangle: 4, pentagon: 5, hexagon: 6, octagon: 8 }[s];
                      return <li key={i}>{s}: {sides} sides</li>;
                    })}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('customary-conversion') && (() => {
          const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`);
          function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }
          const problems = Array.from({length: 6}, () => {
            const feet = nextInt(1, 10);
            return { feet, inches: feet * 12 };
          });
          return (
            <WorksheetSectionWrapper docId="customary-conversion" title="Customary Units Conversion" emoji="📏" description="Convert between inches, feet, and yards.">
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-2 gap-4">
                {problems.map((p, i) => (
                  <div key={i} className="border border-slate-300 rounded-lg p-4 bg-white">
                    <div className="text-center mb-2">{p.feet} feet = ____ inches</div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('customary-conversion', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {problems.map((p, i) => (<li key={i}>{p.feet} feet = {p.inches} inches</li>))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('metric-conversion') && (() => {
          const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`);
          function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }
          const problems = Array.from({length: 6}, () => {
            const meters = nextInt(1, 10);
            return { meters, centimeters: meters * 100 };
          });
          return (
            <WorksheetSectionWrapper docId="metric-conversion" title="Metric Units Conversion" emoji="📏" description="Convert between millimeters, centimeters, meters, and kilometers.">
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-2 gap-4">
                {problems.map((p, i) => (
                  <div key={i} className="border border-slate-300 rounded-lg p-4 bg-white">
                    <div className="text-center mb-2">{p.meters} meters = ____ centimeters</div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('metric-conversion', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {problems.map((p, i) => (<li key={i}>{p.meters} meters = {p.centimeters} centimeters</li>))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('elapsed-time-4th') && (() => {
          const times = [
            { start: '8:00', end: '9:30', elapsed: '1 hour 30 minutes' },
            { start: '2:15', end: '3:45', elapsed: '1 hour 30 minutes' },
            { start: '10:00', end: '11:15', elapsed: '1 hour 15 minutes' },
            { start: '1:30', end: '2:45', elapsed: '1 hour 15 minutes' },
            { start: '9:00', end: '10:30', elapsed: '1 hour 30 minutes' },
            { start: '3:20', end: '4:50', elapsed: '1 hour 30 minutes' },
          ];
          return (
            <WorksheetSectionWrapper docId="elapsed-time-4th" title="Elapsed Time" emoji="🕒" description="Calculate the elapsed time between start and end times.">
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-2 gap-4">
                {times.map((t, i) => (
                  <div key={i} className="border border-slate-300 rounded-lg p-4 bg-white">
                    <div className="text-center mb-2">Start: {t.start}, End: {t.end}</div>
                    <div className="text-center text-sm text-slate-600">Elapsed: ____</div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('elapsed-time-4th', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {times.map((t, i) => (<li key={i}>{t.start} to {t.end} = {t.elapsed}</li>))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('liquid-measurement-4th') && (() => {
          const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`);
          function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }
          const problems = Array.from({length: 6}, () => {
            const quarts = nextInt(1, 5);
            return { quarts, cups: quarts * 4 };
          });
          return (
            <WorksheetSectionWrapper docId="liquid-measurement-4th" title="Liquid Measurement" emoji="📏" description="Convert between cups, pints, quarts, and gallons.">
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-2 gap-4">
                {problems.map((p, i) => (
                  <div key={i} className="border border-slate-300 rounded-lg p-4 bg-white">
                    <div className="text-center mb-2">{p.quarts} quarts = ____ cups</div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('liquid-measurement-4th', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {problems.map((p, i) => (<li key={i}>{p.quarts} quarts = {p.cups} cups</li>))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('mass-weight-4th') && (() => {
          const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`);
          function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }
          const problems = Array.from({length: 6}, () => {
            const pounds = nextInt(1, 5);
            return { pounds, ounces: pounds * 16 };
          });
          return (
            <WorksheetSectionWrapper docId="mass-weight-4th" title="Mass and Weight" emoji="📏" description="Convert between ounces, pounds, grams, and kilograms.">
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-2 gap-4">
                {problems.map((p, i) => (
                  <div key={i} className="border border-slate-300 rounded-lg p-4 bg-white">
                    <div className="text-center mb-2">{p.pounds} pounds = ____ ounces</div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('mass-weight-4th', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {problems.map((p, i) => (<li key={i}>{p.pounds} pounds = {p.ounces} ounces</li>))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('lines-angles-4th') && (() => {
          const lines = [
            { type: 'parallel', desc: 'Two lines that never meet' },
            { type: 'perpendicular', desc: 'Two lines that meet at 90°' },
            { type: 'intersecting', desc: 'Two lines that cross' },
            { type: 'parallel', desc: 'Lines that stay the same distance apart' },
            { type: 'perpendicular', desc: 'Lines that form right angles' },
            { type: 'intersecting', desc: 'Lines that share a point' },
          ];
          return (
            <WorksheetSectionWrapper docId="lines-angles-4th" title="Lines & Angles" emoji="📐" description="Identify parallel, perpendicular, and intersecting lines.">
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-2 gap-4">
                {lines.map((l, i) => (
                  <div key={i} className="border border-slate-300 rounded-lg p-4 bg-white">
                    <div className="text-center mb-2 text-sm">{l.desc}</div>
                    <div className="text-center text-sm text-slate-600">Type: ____</div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('lines-angles-4th', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {lines.map((l, i) => (<li key={i}>{l.desc} = {l.type}</li>))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('symmetry-transformations') && (() => {
          const shapes = ['square', 'circle', 'rectangle', 'triangle', 'hexagon', 'star'];
          return (
            <WorksheetSectionWrapper docId="symmetry-transformations" title="Symmetry & Transformations" emoji="📐" description="Find lines of symmetry and identify transformations.">
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-2 gap-4">
                {shapes.map((s, i) => (
                  <div key={i} className="border border-slate-300 rounded-lg p-4 bg-white">
                    <div className="text-center mb-2 font-semibold">{s}</div>
                    <div className="text-center text-sm text-slate-600">Lines of symmetry: ____</div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('symmetry-transformations', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {shapes.map((s, i) => {
                      const lines = { square: 4, circle: 'infinite', rectangle: 2, triangle: 3, hexagon: 6, star: 5 }[s];
                      return <li key={i}>{s}: {lines} lines of symmetry</li>;
                    })}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('transformations-5th') && (() => {
          const transformations = ['translation', 'rotation', 'reflection', 'translation', 'rotation', 'reflection'];
          return (
            <WorksheetSectionWrapper docId="transformations-5th" title="Transformations" emoji="📐" description="Identify translations, rotations, and reflections.">
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-2 gap-4">
                {transformations.map((t, i) => (
                  <div key={i} className="border border-slate-300 rounded-lg p-4 bg-white">
                    <div className="text-center mb-2 font-semibold">{t}</div>
                    <div className="text-center text-sm text-slate-600">Draw example: ____</div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('transformations-5th', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {transformations.map((t, i) => (<li key={i}>{t}: slide, turn, or flip</li>))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('nets-3d-shapes') && (() => {
          const shapes = ['cube', 'rectangular prism', 'cylinder', 'cone', 'pyramid', 'sphere'];
          return (
            <WorksheetSectionWrapper docId="nets-3d-shapes" title="Nets of 3D Shapes" emoji="📐" description="Identify which net forms each 3D shape.">
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-2 gap-4">
                {shapes.map((s, i) => (
                  <div key={i} className="border border-slate-300 rounded-lg p-4 bg-white">
                    <div className="text-center mb-2 font-semibold">{s}</div>
                    <div className="text-center text-sm text-slate-600">Draw net: ____</div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('nets-3d-shapes', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {shapes.map((s, i) => (<li key={i}>{s}: flat pattern that folds into the shape</li>))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('evaluating-expressions') && (() => {
          const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`);
          function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }
          const problems = Array.from({length: 6}, () => {
            const x = nextInt(2, 10);
            const a = nextInt(1, 5);
            const b = nextInt(1, 5);
            return { expr: `${a}x + ${b}`, x, answer: a * x + b };
          });
          return (
            <WorksheetSectionWrapper docId="evaluating-expressions" title="Evaluating Expressions" emoji="📐" description="Substitute the value for x and evaluate each expression.">
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-2 gap-4">
                {problems.map((p, i) => (
                  <div key={i} className="border border-slate-300 rounded-lg p-4 bg-white">
                    <div className="text-center mb-2 font-mono">{p.expr} when x = {p.x}</div>
                    <div className="text-center text-sm text-slate-600">Answer: ____</div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('evaluating-expressions', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {problems.map((p, i) => (<li key={i}>{p.expr} when x = {p.x} = {p.answer}</li>))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('writing-expressions') && (() => {
          const phrases = [
            { phrase: '5 more than x', expr: 'x + 5' },
            { phrase: '3 times x', expr: '3x' },
            { phrase: 'x minus 2', expr: 'x - 2' },
            { phrase: 'x divided by 4', expr: 'x ÷ 4' },
            { phrase: '2 less than x', expr: 'x - 2' },
            { phrase: 'x plus 7', expr: 'x + 7' },
          ];
          return (
            <WorksheetSectionWrapper docId="writing-expressions" title="Writing Expressions" emoji="📐" description="Write an algebraic expression for each phrase.">
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-2 gap-4">
                {phrases.map((p, i) => (
                  <div key={i} className="border border-slate-300 rounded-lg p-4 bg-white">
                    <div className="text-center mb-2">{p.phrase}</div>
                    <div className="text-center text-sm text-slate-600">Expression: ____</div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('writing-expressions', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {phrases.map((p, i) => (<li key={i}>{p.phrase} = {p.expr}</li>))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('solving-one-step-equations') && (() => {
          const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`);
          function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }
          const problems = Array.from({length: 6}, () => {
            const x = nextInt(5, 20);
            const a = nextInt(3, 15);
            const op = nextInt(0, 1) === 0 ? '+' : '-';
            const b = op === '+' ? x - a : x + a;
            return { a, b, op, x };
          });
          return (
            <WorksheetSectionWrapper docId="solving-one-step-equations" title="Solving One-Step Equations" emoji="📐" description="Solve for x in each equation.">
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-2 gap-4">
                {problems.map((p, i) => (
                  <div key={i} className="border border-slate-300 rounded-lg p-4 bg-white">
                    <div className="text-center mb-2 font-mono">x {p.op} {p.a} = {p.b}</div>
                    <div className="text-center text-sm text-slate-600">x = ____</div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('solving-one-step-equations', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {problems.map((p, i) => (<li key={i}>x {p.op} {p.a} = {p.b}, so x = {p.x}</li>))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('patterns-rules') && (() => {
          const patterns = [
            { seq: [2, 4, 6, 8, '__', 12], rule: 'Add 2' },
            { seq: [5, 10, 15, 20, '__', 30], rule: 'Add 5' },
            { seq: [1, 4, 9, 16, '__', 36], rule: 'Square numbers' },
            { seq: [3, 6, 9, 12, '__', 18], rule: 'Add 3' },
            { seq: [10, 20, 30, 40, '__', 60], rule: 'Add 10' },
            { seq: [1, 3, 5, 7, '__', 11], rule: 'Add 2 (odd numbers)' },
          ];
          return (
            <WorksheetSectionWrapper docId="patterns-rules" title="Patterns & Rules" emoji="📐" description="Find the missing number and write the rule.">
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-2 gap-4">
                {patterns.map((p, i) => (
                  <div key={i} className="border border-slate-300 rounded-lg p-4 bg-white">
                    <div className="text-center mb-2 font-mono">{p.seq.join(', ')}</div>
                    <div className="text-center text-sm text-slate-600">Rule: ____</div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('patterns-rules', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {patterns.map((p, i) => (<li key={i}>{p.seq.join(', ')}: Rule = {p.rule}</li>))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('coordinate-graphing') && (() => {
          const points = [
            { x: 2, y: 3 },
            { x: 4, y: 5 },
            { x: 1, y: 2 },
            { x: 5, y: 1 },
            { x: 3, y: 4 },
            { x: 6, y: 2 },
          ];
          return (
            <WorksheetSectionWrapper docId="coordinate-graphing" title="Coordinate Graphing" emoji="📐" description="Plot each point on the coordinate plane.">
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-2 gap-4">
                {points.map((p, i) => (
                  <div key={i} className="border border-slate-300 rounded-lg p-4 bg-white">
                    <div className="text-center mb-2 font-mono">({p.x}, {p.y})</div>
                    <div className="text-center text-sm text-slate-600">Plot on grid: ____</div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('coordinate-graphing', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {points.map((p, i) => (<li key={i}>({p.x}, {p.y}): Move right {p.x}, up {p.y}</li>))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('comparing-ordering-fractions-decimals') && (() => {
          const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`);
          function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }
          const problems = Array.from({length: 6}, () => {
            const frac = `${nextInt(1, 3)}/${nextInt(2, 4)}`;
            const decimal = (nextInt(1, 9) / 10).toFixed(1);
            return { frac, decimal };
          });
          return (
            <WorksheetSectionWrapper docId="comparing-ordering-fractions-decimals" title="Comparing & Ordering Fractions/Decimals" emoji="🍕" description="Compare each fraction and decimal using >, <, or =.">
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-2 gap-4">
                {problems.map((p, i) => (
                  <div key={i} className="border border-slate-300 rounded-lg p-4 bg-white">
                    <div className="text-center text-xl font-bold">{p.frac} ____ {p.decimal}</div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('comparing-ordering-fractions-decimals', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {problems.map((p, i) => {
                      const [num, den] = p.frac.split('/').map(Number);
                      const val = num / den;
                      const symbol = val > parseFloat(p.decimal) ? '>' : val < parseFloat(p.decimal) ? '<' : '=';
                      return <li key={i}>{p.frac} {symbol} {p.decimal}</li>;
                    })}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('fractions-decimals-percents') && (() => {
          const conversions = [
            { frac: '1/2', decimal: '0.50', percent: '50%' },
            { frac: '1/4', decimal: '0.25', percent: '25%' },
            { frac: '3/4', decimal: '0.75', percent: '75%' },
            { frac: '1/10', decimal: '0.10', percent: '10%' },
            { frac: '1/5', decimal: '0.20', percent: '20%' },
            { frac: '1/3', decimal: '0.33', percent: '33%' },
          ];
          return (
            <WorksheetSectionWrapper docId="fractions-decimals-percents" title="Fractions, Decimals, & Percents" emoji="🍕" description="Convert between fractions, decimals, and percents.">
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-2 gap-4">
                {conversions.map((c, i) => (
                  <div key={i} className="border border-slate-300 rounded-lg p-4 bg-white">
                    <div className="text-center mb-2 font-bold">{c.frac}</div>
                    <div className="text-center text-sm text-slate-600">Decimal: ____ Percent: ____</div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('fractions-decimals-percents', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {conversions.map((c, i) => (<li key={i}>{c.frac} = {c.decimal} = {c.percent}</li>))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('line-plots') && (() => {
          const data = [3, 4, 4, 5, 5, 5, 6, 6, 7];
          return (
            <WorksheetSectionWrapper docId="line-plots" title="Line Plots" emoji="📊" description="Create a line plot from the data and answer questions.">
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="space-y-4">
                <div className="border border-slate-300 rounded-lg p-4 bg-white">
                  <div className="mb-2 font-semibold">Data: {data.join(', ')}</div>
                  <div className="text-sm text-slate-600">Create line plot and find: Mode = ____, Range = ____</div>
                </div>
              </div>
              {showAnswersForDoc('line-plots', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    <li>Mode = 5 (appears most often)</li>
                    <li>Range = 4 (7 - 3)</li>
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('bar-graphs-pictographs') && (() => {
          const data = [
            { item: 'Apples', count: 8 },
            { item: 'Bananas', count: 6 },
            { item: 'Oranges', count: 4 },
            { item: 'Grapes', count: 10 },
          ];
          return (
            <WorksheetSectionWrapper docId="bar-graphs-pictographs" title="Bar Graphs & Pictographs" emoji="📊" description="Create a bar graph from the data.">
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="space-y-4">
                <div className="border border-slate-300 rounded-lg p-4 bg-white">
                  <div className="mb-2 font-semibold">Fruit Sales</div>
                  {data.map((d, i) => (
                    <div key={i} className="text-sm mb-1">{d.item}: {d.count}</div>
                  ))}
                  <div className="text-sm text-slate-600 mt-2">Create bar graph: ____</div>
                </div>
              </div>
              {showAnswersForDoc('bar-graphs-pictographs', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {data.map((d, i) => (<li key={i}>{d.item}: {d.count} units on bar graph</li>))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('line-graphs') && (() => {
          const data = [
            { day: 'Mon', temp: 70 },
            { day: 'Tue', temp: 72 },
            { day: 'Wed', temp: 75 },
            { day: 'Thu', temp: 73 },
            { day: 'Fri', temp: 76 },
          ];
          return (
            <WorksheetSectionWrapper docId="line-graphs" title="Line Graphs" emoji="📊" description="Create a line graph showing temperature over time.">
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="space-y-4">
                <div className="border border-slate-300 rounded-lg p-4 bg-white">
                  <div className="mb-2 font-semibold">Daily Temperature</div>
                  {data.map((d, i) => (
                    <div key={i} className="text-sm mb-1">{d.day}: {d.temp}°F</div>
                  ))}
                  <div className="text-sm text-slate-600 mt-2">Create line graph: ____</div>
                </div>
              </div>
              {showAnswersForDoc('line-graphs', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {data.map((d, i) => (<li key={i}>{d.day}: Plot point at {d.temp}°F</li>))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('mean-median-mode') && (() => {
          const datasets = [
            { data: [3, 5, 7, 9, 11], mean: 7, median: 7, mode: 'none' },
            { data: [2, 4, 4, 6, 8], mean: 4.8, median: 4, mode: 4 },
            { data: [1, 3, 5, 5, 7, 9], mean: 5, median: 5, mode: 5 },
          ];
          return (
            <WorksheetSectionWrapper docId="mean-median-mode" title="Mean, Median, Mode" emoji="📊" description="Calculate mean, median, and mode for each dataset.">
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="space-y-4">
                {datasets.map((d, i) => (
                  <div key={i} className="border border-slate-300 rounded-lg p-4 bg-white">
                    <div className="mb-2 font-semibold">Data: {d.data.join(', ')}</div>
                    <div className="text-sm text-slate-600">Mean: ____ Median: ____ Mode: ____</div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('mean-median-mode', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {datasets.map((d, i) => (<li key={i}>Mean = {d.mean}, Median = {d.median}, Mode = {d.mode}</li>))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('mean-median-mode-range') && (() => {
          const datasets = [
            { data: [5, 8, 10, 12, 15], mean: 10, median: 10, mode: 'none', range: 10 },
            { data: [3, 6, 6, 9, 12], mean: 7.2, median: 6, mode: 6, range: 9 },
          ];
          return (
            <WorksheetSectionWrapper docId="mean-median-mode-range" title="Mean, Median, Mode, Range" emoji="📊" description="Calculate all four measures for each dataset.">
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="space-y-4">
                {datasets.map((d, i) => (
                  <div key={i} className="border border-slate-300 rounded-lg p-4 bg-white">
                    <div className="mb-2 font-semibold">Data: {d.data.join(', ')}</div>
                    <div className="text-sm text-slate-600">Mean: ____ Median: ____ Mode: ____ Range: ____</div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('mean-median-mode-range', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {datasets.map((d, i) => (<li key={i}>Mean = {d.mean}, Median = {d.median}, Mode = {d.mode}, Range = {d.range}</li>))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('stem-leaf-plots') && (() => {
          const data = [12, 15, 18, 21, 23, 25, 28, 31, 34];
          return (
            <WorksheetSectionWrapper docId="stem-leaf-plots" title="Stem-and-Leaf Plots" emoji="📊" description="Create a stem-and-leaf plot from the data.">
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="space-y-4">
                <div className="border border-slate-300 rounded-lg p-4 bg-white">
                  <div className="mb-2 font-semibold">Data: {data.join(', ')}</div>
                  <div className="text-sm text-slate-600">Create stem-and-leaf plot: ____</div>
                </div>
              </div>
              {showAnswersForDoc('stem-leaf-plots', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    <li>Stem 1: 2, 5, 8</li>
                    <li>Stem 2: 1, 3, 5, 8</li>
                    <li>Stem 3: 1, 4</li>
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('probability') && (() => {
          const scenarios = [
            { event: 'Rolling a 6 on a die', prob: '1/6' },
            { event: 'Flipping heads on a coin', prob: '1/2' },
            { event: 'Picking a red marble from 4 red, 2 blue', prob: '4/6 = 2/3' },
            { event: 'Rolling an even number on a die', prob: '3/6 = 1/2' },
            { event: 'Picking a blue marble from 3 red, 5 blue', prob: '5/8' },
            { event: 'Flipping tails on a coin', prob: '1/2' },
          ];
          return (
            <WorksheetSectionWrapper docId="probability" title="Probability" emoji="📊" description="Find the probability of each event.">
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-2 gap-4">
                {scenarios.map((s, i) => (
                  <div key={i} className="border border-slate-300 rounded-lg p-4 bg-white">
                    <div className="text-center mb-2 text-sm">{s.event}</div>
                    <div className="text-center text-sm text-slate-600">Probability: ____</div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('probability', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {scenarios.map((s, i) => (<li key={i}>{s.event} = {s.prob}</li>))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('multi-step-word-4th') && (() => {
          const problems = [
            'Emma has 24 stickers. She gives away 8 stickers. Then she buys 12 more. How many stickers does she have now?',
            'A store has 45 apples. They sell 15 apples in the morning and 18 apples in the afternoon. How many apples are left?',
            'Jake reads 3 books. Each book has 8 chapters. How many chapters did he read in all?',
            'There are 5 boxes. Each box has 6 toys. If 8 toys are broken, how many toys are still good?',
            'Sarah saves $5 each week for 4 weeks. Then she spends $12. How much money does she have left?',
            'A classroom has 30 students. 12 students are boys. How many students are girls?',
          ];
          return (
            <WorksheetSectionWrapper docId="multi-step-word-4th" title="Multi-Step Word Problems" emoji="🧮" description="Solve each word problem. Show all your work.">
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <ol className="list-decimal list-inside space-y-4 text-sm text-slate-800">
                {problems.map((p, i) => (
                  <li key={i} className="border border-slate-300 rounded-lg p-4 bg-white">
                    {p}
                    <div className="h-12 border-b border-slate-400 mt-2" />
                  </li>
                ))}
              </ol>
              {showAnswersForDoc('multi-step-word-4th', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ol className="list-decimal list-inside space-y-0.5">
                    <li>24 - 8 + 12 = 28 stickers</li>
                    <li>45 - 15 - 18 = 12 apples</li>
                    <li>3 × 8 = 24 chapters</li>
                    <li>5 × 6 - 8 = 22 toys</li>
                    <li>5 × 4 - 12 = $8</li>
                    <li>30 - 12 = 18 girls</li>
                  </ol>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('multi-step-word-5th') && (() => {
          const problems = [
            'A store has 120 items. They sell 35 items on Monday and 42 items on Tuesday. On Wednesday, they receive 50 new items. How many items are in the store now?',
            'Emma earns $8 per hour. She works 5 hours on Saturday and 4 hours on Sunday. How much money does she earn?',
            'A rectangle has a length of 12 cm and width of 8 cm. What is the area and perimeter?',
            'Jake has 3/4 of a pizza. He eats 1/4 of it. How much pizza is left?',
            'A train travels 240 miles in 4 hours. How many miles does it travel per hour?',
            'There are 48 students. 1/3 are in the band and 1/4 are in the choir. How many students are in neither?',
          ];
          return (
            <WorksheetSectionWrapper docId="multi-step-word-5th" title="Multi-Step Word Problems" emoji="🧮" description="Solve each complex word problem. Show all your work.">
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <ol className="list-decimal list-inside space-y-4 text-sm text-slate-800">
                {problems.map((p, i) => (
                  <li key={i} className="border border-slate-300 rounded-lg p-4 bg-white">
                    {p}
                    <div className="h-12 border-b border-slate-400 mt-2" />
                  </li>
                ))}
              </ol>
              {showAnswersForDoc('multi-step-word-5th', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ol className="list-decimal list-inside space-y-0.5">
                    <li>120 - 35 - 42 + 50 = 93 items</li>
                    <li>8 × (5 + 4) = $72</li>
                    <li>Area = 96 sq cm, Perimeter = 40 cm</li>
                    <li>3/4 - 1/4 = 1/2 pizza</li>
                    <li>240 ÷ 4 = 60 miles per hour</li>
                    <li>48 - 16 - 12 = 20 students</li>
                  </ol>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('fraction-word-problems') && (() => {
          const problems = [
            'Emma ate 1/4 of a pizza. Jake ate 1/3 of the same pizza. How much pizza did they eat together?',
            'A recipe calls for 3/4 cup of flour. Sarah has 1/2 cup. How much more does she need?',
            'There are 24 students. 1/3 are wearing red shirts. How many students are wearing red?',
            'A rope is 12 feet long. Tom cuts off 1/4 of it. How long is the remaining rope?',
            'Lisa has 2/3 of a dollar. How much money does she have?',
            'A pie is cut into 8 equal pieces. 3 pieces are eaten. What fraction of the pie remains?',
          ];
          return (
            <WorksheetSectionWrapper docId="fraction-word-problems" title="Fraction Word Problems" emoji="🧮" description="Solve each word problem involving fractions.">
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <ol className="list-decimal list-inside space-y-4 text-sm text-slate-800">
                {problems.map((p, i) => (
                  <li key={i} className="border border-slate-300 rounded-lg p-4 bg-white">
                    {p}
                    <div className="h-12 border-b border-slate-400 mt-2" />
                  </li>
                ))}
              </ol>
              {showAnswersForDoc('fraction-word-problems', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ol className="list-decimal list-inside space-y-0.5">
                    <li>1/4 + 1/3 = 7/12</li>
                    <li>3/4 - 1/2 = 1/4 cup</li>
                    <li>24 × 1/3 = 8 students</li>
                    <li>12 - 3 = 9 feet</li>
                    <li>2/3 of $1 = $0.67</li>
                    <li>8 - 3 = 5 pieces, so 5/8 remains</li>
                  </ol>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('fraction-word-problems-5th') && (() => {
          const problems = [
            'A recipe needs 2/3 cup of sugar. Sarah wants to make 3 batches. How much sugar does she need?',
            'Tom has 5/6 of a pizza. He gives away 1/3 of it. How much pizza does he have left?',
            'A ribbon is 12 feet long. Lisa cuts it into pieces that are 3/4 feet each. How many pieces can she make?',
            'Emma bakes 24 cookies. She gives 1/4 to her friends and eats 1/6 of the rest. How many cookies does she have left?',
            'A tank holds 60 gallons. It is 2/3 full. How many gallons are in the tank?',
            'Jake runs 3/4 of a mile each day for 5 days. How many miles does he run in total?',
          ];
          return (
            <WorksheetSectionWrapper docId="fraction-word-problems-5th" title="Fraction Word Problems" emoji="🧮" description="Solve each word problem involving fraction operations.">
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <ol className="list-decimal list-inside space-y-4 text-sm text-slate-800">
                {problems.map((p, i) => (
                  <li key={i} className="border border-slate-300 rounded-lg p-4 bg-white">
                    {p}
                    <div className="h-12 border-b border-slate-400 mt-2" />
                  </li>
                ))}
              </ol>
              {showAnswersForDoc('fraction-word-problems-5th', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ol className="list-decimal list-inside space-y-0.5">
                    <li>2/3 × 3 = 2 cups</li>
                    <li>5/6 - 1/3 = 1/2 pizza</li>
                    <li>12 ÷ 3/4 = 16 pieces</li>
                    <li>24 - 6 - 3 = 15 cookies</li>
                    <li>60 × 2/3 = 40 gallons</li>
                    <li>3/4 × 5 = 3.75 miles</li>
                  </ol>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('decimal-word-problems') && (() => {
          const problems = [
            'Emma buys a book for $12.50 and a pen for $3.75. How much does she spend in total?',
            'A rope is 8.5 meters long. Tom cuts off 2.3 meters. How long is the remaining rope?',
            'Sarah runs 3.2 miles on Monday and 4.5 miles on Tuesday. How many miles did she run in total?',
            'A store sells apples for $1.25 per pound. Jake buys 3.5 pounds. How much does he pay?',
            'A tank holds 15.8 gallons. It already has 6.4 gallons. How much more can it hold?',
            'Lisa has $20.00. She spends $8.75. How much money does she have left?',
          ];
          return (
            <WorksheetSectionWrapper docId="decimal-word-problems" title="Decimal Word Problems" emoji="🧮" description="Solve each word problem involving decimals.">
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <ol className="list-decimal list-inside space-y-4 text-sm text-slate-800">
                {problems.map((p, i) => (
                  <li key={i} className="border border-slate-300 rounded-lg p-4 bg-white">
                    {p}
                    <div className="h-12 border-b border-slate-400 mt-2" />
                  </li>
                ))}
              </ol>
              {showAnswersForDoc('decimal-word-problems', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ol className="list-decimal list-inside space-y-0.5">
                    <li>$12.50 + $3.75 = $16.25</li>
                    <li>8.5 - 2.3 = 6.2 meters</li>
                    <li>3.2 + 4.5 = 7.7 miles</li>
                    <li>$1.25 × 3.5 = $4.38</li>
                    <li>15.8 - 6.4 = 9.4 gallons</li>
                    <li>$20.00 - $8.75 = $11.25</li>
                  </ol>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('decimal-word-problems-5th') && (() => {
          const problems = [
            'A store sells shirts for $15.99 each. Jake buys 4 shirts. How much does he pay?',
            'Emma runs 2.5 miles each day for 6 days. How many miles does she run in total?',
            'A recipe calls for 0.75 cups of milk. Sarah wants to make 3 batches. How much milk does she need?',
            'Tom has $50.00. He spends $23.45 on groceries and $12.30 on gas. How much money does he have left?',
            'A rope is 12.8 meters long. Lisa cuts it into 4 equal pieces. How long is each piece?',
            'A tank holds 25.5 gallons. It is 0.6 full. How many gallons are in the tank?',
          ];
          return (
            <WorksheetSectionWrapper docId="decimal-word-problems-5th" title="Decimal Word Problems" emoji="🧮" description="Solve each word problem involving decimal operations.">
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <ol className="list-decimal list-inside space-y-4 text-sm text-slate-800">
                {problems.map((p, i) => (
                  <li key={i} className="border border-slate-300 rounded-lg p-4 bg-white">
                    {p}
                    <div className="h-12 border-b border-slate-400 mt-2" />
                  </li>
                ))}
              </ol>
              {showAnswersForDoc('decimal-word-problems-5th', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ol className="list-decimal list-inside space-y-0.5">
                    <li>$15.99 × 4 = $63.96</li>
                    <li>2.5 × 6 = 15 miles</li>
                    <li>0.75 × 3 = 2.25 cups</li>
                    <li>$50.00 - $23.45 - $12.30 = $14.25</li>
                    <li>12.8 ÷ 4 = 3.2 meters</li>
                    <li>25.5 × 0.6 = 15.3 gallons</li>
                  </ol>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('measurement-word-problems') && (() => {
          const problems = [
            'Emma has a ribbon that is 3 feet long. She needs 18 inches. Does she have enough?',
            'A room is 12 feet long and 8 feet wide. What is the area in square feet?',
            'Tom weighs 85 pounds. His backpack weighs 12 pounds. What is the total weight?',
            'A recipe calls for 2 cups of flour. Sarah only has a 1/2 cup measure. How many times does she need to use it?',
            'A car travels 240 miles in 4 hours. How many miles per hour is it traveling?',
            'A box is 2 feet long, 1.5 feet wide, and 1 foot tall. What is the volume?',
          ];
          return (
            <WorksheetSectionWrapper docId="measurement-word-problems" title="Measurement Word Problems" emoji="🧮" description="Solve each word problem involving measurement and unit conversions.">
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <ol className="list-decimal list-inside space-y-4 text-sm text-slate-800">
                {problems.map((p, i) => (
                  <li key={i} className="border border-slate-300 rounded-lg p-4 bg-white">
                    {p}
                    <div className="h-12 border-b border-slate-400 mt-2" />
                  </li>
                ))}
              </ol>
              {showAnswersForDoc('measurement-word-problems', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ol className="list-decimal list-inside space-y-0.5">
                    <li>3 feet = 36 inches, yes (36 {'>'} 18)</li>
                    <li>12 × 8 = 96 sq feet</li>
                    <li>85 + 12 = 97 pounds</li>
                    <li>2 ÷ 1/2 = 4 times</li>
                    <li>240 ÷ 4 = 60 mph</li>
                    <li>2 × 1.5 × 1 = 3 cubic feet</li>
                  </ol>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('geometry-word-problems') && (() => {
          const problems = [
            'A rectangle has a length of 10 cm and width of 6 cm. What is the area and perimeter?',
            'A square has sides of 8 inches. What is the area and perimeter?',
            'A triangle has a base of 12 cm and height of 5 cm. What is the area?',
            'A rectangular garden is 15 feet long and 10 feet wide. What is the area?',
            'A circle has a radius of 4 cm. What is the diameter?',
            'A rectangular room is 12 feet by 9 feet. How many square feet of carpet are needed?',
          ];
          return (
            <WorksheetSectionWrapper docId="geometry-word-problems" title="Geometry Word Problems" emoji="🧮" description="Solve each word problem involving area, perimeter, and geometry.">
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <ol className="list-decimal list-inside space-y-4 text-sm text-slate-800">
                {problems.map((p, i) => (
                  <li key={i} className="border border-slate-300 rounded-lg p-4 bg-white">
                    {p}
                    <div className="h-12 border-b border-slate-400 mt-2" />
                  </li>
                ))}
              </ol>
              {showAnswersForDoc('geometry-word-problems', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ol className="list-decimal list-inside space-y-0.5">
                    <li>Area = 60 sq cm, Perimeter = 32 cm</li>
                    <li>Area = 64 sq inches, Perimeter = 32 inches</li>
                    <li>Area = 30 sq cm</li>
                    <li>Area = 150 sq feet</li>
                    <li>Diameter = 8 cm</li>
                    <li>Area = 108 sq feet</li>
                  </ol>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('ratio-proportion-word-problems') && (() => {
          const problems = [
            'The ratio of boys to girls in a class is 3:5. If there are 15 boys, how many girls are there?',
            'A recipe uses 2 cups of flour for every 3 cups of sugar. How much flour is needed for 9 cups of sugar?',
            'Tom can read 4 pages in 10 minutes. How many pages can he read in 30 minutes?',
            'The ratio of apples to oranges is 4:3. If there are 12 apples, how many oranges are there?',
            'A car travels 60 miles in 1 hour. How far will it travel in 3 hours?',
            'The ratio of cats to dogs is 2:1. If there are 8 cats, how many dogs are there?',
          ];
          return (
            <WorksheetSectionWrapper docId="ratio-proportion-word-problems" title="Ratio & Proportion Word Problems" emoji="🧮" description="Solve each word problem involving ratios and proportions.">
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <ol className="list-decimal list-inside space-y-4 text-sm text-slate-800">
                {problems.map((p, i) => (
                  <li key={i} className="border border-slate-300 rounded-lg p-4 bg-white">
                    {p}
                    <div className="h-12 border-b border-slate-400 mt-2" />
                  </li>
                ))}
              </ol>
              {showAnswersForDoc('ratio-proportion-word-problems', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ol className="list-decimal list-inside space-y-0.5">
                    <li>3:5 = 15:25, so 25 girls</li>
                    <li>2:3 = 6:9, so 6 cups flour</li>
                    <li>4:10 = 12:30, so 12 pages</li>
                    <li>4:3 = 12:9, so 9 oranges</li>
                    <li>60:1 = 180:3, so 180 miles</li>
                    <li>2:1 = 8:4, so 4 dogs</li>
                  </ol>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('percent-word-problems') && (() => {
          const problems = [
            'A shirt costs $20. It is on sale for 25% off. What is the sale price?',
            'Emma scored 18 out of 20 on a test. What percent did she get?',
            'A store has 80 items. 30% are on sale. How many items are on sale?',
            'Tom saves 15% of his $200 allowance. How much does he save?',
            'A book costs $25. There is a 20% discount. What is the final price?',
            'Sarah got 24 out of 30 questions correct. What percent did she get?',
          ];
          return (
            <WorksheetSectionWrapper docId="percent-word-problems" title="Percent Word Problems" emoji="🧮" description="Solve each word problem involving percents, discounts, and percentages.">
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <ol className="list-decimal list-inside space-y-4 text-sm text-slate-800">
                {problems.map((p, i) => (
                  <li key={i} className="border border-slate-300 rounded-lg p-4 bg-white">
                    {p}
                    <div className="h-12 border-b border-slate-400 mt-2" />
                  </li>
                ))}
              </ol>
              {showAnswersForDoc('percent-word-problems', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ol className="list-decimal list-inside space-y-0.5">
                    <li>$20 × 0.25 = $5 off, so $15</li>
                    <li>18/20 = 90%</li>
                    <li>80 × 0.30 = 24 items</li>
                    <li>$200 × 0.15 = $30</li>
                    <li>$25 × 0.20 = $5 off, so $20</li>
                    <li>24/30 = 80%</li>
                  </ol>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {/* Kindergarten Worksheets - Missing ones */}
        {activeDocs.includes('color-shapes') && (() => {
          const shapeData = [
            { name: 'circle', color: 'red' },
            { name: 'square', color: 'blue' },
            { name: 'triangle', color: 'yellow' },
            { name: 'rectangle', color: 'green' },
            { name: 'oval', color: 'orange' },
            { name: 'diamond', color: 'purple' },
          ];
          const renderShape = (shape: typeof shapeData[0], size: number = 80) => {
            const svgMap: Record<string, JSX.Element> = {
              circle: <circle cx={size/2} cy={size/2} r={size*0.375} fill="none" stroke="#475569" strokeWidth="4" />,
              square: <rect x={size*0.125} y={size*0.125} width={size*0.75} height={size*0.75} fill="none" stroke="#475569" strokeWidth="4" />,
              triangle: <polygon points={`${size/2},${size*0.125} ${size*0.125},${size*0.875} ${size*0.875},${size*0.875}`} fill="none" stroke="#475569" strokeWidth="4" />,
              rectangle: <rect x={size*0.1875} y={size*0.25} width={size*0.625} height={size*0.5} fill="none" stroke="#475569" strokeWidth="4" />,
              oval: <ellipse cx={size/2} cy={size/2} rx={size*0.375} ry={size*0.25} fill="none" stroke="#475569" strokeWidth="4" />,
              diamond: <polygon points={`${size/2},${size*0.125} ${size*0.875},${size/2} ${size/2},${size*0.875} ${size*0.125},${size/2}`} fill="none" stroke="#475569" strokeWidth="4" />,
            };
            return svgMap[shape.name] || null;
          };
          return (
            <WorksheetSectionWrapper docId="color-shapes" title="Color the Shapes" emoji="🟩" description="Color each shape with the correct color shown below.">
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-900">
                <strong>📝 Instructions:</strong> Look at each shape below. Color it with the color shown. Use crayons or colored pencils.
              </div>
              <div className="grid grid-cols-1 gap-6">
                {shapeData.map((shape, i) => (
                  <div key={i} className="border-2 border-slate-300 rounded-lg p-6 bg-white">
                    <div className="text-center mb-4">
                      <div className="text-lg font-semibold text-slate-800 capitalize mb-2">{shape.name}</div>
                      <div className="text-base font-semibold text-slate-600">Color: <span className="text-slate-800 capitalize">{shape.color}</span></div>
                    </div>
                    <div className="flex justify-center">
                      <svg viewBox="0 0 80 80" className="w-64 h-64 print:w-80 print:h-80">
                        {renderShape(shape, 80)}
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('color-shapes', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {shapeData.map((s, i) => (<li key={i}>{s.name}: Color {s.color}</li>))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('shape-sorting') && (() => {
          const shapes = [
            { name: 'circle', color: '#3b82f6' },
            { name: 'square', color: '#ef4444' },
            { name: 'triangle', color: '#22c55e' },
            { name: 'rectangle', color: '#f59e0b' },
          ];
          const renderShape = (shape: typeof shapes[0], size: number = 80) => {
            const svgMap: Record<string, JSX.Element> = {
              circle: <circle cx={size/2} cy={size/2} r={size*0.375} fill="none" stroke={shape.color} strokeWidth="3" />,
              square: <rect x={size*0.125} y={size*0.125} width={size*0.75} height={size*0.75} fill="none" stroke={shape.color} strokeWidth="3" />,
              triangle: <polygon points={`${size/2},${size*0.125} ${size*0.125},${size*0.875} ${size*0.875},${size*0.875}`} fill="none" stroke={shape.color} strokeWidth="3" />,
              rectangle: <rect x={size*0.1875} y={size*0.25} width={size*0.625} height={size*0.5} fill="none" stroke={shape.color} strokeWidth="3" />,
            };
            return svgMap[shape.name] || null;
          };
          return (
            <WorksheetSectionWrapper docId="shape-sorting" title="Shape Sorting" emoji="🟩" description="Cut out shapes and sort them into groups.">
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-900">
                <strong>📝 Instructions:</strong> Look at the shapes below. Cut them out (or circle them) and sort them into the correct groups.
              </div>
              <div className="mb-6">
                <div className="text-lg font-semibold text-slate-800 mb-3">Shapes to Sort:</div>
                <div className="grid grid-cols-4 gap-4">
                  {shapes.map((shape, i) => (
                    <div key={i} className="border-2 border-dashed border-slate-400 rounded-lg p-4 bg-white flex flex-col items-center justify-center">
                      <svg viewBox="0 0 80 80" className="w-20 h-20 print:w-24 print:h-24">
                        {renderShape(shape, 80)}
                      </svg>
                      <div className="text-xs text-slate-600 mt-2 text-center capitalize">{shape.name}</div>
                    </div>
                  ))}
                  {shapes.map((shape, i) => (
                    <div key={`dup-${i}`} className="border-2 border-dashed border-slate-400 rounded-lg p-4 bg-white flex flex-col items-center justify-center">
                      <svg viewBox="0 0 80 80" className="w-20 h-20 print:w-24 print:h-24">
                        {renderShape(shape, 80)}
                      </svg>
                      <div className="text-xs text-slate-600 mt-2 text-center capitalize">{shape.name}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-lg font-semibold text-slate-800 mb-3">Sorting Boxes:</div>
                <div className="grid grid-cols-2 gap-4">
                  {shapes.map((shape, i) => (
                    <div key={i} className="border-2 border-slate-400 rounded-lg p-6 bg-slate-50">
                      <div className="text-center mb-3">
                        <div className="text-lg font-semibold text-slate-800 capitalize mb-2">{shape.name} Group</div>
                        <svg viewBox="0 0 80 80" className="w-24 h-24 print:w-32 print:h-32 mx-auto">
                          {renderShape(shape, 80)}
                        </svg>
                      </div>
                      <div className="text-center text-sm text-slate-600">Sort all {shape.name}s here</div>
                    </div>
                  ))}
                </div>
              </div>
              {showAnswersForDoc('shape-sorting', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {shapes.map((s, i) => (<li key={i}>{s.name}: Sort all {s.name}s into the {s.name} group</li>))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('color-recognition') && (() => {
          const items = [
            { item: 'apple', color: 'red', emoji: '🍎', shape: 'circle' },
            { item: 'sun', color: 'yellow', emoji: '☀️', shape: 'circle' },
            { item: 'sky', color: 'blue', emoji: '☁️', shape: 'rectangle' },
            { item: 'grass', color: 'green', emoji: '🌱', shape: 'rectangle' },
            { item: 'carrot', color: 'orange', emoji: '🥕', shape: 'triangle' },
            { item: 'grape', color: 'purple', emoji: '🍇', shape: 'circle' },
          ];
          return (
            <WorksheetSectionWrapper docId="color-recognition" title="Color Recognition" emoji="🟩" description="Color each item with the correct color.">
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-900">
                <strong>📝 Instructions:</strong> Look at each item and color it with the correct color shown below.
              </div>
              <div className="grid grid-cols-1 gap-6">
                {items.map((i, idx) => (
                  <div key={idx} className="border border-slate-300 rounded-lg p-6 bg-white">
                    <div className="text-center mb-4">
                      <div className="text-5xl mb-2">{i.emoji}</div>
                      <div className="text-lg font-semibold text-slate-800 capitalize mb-2">{i.item}</div>
                      <div className="text-sm font-semibold text-slate-600">Color: <span className="text-slate-800">{i.color}</span></div>
                    </div>
                    <div className="border-2 border-dashed border-slate-400 rounded-lg bg-white min-h-48 print:min-h-64 flex items-center justify-center">
                      <div className="text-6xl opacity-30">{i.emoji}</div>
                    </div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('color-recognition', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {items.map((i, idx) => (<li key={idx}>{i.item}: Color {i.color}</li>))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('draw-shape') && (() => {
          const shapes = ['circle', 'square', 'triangle', 'rectangle', 'oval', 'diamond'];
          return (
            <WorksheetSectionWrapper docId="draw-shape" title="Draw the Shape" emoji="🟩" description="Look at the shape name. Draw the shape in the box below.">
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-1 gap-6">
                {shapes.map((s, i) => (
                  <div key={i} className="border border-slate-300 rounded-lg p-6 bg-white">
                    <div className="text-center mb-4 text-lg font-semibold text-slate-800 capitalize">{s}</div>
                    <div className="border-2 border-dashed border-slate-400 rounded-lg bg-white min-h-64 print:min-h-80"></div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('draw-shape', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {shapes.map((s, i) => (
                      <li key={i}>
                        {s}: Draw a {s === 'circle' ? 'round circle' : s === 'square' ? 'four equal sides' : s === 'triangle' ? 'three sides' : s === 'rectangle' ? 'four sides (longer than wide)' : s === 'oval' ? 'elongated circle' : 'four equal sides rotated 45°'}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('color-patterns') && (() => {
          const patterns = [
            { colors: ['🔴', '🔵', '🔴', '🔵'], next: '🔴', name: 'red, blue' },
            { colors: ['🟡', '🟢', '🟡', '🟢'], next: '🟡', name: 'yellow, green' },
            { colors: ['🔵', '🔴', '🔵', '🔴'], next: '🔵', name: 'blue, red' },
            { colors: ['🟢', '🟡', '🟢', '🟡'], next: '🟢', name: 'green, yellow' },
            { colors: ['🟠', '🟣', '🟠', '🟣'], next: '🟠', name: 'orange, purple' },
            { colors: ['🔴', '🟡', '🔴', '🟡'], next: '🔴', name: 'red, yellow' },
          ];
          return (
            <WorksheetSectionWrapper docId="color-patterns" title="Color Patterns" emoji="🧩" description="Complete the color pattern. What comes next?">
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-2 gap-4">
                {patterns.map((p, i) => (
                  <div key={i} className="border border-slate-300 rounded-lg p-4 bg-white">
                    <div className="flex items-center justify-center gap-2 mb-3 text-3xl">
                      {p.colors.map((c, idx) => (
                        <span key={idx}>{c}</span>
                      ))}
                      <span className="text-2xl border-2 border-dashed border-slate-400 rounded px-2">?</span>
                    </div>
                    <div className="text-center text-sm text-slate-600">What comes next?</div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('color-patterns', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {patterns.map((p, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span>{p.colors.join(' ')}</span>
                        <span>→</span>
                        <span className="text-xl">{p.next}</span>
                        <span className="text-xs text-slate-500">({p.name} pattern)</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('shape-patterns') && (() => {
          const patterns = [
            { shapes: ['⭕', '⬜', '⭕', '⬜'], next: '⭕', name: 'circle, square' },
            { shapes: ['🔺', '⭕', '🔺', '⭕'], next: '🔺', name: 'triangle, circle' },
            { shapes: ['⬜', '🔺', '⬜', '🔺'], next: '⬜', name: 'square, triangle' },
            { shapes: ['⭕', '🔺', '⭕', '🔺'], next: '⭕', name: 'circle, triangle' },
            { shapes: ['⬜', '⭕', '⬜', '⭕'], next: '⬜', name: 'square, circle' },
            { shapes: ['🔺', '⬜', '🔺', '⬜'], next: '🔺', name: 'triangle, square' },
          ];
          return (
            <WorksheetSectionWrapper docId="shape-patterns" title="Shape Patterns" emoji="🧩" description="Continue the pattern. Draw the next shape.">
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-2 gap-4">
                {patterns.map((p, i) => (
                  <div key={i} className="border border-slate-300 rounded-lg p-4 bg-white">
                    <div className="flex items-center justify-center gap-2 mb-3 text-3xl">
                      {p.shapes.map((s, idx) => (
                        <span key={idx}>{s}</span>
                      ))}
                      <span className="text-2xl border-2 border-dashed border-slate-400 rounded px-2">?</span>
                    </div>
                    <div className="text-center text-sm text-slate-600">What comes next?</div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('shape-patterns', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {patterns.map((p, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span>{p.shapes.join(' ')}</span>
                        <span>→</span>
                        <span className="text-xl">{p.next}</span>
                        <span className="text-xs text-slate-500">({p.name} pattern)</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('what-comes-next') && (() => {
          const patterns = [
            { items: ['🔴', '🔵', '🔴', '🔵'], next: '🔴', name: 'red, blue' },
            { items: ['🟡', '🟢', '🟡', '🟢'], next: '🟡', name: 'yellow, green' },
            { items: ['🔵', '🔴', '🔵', '🔴'], next: '🔵', name: 'blue, red' },
            { items: ['🟢', '🟡', '🟢', '🟡'], next: '🟢', name: 'green, yellow' },
            { items: ['⭐', '❤️', '⭐', '❤️'], next: '⭐', name: 'star, heart' },
            { items: ['🍎', '🍌', '🍎', '🍌'], next: '🍎', name: 'apple, banana' },
          ];
          return (
            <WorksheetSectionWrapper docId="what-comes-next" title="What Comes Next?" emoji="🧩" description="Look at the pattern. Draw what comes next in each row.">
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-2 gap-4">
                {patterns.map((p, i) => (
                  <div key={i} className="border border-slate-300 rounded-lg p-4 bg-white">
                    <div className="flex items-center justify-center gap-2 mb-3 text-3xl">
                      {p.items.map((item, idx) => (
                        <span key={idx}>{item}</span>
                      ))}
                      <span className="text-2xl border-2 border-dashed border-slate-400 rounded px-2">?</span>
                    </div>
                    <div className="text-center text-sm text-slate-600">What comes next?</div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('what-comes-next', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {patterns.map((p, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span>{p.items.join(' ')}</span>
                        <span>→</span>
                        <span className="text-xl">{p.next}</span>
                        <span className="text-xs text-slate-500">({p.name} pattern)</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('long-short') && (() => {
          const pairs = [
            { long: { name: 'pencil', length: 80 }, short: { name: 'eraser', length: 30 } },
            { long: { name: 'ruler', length: 90 }, short: { name: 'paper clip', length: 25 } },
            { long: { name: 'crayon', length: 75 }, short: { name: 'button', length: 20 } },
            { long: { name: 'straw', length: 85 }, short: { name: 'coin', length: 15 } },
            { long: { name: 'stick', length: 80 }, short: { name: 'bead', length: 18 } },
            { long: { name: 'rope', length: 90 }, short: { name: 'key', length: 28 } },
          ];
          return (
            <WorksheetSectionWrapper docId="long-short" title="Long and Short" emoji="📏" description="Look at each pair. Color the long object red. Color the short object blue.">
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-900">
                <strong>📝 Instructions:</strong> Look at each pair of objects. The longer object should be colored red. The shorter object should be colored blue.
              </div>
              <div className="grid grid-cols-1 gap-6">
                {pairs.map((pair, idx) => (
                  <div key={idx} className="border border-slate-300 rounded-lg p-6 bg-white">
                    <div className="text-sm text-slate-700 mb-4 text-center font-semibold">Pair {idx + 1}</div>
                    <div className="flex items-center justify-center gap-8">
                      <div className="flex flex-col items-center gap-2">
                        <svg viewBox="0 0 100 100" className="w-64 h-64 border-2 border-slate-300 rounded-lg bg-white print:w-80 print:h-80">
                          <rect x="10" y="40" width={pair.long.length} height="20" fill="none" stroke="#475569" strokeWidth="4" rx="8" />
                          <text x="50" y="25" fontSize="12" fill="#475569" textAnchor="middle" fontWeight="bold">{pair.long.name}</text>
                          <text x="50" y="85" fontSize="11" fill="#ef4444" textAnchor="middle" fontWeight="bold">Color red</text>
                        </svg>
                      </div>
                      <div className="text-2xl text-slate-400">vs</div>
                      <div className="flex flex-col items-center gap-2">
                        <svg viewBox="0 0 100 100" className="w-64 h-64 border-2 border-slate-300 rounded-lg bg-white print:w-80 print:h-80">
                          <rect x="10" y="40" width={pair.short.length} height="20" fill="none" stroke="#475569" strokeWidth="4" rx="8" />
                          <text x="50" y="25" fontSize="12" fill="#475569" textAnchor="middle" fontWeight="bold">{pair.short.name}</text>
                          <text x="50" y="85" fontSize="11" fill="#3b82f6" textAnchor="middle" fontWeight="bold">Color blue</text>
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('long-short', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {pairs.map((pair, idx) => (
                      <li key={idx}>
                        Pair {idx + 1}: {pair.long.name} (long - color red), {pair.short.name} (short - color blue)
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('heavy-light') && (() => {
          const pairs = [
            { heavy: { name: 'elephant', emoji: '🐘', size: 60 }, light: { name: 'feather', emoji: '🪶', size: 25 } },
            { heavy: { name: 'car', emoji: '🚗', size: 55 }, light: { name: 'balloon', emoji: '🎈', size: 30 } },
            { heavy: { name: 'rock', emoji: '🪨', size: 50 }, light: { name: 'leaf', emoji: '🍃', size: 28 } },
            { heavy: { name: 'book', emoji: '📚', size: 52 }, light: { name: 'bubble', emoji: '🫧', size: 22 } },
            { heavy: { name: 'hammer', emoji: '🔨', size: 48 }, light: { name: 'cotton', emoji: '☁️', size: 26 } },
            { heavy: { name: 'backpack', emoji: '🎒', size: 54 }, light: { name: 'paper', emoji: '📄', size: 24 } },
          ];
          return (
            <WorksheetSectionWrapper docId="heavy-light" title="Heavy and Light" emoji="⚖️" description="Circle the heavy object. Put an X on the light object.">
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-1 gap-6">
                {pairs.map((pair, idx) => (
                  <div key={idx} className="border border-slate-300 rounded-lg p-6 bg-white">
                    <div className="text-sm text-slate-700 mb-4 text-center font-semibold">Pair {idx + 1}</div>
                    <div className="flex items-center justify-center gap-8 mb-4">
                      <div className="flex flex-col items-center gap-2">
                        <div className="relative">
                          <div className="text-6xl mb-2">{pair.heavy.emoji}</div>
                          <div className="absolute -top-1 -right-1 w-6 h-6 border-4 border-slate-600 rounded-full"></div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-sm text-slate-800">{pair.heavy.name}</div>
                          <div className="text-xs text-slate-600 mt-1">Circle (Heavy)</div>
                        </div>
                      </div>
                      <div className="text-2xl text-slate-400">vs</div>
                      <div className="flex flex-col items-center gap-2">
                        <div className="relative">
                          <div className="text-6xl mb-2">{pair.light.emoji}</div>
                          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-3xl text-slate-600 font-bold">✕</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-sm text-slate-800">{pair.light.name}</div>
                          <div className="text-xs text-slate-600 mt-1">Put X (Light)</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('heavy-light', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {pairs.map((pair, idx) => (
                      <li key={idx}>
                        Pair {idx + 1}: {pair.heavy.name} (heavy - circle), {pair.light.name} (light - put X)
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('same-different') && (() => {
          const sets = [
            { items: ['🔴', '🔴', '🔵', '🔴'], different: 2 },
            { items: ['🟡', '🟡', '🟡', '🟢'], different: 3 },
            { items: ['🔵', '🔵', '🔴', '🔵'], different: 2 },
            { items: ['🟢', '🟢', '🟢', '🟡'], different: 3 },
          ];
          return (
            <WorksheetSectionWrapper docId="same-different" title="Same and Different" emoji="⚖️" description="Find the object that is different. Circle it.">
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-2 gap-4">
                {sets.map((s, i) => (
                  <div key={i} className="border border-slate-300 rounded-lg p-4 bg-white">
                    <div className="text-center mb-2 text-xl">{s.items.join(' ')}</div>
                    <div className="text-center text-sm text-slate-600">Circle the different one</div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('same-different', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {sets.map((s, i) => (<li key={i}>Position {s.different + 1} is different</li>))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('line-tracing') && (() => {
          const lines = [
            { x1: 10, y1: 40, x2: 90, y2: 40, label: 'Horizontal line' },
            { x1: 10, y1: 20, x2: 90, y2: 60, label: 'Diagonal line' },
            { x1: 10, y1: 60, x2: 90, y2: 20, label: 'Diagonal line' },
            { x1: 10, y1: 30, x2: 90, y2: 30, label: 'Horizontal line' },
            { x1: 10, y1: 50, x2: 90, y2: 50, label: 'Horizontal line' },
            { x1: 10, y1: 10, x2: 90, y2: 70, label: 'Diagonal line' },
          ];
          return (
            <WorksheetSectionWrapper docId="line-tracing" title="Line Tracing" emoji="✏️" description="Trace the lines from left to right.">
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-1 gap-6">
                {lines.map((line, i) => (
                  <div key={i} className="border border-slate-300 rounded-lg p-6 bg-white">
                    <div className="text-sm text-slate-700 mb-3 text-center font-semibold">Line {i + 1}</div>
                    <div className="relative">
                      <svg viewBox="0 0 100 80" className="w-full h-48 border-2 border-slate-300 rounded-lg bg-slate-50 print:h-64">
                        <line
                          x1={line.x1}
                          y1={line.y1}
                          x2={line.x2}
                          y2={line.y2}
                          stroke="#475569"
                          strokeWidth="4"
                          strokeDasharray="6 6"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('line-tracing', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <p className="text-sm">Trace the dashed lines from left to right. Follow the line carefully with your pencil.</p>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('curve-tracing') && (() => {
          const curves = [
            { d: 'M 20 40 Q 50 20, 80 40', label: 'Curved line up' },
            { d: 'M 20 40 Q 50 60, 80 40', label: 'Curved line down' },
            { d: 'M 50 20 Q 20 40, 50 60 Q 80 40, 50 20', label: 'Wave pattern' },
            { d: 'M 50 10 Q 10 40, 50 70 Q 90 40, 50 10', label: 'Large wave' },
            { d: 'M 20 40 Q 50 30, 80 40 Q 50 50, 20 40', label: 'Smooth curve' },
            { d: 'M 30 40 Q 50 20, 70 40 Q 50 60, 30 40', label: 'Double curve' },
          ];
          const circles = [
            { cx: 50, cy: 40, r: 25 },
            { cx: 50, cy: 40, r: 20 },
            { cx: 50, cy: 40, r: 30 },
            { cx: 50, cy: 40, r: 18 },
            { cx: 50, cy: 40, r: 28 },
            { cx: 50, cy: 40, r: 22 },
          ];
          return (
            <WorksheetSectionWrapper docId="curve-tracing" title="Curve Tracing" emoji="✏️" description="Trace the curves and circles.">
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-1 gap-6">
                {curves.map((curve, i) => (
                  <div key={`curve-${i}`} className="border border-slate-300 rounded-lg p-6 bg-white">
                    <div className="text-sm text-slate-700 mb-3 text-center font-semibold">Curve {i + 1}</div>
                    <div className="relative">
                      <svg viewBox="0 0 100 80" className="w-full h-64 border-2 border-slate-300 rounded-lg bg-slate-50 print:h-80">
                        <path
                          d={curve.d}
                          fill="none"
                          stroke="#475569"
                          strokeWidth="5"
                          strokeDasharray="8 8"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  </div>
                ))}
                {circles.map((circle, i) => (
                  <div key={`circle-${i}`} className="border border-slate-300 rounded-lg p-6 bg-white">
                    <div className="text-sm text-slate-700 mb-3 text-center font-semibold">Circle {i + 1}</div>
                    <div className="relative">
                      <svg viewBox="0 0 100 80" className="w-full h-64 border-2 border-slate-300 rounded-lg bg-slate-50 print:h-80">
                        <circle
                          cx={circle.cx}
                          cy={circle.cy}
                          r={circle.r}
                          fill="none"
                          stroke="#475569"
                          strokeWidth="5"
                          strokeDasharray="8 8"
                        />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('curve-tracing', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <p className="text-sm">Trace the dashed curves and circles. Follow the curved lines carefully with your pencil.</p>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('zigzag-lines') && (() => {
          const zigzagPaths = [
            'M 10 50 L 30 20 L 50 50 L 70 20 L 90 50',
            'M 10 30 L 25 60 L 40 30 L 55 60 L 70 30 L 85 60',
            'M 10 40 L 20 20 L 30 40 L 40 20 L 50 40 L 60 20 L 70 40 L 80 20 L 90 40',
            'M 10 50 L 25 30 L 40 50 L 55 30 L 70 50 L 85 30',
            'M 10 60 L 30 40 L 50 60 L 70 40 L 90 60',
            'M 10 35 L 22 55 L 34 35 L 46 55 L 58 35 L 70 55 L 82 35',
          ];
          return (
            <WorksheetSectionWrapper docId="zigzag-lines" title="Zigzag Lines" emoji="✏️" description="Trace the zigzag lines from left to right.">
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-2 gap-4">
                {zigzagPaths.map((path, i) => (
                  <div key={i} className="border border-slate-300 rounded-lg p-4 bg-white">
                    <div className="text-xs text-slate-600 mb-2 text-center font-semibold">Zigzag {i + 1}</div>
                    <div className="relative">
                      <svg viewBox="0 0 100 80" className="w-full h-32 border border-slate-200 rounded bg-slate-50">
                        <path
                          d={path}
                          fill="none"
                          stroke="#94a3b8"
                          strokeWidth="3"
                          strokeDasharray="5 5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('zigzag-lines', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <p className="text-sm">Trace the dashed zigzag lines from left to right. Follow the up and down pattern carefully with your pencil.</p>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('path-tracing') && (() => {
          const paths = [
            { d: 'M 20 20 L 80 20 L 80 60 L 20 60 L 20 100 L 80 100', label: 'Straight path' },
            { d: 'M 20 20 Q 50 20, 50 50 Q 50 80, 80 80', label: 'Curved path' },
            { d: 'M 20 20 L 40 20 L 40 40 L 60 40 L 60 20 L 80 20 L 80 60 L 60 60 L 60 80 L 40 80 L 40 60 L 20 60 L 20 100', label: 'Zigzag path' },
            { d: 'M 20 20 L 50 20 L 50 50 L 80 50 L 80 80 L 50 80 L 50 100', label: 'L-shaped path' },
            { d: 'M 20 20 C 30 30, 50 30, 60 20 C 70 10, 80 20, 80 40 C 80 60, 60 70, 40 70 C 20 70, 20 90, 20 100', label: 'Wavy path' },
            { d: 'M 20 20 L 30 30 L 20 40 L 30 50 L 20 60 L 30 70 L 20 80 L 30 90 L 20 100', label: 'Diagonal path' },
          ];
          return (
            <WorksheetSectionWrapper docId="path-tracing" title="Path Tracing" emoji="✏️" description="Follow the path from start to finish. Trace along the dashed line with your pencil.">
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-1 gap-6">
                {paths.map((path, i) => (
                  <div key={i} className="border border-slate-300 rounded-lg p-6 bg-white">
                    <div className="text-sm text-slate-700 mb-3 text-center font-semibold">Path {i + 1}</div>
                    <div className="relative">
                      <svg viewBox="0 0 100 120" className="w-full h-64 border-2 border-slate-300 rounded-lg bg-slate-50 print:h-80">
                        <path
                          d={path.d}
                          fill="none"
                          stroke="#475569"
                          strokeWidth="4"
                          strokeDasharray="6 6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <circle cx="20" cy="20" r="5" fill="#22c55e" />
                        <text x="20" y="10" fontSize="12" fill="#22c55e" fontWeight="bold">Start</text>
                        <circle cx="80" cy="100" r="5" fill="#ef4444" />
                        <text x="80" y="118" fontSize="12" fill="#ef4444" fontWeight="bold">Finish</text>
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('path-tracing', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <p className="text-sm">Trace the dashed path from the green Start point to the red Finish point. Follow the path carefully with your pencil.</p>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {/* 3rd Grade Worksheets - Missing ones */}
        {activeDocs.includes('mult-arrays') && (() => {
          const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`);
          function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }
          const problems = Array.from({length: 6}, () => {
            const rows = nextInt(2, 5); const cols = nextInt(2, 5);
            return { rows, cols, product: rows * cols };
          });
          return (
            <WorksheetSectionWrapper docId="mult-arrays" title="Multiplication Arrays" emoji="✖️" description="Draw arrays to solve multiplication problems.">
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-2 gap-4">
                {problems.map((p, i) => (
                  <div key={i} className="border border-slate-300 rounded-lg p-4 bg-white">
                    <div className="text-center mb-2 font-semibold">{p.rows} × {p.cols} = ____</div>
                    <div className="text-center text-sm text-slate-600">Draw array: ____</div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('mult-arrays', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {problems.map((p, i) => (<li key={i}>{p.rows} × {p.cols} = {p.product}</li>))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('mult-word-problems') && (() => {
          const problems = [
            'Emma has 3 bags. Each bag has 4 apples. How many apples in all?',
            'There are 5 rows of flowers. Each row has 3 flowers. How many flowers total?',
            'Jake buys 2 packs of stickers. Each pack has 6 stickers. How many stickers does he have?',
            'A classroom has 4 tables. Each table seats 5 students. How many students can sit?',
            'Mom bakes 3 trays of cookies. Each tray has 8 cookies. How many cookies total?',
            'Tom reads 4 books. Each book has 7 chapters. How many chapters did he read?',
          ];
          return (
            <WorksheetSectionWrapper docId="mult-word-problems" title="Multiplication Word Problems" emoji="✖️" description="Solve each multiplication word problem.">
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <ol className="list-decimal list-inside space-y-4 text-sm text-slate-800">
                {problems.map((p, i) => (
                  <li key={i} className="border border-slate-300 rounded-lg p-4 bg-white">
                    {p}
                    <div className="h-12 border-b border-slate-400 mt-2" />
                  </li>
                ))}
              </ol>
              {showAnswersForDoc('mult-word-problems', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ol className="list-decimal list-inside space-y-0.5">
                    <li>3 × 4 = 12 apples</li>
                    <li>5 × 3 = 15 flowers</li>
                    <li>2 × 6 = 12 stickers</li>
                    <li>4 × 5 = 20 students</li>
                    <li>3 × 8 = 24 cookies</li>
                    <li>4 × 7 = 28 chapters</li>
                  </ol>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('mult-by-10-100') && (() => {
          const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`);
          function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }
          const problems = Array.from({length: 8}, () => {
            const num = nextInt(2, 9);
            const multiplier = [10, 100][nextInt(0, 1)];
            return { num, multiplier, answer: num * multiplier };
          });
          return (
            <WorksheetSectionWrapper docId="mult-by-10-100" title="Multiplying by 10, 100" emoji="✖️" description="Multiply each number by 10 or 100.">
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-2 gap-4">
                {problems.map((p, i) => (
                  <div key={i} className="border border-slate-300 rounded-lg p-4 bg-white">
                    <div className="text-center text-xl font-mono">{p.num} × {p.multiplier} = ____</div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('mult-by-10-100', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {problems.map((p, i) => (<li key={i}>{p.num} × {p.multiplier} = {p.answer}</li>))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('mult-properties') && (() => {
          const problems = [
            { expr: '3 × 4 = 4 × ?', answer: 3, prop: 'Commutative' },
            { expr: '(2 × 3) × 4 = 2 × (3 × ?)', answer: 4, prop: 'Associative' },
            { expr: '5 × (2 + 3) = (5 × 2) + (5 × ?)', answer: 3, prop: 'Distributive' },
            { expr: '6 × 7 = 7 × ?', answer: 6, prop: 'Commutative' },
            { expr: '(4 × 5) × 2 = 4 × (5 × ?)', answer: 2, prop: 'Associative' },
            { expr: '3 × (4 + 5) = (3 × 4) + (3 × ?)', answer: 5, prop: 'Distributive' },
          ];
          return (
            <WorksheetSectionWrapper docId="mult-properties" title="Properties of Multiplication" emoji="✖️" description="Use properties to solve each problem.">
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-2 gap-4">
                {problems.map((p, i) => (
                  <div key={i} className="border border-slate-300 rounded-lg p-4 bg-white">
                    <div className="text-center mb-2 font-mono">{p.expr}</div>
                    <div className="text-center text-sm text-slate-600">Property: {p.prop}</div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('mult-properties', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {problems.map((p, i) => (<li key={i}>{p.expr.replace('?', String(p.answer))} ({p.prop})</li>))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('div-with-remainders') && (() => {
          const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`);
          function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }
          const problems = Array.from({length: 6}, () => {
            const divisor = nextInt(2, 9);
            const quotient = nextInt(5, 12);
            const dividend = divisor * quotient + nextInt(0, divisor - 1);
            return { dividend, divisor, quotient, remainder: dividend % divisor };
          });
          return (
            <WorksheetSectionWrapper docId="div-with-remainders" title="Division with Remainders" emoji="➗" description="Divide and find the remainder.">
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-2 gap-4">
                {problems.map((p, i) => (
                  <div key={i} className="border border-slate-300 rounded-lg p-4 bg-white">
                    <div className="text-center mb-2 font-mono text-xl">{p.dividend} ÷ {p.divisor}</div>
                    <div className="text-center text-sm text-slate-600">Answer: ____ R ____</div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('div-with-remainders', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {problems.map((p, i) => (
                      <li key={i}>{p.dividend} ÷ {p.divisor} = {Math.floor(p.dividend / p.divisor)} R {p.remainder}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('div-word-problems') && (() => {
          const problems = [
            'Emma has 24 stickers. She wants to share them equally among 4 friends. How many stickers does each friend get?',
            'There are 30 cookies. If 5 children share them equally, how many cookies does each child get?',
            'Jake has 18 pencils. He puts them into 3 boxes equally. How many pencils are in each box?',
            'A teacher has 28 books. She wants to give 4 books to each student. How many students can get books?',
            'There are 36 apples. If 6 people share them equally, how many apples does each person get?',
            'Tom has 21 marbles. He wants to put them into 7 bags equally. How many marbles go in each bag?',
          ];
          return (
            <WorksheetSectionWrapper docId="div-word-problems" title="Division Word Problems" emoji="➗" description="Solve each division word problem.">
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <ol className="list-decimal list-inside space-y-4 text-sm text-slate-800">
                {problems.map((p, i) => (
                  <li key={i} className="border border-slate-300 rounded-lg p-4 bg-white">
                    {p}
                    <div className="h-12 border-b border-slate-400 mt-2" />
                  </li>
                ))}
              </ol>
              {showAnswersForDoc('div-word-problems', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ol className="list-decimal list-inside space-y-0.5">
                    <li>24 ÷ 4 = 6 stickers</li>
                    <li>30 ÷ 5 = 6 cookies</li>
                    <li>18 ÷ 3 = 6 pencils</li>
                    <li>28 ÷ 4 = 7 students</li>
                    <li>36 ÷ 6 = 6 apples</li>
                    <li>21 ÷ 7 = 3 marbles</li>
                  </ol>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('div-by-10-100') && (() => {
          const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`);
          function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }
          const problems = Array.from({length: 8}, () => {
            const num = nextInt(20, 90);
            const divisor = [10, 100][nextInt(0, 1)];
            return { num, divisor, answer: num / divisor };
          });
          return (
            <WorksheetSectionWrapper docId="div-by-10-100" title="Dividing by 10, 100" emoji="➗" description="Divide each number by 10 or 100.">
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-2 gap-4">
                {problems.map((p, i) => (
                  <div key={i} className="border border-slate-300 rounded-lg p-4 bg-white">
                    <div className="text-center text-xl font-mono">{p.num} ÷ {p.divisor} = ____</div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('div-by-10-100', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {problems.map((p, i) => (<li key={i}>{p.num} ÷ {p.divisor} = {p.answer}</li>))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('fact-families-mult-div') && (() => {
          const families = [
            { mult: [3, 4, 12], facts: ['3 × 4 = 12', '4 × 3 = 12', '12 ÷ 3 = 4', '12 ÷ 4 = 3'] },
            { mult: [2, 6, 12], facts: ['2 × 6 = 12', '6 × 2 = 12', '12 ÷ 2 = 6', '12 ÷ 6 = 2'] },
            { mult: [4, 5, 20], facts: ['4 × 5 = 20', '5 × 4 = 20', '20 ÷ 4 = 5', '20 ÷ 5 = 4'] },
            { mult: [3, 6, 18], facts: ['3 × 6 = 18', '6 × 3 = 18', '18 ÷ 3 = 6', '18 ÷ 6 = 3'] },
          ];
          return (
            <WorksheetSectionWrapper docId="fact-families-mult-div" title="Fact Families (Mult/Div)" emoji="➗" description="Complete the multiplication and division fact families.">
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="space-y-4">
                {families.map((f, i) => (
                  <div key={i} className="border border-slate-300 rounded-lg p-4 bg-white">
                    <div className="mb-2 font-semibold">Fact Family: {f.mult.join(', ')}</div>
                    <div className="space-y-1 text-sm">
                      {f.facts.map((fact, idx) => (
                        <div key={idx} className="border-b border-slate-200 pb-1">{fact}</div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('fact-families-mult-div', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {families.map((f, i) => (
                      <li key={i}>{f.mult.join(', ')}: {f.facts.join(', ')}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('comparing-fractions') && (() => {
          const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`);
          function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }
          const problems = Array.from({length: 8}, () => {
            const denom1 = [2, 3, 4, 5, 6, 8][nextInt(0, 5)];
            const num1 = nextInt(1, denom1 - 1);
            const denom2 = [2, 3, 4, 5, 6, 8][nextInt(0, 5)];
            const num2 = nextInt(1, denom2 - 1);
            const val1 = num1 / denom1;
            const val2 = num2 / denom2;
            return { frac1: `${num1}/${denom1}`, frac2: `${num2}/${denom2}`, val1, val2 };
          });
          return (
            <WorksheetSectionWrapper docId="comparing-fractions" title="Comparing Fractions" emoji="🍕" description="Compare each pair of fractions using >, <, or =.">
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-2 gap-4">
                {problems.map((p, i) => (
                  <div key={i} className="border border-slate-300 rounded-lg p-4 bg-white">
                    <div className="text-center text-xl font-bold">{p.frac1} ____ {p.frac2}</div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('comparing-fractions', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {problems.map((p, i) => {
                      const symbol = p.val1 > p.val2 ? '>' : p.val1 < p.val2 ? '<' : '=';
                      return <li key={i}>{p.frac1} {symbol} {p.frac2}</li>;
                    })}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('equivalent-fractions') && (() => {
          const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`);
          function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }
          const problems = Array.from({length: 8}, () => {
            const denom = [2, 3, 4, 5, 6, 8][nextInt(0, 5)];
            const num = nextInt(1, denom - 1);
            const factor = nextInt(2, 4);
            const equivNum = num * factor;
            const equivDenom = denom * factor;
            return { original: `${num}/${denom}`, equivalent: `${equivNum}/${equivDenom}` };
          });
          return (
            <WorksheetSectionWrapper docId="equivalent-fractions" title="Equivalent Fractions" emoji="🍕" description="Find an equivalent fraction for each given fraction.">
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-2 gap-4">
                {problems.map((p, i) => (
                  <div key={i} className="border border-slate-300 rounded-lg p-4 bg-white">
                    <div className="text-center text-xl font-bold mb-2">{p.original}</div>
                    <div className="text-center text-sm text-slate-600">Equivalent: ____</div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('equivalent-fractions', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {problems.map((p, i) => (<li key={i}>{p.original} = {p.equivalent}</li>))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('add-sub-fractions') && (() => {
          const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`);
          function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }
          const problems = Array.from({length: 6}, () => {
            const denom = [2, 3, 4, 5, 6, 8][nextInt(0, 5)];
            const num1 = nextInt(1, denom - 1);
            const num2 = nextInt(1, denom - 1);
            const op = nextInt(0, 1) === 0 ? '+' : '-';
            return { num1, num2, denom, op };
          });
          return (
            <WorksheetSectionWrapper docId="add-sub-fractions" title="Adding & Subtracting Fractions" emoji="🍕" description="Add or subtract each pair of fractions with like denominators.">
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-2 gap-4">
                {problems.map((p, i) => (
                  <div key={i} className="border border-slate-300 rounded-lg p-4 bg-white">
                    <div className="text-center text-xl font-mono">
                      {p.num1}/{p.denom} {p.op} {p.num2}/{p.denom} = ____
                    </div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('add-sub-fractions', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {problems.map((p, i) => {
                      const result = p.op === '+' ? p.num1 + p.num2 : p.num1 - p.num2;
                      return <li key={i}>{p.num1}/{p.denom} {p.op} {p.num2}/{p.denom} = {result}/{p.denom}</li>;
                    })}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('fractions-number-line') && (() => {
          const fractions = ['1/2', '1/4', '3/4', '1/3', '2/3', '1/5'];
          return (
            <WorksheetSectionWrapper docId="fractions-number-line" title="Fractions on a Number Line" emoji="🍕" description="Plot each fraction on the number line.">
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-2 gap-4">
                {fractions.map((f, i) => (
                  <div key={i} className="border border-slate-300 rounded-lg p-4 bg-white">
                    <div className="text-center mb-2 font-bold text-xl">{f}</div>
                    <div className="border-t-2 border-slate-400 mt-2 pt-2 text-center text-sm text-slate-600">0 —————— 1</div>
                    <div className="text-center text-sm text-slate-600 mt-1">Plot: ____</div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('fractions-number-line', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {fractions.map((f, i) => {
                      const [num, den] = f.split('/').map(Number);
                      const pos = num / den;
                      return <li key={i}>{f}: Plot at {pos} on number line</li>;
                    })}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('perimeter-shapes') && (() => {
          const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`);
          function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }
          const problems = Array.from({length: 6}, () => {
            const length = nextInt(4, 10);
            const width = nextInt(3, 8);
            return { length, width, perimeter: 2 * (length + width) };
          });
          return (
            <WorksheetSectionWrapper docId="perimeter-shapes" title="Perimeter of Shapes" emoji="📐" description="Find the perimeter of each rectangle.">
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-2 gap-4">
                {problems.map((p, i) => (
                  <div key={i} className="border border-slate-300 rounded-lg p-4 bg-white">
                    <div className="text-center mb-2">Length: {p.length}, Width: {p.width}</div>
                    <div className="text-center text-sm text-slate-600">Perimeter: ____</div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('perimeter-shapes', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {problems.map((p, i) => (<li key={i}>Perimeter = {p.perimeter} units</li>))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('area-rectangles') && (() => {
          const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`);
          function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }
          const problems = Array.from({length: 6}, () => {
            const length = nextInt(4, 10);
            const width = nextInt(3, 8);
            return { length, width, area: length * width };
          });
          return (
            <WorksheetSectionWrapper docId="area-rectangles" title="Area of Rectangles" emoji="📐" description="Find the area by multiplying length × width.">
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-2 gap-4">
                {problems.map((p, i) => (
                  <div key={i} className="border border-slate-300 rounded-lg p-4 bg-white">
                    <div className="text-center mb-2">Length: {p.length}, Width: {p.width}</div>
                    <div className="text-center text-sm text-slate-600">Area: ____</div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('area-rectangles', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {problems.map((p, i) => (<li key={i}>Area = {p.area} sq units</li>))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('identify-polygons') && (() => {
          const polygons = [
            { name: 'triangle', sides: 3 },
            { name: 'quadrilateral', sides: 4 },
            { name: 'pentagon', sides: 5 },
            { name: 'hexagon', sides: 6 },
            { name: 'octagon', sides: 8 },
            { name: 'square', sides: 4 },
          ];
          return (
            <WorksheetSectionWrapper docId="identify-polygons" title="Identify Polygons" emoji="📐" description="Name each polygon by number of sides.">
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-2 gap-4">
                {polygons.map((p, i) => (
                  <div key={i} className="border border-slate-300 rounded-lg p-4 bg-white">
                    <div className="text-center mb-2 font-semibold">{p.name}</div>
                    <div className="text-center text-sm text-slate-600">Sides: ____</div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('identify-polygons', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {polygons.map((p, i) => (<li key={i}>{p.name}: {p.sides} sides</li>))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('lines-rays-angles') && (() => {
          const items = [
            { name: 'line', desc: 'Straight path that goes on forever in both directions' },
            { name: 'line segment', desc: 'Part of a line with two endpoints' },
            { name: 'ray', desc: 'Part of a line with one endpoint' },
            { name: 'angle', desc: 'Formed by two rays sharing an endpoint' },
            { name: 'right angle', desc: '90 degree angle' },
            { name: 'acute angle', desc: 'Less than 90 degrees' },
          ];
          return (
            <WorksheetSectionWrapper docId="lines-rays-angles" title="Lines, Rays, and Angles" emoji="📐" description="Identify lines, line segments, rays, and angles.">
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-2 gap-4">
                {items.map((i, idx) => (
                  <div key={idx} className="border border-slate-300 rounded-lg p-4 bg-white">
                    <div className="text-center mb-2 text-sm">{i.desc}</div>
                    <div className="text-center text-sm text-slate-600">Name: ____</div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('lines-rays-angles', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {items.map((i, idx) => (<li key={idx}>{i.desc} = {i.name}</li>))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('symmetry') && (() => {
          const shapes = ['square', 'circle', 'rectangle', 'triangle', 'hexagon', 'star'];
          return (
            <WorksheetSectionWrapper docId="symmetry" title="Symmetry" emoji="📐" description="Find lines of symmetry. Draw the other half.">
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-2 gap-4">
                {shapes.map((s, i) => (
                  <div key={i} className="border border-slate-300 rounded-lg p-4 bg-white">
                    <div className="text-center mb-2 font-semibold">{s}</div>
                    <div className="text-center text-sm text-slate-600">Lines of symmetry: ____</div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('symmetry', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {shapes.map((s, i) => {
                      const lines = { square: 4, circle: 'infinite', rectangle: 2, triangle: 3, hexagon: 6, star: 5 }[s];
                      return <li key={i}>{s}: {lines} lines of symmetry</li>;
                    })}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('time-to-minute') && (() => {
          const times = ['8:15', '2:30', '10:45', '5:20', '12:05', '3:55'];
          return (
            <WorksheetSectionWrapper docId="time-to-minute" title="Time to the Minute" emoji="🕒" description="Read and write time to the nearest minute.">
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-2 gap-4">
                {times.map((t, i) => (
                  <div key={i} className="border border-slate-300 rounded-lg p-4 bg-white">
                    <div className="text-center text-xl font-mono mb-2">{t}</div>
                    <div className="text-center text-sm text-slate-600">Draw clock: ____</div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('time-to-minute', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {times.map((t, i) => (<li key={i}>{t}: Draw clock showing this time</li>))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('customary-units') && (() => {
          const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`);
          function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }
          const problems = Array.from({length: 6}, () => {
            const feet = nextInt(1, 10);
            return { feet, inches: feet * 12 };
          });
          return (
            <WorksheetSectionWrapper docId="customary-units" title="Customary Units" emoji="📏" description="Convert between inches, feet, and yards.">
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-2 gap-4">
                {problems.map((p, i) => (
                  <div key={i} className="border border-slate-300 rounded-lg p-4 bg-white">
                    <div className="text-center mb-2">{p.feet} feet = ____ inches</div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('customary-units', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {problems.map((p, i) => (<li key={i}>{p.feet} feet = {p.inches} inches</li>))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('metric-units') && (() => {
          const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`);
          function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }
          const problems = Array.from({length: 6}, () => {
            const meters = nextInt(1, 10);
            return { meters, centimeters: meters * 100 };
          });
          return (
            <WorksheetSectionWrapper docId="metric-units" title="Metric Units" emoji="📏" description="Convert between centimeters, meters, and kilometers.">
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-2 gap-4">
                {problems.map((p, i) => (
                  <div key={i} className="border border-slate-300 rounded-lg p-4 bg-white">
                    <div className="text-center mb-2">{p.meters} meters = ____ centimeters</div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('metric-units', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {problems.map((p, i) => (<li key={i}>{p.meters} meters = {p.centimeters} centimeters</li>))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('liquid-measurement') && (() => {
          const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`);
          function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }
          const problems = Array.from({length: 6}, () => {
            const quarts = nextInt(1, 5);
            return { quarts, cups: quarts * 4 };
          });
          return (
            <WorksheetSectionWrapper docId="liquid-measurement" title="Liquid Measurement" emoji="📏" description="Compare cups, pints, quarts, and gallons.">
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-2 gap-4">
                {problems.map((p, i) => (
                  <div key={i} className="border border-slate-300 rounded-lg p-4 bg-white">
                    <div className="text-center mb-2">{p.quarts} quarts = ____ cups</div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('liquid-measurement', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {problems.map((p, i) => (<li key={i}>{p.quarts} quarts = {p.cups} cups</li>))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('mass-weight') && (() => {
          const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`);
          function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }
          const problems = Array.from({length: 6}, () => {
            const pounds = nextInt(1, 5);
            return { pounds, ounces: pounds * 16 };
          });
          return (
            <WorksheetSectionWrapper docId="mass-weight" title="Mass and Weight" emoji="📏" description="Compare ounces, pounds, grams, and kilograms.">
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-2 gap-4">
                {problems.map((p, i) => (
                  <div key={i} className="border border-slate-300 rounded-lg p-4 bg-white">
                    <div className="text-center mb-2">{p.pounds} pounds = ____ ounces</div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('mass-weight', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {problems.map((p, i) => (<li key={i}>{p.pounds} pounds = {p.ounces} ounces</li>))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('multi-step-word-problems') && (() => {
          const problems = [
            'Emma has 24 stickers. She gives away 8 stickers. Then she buys 12 more. How many stickers does she have now?',
            'A store has 45 apples. They sell 15 apples in the morning and 18 apples in the afternoon. How many apples are left?',
            'Jake reads 3 books. Each book has 8 chapters. How many chapters did he read in all?',
            'There are 5 boxes. Each box has 6 toys. If 8 toys are broken, how many toys are still good?',
            'Sarah saves $5 each week for 4 weeks. Then she spends $12. How much money does she have left?',
            'A classroom has 30 students. 12 students are boys. How many students are girls?',
          ];
          return (
            <WorksheetSectionWrapper docId="multi-step-word-problems" title="Multi-Step Word Problems" emoji="🧮" description="Solve problems with 2 or 3 steps.">
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <ol className="list-decimal list-inside space-y-4 text-sm text-slate-800">
                {problems.map((p, i) => (
                  <li key={i} className="border border-slate-300 rounded-lg p-4 bg-white">
                    {p}
                    <div className="h-12 border-b border-slate-400 mt-2" />
                  </li>
                ))}
              </ol>
              {showAnswersForDoc('multi-step-word-problems', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ol className="list-decimal list-inside space-y-0.5">
                    <li>24 - 8 + 12 = 28 stickers</li>
                    <li>45 - 15 - 18 = 12 apples</li>
                    <li>3 × 8 = 24 chapters</li>
                    <li>5 × 6 - 8 = 22 toys</li>
                    <li>5 × 4 - 12 = $8</li>
                    <li>30 - 12 = 18 girls</li>
                  </ol>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('elapsed-time-word-problems') && (() => {
          const problems = [
            'Emma starts reading at 3:15 PM and finishes at 4:30 PM. How long did she read?',
            'A movie starts at 7:00 PM and ends at 9:15 PM. How long is the movie?',
            'Tom starts homework at 4:00 PM and finishes at 5:45 PM. How long did he work?',
            'A class starts at 9:00 AM and ends at 10:30 AM. How long is the class?',
            'Sarah starts cooking at 5:30 PM and finishes at 6:45 PM. How long did she cook?',
            'Jake starts playing at 2:00 PM and stops at 3:30 PM. How long did he play?',
          ];
          return (
            <WorksheetSectionWrapper docId="elapsed-time-word-problems" title="Elapsed Time Word Problems" emoji="🧮" description="Solve problems about time.">
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <ol className="list-decimal list-inside space-y-4 text-sm text-slate-800">
                {problems.map((p, i) => (
                  <li key={i} className="border border-slate-300 rounded-lg p-4 bg-white">
                    {p}
                    <div className="h-12 border-b border-slate-400 mt-2" />
                  </li>
                ))}
              </ol>
              {showAnswersForDoc('elapsed-time-word-problems', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ol className="list-decimal list-inside space-y-0.5">
                    <li>1 hour 15 minutes</li>
                    <li>2 hours 15 minutes</li>
                    <li>1 hour 45 minutes</li>
                    <li>1 hour 30 minutes</li>
                    <li>1 hour 15 minutes</li>
                    <li>1 hour 30 minutes</li>
                  </ol>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('money-word-problems') && (() => {
          const problems = [
            'Emma has $5.00. She buys a book for $2.50. How much money does she have left?',
            'Jake has $10.00. He buys 3 toys for $2.00 each. How much money does he have left?',
            'Sarah has $8.00. She buys a snack for $1.75. How much money does she have left?',
            'Tom has $12.00. He buys 2 items for $4.50 each. How much money does he have left?',
            'Lisa has $6.00. She buys a pen for $1.25. How much money does she have left?',
            'A store sells apples for $0.50 each. Jake buys 6 apples. How much does he pay?',
          ];
          return (
            <WorksheetSectionWrapper docId="money-word-problems" title="Money Word Problems" emoji="🧮" description="Solve problems involving dollars and cents.">
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <ol className="list-decimal list-inside space-y-4 text-sm text-slate-800">
                {problems.map((p, i) => (
                  <li key={i} className="border border-slate-300 rounded-lg p-4 bg-white">
                    {p}
                    <div className="h-12 border-b border-slate-400 mt-2" />
                  </li>
                ))}
              </ol>
              {showAnswersForDoc('money-word-problems', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ol className="list-decimal list-inside space-y-0.5">
                    <li>$5.00 - $2.50 = $2.50</li>
                    <li>$10.00 - $6.00 = $4.00</li>
                    <li>$8.00 - $1.75 = $6.25</li>
                    <li>$12.00 - $9.00 = $3.00</li>
                    <li>$6.00 - $1.25 = $4.75</li>
                    <li>$0.50 × 6 = $3.00</li>
                  </ol>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('perimeter-area-word-problems') && (() => {
          const problems = [
            'A rectangle has a length of 8 cm and width of 5 cm. What is the area and perimeter?',
            'A square has sides of 6 inches. What is the area and perimeter?',
            'A rectangle garden is 10 feet long and 7 feet wide. What is the area?',
            'A rectangular room is 12 feet by 9 feet. How many square feet of carpet are needed?',
            'A rectangle has a length of 9 cm and width of 4 cm. What is the perimeter?',
            'A square playground has sides of 8 meters. What is the area?',
          ];
          return (
            <WorksheetSectionWrapper docId="perimeter-area-word-problems" title="Perimeter & Area Word Problems" emoji="🧮" description="Find perimeter and area in real-world situations.">
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <ol className="list-decimal list-inside space-y-4 text-sm text-slate-800">
                {problems.map((p, i) => (
                  <li key={i} className="border border-slate-300 rounded-lg p-4 bg-white">
                    {p}
                    <div className="h-12 border-b border-slate-400 mt-2" />
                  </li>
                ))}
              </ol>
              {showAnswersForDoc('perimeter-area-word-problems', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ol className="list-decimal list-inside space-y-0.5">
                    <li>Area = 40 sq cm, Perimeter = 26 cm</li>
                    <li>Area = 36 sq inches, Perimeter = 24 inches</li>
                    <li>Area = 70 sq feet</li>
                    <li>Area = 108 sq feet</li>
                    <li>Perimeter = 26 cm</li>
                    <li>Area = 64 sq meters</li>
                  </ol>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {/* Generic fallback for any answerable docId that doesn't have a specific section */}
        {(() => {
          const handledDocIds = new Set([
            'ten-frames-1-20', 'number-tracing-1-20', 'stem-balloon-rocket', 'stem-walking-water', 'arts-3-shape-creature',
            'number-tracing-1-10', 'uppercase-lowercase-match', 'beginning-sounds-az', 'addition-subtraction-0-10',
            'ten-frames-1-10', 'shapes-colors-sort', 'dot-to-dot-1-20', 'tangram-animals', 'spot-difference', 'spotdiff',
            'directed-drawing-animals', 'cut-and-paste-crafts', 'feelings-checkin', 'reward-chart',
            'reading-mini-1', 'reading-g1-lost-hat', 'reading-g1-ants', 'reading-g1-bus-ride', 'reading-g1-pet-fish',
            'reading-g1-red-balloon', 'reading-g1-big-box', 'reading-g1-garden-snail', 'reading-g1-birthday-cake',
            'reading-g2-paper-bridge', 'reading-g2-rainy-garden', 'reading-g2-library-card', 'reading-g2-lost-and-found',
            'reading-g2-bird-feeder', 'reading-g2-cookie-recipe', 'reading-g2-tree-house',
            'reading-g3-lighthouse', 'reading-g3-science-fair', 'reading-g3-community-garden',
            'reading-g3-school-play', 'reading-g3-art-project', 'pack', 'math-maze',
            'spelling', 'science-match', 'grammar-detective', 'sudoku4', 'sudoku6', 'place-value-hto',
            'skip-count-5-10-120', 'add-2digit-100', 'sub-2digit-100', 'word-problems-100', 'compare-2digit',
            'even-odd-100', 'time-5min', 'color-by-number', 'number-bonds-10', 'count-write-30', 'missing-numbers-50',
            'picture-addition-10', 'subtraction-stories', 'balance-equations-10', 'skip-count-2s', 'number-line-add',
            'doubles-facts', 'pattern-complete', 'missing-shape', 'size-comparison', 'expanded-form-200',
            'number-patterns-200', 'rounding-nearest-10', 'add-three-numbers', 'missing-addends', 'fact-families-20',
            'mental-math-20', 'number-line-200', 'doubles-near-doubles', 'money-coins-bills', 'measurement-length',
            'bar-graphs-data', 'add-2digit-regrouping', 'sub-2digit-regrouping', 'fractions-halves-thirds-fourths',
            'rhyming-words', 'cvc-words', 'sight-words-pre-primer', 'letter-tracing-az', 'more-less-equal-10',
            'counting-objects-20', 'sentence-building', 'geo-continents-k2', 'geo-compass-rose', 'geo-landforms',
            'geo-latlong', 'number-tracing-1-10', 'number-tracing-1-20',
            'count-circle-1-10', 'count-match-1-20', 'how-many-1-15', 'count-color-1-10', 'number-id-1-10',
            'number-matching-1-15', 'number-order-1-20', 'find-number-1-10', 'shape-identification', 'ab-pattern',
            'big-small', 'more-less', 'mult-facts-0-12', 'div-facts-1-12', 'fractions-whole', 'equivalent-fractions-4th',
            'mult-facts-1-5', 'mult-arrays-2-5', 'skip-count-mult', 'mult-word-problems-2-3', 'mult-facts-6-12',
            'mult-arrays-models', 'mult-multi-step-word', 'mult-fact-families', 'mult-2x1', 'mult-2x1-digit', 'mult-2x2', 'mult-2x2-digit',
            'mult-3x2-digit', 'mult-area-model', 'mult-complex-word', 'mult-fact-fluency', 'mult-mixed-review', 'mult-strategies', 'mult-patterns',
            // Times Table worksheets
            'times-table-horizontal-1-5', 'times-table-horizontal-6-12', 'times-table-horizontal-1-12',
            'times-table-vertical-1-5', 'times-table-vertical-6-12', 'times-table-vertical-1-12',
            'times-table-missing-1-5', 'times-table-missing-6-12', 'times-table-missing-mixed',
            'times-table-timed-1-5', 'times-table-timed-6-12', 'times-table-timed-1-12',
            'times-table-blank-1-5', 'times-table-blank-6-12', 'times-table-blank-1-12',
            'times-table-confidence-1-5', 'times-table-confidence-6-12', 'times-table-fluency-1-12', 'times-table-mixed-review',
            'times-table-color-1-5', 'times-table-color-6-12', 'times-table-color-1-12',
            'long-division-1digit', 'long-division-2digit', 'area-model-mult', 'partial-products', 'comparing-fractions-4th',
            'add-sub-fractions-4th', 'mixed-improper-fractions', 'decimals-place-value', 'comparing-decimals', 'add-sub-decimals',
            'fractions-to-decimals', 'classifying-angles', 'area-perimeter-4th', 'lines-angles-4th', 'classifying-triangles',
            'classifying-quadrilaterals', 'symmetry-transformations', 'customary-conversion', 'metric-conversion', 'elapsed-time-4th',
            'liquid-measurement-4th', 'mass-weight-4th', 'multi-step-word-4th', 'fraction-word-problems', 'decimal-word-problems',
            'measurement-word-problems', 'geometry-word-problems', 'line-plots', 'bar-graphs-pictographs', 'mean-median-mode',
            'long-division-multidigit', 'order-of-operations', 'powers-of-10', 'rounding-decimals', 'estimating-sums-differences',
            'add-sub-mixed-numbers', 'multiplying-fractions', 'dividing-fractions', 'multiplying-decimals', 'dividing-decimals',
            'fractions-decimals-percents', 'comparing-ordering-fractions-decimals', 'evaluating-expressions', 'writing-expressions',
            'solving-one-step-equations', 'patterns-rules', 'coordinate-graphing', 'volume-rectangular-prisms', 'area-triangles-parallelograms',
            'classifying-shapes', 'nets-3d-shapes', 'transformations-5th', 'multi-step-word-5th', 'fraction-word-problems-5th',
            'decimal-word-problems-5th', 'ratio-proportion-word-problems', 'percent-word-problems', 'line-graphs',
            'mean-median-mode-range', 'stem-leaf-plots', 'probability',
            // Kindergarten worksheets
            'color-shapes', 'shape-sorting', 'color-recognition', 'draw-shape', 'color-patterns',
            'shape-patterns', 'what-comes-next', 'long-short', 'heavy-light', 'same-different',
            'line-tracing', 'curve-tracing', 'zigzag-lines', 'path-tracing',
            // 3rd Grade worksheets
            'mult-arrays', 'mult-word-problems', 'mult-by-10-100', 'mult-properties',
            'div-with-remainders', 'div-word-problems', 'div-by-10-100', 'fact-families-mult-div',
            'comparing-fractions', 'equivalent-fractions', 'add-sub-fractions', 'fractions-number-line',
            'perimeter-shapes', 'area-rectangles', 'identify-polygons', 'lines-rays-angles', 'symmetry',
            'time-to-minute', 'customary-units', 'metric-units', 'liquid-measurement', 'mass-weight',
            'multi-step-word-problems', 'elapsed-time-word-problems', 'money-word-problems', 'perimeter-area-word-problems'
          ])
          const unhandledDocIds = activeDocs.filter(id => answerableDocs.has(id) && !handledDocIds.has(id) && !id.startsWith('interactive-'))
          if (unhandledDocIds.length === 0) return null
          
          return unhandledDocIds.map(docId => {
            const title = resolveDocTitle(docId, { packTime, bundleCategory })
            return (
              <WorksheetSectionWrapper
                key={docId}
                docId={docId}
                title={title}
                emoji="📝"
                description="Complete the worksheet. Check your answers using the answer key below."
              >
                <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
                <div className="border border-slate-300 rounded-lg p-6 bg-white">
                  <div className="text-center text-slate-600 mb-4">
                    <p className="text-lg font-semibold mb-2">{title}</p>
                    <p className="text-sm">This worksheet is being generated. Content will be available soon.</p>
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="border border-slate-200 rounded p-4">
                          <div className="h-20 border-b-2 border-dashed border-slate-300" />
                          <p className="text-xs text-slate-400 mt-2">Question {i + 1}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {showAnswersForDoc(docId, () => (
                  <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                    <div className="font-semibold mb-1">Answer key</div>
                    <p className="text-sm">Answers will be provided when the worksheet content is fully implemented.</p>
                  </div>
                ))}
              </WorksheetSectionWrapper>
            )
          })
        })()}

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
