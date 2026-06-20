import { supabase } from './supabase';

const BUCKET = 'certificates';

function sanitizeFileName(original: string): string {
  const ext = original.split('.').pop()?.toLowerCase() || '';
  const name = original.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 50);
  const timestamp = Date.now();
  return `${name}-${timestamp}.${ext}`;
}

export async function uploadFile(file: File): Promise<string> {
  const sanitizedName = sanitizeFileName(file.name);
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(sanitizedName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('Supabase storage upload error:', error);
    throw new Error(error.message || 'Upload failed');
  }

  if (!data?.path) {
    throw new Error('Upload succeeded but no path returned');
  }

  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(data.path);
  return urlData.publicUrl;
}

export async function deleteFile(fileUrl: string): Promise<void> {
  const path = fileUrl.split('/').pop();
  if (!path) return;

  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) throw error;
}

export function getFileType(file: File): 'pdf' | 'image' {
  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  if (ext === 'pdf') return 'pdf';
  return 'image';
}

export function isValidFile(file: File): boolean {
  const validTypes = [
    'application/pdf',
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/webp',
  ];
  const validExts = ['pdf', 'png', 'jpg', 'jpeg', 'webp'];
  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  return validTypes.includes(file.type) || validExts.includes(ext);
}

export function isValidFileSize(file: File, maxMB = 10): boolean {
  return file.size <= maxMB * 1024 * 1024;
}
