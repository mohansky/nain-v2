-- Create memories table
CREATE TABLE child_memories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  child_id UUID NOT NULL REFERENCES child_profiles(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  images TEXT[] DEFAULT '{}', -- Array of image URLs
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  memory_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create memory_likes table for likes functionality
CREATE TABLE memory_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  memory_id UUID NOT NULL REFERENCES child_memories(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(memory_id, user_id)
);

-- Create memory_comments table for comments functionality
CREATE TABLE memory_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  memory_id UUID NOT NULL REFERENCES child_memories(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  comment TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX idx_child_memories_child_id ON child_memories(child_id);
CREATE INDEX idx_child_memories_created_by ON child_memories(created_by);
CREATE INDEX idx_child_memories_memory_date ON child_memories(memory_date DESC);
CREATE INDEX idx_memory_likes_memory_id ON memory_likes(memory_id);
CREATE INDEX idx_memory_comments_memory_id ON memory_comments(memory_id);

-- Enable RLS
ALTER TABLE child_memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE memory_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE memory_comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for child_memories
-- Users can view memories for children they have access to
CREATE POLICY "Users can view memories for their children" ON child_memories
  FOR SELECT USING (
    child_id IN (
      SELECT child_id FROM user_children WHERE user_id = auth.uid()
    )
  );

-- Users can create memories for children they have access to
CREATE POLICY "Users can create memories for their children" ON child_memories
  FOR INSERT WITH CHECK (
    child_id IN (
      SELECT child_id FROM user_children WHERE user_id = auth.uid() AND can_edit = true
    )
    AND created_by = auth.uid()
  );

-- Users can update their own memories
CREATE POLICY "Users can update their own memories" ON child_memories
  FOR UPDATE USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

-- Users can delete their own memories
CREATE POLICY "Users can delete their own memories" ON child_memories
  FOR DELETE USING (created_by = auth.uid());

-- RLS Policies for memory_likes
-- Users can view likes for memories they can access
CREATE POLICY "Users can view likes for accessible memories" ON memory_likes
  FOR SELECT USING (
    memory_id IN (
      SELECT cm.id FROM child_memories cm
      JOIN user_children uc ON cm.child_id = uc.child_id
      WHERE uc.user_id = auth.uid()
    )
  );

-- Users can like/unlike memories for children they have access to
CREATE POLICY "Users can like accessible memories" ON memory_likes
  FOR INSERT WITH CHECK (
    memory_id IN (
      SELECT cm.id FROM child_memories cm
      JOIN user_children uc ON cm.child_id = uc.child_id
      WHERE uc.user_id = auth.uid()
    )
    AND user_id = auth.uid()
  );

CREATE POLICY "Users can unlike their own likes" ON memory_likes
  FOR DELETE USING (user_id = auth.uid());

-- RLS Policies for memory_comments
-- Users can view comments for memories they can access
CREATE POLICY "Users can view comments for accessible memories" ON memory_comments
  FOR SELECT USING (
    memory_id IN (
      SELECT cm.id FROM child_memories cm
      JOIN user_children uc ON cm.child_id = uc.child_id
      WHERE uc.user_id = auth.uid()
    )
  );

-- Users can comment on memories for children they have access to
CREATE POLICY "Users can comment on accessible memories" ON memory_comments
  FOR INSERT WITH CHECK (
    memory_id IN (
      SELECT cm.id FROM child_memories cm
      JOIN user_children uc ON cm.child_id = uc.child_id
      WHERE uc.user_id = auth.uid()
    )
    AND user_id = auth.uid()
  );

-- Users can update their own comments
CREATE POLICY "Users can update their own comments" ON memory_comments
  FOR UPDATE USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Users can delete their own comments
CREATE POLICY "Users can delete their own comments" ON memory_comments
  FOR DELETE USING (user_id = auth.uid());

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_child_memories_updated_at
    BEFORE UPDATE ON child_memories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_memory_comments_updated_at
    BEFORE UPDATE ON memory_comments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();