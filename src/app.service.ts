import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return '🚀 DynoCV Backend Server is running successfully!';
    
  }
}
