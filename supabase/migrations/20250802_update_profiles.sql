-- Update profiles table with new fields for user profile requirements
-- Adding language, relationship, location, primary caregiver status, phone, and making fields optional

-- First check if profiles table exists and add new columns
DO $$ 
BEGIN
    -- Add language column with enum constraint
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'language') THEN
        ALTER TABLE profiles ADD COLUMN language VARCHAR(20) DEFAULT 'english' CHECK (language IN ('english', 'hindi', 'assamese', 'bengali', 'kannada', 'tamil', 'marathi'));
    END IF;

    -- Add relationship column with enum constraint  
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'relationship') THEN
        ALTER TABLE profiles ADD COLUMN relationship VARCHAR(20) CHECK (relationship IN ('child', 'father', 'mother', 'nanny', 'grandparent'));
    END IF;

    -- Add location column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'location') THEN
        ALTER TABLE profiles ADD COLUMN location TEXT;
    END IF;

    -- Add primary caregiver boolean column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'is_primary_caregiver') THEN
        ALTER TABLE profiles ADD COLUMN is_primary_caregiver BOOLEAN DEFAULT false;
    END IF;

    -- Add phone number column (optional)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'phone_number') THEN
        ALTER TABLE profiles ADD COLUMN phone_number VARCHAR(20);
    END IF;

    -- Drop website column if it exists
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'website') THEN
        ALTER TABLE profiles DROP COLUMN website;
    END IF;
    
    -- Make username optional by removing NOT NULL constraint if it exists  
    ALTER TABLE profiles ALTER COLUMN username DROP NOT NULL;

    -- Make avatar_url optional by removing NOT NULL constraint if it exists
    ALTER TABLE profiles ALTER COLUMN avatar_url DROP NOT NULL;
END $$;

-- Create or replace the profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    username VARCHAR(50),
    avatar_url TEXT,
    language VARCHAR(20) DEFAULT 'english' CHECK (language IN ('english', 'hindi', 'assamese', 'bengali', 'kannada', 'tamil', 'marathi')),
    relationship VARCHAR(20) CHECK (relationship IN ('child', 'father', 'mother', 'nanny', 'grandparent')),
    location TEXT,
    is_primary_caregiver BOOLEAN DEFAULT false,
    phone_number VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view and edit their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;  
CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);