const fs = require('fs');
const content = fs.readFileSync('c:/Users/ThajulAmeerMohamedSa/OneDrive - Alpha Data LLC/Desktop/wizqo/client/src/pages/PrintablesPage.tsx', 'utf8');

let curly = 0;
let square = 0;
let paren = 0;
let inString = null;
let inComment = false;
let inRegex = false;

for (let i = 0; i < content.length; i++) {
    const char = content[i];
    const next = content[i + 1];

    if (inComment) {
        if (inComment === 'line' && char === '\n') inComment = false;
        if (inComment === 'block' && char === '*' && next === '/') {
            inComment = false;
            i++;
        }
        continue;
    }

    if (inString) {
        if (char === inString && content[i - 1] !== '\\') inString = null;
        continue;
    }

    if (char === '/' && next === '/') { inComment = 'line'; continue; }
    if (char === '/' && next === '*') { inComment = 'block'; i++; continue; }

    if (char === "'" || char === '"' || char === '`') {
        inString = char;
        continue;
    }

    if (char === '{') curly++;
    if (char === '}') curly--;
    if (char === '[') square++;
    if (char === ']') square--;
    if (char === '(') paren++;
    if (char === ')') paren--;

    if (curly < 0 || square < 0 || paren < 0) {
        console.log(`Balance error at index ${i}: char=${char}, curly=${curly}, square=${square}, paren=${paren}`);
        // Show some context
        console.log('Context:', content.substring(i - 50, i + 50));
        break;
    }
}

console.log(`Final counts: curly=${curly}, square=${square}, paren=${paren}`);
