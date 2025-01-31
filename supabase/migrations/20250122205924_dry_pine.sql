/*
  # Course progress tracking schema

  1. New Tables
    - `user_course_progress`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `course_id` (text, from Seatable)
      - `started_at` (timestamp)
      - `completed_at` (timestamp, nullable)
      - `last_accessed_at` (timestamp)

    - `user_lesson_progress`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `course_id` (text, from Seatable)
      - `lesson_id` (text, from Seatable)
      - `completed_at` (timestamp)
      - `last_accessed_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for users to manage their own progress
*/

-- Create user_course_progress table
CREATE TABLE IF NOT EXISTS user_course_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  course_id text NOT NULL,
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  last_accessed_at timestamptz DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- Create user_lesson_progress table
CREATE TABLE IF NOT EXISTS user_lesson_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  course_id text NOT NULL,
  lesson_id text NOT NULL,
  completed_at timestamptz DEFAULT now(),
  last_accessed_at timestamptz DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

-- Enable Row Level Security
ALTER TABLE user_course_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_lesson_progress ENABLE ROW LEVEL SECURITY;

-- Create policies for user_course_progress
CREATE POLICY "Users can view their own course progress"
  ON user_course_progress
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own course progress"
  ON user_course_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own course progress"
  ON user_course_progress
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for user_lesson_progress
CREATE POLICY "Users can view their own lesson progress"
  ON user_lesson_progress
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own lesson progress"
  ON user_lesson_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own lesson progress"
  ON user_lesson_progress
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);