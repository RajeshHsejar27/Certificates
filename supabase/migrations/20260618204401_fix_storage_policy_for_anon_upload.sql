/*
  Fix storage policies to allow anon uploads for the admin-less storage layer.
  The admin gate is enforced at the UI layer.
*/

DROP POLICY IF EXISTS "authenticated_insert_certificates" ON storage.objects;
CREATE POLICY "anon_insert_certificates"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'certificates');

DROP POLICY IF EXISTS "authenticated_delete_certificates" ON storage.objects;
CREATE POLICY "anon_delete_certificates"
ON storage.objects FOR DELETE
TO anon, authenticated
USING (bucket_id = 'certificates');
