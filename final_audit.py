
import os

path = r"c:\Users\ThajulAmeerMohamedSa\OneDrive - Alpha Data LLC\Desktop\wizqo\client\src\pages\PrintablesPage.tsx"

suspicious_patterns = [
    b'\xc3\xb0\xc5\xb8', # ðŸ
    b'\xc3\xa2\xcb\x9c', # â˜
    b'\xc3\xa2\xc5\x93', # âœ
    b'\xc3\x83',         # Ã
    b'\xc3\xaf\xc2\xb8', # ï¸
    b'\xc2\xad',         # Soft hyphen often seen in corruption
    b'\xc2\xb5',         # µ
    b'\xc2\xb0',         # °
    b'\xc2\xa6',         # ¦
]

print(f"Scanning {path}...")

found_lines = []

try:
    with open(path, 'rb') as f:
        lines = f.readlines()
        for i, line in enumerate(lines):
            # Check for patterns
            for pattern in suspicious_patterns:
                if pattern in line:
                    # Double check it's not a valid UTF-8 sequence that just looks like this?
                    # No, these are specific byte sequences for the corrupted forms in UTF-8.
                    # e.g. "ðŸ" in UTF-8 is \xc3\xb0\xc5\xb8.
                    # A real emoji like 🐧 is \xf0\x9f\x90\xa7. They don't overlap.
                    
                    try:
                        decoded = line.decode('utf-8')
                        found_lines.append(f"Line {i+1}: {decoded.strip()}")
                    except:
                        found_lines.append(f"Line {i+1} (Binary): {line}")
                    break
                    
            # Check for unclosed syntax (heuristic)
            try:
                decoded = line.decode('utf-8')
                if "{t('" in decoded and "')}" not in decoded and "'," not in decoded:
                    if "<div" in decoded or "span" in decoded:
                         found_lines.append(f"Line {i+1} (Syntax): {decoded.strip()}")
            except:
                pass

    if found_lines:
        print(f"Found {len(found_lines)} suspicious lines:")
        for l in found_lines[:50]:
            print(l)
        if len(found_lines) > 50:
            print(f"...and {len(found_lines)-50} more.")
    else:
        print("CLEAN: No suspicious patterns found.")

except Exception as e:
    print(f"Error: {e}")
