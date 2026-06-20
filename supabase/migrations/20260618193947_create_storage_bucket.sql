/*
# Create Storage Bucket for Certificate Files

1. New Objects
- `certificates` bucket (public) for storing PDF and image files.

2. Security
- RLS policies on storage.objects allow public read (viewing certificates).
- Write/Delete restricted to authenticated users (admin layer controls actual access).
*/

INSERT INTO storage.buckets (id, name, public)
VALUES ('certificates', 'certificates', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "public_read_certificates" ON storage.objects;
CREATE POLICY "public_read_certificates"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'certificates');

DROP POLICY IF EXISTS "authenticated_insert_certificates" ON storage.objects;
CREATE POLICY "authenticated_insert_certificates"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'certificates');

DROP POLICY IF EXISTS "authenticated_delete_certificates" ON storage.objects;
CREATE POLICY "authenticated_delete_certificates"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'certificates');
