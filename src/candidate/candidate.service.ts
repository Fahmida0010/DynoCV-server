import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { SyncAttributeDto } from './dto/sync-attribute.dto';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CandidateService {
  constructor(private prisma: PrismaService) {}

  // ১. ইউজারের সমস্ত অ্যাট্রিবিউটস রিলেশনসহ তুলে আনা
  async getAttributes(userId: string) {
    return this.prisma.userAttribute.findMany({
      where: { userId },
      include: {
        attribute: {
          select: {
            label: true,
            type: true,
          },
        },
      },
    });
  }


  // নতুন অ্যাট্রিবিউট ক্রিয়েট ও ম্যাপ করার লজিক
  async createAttribute(userId: string, dto: CreateAttributeDto) {
    const { label, type, value } = dto;

    // 🟢 ফিক্স: আপনার স্কিমা অনুযায়ী attributeLibrary ব্যবহার করা হয়েছে
    let attribute = await this.prisma.attributeLibrary.findFirst({
      where: { label: { equals: label, mode: 'insensitive' } }
    });

    // ২. যদি না থাকে, নতুন গ্লোবাল মাস্টার অ্যাট্রিবিউট বানাবো
    if (!attribute) {
      attribute = await this.prisma.attributeLibrary.create({
        data: { label, type }
      });
    }

    // ৩. চেক করি ইউজারের এই আইডি অলরেডি ম্যাপ করা আছে কিনা
    const existingUserAttr = await this.prisma.userAttribute.findUnique({
      where: {
        userId_attributeId: { userId, attributeId: attribute.id }
      }
    });

    if (existingUserAttr) {
      throw new ConflictException('This attribute already exists in your library.');
    }

    // ৪. ইউজার টেবিলে ডাটা ম্যাপ করা
    return this.prisma.userAttribute.create({
      data: {
        userId,
        attributeId: attribute.id,
        value,
        version: 1
      },
      include: {
        attribute: true
      }
    });
  }

  // ২. অপ্টিমিস্টিক লকিং এর মাধ্যমে অটোসেভ ও ভার্সন কন্ট্রোল করা
  async syncAttribute(userId: string, dto: SyncAttributeDto) {
    const { attributeId, value, version } = dto;

    // ডাটাবেজে এক্সিস্টিং রেকর্ডটি খুঁজে বের করা
    const currentRecord = await this.prisma.userAttribute.findUnique({
      where: {
        userId_attributeId: { userId, attributeId },
      },
    });

    if (!currentRecord) {
      throw new NotFoundException('Attribute record not found for this user.');
    }

    // 🔒 Optimistic Locking Check
    if (currentRecord.version !== version) {
      throw new ConflictException(
        'Conflict detected! This attribute has been updated by another session.',
      );
    }

    const nextVersion = currentRecord.version + 1;

    const updatedRecord = await this.prisma.userAttribute.update({
      where: {
        userId_attributeId: { userId, attributeId },
      },
      data: {
        value: value,
        version: nextVersion,
      },
    });

    return {
      success: true,
      version: updatedRecord.version,
    };
  }
}