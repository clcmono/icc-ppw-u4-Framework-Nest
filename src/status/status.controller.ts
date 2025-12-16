import { Controller, Get } from '@nestjs/common';

@Controller('api/status')
export class StatusController {
    @Get()
  getStatus() {
    return {
      service: 'NestJS API',
      status: 'running',
      timestamp: new Date().toISOString(),
    };
  }
}
