/**
 * Check Worksheet Coverage
 * Compares worksheets in pages vs SEO mapping to find any missing worksheets
 */

import * as fs from 'fs'
import * as path from 'path'

// Read all docIds from pages
function getDocIdsFromPages(): string[] {
  const pagesDir = path.join(__dirname, '../client/src/pages')
  const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.tsx'))
  
  const docIds = new Set<string>()
  
  for (const file of files) {
    const content = fs.readFileSync(path.join(pagesDir, file), 'utf-8')
    const matches = content.matchAll(/docId:\s*['"]([^'"]+)['"]/g)
    for (const match of matches) {
      docIds.add(match[1])
    }
  }
  
  return Array.from(docIds).sort()
}

// Read docIds from SEO mapping
function getDocIdsFromSEO(): string[] {
  const seoFile = path.join(__dirname, '../shared/worksheetSEO.ts')
  const content = fs.readFileSync(seoFile, 'utf-8')
  
  const match = content.match(/const allDocIds = \[([\s\S]*?)\]/)
  if (!match) return []
  
  const ids = match[1]
    .split(',')
    .map(s => s.trim().replace(/['"]/g, ''))
    .filter(Boolean)
  
  return ids.sort()
}

// Main comparison
function checkCoverage() {
  console.log('🔍 Checking worksheet coverage...\n')
  
  const pageDocIds = getDocIdsFromPages()
  const seoDocIds = getDocIdsFromSEO()
  
  console.log(`📄 Worksheets in pages: ${pageDocIds.length}`)
  console.log(`📊 Worksheets in SEO mapping: ${seoDocIds.length}\n`)
  
  // Find worksheets in pages but NOT in SEO mapping
  const missingInSEO = pageDocIds.filter(id => !seoDocIds.includes(id))
  
  // Find worksheets in SEO mapping but NOT in pages
  const missingInPages = seoDocIds.filter(id => !pageDocIds.includes(id))
  
  if (missingInSEO.length > 0) {
    console.log(`❌ MISSING IN SEO MAPPING (${missingInSEO.length}):`)
    missingInSEO.forEach(id => console.log(`   - ${id}`))
    console.log()
  } else {
    console.log('✅ All worksheets from pages are in SEO mapping\n')
  }
  
  if (missingInPages.length > 0) {
    console.log(`⚠️  IN SEO MAPPING BUT NOT IN PAGES (${missingInPages.length}):`)
    missingInPages.forEach(id => console.log(`   - ${id}`))
    console.log()
  } else {
    console.log('✅ All worksheets in SEO mapping are in pages\n')
  }
  
  // Summary
  if (missingInSEO.length === 0 && missingInPages.length === 0) {
    console.log('✅ PERFECT COVERAGE! All worksheets are accounted for.')
  } else {
    console.log('⚠️  Coverage issues found. Please review above.')
  }
  
  return {
    pageDocIds,
    seoDocIds,
    missingInSEO,
    missingInPages
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  checkCoverage()
}

export { checkCoverage }
