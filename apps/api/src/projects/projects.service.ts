import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class ProjectsService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async getUserProjects(userId: string) {
    const { data, error } = await this.supabaseService.getClient()
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch projects: ${error.message}`);
    }

    return { projects: data || [] };
  }

  async createProject(userId: string, createProjectDto: { name: string; description?: string }) {
    const { data, error } = await this.supabaseService.getClient()
      .from('projects')
      .insert({
        name: createProjectDto.name,
        description: createProjectDto.description || null,
        user_id: userId,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create project: ${error.message}`);
    }

    return { project: data };
  }

  async getProjectFiles(userId: string, projectId: string) {
    // First verify the project belongs to the user
    const { data: project, error: projectError } = await this.supabaseService.getClient()
      .from('projects')
      .select('id')
      .eq('id', projectId)
      .eq('user_id', userId)
      .single();

    if (projectError || !project) {
      throw new NotFoundException('Project not found or access denied');
    }

    // Get project files
    const { data, error } = await this.supabaseService.getClient()
      .from('project_files')
      .select('*')
      .eq('project_id', projectId)
      .order('uploaded_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch project files: ${error.message}`);
    }

    return { files: data || [] };
  }

  async deleteProjectFile(userId: string, projectId: string, fileId: string) {
    // First verify the project belongs to the user
    const { data: project, error: projectError } = await this.supabaseService.getClient()
      .from('projects')
      .select('id')
      .eq('id', projectId)
      .eq('user_id', userId)
      .single();

    if (projectError || !project) {
      throw new NotFoundException('Project not found or access denied');
    }

    // Get file info before deletion
    const { data: file, error: fileError } = await this.supabaseService.getClient()
      .from('project_files')
      .select('file_path')
      .eq('id', fileId)
      .eq('project_id', projectId)
      .single();

    if (fileError || !file) {
      throw new NotFoundException('File not found');
    }

    // Delete from storage
    const { error: storageError } = await this.supabaseService.getClient()
      .storage
      .from('project-files')
      .remove([file.file_path]);

    if (storageError) {
      throw new Error(`Failed to delete file from storage: ${storageError.message}`);
    }

    // Delete from database
    const { error: dbError } = await this.supabaseService.getClient()
      .from('project_files')
      .delete()
      .eq('id', fileId)
      .eq('project_id', projectId);

    if (dbError) {
      throw new Error(`Failed to delete file record: ${dbError.message}`);
    }

    return { message: 'File deleted successfully' };
  }
}