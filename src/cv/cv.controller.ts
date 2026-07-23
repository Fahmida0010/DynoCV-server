import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Delete, 
  Put, 
  UseGuards, 
  Request,
  Query 
} from '@nestjs/common';
import { CvService } from './cv.service';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';


@Controller('dashboard/my-cvs')
export class CvController {
  constructor(private readonly cvService: CvService) {}

@Get('latest')
  async getLatestCvs(@Query('limit') limit?: string) {
    const cvLimit = limit ? parseInt(limit, 10) : 3;
    return this.cvService.getLatestCvs(cvLimit);
  }

  
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req: any, @Body() createCvDto: CreateCvDto) {
    const userId = req.user.id; 
    return this.cvService.create(userId, createCvDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Request() req: any) {
    const userId = req.user.id;
    return this.cvService.findAllByUser(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    const userId = req.user.id;
    return this.cvService.findOne(id, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Param('id') id: string, 
    @Request() req: any, 
    @Body() updateCvDto: UpdateCvDto
  ) {
    const userId = req.user.id;
    return this.cvService.update(id, userId, updateCvDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    const userId = req.user.id;
    return this.cvService.remove(id, userId);
  }
}