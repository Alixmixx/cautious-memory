'use client'

import { useState } from 'react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useProject } from '@/contexts/project-context'
import { useToast } from '@/hooks/use-toast'
import { Settings, Brain, MessageSquare, Wrench } from 'lucide-react'

const configureProjectSchema = z.object({
  llm_model: z.string().min(1, 'LLM model is required'),
  default_prompt: z.string().min(1, 'Default prompt is required'),
  tool_schema: z.string().optional(),
})

type ConfigureProjectFormData = z.infer<typeof configureProjectSchema>

interface ConfigureProjectDialogProps {
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

const LLM_MODELS = [
  { value: 'gpt-4', label: 'GPT-4', provider: 'OpenAI' },
  { value: 'gpt-4-turbo', label: 'GPT-4 Turbo', provider: 'OpenAI' },
  { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo', provider: 'OpenAI' },
  { value: 'claude-3-opus', label: 'Claude 3 Opus', provider: 'Anthropic' },
  { value: 'claude-3-sonnet', label: 'Claude 3 Sonnet', provider: 'Anthropic' },
  { value: 'claude-3-haiku', label: 'Claude 3 Haiku', provider: 'Anthropic' },
  { value: 'gemini-pro', label: 'Gemini Pro', provider: 'Google' },
  { value: 'llama-2-70b', label: 'Llama 2 70B', provider: 'Meta' },
]

export function ConfigureProjectDialog({ project, children }: ConfigureProjectDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { updateProject } = useProject()
  const { toast } = useToast()

  const form = useForm<ConfigureProjectFormData>({
    resolver: zodResolver(configureProjectSchema),
    defaultValues: {
      llm_model: project.llm_model || 'gpt-4',
      default_prompt: project.default_prompt || 'You are a helpful AI assistant.',
      tool_schema: JSON.stringify(project.tool_schema || {}, null, 2),
    },
  })

  const onSubmit = async (data: ConfigureProjectFormData) => {
    try {
      setLoading(true)
      
      let toolSchema = {}
      if (data.tool_schema) {
        try {
          toolSchema = JSON.parse(data.tool_schema)
        } catch (error) {
          toast({
            title: 'Invalid JSON',
            description: 'Tool schema must be valid JSON.',
            variant: 'destructive',
          })
          return
        }
      }

      await updateProject(project.id, {
        llm_model: data.llm_model,
        default_prompt: data.default_prompt,
        tool_schema: toolSchema,
      })
      
      toast({
        title: 'Configuration updated',
        description: 'Your project configuration has been updated successfully.',
      })
      
      setOpen(false)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update project configuration. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const selectedModel = LLM_MODELS.find(model => model.value === form.watch('llm_model'))

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configure Project
          </DialogTitle>
          <DialogDescription>
            Configure the AI model, prompts, and tools for "{project.name}".
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs defaultValue="model" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="model" className="flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  Model
                </TabsTrigger>
                <TabsTrigger value="prompt" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Prompt
                </TabsTrigger>
                <TabsTrigger value="tools" className="flex items-center gap-2">
                  <Wrench className="h-4 w-4" />
                  Tools
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="model" className="space-y-4">
                <FormField
                  control={form.control}
                  name="llm_model"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>LLM Model</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an LLM model" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {LLM_MODELS.map((model) => (
                            <SelectItem key={model.value} value={model.value}>
                              <div className="flex items-center justify-between w-full">
                                <span>{model.label}</span>
                                <Badge variant="secondary" className="ml-2">
                                  {model.provider}
                                </Badge>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Choose the AI model for processing files and generating content.
                        {selectedModel && (
                          <div className="mt-2 p-2 bg-muted rounded text-sm">
                            Selected: <strong>{selectedModel.label}</strong> by {selectedModel.provider}
                          </div>
                        )}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
              
              <TabsContent value="prompt" className="space-y-4">
                <FormField
                  control={form.control}
                  name="default_prompt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Default System Prompt</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter the default system prompt for this project"
                          className="resize-none min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        This prompt will be used as the default system message for AI interactions in this project.
                        You can include specific instructions, context, or guidelines.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="p-3 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Prompt Tips:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Be specific about the task and expected output format</li>
                    <li>• Include any domain-specific knowledge or context</li>
                    <li>• Set the tone and style for responses</li>
                    <li>• Mention any constraints or limitations</li>
                  </ul>
                </div>
              </TabsContent>
              
              <TabsContent value="tools" className="space-y-4">
                <FormField
                  control={form.control}
                  name="tool_schema"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tool Schema (JSON)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter tool schema as JSON"
                          className="resize-none min-h-[200px] font-mono text-sm"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Define the tools and functions available to the AI model.
                        Must be valid JSON format.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="p-3 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Tool Schema Example:</h4>
                  <pre className="text-sm text-muted-foreground overflow-x-auto">
{`{
  "functions": [
    {
      "name": "extract_text",
      "description": "Extract text from documents",
      "parameters": {
        "type": "object",
        "properties": {
          "format": {
            "type": "string",
            "enum": ["plain", "markdown"]
          }
        }
      }
    }
  ]
}`}
                  </pre>
                </div>
              </TabsContent>
            </Tabs>
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save Configuration'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}