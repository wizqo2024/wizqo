
import re

def check_balance(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Braces
    braces = 0
    for i, char in enumerate(content):
        if char == '{': braces += 1
        elif char == '}': braces -= 1
        if braces < 0:
            print(f"Excess '}}' at index {i}")
            # return
    print(f"Final brace balance: {braces}")

    # Parens
    parens = 0
    for i, char in enumerate(content):
        if char == '(': parens += 1
        elif char == ')': parens -= 1
        if parens < 0:
            print(f"Excess ')' at index {i}")
            # return
    print(f"Final paren balance: {parens}")

    # Tags (naive)
    tags = re.findall(r'<([a-zA-Z0-9]+)|</([a-zA-Z0-9]+)>', content)
    stack = []
    for open_tag, close_tag in tags:
        if open_tag:
            # Skip self-closing if possible? 
            # This regex is too simple.
            pass
    
    # Let's try matching tags more carefully
    tag_regex = re.compile(r'<(/?)([a-zA-Z0-9]+)([^>]*?)(/?)>')
    stack = []
    for match in tag_regex.finditer(content):
        is_closing = match.group(1) == '/'
        tag_name = match.group(2)
        is_self_closing = match.group(4) == '/'
        
        if is_closing:
            if not stack:
                print(f"Unexpected closing tag </{tag_name}> at {match.start()} (line {content.count('\n', 0, match.start())+1})")
            else:
                last_tag = stack.pop()
                if last_tag != tag_name:
                    print(f"Mismatched tag: expected </{last_tag}> but found </{tag_name}> at {match.start()} (line {content.count('\n', 0, match.start())+1})")
        elif not is_self_closing:
            # Check for self-closing common tags or components?
            # In JSX, anything can be self-closing with />.
            stack.append(tag_name)
            
    print(f"Unclosed tags at end: {stack}")

check_balance('client/src/pages/PrintablesPage.tsx')
