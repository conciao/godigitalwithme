-- Migration: 001_initial_schema.sql
-- Multi-Tenant Venue SaaS - Initial Schema

-- 1. Companies (Tenants)
CREATE TABLE IF NOT EXISTS companies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,          -- Used for subdomain: slug.yourdomain.com
  plan TEXT NOT NULL DEFAULT 'basic', -- 'basic', 'pro', 'enterprise'
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'suspended', 'trial'
  logo_url TEXT,
  description TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  address TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 2. Admins / Users
CREATE TABLE IF NOT EXISTS admins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  company_id INTEGER,                 -- NULL = Super Admin (your master dashboard)
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'tenant_admin', -- 'super_admin', 'tenant_admin'
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

-- 3. Inquiries (from public wedding/event inquiry form)
CREATE TABLE IF NOT EXISTS inquiries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  company_id INTEGER NOT NULL,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT,
  event_type TEXT,                    -- 'wedding', 'debut', 'corporate', etc.
  event_date TEXT,                    -- ISO date string
  event_time TEXT,
  guest_count INTEGER,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'new', -- 'new', 'contacted', 'approved', 'rejected'
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

-- 4. Reservations (confirmed bookings)
CREATE TABLE IF NOT EXISTS reservations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  company_id INTEGER NOT NULL,
  inquiry_id INTEGER,                 -- Optional link to original inquiry
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT,
  event_type TEXT,
  event_date TEXT NOT NULL,
  event_time TEXT,
  guest_count INTEGER,
  amount REAL,
  deposit_paid REAL DEFAULT 0,
  balance REAL,
  status TEXT NOT NULL DEFAULT 'confirmed', -- 'confirmed', 'completed', 'cancelled'
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
  FOREIGN KEY (inquiry_id) REFERENCES inquiries(id) ON DELETE SET NULL
);

-- Indexes for fast tenant-scoped queries
CREATE INDEX IF NOT EXISTS idx_inquiries_company_id ON inquiries(company_id);
CREATE INDEX IF NOT EXISTS idx_reservations_company_id ON reservations(company_id);
CREATE INDEX IF NOT EXISTS idx_admins_company_id ON admins(company_id);
CREATE INDEX IF NOT EXISTS idx_companies_slug ON companies(slug);
