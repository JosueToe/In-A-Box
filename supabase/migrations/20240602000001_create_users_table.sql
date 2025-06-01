-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  profile_image_url TEXT,
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable row level security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Users can view their own data";
CREATE POLICY "Users can view their own data"
ON users FOR SELECT
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Service role can manage all users";
CREATE POLICY "Service role can manage all users"
ON users FOR ALL
USING (auth.jwt() ->> 'role' = 'service_role');

-- Enable realtime
alter publication supabase_realtime add table users;
