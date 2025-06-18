-- Storage policies for project-files bucket

-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload files" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'project-files' 
    AND auth.role() = 'authenticated'
  );

-- Allow authenticated users to view files
CREATE POLICY "Authenticated users can view files" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'project-files'
    AND auth.role() = 'authenticated'
  );

-- Allow authenticated users to delete files
CREATE POLICY "Authenticated users can delete files" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'project-files'
    AND auth.role() = 'authenticated'
  );