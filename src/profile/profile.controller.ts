import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(private prisma: PrismaService) {}

  
  @Get('me')
  async getMe(@Request() req: any) {
    const userId = req.user.id;
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });
    
    
    if (!profile) {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      return {
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        location: '',
        photoUrl: user?.photo || '',
      };
    }
    return profile;
  }

  
  @Get('attributes')
  async getAttributes(@Request() req: any) {
    const userId = req.user.id;
    return this.prisma.userAttribute.findMany({
      where: { userId },
      include: {
        attribute: true, 
      },
    });
  }

  
  @Get('projects')
  async getProjects(@Request() req: any) {
    const userId = req.user.id;
    return this.prisma.project.findMany({
      where: { userId },
      orderBy: {
        startDate: 'desc',
      },
    });
  }
}