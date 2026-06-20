export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name: string;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          sort_order?: number;
          created_at?: string;
        };
        Relationships: never[];
      };
      certificates: {
        Row: {
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
        };
        Insert: {
          id?: string;
          title: string;
          issuer: string;
          description?: string | null;
          issue_date?: string | null;
          category_id: string;
          file_type: 'pdf' | 'image';
          file_url: string;
          thumbnail_url?: string | null;
          external_url?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          issuer?: string;
          description?: string | null;
          issue_date?: string | null;
          category_id?: string;
          file_type?: 'pdf' | 'image';
          file_url?: string;
          thumbnail_url?: string | null;
          external_url?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'certificates_category_id_fkey';
            columns: ['category_id'];
            isOneToOne: false;
            referencedRelation: 'categories';
            referencedColumns: ['id'];
          }
        ];
      };
    };
    Views: never;
    Functions: never;
    Enums: never;
    CompositeTypes: never;
  };
};
