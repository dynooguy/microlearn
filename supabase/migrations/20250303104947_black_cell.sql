/*
  # Add indices to user_profiles table

  1. Changes
    - Add index on user_id for faster lookups
    - Add index on full_name for potential future search functionality
  
  2. Performance
    - Improves query performance for profile lookups
    - Helps with sorting and filtering by name
*/

-- Add indices for better query performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_full_name ON user_profiles(full_name);