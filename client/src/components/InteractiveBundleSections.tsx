import React from 'react'
import {
  INTERACTIVE_CATEGORIES,
  getDocMeta,
  type InteractiveWorksheetDoc,
  type InteractiveCategory,
} from '@shared/interactive/interactiveWorksheets'
import { useTranslation } from '@/context/TranslationContext'
import { getTranslation, translations } from '@/translations'
import { formatNumber, formatNumberRange } from '@/utils/numbers'

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
  t: (key: string) => string
  language: 'en' | 'es' | 'ar'
  formatNum: (num: number | string) => string
  formatRange: (start: number | string, end: number | string) => string
}

type Renderer = (ctx: RenderContext) => React.ReactNode
type AnswerRenderer = (ctx: RenderContext) => React.ReactNode

const categoryByDocId = new Map<string, InteractiveCategory>()
INTERACTIVE_CATEGORIES.forEach((category) => {
  category.docs.forEach((doc) => {
    categoryByDocId.set(doc.id, category)
  })
})

// Category-specific themes for colorful, high-quality designs
type CategoryTheme = {
  primary: string
  secondary: string
  accent: string
  background: string
  gradient: string
  border: string
  text: string
  lightBg: string
  emojiSize: string
  cornerAccent: string
  cornerAccent2: string
}

const CATEGORY_THEMES: Record<string, CategoryTheme> = {
  math: {
    primary: 'purple',
    secondary: 'indigo',
    accent: 'pink',
    background: 'bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50',
    gradient: 'from-purple-500 via-indigo-500 to-pink-500',
    border: 'border-purple-300',
    text: 'text-purple-800',
    lightBg: 'bg-purple-50',
    emojiSize: 'text-4xl',
    cornerAccent: 'bg-purple-200/30',
    cornerAccent2: 'bg-pink-200/20',
  },
  reading: {
    primary: 'blue',
    secondary: 'cyan',
    accent: 'sky',
    background: 'bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50',
    gradient: 'from-blue-500 via-cyan-500 to-sky-500',
    border: 'border-blue-300',
    text: 'text-blue-800',
    lightBg: 'bg-blue-50',
    emojiSize: 'text-4xl',
    cornerAccent: 'bg-blue-200/30',
    cornerAccent2: 'bg-sky-200/20',
  },
  writing: {
    primary: 'emerald',
    secondary: 'teal',
    accent: 'green',
    background: 'bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50',
    gradient: 'from-emerald-500 via-teal-500 to-green-500',
    border: 'border-emerald-300',
    text: 'text-emerald-800',
    lightBg: 'bg-emerald-50',
    emojiSize: 'text-4xl',
    cornerAccent: 'bg-emerald-200/30',
    cornerAccent2: 'bg-green-200/20',
  },
  science: {
    primary: 'green',
    secondary: 'lime',
    accent: 'emerald',
    background: 'bg-gradient-to-br from-green-50 via-lime-50 to-emerald-50',
    gradient: 'from-green-500 via-lime-500 to-emerald-500',
    border: 'border-green-300',
    text: 'text-green-800',
    lightBg: 'bg-green-50',
    emojiSize: 'text-4xl',
    cornerAccent: 'bg-green-200/30',
    cornerAccent2: 'bg-emerald-200/20',
  },
  geography: {
    primary: 'amber',
    secondary: 'orange',
    accent: 'yellow',
    background: 'bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50',
    gradient: 'from-amber-500 via-orange-500 to-yellow-500',
    border: 'border-amber-300',
    text: 'text-amber-800',
    lightBg: 'bg-amber-50',
    emojiSize: 'text-4xl',
    cornerAccent: 'bg-amber-200/30',
    cornerAccent2: 'bg-yellow-200/20',
  },
  grammar: {
    primary: 'rose',
    secondary: 'pink',
    accent: 'fuchsia',
    background: 'bg-gradient-to-br from-rose-50 via-pink-50 to-fuchsia-50',
    gradient: 'from-rose-500 via-pink-500 to-fuchsia-500',
    border: 'border-rose-300',
    text: 'text-rose-800',
    lightBg: 'bg-rose-50',
    emojiSize: 'text-4xl',
    cornerAccent: 'bg-rose-200/30',
    cornerAccent2: 'bg-fuchsia-200/20',
  },
  art: {
    primary: 'pink',
    secondary: 'purple',
    accent: 'fuchsia',
    background: 'bg-gradient-to-br from-pink-50 via-purple-50 to-fuchsia-50',
    gradient: 'from-pink-500 via-purple-500 to-fuchsia-500',
    border: 'border-pink-300',
    text: 'text-pink-800',
    lightBg: 'bg-pink-50',
    emojiSize: 'text-5xl',
    cornerAccent: 'bg-pink-200/30',
    cornerAccent2: 'bg-fuchsia-200/20',
  },
  'early-learning': {
    primary: 'yellow',
    secondary: 'amber',
    accent: 'orange',
    background: 'bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50',
    gradient: 'from-yellow-400 via-amber-400 to-orange-400',
    border: 'border-yellow-300',
    text: 'text-yellow-900',
    lightBg: 'bg-yellow-50',
    emojiSize: 'text-5xl',
    cornerAccent: 'bg-yellow-200/30',
    cornerAccent2: 'bg-orange-200/20',
  },
  logic: {
    primary: 'slate',
    secondary: 'gray',
    accent: 'zinc',
    background: 'bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50',
    gradient: 'from-slate-500 via-gray-500 to-zinc-500',
    border: 'border-slate-300',
    text: 'text-slate-800',
    lightBg: 'bg-slate-50',
    emojiSize: 'text-4xl',
    cornerAccent: 'bg-slate-200/30',
    cornerAccent2: 'bg-zinc-200/20',
  },
  sel: {
    primary: 'indigo',
    secondary: 'violet',
    accent: 'purple',
    background: 'bg-gradient-to-br from-indigo-50 via-violet-50 to-purple-50',
    gradient: 'from-indigo-500 via-violet-500 to-purple-500',
    border: 'border-indigo-300',
    text: 'text-indigo-800',
    lightBg: 'bg-indigo-50',
    emojiSize: 'text-4xl',
    cornerAccent: 'bg-indigo-200/30',
    cornerAccent2: 'bg-purple-200/20',
  },
}

function getCategoryTheme(categoryId: string): CategoryTheme {
  return CATEGORY_THEMES[categoryId] || {
    primary: 'slate',
    secondary: 'gray',
    accent: 'zinc',
    background: 'bg-gradient-to-br from-slate-50 to-gray-50',
    gradient: 'from-slate-500 to-gray-500',
    border: 'border-slate-300',
    text: 'text-slate-800',
    lightBg: 'bg-slate-50',
    emojiSize: 'text-4xl',
    cornerAccent: 'bg-slate-200/30',
    cornerAccent2: 'bg-zinc-200/20',
  }
}

function getCornerAccentColor(categoryId: string): { topRight: string; bottomLeft: string } {
  const colorMap: Record<string, { topRight: string; bottomLeft: string }> = {
    math: { topRight: 'rgba(196, 181, 253, 0.3)', bottomLeft: 'rgba(251, 207, 232, 0.2)' },
    reading: { topRight: 'rgba(191, 219, 254, 0.3)', bottomLeft: 'rgba(186, 230, 253, 0.2)' },
    writing: { topRight: 'rgba(167, 243, 208, 0.3)', bottomLeft: 'rgba(134, 239, 172, 0.2)' },
    science: { topRight: 'rgba(187, 247, 208, 0.3)', bottomLeft: 'rgba(167, 243, 208, 0.2)' },
    geography: { topRight: 'rgba(253, 230, 138, 0.3)', bottomLeft: 'rgba(254, 243, 199, 0.2)' },
    grammar: { topRight: 'rgba(254, 205, 211, 0.3)', bottomLeft: 'rgba(240, 171, 252, 0.2)' },
    art: { topRight: 'rgba(251, 207, 232, 0.3)', bottomLeft: 'rgba(240, 171, 252, 0.2)' },
    'early-learning': { topRight: 'rgba(254, 243, 199, 0.3)', bottomLeft: 'rgba(255, 237, 213, 0.2)' },
    logic: { topRight: 'rgba(226, 232, 240, 0.3)', bottomLeft: 'rgba(241, 245, 249, 0.2)' },
    sel: { topRight: 'rgba(199, 210, 254, 0.3)', bottomLeft: 'rgba(196, 181, 253, 0.2)' },
  }
  return colorMap[categoryId] || { topRight: 'rgba(226, 232, 240, 0.3)', bottomLeft: 'rgba(241, 245, 249, 0.2)' }
}

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

function buildMathCounting(seed: string, docId: string, variant: number): Array<{ number: number; objects: string[] }> {
  const rng = makeRng(`${seed}|${docId}|${variant}`)
  const objectTypes = ['stars', 'hearts', 'circles', 'apples', 'balls', 'flowers', 'butterflies', 'fish']
  const numbers = [3, 4, 5, 6, 7, 8, 9, 10]
  const selected = pickMany(rng, numbers, 4)
  return selected.map((num) => ({
    number: num,
    objects: pickMany(rng, objectTypes, 1),
  }))
}

function buildMathTensFrames(seed: string, docId: string, variant: number): Array<{ filled: number; missing: number; operation: '+' | '-' }> {
  const rng = makeRng(`${seed}|${docId}|${variant}`)
  const problems: Array<{ filled: number; missing: number; operation: '+' | '-' }> = []
  for (let i = 0; i < 4; i++) {
    const filled = Math.floor(rng() * 7) + 1 // 1-7 filled
    const missing = Math.floor(rng() * (10 - filled)) + 1 // 1 to (10-filled)
    const operation = pick(rng, ['+', '-'] as const)
    problems.push({ filled, missing, operation })
  }
  return problems
}

function buildMathMultiplication(seed: string, docId: string, variant: number): Array<{ factor1: number; factor2: number; answer: number; arrayRows: number; arrayCols: number }> {
  const rng = makeRng(`${seed}|${docId}|${variant}`)
  const problems: Array<{ factor1: number; factor2: number; answer: number; arrayRows: number; arrayCols: number }> = []
  for (let i = 0; i < 6; i++) {
    const factor1 = Math.floor(rng() * 8) + 2
    const factor2 = Math.floor(rng() * 8) + 2
    problems.push({
      factor1,
      factor2,
      answer: factor1 * factor2,
      arrayRows: factor1,
      arrayCols: factor2,
    })
  }
  return problems
}

function buildMathDivision(seed: string, docId: string, variant: number): Array<{ dividend: number; divisor: number; quotient: number; remainder: number }> {
  const rng = makeRng(`${seed}|${docId}|${variant}`)
  const problems: Array<{ dividend: number; divisor: number; quotient: number; remainder: number }> = []
  for (let i = 0; i < 6; i++) {
    const divisor = Math.floor(rng() * 8) + 2
    const quotient = Math.floor(rng() * 8) + 2
    const remainder = Math.floor(rng() * divisor)
    const dividend = divisor * quotient + remainder
    problems.push({ dividend, divisor, quotient, remainder })
  }
  return problems
}

function buildMathPlaceValue(seed: string, docId: string, variant: number): Array<{ number: number; place: string; digit: number }> {
  const rng = makeRng(`${seed}|${docId}|${variant}`)
  const numbers = [12, 34, 56, 123, 234, 456, 1234, 2345, 3456]
  const places = ['ones', 'tens', 'hundreds', 'thousands']
  const selected = pickMany(rng, numbers, 4)
  return selected.map((num) => {
    const numStr = String(num)
    const placeIdx = Math.floor(rng() * Math.min(numStr.length, places.length))
    const place = places[placeIdx]
    const digit = parseInt(numStr[numStr.length - 1 - placeIdx])
    return { number: num, place, digit }
  })
}

function buildMathTime(seed: string, docId: string, variant: number): Array<{ hours: number; minutes: number; question: string; answer: string }> {
  const rng = makeRng(`${seed}|${docId}|${variant}`)
  const problems: Array<{ hours: number; minutes: number; question: string; answer: string }> = []
  for (let i = 0; i < 4; i++) {
    const hours = Math.floor(rng() * 12) + 1 // 1-12
    const minutes = Math.floor(rng() * 60)
    const elapsedHours = Math.floor(rng() * 3) + 1
    const elapsedMinutes = Math.floor(rng() * 30)
    
    // Calculate total minutes
    const totalMinutes = minutes + elapsedMinutes
    const finalMinutes = totalMinutes % 60
    const finalHours = ((hours - 1 + elapsedHours + Math.floor(totalMinutes / 60)) % 12) + 1
    
    problems.push({
      hours,
      minutes,
      question: `What time is it ${elapsedHours} hour${elapsedHours > 1 ? 's' : ''} and ${elapsedMinutes} minute${elapsedMinutes !== 1 ? 's' : ''} later?`,
      answer: `${finalHours}:${String(finalMinutes).padStart(2, '0')}`,
    })
  }
  return problems
}

function buildMathGraphing(seed: string, docId: string, variant: number): { categories: string[]; values: number[]; maxValue: number } {
  const rng = makeRng(`${seed}|${docId}|${variant}`)
  const categories = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  const values = categories.map(() => Math.floor(rng() * 20) + 1)
  const maxValue = Math.max(...values)
  return { categories, values, maxValue }
}

function buildMathRounding(seed: string, docId: string, variant: number): Array<{ number: number; roundTo: string; answer: number }> {
  const rng = makeRng(`${seed}|${docId}|${variant}`)
  const numbers = [23, 47, 156, 234, 567, 1234, 2345, 3456]
  const roundTos = ['ten', 'hundred', 'thousand']
  const selected = pickMany(rng, numbers, 4)
  return selected.map((num) => {
    const roundTo = pick(rng, roundTos)
    let answer = 0
    if (roundTo === 'ten') answer = Math.round(num / 10) * 10
    else if (roundTo === 'hundred') answer = Math.round(num / 100) * 100
    else answer = Math.round(num / 1000) * 1000
    return { number: num, roundTo, answer }
  })
}

function buildMathDecimals(seed: string, docId: string, variant: number): Array<{ num1: number; num2: number; op: '+' | '-' | '×' | '÷'; answer: number }> {
  const rng = makeRng(`${seed}|${docId}|${variant}`)
  const problems: Array<{ num1: number; num2: number; op: '+' | '-' | '×' | '÷'; answer: number }> = []
  for (let i = 0; i < 5; i++) {
    const num1 = Math.round((rng() * 10 + 1) * 100) / 100
    const num2 = Math.round((rng() * 10 + 1) * 100) / 100
    const op = pick(rng, ['+', '-', '×', '÷'] as const)
    let answer = 0
    if (op === '+') answer = Math.round((num1 + num2) * 100) / 100
    else if (op === '-') answer = Math.round((num1 - num2) * 100) / 100
    else if (op === '×') answer = Math.round((num1 * num2) * 100) / 100
    else answer = Math.round((num1 / num2) * 100) / 100
    problems.push({ num1, num2, op, answer })
  }
  return problems
}

function buildMathIntegers(seed: string, docId: string, variant: number): Array<{ num1: number; num2: number; op: '+' | '-' | '×'; answer: number }> {
  const rng = makeRng(`${seed}|${docId}|${variant}`)
  const problems: Array<{ num1: number; num2: number; op: '+' | '-' | '×'; answer: number }> = []
  for (let i = 0; i < 5; i++) {
    const num1 = Math.floor(rng() * 20) - 10
    const num2 = Math.floor(rng() * 20) - 10
    const op = pick(rng, ['+', '-', '×'] as const)
    let answer = 0
    if (op === '+') answer = num1 + num2
    else if (op === '-') answer = num1 - num2
    else answer = num1 * num2
    problems.push({ num1, num2, op, answer })
  }
  return problems
}

function buildMathExponents(seed: string, docId: string, variant: number): Array<{ base: number; exponent: number; answer: number }> {
  const rng = makeRng(`${seed}|${docId}|${variant}`)
  const problems: Array<{ base: number; exponent: number; answer: number }> = []
  for (let i = 0; i < 5; i++) {
    const base = Math.floor(rng() * 8) + 2
    const exponent = Math.floor(rng() * 4) + 2
    const answer = Math.pow(base, exponent)
    problems.push({ base, exponent, answer })
  }
  return problems
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
          {t('worksheets.mathRhythm.instructions')}
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
  'interactive-math-race': (ctx) => {
    const { doc, category, seed, variant, t, formatNum } = ctx
    const problems = buildMathRace(seed, doc.id, variant)
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          {t('worksheets.mathRace.instructions')}
        </p>
        <div className="grid grid-cols-3 gap-3">
          {problems.map((prob, idx) => (
            <div key={idx} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-center text-lg font-semibold tracking-wide">
              {formatNum(prob.first)} {prob.op} {formatNum(prob.second)} =
            </div>
          ))}
        </div>
          <div className="rounded-lg border border-purple-200 bg-purple-50 px-4 py-3 text-sm text-purple-800">
            <p className="font-semibold">{t('worksheets.reflection.title')}</p>
            <p>{t('worksheets.reflection.mathRaceQuestions')}</p>
          </div>
      </div>
    )
  },
  'interactive-math-puzzle': (ctx) => {
    const { doc, seed, variant, t, formatNum, language } = ctx
    const puzzles = buildMathPuzzle(seed, doc.id, variant)
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          {t('worksheets.mathPuzzle.instructions')}
        </p>
        <div className="grid grid-cols-2 gap-4">
          {puzzles.map((puzzle, idx) => {
            // Format numbers in the prompt for Arabic - replace all digits with formatted versions
            let formattedPrompt = puzzle.prompt
            if (language === 'ar' && formatNum) {
              // Replace all sequences of digits with formatted versions
              formattedPrompt = puzzle.prompt.replace(/\d+/g, (match) => {
                const num = parseInt(match, 10)
                return formatNum(num)
              })
            }
            return (
              <div key={idx} className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-5 text-center text-lg font-semibold text-amber-800">
                {formattedPrompt}
              </div>
            )
          })}
        </div>
      </div>
    )
  },
  'interactive-math-shapes': (ctx) => {
    const { seed, doc, variant, t } = ctx
    const rows = buildMathShapes(seed, doc.id, variant)
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          {t('worksheets.mathShapes.instructions')}
        </p>
        <table className="w-full border border-slate-300 text-sm">
          <thead className="bg-slate-100 text-left">
            <tr>
              <th className="px-3 py-2">{t('worksheets.mathShapes.shape')}</th>
              <th className="px-3 py-2">{t('worksheets.mathShapes.color')}</th>
              <th className="px-3 py-2">{t('worksheets.mathShapes.howMany')}</th>
              <th className="px-3 py-2">{t('worksheets.mathShapes.flatOrSolid')}</th>
              <th className="px-3 py-2">{t('worksheets.mathShapes.numberOfSides')}</th>
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
  'interactive-math-money': (ctx) => {
    const { seed, doc, variant, t, formatNum } = ctx
    const prompts = buildMathMoney(seed, doc.id, variant)
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          {t('worksheets.mathMoney.instructions')}
        </p>
        <ol className="space-y-3 text-sm text-slate-700 list-decimal list-inside">
          {prompts.map((prompt, idx) => (
            <li key={idx} className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3">
              <p>
                {t('worksheets.mathMoney.costs')
                  .replace('{{item}}', prompt.item)
                  .replace('{{amount}}', formatNum ? formatNum((prompt.amount / 100).toFixed(2)) : (prompt.amount / 100).toFixed(2))
                  .replace('{{coin}}', prompt.coin)}
              </p>
              <div className="mt-2 h-16 rounded border border-dashed border-emerald-300 bg-white" />
              <div className="mt-2 text-xs text-emerald-700">
                {t('worksheets.mathMoney.total')} ________ • {t('worksheets.mathMoney.change')} ________
              </div>
            </li>
          ))}
        </ol>
      </div>
    )
  },
  'interactive-math-fractions': (ctx) => {
    const { seed, doc, variant, t, formatNum } = ctx
    const pairs = buildMathFractions(seed, doc.id, variant)
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          {t('worksheets.mathFractions.instructions')}
        </p>
        <div className="space-y-4">
          {pairs.map(({ left: a, right: b }, idx) => (
            <div key={idx} className="rounded-xl border border-purple-200 bg-white p-4">
              <div className="flex items-center justify-between text-lg font-semibold text-purple-800">
                <span>{formatNum ? formatNum(a.num) : a.num}/{formatNum ? formatNum(a.den) : a.den}</span>
                <span className="text-slate-400">__________</span>
                <span>{formatNum ? formatNum(b.num) : b.num}/{formatNum ? formatNum(b.den) : b.den}</span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3">
                {[a, b].map((frac, barIdx) => (
                  <div key={barIdx} className="space-y-1 text-xs text-slate-600">
                    <div className="h-3 w-full overflow-hidden rounded-full border border-slate-300 bg-slate-100">
                      <div className="h-full bg-purple-400" style={{ width: `${(frac.num / frac.den) * 100}%` }} />
                    </div>
                    <p>{t('worksheets.mathFractions.shade').replace('{{num}}', formatNum ? formatNum(frac.num) : String(frac.num)).replace('{{den}}', formatNum ? formatNum(frac.den) : String(frac.den))}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  },
  'interactive-math-measurement': (ctx) => {
    const { seed, doc, variant, t } = ctx
    const problems = buildMathMeasurement(seed, doc.id, variant)
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          {t('worksheets.mathMeasurement.instructions')}
        </p>
        <table className="w-full border border-slate-300 text-left text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-3 py-2">{t('worksheets.mathMeasurement.given')}</th>
              <th className="px-3 py-2">{t('worksheets.mathMeasurement.convertTo')}</th>
              <th className="px-3 py-2">{t('worksheets.mathMeasurement.workSpace')}</th>
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
  'interactive-reading-adventure': (ctx) => {
    const { seed, doc, variant, t } = ctx
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
          {t('worksheets.readingAdventure.story')
            .replace('{{hero}}', hero)
            .replace('{{partner}}', partner)
            .replace('{{setting}}', setting)
            .replace('{{quest}}', quest)}
        </p>
        <div className="space-y-2 text-sm text-slate-700">
          <p className="font-semibold text-slate-900">{t('worksheets.readingAdventure.comprehensionChecks')}</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>{t('worksheets.readingAdventure.whatProblem').replace('{{hero}}', hero).replace('{{partner}}', partner)}</li>
            <li>{t('worksheets.readingAdventure.describeClue')}</li>
            <li>{t('worksheets.readingAdventure.howSetting')}</li>
          </ol>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">{t('worksheets.readingAdventure.creativeExtension')}</p>
          <p className="text-sm text-slate-700">{t('worksheets.readingAdventure.sketchScene')}</p>
          <div className="mt-2 h-32 rounded border border-dashed border-slate-300" />
        </div>
      </div>
    )
  },
  'interactive-reading-detective': (ctx) => {
    const { seed, doc, variant, t } = ctx
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const mysteries = [
      { title: 'The Missing Lab Goggles', culprit: 'an absent-minded janitor', clue: 'a trail of glitter', setting: 'science fair' },
      { title: 'Case of the Empty Birdhouse', culprit: 'a helpful raccoon', clue: 'muddy paw prints', setting: 'school garden' },
      { title: 'The Whispering Lockers', culprit: 'a friendly robot', clue: 'battery crumbs', setting: 'hallway' },
    ]
    const caseFile = pick(rng, mysteries)
    const detectiveNotes = t('worksheets.readingDetective.detectiveNotes')
      .replace('{{setting}}', caseFile.setting)
      .replace('{{clue}}', caseFile.clue)
    const explainWhy = t('worksheets.readingDetective.explainWhy').replace('{{culprit}}', caseFile.culprit)
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-700 font-semibold">{t('worksheets.readingDetective.caseFile')}: {caseFile.title}</p>
        <p className="text-sm text-slate-600">
          {detectiveNotes}
        </p>
        <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
          <li>{t('worksheets.readingDetective.writeThreeInferences')}</li>
          <li>{explainWhy}</li>
          <li>{t('worksheets.readingDetective.proveOrDisprove')}</li>
        </ul>
        <div className="rounded-lg border border-dashed border-indigo-300 bg-indigo-50 px-4 py-3 text-sm text-indigo-800">
          {t('worksheets.readingDetective.drawEvidenceBoard')}
          <div className="mt-2 h-28 rounded border border-indigo-200 bg-white" />
        </div>
      </div>
    )
  },
  'interactive-reading-storymap': (ctx) => {
    const { seed, doc, variant, t } = ctx
    const story = buildReadingStoryMap(seed, doc.id, variant)
    return (
      <div className="space-y-3">
        <p className="text-sm leading-relaxed text-slate-700">
          {story.beginning} {story.middle} {story.ending}
        </p>
        <div className="grid gap-3 md:grid-cols-3">
          {[
            { title: t('worksheets.storyMap.beginning'), prompt: t('worksheets.storyMap.beginningPrompt') },
            { title: t('worksheets.storyMap.middle'), prompt: t('worksheets.storyMap.middlePrompt') },
            { title: t('worksheets.storyMap.ending'), prompt: t('worksheets.storyMap.endingPrompt') },
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
            <p className="font-semibold">{t('worksheets.storyMap.clueLog')}</p>
            <p className="text-xs uppercase tracking-wide text-purple-500">{t('worksheets.storyMap.lookBackAtStory')}</p>
            <ol className="mt-2 list-decimal list-inside space-y-2 text-purple-900">
              <li>{t('worksheets.storyMap.clue').replace('{{number}}', '1')}: _____________________________________________</li>
              <li>{t('worksheets.storyMap.clue').replace('{{number}}', '2')}: _____________________________________________</li>
            </ol>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
            <p className="font-semibold text-slate-900">{t('worksheets.storyMap.retellInOwnWords')}</p>
            <p className="text-xs text-slate-500">{t('worksheets.storyMap.retellPrompt')}</p>
            <div className="mt-3 space-y-2">
              <div className="h-10 rounded border border-dashed border-slate-300" />
              <div className="h-10 rounded border border-dashed border-slate-300" />
              <div className="h-10 rounded border border-dashed border-slate-300" />
            </div>
          </div>
        </div>
        <div className="space-y-2 text-sm text-slate-700">
          <p className="font-semibold text-slate-900">{t('worksheets.storyMap.comprehensionChecks')}</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>{t('worksheets.storyMap.whyDidVisit').replace('{{hero}}', story.hero).replace('{{friend}}', story.friend).replace('{{setting}}', story.setting)}</li>
            <li>{t('worksheets.storyMap.whatProblem')}</li>
            <li>{t('worksheets.storyMap.howDidHelper').replace('{{helper}}', story.helper)}</li>
          </ol>
        </div>
      </div>
    )
  },
  'interactive-reading-vocab': (ctx) => {
    const { seed, doc, variant, t } = ctx
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const words = pickMany(rng, ['brisk', 'illuminate', 'curious', 'soar', 'murmur', 'astonished', 'grumble', 'admire', 'voyage', 'bundle'], 6)
    const contexts = ['after-school announcement', 'nature discovery', 'space mission', 'friendship moment', 'STEM experiment', 'art showcase']
    const context = pick(rng, contexts)
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          {t('worksheets.vocab.instructions').replace('{{context}}', context)}
        </p>
        <table className="w-full border border-slate-300 text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-3 py-2">{t('worksheets.vocab.word')}</th>
              <th className="px-3 py-2">{t('worksheets.vocab.matchMeaning')}</th>
              <th className="px-3 py-2">{t('worksheets.vocab.sentenceInContext')}</th>
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
  'interactive-reading-summary': (ctx) => {
    const { seed, doc, variant, t } = ctx
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const topics = ['community garden', 'solar-powered bus', 'classroom pet adoption', 'school makerspace', 'reading marathon']
    const topic = pick(rng, topics)
    return (
      <div className="space-y-3">
        <p className="text-sm leading-relaxed text-slate-700">
          {t('worksheets.summary.instructions').replace('{{topic}}', topic)}
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
            <p>
              {t('worksheets.summary.paragraph').replace('{{number}}', '1')}: {t('worksheets.summary.paragraph1Intro').replace('{{topic}}', topic)}
            </p>
            <p className="mt-2">
              {t('worksheets.summary.paragraph').replace('{{number}}', '2')}: {t('worksheets.summary.paragraph2Intro')}
            </p>
            <p className="mt-2">
              {t('worksheets.summary.paragraph').replace('{{number}}', '3')}: {t('worksheets.summary.paragraph3Intro')}
            </p>
          </div>
          <div className="rounded-xl border border-purple-200 bg-purple-50 p-4 text-sm text-purple-800">
            <p className="font-semibold">{t('worksheets.summary.summaryBox')}</p>
            <ul className="mt-2 space-y-2 text-purple-900">
              <li>{t('worksheets.summary.keyPoint').replace('{{number}}', '1')}: __________________________</li>
              <li>{t('worksheets.summary.keyPoint').replace('{{number}}', '2')}: __________________________</li>
              <li>{t('worksheets.summary.keyPoint').replace('{{number}}', '3')}: __________________________</li>
            </ul>
            <p className="mt-3 text-xs text-purple-700">{t('worksheets.summary.closingSentence')}</p>
          </div>
        </div>
      </div>
    )
  },
  'interactive-reading-compare': (ctx) => {
    const { seed, doc, variant, t } = ctx
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
          {t('worksheets.compare.instructions').replace('{{topicA}}', topicA).replace('{{topicB}}', topicB)}
        </p>
        <div className="grid gap-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
            <p className="font-semibold">{t('worksheets.compare.text1').replace('{{topic}}', topicA)}</p>
            <p>{t('worksheets.compare.keyDetails')} ______________________________</p>
            <p>{t('worksheets.compare.whatProblem')} __________________</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
            <p className="font-semibold">{t('worksheets.compare.text2').replace('{{topic}}', topicB)}</p>
            <p>{t('worksheets.compare.keyDetails')} ______________________________</p>
            <p>{t('worksheets.compare.whatProblem')} __________________</p>
          </div>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
            <p className="font-semibold">{t('worksheets.compare.compareContrastParagraph')}</p>
            <p className="mt-2">
              {t('worksheets.compare.alikeBecause').replace('{{topicA}}', topicA).replace('{{topicB}}', topicB)} _______________________________. {t('worksheets.compare.differentBecause')} _______________________________.
            </p>
          </div>
        </div>
      </div>
    )
  },
  'interactive-writing-prompts': (ctx) => {
    const { seed, doc, variant, t } = ctx
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
          {t('worksheets.writingPrompts.instructions')}
        </p>
        <ul className="space-y-2 text-sm text-slate-700">
          {chosen.map((prompt, idx) => (
            <li key={idx} className="rounded-lg border border-slate-200 bg-white px-4 py-3">
              <span className="font-semibold text-purple-700">{t('worksheets.writingPrompts.prompt').replace('{{number}}', String(idx + 1))}:</span> {prompt}
            </li>
          ))}
        </ul>
        <div className="space-y-1 text-xs text-slate-500">
          <p>{t('worksheets.writingPrompts.brainstorm')} ________________________________</p>
          <p>{t('worksheets.writingPrompts.beginning')} _________________________________</p>
          <p>{t('worksheets.writingPrompts.middle')} ___________________________________</p>
          <p>{t('worksheets.writingPrompts.end')} ______________________________________</p>
        </div>
      </div>
    )
  },
  'interactive-writing-sentences': (ctx) => {
    const { seed, doc, variant, t } = ctx
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const starters = pickMany(rng, ['After lunch', 'During the storm', 'When the robot blinked', 'While the choir practiced', 'Before sunrise', 'Whenever the bell rings'], 4)
    const actions = pickMany(rng, ['we built a domino tower', 'the lights flickered', 'a secret message appeared', 'someone whispered a clue', 'the class cheered', 'the cat jumped on the desk'], 4)
    const sentences = starters.map((start, idx) => `${start}, ____________________.`)
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          {t('worksheets.writingSentences.instructions')}
        </p>
        <ul className="space-y-2 text-sm text-slate-700">
          {sentences.map((sentence, idx) => (
            <li key={idx} className="rounded border border-amber-200 bg-amber-50 px-4 py-3 font-semibold text-amber-800">
              {sentence}
            </li>
          ))}
        </ul>
        <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
          <p className="font-semibold text-slate-900">{t('worksheets.writingSentences.compoundSentenceChallenge')}</p>
          <p>{t('worksheets.writingSentences.combineWithConjunction')} _______________________________________________________</p>
        </div>
      </div>
    )
  },
  'interactive-writing-poetry': (ctx) => {
    const { seed, doc, variant, t } = ctx
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const themes = ['rainy playground', 'city skyline', 'secret garden', 'music festival', 'winter morning', 'campfire night']
    const theme = pick(rng, themes)
    const wordBank = pickMany(rng, ['glimmer', 'echo', 'whirl', 'rustle', 'shimmer', 'spark', 'twirl', 'glide', 'bloom', 'glisten'], 6)
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          {t('worksheets.writingPoetry.instructions').replace('{{theme}}', theme)}
        </p>
        <div className="rounded-xl border border-purple-200 bg-purple-50 p-4 text-sm text-purple-800">
          <p className="font-semibold">{t('worksheets.writingPoetry.wordBank')}</p>
          <p className="mt-1 uppercase tracking-wide text-xs">{wordBank.join(' • ')}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
            <p className="font-semibold">{t('worksheets.writingPoetry.haiku')}</p>
            <p>{t('worksheets.writingPoetry.line').replace('{{number}}', '1')}: ___________________________</p>
            <p>{t('worksheets.writingPoetry.line').replace('{{number}}', '2')}: ___________________________</p>
            <p>{t('worksheets.writingPoetry.line').replace('{{number}}', '3')}: ___________________________</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
            <p className="font-semibold">{t('worksheets.writingPoetry.freeVerseStanza')}</p>
            <p>{t('worksheets.writingPoetry.line').replace('{{number}}', '1')}: ___________________________</p>
            <p>{t('worksheets.writingPoetry.line').replace('{{number}}', '2')}: ___________________________</p>
            <p>{t('worksheets.writingPoetry.line').replace('{{number}}', '3')}: ___________________________</p>
            <p>{t('worksheets.writingPoetry.line').replace('{{number}}', '4')}: ___________________________</p>
          </div>
        </div>
      </div>
    )
  },
  'interactive-writing-opinion': (ctx) => {
    const { seed, doc, variant, t } = ctx
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const topics = ['Should recess be longer?', 'Is it better to read ebooks or paper books?', 'Should robots help with homework?', 'Is homework on weekends a good idea?', 'Should the cafeteria add a smoothie bar?']
    const topic = pick(rng, topics)
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          {t('worksheets.writingOpinion.instructions')} <span className="font-semibold text-purple-700">{topic}</span>
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
            <p className="font-semibold">{t('worksheets.writingOpinion.reasonsAndEvidence')}</p>
            <p>{t('worksheets.writingOpinion.reason').replace('{{number}}', '1')} ____________________________________</p>
            <p>{t('worksheets.writingOpinion.evidence')} _____________________________________</p>
            <p className="mt-3">{t('worksheets.writingOpinion.reason').replace('{{number}}', '2')} ____________________________________</p>
            <p>{t('worksheets.writingOpinion.evidence')} _____________________________________</p>
          </div>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
            <p className="font-semibold">{t('worksheets.writingOpinion.paragraphPlanner')}</p>
            <p>{t('worksheets.writingOpinion.hookSentence')} ___________________________________</p>
            <p>{t('worksheets.writingOpinion.opinionStatement')} _______________________________</p>
            <p>{t('worksheets.writingOpinion.closingSentence')} ________________________________</p>
          </div>
        </div>
      </div>
    )
  },
  'interactive-science-observation': (ctx) => {
    const { seed, doc, variant, t } = ctx
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const focuses = ['plants', 'weather', 'animal behavior', 'STEM gadgets', 'rocks & minerals']
    const focus = pick(rng, focuses)
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          {t('worksheets.scienceObservation.instructions').replace('{{focus}}', focus)}
        </p>
        <table className="w-full border border-slate-300 text-left text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-3 py-2">{t('worksheets.scienceObservation.dateAndTime')}</th>
              <th className="px-3 py-2">{t('worksheets.scienceObservation.observationSketch')}</th>
              <th className="px-3 py-2">{t('worksheets.scienceObservation.whatINoticed')}</th>
              <th className="px-3 py-2">{t('worksheets.scienceObservation.questionsNextSteps')}</th>
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
  'interactive-science-lifecycle': (ctx) => {
    const { seed, doc, variant, t, formatNum } = ctx
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
    const numberWords = ['first', 'second', 'third', 'fourth']
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          {t('worksheets.scienceLifecycle.instructions').replace('{{cycle}}', cycle)}
        </p>
        <div className="grid gap-4 md:grid-cols-4">
          {stages.map((stage, idx) => (
            <div key={stage} className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-center text-sm text-emerald-800">
              <p className="font-semibold">{t('worksheets.scienceLifecycle.stage').replace('{{number}}', formatNum ? formatNum(idx + 1) : String(idx + 1))}</p>
              <p className="mt-1 font-bold text-emerald-900">{stage}</p>
              <div className="mt-2 h-16 rounded border border-dashed border-emerald-300 bg-white" />
              <p className="mt-2 text-xs text-emerald-700">{t('worksheets.scienceLifecycle.notes')} __________________</p>
            </div>
          ))}
        </div>
      </div>
    )
  },
  'interactive-science-states': (ctx) => {
    const { seed, doc, variant, t } = ctx
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
          {t('worksheets.scienceStates.instructions')}
        </p>
        <table className="w-full border border-slate-300 text-left text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-3 py-2">{t('worksheets.scienceStates.scenario')}</th>
              <th className="px-3 py-2">{t('worksheets.scienceStates.stateChange')}</th>
              <th className="px-3 py-2">{t('worksheets.scienceStates.particleDiagram')}</th>
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
  'interactive-science-weather': (ctx) => {
    const { seed, doc, variant, t, formatNum } = ctx
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    const conditions = ['sunny', 'windy', 'rainy', 'stormy', 'foggy', 'partly cloudy', 'snowy']
    const tracker = days.map((day) => ({ day, condition: pick(rng, conditions), temp: Math.floor(rng() * 31) + 45 }) )
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          {t('worksheets.scienceWeather.instructions')}
        </p>
        <table className="w-full border border-slate-300 text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-3 py-2">{t('worksheets.scienceWeather.day')}</th>
              <th className="px-3 py-2">{t('worksheets.scienceWeather.temperature')}</th>
              <th className="px-3 py-2">{t('worksheets.scienceWeather.skySketch')}</th>
              <th className="px-3 py-2">{t('worksheets.scienceWeather.safetyTip')}</th>
            </tr>
          </thead>
          <tbody>
            {tracker.map((entry, idx) => (
              <tr key={idx} className="border-t border-slate-200">
                <td className="px-3 py-2">{entry.day}</td>
                <td className="px-3 py-2">{formatNum ? formatNum(entry.temp) : entry.temp}°F</td>
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
  'interactive-geography-map': (ctx) => {
    const { seed, doc, variant, t } = ctx
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
          {t('worksheets.geographyMap.instructions')}
        </p>
        <table className="w-full border border-slate-300 text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-3 py-2">{t('worksheets.geographyMap.coordinate')}</th>
              <th className="px-3 py-2">{t('worksheets.geographyMap.place')}</th>
              <th className="px-3 py-2">{t('worksheets.geographyMap.whatDoYouNotice')}</th>
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
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">{t('worksheets.geographyMap.exampleMap')}</p>
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
              {t('worksheets.geographyMap.useSampleToCheck')}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">{t('worksheets.geographyMap.yourMapGrid')}</p>
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
            <p className="mt-1 text-xs text-slate-500">{t('worksheets.geographyMap.drawLandmarks')}</p>
          </div>
        </div>
      </div>
    )
  },
  'interactive-geography-culture': (ctx) => {
    const { seed, doc, variant, t } = ctx
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const regions = pickMany(rng, ['Kenya', 'Peru', 'Japan', 'Norway', 'India', 'Brazil', 'Egypt', 'Canada'], 3)
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          {t('worksheets.geographyCulture.instructions')}
        </p>
        <table className="w-full border border-slate-300 text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-3 py-2">{t('worksheets.geographyCulture.region')}</th>
              <th className="px-3 py-2">{t('worksheets.geographyCulture.food')}</th>
              <th className="px-3 py-2">{t('worksheets.geographyCulture.celebration')}</th>
              <th className="px-3 py-2">{t('worksheets.geographyCulture.interestingFact')}</th>
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
  'interactive-geography-history': (ctx) => {
    const { seed, doc, variant, t, formatNum } = ctx
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
          {t('worksheets.geographyHistory.instructions').replace('{{theme}}', themes[0])}
        </p>
        <div className="space-y-4">
          {events.map((entry, idx) => (
            <div key={idx} className="rounded border border-slate-200 bg-white p-4 text-sm text-slate-700">
              <p className="font-semibold text-slate-900">
                {formatNum ? formatNum(entry.year) : entry.year}: {entry.event}
              </p>
              <p>{t('worksheets.geographyHistory.impact')} ________________________________________</p>
            </div>
          ))}
        </div>
      </div>
    )
  },
  'interactive-grammar-parts': (ctx) => {
    const { seed, doc, variant, t } = ctx
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const nouns = ['robot', 'teacher', 'river', 'backpack', 'galaxy', 'scientist']
    const verbs = ['whispers', 'builds', 'shimmers', 'protects', 'discovers', 'balances']
    const adjectives = ['curious', 'brave', 'glowing', 'silent', 'mysterious', 'playful']
    const sentences = Array.from({ length: 4 }).map(() => `${pick(rng, adjectives)} ${pick(rng, nouns)} ${pick(rng, verbs)} ___.`)
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          {t('worksheets.grammarParts.instructions')}
        </p>
        <ul className="space-y-2 text-sm text-slate-700">
          {sentences.map((sentence, idx) => (
            <li key={idx} className="rounded border border-slate-200 bg-white px-4 py-3">
              {sentence}
              <div className="mt-1 text-xs text-slate-500">{t('worksheets.grammarParts.label')} __________ • {t('worksheets.grammarParts.extraWord')} __________</div>
            </li>
          ))}
        </ul>
      </div>
    )
  },
  'interactive-grammar-tenses': (ctx) => {
    const { seed, doc, variant, t } = ctx
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const verbs = pickMany(rng, ['explore', 'finish', 'design', 'listen', 'organize', 'travel', 'collect'], 6)
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          {t('worksheets.grammarTenses.instructions')}
        </p>
        <table className="w-full border border-slate-300 text-left text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-3 py-2">{t('worksheets.grammarTenses.verb')}</th>
              <th className="px-3 py-2">{t('worksheets.grammarTenses.past')}</th>
              <th className="px-3 py-2">{t('worksheets.grammarTenses.present')}</th>
              <th className="px-3 py-2">{t('worksheets.grammarTenses.future')}</th>
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
        <p className="text-xs text-slate-500">{t('worksheets.grammarTenses.writeSentence')}</p>
      </div>
    )
  },
  'interactive-grammar-antonyms': (ctx) => {
    const { seed, doc, variant, t } = ctx
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
          {t('worksheets.grammarAntonyms.instructions')}
        </p>
        <table className="w-full border border-slate-300 text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-3 py-2">{t('worksheets.grammarAntonyms.word')}</th>
              <th className="px-3 py-2">{t('worksheets.grammarAntonyms.antonym')}</th>
              <th className="px-3 py-2">{t('worksheets.grammarAntonyms.sentence')}</th>
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
  'interactive-art-design': (ctx) => {
    const { seed, doc, variant, t } = ctx
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const patternKeys = ['geometricStar', 'flowerPattern', 'rainbowPattern', 'heartDesign', 'circleMandala', 'leafPattern']
    const selectedKeys = pickMany(rng, patternKeys, 4)
    const coloringPages = selectedKeys.map(key => ({
      key,
      title: t(`worksheets.artDesign.patterns.${key}.title`),
      shape: key === 'geometricStar' ? 'star' : key === 'flowerPattern' ? 'flower' : key === 'rainbowPattern' ? 'rainbow' : key === 'heartDesign' ? 'heart' : key === 'circleMandala' ? 'mandala' : 'leaf',
      description: t(`worksheets.artDesign.patterns.${key}.description`),
    }))
    
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
          {t('worksheets.artDesign.instructions')}
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {coloringPages.map((page, idx) => (
            <div key={idx} className="rounded-xl border border-purple-200 bg-white p-4">
              <p className="text-sm font-semibold text-slate-700 mb-1">{page.title}</p>
              <p className="text-xs text-slate-600 mb-3">{page.description}</p>
              <div className="mt-3 min-h-[280px] rounded border-2 border-dashed border-purple-300 bg-white flex items-center justify-center p-4">
                <ShapeSVG shape={page.shape} />
              </div>
              <p className="mt-2 text-xs text-purple-600 text-center">{t('worksheets.artDesign.colorInsideShape')}</p>
            </div>
          ))}
        </div>
      </div>
    )
  },
  'interactive-art-colorwheel': (ctx) => {
    const { seed, doc, variant, t } = ctx
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const coloringActivities = pickMany(rng, [
      { itemKey: 'apple', colorKey: 'red', shape: 'circle' },
      { itemKey: 'sun', colorKey: 'yellow', shape: 'circle' },
      { itemKey: 'leaf', colorKey: 'green', shape: 'leaf' },
      { itemKey: 'sky', colorKey: 'blue', shape: 'rectangle' },
      { itemKey: 'flower', colorKey: 'purple', shape: 'flower' },
      { itemKey: 'orangeFruit', colorKey: 'orange', shape: 'circle' },
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
          {t('worksheets.artColorwheel.instructions')}
        </p>
        <div className="grid gap-3 grid-cols-2 md:grid-cols-3">
          {coloringActivities.map((activity, idx) => {
            const itemText = t(`common.items.${activity.itemKey}`)
            const colorText = t(`common.colors.${activity.colorKey}`)
            const colorValue = activity.colorKey // Keep color value for CSS
            return (
              <div key={idx} className="rounded-xl border-2 border-slate-200 bg-white p-4 text-center">
                <p className="text-sm font-semibold text-slate-700 capitalize mb-1">{itemText}</p>
                <p className="text-xs text-slate-600 mb-2">{t('worksheets.artColorwheel.color')}: <span className="font-semibold capitalize" style={{ color: colorValue }}>{colorText}</span></p>
                <div className="min-h-[240px] rounded border-2 border-dashed border-slate-300 bg-white flex items-center justify-center my-2 p-4">
                  <ColorShapeSVG shape={activity.shape} color={colorValue} />
                </div>
                <p className="text-xs text-slate-500">{t('worksheets.artColorwheel.colorIt')}</p>
              </div>
            )
          })}
        </div>
      </div>
    )
  },
  'interactive-art-sketch': (ctx) => {
    const { seed, doc, variant, t } = ctx
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const promptKeys = ['beautifulFlower', 'treeWithLeaves', 'geometricShapes', 'rainbow', 'pattern', 'gardenScene']
    const emojis = { beautifulFlower: '🌺', treeWithLeaves: '🌳', geometricShapes: '⬜', rainbow: '🌈', pattern: '✨', gardenScene: '🌻' }
    const selectedKeys = pickMany(rng, promptKeys, 3)
    const drawingPrompts = selectedKeys.map(key => ({
      prompt: t(`worksheets.artSketch.prompts.${key}.prompt`),
      emoji: emojis[key],
      hint: t(`worksheets.artSketch.prompts.${key}.hint`),
    }))
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          {t('worksheets.artSketch.instructions')}
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          {drawingPrompts.map((item, idx) => (
            <div key={idx} className="rounded-xl border-2 border-purple-200 bg-purple-50 p-4">
              <p className="text-2xl mb-2">{item.emoji}</p>
              <p className="text-sm font-semibold text-slate-700 mb-1">{item.prompt}</p>
              <p className="text-xs text-slate-600 mb-3">{item.hint}</p>
              <div className="h-32 rounded border-2 border-dashed border-purple-300 bg-white" />
              <p className="mt-2 text-xs text-purple-600 text-center">{t('worksheets.artSketch.drawHere')}</p>
            </div>
          ))}
        </div>
      </div>
    )
  },
  'interactive-early-phonics': (ctx) => {
    const { seed, doc, variant, t } = ctx
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
          {t('worksheets.earlyPhonics.instructions')}
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {sounds.map((sound) => (
            <div key={sound} className="rounded-xl border border-rose-200 bg-rose-50 p-4">
              <p className="text-lg font-semibold text-rose-700">Letter: {sound.toUpperCase()}</p>
              <div className="mt-2 flex gap-3">
                <div className="flex-1">
                  <p className="text-xs uppercase text-rose-500">{t('worksheets.earlyPhonics.traceLetter')}</p>
                  <div className="mt-1 h-16 rounded border border-dashed border-rose-300 bg-white" />
                </div>
                <div className="flex-1">
                  <p className="text-xs uppercase text-rose-500">{t('worksheets.earlyPhonics.drawPicture')}</p>
                  <div className="mt-1 h-16 rounded border border-dashed border-rose-300 bg-white" />
                </div>
              </div>
              <p className="mt-2 text-xs text-rose-700">{t('worksheets.earlyPhonics.words')} {words[sound].join(', ')}</p>
            </div>
          ))}
        </div>
      </div>
    )
  },
  'interactive-early-counting': (ctx) => {
    const { seed, doc, variant, t } = ctx
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const rows = Array.from({ length: 4 }).map(() => ({
      objects: pick(rng, ['stars', 'shells', 'dice', 'hearts', 'cars']),
      count: Math.floor(rng() * 7) + 3,
    }))
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          {t('worksheets.countObjectsDrawTenFrames')}
        </p>
        <div className="space-y-3 text-sm text-slate-700">
          {rows.map((row, idx) => {
            const objectName = t(`worksheets.objectNames.${row.objects}`) || row.objects
            return (
              <div key={idx} className="rounded border border-emerald-200 bg-emerald-50 p-3">
                <p className="font-semibold text-emerald-800">{t('worksheets.countThe').replace('{{object}}', `${row.count} ${objectName}`)}</p>
              <div className="mt-2 grid grid-cols-10 gap-1">
                {Array.from({ length: 10 }).map((_, boxIdx) => (
                  <div
                    key={boxIdx}
                    className={`h-8 border ${boxIdx < row.count ? 'bg-emerald-200 border-emerald-400' : 'border-emerald-200'}`}
                  />
                ))}
              </div>
              <p className="mt-2 text-xs text-emerald-700">{t('worksheets.numberLabel')}: ______ • {t('worksheets.wordLabel')}: __________________</p>
              </div>
            )
          })}
        </div>
      </div>
    )
  },
  'interactive-early-patterns': (ctx) => {
    const { seed, doc, variant, t } = ctx
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const patterns = pickMany(rng, ['AB', 'AAB', 'ABC', 'ABB', 'AABB'], 4)
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          {t('worksheets.earlyPatterns.instructions')}
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
                <p className="text-xs uppercase text-slate-500">{t('worksheets.earlyPatterns.pattern')} {pattern}</p>
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
                  {t('worksheets.earlyPatterns.tryBuilding')}{' '}
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
  'interactive-early-shapes': (ctx) => {
    const { seed, doc, variant, t, formatNum } = ctx
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const shapes = pickMany(rng, ['circle', 'square', 'triangle', 'rectangle', 'star', 'heart'], 4)
    const colors = pickMany(rng, ['red', 'blue', 'yellow', 'green', 'purple', 'orange'], 4)
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          {t('worksheets.earlyShapes.instructions')}
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {shapes.map((shape, idx) => (
            <div key={idx} className="rounded-xl border border-purple-200 bg-purple-50 p-4">
              <p className="text-sm font-semibold text-purple-700">{t('worksheets.earlyShapes.shape')} {formatNum ? formatNum(idx + 1) : idx + 1}: {shape}</p>
              <div className="mt-2 h-20 rounded border border-dashed border-purple-300 bg-white" />
              <p className="mt-2 text-xs text-purple-600">{t('worksheets.earlyShapes.color')} {colors[idx]}</p>
              <p className="mt-1 text-xs text-purple-600">{t('worksheets.earlyShapes.drawMore').replace('{{shape}}', shape)}</p>
              <div className="mt-1 flex gap-2">
                <div className="h-12 w-12 rounded border border-dashed border-purple-300" />
                <div className="h-12 w-12 rounded border border-dashed border-purple-300" />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-xl border border-purple-200 bg-purple-50 p-4">
          <p className="text-sm font-semibold text-purple-700">{t('worksheets.earlyShapes.sortingActivity')}</p>
          <p className="mt-2 text-xs text-purple-600">{t('worksheets.earlyShapes.sortByShape')} ________________________________</p>
          <p className="mt-1 text-xs text-purple-600">{t('worksheets.earlyShapes.sortByColor')} ________________________________</p>
        </div>
      </div>
    )
  },
  'interactive-early-letters': (ctx) => {
    const { seed, doc, variant, t } = ctx
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const letters = pickMany(rng, ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'], 4)
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          {t('worksheets.earlyLetters.instructions')}
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {letters.map((letter) => (
            <div key={letter} className="rounded-xl border border-blue-200 bg-blue-50 p-4">
              <p className="text-lg font-semibold text-blue-700">{letter} / {letter.toLowerCase()}</p>
              <div className="mt-2 grid grid-cols-3 gap-2">
                <div className="flex flex-col">
                  <p className="text-xs text-blue-500">{t('worksheets.earlyLetters.trace')}</p>
                  <div className="mt-1 h-16 rounded border border-dashed border-blue-300 bg-white" />
                </div>
                <div className="flex flex-col">
                  <p className="text-xs text-blue-500">{t('worksheets.earlyLetters.write')}</p>
                  <div className="mt-1 h-16 rounded border border-dashed border-blue-300 bg-white" />
                </div>
                <div className="flex flex-col">
                  <p className="text-xs text-blue-500">{t('worksheets.earlyLetters.draw')}</p>
                  <div className="mt-1 h-16 rounded border border-dashed border-blue-300 bg-white" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  },
  'interactive-early-numbers': (ctx) => {
    const { seed, doc, variant, t } = ctx
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const numbers = pickMany(rng, Array.from({ length: 20 }, (_, i) => i + 1), 4)
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          {t('worksheets.traceNumberAndDraw')}
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {numbers.map((num) => (
            <div key={num} className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <p className="text-lg font-semibold text-emerald-700">{t('worksheets.numberLabel')}: {num}</p>
              <div className="mt-2 grid grid-cols-3 gap-2">
                <div className="flex flex-col">
                  <p className="text-xs text-emerald-500">{t('worksheets.earlyNumbers.trace')}</p>
                  <div className="mt-1 h-12 rounded border border-dashed border-emerald-300 bg-white text-center text-lg font-bold text-emerald-700">{num}</div>
                </div>
                <div className="flex flex-col">
                  <p className="text-xs text-emerald-500">{t('worksheets.earlyNumbers.write')}</p>
                  <div className="mt-1 h-12 rounded border border-dashed border-emerald-300 bg-white" />
                </div>
                <div className="flex flex-col">
                  <p className="text-xs text-emerald-500">{t('worksheets.earlyNumbers.draw')} {num}</p>
                  <div className="mt-1 h-12 rounded border border-dashed border-emerald-300 bg-white" />
                </div>
              </div>
              <p className="mt-2 text-xs text-emerald-600">{t('worksheets.earlyNumbers.numberWord')} {numberWords[num - 1] || num}</p>
            </div>
          ))}
        </div>
      </div>
    )
  },
  'interactive-early-foundations': (ctx) => {
    const { seed, doc, variant, t } = ctx
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const activities = [
      { type: 'letter', items: pickMany(rng, ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'], 4) },
      { type: 'number', items: pickMany(rng, Array.from({ length: 10 }, (_, i) => i + 1), 4) },
      { type: 'shape', items: pickMany(rng, ['circle', 'square', 'triangle', 'star'], 4) },
    ]
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          {t('worksheets.earlyFoundations.instructions')}
        </p>
        {activities.map((activity, actIdx) => (
          <div key={actIdx} className="rounded-xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm font-semibold text-amber-700">{t('worksheets.earlyFoundations.review')} {activity.type}s</p>
            <div className="mt-2 flex flex-wrap gap-3">
              {activity.items.map((item, idx) => (
                <div key={idx} className="rounded border border-amber-300 bg-white px-4 py-2 text-center">
                  <p className="font-semibold text-amber-800">{item}</p>
                  <p className="mt-1 text-xs text-amber-600">{t('worksheets.earlyFoundations.identify')} ______</p>
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-semibold text-amber-700">{t('worksheets.earlyFoundations.practiceWriting')}</p>
          <p className="mt-2 text-xs text-amber-600">{t('worksheets.earlyFoundations.writeName')} ________________________</p>
          <p className="mt-1 text-xs text-amber-600">{t('worksheets.earlyFoundations.countTo10')} ________________________________</p>
        </div>
      </div>
    )
  },
  'interactive-early-basics': (ctx) => {
    const { seed, doc, variant, t } = ctx
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const skills = [
      { skill: 'Letter Sounds', examples: pickMany(rng, ['A says /a/', 'B says /b/', 'C says /c/', 'D says /d/'], 3) },
      { skill: 'Counting', examples: pickMany(rng, ['Count 1-5', 'Count 5-10', 'Count objects'], 3) },
      { skill: 'Patterns', examples: pickMany(rng, ['AB pattern', 'ABC pattern', 'Color patterns'], 3) },
    ]
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          {t('worksheets.earlyBasics.instructions')}
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
  'interactive-reading-prek': (ctx) => {
    const { seed, doc, variant, t } = ctx
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const stories = pickMany(
      rng,
      [
        { 
          titleKey: 'redCar',
          title: t('worksheets.readingPrek.storyTitles.redCar'),
          images: [
            { nameKey: 'car', name: t('worksheets.readingPrek.objectNames.car'), svg: <svg width="80" height="60" viewBox="0 0 80 60"><rect x="10" y="25" width="60" height="25" rx="3" fill="none" stroke="#333" strokeWidth="2"/><rect x="15" y="15" width="50" height="15" rx="2" fill="none" stroke="#333" strokeWidth="2"/><circle cx="20" cy="50" r="8" fill="none" stroke="#333" strokeWidth="2"/><circle cx="60" cy="50" r="8" fill="none" stroke="#333" strokeWidth="2"/></svg> },
            { nameKey: 'road', name: t('worksheets.readingPrek.objectNames.road'), svg: <svg width="80" height="60" viewBox="0 0 80 60"><rect x="0" y="25" width="80" height="10" fill="none" stroke="#333" strokeWidth="2"/><line x1="10" y1="30" x2="20" y2="30" stroke="#333" strokeWidth="1"/><line x1="30" y1="30" x2="40" y2="30" stroke="#333" strokeWidth="1"/><line x1="50" y1="30" x2="60" y2="30" stroke="#333" strokeWidth="1"/><line x1="70" y1="30" x2="80" y2="30" stroke="#333" strokeWidth="1"/></svg> },
            { nameKey: 'tree', name: t('worksheets.readingPrek.objectNames.tree'), svg: <svg width="60" height="80" viewBox="0 0 60 80"><rect x="25" y="50" width="10" height="30" fill="none" stroke="#333" strokeWidth="2"/><ellipse cx="30" cy="40" rx="20" ry="25" fill="none" stroke="#333" strokeWidth="2"/></svg> }
          ], 
          questions: [
            { key: 'seeCar', text: t('worksheets.readingPrek.questions.seeCar') },
            { key: 'carOnRoad', text: t('worksheets.readingPrek.questions.carOnRoad') }
          ] 
        },
        { 
          titleKey: 'sunnyDay',
          title: t('worksheets.readingPrek.storyTitles.sunnyDay'),
          images: [
            { nameKey: 'sun', name: t('worksheets.readingPrek.objectNames.sun'), svg: <svg width="70" height="70" viewBox="0 0 70 70"><circle cx="35" cy="35" r="20" fill="none" stroke="#333" strokeWidth="2"/><line x1="35" y1="5" x2="35" y2="15" stroke="#333" strokeWidth="2"/><line x1="35" y1="55" x2="35" y2="65" stroke="#333" strokeWidth="2"/><line x1="5" y1="35" x2="15" y2="35" stroke="#333" strokeWidth="2"/><line x1="55" y1="35" x2="65" y2="35" stroke="#333" strokeWidth="2"/><line x1="12" y1="12" x2="18" y2="18" stroke="#333" strokeWidth="2"/><line x1="52" y1="52" x2="58" y2="58" stroke="#333" strokeWidth="2"/><line x1="52" y1="12" x2="58" y2="18" stroke="#333" strokeWidth="2"/><line x1="12" y1="52" x2="18" y2="58" stroke="#333" strokeWidth="2"/></svg> },
            { nameKey: 'flower', name: t('worksheets.readingPrek.objectNames.flower'), svg: <svg width="60" height="70" viewBox="0 0 60 70"><line x1="30" y1="50" x2="30" y2="70" stroke="#333" strokeWidth="2"/><circle cx="30" cy="30" r="12" fill="none" stroke="#333" strokeWidth="2"/><ellipse cx="30" cy="15" rx="8" ry="10" fill="none" stroke="#333" strokeWidth="2"/><ellipse cx="30" cy="45" rx="8" ry="10" fill="none" stroke="#333" strokeWidth="2"/><ellipse cx="15" cy="30" rx="10" ry="8" fill="none" stroke="#333" strokeWidth="2"/><ellipse cx="45" cy="30" rx="10" ry="8" fill="none" stroke="#333" strokeWidth="2"/></svg> },
            { nameKey: 'ball', name: t('worksheets.readingPrek.objectNames.ball'), svg: <svg width="60" height="60" viewBox="0 0 60 60"><circle cx="30" cy="30" r="25" fill="none" stroke="#333" strokeWidth="2"/><path d="M 30 5 Q 15 15, 5 30 Q 15 45, 30 55 Q 45 45, 55 30 Q 45 15, 30 5" fill="none" stroke="#333" strokeWidth="1.5"/></svg> }
          ], 
          questions: [
            { key: 'seeSun', text: t('worksheets.readingPrek.questions.seeSun') },
            { key: 'thereFlower', text: t('worksheets.readingPrek.questions.thereFlower') }
          ] 
        },
        { 
          titleKey: 'bigTree',
          title: t('worksheets.readingPrek.storyTitles.bigTree'),
          images: [
            { nameKey: 'tree', name: t('worksheets.readingPrek.objectNames.tree'), svg: <svg width="60" height="80" viewBox="0 0 60 80"><rect x="25" y="50" width="10" height="30" fill="none" stroke="#333" strokeWidth="2"/><ellipse cx="30" cy="40" rx="20" ry="25" fill="none" stroke="#333" strokeWidth="2"/></svg> },
            { nameKey: 'house', name: t('worksheets.readingPrek.objectNames.house'), svg: <svg width="70" height="70" viewBox="0 0 70 70"><rect x="15" y="35" width="40" height="35" fill="none" stroke="#333" strokeWidth="2"/><polygon points="15,35 35,15 55,35" fill="none" stroke="#333" strokeWidth="2"/><rect x="25" y="45" width="12" height="20" fill="none" stroke="#333" strokeWidth="2"/><rect x="42" y="50" width="8" height="8" fill="none" stroke="#333" strokeWidth="2"/></svg> },
            { nameKey: 'flower', name: t('worksheets.readingPrek.objectNames.flower'), svg: <svg width="50" height="60" viewBox="0 0 50 60"><line x1="25" y1="40" x2="25" y2="60" stroke="#333" strokeWidth="2"/><circle cx="25" cy="25" r="10" fill="none" stroke="#333" strokeWidth="2"/><ellipse cx="25" cy="12" rx="6" ry="8" fill="none" stroke="#333" strokeWidth="2"/><ellipse cx="25" cy="38" rx="6" ry="8" fill="none" stroke="#333" strokeWidth="2"/><ellipse cx="12" cy="25" rx="8" ry="6" fill="none" stroke="#333" strokeWidth="2"/><ellipse cx="38" cy="25" rx="8" ry="6" fill="none" stroke="#333" strokeWidth="2"/></svg> }
          ], 
          questions: [
            { key: 'treeBig', text: t('worksheets.readingPrek.questions.treeBig') },
            { key: 'seeHouse', text: t('worksheets.readingPrek.questions.seeHouse') }
          ] 
        },
      ],
      3
    )
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-600">
          {t('worksheets.readingPrek.instructions')}
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
                  <p className="text-xs text-rose-600 mt-1">{img.name}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-2">
              {story.questions.map((q, qIdx) => (
                <div key={qIdx} className="text-xs text-rose-700">
                  {q.text} <span className="text-rose-500 font-semibold">{t('worksheets.readingPrek.yesNo')}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  },
  'interactive-writing-prek': (ctx) => {
    const { seed, doc, variant, t } = ctx
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const wordKeys = ['cat', 'dog', 'sun', 'car', 'tree', 'flower']
    const selectedKeys = pickMany(rng, wordKeys, 4)
    const prompts = selectedKeys.map(key => ({
      word: key,
      picture: t(`worksheets.writingPrek.drawPrompts.${key}`),
    }))
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          {t('worksheets.writingPrek.instructions')}
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {prompts.map((prompt, idx) => (
            <div key={idx} className="rounded-xl border border-green-200 bg-green-50 p-4">
              <p className="text-sm font-semibold text-green-700">{t('worksheets.writingPrek.word')} {prompt.word}</p>
              <div className="mt-2">
                <p className="text-xs text-green-600">{prompt.picture}</p>
                <div className="mt-1 h-24 rounded border border-dashed border-green-300 bg-white" />
              </div>
              <p className="mt-2 text-xs text-green-600">{t('worksheets.writingPrek.label')} <span className="font-semibold">{prompt.word}</span></p>
              <div className="mt-1 h-8 rounded border border-dashed border-green-300 bg-white" />
            </div>
          ))}
        </div>
      </div>
    )
  },
  'interactive-science-prek': (ctx) => {
    const { seed, doc, variant, t } = ctx
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const observations = pickMany(
      rng,
      [
        { topicKey: 'plants', topic: t('worksheets.sciencePrek.topics.plants'), questionKey: 'whatPlantsNeed', question: t('worksheets.sciencePrek.questions.whatPlantsNeed'), options: ['water', 'sun', 'soil'] },
        { topicKey: 'animals', topic: t('worksheets.sciencePrek.topics.animals'), questionKey: 'whereAnimalsLive', question: t('worksheets.sciencePrek.questions.whereAnimalsLive'), options: ['forest', 'ocean', 'farm'] },
        { topicKey: 'weather', topic: t('worksheets.sciencePrek.topics.weather'), questionKey: 'whatWeatherLike', question: t('worksheets.sciencePrek.questions.whatWeatherLike'), options: ['sunny', 'rainy', 'cloudy'] },
        { topicKey: 'seasons', topic: t('worksheets.sciencePrek.topics.seasons'), questionKey: 'whatSeason', question: t('worksheets.sciencePrek.questions.whatSeason'), options: ['spring', 'summer', 'fall', 'winter'] },
      ],
      3
    )
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          {t('worksheets.sciencePrek.instructions')}
        </p>
        {observations.map((obs, idx) => (
          <div key={idx} className="rounded-xl border border-teal-200 bg-teal-50 p-4">
            <p className="text-sm font-semibold text-teal-700">{obs.topic}</p>
            <div className="mt-2 h-20 rounded border border-teal-300 bg-white">
              <p className="p-2 text-xs text-teal-600">{t('worksheets.sciencePrek.drawOrPaste')}</p>
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
  'interactive-science-space': (ctx) => {
    const { seed, doc, variant, t } = ctx
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
          {t('worksheets.scienceSpace.instructions')}
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {planets.map((planet, idx) => (
            <div key={idx} className="rounded-xl border border-indigo-200 bg-indigo-50 p-4">
              <p className="text-sm font-semibold text-indigo-700">{planet.name}</p>
              <div className="mt-2 h-16 rounded border border-indigo-300 bg-white">
                <p className="p-2 text-xs text-indigo-600">{t('worksheets.answerKey.drawPicture')} {planet.name}</p>
              </div>
              <p className="mt-2 text-xs text-indigo-700">{t('worksheets.scienceSpace.fact')} {planet.fact}</p>
              <p className="mt-1 text-xs text-indigo-600">{t('worksheets.scienceSpace.distanceFromSun')} {planet.distance}</p>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4">
          <p className="text-sm font-semibold text-indigo-700">{t('worksheets.scienceSpace.spaceQuestions')}</p>
          <p className="mt-2 text-xs text-indigo-700">{t('worksheets.scienceSpace.whatIsStar')} ________________________</p>
          <p className="mt-1 text-xs text-indigo-700">{t('worksheets.scienceSpace.nameOnePlanet')} ________________________</p>
        </div>
      </div>
    )
  },
  'interactive-geography-prek': (ctx) => {
    const { seed, doc, variant, t } = ctx
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const places = pickMany(
      rng,
      [
        { name: 'Home', typeKey: 'whereILive', type: t('worksheets.geographyPrek.placeTypes.whereILive'), features: ['bedroom', 'kitchen'] },
        { name: 'School', typeKey: 'whereILearn', type: t('worksheets.geographyPrek.placeTypes.whereILearn'), features: ['classroom', 'playground'] },
        { name: 'Park', typeKey: 'whereIPlay', type: t('worksheets.geographyPrek.placeTypes.whereIPlay'), features: ['swings', 'slides'] },
      ],
      3
    )
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          {t('worksheets.geographyPrek.instructions')}
        </p>
        {places.map((place, idx) => (
          <div key={idx} className="rounded-xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm font-semibold text-amber-700">{place.name}</p>
            <p className="text-xs text-amber-600">{place.type}</p>
            <div className="mt-2 h-16 rounded border border-amber-300 bg-white">
              <p className="p-2 text-xs text-amber-600">{t('worksheets.geographyPrek.drawSimpleMap')}</p>
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
  'interactive-grammar-prek': (ctx) => {
    const { seed, doc, variant, t } = ctx
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
          {t('worksheets.grammarPrek.instructions')}
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {words.map((item, idx) => (
            <div key={idx} className="rounded-xl border border-purple-200 bg-purple-50 p-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{item.picture}</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-purple-700">{t('worksheets.grammarPrek.word')} {item.word}</p>
                  <p className="mt-1 text-xs text-purple-600">{t('worksheets.grammarPrek.match')} <span className="font-semibold">{item.word}</span></p>
                  <div className="mt-1 h-8 rounded border border-dashed border-purple-300 bg-white" />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-purple-200 bg-purple-50 p-4">
          <p className="text-sm font-semibold text-purple-700">{t('worksheets.grammarPrek.wordPractice')}</p>
          <p className="mt-2 text-xs text-purple-700">{t('worksheets.grammarPrek.circleWordMatches')}</p>
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
  'interactive-logic-prek': (ctx) => {
    const { seed, doc, variant, t } = ctx
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const patterns = pickMany(rng, ['AB', 'AAB', 'ABC'], 3)
    const sortingItems = pickMany(rng, ['red', 'blue', 'yellow', 'big', 'small', 'round', 'square'], 6)
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          {t('worksheets.logicPrek.instructions')}
        </p>
        <div className="space-y-3">
          {patterns.map((pattern, idx) => {
            const first = pick(rng, SHAPE_TOKENS)
            const second = pick(rng, SHAPE_TOKENS.filter((token) => token.key !== first.key))
            const third = pattern === 'ABC' ? pick(rng, SHAPE_TOKENS.filter((token) => token.key !== first.key && token.key !== second.key)) : second
            const previewTokens = pattern.split('').map((char) => (char === 'A' ? first : char === 'B' ? second : third))
            return (
              <div key={idx} className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-xs uppercase text-slate-500">{t('worksheets.logicPrek.pattern')} {pattern}</p>
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
  'interactive-sel-prek': (ctx) => {
    const { seed, doc, variant, t } = ctx
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
          {t('worksheets.selPrek.instructions')}
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {feelings.map((feeling, idx) => (
            <div key={idx} className="rounded-xl border border-pink-200 bg-pink-50 p-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{feeling.emoji}</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-pink-700">{t('worksheets.selPrek.feeling')} {feeling.feeling}</p>
                  <p className="text-xs text-pink-600">{t('worksheets.selPrek.color')} {feeling.color}</p>
                </div>
              </div>
              <div className="mt-2 h-12 rounded border border-dashed border-pink-300 bg-white">
                <p className="p-2 text-xs text-pink-600">{t('worksheets.selPrek.drawTimeFelt').replace('{{feeling}}', feeling.feeling)}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-pink-200 bg-pink-50 p-4">
          <p className="text-sm font-semibold text-pink-700">{t('worksheets.selPrek.howIFeelToday')}</p>
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
  'interactive-logic-sequence': (ctx) => {
    const { seed, doc, variant, t } = ctx
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
  'interactive-logic-riddles': (ctx) => {
    const { seed, doc, variant, t } = ctx
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
          {t('worksheets.logicRiddles.instructions')}
        </p>
        <div className="space-y-3">
          {riddles.map(([riddle, answer], idx) => (
            <div key={idx} className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
              <p className="font-semibold text-slate-900">Riddle {idx + 1}</p>
              <p>{riddle}</p>
              <p className="mt-2 text-xs text-slate-500">My guess: __________________________</p>
              <p className="mt-1 text-xs text-slate-500">{t('worksheets.logicRiddles.answer')} {answer}</p>
            </div>
          ))}
        </div>
      </div>
    )
  },
  'interactive-logic-deduction': (ctx) => {
    const { seed, doc, variant, t } = ctx
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const suspects = pickMany(rng, ['Ava', 'Ben', 'Chloe', 'Diego', 'Erin', 'Finn'], 3)
    const items = pickMany(rng, ['robot dog', 'rocket model', 'skateboard', 'drone', 'canvas painting', 'puzzle cube'], 3)
    const locations = pickMany(rng, ['STEM lab', 'library', 'art studio'], 3)
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          {t('worksheets.logicDeduction.instructions')}
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
  'interactive-cognitive-memory': (ctx) => {
    const { seed, doc, variant, t } = ctx
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const sequences = [
      { type: 'numbers', items: pickMany(rng, ['2', '4', '6', '8', '10', '12'], 4) },
      { type: 'colors', items: pickMany(rng, ['red', 'blue', 'green', 'yellow', 'purple', 'orange'], 4) },
      { type: 'shapes', items: pickMany(rng, ['circle', 'square', 'triangle', 'star', 'heart', 'diamond'], 4) },
    ]
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-600">
          Study each sequence carefully, then cover it and write what you remember. This strengthens your working memory!
        </p>
        <div className="space-y-4">
          {sequences.map((seq, idx) => (
            <div key={idx} className="rounded-xl border border-purple-200 bg-purple-50 p-4">
              <p className="text-sm font-semibold text-purple-700 mb-2">Sequence {idx + 1}: {seq.type.charAt(0).toUpperCase() + seq.type.slice(1)}</p>
              <div className="bg-white rounded-lg p-3 border border-purple-200 mb-2">
                <div className="flex gap-2 flex-wrap">
                  {seq.items.map((item, i) => (
                    <span key={i} className="px-3 py-1 bg-purple-100 rounded text-sm font-semibold text-purple-800">{item}</span>
                  ))}
                </div>
              </div>
              <p className="text-xs text-purple-600 mb-1">Now cover the sequence above and write what you remember:</p>
              <div className="flex gap-2 flex-wrap">
                {seq.items.map((_, i) => (
                  <div key={i} className="flex-1 min-w-[80px] h-8 border border-dashed border-purple-300 bg-white rounded"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-lg border border-purple-200 bg-white px-4 py-3 text-xs text-purple-700">
          <p className="font-semibold mb-1">Memory Challenge:</p>
          <p>{t('worksheets.cognitiveMemory.instructions')}</p>
          <div className="mt-2 space-y-1">
            <p>Sequence 1: ________________________________________________</p>
            <p>Sequence 2: ________________________________________________</p>
            <p>Sequence 3: ________________________________________________</p>
          </div>
        </div>
      </div>
    )
  },
  'interactive-cognitive-attention': (ctx) => {
    const { seed, doc, variant, t } = ctx
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const targetItems = pickMany(rng, ['star', 'circle', 'triangle', 'heart'], 1)[0]
    const gridItems = Array.from({ length: 25 }, (_, i) => {
      const items = ['star', 'circle', 'triangle', 'heart', 'square', 'diamond']
      return pick(rng, items)
    })
    const differences = [
      { image1: 'A sunny park with 3 trees', image2: 'A sunny park with 4 trees' },
      { image1: 'A cat with a red collar', image2: 'A cat with a blue collar' },
      { image1: 'A house with 2 windows', image2: 'A house with 3 windows' },
    ]
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-600">
          {t('worksheets.cognitiveAttention.instructions')}
        </p>
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
          <p className="text-sm font-semibold text-blue-700 mb-2">Visual Scanning Challenge</p>
          <p className="text-xs text-blue-600 mb-3" dangerouslySetInnerHTML={{ __html: t('worksheets.cognitiveAttention.findAndCircle').replace('{{items}}', targetItems) }}></p>
          <div className="bg-white rounded-lg p-3 border border-blue-200">
            <div className="grid grid-cols-5 gap-1">
              {gridItems.map((item, idx) => (
                <div key={idx} className="aspect-square border border-blue-200 rounded flex items-center justify-center text-xs">
                  {item === targetItems ? <span className="font-bold text-blue-700">{item}</span> : <span className="text-blue-400">{item}</span>}
                </div>
              ))}
            </div>
          </div>
          <p className="text-xs text-blue-600 mt-2">{t('worksheets.cognitiveAttention.countHowMany').replace('{{items}}', targetItems)}</p>
        </div>
        <div className="rounded-xl border border-green-200 bg-green-50 p-4">
          <p className="text-sm font-semibold text-green-700 mb-2">Spot the Difference</p>
          <p className="text-xs text-green-600 mb-3">{t('worksheets.cognitiveAttention.compareImages')}</p>
          <div className="space-y-3">
            {differences.map((diff, idx) => (
              <div key={idx} className="bg-white rounded-lg p-3 border border-green-200">
                <div className="grid grid-cols-2 gap-3 mb-2">
                  <div>
                    <p className="text-xs text-green-600 mb-1">Image 1:</p>
                    <div className="h-20 border border-dashed border-green-300 rounded flex items-center justify-center text-xs text-green-500">
                      {diff.image1}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-green-600 mb-1">Image 2:</p>
                    <div className="h-20 border border-dashed border-green-300 rounded flex items-center justify-center text-xs text-green-500">
                      {diff.image2}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-green-600">Difference: ________________________________</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  },
  'interactive-cognitive-executive': (ctx) => {
    const { seed, doc, variant, t } = ctx
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const tasks = pickMany(rng, [
      'Complete math homework',
      'Read chapter 5',
      'Practice piano',
      'Clean room',
      'Pack backpack',
      'Call grandma',
    ], 4)
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-600">
          {t('worksheets.cognitiveExecutive.instructions')}
        </p>
        <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4">
          <p className="text-sm font-semibold text-indigo-700 mb-3">{t('worksheets.cognitiveExecutive.taskPlanning')}</p>
          <p className="text-xs text-indigo-600 mb-3">{t('worksheets.cognitiveExecutive.planTasksToday')}</p>
          <div className="space-y-3">
            {tasks.map((task, idx) => (
              <div key={idx} className="bg-white rounded-lg p-3 border border-indigo-200">
                <p className="text-sm font-semibold text-indigo-800 mb-2">{t('worksheets.answerKey.task').replace('{{number}}', String(idx + 1))} {task}</p>
                <p className="text-xs text-indigo-600 mb-1">Steps to complete:</p>
                <div className="space-y-1">
                  <p className="text-xs text-slate-500">Step 1: ________________________________</p>
                  <p className="text-xs text-slate-500">Step 2: ________________________________</p>
                  <p className="text-xs text-slate-500">Step 3: ________________________________</p>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs text-indigo-600">Priority:</span>
                  <div className="flex gap-1">
                    <span className="text-xs px-2 py-1 border border-indigo-300 rounded">High</span>
                    <span className="text-xs px-2 py-1 border border-indigo-300 rounded">Medium</span>
                    <span className="text-xs px-2 py-1 border border-indigo-300 rounded">Low</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-indigo-200 bg-white p-4">
          <p className="text-sm font-semibold text-indigo-700 mb-2">Daily Schedule</p>
          <p className="text-xs text-indigo-600 mb-3">Organize your tasks into a schedule:</p>
          <div className="space-y-2 text-xs">
            <div className="flex gap-2">
              <span className="w-20 font-semibold">Morning:</span>
              <div className="flex-1 border border-dashed border-indigo-300 rounded p-1"></div>
            </div>
            <div className="flex gap-2">
              <span className="w-20 font-semibold">Afternoon:</span>
              <div className="flex-1 border border-dashed border-indigo-300 rounded p-1"></div>
            </div>
            <div className="flex gap-2">
              <span className="w-20 font-semibold">Evening:</span>
              <div className="flex-1 border border-dashed border-indigo-300 rounded p-1"></div>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-3 text-xs text-indigo-700">
          <p className="font-semibold mb-1">{t('worksheets.reflection.title')}:</p>
          <p>{t('worksheets.reflection.generalQuestions')}</p>
          <div className="mt-2 h-16 border border-dashed border-indigo-300 bg-white rounded"></div>
        </div>
      </div>
    )
  },
  'interactive-cognitive-processing': (ctx) => {
    const { seed, doc, variant, t } = ctx
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const symbols = ['★', '●', '▲', '■', '◆', '♥']
    const quickItems = Array.from({ length: 20 }, () => pick(rng, symbols))
    const words = pickMany(rng, ['cat', 'dog', 'bird', 'fish', 'tree', 'car', 'book', 'star'], 8)
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-600">
          {t('worksheets.cognitiveProcessing.instructions')}
        </p>
        <div className="rounded-xl border border-orange-200 bg-orange-50 p-4">
          <p className="text-sm font-semibold text-orange-700 mb-2">{t('worksheets.cognitiveProcessing.quickSymbolRecognition')}</p>
          <p className="text-xs text-orange-600 mb-3">{t('worksheets.cognitiveProcessing.circleAllStars')}</p>
          <div className="bg-white rounded-lg p-3 border border-orange-200">
            <div className="flex flex-wrap gap-2">
              {quickItems.map((symbol, idx) => (
                <span key={idx} className="text-2xl">{symbol === '★' ? <span className="font-bold text-orange-700">{symbol}</span> : <span className="text-orange-300">{symbol}</span>}</span>
              ))}
            </div>
          </div>
          <p className="text-xs text-orange-600 mt-2">Time yourself: _______ seconds</p>
        </div>
        <div className="rounded-xl border border-orange-200 bg-orange-50 p-4">
          <p className="text-sm font-semibold text-orange-700 mb-2">Rapid Word Identification</p>
          <p className="text-xs text-orange-600 mb-3">Quickly find and circle words that start with "b":</p>
          <div className="bg-white rounded-lg p-3 border border-orange-200">
            <div className="flex flex-wrap gap-2">
              {words.map((word, idx) => (
                <span key={idx} className={`px-2 py-1 rounded text-sm ${word.startsWith('b') ? 'bg-orange-200 font-bold text-orange-800' : 'text-orange-400'}`}>
                  {word}
                </span>
              ))}
            </div>
          </div>
          <p className="text-xs text-orange-600 mt-2">How many "b" words did you find? _______</p>
        </div>
        <div className="rounded-lg border border-orange-200 bg-white px-4 py-3 text-xs text-orange-700">
          <p className="font-semibold mb-1">Speed Challenge:</p>
          <p>Try to complete both exercises faster each time you practice!</p>
        </div>
      </div>
    )
  },
  'interactive-cognitive-visual': (ctx) => {
    const { seed, doc, variant, t } = ctx
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    // Use translation keys for colors, shapes, and sizes
    const patterns = [
      { 
        original: [t('common.colors.red'), t('common.colors.blue'), t('common.colors.red'), t('common.colors.blue')], 
        match: [t('common.colors.red'), t('common.colors.blue'), t('common.colors.red'), t('common.colors.green')] 
      },
      { 
        original: [t('common.shapes.circle'), t('common.shapes.square'), t('common.shapes.circle'), t('common.shapes.square')], 
        match: [t('common.shapes.circle'), t('common.shapes.square'), t('common.shapes.triangle'), t('common.shapes.square')] 
      },
      { 
        original: [t('common.sizes.big'), t('common.sizes.small'), t('common.sizes.big'), t('common.sizes.small')], 
        match: [t('common.sizes.big'), t('common.sizes.small'), t('common.sizes.big'), t('common.sizes.big')] 
      },
    ]
    const spatialItems = [
      { position: 'above', itemKey: 'star', textKey: 'above' },
      { position: 'below', itemKey: 'circle', textKey: 'below' },
      { position: 'left', itemKey: 'triangle', textKey: 'toTheLeftOf' },
      { position: 'right', itemKey: 'square', textKey: 'toTheRightOf' },
    ]
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-600">
          {t('worksheets.cognitiveVisual.visualPatternMatching')}
        </p>
        <div className="rounded-xl border border-pink-200 bg-pink-50 p-4">
          <p className="text-sm font-semibold text-pink-700 mb-3">{t('worksheets.cognitiveVisual.visualPatternMatching')}</p>
          <p className="text-xs text-pink-600 mb-3">{t('worksheets.cognitiveVisual.comparePatterns')}</p>
          <div className="space-y-3">
            {patterns.map((pattern, idx) => (
              <div key={idx} className="bg-white rounded-lg p-3 border border-pink-200">
                <p className="text-xs text-pink-600 mb-2">{t('worksheets.cognitiveVisual.pattern').replace('{{number}}', String(idx + 1))}</p>
                <div className="flex gap-4 mb-2">
                  <div>
                    <p className="text-xs text-pink-600 mb-1">{t('worksheets.cognitiveVisual.original')}</p>
                    <div className="flex gap-1">
                      {pattern.original.map((item, i) => (
                        <span key={i} className="px-2 py-1 bg-pink-100 rounded text-xs font-semibold text-pink-800">{item}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-pink-600 mb-1">{t('worksheets.cognitiveVisual.match')}</p>
                    <div className="flex gap-1">
                      {pattern.match.map((item, i) => (
                        <span key={i} className={`px-2 py-1 rounded text-xs font-semibold ${item !== pattern.original[i] ? 'bg-pink-200 text-pink-900 border-2 border-pink-500' : 'bg-pink-100 text-pink-800'}`}>{item}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-pink-600">{t('worksheets.cognitiveVisual.whatsDifferent')}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-pink-200 bg-pink-50 p-4">
          <p className="text-sm font-semibold text-pink-700 mb-3">{t('worksheets.cognitiveVisual.spatialReasoning')}</p>
          <p className="text-xs text-pink-600 mb-3">{t('worksheets.cognitiveVisual.drawItemPosition')}</p>
          <div className="bg-white rounded-lg p-3 border border-pink-200">
            <div className="grid grid-cols-2 gap-4">
              {spatialItems.map((item, idx) => {
                const itemText = t(`common.shapes.${item.itemKey}`)
                return (
                  <div key={idx} className="border border-dashed border-pink-300 rounded p-3">
                    <p className="text-xs text-pink-600 mb-2">{t('worksheets.cognitiveVisual.drawItemText').replace('{{item}}', itemText).replace('{{text}}', t(`worksheets.cognitiveVisual.${item.textKey}`))}</p>
                    {item.position === 'above' && (
                      <div className="h-20 border border-pink-200 rounded relative">
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-600"></div>
                      </div>
                    )}
                    {item.position === 'below' && (
                      <div className="h-20 border border-pink-200 rounded relative">
                        <div className="absolute top-0 left-0 right-0 h-0.5 bg-pink-600"></div>
                      </div>
                    )}
                    {item.position === 'left' && (
                      <div className="h-20 border border-pink-200 rounded relative">
                        <div className="absolute top-0 bottom-0 right-0 w-0.5 bg-pink-600"></div>
                      </div>
                    )}
                    {item.position === 'right' && (
                      <div className="h-20 border border-pink-200 rounded relative">
                        <div className="absolute top-0 bottom-0 left-0 w-0.5 bg-pink-600"></div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    )
  },
  'interactive-cognitive-flexibility': (ctx) => {
    const { seed, doc, variant, t } = ctx
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const tasks = [
      { 
        taskKey: 'sortByColor', 
        ruleKey: 'groupRedItems', 
        switchKey: 'sortBySize' 
      },
      { 
        taskKey: 'countForward', 
        ruleKey: 'count123', 
        switchKey: 'countBackward' 
      },
      { 
        taskKey: 'nameAnimals', 
        ruleKey: 'listFarmAnimals', 
        switchKey: 'listOceanAnimals' 
      },
    ]
    const allPerspectives = [
      'newStudent',
      'gameCancelled',
      'disagreeWith',
    ]
    const perspectives = pickMany(rng, allPerspectives, 2)
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-600">
          {t('worksheets.cognitiveFlexibility.instructions')}
        </p>
        <div className="rounded-xl border border-teal-200 bg-teal-50 p-4">
          <p className="text-sm font-semibold text-teal-700 mb-3">{t('worksheets.cognitiveFlexibility.taskSwitchingChallenge')}</p>
          <p className="text-xs text-teal-600 mb-3">{t('worksheets.cognitiveFlexibility.completeEachTask')}</p>
          <div className="space-y-3">
            {tasks.map((taskItem, idx) => (
              <div key={idx} className="bg-white rounded-lg p-3 border border-teal-200">
                <p className="text-sm font-semibold text-teal-800 mb-2">{t('worksheets.cognitiveFlexibility.tasks.' + taskItem.taskKey)}</p>
                <div className="mb-2">
                  <p className="text-xs text-teal-600 mb-1">{t('worksheets.cognitiveFlexibility.firstRule')} {t('worksheets.cognitiveFlexibility.tasks.' + taskItem.ruleKey)}</p>
                  <div className="h-12 border border-dashed border-teal-300 rounded bg-teal-50"></div>
                </div>
                <div>
                  <p className="text-xs text-teal-600 mb-1">{t('worksheets.cognitiveFlexibility.switchNewRule')} {t('worksheets.cognitiveFlexibility.tasks.' + taskItem.switchKey)}</p>
                  <div className="h-12 border border-dashed border-teal-300 rounded bg-teal-50"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-teal-200 bg-teal-50 p-4">
          <p className="text-sm font-semibold text-teal-700 mb-3">{t('worksheets.cognitiveFlexibility.perspectiveTakingPractice')}</p>
          <p className="text-xs text-teal-600 mb-3">{t('worksheets.cognitiveFlexibility.thinkAboutSituation')}</p>
          <div className="space-y-3">
            {perspectives.map((perspectiveKey, idx) => (
              <div key={idx} className="bg-white rounded-lg p-3 border border-teal-200">
                <p className="text-sm font-semibold text-teal-800 mb-2">{t('worksheets.cognitiveFlexibility.situation')} {t('worksheets.cognitiveFlexibility.perspectives.' + perspectiveKey)}</p>
                <div className="space-y-2 text-xs">
                  <div>
                    <p className="text-teal-600 mb-1">{t('worksheets.cognitiveFlexibility.yourPerspective')}</p>
                    <div className="h-10 border border-dashed border-teal-300 rounded"></div>
                  </div>
                  <div>
                    <p className="text-teal-600 mb-1">{t('worksheets.cognitiveFlexibility.anotherPerspective')}</p>
                    <div className="h-10 border border-dashed border-teal-300 rounded"></div>
                  </div>
                  <div>
                    <p className="text-teal-600 mb-1">{t('worksheets.cognitiveFlexibility.solutionForBoth')}</p>
                    <div className="h-10 border border-dashed border-teal-300 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  },
  'interactive-sel-mindfulness': (ctx) => {
    const { seed, doc, variant, t } = ctx
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
  'interactive-sel-empathy': (ctx) => {
    const { seed, doc, variant, t } = ctx
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
  'interactive-sel-goals': (ctx) => {
    const { seed, doc, variant, t } = ctx
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const focuses = pickMany(rng, ['collaboration', 'growth mindset', 'healthy habits', 'kindness', 'study skills', 'creative risk-taking'], 3)
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          {t('worksheets.goalSetting.instructions')}
        </p>
        <div className="space-y-3">
          {focuses.map((focus, idx) => (
            <div key={idx} className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
              <p className="font-semibold text-emerald-900">{t('worksheets.goalSetting.goalArea')}: {focus}</p>
              <p>{t('worksheets.goalSetting.goalStatement')}: __________________________________________</p>
              <p>{t('worksheets.goalSetting.steps')}: ________________________________________</p>
              <p>{t('worksheets.reflection.title')}: ______________________________________________</p>
            </div>
          ))}
        </div>
      </div>
    )
  },
  'interactive-sel-conflict': (ctx) => {
    const { seed, doc, variant, t } = ctx
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const scenarios = pickMany(rng, [
      'Two friends want to play different games at recess.',
      'Someone cuts in line in front of you.',
      'A classmate takes your pencil without asking.',
      'You and a friend disagree about a group project idea.',
      'Someone says something unkind about your friend.',
    ], 3)
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-600">{t('worksheets.selConflict.instructions')}</p>
        <div className="space-y-3">
          {scenarios.map((scenario, idx) => (
            <div key={idx} className="rounded-xl border border-blue-200 bg-blue-50 p-4">
              <p className="text-sm font-semibold text-blue-700 mb-2">Scenario {idx + 1}:</p>
              <p className="text-sm text-blue-800 mb-3">{scenario}</p>
              <div className="space-y-2 text-xs">
                <p className="text-blue-700">What are your feelings? ______________________________</p>
                <p className="text-blue-700">What could you say to express your feelings? ________________</p>
                <p className="text-blue-700">What is a peaceful solution? ______________________________</p>
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-xs text-blue-700">
          💡 Remember: Use "I" statements, listen actively, and find win-win solutions!
        </div>
      </div>
    )
  },
  'interactive-sel-regulation': (ctx) => {
    const { seed, doc, variant, t } = ctx
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const strategies = pickMany(rng, [
      { name: 'Take deep breaths', emoji: '🫁', steps: 'Breathe in for 4, hold for 4, breathe out for 4' },
      { name: 'Count to 10', emoji: '🔢', steps: 'Slowly count from 1 to 10' },
      { name: 'Use a calm-down corner', emoji: '🧘', steps: 'Find a quiet space to relax' },
      { name: 'Think of happy thoughts', emoji: '😊', steps: 'Picture something that makes you smile' },
      { name: 'Squeeze a stress ball', emoji: '🤲', steps: 'Use your hands to release tension' },
      { name: 'Take a walk', emoji: '🚶', steps: 'Move your body to calm your mind' },
    ], 4)
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-600">{t('worksheets.selRegulation.instructions')}</p>
        <div className="grid gap-3 md:grid-cols-2">
          {strategies.map((strategy, idx) => (
            <div key={idx} className="rounded-xl border border-purple-200 bg-purple-50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{strategy.emoji}</span>
                <p className="text-sm font-semibold text-purple-700">{strategy.name}</p>
              </div>
              <p className="text-xs text-purple-600 mb-2">{strategy.steps}</p>
              <div className="mt-2 rounded border border-purple-200 bg-white p-2">
                <p className="text-xs text-purple-600">When I tried this, I felt: ________________</p>
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-lg border border-purple-200 bg-purple-50 px-4 py-3 text-xs text-purple-700">
          💡 Practice these strategies when you feel calm, so they're easier to use when you need them!
        </div>
      </div>
    )
  },
  'interactive-sel-kindness': (ctx) => {
    const { seed, doc, variant, t } = ctx
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const acts = pickMany(rng, [
      'Help someone with their work',
      'Say something kind to a classmate',
      'Share something with a friend',
      'Help clean up without being asked',
      'Write a thank-you note',
      'Include someone who looks lonely',
      'Give someone a compliment',
      'Hold the door for someone',
    ], 5)
    return (
      <div className="space-y-4">
        <p className="text-base font-semibold text-indigo-800">{t('worksheets.selKindness.instructions')}</p>
        <div className="rounded-xl border-2 border-indigo-300 bg-gradient-to-br from-indigo-50 via-violet-50 to-purple-50 p-5 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">💝</span>
            <p className="text-xl font-bold text-indigo-800">Kindness Challenge</p>
          </div>
          <table className="w-full border-2 border-indigo-300 text-sm bg-white rounded-lg overflow-hidden shadow-md">
            <thead className="bg-gradient-to-r from-indigo-400 to-violet-400 text-white">
              <tr>
                <th className="px-4 py-3 text-left font-bold">Kindness Act</th>
                <th className="px-4 py-3 text-left font-bold">When I did this...</th>
                <th className="px-4 py-3 text-left font-bold">How did it make others feel?</th>
                <th className="px-4 py-3 text-left font-bold">How did it make me feel?</th>
              </tr>
            </thead>
            <tbody>
              {acts.map((act, idx) => (
                <tr key={idx} className={`border-t-2 border-indigo-200 ${idx % 2 === 0 ? 'bg-indigo-50/50' : 'bg-white'} hover:bg-indigo-100 transition-colors`}>
                  <td className="px-4 py-3 font-semibold text-indigo-900">{act}</td>
                  <td className="px-4 py-3"><span className="border-b-2 border-indigo-300 border-dashed inline-block min-w-[120px]">_______________________</span></td>
                  <td className="px-4 py-3"><span className="border-b-2 border-indigo-300 border-dashed inline-block min-w-[120px]">_______________________</span></td>
                  <td className="px-4 py-3"><span className="border-b-2 border-indigo-300 border-dashed inline-block min-w-[120px]">_______________________</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="rounded-xl border-2 border-pink-300 bg-gradient-to-r from-pink-100 to-rose-100 px-6 py-4 text-sm text-pink-800 shadow-md">
          <p className="font-bold text-base flex items-center gap-2">
            <span className="text-2xl">💡</span>
            <span>Kindness is contagious! When you're kind, others are more likely to be kind too.</span>
          </p>
        </div>
      </div>
    )
  },
  'interactive-sel-growth-mindset': (ctx) => {
    const { seed, doc, variant, t } = ctx
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const fixedStatements = pickMany(rng, [
      'I\'m not good at math',
      'I can\'t do this',
      'This is too hard',
      'I give up',
      'I\'m not smart enough',
    ], 3)
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-600">{t('worksheets.selGrowthMindset.instructions')}</p>
        <div className="space-y-3">
          {fixedStatements.map((statement, idx) => (
            <div key={idx} className="rounded-xl border border-orange-200 bg-orange-50 p-4">
              <p className="text-sm font-semibold text-orange-700 mb-2">Fixed Mindset:</p>
              <p className="text-sm text-orange-800 mb-3">"{statement}"</p>
              <p className="text-sm font-semibold text-green-700 mb-2">Growth Mindset:</p>
              <p className="text-sm text-green-800 mb-2">Rewrite this thought: ________________________________</p>
              <div className="mt-2 rounded border border-green-200 bg-white p-2">
                <p className="text-xs text-green-600">What can I learn from this challenge? ________________</p>
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-xs text-green-700">
          💡 Remember: Your brain grows stronger when you practice! Mistakes are opportunities to learn.
        </div>
      </div>
    )
  },
  'interactive-sel-stress': (ctx) => {
    const { seed, doc, variant, t } = ctx
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const triggers = pickMany(rng, [
      'Too much homework',
      'Test anxiety',
      'Conflict with friends',
      'Feeling overwhelmed',
      'Time pressure',
    ], 3)
    const copingStrategies = pickMany(rng, [
      'Deep breathing exercises',
      'Physical activity or exercise',
      'Talking to someone you trust',
      'Taking breaks',
      'Organizing your tasks',
      'Mindfulness or meditation',
    ], 4)
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-600">{t('worksheets.selStress.instructions')}</p>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-semibold text-red-700 mb-3">Stress Triggers:</p>
            <div className="space-y-2">
              {triggers.map((trigger, idx) => (
                <div key={idx} className="bg-white rounded border border-red-200 p-2">
                  <p className="text-xs text-red-700">{trigger}</p>
                  <p className="text-xs text-red-600 mt-1">How does this make me feel? ________________</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-green-200 bg-green-50 p-4">
            <p className="text-sm font-semibold text-green-700 mb-3">Healthy Coping Strategies:</p>
            <div className="space-y-2">
              {copingStrategies.map((strategy, idx) => (
                <div key={idx} className="bg-white rounded border border-green-200 p-2">
                  <p className="text-xs text-green-700">{strategy}</p>
                  <p className="text-xs text-green-600 mt-1">When I can use this: ________________</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-xs text-blue-700">
          💡 It's okay to feel stressed sometimes. The important thing is knowing how to manage it in healthy ways.
        </div>
      </div>
    )
  },
  'interactive-sel-character': (ctx) => {
    const { seed, doc, variant, t } = ctx
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const traitKeys = ['honesty', 'respect', 'responsibility', 'integrity', 'courage', 'compassion']
    const emojis = { honesty: '💎', respect: '🤝', responsibility: '📋', integrity: '⭐', courage: '🦁', compassion: '❤️' }
    const selectedKeys = pickMany(rng, traitKeys, 4)
    const traits = selectedKeys.map(key => ({
      name: t(`worksheets.selCharacter.traits.${key}.name`),
      description: t(`worksheets.selCharacter.traits.${key}.description`),
      emoji: emojis[key],
    }))
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-600">{t('worksheets.selCharacter.instructions')}</p>
        <div className="grid gap-3 md:grid-cols-2">
          {traits.map((trait, idx) => (
            <div key={idx} className="rounded-xl border border-indigo-200 bg-indigo-50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{trait.emoji}</span>
                <p className="text-sm font-semibold text-indigo-700">{trait.name}</p>
              </div>
              <p className="text-xs text-indigo-600 mb-3">{trait.description}</p>
              <div className="space-y-2 text-xs">
                <p className="text-indigo-700">How can I show {trait.name.toLowerCase()}? ________________</p>
                <p className="text-indigo-700">When have I seen someone show {trait.name.toLowerCase()}? ________________</p>
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-3 text-xs text-indigo-700">
          💡 Character traits are like muscles—the more you practice them, the stronger they become!
        </div>
      </div>
    )
  },
  'interactive-math-algebra': (ctx) => {
    const { seed, doc, variant, t } = ctx
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
          {t('worksheets.algebra.solveEachEquation')}
        </p>
        <div className="space-y-3">
          {problems.map((prob, idx) => (
            <div key={idx} className="rounded-xl border border-purple-200 bg-white p-4">
              <p className="text-sm font-semibold text-purple-800">
                {prob.type === 'solve' && `${t('worksheets.algebra.solve')} ${prob.eq}`}
                {prob.type === 'evaluate' && `Evaluate ${prob.expr} when x = ${prob.x}`}
                {prob.type === 'simplify' && `Simplify: ${prob.expr}`}
              </p>
              <p className="mt-2 text-xs text-slate-500">{t('worksheets.answerKey.answer')} _______________</p>
            </div>
          ))}
        </div>
      </div>
    )
  },
  'interactive-math-percentages': (ctx) => {
    const { seed, doc, variant, t } = ctx
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
              <p className="mt-2 text-xs text-slate-500">{t('worksheets.answerKey.answer')} _______________</p>
            </div>
          ))}
        </div>
      </div>
    )
  },
  'interactive-math-geometry': (ctx) => {
    const { seed, doc, variant, t } = ctx
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
              <p className="mt-2 text-xs text-slate-500">{t('worksheets.answerKey.answer')} _______________</p>
            </div>
          ))}
        </div>
      </div>
    )
  },
  'interactive-math-statistics': (ctx) => {
    const { seed, doc, variant, t } = ctx
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
  'interactive-math-word-problems': (ctx) => {
    const { seed, doc, variant, t } = ctx
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
          {t('worksheets.wordProblems.solveEachMultiStep')}
        </p>
        <div className="space-y-3">
          {problems.map((prob, idx) => (
            <div key={idx} className="rounded-xl border border-purple-200 bg-white p-4">
              <p className="text-sm font-semibold text-purple-800">{t('worksheets.answerKey.problem').replace('{{number}}', String(idx + 1))}</p>
              <p className="mt-1 text-sm text-slate-700">{prob.q}</p>
              <div className="mt-3 h-16 border border-slate-200 rounded bg-slate-50"></div>
              <p className="mt-2 text-xs text-slate-500">{t('worksheets.answerKey.answer')} _______________</p>
            </div>
          ))}
        </div>
      </div>
    )
  },
  'interactive-math-counting': (ctx) => {
    const { seed, doc, variant, t, formatNum } = ctx
    const problems = buildMathCounting(seed, doc.id, variant)
    const objectEmojis: Record<string, string> = {
      'stars': '⭐',
      'hearts': '❤️',
      'circles': '⭕',
      'apples': '🍎',
      'balls': '⚽',
      'flowers': '🌸',
      'butterflies': '🦋',
      'fish': '🐟'
    }
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-600">{t('worksheets.countObjectsAndWriteNumber')}</p>
        <div className="grid gap-4 md:grid-cols-2">
          {problems.map((prob, idx) => {
            const emoji = objectEmojis[prob.objects[0]] || '⭐'
            const objectName = t(`worksheets.objectNames.${prob.objects[0]}`) || prob.objects[0]
            return (
              <div key={idx} className="rounded-xl border-2 border-purple-300 bg-gradient-to-br from-purple-100 via-pink-100 to-indigo-100 p-5 shadow-md hover:shadow-lg transition-shadow">
                <p className="text-base font-bold text-purple-800 mb-3 flex items-center gap-2">
                  <span className="text-2xl">{emoji}</span>
                  <span>{t('worksheets.countThe').replace('{{object}}', objectName)}</span>
                </p>
                <div className="flex flex-wrap gap-3 mb-4 bg-white/80 rounded-lg p-4 border-2 border-purple-200">
                  {Array.from({ length: prob.number }).map((_, i) => (
                    <span key={i} className="text-4xl animate-pulse" style={{ animationDelay: `${i * 0.1}s`, animationDuration: '2s' }}>{emoji}</span>
                  ))}
                </div>
                <div className="bg-white rounded-lg border-2 border-purple-300 p-3">
                  <p className="text-base font-bold text-purple-800">{t('worksheets.numberLabel')}: <span className="border-b-2 border-purple-400 border-dashed inline-block min-w-[60px]">________</span></p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  },
  'interactive-math-tens-frames': (ctx) => {
    const { seed, doc, variant, t } = ctx
    const problems = buildMathTensFrames(seed, doc.id, variant)
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-600">{t('worksheets.fillInTensFrame')}</p>
        <div className="grid gap-4 md:grid-cols-2">
          {problems.map((prob, idx) => {
            const total = prob.filled + prob.missing
            const showFilled = prob.operation === '+' ? prob.filled : total
            const instruction = prob.operation === '+' 
              ? t('worksheets.tensFrame.additionInstruction')
                  .replace('{{filled}}', String(prob.filled))
                  .replace('{{missing}}', String(prob.missing))
                  .replace('{{total}}', String(total))
              : t('worksheets.tensFrame.subtractionInstruction')
                  .replace('{{total}}', String(total))
                  .replace('{{missing}}', String(prob.missing))
            return (
              <div key={idx} className="rounded-xl border border-purple-200 bg-purple-50 p-4">
                <p className="text-sm font-semibold text-purple-700 mb-2">
                  {instruction}
                </p>
                <div className="grid grid-cols-5 gap-1 mb-3 w-32">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className={`aspect-square border-2 border-purple-300 rounded ${i < showFilled ? 'bg-purple-400' : 'bg-white'}`}></div>
                  ))}
                </div>
                <p className="text-sm text-purple-800">{t('worksheets.answerLabel')}: {prob.operation === '+' ? `${prob.filled} + ${prob.missing}` : `${total} - ${prob.missing}`} = ________</p>
              </div>
            )
          })}
        </div>
      </div>
    )
  },
  'interactive-math-multiplication': (ctx) => {
    const { seed, doc, variant, t } = ctx
    const problems = buildMathMultiplication(seed, doc.id, variant)
    return (
      <div className="space-y-4">
        <p className="text-base font-semibold text-purple-800">{t('worksheets.multiplication.instructions')}</p>
        <div className="space-y-4">
          {problems.map((prob, idx) => (
            <div key={idx} className="rounded-xl border-2 border-purple-300 bg-gradient-to-br from-purple-100 via-indigo-100 to-pink-100 p-5 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">✖️</span>
                <p className="text-lg font-bold text-purple-900">{prob.factor1} × {prob.factor2} = <span className="border-b-2 border-purple-400 border-dashed inline-block min-w-[60px]">________</span></p>
              </div>
              <p className="text-sm font-semibold text-purple-700 mb-3">
                {t('worksheets.multiplication.drawArray')
                  .replace('{{rows}}', String(prob.arrayRows))
                  .replace('{{cols}}', String(prob.arrayCols))}
              </p>
              <div className="mb-3 p-4 bg-white/90 rounded-xl border-2 border-purple-200 shadow-inner">
                <p className="text-sm text-purple-800 mb-2 font-bold flex items-center gap-2">
                  <span>📊</span>
                  <span>{t('worksheets.multiplication.visualExample')}</span>
                </p>
                <div className="grid gap-2 p-2 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg" style={{ gridTemplateColumns: `repeat(${Math.min(prob.arrayCols, 8)}, 1fr)`, maxWidth: '280px' }}>
                  {Array.from({ length: Math.min(prob.arrayRows * prob.arrayCols, 24) }).map((_, i) => (
                    <div key={i} className="aspect-square bg-gradient-to-br from-purple-400 to-indigo-400 border-2 border-purple-500 rounded-lg text-xs flex items-center justify-center text-white font-bold shadow-sm hover:scale-110 transition-transform">
                      ●
                    </div>
                  ))}
                </div>
                {prob.arrayRows * prob.arrayCols > 24 && (
                  <p className="text-xs text-purple-700 mt-2 font-semibold">
                    {t('worksheets.multiplication.arraySummary')
                      .replace('{{rows}}', String(prob.arrayRows))
                      .replace('{{cols}}', String(prob.arrayCols))
                      .replace('{{total}}', String(prob.answer))}
                  </p>
                )}
              </div>
              <div className="h-24 border-2 border-dashed border-purple-300 rounded-xl bg-white/80 flex items-center justify-center">
                <p className="text-purple-600 text-sm font-semibold">{t('worksheets.multiplication.drawHere')}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  },
  'interactive-math-division': (ctx) => {
    const { seed, doc, variant, t } = ctx
    const problems = buildMathDivision(seed, doc.id, variant)
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-600">{t('worksheets.division.instructions')}</p>
        <div className="space-y-3">
          {problems.map((prob, idx) => (
            <div key={idx} className="rounded-xl border border-purple-200 bg-white p-4">
              <p className="text-sm font-semibold text-purple-800 mb-2">{prob.dividend} ÷ {prob.divisor} = ________</p>
              {prob.remainder > 0 && <p className="text-xs text-slate-600">{t('worksheets.division.remainder')} ________</p>}
              <div className="mb-2 p-2 bg-purple-50 rounded border border-purple-200">
                <p className="text-xs text-purple-700 mb-1 font-semibold">{t('worksheets.division.visualGrouping')}</p>
                <div className="flex flex-wrap gap-1">
                  {Array.from({ length: Math.min(prob.dividend, 20) }).map((_, i) => (
                    <div key={i} className={`w-6 h-6 rounded border ${i < prob.quotient * prob.divisor ? 'bg-purple-300 border-purple-400' : 'bg-purple-100 border-purple-200'}`}></div>
                  ))}
                  {prob.dividend > 20 && (
                    <span className="text-xs text-purple-600 ml-1">
                      ... ({prob.dividend} {t('worksheets.division.total')})
                    </span>
                  )}
                </div>
                <p className="text-xs text-purple-600 mt-1">
                  {t('worksheets.division.groupInto')
                    .replace('{{divisor}}', String(prob.divisor))
                    .replace('{{quotient}}', String(prob.quotient))
                    .replace('{{remainder}}', prob.remainder > 0 ? t('worksheets.division.leftOver').replace('{{remainder}}', String(prob.remainder)) : '')}
                </p>
              </div>
              <div className="mt-2 h-16 border border-dashed border-purple-300 rounded bg-purple-50"></div>
            </div>
          ))}
        </div>
      </div>
    )
  },
  'interactive-math-place-value': (ctx) => {
    const { seed, doc, variant, t, formatNum, language } = ctx
    const problems = buildMathPlaceValue(seed, doc.id, variant)
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-600">{t('worksheets.placeValue.instructions')}</p>
        <div className="space-y-3">
          {problems.map((prob, idx) => {
            const numStr = String(prob.number)
            const placeOrder = ['ones', 'tens', 'hundreds', 'thousands']
            const placeIndex = placeOrder.indexOf(prob.place)
            return (
              <div key={idx} className="rounded-xl border border-purple-200 bg-white p-4">
                <p className="text-lg font-bold text-purple-800 mb-2">{formatNum(prob.number)}</p>
                <div className="mb-2 p-2 bg-purple-50 rounded border border-purple-200">
                  <p className="text-xs text-purple-700 mb-1 font-semibold">{t('worksheets.placeValue.placeValueChart')}</p>
                  <div className="flex gap-1 justify-start items-end">
                    {numStr.split('').reverse().map((digit, i) => {
                      const placeKey = placeOrder[i] || ''
                      const placeName = placeKey ? t(`worksheets.placeValue.${placeKey}`) : ''
                      const isHighlighted = i === placeIndex
                      const formattedDigit = language === 'ar' ? formatNum(parseInt(digit, 10)) : digit
                      return (
                        <div key={i} className={`text-center ${isHighlighted ? 'bg-purple-300 border-2 border-purple-600' : 'bg-white border border-purple-200'} rounded p-1 min-w-[50px]`}>
                          <div className="text-xs text-purple-600">{placeName}</div>
                          <div className={`text-lg font-bold ${isHighlighted ? 'text-purple-900' : 'text-purple-700'}`}>{formattedDigit}</div>
                        </div>
                      )
                    })}
                  </div>
                </div>
                <p className="text-sm text-purple-700">{t('worksheets.placeValue.whatDigit').replace('{{place}}', t(`worksheets.placeValue.${prob.place}`) || prob.place)} ________</p>
                <p className="text-xs text-slate-600 mt-1">{t('worksheets.placeValue.expandedForm')} ________</p>
              </div>
            )
          })}
        </div>
      </div>
    )
  },
  'interactive-math-time': (ctx) => {
    const { seed, doc, variant, t } = ctx
    const problems = buildMathTime(seed, doc.id, variant)
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-600">{t('worksheets.time.instructions')}</p>
        <div className="space-y-3">
          {problems.map((prob, idx) => {
            const hourAngle = (prob.hours % 12) * 30 + prob.minutes * 0.5
            const minuteAngle = prob.minutes * 6
            return (
              <div key={idx} className="rounded-xl border border-purple-200 bg-white p-4">
                <div className="flex items-start gap-4 mb-2">
                  <div className="relative w-20 h-20 flex-shrink-0">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <circle cx="50" cy="50" r="45" fill="white" stroke="currentColor" strokeWidth="2" className="text-purple-300"/>
                      {Array.from({ length: 12 }).map((_, i) => {
                        const angle = (i * 30 - 90) * Math.PI / 180
                        const x = 50 + 35 * Math.cos(angle)
                        const y = 50 + 35 * Math.sin(angle)
                        return <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="middle" className="text-xs fill-purple-700 font-semibold">{i || 12}</text>
                      })}
                      <line x1="50" y1="50" x2={50 + 25 * Math.cos((hourAngle - 90) * Math.PI / 180)} y2={50 + 25 * Math.sin((hourAngle - 90) * Math.PI / 180)} stroke="currentColor" strokeWidth="3" className="text-purple-800"/>
                      <line x1="50" y1="50" x2={50 + 35 * Math.cos((minuteAngle - 90) * Math.PI / 180)} y2={50 + 35 * Math.sin((minuteAngle - 90) * Math.PI / 180)} stroke="currentColor" strokeWidth="2" className="text-purple-600"/>
                      <circle cx="50" cy="50" r="3" fill="currentColor" className="text-purple-800"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-purple-800 mb-1">{t('worksheets.time.timeLabel')} {prob.hours}:{String(prob.minutes).padStart(2, '0')}</p>
                    <p className="text-sm text-slate-700 mb-2">{prob.question}</p>
                    <p className="text-sm text-purple-700">{t('worksheets.answerLabel')}: ________</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  },
  'interactive-math-graphing': (ctx) => {
    const { seed, doc, variant, t } = ctx
    const data = buildMathGraphing(seed, doc.id, variant)
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-600">{t('worksheets.graphing.instructions')}</p>
        <div className="rounded-xl border border-purple-200 bg-purple-50 p-4 mb-4">
          <p className="text-sm font-semibold text-purple-700 mb-2">{t('worksheets.graphing.data')}</p>
          <div className="space-y-1 text-sm">
            {data.categories.map((cat, idx) => (
              <p key={idx} className="text-purple-800">{cat}: {data.values[idx]}</p>
            ))}
          </div>
        </div>
        <div className="h-48 border border-purple-300 rounded bg-white">
          <p className="p-2 text-xs text-slate-500">{t('worksheets.graphing.drawHere')}</p>
        </div>
      </div>
    )
  },
  'interactive-math-rounding': (ctx) => {
    const { seed, doc, variant, t } = ctx
    const problems = buildMathRounding(seed, doc.id, variant)
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-600">{t('worksheets.rounding.instructions').replace('{{place}}', problems[0]?.roundTo || 'ten')}</p>
        <div className="space-y-3">
          {problems.map((prob, idx) => (
            <div key={idx} className="rounded-xl border border-purple-200 bg-white p-4">
              <p className="text-sm font-semibold text-purple-800">{prob.number} {t('worksheets.rounding.roundedTo')} {prob.roundTo} = ________</p>
            </div>
          ))}
        </div>
      </div>
    )
  },
  'interactive-math-decimals': (ctx) => {
    const { seed, doc, variant, t } = ctx
    const problems = buildMathDecimals(seed, doc.id, variant)
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-600">{t('worksheets.decimals.instructions')}</p>
        <div className="space-y-3">
          {problems.map((prob, idx) => (
            <div key={idx} className="rounded-xl border border-purple-200 bg-white p-4">
              <p className="text-sm font-semibold text-purple-800 mb-2">{prob.num1} {prob.op} {prob.num2} = ________</p>
              <div className="mt-2 h-12 border border-dashed border-purple-300 rounded bg-purple-50"></div>
            </div>
          ))}
        </div>
      </div>
    )
  },
  'interactive-math-integers': (ctx) => {
    const { seed, doc, variant, t } = ctx
    const problems = buildMathIntegers(seed, doc.id, variant)
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-600">{t('worksheets.integers.instructions')}</p>
        <div className="space-y-3">
          {problems.map((prob, idx) => (
            <div key={idx} className="rounded-xl border border-purple-200 bg-white p-4">
              <p className="text-sm font-semibold text-purple-800 mb-2">
                {prob.num1 < 0 ? `(${prob.num1})` : prob.num1} {prob.op} {prob.num2 < 0 ? `(${prob.num2})` : prob.num2} = ________
              </p>
              <div className="mt-2 h-12 border border-dashed border-purple-300 rounded bg-purple-50"></div>
            </div>
          ))}
        </div>
      </div>
    )
  },
  'interactive-math-exponents': (ctx) => {
    const { seed, doc, variant, t } = ctx
    const problems = buildMathExponents(seed, doc.id, variant)
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-600">Evaluate each exponent expression.</p>
        <div className="space-y-3">
          {problems.map((prob, idx) => (
            <div key={idx} className="rounded-xl border border-purple-200 bg-white p-4">
              <p className="text-sm font-semibold text-purple-800 mb-2">{prob.base}<sup>{prob.exponent}</sup> = ________</p>
              <p className="text-xs text-slate-600">Show your work: {prob.base} × {prob.base} × ... ({prob.exponent} times)</p>
              <div className="mt-2 h-12 border border-dashed border-purple-300 rounded bg-purple-50"></div>
            </div>
          ))}
        </div>
      </div>
    )
  },
  'interactive-reading-literary-analysis': (ctx) => {
    const { seed, doc, variant, t } = ctx
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
          {t('worksheets.readingLiterary.readAndAnalyze')}
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
  'interactive-reading-research': (ctx) => {
    const { seed, doc, variant, t } = ctx
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
              <p className="text-sm font-semibold text-blue-800 capitalize">{t('worksheets.readingVocab.topic')} {topic}</p>
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
  'interactive-writing-research': (ctx) => {
    const { seed, doc, variant, t } = ctx
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          Plan your research paper. Organize your research, create an outline, and plan citations.
        </p>
        <div className="space-y-4">
          <div className="rounded-xl border border-emerald-200 bg-white p-4">
            <p className="text-sm font-semibold text-emerald-800">{t('worksheets.readingResearch.researchTopic')}</p>
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
  'interactive-writing-essay': (ctx) => {
    const { seed, doc, variant, t } = ctx
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const prompts = pickMany(rng, [
      'Should students have homework on weekends?',
      'What is the most important quality in a friend?',
      'How does technology affect our daily lives?',
    ], 1)
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          {t('worksheets.writingEssay.writeStructuredEssay')}
        </p>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 mb-4">
          <p className="text-sm font-semibold text-emerald-900">{t('worksheets.writingEssay.prompt')} {prompts[0]}</p>
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
  'interactive-science-chemistry': (ctx) => {
    const { seed, doc, variant, t } = ctx
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
  'interactive-science-physics': (ctx) => {
    const { seed, doc, variant, t } = ctx
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
  'interactive-science-ecology': (ctx) => {
    const { seed, doc, variant, t } = ctx
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
  'interactive-geography-government': (ctx) => {
    const { seed, doc, variant, t } = ctx
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
  'interactive-geography-economics': (ctx) => {
    const { seed, doc, variant, t } = ctx
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
  'interactive-grammar-advanced': (ctx) => {
    const { seed, doc, variant, t } = ctx
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
          {t('worksheets.grammarAdvanced.identifyClauses')}
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
  'interactive-grammar-vocab': (ctx) => {
    const { seed, doc, variant, t } = ctx
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
  'interactive-writing-trace': (ctx) => {
    const { seed, doc, variant, t } = ctx
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
                <p className="text-xs text-green-600">{t('worksheets.writingTrace.write3Times')}</p>
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
  'interactive-writing-lowercase-trace': (ctx) => {
    const { seed, doc, variant, t } = ctx
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const lowercaseLetters = pickMany(rng, ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'], 6)
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-600">{t('worksheets.writingTrace.practiceTracing')}</p>
        <div className="grid gap-4 md:grid-cols-3">
          {lowercaseLetters.map((letter, idx) => (
            <div key={idx} className="rounded-xl border border-blue-200 bg-blue-50 p-4">
              <p className="text-sm font-semibold text-blue-700 mb-3 text-center">{t('worksheets.writingTrace.letter')} {letter}</p>
              <div className="space-y-3">
                <div className="bg-white rounded-lg p-3 border border-blue-200">
                  <p className="text-xs text-blue-600 mb-2 text-center">{t('worksheets.writingTrace.traceTheLetter')}</p>
                  <div className="flex items-center justify-center">
                    <span className="text-4xl text-blue-400 font-light" style={{ fontFamily: 'monospace' }}>{letter}</span>
                    <div className="ml-2 flex-1 h-10 border-2 border-dashed border-blue-300 bg-white rounded flex items-center justify-center">
                      <span className="text-xs text-blue-400">{t('worksheets.writingTrace.traceHere')}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-3 border border-blue-200">
                  <p className="text-xs text-blue-600 mb-2 text-center">{t('worksheets.writingTrace.write3Times')}</p>
                  <div className="flex gap-2">
                    <div className="flex-1 h-8 border border-dashed border-blue-300 bg-white rounded"></div>
                    <div className="flex-1 h-8 border border-dashed border-blue-300 bg-white rounded"></div>
                    <div className="flex-1 h-8 border border-dashed border-blue-300 bg-white rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 mt-4">
          <p className="text-sm font-semibold text-blue-700 mb-2">{t('worksheets.writingTrace.practiceAllLetters')}</p>
          <p className="text-xs text-blue-600 mb-3">{t('worksheets.writingTrace.writeEntireAlphabet')}</p>
          <div className="bg-white rounded-lg p-3 border border-blue-200">
            <div className="flex flex-wrap gap-2">
              {['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'].map((ltr, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1">
                  <span className="text-base text-blue-800 font-bold leading-none">{ltr}</span>
                  <div className="h-7 w-7 border-2 border-dashed border-blue-400 rounded bg-white"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  },
  'interactive-writing-pictures': (ctx) => {
    const { seed, doc, variant, t } = ctx
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const prompts = pickMany(rng, [
      { picture: 'A sunny day at the park', question: 'What do you see?' },
      { picture: 'A family having dinner', question: 'What are they doing?' },
      { picture: 'Children playing together', question: 'How do they feel?' },
      { picture: 'A garden with flowers', question: 'What colors do you see?' },
    ], 4)
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-600">{t('worksheets.writingPictures.instructions')}</p>
        <div className="grid gap-4 md:grid-cols-2">
          {prompts.map((prompt, idx) => (
            <div key={idx} className="rounded-xl border border-blue-200 bg-blue-50 p-4">
              <p className="text-sm font-semibold text-blue-700 mb-2">{prompt.picture}</p>
              <div className="mt-2 h-24 rounded border border-dashed border-blue-300 bg-white"><p className="p-2 text-xs text-blue-600">{t('worksheets.writingPictures.drawPicture')}</p></div>
              <p className="mt-2 text-xs text-blue-700">{prompt.question}</p>
              <div className="mt-1 h-12 rounded border border-dashed border-blue-300 bg-white"></div>
              <p className="mt-2 text-xs text-blue-600">{t('worksheets.writingPictures.writeSentence')}</p>
              <div className="mt-1 h-10 rounded border border-dashed border-blue-300 bg-white"></div>
            </div>
          ))}
        </div>
      </div>
    )
  },
  'interactive-writing-narrative': (ctx) => {
    const { seed, doc, variant, t } = ctx
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const storyStarters = pickMany(rng, ['One sunny morning, I discovered...', 'The magic door opened and...', 'When I looked in the mirror, I saw...', 'The old tree in the backyard began to...'], 2)
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-600">{t('worksheets.writingNarrative.instructions')}</p>
        <div className="rounded-xl border border-purple-200 bg-purple-50 p-4 mb-4">
          <p className="text-sm font-semibold text-purple-700 mb-2">{t('worksheets.writingNarrative.storyStarters')}</p>
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
  'interactive-writing-informative': (ctx) => {
    const { seed, doc, variant, t } = ctx
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const topics = pickMany(rng, ['How plants grow', 'The life cycle of a butterfly', 'How to care for a pet', 'The water cycle'], 1)
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-600">{t('worksheets.writingInformative.instructions')}</p>
        <div className="rounded-xl border border-teal-200 bg-teal-50 p-4 mb-4">
          <p className="text-sm font-semibold text-teal-900">{t('worksheets.writingInformative.topic')} {topics[0]}</p>
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
  'interactive-writing-argumentative': (ctx) => {
    const { seed, doc, variant, t } = ctx
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
  'interactive-reading-alphabet': (ctx) => {
    const { seed, doc, variant, t } = ctx
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const letters = pickMany(rng, ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'], 6)
    const beginningSounds = pickMany(rng, [{ letter: 'B', words: ['ball', 'book', 'bus'] }, { letter: 'C', words: ['cat', 'car', 'cup'] }, { letter: 'D', words: ['dog', 'door', 'duck'] }, { letter: 'F', words: ['fish', 'fan', 'flower'] }, { letter: 'M', words: ['moon', 'mouse', 'map'] }, { letter: 'S', words: ['sun', 'star', 'snake'] }], 4)
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-600">{t(`interactive.${doc.id}.description`) || t('worksheets.earlyPhonics.instructions')}</p>
        <div className="grid gap-4 md:grid-cols-3">
          {letters.map((letter, idx) => (
            <div key={idx} className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-center">
              <p className="text-3xl font-bold text-blue-700 mb-2">{letter}</p>
              <p className="text-xl text-blue-600 mb-2">{letter.toLowerCase()}</p>
              <div className="mt-2 flex gap-2 justify-center">
                <div className="h-8 w-8 border border-dashed border-blue-300 bg-white rounded"></div>
                <div className="h-8 w-8 border border-dashed border-blue-300 bg-white rounded"></div>
              </div>
              <p className="text-xs text-blue-600 mt-2">{t('worksheets.circleThe').replace('{{letter}}', letter)}</p>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
          <p className="text-sm font-semibold text-blue-700 mb-2">{t('worksheets.beginningSounds')}</p>
          <div className="grid gap-3 md:grid-cols-2">
            {beginningSounds.map((item, idx) => (
              <div key={idx} className="bg-white rounded border border-blue-200 p-3">
                <p className="text-sm font-semibold text-blue-800 mb-1">{item.letter} {t('worksheets.says')} /{item.letter.toLowerCase()}/</p>
                <div className="flex gap-2 flex-wrap">
                  {item.words.map((word, wIdx) => (
                    <span key={wIdx} className="text-xs px-2 py-1 bg-blue-100 rounded border border-blue-300 text-blue-700">{word}</span>
                  ))}
                </div>
                <p className="text-xs text-blue-600 mt-2">{t('worksheets.circleWordsStart')} {item.letter}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  },
  'interactive-reading-sightwords': (ctx) => {
    const { seed, doc, variant, t, language } = ctx
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    // Get language-specific sight words from translations
    const allSightWords = getTranslation(language, 'worksheets.readingSightwords.words') as string[] || []
    const sightWords = pickMany(rng, allSightWords, 8)
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-600">{t('worksheets.readingSightwords.instructions')}</p>
        <div className="grid gap-3 md:grid-cols-4">
          {sightWords.map((word, idx) => (
            <div key={idx} className="rounded-xl border border-indigo-200 bg-indigo-50 p-3 text-center">
              <p className="text-lg font-bold text-indigo-700 mb-2">{word}</p>
              <div className="h-8 border border-dashed border-indigo-300 bg-white rounded mb-1"></div>
              <p className="text-xs text-indigo-600">{t('worksheets.readingSightwords.writeIt3Times')}</p>
              <div className="flex gap-1 mt-1">
                <div className="flex-1 h-6 border border-dashed border-indigo-300 bg-white rounded"></div>
                <div className="flex-1 h-6 border border-dashed border-indigo-300 bg-white rounded"></div>
                <div className="flex-1 h-6 border border-dashed border-indigo-300 bg-white rounded"></div>
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4">
          <p className="text-sm font-semibold text-indigo-700 mb-2">{t('worksheets.readingSightwords.useInSentences')}</p>
          <div className="space-y-2">
            {sightWords.slice(0, 3).map((word, idx) => (
              <div key={idx} className="bg-white rounded border border-indigo-200 p-2">
                <p className="text-xs text-indigo-700 mb-1">{t('worksheets.readingSightwords.writeSentenceWith').replace('{{word}}', word)}</p>
                <div className="h-10 border border-dashed border-indigo-300 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  },
  'interactive-reading-fluency': (ctx) => {
    const { seed, doc, variant, t } = ctx
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
  'interactive-reading-character': (ctx) => {
    const { seed, doc, variant, t } = ctx
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
  'interactive-science-senses': (ctx) => {
    const { seed, doc, variant, t } = ctx
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const senses = ['sight', 'hearing', 'touch', 'taste', 'smell']
    const senseVerbs: Record<string, string> = {
      'sight': 'see',
      'hearing': 'hear',
      'touch': 'touch',
      'taste': 'taste',
      'smell': 'smell'
    }
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
        <div className="grid gap-3 md:grid-cols-2">
          {senses.map((sense, idx) => (
            <div key={idx} className="rounded-xl border border-green-200 bg-green-50 p-4">
              <p className="text-sm font-semibold text-green-700 capitalize mb-2">{sense}</p>
              <div className="mt-2 h-16 rounded border border-green-300 bg-white">
                <p className="p-2 text-xs text-green-600">Draw something you {senseVerbs[sense]}</p>
              </div>
              <p className="mt-2 text-xs text-green-600">What do you {senseVerbs[sense]}? ________________</p>
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
  'interactive-science-plants': (ctx) => {
    const { seed, doc, variant, t } = ctx
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
  'interactive-science-animals': (ctx) => {
    const { seed, doc, variant, t } = ctx
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
  'interactive-geography-seasons': (ctx) => {
    const { seed, doc, variant, t } = ctx
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
  'interactive-geography-places': (ctx) => {
    const { seed, doc, variant, t } = ctx
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
  'interactive-geography-continents': (ctx) => {
    const { seed, doc, variant, t } = ctx
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
  'interactive-grammar-rhyming': (ctx) => {
    const { seed, doc, variant, t } = ctx
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const wordGroups = pickMany(rng, [
      { word: 'cat', rhymes: ['hat', 'bat', 'sat'] },
      { word: 'dog', rhymes: ['log', 'fog', 'jog'] },
      { word: 'sun', rhymes: ['fun', 'run', 'bun'] },
      { word: 'tree', rhymes: ['bee', 'see', 'me'] },
    ], 4)
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-600">{t('worksheets.grammarRhyming.instructions')}</p>
        <div className="grid gap-3 md:grid-cols-2">
          {wordGroups.map((group, idx) => (
            <div key={idx} className="rounded-xl border border-purple-200 bg-purple-50 p-4">
              <p className="text-sm font-semibold text-purple-700 mb-2">{t('worksheets.grammarRhyming.word')} {group.word}</p>
              <p className="text-xs text-purple-600 mb-2">{t('worksheets.grammarRhyming.rhymingWords')}</p>
              <div className="flex flex-wrap gap-2 mb-2">
                {group.rhymes.map((rhyme, rIdx) => (
                  <span key={rIdx} className="text-xs px-2 py-1 bg-purple-100 rounded border border-purple-300 text-purple-700">{rhyme}</span>
                ))}
              </div>
              <div className="h-8 border border-dashed border-purple-300 bg-white rounded"></div>
              <p className="text-xs text-purple-600 mt-2">{t('worksheets.grammarRhyming.writeAnotherWord')}</p>
            </div>
          ))}
        </div>
      </div>
    )
  },
  'interactive-grammar-capitalization': (ctx) => {
    const { seed, doc, variant, t } = ctx
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
  'interactive-grammar-plurals': (ctx) => {
    const { seed, doc, variant, t } = ctx
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
  'interactive-art-shapes': (ctx) => {
    const { seed, doc, variant, t } = ctx
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
  'interactive-art-patterns': (ctx) => {
    const { seed, doc, variant, t } = ctx
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
  'interactive-art-perspective': (ctx) => {
    const { seed, doc, variant, t } = ctx
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
  'interactive-art-color-by-number': (ctx) => {
    const { seed, doc, variant, t } = ctx
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const colorCodes = [
      { num: 1, color: 'red', emoji: '🔴', bgColor: 'bg-red-500' },
      { num: 2, color: 'blue', emoji: '🔵', bgColor: 'bg-blue-500' },
      { num: 3, color: 'green', emoji: '🟢', bgColor: 'bg-green-500' },
      { num: 4, color: 'yellow', emoji: '🟡', bgColor: 'bg-yellow-400' },
      { num: 5, color: 'purple', emoji: '🟣', bgColor: 'bg-purple-500' },
      { num: 6, color: 'orange', emoji: '🟠', bgColor: 'bg-orange-500' },
    ]
    const selectedCodes = pickMany(rng, colorCodes, 4)
    const designs = pickMany(rng, ['butterfly', 'flower', 'star', 'heart', 'rainbow', 'tree'], 1)
    return (
      <div className="space-y-4">
        <p className="text-base font-semibold text-pink-800">Color the picture using the number codes below. Match each number to its color!</p>
        <div className="rounded-xl border-2 border-pink-300 bg-gradient-to-br from-pink-100 via-purple-100 to-fuchsia-100 p-6 shadow-lg">
          <p className="text-lg font-bold text-pink-800 mb-4 flex items-center gap-2">
            <span className="text-2xl">🎨</span>
            <span>Color Key:</span>
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {selectedCodes.map((code) => (
              <div key={code.num} className={`flex items-center gap-3 bg-white rounded-xl border-2 border-pink-300 p-4 shadow-md hover:shadow-lg transition-shadow ${code.bgColor} bg-opacity-10`}>
                <span className="text-3xl">{code.emoji}</span>
                <div>
                  <p className="text-lg font-bold text-pink-900">{code.num} = {code.color}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="h-80 rounded-xl border-4 border-pink-300 bg-gradient-to-br from-white to-pink-50 flex items-center justify-center shadow-inner">
            <div className="text-center">
              <p className="text-6xl mb-4">🎨</p>
              <p className="text-pink-700 text-lg font-bold">Draw a {designs[0]} design with numbers 1-{selectedCodes.length}</p>
              <p className="text-pink-600 text-sm mt-2">Use the color key above!</p>
            </div>
          </div>
          <p className="mt-4 text-center text-base font-semibold text-pink-800 bg-white/80 rounded-lg p-3 border-2 border-pink-200">
            ✨ Color each section according to the number code!
          </p>
        </div>
      </div>
    )
  },
  'interactive-art-mandala': (ctx) => {
    const { seed, doc, variant, t } = ctx
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const patterns = pickMany(rng, ['circles', 'petals', 'geometric', 'spiral'], 1)
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-600">Create a beautiful mandala design with {patterns[0]} patterns. Focus on symmetry and mindfulness.</p>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-pink-200 bg-pink-50 p-4">
            <p className="text-sm font-semibold text-pink-700 mb-2">Mandala Template</p>
            <div className="h-64 rounded border-2 border-pink-300 bg-white flex items-center justify-center">
              <div className="text-center">
                <p className="text-4xl mb-2">⭕</p>
                <p className="text-xs text-pink-600">Draw your mandala here</p>
              </div>
            </div>
            <p className="mt-2 text-xs text-pink-600">Start from the center and work outward. Use patterns and symmetry!</p>
          </div>
          <div className="rounded-xl border border-pink-200 bg-pink-50 p-4">
            <p className="text-sm font-semibold text-pink-700 mb-2">Pattern Ideas:</p>
            <ul className="space-y-2 text-xs text-pink-700">
              <li>• Circles and dots</li>
              <li>• Petals and flowers</li>
              <li>• Geometric shapes</li>
              <li>• Spiral patterns</li>
              <li>• Lines and curves</li>
            </ul>
            <p className="mt-4 text-xs text-pink-600">{t('worksheets.reflection.mandalaQuestion')}</p>
            <div className="mt-2 h-16 rounded border border-dashed border-pink-300 bg-white"></div>
          </div>
        </div>
      </div>
    )
  },
  'interactive-art-doodle': (ctx) => {
    const { seed, doc, variant, t } = ctx
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const prompts = pickMany(rng, [
      'Doodle your favorite animal',
      'Create patterns with lines',
      'Draw shapes that connect',
      'Make a zentangle design',
      'Doodle things that make you happy',
      'Create a border pattern',
    ], 3)
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-600">Free-form doodling! No rules, just creativity. Let your imagination flow.</p>
        <div className="grid gap-4 md:grid-cols-3">
          {prompts.map((prompt, idx) => (
            <div key={idx} className="rounded-xl border border-purple-200 bg-purple-50 p-4">
              <p className="text-sm font-semibold text-purple-700 mb-2">{prompt}</p>
              <div className="h-40 rounded border-2 border-dashed border-purple-300 bg-white flex items-center justify-center">
                <p className="text-xs text-purple-500">Doodle here!</p>
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-lg border border-purple-200 bg-purple-50 px-4 py-3 text-xs text-purple-700">
          💡 Tip: There are no mistakes in doodling! Just keep your pen moving and see what emerges.
        </div>
      </div>
    )
  },
  'interactive-art-seasonal': (ctx) => {
    const { seed, doc, variant, t } = ctx
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const seasons = pickMany(rng, [
      { name: 'Spring', themes: ['flowers', 'butterflies', 'rainbows'], emoji: '🌸' },
      { name: 'Summer', themes: ['sun', 'beach', 'ice cream'], emoji: '☀️' },
      { name: 'Fall', themes: ['leaves', 'pumpkins', 'apples'], emoji: '🍂' },
      { name: 'Winter', themes: ['snowflakes', 'snowman', 'mittens'], emoji: '❄️' },
    ], 2)
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-600">Color these seasonal pictures! Each season has its own special themes and colors.</p>
        <div className="grid gap-4 md:grid-cols-2">
          {seasons.map((season, idx) => (
            <div key={idx} className="rounded-xl border border-green-200 bg-green-50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{season.emoji}</span>
                <p className="text-sm font-semibold text-green-700">{season.name} Coloring</p>
              </div>
              <p className="text-xs text-green-600 mb-2">Themes: {season.themes.join(', ')}</p>
              <div className="h-48 rounded border-2 border-green-300 bg-white flex items-center justify-center">
                <div className="text-center">
                  <p className="text-3xl mb-2">{season.emoji}</p>
                  <p className="text-xs text-green-600">Draw and color a {season.name.toLowerCase()} scene!</p>
                </div>
              </div>
              <p className="mt-2 text-xs text-green-600 text-center">Use colors that remind you of {season.name.toLowerCase()}!</p>
            </div>
          ))}
        </div>
      </div>
    )
  },
  'interactive-art-comic': (ctx) => {
    const { seed, doc, variant, t } = ctx
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const panelCount = pick(rng, [3, 4, 6])
    const themes = pickMany(rng, ['adventure', 'friendship', 'superhero', 'animals', 'school'], 1)
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-600">Create your own comic strip! Tell a story with pictures, speech bubbles, and action.</p>
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
          <p className="text-sm font-semibold text-blue-700 mb-2">Comic Strip: {themes[0]} story</p>
          <div className={`grid gap-2 ${panelCount === 3 ? 'grid-cols-3' : panelCount === 4 ? 'grid-cols-4' : 'grid-cols-3'}`}>
            {Array.from({ length: panelCount }).map((_, idx) => (
              <div key={idx} className="border-2 border-blue-300 bg-white rounded p-2">
                <div className="h-32 rounded border border-dashed border-blue-200 mb-1">
                  <p className="text-xs text-blue-500 p-1">Panel {idx + 1}</p>
                </div>
                <div className="h-8 rounded border border-dashed border-blue-200 bg-blue-50">
                  <p className="text-xs text-blue-400 p-1">💬 Speech bubble</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 rounded border border-blue-200 bg-white p-3">
            <p className="text-xs font-semibold text-blue-700 mb-1">Story Elements:</p>
            <ul className="text-xs text-blue-600 space-y-1">
              <li>• Characters: ________________</li>
              <li>• Setting: ________________</li>
              <li>• Problem/Conflict: ________________</li>
              <li>• Solution: ________________</li>
            </ul>
          </div>
        </div>
      </div>
    )
  },
  'interactive-art-critique': (ctx) => {
    const { seed, doc, variant, t } = ctx
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const artElements = pickMany(rng, ['line', 'color', 'shape', 'texture', 'space', 'form'], 4)
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-600">Observe and analyze artwork using art vocabulary. Look closely and describe what you see.</p>
        <div className="rounded-xl border border-purple-200 bg-purple-50 p-4">
          <p className="text-sm font-semibold text-purple-700 mb-3">Artwork Analysis</p>
          <div className="h-48 rounded border-2 border-purple-300 bg-white flex items-center justify-center mb-3">
            <p className="text-purple-600 text-sm">[Artwork image or description]</p>
          </div>
          <div className="space-y-2 text-sm">
            {artElements.map((element, idx) => (
              <div key={idx} className="bg-white rounded border border-purple-200 p-2">
                <p className="text-xs font-semibold text-purple-700 capitalize mb-1">{element}:</p>
                <p className="text-xs text-purple-600">Describe how {element} is used: ________________________________</p>
              </div>
            ))}
          </div>
          <div className="mt-3 rounded border border-purple-200 bg-white p-3">
            <p className="text-xs font-semibold text-purple-700 mb-1">Overall Impression:</p>
            <p className="text-xs text-purple-600">What does this artwork make you think or feel? ________________</p>
          </div>
        </div>
      </div>
    )
  },
  'interactive-logic-matching': (ctx) => {
    const { seed, doc, variant, t } = ctx
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
  'interactive-logic-classification': (ctx) => {
    const { seed, doc, variant, t } = ctx
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
  'interactive-logic-analogies': (ctx) => {
    const { seed, doc, variant, t } = ctx
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
  'interactive-sel-friendship': (ctx) => {
    const { seed, doc, variant, t } = ctx
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
  'interactive-sel-gratitude': (ctx) => {
    const { seed, doc, variant, t } = ctx
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
  'interactive-math-race': (ctx) => {
    const { doc, seed, variant, formatNum } = ctx
    const problems = buildMathRace(seed, doc.id, variant)
    return (
      <div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
        {problems.map((prob, idx) => (
          <div key={idx} className="rounded border border-emerald-200 bg-white px-3 py-2 font-semibold text-emerald-800">
            {formatNum(prob.first)} {prob.op} {formatNum(prob.second)} = {formatNum(prob.answer)}
          </div>
        ))}
      </div>
    )
  },
  'interactive-math-puzzle': (ctx) => {
    const { doc, seed, variant, t, formatNum } = ctx
    const puzzles = buildMathPuzzle(seed, doc.id, variant)
    return (
      <ol className="list-decimal list-inside space-y-2">
        {puzzles.map((puzzle, idx) => (
          <li key={idx}>
            <span className="font-semibold">{t('worksheets.mathPuzzle.answerLabel').replace('{{number}}', formatNum(idx + 1))}:</span> {formatNum(puzzle.answer)}
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
  'interactive-reading-prek': (ctx) => {
    const { doc, seed, variant, t } = ctx
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const stories = [
      { titleKey: 'redCar', title: t('worksheets.readingPrek.storyTitles.redCar'), questions: [
        { key: 'seeCar', text: t('worksheets.readingPrek.questions.seeCar') },
        { key: 'carOnRoad', text: t('worksheets.readingPrek.questions.carOnRoad') }
      ]},
      { titleKey: 'sunnyDay', title: t('worksheets.readingPrek.storyTitles.sunnyDay'), questions: [
        { key: 'seeSun', text: t('worksheets.readingPrek.questions.seeSun') },
        { key: 'thereFlower', text: t('worksheets.readingPrek.questions.thereFlower') }
      ]},
      { titleKey: 'bigTree', title: t('worksheets.readingPrek.storyTitles.bigTree'), questions: [
        { key: 'treeBig', text: t('worksheets.readingPrek.questions.treeBig') },
        { key: 'seeHouse', text: t('worksheets.readingPrek.questions.seeHouse') }
      ]},
    ]
    return (
      <ul className="space-y-2 text-sm">
        {stories.map((story, idx) => (
          <li key={idx}>
            <span className="font-semibold">{story.title}:</span>
            <ul className="ml-4 mt-1 list-disc space-y-1">
              {story.questions.map((q, qIdx) => (
                <li key={qIdx}>{q.text} - {t('worksheets.answerKey.acceptYesNo')}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    )
  },
  'interactive-writing-prek': ({ doc, seed, variant, t }) => {
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const wordKeys = ['cat', 'dog', 'sun', 'car', 'tree', 'flower']
    const selectedKeys = pickMany(rng, wordKeys, 4)
    const prompts = selectedKeys.map(key => ({
      word: key,
      picture: t(`worksheets.writingPrek.drawPrompts.${key}`),
    }))
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
  'interactive-science-prek': (ctx) => {
    const { doc, seed, variant, t } = ctx
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const observations = pickMany(
      rng,
      [
        { topicKey: 'plants', topic: t('worksheets.sciencePrek.topics.plants'), questionKey: 'whatPlantsNeed', question: t('worksheets.sciencePrek.questions.whatPlantsNeed'), options: ['water', 'sun', 'soil'] },
        { topicKey: 'animals', topic: t('worksheets.sciencePrek.topics.animals'), questionKey: 'whereAnimalsLive', question: t('worksheets.sciencePrek.questions.whereAnimalsLive'), options: ['forest', 'ocean', 'farm'] },
        { topicKey: 'weather', topic: t('worksheets.sciencePrek.topics.weather'), questionKey: 'whatWeatherLike', question: t('worksheets.sciencePrek.questions.whatWeatherLike'), options: ['sunny', 'rainy', 'cloudy'] },
        { topicKey: 'seasons', topic: t('worksheets.sciencePrek.topics.seasons'), questionKey: 'whatSeason', question: t('worksheets.sciencePrek.questions.whatSeason'), options: ['spring', 'summer', 'fall', 'winter'] },
      ],
      3
    )
    return (
      <ul className="space-y-2 text-sm">
        {observations.map((obs, idx) => (
          <li key={idx}>
            <span className="font-semibold">{obs.topic}:</span> {obs.question} - {t('worksheets.answerKey.acceptYesNo')}
          </li>
        ))}
      </ul>
    )
  },
  'interactive-science-space': (ctx) => {
    const { doc, seed, variant, t } = ctx
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
            <span className="font-semibold">{planet.name}:</span> {planet.fact}. {t('worksheets.scienceSpace.distanceFromSun')} {planet.distance}. {t('worksheets.answerKey.studentsShould')} {t('worksheets.answerKey.drawPicture')} {planet.name} {t('worksheets.answerKey.lookAtPictures')}.
          </li>
        ))}
        <li className="mt-2 text-emerald-800">{t('worksheets.scienceSpace.spaceQuestions')}: {t('worksheets.scienceSpace.whatIsStar')} {t('worksheets.answerKey.studentsShould')} {t('worksheets.answerKey.drawPicture')}.</li>
      </ul>
    )
  },
  'interactive-geography-prek': (ctx) => {
    const { doc, seed, variant, t } = ctx
    const rng = makeRng(`${seed}|${doc.id}|${variant}`)
    const places = pickMany(
      rng,
      [
        { name: 'Home', typeKey: 'whereILive', type: t('worksheets.geographyPrek.placeTypes.whereILive'), features: ['bedroom', 'kitchen'] },
        { name: 'School', typeKey: 'whereILearn', type: t('worksheets.geographyPrek.placeTypes.whereILearn'), features: ['classroom', 'playground'] },
        { name: 'Park', typeKey: 'whereIPlay', type: t('worksheets.geographyPrek.placeTypes.whereIPlay'), features: ['swings', 'slides'] },
      ],
      3
    )
    return (
      <ul className="space-y-2 text-sm">
        {places.map((place, idx) => (
          <li key={idx}>
            <span className="font-semibold">{place.name}:</span> {place.type}. {t('worksheets.answerKey.studentsShould')} {t('worksheets.geographyPrek.drawSimpleMap')} {place.features.join(', ')}.
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
  'interactive-cognitive-memory': ({ doc, seed, variant }) => {
    return (
      <div className="space-y-2 text-sm">
        <p><span className="font-semibold">Working Memory:</span> Students should recall sequences accurately. Check for correct order and items.</p>
        <p className="text-emerald-800">Note: Answers will vary based on generated sequences. Focus on accuracy of recall and order rather than exact matches.</p>
      </div>
    )
  },
  'interactive-cognitive-attention': ({ doc, seed, variant }) => {
    return (
      <div className="space-y-2 text-sm">
        <p><span className="font-semibold">Attention & Focus:</span> Students should correctly identify target items in visual scanning and spot differences between images.</p>
        <p className="text-emerald-800">Note: Visual scanning answers depend on generated grid. Spot-the-difference answers should identify the specific differences described (e.g., number of trees, color of collar, number of windows).</p>
      </div>
    )
  },
  'interactive-cognitive-executive': ({ doc, seed, variant }) => {
    return (
      <div className="space-y-2 text-sm">
        <p><span className="font-semibold">Executive Function:</span> Students should demonstrate planning skills by breaking tasks into steps and organizing them into a schedule.</p>
        <p className="text-emerald-800">Note: Answers will vary. Look for logical step sequences, appropriate task prioritization, and realistic scheduling. Focus on planning and organization skills rather than specific answers.</p>
      </div>
    )
  },
  'interactive-cognitive-processing': ({ doc, seed, variant }) => {
    return (
      <div className="space-y-2 text-sm">
        <p><span className="font-semibold">Processing Speed:</span> Students should quickly identify target symbols and words. Speed and accuracy both matter.</p>
        <p className="text-emerald-800">Note: Answers depend on generated content. For symbol recognition, count all star symbols (★). For word identification, count words starting with "b". Encourage students to track their time and improve speed.</p>
      </div>
    )
  },
  'interactive-cognitive-visual': (ctx) => {
    const { t } = ctx
    return (
      <div className="space-y-2 text-sm">
        <p><span className="font-semibold">{t('worksheets.cognitiveVisual.visualPatternMatching')}:</span> {t('worksheets.answerKey.studentsShould')} {t('worksheets.answerKey.visualProcessingAnswer')}</p>
        <p className="text-emerald-800">{t('worksheets.answerKey.visualProcessingNote')}</p>
      </div>
    )
  },
  'interactive-cognitive-flexibility': ({ doc, seed, variant }) => {
    return (
      <div className="space-y-2 text-sm">
        <p><span className="font-semibold">Cognitive Flexibility:</span> Students should demonstrate ability to switch between tasks and consider multiple perspectives.</p>
        <p className="text-emerald-800">Note: Answers will vary. For task switching, look for completion of both rules. For perspective-taking, check that students consider different viewpoints and propose solutions that work for multiple parties.</p>
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
  'interactive-math-counting': (ctx) => {
    const { doc, seed, variant, t, formatNum } = ctx
    const problems = buildMathCounting(seed, doc.id, variant)
    return (
      <div className="space-y-2">
        <ol className="list-decimal list-inside space-y-2 text-sm">
          {problems.map((prob, idx) => {
            const objectName = t(`worksheets.objectNames.${prob.objects[0]}`) || prob.objects[0]
            return (
              <li key={idx} className="mb-3">
                <span className="font-semibold">{t('worksheets.countThe').replace('{{object}}', objectName)}:</span> <span className="text-emerald-700 font-bold">{formatNum(prob.number)}</span>
                <p className="text-xs text-slate-600 mt-1 ml-4">{t('worksheets.countingTeachingNote')}</p>
              </li>
            )
          })}
        </ol>
      </div>
    )
  },
  'interactive-math-tens-frames': ({ doc, seed, variant }) => {
    const problems = buildMathTensFrames(seed, doc.id, variant)
    return (
      <div className="space-y-2">
        <ol className="list-decimal list-inside space-y-2 text-sm">
          {problems.map((prob, idx) => {
            const total = prob.filled + prob.missing
            const answer = prob.operation === '+' ? total : prob.filled
            return (
              <li key={idx} className="mb-3">
                <span className="font-semibold">Problem {idx + 1}:</span> {prob.operation === '+' ? `${prob.filled} + ${prob.missing}` : `${total} - ${prob.missing}`} = <span className="text-emerald-700 font-bold">{answer}</span>
                <p className="text-xs text-slate-600 mt-1 ml-4">
                  {prob.operation === '+' 
                    ? `Strategy: Start with ${prob.filled} filled boxes. Count on ${prob.missing} more to reach ${total}. Use the tens frame to visualize: fill ${prob.missing} empty boxes.`
                    : `Strategy: Start with ${total} filled boxes. Remove ${prob.missing} boxes. Count how many remain: ${prob.filled}. This shows subtraction as "taking away."`}
                </p>
              </li>
            )
          })}
        </ol>
      </div>
    )
  },
  'interactive-math-multiplication': ({ doc, seed, variant }) => {
    const problems = buildMathMultiplication(seed, doc.id, variant)
    return (
      <div className="space-y-2">
        <ol className="list-decimal list-inside space-y-2 text-sm">
          {problems.map((prob, idx) => (
            <li key={idx} className="mb-3">
              <span className="font-semibold">Problem {idx + 1}:</span> {prob.factor1} × {prob.factor2} = <span className="text-emerald-700 font-bold">{prob.answer}</span>
              <p className="text-xs text-slate-600 mt-1 ml-4">
                <span className="font-semibold">Solution:</span> Draw an array with {prob.arrayRows} rows and {prob.arrayCols} columns. Count all the objects: {prob.arrayRows} groups of {prob.arrayCols} = {prob.answer}. 
                <span className="block mt-1">Alternative strategies: Skip count by {prob.factor2}, {prob.factor2} times. Or use repeated addition: {prob.factor2} + {prob.factor2} + ... ({prob.arrayRows} times) = {prob.answer}.</span>
              </p>
            </li>
          ))}
        </ol>
      </div>
    )
  },
  'interactive-math-division': ({ doc, seed, variant }) => {
    const problems = buildMathDivision(seed, doc.id, variant)
    return (
      <div className="space-y-2">
        <ol className="list-decimal list-inside space-y-2 text-sm">
          {problems.map((prob, idx) => (
            <li key={idx} className="mb-3">
              <span className="font-semibold">Problem {idx + 1}:</span> {prob.dividend} ÷ {prob.divisor} = <span className="text-emerald-700 font-bold">{prob.quotient}</span>
              {prob.remainder > 0 && <span className="text-emerald-700"> (remainder: {prob.remainder})</span>}
              <p className="text-xs text-slate-600 mt-1 ml-4">
                <span className="font-semibold">Solution:</span> Divide {prob.dividend} into groups of {prob.divisor}. You can make {prob.quotient} complete groups.
                {prob.remainder > 0 ? ` There are ${prob.remainder} left over that don't make a complete group.` : ' All items are grouped evenly.'}
                <span className="block mt-1">Strategy: Use repeated subtraction ({prob.dividend} - {prob.divisor} - {prob.divisor} - ...) or think "How many {prob.divisor}s fit into {prob.dividend}?"</span>
              </p>
            </li>
          ))}
        </ol>
      </div>
    )
  },
  'interactive-math-place-value': (ctx) => {
    const { doc, seed, variant, t, formatNum, language } = ctx
    const problems = buildMathPlaceValue(seed, doc.id, variant)
    return (
      <div className="space-y-2">
        <ol className="list-decimal list-inside space-y-2 text-sm">
          {problems.map((prob, idx) => {
            const numStr = String(prob.number)
            const placeOrder = ['ones', 'tens', 'hundreds', 'thousands']
            const placeName = t(`worksheets.placeValue.${prob.place}`) || prob.place
            const expandedForm = numStr.split('').reverse().map((digit, i) => {
              const place = placeOrder[i] || ''
              const formattedDigit = language === 'ar' ? formatNum(parseInt(digit, 10)) : digit
              const power = Math.pow(10, i)
              const formattedPower = formatNum(power)
              return `${formattedDigit} × ${formattedPower}`
            }).reverse().join(' + ')
            const formattedNumber = formatNum(prob.number)
            const formattedDigit = formatNum(prob.digit)
            const formattedProblemNum = formatNum(idx + 1)
            return (
              <li key={idx} className="mb-3">
                <span className="font-semibold">{t('common.problem', 'Problem')} {formattedProblemNum}:</span> {formattedNumber}: {placeName} {t('common.place', 'place')} = <span className="text-emerald-700 font-bold">{formattedDigit}</span>
                <p className="text-xs text-slate-600 mt-1 ml-4">
                  <span className="font-semibold">{t('common.explanation', 'Explanation')}:</span> {t('worksheets.placeValue.explanation', 'In the number {{number}}, read from right to left: ones place, tens place, hundreds place, etc. The digit in the {{place}} place is {{digit}}.').replace('{{number}}', formattedNumber).replace('{{place}}', placeName).replace('{{digit}}', formattedDigit)}
                  <span className="block mt-1"><span className="font-semibold">{t('worksheets.placeValue.expandedForm')}:</span> {expandedForm} = {formattedNumber}</span>
                </p>
              </li>
            )
          })}
        </ol>
      </div>
    )
  },
  'interactive-math-time': ({ doc, seed, variant }) => {
    const problems = buildMathTime(seed, doc.id, variant)
    return (
      <div className="space-y-2">
        <ol className="list-decimal list-inside space-y-2 text-sm">
          {problems.map((prob, idx) => {
            const [startHours, startMins] = [prob.hours, prob.minutes]
            const elapsedMatch = prob.question.match(/(\d+)\s+hour.*?(\d+)\s+minute/)
            const elapsedHours = elapsedMatch ? parseInt(elapsedMatch[1]) : 0
            const elapsedMinutes = elapsedMatch ? parseInt(elapsedMatch[2]) : 0
            return (
              <li key={idx} className="mb-3">
                <span className="font-semibold">Problem {idx + 1}:</span> {prob.question} Answer: <span className="text-emerald-700 font-bold">{prob.answer}</span>
                <p className="text-xs text-slate-600 mt-1 ml-4">
                  <span className="font-semibold">Solution:</span> Start time: {startHours}:{String(startMins).padStart(2, '0')}. Add {elapsedHours} hour{elapsedHours !== 1 ? 's' : ''} and {elapsedMinutes} minute{elapsedMinutes !== 1 ? 's' : ''}.
                  <span className="block mt-1">Step 1: Add minutes: {startMins} + {elapsedMinutes} = {(startMins + elapsedMinutes) % 60} (carry over {Math.floor((startMins + elapsedMinutes) / 60)} hour if needed).</span>
                  <span className="block mt-1">Step 2: Add hours: {startHours} + {elapsedHours} + {Math.floor((startMins + elapsedMinutes) / 60)} = Final time: {prob.answer}</span>
                </p>
              </li>
            )
          })}
        </ol>
      </div>
    )
  },
  'interactive-math-graphing': ({ doc, seed, variant }) => {
    return (
      <p className="text-sm">Students should create a bar graph with appropriate scale and labels. Check that bars match the data values correctly.</p>
    )
  },
  'interactive-math-rounding': ({ doc, seed, variant }) => {
    const problems = buildMathRounding(seed, doc.id, variant)
    return (
      <div className="space-y-2">
        <ol className="list-decimal list-inside space-y-2 text-sm">
          {problems.map((prob, idx) => {
            let roundingRule = ''
            let stepByStep = ''
            if (prob.roundTo === 'ten') {
              const onesDigit = prob.number % 10
              roundingRule = onesDigit >= 5 ? `Round up because ${onesDigit} ≥ 5` : `Round down because ${onesDigit} < 5`
              stepByStep = `Look at the ones digit (${onesDigit}). ${onesDigit >= 5 ? 'Since it\'s 5 or greater, round up' : 'Since it\'s less than 5, round down'}. Replace ones with 0: ${prob.answer}`
            } else if (prob.roundTo === 'hundred') {
              const tensDigit = Math.floor((prob.number % 100) / 10)
              roundingRule = tensDigit >= 5 ? `Round up because tens digit ${tensDigit} ≥ 5` : `Round down because tens digit ${tensDigit} < 5`
              stepByStep = `Look at the tens digit (${tensDigit}). ${tensDigit >= 5 ? 'Since it\'s 5 or greater, round up' : 'Since it\'s less than 5, round down'}. Replace tens and ones with 00: ${prob.answer}`
            } else {
              const hundredsDigit = Math.floor((prob.number % 1000) / 100)
              roundingRule = hundredsDigit >= 5 ? `Round up because hundreds digit ${hundredsDigit} ≥ 5` : `Round down because hundreds digit ${hundredsDigit} < 5`
              stepByStep = `Look at the hundreds digit (${hundredsDigit}). ${hundredsDigit >= 5 ? 'Since it\'s 5 or greater, round up' : 'Since it\'s less than 5, round down'}. Replace hundreds, tens, and ones with 000: ${prob.answer}`
            }
            return (
              <li key={idx} className="mb-3">
                <span className="font-semibold">Problem {idx + 1}:</span> {prob.number} rounded to the nearest {prob.roundTo} = <span className="text-emerald-700 font-bold">{prob.answer}</span>
                <p className="text-xs text-slate-600 mt-1 ml-4">
                  <span className="font-semibold">Rule:</span> {roundingRule}
                  <span className="block mt-1"><span className="font-semibold">Step-by-step:</span> {stepByStep}</span>
                </p>
              </li>
            )
          })}
        </ol>
      </div>
    )
  },
  'interactive-math-decimals': ({ doc, seed, variant }) => {
    const problems = buildMathDecimals(seed, doc.id, variant)
    return (
      <div className="space-y-2">
        <ol className="list-decimal list-inside space-y-2 text-sm">
          {problems.map((prob, idx) => {
            let explanation = ''
            if (prob.op === '+') {
              explanation = `Add: ${prob.num1} + ${prob.num2} = ${prob.answer}. Line up decimal points and add each place value.`
            } else if (prob.op === '-') {
              explanation = `Subtract: ${prob.num1} - ${prob.num2} = ${prob.answer}. Line up decimal points and subtract each place value.`
            } else if (prob.op === '×') {
              explanation = `Multiply: ${prob.num1} × ${prob.num2} = ${prob.answer}. Multiply as whole numbers, then count total decimal places and place decimal point.`
            } else {
              explanation = `Divide: ${prob.num1} ÷ ${prob.num2} = ${prob.answer}. Move decimal points to make divisor whole, then divide normally.`
            }
            return (
              <li key={idx} className="mb-3">
                <span className="font-semibold">Problem {idx + 1}:</span> {prob.num1} {prob.op} {prob.num2} = <span className="text-emerald-700 font-bold">{prob.answer}</span>
                <p className="text-xs text-slate-600 mt-1 ml-4">
                  <span className="font-semibold">Solution:</span> {explanation}
                </p>
              </li>
            )
          })}
        </ol>
      </div>
    )
  },
  'interactive-math-integers': ({ doc, seed, variant }) => {
    const problems = buildMathIntegers(seed, doc.id, variant)
    return (
      <div className="space-y-2">
        <ol className="list-decimal list-inside space-y-2 text-sm">
          {problems.map((prob, idx) => {
            let explanation = ''
            if (prob.op === '+') {
              if (prob.num1 < 0 && prob.num2 < 0) {
                explanation = `Add two negatives: (${prob.num1}) + (${prob.num2}) = ${prob.answer}. Add absolute values, keep negative sign.`
              } else if (prob.num1 < 0 || prob.num2 < 0) {
                explanation = `Add positive and negative: ${prob.num1} + ${prob.num2} = ${prob.answer}. Subtract absolute values, keep sign of larger number.`
              } else {
                explanation = `Add two positives: ${prob.num1} + ${prob.num2} = ${prob.answer}.`
              }
            } else if (prob.op === '-') {
              explanation = `Subtract: ${prob.num1} - ${prob.num2} = ${prob.answer}. Change subtraction to addition: ${prob.num1} + (${-prob.num2}) = ${prob.answer}.`
            } else {
              const sign = (prob.num1 < 0) !== (prob.num2 < 0) ? 'negative' : 'positive'
              explanation = `Multiply: ${prob.num1} × ${prob.num2} = ${prob.answer}. Multiply absolute values: ${Math.abs(prob.num1)} × ${Math.abs(prob.num2)} = ${Math.abs(prob.answer)}. Result is ${sign} because ${(prob.num1 < 0) !== (prob.num2 < 0) ? 'one number is negative' : 'both numbers have the same sign'}.`
            }
            return (
              <li key={idx} className="mb-3">
                <span className="font-semibold">Problem {idx + 1}:</span> {prob.num1 < 0 ? `(${prob.num1})` : prob.num1} {prob.op} {prob.num2 < 0 ? `(${prob.num2})` : prob.num2} = <span className="text-emerald-700 font-bold">{prob.answer}</span>
                <p className="text-xs text-slate-600 mt-1 ml-4">
                  <span className="font-semibold">Solution:</span> {explanation}
                </p>
              </li>
            )
          })}
        </ol>
      </div>
    )
  },
  'interactive-math-exponents': ({ doc, seed, variant }) => {
    const problems = buildMathExponents(seed, doc.id, variant)
    return (
      <div className="space-y-2">
        <ol className="list-decimal list-inside space-y-2 text-sm">
          {problems.map((prob, idx) => {
            const expansion = Array(prob.exponent).fill(prob.base).join(' × ')
            return (
              <li key={idx} className="mb-3">
                <span className="font-semibold">Problem {idx + 1}:</span> {prob.base}<sup>{prob.exponent}</sup> = <span className="text-emerald-700 font-bold">{prob.answer}</span>
                <p className="text-xs text-slate-600 mt-1 ml-4">
                  <span className="font-semibold">Solution:</span> {prob.base}<sup>{prob.exponent}</sup> means multiply {prob.base} by itself {prob.exponent} times.
                  <span className="block mt-1"><span className="font-semibold">Expansion:</span> {expansion} = {prob.answer}</span>
                  <span className="block mt-1"><span className="font-semibold">Tip:</span> The exponent tells you how many times to multiply the base. {prob.base}<sup>{prob.exponent}</sup> = {prob.base} × {prob.base} × ... ({prob.exponent} times).</span>
                </p>
              </li>
            )
          })}
        </ol>
      </div>
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
  // ANSWER RENDERERS FOR NEW WORKSHEETS
  'interactive-writing-trace': ({ doc, seed, variant }) => {
    return (
      <p className="text-sm">Students should trace letters correctly, write them 3 times each, and trace/write words. Check for proper letter formation and legibility.</p>
    )
  },
  'interactive-writing-lowercase-trace': ({ doc, seed, variant }) => {
    return (
      <p className="text-sm">Students should trace lowercase letters neatly, following the dotted lines. Check for proper letter formation, consistent size, and legibility. Letters should sit on the baseline correctly.</p>
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
  'interactive-reading-alphabet': (ctx) => {
    const { t } = ctx
    return (
      <p className="text-sm">{t('worksheets.alphabetAnswerKey')}</p>
    )
  },
  'interactive-reading-sightwords': (ctx) => {
    const { doc, seed, variant, t } = ctx
    return (
      <p className="text-sm">{t('worksheets.answerKey.studentsShould')} {t('worksheets.answerKey.sightWordsAnswer')}</p>
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
  'interactive-grammar-rhyming': ({ doc, seed, variant, t }) => {
    return (
      <p className="text-sm">{t('worksheets.answerKey.grammarRhymingAnswer')}</p>
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
  'interactive-art-color-by-number': ({ doc, seed, variant }) => {
    return (
      <p className="text-sm">Students should color each section according to the number code provided. Check that colors match the key (1=red, 2=blue, etc.) and that students follow directions accurately.</p>
    )
  },
  'interactive-art-mandala': ({ doc, seed, variant }) => {
    return (
      <p className="text-sm">Student responses may vary. Evaluate based on symmetry, pattern consistency, creativity, and mindfulness reflection. Encourage students to start from the center and work outward.</p>
    )
  },
  'interactive-art-doodle': ({ doc, seed, variant }) => {
    return (
      <p className="text-sm">Student responses may vary. There are no wrong answers in doodling! Evaluate based on creativity, engagement, and willingness to experiment. Encourage free expression.</p>
    )
  },
  'interactive-art-seasonal': ({ doc, seed, variant }) => {
    return (
      <p className="text-sm">Student responses may vary. Check for appropriate seasonal themes, color choices that match the season, and creative expression. Encourage students to think about what makes each season special.</p>
    )
  },
  'interactive-art-comic': ({ doc, seed, variant }) => {
    return (
      <p className="text-sm">Student responses may vary. Evaluate based on story structure (beginning/middle/end), character development, use of speech bubbles, visual narrative flow, and creativity. Check that panels tell a coherent story.</p>
    )
  },
  'interactive-art-critique': ({ doc, seed, variant }) => {
    return (
      <p className="text-sm">Student responses may vary. Evaluate based on use of art vocabulary, detailed observations, thoughtful analysis of art elements (line, color, shape, etc.), and ability to express personal impressions. Encourage specific, descriptive language.</p>
    )
  },
  'interactive-sel-conflict': ({ doc, seed, variant }) => {
    return (
      <p className="text-sm">Student responses may vary. Check for understanding of conflict resolution strategies, use of "I" statements, identification of feelings, and ability to propose peaceful solutions. Encourage empathy and effective communication.</p>
    )
  },
  'interactive-sel-regulation': ({ doc, seed, variant }) => {
    return (
      <p className="text-sm">Student responses may vary. Check for understanding of self-regulation strategies, ability to identify when strategies are needed, and reflection on how strategies help manage emotions. Encourage practice of techniques.</p>
    )
  },
  'interactive-sel-kindness': ({ doc, seed, variant }) => {
    return (
      <p className="text-sm">Student responses may vary. Check for completion of kindness acts, reflection on impact on self and others, and understanding of how kindness creates positive connections. Encourage genuine acts of kindness.</p>
    )
  },
  'interactive-sel-growth-mindset': ({ doc, seed, variant }) => {
    return (
      <p className="text-sm">Student responses may vary. Check for transformation of fixed mindset thoughts into growth mindset thoughts, understanding that challenges help us grow, and recognition that mistakes are learning opportunities. Encourage persistence and effort.</p>
    )
  },
  'interactive-sel-stress': ({ doc, seed, variant }) => {
    return (
      <p className="text-sm">Student responses may vary. Check for identification of stress triggers, understanding of healthy coping strategies, and ability to match strategies to situations. Encourage self-awareness and healthy stress management.</p>
    )
  },
  'interactive-sel-character': ({ doc, seed, variant }) => {
    return (
      <p className="text-sm">Student responses may vary. Check for understanding of character traits, ability to identify ways to demonstrate traits, and recognition of these traits in others. Encourage reflection on how character traits help build strong relationships and communities.</p>
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
  const { t: tFromContext, language } = useTranslation()
  const doc = getDocMeta(docId)
  const category = doc ? categoryByDocId.get(docId) : undefined
  
  // Helper to format numbers based on language
  const formatNum = (num: number | string) => formatNumber(num, language)
  const formatRange = (start: number | string, end: number | string) => formatNumberRange(start, end, language)

  // Debug: Log language value
  React.useEffect(() => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.log('[InteractiveWorksheetSection] Language:', language, 'docId:', docId)
    }
  }, [language, docId])

  // Force re-render when language changes by using language in state
  const [, forceUpdate] = React.useReducer(x => x + 1, 0)
  React.useEffect(() => {
    forceUpdate()
  }, [language])

  if (!doc || !category) return null

  const renderer = renderers[docId]
  const answerRenderer = answerRenderers[docId]
  const theme = getCategoryTheme(category.id)
  const cornerColors = getCornerAccentColor(category.id)

  // Ensure t function works correctly - prioritize direct translation with current language
  // Don't use useCallback - recreate function on every render to ensure latest language is used
  const t = React.useMemo(() => {
    return (key: string): string => {
      try {
        // Priority 1: Use getTranslation with current language (most reliable)
        const directResult = getTranslation(language, key)
        // Debug: Log translation attempts for important keys
        if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development' && 
            (key.includes('countObjectsAndWriteNumber') || key.includes('countThe') || key.includes('numberLabel'))) {
          console.log(`[InteractiveBundleSections] Translation attempt: key=${key}, language=${language}, result=${directResult}, isKey=${directResult === key}`)
        }
        if (typeof directResult === 'string' && directResult !== key) {
          return directResult
        }
        
        // Priority 2: Try context as fallback
        const contextResult = tFromContext(key)
        if (typeof contextResult === 'string' && contextResult !== key) {
          return contextResult
        }
        
        // Priority 3: If both return the key, try English as final fallback (but only if not Arabic)
        // For Arabic, we want to see the key if translation is missing rather than falling back to English
        if (language === 'ar') {
          // For Arabic, return the key so we can see what's missing
          if (typeof window !== 'undefined') {
            const logKey = `translation-missing-${key}-${language}`
            if (!(window as any)[logKey]) {
              (window as any)[logKey] = true
              console.warn(`[InteractiveBundleSections] Translation missing for Arabic: key=${key}, language=${language}`, { 
                directResult, 
                contextResult,
                languageValue: language,
                keyPath: key
              })
            }
          }
          return key
        }
        
        // For other languages, try English fallback
        if (language !== 'en') {
          const englishResult = getTranslation('en', key)
          if (typeof englishResult === 'string' && englishResult !== key) {
            return englishResult
          }
        }
        
        // Final fallback: return the key (will be visible in UI for debugging)
        return key
      } catch (error) {
        console.warn('[InteractiveBundleSections] Translation error:', key, language, error)
        // Try direct translation first
        try {
          const result = getTranslation(language, key)
          if (typeof result === 'string' && result !== key) {
            return result
          }
        } catch {}
        // Try context as fallback
        try {
          const result = tFromContext(key)
          if (typeof result === 'string' && result !== key) {
            return result
          }
        } catch {}
        // Try English fallback
        if (language !== 'en') {
          try {
            const englishResult = getTranslation('en', key)
            if (typeof englishResult === 'string' && englishResult !== key) {
              return englishResult
            }
          } catch {}
        }
        return key
      }
    }
  }, [language, tFromContext])

  if (!renderer) {
    return (
      <section className={`mb-10 break-inside-avoid rounded-xl border-2 ${theme.border} ${theme.background} p-5 print:border-0 print:p-0 print:bg-white shadow-lg`}>
        <h2 className={`text-lg font-semibold ${theme.text}`}>{category.icon} {t(`interactive.${doc.id}.title`) || doc.title}</h2>
        <p className="text-sm text-slate-600">{t('common.comingSoon')}</p>
        {showAnswers && (
          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
            {t('common.answersWillBeAdded')}
          </div>
        )}
      </section>
    )
  }

  return (
    <section className={`mb-10 break-inside-avoid rounded-xl border-2 ${theme.border} ${theme.background} p-6 print:border-0 print:p-0 print:bg-white shadow-lg relative overflow-hidden`}>
      {/* Decorative corner accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br rounded-bl-full pointer-events-none" style={{ backgroundColor: cornerColors.topRight }} />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr rounded-tr-full pointer-events-none" style={{ backgroundColor: cornerColors.bottomLeft }} />
      
      <header className="mb-4 flex items-start justify-between gap-3 relative z-10">
        <div>
          <p className={`text-xs uppercase tracking-wide font-bold ${theme.text} opacity-80`}>{t(`categories.${category.id}`) || category.label}</p>
          <h2 className={`text-xl font-bold ${theme.text} mt-1 flex items-center gap-2`}>
            <span className={theme.emojiSize}>{category.icon}</span>
            <span>{t(`interactive.${doc.id}.title`) || doc.title}</span>
          </h2>
          <p className={`text-sm ${theme.text} opacity-70 mt-1`}>{t(`interactive.${doc.id}.description`) || doc.description}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className={`inline-flex items-center rounded-full border-2 ${theme.border} bg-white px-3 py-1 text-xs font-bold ${theme.text} shadow-sm`}>
            {t(`difficulty.${doc.difficulty.toLowerCase()}`)}
          </span>
          <span className={`text-xs font-medium ${theme.text} opacity-60`}>
            {doc.grades.map((g) => t(`grades.${g}`)).join(' / ')}
          </span>
        </div>
      </header>
      
      <div className="relative z-10">
        {renderer({ doc, category, seed, variant, t, language, formatNum, formatRange })}
      </div>

      {showAnswers && answerRenderer && (
        <div className={`mt-6 rounded-xl border-2 ${theme.border} bg-white p-5 shadow-md relative z-10`}>
          <h3 className={`text-sm font-bold ${theme.text} mb-3 flex items-center gap-2`}>
            <span>✓</span>
            {t('worksheets.answerKeyAndNotes')}
          </h3>
          {answerRenderer({ doc, category, seed, variant, t, language, formatNum, formatRange })}
        </div>
      )}
    </section>
  )
}

export default function InteractiveBundleSections({ docIds, seed, variant, showAnswers, teacherName, className, studentNames }: Props) {
  const { language } = useTranslation()
  if (docIds.length === 0) return null

  return (
    <>
      {docIds.map((docId) => (
        <InteractiveWorksheetSection
          key={`${docId}-${language}-${variant}`}
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

