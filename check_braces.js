
const fs = require('fs');

function checkStructure(filename) {
    const content = fs.readFileSync(filename, 'utf-8');
    const stack = [];
    let inString = false;
    let stringChar = '';
    let inBlockComment = false;

    // We'll iterate char by char.
    // Handling regex via simple heuristic: / is regex if previous non-whitespace char was ( or , or = or : or [ or ! or & or | or ? or { or } or ;
    // But this is hard. We will ignore regex detection and hope braces inside regex are rare or balanced.
    // Actually, unbalanced braces in regex /foo{/ causes issues?
    // Let's assume valid JS structure generally. 

    for (let i = 0; i < content.length; i++) {
        const char = content[i];

        // Handle Block Comments
        if (inBlockComment) {
            if (char === '*' && content[i + 1] === '/') {
                inBlockComment = false;
                i++;
            }
            continue;
        }

        // Handle Strings
        if (inString) {
            if (char === stringChar) {
                // Check escape
                let backslashes = 0;
                let j = i - 1;
                while (j >= 0 && content[j] === '\\') {
                    backslashes++;
                    j--;
                }
                if (backslashes % 2 === 0) {
                    inString = false;
                }
            }
            continue;
        }

        // Check for start of comments/strings
        if (char === '/' && content[i + 1] === '/') {
            // Line comment, skip to newline
            while (i < content.length && content[i] !== '\n') {
                i++;
            }
            continue;
        }
        if (char === '/' && content[i + 1] === '*') {
            inBlockComment = true;
            i++;
            continue;
        }

        if (char === '"' || char === '\'' || char === '`') {
            inString = true;
            stringChar = char;
            continue;
        }

        // Check braces
        if (char === '{' || char === '(' || char === '[') {
            stack.push({ char, index: i });
        } else if (char === '}' || char === ')' || char === ']') {
            if (stack.length === 0) {
                console.log(`Error: Unmatched closing '${char}' at index ${i}`);
                printContext(content, i);
                return;
            }

            const last = stack.pop();
            const expected = last.char === '{' ? '}' : last.char === '(' ? ')' : ']';

            if (char !== expected) {
                console.log(`Error: Mismatched closing '${char}' at index ${i}. Expected '${expected}' covering open '${last.char}' at index ${last.index}`);
                printContext(content, i);
                return;
            }
        }
    }

    if (stack.length > 0) {
        const last = stack[stack.length - 1];
        console.log(`Error: Unclosed '${last.char}' from index ${last.index}`);
        printContext(content, last.index);
    } else {
        console.log("Structure check passed: All braces/parens balanced.");
    }
}

function printContext(content, index) {
    // Find line number
    let line = 1;
    let col = 1;
    for (let j = 0; j < index; j++) {
        if (content[j] === '\n') {
            line++;
            col = 1;
        } else {
            col++;
        }
    }
    console.log(`Line: ${line}, Col: ${col}`);

    // Print snippet
    const start = Math.max(0, index - 50);
    const end = Math.min(content.length, index + 50);
    console.log("Context:");
    console.log(content.substring(start, end));
    console.log(' '.repeat(index - start) + '^');
}

if (process.argv.length < 3) {
    console.log("Usage: node check_braces.js <filename>");
} else {
    checkStructure(process.argv[2]);
}
