-- Migration: 0003_update_password_hashes.sql
-- Update placeholder hashes with real bcrypt hashes
-- Super Admin password: Admin@123
-- Tenant Admin password: Venue@123

UPDATE admins SET password_hash = '$2b$10$4pdDFo.txTpZrZl.2TSAg.e.svYa/rjFVuKsAHPi7YtTFj5T0CJDi' WHERE role = 'super_admin';
UPDATE admins SET password_hash = '$2b$10$WVQ0BnGlHrrPvg9ntlWpF.gmhWegAMI5i6wJyHvoZjhuJv6Dqb7nO' WHERE role = 'tenant_admin';
