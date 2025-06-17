import { createClient } from '@/utils/supabase/client'

const API_HOST = process.env.NEXT_PUBLIC_API_HOST || "http://localhost:3001";

class ApiClient {
  private async getHeaders(): Promise<HeadersInit> {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }
    
    if (session?.access_token) {
      headers.Authorization = `Bearer ${session.access_token}`
    }
    
    return headers
  }

  async get(endpoint: string) {
    const headers = await this.getHeaders()
    const response = await fetch(`${API_HOST}${endpoint}`, {
      method: 'GET',
      headers,
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return response.json()
  }

  async post(endpoint: string, data?: any) {
    const headers = await this.getHeaders()
    const response = await fetch(`${API_HOST}${endpoint}`, {
      method: 'POST',
      headers,
      body: data ? JSON.stringify(data) : undefined,
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return response.json()
  }

  async put(endpoint: string, data?: any) {
    const headers = await this.getHeaders()
    const response = await fetch(`${API_HOST}${endpoint}`, {
      method: 'PUT',
      headers,
      body: data ? JSON.stringify(data) : undefined,
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return response.json()
  }

  async delete(endpoint: string) {
    const headers = await this.getHeaders()
    const response = await fetch(`${API_HOST}${endpoint}`, {
      method: 'DELETE',
      headers,
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return response.json()
  }
}

export const apiClient = new ApiClient()