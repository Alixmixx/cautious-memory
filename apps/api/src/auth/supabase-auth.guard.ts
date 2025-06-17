import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Logger } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  private readonly logger = new Logger(SupabaseAuthGuard.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      this.logger.warn('No authorization header provided');
      throw new UnauthorizedException('No authorization header provided');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      this.logger.warn('No bearer token provided');
      throw new UnauthorizedException('No bearer token provided');
    }

    try {
      const user = await this.supabaseService.getUser(token);
      
      if (!user) {
        this.logger.warn('Invalid token - no user found');
        throw new UnauthorizedException('Invalid token');
      }

      // Attach user to the request object for use in controllers
      request.user = user;
      
      this.logger.log(`User authenticated: ${user.email}`);
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error('Authentication failed:', errorMessage);
      throw new UnauthorizedException('Authentication failed');
    }
  }
}