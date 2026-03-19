-- Run this in your Supabase SQL Editor to enable Real-time for inquiries!

-- 1. Enable Real-time for 'inquiries' table (Venue Dashboard)
ALTER TABLE inquiries REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE inquiries;

-- 2. Enable Real-time for 'platform_inquiries' table (Master Dashboard)
ALTER TABLE platform_inquiries REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE platform_inquiries;

-- 3. (Optional) Enable for 'reservations' if you want live booking updates
ALTER TABLE reservations REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE reservations;
