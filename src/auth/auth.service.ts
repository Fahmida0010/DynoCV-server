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

  // নতুন মেথড
  async findOneByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email: email,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true, // এটি ফ্রন্টএন্ডের জন্য সবচেয়ে গুরুত্বপূর্ণ
      },
    });
  }

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

      // নেস্টেড কোয়েরির বদলে সহজভাবে ট্রানজেকশন হ্যান্ডেল করুন
      const [newUser, newProfile] = await this.prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: {
            email: dto.email,
            password: hashedPassword,
            firstName: dto.firstName,
            lastName: dto.lastName,
            role: dto.role,
            provider: 'LOCAL',
            isVerified: false,
          },
        });

        const profile = await tx.profile.create({
          data: {
            userId: user.id,
            firstName: dto.firstName,
            lastName: dto.lastName,
            version: 1,
          },
        });

        return [user, profile];
      });

      // জেনারেট প্রসেসটি এসিঙ্ক করুন যাতে জেডাব্লিউটি ব্লক না করে
      const payload = { sub: newUser.id, email: newUser.email, role: newUser.role };
      const token = await this.jwtService.signAsync(payload);

      const { password, ...userWithoutPassword } = newUser;
      
      return {
        access_token: token,
        user: {
          ...userWithoutPassword,
          profile: newProfile,
        },
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
    const token = await this.jwtService.signAsync(payload); // signAsync ব্যবহার করুন

    const { password, ...userWithoutPassword } = user;
    return {
      access_token: token,
      user: userWithoutPassword,
    };
  }
  
async getUserByEmail(email: string) {
  return this.prisma.user.findUnique({
    where: {
      email,
    },
  });
}

async validateSocialUser(socialUser: any) {
    try {
      // ১. ডাটাবেজে এই ইমেইলের ইউজার আছে কিনা চেক করা
      let user = await this.prisma.user.findUnique({
        where: { email: socialUser.email },
        include: { profile: true }, // প্রোফাইলসহ ইনক্লুড করে নেওয়া নিরাপদ
      });

      // ২. যদি ইউজার না থাকে, তবে নতুন সোশ্যাল ইউজার তৈরি ও তার প্রোফাইল একসাথে ক্রিয়েট হবে
      if (!user) {
        user = await this.prisma.user.create({
          data: {
            email: socialUser.email,
            firstName: socialUser.firstName,
            lastName: socialUser.lastName,
            photo: socialUser.photo,
            role: 'CANDIDATE', // ডিফল্ট রোল
            provider: socialUser.provider, // এখানে স্বয়ংক্রিয়ভাবে GOOGLE অথবা FACEBOOK বসবে
            isVerified: true, // সোশ্যাল লগইনে ইমেইল অলরেডি ভেরিফাইড থাকে
            profile: {
              create: {
                firstName: socialUser.firstName,
                lastName: socialUser.lastName,
                photoUrl: socialUser.photo,
                version: 1,
              },
            },
          },
          include: { profile: true },
        });
      } else {
        // ৩. (ঐচ্ছিক) ইউজার যদি আগে অন্য প্রোভাইডার (যেমন LOCAL) দিয়ে অ্যাকাউন্ট খুলে থাকে, 
        // তাহলে তার প্রোভাইডার আপডেট করতে চাইলে করতে পারেন। তবে সিকিউরিটির জন্য এটা এভাবেই রাখা ভালো।
      }

      // ৪. ইউজারের জন্য JWT access_token তৈরি (এখানে অবশই await সহ signAsync ব্যবহার করা ভালো)
      const payload = { sub: user.id, email: user.email, role: user.role };
      const token = await this.jwtService.signAsync(payload);

      return { 
        access_token: token,
        user 
      };
    } catch (error) {
      console.error('Social Login Error:', error);
      // কোনো কারণে ডাটাবেজ ক্র্যাশ করলে যেন ব্রাউজার হ্যাং না হয়ে সরাসরি এরর দেয়
      throw new InternalServerErrorException('Social authentication failed');
    }
  }
}