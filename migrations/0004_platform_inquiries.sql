-- Migration: 0004_platform_inquiries.sql
-- Lead capture for GoDigitalWithMe marketing site

CREATE TABLE IF NOT EXISTS platform_inquiries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  company_name TEXT NOT NULL,
  owner_name TEXT NOT NULL,
  contact_number TEXT NOT NULL,
  email TEXT NOT NULL,
  location TEXT NOT NULL,
  plan TEXT NOT NULL, -- 'basic', 'standard', 'premium'
  status TEXT NOT NULL DEFAULT 'new', -- 'new', 'contacted', 'onboarded', 'archived'
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_platform_inquiries_email ON platform_inquiries(email);
CREATE INDEX IF NOT EXISTS idx_platform_inquiries_status ON platform_inquiries(status);
