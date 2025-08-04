# Supabase Database Setup Instructions

## Critical Issue Detected - RLS POLICY BLOCKING SAVES
Your Supabase database has Row-Level Security policies that are blocking plan saves. This is why:
- Plans are not saving to the database (RLS policy violation)
- Save operation hangs and times out
- Dashboard shows empty data even when plans exist

## Quick Fix Required

1. **Open your Supabase project dashboard**
   - Go to https://supabase.com/dashboard/projects
   - Select your Wizqo project

2. **Open the SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Copy and paste the RLS fix SQL script**
   - Copy the entire contents of `SUPABASE_RLS_FIX.sql` file
   - Paste it into the SQL editor
   - Click "Run" to execute

4. **If tables don't exist, also run the setup script**
   - Copy the entire contents of `supabase_complete_setup.sql` file
   - Paste it into the SQL editor
   - Click "Run" to execute

4. **Verify the tables were created**
   - Go to "Table Editor" in the sidebar
   - You should see these new tables:
     - `user_profiles` - Stores user information
     - `hobby_plans` - Stores generated learning plans
     - `user_progress` - Tracks user progress through plans

## What This Fixes

✅ **Plan Storage**: Your generated hobby plans will now save to the database
✅ **Dashboard Data**: Dashboard will show your saved plans and progress
✅ **Welcome Messages**: Proper user profile handling enables welcome messages
✅ **Progress Tracking**: Your learning progress will be saved across sessions
✅ **Data Security**: Row Level Security ensures your data is private

## Expected Results After Setup

1. Generate a new hobby plan - it will save to your dashboard
2. Navigate to dashboard - you'll see your saved plans
3. Progress tracking will work properly
4. Welcome messages will appear after sign-in

## Important Notes

- This is a one-time setup
- Existing users will automatically get profiles created
- All data is secured with Row Level Security (RLS)
- The setup includes proper indexes for performance

Execute this setup now to fix the database integration issues.