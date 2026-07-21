import { Controller, Get, Delete, Post, Param, Put, Body, Req, UseGuards } from '@nestjs/common';
import { PositionsService } from './positions.service';
import { CreatePositionDto } from './create-position.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';




@Controller('positions')
export class PositionsController {
  constructor(private readonly positionsService: PositionsService) {}


 @Post()
 @UseGuards(JwtAuthGuard)
createPosition(@Req() req: any, @Body() createPositionDto: CreatePositionDto) {
  const userId = req.user?.id;
  return this.positionsService.create(createPositionDto, userId);
}

  @Get()
  getAllPositions() {
    return this.positionsService.findAll();
  }

@Post(':id/duplicate')
 @UseGuards(JwtAuthGuard)
duplicatePosition(@Req() req: any, @Param('id') id: string) {
  const userId = req.user?.id;
  return this.positionsService.duplicate(id, userId);
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