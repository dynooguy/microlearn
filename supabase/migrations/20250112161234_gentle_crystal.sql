/*
  # Add completion date to user progress

  1. Changes
    - Add completion_date column to user_progress table
    - Update existing records with current timestamp
*/

ALTER TABLE user_progress
ADD COLUMN IF NOT EXISTS completion_date timestamptz DEFAULT now();

-- Update existing completed records
UPDATE user_progress
SET completion_date = updated_at
WHERE completed = true AND completion_date IS NULL;