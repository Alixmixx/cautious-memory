'use client'

import { useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { useProject } from '@/contexts/project-context'
import { useToast } from '@/hooks/use-toast'
import { Trash2 } from 'lucide-react'

interface DeleteProjectDialogProps {
  project: {
    id: string
    name: string
    description?: string | null
    user_id: string
    llm_model?: string | null
    default_prompt?: string | null
    tool_schema?: object | null
    created_at: string
    updated_at: string
  }
  children: React.ReactNode
}

export function DeleteProjectDialog({ project, children }: DeleteProjectDialogProps) {
  const [loading, setLoading] = useState(false)
  const { deleteProject } = useProject()
  const { toast } = useToast()

  const handleDelete = async () => {
    try {
      setLoading(true)
      await deleteProject(project.id)
      
      toast({
        title: 'Project deleted',
        description: `Project "${project.name}" has been deleted successfully.`,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete project. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-destructive" />
            Delete Project
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the project "{project.name}"? 
            This action cannot be undone and will permanently delete all files associated with this project.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {loading ? 'Deleting...' : 'Delete Project'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}