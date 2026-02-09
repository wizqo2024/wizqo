# Optional Components - Quick Start Guide

## ✅ All 3 Components Are Ready!

All components are **already created** and ready to use. They're **disabled by default** so your existing worksheets are safe.

---

## 📦 Component 1: Optional Header

**Location:** `client/src/components/worksheet/WorksheetHeader.tsx`

**Toggle:** `enabled={true/false}`

**Usage:**
```tsx
import { WorksheetHeader } from '@/components/worksheet'

<WorksheetHeader 
  enabled={true}        // Turn ON header
  showScore={true}      // Show/hide score field
/>
```

**What it shows:**
```
Name: ___________     Date: ___
Grade: ___            Teacher: ___
Score: ___ / ___
```

---

## 📦 Component 2: Optional Footer

**Location:** `client/src/components/worksheet/WorksheetFooter.tsx`

**Toggle:** `enabled={true/false}`

**Usage:**
```tsx
import { WorksheetFooter } from '@/components/worksheet'

<WorksheetFooter 
  enabled={true}           // Turn ON footer
  currentPage={1}          // Optional: page number
  totalPages={2}           // Optional: total pages
  showCopyright={true}     // Show/hide copyright
/>
```

**What it shows:**
```
www.wizqo.com
Copyright © 2025 Wizqo. All rights reserved.
Page 1 of 2
```

---

## 📦 Component 3: Optional Problem Box

**Location:** `client/src/components/worksheet/ProblemBox.tsx`

**Toggle:** `enabled={true/false}` (default: true)

**Usage:**
```tsx
import { ProblemBox } from '@/components/worksheet'

<ProblemBox 
  enabled={true}           // Turn ON problem box
  variant="default"        // 'default' | 'highlight' | 'minimal'
>
  <div>Your problem content here</div>
</ProblemBox>
```

**Variants:**
- `default`: White background, gray border
- `highlight`: Light blue background (#eaf4ff)
- `minimal`: Transparent, subtle border

---

## 🎯 Complete Example

Here's how to use all 3 components together:

```tsx
import { WorksheetHeader, WorksheetFooter, ProblemBox } from '@/components/worksheet'

function MyWorksheet() {
  return (
    <div data-worksheet-content="true">
      {/* 1. Optional Header */}
      <WorksheetHeader enabled={true} showScore={true} />
      
      <h1>My Worksheet Title</h1>
      
      {/* 2. Optional Problem Boxes */}
      <ProblemBox enabled={true} variant="default">
        <div>Problem 1: 5 + 3 = ___</div>
      </ProblemBox>
      
      <ProblemBox enabled={true} variant="default">
        <div>Problem 2: 7 + 2 = ___</div>
      </ProblemBox>
      
      {/* 3. Optional Footer */}
      <WorksheetFooter enabled={true} />
    </div>
  )
}
```

---

## ✅ Current Status

| Component | Status | Toggle | Location |
|-----------|--------|--------|----------|
| **Header** | ✅ Ready | `enabled={true/false}` | `components/worksheet/WorksheetHeader.tsx` |
| **Footer** | ✅ Ready | `enabled={true/false}` | `components/worksheet/WorksheetFooter.tsx` |
| **ProblemBox** | ✅ Ready | `enabled={true/false}` | `components/worksheet/ProblemBox.tsx` |

---

## 🔧 How to Enable on Existing Worksheets

### Option 1: Enable on Specific Worksheet

Edit the worksheet in `PrintablesPage.tsx`:

```tsx
{activeDocs.includes('your-worksheet-id') && (
  <WorksheetSectionWrapper docId="your-worksheet-id" ...>
    <WorksheetHeader enabled={true} />
    {/* Your existing content */}
    <WorksheetFooter enabled={true} />
  </WorksheetSectionWrapper>
)}
```

### Option 2: Enable Globally (All Worksheets)

Add to `WorksheetSectionWrapper` component (but this affects ALL worksheets):

```tsx
<WorksheetSectionWrapper ...>
  <WorksheetHeader enabled={true} />
  {children}
  <WorksheetFooter enabled={true} />
</WorksheetSectionWrapper>
```

**⚠️ Warning:** Option 2 affects all 298+ worksheets. Use Option 1 for selective enabling.

---

## 📝 Footer Details

The footer shows:
- **URL:** `www.wizqo.com` (links to `https://wizqo.com`)
- **Copyright:** `Copyright © 2025 Wizqo. All rights reserved.`
- **Page Numbers:** `Page 1 of 2` (only if `totalPages > 1`)

---

## ✅ Summary

**All 3 components are:**
- ✅ Created and ready
- ✅ Toggleable (on/off)
- ✅ Print-friendly
- ✅ Safe (disabled by default)
- ✅ Footer shows `www.wizqo.com`

**You can start using them immediately!** Just import and set `enabled={true}` when you want them.
