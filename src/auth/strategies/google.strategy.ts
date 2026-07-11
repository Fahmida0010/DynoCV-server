import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({

      clientID: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackURL: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/google/callback`,
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    const { name, emails, photos, _json } = profile;
    
    // সরাসরি name অবজেক্টে ডেটা না থাকলে গুগলের কাঁচা (_json) ডেটা থেকে ব্যাকআপ নেবে
    const firstName = name?.givenName || _json?.given_name || '';
    const lastName = name?.familyName || _json?.family_name || '';

    const user = {
      email: emails && emails[0] ? emails[0].value : _json?.email,
      firstName: firstName,
      lastName: lastName,
      photo: photos && photos[0] ? photos[0].value : _json?.picture || null,
      provider: 'GOOGLE',
    };
    
    done(null, user);
  }
}