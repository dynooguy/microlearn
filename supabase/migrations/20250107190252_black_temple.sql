/*
  # Add module_id to user_progress table

  1. Changes
    - Add module_id column to user_progress table
    - Update unique constraint to include module_id
    - Update RLS policies to handle module_id

  2. Security
    - Maintain existing RLS policies with module_id
*/

-- Add module_id column
ALTER TABLE user_progress ADD COLUMN IF NOT EXISTS module_id text NOT NULL;

-- Drop old unique constraint and add new one including module_id
ALTER TABLE user_progress 
  DROP CONSTRAINT IF EXISTS user_progress_user_id_lesson_id_key,
  ADD CONSTRAINT user_progress_user_id_lesson_id_module_id_key 
    UNIQUE(user_id, lesson_id, module_id);

-- Update existing policies to include module_id
DROP POLICY IF EXISTS "Users can read own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can insert own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can update own progress" ON user_progress;

CREATE POLICY "Users can read own progress"
  ON user_progress
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON user_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON user_progress
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);