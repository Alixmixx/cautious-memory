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
        }
        Update: {
          name?: string
          description?: string | null
          llm_model?: string | null
          default_prompt?: string | null
          tool_schema?: object | null
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
        }
        Update: {
          text_content?: string | null
          processed_at?: string | null
        }
      }
    }
  }
}