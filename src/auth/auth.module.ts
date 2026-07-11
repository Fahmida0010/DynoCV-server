import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PrismaModule } from '../prisma/prisma.module'; 
import { Module } from '@nestjs/common';
import { GoogleStrategy } from './strategies/google.strategy';
import { FacebookStrategy } from './strategies/facebook.strategy';

@Module({
  imports: [
    PrismaModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dynocv26',
      signOptions: {
       expiresIn:'7d' 
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy,GoogleStrategy, FacebookStrategy],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}