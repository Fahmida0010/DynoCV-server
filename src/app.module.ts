import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { PositionsController } from './positions/positions.controller';
import { PositionsService } from './positions/positions.service';
import { AttributesController } from './attributes/attributes.controller';
import { AttributesService } from './attributes/attributes.service';
import { CvController } from './cv/cv.controller';
import { CvService } from './cv/cv.service';
import { CvModule } from './cv/cv.module';
import { CommentsController } from './comments/comments.controller';
import { CommentsService } from './comments/comments.service';
import { CommentsModule } from './comments/comments.module';
import { CandidateController } from './candidate/candidate.controller';
import { CandidateService } from './candidate/candidate.service';


@Module({

  imports: [

    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule, AuthModule,CvModule ,CommentsModule], 

    
  controllers: [AppController, PositionsController,AttributesController, CvController, CommentsController,CandidateController],
  providers: [AppService,PositionsService,AttributesService ,CvService,CommentsService, CandidateService],
})
export class AppModule {}