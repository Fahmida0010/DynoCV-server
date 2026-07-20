import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';


@Injectable()
export class CvService {
  constructor(private prisma: PrismaService) {}

  async findAll(search?: string, positionId?: string) {
    // ফিল্টারিং অবজেক্ট তৈরি
    const where: any = {};

    if (positionId && positionId !== 'All Positions') {
      where.positionId = positionId;
    }

    if (search) {
      where.OR = [
        { user: { firstName: { contains: search, mode: 'insensitive' } } },
        { user: { lastName: { contains: search, mode: 'insensitive' } } },
        { position: { title: { contains: search, mode: 'insensitive' } } },
        // JSON ফিল্ডের ভেতর সার্চ করার জন্য (PostgreSQL specific)
        { content: { path: ['skills'], string_contains: search } } 
      ];
    }

    const cvs = await this.prisma.cV.findMany({
      where,
      include: {
        user: {
          select: { firstName: true, lastName: true },
        },
        position: {
          select: { id: true, title: true },
        },
      },
    });

    // প্রতিটা CV-এর জন্য লাইক কাউন্ট বের করা এবং রেসপন্স ফরম্যাট করা
    return Promise.all(
      cvs.map(async (cv) => {
        const likesCount = await this.prisma.like.count({
          where: { cvId: cv.id },
        });

        // এখানে আপনার নিজস্ব Match Score ক্যালকুলেশন লজিক বসাতে পারেন।
        // আপাতত ডামি হিসেবে ৮৫% দেওয়া হলো।
        const matchScore = '85%'; 

        return {
          id: cv.id,
          candidateName: `${cv.user.firstName} ${cv.user.lastName}`,
          positionApplied: cv.position.title,
          positionId: cv.position.id,
          matchScore: matchScore,
          likes: likesCount,
        };
      }),
    );
  }

  async getPositions() {
    return this.prisma.position.findMany({
      where: { isActive: true },
      select: { id: true, title: true },
    });
  }
}