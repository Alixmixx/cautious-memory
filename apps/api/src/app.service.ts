import { Injectable } from '@nestjs/common';

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
}