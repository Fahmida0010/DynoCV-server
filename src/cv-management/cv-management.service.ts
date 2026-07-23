import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // আপনার প্রিজমা সার্ভিস পাথ

@Injectable()
export class CvManagementService {
  constructor(private prisma: PrismaService) {}

  async findAll(search?: string) {
    const whereCondition = search
      ? {
          OR: [
            { user: { firstName: { contains: search, mode: 'insensitive' as const } } },
            { user: { lastName: { contains: search, mode: 'insensitive' as const } } },
            { position: { title: { contains: search, mode: 'insensitive' as const } } },
          ],
        }
      : {};

    return this.prisma.cV.findMany({
      where: whereCondition,
      select: {
        id: true,
        version: true,
        updatedAt: true,
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        position: {
          select: {
            title: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async deleteCv(id: string) {
    try {
      await this.prisma.cV.delete({
        where: { id },
      });
      return { message: 'CV deleted successfully' };
    } catch (error) {
      throw new NotFoundException('CV not found or already deleted');
    }
  }
}