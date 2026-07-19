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


@Module({

  imports: [

    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule, AuthModule], 

    
  controllers: [AppController, PositionsController,AttributesController],
  providers: [AppService,PositionsService,AttributesService],
})
export class AppModule {}