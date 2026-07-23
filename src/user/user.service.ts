import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // আপনার প্রিজমা সার্ভিস পাথ অনুযায়ী চেঞ্জ করবেন
import { Role } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        isBlocked: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateRole(id: string, role: Role) {
    try {
      return await this.prisma.user.update({
        where: { id },
        data: { role },
      });
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }

  async toggleBlock(id: string, isBlocked: boolean) {
    try {
      return await this.prisma.user.update({
        where: { id },
        data: { isBlocked },
      });
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }

  async deleteUser(id: string) {
    try {
      await this.prisma.user.delete({
        where: { id },
      });
      return { message: 'User deleted successfully' };
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }
}