# Missing Pages - Request Indexing in Google Search Console

## Priority 1: Critical Pages (Request First)

### 1. Homepage (MOST IMPORTANT)
**URL:** `https://wizqo.com/`
**Search Console Link:**
```
https://search.google.com/search-console/inspect?resource_id=sc-domain%3Awizqo.com&url=https%3A%2F%2Fwizqo.com%2F
```

### 2. Kids Hub Main Page
**URL:** `https://wizqo.com/kids`
**Search Console Link:**
```
https://search.google.com/search-console/inspect?resource_id=sc-domain%3Awizqo.com&url=https%3A%2F%2Fwizqo.com%2Fkids
```

## Priority 2: Kids Games Pages

### 3. Memory Game
**URL:** `https://wizqo.com/kids/games/memory`
**Search Console Link:**
```
https://search.google.com/search-console/inspect?resource_id=sc-domain%3Awizqo.com&url=https%3A%2F%2Fwizqo.com%2Fkids%2Fgames%2Fmemory
```

### 4. Word Search Game
**URL:** `https://wizqo.com/kids/games/word-search`
**Search Console Link:**
```
https://search.google.com/search-console/inspect?resource_id=sc-domain%3Awizqo.com&url=https%3A%2F%2Fwizqo.com%2Fkids%2Fgames%2Fword-search
```

### 5. Typing Game
**URL:** `https://wizqo.com/kids/games/typing`
**Search Console Link:**
```
https://search.google.com/search-console/inspect?resource_id=sc-domain%3Awizqo.com&url=https%3A%2F%2Fwizqo.com%2Fkids%2Fgames%2Ftyping
```

## Priority 3: Blog Posts

### 6. Free Kindergarten Worksheets PDF
**URL:** `https://wizqo.com/blog/free-kdg-worksheets-pdf`
**Search Console Link:**
```
https://search.google.com/search-console/inspect?resource_id=sc-domain%3Awizqo.com&url=https%3A%2F%2Fwizqo.com%2Fblog%2Ffree-kdg-worksheets-pdf
```

### 7. Relaxing Hobbies
**URL:** `https://wizqo.com/blog/relaxing-hobbies`
**Search Console Link:**
```
https://search.google.com/search-console/inspect?resource_id=sc-domain%3Awizqo.com&url=https%3A%2F%2Fwizqo.com%2Fblog%2Frelaxing-hobbies
```

### 8. Cheap Hobbies at Home
**URL:** `https://wizqo.com/blog/cheap-hobbies-at-home`
**Search Console Link:**
```
https://search.google.com/search-console/inspect?resource_id=sc-domain%3Awizqo.com&url=https%3A%2F%2Fwizqo.com%2Fblog%2Fcheap-hobbies-at-home
```

### 9. Educational Games for Kids
**URL:** `https://wizqo.com/blog/educational-games-for-kids`
**Search Console Link:**
```
https://search.google.com/search-console/inspect?resource_id=sc-domain%3Awizqo.com&url=https%3A%2F%2Fwizqo.com%2Fblog%2Feducational-games-for-kids
```

### 10. Quiet Time
**URL:** `https://wizqo.com/blog/quiet-time`
**Search Console Link:**
```
https://search.google.com/search-console/inspect?resource_id=sc-domain%3Awizqo.com&url=https%3A%2F%2Fwizqo.com%2Fblog%2Fquiet-time
```

---

## How to Use These Links

1. **Click each link** - It will open Google Search Console URL Inspection tool
2. **Click "Request Indexing"** button
3. **Wait for confirmation** - Google will process the request
4. **Check back in 1-3 days** - Pages should appear in search results

## Quick Access

**Google Search Console Home:**
```
https://search.google.com/search-console
```

**URL Inspection Tool:**
```
https://search.google.com/search-console/inspect
```

---

## Notes

- **Homepage is CRITICAL** - Request this first after deployment
- All pages are in the sitemap (`https://wizqo.com/sitemap.xml`)
- Prerender script has been updated to include homepage
- www → non-www redirect is configured
- After requesting indexing, allow 1-3 days for Google to crawl and index

---

## Status Check

After requesting indexing, verify pages are indexed by searching:
```
site:wizqo.com "page title or URL"
```

Example:
```
site:wizqo.com "What Hobby Means"
```
