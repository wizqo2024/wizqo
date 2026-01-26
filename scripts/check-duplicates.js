const fs = require('fs');
const path = require('path');

const filePath = process.argv[2];
if (!filePath) {
    console.error('Please provide a file path');
    process.exit(1);
}

const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

const manualContentStart = lines.findIndex(l => l.includes('const WORKSHEET_MANUAL_CONTENT'));
const manualContentEnd = lines.findIndex(l => l.includes('export const HUB_SEO_DATA'));

if (manualContentStart === -1 || manualContentEnd === -1) {
    console.error('Could not find WORKSHEET_MANUAL_CONTENT block');
    // process.exit(1);
}

const keyRegex = /^\s*['"]?([a-zA-Z0-9-]+)['"]?:\s*{/g;
const keys = new Map();
const duplicates = [];

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    let match;
    while ((match = keyRegex.exec(line)) !== null) {
        const key = match[1];
        if (keys.has(key)) {
            duplicates.push({ key, line: i + 1, prevLine: keys.get(key) });
        } else {
            keys.set(key, i + 1);
        }
    }
}

if (duplicates.length > 0) {
    console.log('Found duplicate keys:');
    duplicates.forEach(d => {
        console.log(`- "${d.key}" at line ${d.line} (previously at line ${d.prevLine})`);
    });
} else {
    console.log('No duplicate keys found.');
}
