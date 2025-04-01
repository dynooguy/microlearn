/*
  # Add theme settings table

  1. New Tables
    - `theme_settings`
      - `id` (uuid, primary key)
      - `footer_links` (jsonb, stores privacy, terms, and imprint URLs)
      - `updated_at` (timestamp)
      - `created_by` (uuid, references auth.users)

  2. Security
    - Enable RLS on `theme_settings` table
    - Add policies for admins to manage settings
    - Add policies for all users to view settings
*/

CREATE TABLE IF NOT EXISTS theme_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  footer_links jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users NOT NULL
);

-- Enable Row Level Security
ALTER TABLE theme_settings ENABLE ROW LEVEL SECURITY;

-- Policies for theme_settings
CREATE POLICY "Users can view theme settings"
  ON theme_settings
  FOR SELECT
  TO authenticated
  USING (true);

-- Only admins can manage theme settings
CREATE POLICY "Admins can insert theme settings"
  ON theme_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update theme settings"
  ON theme_settings
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );