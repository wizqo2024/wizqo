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
  timestamp?: number // Optional timestamp for unique generation
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

const toGradeLabel = (grades: GradeBand[]) =>
  grades
    .map((g) => gradeLabelMap.get(g) || g.toUpperCase())
    .join(' / ')

function pickDocsForCategory(
  categoryId: string,
  grade: GradeBand,
  rng: () => number,
  count: number,
  excludeDocIds?: Set<string>,
  variant?: number,
  categoryIndex?: number
): { doc: InteractiveWorksheetDoc; categoryLabel: string; categoryIcon: string }[] {
  const category = getCategoryById(categoryId)
  if (!category) return []
  
  // STRICT GRADE MATCHING: Only show worksheets that match the selected grade exactly
  // Priority: exact matches > fallback matches (only if no exact matches exist)
  const exactMatches = category.docs.filter(
    (doc) => doc.grades.includes(grade) && (!excludeDocIds || !excludeDocIds.has(doc.id))
  )
  const fallbackGrades = gradeFallback[grade] || []
  const fallbackMatches = category.docs.filter(
    (doc) =>
      doc.grades.some((g) => fallbackGrades.includes(g)) &&
      (!excludeDocIds || !excludeDocIds.has(doc.id))
  )

  let pool: InteractiveWorksheetDoc[] = []
  if (exactMatches.length > 0) {
    // Combine exact matches with fallback matches for broader variety while keeping grade relevance
    pool = [...exactMatches]
    for (const doc of fallbackMatches) {
      if (!pool.some((existing) => existing.id === doc.id)) {
        pool.push(doc)
      }
    }
  } else if (fallbackMatches.length > 0) {
    pool = fallbackMatches
  } else {
    // Last resort: if no exact or fallback matches, try to find ANY worksheet in the category
    // This ensures every category always has at least some worksheets available
    const anyMatches = category.docs.filter(
      (doc) => !excludeDocIds || !excludeDocIds.has(doc.id)
    )
    if (anyMatches.length > 0) {
      pool = anyMatches
    }
  }

  const orderedPool = pool.slice().sort((a, b) => a.id.localeCompare(b.id))
  const variantBase = Math.max(0, (variant ?? 1) - 1)
  const indexOffset = Math.max(0, categoryIndex ?? 0)
  const offset = orderedPool.length > 0 ? (variantBase + indexOffset) % orderedPool.length : 0
  const rotatedPool = orderedPool.length > 0
    ? [...orderedPool.slice(offset), ...orderedPool.slice(0, offset)]
    : orderedPool

  const rotationFiltered = rotatedPool.filter((doc) => !excludeDocIds || !excludeDocIds.has(doc.id))
  const selectedDocs: InteractiveWorksheetDoc[] = rotationFiltered.slice(0, Math.min(count, rotationFiltered.length))

  if (selectedDocs.length < count) {
    const remainingPool = pool.filter((doc) =>
      !selectedDocs.some((selected) => selected.id === doc.id) &&
      (!excludeDocIds || !excludeDocIds.has(doc.id))
    )
    const available = remainingPool.slice()
    while (selectedDocs.length < count && available.length > 0) {
      const index = Math.floor(rng() * available.length)
      selectedDocs.push(available.splice(index, 1)[0])
    }
  }

  if (selectedDocs.length === 0 && pool.length > 0) {
    selectedDocs.push(pool[0])
  }

  return selectedDocs.map((doc) => ({
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
  // Create deterministic seed based on variant and timestamp for unlimited uniqueness
  // IMPORTANT: Timestamp is the PRIMARY component for uniqueness - ensures different worksheets every time
  // Use variant * multiple large primes to ensure significant seed differences for unlimited generations
  const timestampBase = options.timestamp || Date.now()
  const packSeed = `ts:${timestampBase}|grade:${grade}|cats:${chosenCategories.join(',')}|v${options.variant}|date:${date}`
  const rng = makeRng(packSeed)
  // Default to 3 worksheets per category for better variety
  // Users can still get unlimited unique sets by clicking generate multiple times
  const countPerCategory = Math.max(1, options.countPerCategory ?? 3)

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

  // Process categories in a variant-dependent order to ensure different selections
  // Variant influences which category is processed first, affecting selection order
  const categoryOrder = validCategories.slice()
  
  // Rotate category order based on variant to maximize differences
  if (options.variant > 1 && categoryOrder.length > 1) {
    const rotation = (options.variant - 1) % categoryOrder.length
    if (rotation > 0) {
      categoryOrder.push(...categoryOrder.splice(0, rotation))
    }
  }

  for (let catIdx = 0; catIdx < categoryOrder.length; catIdx++) {
    const categoryId = categoryOrder[catIdx]
    // Generate a unique seed for this category based on timestamp (PRIMARY), variant, and category index
    // Timestamp is the PRIMARY component - ensures each generation is completely different
    // Enhanced with multiple variant multipliers for unlimited unique generations
    // Use timestamp as the dominant factor in category seed with extended precision
    const categoryTimestampHash = (timestampBase % 10000000000) * 7919
    const categoryTimestampHash2 = (timestampBase % 10000000000) * 9973
    // Multiple variant factors ensure different selections even with same category order
    const variantFactor1 = (options.variant * 7919 * (catIdx + 1)) % 100000000
    const variantFactor2 = (options.variant * 9973 * (catIdx + 1)) % 100000000
    const variantFactor3 = (options.variant * 10141 * (catIdx + 1)) % 100000000
    // Category seed with timestamp as PRIMARY component and multiple variant factors
    // This ensures unlimited unique generations - each category gets a completely different seed
      const categorySeed = `ts:${timestampBase}|pack:${packSeed}|cat:${categoryId}|idx:${catIdx}|vf1:${variantFactor1}|vf2:${variantFactor2}|vf3:${variantFactor3}|tsh1:${categoryTimestampHash}|tsh2:${categoryTimestampHash2}|order:${categoryOrder.join(',')}`
    const categoryRng = makeRng(categorySeed)
    const picks = pickDocsForCategory(categoryId, grade, categoryRng, countPerCategory, usedDocIds, options.variant, catIdx)
    
    // Ensure we only add worksheets that match the category
    // Note: pickDocsForCategory already handles grade matching with fallbacks,
    // so we trust its results and only verify category membership
    let addedCount = 0
    for (const { doc, categoryLabel, categoryIcon } of picks) {
      // Double-check: worksheet must match the category
      const docCategory = getCategoryById(categoryId)
      if (!docCategory || !docCategory.docs.some(d => d.id === doc.id)) {
        continue // Skip if worksheet doesn't belong to this category
      }
      
      // Skip if already used (duplicate prevention)
      if (usedDocIds.has(doc.id)) {
        continue
      }
      
      // Add to used set to prevent duplicates
      usedDocIds.add(doc.id)
        const docGradeLabel = toGradeLabel(doc.grades)
        const previewHint = `${categoryIcon} ${doc.title} • ${docGradeLabel}`
      items.push({
        docId: doc.id,
        title: doc.title,
        description: doc.description,
        categoryId,
        categoryLabel,
          gradeLabel: docGradeLabel,
        difficulty: doc.difficulty,
        focus: doc.focus,
        previewHint,
      })
        answerSummary.push(`${doc.title} (${categoryLabel}, ${docGradeLabel})`)
      addedCount++
    }
    
    // CRITICAL: Safety check - if no worksheets were added, ensure we get at least one
    // This handles cases where picks exist but are filtered out, or picks is empty
    if (addedCount === 0) {
      const category = getCategoryById(categoryId)
      if (category && category.docs.length > 0) {
        // Find any worksheet that matches the grade (with fallback)
        let fallbackDoc: InteractiveWorksheetDoc | null = null
        
          const fallbackGrades = gradeFallback[grade] || []

          const gradeAlignedDocs = category.docs.filter(
            (doc) =>
              (doc.grades.includes(grade) ||
                doc.grades.some((g) => fallbackGrades.includes(g))) &&
              !usedDocIds.has(doc.id)
          )

          fallbackDoc = gradeAlignedDocs[0] || null

          // Add the fallback worksheet if found
          if (fallbackDoc) {
          // Always add to usedDocIds to track it
          if (!usedDocIds.has(fallbackDoc.id)) {
            usedDocIds.add(fallbackDoc.id)
          }
          const cat = getCategoryById(categoryId)
            const docGradeLabel = toGradeLabel(fallbackDoc.grades)
            const previewHint = `${cat?.icon || '•'} ${fallbackDoc.title} • ${docGradeLabel}`
          items.push({
            docId: fallbackDoc.id,
            title: fallbackDoc.title,
            description: fallbackDoc.description,
            categoryId,
            categoryLabel: cat?.label || categoryId,
              gradeLabel: docGradeLabel,
            difficulty: fallbackDoc.difficulty,
            focus: fallbackDoc.focus,
            previewHint,
          })
            answerSummary.push(`${fallbackDoc.title} (${cat?.label || categoryId}, ${docGradeLabel})`)
          addedCount++
        }
      }
    }
  }

  // Final deduplication pass
  const uniqueItems = items.filter(
    (item, idx, arr) => arr.findIndex((inner) => inner.docId === item.docId) === idx
  )

  const docIdsParam = uniqueItems.map((item) => item.docId).join(',')
  const printUrl = `/print?doc=bundle&items=${encodeURIComponent(docIdsParam)}&category=Interactive%20Worksheets&from=interactive&seed=${encodeURIComponent(packSeed)}&timestamp=${timestampBase}`

  return {
    seed: packSeed,
    generatedAt: new Date().toISOString(),
    grade,
    gradeLabel: gradeLabelMap.get(grade) || 'All grades',
    categories: chosenCategories,
    items: uniqueItems,
    printUrl,
    answerSummary,
  }
}
