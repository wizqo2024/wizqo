import re
import sys

def detect_mojibake(file_path):
    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    # Common mojibake patterns in UTF-8 to CP1252/Latin-1
    # ðŸ is F0 9F (start of many emojis)
    # â is E2 (start of many symbols like ✍️ which is E2 9C 8D)
    # 🕵️‍♀️ is F0 9F 91 a F0 9F 8F bb E2 80 8D E2 99 80 EF B8 8F
    # This becomes ðŸ•µï¸ â€ â™€ï¸ 
    
    pattern = re.compile(r'[ðâ][\u0080-\u00bf\u00c0-\u00ff]{1,10}')
    matches = pattern.findall(content)
    
    unique_matches = sorted(list(set(matches)))
    for match in unique_matches:
        # Try to decode if possible (simulating the double encoding issue)
        try:
            # If it was UTF-8 interpreted as Latin-1
            # We want to see what it would be if we re-encoded it to bytes and then decoded as UTF-8
            original = match.encode('latin-1').decode('utf-8')
            print(f"Match: {match} -> Suggested: {original}")
        except:
            print(f"Match: {match} -> (Unknown)")

if __name__ == "__main__":
    detect_mojibake(sys.argv[1])
