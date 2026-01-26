import sys

def delete_lines(file_path, start_line, end_line):
    """Deletes lines from start_line to end_line (inclusive, 1-based)"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            lines = f.readlines()
        
        # Adjust for 0-based indexing
        # start_line 1 means index 0.
        # We want to keep lines[:start_line-1] and lines[end_line:]
        
        start_idx = start_line - 1
        end_idx = end_line 
        
        if start_idx < 0: start_idx = 0
        if end_idx > len(lines): end_idx = len(lines)
        
        new_lines = lines[:start_idx] + lines[end_idx:]
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.writelines(new_lines)
            
        print(f"Successfully deleted lines {start_line} to {end_line} in {file_path}")
        print(f"Original line count: {len(lines)}")
        print(f"New line count: {len(new_lines)}")
        
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) != 4:
        print("Usage: python delete_lines.py <file> <start_line> <end_line>")
        sys.exit(1)
        
    delete_lines(sys.argv[1], int(sys.argv[2]), int(sys.argv[3]))
