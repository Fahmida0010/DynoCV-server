import { Controller, Get, Put, Body, HttpStatus, HttpCode, UseGuards, Req, Post } from '@nestjs/common';
import { CandidateService } from './candidate.service';
import { SyncAttributeDto } from './dto/sync-attribute.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateAttributeDto } from './dto/create-attribute.dto';

@Controller('dashboard/user-attributes')
@UseGuards(JwtAuthGuard) 
export class CandidateController {
  constructor(private readonly candidateService: CandidateService) {}

  @Get()
  async getCandidateAttributes(@Req() req: any) {
    const userId = req.user.id; 
    return this.candidateService.getAttributes(userId);
  }


  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createCandidateAttribute(@Req() req: any, @Body() dto: CreateAttributeDto) {
    return this.candidateService.createAttribute(req.user.id, dto);
  }

  @Put('sync')
  @HttpCode(HttpStatus.OK)
  async syncAttribute(@Req() req: any, @Body() dto: SyncAttributeDto) {
    const userId = req.user.id;
    return this.candidateService.syncAttribute(userId, dto);
  }
}