# Project Management & File Upload Setup

## Supabase Database Setup

1. **Run the SQL script** in your Supabase SQL editor:
   - Go to your Supabase project dashboard
   - Navigate to the SQL Editor
   - Copy and paste the contents of `supabase-setup.sql`
   - Execute the script

2. **Create Storage Bucket**:
   - Go to Storage > Buckets in your Supabase dashboard
   - Create a new bucket named `project-files`
   - Make the bucket **public** (or configure custom policies)

3. **Configure Storage Policies**:
   ```sql
   -- Allow authenticated users to upload files
   CREATE POLICY "Authenticated users can upload files" ON storage.objects
     FOR INSERT WITH CHECK (
       bucket_id = 'project-files' 
       AND auth.role() = 'authenticated'
       AND (storage.foldername(name))[1] IN (
         SELECT id::text FROM public.projects WHERE user_id = auth.uid()
       )
     );

   -- Allow users to view files in their projects
   CREATE POLICY "Users can view files in their projects" ON storage.objects
     FOR SELECT USING (
       bucket_id = 'project-files'
       AND (storage.foldername(name))[1] IN (
         SELECT id::text FROM public.projects WHERE user_id = auth.uid()
       )
     );

   -- Allow users to delete files in their projects
   CREATE POLICY "Users can delete files in their projects" ON storage.objects
     FOR DELETE USING (
       bucket_id = 'project-files'
       AND (storage.foldername(name))[1] IN (
         SELECT id::text FROM public.projects WHERE user_id = auth.uid()
       )
     );
   ```

## Database Schema

### Tables Created:

1. **projects**
   - `id` (UUID) - Primary key
   - `name` (TEXT) - Project name
   - `description` (TEXT) - Optional description
   - `user_id` (UUID) - Foreign key to auth.users
   - `created_at` (TIMESTAMP) - Creation timestamp
   - `updated_at` (TIMESTAMP) - Last update timestamp

2. **project_files**
   - `id` (UUID) - Primary key
   - `project_id` (UUID) - Foreign key to projects
   - `file_name` (TEXT) - Original filename
   - `file_path` (TEXT) - Storage path
   - `file_size` (BIGINT) - File size in bytes
   - `mime_type` (TEXT) - File MIME type
   - `uploaded_at` (TIMESTAMP) - Upload timestamp

## Features

- **Project Management**: Users can create and manage projects
- **File Organization**: Files are organized by project in storage as `project-files/{project_id}/{filename}`
- **Security**: Row Level Security (RLS) ensures users can only access their own projects and files
- **Metadata Tracking**: File metadata is stored in the database for easy querying
- **UI Components**: Clean interface using shadcn/ui components

## Usage

1. Users must be authenticated to access the dashboard
2. Users can create new projects or select existing ones
3. File uploads are scoped to the selected project
4. Files are automatically organized in storage and metadata is tracked in the database