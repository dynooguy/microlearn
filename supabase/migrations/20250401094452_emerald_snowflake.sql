/*
  # Add user lesson access table

  1. New Tables
    - `user_lesson_access`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `lesson_ids` (text array)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `user_lesson_access` table
    - Add policies for users to manage their own lesson access
*/

-- Create user_lesson_access table
CREATE TABLE IF NOT EXISTS user_lesson_access (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  lesson_ids text[] NOT NULL,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE user_lesson_access ENABLE ROW LEVEL SECURITY;

-- Create policies for user_lesson_access
CREATE POLICY "Users can view their own lesson access"
  ON user_lesson_access
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own lesson access"
  ON user_lesson_access
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own lesson access"
  ON user_lesson_access
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Add index for faster user lookups
CREATE INDEX idx_user_lesson_access_user_id ON user_lesson_access(user_id);