import { Controller, Get, Post, Put, Body, UseGuards, Req, Param, BadRequestException, ConflictException } from '@nestjs/common';
import { CandidateService } from './candidate.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // Assume already implemented
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('dashboard/candidate')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('Candidate', 'Administrator') // Admin behaves as owner
export class CandidateController {
  constructor(private candidateService: CandidateService) {}

  // 1. My Attributes
  @Get('attributes')
  async getAttributes(@Req() req) {
    const userId = req.user.id;
    return this.candidateService.getAttributes(userId);
  }

  @Put('attributes/sync')
  async syncAttributes(@Req() req, @Body() body: { attributeId: string; value: string; version: number }) {
    const userId = req.user.id;
    return this.candidateService.updateAttributeValue(userId, body);
  }

  // 2. Projects
  @Get('projects')
  async getProjects(@Req() req) {
    return this.candidateService.getProjects(req.user.id);
  }

  @Post('projects')
  async createProject(@Req() req, @Body() dto: any) {
    return this.candidateService.createProject(req.user.id, dto);
  }

  @Put('projects/:id')
  async updateProject(@Req() req, @Param('id') id: string, @Body() body: { data: any; version: number }) {
    return this.candidateService.updateProject(id, body.data, body.version);
  }

  // 3. My CVs
  @Get('my-cvs')
  async getCvs(@Req() req) {
    return this.candidateService.getCvs(req.user.id);
  }

  @Post('my-cvs/generate')
  async generateCv(@Req() req, @Body() body: { positionId: string }) {
    return this.candidateService.generateCv(req.user.id, body.positionId);
  }

  // 4. Available Positions
  @Get('available-positions')
  async getPositions() {
    return this.candidateService.getAvailablePositions();
  }

  // 5. Discussions
  @Get('discussions')
  async getDiscussions(@Req() req) {
    return this.candidateService.getDiscussions();
  }
}