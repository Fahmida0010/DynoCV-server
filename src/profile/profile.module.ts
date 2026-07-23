import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { PrismaModule } from '../prisma/prisma.module'; // আপনার প্রিসমা মডিউল পাথ

@Module({
  imports: [PrismaModule],
  controllers: [ProfileController],
  providers: [ProfileService],
  exports: [ProfileService], // যদি অন্য কোথাও প্রয়োজন হয়
})
export class ProfileModule {}