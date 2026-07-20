import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; 
import { CreatePositionDto } from './create-position.dto';


@Injectable()
export class PositionsService {
  constructor(private prisma: PrismaService) {}


// 👇 এই নতুন কোডটি যোগ করুন
  async create(dto: CreatePositionDto) {
    const { title, description, attributeIds = []} = dto;

    return this.prisma.position.create({
      data: {
        title,
        description,
        isActive: true, 
        version: 1,
        // প্রিজমা নেস্টেড রাইটের মাধ্যমে টেমপ্লেট ফিল্ডে অ্যাট্রিবিউট কানেক্ট করা হচ্ছে
        templates: {
          create: attributeIds.map((attrId) => ({
            attribute: {
              connect: { id: attrId },
            },
          })),
        },
      },
      // অপশনাল: নতুন তৈরি হওয়া পজিশনটি টেমপ্লেটসহ রিটার্ন করবে
      include: {
        templates: {
          include: { attribute: true }
        }
      }
    });
  }


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


  async update(id: string, data: { title: string; description: string; isActive: boolean }) {
  return this.prisma.position.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description,
      isActive: data.isActive,
    },
  });
}

  async delete(id: string) {
    return this.prisma.position.delete({ where: { id } });
  }
}