import sys
import re

def check_braces(filename):
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            lines = f.readlines()
    except Exception as e:
        print(f"Error reading file: {e}")
        return

    stack = []
    # Simplified regex to strip strings and comments roughly
    # limitations: won't handle nested template literals perfectly if they contain braces
    # but good enough for finding blatant missing braces.
    
    clean_lines = []
    for line in lines:
        # Remove // comments
        line = re.sub(r'//.*', '', line)
        # Remove strings (simple) - this is risky for code with " or ' inside strings
        # But let's try to just count braces that aren't in strings if possible.
        # A simple state matching is better.
        clean_lines.append(line)

    line_num = 0
    col_num = 0
    in_string = False
    string_char = ''
    in_comment = False # /* */

    # This loop is a very basic parser
    for i, line in enumerate(lines):
        j = 0
        while j < len(line):
            char = line[j]
            
            # Handle comments
            if not in_string and not in_comment:
                if line[j:j+2] == '//':
                    break # ignore rest of line
                if line[j:j+2] == '/*':
                    in_comment = True
                    j += 1
                    continue
            
            if in_comment:
                if line[j:j+2] == '*/':
                    in_comment = False
                    j += 1
                j += 1
                continue

            # Handle strings
            if in_string:
                if char == string_char:
                    # check for escape
                    if j > 0 and line[j-1] == '\\' and not (j > 1 and line[j-2] == '\\'):
                        pass # escaped
                    else:
                        in_string = False
            else:
                if char in "\"'`":
                    in_string = True
                    string_char = char
                
                # Handle braces
                elif char in '({[':
                    stack.append((char, i+1, j+1))
                elif char in ')}]':
                    if not stack:
                        print(f"Error: Unmatched closing '{char}' at {i+1}:{j+1}")
                        return
                    
                    last, last_line, last_col = stack.pop()
                    expected = {'(':')', '{':'}', '[':']'}[last]
                    if char != expected:
                        print(f"Error: Mismatched closing '{char}' at {i+1}:{j+1}. Expected '{expected}' for '{last}' from {last_line}:{last_col}")
                        return
            j += 1
            
    if stack:
        last, last_line, last_col = stack[-1]
        print(f"Error: Unmatched opening '{last}' at {last_line}:{last_col}")
    else:
        print("Success: All braces matched.")

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python check_braces.py <filename>")
    else:
        check_braces(sys.argv[1])
