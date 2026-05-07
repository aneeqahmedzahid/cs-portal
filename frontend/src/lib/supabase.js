import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://latdncjdcwtmtehhmazi.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Upload image to Supabase Storage and return public URL
export async function uploadFacultyImage(file) {
  const fileExt = file.name.split('.').pop();
  const fileName = `faculty_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
  const filePath = `faculty/${fileName}`;

  const { data, error } = await supabase.storage
    .from('COMSATS CS PORTAL ASSETS')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    throw new Error('Failed to upload image: ' + error.message);
  }

  const { data: urlData } = supabase.storage
    .from('COMSATS CS PORTAL ASSETS')
    .getPublicUrl(filePath);

  return urlData.publicUrl;
}
