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
    'mult-lattice': 'multiplication-lattice-method',
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
    'factors-multiples': 'Factors and Multiples',
    'prime-composite': 'Prime and Composite Numbers',
    'div-fractions': 'Dividing Fractions',
    'fraction-mult': 'Multiplying Fractions',
    'fraction-mult-whole': 'Multiplying Fractions by Whole Numbers',
    'rounding-decimals': 'Rounding Decimals',
    'estimating-sums-differences': 'Estimating Sums and Differences',
    'reward-chart': 'Weekly Reward / Sticker Chart',
    'spring-scavenger': 'Spring Scavenger Hunt',
    'summer-pack': 'Summer Fun Pack',
    'animal-pack': 'Animal Activity Pack',
    'stem-balloon-rocket': 'STEM: Balloon Rocket',
    'stem-walking-water': 'STEM: Walking Water',
    'arts-3-shape-creature': 'Arts: 3-Shape Creature',
    'ws-world': 'Word Search: World Geography',
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
      if (word === 'mult') return 'Multiplication'
      // Capitalize first letter
      return word.charAt(0).toUpperCase() + word.slice(1)
    })
    .join(' ')
}

/**
 * Infer grade from docId
 */
function inferGrade(docId: string): string[] {
  if (docId.includes('kindergarten') || docId.includes('prek') || docId.includes('pre-k') || docId === 'match-object-to-shadow') {
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
  if (docId.includes('5th-grade') || docId.includes('fifth-grade') || docId.includes('g5') || docId === 'adding-decimals-challenge') {
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
  if (docId.includes('lattice')) {
    categories.push('multiplication')
    categories.push('logic')
  }
  if (docId.includes('pattern')) {
    categories.push('patterns')
  }
  if (docId === 'match-object-to-shadow') {
    categories.push('visual-perception')
    categories.push('logic')
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
 * Generate visual examples based on worksheet type
 */
function generateVisualExamples(docId: string, name: string, category: string[]): string {
  const lowerDocId = docId.toLowerCase()
  const lowerName = name.toLowerCase()

  // Multiplication worksheets
  if (category.includes('multiplication') || lowerDocId.includes('mult')) {
    if (lowerDocId.includes('array') || lowerDocId.includes('arrays')) {
      return `📊 Visual Example (Arrays):
   Array:  ⬛⬛⬛
           ⬛⬛⬛
           ⬛⬛⬛
           
   This shows: 3 rows × 3 columns = 9

📝 Example Problems:
   [⬛⬛⬛]     = ? × ? = ?
   [⬛⬛⬛]
   [⬛⬛⬛]
   
   [⬛⬛⬛⬛]   = 2 × 4 = ?
   [⬛⬛⬛⬛]`
    } else if (lowerDocId.includes('times-table') || lowerDocId.includes('facts') || lowerDocId === 'mult-facts-0-12' || lowerDocId === 'mult-facts-1-5' || lowerDocId === 'mult-facts-6-12') {
      return `📝 Preview - Problems in this worksheet:
     6         7         9         5         8
   × 4      × 6      × 4      × 3      × 7
   ----     ----     ----     ----     ----
     ?        ?        ?        ?        ?

✨ Includes 20 multiplication problems (0×0 to 12×12)
   Each worksheet includes a worked example with strategies
   and a complete answer key.`
    } else if (lowerDocId.includes('word-problem')) {
      return `📝 Example Problem:
   "Sarah has 4 boxes. Each box has 6 apples. 
   How many apples does Sarah have in total?"
   
   Solution:
   • Draw:  [6] [6] [6] [6]
   • Count: 6 + 6 + 6 + 6 = 24
   • Or multiply: 4 × 6 = 24
   • Answer: 24 apples`
    }
  }

  // Addition/Subtraction worksheets
  if (category.includes('addition-subtraction') || lowerDocId.includes('add') || lowerDocId.includes('sub')) {
    if (lowerDocId === 'add-2digit-100' || lowerDocId === 'add-2digit-regrouping' || lowerDocId === 'sub-2digit-100' || lowerDocId === 'sub-2digit-regrouping') {
      if (lowerDocId === 'add-2digit-100') {
        return `📝 Preview - Problems in this worksheet:
    23        45        67        38        52
  + 15     + 32     + 28     + 41     + 26
  ----     ----     ----     ----     ----
    ?        ?        ?        ?        ?

✨ Includes 10 addition problems (no regrouping)
   Each worksheet includes a worked example with visual
   place value blocks and step-by-step solution.`
      } else if (lowerDocId === 'add-2digit-regrouping') {
        return `📝 Preview - Problems in this worksheet:
    27        38        49        56        63
  + 15     + 26     + 37     + 28     + 19
  ----     ----     ----     ----     ----
    ?        ?        ?        ?        ?

✨ Includes problems WITH regrouping (carrying)
   Each worksheet includes a worked example showing
   regrouping steps and visual place value blocks.`
      } else if (lowerDocId === 'sub-2digit-100') {
        return `📝 Preview - Problems in this worksheet:
    45        67        89        56        73
  - 23     - 35     - 42     - 24     - 31
  ----     ----     ----     ----     ----
    ?        ?        ?        ?        ?

✨ Includes 10 subtraction problems (no regrouping)
   Each worksheet includes a worked example with
   step-by-step solution and visual strategies.`
      } else {
        return `📝 Preview - Problems in this worksheet:
    52        63        74        81        95
  - 28     - 39     - 46     - 47     - 58
  ----     ----     ----     ----     ----
    ?        ?        ?        ?        ?

✨ Includes problems WITH regrouping (borrowing)
   Each worksheet includes a worked example showing
   regrouping steps and visual place value strategies.`
      }
    } else {
      return `📝 Example Problems:
   8 + 5 = ?     12 + 7 = ?     15 - 4 = ?

🔢 Visual Strategy (Number Line):
   0---5---10---15---20
   8 + 5 = 13
   
   Or use ten frames:
   [●●●●●●●●] [●●]  = 8 + 5 = 13
   [●●●●●] [●●●●●]`
    }
  }

  // Fractions worksheets
  if (category.includes('fractions') || lowerDocId.includes('fraction')) {
    if (lowerDocId === 'fractions-halves-thirds-fourths') {
      return `🍕 Visual Example:
   Whole Circle:  [████████]
   
   Halves:        [████] [████]     = 1/2, 2/2
   Thirds:        [███] [███] [███] = 1/3, 2/3, 3/3
   Fourths:       [██] [██] [██] [██] = 1/4, 2/4, 3/4, 4/4

📝 Example Problems:
   1. Color 1/2 of the circle
   2. Shade 2/3 of the rectangle
   3. Circle 3/4 of the objects

✨ This worksheet helps students understand fractions 
   as parts of a whole. Answer key included.`
    } else if (lowerDocId === 'adding-subtracting-fractions' || lowerDocId === 'add-sub-fractions') {
      return `📝 Preview - Problems in this worksheet:
   1/4 + 1/4 = ?     3/5 - 1/5 = ?     2/3 + 1/3 = ?
   4/6 + 1/6 = ?     5/8 - 2/8 = ?

✨ Includes problems with same denominators
   Each worksheet includes visual examples and
   step-by-step solutions in the answer key.`
    } else {
      return `🍕 Visual Example:
   Whole Circle:  [████████]
   
   Halves:        [████] [████]     = 1/2, 2/2
   Thirds:        [███] [███] [███] = 1/3, 2/3, 3/3
   Fourths:       [██] [██] [██] [██] = 1/4, 2/4, 3/4, 4/4

📝 Example Problems:
   1. Shade 3/4 of the shape
   2. Which is larger: 1/2 or 1/4?
   3. Color 2 parts out of 6 parts`
    }
  }

  // Place value worksheets
  if (lowerDocId.includes('place-value') || lowerDocId === 'place-value-hto' || lowerDocId === 'expanded-form-200') {
    if (lowerDocId === 'expanded-form-200') {
      return `📝 Preview - Problems in this worksheet:
   1. Write 247 in expanded form: ?
   2. Write 182 in expanded form: ?
   3. What is 300 + 50 + 6?  ?
   4. Write 156 in expanded form: ?

✨ Includes place value and expanded form practice
   Each worksheet includes visual place value charts
   and complete answer key.`
    } else {
      return `🔢 Visual Example:
   Number: 247
   
   Hundreds | Tens | Ones
   ---------|------|-----
      2     |  4   |  7
   (200)    | (40) | (7)
   
   Expanded form: 200 + 40 + 7 = 247

📝 Example Problems:
   1. What is the value of 5 in 357?  (Answer: 50)
   2. Write 482 in expanded form: 400 + 80 + 2
   3. Which digit is in the tens place in 129?  (Answer: 2)`
    }
  }

  // Counting worksheets
  if (category.includes('counting') || lowerDocId.includes('count')) {
    return `🔢 Visual Example:
   Count the objects:
   
   ⭐⭐⭐⭐⭐
   ⭐⭐⭐⭐⭐
   ⭐⭐⭐
   
   Total: 13 stars

📝 Example Problems:
   1. Count and write: How many circles? ○○○○○○○○
   2. Count by 2s: 2, 4, 6, 8, __, __
   3. Count by 5s: 5, 10, 15, __, __`
  }

  // Patterns worksheets
  if (category.includes('patterns') || lowerDocId.includes('pattern')) {
    return `🔢 Visual Example (AB Pattern):
   Pattern: ⬛ ⬜ ⬛ ⬜ ⬛ ⬜
   
   Continue: ⬛ ⬜ ⬛ ⬜ ⬛ ⬜ __ __

📝 Example Problems:
   1. Complete the pattern: 🔴 🔵 🔴 🔵 __ __
   2. What comes next? 2, 4, 6, 8, __, __
   3. Create your own pattern`
  }

  // Word problems
  if (category.includes('word-problems') || lowerDocId.includes('word-problem')) {
    return `📝 Example Problem:
   "Emma has 15 stickers. She gives away 7 stickers. 
   How many stickers does Emma have left?"
   
   Solution:
   • What we know: Start with 15, give away 7
   • Operation: Subtraction
   • Solve: 15 - 7 = 8
   • Answer: 8 stickers left`
  }

  if (docId === 'adding-decimals-challenge') {
    return `📝 Example Problem:
   1.25 + 3.40 = ?
   
   Step 1: Line up the decimal points!
      1.25
    + 3.40
    ------
    
   Step 2: Add from right to left
      1.25
    + 3.40
    ------
      4.65
      
   Answer: 4.65`;
  }


  // Decimals worksheets
  if (category.includes('decimals') || lowerDocId.includes('decimal')) {
    return `🔢 Visual Example:
   Decimal: 0.75
   
   Ones | Tenths | Hundredths
   -----|--------|------------
    0   |   7    |     5
        | (0.7)  |  (0.05)
   
   0.75 = 7/10 + 5/100 = 75/100

📝 Example Problems:
   1. Write 0.5 as a fraction: 5/10 = 1/2
   2. Compare: 0.3 ___ 0.30  (Answer: =)
   3. Add: 0.4 + 0.2 = ?`;
  }



  // Order of operations (PEMDAS)
  if (lowerDocId.includes('pemdas') || lowerDocId.includes('order-of-operations')) {
    return `📝 Example Problem:
   2 + 3 × 4 = ?
   
   Step 1: Multiplication first (PEMDAS)
           3 × 4 = 12
   
   Step 2: Then addition
           2 + 12 = 14
   
   Answer: 14

📝 Another Example:
   (5 + 3) × 2 = ?
   
   Step 1: Parentheses first
           (5 + 3) = 8
   
   Step 2: Then multiplication
           8 × 2 = 16
   
   Answer: 16`
  }

  // Default fallback
  return `📝 Example Problems:
   This worksheet includes practice problems to help students 
   master ${name.toLowerCase()} skills.
   
   ✨ Students will practice:
   • Problem-solving
   • Building confidence
   • Mastering key concepts`
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
    'ab-pattern', 'add-2digit-100', 'add-2digit-regrouping', 'adding-decimals-challenge', 'addition-subtraction-0-10',
    'add-sub-decimals', 'add-sub-fractions', 'add-sub-fractions-4th', 'add-sub-mixed-numbers',
    'add-three-numbers', 'animal-pack', 'area-model-mult', 'area-perimeter-4th', 'area-rectangles',
    'area-triangles-parallelograms', 'arts-3-shape-creature', 'balance-equations-10', 'bar-graphs-data',
    'bar-graphs-pictographs', 'beginning-sounds-az', 'big-small', 'bookmark-templates',
    'brain-boost', 'classifying-angles', 'classifying-quadrilaterals',
    'classifying-shapes', 'classifying-triangles', 'color-by-number', 'color-patterns',
    'color-recognition', 'color-shapes', 'coloring', 'coloring-animals', 'coloring-letters-numbers',
    'coloring-nature', 'coloring-space', 'coloring-vehicles', 'compare-2digit', 'comparing-decimals',
    'comparing-fractions', 'comparing-fractions-4th', 'comparing-ordering-fractions-decimals',
    'coordinate-graphing', 'count-circle-1-10', 'count-color-1-10', 'counting-objects-20',
    'count-match-1-20', 'count-write-30', 'creative-challenge', 'customary-conversion',
    'customary-units', 'cut-and-paste-crafts', 'cvc-words', 'decimals-place-value', 'decimal-to-percent',
    'decimal-word-problems', 'decimal-word-problems-5th', 'design-monster', 'directed-drawing-animals',
    'div-by-10-100', 'div-facts-1-12', 'dividing-decimals', 'dividing-fractions',
    'div-with-remainders', 'div-word-problems', 'dot-to-dot-1-20', 'doubles-facts',
    'doubles-near-doubles', 'draw-half', 'draw-shape',
    'elapsed-time-4th', 'elapsed-time-word-problems', 'equivalent-fractions',
    'equivalent-fractions-4th', 'estimating-sums-differences', 'evaluating-expressions',
    'even-odd-100', 'expanded-form-200', 'fact-families-20', 'fact-families-mult-div',
    'feelings-checkin', 'find-number-1-10', 'factors-multiples', 'fractions-decimals-percents', 'fractions-decimals-percents-advanced',
    'fractions-halves-thirds-fourths', 'fraction-mult', 'fraction-mult-whole', 'fractions-number-line', 'fractions-out-of-100',
    'fractions-to-decimals', 'fractions-to-decimals-basic-tenths', 'fractions-to-decimals-division',
    'fractions-whole', 'fraction-word-problems', 'fraction-word-problems-5th', 'div-fractions',
    'geo-compass-rose', 'geo-continents-k2', 'geo-landforms', 'geo-latlong',
    'geometry-word-problems', 'grammar-detective', 'gratitude-jar', 'halloween-pack',
    'heavy-light', 'hidden-object', 'how-many-1-15', 'identify-polygons',
    'identify-polygons',
    'letter-tracing-az', 'line-graphs', 'line-plots', 'lines-angles-4th',
    'lines-rays-angles', 'liquid-measurement', 'liquid-measurement-4th',
    'logic-grid', 'long-division-1digit', 'long-division-2digit', 'long-division-multidigit',
    'long-short', 'mandalas', 'mass-weight', 'mass-weight-4th', 'math-maze', 'maze-focus',
    'mean-median-mode', 'mean-median-mode-range', 'measurement-length', 'measurement-word-problems',
    'mental-math-20', 'metric-conversion', 'metric-units', 'missing-addends',
    'missing-numbers-50', 'missing-shape', 'mixed-improper-fractions', 'money-coins-bills',
    'money-word-problems', 'mood-tracker', 'more-less', 'more-less-equal-10', 'mult-2x1', 'mult-2x1-digit',
    'mult-2x2', 'mult-2x2-digit', 'mult-3x2-digit', 'mult-area-model', 'mult-arrays',
    'mult-arrays-2-5', 'mult-arrays-models', 'mult-by-10-100', 'mult-complex-word',
    'mult-fact-families', 'mult-fact-fluency', 'mult-facts-0-12', 'mult-facts-1-5',
    'mult-facts-6-12', 'multiplying-decimals', 'multiplying-fractions', 'multi-step-word-4th',
    'multi-step-word-5th', 'multi-step-word-problems', 'mult-mixed-review',
    'mult-multi-step-word', 'mult-patterns', 'mult-properties', 'mult-strategies',
    'mult-word-problems', 'mult-word-problems-2-3', 'nets-3d-shapes', 'number-bonds-10',
    'number-id-1-10', 'number-line-200', 'number-line-add', 'number-matching-1-15',
    'number-order-1-20', 'number-patterns-200', 'number-tracing-1-10', 'number-tracing-1-20',
    'ordering-fractions-decimals', 'order-of-operations', 'partial-products',
    'pattern-complete', 'patterns-rules', 'pemdas-advanced', 'pemdas-basic', 'pemdas-complex',
    'pemdas-exponents', 'pemdas-fluency', 'pemdas-mixed-review', 'pemdas-multistep',
    'pemdas-parentheses', 'pemdas-practice', 'pemdas-rules', 'pemdas-step-by-step',
    'pemdas-word-problems', 'percent-to-decimal', 'percent-word-problems',
    'perimeter-area-word-problems', 'perimeter-shapes', 'picture-addition-10',
    'place-value-hto', 'powers-of-10', 'prime-composite', 'probability', 'ratio-proportion-word-problems',
    'color-by-number', 'logic-grid', 'maze-focus', 'word-search',
    'reading-g1-ants', 'reading-g1-big-box', 'reading-g1-birthday-cake', 'reading-g1-bus-ride',
    'reading-g1-garden-snail', 'reading-g1-lost-hat', 'reading-g1-pet-fish',
    'reading-g1-red-balloon', 'reading-g2-bird-feeder', 'reading-g2-cookie-recipe',
    'reading-g2-library-card', 'reading-g2-lost-and-found', 'reading-g2-paper-bridge',
    'reading-g2-rainy-garden', 'reading-g2-tree-house', 'reading-g2-magic-seeds', 'reading-g3-art-project',
    'reading-g3-community-garden', 'reading-g3-lighthouse', 'reading-g3-school-play',
    'reading-g3-science-fair', 'reading-mini-1', 'reward-chart', 'rhyming-words', 'rounding-decimals', 'rounding-nearest-10',
    'same-different', 'science-lifecycle', 'science-match', 'sentence-building', 'shape-identification', 'shape-patterns',
    'shapes-colors-sort', 'shape-sorting', 'sight-words-pre-primer', 'size-comparison',
    'skip-count-2s', 'skip-count-5-10-120', 'skip-count-mult', 'solving-one-step-equations',
    'spelling', 'spot-difference', 'spring-scavenger', 'stem-balloon-rocket', 'stem-leaf-plots',
    'stem-walking-water', 'sub-2digit-100', 'sub-2digit-regrouping', 'sudoku4', 'sudoku6',
    'subtraction-stories', 'summer-pack', 'symmetry', 'symmetry-transformations', 'tangram-animals',
    'ten-frames-1-10', 'ten-frames-1-20', 'time-5min', 'times-table-blank-1-12', 'times-table-blank-1-5', 'times-table-blank-6-12',
    'times-table-color-1-12', 'times-table-color-1-5', 'times-table-color-6-12',
    'times-table-confidence-1-5', 'times-table-confidence-6-12', 'times-table-fluency-1-12',
    'times-table-horizontal-1-12', 'times-table-horizontal-1-5', 'times-table-horizontal-6-12',
    'times-table-missing-1-5', 'times-table-missing-6-12', 'times-table-missing-mixed',
    'times-table-mixed-review', 'times-table-timed-1-12', 'times-table-timed-1-5',
    'times-table-timed-6-12', 'times-table-vertical-1-12', 'times-table-vertical-1-5',
    'times-table-vertical-6-12', 'time-to-minute', 'transformations-5th',
    'uppercase-lowercase-match', 'volume-rectangular-prisms', 'weekly-goals', 'what-comes-next',
    'writing-expressions', 'ws-world',
    'match-object-to-shadow', 'match-the-feeling', 'reading-discovery-interactive',
    // Interactive Worksheets
    'interactive-math-rhythm', 'interactive-math-race', 'interactive-math-puzzle',
    'interactive-math-shapes', 'interactive-math-money', 'interactive-math-fractions',
    'interactive-math-measurement', 'interactive-reading-adventure', 'interactive-reading-detective',
    'interactive-reading-vocab', 'interactive-reading-summary', 'interactive-reading-compare',
    'interactive-writing-prompts', 'interactive-writing-sentences', 'interactive-writing-poetry',
    'interactive-writing-opinion', 'interactive-science-observation', 'interactive-science-lifecycle',
    'interactive-science-states', 'interactive-science-weather', 'interactive-geography-map',
    'interactive-geography-culture', 'interactive-geography-history', 'interactive-grammar-parts',
    'interactive-grammar-tenses', 'interactive-grammar-antonyms', 'interactive-art-design',
    'interactive-art-colorwheel', 'interactive-art-sketch', 'interactive-early-phonics',
    'interactive-early-counting', 'interactive-early-patterns', 'interactive-logic-sequence',
    'interactive-logic-riddles', 'interactive-logic-deduction', 'interactive-sel-mindfulness',
    'interactive-sel-empathy', 'interactive-sel-goals', 'interactive-early-basics',
    'interactive-early-foundations', 'interactive-early-letters', 'interactive-early-numbers',
    'interactive-early-shapes', 'interactive-geography-prek', 'interactive-grammar-prek',
    'interactive-logic-prek', 'interactive-reading-prek', 'interactive-reading-storymap',
    'interactive-science-prek', 'interactive-science-space', 'interactive-sel-prek',
    'interactive-writing-prek'
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

  // MANUAL OVERRIDE for Match The Feeling (Premium SEO)
  WORKSHEET_SEO_MAP['match-the-feeling'] = {
    docId: 'match-the-feeling',
    slug: 'match-the-feeling',
    title: 'Match the Feeling to the Situation - Free SEL Worksheet | Wizqo',
    metaDescription: 'Free printable Social Emotional Learning (SEL) worksheet. Help kids identify feelings like sad, happy, bored, and friendly by matching them to real-life situations.',
    keywords: 'match the feeling worksheet, social emotional learning worksheets, sel worksheets for kids, feelings and emotions worksheets, kindergarten feelings activity, identifying emotions worksheet, preschool sel printables',
    h1: 'Match the Feeling to the Situation',
    intro: 'This interactive Social Emotional Learning (SEL) worksheet helps children develop emotional intelligence by matching feelings to real-world situations. Perfect for Kindergarten and 1st Grade students to practice empathy and self-awareness.',
    grade: ['Kindergarten', '1st Grade'],
    category: ['visual-perception', 'social-emotional-learning'],
    section: 'Shapes & Colors',
    learningObjectives: ['Identify core emotions', 'Connect feelings to causes', 'Build emotional vocabulary'],
    relatedDocIds: ['match-object-to-shadow', 'feelings-checkin', 'winter-kindness']
  }

  // MANUAL OVERRIDE for Reading Discovery (High Performance SEO)
  WORKSHEET_SEO_MAP['reading-discovery-interactive'] = {
    docId: 'reading-discovery-interactive',
    slug: 'reading-discovery-interactive',
    title: 'Reading Discovery: Interactive Comprehension Worksheet | Wizqo',
    metaDescription: 'Free interactive reading comprehension worksheet for kids. Practice reading with 3 original stories, colorful 3D illustrations, and instant "Show Answer" features. Perfect for Grade 1 and 2.',
    keywords: 'reading discovery worksheet, interactive reading comprehension, free reading worksheets for kids, reading passages with questions, grade 1 reading comprehension, grade 2 reading comprehension, interactive learning worksheets, printable reading pdf',
    h1: 'Reading Discovery: Interactive Comprehension',
    intro: 'Welcome to Reading Discovery! This interactive worksheet features three original stories—Leo\'s Space Adventure, The Helpful Robot, and Mia\'s Magic Garden—designed to build reading comprehension and critical thinking skills in young learners. Use the "Show Answer" feature for interactive classroom learning or print the worksheet for quiet practice.',
    grade: ['1st Grade', '2nd Grade'],
    category: ['reading', 'visual-perception'],
    section: 'Reading',
    learningObjectives: ['Improve text comprehension', 'Identify key details in stories', 'Connect visual aids to written context', 'Build vocabulary'],
    relatedDocIds: ['reading-g1-birthday-cake', 'reading-g2-magic-seeds', 'match-the-feeling']
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
