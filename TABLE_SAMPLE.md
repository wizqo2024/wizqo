# Times Table (6-12) - Expected Print Layout

## Visual Structure:

```
┌─────────────────────────────────────────────────────────┐
│         Fill in the Times Table (6-12)                 │
├──────┬──────┬──────┬──────┬──────┬──────┬──────┬──────┤
│  ×   │  6   │  7   │  8   │  9   │  10  │  11  │  12  │
├──────┼──────┼──────┼──────┼──────┼──────┼──────┼──────┤
│  6   │ ____ │ ____ │ ____ │ ____ │ ____ │ ____ │ ____ │
├──────┼──────┼──────┼──────┼──────┼──────┼──────┼──────┤
│  7   │ ____ │ ____ │ ____ │ ____ │ ____ │ ____ │ ____ │
├──────┼──────┼──────┼──────┼──────┼──────┼──────┼──────┤
│  8   │ ____ │ ____ │ ____ │ ____ │ ____ │ ____ │ ____ │
├──────┼──────┼──────┼──────┼──────┼──────┼──────┼──────┤
│  9   │ ____ │ ____ │ ____ │ ____ │ ____ │ ____ │ ____ │
├──────┼──────┼──────┼──────┼──────┼──────┼──────┼──────┤
│  10  │ ____ │ ____ │ ____ │ ____ │ ____ │ ____ │ ____ │
├──────┼──────┼──────┼──────┼──────┼──────┼──────┼──────┤
│  11  │ ____ │ ____ │ ____ │ ____ │ ____ │ ____ │ ____ │
├──────┼──────┼──────┼──────┼──────┼──────┼──────┼──────┤
│  12  │ ____ │ ____ │ ____ │ ____ │ ____ │ ____ │ ____ │
└──────┴──────┴──────┴──────┴──────┴──────┴──────┴──────┘
```

## Key Elements:

1. **Container Box**: White background with black border (1px solid)
2. **Title**: "Fill in the Times Table (6-12)" - centered, bold, above table
3. **Header Row** (gray background):
   - First cell: "×" symbol
   - Other cells: Numbers 6, 7, 8, 9, 10, 11, 12
4. **Data Rows**:
   - First column (gray background): Row numbers 6, 7, 8, 9, 10, 11, 12
   - Other cells: Empty cells with horizontal input lines (____) for filling answers
5. **Borders**: All cells have black borders (1px solid) - visible on all sides
6. **Spacing**: Proper padding inside cells

## HTML Structure:

```html
<div class="border border-slate-300 rounded p-4 bg-white">
  <div class="text-center font-semibold mb-3">Fill in the Times Table (6-12)</div>
  <table class="w-full border-collapse text-sm">
    <thead>
      <tr>
        <th class="border border-slate-400 p-2 bg-slate-100">×</th>
        <th class="border border-slate-400 p-2 bg-slate-100">6</th>
        <th class="border border-slate-400 p-2 bg-slate-100">7</th>
        <!-- ... 8, 9, 10, 11, 12 -->
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="border border-slate-400 p-2 bg-slate-100 font-semibold">6</td>
        <td class="border border-slate-400 p-2 text-center">
          <span class="inline-block w-10 h-5 border-b-[2px] border-slate-600"></span>
        </td>
        <!-- ... more cells -->
      </tr>
      <!-- ... more rows for 7, 8, 9, 10, 11, 12 -->
    </tbody>
  </table>
</div>
```

## Expected Visual Appearance:

- **All borders visible**: Black lines separating every cell
- **Header row**: Gray background (#f1f5f9) with "×" and numbers
- **Left column**: Gray background (#f1f5f9) with row numbers
- **Input cells**: White background with horizontal lines for writing answers
- **Container**: White box with black border around entire table

## Print Layout Requirements:

✅ Table container has visible border  
✅ All table cells have black borders (1px solid)  
✅ Header row (×, 6-12) is visible with gray background  
✅ Left column (6-12) is visible with gray background  
✅ All input lines are visible in empty cells  
✅ Proper spacing and padding throughout  
✅ Table title is visible above table  
