-- Supabase PostgreSQL migration script
-- Create 'venues' table and add dynamic content fields

CREATE TABLE IF NOT EXISTS venues (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL, -- The subdomain identifier
  tagline TEXT,
  description TEXT,
  about_us TEXT,
  logo_url TEXT,
  hero_image_url TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  address TEXT,
  plan TEXT DEFAULT 'basic', -- 'basic', 'pro', 'enterprise'
  status TEXT DEFAULT 'active', -- 'active', 'suspended', 'trial'
  
  -- Dynamic content as JSONB for flexibility in Demo
  packages JSONB DEFAULT '[]'::jsonb,
  facilities JSONB DEFAULT '[]'::jsonb,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin Table (Supabase Auth usually handles this, but we'll link it)
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT auth.uid(),
  venue_id BIGINT REFERENCES venues(id) ON DELETE SET NULL,
  name TEXT,
  email TEXT UNIQUE,
  role TEXT DEFAULT 'tenant_admin'
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
  facilities TEXT, -- Comma-separated or serialized
  message TEXT,
  status TEXT DEFAULT 'new', -- 'new', 'contacted', 'approved', 'rejected', 'booked'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed Data (Golden Sun Garden & Resort)
INSERT INTO venues (name, slug, tagline, description, about_us, hero_image_url, contact_email, contact_phone, address, plan, status, packages, facilities)
VALUES (
  'Golden Sun Garden & Resort',
  'grand-venue',
  'Your Ultimate Summer Escape & Everlasting Memories',
  'Elegant wedding and event halls in the heart of the city.',
  'Welcome to Golden Sun Garden & Resort! With over 15 years of exceptional service in the hospitality and events industry, we take pride in offering premium spaces for your most cherished moments.',
  'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80',
  'hello@goldensun.com',
  '+63 917 111 2222',
  '123 Sampaguita St., Makati City',
  'pro',
  'active',
  '[
    {"name": "Wedding Package", "price": "₱150,000", "guests": "Up to 200 Guests", "includes": ["Full Venue Access", "Catering Included", "Photoshoot Area", "Bridal Suite"]},
    {"name": "Birthday Package", "price": "₱60,000", "guests": "Up to 100 Guests", "includes": ["Party Hall", "Basic Decorations", "Sound System"]},
    {"name": "Corporate Event", "price": "₱90,000", "guests": "Up to 300 Guests", "includes": ["Conference Hall", "Projector & Audio", "Lunch Buffet"]}
  ]'::jsonb,
  '[
    {"name": "Swimming Pool", "icon": "🌊", "price": "₱15,000 / Day", "description": "Dive into luxury with our crystal-clear infinity pool."},
    {"name": "Luxury Rooms", "icon": "🛏️", "price": "Starts at ₱5,000 / Night", "description": "Experience premium comfort in our luxury suites."},
    {"name": "Venue Halls", "icon": "🏛️", "price": "₱45,000 / Event", "description": "Our grand venue halls offer a magnificent canvas."},
    {"name": "Guest Dorms", "icon": "🏕️", "price": "₱8,000 / Night", "description": "Accommodate large groups comfortably."},
    {"name": "Photoshoot Place", "icon": "📸", "price": "₱5,000 / 4 Hours", "description": "Capture lifelong memories."},
    {"name": "Catering Service", "icon": "🍽️", "price": "Starts at ₱850 / Head", "description": "Savor gourmet meals crafted by top chefs."}
  ]'::jsonb
) ON CONFLICT (slug) DO NOTHING;
