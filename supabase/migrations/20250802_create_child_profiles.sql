-- Create child profiles table
CREATE TABLE IF NOT EXISTS child_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    date_of_birth DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create child measurements table for tracking growth over time
CREATE TABLE IF NOT EXISTS child_measurements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    child_id UUID REFERENCES child_profiles(id) ON DELETE CASCADE NOT NULL,
    height_cm DECIMAL(5,2), -- Height in centimeters (e.g., 75.50 cm)
    weight_kg DECIMAL(5,2), -- Weight in kilograms (e.g., 12.35 kg)
    head_circumference_cm DECIMAL(5,2), -- Head circumference in centimeters (e.g., 45.20 cm)
    measured_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create junction table for user-child relationships
CREATE TABLE IF NOT EXISTS user_children (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    child_id UUID REFERENCES child_profiles(id) ON DELETE CASCADE NOT NULL,
    is_primary_caregiver BOOLEAN DEFAULT false,
    relationship VARCHAR(20) CHECK (relationship IN ('parent', 'father', 'mother', 'nanny', 'grandparent', 'guardian')),
    can_edit BOOLEAN DEFAULT false, -- Admin rights
    can_view BOOLEAN DEFAULT true,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    added_by UUID REFERENCES auth.users(id), -- Who added this relationship
    
    -- Ensure unique user-child pairs
    UNIQUE(user_id, child_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_child_measurements_child_id ON child_measurements(child_id);
CREATE INDEX IF NOT EXISTS idx_child_measurements_measured_at ON child_measurements(measured_at);
CREATE INDEX IF NOT EXISTS idx_user_children_user_id ON user_children(user_id);
CREATE INDEX IF NOT EXISTS idx_user_children_child_id ON user_children(child_id);
CREATE INDEX IF NOT EXISTS idx_user_children_primary_caregiver ON user_children(is_primary_caregiver);

-- Enable Row Level Security
ALTER TABLE child_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE child_measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_children ENABLE ROW LEVEL SECURITY;

-- RLS Policies for child_profiles
DROP POLICY IF EXISTS "Users can view children they have access to" ON child_profiles;
CREATE POLICY "Users can view children they have access to" ON child_profiles
    FOR SELECT USING (
        id IN (
            SELECT child_id FROM user_children 
            WHERE user_id = auth.uid() AND can_view = true
        )
    );

DROP POLICY IF EXISTS "Primary caregivers can insert child profiles" ON child_profiles;
CREATE POLICY "Primary caregivers can insert child profiles" ON child_profiles
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Primary caregivers can update child profiles" ON child_profiles;
CREATE POLICY "Primary caregivers can update child profiles" ON child_profiles
    FOR UPDATE USING (
        id IN (
            SELECT child_id FROM user_children 
            WHERE user_id = auth.uid() AND can_edit = true
        )
    );

DROP POLICY IF EXISTS "Primary caregivers can delete child profiles" ON child_profiles;
CREATE POLICY "Primary caregivers can delete child profiles" ON child_profiles
    FOR DELETE USING (
        id IN (
            SELECT child_id FROM user_children 
            WHERE user_id = auth.uid() AND can_edit = true
        )
    );

-- RLS Policies for child_measurements
DROP POLICY IF EXISTS "Users can view measurements for their children" ON child_measurements;
CREATE POLICY "Users can view measurements for their children" ON child_measurements
    FOR SELECT USING (
        child_id IN (
            SELECT child_id FROM user_children 
            WHERE user_id = auth.uid() AND can_view = true
        )
    );

DROP POLICY IF EXISTS "Users with edit rights can insert measurements" ON child_measurements;
CREATE POLICY "Users with edit rights can insert measurements" ON child_measurements
    FOR INSERT WITH CHECK (
        child_id IN (
            SELECT child_id FROM user_children 
            WHERE user_id = auth.uid() AND can_edit = true
        )
    );

DROP POLICY IF EXISTS "Users with edit rights can update measurements" ON child_measurements;
CREATE POLICY "Users with edit rights can update measurements" ON child_measurements
    FOR UPDATE USING (
        child_id IN (
            SELECT child_id FROM user_children 
            WHERE user_id = auth.uid() AND can_edit = true
        )
    );

DROP POLICY IF EXISTS "Users with edit rights can delete measurements" ON child_measurements;
CREATE POLICY "Users with edit rights can delete measurements" ON child_measurements
    FOR DELETE USING (
        child_id IN (
            SELECT child_id FROM user_children 
            WHERE user_id = auth.uid() AND can_edit = true
        )
    );

-- RLS Policies for user_children
DROP POLICY IF EXISTS "Users can view their child relationships" ON user_children;
CREATE POLICY "Users can view their child relationships" ON user_children
    FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Primary caregivers can manage child relationships" ON user_children;
CREATE POLICY "Primary caregivers can manage child relationships" ON user_children
    FOR ALL USING (
        -- User can manage if they are primary caregiver of the child
        child_id IN (
            SELECT child_id FROM user_children 
            WHERE user_id = auth.uid() AND is_primary_caregiver = true
        )
        OR 
        -- Or if they are adding themselves to a child (initial relationship)
        user_id = auth.uid()
    );

-- Function to automatically set admin rights for primary caregivers
CREATE OR REPLACE FUNCTION set_primary_caregiver_rights()
RETURNS TRIGGER AS $$
BEGIN
    -- If someone is being set as primary caregiver, give them edit rights
    IF NEW.is_primary_caregiver = true THEN
        NEW.can_edit = true;
        NEW.can_view = true;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically set rights for primary caregivers
DROP TRIGGER IF EXISTS trigger_set_primary_caregiver_rights ON user_children;
CREATE TRIGGER trigger_set_primary_caregiver_rights
    BEFORE INSERT OR UPDATE ON user_children
    FOR EACH ROW
    EXECUTE FUNCTION set_primary_caregiver_rights();

-- Function to get child's latest measurements
CREATE OR REPLACE FUNCTION get_child_latest_measurements(child_uuid UUID)
RETURNS TABLE (
    height_cm DECIMAL(5,2),
    weight_kg DECIMAL(5,2),
    head_circumference_cm DECIMAL(5,2),
    measured_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        cm.height_cm,
        cm.weight_kg,
        cm.head_circumference_cm,
        cm.measured_at
    FROM child_measurements cm
    WHERE cm.child_id = child_uuid
    ORDER BY cm.measured_at DESC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;