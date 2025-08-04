# Wizqo - Installation Guide

## Quick Setup

1. **Extract the files** from the downloaded archive
2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables** (create `.env` file):
   ```
   DATABASE_URL=your_postgresql_url
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   DEEPSEEK_API_KEY=your_deepseek_api_key
   YOUTUBE_API_KEY=your_youtube_api_key
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

## What's Included

- ✅ Complete React frontend with TypeScript
- ✅ Express backend with API routes
- ✅ Supabase authentication and database integration
- ✅ AI-powered hobby plan generation (DeepSeek API)
- ✅ YouTube video integration
- ✅ Progress tracking system
- ✅ Responsive design with dark/light mode
- ✅ All UI components and styling

## Database Setup

Follow the instructions in `SUPABASE_SETUP_INSTRUCTIONS.md` to set up your Supabase database with the required tables.

## Deployment

The project is ready for deployment on:
- Vercel (recommended)
- Netlify
- Replit
- Any Node.js hosting platform

See `replit.md` for detailed architecture information and deployment notes.