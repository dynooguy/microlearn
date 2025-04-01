/*
  # Add learning paths table

  1. New Tables
    - `learning_paths`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text)
      - `lesson_ids` (text[])
      - `created_at` (timestamp)
      - `access_code` (text, nullable)

  2. Security
    - Enable RLS on `learning_paths` table
    - Add policies for users to manage their own learning paths
*/

CREATE TABLE IF NOT EXISTS learning_paths (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  lesson_ids text[] NOT NULL,
  created_at timestamptz DEFAULT now(),
  access_code text,
  FOREIGN KEY (access_code) REFERENCES access_codes(code)
);

-- Enable Row Level Security
ALTER TABLE learning_paths ENABLE ROW LEVEL SECURITY;

-- Create policies for learning_paths
CREATE POLICY "Users can view their own learning paths"
  ON learning_paths
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own learning paths"
  ON learning_paths
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own learning paths"
  ON learning_paths
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own learning paths"
  ON learning_paths
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Add indices for better performance
CREATE INDEX idx_learning_paths_user_id ON learning_paths(user_id);
CREATE INDEX idx_learning_paths_access_code ON learning_paths(access_code);