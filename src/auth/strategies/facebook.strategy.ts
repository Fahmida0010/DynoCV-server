import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-facebook';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor() {
    super({
      // আপনার .env ফাইলের সাথে হুবহু মিল আছে
      clientID: process.env.FACEBOOK_CLIENT_ID || '', 
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || '',
      callbackURL: `${process.env.VITE_API_URL}/api/auth/facebook/callback`,
      profileFields: ['id', 'name', 'emails', 'photos'],
      scope: ['email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: any): Promise<any> {
    const { id, name, emails, photos, _json } = profile;

    const firstName = name?.givenName || _json?.first_name || '';
    const lastName = name?.familyName || _json?.last_name || '';

    const user = {
      email: emails && emails[0] ? emails[0].value : `${id}@facebook.com`, 
      firstName: firstName,
      lastName: lastName,
      photo: photos && photos[0] ? photos[0].value : null,
      provider: 'FACEBOOK',
    };
    
    done(null, user);
  }
}