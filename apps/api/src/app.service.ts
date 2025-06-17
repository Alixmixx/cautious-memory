import { Injectable } from '@nestjs/common';
import { User } from '@supabase/supabase-js';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  testAction(): { message: string; timestamp: string } {
    return {
      message: 'API call successful!',
      timestamp: new Date().toISOString(),
    };
  }

  protectedAction(user: User): { message: string; user: any; timestamp: string } {
    return {
      message: 'Protected API call successful!',
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.created_at,
      },
      timestamp: new Date().toISOString(),
    };
  }
}