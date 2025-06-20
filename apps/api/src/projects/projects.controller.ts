import { Controller, Get, Post, Delete, Body, Param, UseGuards, Query } from '@nestjs/common';
import type { User } from '@supabase/supabase-js';
import { ProjectsService } from './projects.service';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import { CurrentUser } from '../auth/user.decorator';

@Controller('projects')
@UseGuards(SupabaseAuthGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  async getUserProjects(@CurrentUser() user: User) {
    return this.projectsService.getUserProjects(user.id);
  }

  @Post()
  async createProject(
    @CurrentUser() user: User,
    @Body() createProjectDto: { name: string; description?: string }
  ) {
    return this.projectsService.createProject(user.id, createProjectDto);
  }

  @Get(':projectId/files')
  async getProjectFiles(
    @CurrentUser() user: User,
    @Param('projectId') projectId: string
  ) {
    return this.projectsService.getProjectFiles(user.id, projectId);
  }

  @Delete(':projectId/files/:fileId')
  async deleteProjectFile(
    @CurrentUser() user: User,
    @Param('projectId') projectId: string,
    @Param('fileId') fileId: string
  ) {
    return this.projectsService.deleteProjectFile(user.id, projectId, fileId);
  }
}