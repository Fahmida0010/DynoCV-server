import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; 
import { CreatePositionDto } from './create-position.dto';

@Injectable()
export class PositionsService {
  constructor(private prisma: PrismaService) {}

  
  async create(dto: CreatePositionDto, userId: string) {
   if (!userId) {
    throw new BadRequestException('User is not authenticated. Cannot create position without a valid user.');
  }
    const { title, description, attributeIds = [] } = dto;

    
    return this.prisma.$transaction(async (tx) => {
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

    
      await tx.discussion.create({
        data: {
          positionId: position.id,
          userId: userId, 
          title: `${position.title} - Official Q&A Thread`,
          content: `Welcome to the official discussion space for ${position.title}. Candidates and recruiters can share questions and feedback here.`,
        },
      });

      return position;
    });
  }

  
  async findAll() {
    return this.prisma.position.findMany({
      include: {
        _count: {
          select: { cvs: true, templates: true }
        },
    
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


  async duplicate(id: string, userId: string) {
    return this.prisma.$transaction(async (tx) => {
      const original = await tx.position.findUnique({ 
        where: { id },
        include: { templates: true }
      });
      if (!original) throw new NotFoundException('Position not found');


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