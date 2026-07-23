import { Controller, Get, Delete, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { CvManagementService } from './cv-management.service';


@Controller('admin/cvs')
export class CvManagementController {
  constructor(private readonly cvService: CvManagementService) {}

  @Get()
  async getAllCvs(@Query('search') search?: string) {
    return this.cvService.findAll(search);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteCv(@Param('id') id: string) {
    return this.cvService.deleteCv(id);
  }
}