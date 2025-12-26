
import sys

def check_structure(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    stack = []
    in_string = False
    string_char = ''
    in_comment = False  # // style
    in_block_comment = False # /* style
    
    lines = content.split('\n')
    
    for line_idx, line in enumerate(lines):
        i = 0
        while i < len(line):
            char = line[i]
            
            # Handle comments and strings
            if in_block_comment:
                if char == '*' and i + 1 < len(line) and line[i+1] == '/':
                    in_block_comment = False
                    i += 1
                i += 1
                continue
            
            if in_string:
                if char == string_char:
                    # Check for escaped quote
                    if i > 0 and line[i-1] == '\\':
                        # Handle \\" (escaped backslash before quote)
                        backslashes = 0
                        j = i - 1
                        while j >= 0 and line[j] == '\\':
                            backslashes += 1
                            j -= 1
                        if backslashes % 2 == 0:
                            # It's an escaped quote
                            pass
                        else:
                            in_string = False
                    else:
                        in_string = False
                i += 1
                continue
                
            if in_comment:
                # Comments end at newline (implied by iterating lines)
                break
                
            # Check for start of comments/strings
            if char == '/' and i + 1 < len(line) and line[i+1] == '/':
                in_comment = True
                break
            if char == '/' and i + 1 < len(line) and line[i+1] == '*':
                in_block_comment = True
                i += 2
                continue
            
            if char in ['"', "'", '`']:
                in_string = True
                string_char = char
                i += 1
                continue
                
            # Check braces
            if char in ['{', '(', '[']:
                stack.append((char, line_idx + 1, i + 1))
            elif char in ['}', ')', ']']:
                if not stack:
                    print(f"Error: Unmatched closing '{char}' at line {line_idx + 1} col {i + 1}")
                    return
                
                last_open, last_line, last_col = stack.pop()
                expected = '}' if last_open == '{' else ')' if last_open == '(' else ']'
                if char != expected:
                    print(f"Error: Mismatched closing '{char}' at line {line_idx + 1} col {i + 1}. Expected '{expected}' covering open '{last_open}' from line {last_line} col {last_col}")
                    return
            
            i += 1
        
        in_comment = False # Reset single line comment at end of line

    if stack:
        last_open, last_line, last_col = stack[-1]
        print(f"Error: Unclosed '{last_open}' from line {last_line} col {last_col}")
    else:
        print("Structure check passed: All braces/parens balanced.")

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python check_braces.py <filename>")
    else:
        check_structure(sys.argv[1])
