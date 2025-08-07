-- Add gender field to child_profiles table
ALTER TABLE child_profiles 
ADD COLUMN IF NOT EXISTS gender VARCHAR(10) CHECK (gender IN ('boy', 'girl'));

-- Set default gender to null (optional field)
-- No default value needed as this will be collected during profile creation