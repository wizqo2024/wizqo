/**
 * Generate SEO data for all worksheets
 * This script reads all worksheet docIds and generates SEO-friendly metadata
 */

import * as fs from 'fs'
import * as path from 'path'

interface WorksheetData {
  docId: string
  title?: string
  description?: string
  grade?: string[]
  category?: string[]
}

/**
 * Convert docId to SEO-friendly slug
 */
function docIdToSlug(docId: string): string {
  // Handle special cases
  const specialCases: Record<string, string> = {
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
  }
  
  if (specialCases[docId]) {
    return specialCases[docId]
  }
  
  // Convert docId to readable format
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
function docIdToTitle(docId: string): string {
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
  }
  
  if (titleMap[docId]) {
    return titleMap[docId]
  }
  
  // Generate from docId
  return docId
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
    .replace(/\b(\d+)\b/g, '$1')
}

/**
 * Infer grade from docId
 */
function inferGrade(docId: string): string[] {
  if (docId.includes('kindergarten') || docId.includes('prek') || docId.includes('pre-k')) {
    return ['Kindergarten', 'Pre-K']
  }
  if (docId.includes('1st-grade') || docId.includes('first-grade')) {
    return ['1st Grade']
  }
  if (docId.includes('2nd-grade') || docId.includes('second-grade')) {
    return ['2nd Grade']
  }
  if (docId.includes('3rd-grade') || docId.includes('third-grade')) {
    return ['3rd Grade', '4th Grade']
  }
  if (docId.includes('4th-grade') || docId.includes('fourth-grade')) {
    return ['4th Grade', '5th Grade']
  }
  if (docId.includes('5th-grade') || docId.includes('fifth-grade')) {
    return ['5th Grade']
  }
  
  // Default based on content
  if (docId.includes('mult') || docId.includes('div') || docId.includes('fractions')) {
    return ['3rd Grade', '4th Grade']
  }
  if (docId.includes('count') || docId.includes('number') || docId.includes('shape')) {
    return ['Kindergarten', '1st Grade']
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
  if (docId.includes('add') || docId.includes('sub')) categories.push('addition-subtraction')
  if (docId.includes('count')) categories.push('counting')
  if (docId.includes('number')) categories.push('number-sense')
  if (docId.includes('word-problem')) categories.push('word-problems')
  if (docId.includes('geometry') || docId.includes('shape') || docId.includes('area') || docId.includes('perimeter')) {
    categories.push('geometry')
  }
  if (docId.includes('measurement') || docId.includes('time') || docId.includes('money')) {
    categories.push('measurement')
  }
  if (docId.includes('reading') || docId.includes('comprehension')) {
    categories.push('reading')
  }
  
  return categories.length > 0 ? categories : ['math']
}

/**
 * Generate SEO title
 */
function generateSEOTitle(name: string, grade?: string[]): string {
  const gradeText = grade && grade.length > 0 ? ` for ${grade[0]}` : ''
  return `${name} Worksheet${gradeText} - Free Printable PDF | Wizqo`
}

/**
 * Generate meta description
 */
function generateMetaDescription(name: string, grade: string[], category: string[]): string {
  const gradeText = grade.length > 0 ? `Perfect for ${grade.join(' and ')}. ` : ''
  const categoryText = category.length > 0 ? `${category[0]} practice. ` : ''
  return `Download free printable ${name.toLowerCase()} worksheet with answer key. ${gradeText}${categoryText}Instant PDF download.`
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
  
  const cat = category.map(c => `${c} worksheet`, `${c} worksheets`)
  const grd = grade.map(g => `${g} ${name.toLowerCase()}`, `${g} math worksheet`)
  
  return [...base, ...cat, ...grd].join(', ')
}

/**
 * Generate intro content
 */
function generateIntro(name: string, grade: string[], category: string[]): string {
  const gradeText = grade.length > 0 
    ? `This ${name.toLowerCase()} worksheet is designed for ${grade.join(' and ')} students. `
    : `This ${name.toLowerCase()} worksheet helps students `
  
  const categoryText = category.length > 0 
    ? `practice ${category[0]} skills. `
    : 'build math skills. '
  
  return `${gradeText}${categoryText}This printable worksheet includes an answer key for easy checking and is perfect for classroom use, homework, or extra practice at home. Download the free PDF instantly and start practicing today!`
}

/**
 * Main generation function
 */
function generateSEOForAllWorksheets() {
  // Read all worksheet docIds
  const docIdsFile = path.join(__dirname, '../../tmp/all_worksheets.txt')
  const docIds = fs.readFileSync(docIdsFile, 'utf-8')
    .split('\n')
    .filter(line => line.trim().length > 0)
  
  const seoData: any[] = []
  
  for (const docId of docIds) {
    const slug = docIdToSlug(docId)
    const title = docIdToTitle(docId)
    const grade = inferGrade(docId)
    const category = inferCategory(docId)
    
    seoData.push({
      docId,
      slug,
      title: generateSEOTitle(title, grade),
      metaDescription: generateMetaDescription(title, grade, category),
      keywords: generateKeywords(title, category, grade),
      h1: `${title} Worksheet`,
      intro: generateIntro(title, grade, category),
      grade,
      category,
      section: category[0] || 'Math',
      learningObjectives: [
        `Master ${title.toLowerCase()} skills`,
        `Practice ${category[0] || 'math'} concepts`,
        `Build confidence with ${title.toLowerCase()}`,
      ],
      relatedDocIds: [], // Will be populated later
    })
  }
  
  // Write to file
  const outputFile = path.join(__dirname, '../../shared/worksheetSEOData.json')
  fs.writeFileSync(outputFile, JSON.stringify(seoData, null, 2))
  
  console.log(`Generated SEO data for ${seoData.length} worksheets`)
  console.log(`Output written to: ${outputFile}`)
}

// Run if executed directly
if (require.main === module) {
  generateSEOForAllWorksheets()
}

export { generateSEOForAllWorksheets }
