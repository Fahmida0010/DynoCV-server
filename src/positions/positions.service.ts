import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; 
import { CreatePositionDto } from './create-position.dto';

@Injectable()
export class PositionsService {
  constructor(private prisma: PrismaService) {}

  // 1. নতুন Position এবং তার সাথে Discussion Thread তৈরি করা
  async create(dto: CreatePositionDto, userId: string) {
   if (!userId) {
    throw new BadRequestException('User is not authenticated. Cannot create position without a valid user.');
  }
    const { title, description, attributeIds = [] } = dto;

    // ডাটাবেজ ট্রানজেকশন ব্যবহার করা হয়েছে যেন পজিশন বা ডিসকাশন যেকোনো একটি ফেইল করলে রোলব্যাক হয়
    return this.prisma.$transaction(async (tx) => {
      // পজিশন তৈরি
      const position = await tx.position.create({
        data: {
          title,
          description,
          isActive: true, 
          version: 1,
          templates: {
            create: attributeIds.map((attrId) => ({
              attribute: {
                connect: { id: attrId },
              },
            })),
          },
        },
        include: {
          templates: {
            include: { attribute: true }
          }
        }
      });

      // পজিশনের আন্ডারে অটোমেটিক Discussion Thread তৈরি
      await tx.discussion.create({
        data: {
          positionId: position.id,
          userId: userId, // যে রিক্রুটার পজিশন ক্রিয়েট করেছেন তার ID
          title: `${position.title} - Official Q&A Thread`,
          content: `Welcome to the official discussion space for ${position.title}. Candidates and recruiters can share questions and feedback here.`,
        },
      });

      return position;
    });
  }

  // 2. সব পজিশন গেট করার সময় discussion id ইনক্লুড করা (ফ্রন্টএন্ডের সুবিধার জন্য)
  async findAll() {
    return this.prisma.position.findMany({
      include: {
        _count: {
          select: { cvs: true, templates: true }
        },
        // ফ্রন্টএন্ড ড্যাশবোর্ডে সরাসরি discussionId পাঠানোর জন্য
        discussions: {
          select: {
            id: true
          }
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

  // 3. পজিশন ডুপ্লিকেট করার সময় নতুন Discussion Thread তৈরি করা
  async duplicate(id: string, userId: string) {
    return this.prisma.$transaction(async (tx) => {
      // মূল পজিশনটি টেমপ্লেটসহ খুঁজে বের করা
      const original = await tx.position.findUnique({ 
        where: { id },
        include: { templates: true }
      });
      if (!original) throw new NotFoundException('Position not found');

      // নতুন ডুপ্লিকেট পজিশন এবং তার টেমপ্লেট ফিল্ড তৈরি
      const duplicatedPosition = await tx.position.create({
        data: {
          title: `${original.title} (Copy)`,
          description: original.description,
          isActive: false, 
          version: 1,
          templates: {
            create: original.templates.map((tpl) => ({
              attributeId: tpl.attributeId
            }))
          }
        },
      });

      // ডুপ্লিকেট পজিশনের জন্য আলাদা একটি ফ্রেশ Discussion Thread তৈরি
      await tx.discussion.create({
        data: {
          positionId: duplicatedPosition.id,
          userId: userId,
          title: `${duplicatedPosition.title} - Official Q&A Thread`,
          content: `Welcome to the official discussion space for ${duplicatedPosition.title}.`,
        },
      });

      return duplicatedPosition;
    });
  }

  // 4. পজিশন আপডেট করা (ডিসকাশন চেঞ্জ করার প্রয়োজন নেই)
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

  

  // 5. পজিশন ডিলিট করা (Cascade onDelete এর কারণে ডিসকাশন ও কমেন্ট অটো ডিলিট হবে)
  async delete(id: string) {
    return this.prisma.position.delete({ where: { id } });
  }
}