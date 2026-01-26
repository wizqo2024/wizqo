# Universal Worksheet Design System

## 🎯 Overview

This is a **modular, optional component system** that enhances worksheets without breaking existing ones. All components are **toggleable** and **safe** for your 298 existing worksheets.

---

## ✅ Core Principles

1. **A4 Page Size** - International standard, already implemented
2. **Current Margins** - Top: 0, Sides: 0.5in, Bottom: 0.5in
3. **Flexible Layout** - Freeform by default, optional structured modes
4. **Optional Components** - Header, Footer, Problem Boxes (toggle on/off)
5. **No Breaking Changes** - Existing worksheets remain unchanged

---

## 📦 Available Components

### 1. WorksheetHeader (Optional)

Professional header with Name, Date, Grade, Teacher, Score fields.

**Usage:**
```tsx
import { WorksheetHeader } from '@/components/worksheet'

<WorksheetHeader 
  enabled={true}        // Toggle on/off
  showScore={true}      // Show/hide score field
/>
```

**Features:**
- Only renders when `enabled={true}`
- Professional appearance
- Print-friendly
- Takes ~40px vertical space

---

### 2. WorksheetFooter (Optional)

Footer with website URL, copyright, and page numbers.

**Usage:**
```tsx
import { WorksheetFooter } from '@/components/worksheet'

<WorksheetFooter 
  enabled={true}           // Toggle on/off
  currentPage={1}          // Current page number
  totalPages={2}           // Total pages
  showCopyright={true}     // Show/hide copyright
/>
```

**Features:**
- Only renders when `enabled={true}`
- Auto-adjusts position
- Page numbering for multi-page worksheets
- Branding support

---

### 3. ProblemBox (Optional)

Reusable container for problems/tasks with consistent styling.

**Usage:**
```tsx
import { ProblemBox } from '@/components/worksheet'

<ProblemBox 
  enabled={true}           // Toggle on/off (default: true)
  variant="default"        // 'default' | 'highlight' | 'minimal'
>
  <div>Problem content here</div>
</ProblemBox>
```

**Variants:**
- `default`: White background, gray border
- `highlight`: Light blue background (#eaf4ff)
- `minimal`: Transparent, subtle border

**Features:**
- Rounded corners (8-12px)
- Consistent padding (12-18px)
- Spacing between boxes (16-24px)
- Print-friendly (page-break-inside: avoid)

---

### 4. WorksheetLayout (Optional)

Layout modes for organizing content.

**Usage:**
```tsx
import { WorksheetLayout } from '@/components/worksheet'

<WorksheetLayout 
  mode="2col"    // 'free' | '1col' | '2col'
  gap={24}       // Gap between items in pixels
>
  {problems}
</WorksheetLayout>
```

**Modes:**
- `free`: Freeform layout (default, current system)
- `1col`: Single column, centered, max width
- `2col`: Two-column grid for repetitive problems

**Features:**
- Responsive (2col becomes 1col on small screens)
- Configurable gap
- Works with any content

---

## 🎨 Universal Style Guide

### Fonts
- **Default**: System fonts (Open Sans/Poppins/Arial fallback)
- **Headers**: Bold, 20-26pt
- **Body**: 12-14pt
- **Small text**: 10-11pt

### Colors
- **Light blue**: `#eaf4ff` (highlights)
- **Light green**: `#e8ffe8` (highlights)
- **Light yellow**: `#fff9d6` (highlights)
- **Grey borders**: `#dddddd` or `#d5d5d5`
- **Text**: `#333` (headers), `#444` (body)

### Spacing
- **Section spacing**: 20-30px
- **Box spacing**: 16-24px
- **Line spacing**: 6-8px
- **Header gap**: 20px after header
- **Footer gap**: 40px before footer

---

## 📋 Implementation Examples

### Example 1: Math Worksheet with Header and Problem Boxes

```tsx
import { WorksheetHeader, ProblemBox, WorksheetLayout } from '@/components/worksheet'

function MathWorksheet() {
  return (
    <div data-worksheet-content="true">
      <WorksheetHeader enabled={true} showScore={true} />
      
      <h1>Addition Practice</h1>
      
      <WorksheetLayout mode="2col" gap={24}>
        <ProblemBox variant="default">
          <div>5 + 3 = ___</div>
        </ProblemBox>
        <ProblemBox variant="default">
          <div>7 + 2 = ___</div>
        </ProblemBox>
        <ProblemBox variant="default">
          <div>4 + 6 = ___</div>
        </ProblemBox>
      </WorksheetLayout>
      
      <WorksheetFooter enabled={true} />
    </div>
  )
}
```

### Example 2: Reading Worksheet (Single Column)

```tsx
import { WorksheetHeader, WorksheetLayout } from '@/components/worksheet'

function ReadingWorksheet() {
  return (
    <div data-worksheet-content="true">
      <WorksheetHeader enabled={true} showScore={false} />
      
      <h1>Reading Comprehension</h1>
      
      <WorksheetLayout mode="1col">
        <p>Long reading passage here...</p>
        <div>Questions here...</div>
      </WorksheetLayout>
      
      <WorksheetFooter enabled={true} />
    </div>
  )
}
```

### Example 3: Existing Worksheet (No Changes)

```tsx
// Existing worksheet - no changes needed
// Components are optional, so this still works perfectly
function ExistingWorksheet() {
  return (
    <div data-worksheet-content="true">
      {/* Your existing content */}
    </div>
  )
}
```

---

## 🔧 Configuration Options

### Per-Worksheet Configuration

You can configure components per worksheet:

```typescript
interface WorksheetConfig {
  header?: {
    enabled: boolean
    showScore?: boolean
  }
  footer?: {
    enabled: boolean
    showCopyright?: boolean
  }
  layout?: {
    mode: 'free' | '1col' | '2col'
    gap?: number
  }
  problemBoxes?: {
    enabled: boolean
    variant?: 'default' | 'highlight' | 'minimal'
  }
}
```

### Global Defaults

Set defaults in a config file:

```typescript
// worksheetConfig.ts
export const DEFAULT_WORKSHEET_CONFIG = {
  header: { enabled: false },  // Off by default
  footer: { enabled: false },  // Off by default
  layout: { mode: 'free' },    // Freeform by default
  problemBoxes: { enabled: false }  // Off by default
}
```

---

## ✅ Safety Guarantees

1. **No Breaking Changes**
   - All components are optional
   - Existing worksheets work unchanged
   - Components only render when explicitly enabled

2. **Backward Compatible**
   - Default behavior: components disabled
   - Existing worksheets: no changes needed
   - New worksheets: opt-in to components

3. **Print-Friendly**
   - All components respect print CSS
   - Proper page breaks
   - No layout issues

---

## 📊 Component Comparison

| Component | Default State | When to Use | Space Used |
|-----------|--------------|-------------|------------|
| **Header** | Disabled | Professional worksheets, teacher use | ~40px |
| **Footer** | Disabled | Branding, multi-page worksheets | ~60px |
| **ProblemBox** | Enabled (if used) | Math problems, organized tasks | Variable |
| **Layout** | Free mode | Any content type | None (layout only) |

---

## 🎯 Best Practices

1. **Start with defaults** - Use free layout, no header/footer
2. **Add components gradually** - Enable only what you need
3. **Test print layout** - Always check print preview
4. **Keep flexibility** - Don't force structure on all worksheets
5. **Use ProblemBox sparingly** - Only when it improves readability

---

## 📝 Migration Guide

### For New Worksheets

1. Import components:
```tsx
import { WorksheetHeader, WorksheetFooter, ProblemBox, WorksheetLayout } from '@/components/worksheet'
```

2. Enable desired components:
```tsx
<WorksheetHeader enabled={true} />
```

3. Use layout modes as needed:
```tsx
<WorksheetLayout mode="2col">
  {content}
</WorksheetLayout>
```

### For Existing Worksheets

**No changes required!** Existing worksheets continue to work exactly as before.

---

## 🔍 Print CSS Integration

All components automatically work with your existing print CSS:

- Respects `@page { size: A4; margin: 0; }`
- Uses content margins (0.5in left/right/bottom)
- Proper page breaks
- White backgrounds
- Print-friendly spacing

---

## 📈 Future Enhancements

Potential additions (all optional):
- Title block component
- Instruction box component
- Answer key component
- Multi-page handling
- Custom color themes

---

## ✅ Summary

This system provides:
- ✅ **Optional components** (header, footer, problem boxes)
- ✅ **Layout modes** (free, 1col, 2col)
- ✅ **No breaking changes** (existing worksheets safe)
- ✅ **Professional appearance** (when components enabled)
- ✅ **Flexibility** (use what you need)
- ✅ **A4-based** (international standard)
- ✅ **Print-friendly** (works with existing print CSS)

**All components are opt-in, so your 298 existing worksheets remain unchanged!**
