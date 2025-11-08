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
  return Array.from({ length: 6 }).map(() => {
    const target = Math.floor(rng() * 20) + 10
    const missing = Math.floor(rng() * 9) + 1
    const other = target - missing
    const showFirstBlank = rng() > 0.5
    if (showFirstBlank) {
      return {
        prompt: `${other} + ____ = ${target}`,
        answer: missing,
      }
    }
    return {
      prompt: `____ + ${missing} = ${target + missing}`,
      answer: target,
    }
  })
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
    const cycles = ['butterfly', 'sunflower', 'frog', 'ladybug', 'penguin']
    const cycle = pick(rng, cycles)
    const stagesMap: Record<string, string[]> = {
      butterfly: ['Egg', 'Caterpillar', 'Chrysalis', 'Butterfly'],
      sunflower: ['Seed', 'Sprout', 'Budding', 'Bloom'],
      frog: ['Egg', 'Tadpole', 'Froglet', 'Adult frog'],
      ladybug: ['Egg', 'Larva', 'Pupa', 'Adult'],
      penguin: ['Egg', 'Hatchling', 'Juvenile', 'Adult'],
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
          questions: ['What color is the car?', 'Where is the car?'] 
        },
        { 
          title: 'The Sunny Day', 
          images: [
            { name: 'sun', svg: <svg width="70" height="70" viewBox="0 0 70 70"><circle cx="35" cy="35" r="20" fill="none" stroke="#333" strokeWidth="2"/><line x1="35" y1="5" x2="35" y2="15" stroke="#333" strokeWidth="2"/><line x1="35" y1="55" x2="35" y2="65" stroke="#333" strokeWidth="2"/><line x1="5" y1="35" x2="15" y2="35" stroke="#333" strokeWidth="2"/><line x1="55" y1="35" x2="65" y2="35" stroke="#333" strokeWidth="2"/><line x1="12" y1="12" x2="18" y2="18" stroke="#333" strokeWidth="2"/><line x1="52" y1="52" x2="58" y2="58" stroke="#333" strokeWidth="2"/><line x1="52" y1="12" x2="58" y2="18" stroke="#333" strokeWidth="2"/><line x1="12" y1="52" x2="18" y2="58" stroke="#333" strokeWidth="2"/></svg> },
            { name: 'flower', svg: <svg width="60" height="70" viewBox="0 0 60 70"><line x1="30" y1="50" x2="30" y2="70" stroke="#333" strokeWidth="2"/><circle cx="30" cy="30" r="12" fill="none" stroke="#333" strokeWidth="2"/><ellipse cx="30" cy="15" rx="8" ry="10" fill="none" stroke="#333" strokeWidth="2"/><ellipse cx="30" cy="45" rx="8" ry="10" fill="none" stroke="#333" strokeWidth="2"/><ellipse cx="15" cy="30" rx="10" ry="8" fill="none" stroke="#333" strokeWidth="2"/><ellipse cx="45" cy="30" rx="10" ry="8" fill="none" stroke="#333" strokeWidth="2"/></svg> },
            { name: 'ball', svg: <svg width="60" height="60" viewBox="0 0 60 60"><circle cx="30" cy="30" r="25" fill="none" stroke="#333" strokeWidth="2"/><path d="M 30 5 Q 15 15, 5 30 Q 15 45, 30 55 Q 45 45, 55 30 Q 45 15, 30 5" fill="none" stroke="#333" strokeWidth="1.5"/></svg> }
          ], 
          questions: ['Is it sunny?', 'What do you see?'] 
        },
        { 
          title: 'The Big Tree', 
          images: [
            { name: 'tree', svg: <svg width="60" height="80" viewBox="0 0 60 80"><rect x="25" y="50" width="10" height="30" fill="none" stroke="#333" strokeWidth="2"/><ellipse cx="30" cy="40" rx="20" ry="25" fill="none" stroke="#333" strokeWidth="2"/></svg> },
            { name: 'house', svg: <svg width="70" height="70" viewBox="0 0 70 70"><rect x="15" y="35" width="40" height="35" fill="none" stroke="#333" strokeWidth="2"/><polygon points="15,35 35,15 55,35" fill="none" stroke="#333" strokeWidth="2"/><rect x="25" y="45" width="12" height="20" fill="none" stroke="#333" strokeWidth="2"/><rect x="42" y="50" width="8" height="8" fill="none" stroke="#333" strokeWidth="2"/></svg> },
            { name: 'flower', svg: <svg width="50" height="60" viewBox="0 0 50 60"><line x1="25" y1="40" x2="25" y2="60" stroke="#333" strokeWidth="2"/><circle cx="25" cy="25" r="10" fill="none" stroke="#333" strokeWidth="2"/><ellipse cx="25" cy="12" rx="6" ry="8" fill="none" stroke="#333" strokeWidth="2"/><ellipse cx="25" cy="38" rx="6" ry="8" fill="none" stroke="#333" strokeWidth="2"/><ellipse cx="12" cy="25" rx="8" ry="6" fill="none" stroke="#333" strokeWidth="2"/><ellipse cx="38" cy="25" rx="8" ry="6" fill="none" stroke="#333" strokeWidth="2"/></svg> }
          ], 
          questions: ['Is the tree big?', 'What is near the tree?'] 
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
      { title: 'The Red Car', questions: ['What color is the car?', 'Where is the car?'] },
      { title: 'The Sunny Day', questions: ['Is it sunny?', 'What do you see?'] },
      { title: 'The Big Tree', questions: ['Is the tree big?', 'What is near the tree?'] },
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
}

function InteractiveWorksheetSection({
  docId,
  seed,
  variant,
  showAnswers,
}: {
  docId: string
  seed: string
  variant: number
  showAnswers?: boolean
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

export default function InteractiveBundleSections({ docIds, seed, variant, showAnswers }: Props) {
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
        />
      ))}
    </>
  )
}

