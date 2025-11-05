import {
  INTERACTIVE_CATEGORIES,
  INTERACTIVE_GRADE_OPTIONS,
  type GradeBand,
  type InteractiveWorksheetDoc,
  getCategoryById,
} from './interactiveWorksheets'

export interface GenerateInteractiveOptions {
  date: string
  grade: GradeBand
  categories: string[]
  variant: number
  countPerCategory?: number
}

export interface InteractiveWorksheetItem {
  docId: string
  title: string
  description: string
  categoryId: string
  categoryLabel: string
  gradeLabel: string
  difficulty: string
  focus: string[]
  previewHint: string
}

export interface InteractiveWorksheetPack {
  seed: string
  generatedAt: string
  grade: GradeBand
  gradeLabel: string
  categories: string[]
  items: InteractiveWorksheetItem[]
  printUrl: string
  answerSummary: string[]
}

const DEFAULT_CATEGORIES = ['math', 'reading', 'writing', 'sel']

function makeRng(seedStr: string) {
  let seed = 0
  for (let i = 0; i < seedStr.length; i++) seed = (seed + seedStr.charCodeAt(i)) >>> 0
  return function rng() {
    seed = (seed * 1664525 + 1013904223) >>> 0
    return seed / 0xffffffff
  }
}

const gradeLabelMap = new Map(INTERACTIVE_GRADE_OPTIONS.map((g) => [g.id, g.label]))

function gradeMatches(doc: InteractiveWorksheetDoc, grade: GradeBand): boolean {
  if (doc.grades.includes(grade)) return true
  if (grade === '35') return doc.grades.some((g) => g === 'g2' || g === '68' || g === '35')
  if (grade === 'g2') return doc.grades.some((g) => g === 'k1' || g === '35' || g === 'g2')
  if (grade === 'k1') return doc.grades.some((g) => g === 'preK' || g === 'g2' || g === 'k1')
  if (grade === 'preK') return doc.grades.some((g) => g === 'preK' || g === 'k1')
  if (grade === '68') return doc.grades.some((g) => g === '35' || g === '68')
  return false
}

function pickDocsForCategory(
  categoryId: string,
  grade: GradeBand,
  rng: () => number,
  count: number
): { doc: InteractiveWorksheetDoc; categoryLabel: string; categoryIcon: string }[] {
  const category = getCategoryById(categoryId)
  if (!category) return []
  const pool = category.docs.filter((doc) => gradeMatches(doc, grade))
  const source = (pool.length ? pool : category.docs).slice()
  for (let i = source.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[source[i], source[j]] = [source[j], source[i]]
  }
  return source.slice(0, Math.max(1, count)).map((doc) => ({
    doc,
    categoryLabel: category.label,
    categoryIcon: category.icon,
  }))
}

export function generateInteractiveWorksheetPack(options: GenerateInteractiveOptions): InteractiveWorksheetPack {
  const date = options.date || new Date().toISOString().slice(0, 10)
  const grade: GradeBand = options.grade || 'k1'
  const chosenCategories = (options.categories.length ? options.categories : DEFAULT_CATEGORIES).filter((id) =>
    getCategoryById(id)
  )
  const seed = `${date}|grade:${grade}|cats:${chosenCategories.join(',')}|v${options.variant}`
  const rng = makeRng(seed)
  const countPerCategory = Math.max(1, options.countPerCategory ?? 1)

  const items: InteractiveWorksheetItem[] = []
  const answerSummary: string[] = []

  for (const categoryId of chosenCategories) {
    const picks = pickDocsForCategory(categoryId, grade, rng, countPerCategory)
    for (const { doc, categoryLabel, categoryIcon } of picks) {
      const previewHint = `${categoryIcon} ${doc.title} — ${doc.description}`
      items.push({
        docId: doc.id,
        title: doc.title,
        description: doc.description,
        categoryId,
        categoryLabel,
        gradeLabel: gradeLabelMap.get(grade) || 'All grades',
        difficulty: doc.difficulty,
        focus: doc.focus,
        previewHint,
      })
      answerSummary.push(`${doc.title} (${categoryLabel}) — includes printable answer key.`)
    }
  }

  const uniqueItems = items.filter(
    (item, idx, arr) => arr.findIndex((inner) => inner.docId === item.docId) === idx
  )

  const docIdsParam = uniqueItems.map((item) => item.docId).join(',')
  const printUrl = `/print?doc=bundle&items=${encodeURIComponent(docIdsParam)}&category=Interactive%20Worksheets&from=interactive`

  return {
    seed,
    generatedAt: new Date().toISOString(),
    grade,
    gradeLabel: gradeLabelMap.get(grade) || 'All grades',
    categories: chosenCategories,
    items: uniqueItems,
    printUrl,
    answerSummary,
  }
}
