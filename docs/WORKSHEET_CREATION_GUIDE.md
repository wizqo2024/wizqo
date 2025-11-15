# Worksheet Creation Guide - Error Prevention Checklist

## 🎯 Goal: Create 100% Accurate Worksheets Without Errors

This guide provides a systematic approach to create worksheets without common mistakes.

## ✅ Pre-Creation Checklist

Before creating any worksheet, ensure:

1. **Answerable Docs List**: Add your `docId` to `ANSWERABLE_BASE_DOC_IDS` array (around line 136)
2. **Doc Title Mapping**: Add case in `resolveDocTitle` function (around line 480)
3. **Theme Mapping**: Ensure your docId matches theme patterns (around line 20-100)

## 📋 Worksheet Creation Template

### Standard Pattern for Worksheets with Answers

```typescript
{activeDocs.includes('your-doc-id') && (() => {
  // 1. Initialize RNG for dynamic content
  const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`);
  function nextInt(min: number, max: number) { 
    return Math.floor(rng() * (max - min + 1)) + min; 
  }
  
  // 2. Generate problems (ensure all answers are valid)
  const problems = Array.from({length: N}).map(() => {
    // Generate valid problem
    // Validate: answer must be in expected range
    return { /* problem data */ };
  });
  
  // 3. Render worksheet
  return (
    <WorksheetSectionWrapper
      docId="your-doc-id"
      title="Your Worksheet Title"
      emoji="🎯"
      description="Clear description of what students should do."
    >
      {/* Worksheet content */}
      
      {/* 4. ALWAYS include showAnswersForDoc */}
      {showAnswersForDoc('your-doc-id', () => (
        <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
          <div className="font-semibold mb-1">Answer key</div>
          <ul className="list-disc list-inside space-y-0.5">
            {problems.map((problem, idx) => (
              <li key={idx}>{/* Show actual answer */}</li>
            ))}
          </ul>
        </div>
      ))}
    </WorksheetSectionWrapper>
  );
})()}
```

## 🔍 Common Error Patterns & Solutions

### Error 1: Missing Show Answers Toggle
**Problem**: `showAnswersForDoc` exists but docId not in `ANSWERABLE_BASE_DOC_IDS`
**Solution**: Always add to list immediately when creating worksheet

### Error 2: Answers Always Visible (Hints/Examples)
**Problem**: Hints, examples, or answers shown by default
**Solution**: Wrap in conditional: `{showAnswers && activeDocs.includes('doc-id') && (/* content */)}`

### Error 3: Invalid Problem Generation
**Problem**: Generated problems produce answers not in expected range
**Solution**: 
- Validate before adding to problems array
- Use filter/retry logic
- Pre-generate valid pairs

### Error 4: Hardcoded Problems
**Problem**: Same problems every time
**Solution**: Use seeded RNG for variety while maintaining reproducibility

### Error 5: Missing Visual Elements
**Problem**: Number lines without numbers, graphs without labels
**Solution**: Always include:
- Number labels on number lines
- Axis labels on graphs
- Clear visual indicators

## 🛠️ Validation Helper Functions

Create these helpers to validate worksheets:

```typescript
// Validate answer is in range
function validateAnswer(answer: number, min: number, max: number): boolean {
  return answer >= min && answer <= max;
}

// Validate problem generation
function generateValidProblem<T>(
  generator: () => T | null,
  validator: (problem: T) => boolean,
  maxAttempts: number = 50
): T {
  for (let i = 0; i < maxAttempts; i++) {
    const problem = generator();
    if (problem && validator(problem)) {
      return problem;
    }
  }
  // Fallback
  throw new Error('Failed to generate valid problem');
}
```

## 📝 Worksheet Type Templates

### Type 1: Math Problems (Addition/Subtraction)
```typescript
// ✅ GOOD: Validates answers
const problems = [];
for (let i = 0; i < 10; i++) {
  let a, b, answer;
  do {
    a = nextInt(1, 20);
    b = nextInt(1, 20);
    answer = a + b;
  } while (answer > 20); // Ensure valid
  problems.push({ a, b, answer });
}
```

### Type 2: Color-by-Number
```typescript
// ✅ GOOD: Only generates problems with valid colors
const validPairs = [];
for (let a = min; a <= max; a++) {
  for (let b = min; b <= max; b++) {
    if (colorMap[a * b]) {
      validPairs.push([a, b, a * b]);
    }
  }
}
const problems = Array.from({length: N}).map(() => {
  const idx = nextInt(0, validPairs.length - 1);
  return validPairs[idx];
});
```

### Type 3: Fill-in-the-Blank
```typescript
// ✅ GOOD: Answers only in answer key, not in blanks
<div className="h-10 border-b-[3px] border-slate-600 w-full">
  {showAnswers && activeDocs.includes('doc-id') ? (
    <span className="text-emerald-700">{answer}</span>
  ) : null}
</div>
```

## 🧪 Testing Checklist

Before considering a worksheet complete:

- [ ] Show answers toggle appears
- [ ] Answers are hidden by default
- [ ] Answers appear only when toggled
- [ ] All problems are valid (no impossible answers)
- [ ] Answer key shows correct answers
- [ ] Visual elements are clear (numbers, labels, colors)
- [ ] Problems are varied (not always the same)
- [ ] No hardcoded answers visible
- [ ] Hints/examples are conditional
- [ ] Works in print mode

## 🎨 Visual Element Checklist

- [ ] Number lines have number labels
- [ ] Graphs have axis labels and data labels
- [ ] Colors match their names (red bar = red color)
- [ ] Fractions show clear divisions
- [ ] Shapes are properly sized and visible
- [ ] Text is readable and properly sized

## 📚 Best Practices

1. **Always Use Seeded RNG**: For variety + reproducibility
2. **Validate Before Adding**: Check answers are in valid range
3. **Conditional Display**: Hints/answers only when toggled
4. **Complete Answer Keys**: Show all answers, not just examples
5. **Visual Clarity**: Labels, numbers, colors all visible
6. **Test Both Modes**: With and without answers shown
7. **Print Preview**: Check how it looks when printed

## 🚀 Quick Start Template

Copy this template for new worksheets:

```typescript
{activeDocs.includes('new-worksheet-id') && (() => {
  const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`);
  function nextInt(min: number, max: number) { 
    return Math.floor(rng() * (max - min + 1)) + min; 
  }
  
  // Generate problems with validation
  const problems = [];
  for (let i = 0; i < 10; i++) {
    // Generate and validate
    let problem;
    do {
      problem = generateProblem(); // Your logic
    } while (!isValid(problem));
    problems.push(problem);
  }
  
  return (
    <WorksheetSectionWrapper
      docId="new-worksheet-id"
      title="Worksheet Title"
      emoji="🎯"
      description="What students should do."
    >
      {/* Content - NO answers visible by default */}
      {problems.map((p, i) => (
        <div key={i}>
          {/* Problem display */}
          {/* Answers only if showAnswers */}
        </div>
      ))}
      
      {showAnswersForDoc('new-worksheet-id', () => (
        <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
          <div className="font-semibold mb-1">Answer key</div>
          <ul className="list-disc list-inside space-y-0.5">
            {problems.map((p, i) => (
              <li key={i}>{/* Show answer */}</li>
            ))}
          </ul>
        </div>
      ))}
    </WorksheetSectionWrapper>
  );
})()}
```

## ⚠️ Critical Rules

1. **NEVER** show answers in the main worksheet area by default
2. **ALWAYS** add docId to `ANSWERABLE_BASE_DOC_IDS`
3. **ALWAYS** validate generated problems
4. **ALWAYS** include visual labels (numbers, colors, etc.)
5. **ALWAYS** test with answers hidden AND shown

## 🔄 Review Process

Before pushing any worksheet:
1. Check it against this guide
2. Test show/hide answers toggle
3. Verify all problems are valid
4. Check visual elements are clear
5. Test print preview
