-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create hobby_plans table
CREATE TABLE IF NOT EXISTS hobby_plans (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    hobby VARCHAR(255) NOT NULL,
    title TEXT NOT NULL,
    overview TEXT,
    plan_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_progress table
CREATE TABLE IF NOT EXISTS user_progress (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES hobby_plans(id) ON DELETE CASCADE,
    completed_days INTEGER[] DEFAULT '{}',
    current_day INTEGER DEFAULT 1,
    unlocked_days INTEGER[] DEFAULT '{1}',
    last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, plan_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_hobby_plans_user_id ON hobby_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_hobby_plans_hobby ON hobby_plans(hobby);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_plan_id ON user_progress(plan_id);

-- Enable Row Level Security (RLS)
ALTER TABLE hobby_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for hobby_plans
CREATE POLICY "Users can view their own hobby plans" ON hobby_plans
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own hobby plans" ON hobby_plans
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own hobby plans" ON hobby_plans
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own hobby plans" ON hobby_plans
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for user_progress
CREATE POLICY "Users can view their own progress" ON user_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress" ON user_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" ON user_progress
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own progress" ON user_progress
    FOR DELETE USING (auth.uid() = user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_hobby_plans_updated_at BEFORE UPDATE ON hobby_plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at BEFORE UPDATE ON user_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();