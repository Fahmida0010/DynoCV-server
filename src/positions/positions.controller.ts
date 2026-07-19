import { Controller, Get, Delete, Post, Param } from '@nestjs/common';
import { PositionsService } from './positions.service';

@Controller('positions')
export class PositionsController {
  constructor(private readonly positionsService: PositionsService) {}

  @Get()
  getAllPositions() {
    return this.positionsService.findAll();
  }

  @Post(':id/duplicate')
  duplicatePosition(@Param('id') id: string) {
    return this.positionsService.duplicate(id);
  }

  @Delete(':id')
  deletePosition(@Param('id') id: string) {
    return this.positionsService.delete(id);
  }
}