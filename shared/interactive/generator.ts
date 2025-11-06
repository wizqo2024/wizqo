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

const gradeFallback: Record<GradeBand, GradeBand[]> = {
  preK: ['k1'],
  k1: ['preK'],
  g2: ['35'],
  '35': ['g2', '68'],
  '68': ['35'],
}

function pickDocsForCategory(
  categoryId: string,
  grade: GradeBand,
  rng: () => number,
  count: number,
  excludeDocIds?: Set<string>
): { doc: InteractiveWorksheetDoc; categoryLabel: string; categoryIcon: string }[] {
  const category = getCategoryById(categoryId)
  if (!category) return []
  
  // STRICT GRADE MATCHING: Only show worksheets that match the selected grade exactly
  // Priority: exact matches > fallback matches (only if no exact matches exist)
  const exactMatches = category.docs.filter((doc) => 
    doc.grades.includes(grade) && (!excludeDocIds || !excludeDocIds.has(doc.id))
  )
  
  // Only use fallback if there are NO exact matches for this grade
  let pool: InteractiveWorksheetDoc[] = []
  if (exactMatches.length > 0) {
    // Use exact matches only - strict grade matching
    pool = exactMatches
  } else {
    // Fallback: try nearby grades only if no exact match exists
    const fallbackMatches = category.docs.filter((doc) => {
      const fallback = gradeFallback[grade] || []
      return doc.grades.some((g) => fallback.includes(g)) && (!excludeDocIds || !excludeDocIds.has(doc.id))
    })
    pool = fallbackMatches.length > 0 ? fallbackMatches : category.docs.filter(d => !excludeDocIds || !excludeDocIds.has(d.id))
  }
  
  if (pool.length === 0) return []
  
  const source = pool.slice()
  // Enhanced shuffle with multiple passes for better randomization
  // Add variant-based offset to ensure different shuffle order each time
  const shuffleOffset = Math.floor(rng() * source.length)
  for (let pass = 0; pass < 3; pass++) {
    for (let i = source.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1))
      ;[source[i], source[j]] = [source[j], source[i]]
    }
    // Additional rotation based on variant to ensure different order
    if (pass === 0 && shuffleOffset > 0) {
      const rotated = source.slice(shuffleOffset).concat(source.slice(0, shuffleOffset))
      source.splice(0, source.length, ...rotated)
    }
  }
  return source.slice(0, Math.max(1, Math.min(count, source.length))).map((doc) => ({
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
  // Enhanced seed with variant and counter to ensure uniqueness across regenerations
  // Use variant * 1000 + a small random offset to ensure different results
  const variantMultiplier = options.variant * 1000
  const randomOffset = Math.floor(Math.random() * 1000)
  const seed = `${date}|grade:${grade}|cats:${chosenCategories.join(',')}|v${options.variant}|m${variantMultiplier}|r${randomOffset}`
  const rng = makeRng(seed)
  const countPerCategory = Math.max(1, options.countPerCategory ?? 1)

  const items: InteractiveWorksheetItem[] = []
  const answerSummary: string[] = []

  // Track used docIds to prevent duplicates within the pack
  const usedDocIds = new Set<string>()

  // Validate that all selected categories exist and are valid
  const validCategories = chosenCategories.filter((catId) => {
    const cat = getCategoryById(catId)
    return cat !== undefined
  })

  // If no valid categories, use defaults (but prevent infinite recursion)
  if (validCategories.length === 0) {
    const defaultCategories = DEFAULT_CATEGORIES.filter((catId) => {
      const cat = getCategoryById(catId)
      return cat !== undefined
    })
    if (defaultCategories.length > 0 && !chosenCategories.every(c => defaultCategories.includes(c))) {
      return generateInteractiveWorksheetPack({
        ...options,
        categories: defaultCategories,
      })
    }
    // If defaults also invalid, return empty pack
    return {
      seed: `${date}|grade:${grade}|cats:|v${options.variant}`,
      generatedAt: new Date().toISOString(),
      grade,
      gradeLabel: gradeLabelMap.get(grade) || 'All grades',
      categories: [],
      items: [],
      printUrl: '',
      answerSummary: [],
    }
  }

  for (const categoryId of validCategories) {
    const picks = pickDocsForCategory(categoryId, grade, rng, countPerCategory, usedDocIds)
    
    // Ensure we only add worksheets that match the grade AND category
    for (const { doc, categoryLabel, categoryIcon } of picks) {
      // Double-check: worksheet must match the category
      const docCategory = getCategoryById(categoryId)
      if (!docCategory || !docCategory.docs.some(d => d.id === doc.id)) {
        continue // Skip if worksheet doesn't belong to this category
      }
      
      // Double-check: worksheet must match the grade (exact match preferred)
      const gradeMatches = doc.grades.includes(grade)
      if (!gradeMatches) {
        // Only allow if it's a fallback grade and no exact matches exist
        const fallback = gradeFallback[grade] || []
        const isFallbackMatch = doc.grades.some((g) => fallback.includes(g))
        if (!isFallbackMatch) {
          continue // Skip if worksheet doesn't match grade at all
        }
      }
      
      // Add to used set to prevent duplicates
      usedDocIds.add(doc.id)
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

  // Final deduplication pass
  const uniqueItems = items.filter(
    (item, idx, arr) => arr.findIndex((inner) => inner.docId === item.docId) === idx
  )

  const docIdsParam = uniqueItems.map((item) => item.docId).join(',')
  const printUrl = `/print?doc=bundle&items=${encodeURIComponent(docIdsParam)}&category=Interactive%20Worksheets&from=interactive`

  return {
    seed: `${date}|grade:${grade}|cats:${chosenCategories.join(',')}|v${options.variant}`, // Keep readable seed without internal multipliers
    generatedAt: new Date().toISOString(),
    grade,
    gradeLabel: gradeLabelMap.get(grade) || 'All grades',
    categories: chosenCategories,
    items: uniqueItems,
    printUrl,
    answerSummary,
  }
}
