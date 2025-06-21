export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string
          name: string
          description: string | null
          user_id: string
          llm_model: string | null
          default_prompt: string | null
          tool_schema: object | null
          created_at: string
          updated_at: string
        }
        Insert: {
          name: string
          description?: string | null
          user_id: string
          llm_model?: string | null
          default_prompt?: string | null
          tool_schema?: object | null
          created_at?: string // Optional because of DEFAULT
          updated_at?: string // Optional because of DEFAULT
        }
        Update: {
          name?: string
          description?: string | null
          llm_model?: string | null
          default_prompt?: string | null
          tool_schema?: object | null
          updated_at?: string // Will be set by trigger
        }
      }
      project_files: {
        Row: {
          id: string
          project_id: string
          file_name: string
          file_path: string
          file_size: number
          mime_type: string
          text_content: string | null
          processed_at: string | null
          uploaded_at: string
        }
        Insert: {
          project_id: string
          file_name: string
          file_path: string
          file_size: number
          mime_type: string
          text_content?: string | null
          processed_at?: string | null
          uploaded_at?: string // Optional because of DEFAULT
        }
        Update: {
          file_name?: string
          file_path?: string
          file_size?: number
          mime_type?: string
          text_content?: string | null
          processed_at?: string | null
        }
      }
    }
  }
  storage: {
    buckets: {
      Row: {
        id: string
        name: string
        public: boolean
        file_size_limit: number | null
        allowed_mime_types: string[] | null
        created_at: string
        updated_at: string
      }
    }
    objects: {
      Row: {
        id: string
        bucket_id: string
        name: string
        owner: string | null
        created_at: string
        updated_at: string
        last_accessed_at: string | null
        metadata: object | null
      }
    }
  }
}