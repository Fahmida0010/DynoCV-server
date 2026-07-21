import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // আপনার প্রোজেক্টের পাথ দিন

@Injectable()
export class DiscussionsService {
  constructor(private readonly prisma: PrismaService) {}

  async findOneWithDetails(discussionId: string) {
    const discussion = await this.prisma.discussion.findUnique({
      where: { id: discussionId },
      include: {
        // ১. পজিশন এবং তার আন্ডারে সিলেক্টেড সমস্ত লাইব্রেরি অ্যাট্রিবিউট নিয়ে আসা
        position: {
          include: {
            templates: {
              include: {
                attribute: true,
              },
            },
          },
        },
        // ২. এই থ্রেডের মেইন কমেন্ট, রিপ্লাই ও ইউজার ইনফো ফিল্টার করা
        comments: {
          where: { parentId: null }, // শুধুমাত্র রুট কমেন্টগুলো
          include: {
            user: {
              select: { id: true, firstName: true, lastName: true, role: true, photo: true },
            },
            _count: { select: { likes: true } },
            replies: {
              include: {
                user: { select: { id: true, firstName: true, lastName: true, role: true, photo: true } },
                _count: { select: { likes: true } },
              },
              orderBy: { createdAt: 'asc' },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!discussion) {
      throw new NotFoundException('Discussion thread not found');
    }

    return discussion;
  }
}