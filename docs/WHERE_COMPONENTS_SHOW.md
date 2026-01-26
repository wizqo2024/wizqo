# Where Optional Components Show - Visual Guide

## 📍 Component Locations on Worksheet

### Layout Structure:

```
┌─────────────────────────────────────────┐
│  [OPTIONAL HEADER] ← Shows HERE (TOP)   │
│  Name: ___  Date: ___  Grade: ___       │
│  Teacher: ___  Score: ___ / ___         │
├─────────────────────────────────────────┤
│                                         │
│  Worksheet Title                        │
│  Description                           │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ [OPTIONAL PROBLEM BOX]           │   │
│  │ ← Shows HERE (around content)    │   │
│  │                                   │   │
│  │ Passage text...                   │   │
│  │ Questions...                      │   │
│  │                                   │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Challenge Section                      │
│  Answer Key (when toggled)             │
│                                         │
├─────────────────────────────────────────┤
│  [OPTIONAL FOOTER] ← Shows HERE (BOTTOM)│
│  www.wizqo.com                         │
│  Copyright © 2025                      │
│  Page 1 of 1                           │
└─────────────────────────────────────────┘
```

---

## 🎯 Exact Locations

### 1. **Header** - Shows at TOP

**Location:** Right after `<WorksheetSectionWrapper>` opens, before title

**Code:**
```tsx
<WorksheetSectionWrapper ...>
  <WorksheetHeader enabled={true} />  ← HERE (top of worksheet)
  <h1>Title</h1>
  ...
</WorksheetSectionWrapper>
```

**What it shows:**
```
Name: ___________     Date: ___
Grade: ___            Teacher: ___
Score: ___ / ___
```

---

### 2. **Problem Box** - Shows AROUND content

**Location:** Wraps the passage/questions section

**Code:**
```tsx
<ProblemBox enabled={true} variant="default">
  <p>Passage text...</p>  ← Content goes INSIDE the box
  <ol>Questions...</ol>
</ProblemBox>
```

**What it shows:**
```
┌─────────────────────────────┐
│ Passage text...             │
│ Questions...                │
└─────────────────────────────┘
```

---

### 3. **Footer** - Shows at BOTTOM

**Location:** Right before `</WorksheetSectionWrapper>` closes

**Code:**
```tsx
  ...
  <WorksheetFooter enabled={true} />  ← HERE (bottom of worksheet)
</WorksheetSectionWrapper>
```

**What it shows:**
```
─────────────────────────────
www.wizqo.com
Copyright © 2025 Wizqo. All rights reserved.
Page 1 of 1
```

---

## 📄 Live Example

**See it in action on:**
- **URL:** `https://wizqo.com/print?doc=reading-g2-magic-seeds&from=reading-comprehension`

**This worksheet has all 3 components enabled:**
- ✅ Header at top
- ✅ Problem box around passage
- ✅ Footer at bottom with `www.wizqo.com`

---

## 🔧 How to Toggle

### Turn OFF Header:
```tsx
<WorksheetHeader enabled={false} />  // Hidden
```

### Turn OFF Problem Box:
```tsx
<ProblemBox enabled={false}>  // No box, content shows normally
  Content
</ProblemBox>
```

### Turn OFF Footer:
```tsx
<WorksheetFooter enabled={false} />  // Hidden
```

---

## ✅ Summary

| Component | Location | Toggle | Shows |
|-----------|----------|--------|-------|
| **Header** | Top | `enabled={true/false}` | Name/Date/Grade/Teacher/Score |
| **ProblemBox** | Around content | `enabled={true/false}` | Rounded box with border |
| **Footer** | Bottom | `enabled={true/false}` | www.wizqo.com + copyright |

**All components are ready and working!** Check the Magic Seeds worksheet to see them in action.
