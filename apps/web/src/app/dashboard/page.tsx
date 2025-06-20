'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { useProject } from '@/contexts/project-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { ProjectSelector } from '@/components/project-selector'
import { ProjectFiles } from '@/components/project-files'
import { ProjectAnalytics } from '@/components/project-analytics'
import { ProjectSettings } from '@/components/project-settings'
import LogoutButton from '@/components/auth/logout-button'
import { User, FolderOpen, Files, BarChart3, Settings, Info } from 'lucide-react'

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const { selectedProject, projects } = useProject()
  const router = useRouter()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!user) {
    router.push('/auth/login')
    return null
  }

  return (
    <TooltipProvider>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-2 flex items-center gap-2">
              Manage your projects and files
              {selectedProject && (
                <>
                  <span>•</span>
                  <Badge variant="secondary" className="text-xs">
                    {selectedProject.name}
                  </Badge>
                </>
              )}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>{user.email}</span>
              <Badge variant={user.email_confirmed_at ? "default" : "secondary"} className="text-xs">
                {user.email_confirmed_at ? "Verified" : "Unverified"}
              </Badge>
            </div>
            <LogoutButton />
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column - Project Selection */}
          <div className="lg:col-span-1 space-y-6">
            {/* Project Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FolderOpen className="h-5 w-5" />
                  Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Projects</span>
                    <Badge variant="outline" className="text-sm font-medium">
                      {projects.length}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Active Project</span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="text-sm font-medium truncate max-w-[100px]">
                          {selectedProject ? selectedProject.name : 'None selected'}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        {selectedProject ? selectedProject.name : 'No project selected'}
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Member since</span>
                    <span className="text-sm font-medium">
                      {new Date(user.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Separator />

            {/* Project Selector */}
            <ProjectSelector />
          </div>

          {/* Right Column - Tabbed Content */}
          <div className="lg:col-span-3">
            {selectedProject ? (
              <Tabs defaultValue="files" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="files" className="flex items-center gap-2">
                    <Files className="h-4 w-4" />
                    Files
                  </TabsTrigger>
                  <TabsTrigger value="analytics" className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Analytics
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Settings
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="files" className="space-y-6 mt-6">
                  <ProjectFiles />
                </TabsContent>
                
                <TabsContent value="analytics" className="space-y-6 mt-6">
                  <ProjectAnalytics />
                </TabsContent>
                
                <TabsContent value="settings" className="space-y-6 mt-6">
                  <ProjectSettings />
                </TabsContent>
              </Tabs>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    Welcome to Your Dashboard
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <FolderOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                    <h3 className="text-lg font-medium mb-2">No Project Selected</h3>
                    <p className="text-muted-foreground mb-6">
                      Select or create a project to start managing your files and content.
                    </p>
                    <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                      <p>• Upload and organize your files</p>
                      <p>• Extract and edit text content</p>
                      <p>• Generate scenes and images</p>
                      <p>• Configure AI models and prompts</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}