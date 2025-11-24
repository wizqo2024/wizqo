# Worksheet Creation Guide

## How Worksheets Are Currently Created

Your worksheets are created using **React/JSX** in the file `client/src/pages/PrintablesPage.tsx`. Each worksheet is a block of React code that renders HTML/JSX.

## Worksheet Structure

Each worksheet follows this structure:

```tsx
{activeDocs.includes('your-worksheet-id') && (
  <WorksheetSectionWrapper
    docId="your-worksheet-id"
    title="Worksheet Title"
    emoji="🔢"
    description="Short description"
    problemCount={4}
    learningObjectives={[
      'Objective 1',
      'Objective 2',
      'Objective 3'
    ]}
    parentTeacherTips={[
      'Tip 1',
      'Tip 2',
      'Tip 3'
    ]}
  >
    {/* Worked Example */}
    <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
      <div className="font-semibold text-blue-900 mb-3">📚 Example</div>
      {/* Example content */}
    </div>

    {/* Main Worksheet Content */}
    <div className="bg-white border border-slate-300 rounded p-4">
      {/* Problems, questions, exercises */}
    </div>

    {/* Challenge/Extension */}
    <div className="mt-6 p-4 bg-purple-50 border-2 border-purple-200 rounded">
      {/* Challenge problems */}
    </div>

    {/* Answer Key (conditionally shown) */}
    {showAnswersForDoc('your-worksheet-id', () => (
      <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded">
        <div className="font-bold text-emerald-900 mb-3">✅ Answer Key</div>
        {/* Answers */}
      </div>
    ))}
  </WorksheetSectionWrapper>
)}
```

## How to Use Nano Banana (or Any AI Tool) to Create Worksheets

### Step 1: Ask Nano Banana to Create the Worksheet

Ask Nano Banana to create a worksheet in this format:

**Example Prompt:**
```
Create a 2nd grade math worksheet for "Place Value to 100" with:
- Title: Place Value to 100
- 4 problems where students identify tens and ones
- Worked example showing how to solve
- Answer key
- Learning objectives
- Parent/teacher tips

Format the output as React/JSX code that I can add to my PrintablesPage.tsx file.
```

### Step 2: What You Need to Provide Me

When you get the code from Nano Banana, provide me with:

1. **The docId** (unique identifier, e.g., `place-value-100`)
2. **The complete React/JSX code** for the worksheet
3. **Where it should be added** (which grade level or category)

### Step 3: What I'll Do

I will:
1. Add the worksheet code to `PrintablesPage.tsx`
2. Add the docId to the `ANSWERABLE_BASE_DOC_IDS` array (if it has answers)
3. Add a case in `resolveDocTitle()` function for the title
4. Add translation keys (optional, can use English only)
5. Test that it renders correctly

## Required Information for Each Worksheet

### 1. Basic Info
- **docId**: Unique identifier (e.g., `place-value-100`, `fractions-basics`)
- **Title**: Display title (e.g., "Place Value to 100")
- **Emoji**: Icon for the worksheet (e.g., 🔢, 📐, 🍕)
- **Description**: Short description (1 sentence)

### 2. Educational Info
- **Learning Objectives**: Array of 3-5 objectives
- **Parent/Teacher Tips**: Array of 3-5 tips
- **Problem Count**: Number of problems/exercises

### 3. Content Structure
- **Worked Example**: Step-by-step example (optional but recommended)
- **Main Problems**: The actual worksheet content
- **Challenge/Extension**: Optional harder problems
- **Answer Key**: Answers (hidden by default, shown when "Show Answers" is clicked)

## Example: Complete Worksheet Template

Here's a complete template you can give to Nano Banana:

```tsx
// Template for Nano Banana
Create a [GRADE] grade [SUBJECT] worksheet with:

docId: [unique-id]
Title: [Worksheet Title]
Emoji: [relevant emoji]
Description: [One sentence description]

Learning Objectives:
- [Objective 1]
- [Objective 2]
- [Objective 3]

Parent/Teacher Tips:
- [Tip 1]
- [Tip 2]
- [Tip 3]

Problems: [Number] problems about [topic]

Format as React/JSX code following this structure:
- Use WorksheetSectionWrapper component
- Include worked example
- Include main problems
- Include answer key with showAnswersForDoc
- Use Tailwind CSS classes
- Make it print-friendly
```

## Code Format Requirements

### 1. Use React/JSX
- All worksheets are React components
- Use JSX syntax
- Use Tailwind CSS classes

### 2. Print-Friendly Styling
- Use `print:hidden` for elements that shouldn't print
- Use `print:block` for elements only visible when printing
- Use `break-inside-avoid` to prevent content from splitting across pages

### 3. Answer Key Pattern
```tsx
{showAnswersForDoc('your-doc-id', () => (
  <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded">
    <div className="font-bold text-emerald-900 mb-3">✅ Answer Key</div>
    {/* Answers here */}
  </div>
))}
```

### 4. Conditional Rendering
```tsx
{activeDocs.includes('your-doc-id') && (
  <WorksheetSectionWrapper>
    {/* Worksheet content */}
  </WorksheetSectionWrapper>
)}
```

## Where Worksheets Are Located

- **File**: `client/src/pages/PrintablesPage.tsx`
- **Line**: Around line 15,000+ (worksheets are added throughout the file)
- **Organization**: Worksheets are grouped by grade level and subject

## Adding a New Worksheet - Step by Step

1. **Get the code from Nano Banana** (React/JSX format)
2. **Give me the code** and tell me:
   - The docId
   - The grade level
   - The subject/category
3. **I'll add it** to PrintablesPage.tsx
4. **I'll register it** in the necessary arrays/functions
5. **You test it** by visiting `/print?doc=your-doc-id`

## Important Notes

- **docId must be unique** - check existing worksheets to avoid duplicates
- **Use seeded random number generator** for problems that need randomization
- **Answers should be hidden by default** - use `showAnswersForDoc()` function
- **Make it print-friendly** - worksheets are designed to be printed as PDFs
- **Follow the existing style** - match the formatting of similar worksheets

## Example: What to Ask Nano Banana

```
Create a 3rd grade math worksheet for "Multiplication Arrays" with:

- docId: mult-arrays-grade3
- Title: Multiplication Arrays
- Emoji: ✖️
- Description: Practice multiplication using visual arrays
- 6 problems showing arrays (2x3, 3x4, etc.)
- Worked example showing how arrays represent multiplication
- Answer key
- Learning objectives about arrays and multiplication
- Tips for parents/teachers

Format as React/JSX code that matches the style of existing worksheets in PrintablesPage.tsx. Use Tailwind CSS classes and make it print-friendly.
```

Then when Nano Banana gives you the code, just send it to me and I'll integrate it into your site!
