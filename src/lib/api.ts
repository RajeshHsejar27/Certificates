import { supabase } from './supabase';
import type { Category, Certificate, CertificateFormData } from '@/types';

// Categories
export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });

  if (error) throw error;
  return (data || []) as Category[];
}

export async function createCategory(name: string): Promise<Category> {
  const { data, error } = await supabase
    .from('categories')
    .insert({ name })
    .select()
    .single();

  if (error) throw error;
  return data as Category;
}

export async function updateCategory(id: string, name: string): Promise<Category> {
  const { data, error } = await supabase
    .from('categories')
    .update({ name })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Category;
}

export async function deleteCategory(id: string): Promise<void> {
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) throw error;
}

// Certificates
export async function getCertificates(): Promise<Certificate[]> {
  const { data, error } = await supabase
    .from('certificates')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []) as Certificate[];
}

export async function getCertificatesByCategory(categoryId: string): Promise<Certificate[]> {
  const { data, error } = await supabase
    .from('certificates')
    .select('*')
    .eq('category_id', categoryId)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []) as Certificate[];
}

export async function createCertificate(formData: CertificateFormData): Promise<Certificate> {
  const { data, error } = await supabase
    .from('certificates')
    .insert({
      title: formData.title,
      issuer: formData.issuer,
      description: formData.description || null,
      issue_date: formData.issue_date || null,
      category_id: formData.category_id,
      file_type: formData.file_type,
      file_url: formData.file_url,
      external_url: formData.external_url || null,
    })
    .select()
    .single();

  if (error) throw error;
  return data as Certificate;
}

export async function updateCertificate(
  id: string,
  formData: Partial<CertificateFormData>
): Promise<Certificate> {
  const { data, error } = await supabase
    .from('certificates')
    .update({
      title: formData.title,
      issuer: formData.issuer,
      description: formData.description || null,
      issue_date: formData.issue_date || null,
      category_id: formData.category_id,
      file_type: formData.file_type,
      file_url: formData.file_url,
      external_url: formData.external_url || null,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Certificate;
}

export async function deleteCertificate(id: string): Promise<void> {
  const { error } = await supabase.from('certificates').delete().eq('id', id);
  if (error) throw error;
}

export async function moveCertificateToCategory(id: string, categoryId: string): Promise<void> {
  const { error } = await supabase
    .from('certificates')
    .update({ category_id: categoryId })
    .eq('id', id);

  if (error) throw error;
}
