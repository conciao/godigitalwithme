-- ============================================================
-- SECURITY FIX: Hash passwords for all admins in Supabase
-- Run this in your Supabase SQL Editor ONCE.
-- After running this, passwords will be stored as bcrypt hashes.
-- The app's auth.ts already supports both hashed and plain-text.
-- ============================================================

-- First, enable the pgcrypto extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Update admin passwords to use bcrypt hashes (cost factor 10)
UPDATE admins
SET password_hash = crypt('Admin@123', gen_salt('bf'))
WHERE email = 'admin@godigitalwithme.com';

UPDATE admins
SET password_hash = crypt('Venue@123', gen_salt('bf'))
WHERE email = 'admin@grand-venue.com';

-- Verify the hashes were set (they should start with $2b$)
SELECT email, LEFT(password_hash, 7) as hash_prefix FROM admins;
