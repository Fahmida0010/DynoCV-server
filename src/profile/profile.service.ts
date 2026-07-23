import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  
  async getMe(userId: string) {
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


  async getAttributes(userId: string) {
    return this.prisma.userAttribute.findMany({
      where: { userId },
      include: {
        attribute: true, 
      },
    });
  }

  
  async getProjects(userId: string) {
    return this.prisma.project.findMany({
      where: { userId },
      orderBy: {
        startDate: 'desc',
      },
    });
  }
}