
import re

def check_braces(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    stack = []
    
    # We need to be careful about comments and strings, but a simple counter might suffice for a rough check
    # to find the massive blocks.
    # However, ignoring regex/strings is better.
    
    # Simple state machine
    # 0: code
    # 1: single quote string
    # 2: double quote string
    # 3: backtick string
    # 4: block comment
    # 5: line comment
    
    open_braces = [] # store line numbers
    
    for i, line in enumerate(lines):
        line_num = i + 1
        j = 0
        while j < len(line):
            char = line[j]
            
            # Simple skipping of obvious strings/comments for brace counting
            # This is not a perfect parser (JSX is complex) but helps finding the big missing one
            
            if char == '{':
                stack.append(line_num)
                open_braces.append(line_num)
            elif char == '}':
                if stack:
                    stack.pop()
                    if open_braces:
                         open_braces.pop()
                else:
                    print(f"Excess closing brace at line {line_num}")
            
            j += 1

    if stack:
        print(f"Unclosed braces found. Total: {len(stack)}")
        print(f"First 10 unclosed braces opened at lines: {stack[:10]}")
        print(f"Last 10 unclosed braces opened at lines: {stack[-10:]}")
    else:
        print("Braces are balanced.")

check_braces(r"c:\Users\ThajulAmeerMohamedSa\OneDrive - Alpha Data LLC\Desktop\wizqo\client\src\pages\PrintablesPage.tsx")
