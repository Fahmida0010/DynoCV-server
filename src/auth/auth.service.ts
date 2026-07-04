import { ConflictException, Injectable, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    try {
      const userExists = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });

      if (userExists) {
        throw new ConflictException('Email already registered');
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(dto.password, salt);

      // User and Profile Creation in a single transaction block
      const newUser = await this.prisma.user.create({
        data: {
          email: dto.email,
          password: hashedPassword,
          firstName: dto.firstName,
          lastName: dto.lastName,
          role: dto.role,
          provider: 'LOCAL',
          isVerified: false,
          profile: {
            create: {
              firstName: dto.firstName,
              lastName: dto.lastName,
              version: 1, // Seed initial optimistic locking state
            },
          },
        },
        include: {
          profile: true,
        },
      });

      const payload = { sub: newUser.id, email: newUser.email, role: newUser.role };
      const token = this.jwtService.sign(payload);

      const { password, ...userWithoutPassword } = newUser;
      return {
        access_token: token,
        user: userWithoutPassword,
      };
    } catch (error) {
      if (error instanceof ConflictException) throw error;
      console.error('Registration processing failed:', error);
      throw new InternalServerErrorException('Error creating account. Try again.');
    }
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: { profile: true },
    });

    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);

    const { password, ...userWithoutPassword } = user;
    return {
      access_token: token,
      user: userWithoutPassword,
    };
  }
}