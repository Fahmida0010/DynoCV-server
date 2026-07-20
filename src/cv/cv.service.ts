import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CvService {
  constructor(private prisma: PrismaService) {}

  async findAll(search?: string, positionId?: string) {
    const where: any = {};

    if (positionId && positionId !== 'All Positions') {
      where.positionId = positionId;
    }

    if (search) {
      where.OR = [
        { user: { firstName: { contains: search, mode: 'insensitive' } } },
        { user: { lastName: { contains: search, mode: 'insensitive' } } },
        { position: { title: { contains: search, mode: 'insensitive' } } },
        { content: { path: ['skills'], string_contains: search } } 
      ];
    }

    const cvs = await this.prisma.cV.findMany({
      where,
      include: {
        user: { select: { firstName: true, lastName: true } },
        position: { select: { id: true, title: true } },
      },
    });

    return Promise.all(
      cvs.map(async (cv) => {
        const likesCount = await this.prisma.like.count({
          where: { cvId: cv.id },
        });

        const cvContent = (cv.content as any) || {};
        const positionTitle = cv.position.title.toLowerCase();

        // =========================================================
        // সবগুলা অ্যাট্রিবিউটের জন্য পজিশন ভিত্তিক ডাইনামিক কন্ডিশন
        // =========================================================
        let criteria: { label: string; validate: (val: any) => boolean }[] = [];

        // ১. Built-in বেসিক ইনফো চেক (সব পজিশনের জন্যই এগুলো থাকা বাধ্যতামূলক)
        criteria.push(
          { label: "Full Name", validate: (val) => typeof val === 'string' && val.trim().length > 0 },
          { label: "Email Address", validate: (val) => typeof val === 'string' && val.includes('@') },
          { label: "Phone Number", validate: (val) => typeof val === 'string' && val.trim().length > 5 },
          { label: "Profile Photo", validate: (val) => typeof val === 'string' && val.startsWith('http') }
        );

        // ২. পজিশন স্পেসিফিক রিকোয়ারমেন্ট (Front-End / Full-Stack / Back-End)
        if (positionTitle.includes('react') || positionTitle.includes('front') || positionTitle.includes('full')) {
          criteria.push(
            { label: "Primary Tech Stack", validate: (val) => typeof val === 'string' && (val.toLowerCase().includes('react') || val.toLowerCase().includes('mern') || val.toLowerCase().includes('next')) },
            { label: "Years of Experience", validate: (val) => Number(val) >= 2 }, // ২+ বছর অভিজ্ঞতা
            { label: "Remote Work Availability", validate: (val) => val === true || String(val).toLowerCase() === 'true' }, // রিমোট অ্যাভেইলেবিলিটি
            { label: "Expected Salary (BDT)", validate: (val) => Number(val) <= 120000 }, // বাজেট রেঞ্জ max ১,২০,০০০
            { label: "Notice Period (Days)", validate: (val) => Number(val) <= 30 }, // ৩০ দিনের মধ্যে জয়েন করতে পারবে
            { label: "Highest Degree Obtained", validate: (val) => typeof val === 'string' && (val.toLowerCase().includes('bsc') || val.toLowerCase().includes('cse') || val.toLowerCase().includes('bachelor')) }
          );
        } else if (positionTitle.includes('node') || positionTitle.includes('back')) {
          criteria.push(
            { label: "Primary Tech Stack", validate: (val) => typeof val === 'string' && (val.toLowerCase().includes('node') || val.toLowerCase().includes('backend') || val.toLowerCase().includes('express') || val.toLowerCase().includes('prisma')) },
            { label: "Years of Experience", validate: (val) => Number(val) >= 3 }, // ব্যাকএন্ডে ৩+ বছর লাগবে
            { label: "Expected Salary (BDT)", validate: (val) => Number(val) <= 150000 },
            { label: "Notice Period (Days)", validate: (val) => Number(val) <= 15 } // আরজেন্ট জয়েনিং ১৫ দিন
          );
        } else {
          // অন্য যেকোনো সাধারণ পজিশনের জন্য জেনেরিক কন্ডিশন
          criteria.push(
            { label: "Years of Experience", validate: (val) => Number(val) >= 1 },
            { label: "Primary Tech Stack", validate: (val) => typeof val === 'string' && val.trim().length > 0 }
          );
        }

        // ৩. গ্লোবাল বা কমন অপশনাল অ্যাট্রিবিউট চেক (সব পজিশনের সিভিতে ডেটা থাকলে স্কোর বাড়বে)
        criteria.push(
          { label: "GitHub Profile URL", validate: (val) => typeof val === 'string' && val.includes('github.com') },
          { label: "LinkedIn Profile URL", validate: (val) => typeof val === 'string' && val.includes('linkedin.com') },
          { label: "Portfolio Website", validate: (val) => typeof val === 'string' && val.startsWith('http') },
          { label: "IELTS Band Score", validate: (val) => Number(val) >= 6.5 }, // গ্লোবাল ক্লায়েন্টদের জন্য ন্যূনতম ৬.৫ স্কোর
          { label: "Relocation Availability", validate: (val) => val === true || String(val).toLowerCase() === 'true' },
          { label: "Present Address", validate: (val) => typeof val === 'string' && val.trim().length > 0 },
          { label: "Permanent Address", validate: (val) => typeof val === 'string' && val.trim().length > 0 }
        );

        // =========================================================
        // ম্যাচ কাউন্ট এবং পার্সেন্টেজ হিসাব
        // =========================================================
        let matchedCount = 0;

        criteria.forEach(criterion => {
          const candidateValue = cvContent[criterion.label];
          // ভ্যালু যদি এক্সিস্ট করে এবং কন্ডিশন স্যাটিসফাই করে
          if (candidateValue !== undefined && candidateValue !== null && criterion.validate(candidateValue)) {
            matchedCount++;
          }
        });

        // পার্সেন্টেজ বের করা (যত বেশি ক্রাইটেরিয়া ম্যাচ করবে, পার্সেন্টেজ তত স্মুথলি বাড়বে)
        let matchScore = '0%';
        if (criteria.length > 0) {
          const scorePercentage = Math.round((matchedCount / criteria.length) * 100);
          matchScore = `${Math.min(scorePercentage, 100)}%`;
        }

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