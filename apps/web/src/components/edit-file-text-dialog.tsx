'use client'

import { useState, useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { Edit, FileText, Loader2 } from 'lucide-react'
import { sanitizeTextContent, FILE_SIZE_LIMITS } from '@/lib/validation'

const editFileTextSchema = z.object({
  text_content: z.string()
    .min(1, 'Text content cannot be empty')
    .max(FILE_SIZE_LIMITS.MAX_TEXT_CONTENT_LENGTH, `Text content cannot exceed ${Math.round(FILE_SIZE_LIMITS.MAX_TEXT_CONTENT_LENGTH / 1024)}KB`)
    .transform((val) => sanitizeTextContent(val)),
})

type EditFileTextFormData = z.infer<typeof editFileTextSchema>

interface EditFileTextDialogProps {
  file: {
    id: string
    file_name: string
    text_content?: string | null
  }
  onUpdate?: () => void
  children: React.ReactNode
}

export function EditFileTextDialog({ file, onUpdate, children }: EditFileTextDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [extracting, setExtracting] = useState(false)
  const { toast } = useToast()
  const supabase = createClient()

  const form = useForm<EditFileTextFormData>({
    resolver: zodResolver(editFileTextSchema),
    defaultValues: {
      text_content: file.text_content || '',
    },
  })

  const extractTextFromFile = async () => {
    setExtracting(true)
    try {
      // TODO: Implement actual text extraction logic
      // For now, we'll simulate text extraction
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const mockExtractedText = `Extracted text from ${file.file_name}:\n\nThis is a placeholder for extracted text content. In a real implementation, this would contain the actual text extracted from the file using OCR, PDF parsing, or other appropriate text extraction methods.`
      
      form.setValue('text_content', mockExtractedText)
      
      toast({
        title: 'Text extracted',
        description: 'Text has been extracted from the file successfully.',
      })
    } catch (error) {
      toast({
        title: 'Extraction failed',
        description: 'Failed to extract text from the file.',
        variant: 'destructive',
      })
    } finally {
      setExtracting(false)
    }
  }

  const onSubmit = async (data: EditFileTextFormData) => {
    try {
      setLoading(true)
      
      const { error } = await supabase
        .from('project_files')
        .update({
          text_content: data.text_content,
          processed_at: new Date().toISOString(),
        })
        .eq('id', file.id)

      if (error) {
        console.error('Failed to update file text content:', error)
        console.error('File details:', {
          file_id: file.id,
          file_name: file.file_name,
          text_content_length: data.text_content.length,
        })
        throw error
      }
      
      toast({
        title: 'Text updated',
        description: 'File text content has been updated successfully.',
      })
      
      setOpen(false)
      onUpdate?.()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update text content. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      form.reset({
        text_content: file.text_content || '',
      })
    }
  }, [open, file.text_content, form])

  const hasExistingText = file.text_content && file.text_content.trim().length > 0

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Edit Text Content
          </DialogTitle>
          <DialogDescription className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            {file.file_name}
            {hasExistingText && (
              <Badge variant="secondary" className="ml-2">
                Text Available
              </Badge>
            )}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {!hasExistingText && (
              <div className="p-4 border border-dashed border-muted-foreground/25 rounded-lg">
                <div className="text-center">
                  <FileText className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <h4 className="font-medium mb-2">No text content available</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Extract text from this file to enable editing.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={extractTextFromFile}
                    disabled={extracting}
                  >
                    {extracting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Extracting...
                      </>
                    ) : (
                      'Extract Text'
                    )}
                  </Button>
                </div>
              </div>
            )}
            
            <FormField
              control={form.control}
              name="text_content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center justify-between">
                    Text Content
                    {hasExistingText && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={extractTextFromFile}
                        disabled={extracting}
                      >
                        {extracting ? (
                          <>
                            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                            Re-extracting...
                          </>
                        ) : (
                          'Re-extract Text'
                        )}
                      </Button>
                    )}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter or edit the text content from this file..."
                      className="resize-none min-h-[300px] font-mono text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Edit the extracted text content. This text can be used for further processing and analysis.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={loading || extracting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={loading || extracting || !form.watch('text_content')?.trim()}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Text'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}