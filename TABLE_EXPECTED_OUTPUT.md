# Expected Table Output for times-table-blank-6-12

## How the table should look:

```
┌─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┐
│  ×  │  6  │  7  │  8  │  9  │ 10  │ 11  │ 12  │
├─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┤
│  6  │ ___ │ ___ │ ___ │ ___ │ ___ │ ___ │ ___ │
├─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┤
│  7  │ ___ │ ___ │ ___ │ ___ │ ___ │ ___ │ ___ │
├─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┤
│  8  │ ___ │ ___ │ ___ │ ___ │ ___ │ ___ │ ___ │
├─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┤
│  9  │ ___ │ ___ │ ___ │ ___ │ ___ │ ___ │ ___ │
├─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┤
│ 10  │ ___ │ ___ │ ___ │ ___ │ ___ │ ___ │ ___ │
├─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┤
│ 11  │ ___ │ ___ │ ___ │ ___ │ ___ │ ___ │ ___ │
├─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┤
│ 12  │ ___ │ ___ │ ___ │ ___ │ ___ │ ___ │ ___ │
└─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┘
```

## Visual Description:

### Header Row (thead):
- **First cell**: "×" symbol (multiplication sign)
- **Other cells**: Numbers 6, 7, 8, 9, 10, 11, 12
- **Background**: Light gray (bg-slate-100)
- **Borders**: All sides visible (1px solid dark gray/black)

### Body Rows (tbody):
- **7 rows total** (one for each number: 6, 7, 8, 9, 10, 11, 12)
- **Each row has 8 cells**:
  1. **First cell**: Row number (6, 7, 8, etc.) - **Background**: Light gray (bg-slate-100), **Bold text**
  2. **Other 7 cells**: Empty cells with underline spans (horizontal lines where students fill in answers)
     - Each cell contains: `<span>` element with `border-bottom` (underline)
     - The underline should be visible (2px solid dark gray)
     - Cell should have borders on all sides

### Cell Structure:
Each empty cell should look like:
```
┌─────────┐
│   ___   │  ← This is a horizontal line (underline) where students write
└─────────┘
```

### Complete Grid:
- **8 columns** (×, 6, 7, 8, 9, 10, 11, 12)
- **8 rows** (header + 7 data rows)
- **All borders visible**: Every cell should have borders on all 4 sides
- **Grid structure**: Should look like a complete grid/table

## HTML Structure:
```html
<table className="w-full border-collapse text-sm">
  <thead>
    <tr>
      <th>×</th>
      <th>6</th>
      <th>7</th>
      <th>8</th>
      <th>9</th>
      <th>10</th>
      <th>11</th>
      <th>12</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>6</td>
      <td><span className="underline"></span></td>
      <td><span className="underline"></span></td>
      <!-- ... 5 more cells -->
    </tr>
    <!-- ... 6 more rows -->
  </tbody>
</table>
```

## What Should Be Visible:

✅ **Header row** with "×" and numbers 6-12  
✅ **7 body rows** (one for each number 6-12)  
✅ **Row numbers** in first column (6, 7, 8, 9, 10, 11, 12)  
✅ **Empty cells** with visible underline spans  
✅ **All borders** forming a complete grid  
✅ **Light gray background** on header cells and first column  
✅ **Proper spacing** and padding in each cell  

## Current Issue:
The table structure is rendering but:
- ❌ Body rows may not be showing borders
- ❌ Empty cells (with spans) may not be visible
- ❌ Complete grid structure may not be apparent

The fix should ensure ALL of the above elements are visible in print view.
