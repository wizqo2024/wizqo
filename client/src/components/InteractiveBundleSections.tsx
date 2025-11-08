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
  return Array.from({ length: 5 }).map(() => {
    const coin = pick(rng, coins)
    const amount = (Math.floor(rng() * 6) + 1) * COIN_VALUE[coin]
    return {
      item: pick(rng, items),
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
    const left = { num: pick(rng, numerators), den: pick(rng, denominators) }
    const right = { num: pick(rng, numerators), den: pick(rng, denominators) }
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
            <p>How many facts did you solve? ______ ? Which strategy helped you most? ____________________</p>
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
                The {prompt.item} costs ${prompt.amount / 100}. Pay using {prompt.coin}. Draw your coins below and write the total.
              </p>
              <div className="mt-2 h-16 rounded border border-dashed border-emerald-300 bg-white" />
                <div className="mt-2 text-xs text-emerald-700">
                  Total: ________ ? Change: ________
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
          <p className="mt-1 uppercase tracking-wide text-xs">{wordBank.join(' ? ')}</p>
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
        { description: 'Ice cube melting on a sunny windowsill', answer: 'solid ? liquid' },
        { description: 'Steam rising from hot cocoa', answer: 'liquid ? gas' },
        { description: 'Water droplets forming on a cold can', answer: 'gas ? liquid' },
        { description: 'Chocolate bar in a warm pocket', answer: 'solid ? liquid' },
        { description: 'Puddle freezing overnight', answer: 'liquid ? solid' },
        { description: 'Perfume sprayed into the air', answer: 'liquid ? gas' },
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
    const coordinates = Array.from({ length: 6 }).map(() => ({
      letter: String.fromCharCode(65 + Math.floor(rng() * 6)),
      number: Math.floor(rng() * 6) + 1,
      place: pick(rng, ['museum', 'fire station', 'library', 'market', 'park', 'bridge', 'sports field', 'hospital']),
    }))
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          Plot each location on a coordinate grid. Label and describe what is found at that spot.
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
        <div className="mt-2 h-40 rounded border border-dashed border-slate-300 bg-white" />
        <p className="text-xs text-slate-500">Draw your map grid here and mark each coordinate.</p>
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
              <div className="mt-1 text-xs text-slate-500">Label: __________ ? Extra word: __________</div>
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
    const prompts = pickMany(rng, ['radial symmetry mandala', 'pattern inspired by music', 'tile design using two shapes', 'poster for a kindness campaign', 'emoji pattern', 'maze-style illustration'], 4)
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          Experiment with texture, line, and balance. Sketch ideas in each mini canvas, then choose a favorite to finish at full scale.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {prompts.map((prompt, idx) => (
            <div key={idx} className="rounded-xl border border-purple-200 bg-white p-4">
              <p className="text-xs uppercase tracking-wide text-purple-500">Design Prompt {idx + 1}</p>
              <p className="text-sm text-slate-700">{prompt}</p>
              <div className="mt-3 h-24 rounded border border-dashed border-slate-300" />
            </div>
          ))}
        </div>
      </div>
    )
  },
  'interactive-art-colorwheel': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const complements = pickMany(rng, [
      ['red', 'green'],
      ['blue', 'orange'],
      ['yellow', 'violet'],
      ['turquoise', 'coral'],
    ], 3)
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          Mix and label color pairs. Experiment with warm, cool, and complementary colors.
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          {complements.map(([a, b], idx) => (
            <div key={idx} className="rounded-xl border border-slate-200 bg-white p-4 text-center text-sm text-slate-700">
              <p className="font-semibold capitalize">{a} + {b}</p>
              <div className="mt-2 flex justify-center gap-2">
                <div className="h-10 w-10 rounded-full border border-slate-300" style={{ background: a }} />
                <div className="h-10 w-10 rounded-full border border-slate-300" style={{ background: b }} />
              </div>
              <p className="mt-2 text-xs text-slate-500">Blend to make: ____________________</p>
            </div>
          ))}
        </div>
      </div>
    )
  },
  'interactive-art-sketch': ({ seed, doc, variant }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const subjects = pickMany(rng, ['botanical specimen', 'favorite snack', 'pair of sneakers', 'pet portrait', 'miniature city', 'tiny robot'], 3)
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          Practice observation drawing. Sketch each subject from a different angle and add shading.
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          {subjects.map((subject, idx) => (
            <div key={idx} className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
              <p className="font-semibold capitalize">{subject}</p>
              <div className="mt-3 h-24 rounded border border-dashed border-slate-300" />
              <p className="text-xs text-slate-500">Details to include: texture ? highlights ? shadows</p>
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
                  <div key={boxIdx} className={`h-8 border ${boxIdx < row.count ? 'bg-emerald-200 border-emerald-400' : 'border-emerald-200'}`} />
                ))}
              </div>
              <p className="mt-2 text-xs text-emerald-700">Number: ______ ? Word: __________________</p>
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
              <span className="font-semibold capitalize">{row.shape}</span> ? {info.kind === 'flat' ? 'Flat shape' : 'Solid shape'}; {info.sidesLabel}
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
        {prompts.map((prompt, idx) => (
          <li key={idx}>
            <span className="font-semibold capitalize">{prompt.item}</span>: use {prompt.coinCount}{' '}
            {prompt.coin} (${(prompt.amount / 100).toFixed(2)}).
          </li>
        ))}
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
          return (
            <li key={idx}>
              {problem.amount} {problem.from} = {formatted} {problem.to}
            </li>
          )
        })}
      </ul>
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
          {doc.difficulty} ? {doc.grades.map((grade) => grade.toUpperCase()).join(' / ')}
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

