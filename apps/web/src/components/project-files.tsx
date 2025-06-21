'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useProject } from '@/contexts/project-context'
import { Database } from '@repo/database-types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Dropzone, DropzoneContent, DropzoneEmptyState } from '@/components/dropzone'
import { useSupabaseUpload } from '@/hooks/use-supabase-upload'
import { EditFileTextDialog } from '@/components/edit-file-text-dialog'
import { useToast } from '@/hooks/use-toast'
import { Download, MoreHorizontal, Trash2, Upload, FileText, Image, Video, Music, Archive, File, Edit, Wand2, ImageIcon, Sparkles } from 'lucide-react'

type ProjectFile = Database['public']['Tables']['project_files']['Row']

const formatBytes = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getFileIcon = (mimeType: string) => {
  if (mimeType.startsWith('image/')) return <Image className="h-4 w-4" />
  if (mimeType.startsWith('video/')) return <Video className="h-4 w-4" />
  if (mimeType.startsWith('audio/')) return <Music className="h-4 w-4" />
  if (mimeType.includes('pdf') || mimeType.includes('document')) return <FileText className="h-4 w-4" />
  if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('tar')) return <Archive className="h-4 w-4" />
  return <File className="h-4 w-4" />
}

const getFileTypeColor = (mimeType: string) => {
  if (mimeType.startsWith('image/')) return 'bg-green-100 text-green-800'
  if (mimeType.startsWith('video/')) return 'bg-blue-100 text-blue-800'
  if (mimeType.startsWith('audio/')) return 'bg-purple-100 text-purple-800'
  if (mimeType.includes('pdf') || mimeType.includes('document')) return 'bg-red-100 text-red-800'
  if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('tar')) return 'bg-yellow-100 text-yellow-800'
  return 'bg-gray-100 text-gray-800'
}

export function ProjectFiles() {
  const { selectedProject } = useProject()
  const [files, setFiles] = useState<ProjectFile[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  
  const supabase = createClient()

  // Configure file upload
  const uploadProps = useSupabaseUpload({
    bucketName: 'project-files',
    path: selectedProject?.id,
    maxFiles: 10,
    maxFileSize: 10 * 1024 * 1024, // 10MB
  })

  const fetchFiles = async () => {
    if (!selectedProject) return

    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase
        .from('project_files')
        .select('*')
        .eq('project_id', selectedProject.id)
        .order('uploaded_at', { ascending: false })

      if (error) {
        console.error('Failed to fetch project files:', error)
        console.error('Project ID:', selectedProject.id)
        throw error
      }
      setFiles(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load files')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (file: ProjectFile) => {
    try {
      const { data, error } = await supabase.storage
        .from('project-files')
        .download(file.file_path)

      if (error) throw error

      // Create download link
      const url = URL.createObjectURL(data)
      const a = document.createElement('a')
      a.href = url
      a.download = file.file_name
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Download failed:', err)
    }
  }

  const handleDelete = async (file: ProjectFile) => {
    if (!confirm(`Are you sure you want to delete "${file.file_name}"?`)) return

    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('project-files')
        .remove([file.file_path])

      if (storageError) {
        console.error('Failed to delete file from storage:', storageError)
        console.error('File path:', file.file_path)
        throw storageError
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('project_files')
        .delete()
        .eq('id', file.id)

      if (dbError) {
        console.error('Failed to delete file from database:', dbError)
        console.error('File ID:', file.id)
        throw dbError
      }

      // Refresh files list
      await fetchFiles()
      
      toast({
        title: 'File deleted',
        description: `"${file.file_name}" has been deleted successfully.`,
      })
    } catch (err) {
      console.error('Delete failed:', err)
      toast({
        title: 'Error',
        description: 'Failed to delete file. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const handleGenerateScene = async (file: ProjectFile) => {
    try {
      toast({
        title: 'Generating scene',
        description: `Scene generation for "${file.file_name}" will be implemented soon.`,
      })
      // TODO: Implement scene generation API call
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to generate scene. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const handleEditScene = async (file: ProjectFile) => {
    try {
      toast({
        title: 'Edit scene',
        description: `Scene editing for "${file.file_name}" will be implemented soon.`,
      })
      // TODO: Implement scene editing dialog
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to open scene editor. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const handleGenerateImages = async (file: ProjectFile) => {
    try {
      toast({
        title: 'Generating images',
        description: `Image generation for "${file.file_name}" will be implemented soon.`,
      })
      // TODO: Implement image generation API call
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to generate images. Please try again.',
        variant: 'destructive',
      })
    }
  }

  // Refresh files when upload is successful or project changes
  useEffect(() => {
    if (uploadProps.isSuccess) {
      fetchFiles()
      uploadProps.setFiles([])
    }
  }, [uploadProps.isSuccess])

  useEffect(() => {
    fetchFiles()
  }, [selectedProject])

  if (!selectedProject) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Project Files</CardTitle>
          <CardDescription>
            Select a project to view and manage its files
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Files List Section */}
      <Card>
        <CardHeader>
          <CardTitle>Project Files</CardTitle>
          <CardDescription>
            {files.length === 0 ? 'No files uploaded yet' : `${files.length} file${files.length !== 1 ? 's' : ''} in this project`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-600">
              Error loading files: {error}
            </div>
          ) : files.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No files uploaded yet</p>
              <p className="text-sm mt-2">Upload your first file using the form below</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="w-[100px]">Type</TableHead>
                  <TableHead className="w-[100px]">Size</TableHead>
                  <TableHead className="w-[150px]">Uploaded</TableHead>
                  <TableHead className="w-[320px]">Actions</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {files.map((file) => (
                  <TableRow key={file.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {getFileIcon(file.mime_type)}
                        <span className="truncate max-w-[300px]" title={file.file_name}>
                          {file.file_name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={getFileTypeColor(file.mime_type)}>
                        {file.mime_type.split('/')[1]?.toUpperCase() || 'FILE'}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatBytes(file.file_size)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(file.uploaded_at)}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap items-center gap-1">
                        <EditFileTextDialog file={file} onUpdate={fetchFiles}>
                          <Button variant="outline" size="sm" className="h-8 text-xs">
                            <Edit className="mr-1 h-3 w-3" />
                            Edit Text
                          </Button>
                        </EditFileTextDialog>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 text-xs"
                          onClick={() => handleGenerateScene(file)}
                        >
                          <Wand2 className="mr-1 h-3 w-3" />
                          Scene
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 text-xs"
                          onClick={() => handleEditScene(file)}
                        >
                          <Sparkles className="mr-1 h-3 w-3" />
                          Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 text-xs"
                          onClick={() => handleGenerateImages(file)}
                        >
                          <ImageIcon className="mr-1 h-3 w-3" />
                          Images
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleDownload(file)}>
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDelete(file)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Separator />

      {/* File Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Files to {selectedProject.name}
          </CardTitle>
          <CardDescription>
            Upload files to organize them within your project
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Dropzone {...uploadProps}>
            <DropzoneEmptyState />
            <DropzoneContent />
          </Dropzone>
        </CardContent>
      </Card>
    </div>
  )
}