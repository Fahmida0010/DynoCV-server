import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; 
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';

@Injectable()
export class CvService {
  constructor(private prisma: PrismaService) {}

  
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
        position: true,
      },
    });
  }

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

  async update(id: string, userId: string, updateCvDto: UpdateCvDto) {
    const cv = await this.findOne(id, userId);

    return this.prisma.cV.update({
      where: { id },
      data: {
        ...updateCvDto,
        version: {
          increment: 1, 
        },
      },
      include: {
        position: true,
      },
    });
  }

  
  async remove(id: string, userId: string) {
    await this.findOne(id, userId); 

    return this.prisma.cV.delete({
      where: { id },
    });
  }


  async getLatestCvs(limit: number = 3) {
    return this.prisma.cV.findMany({
      take: limit,
      orderBy: {
        createdAt: 'desc', 
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            photo: true, 
          },
        },
        position: {
          select: {
            title: true,
          },
        },
      },
    });
  }
}