/*
  # Create API keys table

  1. New Tables
    - `api_keys`
      - `id` (uuid, primary key)
      - `service` (text, unique)
      - `key` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `api_keys` table
    - Add policy for authenticated users to read keys
    - Add trigger for updating updated_at timestamp
*/

-- Safely create table if it doesn't exist
CREATE TABLE IF NOT EXISTS api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service text UNIQUE NOT NULL,
  key text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Safely create policy using DO block
DO $$ 
BEGIN
  -- Create policy if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'api_keys' 
    AND policyname = 'Authenticated users can read API keys'
  ) THEN
    CREATE POLICY "Authenticated users can read API keys"
      ON api_keys
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;

-- Safely create function and trigger
DO $$ 
BEGIN
  -- Create or replace the timestamp update function
  CREATE OR REPLACE FUNCTION update_updated_at_column()
  RETURNS TRIGGER AS $$
  BEGIN
    NEW.updated_at = now();
    RETURN NEW;
  END;
  $$ language 'plpgsql';

  -- Drop trigger if it exists
  DROP TRIGGER IF EXISTS update_api_keys_updated_at ON api_keys;
  
  -- Create trigger
  CREATE TRIGGER update_api_keys_updated_at
    BEFORE UPDATE ON api_keys
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
END $$;