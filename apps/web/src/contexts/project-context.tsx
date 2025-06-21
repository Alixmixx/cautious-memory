'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/contexts/auth-context'
import { Database } from '@repo/database-types'

type Project = Database['public']['Tables']['projects']['Row']
type ProjectInsert = Database['public']['Tables']['projects']['Insert']
type ProjectUpdate = Database['public']['Tables']['projects']['Update']

interface ProjectContextType {
  projects: Project[]
  selectedProject: Project | null
  loading: boolean
  error: string | null
  selectProject: (project: Project) => void
  createProject: (project: Omit<ProjectInsert, 'user_id'>) => Promise<Project>
  updateProject: (projectId: string, updates: Omit<ProjectUpdate, 'user_id' | 'id'>) => Promise<Project>
  deleteProject: (projectId: string) => Promise<void>
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

      if (error) {
        console.error('Failed to fetch projects:', error)
        console.error('User ID:', user.id)
        throw error
      }

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

    if (error) {
      console.error('Failed to create project:', error)
      console.error('Project data:', { ...projectData, user_id: user.id })
      throw error
    }

    const newProject = data as Project
    setProjects(prev => [newProject, ...prev])
    setSelectedProject(newProject)
    
    return newProject
  }

  const updateProject = async (projectId: string, updates: Omit<ProjectUpdate, 'user_id' | 'id'>): Promise<Project> => {
    if (!user) throw new Error('User not authenticated')

    setError(null)

    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', projectId)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      console.error('Failed to update project:', error)
      console.error('Update data:', { projectId, updates, user_id: user.id })
      throw error
    }

    const updatedProject = data as Project
    
    // Update projects list
    setProjects(prev => prev.map(p => p.id === projectId ? updatedProject : p))
    
    // Update selected project if it's the one being updated
    if (selectedProject?.id === projectId) {
      setSelectedProject(updatedProject)
    }
    
    return updatedProject
  }

  const deleteProject = async (projectId: string): Promise<void> => {
    if (!user) throw new Error('User not authenticated')

    setError(null)

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId)
      .eq('user_id', user.id)

    if (error) {
      console.error('Failed to delete project:', error)
      console.error('Delete data:', { projectId, user_id: user.id })
      throw error
    }

    // Remove from projects list
    setProjects(prev => prev.filter(p => p.id !== projectId))
    
    // If the deleted project was selected, select another one or null
    if (selectedProject?.id === projectId) {
      const remainingProjects = projects.filter(p => p.id !== projectId)
      setSelectedProject(remainingProjects.length > 0 ? remainingProjects[0] : null)
    }
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
        updateProject,
        deleteProject,
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