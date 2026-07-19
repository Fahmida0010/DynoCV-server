import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; 

@Injectable()
export class PositionsService {
  constructor(private prisma: PrismaService) {}
async findAll() {
  return this.prisma.position.findMany({
    include: {
      _count: {
        select: { cvs: true, templates: true }
      },
      templates: {
        take: 1, 
        select: {
          attribute: {
            select: {
              label: true 
            }
          }
        }
      }
    }
  });
}
  async duplicate(id: string) {
    const original = await this.prisma.position.findUnique({ where: { id } });
    if (!original) throw new NotFoundException('Position not found');

    return this.prisma.position.create({
      data: {
        title: `${original.title} (Copy)`,
        description: original.description,
        isActive: false, 
        version: 1
      },
    });
  }

  async delete(id: string) {
    return this.prisma.position.delete({ where: { id } });
  }
}