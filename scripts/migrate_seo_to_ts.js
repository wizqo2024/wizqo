import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const jsonPath = 'c:/Users/mohamedsafran/.gemini/antigravity/scratch/wizqo/client/public/worksheet-seo-data.json';
const data = JSON.parse(readFileSync(jsonPath, 'utf8'));

let output = '';

for (const [slug, seo] of Object.entries(data)) {
    // Only include entries that have an article (richContent)
    // or that we manually optimized (Batch 1-4)
    if (seo.richContent && seo.richContent.length > 200) {
        output += `  '${slug}': {\n`;
        output += `    title: ${JSON.stringify(seo.title)},\n`;
        output += `    metaDescription: ${JSON.stringify(seo.description)},\n`;
        output += `    richContent: ${JSON.stringify(seo.richContent)}\n`;
        output += `  },\n`;
    }
}

writeFileSync('seo_migration_dump.txt', output);
console.log('Migration dump created.');
