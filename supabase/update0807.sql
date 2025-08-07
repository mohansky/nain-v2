CREATE TABLE breastfeeding_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER,
  side VARCHAR(10) CHECK (side IN ('left', 'right', 'both')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE breastfeeding_sessions 
ADD COLUMN duration_seconds INTEGER,
ADD COLUMN total_duration_seconds INTEGER;

-- Update existing records to have seconds (if you have existing data)
UPDATE breastfeeding_sessions 
SET duration_seconds = 0, 
    total_duration_seconds = duration_minutes * 60 
WHERE duration_seconds IS NULL;