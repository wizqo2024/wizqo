
const fs = require('fs');
const path = require('path');

const filePath = "c:\\Users\\ThajulAmeerMohamedSa\\OneDrive - Alpha Data LLC\\Desktop\\wizqo\\client\\src\\pages\\PrintablesPage.tsx";

try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const stack = [];

    let inBlockComment = false;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const lineNum = i + 1;

        for (let j = 0; j < line.length; j++) {
            let char = line[j];

            // Handle block comments
            if (inBlockComment) {
                if (char === '*' && line[j + 1] === '/') {
                    inBlockComment = false;
                    j++;
                }
                continue;
            }

            if (char === '/' && line[j + 1] === '*') {
                inBlockComment = true;
                j++;
                continue;
            }

            // Handle line comments
            if (char === '/' && line[j + 1] === '/') {
                break; // skip rest of line
            }

            // Simplistic string handling (skipping single/double quotes)
            // This is fragile but might work for finding the big structural break
            if (char === '"' || char === "'" || char === "`") {
                // skip until matching quote... simplistic
                const quote = char;
                j++;
                while (j < line.length) {
                    if (line[j] === quote && line[j - 1] !== '\\') {
                        break;
                    }
                    j++;
                }
                continue;
            }

            if (char === '{') {
                stack.push(lineNum);
            } else if (char === '}') {
                if (stack.length > 0) {
                    stack.pop();
                } else {
                    console.log(`Excess closing brace at line ${lineNum}`);
                }
            }
        }
    }

    if (stack.length > 0) {
        console.log(`Unclosed braces found. Total: ${stack.length}`);
        console.log(`First 5 unclosed braces opened at lines: ${stack.slice(0, 5).join(', ')}`);
        console.log(`Last 5 unclosed braces opened at lines: ${stack.slice(-5).join(', ')}`);
    } else {
        console.log("Braces are balanced.");
    }

} catch (err) {
    console.error("Error reading file:", err);
}
