const fs = require('fs');

function detectMojibake(filePath) {
    let content;
    try {
        content = fs.readFileSync(filePath, 'utf8');
    } catch (err) {
        console.error(`Error reading file: ${err.message}`);
        return;
    }

    // Common mojibake patterns in UTF-8 to CP1252/Latin-1
    // Matches sequences starting with ð (F0) or â (E2) followed by continuation bytes (80-BF) 
    // or characters that resulted from them (interpreted as Latin-1)
    const pattern = /[ðâ][\u0080-\u00bf\u00c0-\u00ff]{1,10}/g;
    const matches = content.match(pattern) || [];

    const uniqueMatches = [...new Set(matches)].sort();
    uniqueMatches.forEach(match => {
        try {
            // Simulate the double encoding issue:
            // The characters were interpreted as Latin-1, so we convert them back to bytes using Latin-1
            // and then decode those bytes as UTF-8.
            const buffer = Buffer.from(match, 'binary'); // 'binary' in Node is often used for Latin-1 equivalent bytes
            const original = buffer.toString('utf8');
            console.log(`Match: ${match} -> Suggested: ${original}`);
        } catch (err) {
            console.log(`Match: ${match} -> (Unknown)`);
        }
    });
}

const args = process.argv.slice(2);
if (args.length === 0) {
    console.log('Usage: node detect_mojibake.js <file_path>');
} else {
    detectMojibake(args[0]);
}
