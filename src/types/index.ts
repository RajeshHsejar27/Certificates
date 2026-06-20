export interface Category {
  id: string;
  name: string;
  sort_order: number;
  created_at: string;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  description: string | null;
  issue_date: string | null;
  category_id: string;
  file_type: 'pdf' | 'image';
  file_url: string;
  thumbnail_url: string | null;
  external_url: string | null;
  sort_order: number;
  created_at: string;
}

export interface CertificateFormData {
  title: string;
  issuer: string;
  description?: string;
  issue_date?: string;
  category_id: string;
  file_type: 'pdf' | 'image';
  file_url: string;
  external_url?: string;
}
