'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { useProject } from '@/contexts/project-context'
import { Dropzone, DropzoneContent, DropzoneEmptyState } from '@/components/dropzone'
import { ProjectSelector } from '@/components/project-selector'
import { useSupabaseUpload } from '@/hooks/use-supabase-upload'

export default function MainApp() {
  const { user, loading } = useAuth()
  const { selectedProject } = useProject()
  const router = useRouter()

  const uploadProps = useSupabaseUpload({
    bucketName: 'project-files',
    path: selectedProject?.id,
    maxFiles: 5,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedMimeTypes: ['image/*', 'application/pdf', 'text/*']
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        
        <div className="bg-card rounded-lg shadow-sm p-6">
          <ProjectSelector />
        </div>

        {selectedProject && (
          <div className="bg-card rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Upload Files to {selectedProject.name}</h2>
            <Dropzone {...uploadProps}>
              <DropzoneEmptyState />
              <DropzoneContent />
            </Dropzone>
          </div>
        )}
      </div>
    </div>
  )
}