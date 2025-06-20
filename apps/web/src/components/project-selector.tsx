'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useProject } from '@/contexts/project-context'
import { CreateProjectDialog } from '@/components/create-project-dialog'
import { EditProjectDialog } from '@/components/edit-project-dialog'
import { DeleteProjectDialog } from '@/components/delete-project-dialog'
import { ConfigureProjectDialog } from '@/components/configure-project-dialog'
import { Button } from '@/components/ui/button'
import { Plus, FolderOpen, MoreVertical, Edit, Trash2, Settings } from 'lucide-react'

export function ProjectSelector() {
  const { projects, selectedProject, selectProject, loading } = useProject()

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <span className="text-sm text-muted-foreground">Loading projects...</span>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Select Project</h3>
        <CreateProjectDialog>
          <Button variant="outline" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </CreateProjectDialog>
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center border-2 border-dashed border-muted-foreground/25 rounded-lg">
          <FolderOpen className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <h4 className="text-lg font-medium text-muted-foreground mb-2">No projects yet</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Create your first project to start organizing your files
          </p>
          <CreateProjectDialog>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create First Project
            </Button>
          </CreateProjectDialog>
        </div>
      ) : (
        <Select
          value={selectedProject?.id || ''}
          onValueChange={(value) => {
            const project = projects.find(p => p.id === value)
            if (project) selectProject(project)
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a project" />
          </SelectTrigger>
          <SelectContent>
            {projects.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                <div className="flex flex-col items-start">
                  <span className="font-medium">{project.name}</span>
                  {project.description && (
                    <span className="text-xs text-muted-foreground">
                      {project.description}
                    </span>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {selectedProject && (
        <div className="p-3 bg-muted rounded-lg">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="font-medium">{selectedProject.name}</h4>
              {selectedProject.description && (
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedProject.description}
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-2">
                Created {new Date(selectedProject.created_at).toLocaleDateString()}
              </p>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Project Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <EditProjectDialog project={selectedProject}>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Name
                  </DropdownMenuItem>
                </EditProjectDialog>
                <ConfigureProjectDialog project={selectedProject}>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Settings className="mr-2 h-4 w-4" />
                    Configure
                  </DropdownMenuItem>
                </ConfigureProjectDialog>
                <DropdownMenuSeparator />
                <DeleteProjectDialog project={selectedProject}>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DeleteProjectDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )}
    </div>
  )
}