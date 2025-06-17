// This file will be auto-generated when you run: pnpm run generate-types
// For now, we'll include basic types structure that can be extended

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      // Add your table types here when generated
      [key: string]: {
        Row: { [key: string]: any }
        Insert: { [key: string]: any }
        Update: { [key: string]: any }
        Relationships: any[]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}