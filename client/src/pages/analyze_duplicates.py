import re
import sys

def analyze(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    doc_ids = []
    for idx, line in enumerate(lines):
        # Look for docId="..." or docId={...}
        # But specifically docId="literal" is what we care about for the switch cases/rendering
        match = re.search(r'docId=["\']([^"\']+)["\']', line)
        if match:
             doc_ids.append((idx + 1, match.group(1)))
        
        # Also check for activeDocs.includes('literal') &&
        match_inc = re.search(r"activeDocs\.includes\(['\"]([^'\"]+)['\"]\)", line)
        if match_inc:
             # We can verify if this corresponds to a render block
             pass

    # Group by docId
    counts = {}
    positions = {}
    for ln, did in doc_ids:
        if did not in counts:
            counts[did] = 0
            positions[did] = []
        counts[did] += 1
        positions[did].append(ln)

    duplicates = {k: v for k, v in positions.items() if len(v) > 1}
    
    print(f"Found {len(duplicates)} duplicated docIds.")
    for did, locs in duplicates.items():
        print(f"{did}: {locs}")

if __name__ == "__main__":
    analyze(sys.argv[1])
