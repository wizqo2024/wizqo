
import os

path = r"c:\Users\ThajulAmeerMohamedSa\OneDrive - Alpha Data LLC\Desktop\wizqo\client\src\pages\PrintablesPage.tsx"

# Map of common Mojibake artifacts to correct characters
replacements = {
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
    'ðŸ¦ ': '🦟', # Mosquito? 
    'ðŸ’µ': '💸'
}

with open(path, 'r', encoding='utf-8', errors='ignore') as f:
    lines = f.readlines()

new_lines = []
skip_mode = False
deletion_done = False

for i, line in enumerate(lines):
    # Detect start of duplicate block (only the one using direct parens "&& (", not the function one)
    if "activeDocs.includes('money-coins-bills') && (" in line and not deletion_done:
        print(f"Found duplicate block start at line {i+1}")
        skip_mode = True
        continue
    
    if skip_mode:
        # Heuristic to find end of block: It ends with "        }" followed by a blank line or another block
        # In the context viewed: the block ends with "        }", then a blank line, then next block.
        # We'll look for the indented closing brace that matches the indentation of the start.
        if line.strip() == "}":
            # Check indentation - assuming standard formatting
            if line.startswith("        }"): 
               print(f"Found duplicate block end at line {i+1}")
               skip_mode = False
               deletion_done = True
               continue
        # Also fail-safe: if we hit the next worksheet block, stop skipping
        if "activeDocs.includes('measurement-length')" in line:
             print(f"Safety hit next block at line {i+1}, stopping skip")
             skip_mode = False
             deletion_done = True
             new_lines.append(line)
             continue
        continue

    # Perform encoding fixes
    fixed_line = line
    for corrupted, correct in replacements.items():
        fixed_line = fixed_line.replace(corrupted, correct)
    
    new_lines.append(fixed_line)

# Write back
with open(path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("File processed successfully.")
