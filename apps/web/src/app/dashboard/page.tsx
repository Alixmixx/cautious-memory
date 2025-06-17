'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { apiClient } from '@/lib/api-client'
import LogoutButton from '@/components/auth/logout-button'

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const [apiResponse, setApiResponse] = useState<any>(null)
  const [apiError, setApiError] = useState<string | null>(null)
  const [apiLoading, setApiLoading] = useState(false)
  const router = useRouter()

  const testProtectedEndpoint = async () => {
    setApiLoading(true)
    setApiError(null)
    setApiResponse(null)

    try {
      const response = await apiClient.post('/protected')
      setApiResponse(response)
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setApiLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Loading...</p>
      </div>
    )
  }

  if (!user) {
    router.push('/auth/login')
    return null
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>Dashboard</h1>
        <LogoutButton />
      </div>

      <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <h2>User Information</h2>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>User ID:</strong> {user.id}</p>
        <p><strong>Email Verified:</strong> {user.email_confirmed_at ? 'Yes' : 'No'}</p>
        <p><strong>Created:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h2>Test Protected API Endpoint</h2>
        <p>This will test the authentication integration between the frontend and backend.</p>
        
        <button 
          onClick={testProtectedEndpoint}
          disabled={apiLoading}
          className="px-4 py-2 mb-5 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {apiLoading ? 'Testing...' : 'Test Protected Endpoint'}
        </button>

        {apiError && (
          <div style={{
            padding: '10px',
            backgroundColor: '#ffebee',
            border: '1px solid #f44336',
            borderRadius: '4px',
            marginBottom: '20px',
            color: '#f44336'
          }}>
            <h3>Error</h3>
            <p>{apiError}</p>
          </div>
        )}

        {apiResponse && (
          <div style={{
            padding: '15px',
            backgroundColor: '#e8f5e8',
            border: '1px solid #4caf50',
            borderRadius: '4px'
          }}>
            <h3 style={{ color: '#4caf50', margin: '0 0 10px 0' }}>Success!</h3>
            <p><strong>Message:</strong> {apiResponse.message}</p>
            <p><strong>User ID:</strong> {apiResponse.user?.id}</p>
            <p><strong>User Email:</strong> {apiResponse.user?.email}</p>
            <p><strong>Timestamp:</strong> {apiResponse.timestamp}</p>
          </div>
        )}
      </div>
    </div>
  )
}