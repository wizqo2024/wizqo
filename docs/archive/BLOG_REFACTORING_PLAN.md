# Blog Page Refactoring Plan

## Overview
Splitting the 2,300-line `BlogPage.tsx` into smaller, maintainable components while preserving all SEO features and functionality.

## File Structure

```
client/src/pages/blog/
├── types.ts                    # BlogPost interface
├── constants.ts                # CATEGORY_IMAGES, GENERIC_BLOG_IMAGE, basePosts
├── utils.ts                    # getPostImage, getPostRating, loadMarkdownPosts
├── components/
│   ├── BlogPostCard.tsx       # Post card component (with accessibility)
│   ├── BlogFilters.tsx         # Filter sidebar (with keyboard nav)
│   ├── MarkdownRenderer.tsx   # Markdown parsing logic
│   ├── BlogPostView.tsx       # Individual post view
│   └── BlogList.tsx           # Blog listing component
└── BlogPage.tsx               # Main container (refactored, ~200 lines)

```

## Accessibility Improvements

1. **ARIA Labels**: Add `aria-label` to all interactive elements
2. **Keyboard Navigation**: Add `tabIndex`, `onKeyDown` handlers
3. **Focus Management**: Proper focus handling for modals/accordions
4. **Screen Reader Support**: Add `role`, `aria-expanded`, `aria-current`
5. **Skip Links**: Add skip to main content link

## SEO Preservation

- All `SEOMetaTags` remain unchanged
- JSON-LD structured data preserved
- Canonical URLs maintained
- URL structure unchanged
- Rendered HTML identical

## Implementation Status

- [x] Created types.ts
- [ ] Create constants.ts
- [ ] Create utils.ts
- [ ] Create BlogPostCard.tsx
- [ ] Create BlogFilters.tsx
- [ ] Create MarkdownRenderer.tsx
- [ ] Create BlogPostView.tsx
- [ ] Create BlogList.tsx
- [ ] Refactor BlogPage.tsx
