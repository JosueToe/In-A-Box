CREATE TABLE IF NOT EXISTS startup_ideas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  problem TEXT NOT NULL,
  audience TEXT NOT NULL,
  solution TEXT NOT NULL,
  names JSONB,
  pitch TEXT,
  pitch_deck JSONB,
  viral_posts TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS startup_ideas_user_id_idx ON startup_ideas (user_id);

alter publication supabase_realtime add table startup_ideas;
