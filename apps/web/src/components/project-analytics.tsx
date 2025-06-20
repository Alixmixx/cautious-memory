'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { createClient } from '@/lib/supabase/client'
import { useProject } from '@/contexts/project-context'
import { BarChart3, FileText, Image, Video, Music, Archive, File, TrendingUp, Calendar, Clock } from 'lucide-react'

interface FileStats {
  totalFiles: number
  totalSize: number
  fileTypes: { [key: string]: number }
  recentFiles: number
  processedFiles: number
}

const formatBytes = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const getFileTypeIcon = (type: string) => {
  switch (type) {
    case 'image': return <Image className="h-4 w-4" />
    case 'video': return <Video className="h-4 w-4" />
    case 'audio': return <Music className="h-4 w-4" />
    case 'document': return <FileText className="h-4 w-4" />
    case 'archive': return <Archive className="h-4 w-4" />
    default: return <File className="h-4 w-4" />
  }
}

const getFileTypeColor = (type: string) => {
  switch (type) {
    case 'image': return 'bg-green-100 text-green-800'
    case 'video': return 'bg-blue-100 text-blue-800'
    case 'audio': return 'bg-purple-100 text-purple-800'
    case 'document': return 'bg-red-100 text-red-800'
    case 'archive': return 'bg-yellow-100 text-yellow-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

export function ProjectAnalytics() {
  const { selectedProject } = useProject()
  const [stats, setStats] = useState<FileStats | null>(null)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const fetchAnalytics = async () => {
    if (!selectedProject) return

    setLoading(true)
    try {
      const { data: files, error } = await supabase
        .from('project_files')
        .select('*')
        .eq('project_id', selectedProject.id)

      if (error) throw error

      const now = new Date()
      const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

      const fileTypes: { [key: string]: number } = {}
      let totalSize = 0
      let recentFiles = 0
      let processedFiles = 0

      files?.forEach(file => {
        // Calculate total size
        totalSize += file.file_size

        // Count recent files (last 7 days)
        if (new Date(file.uploaded_at) > lastWeek) {
          recentFiles++
        }

        // Count processed files (files with text content)
        if (file.text_content) {
          processedFiles++
        }

        // Categorize file types
        const mimeType = file.mime_type
        let category = 'other'
        
        if (mimeType.startsWith('image/')) category = 'image'
        else if (mimeType.startsWith('video/')) category = 'video'
        else if (mimeType.startsWith('audio/')) category = 'audio'
        else if (mimeType.includes('pdf') || mimeType.includes('document')) category = 'document'
        else if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('tar')) category = 'archive'

        fileTypes[category] = (fileTypes[category] || 0) + 1
      })

      setStats({
        totalFiles: files?.length || 0,
        totalSize,
        fileTypes,
        recentFiles,
        processedFiles,
      })
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [selectedProject])

  if (!selectedProject) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Project Analytics</CardTitle>
          <CardDescription>
            Select a project to view analytics
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-4 bg-muted rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Analytics Error</CardTitle>
          <CardDescription>
            Failed to load project analytics
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const processingProgress = stats.totalFiles > 0 ? (stats.processedFiles / stats.totalFiles) * 100 : 0

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Project Analytics</h2>
        <Badge variant="outline">{selectedProject.name}</Badge>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Files</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalFiles}</div>
            <p className="text-xs text-muted-foreground">
              {formatBytes(stats.totalSize)} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Files</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recentFiles}</div>
            <p className="text-xs text-muted-foreground">
              Last 7 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processed Files</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.processedFiles}</div>
            <p className="text-xs text-muted-foreground">
              With extracted text
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing Rate</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(processingProgress)}%</div>
            <Progress value={processingProgress} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* File Types Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>File Types</CardTitle>
          <CardDescription>
            Breakdown of files by type in this project
          </CardDescription>
        </CardHeader>
        <CardContent>
          {Object.keys(stats.fileTypes).length > 0 ? (
            <div className="space-y-4">
              {Object.entries(stats.fileTypes)
                .sort((a, b) => b[1] - a[1])
                .map(([type, count]) => {
                  const percentage = stats.totalFiles > 0 ? (count / stats.totalFiles) * 100 : 0
                  return (
                    <div key={type} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getFileTypeIcon(type)}
                        <span className="capitalize font-medium">{type}</span>
                        <Badge variant="secondary" className={getFileTypeColor(type)}>
                          {count} file{count !== 1 ? 's' : ''}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground w-10 text-right">
                          {Math.round(percentage)}%
                        </span>
                      </div>
                    </div>
                  )
                })}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No files to analyze</p>
              <p className="text-sm mt-2">Upload files to see analytics</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Project Information */}
      <Card>
        <CardHeader>
          <CardTitle>Project Information</CardTitle>
          <CardDescription>
            Details about {selectedProject.name}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Project Name</span>
            <span className="text-sm font-medium">{selectedProject.name}</span>
          </div>
          {selectedProject.description && (
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Description</span>
              <span className="text-sm font-medium max-w-[200px] text-right">
                {selectedProject.description}
              </span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Created</span>
            <span className="text-sm font-medium">
              {new Date(selectedProject.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Last Updated</span>
            <span className="text-sm font-medium">
              {new Date(selectedProject.updated_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}