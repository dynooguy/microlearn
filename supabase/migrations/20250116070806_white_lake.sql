/*
  # Add OpenAI API key

  1. Changes
    - Insert OpenAI API key entry into api_keys table
  
  2. Security
    - Only authenticated users can read the key
    - No direct modification of keys allowed
*/

-- Insert OpenAI API key if it doesn't exist
INSERT INTO api_keys (service, key)
VALUES ('openai', 'sk-your-openai-api-key-here')
ON CONFLICT (service) DO NOTHING;