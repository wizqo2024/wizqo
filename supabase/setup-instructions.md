# Supabase Database Setup Instructions

## Prerequisites
- Supabase account and project created
- Environment variables configured:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`

## Database Schema Setup

1. **Apply the schema to your Supabase database:**
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Copy and paste the contents of `supabase/schema.sql`
   - Execute the SQL script

2. **Verify the tables were created:**
   - Go to Database → Tables in Supabase dashboard
   - You should see:
     - `user_profiles`
     - `hobby_plans`
     - `user_progress`

3. **Test Row Level Security (RLS):**
   - RLS policies are automatically applied
   - Users can only access their own data
   - Anonymous users cannot access any data

## Authentication Setup

1. **Configure OAuth providers (if needed):**
   - Go to Authentication → Providers
   - Enable Google OAuth
   - Add your domain to authorized redirect URLs

2. **Test authentication:**
   - Users can sign up/login via Google OAuth
   - User profiles are automatically created on signup
   - User data is isolated by user ID

## Data Flow

1. **User Registration:**
   - User signs up via Supabase Auth
   - Profile automatically created in `user_profiles` table
   - User can access dashboard

2. **Hobby Plan Creation:**
   - AI generates personalized plan
   - Plan saved to `hobby_plans` table
   - Progress initialized in `user_progress` table

3. **Progress Tracking:**
   - Day completion tracked in real-time
   - Progress persisted across sessions
   - Statistics calculated for dashboard

## Troubleshooting

- **Connection issues:** Check environment variables
- **Authentication problems:** Verify OAuth configuration
- **Data access issues:** Check RLS policies
- **Performance concerns:** Indexes are pre-configured

## Migration from Local Database

If migrating from a local PostgreSQL setup:
1. Export existing data
2. Apply Supabase schema
3. Import data with proper user associations
4. Update application configuration