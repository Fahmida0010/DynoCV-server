import { Controller, Get, Query } from '@nestjs/common';
import { CvService } from './cv.service';

@Controller('candidate-cvs')
export class CvController {
  constructor(private readonly cvService: CvService) {}

  @Get()
  async getCvs(
    @Query('search') search?: string,
    @Query('positionId') positionId?: string,
  ) {
    return this.cvService.findAll(search, positionId);
  }

  @Get('positions')
  async getPositions() {
    return this.cvService.getPositions();
  }
}