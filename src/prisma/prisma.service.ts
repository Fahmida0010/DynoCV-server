import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect(); // সার্ভার চালু হওয়ার সময় ডেটাবেজ কানেক্ট করবে
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}