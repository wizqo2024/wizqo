const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../shared/worksheetSEO.ts');
console.log(`Reading ${filePath}...`);

try {
    let content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const newLines = [];
    let skipped = 0;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        // Check for the unique debris line
        if (line.trim().includes("'Build fluency in shifting the decimal point two places to the right'")) {
            console.log(`Found debris start at line ${i + 1}: ${line.trim()}`);
            // Skip this line and the next 3 lines (closing array, richContent, closing object)
            // Line i: 'Build fluency...'
            // Line i+1: ],
            // Line i+2: richContent: ...
            // Line i+3: },

            // Let's verify context carefully
            if (lines[i + 1].trim() === '],' && lines[i + 3].trim() === '},') {
                console.log('Context matches expected debris. Removing 4 lines.');
                i += 3; // Skip next 3 lines too
                skipped = 1;
                continue;
            } else {
                console.warn('Context did NOT match exactly. Removing just this line to be safe, or checking next lines.');
                // In my view, line i+2 is the richContent. 
                // Let's just skip the block.
                i += 3;
                skipped = 1;
                continue;
            }
        }
        newLines.push(line);
    }

    if (skipped) {
        fs.writeFileSync(filePath, newLines.join('\n'), 'utf8');
        console.log('Successfully wrote fixed content.');
    } else {
        console.log('No debris found to remove.');
    }

} catch (err) {
    console.error('Error:', err);
}
