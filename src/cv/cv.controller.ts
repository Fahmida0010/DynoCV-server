import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Delete, 
  Put, 
  UseGuards, 
  Request 
} from '@nestjs/common';
import { CvService } from './cv.service';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';


@Controller('dashboard/my-cvs')
@UseGuards(JwtAuthGuard) 
export class CvController {
  constructor(private readonly cvService: CvService) {}

  @Post()
  create(@Request() req: any, @Body() createCvDto: CreateCvDto) {
    const userId = req.user.id; 
    return this.cvService.create(userId, createCvDto);
  }

  @Get()
  findAll(@Request() req: any) {
    const userId = req.user.id;
    return this.cvService.findAllByUser(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    const userId = req.user.id;
    return this.cvService.findOne(id, userId);
  }

  @Put(':id')
  update(
    @Param('id') id: string, 
    @Request() req: any, 
    @Body() updateCvDto: UpdateCvDto
  ) {
    const userId = req.user.id;
    return this.cvService.update(id, userId, updateCvDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    const userId = req.user.id;
    return this.cvService.remove(id, userId);
  }
}