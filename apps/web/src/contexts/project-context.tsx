'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/contexts/auth-context'
import { Database } from '@repo/database-types'

type Project = Database['public']['Tables']['projects']['Row']
type ProjectInsert = Database['public']['Tables']['projects']['Insert']

interface ProjectContextType {
  projects: Project[]
  selectedProject: Project | null
  loading: boolean
  error: string | null
  selectProject: (project: Project) => void
  createProject: (project: Omit<ProjectInsert, 'user_id'>) => Promise<Project>
  refreshProjects: () => Promise<void>
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined)

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  const refreshProjects = async () => {
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })

      if (error) throw error

      setProjects(data || [])
      
      // If no project is selected and there are projects, select the first one
      if (!selectedProject && data && data.length > 0) {
        setSelectedProject(data[0])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load projects')
    } finally {
      setLoading(false)
    }
  }

  const selectProject = (project: Project) => {
    setSelectedProject(project)
  }

  const createProject = async (projectData: Omit<ProjectInsert, 'user_id'>): Promise<Project> => {
    if (!user) throw new Error('User not authenticated')

    setError(null)

    const { data, error } = await supabase
      .from('projects')
      .insert({
        ...projectData,
        user_id: user.id,
      })
      .select()
      .single()

    if (error) throw error

    const newProject = data as Project
    setProjects(prev => [newProject, ...prev])
    setSelectedProject(newProject)
    
    return newProject
  }

  useEffect(() => {
    if (user) {
      refreshProjects()
    } else {
      setProjects([])
      setSelectedProject(null)
    }
  }, [user])

  return (
    <ProjectContext.Provider
      value={{
        projects,
        selectedProject,
        loading,
        error,
        selectProject,
        createProject,
        refreshProjects,
      }}
    >
      {children}
    </ProjectContext.Provider>
  )
}

export function useProject() {
  const context = useContext(ProjectContext)
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider')
  }
  return context
}