import { Module } from '@nestjs/common';
import { CvService } from './cv.service';
import { CvController } from './cv.controller';
import { PrismaModule } from '../prisma/prisma.module'; // আপনার প্রিসমা মডিউলের পাথ

@Module({
  imports: [PrismaModule],
  controllers: [CvController],
  providers: [CvService],
  exports: [CvService]
})
export class CvModule {}