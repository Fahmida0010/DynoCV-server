import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // আপনার প্রিজমা সার্ভিস পাথ

@Injectable()
export class StatsService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // সব কাউন্ট একসাথে প্যারালাল কুয়েরির মাধ্যমে রান করা হচ্ছে
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

    // একটি ডেমো অ্যাক্টিভিটি জেনারেট করা
    const recentActivity = [
      { id: 1, message: `Total system records actively indexed for precision search.`, time: 'Real-time' },
      { id: 2, message: `Database contains ${totalCvs} successfully compiled snapshots.`, time: 'Just now' },
      { id: 3, message: `${activePositions} open job role profile structures managed.`, time: 'Active' },
    ];

    return {
      totalCandidates,
      activePositions,
      totalCvs,
      recentCvs,
      recentActivity,
    };
  }
}