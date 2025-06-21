/**
 * Validation utilities for database operations
 */

export interface ProjectInsert {
  name: string
  description?: string | null
  user_id: string
  llm_model?: string | null
  default_prompt?: string | null
  tool_schema?: object | null
}

export interface ProjectFileInsert {
  project_id: string
  file_name: string
  file_path: string
  file_size: number
  mime_type: string
  text_content?: string | null
  processed_at?: string | null
  uploaded_at?: string
}

/**
 * Validates project data before database insertion
 */
export function validateProjectInsert(data: Partial<ProjectInsert>): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
    errors.push('Project name is required and must be a non-empty string')
  }

  if (data.name && data.name.length > 255) {
    errors.push('Project name must be less than 255 characters')
  }

  if (!data.user_id || typeof data.user_id !== 'string') {
    errors.push('User ID is required and must be a valid string')
  }

  if (data.description && typeof data.description !== 'string') {
    errors.push('Description must be a string if provided')
  }

  if (data.llm_model && typeof data.llm_model !== 'string') {
    errors.push('LLM model must be a string if provided')
  }

  if (data.default_prompt && typeof data.default_prompt !== 'string') {
    errors.push('Default prompt must be a string if provided')
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Validates project file data before database insertion
 */
export function validateProjectFileInsert(data: Partial<ProjectFileInsert>): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!data.project_id || typeof data.project_id !== 'string') {
    errors.push('Project ID is required and must be a valid string')
  }

  if (!data.file_name || typeof data.file_name !== 'string' || data.file_name.trim().length === 0) {
    errors.push('File name is required and must be a non-empty string')
  }

  if (!data.file_path || typeof data.file_path !== 'string' || data.file_path.trim().length === 0) {
    errors.push('File path is required and must be a non-empty string')
  }

  if (typeof data.file_size !== 'number' || data.file_size < 0) {
    errors.push('File size must be a non-negative number')
  }

  if (!data.mime_type || typeof data.mime_type !== 'string' || data.mime_type.trim().length === 0) {
    errors.push('MIME type is required and must be a non-empty string')
  }

  if (data.text_content !== undefined && data.text_content !== null && typeof data.text_content !== 'string') {
    errors.push('Text content must be a string or null if provided')
  }

  if (data.processed_at !== undefined && data.processed_at !== null && typeof data.processed_at !== 'string') {
    errors.push('Processed at must be an ISO string or null if provided')
  }

  if (data.uploaded_at !== undefined && data.uploaded_at !== null && typeof data.uploaded_at !== 'string') {
    errors.push('Uploaded at must be an ISO string or null if provided')
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Validates that a string is a valid UUID
 */
export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(uuid)
}

/**
 * Validates that a string is a valid ISO date string
 */
export function isValidISODate(dateString: string): boolean {
  const date = new Date(dateString)
  return date instanceof Date && !isNaN(date.getTime()) && date.toISOString() === dateString
}

/**
 * Sanitizes and validates text content for database storage
 */
export function sanitizeTextContent(content: string): string {
  // Remove null bytes and other problematic characters
  return content
    .replace(/\x00/g, '') // Remove null bytes
    .replace(/\uFEFF/g, '') // Remove BOM
    .trim()
}

/**
 * Common file size limits (in bytes)
 */
export const FILE_SIZE_LIMITS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_TEXT_CONTENT_LENGTH: 1024 * 1024, // 1MB of text
} as const

/**
 * Validates file size against limits
 */
export function validateFileSize(size: number, limit: number = FILE_SIZE_LIMITS.MAX_FILE_SIZE): { valid: boolean; error?: string } {
  if (size > limit) {
    return {
      valid: false,
      error: `File size (${Math.round(size / 1024 / 1024 * 100) / 100}MB) exceeds limit (${Math.round(limit / 1024 / 1024 * 100) / 100}MB)`
    }
  }
  return { valid: true }
}