import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  // 1. ক্যান্ডিডেটের বেসিক প্রোফাইল ডেটা ফেচ করা
  async getMe(userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });
    
    // প্রোফাইল রো (Row) না থাকলে ইউজার টেবিল থেকে ফলব্যাক ডেটা অবজেক্ট তৈরি করবে
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

  // 2. ক্যান্ডিডেটের সিলেক্টেড কাস্টম অ্যাট্রিবিউটস (Attribute Library সহ)
  async getAttributes(userId: string) {
    return this.prisma.userAttribute.findMany({
      where: { userId },
      include: {
        attribute: true, // এটি রিঅ্যাক্ট ফ্রন্টএন্ডে label ও type ফিল্টার করতে লাগবে
      },
    });
  }

  // 3. ক্যান্ডিডেটের প্রজেক্ট লিস্ট ফেচ করা
  async getProjects(userId: string) {
    return this.prisma.project.findMany({
      where: { userId },
      orderBy: {
        startDate: 'desc',
      },
    });
  }
}