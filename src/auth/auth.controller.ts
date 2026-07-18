import { Controller, Post, Body, HttpCode, HttpStatus, Get, UseGuards, Req, Res, Request, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';



@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }


@Get('users/:email')
async getUserByEmail(@Param('email') email: string) {
  return this.authService.getUserByEmail(email);
}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {
    // এটি ইউজারকে গুগলের অফিশিয়াল সাইন-ইন পেজে নিয়ে যাবে
  }

  //গুগল লগইন শেষে এই রাউটে ব্যাক করবে
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
   
    const result = await this.authService.validateSocialUser(req.user);
    
    
    const frontendUrl = process.env.CLIENT_URL || 'http://localhost:5173';
      // return res.redirect(`${frontendUrl}/dashboard/profile`);

      const userString = encodeURIComponent(JSON.stringify(result.user));
      return res.redirect(
      `${frontendUrl}/oauth-success?token=${result.access_token}&user=${userString}`
    );

  }

  // facebook login
  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookAuth(@Req() req) {
    
  }

  @Get('facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  async facebookAuthRedirect(@Req() req, @Res() res: Response) {
    
    const result = await this.authService.validateSocialUser(req.user);
    
    const frontendUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    // return res.redirect(`${frontendUrl}/dashboard/profile`);

    const userString = encodeURIComponent(JSON.stringify(result.user));
    return res.redirect(
      `${frontendUrl}/oauth-success?token=${result.access_token}&user=${userString}`
    );
  }
}
