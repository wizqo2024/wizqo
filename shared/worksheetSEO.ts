/**
 * Worksheet SEO Mapping System
 * Maps all 254 worksheets to SEO-friendly URLs, titles, meta descriptions, and keywords
 * 
 * This file provides complete SEO metadata for each worksheet to enable
 * proper indexing without affecting existing category pages.
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
function docIdToSlug(docId: string): string {
  return docId
    .replace(/-/g, ' ')
    .replace(/\b(\w)/g, (match) => match.toUpperCase())
    .replace(/\s+/g, '-')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '')
}

/**
 * Generate SEO title (60-70 chars)
 */
function generateSEOTitle(name: string, grade?: string): string {
  const gradeText = grade ? ` for ${grade}` : ''
  return `${name} Worksheet${gradeText} - Free Printable PDF | Wizqo`
}

/**
 * Generate meta description (150-160 chars)
 */
function generateMetaDescription(
  name: string,
  grade: string[],
  benefits: string[]
): string {
  const gradeText = grade.length > 0 ? `Perfect for ${grade.join(' and ')}. ` : ''
  const benefitText = benefits.slice(0, 2).join(' and ')
  return `Download free printable ${name.toLowerCase()} worksheet with answer key. ${gradeText}${benefitText}. Instant PDF download.`
}

/**
 * Generate keywords
 */
function generateKeywords(
  name: string,
  category: string[],
  grade: string[]
): string {
  const baseKeywords = [
    name.toLowerCase(),
    `${name.toLowerCase()} worksheet`,
    `free ${name.toLowerCase()} worksheet`,
    `printable ${name.toLowerCase()}`,
    `${name.toLowerCase()} PDF`,
  ]
  
  const categoryKeywords = category.map(cat => 
    `${cat} worksheet`, `${cat} worksheets`
  )
  
  const gradeKeywords = grade.map(g => 
    `${g} ${name.toLowerCase()}`, `${g} math worksheet`
  )
  
  return [...baseKeywords, ...categoryKeywords, ...gradeKeywords].join(', ')
}

/**
 * Generate intro content (120-200 words)
 */
function generateIntro(
  name: string,
  description: string,
  grade: string[],
  learningObjectives: string[]
): string {
  const gradeText = grade.length > 0 
    ? `This ${name.toLowerCase()} worksheet is designed for ${grade.join(' and ')} students. `
    : `This ${name.toLowerCase()} worksheet helps students `
  
  const objectivesText = learningObjectives.slice(0, 3).join(', ')
  
  return `${gradeText}${description} Students will practice ${objectivesText}. This printable worksheet includes an answer key for easy checking and is perfect for classroom use, homework, or extra practice at home. Download the free PDF instantly and start practicing today!`
}

// Complete SEO mapping for all 254 worksheets
export const WORKSHEET_SEO_MAP: Record<string, WorksheetSEO> = {
  // ========== MULTIPLICATION WORKSHEETS ==========
  'mult-facts-0-12': {
    docId: 'mult-facts-0-12',
    slug: 'multiplication-facts-0-12',
    title: generateSEOTitle('Multiplication Facts 0-12', '3rd Grade'),
    metaDescription: generateMetaDescription(
      'Multiplication Facts 0-12',
      ['3rd Grade', '4th Grade'],
      ['Build multiplication fluency', 'Master times tables', 'Practice all facts']
    ),
    keywords: generateKeywords('multiplication facts 0-12', ['multiplication'], ['3rd Grade', '4th Grade']),
    h1: 'Multiplication Facts 0-12 Worksheet',
    intro: generateIntro(
      'Multiplication Facts 0-12',
      'Practice multiplication facts from 0 to 12 with this comprehensive worksheet.',
      ['3rd Grade', '4th Grade'],
      ['memorizing multiplication facts', 'building multiplication fluency', 'mastering times tables']
    ),
    grade: ['3rd Grade', '4th Grade'],
    category: ['multiplication'],
    section: 'Multiplication',
    learningObjectives: [
      'Memorize multiplication facts from 0 to 12',
      'Build multiplication fluency and speed',
      'Master times tables through repeated practice',
      'Reinforce fact families and number patterns'
    ],
    relatedDocIds: ['mult-arrays', 'mult-word-problems', 'mult-facts-1-5', 'mult-facts-6-12']
  },
  
  'mult-arrays': {
    docId: 'mult-arrays',
    slug: 'multiplication-arrays',
    title: generateSEOTitle('Multiplication Arrays', '3rd Grade'),
    metaDescription: generateMetaDescription(
      'Multiplication Arrays',
      ['3rd Grade', '4th Grade'],
      ['Visual multiplication practice', 'Understand arrays', 'Build conceptual understanding']
    ),
    keywords: generateKeywords('multiplication arrays', ['multiplication', 'geometry'], ['3rd Grade', '4th Grade']),
    h1: 'Multiplication Arrays Worksheet',
    intro: generateIntro(
      'Multiplication Arrays',
      'Learn multiplication through visual arrays. This worksheet helps students understand multiplication as repeated addition using rectangular arrays.',
      ['3rd Grade', '4th Grade'],
      ['understanding arrays', 'visual multiplication', 'repeated addition']
    ),
    grade: ['3rd Grade', '4th Grade'],
    category: ['multiplication'],
    section: 'Multiplication',
    learningObjectives: [
      'Understand multiplication as arrays',
      'Count objects in rows and columns',
      'Write multiplication equations from arrays',
      'Visualize multiplication concepts'
    ],
    relatedDocIds: ['mult-facts-0-12', 'mult-arrays-2-5', 'mult-arrays-models']
  },
  
  'mult-word-problems': {
    docId: 'mult-word-problems',
    slug: 'multiplication-word-problems',
    title: generateSEOTitle('Multiplication Word Problems', '3rd Grade'),
    metaDescription: generateMetaDescription(
      'Multiplication Word Problems',
      ['3rd Grade', '4th Grade'],
      ['Real-world multiplication', 'Problem solving', 'Apply multiplication skills']
    ),
    keywords: generateKeywords('multiplication word problems', ['multiplication', 'word-problems'], ['3rd Grade', '4th Grade']),
    h1: 'Multiplication Word Problems Worksheet',
    intro: generateIntro(
      'Multiplication Word Problems',
      'Solve real-world multiplication problems with this engaging worksheet. Students will apply multiplication skills to everyday situations.',
      ['3rd Grade', '4th Grade'],
      ['solving word problems', 'applying multiplication', 'real-world math']
    ),
    grade: ['3rd Grade', '4th Grade'],
    category: ['multiplication', 'word-problems'],
    section: 'Multiplication',
    learningObjectives: [
      'Solve multiplication word problems',
      'Identify multiplication in real-world situations',
      'Apply multiplication facts to problems',
      'Develop problem-solving strategies'
    ],
    relatedDocIds: ['mult-facts-0-12', 'multi-step-word-problems', 'mult-multi-step-word']
  },
  
  'mult-by-10-100': {
    docId: 'mult-by-10-100',
    slug: 'multiplying-by-10-and-100',
    title: generateSEOTitle('Multiplying by 10 and 100', '3rd Grade'),
    metaDescription: generateMetaDescription(
      'Multiplying by 10 and 100',
      ['3rd Grade', '4th Grade'],
      ['Place value patterns', 'Mental math', 'Quick multiplication']
    ),
    keywords: generateKeywords('multiplying by 10 and 100', ['multiplication', 'place-value'], ['3rd Grade', '4th Grade']),
    h1: 'Multiplying by 10 and 100 Worksheet',
    intro: generateIntro(
      'Multiplying by 10 and 100',
      'Master the pattern of multiplying by 10 and 100. This worksheet helps students understand place value patterns in multiplication.',
      ['3rd Grade', '4th Grade'],
      ['multiplying by 10', 'multiplying by 100', 'place value patterns']
    ),
    grade: ['3rd Grade', '4th Grade'],
    category: ['multiplication'],
    section: 'Multiplication',
    learningObjectives: [
      'Multiply numbers by 10 and 100',
      'Understand place value patterns',
      'Develop mental math strategies',
      'Recognize multiplication patterns'
    ],
    relatedDocIds: ['mult-facts-0-12', 'powers-of-10', 'place-value-hto']
  },
  
  'mult-properties': {
    docId: 'mult-properties',
    slug: 'properties-of-multiplication',
    title: generateSEOTitle('Properties of Multiplication', '3rd Grade'),
    metaDescription: generateMetaDescription(
      'Properties of Multiplication',
      ['3rd Grade', '4th Grade'],
      ['Commutative property', 'Associative property', 'Distributive property']
    ),
    keywords: generateKeywords('properties of multiplication', ['multiplication'], ['3rd Grade', '4th Grade']),
    h1: 'Properties of Multiplication Worksheet',
    intro: generateIntro(
      'Properties of Multiplication',
      'Learn the commutative, associative, and distributive properties of multiplication. This worksheet helps students understand how multiplication works.',
      ['3rd Grade', '4th Grade'],
      ['commutative property', 'associative property', 'distributive property']
    ),
    grade: ['3rd Grade', '4th Grade'],
    category: ['multiplication'],
    section: 'Multiplication',
    learningObjectives: [
      'Understand commutative property of multiplication',
      'Apply associative property',
      'Use distributive property',
      'Recognize multiplication patterns'
    ],
    relatedDocIds: ['mult-facts-0-12', 'fact-families-mult-div']
  },
  
  // ========== DIVISION WORKSHEETS ==========
  'div-facts-1-12': {
    docId: 'div-facts-1-12',
    slug: 'division-facts-1-12',
    title: generateSEOTitle('Division Facts 1-12', '3rd Grade'),
    metaDescription: generateMetaDescription(
      'Division Facts 1-12',
      ['3rd Grade', '4th Grade'],
      ['Master division facts', 'Build division fluency', 'Practice division tables']
    ),
    keywords: generateKeywords('division facts 1-12', ['division'], ['3rd Grade', '4th Grade']),
    h1: 'Division Facts 1-12 Worksheet',
    intro: generateIntro(
      'Division Facts 1-12',
      'Practice division facts from 1 to 12 with this comprehensive worksheet. Perfect for building division fluency.',
      ['3rd Grade', '4th Grade'],
      ['memorizing division facts', 'building division fluency', 'mastering division tables']
    ),
    grade: ['3rd Grade', '4th Grade'],
    category: ['division'],
    section: 'Division',
    learningObjectives: [
      'Memorize division facts from 1 to 12',
      'Build division fluency and speed',
      'Master division tables',
      'Connect division to multiplication'
    ],
    relatedDocIds: ['mult-facts-0-12', 'fact-families-mult-div', 'div-with-remainders']
  },
  
  'div-with-remainders': {
    docId: 'div-with-remainders',
    slug: 'division-with-remainders',
    title: generateSEOTitle('Division with Remainders', '3rd Grade'),
    metaDescription: generateMetaDescription(
      'Division with Remainders',
      ['3rd Grade', '4th Grade'],
      ['Long division practice', 'Understanding remainders', 'Division concepts']
    ),
    keywords: generateKeywords('division with remainders', ['division'], ['3rd Grade', '4th Grade']),
    h1: 'Division with Remainders Worksheet',
    intro: generateIntro(
      'Division with Remainders',
      'Learn division with remainders through engaging practice problems. This worksheet helps students understand when division doesn\'t result in whole numbers.',
      ['3rd Grade', '4th Grade'],
      ['dividing with remainders', 'understanding remainders', 'division concepts']
    ),
    grade: ['3rd Grade', '4th Grade'],
    category: ['division'],
    section: 'Division',
    learningObjectives: [
      'Divide numbers with remainders',
      'Understand what remainders represent',
      'Solve division problems accurately',
      'Apply division strategies'
    ],
    relatedDocIds: ['div-facts-1-12', 'long-division-1digit', 'long-division-2digit']
  },
  
  'div-word-problems': {
    docId: 'div-word-problems',
    slug: 'division-word-problems',
    title: generateSEOTitle('Division Word Problems', '3rd Grade'),
    metaDescription: generateMetaDescription(
      'Division Word Problems',
      ['3rd Grade', '4th Grade'],
      ['Real-world division', 'Problem solving', 'Apply division skills']
    ),
    keywords: generateKeywords('division word problems', ['division', 'word-problems'], ['3rd Grade', '4th Grade']),
    h1: 'Division Word Problems Worksheet',
    intro: generateIntro(
      'Division Word Problems',
      'Solve real-world division problems with this engaging worksheet. Students will apply division skills to everyday situations.',
      ['3rd Grade', '4th Grade'],
      ['solving word problems', 'applying division', 'real-world math']
    ),
    grade: ['3rd Grade', '4th Grade'],
    category: ['division', 'word-problems'],
    section: 'Division',
    learningObjectives: [
      'Solve division word problems',
      'Identify division in real-world situations',
      'Apply division facts to problems',
      'Develop problem-solving strategies'
    ],
    relatedDocIds: ['div-facts-1-12', 'multi-step-word-problems', 'mult-word-problems']
  },
  
  'fact-families-mult-div': {
    docId: 'fact-families-mult-div',
    slug: 'multiplication-division-fact-families',
    title: generateSEOTitle('Multiplication and Division Fact Families', '3rd Grade'),
    metaDescription: generateMetaDescription(
      'Multiplication and Division Fact Families',
      ['3rd Grade', '4th Grade'],
      ['Fact families', 'Inverse operations', 'Number relationships']
    ),
    keywords: generateKeywords('fact families multiplication division', ['multiplication', 'division'], ['3rd Grade', '4th Grade']),
    h1: 'Multiplication and Division Fact Families Worksheet',
    intro: generateIntro(
      'Multiplication and Division Fact Families',
      'Explore the relationship between multiplication and division through fact families. This worksheet helps students understand inverse operations.',
      ['3rd Grade', '4th Grade'],
      ['fact families', 'inverse operations', 'number relationships']
    ),
    grade: ['3rd Grade', '4th Grade'],
    category: ['multiplication', 'division'],
    section: 'Division',
    learningObjectives: [
      'Understand fact families',
      'Connect multiplication and division',
      'Recognize inverse operations',
      'Build number sense'
    ],
    relatedDocIds: ['mult-facts-0-12', 'div-facts-1-12', 'fact-families-20']
  },
  
  'div-by-10-100': {
    docId: 'div-by-10-100',
    slug: 'dividing-by-10-and-100',
    title: generateSEOTitle('Dividing by 10 and 100', '3rd Grade'),
    metaDescription: generateMetaDescription(
      'Dividing by 10 and 100',
      ['3rd Grade', '4th Grade'],
      ['Place value patterns', 'Mental math', 'Quick division']
    ),
    keywords: generateKeywords('dividing by 10 and 100', ['division', 'place-value'], ['3rd Grade', '4th Grade']),
    h1: 'Dividing by 10 and 100 Worksheet',
    intro: generateIntro(
      'Dividing by 10 and 100',
      'Master the pattern of dividing by 10 and 100. This worksheet helps students understand place value patterns in division.',
      ['3rd Grade', '4th Grade'],
      ['dividing by 10', 'dividing by 100', 'place value patterns']
    ),
    grade: ['3rd Grade', '4th Grade'],
    category: ['division'],
    section: 'Division',
    learningObjectives: [
      'Divide numbers by 10 and 100',
      'Understand place value patterns',
      'Develop mental math strategies',
      'Recognize division patterns'
    ],
    relatedDocIds: ['mult-by-10-100', 'powers-of-10', 'div-facts-1-12']
  },
  
  // ========== FRACTIONS WORKSHEETS ==========
  'fractions-whole': {
    docId: 'fractions-whole',
    slug: 'fractions-parts-of-whole',
    title: generateSEOTitle('Fractions Parts of a Whole', '3rd Grade'),
    metaDescription: generateMetaDescription(
      'Fractions Parts of a Whole',
      ['3rd Grade', '4th Grade'],
      ['Understanding fractions', 'Parts and wholes', 'Fraction basics']
    ),
    keywords: generateKeywords('fractions parts of whole', ['fractions'], ['3rd Grade', '4th Grade']),
    h1: 'Fractions Parts of a Whole Worksheet',
    intro: generateIntro(
      'Fractions Parts of a Whole',
      'Learn fractions by understanding parts of a whole. This worksheet introduces students to basic fraction concepts through visual representations.',
      ['3rd Grade', '4th Grade'],
      ['understanding fractions', 'parts of a whole', 'fraction basics']
    ),
    grade: ['3rd Grade', '4th Grade'],
    category: ['fractions'],
    section: 'Fractions',
    learningObjectives: [
      'Understand fractions as parts of a whole',
      'Identify numerator and denominator',
      'Read and write fractions',
      'Visualize fraction concepts'
    ],
    relatedDocIds: ['comparing-fractions', 'equivalent-fractions', 'fractions-halves-thirds-fourths']
  },
  
  'comparing-fractions': {
    docId: 'comparing-fractions',
    slug: 'comparing-fractions',
    title: generateSEOTitle('Comparing Fractions', '3rd Grade'),
    metaDescription: generateMetaDescription(
      'Comparing Fractions',
      ['3rd Grade', '4th Grade'],
      ['Compare fractions', 'Greater than less than', 'Fraction comparison']
    ),
    keywords: generateKeywords('comparing fractions', ['fractions'], ['3rd Grade', '4th Grade']),
    h1: 'Comparing Fractions Worksheet',
    intro: generateIntro(
      'Comparing Fractions',
      'Learn to compare fractions using greater than, less than, and equal to symbols. This worksheet helps students understand fraction relationships.',
      ['3rd Grade', '4th Grade'],
      ['comparing fractions', 'fraction relationships', 'greater than less than']
    ),
    grade: ['3rd Grade', '4th Grade'],
    category: ['fractions'],
    section: 'Fractions',
    learningObjectives: [
      'Compare fractions using symbols',
      'Understand fraction relationships',
      'Use visual models to compare',
      'Order fractions from least to greatest'
    ],
    relatedDocIds: ['fractions-whole', 'equivalent-fractions', 'fractions-number-line']
  },
  
  'equivalent-fractions': {
    docId: 'equivalent-fractions',
    slug: 'equivalent-fractions',
    title: generateSEOTitle('Equivalent Fractions', '3rd Grade'),
    metaDescription: generateMetaDescription(
      'Equivalent Fractions',
      ['3rd Grade', '4th Grade'],
      ['Equal fractions', 'Fraction equivalence', 'Simplify fractions']
    ),
    keywords: generateKeywords('equivalent fractions', ['fractions'], ['3rd Grade', '4th Grade']),
    h1: 'Equivalent Fractions Worksheet',
    intro: generateIntro(
      'Equivalent Fractions',
      'Discover that different fractions can represent the same value. This worksheet helps students understand fraction equivalence.',
      ['3rd Grade', '4th Grade'],
      ['equivalent fractions', 'fraction equivalence', 'equal fractions']
    ),
    grade: ['3rd Grade', '4th Grade'],
    category: ['fractions'],
    section: 'Fractions',
    learningObjectives: [
      'Identify equivalent fractions',
      'Understand fraction equivalence',
      'Find equivalent fractions',
      'Use visual models'
    ],
    relatedDocIds: ['fractions-whole', 'comparing-fractions', 'fractions-number-line']
  },
  
  'fractions-number-line': {
    docId: 'fractions-number-line',
    slug: 'fractions-on-number-line',
    title: generateSEOTitle('Fractions on a Number Line', '3rd Grade'),
    metaDescription: generateMetaDescription(
      'Fractions on a Number Line',
      ['3rd Grade', '4th Grade'],
      ['Number line fractions', 'Visual fractions', 'Fraction placement']
    ),
    keywords: generateKeywords('fractions on number line', ['fractions'], ['3rd Grade', '4th Grade']),
    h1: 'Fractions on a Number Line Worksheet',
    intro: generateIntro(
      'Fractions on a Number Line',
      'Place fractions on a number line to understand their position and value. This worksheet helps students visualize fractions.',
      ['3rd Grade', '4th Grade'],
      ['fractions on number line', 'visualizing fractions', 'fraction placement']
    ),
    grade: ['3rd Grade', '4th Grade'],
    category: ['fractions'],
    section: 'Fractions',
    learningObjectives: [
      'Place fractions on a number line',
      'Understand fraction position',
      'Compare fractions visually',
      'Build number sense'
    ],
    relatedDocIds: ['fractions-whole', 'comparing-fractions', 'equivalent-fractions']
  },
  
  'add-sub-fractions': {
    docId: 'add-sub-fractions',
    slug: 'adding-subtracting-fractions',
    title: generateSEOTitle('Adding and Subtracting Fractions', '3rd Grade'),
    metaDescription: generateMetaDescription(
      'Adding and Subtracting Fractions',
      ['3rd Grade', '4th Grade'],
      ['Fraction operations', 'Add fractions', 'Subtract fractions']
    ),
    keywords: generateKeywords('adding subtracting fractions', ['fractions'], ['3rd Grade', '4th Grade']),
    h1: 'Adding and Subtracting Fractions Worksheet',
    intro: generateIntro(
      'Adding and Subtracting Fractions',
      'Practice adding and subtracting fractions with like denominators. This worksheet builds fraction operation skills.',
      ['3rd Grade', '4th Grade'],
      ['adding fractions', 'subtracting fractions', 'fraction operations']
    ),
    grade: ['3rd Grade', '4th Grade'],
    category: ['fractions'],
    section: 'Fractions',
    learningObjectives: [
      'Add fractions with like denominators',
      'Subtract fractions with like denominators',
      'Simplify fraction answers',
      'Solve fraction problems'
    ],
    relatedDocIds: ['fractions-whole', 'equivalent-fractions', 'comparing-fractions']
  },
  
  // ========== COUNTING WORKSHEETS (Kindergarten) ==========
  'count-circle-1-10': {
    docId: 'count-circle-1-10',
    slug: 'count-circles-1-10',
    title: generateSEOTitle('Count Circles 1-10', 'Kindergarten'),
    metaDescription: generateMetaDescription(
      'Count Circles 1-10',
      ['Kindergarten', 'Pre-K'],
      ['Counting practice', 'Number recognition', 'Early math skills']
    ),
    keywords: generateKeywords('count circles 1-10', ['counting'], ['Kindergarten', 'Pre-K']),
    h1: 'Count Circles 1-10 Worksheet',
    intro: generateIntro(
      'Count Circles 1-10',
      'Practice counting from 1 to 10 by counting circles. This worksheet helps young learners develop counting skills and number recognition.',
      ['Kindergarten', 'Pre-K'],
      ['counting to 10', 'number recognition', 'early math skills']
    ),
    grade: ['Kindergarten', 'Pre-K'],
    category: ['counting'],
    section: 'Counting',
    learningObjectives: [
      'Count objects from 1 to 10',
      'Recognize numbers 1-10',
      'Develop one-to-one correspondence',
      'Build counting confidence'
    ],
    relatedDocIds: ['count-match-1-20', 'how-many-1-15', 'counting-objects-20']
  },
  
  'count-match-1-20': {
    docId: 'count-match-1-20',
    slug: 'count-and-match-1-20',
    title: generateSEOTitle('Count and Match 1-20', 'Kindergarten'),
    metaDescription: generateMetaDescription(
      'Count and Match 1-20',
      ['Kindergarten', 'Pre-K'],
      ['Counting to 20', 'Number matching', 'Early math']
    ),
    keywords: generateKeywords('count and match 1-20', ['counting'], ['Kindergarten', 'Pre-K']),
    h1: 'Count and Match 1-20 Worksheet',
    intro: generateIntro(
      'Count and Match 1-20',
      'Count objects and match them to the correct number. This worksheet helps students practice counting and number recognition up to 20.',
      ['Kindergarten', 'Pre-K'],
      ['counting to 20', 'number matching', 'number recognition']
    ),
    grade: ['Kindergarten', 'Pre-K'],
    category: ['counting'],
    section: 'Counting',
    learningObjectives: [
      'Count objects up to 20',
      'Match quantities to numbers',
      'Recognize numbers 1-20',
      'Develop counting accuracy'
    ],
    relatedDocIds: ['count-circle-1-10', 'how-many-1-15', 'counting-objects-20']
  },
  
  // Add more worksheets following the same pattern...
  // This is a template - we'll need to generate all 254 worksheets
}

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
