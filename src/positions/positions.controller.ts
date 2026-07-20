import { Controller, Get, Delete, Post, Param, Put, Body } from '@nestjs/common';
import { PositionsService } from './positions.service';
import { CreatePositionDto } from './create-position.dto';




@Controller('positions')
export class PositionsController {
  constructor(private readonly positionsService: PositionsService) {}


  @Post()
  createPosition(@Body() createPositionDto: CreatePositionDto) {
    return this.positionsService.create(createPositionDto);
  }

  @Get()
  getAllPositions() {
    return this.positionsService.findAll();
  }

  @Post(':id/duplicate')
  duplicatePosition(@Param('id') id: string) {
    return this.positionsService.duplicate(id);
  }

  @Put(':id')
updatePosition(@Param('id') id: string, @Body() body: { title: string; description: string; isActive: boolean }) {
  return this.positionsService.update(id, body);
}

  @Delete(':id')
  deletePosition(@Param('id') id: string) {
    return this.positionsService.delete(id);
  }
}