/*
  # Add access codes table for course access management

  1. New Tables
    - `access_codes`
      - `id` (uuid, primary key)
      - `code` (text, unique)
      - `name` (text)
      - `lesson_ids` (text array)
      - `created_at` (timestamp)
      - `created_by` (uuid, references auth.users)

  2. Security
    - Enable RLS on `access_codes` table
    - Add policies for admins to manage codes
    - Add policies for users to view codes
*/

-- Create access_codes table
CREATE TABLE IF NOT EXISTS access_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  name text NOT NULL,
  lesson_ids text[] NOT NULL,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users NOT NULL
);

-- Enable Row Level Security
ALTER TABLE access_codes ENABLE ROW LEVEL SECURITY;

-- Policies for access_codes
CREATE POLICY "Users can view access codes"
  ON access_codes
  FOR SELECT
  TO authenticated
  USING (true);

-- Only admins can manage access codes
CREATE POLICY "Admins can insert access codes"
  ON access_codes
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update access codes"
  ON access_codes
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- Create index for faster code lookups
CREATE INDEX idx_access_codes_code ON access_codes(code);