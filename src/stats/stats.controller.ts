import { Controller, Get } from '@nestjs/common';
import { StatsService } from './stats.service';

@Controller('admin/stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get()
  async getSystemStats() {
    return this.statsService.getStats();
  }
}