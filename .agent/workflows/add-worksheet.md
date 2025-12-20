---
description: How to add a new worksheet to a category page while maintaining recency ordering
---

# Adding a New Worksheet

Follow these steps to add a new worksheet to any category page (e.g., Grade pages, Multiplication, etc.) to ensure it appears at the top of the list and handles links correctly.

### 1. Locate the Category Page
Find the relevant file in `client/src/pages/`. Examples:
- `WorksheetsThirdGradePage.tsx`
- `MultiplicationWorksheetsPage.tsx`
- `ReadingComprehensionPage.tsx`

### 2. Add the Worksheet Object
Find the `allWorksheets` (or similarly named) array. **Append** your new worksheet object to the **END** of the array. Because we have implemented `.reverse()`, adding it to the end ensures it appears at the **top** of the page.

```typescript
{
  title: "New Worksheet Title",
  description: "A brief description of what students will learn.",
  href: getWorksheetURL('your-slug', 'category-slug'),
  docId: "unique-doc-id",
  categories: ["basic", "practice"], // Must match existing category IDs on the page
  gradeRange: "3rd", // Optional: used for grouping on some pages
  // Use these ONLY for interactive/custom worksheets:
  // customPreviewUrl: "https://wizqo.com/print?doc=...",
  // customDownloadUrl: "https://wizqo.com/print?doc=..."
}
```

### 3. Add SEO Metadata (CRITICAL)
For each new worksheet, you **must** add its SEO details to `shared/worksheetSEO.ts`. This ensures it has a unique URL, meta description, and title for Google.

1. Open `shared/worksheetSEO.ts`.
2. Find `initializeWorksheetSEO()`.
3. Add a new manual override or ensure the auto-generator handles it.
   ```typescript
   WORKSHEET_SEO_MAP['unique-doc-id'] = {
     docId: 'unique-doc-id',
     slug: 'your-seo-slug',
     title: 'SEO Optimized Title',
     metaDescription: 'Description for Google search results...',
     grade: ['3rd Grade'],
     category: ['math'],
     // ... other fields
   }
   ```

### 4. Answer Key Support
If you want to provide a direct link to the **Answer Key** version:
- Add `&showAnswers=1` to the printable URL.
- The `PrintablesPage` will automatically toggle the answers on when this parameter is present.

### 5. Update Sitemap
After adding the SEO metadata, run the sitemap generator to notify search engines about the new page:
```bash
npx tsx scripts/generate-sitemap-worksheets.ts
```
This updates `client/public/sitemap_worksheets.xml`.

### 6. Translation Support
Add the `docId` to the translation files (e.g., `client/src/locales/en.json`) to support multi-language titles/descriptions:

```json
"worksheets": {
  "unique-doc-id": {
    "title": "Translated Title",
    "description": "Translated Description"
  }
}
```

### 7. Verification Checklist
- [ ] **Check Recency**: New worksheet is first in the list.
- [ ] **Check Thumbnail**: Preview loads correctly in the card.
- [ ] **Check Sitemap**: Run the script and check if the new slug is in `sitemap_worksheets.xml`.
- [ ] **Check Answer Toggle**: Append `&showAnswers=1` to the print URL and verify answers appear.
- [ ] **Check Mobile**: Verify the card looks good on small screens.

### 8. Deployment
Once verified:
```bash
git add .
git commit -m "feat: add [Title] worksheet with SEO and sitemap update"
git push
```
