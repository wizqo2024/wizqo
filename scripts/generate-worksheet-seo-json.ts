import { writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { WORKSHEET_SEO_MAP } from '../shared/worksheetSEO.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Generate a simplified JSON mapping for client-side SEO updates
const seoData: Record<string, {
  title: string
  description: string
  keywords: string
  canonicalUrl: string
}> = {}

for (const [docId, seo] of Object.entries(WORKSHEET_SEO_MAP)) {
  seoData[seo.slug] = {
    title: seo.title,
    description: seo.metaDescription,
    keywords: seo.keywords,
    canonicalUrl: `https://wizqo.com/worksheets/${seo.slug}`
  }
}

// Write to client/public directory so Vite copies it to build output
const outputPath = join(__dirname, '../client/public/worksheet-seo-data.json')
writeFileSync(outputPath, JSON.stringify(seoData, null, 2), 'utf-8')

console.log(`Generated worksheet SEO data JSON with ${Object.keys(seoData).length} worksheets`)
console.log(`Output: ${outputPath}`)
