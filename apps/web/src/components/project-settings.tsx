'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useProject } from '@/contexts/project-context'
import { EditProjectDialog } from '@/components/edit-project-dialog'
import { ConfigureProjectDialog } from '@/components/configure-project-dialog'
import { DeleteProjectDialog } from '@/components/delete-project-dialog'
import { useToast } from '@/hooks/use-toast'
import { Settings, Edit, Trash2, Wrench, Brain, FileText, Download, RotateCcw } from 'lucide-react'

export function ProjectSettings() {
  const { selectedProject } = useProject()
  const { toast } = useToast()
  const [exporting, setExporting] = useState(false)

  if (!selectedProject) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Project Settings</CardTitle>
          <CardDescription>
            Select a project to view settings
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const handleExportProject = async () => {
    setExporting(true)
    try {
      // TODO: Implement actual project export functionality
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast({
        title: 'Export completed',
        description: 'Project data has been exported successfully.',
      })
    } catch (error) {
      toast({
        title: 'Export failed',
        description: 'Failed to export project data. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setExporting(false)
    }
  }

  const handleResetProject = async () => {
    try {
      // TODO: Implement project reset functionality
      toast({
        title: 'Reset functionality',
        description: 'Project reset will be implemented soon.',
      })
    } catch (error) {
      toast({
        title: 'Reset failed',
        description: 'Failed to reset project. Please try again.',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Project Settings</h2>
        <Badge variant="outline">{selectedProject.name}</Badge>
      </div>

      {/* Project Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Project Information
          </CardTitle>
          <CardDescription>
            Basic information about your project
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Project Name</label>
              <p className="text-sm mt-1">{selectedProject.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Created</label>
              <p className="text-sm mt-1">
                {new Date(selectedProject.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
          
          {selectedProject.description && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Description</label>
              <p className="text-sm mt-1">{selectedProject.description}</p>
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
            <p className="text-sm mt-1">
              {new Date(selectedProject.updated_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>

          <div className="flex gap-2 pt-2">
            <EditProjectDialog project={selectedProject}>
              <Button variant="outline" size="sm">
                <Edit className="mr-2 h-4 w-4" />
                Edit Details
              </Button>
            </EditProjectDialog>
          </div>
        </CardContent>
      </Card>

      {/* AI Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Configuration
          </CardTitle>
          <CardDescription>
            Configure AI models, prompts, and tools for this project
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">LLM Model</label>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-sm">{selectedProject.llm_model || 'gpt-4'}</p>
                <Badge variant="secondary" className="text-xs">
                  {selectedProject.llm_model?.includes('gpt') ? 'OpenAI' : 
                   selectedProject.llm_model?.includes('claude') ? 'Anthropic' :
                   selectedProject.llm_model?.includes('gemini') ? 'Google' : 'Default'}
                </Badge>
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Default Prompt</label>
            <div className="mt-1 p-3 bg-muted rounded-lg">
              <p className="text-sm font-mono">
                {selectedProject.default_prompt || 'You are a helpful AI assistant.'}
              </p>
            </div>
          </div>

          {selectedProject.tool_schema && Object.keys(selectedProject.tool_schema as object).length > 0 && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Tool Schema</label>
              <div className="mt-1 p-3 bg-muted rounded-lg">
                <pre className="text-xs font-mono overflow-x-auto">
                  {JSON.stringify(selectedProject.tool_schema, null, 2)}
                </pre>
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <ConfigureProjectDialog project={selectedProject}>
              <Button variant="outline" size="sm">
                <Wrench className="mr-2 h-4 w-4" />
                Configure AI
              </Button>
            </ConfigureProjectDialog>
          </div>
        </CardContent>
      </Card>

      {/* Project Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Project Actions</CardTitle>
          <CardDescription>
            Export, reset, or delete your project
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">Export Project</h4>
                <p className="text-sm text-muted-foreground">
                  Download all project files and metadata as a ZIP archive
                </p>
              </div>
              <Button 
                variant="outline" 
                onClick={handleExportProject}
                disabled={exporting}
              >
                <Download className="mr-2 h-4 w-4" />
                {exporting ? 'Exporting...' : 'Export'}
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">Reset Project</h4>
                <p className="text-sm text-muted-foreground">
                  Clear all processed data while keeping original files
                </p>
              </div>
              <Button 
                variant="outline" 
                onClick={handleResetProject}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset
              </Button>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <h4 className="font-medium text-destructive">Danger Zone</h4>
            <div className="flex items-center justify-between p-3 border border-destructive/20 rounded-lg bg-destructive/5">
              <div>
                <h4 className="font-medium">Delete Project</h4>
                <p className="text-sm text-muted-foreground">
                  Permanently delete this project and all its files. This action cannot be undone.
                </p>
              </div>
              <DeleteProjectDialog project={selectedProject}>
                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </DeleteProjectDialog>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}