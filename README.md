# Wizqo - 7-Day Hobby Learning Platform

A cutting-edge AI-powered hobby learning platform that generates hyper-personalized 7-day learning journeys using advanced machine learning and adaptive content strategies.

## Features

- **AI-Generated Learning Plans**: Personalized 7-day hobby plans powered by DeepSeek AI
- **User Authentication**: Email/password, Google OAuth, and GitHub OAuth sign-in options
- **Interactive Dashboard**: Track progress, save plans, and view learning statistics
- **YouTube Integration**: Curated video tutorials for each hobby
- **Responsive Design**: Modern UI with dark/light mode support
- **Progress Tracking**: Mark days complete and unlock sequential content

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

MIT License - see LICENSE file for details# Trigger deployment
 
