import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          let token = null;
          if (request && request.cookies) {
            token = request.cookies['auth_token'];
            console.log('Token from cookie:', token ? 'found' : 'not found');
          }
          // Also try to get from Authorization header as fallback
          if (!token && request.headers && request.headers.authorization) {
            const parts = request.headers.authorization.split(' ');
            if (parts.length === 2 && parts[0] === 'Bearer') {
              token = parts[1];
              console.log('Token from header:', token ? 'found' : 'not found');
            }
          }
          console.log('Final token:', token ? 'found' : 'not found');
          return token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'default-secret',
    });
  }

  async validate(payload: any) {
    console.log('JWT Payload:', payload);
    const user = await this.usersService.findById(payload.sub);
    console.log('User found:', user ? 'yes' : 'no');
    if (!user) {
      throw new UnauthorizedException();
    }
    return { id: user._id.toString(), email: user.email, role: user.role };
  }
}
