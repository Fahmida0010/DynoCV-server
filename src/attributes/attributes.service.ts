import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { UpdateAttributeDto } from './dto/update-attribute.dto';


@Injectable()
export class AttributesService {
  constructor(private prisma: PrismaService) {}

  
  async findAll() {
    return this.prisma.attributeLibrary.findMany();
  }

// ➕ attributes.service.ts এর create মেথডটি এভাবে আপডেট করুন
async create(dto: CreateAttributeDto) {
  try {
    // 🛡️ সেফটি চেক: যদি label বা type না আসে
    if (!dto || !dto.label) {
      throw new BadRequestException('Label field is required and cannot be empty.');
    }

    const trimmedLabel = dto.label.trim();

    // ১. একই নামের লেবেল অলরেডি আছে কিনা চেক
    const existing = await this.prisma.attributeLibrary.findUnique({
      where: { label: trimmedLabel }
    });

    if (existing) {
      throw new BadRequestException('An attribute with this label already exists');
    }

    // ২. ডাটাবেজে সেভ করা
    return await this.prisma.attributeLibrary.create({
      data: {
        label: trimmedLabel,
        type: dto.type || 'TEXT',
        isBuiltIn: false,
      },
    });
  } catch (error: any) {
    if (error instanceof BadRequestException) throw error;
    console.error("Prisma Create Error:", error);
    throw new InternalServerErrorException('Database insert failed.');
  }
}

// 🔄 update মেথডেও সেফটি চেক যোগ করুন
async update(id: string, dto: UpdateAttributeDto) {
  try {
    const attribute = await this.prisma.attributeLibrary.findUnique({
      where: { id: id }, 
    });

    if (!attribute) {
      throw new NotFoundException(`Attribute with ID ${id} not found`);
    }

    if (attribute.isBuiltIn) {
      throw new BadRequestException('Built-in system attributes cannot be modified');
    }

    // 💡 যদি বডিতে label পাঠানো হয়, শুধুমাত্র তখনই trim() হবে
    let trimmedLabel = attribute.label;
    if (dto && dto.label) {
      trimmedLabel = dto.label.trim();
      
      if (trimmedLabel !== attribute.label) {
        const existingLabel = await this.prisma.attributeLibrary.findUnique({
          where: { label: trimmedLabel },
        });
        if (existingLabel) {
          throw new BadRequestException('An attribute with this label already exists');
        }
      }
    }

    return await this.prisma.attributeLibrary.update({
      where: { id: id },
      data: {
        label: trimmedLabel,
        type: dto.type || attribute.type,
      },
    });
  } catch (error) {
    if (error instanceof BadRequestException || error instanceof NotFoundException) throw error;
    console.error("Prisma Update Error:", error);
    throw new InternalServerErrorException('Database update failed.');
  }
}

  // DB থেকে আইডি অনুযায়ী ডিলিট করা
  async delete(id: string) {
    return this.prisma.attributeLibrary.delete({
      where: { id },
    });
  }
}