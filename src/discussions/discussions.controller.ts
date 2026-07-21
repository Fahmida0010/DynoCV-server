import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DiscussionsService } from './discussions.service';


@Controller('discussions')
export class DiscussionsController {
  constructor(private readonly discussionsService: DiscussionsService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getDiscussionDetails(@Param('id') id: string) {
    return this.discussionsService.findOneWithDetails(id);
  }
}