/*
  # User Progress Schema Update

  1. Changes
    - Create user_progress table if not exists
    - Enable RLS
    - Add policies for authenticated users
    
  2. Security
    - Safely create policies by checking existence first
    - Policies allow users to:
      - Read their own progress
      - Insert their own progress
      - Update their own progress
*/

-- Create table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  lesson_id text NOT NULL,
  module_id text NOT NULL,
  completed boolean DEFAULT false,
  completion_date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, lesson_id, module_id)
);

-- Enable RLS
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Safely create policies using DO block
DO $$ 
BEGIN
  -- Create select policy if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_progress' 
    AND policyname = 'Users can read own progress'
  ) THEN
    CREATE POLICY "Users can read own progress"
      ON user_progress
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;

  -- Create insert policy if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_progress' 
    AND policyname = 'Users can insert own progress'
  ) THEN
    CREATE POLICY "Users can insert own progress"
      ON user_progress
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;

  -- Create update policy if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_progress' 
    AND policyname = 'Users can update own progress'
  ) THEN
    CREATE POLICY "Users can update own progress"
      ON user_progress
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;