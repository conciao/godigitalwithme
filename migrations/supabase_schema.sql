-- Supabase PostgreSQL migration script
-- Create tables for the Venue Reservation System

-- Venues Table
CREATE TABLE IF NOT EXISTS venues (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  tagline TEXT,
  description TEXT,
  about_us TEXT,
  logo_url TEXT,
  hero_image_url TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  address TEXT,
  plan TEXT DEFAULT 'basic',
  status TEXT DEFAULT 'active',
  packages JSONB DEFAULT '[]'::jsonb,
  facilities JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin Table
CREATE TABLE IF NOT EXISTS admins (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  venue_id BIGINT REFERENCES venues(id) ON DELETE SET NULL,
  name TEXT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'tenant_admin',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inquiry Table
CREATE TABLE IF NOT EXISTS inquiries (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  venue_id BIGINT REFERENCES venues(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT,
  event_type TEXT,
  event_date DATE,
  event_time TIME,
  guest_count INTEGER,
  facilities TEXT,
  message TEXT,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reservations Table
CREATE TABLE IF NOT EXISTS reservations (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  venue_id BIGINT REFERENCES venues(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT,
  event_type TEXT,
  event_date DATE NOT NULL,
  event_time TIME,
  guest_count INTEGER,
  amount NUMERIC(10,2),
  deposit_paid NUMERIC(10,2) DEFAULT 0,
  status TEXT DEFAULT 'confirmed',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Platform Inquiries Table (for landing page)
CREATE TABLE IF NOT EXISTS platform_inquiries (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  company_name TEXT NOT NULL,
  owner_name TEXT NOT NULL,
  contact_number TEXT,
  email TEXT NOT NULL,
  location TEXT,
  plan TEXT,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── SEED DATA ──────────────────────────────────────────────────

-- 1. Grand Venue
INSERT INTO venues (name, slug, tagline, description, about_us, hero_image_url, contact_email, contact_phone, address, plan, status, packages, facilities)
VALUES (
  'Golden Sun Garden & Resort',
  'grand-venue',
  'Your Ultimate Summer Escape & Everlasting Memories',
  'Elegant wedding and event halls in the heart of the city.',
  'Welcome to Golden Sun Garden & Resort!',
  'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80',
  'hello@goldensun.com',
  '+63 917 111 2222',
  '123 Sampaguita St., Makati City',
  'pro',
  'active',
  '[{"name": "Wedding", "price": "₱150,000"}, {"name": "Birthday", "price": "₱60,000"}]'::jsonb,
  '[{"name": "Pool", "icon": "🌊"}, {"name": "Hall", "icon": "🏛️"}]'::jsonb
) ON CONFLICT (slug) DO NOTHING;

-- 2. Admins
INSERT INTO admins (name, email, password_hash, role, venue_id)
VALUES 
  ('Platform Admin', 'admin@godigitalwithme.com', 'Admin@123', 'super_admin', NULL),
  ('Grand Venue Admin', 'admin@grand-venue.com', 'Venue@123', 'tenant_admin', 1)
ON CONFLICT (email) DO NOTHING;
