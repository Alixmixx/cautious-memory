-- Add configuration fields to projects table
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS llm_model TEXT DEFAULT 'gpt-4',
ADD COLUMN IF NOT EXISTS default_prompt TEXT DEFAULT 'You are a helpful AI assistant.',
ADD COLUMN IF NOT EXISTS tool_schema JSONB DEFAULT '{}';

-- Add text_content field to project_files table for extracted/editable text
ALTER TABLE public.project_files
ADD COLUMN IF NOT EXISTS text_content TEXT,
ADD COLUMN IF NOT EXISTS processed_at TIMESTAMP WITH TIME ZONE;

-- Create index for text_content searches
CREATE INDEX IF NOT EXISTS project_files_text_content_idx ON public.project_files USING gin(to_tsvector('english', text_content));

-- Create index for tool_schema queries
CREATE INDEX IF NOT EXISTS projects_llm_model_idx ON public.projects(llm_model);