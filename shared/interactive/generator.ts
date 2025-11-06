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

function pickDocsForCategory(
  categoryId: string,
  grade: GradeBand,
  rng: () => number,
  count: number,
  excludeDocIds?: Set<string>,
  variant?: number
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
    // If fallback also has no matches, use ALL worksheets from this category (remove grade restriction)
    // This ensures we ALWAYS return at least one worksheet per category if any exist
    pool = fallbackMatches.length > 0 ? fallbackMatches : category.docs.filter(d => !excludeDocIds || !excludeDocIds.has(d.id))
  }
  
  // Final safety check: if still empty, try without exclude filter (shouldn't happen, but safety net)
  if (pool.length === 0) {
    pool = category.docs.filter(doc => doc.grades.includes(grade))
    if (pool.length === 0) {
      // Last resort: use any worksheet from this category
      pool = category.docs.slice()
    }
  }
  
  // If still no worksheets available in this category, return empty
  if (pool.length === 0) return []
  
  const source = pool.slice()
  // Enhanced shuffle with multiple passes for better randomization
  // Use variant-based rotation to ensure different order each time
  // Consume many RNG values first to ensure completely different starting points
  // Timestamp-based seed ensures different RNG sequence each time
  for (let warmup = 0; warmup < 10 + Math.floor(rng() * 10); warmup++) {
    rng() // Warm up RNG extensively to ensure different starting points
  }
  
  for (let pass = 0; pass < 7; pass++) {
    // Fisher-Yates shuffle
    for (let i = source.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1))
      ;[source[i], source[j]] = [source[j], source[i]]
    }
    // Additional rotation on first pass to maximize differences
    if (pass === 0 && source.length > 1) {
      // Use RNG to determine rotation amount - ensures different rotation per variant
      const rotationAmount = Math.floor(rng() * source.length)
      if (rotationAmount > 0) {
        const rotated = source.slice(rotationAmount).concat(source.slice(0, rotationAmount))
        source.splice(0, source.length, ...rotated)
      }
    }
    // Additional reverse shuffle on second pass for more randomization
    if (pass === 1 && source.length > 1) {
      // Reverse a portion of the array based on RNG
      const reverseStart = Math.floor(rng() * (source.length - 1))
      const reverseEnd = Math.floor(reverseStart + 1 + rng() * (source.length - reverseStart - 1))
      const reversed = source.slice(reverseStart, reverseEnd).reverse()
      source.splice(reverseStart, reverseEnd - reverseStart, ...reversed)
    }
    // Additional random swap passes for more variation
    if (pass >= 2 && source.length > 1) {
      const swapCount = Math.floor(rng() * Math.min(10, source.length))
      for (let s = 0; s < swapCount; s++) {
        const idx1 = Math.floor(rng() * source.length)
        const idx2 = Math.floor(rng() * source.length)
        if (idx1 !== idx2) {
          ;[source[idx1], source[idx2]] = [source[idx2], source[idx1]]
        }
      }
    }
  }
  // Consume many additional RNG values before selecting to ensure completely different starting positions
  // Use variant to create a deterministic offset for selection position
  const variantValue = variant || 1
  // Use variant to create a strong positional shift - ensures different worksheets per variant
  const variantOffset = Math.floor((variantValue * 7919) % Math.max(1, source.length)) // Variant-based offset
  const rngOffset = Math.floor(rng() * 10)
  for (let i = 0; i < 5 + rngOffset + variantOffset; i++) {
    rng()
  }
  // Select from different positions - use variant to force different starting positions
  // This ensures variant 1, 2, 3, etc. pick from different positions in the shuffled array
  // Enhanced algorithm for unlimited unique generations even with limited worksheets
  const variantShift = (variantValue * 7919) % Math.max(1, source.length)
  const randomStart = Math.floor(rng() * source.length)
  // Combine random start with variant shift - variant ensures different starting positions
  // Each variant will pick from a different section of the array
  // For small arrays, ensure variant directly affects selection with multiple rotation strategies
  const variantBasedIndex = variantValue % Math.max(1, source.length) // Direct variant-based index
  // Use multiple prime numbers to create complex rotation patterns for unlimited uniqueness
  const variantRotation1 = (variantValue * 7919) % Math.max(1, source.length)
  const variantRotation2 = (variantValue * 9973) % Math.max(1, source.length) // Another large prime
  const variantRotation3 = (variantValue * 10141) % Math.max(1, source.length) // Another large prime
  // Combine all rotation factors for maximum uniqueness
  const combinedIndex = (randomStart + variantShift + variantBasedIndex + variantRotation1 + variantRotation2 + variantRotation3) % source.length
  const maxStart = Math.max(0, source.length - Math.min(count, source.length))
  const startIndex = Math.floor(Math.min(combinedIndex, maxStart))
  
  // Simplified selection: if we have fewer worksheets than requested, return what we have
  // This ensures we always return worksheets when available, even if fewer than requested
  const availableCount = Math.min(count, source.length)
  let selectedDocs: InteractiveWorksheetDoc[] = []
  
  if (source.length > 0) {
    // Select worksheets starting from the calculated index
    // Use modulo to wrap around if needed
    for (let i = 0; i < availableCount; i++) {
      const index = (startIndex + i) % source.length
      selectedDocs.push(source[index])
    }
  }
  
  // Final safety check: ensure we return at least 1 worksheet if any exist
  if (selectedDocs.length === 0 && source.length > 0) {
    selectedDocs = [source[0]]
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
  const seed = `ts:${timestampBase}|grade:${grade}|cats:${chosenCategories.join(',')}|v${options.variant}|date:${date}`
  const rng = makeRng(seed)
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
    const timestampBase = options.timestamp || Date.now()
    // Use timestamp as the dominant factor in category seed with extended precision
    const categoryTimestampHash = (timestampBase % 10000000000) * 7919
    const categoryTimestampHash2 = (timestampBase % 10000000000) * 9973
    // Multiple variant factors ensure different selections even with same category order
    const variantFactor1 = (options.variant * 7919 * (catIdx + 1)) % 100000000
    const variantFactor2 = (options.variant * 9973 * (catIdx + 1)) % 100000000
    const variantFactor3 = (options.variant * 10141 * (catIdx + 1)) % 100000000
    // Category seed with timestamp as PRIMARY component and multiple variant factors
    // This ensures unlimited unique generations - each category gets a completely different seed
    const categorySeed = `ts:${timestampBase}|${seed}|cat:${categoryId}|idx:${catIdx}|vf1:${variantFactor1}|vf2:${variantFactor2}|vf3:${variantFactor3}|tsh1:${categoryTimestampHash}|tsh2:${categoryTimestampHash2}|order:${categoryOrder.join(',')}`
    const categoryRng = makeRng(categorySeed)
    const picks = pickDocsForCategory(categoryId, grade, categoryRng, countPerCategory, usedDocIds, options.variant)
    
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
      const previewHint = `${categoryIcon} ${doc.title} ? ${doc.description}`
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
      answerSummary.push(`${doc.title} (${categoryLabel}) ? includes printable answer key.`)
      addedCount++
    }
    
    // CRITICAL: Safety check - if no worksheets were added, ensure we get at least one
    // This handles cases where picks exist but are filtered out, or picks is empty
    if (addedCount === 0) {
      const category = getCategoryById(categoryId)
      if (category && category.docs.length > 0) {
        // Find any worksheet that matches the grade (with fallback)
        let fallbackDoc: InteractiveWorksheetDoc | null = null
        
        // First try exact grade match (excluding already used)
        fallbackDoc = category.docs.find(doc => 
          doc.grades.includes(grade) && !usedDocIds.has(doc.id)
        ) || null
        
        // If no exact match, try fallback grades
        if (!fallbackDoc) {
          const fallback = gradeFallback[grade] || []
          fallbackDoc = category.docs.find(doc => 
            doc.grades.some(g => fallback.includes(g)) && !usedDocIds.has(doc.id)
          ) || null
        }
        
        // Last resort: use any worksheet from category (even if already used, to ensure we have something)
        if (!fallbackDoc) {
          fallbackDoc = category.docs.find(doc => doc.grades.includes(grade)) || 
                       category.docs.find(doc => {
                         const fallback = gradeFallback[grade] || []
                         return doc.grades.some(g => fallback.includes(g))
                       }) ||
                       category.docs[0] || null
        }
        
        // Add the fallback worksheet if found
        if (fallbackDoc) {
          // Always add to usedDocIds to track it
          if (!usedDocIds.has(fallbackDoc.id)) {
            usedDocIds.add(fallbackDoc.id)
          }
          const cat = getCategoryById(categoryId)
          const previewHint = `${cat?.icon || '??'} ${fallbackDoc.title} ? ${fallbackDoc.description}`
          items.push({
            docId: fallbackDoc.id,
            title: fallbackDoc.title,
            description: fallbackDoc.description,
            categoryId,
            categoryLabel: cat?.label || categoryId,
            gradeLabel: gradeLabelMap.get(grade) || 'All grades',
            difficulty: fallbackDoc.difficulty,
            focus: fallbackDoc.focus,
            previewHint,
          })
          answerSummary.push(`${fallbackDoc.title} (${cat?.label || categoryId}) ? includes printable answer key.`)
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
