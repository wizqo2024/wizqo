# Worksheet Components - Usage Examples

## Quick Start

All components are **optional** and **disabled by default**. Your existing 298 worksheets work unchanged.

---

## Example 1: Simple Math Worksheet with Header and Problem Boxes

```tsx
import { WorksheetHeader, ProblemBox, WorksheetLayout, WorksheetFooter } from '@/components/worksheet'

function AdditionWorksheet() {
  const problems = [
    { id: 1, question: '5 + 3 = ___' },
    { id: 2, question: '7 + 2 = ___' },
    { id: 3, question: '4 + 6 = ___' },
    { id: 4, question: '9 + 1 = ___' },
  ]

  return (
    <div data-worksheet-content="true">
      {/* Optional Header - only renders if enabled */}
      <WorksheetHeader enabled={true} showScore={true} />
      
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>
        Addition Practice
      </h1>
      
      {/* Two-column layout for math problems */}
      <WorksheetLayout mode="2col" gap={24}>
        {problems.map(problem => (
          <ProblemBox key={problem.id} variant="default">
            <div style={{ fontSize: '16pt', textAlign: 'center' }}>
              {problem.question}
            </div>
          </ProblemBox>
        ))}
      </WorksheetLayout>
      
      {/* Optional Footer */}
      <WorksheetFooter enabled={true} />
    </div>
  )
}
```

---

## Example 2: Reading Comprehension (Single Column)

```tsx
import { WorksheetHeader, WorksheetLayout, WorksheetFooter } from '@/components/worksheet'

function ReadingWorksheet() {
  return (
    <div data-worksheet-content="true">
      <WorksheetHeader enabled={true} showScore={false} />
      
      <h1 style={{ textAlign: 'center' }}>Reading Comprehension</h1>
      
      {/* Single column for long reading passages */}
      <WorksheetLayout mode="1col">
        <div style={{ marginBottom: '20px' }}>
          <h2>The Story</h2>
          <p style={{ lineHeight: '1.6', fontSize: '14pt' }}>
            Long reading passage here...
          </p>
        </div>
        
        <div>
          <h3>Questions</h3>
          <ol>
            <li>Question 1?</li>
            <li>Question 2?</li>
          </ol>
        </div>
      </WorksheetLayout>
      
      <WorksheetFooter enabled={true} currentPage={1} totalPages={1} />
    </div>
  )
}
```

---

## Example 3: Existing Worksheet (No Changes Needed)

```tsx
// Your existing worksheet - works perfectly without any changes
function ExistingPlaceValueWorksheet() {
  return (
    <div data-worksheet-content="true">
      {/* Your existing content */}
      <h1>Place Value</h1>
      <div>Your existing layout...</div>
    </div>
  )
}
```

**This works exactly as before - no changes needed!**

---

## Example 4: Mixed Content with Highlighted Boxes

```tsx
import { ProblemBox, WorksheetLayout } from '@/components/worksheet'

function MixedWorksheet() {
  return (
    <div data-worksheet-content="true">
      <h1>Math and Reading Practice</h1>
      
      {/* Freeform layout (default) */}
      <WorksheetLayout mode="free">
        {/* Highlighted box for important instruction */}
        <ProblemBox variant="highlight">
          <strong>Instructions:</strong> Read each problem carefully.
        </ProblemBox>
        
        {/* Default boxes for problems */}
        <ProblemBox variant="default">
          <div>5 + 3 = ___</div>
        </ProblemBox>
        
        <ProblemBox variant="default">
          <div>7 + 2 = ___</div>
        </ProblemBox>
        
        {/* Minimal box for notes */}
        <ProblemBox variant="minimal">
          <em>Remember to show your work!</em>
        </ProblemBox>
      </WorksheetLayout>
    </div>
  )
}
```

---

## Example 5: Conditional Components Based on Config

```tsx
import { WorksheetHeader, WorksheetFooter, ProblemBox, WorksheetLayout } from '@/components/worksheet'

interface WorksheetConfig {
  showHeader?: boolean
  showFooter?: boolean
  useProblemBoxes?: boolean
  layoutMode?: 'free' | '1col' | '2col'
}

function ConfigurableWorksheet({ config }: { config: WorksheetConfig }) {
  const {
    showHeader = false,
    showFooter = false,
    useProblemBoxes = false,
    layoutMode = 'free'
  } = config

  return (
    <div data-worksheet-content="true">
      <WorksheetHeader enabled={showHeader} />
      
      <h1>Configurable Worksheet</h1>
      
      <WorksheetLayout mode={layoutMode}>
        {useProblemBoxes ? (
          <ProblemBox variant="default">
            <div>Content in a box</div>
          </ProblemBox>
        ) : (
          <div>Content without box</div>
        )}
      </WorksheetLayout>
      
      <WorksheetFooter enabled={showFooter} />
    </div>
  )
}

// Usage:
// <ConfigurableWorksheet config={{ showHeader: true, layoutMode: '2col' }} />
```

---

## Component Props Reference

### WorksheetHeader

```tsx
<WorksheetHeader 
  enabled={true}        // Required: Show/hide header
  showScore={true}     // Optional: Show score field (default: true)
  className=""          // Optional: Additional CSS classes
/>
```

### WorksheetFooter

```tsx
<WorksheetFooter 
  enabled={true}           // Required: Show/hide footer
  currentPage={1}          // Optional: Current page number
  totalPages={2}           // Optional: Total pages
  showCopyright={true}     // Optional: Show copyright (default: true)
  className=""             // Optional: Additional CSS classes
/>
```

### ProblemBox

```tsx
<ProblemBox 
  enabled={true}          // Optional: Enable/disable (default: true)
  variant="default"        // Optional: 'default' | 'highlight' | 'minimal'
  className=""             // Optional: Additional CSS classes
  style={{}}              // Optional: Custom inline styles
>
  {children}
</ProblemBox>
```

### WorksheetLayout

```tsx
<WorksheetLayout 
  mode="free"             // Optional: 'free' | '1col' | '2col' (default: 'free')
  gap={24}                // Optional: Gap between items in pixels (default: 24)
  className=""            // Optional: Additional CSS classes
>
  {children}
</WorksheetLayout>
```

---

## Best Practices

1. **Start Simple**: Begin with `enabled={false}` and enable only what you need
2. **Test Print**: Always check print preview when using components
3. **Consistent Spacing**: Use the same gap values across similar worksheets
4. **Variant Selection**: 
   - Use `default` for most problems
   - Use `highlight` for important instructions
   - Use `minimal` for subtle grouping
5. **Layout Mode**:
   - Use `free` for mixed content (default)
   - Use `2col` for repetitive math problems
   - Use `1col` for reading/writing tasks

---

## Migration Checklist

For new worksheets:
- [ ] Import components from `@/components/worksheet`
- [ ] Decide which components to enable
- [ ] Choose layout mode (free/1col/2col)
- [ ] Test print layout
- [ ] Verify spacing looks good

For existing worksheets:
- [ ] **No changes needed!** They work as-is.

---

## Troubleshooting

**Q: Header/Footer not showing?**
- Check `enabled={true}` prop
- Verify component is imported correctly

**Q: Problem boxes breaking across pages?**
- This is handled automatically with `page-break-inside: avoid`
- If issues persist, check print CSS

**Q: Layout not working?**
- Verify `mode` prop is correct ('free' | '1col' | '2col')
- Check that children are properly structured

**Q: Print layout issues?**
- All components have print CSS built-in
- Check browser print preview
- Verify A4 page size is set

---

## Summary

✅ **All components are optional** - enable only what you need
✅ **No breaking changes** - existing worksheets work unchanged  
✅ **Print-friendly** - all components respect print CSS
✅ **Flexible** - works with any content type
✅ **Professional** - clean, consistent appearance when enabled
