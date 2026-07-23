import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; 

@Injectable()
export class StatsService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const [
      totalCandidates,
      activePositions,
      totalCvs,
      recentCvs,
    ] = await Promise.all([
      this.prisma.user.count({ where: { role: 'CANDIDATE' } }),
      this.prisma.position.count({ where: { isActive: true } }),
      this.prisma.cV.count(),
      this.prisma.cV.count({ where: { createdAt: { gte: oneDayAgo } } }),
    ]);

   

    return {
      totalCandidates,
      activePositions,
      totalCvs,
      recentCvs,
    };
  }
}