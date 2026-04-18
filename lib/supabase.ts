import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type definitions for our database tables
export interface NewsItem {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  author: string;
  created_at: string;
  updated_at: string;
}

export interface EventItem {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  event_date: string;
  location: string;
  author: string;
  created_at: string;
  updated_at: string;
}
