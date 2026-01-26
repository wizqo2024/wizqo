#!/usr/bin/env python3
"""
Fix accessibility issues in all grade-specific worksheet pages.
Adds ARIA labels, focus states, and proper semantic HTML.
"""

import re
import sys
from pathlib import Path

# Grade pages to fix
GRADE_PAGES = [
    'client/src/pages/WorksheetsFirstGradePage.tsx',
    'client/src/pages/WorksheetsSecondGradePage.tsx',
    'client/src/pages/WorksheetsThirdGradePage.tsx',
    'client/src/pages/WorksheetsFourthGradePage.tsx',
    'client/src/pages/WorksheetsFifthGradePage.tsx',
]

# Grade names for context
GRADE_NAMES = {
    'WorksheetsFirstGradePage.tsx': '1st-grade',
    'WorksheetsSecondGradePage.tsx': '2nd-grade',
    'WorksheetsThirdGradePage.tsx': '3rd-grade',
    'WorksheetsFourthGradePage.tsx': '4th-grade',
    'WorksheetsFifthGradePage.tsx': '5th-grade',
}

def fix_file(filepath):
    """Fix accessibility issues in a grade page file."""
    path = Path(filepath)
    if not path.exists():
        print(f"⚠️  File not found: {filepath}")
        return False
    
    content = path.read_text(encoding='utf-8')
    original = content
    grade_name = GRADE_NAMES.get(path.name, 'grade')
    
    # Fix 1: Add aria-label to iframe in preview modal
    content = re.sub(
        r'(<iframe\s+src=\{previewItem\.href\}\s+className="[^"]*"\s+title=\{previewItem\.title\})',
        r'\1\n                      aria-label={`Preview of ${previewItem.title} worksheet`}',
        content
    )
    
    # Fix 2: Add focus states and aria-label to download button in modal
    content = re.sub(
        r'(<button\s+onClick=\{\(\) => \{\s+const newWindow = window\.open\(previewItem\.href, \'_blank\'\)[^}]+className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-purple-200 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium shadow-sm")',
        r'\1 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"\n                      aria-label={`Download ${previewItem.title} as PDF`}',
        content,
        flags=re.DOTALL
    )
    
    # Fix 3: Add focus states to close button
    content = re.sub(
        r'(<button\s+onClick=\{\(\) => setPreviewItem\(null\)\}\s+className="ml-4 p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"\s+aria-label="Close preview")',
        r'<button\n                  onClick={() => setPreviewItem(null)}\n                  className="ml-4 p-2 text-slate-400 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 rounded-lg hover:bg-slate-100 transition-colors"\n                  aria-label="Close preview"',
        content
    )
    
    # Fix 4: Add aria-label to thumbnail iframe
    content = re.sub(
        r'(title=\{t\(\'pages\.grades\.[^\']+\.previewOf\'\) \+ \' \' \+ title\}\s+loading="lazy")',
        r'\1\n          aria-label={`Preview thumbnail of ${title} worksheet`}',
        content
    )
    
    # Fix 5: Add focus states and improve aria-label to download button in card
    pattern = rf'(<button\s+onClick=\{\{\s+const printUrl = getWorksheetPrintURL\(docId, \'{grade_name}\'\)[^}}]+className="text-xs font-medium text-purple-600 hover:text-purple-700 px-3 py-1 rounded-full border border-purple-200 hover:border-purple-300 transition-colors")'
    replacement = rf'\1 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"\n            aria-label={`${{t(\'pages.grades.{grade_name}.downloadButton\')}} ${{title}}`}'
    content = re.sub(pattern, replacement, content, flags=re.DOTALL)
    
    if content != original:
        path.write_text(content, encoding='utf-8')
        print(f"✅ Fixed: {filepath}")
        return True
    else:
        print(f"ℹ️  No changes needed: {filepath}")
        return False

if __name__ == '__main__':
    workspace = Path('/workspace')
    fixed_count = 0
    
    for page in GRADE_PAGES:
        filepath = workspace / page
        if fix_file(filepath):
            fixed_count += 1
    
    print(f"\n✅ Fixed {fixed_count} out of {len(GRADE_PAGES)} grade pages")
    sys.exit(0 if fixed_count > 0 else 1)
