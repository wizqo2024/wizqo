/**
 * Complete SEO Mapping for All 254 Worksheets
 * 
 * This file provides SEO-friendly URLs, titles, meta descriptions, keywords,
 * and content for each worksheet to enable proper indexing.
 * 
 * SAFE: Does not affect existing category pages or /print routes
 */

export interface WorksheetSEO {
  docId: string
  slug: string
  title: string
  metaDescription: string
  keywords: string
  h1: string
  intro: string
  grade: string[]
  category: string[]
  section: string
  learningObjectives: string[]
  relatedDocIds: string[]
}

/**
 * Convert docId to SEO-friendly slug
 */
function createSlug(docId: string): string {
  // Special mappings for better SEO
  const slugMap: Record<string, string> = {
    'mult-facts-0-12': 'multiplication-facts-0-12',
    'mult-arrays': 'multiplication-arrays',
    'mult-word-problems': 'multiplication-word-problems',
    'mult-by-10-100': 'multiplying-by-10-and-100',
    'mult-properties': 'properties-of-multiplication',
    'div-facts-1-12': 'division-facts-1-12',
    'div-with-remainders': 'division-with-remainders',
    'div-word-problems': 'division-word-problems',
    'fact-families-mult-div': 'multiplication-division-fact-families',
    'div-by-10-100': 'dividing-by-10-and-100',
    'fractions-whole': 'fractions-parts-of-whole',
    'comparing-fractions': 'comparing-fractions',
    'equivalent-fractions': 'equivalent-fractions',
    'fractions-number-line': 'fractions-on-number-line',
    'add-sub-fractions': 'adding-subtracting-fractions',
    'count-circle-1-10': 'count-circles-1-10',
    'count-match-1-20': 'count-and-match-1-20',
    'how-many-1-15': 'how-many-objects-1-15',
    'count-color-1-10': 'count-and-color-1-10',
    'counting-objects-20': 'counting-objects-to-20',
    'addition-subtraction-0-10': 'addition-subtraction-within-10',
    'ten-frames-1-10': 'ten-frames-1-10',
    'number-tracing-1-20': 'number-tracing-1-20',
    'number-bonds-10': 'number-bonds-to-10',
    'count-write-30': 'count-and-write-to-30',
    'missing-numbers-50': 'missing-numbers-to-50',
    'skip-count-2s': 'skip-counting-by-2s',
    'skip-count-5-10-120': 'skip-counting-by-5s-and-10s-to-120',
    'order-of-operations': 'order-of-operations-pemdas',
    'fractions-to-decimals': 'converting-fractions-to-decimals',
  }
  
  if (slugMap[docId]) {
    return slugMap[docId]
  }
  
  // Auto-generate from docId
  return docId
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[_\s]+/g, '-')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

/**
 * Generate human-readable title from docId
 */
function createTitle(docId: string): string {
  const titleMap: Record<string, string> = {
    'mult-facts-0-12': 'Multiplication Facts 0-12',
    'mult-arrays': 'Multiplication Arrays',
    'mult-word-problems': 'Multiplication Word Problems',
    'mult-by-10-100': 'Multiplying by 10 and 100',
    'mult-properties': 'Properties of Multiplication',
    'div-facts-1-12': 'Division Facts 1-12',
    'div-with-remainders': 'Division with Remainders',
    'div-word-problems': 'Division Word Problems',
    'fact-families-mult-div': 'Multiplication and Division Fact Families',
    'div-by-10-100': 'Dividing by 10 and 100',
    'fractions-whole': 'Fractions Parts of a Whole',
    'comparing-fractions': 'Comparing Fractions',
    'equivalent-fractions': 'Equivalent Fractions',
    'fractions-number-line': 'Fractions on a Number Line',
    'add-sub-fractions': 'Adding and Subtracting Fractions',
    'count-circle-1-10': 'Count Circles 1-10',
    'count-match-1-20': 'Count and Match 1-20',
    'how-many-1-15': 'How Many Objects 1-15',
    'count-color-1-10': 'Count and Color 1-10',
    'counting-objects-20': 'Counting Objects to 20',
    'addition-subtraction-0-10': 'Addition and Subtraction Within 10',
    'ten-frames-1-10': 'Ten Frames 1-10',
    'number-tracing-1-20': 'Number Tracing 1-20',
    'number-bonds-10': 'Number Bonds to 10',
    'count-write-30': 'Count and Write to 30',
    'missing-numbers-50': 'Missing Numbers to 50',
    'skip-count-2s': 'Skip Counting by 2s',
    'skip-count-5-10-120': 'Skip Counting by 5s and 10s to 120',
    'order-of-operations': 'Order of Operations (PEMDAS)',
    'fractions-to-decimals': 'Converting Fractions to Decimals',
  }
  
  if (titleMap[docId]) {
    return titleMap[docId]
  }
  
  // Auto-generate from docId
  return docId
    .split('-')
    .map(word => {
      // Handle numbers
      if (/^\d+$/.test(word)) return word
      // Capitalize first letter
      return word.charAt(0).toUpperCase() + word.slice(1)
    })
    .join(' ')
}

/**
 * Infer grade from docId
 */
function inferGrade(docId: string): string[] {
  if (docId.includes('kindergarten') || docId.includes('prek') || docId.includes('pre-k')) {
    return ['Kindergarten', 'Pre-K']
  }
  if (docId.includes('1st-grade') || docId.includes('first-grade') || docId.includes('g1')) {
    return ['1st Grade']
  }
  if (docId.includes('2nd-grade') || docId.includes('second-grade') || docId.includes('g2')) {
    return ['2nd Grade']
  }
  if (docId.includes('3rd-grade') || docId.includes('third-grade') || docId.includes('g3')) {
    return ['3rd Grade', '4th Grade']
  }
  if (docId.includes('4th-grade') || docId.includes('fourth-grade') || docId.includes('g4')) {
    return ['4th Grade', '5th Grade']
  }
  if (docId.includes('5th-grade') || docId.includes('fifth-grade') || docId.includes('g5')) {
    return ['5th Grade']
  }
  
  // Default based on content
  if (docId.includes('mult') || docId.includes('div') || docId.includes('fractions') || docId.includes('decimals')) {
    return ['3rd Grade', '4th Grade']
  }
  if (docId.includes('count') || docId.includes('number') || docId.includes('shape') || docId.includes('pattern')) {
    return ['Kindergarten', '1st Grade']
  }
  if (docId.includes('pemdas') || docId.includes('order-of-operations') || docId.includes('algebra')) {
    return ['4th Grade', '5th Grade', '6th Grade']
  }
  
  return ['Elementary']
}

/**
 * Infer category from docId
 */
function inferCategory(docId: string): string[] {
  const categories: string[] = []
  
  if (docId.includes('mult')) categories.push('multiplication')
  if (docId.includes('div')) categories.push('division')
  if (docId.includes('fraction')) categories.push('fractions')
  if (docId.includes('decimal')) categories.push('decimals')
  if (docId.includes('add') || docId.includes('sub')) categories.push('addition-subtraction')
  if (docId.includes('count')) categories.push('counting')
  if (docId.includes('number')) categories.push('number-sense')
  if (docId.includes('word-problem')) categories.push('word-problems')
  if (docId.includes('geometry') || docId.includes('shape') || docId.includes('area') || docId.includes('perimeter') || docId.includes('angle')) {
    categories.push('geometry')
  }
  if (docId.includes('measurement') || docId.includes('time') || docId.includes('money') || docId.includes('length') || docId.includes('weight') || docId.includes('liquid')) {
    categories.push('measurement')
  }
  if (docId.includes('reading') || docId.includes('comprehension')) {
    categories.push('reading')
  }
  if (docId.includes('pemdas') || docId.includes('order-of-operations')) {
    categories.push('order-of-operations')
  }
  if (docId.includes('pattern')) {
    categories.push('patterns')
  }
  
  return categories.length > 0 ? categories : ['math']
}

/**
 * Generate SEO title (60-70 chars)
 */
function generateSEOTitle(name: string, grade?: string[]): string {
  const gradeText = grade && grade.length > 0 ? ` for ${grade[0]}` : ''
  return `${name} Worksheet${gradeText} - Free Printable PDF | Wizqo`
}

/**
 * Generate meta description (150-160 chars)
 */
function generateMetaDescription(name: string, grade: string[], category: string[]): string {
  const gradeText = grade.length > 0 ? `Perfect for ${grade.join(' and ')}. ` : ''
  const categoryText = category.length > 0 ? `${category[0]} practice. ` : ''
  const benefits = ['Build math skills', 'Master key concepts', 'Practice with answer key']
  return `Download free printable ${name.toLowerCase()} worksheet with answer key. ${gradeText}${categoryText}${benefits[0]}. Instant PDF download.`
}

/**
 * Generate keywords
 */
function generateKeywords(name: string, category: string[], grade: string[]): string {
  const base = [
    name.toLowerCase(),
    `${name.toLowerCase()} worksheet`,
    `free ${name.toLowerCase()} worksheet`,
    `printable ${name.toLowerCase()}`,
    `${name.toLowerCase()} PDF`,
  ]
  
  const cat = category.flatMap(c => [`${c} worksheet`, `${c} worksheets`])
  const grd = grade.flatMap(g => [`${g} ${name.toLowerCase()}`, `${g} math worksheet`])
  
  return [...base, ...cat, ...grd].slice(0, 15).join(', ')
}

/**
 * Generate intro content (120-200 words)
 */
function generateIntro(name: string, grade: string[], category: string[]): string {
  const gradeText = grade.length > 0 
    ? `This ${name.toLowerCase()} worksheet is designed for ${grade.join(' and ')} students. `
    : `This ${name.toLowerCase()} worksheet helps students `
  
  const categoryText = category.length > 0 
    ? `practice ${category[0]} skills and build confidence. `
    : 'build essential math skills. '
  
  return `${gradeText}${categoryText}This printable worksheet includes an answer key for easy checking and is perfect for classroom use, homework, or extra practice at home. Download the free PDF instantly and start practicing today!`
}

/**
 * Generate learning objectives
 */
function generateLearningObjectives(name: string, category: string[]): string[] {
  const base = [
    `Master ${name.toLowerCase()} skills`,
    `Practice ${category[0] || 'math'} concepts`,
    `Build confidence with ${name.toLowerCase()}`,
  ]
  
  // Add category-specific objectives
  if (category.includes('multiplication')) {
    base.push('Build multiplication fluency')
  }
  if (category.includes('division')) {
    base.push('Master division facts')
  }
  if (category.includes('fractions')) {
    base.push('Understand fraction concepts')
  }
  if (category.includes('counting')) {
    base.push('Develop number recognition')
  }
  
  return base.slice(0, 4)
}

/**
 * Complete SEO mapping for all 254 worksheets
 * This is a comprehensive mapping - we'll generate the rest programmatically
 */
export const WORKSHEET_SEO_MAP: Record<string, WorksheetSEO> = {}

/**
 * Initialize SEO map with all worksheets
 * This function generates SEO data for all 254 worksheets
 */
export function initializeWorksheetSEO() {
  // List of all 254 worksheet docIds
  const allDocIds = [
    'ab-pattern', 'add-2digit-100', 'add-2digit-regrouping', 'addition-subtraction-0-10',
    'add-sub-decimals', 'add-sub-fractions', 'add-sub-fractions-4th', 'add-sub-mixed-numbers',
    'add-three-numbers', 'area-model-mult', 'area-perimeter-4th', 'area-rectangles',
    'area-triangles-parallelograms', 'balance-equations-10', 'bar-graphs-data',
    'bar-graphs-pictographs', 'big-small', 'classifying-angles', 'classifying-quadrilaterals',
    'classifying-shapes', 'classifying-triangles', 'color-by-number', 'color-patterns',
    'color-recognition', 'color-shapes', 'compare-2digit', 'comparing-decimals',
    'comparing-fractions', 'comparing-fractions-4th', 'comparing-ordering-fractions-decimals',
    'coordinate-graphing', 'count-circle-1-10', 'count-color-1-10', 'counting-objects-20',
    'count-match-1-20', 'count-write-30', 'curve-tracing', 'customary-conversion',
    'customary-units', 'cvc-words', 'decimals-place-value', 'decimal-to-percent',
    'decimal-word-problems', 'decimal-word-problems-5th', 'div-by-10-100', 'div-facts-1-12',
    'dividing-decimals', 'dividing-fractions', 'div-with-remainders', 'div-word-problems',
    'dot-to-dot-1-20', 'doubles-facts', 'doubles-near-doubles', 'draw-shape',
    'elapsed-time-4th', 'elapsed-time-word-problems', 'equivalent-fractions',
    'equivalent-fractions-4th', 'estimating-sums-differences', 'evaluating-expressions',
    'even-odd-100', 'expanded-form-200', 'fact-families-20', 'fact-families-mult-div',
    'find-number-1-10', 'fractions-decimals-percents', 'fractions-decimals-percents-advanced',
    'fractions-halves-thirds-fourths', 'fractions-number-line', 'fractions-out-of-100',
    'fractions-to-decimals', 'fractions-to-decimals-basic-tenths', 'fractions-to-decimals-division',
    'fractions-whole', 'fraction-word-problems', 'fraction-word-problems-5th',
    'geometry-word-problems', 'heavy-light', 'how-many-1-15', 'identify-polygons',
    'kindergarten-addition-pictures', 'kindergarten-counting-1-10', 'kindergarten-counting-visual',
    'kindergarten-number-recognition', 'kindergarten-patterns', 'kindergarten-shapes',
    'letter-tracing-az', 'line-graphs', 'line-plots', 'lines-angles-4th',
    'lines-rays-angles', 'line-tracing', 'liquid-measurement', 'liquid-measurement-4th',
    'long-division-1digit', 'long-division-2digit', 'long-division-multidigit',
    'long-short', 'mass-weight', 'mass-weight-4th', 'math-maze', 'mean-median-mode',
    'mean-median-mode-range', 'measurement-length', 'measurement-word-problems',
    'mental-math-20', 'metric-conversion', 'metric-units', 'missing-addends',
    'missing-numbers-50', 'missing-shape', 'mixed-improper-fractions', 'money-coins-bills',
    'money-word-problems', 'more-less', 'more-less-equal-10', 'mult-2x1', 'mult-2x1-digit',
    'mult-2x2', 'mult-2x2-digit', 'mult-3x2-digit', 'mult-area-model', 'mult-arrays',
    'mult-arrays-2-5', 'mult-arrays-models', 'mult-by-10-100', 'mult-complex-word',
    'mult-fact-families', 'mult-fact-fluency', 'mult-facts-0-12', 'mult-facts-1-5',
    'mult-facts-6-12', 'multiplying-decimals', 'multiplying-fractions', 'multi-step-word-4th',
    'multi-step-word-5th', 'multi-step-word-problems', 'mult-mixed-review',
    'mult-multi-step-word', 'mult-patterns', 'mult-properties', 'mult-strategies',
    'mult-word-problems', 'mult-word-problems-2-3', 'nets-3d-shapes', 'number-bonds-10',
    'number-id-1-10', 'number-line-200', 'number-line-add', 'number-matching-1-15',
    'number-order-1-20', 'number-patterns-200', 'number-tracing-1-10', 'number-tracing-1-20',
    'ordering-fractions-decimals', 'order-of-operations', 'partial-products', 'path-tracing',
    'pattern-complete', 'patterns-rules', 'pemdas-advanced', 'pemdas-basic', 'pemdas-complex',
    'pemdas-exponents', 'pemdas-fluency', 'pemdas-mixed-review', 'pemdas-multistep',
    'pemdas-parentheses', 'pemdas-practice', 'pemdas-rules', 'pemdas-step-by-step',
    'pemdas-word-problems', 'percent-to-decimal', 'percent-word-problems',
    'perimeter-area-word-problems', 'perimeter-shapes', 'picture-addition-10',
    'place-value-hto', 'powers-of-10', 'probability', 'ratio-proportion-word-problems',
    'reading-g1-ants', 'reading-g1-big-box', 'reading-g1-birthday-cake', 'reading-g1-bus-ride',
    'reading-g1-garden-snail', 'reading-g1-lost-hat', 'reading-g1-pet-fish',
    'reading-g1-red-balloon', 'reading-g2-bird-feeder', 'reading-g2-cookie-recipe',
    'reading-g2-library-card', 'reading-g2-lost-and-found', 'reading-g2-paper-bridge',
    'reading-g2-rainy-garden', 'reading-g2-tree-house', 'reading-g3-art-project',
    'reading-g3-community-garden', 'reading-g3-lighthouse', 'reading-g3-school-play',
    'reading-g3-science-fair', 'rhyming-words', 'rounding-decimals', 'rounding-nearest-10',
    'same-different', 'sentence-building', 'shape-identification', 'shape-patterns',
    'shapes-colors-sort', 'shape-sorting', 'sight-words-pre-primer', 'size-comparison',
    'skip-count-2s', 'skip-count-5-10-120', 'skip-count-mult', 'solving-one-step-equations',
    'spot-difference', 'stem-leaf-plots', 'sub-2digit-100', 'sub-2digit-regrouping',
    'subtraction-stories', 'symmetry', 'symmetry-transformations', 'ten-frames-1-10',
    'time-5min', 'times-table-blank-1-12', 'times-table-blank-1-5', 'times-table-blank-6-12',
    'times-table-color-1-12', 'times-table-color-1-5', 'times-table-color-6-12',
    'times-table-confidence-1-5', 'times-table-confidence-6-12', 'times-table-fluency-1-12',
    'times-table-horizontal-1-12', 'times-table-horizontal-1-5', 'times-table-horizontal-6-12',
    'times-table-missing-1-5', 'times-table-missing-6-12', 'times-table-missing-mixed',
    'times-table-mixed-review', 'times-table-timed-1-12', 'times-table-timed-1-5',
    'times-table-timed-6-12', 'times-table-vertical-1-12', 'times-table-vertical-1-5',
    'times-table-vertical-6-12', 'time-to-minute', 'transformations-5th',
    'volume-rectangular-prisms', 'what-comes-next', 'word-problems-100', 'writing-expressions',
    'zigzag-lines'
  ]
  
  // Generate SEO data for each worksheet
  for (const docId of allDocIds) {
    const name = createTitle(docId)
    const slug = createSlug(docId)
    const grade = inferGrade(docId)
    const category = inferCategory(docId)
    
    WORKSHEET_SEO_MAP[docId] = {
      docId,
      slug,
      title: generateSEOTitle(name, grade),
      metaDescription: generateMetaDescription(name, grade, category),
      keywords: generateKeywords(name, category, grade),
      h1: `${name} Worksheet`,
      intro: generateIntro(name, grade, category),
      grade,
      category,
      section: category[0] || 'Math',
      learningObjectives: generateLearningObjectives(name, category),
      relatedDocIds: [], // Will be populated based on category/grade
    }
  }
  
  // Populate related worksheets
  for (const docId in WORKSHEET_SEO_MAP) {
    const seo = WORKSHEET_SEO_MAP[docId]
    const related = Object.values(WORKSHEET_SEO_MAP)
      .filter(w => 
        w.docId !== docId &&
        (w.category.some(c => seo.category.includes(c)) || 
         w.grade.some(g => seo.grade.includes(g)))
      )
      .slice(0, 5)
      .map(w => w.docId)
    seo.relatedDocIds = related
  }
}

// Initialize on module load
initializeWorksheetSEO()

/**
 * Get SEO data for a worksheet by docId
 */
export function getWorksheetSEO(docId: string): WorksheetSEO | undefined {
  return WORKSHEET_SEO_MAP[docId]
}

/**
 * Get SEO data for a worksheet by slug
 */
export function getWorksheetSEOBySlug(slug: string): WorksheetSEO | undefined {
  return Object.values(WORKSHEET_SEO_MAP).find(seo => seo.slug === slug)
}

/**
 * Get all worksheet SEO data
 */
export function getAllWorksheetSEO(): WorksheetSEO[] {
  return Object.values(WORKSHEET_SEO_MAP)
}
