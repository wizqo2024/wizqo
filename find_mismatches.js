
import fs from 'fs';
import path from 'path';

const content = fs.readFileSync('./shared/worksheetSEO.ts', 'utf8');

// Extract allDocIds
const allDocIdsMatch = content.match(/const allDocIds = \[[^\]]*?\]/s);
const allDocIds = allDocIdsMatch[0]
    .replace('const allDocIds = [', '')
    .replace(']', '')
    .split(',')
    .map(id => id.trim().replace(/'/g, '').replace(/"/g, ''))
    .filter(id => id.length > 0);

// Extract WORKSHEET_MANUAL_CONTENT keys
const manualKeys = [];
const manualContentSection = content.match(/export const WORKSHEET_MANUAL_CONTENT: Record<string, Partial<WorksheetSEO>> = \{([\s\S]*?)\n\};/);
if (manualContentSection) {
    const lines = manualContentSection[1].split('\n');
    for (const line of lines) {
        const keyMatch = line.match(/^\s*'(.*)':\s*\{/);
        if (keyMatch) {
            manualKeys.push(keyMatch[1]);
        }
    }
}

const docIdSet = new Set(allDocIds);
const mismatches = manualKeys.filter(key => !docIdSet.has(key));

console.log('Mismatched keys (in WORKSHEET_MANUAL_CONTENT but not in allDocIds):');
mismatches.forEach(key => console.log(key));

// Also check for docIds that SHOULD have manual content but don't (optional, but helpful)
// For now, let's just fix the mismatches.
