-- Seed data for local development
-- Run: npx wrangler d1 execute venue-saas-db --local --file=migrations/0002_seed.sql

-- Insert sample companies
INSERT INTO companies (name, slug, plan, status, description, contact_email, contact_phone, address) VALUES
  ('The Grand Venue',    'grand-venue',  'pro',        'active',    'Elegant wedding and event halls in the heart of the city.',    'hello@grandvenue.com',    '+63 917 111 2222', '123 Sampaguita St., Makati City'),
  ('Rose Garden Events', 'rose-garden',  'basic',      'active',    'Romantic garden settings for weddings and outdoor events.',    'book@rosegarden.com',     '+63 917 333 4444', '456 Rosal Ave., Quezon City'),
  ('Ivory Hall',         'ivory-hall',   'pro',        'active',    'Classic European-inspired venue for weddings and galas.',      'events@ivoryhall.com',    '+63 917 555 6666', '789 Azalea Blvd., Pasig City'),
  ('Skyline Events',     'skyline',      'basic',      'trial',     'Modern rooftop events with stunning city skyline views.',      'hi@skylineevents.com',    '+63 917 777 8888', '1010 Horizon Tower, BGC'),
  ('Garden of Dreams',   'garden-dreams','enterprise', 'active',    'Premium outdoor and indoor event halls for all occasions.',    'dreams@gardendreams.com', '+63 917 999 0000', '202 Dahlia St., Alabang');

-- Insert super admin (password: Admin@123 — bcrypt hash placeholder, swap when auth is wired)
INSERT INTO admins (company_id, name, email, password_hash, role) VALUES
  (NULL, 'Super Admin', 'admin@godigitalwithme.com', '$2b$10$PLACEHOLDER_SUPER_ADMIN_HASH', 'super_admin');

-- Insert tenant admins
INSERT INTO admins (company_id, name, email, password_hash, role) VALUES
  (1, 'Grand Venue Admin',    'admin@grand-venue.com',  '$2b$10$PLACEHOLDER_TENANT_HASH_1', 'tenant_admin'),
  (2, 'Rose Garden Admin',    'admin@rose-garden.com',  '$2b$10$PLACEHOLDER_TENANT_HASH_2', 'tenant_admin'),
  (3, 'Ivory Hall Admin',     'admin@ivory-hall.com',   '$2b$10$PLACEHOLDER_TENANT_HASH_3', 'tenant_admin'),
  (4, 'Skyline Events Admin', 'admin@skyline.com',      '$2b$10$PLACEHOLDER_TENANT_HASH_4', 'tenant_admin'),
  (5, 'Garden of Dreams Admin','admin@garden-dreams.com','$2b$10$PLACEHOLDER_TENANT_HASH_5', 'tenant_admin');

-- Insert sample inquiries for company 1 (The Grand Venue)
INSERT INTO inquiries (company_id, client_name, client_email, client_phone, event_type, event_date, event_time, guest_count, message, status) VALUES
  (1, 'Maria Santos',   'maria@example.com',   '+63 917 100 0001', 'Wedding',   '2025-06-14', '15:00', 200, 'Looking for full-day wedding package with reception.', 'new'),
  (1, 'Jose Reyes',     'jose@example.com',    '+63 917 100 0002', 'Debut',     '2025-07-20', '18:00', 120, 'Planning a garden debut for my daughter.', 'contacted'),
  (1, 'Ana Cruz',       'ana@example.com',     '+63 917 100 0003', 'Corporate', '2025-08-05', '09:00', 80,  'Annual general meeting + gala dinner.', 'approved'),
  (1, 'Roberto Lim',    'roberto@example.com', '+63 917 100 0004', 'Wedding',   '2025-09-12', '14:00', 250, 'Grand ballroom wedding preferred.', 'new'),
  (1, 'Carla Mendoza',  'carla@example.com',   '+63 917 100 0005', 'Wedding',   '2025-10-18', '16:00', 180, 'Intimate rustic wedding feel.', 'rejected');

-- Insert sample reservations for company 1
INSERT INTO reservations (company_id, inquiry_id, client_name, client_email, client_phone, event_type, event_date, event_time, guest_count, amount, deposit_paid, balance, status, notes) VALUES
  (1, 3, 'Ana Cruz',          'ana@example.com',     '+63 917 100 0003', 'Corporate', '2025-08-05', '09:00', 80,  32000,  16000, 16000, 'confirmed', 'Setup AV 1hr before event.'),
  (1, NULL, 'Elena Villanueva','elena@example.com',  '+63 917 200 0001', 'Wedding',   '2025-04-20', '15:00', 150, 95000,  47500, 47500, 'confirmed', 'Gold Package.'),
  (1, NULL, 'Mark dela Cruz',  'mark@example.com',   '+63 917 200 0002', 'Debut',     '2025-05-10', '18:00', 100, 45000,  22500, 22500, 'confirmed', 'Silver Package + extra lights.'),
  (1, NULL, 'Sofia Tan',       'sofia@example.com',  '+63 917 200 0003', 'Corporate', '2025-03-28', '09:00', 60,  32000,  32000, 0,     'completed', 'Annual meeting.'),
  (1, NULL, 'Leo Garcia',      'leo@example.com',    '+63 917 200 0004', 'Wedding',   '2025-02-14', '16:00', 200, 110000, 110000,0,     'completed', 'Platinum Package.');
