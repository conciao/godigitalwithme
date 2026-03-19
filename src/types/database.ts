// types/database.ts
// TypeScript interfaces matching the Supabase PostgreSQL schema

export interface Company {
  id: number;
  name: string;
  slug: string;         // Subdomain identifier
  plan: 'basic' | 'pro' | 'enterprise';
  status: 'active' | 'suspended' | 'trial';
  logo_url: string | null;
  tagline: string | null;
  description: string | null;
  about_us: string | null;
  hero_image_url: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  address: string | null;
  packages: any[] | null;
  facilities: any[] | null;
  inquiries?: number;
  reservations?: number;
  created_at: string;
  updated_at: string;
}

export interface Admin {
  id: number;
  company_id: number | null;  // null = super admin
  name: string;
  email: string;
  password_hash: string;
  role: 'super_admin' | 'tenant_admin';
  created_at: string;
}

export interface Inquiry {
  id: number;
  venue_id: number;           // FK to venues.id (was company_id in D1)
  client_name: string;
  client_email: string;
  client_phone: string | null;
  event_type: string | null;
  event_date: string | null;
  event_time: string | null;
  guest_count: number | null;
  facilities: string | null;
  message: string | null;
  status: 'new' | 'contacted' | 'approved' | 'rejected' | 'booked';
  created_at: string;
  updated_at: string;
}

export interface Reservation {
  id: number;
  venue_id: number;           // FK to venues.id (was company_id in D1)
  inquiry_id: number | null;
  client_name: string;
  client_email: string;
  client_phone: string | null;
  event_type: string | null;
  event_date: string;
  event_time: string | null;
  guest_count: number | null;
  amount: number | null;
  deposit_paid: number;
  balance: number | null;
  status: 'confirmed' | 'completed' | 'cancelled';
  notes: string | null;
  created_at: string;
  updated_at: string;
}

