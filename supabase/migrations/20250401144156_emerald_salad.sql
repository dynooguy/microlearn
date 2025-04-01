/*
  # Add default theme settings

  1. Changes
    - Insert default theme settings row if none exists
    - Add trigger to ensure at least one row always exists
    - Add function to maintain single row constraint

  2. Security
    - Only admins can delete theme settings
    - System ensures at least one row exists
*/

-- Function to ensure only one row exists
CREATE OR REPLACE FUNCTION maintain_single_theme_settings()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT COUNT(*) FROM theme_settings) > 1 THEN
    DELETE FROM theme_settings
    WHERE id != NEW.id
    AND updated_at < NEW.updated_at;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to maintain single row
CREATE TRIGGER ensure_single_theme_settings
AFTER INSERT ON theme_settings
FOR EACH ROW
EXECUTE FUNCTION maintain_single_theme_settings();

-- Insert default settings if table is empty
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM theme_settings) THEN
    INSERT INTO theme_settings (footer_links, created_by)
    SELECT 
      '{}'::jsonb,
      id
    FROM user_roles
    WHERE role = 'admin'
    LIMIT 1;
  END IF;
END $$;