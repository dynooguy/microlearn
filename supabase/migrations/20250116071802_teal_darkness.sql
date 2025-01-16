/*
  # API Keys Table Setup

  1. Changes
    - Create api_keys table if not exists
    - Add RLS policies
    - Add update trigger
    - Insert default OpenAI API key
  
  2. Security
    - Enable RLS
    - Add policy for authenticated users to read keys
*/

-- Create API keys table if it doesn't exist
CREATE TABLE IF NOT EXISTS api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service text UNIQUE NOT NULL,
  key text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Authenticated users can read API keys" ON api_keys;

-- Create new policy
CREATE POLICY "Authenticated users can read API keys"
  ON api_keys
  FOR SELECT
  TO authenticated
  USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updating updated_at
DROP TRIGGER IF EXISTS update_api_keys_updated_at ON api_keys;
CREATE TRIGGER update_api_keys_updated_at
  BEFORE UPDATE ON api_keys
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert OpenAI API key if it doesn't exist
INSERT INTO api_keys (service, key)
VALUES ('openai', 'sk-your-openai-api-key-here')
ON CONFLICT (service) DO UPDATE 
SET key = EXCLUDED.key;