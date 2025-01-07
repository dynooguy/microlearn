/*
  # Add module_id to user_progress table with data handling

  1. Changes
    - Add module_id column as nullable first
    - Update existing records
    - Make column not null
    - Update constraints and policies
*/

-- Add module_id column as nullable first
ALTER TABLE user_progress 
  ADD COLUMN IF NOT EXISTS module_id text;

-- Update existing records with a default module ID
UPDATE user_progress 
SET module_id = 'legacy-module'
WHERE module_id IS NULL;

-- Now make the column not null
ALTER TABLE user_progress 
  ALTER COLUMN module_id SET NOT NULL;

-- Update constraints
ALTER TABLE user_progress 
  DROP CONSTRAINT IF EXISTS user_progress_user_id_lesson_id_key,
  ADD CONSTRAINT user_progress_user_id_lesson_id_module_id_key 
    UNIQUE(user_id, lesson_id, module_id);

-- Update policies
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