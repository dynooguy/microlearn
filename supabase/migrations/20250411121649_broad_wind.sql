/*
  # Allow system-level access to access codes table

  1. Changes
    - Add system-level access to access codes table
    - Create a special system user UUID constant
    - Modify access code policies to allow system access
    
  2. Security
    - System access is granted via a specific UUID
    - Maintains existing admin access
    - Preserves RLS security model
*/

-- Create a constant for the system user UUID
CREATE OR REPLACE FUNCTION system_user()
RETURNS uuid
LANGUAGE sql IMMUTABLE
AS $$
  SELECT '00000000-0000-0000-0000-000000000000'::uuid;
$$;

-- Update the insert policy for access_codes to allow system access
DROP POLICY IF EXISTS "Allow admins and system to insert access codes" ON access_codes;
CREATE POLICY "Allow admins and system to insert access codes"
  ON access_codes
  FOR INSERT
  TO authenticated
  WITH CHECK (
    created_by = system_user() OR
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- Allow system to update access codes
DROP POLICY IF EXISTS "Admins and system can update access codes" ON access_codes;
CREATE POLICY "Admins and system can update access codes"
  ON access_codes
  FOR UPDATE
  TO authenticated
  USING (
    created_by = system_user() OR
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- Add comment explaining the system user
COMMENT ON FUNCTION system_user() IS 'Returns the UUID used for system-level operations';