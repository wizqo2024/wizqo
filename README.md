# Wizqo - 7-Day Hobby Learning Platform (with Kids Hub)

A cutting-edge AI-powered hobby learning platform that generates hyper-personalized 7-day learning journeys using advanced machine learning and adaptive content strategies.

## Features

- **AI-Generated Learning Plans**: Personalized 7-day hobby plans powered by DeepSeek AI
- **User Authentication**: Email/password, Google OAuth, and GitHub OAuth sign-in options
- **Interactive Dashboard**: Track progress, save plans, and view learning statistics
- **YouTube Integration**: Curated video tutorials for each hobby
- **Responsive Design**: Modern UI with dark/light mode support
- **Progress Tracking**: Mark days complete and unlock sequential content

### Kids Hub (New)
- **Games (4):**
  - Memory Match – find pairs with best‑moves and timer stats
  - Word Search – Animals/Space with selectable theme, found list, timer
  - Puzzle Game – drag & drop jigsaw with interlocking edges (SVG clipPath)
  - Typing Safari – type letters/words to help animals cross; WPM, accuracy, timer, sound effects
- **Victory sounds:** Lightweight Web Audio chimes across all games on completion
- **Printables:** `/print` renders print‑friendly Word Search (Animals), Sudoku 4×4, Coloring; additional docs via `?doc=`
- **Logo on print view** and clean PDF output (browser Print → Save as PDF)

### Blog Improvements
- **Accordion FAQs**: Consistent shadcn/radix UI for FAQ sections
- **Auto‑link internal paths** like `[/kids]` and `[/kids/games/typing]`
- **TOC smoothing**: Clickable Table of Contents with smooth scroll to headings
- **Markdown images**: Images placed under each heading render cleanly with accessible alts

### SEO
- **Sitemap** includes `/kids`
- **Structured data** on Kids Hub: `FAQPage` + `BreadcrumbList`
- Canonicals + robots meta via `SEOMetaTags`

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Express.js, TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with OAuth providers
- **AI**: DeepSeek API for plan generation
- **Deployment**: Vercel-ready configuration

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd wizqo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file with:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   DEEPSEEK_API_KEY=your_deepseek_api_key
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

## Blog Content & SEO

- Location for posts: `client/content/blog/*.md`
- Front matter template:
  ```md
  ---
  title: "Post Title"
  slug: post-slug
  excerpt: "1–2 line meta description (<=160 chars)."
  category: Learning Tips
  readTime: 5–7 min read
  cover: https://...
  imageAlt: "Accessible description"
  date: YYYY-MM-DD
  ---
  ```
- Images: use distinct Unsplash URLs per section; avoid reuse across posts
- Internal links:
  - Auto‑link supports `Label → [/path]`, `[Label](/path)`, and `[/path]`
  - Blog slugs still supported via `/blog?post=slug` and `/blog/slug`
- Canonicals: `https://wizqo.com/blog/slug`
- robots.txt and sitemap: in `client/public/robots.txt` and `client/public/sitemap.xml`
- Rendering: Numbered sections render with grouped content; FAQ blocks render as accordion

## Deployment

### Vercel Deployment

1. **Push to GitHub**
2. **Connect to Vercel**
3. **Set Environment Variables**:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `DEEPSEEK_API_KEY`

### Supabase Configuration

1. **Enable Authentication Providers** in Supabase Dashboard:
   - Email/Password ✓
   - Google OAuth ✓
   - GitHub OAuth ✓

2. **Add Redirect URLs**:
   - Production: `https://yourdomain.com`
   - Supabase callback: `https://your-project.supabase.co/auth/v1/callback`

3. **Database Setup**:
   ```sql
   -- Run the migration in supabase/migrations/001_initial_setup.sql
   ```

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── hooks/          # React hooks
│   │   ├── lib/            # Utilities
│   │   └── pages/          # Page components
├── server/                 # Express backend
├── shared/                 # Shared TypeScript schemas
├── supabase/              # Database migrations
└── vercel.json            # Vercel deployment config
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run vercel-build` - Vercel build command
- `npm run db:push` - Push database schema

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details
 
---

## App Routes (SPA)

- Home: `/`
- Generate plan: `/generate`
- Kids Hub: `/kids`
- Kids games:
  - Memory Match: `/kids/games/memory`
  - Word Search: `/kids/games/word-search`
  - Puzzle: `/kids/games/puzzle`
  - Typing Safari: `/kids/games/typing`
- Printables: `/print` (default Word Search – Animals)
  - `?doc=ws-animals | ws-space | sudoku4 | sudoku6 | coloring | spotdiff`
- Blog index: `/blog`
- Blog post: `/blog/slug`

## Implementation Notes

- Router: custom pathname parsing in `client/src/App.tsx` (no react‑router)
- Kids Hub images: deduped/safe via `SmartImage` in Kids page; fallbacks for reliability
- Printables page uses a `SafeImg` helper with multiple sources + onError fallback
- Games use accessible buttons and sound effects (Web Audio) gated on user interaction

## Branching Policy

- Default: work on feature branches; avoid pushing directly to `main`
- Open PRs for review before merging to `main`

