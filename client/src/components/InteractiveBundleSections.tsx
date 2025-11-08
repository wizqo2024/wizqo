import React from 'react'
import {
  INTERACTIVE_CATEGORIES,
  getDocMeta,
  type InteractiveWorksheetDoc,
  type InteractiveCategory,
} from '@shared/interactive/interactiveWorksheets'

type Props = {
  docIds: string[]
  seed: string
  variant: number
  showAnswers?: boolean
  teacherName?: string
  className?: string
  studentNames?: string[]
}

type RenderContext = {
  doc: InteractiveWorksheetDoc
  category: InteractiveCategory
  seed: string
  variant: number
}

type Renderer = (ctx: RenderContext) => React.ReactNode
type AnswerRenderer = (ctx: RenderContext) => React.ReactNode

const categoryByDocId = new Map<string, InteractiveCategory>()
INTERACTIVE_CATEGORIES.forEach((category) => {
  category.docs.forEach((doc) => {
    categoryByDocId.set(doc.id, category)
  })
})

function makeRng(seedStr: string) {
  let seed = 0
  for (let i = 0; i < seedStr.length; i++) seed = (seed + seedStr.charCodeAt(i)) >>> 0
  return function rng() {
    seed = (seed * 1664525 + 1013904223) >>> 0
    return seed / 0xffffffff
  }
}

const numberWords = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten']

const pick = <T,>(rng: () => number, list: T[]): T => list[Math.floor(rng() * list.length)]

const pickMany = <T,>(rng: () => number, list: T[], count: number): T[] => {
  const clone = list.slice()
  const results: T[] = []
  for (let i = 0; i < count && clone.length > 0; i++) {
    const idx = Math.floor(rng() * clone.length)
    results.push(clone.splice(idx, 1)[0])
  }
  return results
}

type MathSequence = { values: number[]; blankIndices: number[] }
type MathFact = { first: number; second: number; op: '+' | '-'; answer: number }
type MathPuzzle = { prompt: string; answer: number }
type MathShapeRow = { shape: string; color: string; count: number }
type MathMoneyRow = { item: string; coin: string; amount: number; coinCount: number }
type MathFractionPair = {
  left: { num: number; den: number }
  right: { num: number; den: number }
  comparison: '>' | '<' | '='
}
type MathMeasurementRow = {
  amount: number
  from: string
  to: string
  rate: number
  converted: number
}

type ReadingStoryMap = {
  hero: string
  friend: string
  setting: string
  goal: string
  obstacle: string
  helper: string
  lesson: string
  beginning: string
  middle: string
  ending: string
  clues: string[]
}

const SHAPE_INFO: Record<
  string,
  { kind: 'flat' | 'solid'; sidesLabel: string }
> = {
  triangle: { kind: 'flat', sidesLabel: '3 sides' },
  rectangle: { kind: 'flat', sidesLabel: '4 sides' },
  pentagon: { kind: 'flat', sidesLabel: '5 sides' },
  hexagon: { kind: 'flat', sidesLabel: '6 sides' },
  circle: { kind: 'flat', sidesLabel: '0 straight sides (curved)' },
  trapezoid: { kind: 'flat', sidesLabel: '4 sides' },
}

const COIN_VALUE: Record<'pennies' | 'nickels' | 'dimes' | 'quarters', number> = {
  pennies: 1,
  nickels: 5,
  dimes: 10,
  quarters: 25,
}

type ShapeToken = {
  key: string
  label: string
  render: React.ReactNode
}

const SHAPE_TOKENS: ShapeToken[] = [
  {
    key: 'diamond-blue',
    label: 'blue diamond',
    render: (
      <span className="inline-flex h-6 w-6 items-center justify-center" aria-hidden>
        <span className="block h-4 w-4 rotate-45 rounded-sm border border-sky-600 bg-sky-300" />
      </span>
    ),
  },
  {
    key: 'circle-red',
    label: 'red circle',
    render: (
      <span className="inline-flex h-6 w-6 items-center justify-center" aria-hidden>
        <span className="block h-4 w-4 rounded-full border border-rose-600 bg-rose-400" />
      </span>
    ),
  },
  {
    key: 'square-yellow',
    label: 'yellow square',
    render: (
      <span className="inline-flex h-6 w-6 items-center justify-center" aria-hidden>
        <span className="block h-4 w-4 rounded-sm border border-amber-500 bg-amber-300" />
      </span>
    ),
  },
  {
    key: 'circle-green',
    label: 'green circle',
    render: (
      <span className="inline-flex h-6 w-6 items-center justify-center" aria-hidden>
        <span className="block h-4 w-4 rounded-full border border-emerald-600 bg-emerald-300" />
      </span>
    ),
  },
  {
    key: 'star-yellow',
    label: 'yellow star',
    render: (
      <span className="inline-flex h-6 w-6 items-center justify-center text-lg text-amber-400" aria-hidden>
        ?
      </span>
    ),
  },
  {
    key: 'heart-pink',
    label: 'pink heart',
    render: (
      <span className="inline-flex h-6 w-6 items-center justify-center text-lg text-pink-400" aria-hidden>
        ?
      </span>
    ),
  },
]

function buildMathRhythm(seed: string, docId: string, variant: number): MathSequence[] {
  const rng = makeRng(`${seed}|${docId}|${variant}`)
  return Array.from({ length: 4 }).map(() => {
    const start = Math.floor(rng() * 9) + 1
    const step = Math.floor(rng() * 4) + 2
    const values = Array.from({ length: 6 }).map((_, idx) => start + step * idx)
    const blankIndex = Math.floor(rng() * values.length)
    const blankIndex2 = (blankIndex + 2) % values.length
    return {
      values,
      blankIndices: Array.from(new Set([blankIndex, blankIndex2])).sort((a, b) => a - b),
    }
  })
}

function buildMathRace(seed: string, docId: string, variant: number): MathFact[] {
  const rng = makeRng(`${seed}|${docId}|${variant}`)
  return Array.from({ length: 12 }).map(() => {
    const a = Math.floor(rng() * 18) + 2
    const b = Math.floor(rng() * 12) + 1
    const op: '+' | '-' = rng() > 0.5 ? '+' : '-'
    const first = op === '+' ? a : Math.max(a, b)
    const second = op === '+' ? b : Math.min(a, b)
    const answer = op === '+' ? first + second : first - second
    return { first, second, op, answer }
  })
}

function buildMathPuzzle(seed: string, docId: string, variant: number): MathPuzzle[] {
  const rng = makeRng(`${seed}|${docId}|${variant}`)
  const usedPrompts = new Set<string>()
  const puzzles: MathPuzzle[] = []
  
  while (puzzles.length < 6) {
    const target = Math.floor(rng() * 20) + 10
    const missing = Math.floor(rng() * 9) + 1
    const other = target - missing
    const showFirstBlank = rng() > 0.5
    let prompt: string
    let answer: number
    
    if (showFirstBlank) {
      prompt = `${other} + ____ = ${target}`
      answer = missing
    } else {
      prompt = `____ + ${missing} = ${target}`
      answer = other
    }
    
    // Avoid duplicates
    if (!usedPrompts.has(prompt)) {
      usedPrompts.add(prompt)
      puzzles.push({ prompt, answer })
    }
  }
  
  return puzzles
}

function buildMathShapes(seed: string, docId: string, variant: number): MathShapeRow[] {
  const rng = makeRng(`${seed}|${docId}|${variant}`)
  const shapes = ['triangle', 'rectangle', 'pentagon', 'hexagon', 'circle', 'trapezoid']
  const colors = ['sky', 'orchid', 'amber', 'emerald', 'rose', 'slate']
  return Array.from({ length: 4 }).map(() => ({
    shape: pick(rng, shapes),
    color: pick(rng, colors),
    count: Math.floor(rng() * 6) + 2,
  }))
}

function buildMathMoney(seed: string, docId: string, variant: number): MathMoneyRow[] {
  const rng = makeRng(`${seed}|${docId}|${variant}`)
  const coins: Array<'pennies' | 'nickels' | 'dimes' | 'quarters'> = ['nickels', 'dimes', 'quarters', 'pennies']
  const items = ['snack', 'bookmark', 'sticker pack', 'pencil topper', 'trading card']
  const usedItems = new Set<string>()
  return Array.from({ length: 5 }).map(() => {
    const coin = pick(rng, coins)
    const amount = (Math.floor(rng() * 6) + 1) * COIN_VALUE[coin]
    // Avoid duplicate items in the same worksheet
    let item = pick(rng, items)
    let attempts = 0
    while (usedItems.has(item) && attempts < 10) {
      item = pick(rng, items)
      attempts++
    }
    usedItems.add(item)
    return {
      item,
      coin,
      amount,
      coinCount: amount / COIN_VALUE[coin],
    }
  })
}

function buildMathFractions(seed: string, docId: string, variant: number): MathFractionPair[] {
  const rng = makeRng(`${seed}|${docId}|${variant}`)
  const numerators = [1, 2, 3, 4, 5]
  const denominators = [2, 3, 4, 5, 6, 8]
  return Array.from({ length: 5 }).map(() => {
    // Ensure proper fractions (numerator < denominator) for easier visualization
    let left = { num: pick(rng, numerators), den: pick(rng, denominators) }
    let right = { num: pick(rng, numerators), den: pick(rng, denominators) }
    // If improper fraction, swap or regenerate to make it proper
    while (left.num >= left.den) {
      left = { num: pick(rng, numerators.filter(n => n < left.den)), den: left.den }
    }
    while (right.num >= right.den) {
      right = { num: pick(rng, numerators.filter(n => n < right.den)), den: right.den }
    }
    const leftValue = left.num / left.den
    const rightValue = right.num / right.den
    const comparison: MathFractionPair['comparison'] =
      Math.abs(leftValue - rightValue) < 1e-6 ? '=' : leftValue > rightValue ? '>' : '<'
    return { left, right, comparison }
  })
}

function buildMathMeasurement(seed: string, docId: string, variant: number): MathMeasurementRow[] {
  const rng = makeRng(`${seed}|${docId}|${variant}`)
  const units = [
    { from: 'inches', to: 'feet', rate: 12 },
    { from: 'minutes', to: 'hours', rate: 60 },
    { from: 'centimeters', to: 'meters', rate: 100 },
    { from: 'cups', to: 'pints', rate: 2 },
    { from: 'ounces', to: 'pounds', rate: 16 },
  ] as const
  const selected = pickMany(rng, units as unknown as typeof units[number][], Math.min(4, units.length))
  return selected.map((unit) => {
    const amount = (Math.floor(rng() * 4) + 1) * unit.rate
    return {
      amount,
      from: unit.from,
      to: unit.to,
      rate: unit.rate,
      converted: amount / unit.rate,
    }
  })
}

function buildReadingStoryMap(seed: string, docId: string, variant: number): ReadingStoryMap {
  const rng = makeRng(`${seed}|${docId}|${variant}`)
  const heroNames = ['Avery', 'Noah', 'Lia', 'Cam', 'Riya', 'Kai']
  const settings = ['forest reading nook', 'floating lighthouse library', 'whispering museum wing', 'desert stargazer observatory', 'undersea story dome']
  const goals = [
    'collect three clues for the class mystery board',
    'finish a story map for tomorrow\'s share circle',
    'find a book that unlocks the next riddle',
    'record new vocabulary for the reading club',
    'deliver a message hidden between the pages',
  ]
  const obstacles = [
    'a gust of wind that scatters the pages',
    'lights that flicker and hide the aisle numbers',
    'a friendly dragon who blocks the doorway until someone explains the story',
    'a puzzle door that only opens with the right sequence of events',
    'a maze of shelves that shift like a puzzle',
  ]
  const helpers = ['a whispering bookworm guide', 'an owl librarian', 'a friendly janitor robot', 'a hologram teacher', 'a chorus of page sprites']
  const lessons = [
    'that careful reading reveals important clues',
    'that sharing ideas helps them solve problems',
    'that brave readers ask questions when stuck',
    'that staying calm helps them notice details',
    'that teamwork makes challenging stories easier',
  ]
  const cluePool = [
    'glowing footprints between shelves',
    'a bookmark with a secret symbol',
    'a note written in invisible ink',
    'a humming sound near the atlas section',
    'a set of color-coded shelf markers',
    'a compass etched into the floor tiles',
  ]
  const hero = pick(rng, heroNames)
  const friendOptions = heroNames.filter((name) => name !== hero)
  const friend = pick(rng, friendOptions)
  const setting = pick(rng, settings)
  const goal = pick(rng, goals)
  const obstacle = pick(rng, obstacles)
  const helper = pick(rng, helpers)
  const lesson = pick(rng, lessons)
  const clues = pickMany(rng, cluePool, 2)
  const middle = `They notice ${clues[0]} and ${clues[1]}, but ${obstacle}. ${helper} shows them how to keep going.`
  const ending = `They complete their mission and learn ${lesson}.`

  return {
    hero,
    friend,
    setting,
    goal,
    obstacle,
    helper,
    lesson,
    clues,
    beginning: `${hero} and ${friend} arrive at the ${setting} to ${goal}.`,
    middle,
    ending,
  }
}

const renderers: Record<string, Renderer> = {
  'interactive-math-rhythm': ({ doc, category, seed, variant }) => {
    const sequences = buildMathRhythm(seed, doc.id, variant)
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          Continue each skip-counting rhythm. Write the missing numbers in the blanks.
        </p>
        <div className="grid gap-3">
          {sequences.map((sequence, rowIdx) => {
            const blanks = new Set(sequence.blankIndices)
            return (
              <div key={rowIdx} className="flex items-center gap-2 text-lg font-semibold text-purple-800">
                {sequence.values.map((value, idx) => (
                  <span
                    key={idx}
                    className={`inline-block min-w-[2.5rem] rounded border border-dashed border-purple-300 px-2 py-1 text-center ${
                      blanks.has(idx) ? 'bg-white text-slate-400' : 'bg-purple-50'
                    }`}
                  >
                    {blanks.has(idx) ? '____' : value}
                  </span>
                ))}
              </div>
            )
          })}
        </div>
        <p className="text-xs text-slate-500">
          Tip: say the pattern aloud to keep the rhythm steady.
        </p>
      </div>
    )
  },
  'interactive-math-race': ({ doc, category, seed, variant }) => {
    const problems = buildMathRace(seed, doc.id, variant)
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          Set a 60-second timer. Solve as many facts as you can, then circle your personal record.
        </p>
        <div className="grid grid-cols-3 gap-3">
          {problems.map((prob, idx) => (
            <div key={idx} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-center text-lg font-semibold tracking-wide">
              {prob.first} {prob.op} {prob.second} =
            </div>
          ))}
        </div>
          <div className="rounded-lg border border-purple-200 bg-purple-50 px-4 py-3 text-sm text-purple-800">
            <p className="font-semibold">Reflection</p>
            <p>How many facts did you solve? ______ • Which strategy helped you most? ____________________</p>
          </div>
      </div>
    )
  },
  'interactive-math-puzzle': ({ doc, seed, variant }) => {
    const puzzles = buildMathPuzzle(seed, doc.id, variant)
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          Fill in the missing numbers to complete each equation. Show a different strategy (number line, draw, tens frame) for at least two puzzles.
        </p>
        <div className="grid grid-cols-2 gap-4">
          {puzzles.map((puzzle, idx) => (
            <div key={idx} className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-5 text-center text-lg font-semibold text-amber-800">
              {puzzle.prompt}
            </div>
          ))}
        </div>
      </div>
    )
  },
  'interactive-math-shapes': ({ seed, doc, variant }) => {
    const rows = buildMathShapes(seed, doc.id, variant)
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          Draw and tally each shape. Then classify it as {`"flat"`} or {`"solid"`} and record the number of sides.
        </p>
        <table className="w-full border border-slate-300 text-sm">
          <thead className="bg-slate-100 text-left">
            <tr>
              <th className="px-3 py-2">Shape</th>
              <th className="px-3 py-2">Color</th>
              <th className="px-3 py-2">How many?</th>
              <th className="px-3 py-2">Flat or Solid?</th>
              <th className="px-3 py-2">Number of sides</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx} className="border-t border-slate-200">
                <td className="px-3 py-2 capitalize">{row.shape}</td>
                <td className="px-3 py-2 capitalize">{row.color}</td>
                <td className="px-3 py-2">{row.count}</td>
                <td className="px-3 py-2">________________</td>
                <td className="px-3 py-2">________</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  },
  'interactive-math-money': ({ seed, doc, variant }) => {
    const prompts = buildMathMoney(seed, doc.id, variant)
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          Use coins to count up to the total. Draw the coins you would use and record the value.
        </p>
        <ol className="space-y-3 text-sm text-slate-700 list-decimal list-inside">
          {prompts.map((prompt, idx) => (
            <li key={idx} className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3">
              <p>
                The {prompt.item} costs ${(prompt.amount / 100).toFixed(2)}. Pay using {prompt.coin}. Draw your coins below and write the total.
              </p>
              <div className="mt-2 h-16 rounded border border-dashed border-emerald-300 bg-white" />
              <div className="mt-2 text-xs text-emerald-700">
                Total: ________ • Change: ________
              </div>
            </li>
          ))}
        </ol>
      </div>
    )
  },
  'interactive-math-fractions': ({ seed, doc, variant }) => {
    const pairs = buildMathFractions(seed, doc.id, variant)
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          Compare each pair of fractions. Shade the bar models to help you decide, then write &lt;, &gt;, or =.
        </p>
        <div className="space-y-4">
          {pairs.map(({ left: a, right: b }, idx) => (
            <div key={idx} className="rounded-xl border border-purple-200 bg-white p-4">
              <div className="flex items-center justify-between text-lg font-semibold text-purple-800">
                <span>{a.num}/{a.den}</span>
                <span className="text-slate-400">__________</span>
                <span>{b.num}/{b.den}</span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3">
                {[a, b].map((frac, barIdx) => (
                  <div key={barIdx} className="space-y-1 text-xs text-slate-600">
                    <div className="h-3 w-full overflow-hidden rounded-full border border-slate-300 bg-slate-100">
                      <div className="h-full bg-purple-400" style={{ width: `${(frac.num / frac.den) * 100}%` }} />
                    </div>
                    <p>Shade {frac.num} of {frac.den} equal parts.</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  },
  'interactive-math-measurement': ({ seed, doc, variant }) => {
    const problems = buildMathMeasurement(seed, doc.id, variant)
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          Convert each measurement. Show your work in the space provided.
        </p>
        <table className="w-full border border-slate-300 text-left text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-3 py-2">Given</th>
              <th className="px-3 py-2">Convert to</th>
              <th className="px-3 py-2">Work space</th>
            </tr>
          </thead>
          <tbody>
            {problems.map((problem, idx) => (
              <tr key={idx} className="border-t border-slate-200">
                <td className="px-3 py-2">{problem.amount} {problem.from}</td>
                <td className="px-3 py-2">_____ {problem.to}</td>
                <td className="px-3 py-2">
                  <div className="h-12 rounded border border-dashed border-slate-300 bg-white" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  },
  'interactive-reading-adventure': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const heroes = ['Maya', 'Jasper', 'Alani', 'Theo', 'Priya', 'Leo']
    const settings = ['hidden treehouse', 'floating library', 'midnight carnival', 'desert lab', 'mountain observatory']
    const quests = ['recover a lost map', 'decode a riddle', 'repair the story fountain', 'help a time-traveling turtle', 'track a glowing comet']
    const hero = pick(rng, heroes)
    const partner = pick(rng, heroes.filter((name) => name !== hero))
    const setting = pick(rng, settings)
    const quest = pick(rng, quests)
    return (
      <div className="space-y-3">
        <p className="text-sm leading-relaxed text-slate-700">
          {hero} and {partner} arrive at the {setting}. They must {quest} before the moon sets. Along the way they meet a guide who speaks only in rhymes. What clues do they gather? How do they work together?
        </p>
        <div className="space-y-2 text-sm text-slate-700">
          <p className="font-semibold text-slate-900">Comprehension Checks</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>What problem do {hero} and {partner} need to solve?</li>
            <li>Describe one clue from the rhyme-speaking guide.</li>
            <li>How does the setting help or challenge the characters?</li>
          </ol>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">Creative Extension</p>
          <p className="text-sm text-slate-700">Sketch one scene from the adventure and label the important details.</p>
          <div className="mt-2 h-32 rounded border border-dashed border-slate-300" />
        </div>
      </div>
    )
  },
  'interactive-reading-detective': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const mysteries = [
      { title: 'The Missing Lab Goggles', culprit: 'an absent-minded janitor', clue: 'a trail of glitter', setting: 'science fair' },
      { title: 'Case of the Empty Birdhouse', culprit: 'a helpful raccoon', clue: 'muddy paw prints', setting: 'school garden' },
      { title: 'The Whispering Lockers', culprit: 'a friendly robot', clue: 'battery crumbs', setting: 'hallway' },
    ]
    const caseFile = pick(rng, mysteries)
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-700 font-semibold">Case File: {caseFile.title}</p>
        <p className="text-sm text-slate-600">
          Detective Notes: The scene is the {caseFile.setting}. A witness heard a hum. The main clue is {caseFile.clue}. Who or what is responsible?
        </p>
        <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
          <li>Write three inferences using the clues.</li>
          <li>Explain why the culprit might be {caseFile.culprit}.</li>
          <li>Prove or disprove your theory with text evidence.</li>
        </ul>
        <div className="rounded-lg border border-dashed border-indigo-300 bg-indigo-50 px-4 py-3 text-sm text-indigo-800">
          Draw your evidence board below and label each clue.
          <div className="mt-2 h-28 rounded border border-indigo-200 bg-white" />
        </div>
      </div>
    )
  },
  'interactive-reading-storymap': ({ seed, doc, variant }) => {
    const story = buildReadingStoryMap(seed, doc.id, variant)
    return (
      <div className="space-y-3">
        <p className="text-sm leading-relaxed text-slate-700">
          {story.beginning} {story.middle} {story.ending}
        </p>
        <div className="grid gap-3 md:grid-cols-3">
          {[
            { title: 'Beginning', prompt: 'Who are the characters? Where are they?' },
            { title: 'Middle', prompt: 'What problem appears? What clues help?' },
            { title: 'Ending', prompt: 'How do they solve it? What is the lesson?' },
          ].map((section) => (
            <div key={section.title} className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
              <p className="font-semibold text-slate-900">{section.title}</p>
              <p className="text-xs text-slate-500">{section.prompt}</p>
              <div className="mt-3 h-24 rounded border border-dashed border-slate-300" />
            </div>
          ))}
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-purple-200 bg-purple-50 p-4 text-sm text-purple-800">
            <p className="font-semibold">Clue Log</p>
            <p className="text-xs uppercase tracking-wide text-purple-500">Look back at the story</p>
            <ol className="mt-2 list-decimal list-inside space-y-2 text-purple-900">
              <li>Clue 1: _____________________________________________</li>
              <li>Clue 2: _____________________________________________</li>
            </ol>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
            <p className="font-semibold text-slate-900">Retell in Your Own Words</p>
            <p className="text-xs text-slate-500">Write three sentences that cover beginning, middle, and ending.</p>
            <div className="mt-3 space-y-2">
              <div className="h-10 rounded border border-dashed border-slate-300" />
              <div className="h-10 rounded border border-dashed border-slate-300" />
              <div className="h-10 rounded border border-dashed border-slate-300" />
            </div>
          </div>
        </div>
        <div className="space-y-2 text-sm text-slate-700">
          <p className="font-semibold text-slate-900">Comprehension Checks</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Why did {story.hero} and {story.friend} visit the {story.setting}?</li>
            <li>What problem slowed them down in the middle of the story?</li>
            <li>How did {story.helper} help them finish their goal? What lesson did they learn?</li>
          </ol>
        </div>
      </div>
    )
  },
  'interactive-reading-vocab': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const words = pickMany(rng, ['brisk', 'illuminate', 'curious', 'soar', 'murmur', 'astonished', 'grumble', 'admire', 'voyage', 'bundle'], 6)
    const contexts = ['after-school announcement', 'nature discovery', 'space mission', 'friendship moment', 'STEM experiment', 'art showcase']
    const context = pick(rng, contexts)
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          Use context clues to match each word to its meaning. Then write a sentence using the word in the {context} context.
        </p>
        <table className="w-full border border-slate-300 text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-3 py-2">Word</th>
              <th className="px-3 py-2">Match the meaning</th>
              <th className="px-3 py-2">Sentence in context</th>
            </tr>
          </thead>
          <tbody>
            {words.map((word, idx) => (
              <tr key={idx} className="border-t border-slate-200">
                <td className="px-3 py-2 capitalize">{word}</td>
                <td className="px-3 py-2">________________________</td>
                <td className="px-3 py-2">__________________________________________________</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  },
  'interactive-reading-summary': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const topics = ['community garden', 'solar-powered bus', 'classroom pet adoption', 'school makerspace', 'reading marathon']
    const topic = pick(rng, topics)
    return (
      <div className="space-y-3">
        <p className="text-sm leading-relaxed text-slate-700">
          Read the informational paragraph about the {topic}. Highlight the most important idea from each section. Then complete the summary box with 3 key points.
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
            <p>
              Paragraph 1: Introduces the {topic}. Why was it created? Who benefits from it?
            </p>
            <p className="mt-2">
              Paragraph 2: Describes how it works each day. What steps are involved? Who helps?
            </p>
            <p className="mt-2">
              Paragraph 3: Shares one challenge and a plan to improve it next month.
            </p>
          </div>
          <div className="rounded-xl border border-purple-200 bg-purple-50 p-4 text-sm text-purple-800">
            <p className="font-semibold">Summary Box</p>
            <ul className="mt-2 space-y-2 text-purple-900">
              <li>Key point 1: __________________________</li>
              <li>Key point 2: __________________________</li>
              <li>Key point 3: __________________________</li>
            </ul>
            <p className="mt-3 text-xs text-purple-700">Write one closing sentence that restates the main idea in your own words.</p>
          </div>
        </div>
      </div>
    )
  },
  'interactive-reading-compare': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const topics = [
      ['solar camping tent', 'traditional canvas tent'],
      ['silent reading nook', 'classroom makerspace'],
      ['city playground', 'forest trail'],
      ['robot helper', 'human volunteer'],
    ]
    const [topicA, topicB] = pick(rng, topics)
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          Compare and contrast the two texts. Record information about {topicA} and {topicB}, then write a paragraph explaining how they are alike and different.
        </p>
        <div className="grid gap-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
            <p className="font-semibold">Text 1: {topicA}</p>
            <p>Key details: ______________________________</p>
            <p>What problem does it solve? __________________</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
            <p className="font-semibold">Text 2: {topicB}</p>
            <p>Key details: ______________________________</p>
            <p>What problem does it solve? __________________</p>
          </div>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
            <p className="font-semibold">Compare & Contrast Paragraph</p>
            <p className="mt-2">
              {topicA} and {topicB} are alike because _______________________________. They are different because _______________________________.
            </p>
          </div>
        </div>
      </div>
    )
  },
  'interactive-writing-prompts': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const prompts = [
      'Write about a time your class invented something helpful.',
      'Describe a secret door you discover during recess.',
      'Imagine the library books come alive at night?what happens?',
      'Create a story where your pet becomes the substitute teacher.',
      'Explain how to care for a tiny dragon who loves math.',
      'Describe a neighborhood celebration that you design.',
    ]
    const chosen = pickMany(rng, prompts, 3)
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          Choose a prompt and write a beginning, middle, and end. Include feelings, actions, and dialogue.
        </p>
        <ul className="space-y-2 text-sm text-slate-700">
          {chosen.map((prompt, idx) => (
            <li key={idx} className="rounded-lg border border-slate-200 bg-white px-4 py-3">
              <span className="font-semibold text-purple-700">Prompt {idx + 1}:</span> {prompt}
            </li>
          ))}
        </ul>
        <div className="space-y-1 text-xs text-slate-500">
          <p>Brainstorm: ________________________________</p>
          <p>Beginning: _________________________________</p>
          <p>Middle: ___________________________________</p>
          <p>End: ______________________________________</p>
        </div>
      </div>
    )
  },
  'interactive-writing-sentences': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const starters = pickMany(rng, ['After lunch', 'During the storm', 'When the robot blinked', 'While the choir practiced', 'Before sunrise', 'Whenever the bell rings'], 4)
    const actions = pickMany(rng, ['we built a domino tower', 'the lights flickered', 'a secret message appeared', 'someone whispered a clue', 'the class cheered', 'the cat jumped on the desk'], 4)
    const sentences = starters.map((start, idx) => `${start}, ____________________.`)
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          Complete each sentence with vivid verbs and details. Then rewrite one sentence using a compound structure.
        </p>
        <ul className="space-y-2 text-sm text-slate-700">
          {sentences.map((sentence, idx) => (
            <li key={idx} className="rounded border border-amber-200 bg-amber-50 px-4 py-3 font-semibold text-amber-800">
              {sentence}
            </li>
          ))}
        </ul>
        <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
          <p className="font-semibold text-slate-900">Compound Sentence Challenge</p>
          <p>Combine two of your sentences with a conjunction: _______________________________________________________</p>
        </div>
      </div>
    )
  },
  'interactive-writing-poetry': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const themes = ['rainy playground', 'city skyline', 'secret garden', 'music festival', 'winter morning', 'campfire night']
    const theme = pick(rng, themes)
    const wordBank = pickMany(rng, ['glimmer', 'echo', 'whirl', 'rustle', 'shimmer', 'spark', 'twirl', 'glide', 'bloom', 'glisten'], 6)
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          Create a haiku and a free-verse stanza about a {theme}. Use at least three word bank words.
        </p>
        <div className="rounded-xl border border-purple-200 bg-purple-50 p-4 text-sm text-purple-800">
          <p className="font-semibold">Word Bank</p>
          <p className="mt-1 uppercase tracking-wide text-xs">{wordBank.join(' • ')}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
            <p className="font-semibold">Haiku (5-7-5)</p>
            <p>Line 1: ___________________________</p>
            <p>Line 2: ___________________________</p>
            <p>Line 3: ___________________________</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
            <p className="font-semibold">Free-verse Stanza</p>
            <p>Line 1: ___________________________</p>
            <p>Line 2: ___________________________</p>
            <p>Line 3: ___________________________</p>
            <p>Line 4: ___________________________</p>
          </div>
        </div>
      </div>
    )
  },
  'interactive-writing-opinion': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const topics = ['Should recess be longer?', 'Is it better to read ebooks or paper books?', 'Should robots help with homework?', 'Is homework on weekends a good idea?', 'Should the cafeteria add a smoothie bar?']
    const topic = pick(rng, topics)
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          Plan an opinion paragraph about: <span className="font-semibold text-purple-700">{topic}</span>
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
            <p className="font-semibold">Reasons & Evidence</p>
            <p>Reason #1 ____________________________________</p>
            <p>Evidence _____________________________________</p>
            <p className="mt-3">Reason #2 ____________________________________</p>
            <p>Evidence _____________________________________</p>
          </div>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
            <p className="font-semibold">Paragraph Planner</p>
            <p>Hook sentence: ___________________________________</p>
            <p>Opinion statement: _______________________________</p>
            <p>Closing sentence: ________________________________</p>
          </div>
        </div>
      </div>
    )
  },
  'interactive-science-observation': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const focuses = ['plants', 'weather', 'animal behavior', 'STEM gadgets', 'rocks & minerals']
    const focus = pick(rng, focuses)
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          Observe and record data about {focus}. Include sketches, measurements, and interesting questions.
        </p>
        <table className="w-full border border-slate-300 text-left text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-3 py-2">Date & Time</th>
              <th className="px-3 py-2">Observation Sketch</th>
              <th className="px-3 py-2">What I Noticed</th>
              <th className="px-3 py-2">Questions / Next Steps</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 4 }).map((_, idx) => (
              <tr key={idx} className="border-t border-slate-200">
                <td className="px-3 py-2">__________</td>
                <td className="px-3 py-2">
                  <div className="h-16 w-full rounded border border-dashed border-slate-300" />
                </td>
                <td className="px-3 py-2">____________________________________</td>
                <td className="px-3 py-2">____________________________________</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  },
  'interactive-science-lifecycle': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const cycles = ['butterfly', 'sunflower', 'frog', 'apple tree', 'bean plant']
    const cycle = pick(rng, cycles)
    const stagesMap: Record<string, string[]> = {
      butterfly: ['Egg', 'Caterpillar', 'Chrysalis', 'Butterfly'],
      sunflower: ['Seed', 'Sprout', 'Budding', 'Bloom'],
      frog: ['Egg', 'Tadpole', 'Froglet', 'Adult frog'],
      'apple tree': ['Seed', 'Sapling', 'Young tree', 'Fruit tree'],
      'bean plant': ['Seed', 'Sprout', 'Flowering', 'Bean pod'],
    }
    const stages = stagesMap[cycle]
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          Label and illustrate the life cycle of a {cycle}. Describe what happens at each stage.
        </p>
        <div className="grid gap-4 md:grid-cols-4">
          {stages.map((stage, idx) => (
            <div key={stage} className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-center text-sm text-emerald-800">
              <p className="font-semibold">{numberWords[idx].toUpperCase()} Stage</p>
              <p className="mt-1 font-bold text-emerald-900">{stage}</p>
              <div className="mt-2 h-16 rounded border border-dashed border-emerald-300 bg-white" />
              <p className="mt-2 text-xs text-emerald-700">Notes: __________________</p>
            </div>
          ))}
        </div>
      </div>
    )
  },
  'interactive-science-states': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const scenarios = pickMany(
      rng,
      [
        { description: 'Ice cube melting on a sunny windowsill', answer: 'solid -> liquid' },
        { description: 'Steam rising from hot cocoa', answer: 'liquid -> gas' },
        { description: 'Water droplets forming on a cold can', answer: 'gas -> liquid' },
        { description: 'Chocolate bar in a warm pocket', answer: 'solid -> liquid' },
        { description: 'Puddle freezing overnight', answer: 'liquid -> solid' },
        { description: 'Perfume sprayed into the air', answer: 'liquid -> gas' },
      ],
      5
    )
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          Identify the change of state for each scenario. Draw the particles before and after the change.
        </p>
        <table className="w-full border border-slate-300 text-left text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-3 py-2">Scenario</th>
              <th className="px-3 py-2">State Change</th>
              <th className="px-3 py-2">Particle Diagram</th>
            </tr>
          </thead>
          <tbody>
            {scenarios.map((scenario, idx) => (
              <tr key={idx} className="border-t border-slate-200">
                <td className="px-3 py-2">{scenario.description}</td>
                <td className="px-3 py-2">{scenario.answer}</td>
                <td className="px-3 py-2">
                  <div className="h-12 rounded border border-dashed border-slate-300 bg-white" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  },
  'interactive-science-weather': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    const conditions = ['sunny', 'windy', 'rainy', 'stormy', 'foggy', 'partly cloudy', 'snowy']
    const tracker = days.map((day) => ({ day, condition: pick(rng, conditions), temp: Math.floor(rng() * 31) + 45 }) )
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          Track the week?s weather. Record the temperature, sketch the sky, and write one safety tip.
        </p>
        <table className="w-full border border-slate-300 text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-3 py-2">Day</th>
              <th className="px-3 py-2">Temperature</th>
              <th className="px-3 py-2">Sky Sketch</th>
              <th className="px-3 py-2">Safety Tip</th>
            </tr>
          </thead>
          <tbody>
            {tracker.map((entry, idx) => (
              <tr key={idx} className="border-t border-slate-200">
                <td className="px-3 py-2">{entry.day}</td>
                <td className="px-3 py-2">{entry.temp}?F</td>
                <td className="px-3 py-2">
                  <div className="h-12 rounded border border-dashed border-slate-300 bg-white" />
                  <p className="text-xs text-slate-500">{entry.condition}</p>
                </td>
                <td className="px-3 py-2">____________________________________</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  },
  'interactive-geography-map': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const letters = ['A', 'B', 'C', 'D', 'E', 'F']
    const numbers = [1, 2, 3, 4, 5, 6]
    const usedCells = new Set<string>()
    const placeIcons: Record<string, string> = {
      museum: 'M',
      'fire station': 'F',
      library: 'L',
      market: '$',
      park: 'P',
      bridge: 'B',
      'sports field': 'S',
      hospital: 'H',
    }
    const coordinates: Array<{ letter: string; number: number; place: string; icon: string }> = []
    const places = Object.keys(placeIcons)

    while (coordinates.length < 6) {
      const letter = pick(rng, letters)
      const number = pick(rng, numbers)
      const key = `${letter}${number}`
      if (usedCells.has(key)) continue
      usedCells.add(key)
      const place = pick(rng, places)
      coordinates.push({
        letter,
        number,
        place,
        icon: placeIcons[place] || '?',
      })
    }

    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          Plot each location on the grid below. Label and describe what is found at each spot.
        </p>
        <table className="w-full border border-slate-300 text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-3 py-2">Coordinate</th>
              <th className="px-3 py-2">Place</th>
              <th className="px-3 py-2">What do you notice there?</th>
            </tr>
          </thead>
          <tbody>
            {coordinates.map((row, idx) => (
              <tr key={idx} className="border-t border-slate-200">
                <td className="px-3 py-2">{row.letter}{row.number}</td>
                <td className="px-3 py-2 capitalize">{row.place}</td>
                <td className="px-3 py-2">____________________________________</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">Example map</p>
            <div className="overflow-hidden rounded-2xl border border-slate-300">
              <table className="w-full border-collapse text-xs">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="w-10 border border-slate-200 px-2 py-2" />
                    {letters.map((letter) => (
                      <th
                        key={`ex-head-${letter}`}
                        className="border border-slate-200 px-2 py-2 text-center font-semibold"
                      >
                        {letter}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {numbers.map((num) => (
                    <tr key={`ex-row-${num}`}>
                      <th className="border border-slate-200 px-2 py-2 text-center font-semibold bg-slate-50">
                        {num}
                      </th>
                      {letters.map((letter) => {
                        const match = coordinates.find(
                          (coord) => coord.letter === letter && coord.number === num
                        )
                        return (
                          <td
                            key={`ex-cell-${letter}${num}`}
                            className="h-10 border border-slate-200 text-center align-middle text-lg"
                          >
                            {match ? <span aria-label={match.place}>{match.icon}</span> : ''}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Use this sample to double-check coordinates and landmarks.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">Your map grid</p>
            <div className="overflow-hidden rounded-2xl border border-slate-300">
              <table className="w-full border-collapse text-xs">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="w-10 border border-slate-200 px-2 py-2" />
                    {letters.map((letter) => (
                      <th
                        key={`student-head-${letter}`}
                        className="border border-slate-200 px-2 py-2 text-center font-semibold"
                      >
                        {letter}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {numbers.map((num) => (
                    <tr key={`student-row-${num}`}>
                      <th className="border border-slate-200 px-2 py-2 text-center font-semibold bg-slate-50">
                        {num}
                      </th>
                      {letters.map((letter) => (
                        <td key={`student-cell-${letter}${num}`} className="h-10 border border-slate-200" />
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-1 text-xs text-slate-500">Draw landmarks, create a legend, and label each coordinate.</p>
          </div>
        </div>
      </div>
    )
  },
  'interactive-geography-culture': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const regions = pickMany(rng, ['Kenya', 'Peru', 'Japan', 'Norway', 'India', 'Brazil', 'Egypt', 'Canada'], 3)
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          Explore traditions from around the world. Research and note a food, celebration, and interesting fact for each region.
        </p>
        <table className="w-full border border-slate-300 text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-3 py-2">Region</th>
              <th className="px-3 py-2">Traditional Food</th>
              <th className="px-3 py-2">Celebration / Holiday</th>
              <th className="px-3 py-2">Interesting Fact</th>
            </tr>
          </thead>
          <tbody>
            {regions.map((region, idx) => (
              <tr key={idx} className="border-t border-slate-200">
                <td className="px-3 py-2">{region}</td>
                <td className="px-3 py-2">__________________</td>
                <td className="px-3 py-2">__________________</td>
                <td className="px-3 py-2">__________________</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  },
  'interactive-geography-history': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const themes = pickMany(rng, ['communication tools', 'transportation', 'space exploration', 'civil rights', 'technology inventions'], 1)
    const events = pickMany(
      rng,
      [
        { year: 1876, event: 'Telephone patented' },
        { year: 1903, event: 'First airplane flight' },
        { year: 1969, event: 'First moon landing' },
        { year: 1989, event: 'World Wide Web created' },
        { year: 1955, event: 'Rosa Parks bus protest' },
        { year: 2008, event: 'First touchscreen phone popularized' },
      ],
      4
    ).sort((a, b) => a.year - b.year)
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          Build a timeline about {themes[0]}. Place the events in order and explain the impact of each.
        </p>
        <div className="space-y-4">
          {events.map((entry, idx) => (
            <div key={idx} className="rounded border border-slate-200 bg-white p-4 text-sm text-slate-700">
              <p className="font-semibold text-slate-900">
                {entry.year}: {entry.event}
              </p>
              <p>Impact: ________________________________________</p>
            </div>
          ))}
        </div>
      </div>
    )
  },
  'interactive-grammar-parts': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const nouns = ['robot', 'teacher', 'river', 'backpack', 'galaxy', 'scientist']
    const verbs = ['whispers', 'builds', 'shimmers', 'protects', 'discovers', 'balances']
    const adjectives = ['curious', 'brave', 'glowing', 'silent', 'mysterious', 'playful']
    const sentences = Array.from({ length: 4 }).map(() => `${pick(rng, adjectives)} ${pick(rng, nouns)} ${pick(rng, verbs)} ___.`)
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          Label each underlined word as a noun, verb, adjective, or adverb. Add one more word to expand the sentence.
        </p>
        <ul className="space-y-2 text-sm text-slate-700">
          {sentences.map((sentence, idx) => (
            <li key={idx} className="rounded border border-slate-200 bg-white px-4 py-3">
              {sentence}
              <div className="mt-1 text-xs text-slate-500">Label: __________ • Extra word: __________</div>
            </li>
          ))}
        </ul>
      </div>
    )
  },
  'interactive-grammar-tenses': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const verbs = pickMany(rng, ['explore', 'finish', 'design', 'listen', 'organize', 'travel', 'collect'], 6)
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          Conjugate each verb in past, present, and future tense. Then use the verb in a sentence.
        </p>
        <table className="w-full border border-slate-300 text-left text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-3 py-2">Verb</th>
              <th className="px-3 py-2">Past</th>
              <th className="px-3 py-2">Present</th>
              <th className="px-3 py-2">Future</th>
            </tr>
          </thead>
          <tbody>
            {verbs.map((verb, idx) => (
              <tr key={idx} className="border-t border-slate-200">
                <td className="px-3 py-2">{verb}</td>
                <td className="px-3 py-2">________________</td>
                <td className="px-3 py-2">________________</td>
                <td className="px-3 py-2">________________</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-xs text-slate-500">Write one sentence using each tense below the table.</p>
      </div>
    )
  },
  'interactive-grammar-antonyms': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const pairs = pickMany(
      rng,
      [
        ['ancient', 'modern'],
        ['brisk', 'lazy'],
        ['cautious', 'bold'],
        ['dull', 'vibrant'],
        ['timid', 'confident'],
        ['polite', 'rude'],
      ],
      5
    )
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          Match each word to its antonym and use the pair in a sentence.
        </p>
        <table className="w-full border border-slate-300 text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-3 py-2">Word</th>
              <th className="px-3 py-2">Antonym</th>
              <th className="px-3 py-2">Sentence</th>
            </tr>
          </thead>
          <tbody>
            {pairs.map(([word, antonym], idx) => (
              <tr key={idx} className="border-t border-slate-200">
                <td className="px-3 py-2">{word}</td>
                <td className="px-3 py-2">{antonym}</td>
                <td className="px-3 py-2">________________________________________</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  },
  'interactive-art-design': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const coloringPages = pickMany(rng, [
      { title: 'Geometric Star', shape: 'star', description: 'Color the star pattern with your favorite colors!' },
      { title: 'Flower Pattern', shape: 'flower', description: 'Color the flower petals: pink, yellow, and purple' },
      { title: 'Rainbow Pattern', shape: 'rainbow', description: 'Color each stripe: red, orange, yellow, green, blue, purple' },
      { title: 'Heart Design', shape: 'heart', description: 'Color the hearts red and pink' },
      { title: 'Circle Mandala', shape: 'mandala', description: 'Color the circles with different colors' },
      { title: 'Leaf Pattern', shape: 'leaf', description: 'Color the leaves green' },
    ], 4)
    
    const ShapeSVG = ({ shape }: { shape: string }) => {
      const size = 250
      const strokeWidth = 4
      if (shape === 'star') {
        return (
          <svg width={size} height={size} viewBox="0 0 250 250" className="mx-auto">
            <polygon points="125,20 145,90 220,90 160,135 175,210 125,170 75,210 90,135 30,90 105,90" 
              fill="none" stroke="#333" strokeWidth={strokeWidth} />
          </svg>
        )
      }
      if (shape === 'flower') {
        return (
          <svg width={size} height={size} viewBox="0 0 250 250" className="mx-auto">
            <circle cx="125" cy="125" r="50" fill="none" stroke="#333" strokeWidth={strokeWidth} />
            <ellipse cx="125" cy="60" rx="30" ry="40" fill="none" stroke="#333" strokeWidth={strokeWidth} />
            <ellipse cx="125" cy="190" rx="30" ry="40" fill="none" stroke="#333" strokeWidth={strokeWidth} />
            <ellipse cx="60" cy="125" rx="40" ry="30" fill="none" stroke="#333" strokeWidth={strokeWidth} />
            <ellipse cx="190" cy="125" rx="40" ry="30" fill="none" stroke="#333" strokeWidth={strokeWidth} />
            <ellipse cx="85" cy="85" rx="25" ry="35" fill="none" stroke="#333" strokeWidth={strokeWidth} />
            <ellipse cx="165" cy="85" rx="25" ry="35" fill="none" stroke="#333" strokeWidth={strokeWidth} />
            <ellipse cx="85" cy="165" rx="25" ry="35" fill="none" stroke="#333" strokeWidth={strokeWidth} />
            <ellipse cx="165" cy="165" rx="25" ry="35" fill="none" stroke="#333" strokeWidth={strokeWidth} />
          </svg>
        )
      }
      if (shape === 'rainbow') {
        return (
          <svg width={size} height={size} viewBox="0 0 250 250" className="mx-auto">
            <path d="M 40 170 Q 125 40, 210 170" fill="none" stroke="#333" strokeWidth={strokeWidth} />
            <path d="M 50 160 Q 125 50, 200 160" fill="none" stroke="#333" strokeWidth={strokeWidth} />
            <path d="M 60 150 Q 125 60, 190 150" fill="none" stroke="#333" strokeWidth={strokeWidth} />
            <path d="M 70 140 Q 125 70, 180 140" fill="none" stroke="#333" strokeWidth={strokeWidth} />
            <path d="M 80 130 Q 125 80, 170 130" fill="none" stroke="#333" strokeWidth={strokeWidth} />
            <path d="M 90 120 Q 125 90, 160 120" fill="none" stroke="#333" strokeWidth={strokeWidth} />
          </svg>
        )
      }
      if (shape === 'heart') {
        return (
          <svg width={size} height={size} viewBox="0 0 250 250" className="mx-auto">
            <path d="M 125 210 C 125 210, 40 145, 40 105 C 40 75, 70 60, 105 85 C 115 50, 145 40, 165 60 C 195 40, 210 75, 210 105 C 210 145, 125 210, 125 210 Z" 
              fill="none" stroke="#333" strokeWidth={strokeWidth} />
            <path d="M 85 105 C 85 105, 105 95, 115 105 C 125 95, 145 105, 145 105" 
              fill="none" stroke="#333" strokeWidth={strokeWidth} />
          </svg>
        )
      }
      if (shape === 'mandala') {
        return (
          <svg width={size} height={size} viewBox="0 0 250 250" className="mx-auto">
            <circle cx="125" cy="125" r="105" fill="none" stroke="#333" strokeWidth={strokeWidth} />
            <circle cx="125" cy="125" r="85" fill="none" stroke="#333" strokeWidth={strokeWidth} />
            <circle cx="125" cy="125" r="65" fill="none" stroke="#333" strokeWidth={strokeWidth} />
            <circle cx="125" cy="125" r="45" fill="none" stroke="#333" strokeWidth={strokeWidth} />
            <circle cx="125" cy="125" r="25" fill="none" stroke="#333" strokeWidth={strokeWidth} />
            <line x1="125" y1="20" x2="125" y2="230" stroke="#333" strokeWidth={strokeWidth} />
            <line x1="20" y1="125" x2="230" y2="125" stroke="#333" strokeWidth={strokeWidth} />
            <line x1="40" y1="40" x2="210" y2="210" stroke="#333" strokeWidth={strokeWidth} />
            <line x1="210" y1="40" x2="40" y2="210" stroke="#333" strokeWidth={strokeWidth} />
          </svg>
        )
      }
      if (shape === 'leaf') {
        return (
          <svg width={size} height={size} viewBox="0 0 250 250" className="mx-auto">
            <path d="M 125 40 Q 85 85, 60 125 Q 40 165, 85 210 Q 125 190, 125 210 Q 125 190, 165 210 Q 210 165, 190 125 Q 170 85, 125 40 Z" 
              fill="none" stroke="#333" strokeWidth={strokeWidth} />
            <line x1="125" y1="40" x2="125" y2="210" stroke="#333" strokeWidth={strokeWidth} />
            <path d="M 105 105 Q 95 110, 105 120" fill="none" stroke="#333" strokeWidth="3" />
            <path d="M 145 105 Q 155 110, 145 120" fill="none" stroke="#333" strokeWidth="3" />
            <path d="M 110 130 Q 105 140, 110 150" fill="none" stroke="#333" strokeWidth="3" />
            <path d="M 140 130 Q 145 140, 140 150" fill="none" stroke="#333" strokeWidth="3" />
          </svg>
        )
      }
      return null
    }
    
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          Color each pattern! Use your favorite colors and make it beautiful.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {coloringPages.map((page, idx) => (
            <div key={idx} className="rounded-xl border border-purple-200 bg-white p-4">
              <p className="text-sm font-semibold text-slate-700 mb-1">{page.title}</p>
              <p className="text-xs text-slate-600 mb-3">{page.description}</p>
              <div className="mt-3 min-h-[280px] rounded border-2 border-dashed border-purple-300 bg-white flex items-center justify-center p-4">
                <ShapeSVG shape={page.shape} />
              </div>
              <p className="mt-2 text-xs text-purple-600 text-center">Color inside the shape!</p>
            </div>
          ))}
        </div>
      </div>
    )
  },
  'interactive-art-colorwheel': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const coloringActivities = pickMany(rng, [
      { item: 'Apple', color: 'red', shape: 'circle' },
      { item: 'Sun', color: 'yellow', shape: 'circle' },
      { item: 'Leaf', color: 'green', shape: 'leaf' },
      { item: 'Sky', color: 'blue', shape: 'rectangle' },
      { item: 'Flower', color: 'purple', shape: 'flower' },
      { item: 'Orange Fruit', color: 'orange', shape: 'circle' },
    ], 6)
    
    const ColorShapeSVG = ({ shape, color }: { shape: string; color: string }) => {
      const size = 200
      const strokeWidth = 4
      if (shape === 'circle') {
        return (
          <svg width={size} height={size} viewBox="0 0 200 200" className="mx-auto">
            <circle cx="100" cy="100" r="80" fill="none" stroke="#333" strokeWidth={strokeWidth} />
          </svg>
        )
      }
      if (shape === 'rectangle') {
        return (
          <svg width={size} height={size} viewBox="0 0 200 200" className="mx-auto">
            <rect x="20" y="20" width="160" height="160" rx="10" fill="none" stroke="#333" strokeWidth={strokeWidth} />
          </svg>
        )
      }
      if (shape === 'leaf') {
        return (
          <svg width={size} height={size} viewBox="0 0 200 200" className="mx-auto">
            <path d="M 100 20 Q 60 60, 40 100 Q 20 140, 60 170 Q 100 160, 100 180 Q 100 160, 140 170 Q 180 140, 160 100 Q 140 60, 100 20 Z" 
              fill="none" stroke="#333" strokeWidth={strokeWidth} />
            <line x1="100" y1="20" x2="100" y2="180" stroke="#333" strokeWidth={strokeWidth} />
            <path d="M 90 90 Q 85 95, 90 100" fill="none" stroke="#333" strokeWidth="3" />
            <path d="M 110 90 Q 115 95, 110 100" fill="none" stroke="#333" strokeWidth="3" />
          </svg>
        )
      }
      if (shape === 'flower') {
        return (
          <svg width={size} height={size} viewBox="0 0 200 200" className="mx-auto">
            <circle cx="100" cy="100" r="40" fill="none" stroke="#333" strokeWidth={strokeWidth} />
            <ellipse cx="100" cy="50" rx="24" ry="30" fill="none" stroke="#333" strokeWidth={strokeWidth} />
            <ellipse cx="100" cy="150" rx="24" ry="30" fill="none" stroke="#333" strokeWidth={strokeWidth} />
            <ellipse cx="50" cy="100" rx="30" ry="24" fill="none" stroke="#333" strokeWidth={strokeWidth} />
            <ellipse cx="150" cy="100" rx="30" ry="24" fill="none" stroke="#333" strokeWidth={strokeWidth} />
          </svg>
        )
      }
      return null
    }
    
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          Color each shape with the correct color! Practice your colors.
        </p>
        <div className="grid gap-3 grid-cols-2 md:grid-cols-3">
          {coloringActivities.map((activity, idx) => (
            <div key={idx} className="rounded-xl border-2 border-slate-200 bg-white p-4 text-center">
              <p className="text-sm font-semibold text-slate-700 capitalize mb-1">{activity.item}</p>
              <p className="text-xs text-slate-600 mb-2">Color: <span className="font-semibold capitalize" style={{ color: activity.color }}>{activity.color}</span></p>
              <div className="min-h-[240px] rounded border-2 border-dashed border-slate-300 bg-white flex items-center justify-center my-2 p-4">
                <ColorShapeSVG shape={activity.shape} color={activity.color} />
              </div>
              <p className="text-xs text-slate-500">Color inside the shape!</p>
            </div>
          ))}
        </div>
      </div>
    )
  },
  'interactive-art-sketch': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const drawingPrompts = pickMany(rng, [
      { prompt: 'Draw a beautiful flower', emoji: '🌺', hint: 'Add petals and a stem!' },
      { prompt: 'Draw a tree with leaves', emoji: '🌳', hint: 'Make it big and green!' },
      { prompt: 'Draw geometric shapes', emoji: '⬜', hint: 'Draw circles, squares, and triangles!' },
      { prompt: 'Draw a rainbow', emoji: '🌈', hint: 'Use all the colors!' },
      { prompt: 'Draw a pattern', emoji: '✨', hint: 'Create your own design!' },
      { prompt: 'Draw a garden scene', emoji: '🌻', hint: 'Add flowers and plants!' },
    ], 3)
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          Draw each picture! Take your time and use your imagination.
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          {drawingPrompts.map((item, idx) => (
            <div key={idx} className="rounded-xl border-2 border-purple-200 bg-purple-50 p-4">
              <p className="text-2xl mb-2">{item.emoji}</p>
              <p className="text-sm font-semibold text-slate-700 mb-1">{item.prompt}</p>
              <p className="text-xs text-slate-600 mb-3">{item.hint}</p>
              <div className="h-32 rounded border-2 border-dashed border-purple-300 bg-white" />
              <p className="mt-2 text-xs text-purple-600 text-center">Draw here!</p>
            </div>
          ))}
        </div>
      </div>
    )
  },
  'interactive-early-phonics': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const sounds = pickMany(rng, ['m', 's', 't', 'b', 'p', 'n', 'f', 'r'], 4)
    const words = {
      m: ['moon', 'map', 'mouse'],
      s: ['sun', 'sock', 'seal'],
      t: ['tree', 'toy', 'turtle'],
      b: ['ball', 'bus', 'bug'],
      p: ['panda', 'pie', 'pen'],
      n: ['nest', 'net', 'nose'],
      f: ['fish', 'fan', 'frog'],
      r: ['rain', 'robot', 'ring'],
    } as Record<string, string[]>
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          Say the sound, trace the letter, then draw a picture that starts with it.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {sounds.map((sound) => (
            <div key={sound} className="rounded-xl border border-rose-200 bg-rose-50 p-4">
              <p className="text-lg font-semibold text-rose-700">Letter: {sound.toUpperCase()}</p>
              <div className="mt-2 flex gap-3">
                <div className="flex-1">
                  <p className="text-xs uppercase text-rose-500">Trace</p>
                  <div className="mt-1 h-16 rounded border border-dashed border-rose-300 bg-white" />
                </div>
                <div className="flex-1">
                  <p className="text-xs uppercase text-rose-500">Draw</p>
                  <div className="mt-1 h-16 rounded border border-dashed border-rose-300 bg-white" />
                </div>
              </div>
              <p className="mt-2 text-xs text-rose-700">Try these words: {words[sound].join(', ')}</p>
            </div>
          ))}
        </div>
      </div>
    )
  },
  'interactive-early-counting': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const rows = Array.from({ length: 4 }).map(() => ({
      objects: pick(rng, ['stars', 'shells', 'dice', 'hearts', 'cars']),
      count: Math.floor(rng() * 7) + 3,
    }))
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          Count the objects, draw them in ten frames, then write the number and number word.
        </p>
        <div className="space-y-3 text-sm text-slate-700">
          {rows.map((row, idx) => (
            <div key={idx} className="rounded border border-emerald-200 bg-emerald-50 p-3">
              <p className="font-semibold text-emerald-800">Count {row.count} {row.objects}</p>
              <div className="mt-2 grid grid-cols-10 gap-1">
                {Array.from({ length: 10 }).map((_, boxIdx) => (
                  <div
                    key={boxIdx}
                    className={`h-8 border ${boxIdx < row.count ? 'bg-emerald-200 border-emerald-400' : 'border-emerald-200'}`}
                  />
                ))}
              </div>
              <p className="mt-2 text-xs text-emerald-700">Number: ______ • Word: __________________</p>
            </div>
          ))}
        </div>
      </div>
    )
  },
  'interactive-early-patterns': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const patterns = pickMany(rng, ['AB', 'AAB', 'ABC', 'ABB', 'AABB'], 4)
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          Continue each pattern and create your own using shapes, colors, or stickers.
        </p>
        <div className="space-y-3">
          {patterns.map((pattern, idx) => {
            const first = pick(rng, SHAPE_TOKENS)
            const second = pick(rng, SHAPE_TOKENS.filter((token) => token.key !== first.key))
            const third = pick(
              rng,
              SHAPE_TOKENS.filter((token) => token.key !== first.key && token.key !== second.key)
            )
            const previewTokens = pattern
              .split('')
              .map((char) => (char === 'A' ? first : char === 'B' ? second : third))
            return (
              <div key={idx} className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-xs uppercase text-slate-500">Pattern {pattern}</p>
                <div className="mt-3 flex items-center gap-2">
                  {previewTokens.map((token, tokenIdx) => (
                    <span
                      key={`${token.key}-${tokenIdx}`}
                      className="relative inline-flex items-center justify-center"
                    >
                      <span className="sr-only">{token.label}</span>
                      {token.render}
                    </span>
                  ))}
                  <span className="text-lg font-semibold text-slate-400">?</span>
                </div>
                <div className="mt-2 h-10 rounded border border-dashed border-slate-300" />
                <p className="mt-2 text-xs text-slate-500">
                  Try building your own using:{' '}
                  <span className="font-medium text-slate-700">
                    {first.label}, {second.label}
                    {previewTokens.length > 2 ? `, ${third.label}` : ''}
                  </span>
                </p>
              </div>
            )
          })}
        </div>
      </div>
    )
  },
  'interactive-early-shapes': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const shapes = pickMany(rng, ['circle', 'square', 'triangle', 'rectangle', 'star', 'heart'], 4)
    const colors = pickMany(rng, ['red', 'blue', 'yellow', 'green', 'purple', 'orange'], 4)
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          Identify each shape, color it, then sort shapes by type and color.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {shapes.map((shape, idx) => (
            <div key={idx} className="rounded-xl border border-purple-200 bg-purple-50 p-4">
              <p className="text-sm font-semibold text-purple-700">Shape {idx + 1}: {shape}</p>
              <div className="mt-2 h-20 rounded border border-dashed border-purple-300 bg-white" />
              <p className="mt-2 text-xs text-purple-600">Color: {colors[idx]}</p>
              <p className="mt-1 text-xs text-purple-600">Draw 2 more {shape}s below:</p>
              <div className="mt-1 flex gap-2">
                <div className="h-12 w-12 rounded border border-dashed border-purple-300" />
                <div className="h-12 w-12 rounded border border-dashed border-purple-300" />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-xl border border-purple-200 bg-purple-50 p-4">
          <p className="text-sm font-semibold text-purple-700">Sorting Activity</p>
          <p className="mt-2 text-xs text-purple-600">Sort by shape: ________________________________</p>
          <p className="mt-1 text-xs text-purple-600">Sort by color: ________________________________</p>
        </div>
      </div>
    )
  },
  'interactive-early-letters': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const letters = pickMany(rng, ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'], 4)
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          Trace each letter, then write it 3 times. Draw a picture that starts with that letter.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {letters.map((letter) => (
            <div key={letter} className="rounded-xl border border-blue-200 bg-blue-50 p-4">
              <p className="text-lg font-semibold text-blue-700">{letter} / {letter.toLowerCase()}</p>
              <div className="mt-2 grid grid-cols-3 gap-2">
                <div className="flex flex-col">
                  <p className="text-xs text-blue-500">Trace</p>
                  <div className="mt-1 h-16 rounded border border-dashed border-blue-300 bg-white" />
                </div>
                <div className="flex flex-col">
                  <p className="text-xs text-blue-500">Write</p>
                  <div className="mt-1 h-16 rounded border border-dashed border-blue-300 bg-white" />
                </div>
                <div className="flex flex-col">
                  <p className="text-xs text-blue-500">Draw</p>
                  <div className="mt-1 h-16 rounded border border-dashed border-blue-300 bg-white" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  },
  'interactive-early-numbers': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const numbers = pickMany(rng, Array.from({ length: 20 }, (_, i) => i + 1), 4)
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          Trace each number, write it, then draw that many objects.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {numbers.map((num) => (
            <div key={num} className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <p className="text-lg font-semibold text-emerald-700">Number: {num}</p>
              <div className="mt-2 grid grid-cols-3 gap-2">
                <div className="flex flex-col">
                  <p className="text-xs text-emerald-500">Trace</p>
                  <div className="mt-1 h-12 rounded border border-dashed border-emerald-300 bg-white text-center text-lg font-bold text-emerald-700">{num}</div>
                </div>
                <div className="flex flex-col">
                  <p className="text-xs text-emerald-500">Write</p>
                  <div className="mt-1 h-12 rounded border border-dashed border-emerald-300 bg-white" />
                </div>
                <div className="flex flex-col">
                  <p className="text-xs text-emerald-500">Draw {num}</p>
                  <div className="mt-1 h-12 rounded border border-dashed border-emerald-300 bg-white" />
                </div>
              </div>
              <p className="mt-2 text-xs text-emerald-600">Number word: {numberWords[num - 1] || num}</p>
            </div>
          ))}
        </div>
      </div>
    )
  },
  'interactive-early-foundations': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const activities = [
      { type: 'letter', items: pickMany(rng, ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'], 4) },
      { type: 'number', items: pickMany(rng, Array.from({ length: 10 }, (_, i) => i + 1), 4) },
      { type: 'shape', items: pickMany(rng, ['circle', 'square', 'triangle', 'star'], 4) },
    ]
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          Review basic skills: identify letters, numbers, and shapes. Perfect for remediation or review.
        </p>
        {activities.map((activity, actIdx) => (
          <div key={actIdx} className="rounded-xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm font-semibold text-amber-700">Review: {activity.type}s</p>
            <div className="mt-2 flex flex-wrap gap-3">
              {activity.items.map((item, idx) => (
                <div key={idx} className="rounded border border-amber-300 bg-white px-4 py-2 text-center">
                  <p className="font-semibold text-amber-800">{item}</p>
                  <p className="mt-1 text-xs text-amber-600">Identify: ______</p>
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-semibold text-amber-700">Practice Writing</p>
          <p className="mt-2 text-xs text-amber-600">Write your name: ________________________</p>
          <p className="mt-1 text-xs text-amber-600">Count to 10: ________________________________</p>
        </div>
      </div>
    )
  },
  'interactive-early-basics': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const skills = [
      { skill: 'Letter Sounds', examples: pickMany(rng, ['A says /a/', 'B says /b/', 'C says /c/', 'D says /d/'], 3) },
      { skill: 'Counting', examples: pickMany(rng, ['Count 1-5', 'Count 5-10', 'Count objects'], 3) },
      { skill: 'Patterns', examples: pickMany(rng, ['AB pattern', 'ABC pattern', 'Color patterns'], 3) },
    ]
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          Essential early learning skills review. Practice letter sounds, counting, and basic patterns.
        </p>
        {skills.map((skillGroup, idx) => (
          <div key={idx} className="rounded-xl border border-indigo-200 bg-indigo-50 p-4">
            <p className="text-sm font-semibold text-indigo-700">{skillGroup.skill}</p>
            <div className="mt-2 space-y-2">
              {skillGroup.examples.map((example, exIdx) => (
                <div key={exIdx} className="rounded border border-indigo-300 bg-white px-3 py-2">
                  <p className="text-xs text-indigo-800">{example}</p>
                  <div className="mt-1 h-8 rounded border border-dashed border-indigo-300" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  },
  'interactive-reading-prek': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const stories = pickMany(
      rng,
      [
        { 
          title: 'The Red Car', 
          images: [
            { name: 'car', svg: <svg width="80" height="60" viewBox="0 0 80 60"><rect x="10" y="25" width="60" height="25" rx="3" fill="none" stroke="#333" strokeWidth="2"/><rect x="15" y="15" width="50" height="15" rx="2" fill="none" stroke="#333" strokeWidth="2"/><circle cx="20" cy="50" r="8" fill="none" stroke="#333" strokeWidth="2"/><circle cx="60" cy="50" r="8" fill="none" stroke="#333" strokeWidth="2"/></svg> },
            { name: 'road', svg: <svg width="80" height="60" viewBox="0 0 80 60"><rect x="0" y="25" width="80" height="10" fill="none" stroke="#333" strokeWidth="2"/><line x1="10" y1="30" x2="20" y2="30" stroke="#333" strokeWidth="1"/><line x1="30" y1="30" x2="40" y2="30" stroke="#333" strokeWidth="1"/><line x1="50" y1="30" x2="60" y2="30" stroke="#333" strokeWidth="1"/><line x1="70" y1="30" x2="80" y2="30" stroke="#333" strokeWidth="1"/></svg> },
            { name: 'tree', svg: <svg width="60" height="80" viewBox="0 0 60 80"><rect x="25" y="50" width="10" height="30" fill="none" stroke="#333" strokeWidth="2"/><ellipse cx="30" cy="40" rx="20" ry="25" fill="none" stroke="#333" strokeWidth="2"/></svg> }
          ], 
          questions: ['Do you see a car?', 'Is the car on the road?'] 
        },
        { 
          title: 'The Sunny Day', 
          images: [
            { name: 'sun', svg: <svg width="70" height="70" viewBox="0 0 70 70"><circle cx="35" cy="35" r="20" fill="none" stroke="#333" strokeWidth="2"/><line x1="35" y1="5" x2="35" y2="15" stroke="#333" strokeWidth="2"/><line x1="35" y1="55" x2="35" y2="65" stroke="#333" strokeWidth="2"/><line x1="5" y1="35" x2="15" y2="35" stroke="#333" strokeWidth="2"/><line x1="55" y1="35" x2="65" y2="35" stroke="#333" strokeWidth="2"/><line x1="12" y1="12" x2="18" y2="18" stroke="#333" strokeWidth="2"/><line x1="52" y1="52" x2="58" y2="58" stroke="#333" strokeWidth="2"/><line x1="52" y1="12" x2="58" y2="18" stroke="#333" strokeWidth="2"/><line x1="12" y1="52" x2="18" y2="58" stroke="#333" strokeWidth="2"/></svg> },
            { name: 'flower', svg: <svg width="60" height="70" viewBox="0 0 60 70"><line x1="30" y1="50" x2="30" y2="70" stroke="#333" strokeWidth="2"/><circle cx="30" cy="30" r="12" fill="none" stroke="#333" strokeWidth="2"/><ellipse cx="30" cy="15" rx="8" ry="10" fill="none" stroke="#333" strokeWidth="2"/><ellipse cx="30" cy="45" rx="8" ry="10" fill="none" stroke="#333" strokeWidth="2"/><ellipse cx="15" cy="30" rx="10" ry="8" fill="none" stroke="#333" strokeWidth="2"/><ellipse cx="45" cy="30" rx="10" ry="8" fill="none" stroke="#333" strokeWidth="2"/></svg> },
            { name: 'ball', svg: <svg width="60" height="60" viewBox="0 0 60 60"><circle cx="30" cy="30" r="25" fill="none" stroke="#333" strokeWidth="2"/><path d="M 30 5 Q 15 15, 5 30 Q 15 45, 30 55 Q 45 45, 55 30 Q 45 15, 30 5" fill="none" stroke="#333" strokeWidth="1.5"/></svg> }
          ], 
          questions: ['Do you see the sun?', 'Is there a flower?'] 
        },
        { 
          title: 'The Big Tree', 
          images: [
            { name: 'tree', svg: <svg width="60" height="80" viewBox="0 0 60 80"><rect x="25" y="50" width="10" height="30" fill="none" stroke="#333" strokeWidth="2"/><ellipse cx="30" cy="40" rx="20" ry="25" fill="none" stroke="#333" strokeWidth="2"/></svg> },
            { name: 'house', svg: <svg width="70" height="70" viewBox="0 0 70 70"><rect x="15" y="35" width="40" height="35" fill="none" stroke="#333" strokeWidth="2"/><polygon points="15,35 35,15 55,35" fill="none" stroke="#333" strokeWidth="2"/><rect x="25" y="45" width="12" height="20" fill="none" stroke="#333" strokeWidth="2"/><rect x="42" y="50" width="8" height="8" fill="none" stroke="#333" strokeWidth="2"/></svg> },
            { name: 'flower', svg: <svg width="50" height="60" viewBox="0 0 50 60"><line x1="25" y1="40" x2="25" y2="60" stroke="#333" strokeWidth="2"/><circle cx="25" cy="25" r="10" fill="none" stroke="#333" strokeWidth="2"/><ellipse cx="25" cy="12" rx="6" ry="8" fill="none" stroke="#333" strokeWidth="2"/><ellipse cx="25" cy="38" rx="6" ry="8" fill="none" stroke="#333" strokeWidth="2"/><ellipse cx="12" cy="25" rx="8" ry="6" fill="none" stroke="#333" strokeWidth="2"/><ellipse cx="38" cy="25" rx="8" ry="6" fill="none" stroke="#333" strokeWidth="2"/></svg> }
          ], 
          questions: ['Is the tree big?', 'Do you see a house?'] 
        },
      ],
      3
    )
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-600">
          Look at the pictures and answer yes/no questions about the story.
        </p>
        {stories.map((story, idx) => (
          <div key={idx} className="rounded-xl border border-rose-200 bg-rose-50 p-4">
            <p className="text-sm font-semibold text-rose-700 mb-3">{story.title}</p>
            <div className="mt-2 flex gap-3 justify-center flex-wrap">
              {story.images.map((img, imgIdx) => (
                <div key={imgIdx} className="flex flex-col items-center">
                  <div className="h-20 w-20 rounded border-2 border-rose-300 bg-white flex items-center justify-center p-2">
                    {img.svg}
                  </div>
                  <p className="text-xs text-rose-600 mt-1 capitalize">{img.name}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-2">
              {story.questions.map((q, qIdx) => (
                <div key={qIdx} className="text-xs text-rose-700">
                  {q} <span className="text-rose-500 font-semibold">Yes / No</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  },
  'interactive-writing-prek': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const prompts = pickMany(
      rng,
      [
        { word: 'cat', picture: 'Draw a cat' },
        { word: 'dog', picture: 'Draw a dog' },
        { word: 'sun', picture: 'Draw the sun' },
        { word: 'car', picture: 'Draw a car' },
        { word: 'tree', picture: 'Draw a tree' },
        { word: 'flower', picture: 'Draw a flower' },
      ],
      4
    )
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          Draw a picture and label it with the word. Perfect for early writers.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {prompts.map((prompt, idx) => (
            <div key={idx} className="rounded-xl border border-green-200 bg-green-50 p-4">
              <p className="text-sm font-semibold text-green-700">Word: {prompt.word}</p>
              <div className="mt-2">
                <p className="text-xs text-green-600">{prompt.picture}</p>
                <div className="mt-1 h-24 rounded border border-dashed border-green-300 bg-white" />
              </div>
              <p className="mt-2 text-xs text-green-600">Label: <span className="font-semibold">{prompt.word}</span></p>
              <div className="mt-1 h-8 rounded border border-dashed border-green-300 bg-white" />
            </div>
          ))}
        </div>
      </div>
    )
  },
  'interactive-science-prek': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const observations = pickMany(
      rng,
      [
        { topic: 'Plants', question: 'What do plants need?', options: ['water', 'sun', 'soil'] },
        { topic: 'Animals', question: 'Where do animals live?', options: ['forest', 'ocean', 'farm'] },
        { topic: 'Weather', question: 'What is the weather like?', options: ['sunny', 'rainy', 'cloudy'] },
        { topic: 'Seasons', question: 'What season is it?', options: ['spring', 'summer', 'fall', 'winter'] },
      ],
      3
    )
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          Simple nature observation activities with pictures and basic questions.
        </p>
        {observations.map((obs, idx) => (
          <div key={idx} className="rounded-xl border border-teal-200 bg-teal-50 p-4">
            <p className="text-sm font-semibold text-teal-700">{obs.topic}</p>
            <div className="mt-2 h-20 rounded border border-teal-300 bg-white">
              <p className="p-2 text-xs text-teal-600">Draw or paste a picture</p>
            </div>
            <p className="mt-2 text-xs text-teal-700">{obs.question}</p>
            <div className="mt-1 flex flex-wrap gap-2">
              {obs.options.map((opt, optIdx) => (
                <span key={optIdx} className="rounded border border-teal-300 bg-white px-2 py-1 text-xs text-teal-700">
                  {opt}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  },
  'interactive-science-space': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const planets = pickMany(
      rng,
      [
        { name: 'Mercury', fact: 'Closest to the sun', distance: '36 million miles' },
        { name: 'Venus', fact: 'Hottest planet', distance: '67 million miles' },
        { name: 'Mars', fact: 'The red planet', distance: '142 million miles' },
        { name: 'Jupiter', fact: 'Largest planet', distance: '484 million miles' },
      ],
      4
    )
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          Learn about planets, stars, and space phenomena with interactive activities.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {planets.map((planet, idx) => (
            <div key={idx} className="rounded-xl border border-indigo-200 bg-indigo-50 p-4">
              <p className="text-sm font-semibold text-indigo-700">{planet.name}</p>
              <div className="mt-2 h-16 rounded border border-indigo-300 bg-white">
                <p className="p-2 text-xs text-indigo-600">Draw {planet.name}</p>
              </div>
              <p className="mt-2 text-xs text-indigo-700">Fact: {planet.fact}</p>
              <p className="mt-1 text-xs text-indigo-600">Distance from sun: {planet.distance}</p>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4">
          <p className="text-sm font-semibold text-indigo-700">Space Questions</p>
          <p className="mt-2 text-xs text-indigo-700">What is a star? ________________________</p>
          <p className="mt-1 text-xs text-indigo-700">Name one planet: ________________________</p>
        </div>
      </div>
    )
  },
  'interactive-geography-prek': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const places = pickMany(
      rng,
      [
        { name: 'Home', type: 'Where I live', features: ['bedroom', 'kitchen'] },
        { name: 'School', type: 'Where I learn', features: ['classroom', 'playground'] },
        { name: 'Park', type: 'Where I play', features: ['swings', 'slides'] },
      ],
      3
    )
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          Learn about places in the community, home, and school with simple maps and pictures.
        </p>
        {places.map((place, idx) => (
          <div key={idx} className="rounded-xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm font-semibold text-amber-700">{place.name}</p>
            <p className="text-xs text-amber-600">{place.type}</p>
            <div className="mt-2 h-16 rounded border border-amber-300 bg-white">
              <p className="p-2 text-xs text-amber-600">Draw a simple map</p>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {place.features.map((feature, featIdx) => (
                <span key={featIdx} className="rounded border border-amber-300 bg-white px-2 py-1 text-xs text-amber-700">
                  {feature}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  },
  'interactive-grammar-prek': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const words = pickMany(
      rng,
      [
        { word: 'cat', picture: '🐱' },
        { word: 'dog', picture: '🐶' },
        { word: 'sun', picture: '☀️' },
        { word: 'car', picture: '🚗' },
        { word: 'tree', picture: '🌳' },
        { word: 'flower', picture: '🌸' },
      ],
      4
    )
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          Match simple words with pictures and identify basic word types.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {words.map((item, idx) => (
            <div key={idx} className="rounded-xl border border-purple-200 bg-purple-50 p-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{item.picture}</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-purple-700">Word: {item.word}</p>
                  <p className="mt-1 text-xs text-purple-600">Match: <span className="font-semibold">{item.word}</span></p>
                  <div className="mt-1 h-8 rounded border border-dashed border-purple-300 bg-white" />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-purple-200 bg-purple-50 p-4">
          <p className="text-sm font-semibold text-purple-700">Word Practice</p>
          <p className="mt-2 text-xs text-purple-700">Circle the word that matches the picture:</p>
          <div className="mt-1 flex flex-wrap gap-2">
            {words.map((item, idx) => (
              <span key={idx} className="rounded border border-purple-300 bg-white px-3 py-1 text-xs text-purple-700">
                {item.word}
              </span>
            ))}
          </div>
        </div>
      </div>
    )
  },
  'interactive-logic-prek': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const patterns = pickMany(rng, ['AB', 'AAB', 'ABC'], 3)
    const sortingItems = pickMany(rng, ['red', 'blue', 'yellow', 'big', 'small', 'round', 'square'], 6)
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          Complete simple patterns and sort objects by color, size, or type.
        </p>
        <div className="space-y-3">
          {patterns.map((pattern, idx) => {
            const first = pick(rng, SHAPE_TOKENS)
            const second = pick(rng, SHAPE_TOKENS.filter((token) => token.key !== first.key))
            const third = pattern === 'ABC' ? pick(rng, SHAPE_TOKENS.filter((token) => token.key !== first.key && token.key !== second.key)) : second
            const previewTokens = pattern.split('').map((char) => (char === 'A' ? first : char === 'B' ? second : third))
            return (
              <div key={idx} className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-xs uppercase text-slate-500">Pattern {pattern}</p>
                <div className="mt-3 flex items-center gap-2">
                  {previewTokens.map((token, tokenIdx) => (
                    <span key={`${token.key}-${tokenIdx}`} className="relative inline-flex items-center justify-center">
                      <span className="sr-only">{token.label}</span>
                      {token.render}
                    </span>
                  ))}
                  <span className="text-lg font-semibold text-slate-400">?</span>
                </div>
                <div className="mt-2 h-10 rounded border border-dashed border-slate-300" />
              </div>
            )
          })}
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm font-semibold text-slate-700">Sorting Activity</p>
          <p className="mt-2 text-xs text-slate-600">Sort by color: {sortingItems.slice(0, 3).join(', ')}</p>
          <p className="mt-1 text-xs text-slate-600">Sort by size: {sortingItems.slice(3, 5).join(', ')}</p>
          <p className="mt-1 text-xs text-slate-600">Sort by shape: {sortingItems.slice(5).join(', ')}</p>
        </div>
      </div>
    )
  },
  'interactive-sel-prek': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const feelings = pickMany(
      rng,
      [
        { feeling: 'happy', emoji: '😊', color: 'yellow' },
        { feeling: 'sad', emoji: '😢', color: 'blue' },
        { feeling: 'angry', emoji: '😠', color: 'red' },
        { feeling: 'excited', emoji: '🤩', color: 'orange' },
      ],
      4
    )
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          Identify and express feelings through pictures, simple words, and activities.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {feelings.map((feeling, idx) => (
            <div key={idx} className="rounded-xl border border-pink-200 bg-pink-50 p-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{feeling.emoji}</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-pink-700">Feeling: {feeling.feeling}</p>
                  <p className="text-xs text-pink-600">Color: {feeling.color}</p>
                </div>
              </div>
              <div className="mt-2 h-12 rounded border border-dashed border-pink-300 bg-white">
                <p className="p-2 text-xs text-pink-600">Draw a time you felt {feeling.feeling}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-pink-200 bg-pink-50 p-4">
          <p className="text-sm font-semibold text-pink-700">How I Feel Today</p>
          <div className="mt-2 flex gap-2">
            {feelings.map((feeling, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <span className="text-2xl">{feeling.emoji}</span>
                <div className="mt-1 h-4 w-4 rounded border border-pink-300" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  },
  'interactive-logic-sequence': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const tasks = pickMany(
      rng,
      [
        ['Mix batter', 'Pour into pan', 'Bake', 'Decorate'],
        ['Plant seed', 'Water daily', 'Sprout appears', 'Measure growth'],
        ['Pack backpack', 'Catch the bus', 'Arrive at museum', 'Meet the guide'],
        ['Turn on tablet', 'Open coding app', 'Debug program', 'Share project'],
      ],
      3
    )
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          Cut and glue (or write) the steps in order. Then write a sentence describing the process.
        </p>
        <div className="space-y-3">
          {tasks.map((task, idx) => (
            <div key={idx} className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
              <p className="font-semibold">Sequence {idx + 1}</p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {task.map((step, stepIdx) => (
                  <li key={stepIdx} className="rounded border border-dashed border-slate-300 px-3 py-1">
                    {step}
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-xs text-slate-500">Summary sentence: ______________________________</p>
            </div>
          ))}
        </div>
      </div>
    )
  },
  'interactive-logic-riddles': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const riddles = pickMany(
      rng,
      [
        ['I have keys but open no doors. What am I?', 'A piano'],
        ['I orbit but never land. What am I?', 'A satellite'],
        ['I get wetter the more I dry. What am I?', 'A towel'],
        ['I speak without a mouth. What am I?', 'An echo'],
        ['I have hands but cannot clap. What am I?', 'A clock'],
      ],
      4
    )
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          Solve each brain teaser. Write your guess, then reveal the answer.
        </p>
        <div className="space-y-3">
          {riddles.map(([riddle, answer], idx) => (
            <div key={idx} className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
              <p className="font-semibold text-slate-900">Riddle {idx + 1}</p>
              <p>{riddle}</p>
              <p className="mt-2 text-xs text-slate-500">My guess: __________________________</p>
              <p className="mt-1 text-xs text-slate-500">Answer: {answer}</p>
            </div>
          ))}
        </div>
      </div>
    )
  },
  'interactive-logic-deduction': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const suspects = pickMany(rng, ['Ava', 'Ben', 'Chloe', 'Diego', 'Erin', 'Finn'], 3)
    const items = pickMany(rng, ['robot dog', 'rocket model', 'skateboard', 'drone', 'canvas painting', 'puzzle cube'], 3)
    const locations = pickMany(rng, ['STEM lab', 'library', 'art studio'], 3)
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          Use the clues to determine who borrowed each item and where it was found.
        </p>
        <table className="w-full border border-slate-300 text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-3 py-2">Student</th>
              <th className="px-3 py-2">Borrowed Item</th>
              <th className="px-3 py-2">Location</th>
            </tr>
          </thead>
          <tbody>
            {suspects.map((suspect, idx) => (
              <tr key={idx} className="border-t border-slate-200">
                <td className="px-3 py-2">{suspect}</td>
                <td className="px-3 py-2">________________</td>
                <td className="px-3 py-2">________________</td>
              </tr>
            ))}
          </tbody>
        </table>
        <ul className="list-disc list-inside space-y-1 text-xs text-slate-500">
          <li>{suspects[0]} did not borrow the {items[0]}.</li>
          <li>The student who used the {items[1]} worked in the {locations[1]}.</li>
          <li>{suspects[1]} and {suspects[2]} swapped tools before heading to different rooms.</li>
        </ul>
      </div>
    )
  },
  'interactive-sel-mindfulness': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const breaths = pickMany(rng, ['rainbow breathing', 'box breathing', 'five-finger breathing', 'balloon breath'], 3)
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          Practice three breathing strategies. Track how your body feels before and after.
        </p>
        <table className="w-full border border-slate-300 text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-3 py-2">Breathing Strategy</th>
              <th className="px-3 py-2">Before I feel?</th>
              <th className="px-3 py-2">After I feel?</th>
            </tr>
          </thead>
          <tbody>
            {breaths.map((breath, idx) => (
              <tr key={idx} className="border-t border-slate-200">
                <td className="px-3 py-2 capitalize">{breath}</td>
                <td className="px-3 py-2">_______________________</td>
                <td className="px-3 py-2">_______________________</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-xs text-blue-700">
          Repeat your favorite strategy three times this week and jot when it helped you most.
        </div>
      </div>
    )
  },
  'interactive-sel-empathy': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const scenarios = pickMany(
      rng,
      ['Someone new joins the lunch table.', 'A friend loses their favorite pencil case.', 'A teammate feels nervous before a performance.', 'A classmate forgets homework again.'],
      3
    )
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          Imagine each scenario. How might the person feel? What words or actions would show empathy?
        </p>
        <div className="space-y-3 text-sm text-slate-700">
          {scenarios.map((scenario, idx) => (
            <div key={idx} className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="font-semibold">Scenario {idx + 1}</p>
              <p>{scenario}</p>
              <p className="mt-2 text-xs text-slate-500">Feelings I notice: ______________________________</p>
              <p className="text-xs text-slate-500">Words or actions to show empathy: ______________________</p>
            </div>
          ))}
        </div>
      </div>
    )
  },
  'interactive-sel-goals': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const focuses = pickMany(rng, ['collaboration', 'growth mindset', 'healthy habits', 'kindness', 'study skills', 'creative risk-taking'], 3)
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          Set a weekly goal in the areas below. Plan small steps and reflect at the end of the week.
        </p>
        <div className="space-y-3">
          {focuses.map((focus, idx) => (
            <div key={idx} className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
              <p className="font-semibold text-emerald-900">Goal area: {focus}</p>
              <p>Goal statement: __________________________________________</p>
              <p>Steps I will take: ________________________________________</p>
              <p>Reflection: ______________________________________________</p>
            </div>
          ))}
        </div>
      </div>
    )
  },
  'interactive-math-algebra': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const problems = Array.from({ length: 5 }, () => {
      const type = pick(rng, ['solve', 'evaluate', 'simplify'])
      if (type === 'solve') {
        // Ensure integer solutions: ax + b = c, so x = (c-b)/a must be integer
        const x = Math.floor(rng() * 10) + 1 // x will be 1-10
        const a = Math.floor(rng() * 5) + 2 // a will be 2-6
        const b = Math.floor(rng() * 10) + 1 // b will be 1-10
        const c = a * x + b // Calculate c to ensure integer solution
        return { type: 'solve', eq: `${a}x + ${b} = ${c}`, answer: x }
      } else if (type === 'evaluate') {
        const a = Math.floor(rng() * 5) + 2
        const b = Math.floor(rng() * 10) + 1
        const x = Math.floor(rng() * 10) + 1
        return { type: 'evaluate', expr: `${a}x + ${b}`, x, answer: a * x + b }
      } else {
        const a = Math.floor(rng() * 5) + 2
        const b = Math.floor(rng() * 5) + 2
        return { type: 'simplify', expr: `${a}x + ${b}x`, answer: a + b }
      }
    })
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          Solve each equation, evaluate each expression, or simplify as indicated.
        </p>
        <div className="space-y-3">
          {problems.map((prob, idx) => (
            <div key={idx} className="rounded-xl border border-purple-200 bg-white p-4">
              <p className="text-sm font-semibold text-purple-800">
                {prob.type === 'solve' && `Solve: ${prob.eq}`}
                {prob.type === 'evaluate' && `Evaluate ${prob.expr} when x = ${prob.x}`}
                {prob.type === 'simplify' && `Simplify: ${prob.expr}`}
              </p>
              <p className="mt-2 text-xs text-slate-500">Answer: _______________</p>
            </div>
          ))}
        </div>
      </div>
    )
  },
  'interactive-math-percentages': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const problems = Array.from({ length: 5 }, () => {
      const type = pick(rng, ['percent', 'ratio', 'proportion'])
      if (type === 'percent') {
        const num = Math.floor(rng() * 50) + 10
        const total = Math.floor(rng() * 100) + 50
        return { type: 'percent', q: `What percent is ${num} of ${total}?`, answer: ((num / total) * 100).toFixed(1) + '%' }
      } else if (type === 'ratio') {
        const a = Math.floor(rng() * 10) + 2
        const b = Math.floor(rng() * 10) + 2
        return { type: 'ratio', q: `Simplify the ratio ${a * 2}:${b * 2}`, answer: `${a}:${b}` }
      } else {
        const a = Math.floor(rng() * 5) + 2
        const b = Math.floor(rng() * 5) + 2
        const c = Math.floor(rng() * 10) + 5
        return { type: 'proportion', q: `Solve: ${a}/${b} = x/${c}`, answer: ((a * c) / b).toFixed(1) }
      }
    })
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          Calculate percentages, simplify ratios, and solve proportions.
        </p>
        <div className="space-y-3">
          {problems.map((prob, idx) => (
            <div key={idx} className="rounded-xl border border-purple-200 bg-white p-4">
              <p className="text-sm font-semibold text-purple-800">{prob.q}</p>
              <p className="mt-2 text-xs text-slate-500">Answer: _______________</p>
            </div>
          ))}
        </div>
      </div>
    )
  },
  'interactive-math-geometry': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const problems = Array.from({ length: 5 }, () => {
      const type = pick(rng, ['area', 'perimeter', 'volume', 'angle'])
      if (type === 'area') {
        const l = Math.floor(rng() * 10) + 5
        const w = Math.floor(rng() * 10) + 5
        return { type: 'area', q: `Find the area of a rectangle: length = ${l}cm, width = ${w}cm`, answer: `${l * w} cm²` }
      } else if (type === 'perimeter') {
        const s = Math.floor(rng() * 10) + 5
        return { type: 'perimeter', q: `Find the perimeter of a square with side length ${s}cm`, answer: `${s * 4} cm` }
      } else if (type === 'volume') {
        const l = Math.floor(rng() * 5) + 3
        const w = Math.floor(rng() * 5) + 3
        const h = Math.floor(rng() * 5) + 3
        return { type: 'volume', q: `Find the volume: length = ${l}cm, width = ${w}cm, height = ${h}cm`, answer: `${l * w * h} cm³` }
      } else {
        const angle = Math.floor(rng() * 60) + 30
        return { type: 'angle', q: `If two angles are supplementary and one is ${angle}°, find the other`, answer: `${180 - angle}°` }
      }
    })
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          Calculate area, perimeter, volume, and work with angles.
        </p>
        <div className="space-y-3">
          {problems.map((prob, idx) => (
            <div key={idx} className="rounded-xl border border-purple-200 bg-white p-4">
              <p className="text-sm font-semibold text-purple-800">{prob.q}</p>
              <p className="mt-2 text-xs text-slate-500">Answer: _______________</p>
            </div>
          ))}
        </div>
      </div>
    )
  },
  'interactive-math-statistics': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const datasets = Array.from({ length: 3 }, () => {
      const nums = Array.from({ length: 6 }, () => Math.floor(rng() * 20) + 10).sort((a, b) => a - b)
      const mean = (nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(1)
      const median = ((nums[2] + nums[3]) / 2).toFixed(1)
      const mode = nums[Math.floor(nums.length / 2)]
      return { data: nums.join(', '), mean, median, mode }
    })
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          Analyze each data set. Calculate mean, median, and mode. Then create a bar graph.
        </p>
        <div className="space-y-4">
          {datasets.map((set, idx) => (
            <div key={idx} className="rounded-xl border border-purple-200 bg-white p-4">
              <p className="text-sm font-semibold text-purple-800">Data Set {idx + 1}: {set.data}</p>
              <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                <div>
                  <p className="text-slate-600">Mean:</p>
                  <p className="text-slate-400">________</p>
                </div>
                <div>
                  <p className="text-slate-600">Median:</p>
                  <p className="text-slate-400">________</p>
                </div>
                <div>
                  <p className="text-slate-600">Mode:</p>
                  <p className="text-slate-400">________</p>
                </div>
              </div>
              <p className="mt-3 text-xs text-slate-500">Graph space:</p>
              <div className="mt-1 h-24 border-2 border-dashed border-slate-300 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  },
  'interactive-math-word-problems': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const problems = [
      { q: 'A store sells 3 notebooks for $12. How much would 7 notebooks cost?', answer: '$28' },
      { q: 'A train travels 240 miles in 4 hours. At this rate, how far will it travel in 6 hours?', answer: '360 miles' },
      { q: 'Sarah has $45. She spends 2/5 of it on books. How much does she have left?', answer: '$27' },
      { q: 'A rectangle has length 8cm and width 5cm. If the length is doubled, what is the new area?', answer: '80 cm²' },
      { q: 'In a class of 30 students, 60% are girls. How many boys are in the class?', answer: '12 boys' },
    ]
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          Solve each multi-step word problem. Show your work.
        </p>
        <div className="space-y-3">
          {problems.map((prob, idx) => (
            <div key={idx} className="rounded-xl border border-purple-200 bg-white p-4">
              <p className="text-sm font-semibold text-purple-800">Problem {idx + 1}</p>
              <p className="mt-1 text-sm text-slate-700">{prob.q}</p>
              <div className="mt-3 h-16 border border-slate-200 rounded bg-slate-50"></div>
              <p className="mt-2 text-xs text-slate-500">Answer: _______________</p>
            </div>
          ))}
        </div>
      </div>
    )
  },
  'interactive-reading-literary-analysis': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const passages = [
      {
        title: 'The Old Lighthouse',
        text: 'The lighthouse stood tall on the rocky cliff, its beam cutting through the fog like a sword. For fifty years, it had guided ships safely to shore. But tonight, the light was dimming, and the old keeper knew his time was ending. He looked out at the endless ocean, remembering all the lives he had saved, all the storms he had weathered. The lighthouse was more than stone and glass—it was a promise kept, a beacon of hope in the darkness.',
      },
      {
        title: 'The Garden Gate',
        text: 'Every morning, Maria opened the rusty gate to her grandmother\'s garden. The hinges creaked like an old song, welcoming her to a world of color and life. Sunflowers reached for the sky, roses bloomed in perfect rows, and butterflies danced between the petals. But today, something was different. A single withered rose lay at the gate, its petals brown and curled. Maria knew that change was coming, and the garden would never be the same.',
      },
      {
        title: 'The Last Train',
        text: 'The station was empty except for Sarah and her suitcase. The last train to the city was leaving in ten minutes, and with it, her childhood. She looked back at the small town where she had grown up—the bakery where she learned to bake, the library where she discovered books, the park where she had her first kiss. The train whistle blew, sharp and clear, calling her forward into the unknown. She took a deep breath and stepped onto the platform, ready to begin.',
      },
    ]
    const passage = pick(rng, passages)
    const elements = pickMany(rng, ['theme', 'symbolism', 'character development', 'author\'s purpose', 'figurative language'], 4)
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          Read the passage and analyze the literary elements below. Provide evidence from the text.
        </p>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 mb-4">
          <p className="text-sm font-semibold text-slate-900 mb-2">{passage.title}</p>
          <p className="text-xs text-slate-700 leading-relaxed">{passage.text}</p>
        </div>
        <div className="space-y-3">
          {elements.map((elem, idx) => (
            <div key={idx} className="rounded-xl border border-blue-200 bg-white p-4">
              <p className="text-sm font-semibold text-blue-800 capitalize">{elem}</p>
              <p className="mt-2 text-xs text-slate-500">Analysis: ________________________________</p>
              <p className="mt-1 text-xs text-slate-500">Text Evidence: ___________________________</p>
            </div>
          ))}
        </div>
      </div>
    )
  },
  'interactive-reading-research': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const topics = pickMany(rng, ['climate change', 'ancient civilizations', 'space exploration', 'renewable energy'], 3)
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          Research each topic using multiple sources. Find evidence and cite your sources.
        </p>
        <div className="space-y-4">
          {topics.map((topic, idx) => (
            <div key={idx} className="rounded-xl border border-blue-200 bg-white p-4">
              <p className="text-sm font-semibold text-blue-800 capitalize">Topic: {topic}</p>
              <div className="mt-3 space-y-2 text-xs">
                <p className="text-slate-600">Key Fact 1: ________________________________</p>
                <p className="text-slate-600">Source: ___________________________________</p>
                <p className="text-slate-600">Key Fact 2: ________________________________</p>
                <p className="text-slate-600">Source: ___________________________________</p>
                <p className="text-slate-600 mt-2">Your Argument: ___________________________</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  },
  'interactive-writing-research': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          Plan your research paper. Organize your research, create an outline, and plan citations.
        </p>
        <div className="space-y-4">
          <div className="rounded-xl border border-emerald-200 bg-white p-4">
            <p className="text-sm font-semibold text-emerald-800">Research Topic:</p>
            <p className="mt-1 text-xs text-slate-500">________________________________</p>
            <p className="mt-3 text-sm font-semibold text-emerald-800">Thesis Statement:</p>
            <p className="mt-1 text-xs text-slate-500">________________________________</p>
          </div>
          <div className="rounded-xl border border-emerald-200 bg-white p-4">
            <p className="text-sm font-semibold text-emerald-800">Outline:</p>
            <div className="mt-2 space-y-2 text-xs">
              <p className="text-slate-600">I. Introduction: ________________________</p>
              <p className="text-slate-600 ml-4">A. Hook: ___________________________</p>
              <p className="text-slate-600 ml-4">B. Background: ______________________</p>
              <p className="text-slate-600">II. Body Paragraph 1: ___________________</p>
              <p className="text-slate-600 ml-4">A. Main idea: _______________________</p>
              <p className="text-slate-600 ml-4">B. Evidence: _______________________</p>
              <p className="text-slate-600">III. Conclusion: ________________________</p>
            </div>
          </div>
          <div className="rounded-xl border border-emerald-200 bg-white p-4">
            <p className="text-sm font-semibold text-emerald-800">Sources:</p>
            <div className="mt-2 space-y-2 text-xs">
              <p className="text-slate-600">1. Author, Title. URL: _______________</p>
              <p className="text-slate-600">2. Author, Title. URL: _______________</p>
              <p className="text-slate-600">3. Author, Title. URL: _______________</p>
            </div>
          </div>
        </div>
      </div>
    )
  },
  'interactive-writing-essay': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const prompts = pickMany(rng, [
      'Should students have homework on weekends?',
      'What is the most important quality in a friend?',
      'How does technology affect our daily lives?',
    ], 1)
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          Write a structured essay responding to the prompt below.
        </p>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 mb-4">
          <p className="text-sm font-semibold text-emerald-900">Prompt: {prompts[0]}</p>
        </div>
        <div className="space-y-4">
          <div className="rounded-xl border border-emerald-200 bg-white p-4">
            <p className="text-sm font-semibold text-emerald-800">Introduction</p>
            <p className="mt-2 text-xs text-slate-500">Hook: ________________________________</p>
            <p className="mt-1 text-xs text-slate-500">Thesis Statement: _____________________</p>
          </div>
          <div className="rounded-xl border border-emerald-200 bg-white p-4">
            <p className="text-sm font-semibold text-emerald-800">Body Paragraph 1</p>
            <p className="mt-2 text-xs text-slate-500">Topic Sentence: _______________________</p>
            <p className="mt-1 text-xs text-slate-500">Evidence: _____________________________</p>
            <p className="mt-1 text-xs text-slate-500">Explanation: ___________________________</p>
          </div>
          <div className="rounded-xl border border-emerald-200 bg-white p-4">
            <p className="text-sm font-semibold text-emerald-800">Body Paragraph 2</p>
            <p className="mt-2 text-xs text-slate-500">Topic Sentence: _______________________</p>
            <p className="mt-1 text-xs text-slate-500">Evidence: _____________________________</p>
            <p className="mt-1 text-xs text-slate-500">Explanation: ___________________________</p>
          </div>
          <div className="rounded-xl border border-emerald-200 bg-white p-4">
            <p className="text-sm font-semibold text-emerald-800">Conclusion</p>
            <p className="mt-2 text-xs text-slate-500">Restate Thesis: ______________________</p>
            <p className="mt-1 text-xs text-slate-500">Summary: ____________________________</p>
            <p className="mt-1 text-xs text-slate-500">Final Thought: _______________________</p>
          </div>
        </div>
      </div>
    )
  },
  'interactive-science-chemistry': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const concepts = pickMany(rng, ['atoms', 'molecules', 'chemical reactions', 'periodic table', 'elements'], 4)
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          Explore chemistry concepts. Define terms, draw diagrams, and explain processes.
        </p>
        <div className="space-y-3">
          {concepts.map((concept, idx) => (
            <div key={idx} className="rounded-xl border border-green-200 bg-white p-4">
              <p className="text-sm font-semibold text-green-800 capitalize">{concept}</p>
              <p className="mt-2 text-xs text-slate-500">Definition: ___________________________</p>
              <p className="mt-1 text-xs text-slate-500">Example: ____________________________</p>
              <div className="mt-2 h-20 border border-slate-200 rounded bg-slate-50"></div>
              <p className="mt-1 text-xs text-slate-400">Diagram space</p>
            </div>
          ))}
        </div>
      </div>
    )
  },
  'interactive-science-physics': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const topics = pickMany(rng, ['forces', 'motion', 'energy', 'simple machines'], 4)
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          Learn about physics concepts. Explain how forces, motion, and energy work.
        </p>
        <div className="space-y-3">
          {topics.map((topic, idx) => (
            <div key={idx} className="rounded-xl border border-green-200 bg-white p-4">
              <p className="text-sm font-semibold text-green-800 capitalize">{topic}</p>
              <p className="mt-2 text-xs text-slate-500">Explain: _____________________________</p>
              <p className="mt-1 text-xs text-slate-500">Real-world example: _________________</p>
              <p className="mt-1 text-xs text-slate-500">Formula (if applicable): ______________</p>
            </div>
          ))}
        </div>
      </div>
    )
  },
  'interactive-science-ecology': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const topics = pickMany(rng, ['ecosystems', 'food webs', 'environmental issues', 'conservation'], 4)
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          Explore ecology and environmental science. Analyze ecosystems and environmental challenges.
        </p>
        <div className="space-y-3">
          {topics.map((topic, idx) => (
            <div key={idx} className="rounded-xl border border-green-200 bg-white p-4">
              <p className="text-sm font-semibold text-green-800 capitalize">{topic}</p>
              <p className="mt-2 text-xs text-slate-500">Description: _________________________</p>
              <p className="mt-1 text-xs text-slate-500">Impact: ____________________________</p>
              <p className="mt-1 text-xs text-slate-500">Solutions: __________________________</p>
            </div>
          ))}
        </div>
      </div>
    )
  },
  'interactive-geography-government': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const topics = pickMany(rng, ['government structure', 'citizenship', 'rights and responsibilities', 'branches of government'], 4)
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          Learn about government and civics. Understand how government works and your role as a citizen.
        </p>
        <div className="space-y-3">
          {topics.map((topic, idx) => (
            <div key={idx} className="rounded-xl border border-amber-200 bg-white p-4">
              <p className="text-sm font-semibold text-amber-800 capitalize">{topic}</p>
              <p className="mt-2 text-xs text-slate-500">Key Points: _________________________</p>
              <p className="mt-1 text-xs text-slate-500">Examples: __________________________</p>
            </div>
          ))}
        </div>
      </div>
    )
  },
  'interactive-geography-economics': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const concepts = pickMany(rng, ['supply and demand', 'budgeting', 'saving and spending', 'economic systems'], 4)
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          Explore economics basics. Learn about money, budgeting, and how economies work.
        </p>
        <div className="space-y-3">
          {concepts.map((concept, idx) => (
            <div key={idx} className="rounded-xl border border-amber-200 bg-white p-4">
              <p className="text-sm font-semibold text-amber-800 capitalize">{concept}</p>
              <p className="mt-2 text-xs text-slate-500">Definition: ___________________________</p>
              <p className="mt-1 text-xs text-slate-500">Example: ____________________________</p>
              {concept === 'budgeting' && (
                <>
                  <p className="mt-2 text-xs text-slate-500">Income: $________ Expenses: $________</p>
                  <p className="mt-1 text-xs text-slate-500">Savings: $_______________________</p>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  },
  'interactive-grammar-advanced': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const sentences = [
      'The book that I read yesterday was fascinating.',
      'Although it was raining, we decided to go outside.',
      'She walked quickly because she was late.',
      'The students, who studied hard, passed the test.',
      'Running every morning, he improved his health.',
    ]
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          Identify clauses, phrases, and advanced sentence structures in each sentence.
        </p>
        <div className="space-y-3">
          {sentences.map((sentence, idx) => (
            <div key={idx} className="rounded-xl border border-blue-200 bg-white p-4">
              <p className="text-sm text-slate-700">{sentence}</p>
              <div className="mt-2 space-y-1 text-xs">
                <p className="text-slate-500">Independent clause: ________________</p>
                <p className="text-slate-500">Dependent clause: _________________</p>
                <p className="text-slate-500">Phrases: _________________________</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  },
  'interactive-grammar-vocab': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const words = pickMany(rng, ['analyze', 'evaluate', 'synthesize', 'hypothesize', 'conclude', 'demonstrate'], 5)
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          Learn academic vocabulary words. Use context clues and practice using them in sentences.
        </p>
        <div className="space-y-3">
          {words.map((word, idx) => (
            <div key={idx} className="rounded-xl border border-blue-200 bg-white p-4">
              <p className="text-sm font-semibold text-blue-800 capitalize">{word}</p>
              <p className="mt-2 text-xs text-slate-500">Definition: ___________________________</p>
              <p className="mt-1 text-xs text-slate-500">Context clue: _______________________</p>
              <p className="mt-1 text-xs text-slate-500">Your sentence: ______________________</p>
            </div>
          ))}
        </div>
      </div>
    )
  },
  // NEW WORKSHEET RENDERERS - Writing
  'interactive-writing-trace': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const letters = pickMany(rng, ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'], 4)
    const words = pickMany(rng, ['cat', 'dog', 'sun', 'moon', 'star', 'tree', 'car', 'bus'], 3)
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-600">Trace each letter, then write it 3 times. Then trace and write the words.</p>
        <div className="grid gap-4 md:grid-cols-2">
          {letters.map((letter, idx) => (
            <div key={idx} className="rounded-xl border border-green-200 bg-green-50 p-4">
              <p className="text-sm font-semibold text-green-700 mb-2">{letter} / {letter.toLowerCase()}</p>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <span className="text-2xl text-green-600 font-light">{letter}</span>
                  <div className="flex-1 h-8 border border-dashed border-green-300 bg-white rounded"></div>
                </div>
                <p className="text-xs text-green-600">Write 3 times:</p>
                <div className="flex gap-2">
                  <div className="flex-1 h-8 border border-dashed border-green-300 bg-white rounded"></div>
                  <div className="flex-1 h-8 border border-dashed border-green-300 bg-white rounded"></div>
                  <div className="flex-1 h-8 border border-dashed border-green-300 bg-white rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-green-200 bg-green-50 p-4">
          <p className="text-sm font-semibold text-green-700 mb-2">Word Tracing</p>
          <div className="space-y-2">
            {words.map((word, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <span className="text-sm text-green-700 font-semibold w-16">{word}:</span>
                <div className="flex-1 h-8 border border-dashed border-green-300 bg-white rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  },
  'interactive-writing-pictures': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const prompts = pickMany(rng, [
      { picture: 'A sunny day at the park', question: 'What do you see?' },
      { picture: 'A family having dinner', question: 'What are they doing?' },
      { picture: 'Children playing together', question: 'How do they feel?' },
      { picture: 'A garden with flowers', question: 'What colors do you see?' },
    ], 4)
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-600">Look at each picture prompt and write simple sentences or a short story about what you see.</p>
        <p className="text-xs text-emerald-700 bg-emerald-50 p-2 rounded border border-emerald-200">💡 <strong>Note:</strong> When drawing animals, do not include eyes, ears, nose, or mouth.</p>
        <div className="grid gap-4 md:grid-cols-2">
          {prompts.map((prompt, idx) => (
            <div key={idx} className="rounded-xl border border-blue-200 bg-blue-50 p-4">
              <p className="text-sm font-semibold text-blue-700 mb-2">{prompt.picture}</p>
              <div className="mt-2 h-24 rounded border border-dashed border-blue-300 bg-white"><p className="p-2 text-xs text-blue-600">Draw the picture</p></div>
              <p className="mt-2 text-xs text-blue-700">{prompt.question}</p>
              <div className="mt-1 h-12 rounded border border-dashed border-blue-300 bg-white"></div>
              <p className="mt-2 text-xs text-blue-600">Write a sentence:</p>
              <div className="mt-1 h-10 rounded border border-dashed border-blue-300 bg-white"></div>
            </div>
          ))}
        </div>
      </div>
    )
  },
  'interactive-writing-narrative': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const storyStarters = pickMany(rng, ['One sunny morning, I discovered...', 'The magic door opened and...', 'When I looked in the mirror, I saw...', 'The old tree in the backyard began to...'], 2)
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-600">Write a short story with a beginning, middle, and end. Use the story planning template below.</p>
        <div className="rounded-xl border border-purple-200 bg-purple-50 p-4 mb-4">
          <p className="text-sm font-semibold text-purple-700 mb-2">Story Starters (choose one):</p>
          <ul className="list-disc list-inside space-y-1 text-xs text-purple-600">
            {storyStarters.map((starter, idx) => (<li key={idx}>{starter}</li>))}
          </ul>
        </div>
        <div className="space-y-3">
          <div className="rounded-xl border border-purple-200 bg-white p-4">
            <p className="text-sm font-semibold text-purple-800 mb-2">Beginning</p>
            <p className="text-xs text-slate-600 mb-1">Who are the characters? Where are they?</p>
            <div className="mt-2 h-16 border border-slate-200 rounded bg-slate-50"></div>
          </div>
          <div className="rounded-xl border border-purple-200 bg-white p-4">
            <p className="text-sm font-semibold text-purple-800 mb-2">Middle</p>
            <p className="text-xs text-slate-600 mb-1">What problem happens? What do they do?</p>
            <div className="mt-2 h-20 border border-slate-200 rounded bg-slate-50"></div>
          </div>
          <div className="rounded-xl border border-purple-200 bg-white p-4">
            <p className="text-sm font-semibold text-purple-800 mb-2">End</p>
            <p className="text-xs text-slate-600 mb-1">How is the problem solved? What do they learn?</p>
            <div className="mt-2 h-16 border border-slate-200 rounded bg-slate-50"></div>
          </div>
        </div>
      </div>
    )
  },
  'interactive-writing-informative': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const topics = pickMany(rng, ['How plants grow', 'The life cycle of a butterfly', 'How to care for a pet', 'The water cycle'], 1)
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-600">Write an informative paragraph about the topic below. Include facts, details, and explanations.</p>
        <div className="rounded-xl border border-teal-200 bg-teal-50 p-4 mb-4">
          <p className="text-sm font-semibold text-teal-900">Topic: {topics[0]}</p>
        </div>
        <div className="space-y-3">
          <div className="rounded-xl border border-teal-200 bg-white p-4">
            <p className="text-sm font-semibold text-teal-800 mb-2">Introduction</p>
            <p className="text-xs text-slate-600 mb-1">Hook sentence: ________________________________</p>
            <p className="text-xs text-slate-600 mb-1">Main idea: ____________________________________</p>
            <div className="mt-2 h-12 border border-slate-200 rounded bg-slate-50"></div>
          </div>
          <div className="rounded-xl border border-teal-200 bg-white p-4">
            <p className="text-sm font-semibold text-teal-800 mb-2">Body Paragraph</p>
            <p className="text-xs text-slate-600 mb-1">Fact 1: ______________________________________</p>
            <p className="text-xs text-slate-600 mb-1">Detail: ______________________________________</p>
            <p className="text-xs text-slate-600 mb-1">Fact 2: ______________________________________</p>
            <p className="text-xs text-slate-600 mb-1">Detail: ______________________________________</p>
            <div className="mt-2 h-16 border border-slate-200 rounded bg-slate-50"></div>
          </div>
          <div className="rounded-xl border border-teal-200 bg-white p-4">
            <p className="text-sm font-semibold text-teal-800 mb-2">Conclusion</p>
            <p className="text-xs text-slate-600 mb-1">Summary: ____________________________________</p>
            <div className="mt-2 h-12 border border-slate-200 rounded bg-slate-50"></div>
          </div>
        </div>
      </div>
    )
  },
  'interactive-writing-argumentative': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const prompts = pickMany(rng, ['Should students have longer recess?', 'Is reading books better than watching videos?', 'Should schools ban homework?'], 1)
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-600">Develop an argument with claims, evidence, and reasoning. Write a persuasive essay.</p>
        <div className="rounded-xl border border-orange-200 bg-orange-50 p-4 mb-4">
          <p className="text-sm font-semibold text-orange-900">Prompt: {prompts[0]}</p>
        </div>
        <div className="space-y-3">
          <div className="rounded-xl border border-orange-200 bg-white p-4">
            <p className="text-sm font-semibold text-orange-800 mb-2">Your Claim</p>
            <p className="text-xs text-slate-600 mb-1">I believe that: ______________________________</p>
            <div className="mt-2 h-10 border border-slate-200 rounded bg-slate-50"></div>
          </div>
          <div className="rounded-xl border border-orange-200 bg-white p-4">
            <p className="text-sm font-semibold text-orange-800 mb-2">Reason 1 with Evidence</p>
            <p className="text-xs text-slate-600 mb-1">Reason: ____________________________________</p>
            <p className="text-xs text-slate-600 mb-1">Evidence: __________________________________</p>
            <div className="mt-2 h-12 border border-slate-200 rounded bg-slate-50"></div>
          </div>
          <div className="rounded-xl border border-orange-200 bg-white p-4">
            <p className="text-sm font-semibold text-orange-800 mb-2">Reason 2 with Evidence</p>
            <p className="text-xs text-slate-600 mb-1">Reason: ____________________________________</p>
            <p className="text-xs text-slate-600 mb-1">Evidence: __________________________________</p>
            <div className="mt-2 h-12 border border-slate-200 rounded bg-slate-50"></div>
          </div>
          <div className="rounded-xl border border-orange-200 bg-white p-4">
            <p className="text-sm font-semibold text-orange-800 mb-2">Counterargument</p>
            <p className="text-xs text-slate-600 mb-1">Some people might say: _____________________</p>
            <p className="text-xs text-slate-600 mb-1">But I disagree because: ____________________</p>
            <div className="mt-2 h-12 border border-slate-200 rounded bg-slate-50"></div>
          </div>
          <div className="rounded-xl border border-orange-200 bg-white p-4">
            <p className="text-sm font-semibold text-orange-800 mb-2">Conclusion</p>
            <p className="text-xs text-slate-600 mb-1">Restate claim: _____________________________</p>
            <p className="text-xs text-slate-600 mb-1">Call to action: ____________________________</p>
            <div className="mt-2 h-12 border border-slate-200 rounded bg-slate-50"></div>
          </div>
        </div>
      </div>
    )
  },
  // NEW WORKSHEET RENDERERS - Reading, Science, Geography, Grammar, Art, Logic, SEL
  'interactive-reading-alphabet': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const letters = pickMany(rng, ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'], 6)
    const beginningSounds = pickMany(rng, [{ letter: 'B', words: ['ball', 'book', 'bus'] }, { letter: 'C', words: ['cat', 'car', 'cup'] }, { letter: 'D', words: ['dog', 'door', 'duck'] }, { letter: 'F', words: ['fish', 'fan', 'flower'] }, { letter: 'M', words: ['moon', 'mouse', 'map'] }, { letter: 'S', words: ['sun', 'star', 'snake'] }], 4)
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-600">Practice recognizing letters, matching uppercase and lowercase, and beginning sounds.</p>
        <div className="grid gap-4 md:grid-cols-3">
          {letters.map((letter, idx) => (
            <div key={idx} className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-center">
              <p className="text-3xl font-bold text-blue-700 mb-2">{letter}</p>
              <p className="text-xl text-blue-600 mb-2">{letter.toLowerCase()}</p>
              <div className="mt-2 flex gap-2 justify-center">
                <div className="h-8 w-8 border border-dashed border-blue-300 bg-white rounded"></div>
                <div className="h-8 w-8 border border-dashed border-blue-300 bg-white rounded"></div>
              </div>
              <p className="text-xs text-blue-600 mt-2">Circle the {letter}</p>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
          <p className="text-sm font-semibold text-blue-700 mb-2">Beginning Sounds</p>
          <div className="grid gap-3 md:grid-cols-2">
            {beginningSounds.map((item, idx) => (
              <div key={idx} className="bg-white rounded border border-blue-200 p-3">
                <p className="text-sm font-semibold text-blue-800 mb-1">{item.letter} says /{item.letter.toLowerCase()}/</p>
                <div className="flex gap-2 flex-wrap">
                  {item.words.map((word, wIdx) => (
                    <span key={wIdx} className="text-xs px-2 py-1 bg-blue-100 rounded border border-blue-300 text-blue-700">{word}</span>
                  ))}
                </div>
                <p className="text-xs text-blue-600 mt-2">Circle words that start with {item.letter}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  },
  'interactive-reading-sightwords': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const sightWords = pickMany(rng, ['the', 'and', 'is', 'it', 'you', 'that', 'he', 'was', 'for', 'on', 'are', 'as', 'with', 'his', 'they', 'I', 'at', 'be', 'this', 'have', 'from', 'or', 'one', 'had', 'by', 'word', 'but', 'not', 'what', 'all', 'were', 'we', 'when', 'your', 'can', 'said'], 8)
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-600">Practice reading and writing common sight words with fun activities.</p>
        <div className="grid gap-3 md:grid-cols-4">
          {sightWords.map((word, idx) => (
            <div key={idx} className="rounded-xl border border-indigo-200 bg-indigo-50 p-3 text-center">
              <p className="text-lg font-bold text-indigo-700 mb-2">{word}</p>
              <div className="h-8 border border-dashed border-indigo-300 bg-white rounded mb-1"></div>
              <p className="text-xs text-indigo-600">Write it 3 times:</p>
              <div className="flex gap-1 mt-1">
                <div className="flex-1 h-6 border border-dashed border-indigo-300 bg-white rounded"></div>
                <div className="flex-1 h-6 border border-dashed border-indigo-300 bg-white rounded"></div>
                <div className="flex-1 h-6 border border-dashed border-indigo-300 bg-white rounded"></div>
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4">
          <p className="text-sm font-semibold text-indigo-700 mb-2">Use sight words in sentences:</p>
          <div className="space-y-2">
            {sightWords.slice(0, 3).map((word, idx) => (
              <div key={idx} className="bg-white rounded border border-indigo-200 p-2">
                <p className="text-xs text-indigo-700 mb-1">Write a sentence with "{word}":</p>
                <div className="h-10 border border-dashed border-indigo-300 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  },
  'interactive-reading-fluency': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const passages = pickMany(rng, ['The cat sat on the mat. The cat is happy.', 'I see a big tree. The tree has green leaves.', 'The sun is bright. It shines in the sky.', 'I like to read books. Books are fun to read.'], 2)
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-600">Practice reading with expression, accuracy, and appropriate pacing. Read each passage three times.</p>
        {passages.map((passage, idx) => (
          <div key={idx} className="rounded-xl border border-purple-200 bg-purple-50 p-4">
            <p className="text-sm font-semibold text-purple-700 mb-2">Passage {idx + 1}</p>
            <div className="bg-white rounded border border-purple-200 p-3 mb-3">
              <p className="text-sm text-purple-800 leading-relaxed">{passage}</p>
            </div>
            <div className="space-y-2">
              {[1, 2, 3].map((readNum) => (
                <div key={readNum} className="flex items-center gap-2">
                  <span className="text-xs text-purple-600 w-24">Read {readNum}:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (<span key={star} className="text-xs">⭐</span>))}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-purple-600 mt-2">Notes: ________________________________</p>
          </div>
        ))}
      </div>
    )
  },
  'interactive-reading-character': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const characters = pickMany(rng, [
      { name: 'Sam', traits: ['kind', 'brave', 'curious'], action: 'helps a friend' },
      { name: 'Maya', traits: ['creative', 'patient', 'helpful'], action: 'solves a problem' },
      { name: 'Alex', traits: ['honest', 'determined', 'friendly'], action: 'learns something new' },
    ], 2)
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-600">Analyze character traits, motivations, and development in stories.</p>
        {characters.map((char, idx) => (
          <div key={idx} className="rounded-xl border border-teal-200 bg-teal-50 p-4">
            <p className="text-sm font-semibold text-teal-700 mb-2">Character: {char.name}</p>
            <div className="bg-white rounded border border-teal-200 p-3 mb-3">
              <p className="text-xs text-teal-800 mb-2">In the story, {char.name} {char.action}.</p>
            </div>
            <div className="space-y-2">
              <p className="text-xs text-teal-700 font-semibold">Character Traits:</p>
              <div className="flex flex-wrap gap-2 mb-2">
                {char.traits.map((trait, tIdx) => (
                  <span key={tIdx} className="text-xs px-2 py-1 bg-teal-100 rounded border border-teal-300 text-teal-700">{trait}</span>
                ))}
              </div>
              <p className="text-xs text-teal-600">Why is {char.name} {char.traits[0]}? ________________________</p>
              <p className="text-xs text-teal-600 mt-2">What does {char.name} want? ________________________</p>
              <p className="text-xs text-teal-600 mt-2">How does {char.name} change? ________________________</p>
            </div>
          </div>
        ))}
      </div>
    )
  },
  'interactive-science-senses': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const senses = ['sight', 'hearing', 'touch', 'taste', 'smell']
    const objects = pickMany(rng, [
      { name: 'apple', sense: 'taste', description: 'sweet' },
      { name: 'flower', sense: 'smell', description: 'fragrant' },
      { name: 'feather', sense: 'touch', description: 'soft' },
      { name: 'bell', sense: 'hearing', description: 'ringing' },
      { name: 'rainbow', sense: 'sight', description: 'colorful' },
    ], 5)
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-600">Explore the five senses through hands-on activities and observation exercises.</p>
        <p className="text-xs text-emerald-700 bg-emerald-50 p-2 rounded border border-emerald-200">💡 <strong>Note:</strong> When drawing animals, do not include eyes, ears, nose, or mouth.</p>
        <div className="grid gap-3 md:grid-cols-2">
          {senses.map((sense, idx) => (
            <div key={idx} className="rounded-xl border border-green-200 bg-green-50 p-4">
              <p className="text-sm font-semibold text-green-700 capitalize mb-2">{sense}</p>
              <div className="mt-2 h-16 rounded border border-green-300 bg-white">
                <p className="p-2 text-xs text-green-600">Draw something you {sense}</p>
              </div>
              <p className="mt-2 text-xs text-green-600">What do you {sense}? ________________</p>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-green-200 bg-green-50 p-4">
          <p className="text-sm font-semibold text-green-700 mb-2">Match the Sense</p>
          <div className="space-y-2">
            {objects.map((obj, idx) => (
              <div key={idx} className="bg-white rounded border border-green-200 p-2 flex items-center gap-3">
                <span className="text-xs text-green-700 font-semibold">{obj.name}:</span>
                <span className="text-xs text-green-600">{obj.description}</span>
                <span className="text-xs text-green-600 ml-auto">Sense: {obj.sense}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  },
  'interactive-science-plants': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const plantParts = ['roots', 'stem', 'leaves', 'flower', 'seeds']
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-600">Learn about plants, their parts, and how they grow through simple activities.</p>
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 mb-4">
          <p className="text-sm font-semibold text-green-700 mb-2">Plant Parts</p>
          <div className="h-32 rounded border border-green-300 bg-white mb-2">
            <p className="p-2 text-xs text-green-600">Draw a plant and label its parts</p>
          </div>
          <div className="grid gap-2 md:grid-cols-3">
            {plantParts.map((part, idx) => (
              <div key={idx} className="bg-white rounded border border-green-200 p-2">
                <p className="text-xs text-green-700 capitalize">{part}:</p>
                <div className="h-6 border border-dashed border-green-300 rounded mt-1"></div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-green-200 bg-green-50 p-4">
          <p className="text-sm font-semibold text-green-700 mb-2">What Plants Need</p>
          <div className="space-y-2">
            {['☀️ Sun', '💧 Water', '🌱 Soil'].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-xs text-green-600">{item}:</span>
                <div className="flex-1 h-6 border border-dashed border-green-300 bg-white rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  },
  'interactive-science-animals': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const animals = pickMany(rng, [
      { name: 'bird', habitat: 'sky', feature: 'wings' },
      { name: 'fish', habitat: 'water', feature: 'fins' },
      { name: 'rabbit', habitat: 'forest', feature: 'fur' },
      { name: 'turtle', habitat: 'water and land', feature: 'shell' },
    ], 4)
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-600">Learn about different types of animals, their habitats, and characteristics.</p>
        <p className="text-xs text-emerald-700 bg-emerald-50 p-2 rounded border border-emerald-200">💡 <strong>Note:</strong> When drawing animals, do not include eyes, ears, nose, or mouth.</p>
        <div className="grid gap-4 md:grid-cols-2">
          {animals.map((animal, idx) => (
            <div key={idx} className="rounded-xl border border-teal-200 bg-teal-50 p-4">
              <p className="text-sm font-semibold text-teal-700 capitalize mb-2">{animal.name}</p>
              <div className="mt-2 h-20 rounded border border-teal-300 bg-white mb-2">
                <p className="p-2 text-xs text-teal-600">Draw a {animal.name}</p>
              </div>
              <p className="text-xs text-teal-600">Habitat: {animal.habitat}</p>
              <p className="text-xs text-teal-600">Feature: {animal.feature}</p>
              <div className="mt-2 h-8 border border-dashed border-teal-300 bg-white rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  },
  'interactive-geography-seasons': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const seasons = ['spring', 'summer', 'fall', 'winter']
    const weatherTypes = pickMany(rng, ['sunny', 'rainy', 'snowy', 'windy', 'cloudy'], 4)
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-600">Learn about different seasons, weather patterns, and how they vary in different places.</p>
        <div className="grid gap-3 md:grid-cols-2">
          {seasons.map((season, idx) => (
            <div key={idx} className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm font-semibold text-amber-700 capitalize mb-2">{season}</p>
              <div className="mt-2 h-16 rounded border border-amber-300 bg-white mb-2">
                <p className="p-2 text-xs text-amber-600">Draw {season} weather</p>
              </div>
              <p className="text-xs text-amber-600">Weather: ________________</p>
              <p className="text-xs text-amber-600 mt-1">What do you wear? ________________</p>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-semibold text-amber-700 mb-2">Weather Types</p>
          <div className="flex flex-wrap gap-2">
            {weatherTypes.map((weather, idx) => (
              <span key={idx} className="text-xs px-2 py-1 bg-amber-100 rounded border border-amber-300 text-amber-700 capitalize">{weather}</span>
            ))}
          </div>
        </div>
      </div>
    )
  },
  'interactive-geography-places': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const places = pickMany(rng, [
      { name: 'Library', type: 'Learning place', activity: 'read books' },
      { name: 'Park', type: 'Play place', activity: 'play games' },
      { name: 'Store', type: 'Shopping place', activity: 'buy things' },
      { name: 'Hospital', type: 'Health place', activity: 'get help' },
    ], 4)
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-600">Learn about important places, landmarks, and locations in your community and country.</p>
        <div className="grid gap-3 md:grid-cols-2">
          {places.map((place, idx) => (
            <div key={idx} className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm font-semibold text-amber-700 mb-1">{place.name}</p>
              <p className="text-xs text-amber-600 mb-2">{place.type}</p>
              <div className="mt-2 h-16 rounded border border-amber-300 bg-white mb-2">
                <p className="p-2 text-xs text-amber-600">Draw {place.name}</p>
              </div>
              <p className="text-xs text-amber-600">We {place.activity} here.</p>
            </div>
          ))}
        </div>
      </div>
    )
  },
  'interactive-geography-continents': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const continents = pickMany(rng, [
      { name: 'North America', fact: 'Has many countries', ocean: 'Atlantic and Pacific' },
      { name: 'South America', fact: 'Has rainforests', ocean: 'Atlantic and Pacific' },
      { name: 'Europe', fact: 'Has many languages', ocean: 'Atlantic' },
      { name: 'Asia', fact: 'Largest continent', ocean: 'Pacific and Indian' },
      { name: 'Africa', fact: 'Has deserts and savannas', ocean: 'Atlantic and Indian' },
      { name: 'Australia', fact: 'Island continent', ocean: 'Pacific and Indian' },
      { name: 'Antarctica', fact: 'Coldest place', ocean: 'Southern' },
    ], 4)
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-600">Learn about the seven continents and five oceans with maps and activities.</p>
        <div className="grid gap-3 md:grid-cols-2">
          {continents.map((continent, idx) => (
            <div key={idx} className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm font-semibold text-amber-700 mb-1">{continent.name}</p>
              <p className="text-xs text-amber-600 mb-2">{continent.fact}</p>
              <p className="text-xs text-amber-600">Oceans: {continent.ocean}</p>
              <div className="mt-2 h-12 border border-dashed border-amber-300 bg-white rounded"></div>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-semibold text-amber-700 mb-2">Oceans</p>
          <div className="flex flex-wrap gap-2">
            {['Atlantic', 'Pacific', 'Indian', 'Arctic', 'Southern'].map((ocean, idx) => (
              <span key={idx} className="text-xs px-2 py-1 bg-amber-100 rounded border border-amber-300 text-amber-700">{ocean}</span>
            ))}
          </div>
        </div>
      </div>
    )
  },
  'interactive-grammar-rhyming': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const wordGroups = pickMany(rng, [
      { word: 'cat', rhymes: ['hat', 'bat', 'sat'] },
      { word: 'dog', rhymes: ['log', 'fog', 'jog'] },
      { word: 'sun', rhymes: ['fun', 'run', 'bun'] },
      { word: 'tree', rhymes: ['bee', 'see', 'me'] },
    ], 4)
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-600">Identify and match rhyming words through fun activities.</p>
        <div className="grid gap-3 md:grid-cols-2">
          {wordGroups.map((group, idx) => (
            <div key={idx} className="rounded-xl border border-purple-200 bg-purple-50 p-4">
              <p className="text-sm font-semibold text-purple-700 mb-2">Word: {group.word}</p>
              <p className="text-xs text-purple-600 mb-2">Rhyming words:</p>
              <div className="flex flex-wrap gap-2 mb-2">
                {group.rhymes.map((rhyme, rIdx) => (
                  <span key={rIdx} className="text-xs px-2 py-1 bg-purple-100 rounded border border-purple-300 text-purple-700">{rhyme}</span>
                ))}
              </div>
              <div className="h-8 border border-dashed border-purple-300 bg-white rounded"></div>
              <p className="text-xs text-purple-600 mt-2">Write another word that rhymes: ________</p>
            </div>
          ))}
        </div>
      </div>
    )
  },
  'interactive-grammar-capitalization': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const sentences = pickMany(rng, [
      { text: 'i like to play.', correct: 'I like to play.' },
      { text: 'my name is sam.', correct: 'My name is Sam.' },
      { text: 'we go to school.', correct: 'We go to school.' },
      { text: 'the sun is bright.', correct: 'The sun is bright.' },
    ], 4)
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-600">Practice proper capitalization and punctuation in sentences.</p>
        <div className="space-y-3">
          {sentences.map((sentence, idx) => (
            <div key={idx} className="rounded-xl border border-purple-200 bg-purple-50 p-4">
              <p className="text-sm font-semibold text-purple-700 mb-2">Sentence {idx + 1}</p>
              <p className="text-xs text-purple-600 mb-2">Fix this sentence: "{sentence.text}"</p>
              <div className="h-10 border border-dashed border-purple-300 bg-white rounded mb-2"></div>
              <p className="text-xs text-purple-600">Correct: {sentence.correct}</p>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-purple-200 bg-purple-50 p-4">
          <p className="text-sm font-semibold text-purple-700 mb-2">Capitalization Rules</p>
          <ul className="list-disc list-inside space-y-1 text-xs text-purple-600">
            <li>Start sentences with a capital letter</li>
            <li>Capitalize names of people and places</li>
            <li>Use a period at the end</li>
          </ul>
        </div>
      </div>
    )
  },
  'interactive-grammar-plurals': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const words = pickMany(rng, [
      { singular: 'cat', plural: 'cats', rule: 'add -s' },
      { singular: 'box', plural: 'boxes', rule: 'add -es' },
      { singular: 'baby', plural: 'babies', rule: 'change y to ies' },
      { singular: 'tooth', plural: 'teeth', rule: 'irregular' },
    ], 4)
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-600">Learn to form plurals and possessives correctly.</p>
        <div className="space-y-3">
          {words.map((word, idx) => (
            <div key={idx} className="rounded-xl border border-purple-200 bg-purple-50 p-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-purple-700 mb-1">Singular: {word.singular}</p>
                  <p className="text-xs text-purple-600 mb-2">Rule: {word.rule}</p>
                  <div className="h-8 border border-dashed border-purple-300 bg-white rounded"></div>
                </div>
                <div className="text-sm text-purple-600">→</div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-purple-700 mb-1">Plural: {word.plural}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-purple-200 bg-purple-50 p-4">
          <p className="text-sm font-semibold text-purple-700 mb-2">Possessives</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-purple-600">The cat's toy:</span>
              <div className="flex-1 h-6 border border-dashed border-purple-300 bg-white rounded"></div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-purple-600">The dogs' bones:</span>
              <div className="flex-1 h-6 border border-dashed border-purple-300 bg-white rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  },
  'interactive-art-shapes': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const shapes = pickMany(rng, ['circle', 'square', 'triangle', 'rectangle', 'star', 'heart'], 6)
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-600">Create art using basic shapes. Draw and color shapes to make pictures.</p>
        <div className="grid gap-3 md:grid-cols-3">
          {shapes.map((shape, idx) => (
            <div key={idx} className="rounded-xl border border-pink-200 bg-pink-50 p-4 text-center">
              <p className="text-sm font-semibold text-pink-700 capitalize mb-2">{shape}</p>
              <div className="h-24 rounded border border-pink-300 bg-white mb-2">
                <p className="p-2 text-xs text-pink-600">Draw a {shape}</p>
              </div>
              <p className="text-xs text-pink-600">Color it: ________________</p>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-pink-200 bg-pink-50 p-4">
          <p className="text-sm font-semibold text-pink-700 mb-2">Create a Picture</p>
          <p className="text-xs text-pink-600 mb-2">Use shapes to draw:</p>
          <div className="h-32 rounded border border-pink-300 bg-white">
            <p className="p-2 text-xs text-pink-600">Draw a picture using shapes</p>
          </div>
        </div>
      </div>
    )
  },
  'interactive-art-patterns': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const patternTypes = pickMany(rng, ['AB', 'ABC', 'AAB', 'ABB'], 3)
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-600">Create patterns and explore symmetry through drawing and coloring activities.</p>
        <div className="space-y-3">
          {patternTypes.map((pattern, idx) => (
            <div key={idx} className="rounded-xl border border-pink-200 bg-pink-50 p-4">
              <p className="text-sm font-semibold text-pink-700 mb-2">Pattern {pattern}</p>
              <div className="flex gap-2 mb-2">
                {pattern.split('').map((char, cIdx) => (
                  <div key={cIdx} className="h-12 w-12 rounded border border-pink-300 bg-white"></div>
                ))}
                <div className="h-12 w-12 rounded border border-dashed border-pink-400 bg-pink-100"></div>
              </div>
              <p className="text-xs text-pink-600">Continue the pattern:</p>
              <div className="h-12 border border-dashed border-pink-300 bg-white rounded mt-2"></div>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-pink-200 bg-pink-50 p-4">
          <p className="text-sm font-semibold text-pink-700 mb-2">Symmetry</p>
          <div className="h-32 rounded border border-pink-300 bg-white">
            <p className="p-2 text-xs text-pink-600">Draw a symmetrical design</p>
          </div>
        </div>
      </div>
    )
  },
  'interactive-art-perspective': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const techniques = pickMany(rng, ['perspective', 'shading', 'texture', 'composition'], 4)
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-600">Learn about perspective, shading, and artistic techniques through guided exercises.</p>
        <div className="space-y-3">
          {techniques.map((technique, idx) => (
            <div key={idx} className="rounded-xl border border-pink-200 bg-pink-50 p-4">
              <p className="text-sm font-semibold text-pink-700 capitalize mb-2">{technique}</p>
              <div className="h-24 rounded border border-pink-300 bg-white mb-2">
                <p className="p-2 text-xs text-pink-600">Practice {technique}</p>
              </div>
              <p className="text-xs text-pink-600">Notes: ________________________________</p>
            </div>
          ))}
        </div>
      </div>
    )
  },
  'interactive-logic-matching': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const pairs = pickMany(rng, [
      { item1: 'apple', item2: 'fruit' },
      { item1: 'car', item2: 'vehicle' },
      { item1: 'book', item2: 'reading' },
      { item1: 'sun', item2: 'day' },
    ], 4)
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-600">Match objects, pictures, and concepts. Practice memory and recognition skills.</p>
        <div className="grid gap-3 md:grid-cols-2">
          {pairs.map((pair, idx) => (
            <div key={idx} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex-1 bg-white rounded border border-slate-200 p-2 text-center">
                  <p className="text-sm text-slate-700">{pair.item1}</p>
                </div>
                <span className="text-slate-400">→</span>
                <div className="flex-1 bg-white rounded border border-slate-200 p-2 text-center">
                  <p className="text-sm text-slate-700">{pair.item2}</p>
                </div>
              </div>
              <div className="h-16 rounded border border-dashed border-slate-300 bg-white">
                <p className="p-2 text-xs text-slate-500">Draw a line to match</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  },
  'interactive-logic-classification': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const categories = pickMany(rng, [
      { name: 'Animals', items: ['dog', 'cat', 'bird'] },
      { name: 'Food', items: ['apple', 'bread', 'milk'] },
      { name: 'Colors', items: ['red', 'blue', 'green'] },
    ], 3)
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-600">Sort and classify objects, pictures, and concepts into groups.</p>
        <div className="space-y-3">
          {categories.map((category, idx) => (
            <div key={idx} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-700 mb-2">{category.name}</p>
              <div className="flex flex-wrap gap-2 mb-2">
                {category.items.map((item, iIdx) => (
                  <span key={iIdx} className="text-xs px-2 py-1 bg-white rounded border border-slate-300 text-slate-700">{item}</span>
                ))}
              </div>
              <p className="text-xs text-slate-600">Add more {category.name.toLowerCase()}: ________________</p>
            </div>
          ))}
        </div>
      </div>
    )
  },
  'interactive-logic-analogies': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const analogies = pickMany(rng, [
      { first: 'cat', second: 'kitten', third: 'dog', answer: 'puppy' },
      { first: 'sun', second: 'day', third: 'moon', answer: 'night' },
      { first: 'book', second: 'read', third: 'food', answer: 'eat' },
    ], 3)
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-600">Practice identifying relationships and completing analogies.</p>
        <div className="space-y-3">
          {analogies.map((analogy, idx) => (
            <div key={idx} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-700 mb-2">Analogy {idx + 1}</p>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-slate-700">{analogy.first}</span>
                <span className="text-slate-400">is to</span>
                <span className="text-sm text-slate-700">{analogy.second}</span>
                <span className="text-slate-400">as</span>
                <span className="text-sm text-slate-700">{analogy.third}</span>
                <span className="text-slate-400">is to</span>
                <div className="h-8 w-20 border border-dashed border-slate-400 bg-white rounded"></div>
              </div>
              <p className="text-xs text-slate-600">Answer: {analogy.answer}</p>
            </div>
          ))}
        </div>
      </div>
    )
  },
  'interactive-sel-friendship': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const scenarios = pickMany(rng, [
      { situation: 'A new student joins your class', action: 'introduce yourself' },
      { situation: 'A friend is sad', action: 'ask how they feel' },
      { situation: 'Someone needs help', action: 'offer to help' },
    ], 3)
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-600">Learn about making friends, sharing, taking turns, and being kind to others.</p>
        <div className="space-y-3">
          {scenarios.map((scenario, idx) => (
            <div key={idx} className="rounded-xl border border-pink-200 bg-pink-50 p-4">
              <p className="text-sm font-semibold text-pink-700 mb-2">Situation: {scenario.situation}</p>
              <p className="text-xs text-pink-600 mb-2">What can you do? {scenario.action}</p>
              <div className="h-12 border border-dashed border-pink-300 bg-white rounded"></div>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-pink-200 bg-pink-50 p-4">
          <p className="text-sm font-semibold text-pink-700 mb-2">Ways to Be a Good Friend</p>
          <ul className="list-disc list-inside space-y-1 text-xs text-pink-600">
            <li>Share and take turns</li>
            <li>Listen when others talk</li>
            <li>Be kind and helpful</li>
            <li>Include everyone</li>
          </ul>
        </div>
      </div>
    )
  },
  'interactive-sel-gratitude': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const prompts = pickMany(rng, [
      'Something I am thankful for',
      'Someone who helps me',
      'Something that makes me happy',
      'A place I love',
    ], 4)
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-600">Practice gratitude through writing, drawing, and reflection activities.</p>
        <div className="grid gap-3 md:grid-cols-2">
          {prompts.map((prompt, idx) => (
            <div key={idx} className="rounded-xl border border-pink-200 bg-pink-50 p-4">
              <p className="text-sm font-semibold text-pink-700 mb-2">{prompt}:</p>
              <div className="h-16 rounded border border-pink-300 bg-white mb-2">
                <p className="p-2 text-xs text-pink-600">Draw or write</p>
              </div>
              <div className="h-10 border border-dashed border-pink-300 bg-white rounded"></div>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-pink-200 bg-pink-50 p-4">
          <p className="text-sm font-semibold text-pink-700 mb-2">Gratitude Journal</p>
          <p className="text-xs text-pink-600 mb-2">Today I am grateful for:</p>
          <div className="h-20 border border-dashed border-pink-300 bg-white rounded"></div>
        </div>
      </div>
    )
  },
}

const answerRenderers: Record<string, AnswerRenderer> = {
  'interactive-math-rhythm': ({ doc, seed, variant }) => {
    const sequences = buildMathRhythm(seed, doc.id, variant)
    return (
      <ol className="list-decimal list-inside space-y-2">
        {sequences.map((sequence, idx) => {
          const missing = sequence.blankIndices.map((blankIdx) => sequence.values[blankIdx])
          return (
            <li key={idx}>
              <span className="font-semibold">Pattern {idx + 1}:</span>{' '}
              {sequence.values.join(', ')}{' '}
              <span className="text-emerald-700">
                (missing {missing.join(' & ')})
              </span>
            </li>
          )
        })}
      </ol>
    )
  },
  'interactive-math-race': ({ doc, seed, variant }) => {
    const problems = buildMathRace(seed, doc.id, variant)
    return (
      <div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
        {problems.map((prob, idx) => (
          <div key={idx} className="rounded border border-emerald-200 bg-white px-3 py-2 font-semibold text-emerald-800">
            {prob.first} {prob.op} {prob.second} = {prob.answer}
          </div>
        ))}
      </div>
    )
  },
  'interactive-math-puzzle': ({ doc, seed, variant }) => {
    const puzzles = buildMathPuzzle(seed, doc.id, variant)
    return (
      <ol className="list-decimal list-inside space-y-2">
        {puzzles.map((puzzle, idx) => (
          <li key={idx}>
            <span className="font-semibold">Puzzle {idx + 1} answer:</span> {puzzle.answer}
          </li>
        ))}
      </ol>
    )
  },
  'interactive-math-shapes': ({ doc, seed, variant }) => {
    const rows = buildMathShapes(seed, doc.id, variant)
    return (
      <ul className="space-y-2 text-sm">
        {rows.map((row, idx) => {
          const info = SHAPE_INFO[row.shape] ?? { kind: 'flat', sidesLabel: '' }
          return (
            <li key={idx}>
                <span className="font-semibold capitalize">{row.shape}</span> • {info.kind === 'flat' ? 'Flat shape' : 'Solid shape'}; {info.sidesLabel}
            </li>
          )
        })}
      </ul>
    )
  },
  'interactive-math-money': ({ doc, seed, variant }) => {
    const prompts = buildMathMoney(seed, doc.id, variant)
    return (
      <ol className="list-decimal list-inside space-y-2">
        {prompts.map((prompt, idx) => {
          const coinWord = prompt.coinCount === 1 
            ? prompt.coin.replace(/s$/, '') // Remove 's' for singular
            : prompt.coin
          return (
            <li key={idx}>
              <span className="font-semibold capitalize">{prompt.item}</span>: use {prompt.coinCount} {coinWord} (${(prompt.amount / 100).toFixed(2)}).
            </li>
          )
        })}
      </ol>
    )
  },
  'interactive-math-fractions': ({ doc, seed, variant }) => {
    const pairs = buildMathFractions(seed, doc.id, variant)
    return (
      <ol className="list-decimal list-inside space-y-2">
        {pairs.map((pair, idx) => {
          const leftValue = pair.left.num / pair.left.den
          const rightValue = pair.right.num / pair.right.den
          const formatValue = (value: number) => (Number.isInteger(value) ? value.toString() : value.toFixed(2))
          return (
            <li key={idx}>
              {pair.left.num}/{pair.left.den} {pair.comparison} {pair.right.num}/{pair.right.den}{' '}
              <span className="text-emerald-700">
                ({formatValue(leftValue)} vs {formatValue(rightValue)})
              </span>
            </li>
          )
        })}
      </ol>
    )
  },
  'interactive-math-measurement': ({ doc, seed, variant }) => {
    const problems = buildMathMeasurement(seed, doc.id, variant)
    return (
      <ul className="space-y-2 text-sm">
        {problems.map((problem, idx) => {
          const formatted = Number.isInteger(problem.converted)
            ? problem.converted.toString()
            : problem.converted.toFixed(2)
          // Handle singular/plural correctly
          const unit = problem.converted === 1 ? problem.to.replace(/s$/, '') : problem.to
          return (
            <li key={idx}>
              {problem.amount} {problem.from} = {formatted} {unit}
            </li>
          )
        })}
      </ul>
    )
  },
  'interactive-reading-storymap': ({ doc, seed, variant }) => {
    const story = buildReadingStoryMap(seed, doc.id, variant)
    return (
      <div className="space-y-3 text-sm">
        <div>
          <p className="font-semibold text-emerald-900">Story outline</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>
              <span className="font-semibold">Beginning:</span> {story.beginning}
            </li>
            <li>
              <span className="font-semibold">Middle:</span> {story.middle}
            </li>
            <li>
              <span className="font-semibold">Ending:</span> {story.ending}
            </li>
          </ol>
        </div>
        <div>
          <p className="font-semibold text-emerald-900">Clues spotted</p>
          <ol className="list-decimal list-inside space-y-1">
            {story.clues.map((clue, idx) => (
              <li key={idx}>{clue}</li>
            ))}
          </ol>
        </div>
        <div>
          <p className="font-semibold text-emerald-900">Comprehension guide</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>
              They visit the {story.setting} to {story.goal}.
            </li>
            <li>{story.obstacle}</li>
            <li>
              {story.helper} helps them; they complete the goal and learn {story.lesson}.
            </li>
          </ol>
        </div>
      </div>
    )
  },
  'interactive-early-shapes': ({ doc, seed, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const shapes = pickMany(rng, ['circle', 'square', 'triangle', 'rectangle', 'star', 'heart'], 4)
    const colors = pickMany(rng, ['red', 'blue', 'yellow', 'green', 'purple', 'orange'], 4)
    return (
      <ul className="space-y-2 text-sm">
        {shapes.map((shape, idx) => (
          <li key={idx}>
            <span className="font-semibold capitalize">Shape {idx + 1}:</span> {shape} • Color: {colors[idx]} • Students should identify the shape, color it {colors[idx]}, and draw 2 more {shape}s
          </li>
        ))}
        <li className="mt-2 text-emerald-800">Sorting: Students can sort by shape type (circles together, squares together) or by color (all red shapes, all blue shapes)</li>
      </ul>
    )
  },
  'interactive-early-letters': ({ doc, seed, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const letters = pickMany(rng, ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'], 4)
    return (
      <ul className="space-y-2 text-sm">
        {letters.map((letter) => (
          <li key={letter}>
            <span className="font-semibold">Letter {letter}:</span> Students should trace uppercase and lowercase {letter}, write it 3 times, and draw a picture starting with {letter} (e.g., {letter === 'A' ? 'apple' : letter === 'B' ? 'ball' : letter === 'C' ? 'cat' : 'word'})
          </li>
        ))}
      </ul>
    )
  },
  'interactive-early-numbers': ({ doc, seed, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const numbers = pickMany(rng, Array.from({ length: 20 }, (_, i) => i + 1), 4)
    return (
      <ul className="space-y-2 text-sm">
        {numbers.map((num) => (
          <li key={num}>
            <span className="font-semibold">Number {num}:</span> Students should trace {num}, write it, draw {num} objects, and recognize the number word "{numberWords[num - 1] || num}"
          </li>
        ))}
      </ul>
    )
  },
  'interactive-early-foundations': ({ doc, seed, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    return (
      <div className="space-y-2 text-sm">
        <p><span className="font-semibold">Letters:</span> Students identify and name letters correctly</p>
        <p><span className="font-semibold">Numbers:</span> Students identify and name numbers correctly</p>
        <p><span className="font-semibold">Shapes:</span> Students identify and name shapes correctly</p>
        <p className="mt-2 text-emerald-800">Note: This is a review/remediation worksheet. Accept correct identification of letters, numbers, and shapes. For writing practice, check that students can write their name and count to 10.</p>
      </div>
    )
  },
  'interactive-early-basics': ({ doc, seed, variant }) => {
    return (
      <div className="space-y-2 text-sm">
        <p><span className="font-semibold">Letter Sounds:</span> Students should recognize beginning sounds (/a/ for apple, /b/ for ball, etc.)</p>
        <p><span className="font-semibold">Counting:</span> Students should count accurately 1-5, 5-10, and count objects with one-to-one correspondence</p>
        <p><span className="font-semibold">Patterns:</span> Students should identify and continue AB, ABC, and color patterns</p>
        <p className="mt-2 text-emerald-800">Note: These are foundational skills. Provide support as needed and celebrate progress.</p>
      </div>
    )
  },
  'interactive-reading-prek': ({ doc, seed, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const stories = [
      { title: 'The Red Car', questions: ['Do you see a car?', 'Is the car on the road?'] },
      { title: 'The Sunny Day', questions: ['Do you see the sun?', 'Is there a flower?'] },
      { title: 'The Big Tree', questions: ['Is the tree big?', 'Do you see a house?'] },
    ]
    return (
      <ul className="space-y-2 text-sm">
        {stories.map((story, idx) => (
          <li key={idx}>
            <span className="font-semibold">{story.title}:</span>
            <ul className="ml-4 mt-1 list-disc space-y-1">
              {story.questions.map((q, qIdx) => (
                <li key={qIdx}>{q} - Accept yes/no answers based on picture clues. Students should look at the pictures to answer.</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    )
  },
  'interactive-writing-prek': ({ doc, seed, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const prompts = pickMany(
      rng,
      [
        { word: 'cat', picture: 'Draw a cat' },
        { word: 'dog', picture: 'Draw a dog' },
        { word: 'sun', picture: 'Draw the sun' },
        { word: 'car', picture: 'Draw a car' },
        { word: 'tree', picture: 'Draw a tree' },
        { word: 'flower', picture: 'Draw a flower' },
      ],
      4
    )
    return (
      <ul className="space-y-2 text-sm">
        {prompts.map((prompt, idx) => (
          <li key={idx}>
            <span className="font-semibold">Word {prompt.word}:</span> Students should draw a picture representing {prompt.word} and label it with the word "{prompt.word}". Accept any recognizable drawing and correct spelling of the word.
          </li>
        ))}
      </ul>
    )
  },
  'interactive-science-prek': ({ doc, seed, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const observations = pickMany(
      rng,
      [
        { topic: 'Plants', question: 'What do plants need?', options: ['water', 'sun', 'soil'] },
        { topic: 'Animals', question: 'Where do animals live?', options: ['forest', 'ocean', 'farm'] },
        { topic: 'Weather', question: 'What is the weather like?', options: ['sunny', 'rainy', 'cloudy'] },
        { topic: 'Seasons', question: 'What season is it?', options: ['spring', 'summer', 'fall', 'winter'] },
      ],
      3
    )
    return (
      <ul className="space-y-2 text-sm">
        {observations.map((obs, idx) => (
          <li key={idx}>
            <span className="font-semibold">{obs.topic}:</span> {obs.question} - Accept any of: {obs.options.join(', ')}. Students should draw or paste a picture related to the topic.
          </li>
        ))}
      </ul>
    )
  },
  'interactive-science-space': ({ doc, seed, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const planets = pickMany(
      rng,
      [
        { name: 'Mercury', fact: 'Closest to the sun', distance: '36 million miles' },
        { name: 'Venus', fact: 'Hottest planet', distance: '67 million miles' },
        { name: 'Mars', fact: 'The red planet', distance: '142 million miles' },
        { name: 'Jupiter', fact: 'Largest planet', distance: '484 million miles' },
      ],
      4
    )
    return (
      <ul className="space-y-2 text-sm">
        {planets.map((planet, idx) => (
          <li key={idx}>
            <span className="font-semibold">{planet.name}:</span> {planet.fact}. Distance from sun: {planet.distance}. Students should draw the planet and remember the key fact.
          </li>
        ))}
        <li className="mt-2 text-emerald-800">Space Questions: A star is a hot ball of gas that gives off light. Any planet name is acceptable (Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune).</li>
      </ul>
    )
  },
  'interactive-geography-prek': ({ doc, seed, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const places = pickMany(
      rng,
      [
        { name: 'Home', type: 'Where I live', features: ['bedroom', 'kitchen'] },
        { name: 'School', type: 'Where I learn', features: ['classroom', 'playground'] },
        { name: 'Park', type: 'Where I play', features: ['swings', 'slides'] },
      ],
      3
    )
    return (
      <ul className="space-y-2 text-sm">
        {places.map((place, idx) => (
          <li key={idx}>
            <span className="font-semibold">{place.name}:</span> {place.type}. Features include: {place.features.join(', ')}. Students should draw a simple map showing these features.
          </li>
        ))}
      </ul>
    )
  },
  'interactive-grammar-prek': ({ doc, seed, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const words = pickMany(
      rng,
      [
        { word: 'cat', picture: '🐱' },
        { word: 'dog', picture: '🐶' },
        { word: 'sun', picture: '☀️' },
        { word: 'car', picture: '🚗' },
        { word: 'tree', picture: '🌳' },
        { word: 'flower', picture: '🌸' },
      ],
      4
    )
    return (
      <ul className="space-y-2 text-sm">
        {words.map((item, idx) => (
          <li key={idx}>
            <span className="font-semibold">Word {item.word}:</span> Match the picture ({item.picture}) with the word "{item.word}". Students should circle the correct word.
          </li>
        ))}
        <li className="mt-2 text-emerald-800">All words are nouns (naming words). Students are learning basic word recognition and matching.</li>
      </ul>
    )
  },
  'interactive-logic-prek': ({ doc, seed, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const patterns = pickMany(rng, ['AB', 'AAB', 'ABC'], 3)
    return (
      <div className="space-y-2 text-sm">
        {patterns.map((pattern, idx) => {
          const first = pick(rng, SHAPE_TOKENS)
          const second = pick(rng, SHAPE_TOKENS.filter((token) => token.key !== first.key))
          const third = pattern === 'ABC' ? pick(rng, SHAPE_TOKENS.filter((token) => token.key !== first.key && token.key !== second.key)) : second
          const nextItem = pattern === 'AB' ? first : pattern === 'AAB' ? second : third
          return (
            <p key={idx}>
              <span className="font-semibold">Pattern {pattern}:</span> Continue the pattern. Next item should be: {nextItem.label}
            </p>
          )
        })}
        <p className="mt-2 text-emerald-800">Sorting: Students can sort by color (red, blue, yellow), size (big, small), or shape (round, square). Accept any logical sorting.</p>
      </div>
    )
  },
  'interactive-sel-prek': ({ doc, seed, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const feelings = pickMany(
      rng,
      [
        { feeling: 'happy', emoji: '😊', color: 'yellow' },
        { feeling: 'sad', emoji: '😢', color: 'blue' },
        { feeling: 'angry', emoji: '😠', color: 'red' },
        { feeling: 'excited', emoji: '🤩', color: 'orange' },
      ],
      4
    )
    return (
      <ul className="space-y-2 text-sm">
        {feelings.map((feeling, idx) => (
          <li key={idx}>
            <span className="font-semibold capitalize">{feeling.feeling}:</span> {feeling.emoji} - Color: {feeling.color}. Students should identify the feeling and draw a time they felt {feeling.feeling}.
          </li>
        ))}
        <li className="mt-2 text-emerald-800">How I Feel Today: Students can circle any feeling they're experiencing. All feelings are valid. Encourage discussion about emotions.</li>
      </ul>
    )
  },
  'interactive-reading-adventure': ({ doc, seed, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const heroes = ['Maya', 'Jasper', 'Alani', 'Theo', 'Priya', 'Leo']
    const settings = ['hidden treehouse', 'floating library', 'midnight carnival', 'desert lab', 'mountain observatory']
    const quests = ['recover a lost map', 'decode a riddle', 'repair the story fountain', 'help a time-traveling turtle', 'track a glowing comet']
    const hero = pick(rng, heroes)
    const partner = pick(rng, heroes.filter((name) => name !== hero))
    const setting = pick(rng, settings)
    const quest = pick(rng, quests)
    return (
      <div className="space-y-2 text-sm">
        <p><span className="font-semibold">Problem:</span> {hero} and {partner} need to {quest}.</p>
        <p><span className="font-semibold">Setting:</span> The {setting} provides clues and challenges.</p>
        <p className="text-emerald-800">Note: Answers will vary based on student interpretation. Look for evidence from the story and logical reasoning.</p>
      </div>
    )
  },
  'interactive-reading-detective': ({ doc, seed, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const mysteries = [
      { title: 'The Missing Lab Goggles', culprit: 'an absent-minded janitor', clue: 'a trail of glitter', setting: 'science fair' },
      { title: 'Case of the Empty Birdhouse', culprit: 'a helpful raccoon', clue: 'muddy paw prints', setting: 'school garden' },
      { title: 'The Whispering Lockers', culprit: 'a friendly robot', clue: 'battery crumbs', setting: 'hallway' },
    ]
    const caseFile = pick(rng, mysteries)
    return (
      <div className="space-y-2 text-sm">
        <p><span className="font-semibold">Culprit:</span> {caseFile.culprit}</p>
        <p><span className="font-semibold">Key clue:</span> {caseFile.clue}</p>
        <p className="text-emerald-800">Note: Students should use text evidence to support their inferences. Accept reasonable answers that reference the clues.</p>
      </div>
    )
  },
  'interactive-reading-vocab': ({ doc, seed, variant }) => {
    return (
      <div className="space-y-2 text-sm">
        <p><span className="font-semibold">Vocabulary Strategy:</span> Use context clues from surrounding words and sentences to determine word meaning.</p>
        <p className="text-emerald-800">Note: Answers will vary. Accept definitions that show understanding of context clues and word relationships.</p>
      </div>
    )
  },
  'interactive-reading-summary': ({ doc, seed, variant }) => {
    return (
      <div className="space-y-2 text-sm">
        <p><span className="font-semibold">Summary Guidelines:</span> Include who, what, where, when, and why. Focus on main events, not details.</p>
        <p className="text-emerald-800">Note: Summaries will vary. Look for inclusion of main ideas and key events in student's own words.</p>
      </div>
    )
  },
  'interactive-reading-compare': ({ doc, seed, variant }) => {
    return (
      <div className="space-y-2 text-sm">
        <p><span className="font-semibold">Compare & Contrast:</span> Look for similarities (alike) and differences between the two texts.</p>
        <p className="text-emerald-800">Note: Answers will vary. Accept comparisons that reference specific details from both texts.</p>
      </div>
    )
  },
  'interactive-writing-sentences': ({ doc, seed, variant }) => {
    return (
      <div className="space-y-2 text-sm">
        <p><span className="font-semibold">Sentence Building:</span> Complete sentences should have a subject and predicate. Compound sentences use conjunctions (and, but, or).</p>
        <p className="text-emerald-800">Note: Answers will vary. Check for complete thoughts, proper punctuation, and varied sentence structure.</p>
      </div>
    )
  },
  'interactive-science-observation': ({ doc, seed, variant }) => {
    return (
      <div className="space-y-2 text-sm">
        <p><span className="font-semibold">Observation Skills:</span> Students should record what they see, hear, smell, touch, or measure accurately.</p>
        <p className="text-emerald-800">Note: Observations will vary. Look for detailed, factual descriptions and use of scientific vocabulary.</p>
      </div>
    )
  },
  'interactive-science-lifecycle': ({ doc, seed, variant }) => {
    return (
      <div className="space-y-2 text-sm">
        <p><span className="font-semibold">Life Cycle Stages:</span> Typical stages include: egg/seed → young/hatchling → juvenile → adult. Stages vary by organism.</p>
        <p className="text-emerald-800">Note: Accept accurate stage names and descriptions. Students should show understanding of growth and development.</p>
      </div>
    )
  },
  'interactive-science-states': ({ doc, seed, variant }) => {
    return (
      <div className="space-y-2 text-sm">
        <p><span className="font-semibold">States of Matter:</span> Solid → Liquid (melting), Liquid → Gas (evaporation), Liquid → Solid (freezing), Gas → Liquid (condensation).</p>
        <p className="text-emerald-800">Note: Particle diagrams should show particles closer together in solids, further apart in gases.</p>
      </div>
    )
  },
  'interactive-science-weather': ({ doc, seed, variant }) => {
    return (
      <div className="space-y-2 text-sm">
        <p><span className="font-semibold">Weather Safety:</span> Examples: Stay indoors during storms, wear sunscreen on sunny days, dress warmly in snow.</p>
        <p className="text-emerald-800">Note: Safety tips will vary. Accept reasonable safety advice appropriate for each weather condition.</p>
      </div>
    )
  },
  'interactive-geography-map': ({ doc, seed, variant }) => {
    return (
      <div className="space-y-2 text-sm">
        <p><span className="font-semibold">Map Skills:</span> Use coordinates (letter + number) to locate places. Check that students can read the grid correctly.</p>
        <p className="text-emerald-800">Note: Map content will vary. Verify coordinate reading accuracy and landmark identification.</p>
      </div>
    )
  },
  'interactive-geography-culture': ({ doc, seed, variant }) => {
    return (
      <div className="space-y-2 text-sm">
        <p><span className="font-semibold">Cultural Research:</span> Students should research authentic information about foods, celebrations, and facts for each region.</p>
        <p className="text-emerald-800">Note: Answers will vary based on research. Encourage accuracy and respect for different cultures.</p>
      </div>
    )
  },
  'interactive-geography-history': ({ doc, seed, variant }) => {
    return (
      <div className="space-y-2 text-sm">
        <p><span className="font-semibold">Historical Impact:</span> Students should explain how each event changed society, technology, or daily life.</p>
        <p className="text-emerald-800">Note: Impact descriptions will vary. Look for thoughtful connections between events and their consequences.</p>
      </div>
    )
  },
  'interactive-grammar-parts': ({ doc, seed, variant }) => {
    return (
      <div className="space-y-2 text-sm">
        <p><span className="font-semibold">Parts of Speech:</span> Noun (person/place/thing), Verb (action), Adjective (describes noun), Adverb (describes verb).</p>
        <p className="text-emerald-800">Note: Answers will vary based on sentence content. Check for correct identification of parts of speech.</p>
      </div>
    )
  },
  'interactive-grammar-tenses': ({ doc, seed, variant }) => {
    return (
      <div className="space-y-2 text-sm">
        <p><span className="font-semibold">Verb Tenses:</span> Past (add -ed or irregular forms), Present (base form or -s for he/she/it), Future (will + base form).</p>
        <p className="text-emerald-800">Note: Conjugations will vary. Verify correct tense formation and usage in sentences.</p>
      </div>
    )
  },
  'interactive-grammar-antonyms': ({ doc, seed, variant }) => {
    return (
      <div className="space-y-2 text-sm">
        <p><span className="font-semibold">Antonyms:</span> timid/confident, ancient/modern, dull/vibrant, brisk/lazy, polite/rude.</p>
        <p className="text-emerald-800">Note: Sentences will vary. Check that antonyms are used correctly and sentences make sense.</p>
      </div>
    )
  },
  'interactive-art-design': ({ doc, seed, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const coloringPages = pickMany(rng, [
      { title: 'Geometric Star', emoji: '⭐', description: 'Color the star pattern with your favorite colors!' },
      { title: 'Flower Pattern', emoji: '🌸', description: 'Color the flower petals: pink, yellow, and purple' },
      { title: 'Rainbow Pattern', emoji: '🌈', description: 'Color each stripe: red, orange, yellow, green, blue, purple' },
      { title: 'Heart Design', emoji: '❤️', description: 'Color the hearts red and pink' },
      { title: 'Circle Mandala', emoji: '⭕', description: 'Color the circles with different colors' },
      { title: 'Leaf Pattern', emoji: '🍃', description: 'Color the leaves green' },
    ], 4)
    return (
      <ul className="space-y-2 text-sm">
        {coloringPages.map((page, idx) => (
          <li key={idx}>
            <span className="font-semibold">{page.title}:</span> {page.description}. Students should color the pattern following the instructions. Encourage creativity!
          </li>
        ))}
        <li className="mt-2 text-emerald-800">All coloring efforts are wonderful! Focus on staying within lines and using appropriate colors.</li>
      </ul>
    )
  },
  'interactive-art-sketch': ({ doc, seed, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const drawingPrompts = pickMany(rng, [
      { prompt: 'Draw a beautiful flower', emoji: '🌺', hint: 'Add petals and a stem!' },
      { prompt: 'Draw a tree with leaves', emoji: '🌳', hint: 'Make it big and green!' },
      { prompt: 'Draw geometric shapes', emoji: '⬜', hint: 'Draw circles, squares, and triangles!' },
      { prompt: 'Draw a rainbow', emoji: '🌈', hint: 'Use all the colors!' },
      { prompt: 'Draw a pattern', emoji: '✨', hint: 'Create your own design!' },
      { prompt: 'Draw a garden scene', emoji: '🌻', hint: 'Add flowers and plants!' },
    ], 3)
    return (
      <ul className="space-y-2 text-sm">
        {drawingPrompts.map((item, idx) => (
          <li key={idx}>
            <span className="font-semibold">{item.prompt}:</span> {item.hint} Students should draw their own interpretation. All drawings are great!
          </li>
        ))}
        <li className="mt-2 text-emerald-800">Encourage students to use their imagination and have fun drawing!</li>
      </ul>
    )
  },
  'interactive-early-phonics': ({ doc, seed, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const sounds = pickMany(rng, ['m', 's', 't', 'b', 'p', 'n', 'f', 'r'], 4)
    const words = {
      m: ['moon', 'map', 'mouse'],
      s: ['sun', 'sock', 'seal'],
      t: ['tree', 'toy', 'turtle'],
      b: ['ball', 'bus', 'bug'],
      p: ['panda', 'pie', 'pen'],
      n: ['nest', 'net', 'nose'],
      f: ['fish', 'fan', 'frog'],
      r: ['rain', 'robot', 'ring'],
    } as Record<string, string[]>
    return (
      <ul className="space-y-2 text-sm">
        {sounds.map((sound) => (
          <li key={sound}>
            <span className="font-semibold">Letter {sound.toUpperCase()}:</span> Sound: /{sound}/. Example words: {words[sound].join(', ')}. Students should trace the letter correctly and draw a picture starting with {sound}.
          </li>
        ))}
      </ul>
    )
  },
  'interactive-early-counting': ({ doc, seed, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const rows = Array.from({ length: 4 }).map(() => ({
      objects: pick(rng, ['stars', 'shells', 'dice', 'hearts', 'cars']),
      count: Math.floor(rng() * 7) + 3,
    }))
    return (
      <ul className="space-y-2 text-sm">
        {rows.map((row, idx) => (
          <li key={idx}>
            <span className="font-semibold">Count {row.count} {row.objects}:</span> Students should count accurately, fill {row.count} boxes in the ten frame, write the number {row.count}, and write the number word "{numberWords[row.count - 1] || row.count}".
          </li>
        ))}
      </ul>
    )
  },
  'interactive-early-patterns': ({ doc, seed, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const patterns = pickMany(rng, ['AB', 'AAB', 'ABC', 'ABB', 'AABB'], 4)
    return (
      <ul className="space-y-2 text-sm">
        {patterns.map((pattern, idx) => {
          const first = pick(rng, SHAPE_TOKENS)
          const second = pick(rng, SHAPE_TOKENS.filter((token) => token.key !== first.key))
          const third = pattern === 'ABC' ? pick(rng, SHAPE_TOKENS.filter((token) => token.key !== first.key && token.key !== second.key)) : second
          const nextItem = pattern === 'AB' ? first : pattern === 'AAB' ? second : pattern === 'ABC' ? third : second
          return (
            <li key={idx}>
              <span className="font-semibold">Pattern {pattern}:</span> Continue with {nextItem.label}. Students should identify and extend the pattern correctly.
            </li>
          )
        })}
      </ul>
    )
  },
  'interactive-logic-sequence': ({ doc, seed, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const tasks = pickMany(
      rng,
      [
        ['Mix batter', 'Pour into pan', 'Bake', 'Decorate'],
        ['Plant seed', 'Water daily', 'Sprout appears', 'Measure growth'],
        ['Pack backpack', 'Catch the bus', 'Arrive at museum', 'Meet the guide'],
        ['Turn on tablet', 'Open coding app', 'Debug program', 'Share project'],
      ],
      3
    )
    return (
      <ul className="space-y-2 text-sm">
        {tasks.map((task, idx) => (
          <li key={idx}>
            <span className="font-semibold">Sequence {idx + 1}:</span> Correct order: {task.join(' → ')}. Students should sequence steps logically and write a summary sentence.
          </li>
        ))}
      </ul>
    )
  },
  'interactive-logic-riddles': ({ doc, seed, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const riddles = pickMany(
      rng,
      [
        ['I have keys but open no doors. What am I?', 'A piano'],
        ['I orbit but never land. What am I?', 'A satellite'],
        ['I get wetter the more I dry. What am I?', 'A towel'],
        ['I speak without a mouth. What am I?', 'An echo'],
        ['I have hands but cannot clap. What am I?', 'A clock'],
      ],
      4
    )
    return (
      <ul className="space-y-2 text-sm">
        {riddles.map(([riddle, answer], idx) => (
          <li key={idx}>
            <span className="font-semibold">Riddle {idx + 1}:</span> {riddle} <span className="text-emerald-700">Answer: {answer}</span>
          </li>
        ))}
      </ul>
    )
  },
  'interactive-logic-deduction': ({ doc, seed, variant }) => {
    return (
      <div className="space-y-2 text-sm">
        <p><span className="font-semibold">Deductive Reasoning:</span> Use the clues to eliminate possibilities and determine who borrowed what and where.</p>
        <p className="text-emerald-800">Note: Answers will vary based on clue interpretation. Look for logical reasoning and use of all clues provided.</p>
      </div>
    )
  },
  'interactive-math-algebra': ({ doc, seed, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const problems = Array.from({ length: 5 }, () => {
      const type = pick(rng, ['solve', 'evaluate', 'simplify'])
      if (type === 'solve') {
        // Ensure integer solutions: ax + b = c, so x = (c-b)/a must be integer
        const x = Math.floor(rng() * 10) + 1 // x will be 1-10
        const a = Math.floor(rng() * 5) + 2 // a will be 2-6
        const b = Math.floor(rng() * 10) + 1 // b will be 1-10
        const c = a * x + b // Calculate c to ensure integer solution
        return { type: 'solve', eq: `${a}x + ${b} = ${c}`, answer: x }
      } else if (type === 'evaluate') {
        const a = Math.floor(rng() * 5) + 2
        const b = Math.floor(rng() * 10) + 1
        const x = Math.floor(rng() * 10) + 1
        return { type: 'evaluate', expr: `${a}x + ${b}`, x, answer: a * x + b }
      } else {
        const a = Math.floor(rng() * 5) + 2
        const b = Math.floor(rng() * 5) + 2
        return { type: 'simplify', expr: `${a}x + ${b}x`, answer: a + b }
      }
    })
    return (
      <ol className="list-decimal list-inside space-y-2">
        {problems.map((prob, idx) => (
          <li key={idx}>
            {prob.type === 'solve' && `${prob.eq} → x = ${prob.answer}`}
            {prob.type === 'evaluate' && `${prob.expr} when x = ${prob.x} → ${prob.answer}`}
            {prob.type === 'simplify' && `${prob.expr} → ${prob.answer}x`}
          </li>
        ))}
      </ol>
    )
  },
  'interactive-math-percentages': ({ doc, seed, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const problems = Array.from({ length: 5 }, () => {
      const type = pick(rng, ['percent', 'ratio', 'proportion'])
      if (type === 'percent') {
        const num = Math.floor(rng() * 50) + 10
        const total = Math.floor(rng() * 100) + 50
        return { type: 'percent', q: `What percent is ${num} of ${total}?`, answer: ((num / total) * 100).toFixed(1) + '%' }
      } else if (type === 'ratio') {
        const a = Math.floor(rng() * 10) + 2
        const b = Math.floor(rng() * 10) + 2
        return { type: 'ratio', q: `Simplify the ratio ${a * 2}:${b * 2}`, answer: `${a}:${b}` }
      } else {
        const a = Math.floor(rng() * 5) + 2
        const b = Math.floor(rng() * 5) + 2
        const c = Math.floor(rng() * 10) + 5
        return { type: 'proportion', q: `Solve: ${a}/${b} = x/${c}`, answer: ((a * c) / b).toFixed(1) }
      }
    })
    return (
      <ol className="list-decimal list-inside space-y-2">
        {problems.map((prob, idx) => (
          <li key={idx}>{prob.q} → <span className="text-emerald-700">{prob.answer}</span></li>
        ))}
      </ol>
    )
  },
  'interactive-math-geometry': ({ doc, seed, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const problems = Array.from({ length: 5 }, () => {
      const type = pick(rng, ['area', 'perimeter', 'volume', 'angle'])
      if (type === 'area') {
        const l = Math.floor(rng() * 10) + 5
        const w = Math.floor(rng() * 10) + 5
        return { type: 'area', q: `Find the area of a rectangle: length = ${l}cm, width = ${w}cm`, answer: `${l * w} cm²` }
      } else if (type === 'perimeter') {
        const s = Math.floor(rng() * 10) + 5
        return { type: 'perimeter', q: `Find the perimeter of a square with side length ${s}cm`, answer: `${s * 4} cm` }
      } else if (type === 'volume') {
        const l = Math.floor(rng() * 5) + 3
        const w = Math.floor(rng() * 5) + 3
        const h = Math.floor(rng() * 5) + 3
        return { type: 'volume', q: `Find the volume: length = ${l}cm, width = ${w}cm, height = ${h}cm`, answer: `${l * w * h} cm³` }
      } else {
        const angle = Math.floor(rng() * 60) + 30
        return { type: 'angle', q: `If two angles are supplementary and one is ${angle}°, find the other`, answer: `${180 - angle}°` }
      }
    })
    return (
      <ol className="list-decimal list-inside space-y-2">
        {problems.map((prob, idx) => (
          <li key={idx}>{prob.q} → <span className="text-emerald-700">{prob.answer}</span></li>
        ))}
      </ol>
    )
  },
  'interactive-math-statistics': ({ doc, seed, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const datasets = Array.from({ length: 3 }, () => {
      const nums = Array.from({ length: 6 }, () => Math.floor(rng() * 20) + 10).sort((a, b) => a - b)
      const mean = (nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(1)
      const median = ((nums[2] + nums[3]) / 2).toFixed(1)
      const mode = nums[Math.floor(nums.length / 2)]
      return { data: nums.join(', '), mean, median, mode }
    })
    return (
      <ul className="space-y-3">
        {datasets.map((set, idx) => (
          <li key={idx}>
            <span className="font-semibold">Data Set {idx + 1}:</span> Mean = {set.mean}, Median = {set.median}, Mode = {set.mode}
          </li>
        ))}
      </ul>
    )
  },
  'interactive-math-word-problems': ({ doc, seed, variant }) => {
    const problems = [
      { q: 'A store sells 3 notebooks for $12. How much would 7 notebooks cost?', answer: '$28' },
      { q: 'A train travels 240 miles in 4 hours. At this rate, how far will it travel in 6 hours?', answer: '360 miles' },
      { q: 'Sarah has $45. She spends 2/5 of it on books. How much does she have left?', answer: '$27' },
      { q: 'A rectangle has length 8cm and width 5cm. If the length is doubled, what is the new area?', answer: '80 cm²' },
      { q: 'In a class of 30 students, 60% are girls. How many boys are in the class?', answer: '12 boys' },
    ]
    return (
      <ol className="list-decimal list-inside space-y-2">
        {problems.map((prob, idx) => (
          <li key={idx}>{prob.q} → <span className="text-emerald-700">{prob.answer}</span></li>
        ))}
      </ol>
    )
  },
  'interactive-reading-literary-analysis': ({ doc, seed, variant }) => {
    return (
      <p className="text-sm">Student responses may vary. Look for evidence-based analysis, identification of literary elements, and clear connections between text evidence and interpretations.</p>
    )
  },
  'interactive-reading-research': ({ doc, seed, variant }) => {
    return (
      <p className="text-sm">Student responses may vary. Evaluate based on quality of sources, relevance of facts, proper citation format, and logical argument construction.</p>
    )
  },
  'interactive-writing-research': ({ doc, seed, variant }) => {
    return (
      <p className="text-sm">Student responses may vary. Check for clear thesis statement, logical outline structure, relevant sources with proper citations, and coherent organization.</p>
    )
  },
  'interactive-writing-essay': ({ doc, seed, variant }) => {
    return (
      <p className="text-sm">Student responses may vary. Evaluate based on clear thesis, well-structured paragraphs, use of evidence, logical flow, and strong conclusion.</p>
    )
  },
  'interactive-science-chemistry': ({ doc, seed, variant }) => {
    return (
      <p className="text-sm">Student responses may vary. Check for accurate definitions, clear examples, correct diagrams, and understanding of chemical concepts.</p>
    )
  },
  'interactive-science-physics': ({ doc, seed, variant }) => {
    return (
      <p className="text-sm">Student responses may vary. Evaluate based on accurate explanations, relevant real-world examples, correct formula usage, and understanding of physics principles.</p>
    )
  },
  'interactive-science-ecology': ({ doc, seed, variant }) => {
    return (
      <p className="text-sm">Student responses may vary. Look for accurate descriptions, understanding of impacts, thoughtful solutions, and awareness of environmental issues.</p>
    )
  },
  'interactive-geography-government': ({ doc, seed, variant }) => {
    return (
      <p className="text-sm">Student responses may vary. Check for understanding of government structure, citizenship concepts, rights and responsibilities, and branches of government.</p>
    )
  },
  'interactive-geography-economics': ({ doc, seed, variant }) => {
    return (
      <p className="text-sm">Student responses may vary. Evaluate based on accurate definitions, relevant examples, understanding of economic concepts, and practical budgeting skills.</p>
    )
  },
  'interactive-grammar-advanced': ({ doc, seed, variant }) => {
    return (
      <p className="text-sm">Student responses may vary. Check for correct identification of independent/dependent clauses, phrases, and understanding of complex sentence structures.</p>
    )
  },
  'interactive-grammar-vocab': ({ doc, seed, variant }) => {
    return (
      <p className="text-sm">Student responses may vary. Evaluate based on accurate definitions, use of context clues, correct usage in sentences, and understanding of academic vocabulary.</p>
    )
  },
  // NEW WRITING WORKSHEETS
  'interactive-writing-trace': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const letters = pickMany(rng, ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'], 4)
    const words = pickMany(rng, ['cat', 'dog', 'sun', 'moon', 'star', 'tree', 'car', 'bus'], 3)
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-600">
          Trace each letter, then write it 3 times. Then trace and write the words.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {letters.map((letter, idx) => (
            <div key={idx} className="rounded-xl border border-green-200 bg-green-50 p-4">
              <p className="text-sm font-semibold text-green-700 mb-2">{letter} / {letter.toLowerCase()}</p>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <span className="text-2xl text-green-600 font-light">{letter}</span>
                  <div className="flex-1 h-8 border border-dashed border-green-300 bg-white rounded"></div>
                </div>
                <p className="text-xs text-green-600">Write 3 times:</p>
                <div className="flex gap-2">
                  <div className="flex-1 h-8 border border-dashed border-green-300 bg-white rounded"></div>
                  <div className="flex-1 h-8 border border-dashed border-green-300 bg-white rounded"></div>
                  <div className="flex-1 h-8 border border-dashed border-green-300 bg-white rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-green-200 bg-green-50 p-4">
          <p className="text-sm font-semibold text-green-700 mb-2">Word Tracing</p>
          <div className="space-y-2">
            {words.map((word, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <span className="text-sm text-green-700 font-semibold w-16">{word}:</span>
                <div className="flex-1 h-8 border border-dashed border-green-300 bg-white rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  },
  'interactive-writing-pictures': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const prompts = pickMany(rng, [
      { picture: 'A sunny day at the park', question: 'What do you see?' },
      { picture: 'A family having dinner', question: 'What are they doing?' },
      { picture: 'Children playing together', question: 'How do they feel?' },
      { picture: 'A garden with flowers', question: 'What colors do you see?' },
    ], 4)
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-600">
          Look at each picture prompt and write simple sentences or a short story about what you see.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {prompts.map((prompt, idx) => (
            <div key={idx} className="rounded-xl border border-blue-200 bg-blue-50 p-4">
              <p className="text-sm font-semibold text-blue-700 mb-2">{prompt.picture}</p>
              <div className="mt-2 h-24 rounded border border-dashed border-blue-300 bg-white">
                <p className="p-2 text-xs text-blue-600">Draw the picture</p>
              </div>
              <p className="mt-2 text-xs text-blue-700">{prompt.question}</p>
              <div className="mt-1 h-12 rounded border border-dashed border-blue-300 bg-white"></div>
              <p className="mt-2 text-xs text-blue-600">Write a sentence:</p>
              <div className="mt-1 h-10 rounded border border-dashed border-blue-300 bg-white"></div>
            </div>
          ))}
        </div>
      </div>
    )
  },
  'interactive-writing-narrative': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const storyStarters = pickMany(rng, [
      'One sunny morning, I discovered...',
      'The magic door opened and...',
      'When I looked in the mirror, I saw...',
      'The old tree in the backyard began to...',
    ], 2)
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-600">
          Write a short story with a beginning, middle, and end. Use the story planning template below.
        </p>
        <div className="rounded-xl border border-purple-200 bg-purple-50 p-4 mb-4">
          <p className="text-sm font-semibold text-purple-700 mb-2">Story Starters (choose one):</p>
          <ul className="list-disc list-inside space-y-1 text-xs text-purple-600">
            {storyStarters.map((starter, idx) => (
              <li key={idx}>{starter}</li>
            ))}
          </ul>
        </div>
        <div className="space-y-3">
          <div className="rounded-xl border border-purple-200 bg-white p-4">
            <p className="text-sm font-semibold text-purple-800 mb-2">Beginning</p>
            <p className="text-xs text-slate-600 mb-1">Who are the characters? Where are they?</p>
            <div className="mt-2 h-16 border border-slate-200 rounded bg-slate-50"></div>
          </div>
          <div className="rounded-xl border border-purple-200 bg-white p-4">
            <p className="text-sm font-semibold text-purple-800 mb-2">Middle</p>
            <p className="text-xs text-slate-600 mb-1">What problem happens? What do they do?</p>
            <div className="mt-2 h-20 border border-slate-200 rounded bg-slate-50"></div>
          </div>
          <div className="rounded-xl border border-purple-200 bg-white p-4">
            <p className="text-sm font-semibold text-purple-800 mb-2">End</p>
            <p className="text-xs text-slate-600 mb-1">How is the problem solved? What do they learn?</p>
            <div className="mt-2 h-16 border border-slate-200 rounded bg-slate-50"></div>
          </div>
        </div>
      </div>
    )
  },
  'interactive-writing-informative': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const topics = pickMany(rng, [
      'How plants grow',
      'The life cycle of a butterfly',
      'How to care for a pet',
      'The water cycle',
    ], 1)
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-600">
          Write an informative paragraph about the topic below. Include facts, details, and explanations.
        </p>
        <div className="rounded-xl border border-teal-200 bg-teal-50 p-4 mb-4">
          <p className="text-sm font-semibold text-teal-900">Topic: {topics[0]}</p>
        </div>
        <div className="space-y-3">
          <div className="rounded-xl border border-teal-200 bg-white p-4">
            <p className="text-sm font-semibold text-teal-800 mb-2">Introduction</p>
            <p className="text-xs text-slate-600 mb-1">Hook sentence: ________________________________</p>
            <p className="text-xs text-slate-600 mb-1">Main idea: ____________________________________</p>
            <div className="mt-2 h-12 border border-slate-200 rounded bg-slate-50"></div>
          </div>
          <div className="rounded-xl border border-teal-200 bg-white p-4">
            <p className="text-sm font-semibold text-teal-800 mb-2">Body Paragraph</p>
            <p className="text-xs text-slate-600 mb-1">Fact 1: ______________________________________</p>
            <p className="text-xs text-slate-600 mb-1">Detail: ______________________________________</p>
            <p className="text-xs text-slate-600 mb-1">Fact 2: ______________________________________</p>
            <p className="text-xs text-slate-600 mb-1">Detail: ______________________________________</p>
            <div className="mt-2 h-16 border border-slate-200 rounded bg-slate-50"></div>
          </div>
          <div className="rounded-xl border border-teal-200 bg-white p-4">
            <p className="text-sm font-semibold text-teal-800 mb-2">Conclusion</p>
            <p className="text-xs text-slate-600 mb-1">Summary: ____________________________________</p>
            <div className="mt-2 h-12 border border-slate-200 rounded bg-slate-50"></div>
          </div>
        </div>
      </div>
    )
  },
  'interactive-writing-argumentative': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const prompts = pickMany(rng, [
      'Should students have longer recess?',
      'Is reading books better than watching videos?',
      'Should schools ban homework?',
    ], 1)
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-600">
          Develop an argument with claims, evidence, and reasoning. Write a persuasive essay.
        </p>
        <div className="rounded-xl border border-orange-200 bg-orange-50 p-4 mb-4">
          <p className="text-sm font-semibold text-orange-900">Prompt: {prompts[0]}</p>
        </div>
        <div className="space-y-3">
          <div className="rounded-xl border border-orange-200 bg-white p-4">
            <p className="text-sm font-semibold text-orange-800 mb-2">Your Claim</p>
            <p className="text-xs text-slate-600 mb-1">I believe that: ______________________________</p>
            <div className="mt-2 h-10 border border-slate-200 rounded bg-slate-50"></div>
          </div>
          <div className="rounded-xl border border-orange-200 bg-white p-4">
            <p className="text-sm font-semibold text-orange-800 mb-2">Reason 1 with Evidence</p>
            <p className="text-xs text-slate-600 mb-1">Reason: ____________________________________</p>
            <p className="text-xs text-slate-600 mb-1">Evidence: __________________________________</p>
            <div className="mt-2 h-12 border border-slate-200 rounded bg-slate-50"></div>
          </div>
          <div className="rounded-xl border border-orange-200 bg-white p-4">
            <p className="text-sm font-semibold text-orange-800 mb-2">Reason 2 with Evidence</p>
            <p className="text-xs text-slate-600 mb-1">Reason: ____________________________________</p>
            <p className="text-xs text-slate-600 mb-1">Evidence: __________________________________</p>
            <div className="mt-2 h-12 border border-slate-200 rounded bg-slate-50"></div>
          </div>
          <div className="rounded-xl border border-orange-200 bg-white p-4">
            <p className="text-sm font-semibold text-orange-800 mb-2">Counterargument</p>
            <p className="text-xs text-slate-600 mb-1">Some people might say: _____________________</p>
            <p className="text-xs text-slate-600 mb-1">But I disagree because: ____________________</p>
            <div className="mt-2 h-12 border border-slate-200 rounded bg-slate-50"></div>
          </div>
          <div className="rounded-xl border border-orange-200 bg-white p-4">
            <p className="text-sm font-semibold text-orange-800 mb-2">Conclusion</p>
            <p className="text-xs text-slate-600 mb-1">Restate claim: _____________________________</p>
            <p className="text-xs text-slate-600 mb-1">Call to action: ____________________________</p>
          </div>
        </div>
      </div>
    )
  },
  // NEW READING WORKSHEETS
  'interactive-reading-alphabet': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const letters = pickMany(rng, ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'], 6)
    const beginningSounds = pickMany(rng, [
      { letter: 'B', words: ['ball', 'book', 'bus'] },
      { letter: 'C', words: ['cat', 'car', 'cup'] },
      { letter: 'D', words: ['dog', 'door', 'duck'] },
      { letter: 'F', words: ['fish', 'fan', 'flower'] },
      { letter: 'M', words: ['moon', 'mouse', 'map'] },
      { letter: 'S', words: ['sun', 'star', 'snake'] },
    ], 4)
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-600">
          Practice recognizing letters, matching uppercase and lowercase, and beginning sounds.
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          {letters.map((letter, idx) => (
            <div key={idx} className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-center">
              <p className="text-3xl font-bold text-blue-700 mb-2">{letter}</p>
              <p className="text-xl text-blue-600 mb-2">{letter.toLowerCase()}</p>
              <div className="mt-2 flex gap-2 justify-center">
                <div className="h-8 w-8 border border-dashed border-blue-300 bg-white rounded"></div>
                <div className="h-8 w-8 border border-dashed border-blue-300 bg-white rounded"></div>
              </div>
              <p className="text-xs text-blue-600 mt-2">Circle the {letter}</p>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
          <p className="text-sm font-semibold text-blue-700 mb-2">Beginning Sounds</p>
          <div className="grid gap-3 md:grid-cols-2">
            {beginningSounds.map((item, idx) => (
              <div key={idx} className="bg-white rounded border border-blue-200 p-3">
                <p className="text-sm font-semibold text-blue-800 mb-1">{item.letter} says /{item.letter.toLowerCase()}/</p>
                <div className="flex gap-2 flex-wrap">
                  {item.words.map((word, wIdx) => (
                    <span key={wIdx} className="text-xs px-2 py-1 bg-blue-100 rounded border border-blue-300 text-blue-700">{word}</span>
                  ))}
                </div>
                <p className="text-xs text-blue-600 mt-2">Circle words that start with {item.letter}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  },
  'interactive-reading-sightwords': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const sightWords = pickMany(rng, ['the', 'and', 'is', 'it', 'you', 'that', 'he', 'was', 'for', 'on', 'are', 'as', 'with', 'his', 'they', 'I', 'at', 'be', 'this', 'have', 'from', 'or', 'one', 'had', 'by', 'word', 'but', 'not', 'what', 'all', 'were', 'we', 'when', 'your', 'can', 'said'], 8)
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-600">
          Practice reading and writing common sight words with fun activities.
        </p>
        <div className="grid gap-3 md:grid-cols-4">
          {sightWords.map((word, idx) => (
            <div key={idx} className="rounded-xl border border-indigo-200 bg-indigo-50 p-3 text-center">
              <p className="text-lg font-bold text-indigo-700 mb-2">{word}</p>
              <div className="h-8 border border-dashed border-indigo-300 bg-white rounded mb-1"></div>
              <p className="text-xs text-indigo-600">Write it 3 times:</p>
              <div className="flex gap-1 mt-1">
                <div className="flex-1 h-6 border border-dashed border-indigo-300 bg-white rounded"></div>
                <div className="flex-1 h-6 border border-dashed border-indigo-300 bg-white rounded"></div>
                <div className="flex-1 h-6 border border-dashed border-indigo-300 bg-white rounded"></div>
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4">
          <p className="text-sm font-semibold text-indigo-700 mb-2">Use sight words in sentences:</p>
          <div className="space-y-2">
            {sightWords.slice(0, 3).map((word, idx) => (
              <div key={idx} className="bg-white rounded border border-indigo-200 p-2">
                <p className="text-xs text-indigo-700 mb-1">Write a sentence with "{word}":</p>
                <div className="h-10 border border-dashed border-indigo-300 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  },
  'interactive-reading-fluency': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const passages = pickMany(rng, [
      'The cat sat on the mat. The cat is happy.',
      'I see a big tree. The tree has green leaves.',
      'The sun is bright. It shines in the sky.',
      'I like to read books. Books are fun to read.',
    ], 2)
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-600">
          Practice reading with expression, accuracy, and appropriate pacing. Read each passage three times.
        </p>
        {passages.map((passage, idx) => (
          <div key={idx} className="rounded-xl border border-purple-200 bg-purple-50 p-4">
            <p className="text-sm font-semibold text-purple-700 mb-2">Passage {idx + 1}</p>
            <div className="bg-white rounded border border-purple-200 p-3 mb-3">
              <p className="text-sm text-purple-800 leading-relaxed">{passage}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-purple-600 w-24">Read 1:</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className="text-xs">⭐</span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-purple-600 w-24">Read 2:</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className="text-xs">⭐</span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-purple-600 w-24">Read 3:</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className="text-xs">⭐</span>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-xs text-purple-600 mt-2">Notes: ________________________________</p>
          </div>
        ))}
      </div>
    )
  },
  'interactive-reading-character': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const characters = pickMany(rng, [
      { name: 'Sam', traits: ['kind', 'brave', 'curious'], action: 'helps a friend' },
      { name: 'Maya', traits: ['creative', 'patient', 'helpful'], action: 'solves a problem' },
      { name: 'Alex', traits: ['honest', 'determined', 'friendly'], action: 'learns something new' },
    ], 2)
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-600">
          Analyze character traits, motivations, and development in stories.
        </p>
        {characters.map((char, idx) => (
          <div key={idx} className="rounded-xl border border-teal-200 bg-teal-50 p-4">
            <p className="text-sm font-semibold text-teal-700 mb-2">Character: {char.name}</p>
            <div className="bg-white rounded border border-teal-200 p-3 mb-3">
              <p className="text-xs text-teal-800 mb-2">In the story, {char.name} {char.action}.</p>
            </div>
            <div className="space-y-2">
              <p className="text-xs text-teal-700 font-semibold">Character Traits:</p>
              <div className="flex flex-wrap gap-2 mb-2">
                {char.traits.map((trait, tIdx) => (
                  <span key={tIdx} className="text-xs px-2 py-1 bg-teal-100 rounded border border-teal-300 text-teal-700">{trait}</span>
                ))}
              </div>
              <p className="text-xs text-teal-600">Why is {char.name} {char.traits[0]}? ________________________</p>
              <p className="text-xs text-teal-600 mt-2">What does {char.name} want? ________________________</p>
              <p className="text-xs text-teal-600 mt-2">How does {char.name} change? ________________________</p>
            </div>
          </div>
        ))}
      </div>
    )
  },
  // NEW SCIENCE WORKSHEETS
  'interactive-science-senses': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const senses = ['sight', 'hearing', 'touch', 'taste', 'smell']
    const objects = pickMany(rng, [
      { name: 'apple', sense: 'taste', description: 'sweet' },
      { name: 'flower', sense: 'smell', description: 'fragrant' },
      { name: 'feather', sense: 'touch', description: 'soft' },
      { name: 'bell', sense: 'hearing', description: 'ringing' },
      { name: 'rainbow', sense: 'sight', description: 'colorful' },
    ], 5)
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-600">
          Explore the five senses through hands-on activities and observation exercises.
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          {senses.map((sense, idx) => (
            <div key={idx} className="rounded-xl border border-green-200 bg-green-50 p-4">
              <p className="text-sm font-semibold text-green-700 capitalize mb-2">{sense}</p>
              <div className="mt-2 h-16 rounded border border-green-300 bg-white">
                <p className="p-2 text-xs text-green-600">Draw something you {sense}</p>
              </div>
              <p className="mt-2 text-xs text-green-600">What do you {sense}? ________________</p>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-green-200 bg-green-50 p-4">
          <p className="text-sm font-semibold text-green-700 mb-2">Match the Sense</p>
          <div className="space-y-2">
            {objects.map((obj, idx) => (
              <div key={idx} className="bg-white rounded border border-green-200 p-2 flex items-center gap-3">
                <span className="text-xs text-green-700 font-semibold">{obj.name}:</span>
                <span className="text-xs text-green-600">{obj.description}</span>
                <span className="text-xs text-green-600 ml-auto">Sense: {obj.sense}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  },
  'interactive-science-plants': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const plantParts = ['roots', 'stem', 'leaves', 'flower', 'seeds']
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-600">
          Learn about plants, their parts, and how they grow through simple activities.
        </p>
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 mb-4">
          <p className="text-sm font-semibold text-green-700 mb-2">Plant Parts</p>
          <div className="h-32 rounded border border-green-300 bg-white mb-2">
            <p className="p-2 text-xs text-green-600">Draw a plant and label its parts</p>
          </div>
          <div className="grid gap-2 md:grid-cols-3">
            {plantParts.map((part, idx) => (
              <div key={idx} className="bg-white rounded border border-green-200 p-2">
                <p className="text-xs text-green-700 capitalize">{part}:</p>
                <div className="h-6 border border-dashed border-green-300 rounded mt-1"></div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-green-200 bg-green-50 p-4">
          <p className="text-sm font-semibold text-green-700 mb-2">What Plants Need</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-green-600">☀️ Sun:</span>
              <div className="flex-1 h-6 border border-dashed border-green-300 bg-white rounded"></div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-green-600">💧 Water:</span>
              <div className="flex-1 h-6 border border-dashed border-green-300 bg-white rounded"></div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-green-600">🌱 Soil:</span>
              <div className="flex-1 h-6 border border-dashed border-green-300 bg-white rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  },
  'interactive-science-animals': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const animals = pickMany(rng, [
      { name: 'bird', habitat: 'sky', feature: 'wings' },
      { name: 'fish', habitat: 'water', feature: 'fins' },
      { name: 'rabbit', habitat: 'forest', feature: 'fur' },
      { name: 'turtle', habitat: 'water and land', feature: 'shell' },
    ], 4)
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-600">
          Learn about different types of animals, their habitats, and characteristics.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {animals.map((animal, idx) => (
            <div key={idx} className="rounded-xl border border-teal-200 bg-teal-50 p-4">
              <p className="text-sm font-semibold text-teal-700 capitalize mb-2">{animal.name}</p>
              <div className="mt-2 h-20 rounded border border-teal-300 bg-white mb-2">
                <p className="p-2 text-xs text-teal-600">Draw a {animal.name}</p>
              </div>
              <p className="text-xs text-teal-600">Habitat: {animal.habitat}</p>
              <p className="text-xs text-teal-600">Feature: {animal.feature}</p>
              <div className="mt-2 h-8 border border-dashed border-teal-300 bg-white rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  },
  // NEW GEOGRAPHY WORKSHEETS
  'interactive-geography-seasons': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const seasons = ['spring', 'summer', 'fall', 'winter']
    const weatherTypes = pickMany(rng, ['sunny', 'rainy', 'snowy', 'windy', 'cloudy'], 4)
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-600">
          Learn about different seasons, weather patterns, and how they vary in different places.
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          {seasons.map((season, idx) => (
            <div key={idx} className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm font-semibold text-amber-700 capitalize mb-2">{season}</p>
              <div className="mt-2 h-16 rounded border border-amber-300 bg-white mb-2">
                <p className="p-2 text-xs text-amber-600">Draw {season} weather</p>
              </div>
              <p className="text-xs text-amber-600">Weather: ________________</p>
              <p className="text-xs text-amber-600 mt-1">What do you wear? ________________</p>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-semibold text-amber-700 mb-2">Weather Types</p>
          <div className="flex flex-wrap gap-2">
            {weatherTypes.map((weather, idx) => (
              <span key={idx} className="text-xs px-2 py-1 bg-amber-100 rounded border border-amber-300 text-amber-700 capitalize">{weather}</span>
            ))}
          </div>
        </div>
      </div>
    )
  },
  'interactive-geography-places': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const places = pickMany(rng, [
      { name: 'Library', type: 'Learning place', activity: 'read books' },
      { name: 'Park', type: 'Play place', activity: 'play games' },
      { name: 'Store', type: 'Shopping place', activity: 'buy things' },
      { name: 'Hospital', type: 'Health place', activity: 'get help' },
    ], 4)
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-600">
          Learn about important places, landmarks, and locations in your community and country.
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          {places.map((place, idx) => (
            <div key={idx} className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm font-semibold text-amber-700 mb-1">{place.name}</p>
              <p className="text-xs text-amber-600 mb-2">{place.type}</p>
              <div className="mt-2 h-16 rounded border border-amber-300 bg-white mb-2">
                <p className="p-2 text-xs text-amber-600">Draw {place.name}</p>
              </div>
              <p className="text-xs text-amber-600">We {place.activity} here.</p>
            </div>
          ))}
        </div>
      </div>
    )
  },
  'interactive-geography-continents': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const continents = pickMany(rng, [
      { name: 'North America', fact: 'Has many countries', ocean: 'Atlantic and Pacific' },
      { name: 'South America', fact: 'Has rainforests', ocean: 'Atlantic and Pacific' },
      { name: 'Europe', fact: 'Has many languages', ocean: 'Atlantic' },
      { name: 'Asia', fact: 'Largest continent', ocean: 'Pacific and Indian' },
      { name: 'Africa', fact: 'Has deserts and savannas', ocean: 'Atlantic and Indian' },
      { name: 'Australia', fact: 'Island continent', ocean: 'Pacific and Indian' },
      { name: 'Antarctica', fact: 'Coldest place', ocean: 'Southern' },
    ], 4)
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-600">
          Learn about the seven continents and five oceans with maps and activities.
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          {continents.map((continent, idx) => (
            <div key={idx} className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm font-semibold text-amber-700 mb-1">{continent.name}</p>
              <p className="text-xs text-amber-600 mb-2">{continent.fact}</p>
              <p className="text-xs text-amber-600">Oceans: {continent.ocean}</p>
              <div className="mt-2 h-12 border border-dashed border-amber-300 bg-white rounded"></div>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-semibold text-amber-700 mb-2">Oceans</p>
          <div className="flex flex-wrap gap-2">
            {['Atlantic', 'Pacific', 'Indian', 'Arctic', 'Southern'].map((ocean, idx) => (
              <span key={idx} className="text-xs px-2 py-1 bg-amber-100 rounded border border-amber-300 text-amber-700">{ocean}</span>
            ))}
          </div>
        </div>
      </div>
    )
  },
  // NEW GRAMMAR WORKSHEETS
  'interactive-grammar-rhyming': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const wordGroups = pickMany(rng, [
      { word: 'cat', rhymes: ['hat', 'bat', 'sat'] },
      { word: 'dog', rhymes: ['log', 'fog', 'jog'] },
      { word: 'sun', rhymes: ['fun', 'run', 'bun'] },
      { word: 'tree', rhymes: ['bee', 'see', 'me'] },
    ], 4)
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-600">
          Identify and match rhyming words through fun activities.
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          {wordGroups.map((group, idx) => (
            <div key={idx} className="rounded-xl border border-purple-200 bg-purple-50 p-4">
              <p className="text-sm font-semibold text-purple-700 mb-2">Word: {group.word}</p>
              <p className="text-xs text-purple-600 mb-2">Rhyming words:</p>
              <div className="flex flex-wrap gap-2 mb-2">
                {group.rhymes.map((rhyme, rIdx) => (
                  <span key={rIdx} className="text-xs px-2 py-1 bg-purple-100 rounded border border-purple-300 text-purple-700">{rhyme}</span>
                ))}
              </div>
              <div className="h-8 border border-dashed border-purple-300 bg-white rounded"></div>
              <p className="text-xs text-purple-600 mt-2">Write another word that rhymes: ________</p>
            </div>
          ))}
        </div>
      </div>
    )
  },
  'interactive-grammar-capitalization': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const sentences = pickMany(rng, [
      { text: 'i like to play.', correct: 'I like to play.' },
      { text: 'my name is sam.', correct: 'My name is Sam.' },
      { text: 'we go to school.', correct: 'We go to school.' },
      { text: 'the sun is bright.', correct: 'The sun is bright.' },
    ], 4)
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-600">
          Practice proper capitalization and punctuation in sentences.
        </p>
        <div className="space-y-3">
          {sentences.map((sentence, idx) => (
            <div key={idx} className="rounded-xl border border-purple-200 bg-purple-50 p-4">
              <p className="text-sm font-semibold text-purple-700 mb-2">Sentence {idx + 1}</p>
              <p className="text-xs text-purple-600 mb-2">Fix this sentence: "{sentence.text}"</p>
              <div className="h-10 border border-dashed border-purple-300 bg-white rounded mb-2"></div>
              <p className="text-xs text-purple-600">Correct: {sentence.correct}</p>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-purple-200 bg-purple-50 p-4">
          <p className="text-sm font-semibold text-purple-700 mb-2">Capitalization Rules</p>
          <ul className="list-disc list-inside space-y-1 text-xs text-purple-600">
            <li>Start sentences with a capital letter</li>
            <li>Capitalize names of people and places</li>
            <li>Use a period at the end</li>
          </ul>
        </div>
      </div>
    )
  },
  'interactive-grammar-plurals': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const words = pickMany(rng, [
      { singular: 'cat', plural: 'cats', rule: 'add -s' },
      { singular: 'box', plural: 'boxes', rule: 'add -es' },
      { singular: 'baby', plural: 'babies', rule: 'change y to ies' },
      { singular: 'tooth', plural: 'teeth', rule: 'irregular' },
    ], 4)
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-600">
          Learn to form plurals and possessives correctly.
        </p>
        <div className="space-y-3">
          {words.map((word, idx) => (
            <div key={idx} className="rounded-xl border border-purple-200 bg-purple-50 p-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-purple-700 mb-1">Singular: {word.singular}</p>
                  <p className="text-xs text-purple-600 mb-2">Rule: {word.rule}</p>
                  <div className="h-8 border border-dashed border-purple-300 bg-white rounded"></div>
                </div>
                <div className="text-sm text-purple-600">→</div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-purple-700 mb-1">Plural: {word.plural}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-purple-200 bg-purple-50 p-4">
          <p className="text-sm font-semibold text-purple-700 mb-2">Possessives</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-purple-600">The cat's toy:</span>
              <div className="flex-1 h-6 border border-dashed border-purple-300 bg-white rounded"></div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-purple-600">The dogs' bones:</span>
              <div className="flex-1 h-6 border border-dashed border-purple-300 bg-white rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  },
  // NEW ART WORKSHEETS
  'interactive-art-shapes': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const shapes = pickMany(rng, ['circle', 'square', 'triangle', 'rectangle', 'star', 'heart'], 6)
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-600">
          Create art using basic shapes. Draw and color shapes to make pictures.
        </p>
        <div className="grid gap-3 md:grid-cols-3">
          {shapes.map((shape, idx) => (
            <div key={idx} className="rounded-xl border border-pink-200 bg-pink-50 p-4 text-center">
              <p className="text-sm font-semibold text-pink-700 capitalize mb-2">{shape}</p>
              <div className="h-24 rounded border border-pink-300 bg-white mb-2">
                <p className="p-2 text-xs text-pink-600">Draw a {shape}</p>
              </div>
              <p className="text-xs text-pink-600">Color it: ________________</p>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-pink-200 bg-pink-50 p-4">
          <p className="text-sm font-semibold text-pink-700 mb-2">Create a Picture</p>
          <p className="text-xs text-pink-600 mb-2">Use shapes to draw:</p>
          <div className="h-32 rounded border border-pink-300 bg-white">
            <p className="p-2 text-xs text-pink-600">Draw a picture using shapes</p>
          </div>
        </div>
      </div>
    )
  },
  'interactive-art-patterns': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const patternTypes = pickMany(rng, ['AB', 'ABC', 'AAB', 'ABB'], 3)
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-600">
          Create patterns and explore symmetry through drawing and coloring activities.
        </p>
        <div className="space-y-3">
          {patternTypes.map((pattern, idx) => (
            <div key={idx} className="rounded-xl border border-pink-200 bg-pink-50 p-4">
              <p className="text-sm font-semibold text-pink-700 mb-2">Pattern {pattern}</p>
              <div className="flex gap-2 mb-2">
                {pattern.split('').map((char, cIdx) => (
                  <div key={cIdx} className="h-12 w-12 rounded border border-pink-300 bg-white"></div>
                ))}
                <div className="h-12 w-12 rounded border border-dashed border-pink-400 bg-pink-100"></div>
              </div>
              <p className="text-xs text-pink-600">Continue the pattern:</p>
              <div className="h-12 border border-dashed border-pink-300 bg-white rounded mt-2"></div>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-pink-200 bg-pink-50 p-4">
          <p className="text-sm font-semibold text-pink-700 mb-2">Symmetry</p>
          <div className="h-32 rounded border border-pink-300 bg-white">
            <p className="p-2 text-xs text-pink-600">Draw a symmetrical design</p>
          </div>
        </div>
      </div>
    )
  },
  'interactive-art-perspective': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const techniques = pickMany(rng, ['perspective', 'shading', 'texture', 'composition'], 4)
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-600">
          Learn about perspective, shading, and artistic techniques through guided exercises.
        </p>
        <div className="space-y-3">
          {techniques.map((technique, idx) => (
            <div key={idx} className="rounded-xl border border-pink-200 bg-pink-50 p-4">
              <p className="text-sm font-semibold text-pink-700 capitalize mb-2">{technique}</p>
              <div className="h-24 rounded border border-pink-300 bg-white mb-2">
                <p className="p-2 text-xs text-pink-600">Practice {technique}</p>
              </div>
              <p className="text-xs text-pink-600">Notes: ________________________________</p>
            </div>
          ))}
        </div>
      </div>
    )
  },
  'interactive-grammar-vocab': ({ doc, seed, variant }) => {
    return (
      <p className="text-sm">Student responses may vary. Evaluate based on accurate definitions, use of context clues, correct usage in sentences, and understanding of academic vocabulary.</p>
    )
  },
  // ANSWER RENDERERS FOR NEW WORKSHEETS
  'interactive-writing-trace': ({ doc, seed, variant }) => {
    return (
      <p className="text-sm">Students should trace letters correctly, write them 3 times each, and trace/write words. Check for proper letter formation and legibility.</p>
    )
  },
  'interactive-writing-pictures': ({ doc, seed, variant }) => {
    return (
      <p className="text-sm">Student responses may vary. Check for complete sentences, relevant descriptions, and appropriate drawings.</p>
    )
  },
  'interactive-writing-narrative': ({ doc, seed, variant }) => {
    return (
      <p className="text-sm">Student responses may vary. Evaluate based on clear beginning/middle/end structure, character development, problem resolution, and creative storytelling.</p>
    )
  },
  'interactive-writing-informative': ({ doc, seed, variant }) => {
    return (
      <p className="text-sm">Student responses may vary. Check for accurate facts, clear explanations, logical organization, and proper informative writing structure.</p>
    )
  },
  'interactive-writing-argumentative': ({ doc, seed, variant }) => {
    return (
      <p className="text-sm">Student responses may vary. Evaluate based on clear claim, supporting evidence, logical reasoning, counterargument acknowledgment, and strong conclusion.</p>
    )
  },
  'interactive-reading-alphabet': ({ doc, seed, variant }) => {
    return (
      <p className="text-sm">Students should correctly identify and match uppercase/lowercase letters, recognize beginning sounds, and circle matching letters. Check for letter recognition accuracy.</p>
    )
  },
  'interactive-reading-sightwords': ({ doc, seed, variant }) => {
    return (
      <p className="text-sm">Students should correctly write sight words 3 times each and use them in sentences. Check for spelling accuracy and appropriate sentence construction.</p>
    )
  },
  'interactive-reading-fluency': ({ doc, seed, variant }) => {
    return (
      <p className="text-sm">Student responses may vary. Evaluate reading fluency based on expression, accuracy, pacing, and improvement across three readings. Use star ratings to track progress.</p>
    )
  },
  'interactive-reading-character': ({ doc, seed, variant }) => {
    return (
      <p className="text-sm">Student responses may vary. Check for accurate character trait identification, text evidence, understanding of motivations, and recognition of character development.</p>
    )
  },
  'interactive-science-senses': ({ doc, seed, variant }) => {
    return (
      <p className="text-sm">Students should correctly identify the five senses and match objects to appropriate senses. Check for understanding of how each sense works.</p>
    )
  },
  'interactive-science-plants': ({ doc, seed, variant }) => {
    return (
      <p className="text-sm">Students should correctly label plant parts (roots, stem, leaves, flower, seeds) and identify what plants need (sun, water, soil). Check for accurate labeling and understanding.</p>
    )
  },
  'interactive-science-animals': ({ doc, seed, variant }) => {
    return (
      <p className="text-sm">Student responses may vary. Check for accurate animal identification, correct habitat matching, and understanding of animal features.</p>
    )
  },
  'interactive-geography-seasons': ({ doc, seed, variant }) => {
    return (
      <p className="text-sm">Students should correctly identify seasons, match weather types, and describe appropriate clothing. Check for understanding of seasonal changes and weather patterns.</p>
    )
  },
  'interactive-geography-places': ({ doc, seed, variant }) => {
    return (
      <p className="text-sm">Student responses may vary. Check for understanding of different places in the community, their purposes, and activities that happen there.</p>
    )
  },
  'interactive-geography-continents': ({ doc, seed, variant }) => {
    return (
      <p className="text-sm">Students should correctly identify continents and their associated oceans. Check for understanding of world geography and continent facts.</p>
    )
  },
  'interactive-grammar-rhyming': ({ doc, seed, variant }) => {
    return (
      <p className="text-sm">Students should correctly identify and match rhyming words. Check for understanding of word families and phonemic awareness.</p>
    )
  },
  'interactive-grammar-capitalization': ({ doc, seed, variant }) => {
    return (
      <p className="text-sm">Students should correctly capitalize sentences, proper nouns, and use proper punctuation. Check for understanding of capitalization rules.</p>
    )
  },
  'interactive-grammar-plurals': ({ doc, seed, variant }) => {
    return (
      <p className="text-sm">Students should correctly form plurals (add -s, add -es, change y to ies, irregular forms) and use possessives correctly. Check for understanding of pluralization rules.</p>
    )
  },
  'interactive-art-shapes': ({ doc, seed, variant }) => {
    return (
      <p className="text-sm">Student responses may vary. Check for correct shape identification, creative use of shapes in drawings, and appropriate coloring. Encourage creativity.</p>
    )
  },
  'interactive-art-patterns': ({ doc, seed, variant }) => {
    return (
      <p className="text-sm">Students should correctly continue patterns (AB, ABC, AAB, ABB) and create symmetrical designs. Check for pattern recognition and symmetry understanding.</p>
    )
  },
  'interactive-art-perspective': ({ doc, seed, variant }) => {
    return (
      <p className="text-sm">Student responses may vary. Evaluate based on understanding of perspective, shading techniques, texture representation, and composition principles.</p>
    )
  },
  'interactive-logic-matching': ({ doc, seed, variant }) => {
    return (
      <p className="text-sm">Students should correctly match related items (e.g., apple-fruit, car-vehicle). Check for understanding of relationships and categorization.</p>
    )
  },
  'interactive-logic-classification': ({ doc, seed, variant }) => {
    return (
      <p className="text-sm">Students should correctly sort items into categories (animals, food, colors, etc.). Check for understanding of classification and categorization skills.</p>
    )
  },
  'interactive-logic-analogies': ({ doc, seed, variant }) => {
    return (
      <p className="text-sm">Students should correctly complete analogies by identifying relationships. Check for understanding of word relationships and logical thinking.</p>
    )
  },
  'interactive-sel-friendship': ({ doc, seed, variant }) => {
    return (
      <p className="text-sm">Student responses may vary. Check for understanding of friendship skills, empathy, kindness, and appropriate social responses to different situations.</p>
    )
  },
  'interactive-sel-gratitude': ({ doc, seed, variant }) => {
    return (
      <p className="text-sm">Student responses may vary. Check for thoughtful reflection, genuine gratitude expression, and understanding of positive thinking and appreciation.</p>
    )
  },
}

function InteractiveWorksheetSection({
  docId,
  seed,
  variant,
  showAnswers,
  teacherName,
  className,
  studentNames,
}: {
  docId: string
  seed: string
  variant: number
  showAnswers?: boolean
  teacherName?: string
  className?: string
  studentNames?: string[]
}) {
  const doc = getDocMeta(docId)
  const category = doc ? categoryByDocId.get(docId) : undefined

  if (!doc || !category) return null

  const renderer = renderers[docId]
  const answerRenderer = answerRenderers[docId]

  if (!renderer) {
    return (
      <section className="mb-10 break-inside-avoid rounded-xl border border-slate-200 bg-white p-5 print:border-0 print:p-0">
        <h2 className="text-lg font-semibold text-slate-900">{category.icon} {doc.title}</h2>
        <p className="text-sm text-slate-600">Coming soon: printable activity for this interactive worksheet.</p>
        {showAnswers && (
          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
            Answers will be added once this activity is available.
          </div>
        )}
      </section>
    )
  }

  return (
    <section className="mb-10 break-inside-avoid rounded-xl border border-slate-200 bg-white p-5 print:border-0 print:p-0">
      <header className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">{category.label}</p>
          <h2 className="text-lg font-semibold text-slate-900">{category.icon} {doc.title}</h2>
        </div>
        <span className="inline-flex items-center rounded-full border border-purple-100 bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700">
          {doc.difficulty} • {doc.grades.map((grade) => grade.toUpperCase()).join(' / ')}
        </span>
      </header>
      <p className="mb-4 text-sm text-slate-600">{doc.description}</p>
      {renderer({ doc, category, seed, variant })}
      {showAnswers && (
        <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
          <p className="mb-2 font-semibold text-emerald-900">Answer key & teacher notes</p>
          {answerRenderer ? (
            answerRenderer({ doc, category, seed, variant })
          ) : (
            <p>Student responses may vary. Use the prompts above to guide discussion and feedback.</p>
          )}
        </div>
      )}
    </section>
  )
}

export default function InteractiveBundleSections({ docIds, seed, variant, showAnswers, teacherName, className, studentNames }: Props) {
  if (docIds.length === 0) return null

  return (
    <>
      {docIds.map((docId) => (
        <InteractiveWorksheetSection
          key={docId}
          docId={docId}
          seed={seed}
          variant={variant}
          showAnswers={showAnswers}
          teacherName={teacherName}
          className={className}
          studentNames={studentNames}
        />
      ))}
    </>
  )
}

