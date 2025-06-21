-- COMPLETE DATABASE SETUP FOR ENHANCED DASHBOARD
-- Run this entire script to set up the database from scratch

-- ====================================
-- 1. CREATE STORAGE BUCKET
-- ====================================

-- Create the project-files bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'project-files',
  'project-files',
  false,
  52428800, -- 50MB limit
  ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'text/plain', 'text/csv', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword']
)
ON CONFLICT (id) DO UPDATE SET
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'text/plain', 'text/csv', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];

-- ====================================
-- 2. CREATE TABLES WITH ALL COLUMNS
-- ====================================

-- Create projects table with all required columns
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    llm_model TEXT DEFAULT 'gpt-4',
    default_prompt TEXT DEFAULT 'You are a helpful AI assistant.',
    tool_schema JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create project_files table with all required columns
CREATE TABLE IF NOT EXISTS public.project_files (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type TEXT NOT NULL,
    text_content TEXT,
    processed_at TIMESTAMP WITH TIME ZONE,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ====================================
-- 3. ADD MISSING COLUMNS TO EXISTING TABLES
-- ====================================

-- Add missing columns to projects table if they don't exist
DO $$ 
BEGIN
    -- Add llm_model column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'llm_model') THEN
        ALTER TABLE public.projects ADD COLUMN llm_model TEXT DEFAULT 'gpt-4';
    END IF;
    
    -- Add default_prompt column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'default_prompt') THEN
        ALTER TABLE public.projects ADD COLUMN default_prompt TEXT DEFAULT 'You are a helpful AI assistant.';
    END IF;
    
    -- Add tool_schema column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'tool_schema') THEN
        ALTER TABLE public.projects ADD COLUMN tool_schema JSONB DEFAULT '{}';
    END IF;
END $$;

-- Add missing columns to project_files table if they don't exist
DO $$ 
BEGIN
    -- Add text_content column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'project_files' AND column_name = 'text_content') THEN
        ALTER TABLE public.project_files ADD COLUMN text_content TEXT;
    END IF;
    
    -- Add processed_at column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'project_files' AND column_name = 'processed_at') THEN
        ALTER TABLE public.project_files ADD COLUMN processed_at TIMESTAMP WITH TIME ZONE;
    END IF;
END $$;

-- ====================================
-- 4. CREATE INDEXES FOR PERFORMANCE
-- ====================================

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS projects_user_id_idx ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS projects_updated_at_idx ON public.projects(updated_at);
CREATE INDEX IF NOT EXISTS projects_llm_model_idx ON public.projects(llm_model);
CREATE INDEX IF NOT EXISTS project_files_project_id_idx ON public.project_files(project_id);
CREATE INDEX IF NOT EXISTS project_files_uploaded_at_idx ON public.project_files(uploaded_at);
CREATE INDEX IF NOT EXISTS project_files_text_content_idx ON public.project_files USING gin(to_tsvector('english', text_content)) WHERE text_content IS NOT NULL;

-- ====================================
-- 5. ENABLE ROW LEVEL SECURITY
-- ====================================

-- Enable Row Level Security (RLS)
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_files ENABLE ROW LEVEL SECURITY;

-- ====================================
-- 6. CREATE RLS POLICIES FOR PROJECTS
-- ====================================

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can insert their own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can update their own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can delete their own projects" ON public.projects;

-- Create RLS policies for projects table
CREATE POLICY "Users can view their own projects" ON public.projects
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own projects" ON public.projects
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects" ON public.projects
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects" ON public.projects
    FOR DELETE USING (auth.uid() = user_id);

-- ====================================
-- 7. CREATE RLS POLICIES FOR PROJECT_FILES
-- ====================================

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Users can view files in their projects" ON public.project_files;
DROP POLICY IF EXISTS "Users can insert files in their projects" ON public.project_files;
DROP POLICY IF EXISTS "Users can update files in their projects" ON public.project_files;
DROP POLICY IF EXISTS "Users can delete files in their projects" ON public.project_files;

-- Create RLS policies for project_files table
CREATE POLICY "Users can view files in their projects" ON public.project_files
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.projects 
            WHERE projects.id = project_files.project_id 
            AND projects.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert files in their projects" ON public.project_files
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.projects 
            WHERE projects.id = project_files.project_id 
            AND projects.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update files in their projects" ON public.project_files
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.projects 
            WHERE projects.id = project_files.project_id 
            AND projects.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete files in their projects" ON public.project_files
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.projects 
            WHERE projects.id = project_files.project_id 
            AND projects.user_id = auth.uid()
        )
    );

-- ====================================
-- 8. CREATE STORAGE POLICIES
-- ====================================

-- Drop existing storage policies if they exist
DROP POLICY IF EXISTS "Authenticated users can upload files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can view files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete files" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload to their project folders" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their project files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their project files" ON storage.objects;

-- Create more secure storage policies that check project ownership
CREATE POLICY "Users can upload to their project folders" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'project-files' 
    AND auth.role() = 'authenticated'
    AND EXISTS (
      SELECT 1 FROM public.projects 
      WHERE projects.id::text = (string_to_array(name, '/'))[1]
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view their project files" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'project-files'
    AND auth.role() = 'authenticated'
    AND EXISTS (
      SELECT 1 FROM public.projects 
      WHERE projects.id::text = (string_to_array(name, '/'))[1]
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their project files" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'project-files'
    AND auth.role() = 'authenticated'
    AND EXISTS (
      SELECT 1 FROM public.projects 
      WHERE projects.id::text = (string_to_array(name, '/'))[1]
      AND projects.user_id = auth.uid()
    )
  );

-- ====================================
-- 9. CREATE FUNCTIONS AND TRIGGERS
-- ====================================

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS handle_projects_updated_at ON public.projects;

-- Create trigger to automatically update updated_at
CREATE TRIGGER handle_projects_updated_at
    BEFORE UPDATE ON public.projects
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ====================================
-- 10. VERIFY SETUP
-- ====================================

-- Function to verify the setup
CREATE OR REPLACE FUNCTION public.verify_database_setup()
RETURNS TABLE (
    check_name TEXT,
    status TEXT,
    details TEXT
) AS $$
BEGIN
    -- Check if storage bucket exists
    RETURN QUERY
    SELECT 
        'Storage Bucket'::TEXT,
        CASE WHEN EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'project-files') 
             THEN 'OK' ELSE 'MISSING' END,
        'project-files bucket'::TEXT;
    
    -- Check if projects table has all columns
    RETURN QUERY
    SELECT 
        'Projects Table Columns'::TEXT,
        CASE WHEN (
            SELECT COUNT(*) FROM information_schema.columns 
            WHERE table_name = 'projects' 
            AND column_name IN ('id', 'name', 'description', 'user_id', 'llm_model', 'default_prompt', 'tool_schema', 'created_at', 'updated_at')
        ) = 9 THEN 'OK' ELSE 'INCOMPLETE' END,
        'All required columns'::TEXT;
    
    -- Check if project_files table has all columns
    RETURN QUERY
    SELECT 
        'Project Files Table Columns'::TEXT,
        CASE WHEN (
            SELECT COUNT(*) FROM information_schema.columns 
            WHERE table_name = 'project_files' 
            AND column_name IN ('id', 'project_id', 'file_name', 'file_path', 'file_size', 'mime_type', 'text_content', 'processed_at', 'uploaded_at')
        ) = 9 THEN 'OK' ELSE 'INCOMPLETE' END,
        'All required columns'::TEXT;
    
    -- Check RLS policies
    RETURN QUERY
    SELECT 
        'RLS Policies'::TEXT,
        CASE WHEN (
            SELECT COUNT(*) FROM pg_policies 
            WHERE tablename IN ('projects', 'project_files')
        ) >= 8 THEN 'OK' ELSE 'INCOMPLETE' END,
        'Row Level Security policies'::TEXT;
        
END;
$$ LANGUAGE plpgsql;

-- Run verification
SELECT * FROM public.verify_database_setup();