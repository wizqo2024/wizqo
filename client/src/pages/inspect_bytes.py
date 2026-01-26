
import sys

def inspect_line_bytes(file_path, line_number):
    try:
        with open(file_path, 'rb') as f:
            lines = f.readlines()
        
        if line_number < 1 or line_number > len(lines):
            print(f"Line {line_number} is out of range.")
            return

        line_bytes = lines[line_number - 1]
        print(f"Line {line_number} (hex): {line_bytes.hex()}")
        print(f"Line {line_number} (raw): {line_bytes}")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    inspect_line_bytes(sys.argv[1], int(sys.argv[2]))
