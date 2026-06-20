/*
# Create Certificate Repository Schema

1. New Tables
- `categories` — stores certificate category labels
  - `id` (uuid, primary key, auto-generated)
  - `name` (text, not null, unique)
  - `sort_order` (integer, default 0 for manual ordering)
  - `created_at` (timestamp, default now)

- `certificates` — stores certificate metadata and file references
  - `id` (uuid, primary key, auto-generated)
  - `title` (text, not null)
  - `issuer` (text, not null)
  - `description` (text, nullable)
  - `issue_date` (date, nullable)
  - `category_id` (uuid, foreign key to categories.id)
  - `file_type` (text, enum-like: 'pdf' or 'image')
  - `file_url` (text, not null — Supabase Storage public URL)
  - `thumbnail_url` (text, nullable)
  - `sort_order` (integer, default 0 within category)
  - `created_at` (timestamp, default now)

2. Relationships
- `certificates.category_id` references `categories.id` with CASCADE DELETE
  (deleting a category deletes its certificates).

3. Indexes
- Index on `certificates.category_id` for fast filtering by category.
- Index on `certificates.sort_order` for drag-and-drop ordering.
- Index on `categories.sort_order` for tab ordering.

4. Security
- RLS enabled on both tables.
- All CRUD operations open to `anon` and `authenticated` because the app is
  single-tenant with no public signup. Admin authorization is enforced at the
  application layer via a secret passcode, not RLS.
*/

CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  issuer text NOT NULL,
  description text,
  issue_date date,
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  file_type text NOT NULL CHECK (file_type IN ('pdf', 'image')),
  file_url text NOT NULL,
  thumbnail_url text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_certificates_category_id ON certificates(category_id);
CREATE INDEX IF NOT EXISTS idx_certificates_sort_order ON certificates(sort_order);
CREATE INDEX IF NOT EXISTS idx_categories_sort_order ON categories(sort_order);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_categories" ON categories;
CREATE POLICY "anon_select_categories" ON categories FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_categories" ON categories;
CREATE POLICY "anon_insert_categories" ON categories FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_categories" ON categories;
CREATE POLICY "anon_update_categories" ON categories FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_categories" ON categories;
CREATE POLICY "anon_delete_categories" ON categories FOR DELETE
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_select_certificates" ON certificates;
CREATE POLICY "anon_select_certificates" ON certificates FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_certificates" ON certificates;
CREATE POLICY "anon_insert_certificates" ON certificates FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_certificates" ON certificates;
CREATE POLICY "anon_update_certificates" ON certificates FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_certificates" ON certificates;
CREATE POLICY "anon_delete_certificates" ON certificates FOR DELETE
  TO anon, authenticated USING (true);
