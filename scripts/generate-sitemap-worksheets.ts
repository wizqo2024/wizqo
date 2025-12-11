/**
 * Generate sitemap_worksheets.xml for all worksheet pages
 * 
 * This script generates a sitemap containing all individual worksheet pages
 * that should be indexed by search engines.
 * 
 * Run: npx tsx scripts/generate-sitemap-worksheets.ts
 */

import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'
import { getAllWorksheetSEO } from '../shared/worksheetSEO'

function generateSitemap() {
  const worksheets = getAllWorksheetSEO()

  if (worksheets.length === 0) {
    console.error('No worksheets found. Make sure worksheetSEO.ts is properly initialized.')
    process.exit(1)
  }

  const baseUrl = 'https://wizqo.com'
  const currentDate = new Date().toISOString().split('T')[0]

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`

  // Sort worksheets by category and grade for better organization
  worksheets.sort((a, b) => {
    const categoryCompare = (a.category[0] || '').localeCompare(b.category[0] || '')
    if (categoryCompare !== 0) return categoryCompare
    return (a.grade[0] || '').localeCompare(b.grade[0] || '')
  })

  for (const worksheet of worksheets) {
    const url = `${baseUrl}/worksheets/${worksheet.slug}`
    const lastmod = currentDate
    const changefreq = 'monthly'
    const priority = '0.6'

    xml += `  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>
`
  }

  xml += `</urlset>
`

  // Write to client/public directory so Vite copies it to build output
  const __filename = fileURLToPath(import.meta.url)
  const currentDir = path.dirname(__filename)
  const outputPath = path.join(currentDir, '../client/public/sitemap_worksheets.xml')
  fs.writeFileSync(outputPath, xml, 'utf-8')

  console.log(`✅ Generated sitemap with ${worksheets.length} worksheet pages`)
  console.log(`📄 Output: ${outputPath}`)
  console.log(`\nNext steps:`)
  console.log(`1. Update robots.txt to include: Sitemap: ${baseUrl}/sitemap_worksheets.xml`)
  console.log(`2. Submit sitemap to Google Search Console`)
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('generate-sitemap-worksheets.ts')) {
  try {
    generateSitemap()
  } catch (error) {
    console.error('Error generating sitemap:', error)
    process.exit(1)
  }
}

export { generateSitemap }
