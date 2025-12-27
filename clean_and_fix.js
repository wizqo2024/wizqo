
const fs = require('fs');
const path = require('path');

const filePath = String.raw`c:\Users\ThajulAmeerMohamedSa\OneDrive - Alpha Data LLC\Desktop\wizqo\client\src\pages\PrintablesPage.tsx`;

const replacements = {
    'Â¢': '¢',
    'â€“': '–',
    'â€”': '—',
    'âœ…': '✅',
    'Ã—': '×',
    'Ã·': '÷',
    'ðŸ’°': '💸',
    'ðŸ’¡': '💡',
    'ðŸŒŸ': '🌟',
    'ðŸ“Š': '📊',
    'ðŸ“': '📏',
    'â˜ ': '☐',
    'âž—': '➗',
    'ðŸ‘½': '👽',
    'ðŸ”«': '🔫',
    'ðŸ§ª': '🧪',
    'ðŸ”®': '🔮',
    'ðŸ¦ ': '🦟',
    'ðŸ’µ': '💸'
};

try {
    let content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split(/\r?\n/);
    const newLines = [];
    let skipMode = false;
    let deletionDone = false;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // 1. Detect Duplicate Block Start
        // Looking for the specific legacy implementation: activeDocs.includes('money-coins-bills') && (
        if (line.includes("activeDocs.includes('money-coins-bills') && (") && !line.includes("(() =>") && !deletionDone) {
            console.log(`Found duplicate block start at line ${i + 1}`);
            skipMode = true;
            continue;
        }

        // 2. Handle Skipping (Deleting)
        if (skipMode) {
            // Heuristic for end of block: 8 spaces indent + closing brace, followed by blank or next block
            if (line.trim() === '}' && line.startsWith('        }')) {
                console.log(`Found duplicate block end at line ${i + 1}`);
                skipMode = false;
                deletionDone = true;
                continue; // Don't include this closing line
            }
            // Safety: If we hit the next worksheet logic, stop deleting
            if (line.includes("activeDocs.includes('measurement-length')")) {
                console.log(`Safety catch at line ${i + 1}`);
                skipMode = false;
                deletionDone = true;
                newLines.push(line); // Include this line as it's the start of next block
                continue;
            }
            continue; // Skip this line
        }

        // 3. Fix Encoding (Global Replace)
        let fixedLine = line;
        for (const [corrupted, correct] of Object.entries(replacements)) {
            // Global replace
            fixedLine = fixedLine.split(corrupted).join(correct);
        }

        newLines.push(fixedLine);
    }

    fs.writeFileSync(filePath, newLines.join('\n'), 'utf8');
    console.log("File processed successfully via Node.js");

} catch (err) {
    console.error("Error processing file:", err);
    process.exit(1);
}
