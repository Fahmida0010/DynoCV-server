import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // আপনার প্রিসমা সার্ভিসের পাথ
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';

@Injectable()
export class CvService {
  constructor(private prisma: PrismaService) {}

  // ১. নতুন CV তৈরি করা (Unique constraint: userId + positionId)
  async create(userId: string, createCvDto: CreateCvDto) {
    const existingCv = await this.prisma.cV.findUnique({
      where: {
        userId_positionId: {
          userId,
          positionId: createCvDto.positionId,
        },
      },
    });

    if (existingCv) {
      throw new ConflictException('You already have a CV tailored for this position.');
    }

    return this.prisma.cV.create({
      data: {
        userId,
        positionId: createCvDto.positionId,
        content: createCvDto.content,
      },
      include: {
        position: true, // ফ্রন্টএন্ডের জন্য পজিশন ডেটা যুক্ত করা হলো
      },
    });
  }

  // ২. লগইন করা ইউজারের সব CV গেট করা (যা ফ্রন্টএন্ডে টেবিলে ম্যাপ হবে)
  async findAllByUser(userId: string) {
    return this.prisma.cV.findMany({
      where: { userId },
      include: {
        position: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }

  // ৩. নির্দিষ্ট একটি CV আইডি দিয়ে ডিটেইলস গেট করা
  async findOne(id: string, userId: string) {
    const cv = await this.prisma.cV.findFirst({
      where: { id, userId },
      include: {
        position: true,
      },
    });

    if (!cv) {
      throw new NotFoundException(`CV with ID ${id} not found.`);
    }
    return cv;
  }

  // ৪. CV আপডেট করা (Optimistic Locking / version কন্ট্রোল সহ)
  async update(id: string, userId: string, updateCvDto: UpdateCvDto) {
    const cv = await this.findOne(id, userId);

    return this.prisma.cV.update({
      where: { id },
      data: {
        ...updateCvDto,
        version: {
          increment: 1, // প্রতি আপডেটে ভার্সন অটো ১ বাড়বে v1 -> v2
        },
      },
      include: {
        position: true,
      },
    });
  }

  // ৫. CV ডিলিট করা
  async remove(id: string, userId: string) {
    await this.findOne(id, userId); // আগে চেক করা CV-টি ওই ইউজারের কি না

    return this.prisma.cV.delete({
      where: { id },
    });
  }
}