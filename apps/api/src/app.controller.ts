import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import type { User } from '@supabase/supabase-js';
import { AppService } from './app.service';
import { SupabaseAuthGuard } from './auth/supabase-auth.guard';
import { CurrentUser } from './auth/user.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('test')
  testAction(): { message: string; timestamp: string } {
    return this.appService.testAction();
  }

  @Post('protected')
  @UseGuards(SupabaseAuthGuard)
  protectedAction(@CurrentUser() user: User): { message: string; user: any; timestamp: string } {
    return this.appService.protectedAction(user);
  }
}